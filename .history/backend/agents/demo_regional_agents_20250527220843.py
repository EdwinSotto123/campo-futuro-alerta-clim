from agent_manager import AgentManager
from flood_prediction_agent import FloodPredictionAgent
from market_intelligence_agent import MarketIntelligenceAgent
from config import Config
from datetime import datetime

def demo_regional_agent_system():
    """Demostración del sistema multi-agente con regiones configurables"""
    print("🌾 DEMO: SISTEMA MULTI-AGENTE REGIONAL PARA AGRICULTURA")
    print("=" * 70)
    
    # Show available regions
    print("\n📍 REGIONES DISPONIBLES:")
    for key, name in Config.AVAILABLE_REGIONS.items():
        print(f"  • {key}: {name}")
    
    # Initialize agent manager for specific region
    target_region = "valle_del_cauca"  # VARIABLE CONFIGURABLE
    manager = AgentManager(default_region=target_region)
    
    current_date = Config.get_spanish_datetime(datetime.now())
    print(f"\n📅 Fecha de análisis: {current_date}")
    
    # Create and register agents for the specific region
    flood_agent = FloodPredictionAgent(region=target_region)
    market_agent = MarketIntelligenceAgent(region=target_region)
    
    manager.register_agent(flood_agent)
    manager.register_agent(market_agent)
    
    # Show registered agents
    print(f"\n📋 AGENTES REGISTRADOS PARA {manager.default_region.upper()}:")
    agents_info = manager.list_agents()
    for name, description in agents_info.items():
        print(f"\n{name}:")
        print(description)
    
    # Execute agents for the region
    print(f"\n🚀 EJECUTANDO ANÁLISIS PARA {target_region.upper()}:")
    
    # Execute flood prediction
    print(f"\n1️⃣ Análisis de Inundaciones:")
    flood_result = manager.execute_agent("PREDICTOR_INUNDACIONES")
    if flood_result.get("status") == "completed":
        print("✅ Análisis de inundaciones completado")
        print(f"📊 Fuentes de datos: {flood_result.get('data_sources', 0)}")
    
    # Get quick risk assessment
    print(f"\n⚡ Evaluación rápida de riesgo:")
    risk_assessment = flood_agent.get_risk_level()
    print(risk_assessment[:200] + "..." if len(risk_assessment) > 200 else risk_assessment)
    
    # Execute market intelligence
    print(f"\n2️⃣ Inteligencia de Mercados:")
    market_result = manager.execute_agent("INTELIGENCIA_MERCADOS")
    if market_result.get("status") == "completed":
        print("✅ Análisis de mercados completado")
    
    # Create regional summary
    print(f"\n📋 GENERANDO RESUMEN REGIONAL:")
    regional_summary = manager.create_regional_summary_prompt()
    print("✅ Prompt de resumen regional generado")
    
    # Show execution summary
    print(f"\n📊 RESUMEN FINAL:")
    summary = manager.get_execution_summary()
    print(f"Región analizada: {Config.AVAILABLE_REGIONS[target_region]}")
    print(f"Fecha: {current_date}")
    print(f"Ejecuciones totales: {summary['total_executions']}")
    print(f"Tasa de éxito: {summary['success_rate']}")
    
    print(f"\n✅ Demo completada para {target_region}")
    
    # Test region switching
    print(f"\n🔄 PRUEBA DE CAMBIO DE REGIÓN:")
    manager.set_region("antioquia")
    
    # Create new agent for different region
    new_flood_agent = FloodPredictionAgent(region="antioquia")
    manager.register_agent(new_flood_agent)
    
    print("✅ Sistema multi-regional funcionando")

if __name__ == "__main__":
    demo_regional_agent_system()
