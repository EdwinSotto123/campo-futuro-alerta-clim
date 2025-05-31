from datetime import datetime
from ibm_client import IBMCloudClient
from search_tools import SearchTools
from file_manager import FileManager
from config import Config

class AgriculturalIntelligenceSystem:
    """Main agricultural intelligence system using modular components"""
    
    def __init__(self, api_key=None):
        print("🌾 Inicializando Sistema de Inteligencia Agrícola")
        print("=" * 60)
        
        # Initialize components
        self.ibm_client = IBMCloudClient(api_key)
        self.search_tools = SearchTools()
        self.file_manager = FileManager()
        
        print("✅ Sistema inicializado correctamente")
    
    def validate_system(self) -> bool:
        """Validate all system components"""
        print("\n🔍 Validando componentes del sistema...")
        
        # Validate IBM connection
        if not self.ibm_client.validate_connection():
            print("❌ Fallo en conexión IBM Cloud")
            return False
        print("✅ IBM Cloud conectado")
        
        # Validate search tools
        if not self.search_tools.is_available():
            print("⚠️ Herramientas de búsqueda no disponibles")
        else:
            print("✅ Herramientas de búsqueda disponibles")
        
        # Validate file system
        if not self.file_manager.file_exists():
            print("⚠️ Archivo consolidado será creado")
        else:
            print("✅ Archivo consolidado existe")
        
        return True
    
    def get_current_time(self) -> str:
        """Get current date and time with source info"""
        now = datetime.now()
        time_str = now.strftime('%Y-%m-%d %H:%M:%S')
        return f"🕐 HORA ACTUAL: {time_str} (UTC-5 Colombia)\n📍 FUENTE: Sistema local del servidor"
    
    def analyze_with_granite(self, search_data: str, analysis_type: str, region: str = "Colombia") -> str:
        """Use IBM Granite to analyze search data"""
        
        analysis_prompts = {
            "inundaciones": f"""
            Analiza la siguiente información sobre inundaciones en {region} y genera un reporte de alerta agrícola específico:

            DATOS DE BÚSQUEDA:
            {search_data[:Config.SEARCH_DATA_LIMIT]}

            Genera un reporte que incluya:
            1. 🚨 PREDICCIONES ESPECÍFICAS DE INUNDACIÓN (fechas, lugares, niveles de riesgo)
            2. 🌾 IMPACTO DIRECTO EN AGRICULTURA (cultivos afectados, hectáreas en riesgo)
            3. ⚠️ ACCIONES INMEDIATAS RECOMENDADAS (medidas preventivas concretas)
            4. 📍 FUENTE: Análisis de noticias recientes

            Enfócate solo en información verificable y útil para agricultores.
            """,
            
            "fertilizantes": f"""
            Analiza la siguiente información sobre precios de fertilizantes en {region} y genera un reporte de alerta económica agrícola:

            DATOS DE BÚSQUEDA:
            {search_data[:Config.SEARCH_DATA_LIMIT]}

            Genera un reporte que incluya:
            1. 📈 PREDICCIONES DE PRECIOS ESPECÍFICAS (productos, porcentajes de aumento, fechas)
            2. 💰 FACTORES QUE IMPULSAN LOS CAMBIOS (causas económicas, importaciones, etc.)
            3. 💡 ESTRATEGIAS RECOMENDADAS PARA AGRICULTORES (acciones concretas)
            4. 📍 FUENTE: Análisis de mercado y noticias comerciales

            Sé específico con números, fechas y productos cuando estén disponibles.
            """
            # Add more prompts as needed...
        }
        
        prompt = analysis_prompts.get(analysis_type, f"""
        Analiza la siguiente información sobre {analysis_type} en {region} y genera un reporte agrícola:
        
        DATOS: {search_data[:Config.SEARCH_DATA_LIMIT]}
        
        Proporciona análisis específico y recomendaciones prácticas para agricultores.
        """)
        
        try:
            response = self.ibm_client.chat(prompt, Config.AGRICULTURAL_SYSTEM_MESSAGE)
            return self.ibm_client.get_response_text(response)
        except Exception as e:
            return f"❌ Error en análisis Granite: {str(e)}"
    
    def comprehensive_agricultural_scan(self, region: str = "Colombia") -> str:
        """Perform comprehensive agricultural intelligence scan"""
        print(f"\n🌾 INICIANDO ESCANEO INTEGRAL DE INTELIGENCIA AGRÍCOLA - {region}")
        print("=" * 90)
        
        # Add session header
        self.file_manager.add_session_header("ESCANEO INTEGRAL DE INTELIGENCIA AGRÍCOLA")
        
        time_info = self.get_current_time()
        print(f"⏰ {time_info}")
        
        # Define agricultural topics to analyze
        topics = ["inundaciones", "fertilizantes", "sequia", "plagas", "mercado", "infraestructura"]
        
        all_results = [
            f"🌾 REPORTE DE INTELIGENCIA AGRÍCOLA INTEGRAL - {region}",
            "=" * 80,
            time_info,
            "=" * 80
        ]
        
        for topic in topics:
            print(f"\n🔍 Analizando: {topic.upper()}")
            
            try:
                # Search for news
                search_results = self.search_tools.search_agricultural_news(topic, region)
                combined_data = "\n".join(search_results)
                
                # Analyze with Granite
                analysis = self.analyze_with_granite(combined_data, topic, region)
                final_result = f"🔬 ANÁLISIS {topic.upper()} POR IA GRANITE:\n\n{analysis}"
                
                all_results.append(f"\n{final_result}")
                
                # Save to consolidated file
                save_result = self.file_manager.save_alert(f"PREDICCIONES_{topic.upper()}", final_result, region)
                print(f"💾 {save_result}")
                
            except Exception as e:
                error_msg = f"❌ Error en {topic}: {str(e)}"
                all_results.append(f"\n{error_msg}")
                print(error_msg)
        
        # Generate executive summary
        try:
            summary_prompt = f"""
            Basándote en toda la información recopilada sobre agricultura en {region}, 
            crea un resumen ejecutivo con las principales alertas y recomendaciones para agricultores.
            Enfócate en acciones concretas y predicciones específicas.
            """
            
            print(f"\n🧠 Generando resumen ejecutivo...")
            response = self.ibm_client.chat(summary_prompt, Config.AGRICULTURAL_SYSTEM_MESSAGE)
            ai_summary = self.ibm_client.get_response_text(response)
            executive_summary = f"\n🧠 RESUMEN EJECUTIVO IA:\n{ai_summary}\n📍 FUENTE: Análisis IBM Granite"
            
            all_results.append(executive_summary)
            self.file_manager.save_alert("RESUMEN_EJECUTIVO", executive_summary, region)
            
        except Exception as e:
            print(f"⚠️ No se pudo generar resumen IA: {e}")
        
        comprehensive_report = "\n".join(all_results)
        self.file_manager.save_alert("SESION_COMPLETA_INTEGRAL", comprehensive_report, region)
        
        print(f"\n✅ ESCANEO COMPLETADO")
        print(f"📄 Resultados en: {self.file_manager.get_file_path()}")
        
        return comprehensive_report

def main():
    """Main function to test the agricultural intelligence system"""
    print("🌾 CAMPO FUTURO - SISTEMA DE INTELIGENCIA AGRÍCOLA MODULAR")
    print("=" * 80)
    
    # Initialize system
    system = AgriculturalIntelligenceSystem()
    
    # Validate system
    if not system.validate_system():
        print("❌ Fallo en validación del sistema")
        return
    
    try:
        # Run comprehensive scan
        print("\n🚀 Ejecutando escaneo integral...")
        result = system.comprehensive_agricultural_scan("Colombia")
        print(f"\n📋 Escaneo completado. Archivo: {system.file_manager.get_file_path()}")
        
    except Exception as e:
        print(f"❌ Error en ejecución: {e}")

if __name__ == "__main__":
    main()
