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
    
    def execute_task(self, region: str = None, language: str = None, products: List[str] = None, **kwargs) -> Dict[str, Any]:
        """Execute market intelligence analysis with configurable region and language"""
        
        # Configure agent if parameters provided
        if region or language:
            self.configure_agent(region=region, language=language)
        
        print(f"\n📈 {self.agent_name}: Iniciando análisis de mercados para {self.region} en {self.language}")
        
        self.start_session(f"INTELIGENCIA DE MERCADOS - {self.region}")
        
        if products is None:
            # Default products can vary by region
            regional_products = {
                "Colombia": ["café", "cacao", "arroz", "maíz", "papa"],
                "México": ["maíz", "frijol", "café", "aguacate", "tomate"],
                "Argentina": ["soja", "trigo", "maíz", "carne", "leche"],
                "Brasil": ["soja", "café", "azúcar", "maíz", "algodón"],
                "Chile": ["uvas", "manzanas", "salmón", "vino", "cerezas"]
            }
            products = regional_products.get(self.region, ["café", "cereales", "frutas", "vegetales"])
        
        try:
            # Search for market news with regional context
            search_results = self.search_tools.search_agricultural_news("mercado", self.region)
            
            # Add specific product searches for the region
            for product in products:
                product_search = self.search_tools.search(f"precio {product} {self.region} mercado {Config.get_current_date_text(self.language)}")
                search_results.append(product_search)
            
            combined_data = "\n".join(search_results)
            
            # Analyze with specialized prompt including language and regional context
            market_prompt = """
            CONTEXTO TEMPORAL: {date_context}
            REGIÓN DE ANÁLISIS: {region}
            IDIOMA DE RESPUESTA: {language}
            PRODUCTOS ANALIZADOS: {products}

            Como agente especializado en inteligencia de mercados agrícolas, analiza la siguiente información sobre {region}:

            DATOS DE MERCADO:
            {data}

            Genera un reporte de inteligencia comercial que incluya:
            1. 💹 PRODUCTOS CON MAYOR POTENCIAL EN {region} (precios al alza, demanda creciente)
            2. 🌍 OPORTUNIDADES DE EXPORTACIÓN DESDE {region} (mercados internacionales, requisitos)
            3. 📊 ANÁLISIS DE PRECIOS POR PRODUCTO REGIONAL (tendencias, proyecciones específicas para {region})
            4. ⚠️ RIESGOS COMERCIALES IDENTIFICADOS EN {region} (volatilidad, competencia local)
            5. 🎯 RECOMENDACIONES ESTRATÉGICAS PARA {region} (acciones concretas para productores locales)
            6. 📅 CRONOGRAMA DE OPORTUNIDADES (cuándo actuar considerando estacionalidad de {region})

            IMPORTANTE: 
            - Enfócate en el período {date_context}
            - Considera las características específicas del mercado agrícola de {region}
            - Incluye números específicos, porcentajes y fechas cuando estén disponibles
            - Toda la respuesta debe estar en {language}
            """
            
            analysis = self.analyze_with_ai(
                combined_data, 
                market_prompt,
                products=", ".join(products)
            )
            
            # Save results with regional context
            save_result = self.save_result("INTELIGENCIA_MERCADOS", analysis)
            
            print(f"💾 {save_result}")
            
            return {
                "agent": self.agent_name,
                "task": "market_intelligence",
                "region": self.region,
                "language": self.language,
                "products_analyzed": products,
                "date_context": self.get_current_date_context(),
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
                "region": self.region,
                "language": self.language,
                "status": "error",
                "error": str(e)
            }
    
    def get_top_opportunities(self, limit: int = 3) -> str:
        """Quick identification of top market opportunities in configured region and language"""
        try:
            opportunity_search = self.search_tools.search(f"mejores precios agricultura {self.region} exportación oportunidades")
            
            opportunity_prompt = """
            REGIÓN: {region}
            FECHA: {date_context}
            
            Identifica las TOP {limit} OPORTUNIDADES COMERCIALES más prometedoras para agricultores en {region}:
            
            DATOS: {data}
            
            Para cada oportunidad incluye:
            - Producto específico relevante para {region}
            - Razón de la oportunidad en el contexto de {region}
            - Acción recomendada para agricultores de {region}
            - Ventana de tiempo considerando la estacionalidad de {region}
            
            Responde en {language}. Sé conciso y específico para el mercado de {region}.
            """
            
            opportunities = self.analyze_with_ai(opportunity_search, opportunity_prompt, limit=limit)
            return opportunities
            
        except Exception as e:
            return f"❌ Error identificando oportunidades: {str(e)}"
