import requests
import json
import os
from datetime import datetime, timedelta
from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.llms.base import LLM
from typing import Optional, List, Any
import re

class IBMGraniteLLM(LLM):
    """Custom LangChain LLM wrapper for IBM Granite"""
    
    def __init__(self, granite_client):
        super().__init__()
        self.granite_client = granite_client
    
    @property
    def _llm_type(self) -> str:
        return "ibm_granite"
    
    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        try:
            response = self.granite_client.chat(prompt)
            return self.granite_client.get_response_text(response)
        except Exception as e:
            return f"Error: {str(e)}"

class IBMGraniteClient:
    def __init__(self, api_key=None):
        self.url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29"
        # Use environment variable first, then fallback to provided key or hardcoded
        self.api_key = api_key or os.getenv('IBM_API_KEY') or "XM5KSplBu7IBmGG4FawY_ppqbLQvJr4tWvEDqNr_tLva"
        self.project_id = "a5b3058c-af2b-4a50-89e7-3dfca277b8c2"
        self.model_id = "ibm/granite-3-8b-instruct"
        self._access_token = None
        self._token_expires = None
        self.search_tool = DuckDuckGoSearchRun()
        self.llm_wrapper = IBMGraniteLLM(self)
        self.agent = self._create_agent()
    
    def get_access_token(self):
        """Get access token using IBM Cloud API key with caching"""
        # Check if we have a valid cached token
        if self._access_token and self._token_expires and datetime.now() < self._token_expires:
            return self._access_token
            
        token_url = "https://iam.cloud.ibm.com/identity/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": self.api_key
        }
        
        print(f"Requesting token with API key: {self.api_key[:20]}...")  # Debug info
        
        try:
            response = requests.post(token_url, headers=headers, data=data)
            if response.status_code != 200:
                error_details = response.json() if response.content else {"error": "No response content"}
                if "BXNIM0415E" in str(error_details):
                    raise Exception(f"API key not found. Please check your IBM Cloud API key. Error: {error_details}")
                else:
                    raise Exception(f"Failed to get access token (Status: {response.status_code}): {error_details}")
            
            token_data = response.json()
            self._access_token = token_data["access_token"]
            # Set token expiry (IBM tokens typically last 1 hour, we'll refresh 5 minutes early)
            expires_in = token_data.get("expires_in", 3600)
            self._token_expires = datetime.now() + timedelta(seconds=expires_in - 300)
            
            return self._access_token
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error while getting access token: {e}")
        except json.JSONDecodeError as e:
            raise Exception(f"Invalid JSON response while getting access token: {e}")
    
    def chat(self, user_message, system_message=None):
        """Send a chat message to IBM Granite model"""
        if system_message is None:
            system_message = "You are Granite, an AI language model developed by IBM in 2024. You are a cautious assistant. You carefully follow instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior."
        
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ]
        
        body = {
            "messages": messages,
            "project_id": self.project_id,
            "model_id": self.model_id,
            "frequency_penalty": 0,
            "max_tokens": 2000,
            "presence_penalty": 0,
            "temperature": 0,
            "top_p": 1
        }
        
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.get_access_token()}"
        }
        
        response = requests.post(self.url, headers=headers, json=body)
        
        if response.status_code != 200:
            raise Exception(f"Non-200 response: {response.status_code} - {response.text}")
        
        data = response.json()
        return data
    
    def get_response_text(self, response_data):
        """Extract the text response from the API response"""
        try:
            return response_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            raise Exception(f"Failed to extract response text: {e}")

    def get_current_time(self, query: str = "") -> str:
        """Get current date and time"""
        now = datetime.now()
        return f"Fecha y hora actual: {now.strftime('%Y-%m-%d %H:%M:%S')} (UTC-5 Colombia)"
    
    def search_dollar_price(self, query: str = "") -> str:
        """Search for current USD/COP exchange rate"""
        try:
            search_query = "precio dolar colombia hoy TRM"
            results = self.search_tool.run(search_query)
            return f"Información sobre el precio del dólar: {results[:500]}..."
        except Exception as e:
            return f"Error buscando precio del dólar: {str(e)}"
    
    def web_search(self, query: str) -> str:
        """General web search"""
        try:
            results = self.search_tool.run(query)
            return f"Resultados de búsqueda para '{query}': {results[:800]}..."
        except Exception as e:
            return f"Error en búsqueda web: {str(e)}"
    
    def _create_agent(self):
        """Create LangChain agent with tools"""
        tools = [
            Tool(
                name="web_search",
                description="Busca información en internet sobre cualquier tema",
                func=self.web_search
            ),
            Tool(
                name="get_time",
                description="Obtiene la fecha y hora actual",
                func=self.get_current_time
            ),
            Tool(
                name="dollar_price",
                description="Busca el precio actual del dólar en Colombia (TRM)",
                func=self.search_dollar_price
            )
        ]
        
        # Template for ReAct agent
        template = """Eres un asistente inteligente que puede buscar información en tiempo real.
        Tienes acceso a las siguientes herramientas:

        {tools}

        Usa el siguiente formato:

        Question: la pregunta de entrada que debes responder
        Thought: siempre debes pensar sobre qué hacer
        Action: la acción a tomar, debe ser una de [{tool_names}]
        Action Input: la entrada para la acción
        Observation: el resultado de la acción
        ... (este proceso Thought/Action/Action Input/Observation puede repetirse)
        Thought: ahora conozco la respuesta final
        Final Answer: la respuesta final a la pregunta original

        Begin!

        Question: {input}
        Thought: {agent_scratchpad}"""

        prompt = PromptTemplate.from_template(template)
        
        try:
            agent = create_react_agent(
                llm=self.llm_wrapper,
                tools=tools,
                prompt=prompt
            )
            return AgentExecutor(agent=agent, tools=tools, verbose=True, max_iterations=3)
        except Exception as e:
            print(f"Error creating agent: {e}")
            return None
    
    def chat_with_web_access(self, user_message: str) -> str:
        """Chat with web search capabilities"""
        if self.agent is None:
            # Fallback to regular chat if agent creation failed
            return self.get_response_text(self.chat(user_message))
        
        try:
            result = self.agent.invoke({"input": user_message})
            return result.get("output", "No se pudo obtener respuesta del agente")
        except Exception as e:
            print(f"Error with agent: {e}")
            # Fallback to regular chat
            return self.get_response_text(self.chat(user_message))

def main():
    """Example usage of the IBM Granite client with web access"""
    print("IBM Granite Client with Web Access")
    print("=" * 50)
    
    # Check if API key is set via environment variable
    if os.getenv('IBM_API_KEY'):
        print("Using API key from environment variable")
    else:
        print("Using hardcoded API key - consider using environment variable IBM_API_KEY")
    
    client = IBMGraniteClient()
    
    try:
        # Test authentication first
        print("Testing authentication...")
        token = client.get_access_token()
        print(f"✓ Authentication successful! Token: {token[:20]}...")
        
        # Test web-enabled chat
        print("\nTesting web-enabled chat functionality...")
        
        test_queries = [
            "¿Cuál es el valor del dólar hoy en Colombia?",
            "¿Qué hora es?",
            "DIME CUAL ES EL VALOR DE DOLAR Y QUE HORA ES",
            "¿Cuál es el clima en Bogotá hoy?"
        ]
        
        for query in test_queries:
            print(f"\n" + "="*60)
            print(f"User: {query}")
            print("-" * 60)
            
            try:
                response = client.chat_with_web_access(query)
                print(f"Granite: {response}")
            except Exception as e:
                print(f"Error: {e}")
                # Try fallback
                fallback_response = client.get_response_text(client.chat(query))
                print(f"Fallback response: {fallback_response}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Install required packages: pip install langchain langchain-community duckduckgo-search")
        print("2. Verify your IBM Cloud API key is correct")
        print("3. Check internet connection for web search")

if __name__ == "__main__":
    main()
