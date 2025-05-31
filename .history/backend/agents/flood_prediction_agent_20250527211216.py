from base_agent import BaseAgent
from typing import Dict, Any

class FloodPredictionAgent(BaseAgent):
    """Agente especializado en predicciones de inundaciones agrícolas"""
    
    def __init__(self, api_key=None):
        super().__init__("PREDICTOR_INUNDACIONES", api_key)
        self.specialty = "Análisis de riesgo de inundaciones en zonas agrícolas"
    
    def get_agent_description(self) -> str:
        return """
        🌊 AGENTE PREDICTOR DE INUNDACIONES
        - Monitorea alertas de inundación
        - Evalúa riesgo para cultivos
        - Recomienda medidas preventivas
        - Analiza impacto en infraestructura agrícola
        """
    
    def execute_task(self, region: str = "Colombia", **kwargs) -> Dict[str, Any]:
        """Execute flood prediction analysis"""
        print(f"\n🌊 {self.agent_name}: Iniciando análisis de inundaciones para {region}")
        
        self.start_session(f"ANÁLISIS DE INUNDACIONES - {region}")
        
        try:
            # Search for flood-related news
            search_results = self.search_tools.search_agricultural_news("inundaciones", region)
            combined_data = "\n".join(search_results)
            
            # Analyze with specialized prompt
            flood_prompt = """
            Como agente especializado en predicciones de inundaciones agrícolas, analiza los siguientes datos sobre {region}:

            DATOS DE BÚSQUEDA:
            {data}

            Genera un reporte que incluya:
            1. 🚨 ALERTAS CRÍTICAS DE INUNDACIÓN (ubicaciones específicas, fechas, niveles de riesgo)
            2. 🌾 CULTIVOS EN RIESGO INMEDIATO (tipos de cultivos, hectáreas estimadas)
            3. 🏗️ INFRAESTRUCTURA AGRÍCOLA AMENAZADA (bodegas, canales, caminos rurales)
            4. ⚠️ PLAN DE ACCIÓN INMEDIATA (pasos específicos para agricultores)
            5. 📊 EVALUACIÓN DE PROBABILIDAD (porcentajes y cronograma)

            Enfócate en información accionable y específica para el sector agrícola.
            """
            
            analysis = self.analyze_with_ai(combined_data, flood_prompt, region=region)
            
            # Save results
            save_result = self.save_result("ANALISIS_INUNDACIONES", analysis, region)
            
            print(f"💾 {save_result}")
            
            return {
                "agent": self.agent_name,
                "task": "flood_prediction",
                "region": region,
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
                "region": region,
                "status": "error",
                "error": str(e)
            }
    
    def get_risk_level(self, region: str = "Colombia") -> str:
        """Quick risk assessment for floods"""
        try:
            quick_search = self.search_tools.search(f"alerta inundación {region} hoy IDEAM")
            
            risk_prompt = """
            Basándote en esta información: {data}
            
            Determina el NIVEL DE RIESGO de inundación para agricultura en {region}:
            - BAJO: Sin alertas oficiales
            - MEDIO: Alertas amarillas o condiciones de vigilancia  
            - ALTO: Alertas rojas o emergencia declarada
            - CRÍTICO: Evacuaciones en curso o inundaciones activas
            
            Responde solo con: RIESGO [NIVEL] - [Justificación breve]
            """
            
            risk_analysis = self.analyze_with_ai(quick_search, risk_prompt, region=region)
            return risk_analysis
            
        except Exception as e:
            return f"❌ Error evaluando riesgo: {str(e)}"
