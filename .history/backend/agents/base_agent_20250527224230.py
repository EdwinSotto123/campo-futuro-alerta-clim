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
        
        self.ibm_client = IBMCloudClient(api_key)
        self.search_tools = SearchTools()
        self.file_manager = FileManager()
        
        print(f"🤖 Agente '{agent_name}' inicializado ({self.agent_type})")
    
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
            formatted_prompt = prompt_template.format(data=data, agent_name=self.agent_name, **kwargs)
            response = self.ibm_client.chat(formatted_prompt, Config.AGRICULTURAL_SYSTEM_MESSAGE)
            return self.ibm_client.get_response_text(response)
        except Exception as e:
            return f"❌ Error en análisis IA: {str(e)}"
    
    def save_result(self, alert_type: str, content: str, region: str = "Colombia") -> str:
        """Save analysis result to consolidated file"""
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
