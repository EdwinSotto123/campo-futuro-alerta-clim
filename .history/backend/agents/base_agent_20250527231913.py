from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ibm_client import IBMCloudClient
from search_tools import SearchTools
from file_manager import FileManager
from config import Config

class BaseAgent(ABC):
    """Base class for all agricultural intelligence agents"""
    
    def __init__(self, agent_name: str, api_key: Optional[str] = None):
        self.agent_name = agent_name
        self.agent_type = self.__class__.__name__
        
        # Default region and language configuration - CENTRADO EN PERÚ
        self.region = Config.DEFAULT_REGION  # Ahora será "Perú"
        self.language = Config.DEFAULT_LANGUAGE
        self.date_range_days = 7  # Default to 7-day lookback
        
        # Shared components - REUTILIZABLES
        self.ibm_client = IBMCloudClient(api_key)
        self.search_tools = SearchTools()
        self.file_manager = FileManager()
        
        print(f"🤖 Agente '{agent_name}' inicializado para {self.region} ({self.agent_type})")
    
    def configure_agent(self, region: str = None, language: str = None, date_range_days: int = None) -> None:
        """Configure agent with specific region, language and date range"""
        if region:
            self.region = region
            print(f"🌍 Región configurada: {self.region}")
            
        if language:
            self.language = language.upper()
            print(f"🗣️ Idioma configurado: {self.language}")
            
        if date_range_days:
            self.date_range_days = date_range_days
            print(f"📅 Rango temporal: {self.date_range_days} días")
    
    def get_current_date_context(self) -> str:
        """Get formatted date context based on agent configuration"""
        return Config.get_current_date_context(self.language, self.date_range_days)
    
    def validate_components(self) -> bool:
        """Validate that all components are working"""
        try:
            # Test IBM connection
            if not self.ibm_client.validate_connection():
                print(f"❌ {self.agent_name}: Fallo en conexión IBM")
                return False
            
            # Test search tools
            if not self.search_tools.is_available():
                print(f"⚠️ {self.agent_name}: Búsqueda web no disponible")
            
            print(f"✅ {self.agent_name}: Componentes validados")
            return True
        except Exception as e:
            print(f"❌ {self.agent_name}: Error validando componentes: {e}")
            return False
    
    def analyze_with_ai(self, data: str, prompt_template: str, **kwargs) -> str:
        """Use IBM Granite to analyze data with custom prompt"""
        try:
            # Add default parameters to the kwargs
            kwargs.setdefault("agent_name", self.agent_name)
            kwargs.setdefault("region", self.region)
            kwargs.setdefault("language", self.language)
            kwargs.setdefault("data", data)
            kwargs.setdefault("date_context", self.get_current_date_context())
            
            # Format the prompt with all parameters
            formatted_prompt = prompt_template.format(**kwargs)
            
            # Get language-specific system message
            system_message = Config.get_language_prompt(self.language)
            
            # Call IBM Granite
            response = self.ibm_client.chat(formatted_prompt, system_message)
            return self.ibm_client.get_response_text(response)
        except Exception as e:
            return f"❌ Error en análisis IA: {str(e)}"
    
    def save_result(self, alert_type: str, content: str, region: str = None) -> str:
        """Save analysis result to consolidated file"""
        if region is None:
            region = self.region
            
        full_alert_type = f"{self.agent_name}_{alert_type}"
        return self.file_manager.save_alert(full_alert_type, content, region)
    
    def start_session(self, session_description: str = None):
        """Start a new session for this agent"""
        session_name = session_description or f"SESIÓN {self.agent_name.upper()}"
        self.file_manager.add_session_header(session_name)
    
    @abstractmethod
    def execute_task(self, **kwargs) -> Dict[str, Any]:
        """Execute the specific task for this agent - DEBE IMPLEMENTARSE EN CADA AGENTE"""
        pass
    
    @abstractmethod
    def get_agent_description(self) -> str:
        """Get description of what this agent does - DEBE IMPLEMENTARSE EN CADA AGENTE"""
        pass
