from typing import Dict, List, Any, Type
import importlib
import os
from base_agent import BaseAgent
from config import Config
from datetime import datetime

class AgentManager:
    """Gestor para coordinar múltiples agentes agrícolas"""
    
    def __init__(self, default_region: str = "colombia"):
        self.agents: Dict[str, BaseAgent] = {}
        self.agent_results: List[Dict[str, Any]] = []
        self.default_region = default_region
        
        # Validate region
        if default_region.lower() not in Config.AVAILABLE_REGIONS:
            print(f"⚠️ Región '{default_region}' no encontrada. Usando 'colombia'")
            self.default_region = "colombia"
        
        region_name = Config.AVAILABLE_REGIONS[self.default_region.lower()]
        current_date = Config.get_spanish_datetime(datetime.now())
        
        print(f"🎯 Gestor de Agentes Inicializado")
        print(f"📍 Región por defecto: {region_name}")
        print(f"📅 Fecha de sesión: {current_date}")
    
    def set_region(self, region: str):
        """Cambiar región por defecto"""
        if region.lower() in Config.AVAILABLE_REGIONS:
            self.default_region = region.lower()
            region_name = Config.AVAILABLE_REGIONS[self.default_region]
            print(f"📍 Región cambiada a: {region_name}")
        else:
            print(f"❌ Región '{region}' no disponible")
            print(f"Regiones disponibles: {list(Config.AVAILABLE_REGIONS.keys())}")
    
    def register_agent(self, agent: BaseAgent):
        """Registrar un nuevo agente"""
        self.agents[agent.agent_name] = agent
        print(f"✅ Agente registrado: {agent.agent_name}")
    
    def load_agent_from_module(self, module_name: str, class_name: str, region: str = None, *args, **kwargs):
        """Cargar agente dinámicamente con región específica"""
        agent_region = region or self.default_region
        
        try:
            module = importlib.import_module(module_name)
            agent_class = getattr(module, class_name)
            agent = agent_class(region=agent_region, *args, **kwargs)
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
        current_date = Config.get_spanish_datetime(datetime.now())
        
        print(f"🚀 Ejecutando {agent_name} para {agent.region_name}")
        print(f"📅 Fecha de ejecución: {current_date}")
        
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
    
    def create_regional_summary_prompt(self) -> str:
        """Crear prompt resumen de la región"""
        current_date = Config.get_spanish_datetime(datetime.now())
        region_name = Config.AVAILABLE_REGIONS[self.default_region]
        
        summary = self.get_execution_summary()
        
        return f"""
RESUMEN EJECUTIVO REGIONAL - SISTEMA CAMPO FUTURO

Región de análisis: {region_name.upper()}
Fecha del reporte: {current_date}
Total de agentes ejecutados: {summary['total_executions']}
Tasa de éxito: {summary['success_rate']}

ESTADO OPERACIONAL:
{self._format_agent_status()}

RECOMENDACIÓN GENERAL:
[Basándose en todos los análisis realizados para {region_name}, proporcionar una recomendación integral para los agricultores de la región]

PRÓXIMAS ACCIONES:
[Lista de acciones prioritarias basadas en los hallazgos]

---
Generado por Sistema Multi-Agente Campo Futuro
Región: {region_name}
Fecha: {current_date}
"""
    
    def _format_agent_status(self) -> str:
        """Formatear estado de agentes para el prompt"""
        status = self.get_agent_status()
        formatted_status = []
        
        for agent_name, state in status.items():
            formatted_status.append(f"  • {agent_name}: {state}")
        
        return "\n".join(formatted_status)
