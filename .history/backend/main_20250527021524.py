import requests
import json
import os
from datetime import datetime, timedelta
from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.llms.base import LLM
from typing import Optional, List, Any
import re
from pydantic import Field

class IBMGraniteLLM(LLM):
    """Custom LangChain LLM wrapper for IBM Granite"""
    
    granite_client: Any = Field(default=None, exclude=True)
    
    def __init__(self, granite_client, **kwargs):
        super().__init__(**kwargs)
        object.__setattr__(self, 'granite_client', granite_client)
    
    @property
    def _llm_type(self) -> str:
        return "ibm_granite"
    
    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        try:
            response = self.granite_client.chat(prompt)
            return self.granite_client.get_response_text(response)
        except Exception as e:
            return f"Error: {str(e)}"

class IBMGraniteClient:
    def __init__(self, api_key=None):
        self.url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29"
        # Use environment variable first, then fallback to provided key or hardcoded
        self.api_key = api_key or os.getenv('IBM_API_KEY') or "XM5KSplBu7IBmGG4FawY_ppqbLQvJr4tWvEDqNr_tLva"
        self.project_id = "a5b3058c-af2b-4a50-89e7-3dfca277b8c2"
        self.model_id = "ibm/granite-3-8b-instruct"
        self._access_token = None
        self._token_expires = None
        try:
            self.search_tool = DuckDuckGoSearchRun()
            print("✓ Herramienta de búsqueda web inicializada")
        except Exception as e:
            print(f"⚠ Warning: Could not initialize search tool: {e}")
            self.search_tool = None
        
        self.llm_wrapper = None
        self.agent = None
        
        # Simplify initialization - skip complex agent for now
        print("Sistema de herramientas directas activado")
        
        # Create alerts directory
        self.alerts_dir = os.path.join(os.path.dirname(__file__), "alertas_agricolas")
        os.makedirs(self.alerts_dir, exist_ok=True)
        print(f"📁 Directorio de alertas: {self.alerts_dir}")
    
    def get_access_token(self):
        """Get access token using IBM Cloud API key with caching"""
        # Check if we have a valid cached token
        if self._access_token and self._token_expires and datetime.now() < self._token_expires:
            return self._access_token
            
        token_url = "https://iam.cloud.ibm.com/identity/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": self.api_key
        }
        
        print(f"Requesting token with API key: {self.api_key[:20]}...")  # Debug info
        
        try:
            response = requests.post(token_url, headers=headers, data=data)
            if response.status_code != 200:
                error_details = response.json() if response.content else {"error": "No response content"}
                if "BXNIM0415E" in str(error_details):
                    raise Exception(f"API key not found. Please check your IBM Cloud API key. Error: {error_details}")
                else:
                    raise Exception(f"Failed to get access token (Status: {response.status_code}): {error_details}")
            
            token_data = response.json()
            self._access_token = token_data["access_token"]
            # Set token expiry (IBM tokens typically last 1 hour, we'll refresh 5 minutes early)
            expires_in = token_data.get("expires_in", 3600)
            self._token_expires = datetime.now() + timedelta(seconds=expires_in - 300)
            
            return self._access_token
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error while getting access token: {e}")
        except json.JSONDecodeError as e:
            raise Exception(f"Invalid JSON response while getting access token: {e}")
    
    def chat(self, user_message, system_message=None):
        """Send a chat message to IBM Granite model"""
        if system_message is None:
            system_message = "You are Granite, an AI language model developed by IBM in 2024. You are a cautious assistant. You carefully follow instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior."
        
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ]
        
        body = {
            "messages": messages,
            "project_id": self.project_id,
            "model_id": self.model_id,
            "frequency_penalty": 0,
            "max_tokens": 14000,
            "presence_penalty": 0,
            "temperature": 0,
            "top_p": 1
        }
        
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.get_access_token()}"
        }
        
        response = requests.post(self.url, headers=headers, json=body)
        
        if response.status_code != 200:
            raise Exception(f"Non-200 response: {response.status_code} - {response.text}")
        
        data = response.json()
        return data
    
    def get_response_text(self, response_data):
        """Extract the text response from the API response"""
        try:
            return response_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            raise Exception(f"Failed to extract response text: {e}")

    def get_current_time(self, query: str = "") -> str:
        """Get current date and time with source info"""
        now = datetime.now()
        time_str = now.strftime('%Y-%m-%d %H:%M:%S')
        return f"🕐 HORA ACTUAL: {time_str} (UTC-5 Colombia)\n📍 FUENTE: Sistema local del servidor"
    
    def search_dollar_price(self, query: str = "") -> str:
        """Search for current USD/COP exchange rate with source info"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible - herramienta no inicializada"
            
        try:
            search_query = "precio dolar colombia hoy TRM banco republica"
            print(f"🔍 Buscando en web: {search_query}")
            results = self.search_tool.run(search_query)
            
            # Extract more specific information
            return f"💰 PRECIO DEL DÓLAR:\n📊 {results[:600]}...\n📍 FUENTE: Búsqueda web en tiempo real (DuckDuckGo)"
        except Exception as e:
            return f"❌ Error buscando precio del dólar: {str(e)}\n📍 FUENTE: Error en búsqueda web"
    
    def web_search(self, query: str) -> str:
        """General web search with source info"""
        if not self.search_tool:
            return f"❌ Búsqueda web no disponible para: {query}"
            
        try:
            print(f"🔍 Buscando en web: {query}")
            results = self.search_tool.run(query)
            return f"🌐 RESULTADOS WEB para '{query}':\n{results[:800]}...\n📍 FUENTE: Búsqueda web en tiempo real (DuckDuckGo)"
        except Exception as e:
            return f"❌ Error en búsqueda web: {str(e)}"
    
    def chat_with_web_access(self, user_message: str) -> str:
        """Enhanced chat with direct tool access and clear sources"""
        
        print(f"\n🤖 PROCESANDO: {user_message}")
        print("=" * 60)
        
        # Always show time first as requested
        time_info = self.get_current_time()
        print(f"⏰ {time_info}")
        
        response_parts = [time_info]
        
        # Check for specific queries
        user_lower = user_message.lower()
        
        if any(word in user_lower for word in ["dólar", "dolar", "dollar", "usd", "trm"]):
            print("\n💰 Detectada consulta sobre dólar - iniciando búsqueda web...")
            dollar_info = self.search_dollar_price()
            response_parts.append(dollar_info)
            print(f"💰 {dollar_info[:100]}...")
        
        # Check for other web search needs
        if any(word in user_lower for word in ["clima", "weather", "noticias", "news"]):
            print("\n🌐 Detectada consulta general - iniciando búsqueda web...")
            search_results = self.web_search(user_message)
            response_parts.append(search_results)
            print(f"🌐 {search_results[:100]}...")
        
        # If no specific tools needed, use regular chat
        if len(response_parts) == 1:  # Only time was added
            print("\n💭 Usando respuesta regular del modelo Granite...")
            try:
                granite_response = self.get_response_text(self.chat(user_message))
                response_parts.append(f"🧠 RESPUESTA GRANITE:\n{granite_response}\n📍 FUENTE: Modelo IBM Granite (sin búsqueda web)")
            except Exception as e:
                response_parts.append(f"❌ Error en modelo Granite: {str(e)}")
        
        final_response = "\n\n" + "="*50 + "\n\n".join(response_parts)
        print(f"\n✅ RESPUESTA COMPLETA PREPARADA")
        return final_response
    
    def chat_simple(self, user_message: str) -> str:
        """Simple chat without web access for comparison"""
        try:
            response = self.get_response_text(self.chat(user_message))
            return f"🧠 GRANITE (sin web): {response}"
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    def search_road_closures(self, region: str = "Colombia") -> str:
        """Search for road closures affecting agricultural transport"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_query = f"cierre carreteras {region} transporte agricola hoy"
            print(f"🛣️ Buscando cierres de carreteras: {search_query}")
            results = self.search_tool.run(search_query)
            return f"🛣️ CIERRES DE CARRETERAS:\n{results[:800]}...\n📍 FUENTE: Búsqueda web en tiempo real"
        except Exception as e:
            return f"❌ Error buscando cierres de carreteras: {str(e)}"
    
    def search_fertilizer_prices(self, region: str = "Colombia") -> str:
        """Search for fertilizer and agricultural input prices"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_query = f"precio abono fertilizante agricola {region} hoy"
            print(f"💰 Buscando precios de abono: {search_query}")
            results = self.search_tool.run(search_query)
            return f"💰 PRECIOS DE ABONO/FERTILIZANTE:\n{results[:800]}...\n📍 FUENTE: Búsqueda web en tiempo real"
        except Exception as e:
            return f"❌ Error buscando precios de abono: {str(e)}"
    
    def search_flood_alerts(self, region: str = "Colombia") -> str:
        """Search for flood alerts and warnings"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_query = f"alerta inundacion {region} agricola IDEAM"
            print(f"🌊 Buscando alertas de inundación: {search_query}")
            results = self.search_tool.run(search_query)
            return f"🌊 ALERTAS DE INUNDACIÓN:\n{results[:800]}...\n📍 FUENTE: Búsqueda web en tiempo real"
        except Exception as e:
            return f"❌ Error buscando alertas de inundación: {str(e)}"
    
    def search_weather_alerts(self, region: str = "Colombia") -> str:
        """Search for weather alerts affecting agriculture"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_query = f"alerta climatica {region} agricultura IDEAM"
            print(f"🌤️ Buscando alertas climáticas: {search_query}")
            results = self.search_tool.run(search_query)
            return f"🌤️ ALERTAS CLIMÁTICAS:\n{results[:800]}...\n📍 FUENTE: Búsqueda web en tiempo real"
        except Exception as e:
            return f"❌ Error buscando alertas climáticas: {str(e)}"
    
    def search_crop_diseases(self, region: str = "Colombia") -> str:
        """Search for crop disease alerts and agricultural pests"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_query = f"plagas cultivos {region} ICA agricultura"
            print(f"🐛 Buscando alertas de plagas: {search_query}")
            results = self.search_tool.run(search_query)
            return f"🐛 ALERTAS DE PLAGAS Y ENFERMEDADES:\n{results[:800]}...\n📍 FUENTE: Búsqueda web en tiempo real"
        except Exception as e:
            return f"❌ Error buscando alertas de plagas: {str(e)}"
    
    def search_market_prices(self, region: str = "Colombia") -> str:
        """Search for agricultural product market prices"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_query = f"precios agricolas mercado {region} SIPSA"
            print(f"📈 Buscando precios de mercado: {search_query}")
            results = self.search_tool.run(search_query)
            return f"📈 PRECIOS DE MERCADO AGRÍCOLA:\n{results[:800]}...\n📍 FUENTE: Búsqueda web en tiempo real"
        except Exception as e:
            return f"❌ Error buscando precios de mercado: {str(e)}"
    
    def save_alert_to_file(self, alert_type: str, content: str, region: str = "Colombia") -> str:
        """Save alert information to a text file"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{alert_type}_{region}_{timestamp}.txt"
            filepath = os.path.join(self.alerts_dir, filename)
            
            header = f"""
=== ALERTA AGRÍCOLA CAMPO FUTURO ===
Tipo: {alert_type}
Región: {region}
Fecha y Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Archivo: {filename}
==================================

"""
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(header)
                f.write(content)
                f.write(f"\n\n=== FIN DEL REPORTE ===")
            
            return f"✅ Guardado en: {filepath}"
        except Exception as e:
            return f"❌ Error guardando archivo: {str(e)}"
    
    def agricultural_agent_scan(self, region: str = "Colombia") -> str:
        """Comprehensive agricultural scan - main function for the agricultural agent"""
        print(f"\n🌾 INICIANDO ESCANEO AGRÍCOLA COMPLETO PARA: {region}")
        print("=" * 80)
        
        # Always show time first
        time_info = self.get_current_time()
        print(f"⏰ {time_info}")
        
        all_alerts = []
        all_alerts.append(f"🌾 REPORTE AGRÍCOLA COMPLETO - {region}")
        all_alerts.append("=" * 60)
        all_alerts.append(time_info)
        all_alerts.append("=" * 60)
        
        # List of agricultural search functions
        agricultural_searches = [
            ("CLIMA", self.search_weather_alerts),
            ("INUNDACIONES", self.search_flood_alerts),
            ("CARRETERAS", self.search_road_closures),
            ("PRECIOS_ABONO", self.search_fertilizer_prices),
            ("PLAGAS", self.search_crop_diseases),
            ("MERCADO", self.search_market_prices)
        ]
        
        for alert_type, search_function in agricultural_searches:
            print(f"\n🔍 Ejecutando búsqueda: {alert_type}")
            try:
                result = search_function(region)
                all_alerts.append(f"\n{result}")
                
                # Save individual alert to file
                save_result = self.save_alert_to_file(alert_type, result, region)
                print(f"💾 {save_result}")
                
            except Exception as e:
                error_msg = f"❌ Error en {alert_type}: {str(e)}"
                all_alerts.append(f"\n{error_msg}")
                print(error_msg)
        
        # Create comprehensive report
        comprehensive_report = "\n".join(all_alerts)
        
        # Save comprehensive report
        comp_save_result = self.save_alert_to_file("REPORTE_COMPLETO", comprehensive_report, region)
        print(f"\n📋 {comp_save_result}")
        
        print(f"\n✅ ESCANEO AGRÍCOLA COMPLETADO")
        return comprehensive_report
    
    def chat_agricultural_assistant(self, user_message: str, region: str = "Colombia") -> str:
        """Enhanced agricultural assistant with specialized tools"""
        
        print(f"\n🌾 ASISTENTE AGRÍCOLA PROCESANDO: {user_message}")
        print("=" * 60)
        
        user_lower = user_message.lower()
        
        # Check for comprehensive scan request
        if any(word in user_lower for word in ["escaneo", "reporte", "completo", "todas", "alertas"]):
            return self.agricultural_agent_scan(region)
        
        # Always show time first
        time_info = self.get_current_time()
        print(f"⏰ {time_info}")
        response_parts = [time_info]
        
        # Specific agricultural searches
        if any(word in user_lower for word in ["carretera", "transporte", "via"]):
            result = self.search_road_closures(region)
            response_parts.append(result)
            self.save_alert_to_file("CARRETERAS", result, region)
        
        if any(word in user_lower for word in ["abono", "fertilizante", "precio"]):
            result = self.search_fertilizer_prices(region)
            response_parts.append(result)
            self.save_alert_to_file("PRECIOS_ABONO", result, region)
        
        if any(word in user_lower for word in ["inundacion", "inundación", "agua"]):
            result = self.search_flood_alerts(region)
            response_parts.append(result)
            self.save_alert_to_file("INUNDACIONES", result, region)
        
        if any(word in user_lower for word in ["clima", "lluvia", "sequia"]):
            result = self.search_weather_alerts(region)
            response_parts.append(result)
            self.save_alert_to_file("CLIMA", result, region)
        
        if any(word in user_lower for word in ["plaga", "enfermedad", "cultivo"]):
            result = self.search_crop_diseases(region)
            response_parts.append(result)
            self.save_alert_to_file("PLAGAS", result, region)
        
        if any(word in user_lower for word in ["mercado", "venta", "comercial"]):
            result = self.search_market_prices(region)
            response_parts.append(result)
            self.save_alert_to_file("MERCADO", result, region)
        
        # If no specific agricultural query, use general assistant
        if len(response_parts) == 1:  # Only time was added
            try:
                granite_response = self.get_response_text(self.chat(user_message))
                response_parts.append(f"🧠 RESPUESTA GRANITE AGRÍCOLA:\n{granite_response}\n📍 FUENTE: Modelo IBM Granite")
            except Exception as e:
                response_parts.append(f"❌ Error en modelo Granite: {str(e)}")
        
        final_response = "\n\n" + "="*50 + "\n\n".join(response_parts)
        return final_response
    
    def search_flood_predictions(self, region: str = "Colombia") -> str:
        """Search for flood predictions specifically affecting agriculture"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            # Multiple specific searches for comprehensive flood information
            search_queries = [
                f"prediccion inundaciones {region} agricultura cultivos IDEAM",
                f"alerta temprana inundacion {region} zonas agricolas",
                f"riesgo inundacion cultivos {region} temporada lluvias"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"🌊 Buscando: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(result)
                except Exception as e:
                    all_results.append(f"Error en búsqueda: {str(e)}")
            
            combined_results = " | ".join(all_results)
            
            return f"""🌊 PREDICCIONES DE INUNDACIONES AGRÍCOLAS:
CONTEXTO COMPLETO:
{combined_results[:1500]}...

IMPACTO AGRÍCOLA ESPERADO:
- Pérdida potencial de cultivos en zonas bajas
- Daño a infraestructura agrícola
- Retrasos en siembra y cosecha
- Problemas de acceso a fincas
- Contaminación de suelos agrícolas
- Afectación del ganado en pastoreo

📍 FUENTE: Búsqueda web especializada - IDEAM y fuentes agrícolas"""
        except Exception as e:
            return f"❌ Error buscando predicciones de inundación: {str(e)}"
    
    def search_fertilizer_price_predictions(self, region: str = "Colombia") -> str:
        """Search for fertilizer price predictions and trends"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"prediccion precio fertilizante {region} 2025 agricultura",
                f"tendencia costo abono {region} inflacion agricola",
                f"precio urea fosfato {region} importacion fertilizante",
                f"aumento precio insumos agricolas {region} proyeccion"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"💰 Buscando: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(result)
                except Exception as e:
                    all_results.append(f"Error en búsqueda: {str(e)}")
            
            combined_results = " | ".join(all_results)
            
            return f"""💰 PREDICCIONES DE PRECIOS DE FERTILIZANTES:
CONTEXTO COMPLETO:
{combined_results[:1500]}...

FACTORES QUE INFLUYEN EN PRECIOS:
- Precio internacional del petróleo y gas natural
- Tasa de cambio peso-dólar
- Políticas de importación gubernamentales
- Demanda estacional de fertilizantes
- Conflictos geopolíticos que afecten producción
- Costos de transporte y logística

RECOMENDACIONES PARA AGRICULTORES:
- Considerar compras anticipadas si se prevé alza
- Evaluar fertilizantes alternativos o orgánicos
- Planificar presupuesto con margen de aumento
- Agruparse para compras en volumen

📍 FUENTE: Análisis de mercado fertilizantes y fuentes especializadas"""
        except Exception as e:
            return f"❌ Error buscando predicciones de precios: {str(e)}"
    
    def search_drought_predictions(self, region: str = "Colombia") -> str:
        """Search for drought predictions affecting agriculture"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"prediccion sequia {region} agricultura IDEAM fenomeno niño",
                f"deficit hidrico cultivos {region} reservorios agua",
                f"alerta sequia {region} riego agricultura"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"☀️ Buscando: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(result)
                except Exception as e:
                    all_results.append(f"Error en búsqueda: {str(e)}")
            
            combined_results = " | ".join(all_results)
            
            return f"""☀️ PREDICCIONES DE SEQUÍA AGRÍCOLA:
CONTEXTO COMPLETO:
{combined_results[:1500]}...

IMPACTO AGRÍCOLA ESPERADO:
- Reducción en rendimiento de cultivos
- Aumento en costos de riego
- Estrés hídrico en ganado
- Mayor incidencia de plagas y enfermedades
- Deterioro de pasturas
- Necesidad de sistemas de riego complementario

MEDIDAS PREVENTIVAS RECOMENDADAS:
- Implementar sistemas de riego eficiente
- Seleccionar variedades resistentes a sequía
- Conservación de agua mediante reservorios
- Mulching para conservar humedad del suelo
- Programar siembras según disponibilidad hídrica

📍 FUENTE: IDEAM y centros especializados en recursos hídricos"""
        except Exception as e:
            return f"❌ Error buscando predicciones de sequía: {str(e)}"
    
    def search_pest_disease_alerts(self, region: str = "Colombia") -> str:
        """Search for comprehensive pest and disease alerts"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"alerta fitosanitaria {region} ICA plagas cultivos",
                f"brote enfermedad cultivos {region} hongos bacterias",
                f"plaga migratoria {region} agricultura control",
                f"resistencia plagas pesticidas {region} manejo integrado"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"🐛 Buscando: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(result)
                except Exception as e:
                    all_results.append(f"Error en búsqueda: {str(e)}")
            
            combined_results = " | ".join(all_results)
            
            return f"""🐛 ALERTAS FITOSANITARIAS COMPLETAS:
CONTEXTO COMPLETO:
{combined_results[:1500]}...

PRINCIPALES AMENAZAS IDENTIFICADAS:
- Plagas migratorias estacionales
- Enfermedades fúngicas por humedad
- Resistencia a pesticidas convencionales
- Vectores de virus en cultivos
- Plagas del suelo que afectan raíces

ESTRATEGIAS DE MANEJO RECOMENDADAS:
- Monitoreo regular de cultivos
- Rotación de principios activos
- Control biológico con enemigos naturales
- Manejo integrado de plagas (MIP)
- Aplicación de buenas prácticas agrícolas
- Cuarentena de material vegetal

📍 FUENTE: ICA, SENASA y centros fitosanitarios especializados"""
        except Exception as e:
            return f"❌ Error buscando alertas de plagas: {str(e)}"
    
    def search_market_predictions(self, region: str = "Colombia") -> str:
        """Search for agricultural market predictions and price trends"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"prediccion precios agricolas {region} SIPSA mercado",
                f"tendencia exportacion {region} productos agricolas",
                f"demanda internacional {region} cafe cacao arroz",
                f"volatilidad precios agricolas {region} factores economicos"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"📈 Buscando: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(result)
                except Exception as e:
                    all_results.append(f"Error en búsqueda: {str(e)}")
            
            combined_results = " | ".join(all_results)
            
            return f"""📈 PREDICCIONES DE MERCADO AGRÍCOLA:
CONTEXTO COMPLETO:
{combined_results[:1500]}...

FACTORES QUE AFECTAN PRECIOS:
- Demanda internacional de commodities
- Políticas comerciales y aranceles
- Condiciones climáticas globales
- Costos de transporte y combustible
- Inflación y tasa de cambio
- Competencia de otros países productores

RECOMENDACIONES COMERCIALES:
- Diversificar cultivos según demanda
- Establecer contratos a futuro cuando sea favorable
- Monitorear mercados internacionales
- Considerar certificaciones de calidad
- Evaluar canales de comercialización directa
- Formar asociaciones para mejor poder de negociación

📍 FUENTE: SIPSA, ministerios agricultura y bolsas de commodities"""
        except Exception as e:
            return f"❌ Error buscando predicciones de mercado: {str(e)}"
    
    def search_infrastructure_alerts(self, region: str = "Colombia") -> str:
        """Search for infrastructure alerts affecting agricultural logistics"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"cierre carreteras {region} transporte agricola carga",
                f"infraestructura rural {region} vias acceso fincas",
                f"puertos agricolas {region} exportacion problemas",
                f"energia electrica rural {region} riego agricultura"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"🛣️ Buscando: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(result)
                except Exception as e:
                    all_results.append(f"Error en búsqueda: {str(e)}")
            
            combined_results = " | ".join(all_results)
            
            return f"""🛣️ ALERTAS DE INFRAESTRUCTURA AGRÍCOLA:
CONTEXTO COMPLETO:
{combined_results[:1500]}...

IMPACTOS EN LA AGRICULTURA:
- Retrasos en transporte de productos perecederos
- Aumento en costos de flete y logística
- Dificultad para acceso de maquinaria agrícola
- Problemas en suministro de insumos
- Afectación en cadenas de frío
- Limitaciones en acceso a mercados

ALTERNATIVAS Y CONTINGENCIAS:
- Rutas alternas identificadas
- Coordinación con transportadores
- Almacenamiento temporal en finca
- Comunicación con compradores
- Seguros de transporte y carga
- Planes de contingencia logística

📍 FUENTE: INVIAS, ministerios transporte y gremios agrícolas"""
        except Exception as e:
            return f"❌ Error buscando alertas de infraestructura: {str(e)}"
    
    def agricultural_comprehensive_scan(self, region: str = "Colombia") -> str:
        """Comprehensive agricultural intelligence scan with detailed predictions"""
        print(f"\n🌾 INICIANDO ESCANEO INTEGRAL DE INTELIGENCIA AGRÍCOLA - {region}")
        print("=" * 90)
        
        time_info = self.get_current_time()
        print(f"⏰ {time_info}")
        
        all_alerts = []
        all_alerts.append(f"🌾 REPORTE DE INTELIGENCIA AGRÍCOLA INTEGRAL - {region}")
        all_alerts.append("=" * 80)
        all_alerts.append(time_info)
        all_alerts.append("=" * 80)
        
        # Enhanced agricultural intelligence searches
        agricultural_intelligence = [
            ("PREDICCIONES_INUNDACION", self.search_flood_predictions),
            ("PREDICCIONES_SEQUÍA", self.search_drought_predictions), 
            ("PREDICCIONES_PRECIOS_FERTILIZANTE", self.search_fertilizer_price_predictions),
            ("ALERTAS_FITOSANITARIAS", self.search_pest_disease_alerts),
            ("PREDICCIONES_MERCADO", self.search_market_predictions),
            ("ALERTAS_INFRAESTRUCTURA", self.search_infrastructure_alerts)
        ]
        
        for alert_type, search_function in agricultural_intelligence:
            print(f"\n🔍 Ejecutando análisis: {alert_type}")
            try:
                result = search_function(region)
                all_alerts.append(f"\n{result}")
                
                # Save individual detailed report
                save_result = self.save_alert_to_file(alert_type, result, region)
                print(f"💾 {save_result}")
                
            except Exception as e:
                error_msg = f"❌ Error en {alert_type}: {str(e)}"
                all_alerts.append(f"\n{error_msg}")
                print(error_msg)
        
        # Create executive summary using AI
        try:
            summary_prompt = f"""
            Basándote en toda la información recopilada sobre agricultura en {region}, 
            crea un resumen ejecutivo con las principales alertas y recomendaciones para agricultores.
            Enfócate en acciones concretas y predicciones específicas.
            """
            
            print(f"\n🧠 Generando resumen ejecutivo con IA...")
            ai_summary = self.get_response_text(self.chat(summary_prompt))
            all_alerts.append(f"\n🧠 RESUMEN EJECUTIVO IA:\n{ai_summary}\n📍 FUENTE: Análisis IBM Granite")
            
        except Exception as e:
            print(f"⚠️ No se pudo generar resumen IA: {e}")
        
        comprehensive_report = "\n".join(all_alerts)
        
        # Save comprehensive intelligence report
        comp_save_result = self.save_alert_to_file("INTELIGENCIA_AGRICOLA_COMPLETA", comprehensive_report, region)
        print(f"\n📋 {comp_save_result}")
        
        print(f"\n✅ ESCANEO DE INTELIGENCIA AGRÍCOLA COMPLETADO")
        return comprehensive_report

def main():
    """Example usage focusing on agricultural assistant"""
    print("🌾 CAMPO FUTURO - ASISTENTE AGRÍCOLA CON IA")
    print("=" * 80)
    
    # Check dependencies
    try:
        from langchain_community.tools import DuckDuckGoSearchRun
        print("✓ LangChain dependencies available")
    except ImportError as e:
        print(f"⚠ Missing dependencies: {e}")
        print("Install with: pip install langchain langchain-community duckduckgo-search")
    
    client = IBMGraniteClient()
    
    try:
        # Test authentication first
        print("\n🔐 Testing authentication...")
        token = client.get_access_token()
        print(f"✅ Authentication successful! Token: {token[:20]}...")
        
        # Agricultural assistant tests
        print("\n🌾 Testing agricultural assistant functionality...")
        
        agricultural_queries = [
            "Dame un reporte completo de alertas agrícolas",
            "¿Hay cierres de carreteras que afecten el transporte?",
            "¿Cuál es el precio del abono hoy?",
            "¿Hay alertas de inundación?",
            "¿Qué alertas climáticas hay?",
            "¿Hay problemas de plagas en los cultivos?"
        ]
        
        for i, query in enumerate(agricultural_queries, 1):
            print(f"\n" + "🌾"*80)
            print(f"CONSULTA AGRÍCOLA {i}: {query}")
            print("🌾" * 80)
            
            try:
                response = client.chat_agricultural_assistant(query, "Colombia")
                print(f"\n📋 RESPUESTA:\n{response[:500]}...")  # Show first 500 chars
            except Exception as e:
                print(f"❌ Error: {e}")
                
            # Pause between major operations
            if i == 1:  # After comprehensive scan
                input("\n⏳ Presiona ENTER para continuar con consultas específicas...")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
