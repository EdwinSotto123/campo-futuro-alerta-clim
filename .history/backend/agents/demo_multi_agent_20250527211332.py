from agent_manager import AgentManager
from flood_prediction_agent import FloodPredictionAgent
from market_intelligence_agent import MarketIntelligenceAgent

def demo_multi_agent_system():
    """Demostración del sistema multi-agente"""
    print("🌾 DEMO: SISTEMA MULTI-AGENTE PARA AGRICULTURA")
    print("=" * 60)
    
    # Initialize agent manager
    manager = AgentManager()
    
    # Create and register agents
    flood_agent = FloodPredictionAgent()
    market_agent = MarketIntelligenceAgent()
    
    manager.register_agent(flood_agent)
    manager.register_agent(market_agent)
    
    # Show registered agents
    print("\n📋 AGENTES REGISTRADOS:")
    agents_info = manager.list_agents()
    for name, description in agents_info.items():
        print(f"\n{name}:")
        print(description)
    
    # Check agent status
    print("\n🔍 ESTADO DE AGENTES:")
    status = manager.get_agent_status()
    for name, state in status.items():
        print(f"{name}: {state}")
    
    # Execute specific agents
    print("\n🚀 EJECUTANDO AGENTES ESPECÍFICOS:")
    
    # Execute flood prediction
    flood_result = manager.execute_agent("PREDICTOR_INUNDACIONES", region="Valle del Cauca")
    print(f"Resultado inundaciones: {flood_result['status']}")
    
    # Execute market intelligence
    market_result = manager.execute_agent("INTELIGENCIA_MERCADOS", 
                                        region="Colombia", 
                                        products=["café", "cacao"])
    print(f"Resultado mercados: {market_result['status']}")
    
    # Execute all agents
    print("\n🎯 EJECUTANDO TODOS LOS AGENTES:")
    all_results = manager.execute_all_agents(region="Colombia")
    
    # Show execution summary
    print("\n📊 RESUMEN DE EJECUCIÓN:")
    summary = manager.get_execution_summary()
    for key, value in summary.items():
        if key != "last_results":
            print(f"{key}: {value}")
    
    print("\n✅ Demo completada")

if __name__ == "__main__":
    demo_multi_agent_system()
