from base_agent import BaseAgent
from typing import Dict, Any, List

class MarketIntelligenceAgent(BaseAgent):
    """Agente especializado en inteligencia de mercados agrícolas"""
    
    def __init__(self, api_key=None):
        super().__init__("INTELIGENCIA_MERCADOS", api_key)
        self.specialty = "Análisis de precios y tendencias de mercados agrícolas"
    
    def get_agent_description(self) -> str:
        return """
        📈 AGENTE INTELIGENCIA DE MERCADOS
        - Monitorea precios de productos agrícolas
        - Identifica oportunidades de exportación
        - Analiza tendencias de demanda
        - Recomienda estrategias comerciales
        """
    
    def execute_task(self, region: str = "Colombia", products: List[str] = None, **kwargs) -> Dict[str, Any]:
        """Execute market intelligence analysis"""
        print(f"\n📈 {self.agent_name}: Iniciando análisis de mercados para {region}")
        
        self.start_session(f"INTELIGENCIA DE MERCADOS - {region}")
        
        if products is None:
            products = ["café", "cacao", "arroz", "maíz", "papa"]
        
        try:
            # Search for market news
            search_results = self.search_tools.search_agricultural_news("mercado", region)
            
            # Add specific product searches
            for product in products:
                product_search = self.search_tools.search(f"precio {product} {region} mercado enero 2025")
                search_results.append(product_search)
            
            combined_data = "\n".join(search_results)
            
            # Analyze with specialized prompt
            market_prompt = """
            Como agente especializado en inteligencia de mercados agrícolas, analiza la siguiente información sobre {region}:

            DATOS DE MERCADO:
            {data}

            Genera un reporte de inteligencia comercial que incluya:
            1. 💹 PRODUCTOS CON MAYOR POTENCIAL (precios al alza, demanda creciente)
            2. 🌍 OPORTUNIDADES DE EXPORTACIÓN (mercados internacionales, requisitos)
            3. 📊 ANÁLISIS DE PRECIOS POR PRODUCTO (tendencias, proyecciones)
            4. ⚠️ RIESGOS COMERCIALES IDENTIFICADOS (volatilidad, competencia)
            5. 🎯 RECOMENDACIONES ESTRATÉGICAS (acciones concretas para productores)
            6. 📅 CRONOGRAMA DE OPORTUNIDADES (cuándo actuar)

            Incluye números específicos, porcentajes y fechas cuando estén disponibles.
            """
            
            analysis = self.analyze_with_ai(combined_data, market_prompt, region=region, products=", ".join(products))
            
            # Save results
            save_result = self.save_result("INTELIGENCIA_MERCADOS", analysis, region)
            
            print(f"💾 {save_result}")
            
            return {
                "agent": self.agent_name,
                "task": "market_intelligence",
                "region": region,
                "products_analyzed": products,
                "status": "completed",
                "analysis": analysis,
                "data_sources": len(search_results)
            }
            
        except Exception as e:
            error_msg = f"❌ Error en {self.agent_name}: {str(e)}"
            print(error_msg)
            return {
                "agent": self.agent_name,
                "task": "market_intelligence",
                "region": region,
                "status": "error",
                "error": str(e)
            }
    
    def get_top_opportunities(self, region: str = "Colombia", limit: int = 3) -> str:
        """Quick identification of top market opportunities"""
        try:
            opportunity_search = self.search_tools.search(f"mejores precios agricultura {region} exportación oportunidades")
            
            opportunity_prompt = """
            Identifica las TOP {limit} OPORTUNIDADES COMERCIALES más prometedoras para agricultores en {region}:
            
            DATOS: {data}
            
            Para cada oportunidad incluye:
            - Producto específico
            - Razón de la oportunidad  
            - Acción recomendada
            - Ventana de tiempo
            
            Sé conciso y específico.
            """
            
            opportunities = self.analyze_with_ai(opportunity_search, opportunity_prompt, region=region, limit=limit)
            return opportunities
            
        except Exception as e:
            return f"❌ Error identificando oportunidades: {str(e)}"
