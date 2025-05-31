from langchain_community.tools import DuckDuckGoSearchRun
from typing import Optional, List
from config import Config

class SearchTools:
    """Handle web search operations for agricultural intelligence"""
    
    def __init__(self):
        try:
            self.search_tool = DuckDuckGoSearchRun()
            print("✓ Herramienta de búsqueda web inicializada")
            self.available = True
        except Exception as e:
            print(f"⚠ Warning: Could not initialize search tool: {e}")
            self.search_tool = None
            self.available = False
    
    def is_available(self) -> bool:
        """Check if search tools are available"""
        return self.available
    
    def search(self, query: str) -> str:
        """Perform a web search"""
        if not self.available:
            return f"❌ Búsqueda web no disponible para: {query}"
        
        try:
            print(f"🔍 Buscando en web: {query}")
            results = self.search_tool.run(query)
            return results
        except Exception as e:
            return f"❌ Error en búsqueda web: {str(e)}"
    
    def search_multiple_queries(self, queries: List[str]) -> List[str]:
        """Perform multiple searches and return combined results"""
        all_results = []
        for query in queries:
            print(f"🔍 Ejecutando búsqueda: {query}")
            try:
                result = self.search(query)
                all_results.append(result)
            except Exception as e:
                all_results.append(f"Error en búsqueda {query}: {str(e)}")
        return all_results
    
    def search_agricultural_news(self, topic: str, region: str = "Colombia") -> List[str]:
        """Search for specific agricultural news with predefined queries"""
        
        search_templates = {
            "inundaciones": [
                f"noticias inundaciones {region} cultivos perdidos hoy últimas 24 horas",
                f"alerta roja inundación {region} agricultura UNGRD enero 2025",
                f"evacuaciones agricultores {region} creciente río últimas noticias",
                f"emergencia inundación {region} hectáreas afectadas cultivos enero 2025",
                f"\"se espera inundación\" {region} agricultura próximos días"
            ],
            "fertilizantes": [
                f"\"precio fertilizante sube\" {region} enero 2025 noticias agricultores",
                f"\"aumento precio urea\" {region} importación fertilizante últimas noticias",
                f"\"escasez fertilizante\" {region} enero 2025 producción agrícola",
                f"\"se espera alza\" precio abono {region} próximas semanas 2025",
                f"inflación insumos agrícolas {region} fertilizante enero 2025 noticias"
            ],
            "sequia": [
                f"\"sequía severa\" {region} cultivos enero 2025 últimas noticias",
                f"\"escasez agua\" agricultura {region} embalses nivel crítico 2025",
                f"\"se declara emergencia\" sequía {region} agricultores enero 2025",
                f"\"prohibición riego\" {region} restricción agua agricultura noticias",
                f"\"pérdida cosecha\" sequía {region} enero 2025 hectáreas afectadas"
            ],
            "plagas": [
                f"\"brote plaga\" {region} cultivos enero 2025 ICA alerta fitosanitaria",
                f"\"nueva enfermedad\" plantas {region} enero 2025 agricultores noticias",
                f"\"invasion insectos\" {region} agricultura control urgente 2025",
                f"\"alerta roja\" plaga {region} ICA últimas 48 horas noticias",
                f"\"resistencia pesticida\" {region} enero 2025 manejo plagas noticias"
            ],
            "mercado": [
                f"\"precios agrícolas suben\" {region} enero 2025 mercado noticias",
                f"\"demanda internacional\" {region} exportación agrícola enero 2025",
                f"\"precio café cacao\" {region} enero 2025 mercado futuro noticias",
                f"\"escasez productos\" {region} agriculture mercado enero 2025",
                f"\"nuevos mercados\" exportación {region} agricultura enero 2025"
            ],
            "infraestructura": [
                f"\"cierre carretera\" {region} enero 2025 transporte agrícola noticias",
                f"\"bloqueo vías\" {region} productos agrícolas enero 2025 INVIAS",
                f"\"daño puente\" {region} agricultura transporte enero 2025 noticias",
                f"\"restricción vehicular\" {region} carga agrícola enero 2025",
                f"\"paro transportadores\" {region} productos agrícolas enero 2025"
            ]
        }
        
        queries = search_templates.get(topic.lower(), [f"{topic} {region} agricultura noticias enero 2025"])
        return self.search_multiple_queries(queries)
    
    def search_general_agricultural(self, query: str, region: str = "Colombia") -> str:
        """General agricultural search with region context"""
        enhanced_query = f"{query} {region} agricultura"
        return self.search(enhanced_query)
