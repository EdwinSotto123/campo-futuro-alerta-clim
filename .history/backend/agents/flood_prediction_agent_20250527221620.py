from base_agent import BaseAgent
from typing import Dict, Any

class FloodPredictionAgent(BaseAgent):
    """Agente especializado en predicciones de inundaciones agrícolas"""
    
    def __init__(self, region: str = "colombia", api_key=None):
        super().__init__("PREDICTOR_INUNDACIONES", region, api_key)
        self.specialty = f"Análisis de riesgo de inundaciones en zonas agrícolas de {self.region_name}"
    
    def get_agent_description(self) -> str:
        return """
        🌊 AGENTE PREDICTOR DE INUNDACIONES
        - Monitorea alertas de inundación
        - Evalúa riesgo para cultivos
        - Recomienda medidas preventivas
        - Analiza impacto en infraestructura agrícola
        """
    
    def execute_task(self, **kwargs) -> Dict[str, Any]:
        """Execute flood prediction analysis for configured region"""
        current_date = self.get_current_spanish_date()
        print(f"\n🌊 {self.agent_name}: Iniciando análisis de inundaciones para {self.region_name}")
        print(f"📅 Fecha de análisis: {current_date}")
        
        self.start_session(f"ANÁLISIS DE INUNDACIONES - {self.region_name} - {current_date}")
        
        try:
            # Search for flood-related news with region and date context
            search_date = self.get_search_date_context()
            search_results = self.search_tools.search_agricultural_news("inundaciones", self.region_name)
            
            # Add date-specific searches
            date_specific_searches = [
                f"inundaciones {self.region_name} {search_date} agricultura",
                f"alerta IDEAM {self.region_name} {search_date} lluvia",
                f"emergencia {self.region_name} {search_date} cultivos agua"
            ]
            
            for search_query in date_specific_searches:
                additional_result = self.search_tools.search(search_query)
                search_results.append(additional_result)
            
            combined_data = "\n".join(search_results)
            
            # Create specialized prompt
            analysis_prompt = self.create_analysis_prompt(
                combined_data, 
                "PREDICCIÓN DE INUNDACIONES",
                region=self.region_name,
                date=current_date
            )
            
            # Analyze with IBM Granite
            response = self.ibm_client.chat(analysis_prompt, Config.AGRICULTURAL_SYSTEM_MESSAGE)
            analysis = self.ibm_client.get_response_text(response)
            
            # Save results
            save_result = self.save_result("ANALISIS_INUNDACIONES", analysis, self.region_name)
            
            print(f"💾 {save_result}")
            
            return {
                "agent": self.agent_name,
                "task": "flood_prediction",
                "region": self.region_name,
                "analysis_date": current_date,
                "status": "completed",
                "analysis": analysis,
                "data_sources": len(search_results)
            }
            
        except Exception as e:
            error_msg = f"❌ Error en {self.agent_name}: {str(e)}"
            print(error_msg)
            return {
                "agent": self.agent_name,
                "task": "flood_prediction", 
                "region": self.region_name,
                "analysis_date": current_date,
                "status": "error",
                "error": str(e)
            }
    
    def get_risk_level(self) -> str:
        """Quick risk assessment for floods in configured region"""
        current_date = self.get_search_date_context()
        
        try:
            quick_search = self.search_tools.search(f"alerta inundación {self.region_name} {current_date} IDEAM")
            
            risk_prompt = f"""
            Fecha de análisis: {current_date}
            Región: {self.region_name}
            
            Basándote en esta información: {quick_search}
            
            Determina el NIVEL DE RIESGO de inundación para agricultura en {self.region_name}:
            
            RESPONDE EN FORMATO PROMPT:
            
            "NIVEL DE RIESGO DE INUNDACIÓN - {self.region_name.upper()}
            Fecha: {current_date}
            
            RIESGO: [BAJO/MEDIO/ALTO/CRÍTICO]
            
            JUSTIFICACIÓN:
            [Explicación basada en datos oficiales]
            
            RECOMENDACIÓN INMEDIATA:
            [Acción específica para agricultores]
            
            ---
            Generado por Predictor de Inundaciones Campo Futuro"
            """
            
            response = self.ibm_client.chat(risk_prompt, Config.AGRICULTURAL_SYSTEM_MESSAGE)
            return self.ibm_client.get_response_text(response)
            
        except Exception as e:
            return f"❌ Error evaluando riesgo: {str(e)}"
