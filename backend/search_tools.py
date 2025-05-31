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
    
    def search_agricultural_news(self, topic: str, region: str = "Perú") -> List[str]:
        """Search for specific agricultural news with predefined queries - GLOBAL COVERAGE"""
        
        # Normalizar el nombre de la región para búsquedas más efectivas
        region_normalized = self._normalize_region_name(region)
        
        search_templates = {
            "inundaciones": [
                f"flood alert agriculture {region_normalized} crops affected latest news",
                f"inundación agricultura {region_normalized} cultivos perdidos noticias recientes",
                f"\"emergency flood\" {region_normalized} agriculture evacuation news",
                f"\"alerta inundación\" {region_normalized} agricultura hectáreas afectadas",
                f"flooding forecast {region_normalized} agricultural impact prediction",
                f"\"se espera inundación\" {region_normalized} agricultura próximos días"
            ],
            
            "fertilizantes": [
                f"fertilizer price increase {region_normalized} agriculture news",
                f"\"precio fertilizante sube\" {region_normalized} agricultores noticias",
                f"\"fertilizer shortage\" {region_normalized} agricultural production impact",
                f"\"escasez fertilizante\" {region_normalized} producción agrícola",
                f"\"urea price\" {region_normalized} agriculture import cost",
                f"inflación insumos agrícolas {region_normalized} fertilizante"
            ],
            
            "sequia": [
                f"drought emergency {region_normalized} agriculture water crisis",
                f"\"sequía severa\" {region_normalized} cultivos agricultura",
                f"\"water shortage\" {region_normalized} irrigation agriculture restriction",
                f"\"escasez agua\" {region_normalized} agricultura riego prohibición",
                f"\"crop loss drought\" {region_normalized} agricultural emergency",
                f"\"pérdida cosecha sequía\" {region_normalized} hectáreas afectadas"
            ],
            
            "plagas": [
                f"pest outbreak {region_normalized} agriculture crop disease",
                f"\"brote plaga\" {region_normalized} cultivos agricultura fitosanitaria",
                f"\"new plant disease\" {region_normalized} agriculture pest control",
                f"\"nueva enfermedad plantas\" {region_normalized} agricultura",
                f"\"insect invasion\" {region_normalized} agriculture urgent control",
                f"\"resistencia pesticida\" {region_normalized} manejo plagas"
            ],
            
            "mercado": [
                f"agricultural prices rising {region_normalized} export market",
                f"\"precios agrícolas suben\" {region_normalized} mercado exportación",
                f"\"international demand\" {region_normalized} agricultural export opportunity",
                f"\"demanda internacional\" {region_normalized} exportación agrícola",
                f"commodity prices {region_normalized} agriculture market forecast",
                f"\"nuevos mercados\" exportación {region_normalized} agricultura"
            ],
            
            "infraestructura": [
                f"road closure {region_normalized} agricultural transport logistics",
                f"\"cierre carretera\" {region_normalized} transporte agrícola",
                f"\"infrastructure damage\" {region_normalized} agriculture supply chain",
                f"\"daño infraestructura\" {region_normalized} agricultura transporte",
                f"\"transport strike\" {region_normalized} agricultural products",
                f"\"paro transportadores\" {region_normalized} productos agrícolas"
            ],
            
            # ESPECÍFICO PARA PERÚ - búsquedas adicionales
            "clima_peru": [
                f"clima agricultura Perú sierra costa selva pronóstico",
                f"\"El Niño\" Perú agricultura impacto cultivos",
                f"\"La Niña\" Perú agricultura sequía inundación",
                f"SENAMHI Perú alerta agricultura clima",
                f"\"cambio climático\" Perú agricultura adaptación"
            ] if region_normalized.lower() in ["perú", "peru"] else [],
            
            "economia_peru": [
                f"precio productos agrícolas Perú mercado mayorista",
                f"exportación agrícola Perú estadísticas MINAGRI",
                f"\"agricultura peruana\" mercado internacional competitividad",
                f"\"sector agrario Perú\" inversión desarrollo",
                f"\"seguridad alimentaria\" Perú producción agrícola"
            ] if region_normalized.lower() in ["perú", "peru"] else []
        }
        
        # Obtener las consultas base
        base_queries = search_templates.get(topic.lower(), [])
        
        # Si es Perú, agregar búsquedas específicas adicionales
        if region_normalized.lower() in ["perú", "peru"]:
            if topic.lower() == "clima":
                base_queries.extend(search_templates.get("clima_peru", []))
            elif topic.lower() == "mercado":
                base_queries.extend(search_templates.get("economia_peru", []))
        
        # Si no hay búsquedas específicas, crear búsqueda genérica global
        if not base_queries:
            base_queries = [
                f"{topic} agriculture {region_normalized} news latest",
                f"{topic} agricultura {region_normalized} noticias recientes",
                f"agricultural {topic} {region_normalized} impact forecast"
            ]
        
        return self.search_multiple_queries(base_queries)
    
    def _normalize_region_name(self, region: str) -> str:
        """Normalize region name for better search results"""
        
        # Diccionario de normalización para búsquedas más efectivas
        region_mappings = {
            "perú": "Peru",
            "peru": "Peru", 
            "colombia": "Colombia",
            "méxico": "Mexico",
            "mexico": "Mexico",
            "argentina": "Argentina",
            "brasil": "Brazil",
            "brazil": "Brazil",
            "chile": "Chile",
            "ecuador": "Ecuador",
            "bolivia": "Bolivia",
            "venezuela": "Venezuela",
            "estados unidos": "United States",
            "usa": "United States",
            "united states": "United States",
            "canadá": "Canada",
            "canada": "Canada",
            "españa": "Spain",
            "spain": "Spain",
            "francia": "France",
            "france": "France",
            "italia": "Italy",
            "italy": "Italy",
            "alemania": "Germany",
            "germany": "Germany",
            "china": "China",
            "india": "India",
            "japón": "Japan",
            "japan": "Japan",
            "australia": "Australia"
        }
        
        region_lower = region.lower().strip()
        return region_mappings.get(region_lower, region.title())
    
    def search_peru_specific(self, topic: str) -> List[str]:
        """Búsquedas específicas para Perú - agricultura peruana"""
        
        peru_queries = {
            "general": [
                "agricultura Perú MINAGRI estadísticas producción",
                "sector agrario Perú desarrollo rural políticas",
                "\"agricultura familiar\" Perú pequeños productores",
                "\"seguridad alimentaria\" Perú producción nacional",
                "\"cadenas productivas\" agricultura Perú competitividad"
            ],
            
            "sierra": [
                "agricultura sierra Perú papa quinua cultivos andinos",
                "\"agricultura de montaña\" Perú adaptación clima",
                "\"cultivos nativos\" Perú sierra biodiversidad",
                "\"terrazas agrícolas\" Perú sierra conservación"
            ],
            
            "costa": [
                "agricultura costa Perú espárrago uva exportación",
                "\"agricultura tecnificada\" costa Perú riego",
                "\"valles costeros\" Perú producción agrícola",
                "\"agricultura de exportación\" costa Perú"
            ],
            
            "selva": [
                "agricultura selva Perú café cacao amazonia",
                "\"agricultura sostenible\" selva Perú bosques",
                "\"cultivos tropicales\" selva Perú biodiversidad",
                "\"agricultura familiar\" amazonia Perú"
            ]
        }
        
        queries = peru_queries.get(topic.lower(), peru_queries["general"])
        return self.search_multiple_queries(queries)
