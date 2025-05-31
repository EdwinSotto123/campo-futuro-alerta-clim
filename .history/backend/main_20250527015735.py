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
            print("✓ Herramienta de búsqueda web inicializada")
        except Exception as e:
            print(f"⚠ Warning: Could not initialize search tool: {e}")
            self.search_tool = None
        
        self.llm_wrapper = None
        self.agent = None
        
        # Simplify initialization - skip complex agent for now
        print("Sistema de herramientas directas activado")
    
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
            "max_tokens": 14000,
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
        """Get current date and time with source info"""
        now = datetime.now()
        time_str = now.strftime('%Y-%m-%d %H:%M:%S')
        return f"🕐 HORA ACTUAL: {time_str} (UTC-5 Colombia)\n📍 FUENTE: Sistema local del servidor"
    
    def search_dollar_price(self, query: str = "") -> str:
        """Search for current USD/COP exchange rate with source info"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible - herramienta no inicializada"
            
        try:
            search_query = "precio dolar colombia hoy TRM banco republica"
            print(f"🔍 Buscando en web: {search_query}")
            results = self.search_tool.run(search_query)
            
            # Extract more specific information
            return f"💰 PRECIO DEL DÓLAR:\n📊 {results[:600]}...\n📍 FUENTE: Búsqueda web en tiempo real (DuckDuckGo)"
        except Exception as e:
            return f"❌ Error buscando precio del dólar: {str(e)}\n📍 FUENTE: Error en búsqueda web"
    
    def web_search(self, query: str) -> str:
        """General web search with source info"""
        if not self.search_tool:
            return f"❌ Búsqueda web no disponible para: {query}"
            
        try:
            print(f"🔍 Buscando en web: {query}")
            results = self.search_tool.run(query)
            return f"🌐 RESULTADOS WEB para '{query}':\n{results[:800]}...\n📍 FUENTE: Búsqueda web en tiempo real (DuckDuckGo)"
        except Exception as e:
            return f"❌ Error en búsqueda web: {str(e)}"
    
    def chat_with_web_access(self, user_message: str) -> str:
        """Enhanced chat with direct tool access and clear sources"""
        
        print(f"\n🤖 PROCESANDO: {user_message}")
        print("=" * 60)
        
        # Always show time first as requested
        time_info = self.get_current_time()
        print(f"⏰ {time_info}")
        
        response_parts = [time_info]
        
        # Check for specific queries
        user_lower = user_message.lower()
        
        if any(word in user_lower for word in ["dólar", "dolar", "dollar", "usd", "trm"]):
            print("\n💰 Detectada consulta sobre dólar - iniciando búsqueda web...")
            dollar_info = self.search_dollar_price()
            response_parts.append(dollar_info)
            print(f"💰 {dollar_info[:100]}...")
        
        # Check for other web search needs
        if any(word in user_lower for word in ["clima", "weather", "noticias", "news"]):
            print("\n🌐 Detectada consulta general - iniciando búsqueda web...")
            search_results = self.web_search(user_message)
            response_parts.append(search_results)
            print(f"🌐 {search_results[:100]}...")
        
        # If no specific tools needed, use regular chat
        if len(response_parts) == 1:  # Only time was added
            print("\n💭 Usando respuesta regular del modelo Granite...")
            try:
                granite_response = self.get_response_text(self.chat(user_message))
                response_parts.append(f"🧠 RESPUESTA GRANITE:\n{granite_response}\n📍 FUENTE: Modelo IBM Granite (sin búsqueda web)")
            except Exception as e:
                response_parts.append(f"❌ Error en modelo Granite: {str(e)}")
        
        final_response = "\n\n" + "="*50 + "\n\n".join(response_parts)
        print(f"\n✅ RESPUESTA COMPLETA PREPARADA")
        return final_response
    
    def chat_simple(self, user_message: str) -> str:
        """Simple chat without web access for comparison"""
        try:
            response = self.get_response_text(self.chat(user_message))
            return f"🧠 GRANITE (sin web): {response}"
        except Exception as e:
            return f"❌ Error: {str(e)}"

def main():
    """Example usage of the IBM Granite client with web access"""
    print("🚀 IBM Granite Client with Web Access")
    print("=" * 70)
    
    # Check dependencies
    try:
        from langchain_community.tools import DuckDuckGoSearchRun
        print("✓ LangChain dependencies available")
    except ImportError as e:
        print(f"⚠ Missing dependencies: {e}")
        print("Install with: pip install langchain langchain-community duckduckgo-search")
    
    # Check if API key is set via environment variable
    if os.getenv('IBM_API_KEY'):
        print("✓ Using API key from environment variable")
    else:
        print("⚠ Using hardcoded API key - consider using environment variable IBM_API_KEY")
    
    client = IBMGraniteClient()
    
    try:
        # Test authentication first
        print("\n🔐 Testing authentication...")
        token = client.get_access_token()
        print(f"✅ Authentication successful! Token: {token[:20]}...")
        
        # Test web-enabled chat
        print("\n🧪 Testing web-enabled chat functionality...")
        
        test_queries = [
            "¿Qué hora es?",
            "¿Cuál es el valor del dólar hoy en Colombia?",
            "DIME CUAL ES EL VALOR DE DOLAR Y QUE HORA ES",
            "¿Cuál es el clima en Bogotá hoy?"
        ]
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n" + "🔥"*70)
            print(f"PRUEBA {i}: {query}")
            print("🔥" * 70)
            
            try:
                response = client.chat_with_web_access(query)
                print(f"\n📋 RESPUESTA FINAL:\n{response}")
            except Exception as e:
                print(f"❌ Error: {e}")
                
            # Add separator between tests
            if i < len(test_queries):
                input("\n⏳ Presiona ENTER para continuar con la siguiente prueba...")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
