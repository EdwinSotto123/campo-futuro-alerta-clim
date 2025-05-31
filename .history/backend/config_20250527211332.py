import os

class Config:
    """Configuration constants for the agricultural intelligence system"""
    
    # IBM Cloud configuration
    IBM_API_URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29"
    IBM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"
    IBM_PROJECT_ID = "a5b3058c-af2b-4a50-89e7-3dfca277b8c2"
    IBM_MODEL_ID = "ibm/granite-3-8b-instruct"
    
    # API Key (prefer environment variable)
    IBM_API_KEY = os.getenv('IBM_API_KEY') or "XM5KSplBu7IBmGG4FawY_ppqbLQvJr4tWvEDqNr_tLva"
    
    # Model parameters
    MAX_TOKENS = 14000
    TEMPERATURE = 0
    TOP_P = 1
    FREQUENCY_PENALTY = 0
    PRESENCE_PENALTY = 0
    
    # File system configuration
    ALERTS_DIR_NAME = "alertas_agricolas"
    CONSOLIDATED_FILE_NAME = "ALERTAS_AGRICOLAS_CONSOLIDADAS.txt"
    
    # Search configuration
    SEARCH_RESULT_LIMIT = 800
    SEARCH_DATA_LIMIT = 3000
    
    # System messages
    SYSTEM_MESSAGE = """You are Granite, an AI language model developed by IBM in 2024. 
    You are a cautious assistant. You carefully follow instructions. 
    You are helpful and harmless and you follow ethical guidelines and promote positive behavior."""
    
    AGRICULTURAL_SYSTEM_MESSAGE = """You are an agricultural intelligence assistant specialized in 
    analyzing farming conditions, weather patterns, market trends, and agricultural risks in Colombia. 
    Provide specific, actionable information for farmers."""
