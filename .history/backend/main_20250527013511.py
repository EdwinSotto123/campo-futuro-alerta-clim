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
from pydantic import Field

class IBMGraniteLLM(LLM):
    """Custom LangChain LLM wrapper for IBM Granite"""
    
    granite_client: Any = Field(default=None, exclude=True)
    
    def __init__(self, granite_client, **kwargs):
        super().__init__(**kwargs)
        object.__setattr__(self, 'granite_client', granite_client)
    
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
        try:
            self.search_tool = DuckDuckGoSearchRun()
        except Exception as e:
            print(f"Warning: Could not initialize search tool: {e}")
            self.search_tool = None
        
        self.llm_wrapper = None
        self.agent = None
        
        # Initialize LLM wrapper and agent after the client is fully set up
        try:
            self.llm_wrapper = IBMGraniteLLM(self)
            self.agent = self._create_agent()
        except Exception as e:
            print(f"Warning: Could not initialize agent: {e}")
    
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
        if self.search_tool is None:
            print("Search tool not available, skipping agent creation")
            return None
            
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
        
        # Simplified template for better compatibility
        template = """Responde a la pregunta del usuario usando las herramientas disponibles cuando sea necesario.

Herramientas disponibles:
{tools}

Nombres de herramientas: {tool_names}

Pregunta: {input}
{agent_scratchpad}"""

        prompt = PromptTemplate.from_template(template)
        
        try:
            agent = create_react_agent(
                llm=self.llm_wrapper,
                tools=tools,
                prompt=prompt
            )
            return AgentExecutor(
                agent=agent, 
                tools=tools, 
                verbose=True, 
                max_iterations=2,
                handle_parsing_errors=True
            )
        except Exception as e:
            print(f"Error creating agent: {e}")
            return None
    
    def chat_with_web_access(self, user_message: str) -> str:
        """Chat with web search capabilities"""
        # Check if specific queries need direct tool access
        if "hora" in user_message.lower() and "dólar" in user_message.lower():
            # Handle combined time and dollar query directly
            time_info = self.get_current_time()
            dollar_info = self.search_dollar_price() if self.search_tool else "Búsqueda web no disponible"
            return f"{time_info}\n\n{dollar_info}"
        
        if self.agent is None:
            # Enhanced fallback with manual tool calls
            response_parts = []
            
            if "hora" in user_message.lower():
                response_parts.append(self.get_current_time())
            
            if "dólar" in user_message.lower() and self.search_tool:
                response_parts.append(self.search_dollar_price())
            
            if response_parts:
                return "\n\n".join(response_parts)
            else:
                return self.get_response_text(self.chat(user_message))
        
        try:
            result = self.agent.invoke({"input": user_message})
            return result.get("output", "No se pudo obtener respuesta del agente")
        except Exception as e:
            print(f"Error with agent: {e}")
            # Enhanced fallback
            if "hora" in user_message.lower():
                time_info = self.get_current_time()
                if "dólar" in user_message.lower() and self.search_tool:
                    dollar_info = self.search_dollar_price()
                    return f"{time_info}\n\n{dollar_info}"
                return time_info
            elif "dólar" in user_message.lower() and self.search_tool:
                return self.search_dollar_price()
            else:
                return self.get_response_text(self.chat(user_message))

def main():
    """Example usage of the IBM Granite client with web access"""
    print("IBM Granite Client with Web Access")
    print("=" * 50)
    
    # Check dependencies
    try:
        from langchain_community.tools import DuckDuckGoSearchRun
        print("✓ LangChain dependencies available")
    except ImportError as e:
        print(f"⚠ Missing dependencies: {e}")
        print("Install with: pip install langchain langchain-community duckduckgo-search")
    
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
            "¿Qué hora es?",
            "¿Cuál es el valor del dólar hoy en Colombia?",
            "DIME CUAL ES EL VALOR DE DOLAR Y QUE HORA ES"
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
        
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    main()
