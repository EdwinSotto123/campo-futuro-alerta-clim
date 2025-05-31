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
    
    # Regional configuration
    AVAILABLE_REGIONS = {
        "colombia": "Colombia",
        "antioquia": "Antioquia, Colombia",
        "valle_del_cauca": "Valle del Cauca, Colombia",
        "cundinamarca": "Cundinamarca, Colombia",
        "santander": "Santander, Colombia",
        "boyaca": "Boyacá, Colombia",
        "tolima": "Tolima, Colombia",
        "huila": "Huila, Colombia",
        "meta": "Meta, Colombia",
        "casanare": "Casanare, Colombia",
        "cesar": "Cesar, Colombia",
        "cordoba": "Córdoba, Colombia",
        "sucre": "Sucre, Colombia",
        "bolivar": "Bolívar, Colombia"
    }
    
    # Date configuration in Spanish
    SPANISH_MONTHS = {
        1: "enero", 2: "febrero", 3: "marzo", 4: "abril",
        5: "mayo", 6: "junio", 7: "julio", 8: "agosto", 
        9: "septiembre", 10: "octubre", 11: "noviembre", 12: "diciembre"
    }
    
    SPANISH_DAYS = {
        0: "lunes", 1: "martes", 2: "miércoles", 3: "jueves",
        4: "viernes", 5: "sábado", 6: "domingo"
    }
    
    # Output language configuration
    OUTPUT_LANGUAGE = "spanish"
    
    # Prompt specialization
    PROMPT_BASED_OUTPUT = True
    
    @staticmethod
    def get_spanish_date(date_obj):
        """Convert datetime to Spanish format: día mes año"""
        day = date_obj.day
        month = Config.SPANISH_MONTHS[date_obj.month]
        year = date_obj.year
        return f"{day} de {month} de {year}"
    
    @staticmethod
    def get_spanish_datetime(date_obj):
        """Convert datetime to full Spanish format"""
        day_name = Config.SPANISH_DAYS[date_obj.weekday()]
        spanish_date = Config.get_spanish_date(date_obj)
        time_str = date_obj.strftime("%H:%M")
        return f"{day_name}, {spanish_date} a las {time_str}"
