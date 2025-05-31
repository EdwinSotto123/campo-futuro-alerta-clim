from agent_manager import AgentManager
from flood_prediction_agent import FloodPredictionAgent
from market_intelligence_agent import MarketIntelligenceAgent
from config import Config  # Add this import

def demo_multi_agent_system():
    """Demostración del sistema multi-agente con configuración GLOBAL centrada en PERÚ"""
    print("🌾 DEMO: SISTEMA MULTI-AGENTE GLOBAL PARA AGRICULTURA (CENTRADO EN PERÚ)")
    print("=" * 80)
    
    # Initialize agent manager with Peru as default
    manager = AgentManager(default_region="Perú", default_language="ESPAÑOL")
    
    # Create and register agents
    flood_agent = FloodPredictionAgent()
    market_agent = MarketIntelligenceAgent()
    
    manager.register_agent(flood_agent)
    manager.register_agent(market_agent)
    
    # Demo configurations for different regions - PERÚ PRIMERO
    test_configurations = [
        {
            "region": "Perú",
            "language": "ESPAÑOL",
            "description": "🇵🇪 Análisis prioritario para PERÚ en Español"
        },
        {
            "region": "Perú", 
            "language": "QUECHUA",
            "description": "🇨🇴 Análisis para Colombia en QUECHUA"
        },
        {
            "region": "Ecuador",
            "language": "ESPAÑOL", 
            "description": "🇪🇨 Análisis para Ecuador en Español"
        },
        {
            "region": "Brasil",
            "language": "PORTUGUÊS",
            "description": "🇧🇷 Análisis para Brasil en Portugués"
        },
        {
            "region": "Estados Unidos",
            "language": "ENGLISH",
            "description": "🇺🇸 Análisis para Estados Unidos en Inglés"
        },
        {
            "region": "España",
            "language": "ESPAÑOL",
            "description": "🇪🇸 Análisis para España en Español"
        }
    ]
    
    print("\n📋 CONFIGURACIONES DE PRUEBA GLOBALES:")
    for i, config in enumerate(test_configurations, 1):
        print(f"{i}. {config['description']}")
    
    # Test each configuration - ENFOQUE ESPECIAL EN PERÚ
    for i, config in enumerate(test_configurations):
        print(f"\n{'='*70}")
        print(f"🔧 CONFIGURANDO: {config['description']}")
        if config['region'] == "Perú":
            print("⭐ CONFIGURACIÓN PRIORITARIA - PERÚ ⭐")
        print(f"{'='*70}")
        
        # Execute agents with specific configuration
        results = manager.execute_multiple_agents(
            ["PREDICTOR_INUNDACIONES", "INTELIGENCIA_MERCADOS"],
            region=config["region"],
            language=config["language"]
        )
        
        # Show results summary
        for result in results:
            agent_name = result.get("agent", "Unknown")
            status = result.get("status", "Unknown")
            region = result.get("region", "Unknown")
            language = result.get("language", "Unknown")
            
            status_icon = "⭐" if region == "Perú" else "✅"
            print(f"{status_icon} {agent_name}: {status} ({region} - {language})")
        
        print(f"🕒 Fecha de análisis: {Config.get_current_date_text(config['language'])}")
        print(f"📅 Rango temporal: {Config.get_date_range_text(7, config['language'])}")
        
        # Pausa especial después de Perú para revisar resultados
        if config['region'] == "Perú":
            print("\n⭐ ANÁLISIS DE PERÚ COMPLETADO - Revisando resultados prioritarios...")
            print("⏳ Continuando con otras regiones...")
    
    # Show execution summary
    print(f"\n{'='*60}")
    print("📊 RESUMEN FINAL DE EJECUCIÓN:")
    summary = manager.get_execution_summary()
    for key, value in summary.items():
        if key != "last_results":
            print(f"{key}: {value}")
    
    print("\n✅ Demo de configuración regional e idioma completada")

def demo_custom_configuration():
    """Demo para configuración personalizada"""
    print("\n🎯 DEMO: CONFIGURACIÓN PERSONALIZADA")
    print("=" * 50)
    
    # User-defined configuration
    custom_config = {
        "region": "Valle del Cauca, Colombia",
        "language": "ESPAÑOL", 
        "date_range_days": 14 
    }
    
    print(f"🌍 Región personalizada: {custom_config['region']}")
    print(f"🗣️ Idioma: {custom_config['language']}")
    print(f"📅 Rango de fechas: {custom_config['date_range_days']} días")
    
    # Create agent with custom configuration
    flood_agent = FloodPredictionAgent()
    flood_agent.configure_agent(
        region=custom_config["region"],
        language=custom_config["language"],
        date_range_days=custom_config["date_range_days"]
    )
    
    # Show current date context
    print(f"🕒 Contexto temporal: {flood_agent.get_current_date_context()}")
    
    # Execute with custom configuration
    result = flood_agent.execute_task()
    print(f"📋 Resultado: {result['status']}")

def demo_peru_specialized():
    """Demo especializado para agricultura peruana"""
    print("\n🇵🇪 DEMO ESPECIALIZADO: AGRICULTURA PERUANA")
    print("=" * 60)
    
    # Configuración específica para Perú
    peru_config = {
        "region": "Perú",
        "language": "Quechua",
        "date_range_days": 14,
        "focus_areas": ["sierra", "costa", "selva"]
    }
    
    print(f"🌍 País de análisis: {peru_config['region']}")
    print(f"🗣️ Idioma: {peru_config['language']}")
    print(f"📅 Período de análisis: {peru_config['date_range_days']} días")
    print(f"🏔️ Áreas de enfoque: {', '.join(peru_config['focus_areas'])}")
    
    # Create agents specialized for Peru
    flood_agent = FloodPredictionAgent()
    market_agent = MarketIntelligenceAgent()
    
    # Configure for Peru
    flood_agent.configure_agent(
        region=peru_config["region"],
        language=peru_config["language"],
        date_range_days=peru_config["date_range_days"]
    )
    
    market_agent.configure_agent(
        region=peru_config["region"],
        language=peru_config["language"],
        date_range_days=peru_config["date_range_days"]
    )
    
    # Execute Peru-specific analysis
    print("\n🚀 Ejecutando análisis especializado para Perú...")
    
    # Productos específicos de Perú
    peru_products = ["papa", "quinua", "café", "cacao", "espárrago", "mango", "uva", "palta"]
    
    flood_result = flood_agent.execute_task()
    market_result = market_agent.execute_task(products=peru_products)
    
    print(f"\n📊 RESULTADOS PERÚ:")
    print(f"🌊 Análisis de inundaciones: {flood_result['status']}")
    print(f"📈 Inteligencia de mercados: {market_result['status']}")
    print(f"🌱 Productos analizados: {len(peru_products)} productos peruanos")
    
    print("\n🇵🇪 Análisis especializado de Perú completado")

if __name__ == "__main__":
    demo_peru_specialized()
