from typing import Dict, List, Any, Type
import importlib
import os
from base_agent import BaseAgent
from config import Config

class AgentManager:
    """Gestor para coordinar múltiples agentes agrícolas"""
    
    def __init__(self, default_region: str = None, default_language: str = None):
        self.agents: Dict[str, BaseAgent] = {}
        self.agent_results: List[Dict[str, Any]] = []
        
        # Set default configurations
        self.default_region = default_region or Config.DEFAULT_REGION
        self.default_language = default_language or Config.DEFAULT_LANGUAGE
        
        # Validate region if provided
        if default_region and default_region.lower() not in Config.AVAILABLE_REGIONS:
            print(f"⚠️ Advertencia: Región '{default_region}' no reconocida. Usando región por defecto.")
            self.default_region = Config.DEFAULT_REGION
        
        print(f"🎯 Gestor de Agentes Inicializado (Región: {self.default_region}, Idioma: {self.default_language})")
    
    def register_agent(self, agent: BaseAgent):
        """Registrar un nuevo agente"""
        # Configure agent with manager defaults if not already configured
        if hasattr(agent, 'configure_agent'):
            agent.configure_agent(region=self.default_region, language=self.default_language)
            
        self.agents[agent.agent_name] = agent
        print(f"✅ Agente registrado: {agent.agent_name}")
    
    def load_agent_from_module(self, module_name: str, class_name: str, *args, **kwargs):
        """Cargar agente dinámicamente desde módulo"""
        try:
            module = importlib.import_module(module_name)
            agent_class = getattr(module, class_name)
            agent = agent_class(*args, **kwargs)
            self.register_agent(agent)
            return agent
        except Exception as e:
            print(f"❌ Error cargando agente {class_name}: {e}")
            return None
    
    def list_agents(self) -> Dict[str, str]:
        """Listar todos los agentes registrados"""
        agent_info = {}
        for name, agent in self.agents.items():
            agent_info[name] = agent.get_agent_description()
        return agent_info
    
    def execute_agent(self, agent_name: str, **kwargs) -> Dict[str, Any]:
        """Ejecutar un agente específico"""
        if agent_name not in self.agents:
            return {"error": f"Agente {agent_name} no encontrado"}
        
        agent = self.agents[agent_name]
        
        # Apply any configuration changes if provided
        if hasattr(agent, 'configure_agent'):
            region = kwargs.pop('region', None) or self.default_region
            language = kwargs.pop('language', None) or self.default_language
            agent.configure_agent(region=region, language=language)
        
        # Validate components before execution
        if not agent.validate_components():
            return {"error": f"Validación falló para {agent_name}"}
        
        # Execute task
        result = agent.execute_task(**kwargs)
        self.agent_results.append(result)
        
        return result
    
    def execute_multiple_agents(self, agent_names: List[str], **shared_kwargs) -> List[Dict[str, Any]]:
        """Ejecutar múltiples agentes con parámetros compartidos"""
        results = []
        
        for agent_name in agent_names:
            print(f"\n🚀 Ejecutando agente: {agent_name}")
            result = self.execute_agent(agent_name, **shared_kwargs)
            results.append(result)
        
        return results
    
    def execute_all_agents(self, **shared_kwargs) -> List[Dict[str, Any]]:
        """Ejecutar todos los agentes registrados"""
        agent_names = list(self.agents.keys())
        return self.execute_multiple_agents(agent_names, **shared_kwargs)
    
    def get_agent_status(self) -> Dict[str, str]:
        """Obtener estado de todos los agentes"""
        status = {}
        for name, agent in self.agents.items():
            try:
                if agent.validate_components():
                    status[name] = "✅ Operativo"
                else:
                    status[name] = "⚠️ Con problemas"
            except Exception as e:
                status[name] = f"❌ Error: {str(e)}"
        
        return status
    
    def get_execution_summary(self) -> Dict[str, Any]:
        """Obtener resumen de ejecuciones"""
        total_executions = len(self.agent_results)
        successful = len([r for r in self.agent_results if r.get("status") == "completed"])
        failed = total_executions - successful
        
        return {
            "total_executions": total_executions,
            "successful": successful,
            "failed": failed,
            "success_rate": f"{(successful/total_executions)*100:.1f}%" if total_executions > 0 else "0%",
            "last_results": self.agent_results[-5:] if self.agent_results else []
        }
