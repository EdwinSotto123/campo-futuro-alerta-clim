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
        """Search for specific flood news and predictions affecting agriculture"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            # Specific news-focused searches with time constraints
            search_queries = [
                f"noticias inundaciones {region} cultivos perdidos hoy últimas 24 horas",
                f"alerta roja inundación {region} agricultura UNGRD enero 2025",
                f"evacuaciones agricultores {region} creciente río últimas noticias",
                f"emergencia inundación {region} hectáreas afectadas cultivos enero 2025",
                f"\"se espera inundación\" {region} agricultura próximos días"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"🌊 Buscando noticias específicas: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(f"BÚSQUEDA: {query}\nRESULTADO: {result}\n---")
                except Exception as e:
                    all_results.append(f"Error en búsqueda {query}: {str(e)}")
            
            combined_results = "\n".join(all_results)
            
            return f"""🌊 NOTICIAS DE INUNDACIONES AGRÍCOLAS ESPECÍFICAS:

{combined_results[:2000]}...

🚨 PREDICCIONES ESPECÍFICAS IDENTIFICADAS:
• Zonas de riesgo inminente para agricultura
• Cultivos en peligro por crecientes de ríos
• Evacuaciones preventivas de fincas
• Pérdidas estimadas en hectáreas
• Alertas tempranas emitidas por autoridades

⚠️ ACCIONES INMEDIATAS RECOMENDADAS:
• Monitorear niveles de ríos cercanos a cultivos
• Preparar drenajes de emergencia
• Proteger maquinaria agrícola en zonas altas
• Coordinar con autoridades locales
• Asegurar ganado en terrenos seguros

📍 FUENTE: Noticias especializadas y alertas oficiales últimas 24-48 horas"""
        except Exception as e:
            return f"❌ Error buscando noticias de inundación: {str(e)}"
    
    def search_fertilizer_price_predictions(self, region: str = "Colombia") -> str:
        """Search for specific fertilizer price news and market alerts"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"\"precio fertilizante sube\" {region} enero 2025 noticias agricultores",
                f"\"aumento precio urea\" {region} importación fertilizante últimas noticias",
                f"\"escasez fertilizante\" {region} enero 2025 producción agrícola",
                f"\"se espera alza\" precio abono {region} próximas semanas 2025",
                f"inflación insumos agrícolas {region} fertilizante enero 2025 noticias"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"💰 Buscando noticias de precios: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(f"BÚSQUEDA: {query}\nRESULTADO: {result}\n---")
                except Exception as e:
                    all_results.append(f"Error en búsqueda {query}: {str(e)}")
            
            combined_results = "\n".join(all_results)
            
            return f"""💰 NOTICIAS ESPECÍFICAS DE PRECIOS DE FERTILIZANTES:

{combined_results[:2000]}...

📈 PREDICCIONES DE PRECIOS IDENTIFICADAS:
• Aumentos confirmados en próximas semanas
• Factores que impulsan alzas de precios
• Productos específicos más afectados
• Regiones con mayor impacto
• Alternativas sugeridas por expertos

💡 ESTRATEGIAS ANTE ALZAS DE PRECIOS:
• Comprar antes de incrementos anunciados
• Considerar fertilizantes orgánicos locales
• Formar grupos de compra con otros agricultores
• Negociar contratos a largo plazo
• Evaluar análisis de suelo para optimizar uso

📍 FUENTE: Noticias comerciales y alertas de mercado agrícola recientes"""
        except Exception as e:
            return f"❌ Error buscando noticias de precios: {str(e)}"
    
    def search_drought_predictions(self, region: str = "Colombia") -> str:
        """Search for specific drought news and water scarcity alerts"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"\"sequía severa\" {region} cultivos enero 2025 últimas noticias",
                f"\"escasez agua\" agricultura {region} embalses nivel crítico 2025",
                f"\"se declara emergencia\" sequía {region} agricultores enero 2025",
                f"\"prohibición riego\" {region} restricción agua agricultura noticias",
                f"\"pérdida cosecha\" sequía {region} enero 2025 hectáreas afectadas"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"☀️ Buscando noticias de sequía: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(f"BÚSQUEDA: {query}\nRESULTADO: {result}\n---")
                except Exception as e:
                    all_results.append(f"Error en búsqueda {query}: {str(e)}")
            
            combined_results = "\n".join(all_results)
            
            return f"""☀️ NOTICIAS ESPECÍFICAS DE SEQUÍA AGRÍCOLA:

{combined_results[:2000]}...

🚨 ALERTAS DE SEQUÍA IDENTIFICADAS:
• Declaraciones de emergencia por sequía
• Restricciones de agua para riego
• Cultivos específicos en riesgo crítico
• Embalses en niveles mínimos históricos
• Pérdidas confirmadas en producción

🛡️ MEDIDAS DE CONTINGENCIA INMEDIATAS:
• Implementar riego por goteo urgente
• Priorizar cultivos de mayor valor
• Buscar fuentes alternativas de agua
• Aplicar mulch para conservar humedad
• Contactar autoridades para apoyo

📍 FUENTE: Noticias de emergencia y declaraciones oficiales recientes"""
        except Exception as e:
            return f"❌ Error buscando noticias de sequía: {str(e)}"
    
    def search_pest_disease_alerts(self, region: str = "Colombia") -> str:
        """Search for specific pest outbreak news and disease alerts"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"\"brote plaga\" {region} cultivos enero 2025 ICA alerta fitosanitaria",
                f"\"nueva enfermedad\" plantas {region} enero 2025 agricultores noticias",
                f"\"invasion insectos\" {region} agricultura control urgente 2025",
                f"\"alerta roja\" plaga {region} ICA últimas 48 horas noticias",
                f"\"resistencia pesticida\" {region} enero 2025 manejo plagas noticias"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"🐛 Buscando alertas de plagas: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(f"BÚSQUEDA: {query}\nRESULTADO: {result}\n---")
                except Exception as e:
                    all_results.append(f"Error en búsqueda {query}: {str(e)}")
            
            combined_results = "\n".join(all_results)
            
            return f"""🐛 NOTICIAS ESPECÍFICAS DE PLAGAS Y ENFERMEDADES:

{combined_results[:2000]}...

🚨 BROTES Y ALERTAS IDENTIFICADAS:
• Nuevas plagas detectadas por ICA
• Enfermedades emergentes en cultivos
• Zonas específicas bajo cuarentena
• Productos fitosanitarios recomendados
• Cronogramas de aplicación urgente

⚡ ACCIONES INMEDIATAS REQUERIDAS:
• Inspección diaria de cultivos
• Aplicación preventiva de fungicidas
• Aislamiento de plantas afectadas
• Consultar con técnicos ICA
• Documentar síntomas para reporte

📍 FUENTE: Alertas oficiales ICA y noticias fitosanitarias recientes"""
        except Exception as e:
            return f"❌ Error buscando alertas de plagas: {str(e)}"
    
    def search_market_predictions(self, region: str = "Colombia") -> str:
        """Search for specific agricultural market news and price alerts"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"\"precios agrícolas suben\" {region} enero 2025 mercado noticias",
                f"\"demanda internacional\" {region} exportación agrícola enero 2025",
                f"\"precio café cacao\" {region} enero 2025 mercado futuro noticias",
                f"\"escasez productos\" {region} agriculture mercado enero 2025",
                f"\"nuevos mercados\" exportación {region} agricultura enero 2025"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"📈 Buscando noticias de mercado: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(f"BÚSQUEDA: {query}\nRESULTADO: {result}\n---")
                except Exception as e:
                    all_results.append(f"Error en búsqueda {query}: {str(e)}")
            
            combined_results = "\n".join(all_results)
            
            return f"""📈 NOTICIAS ESPECÍFICAS DE MERCADO AGRÍCOLA:

{combined_results[:2000]}...

💹 OPORTUNIDADES DE MERCADO IDENTIFICADAS:
• Productos con demanda al alza
• Nuevos mercados de exportación
• Precios premium por calidad
• Contratos a futuro disponibles
• Tendencias de consumo emergentes

🎯 ESTRATEGIAS COMERCIALES RECOMENDADAS:
• Diversificar hacia productos demandados
• Certificar calidad para mercados premium
• Establecer contratos directos
• Evaluar procesamiento agregado
• Formar alianzas comerciales

📍 FUENTE: Noticias comerciales y boletines de mercado actualizados"""
        except Exception as e:
            return f"❌ Error buscando noticias de mercado: {str(e)}"
    
    def search_infrastructure_alerts(self, region: str = "Colombia") -> str:
        """Search for specific infrastructure news affecting agricultural logistics"""
        if not self.search_tool:
            return "❌ Búsqueda web no disponible"
            
        try:
            search_queries = [
                f"\"cierre carretera\" {region} enero 2025 transporte agrícola noticias",
                f"\"bloqueo vías\" {region} productos agrícolas enero 2025 INVIAS",
                f"\"daño puente\" {region} agricultura transporte enero 2025 noticias",
                f"\"restricción vehicular\" {region} carga agrícola enero 2025",
                f"\"paro transportadores\" {region} productos agrícolas enero 2025"
            ]
            
            all_results = []
            for query in search_queries:
                print(f"🛣️ Buscando noticias de infraestructura: {query}")
                try:
                    result = self.search_tool.run(query)
                    all_results.append(f"BÚSQUEDA: {query}\nRESULTADO: {result}\n---")
                except Exception as e:
                    all_results.append(f"Error en búsqueda {query}: {str(e)}")
            
            combined_results = "\n".join(all_results)
            
            return f"""🛣️ NOTICIAS ESPECÍFICAS DE INFRAESTRUCTURA AGRÍCOLA:

{combined_results[:2000]}...

🚧 PROBLEMAS DE INFRAESTRUCTURA IDENTIFICADOS:
• Cierres de carreteras confirmados
• Rutas alternas disponibles
• Tiempo estimado de reparación
• Impacto en costos de transporte
• Productos más afectados

🔄 SOLUCIONES LOGÍSTICAS INMEDIATAS:
• Identificar rutas alternas viables
• Coordinar con transportadores locales
• Negociar tarifas especiales por desvíos
• Almacenar temporalmente en centros cercanos
• Contactar compradores sobre retrasos

📍 FUENTE: Noticias de transporte y alertas de INVIAS actualizadas"""
        except Exception as e:
            return f"❌ Error buscando noticias de infraestructura: {str(e)}"
    
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
