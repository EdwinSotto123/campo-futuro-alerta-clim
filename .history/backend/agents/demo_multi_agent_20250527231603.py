from agent_manager import AgentManager
from flood_prediction_agent import FloodPredictionAgent
from market_intelligence_agent import MarketIntelligenceAgent
from config import Config  # Add this import

def demo_multi_agent_system():
    """Demostración del sistema multi-agente con configuración regional e idioma"""
    print("🌾 DEMO: SISTEMA MULTI-AGENTE CONFIGURABLE PARA AGRICULTURA")
    print("=" * 70)
    
    # Initialize agent manager
    manager = AgentManager()
    
    # Create and register agents
    flood_agent = FloodPredictionAgent()
    market_agent = MarketIntelligenceAgent()
    
    manager.register_agent(flood_agent)
    manager.register_agent(market_agent)
    
    # Demo configurations for different regions and languages
    test_configurations = [
        {
            "region": "Colombia",
            "language": "ESPAÑOL",
            "description": "🇨🇴 Análisis para Colombia en Español"
        },
        {
            "region": "México", 
            "language": "ESPAÑOL",
            "description": "🇲🇽 Análisis para México en Español"
        },
        {
            "region": "Brazil",
            "language": "PORTUGUÊS", 
            "description": "🇧🇷 Análisis para Brasil en Portugués"
        },
        {
            "region": "France",
            "language": "FRANÇAIS",
            "description": "🇫🇷 Análisis para Francia en Francés"
        }
    ]
    
    print("\n📋 CONFIGURACIONES DE PRUEBA:")
    for i, config in enumerate(test_configurations, 1):
        print(f"{i}. {config['description']}")
    
    # Test each configuration
    for config in test_configurations:
        print(f"\n{'='*60}")
        print(f"🔧 CONFIGURANDO: {config['description']}")
        print(f"{'='*60}")
        
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
            
            print(f"✅ {agent_name}: {status} ({region} - {language})")
        
        print(f"🕒 Fecha de análisis: {Config.get_current_date_text(config['language'])}")
        print(f"📅 Rango temporal: {Config.get_date_range_text(7, config['language'])}")
    
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

if __name__ == "__main__":
    demo_multi_agent_system()
    demo_custom_configuration()
