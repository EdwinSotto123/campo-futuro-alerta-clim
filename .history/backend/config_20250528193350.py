import os
from datetime import datetime, timedelta
from typing import Dict

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
    
    # Internationalization and regionalization - CENTRADO EN PERÚ
    DEFAULT_REGION = "Perú"
    DEFAULT_LANGUAGE = "ESPAÑOL"
    
    # Available regions - GLOBAL COVERAGE
    AVAILABLE_REGIONS = [
        # América Latina
        "perú", "peru", "colombia", "méxico", "mexico", "argentina", "brasil", "brazil", 
        "chile", "ecuador", "bolivia", "venezuela", "paraguay", "uruguay", 
        "guatemala", "el salvador", "honduras", "nicaragua", "costa rica", "panamá", "panama",
        
        # Norteamérica
        "estados unidos", "usa", "united states", "canadá", "canada",
        
        # Europa
        "españa", "spain", "francia", "france", "italia", "italy", "alemania", "germany",
        "portugal", "reino unido", "uk", "países bajos", "netherlands", "bélgica", "belgium",
        
        # Asia
        "china", "india", "japón", "japan", "corea del sur", "south korea", "tailandia", "thailand",
        "vietnam", "filipinas", "philippines", "indonesia", "malasia", "malaysia",
        
        # África
        "sudáfrica", "south africa", "marruecos", "morocco", "egipto", "egypt", "kenia", "kenya",
        "etiopía", "ethiopia", "nigeria", "ghana",
        
        # Oceanía
        "australia", "nueva zelanda", "new zealand"
    ]
    
    # Agricultural products by region - ENFOQUE EN PERÚ PRIMERO
    REGIONAL_PRODUCTS = {
        "Perú": ["papa", "quinua", "café", "cacao", "maíz", "arroz", "espárrago", "mango", "uva", "palta"],
        "Colombia": ["café", "cacao", "arroz", "maíz", "papa", "caña de azúcar", "palma", "banano"],
        "México": ["maíz", "frijol", "café", "aguacate", "tomate", "chile", "trigo", "sorgo"],
        "Argentina": ["soja", "trigo", "maíz", "carne", "leche", "girasol", "limón", "uva"],
        "Brasil": ["soja", "café", "azúcar", "maíz", "algodón", "naranja", "carne", "etanol"],
        "Chile": ["uvas", "manzanas", "salmón", "vino", "cerezas", "arándanos", "paltas", "kiwis"],
        "Ecuador": ["banano", "cacao", "café", "flores", "camarón", "atún", "brócoli"],
        "Bolivia": ["quinua", "soja", "café", "castaña", "coca", "papa", "maíz"],
        "España": ["aceite de oliva", "vino", "cítricos", "cereales", "tomate", "pimiento"],
        "Francia": ["trigo", "vino", "queso", "manzanas", "remolacha", "maíz"],
        "India": ["arroz", "trigo", "algodón", "caña de azúcar", "té", "especias"],
        "China": ["arroz", "trigo", "maíz", "soja", "té", "frutas", "vegetales"],
        "Estados Unidos": ["maíz", "soja", "trigo", "algodón", "frutas", "vegetales", "carne"],
        "Australia": ["trigo", "carne", "lana", "minerales", "vino", "frutas"]
    }
    
    # Date utilities for multilingual context
    @staticmethod
    def get_current_date_text(language: str = "ESPAÑOL") -> str:
        """Get current date in text format based on language"""
        now = datetime.now()
        
        date_formats = {
            "ESPAÑOL": {
                "months": ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                          "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
                "format": "{day} de {month} de {year}"
            },
            "ENGLISH": {
                "months": ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"],
                "format": "{month} {day}, {year}"
            },
            "FRANÇAIS": {
                "months": ["janvier", "février", "mars", "avril", "mai", "juin",
                          "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
                "format": "{day} {month} {year}"
            },
            "PORTUGUÊS": {
                "months": ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
                          "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
                "format": "{day} de {month} de {year}"
            }
        }
        
        lang_config = date_formats.get(language.upper(), date_formats["ESPAÑOL"])
        month_name = lang_config["months"][now.month - 1]
        
        return lang_config["format"].format(
            day=now.day,
            month=month_name,
            year=now.year
        )
    
    @staticmethod
    def get_date_range_text(days_back: int = 7, language: str = "ESPAÑOL") -> str:
        """Get date range for search queries (current date minus days_back)"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        date_formats = {
            "ESPAÑOL": {
                "months": ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                          "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
                "format": "desde {start_day} de {start_month} hasta {end_day} de {end_month} de {year}"
            },
            "ENGLISH": {
                "months": ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"],
                "format": "from {start_month} {start_day} to {end_month} {end_day}, {year}"
            }
        }
        
        lang_config = date_formats.get(language.upper(), date_formats["ESPAÑOL"])
        start_month = lang_config["months"][start_date.month - 1]
        end_month = lang_config["months"][end_date.month - 1]
        
        return lang_config["format"].format(
            start_day=start_date.day,
            start_month=start_month,
            end_day=end_date.day,
            end_month=end_month,
            year=end_date.year
        )
    
    @staticmethod
    def get_current_date_context(language: str = "ESPAÑOL", days_back: int = 7) -> str:
        """Get full date context description"""
        current = Config.get_current_date_text(language)
        range_text = Config.get_date_range_text(days_back, language)
        
        context_text = {
            "ESPAÑOL": f"Fecha actual: {current}. Análisis para el periodo {range_text}",
            "ENGLISH": f"Current date: {current}. Analysis for the period {range_text}",
            "FRANÇAIS": f"Date actuelle: {current}. Analyse pour la période {range_text}",
            "PORTUGUÊS": f"Data atual: {current}. Análise para o período {range_text}"
        }
        
        return context_text.get(language.upper(), context_text["ESPAÑOL"])
    
    # Language-specific system messages
    LANGUAGE_PROMPTS = {
    "ESPAÑOL": "HABLA ÚNICAMENTE EN ESPAÑOL. Eres un asistente de inteligencia agrícola especializado en analizar condiciones agrícolas, patrones climáticos, tendencias de mercado y riesgos agrícolas. Proporciona información específica y accionable para agricultores.",
    
    "ENGLISH": "SPEAK ONLY IN ENGLISH. You are an agricultural intelligence assistant specialized in analyzing farming conditions, weather patterns, market trends, and agricultural risks. Provide specific, actionable information for farmers.",
    
    "FRANÇAIS": "PARLE UNIQUEMENT EN FRANÇAIS. Tu es un assistant d'intelligence agricole spécialisé dans l'analyse des conditions agricoles, des modèles météorologiques, des tendances du marché et des risques agricoles. Fournis des informations spécifiques et exploitables pour les agriculteurs.",
    
    "PORTUGUÊS": "FALE APENAS EM PORTUGUÊS. Você é um assistente de inteligência agrícola especializado em analisar condições agrícolas, padrões climáticos, tendências de mercado e riscos agrícolas. Forneça informações específicas e acionáveis para agricultores.",
    
    "QUECHUA": "QUECHUALLAPI RIMAYLLAM. Qam kanki chakra yachay yanapakuq, chakra llamkaykunata, pacha tikraykunata, qhatuy tikraykunata, chakra pisiyaykunatapas t'aqwiykuchaq. Chakra llamkaqkunapaq hunt'asqa, ruwanapaq yachaykunata quy. Tukuy kutichiykunata quechuallapi ruway.",
    
    "DEUTSCH": "SPRICH NUR AUF DEUTSCH. Du bist ein landwirtschaftlicher Intelligenz-Assistent, der sich auf die Analyse von landwirtschaftlichen Bedingungen, Wettermustern, Markttrends und landwirtschaftlichen Risiken spezialisiert hat.",
    
    "ITALIANO": "PARLA SOLO IN ITALIANO. Sei un assistente di intelligenza agricola specializzato nell'analisi delle condizioni agricole, dei modelli meteorologici, delle tendenze di mercato e dei rischi agricoli."
}

@staticmethod
def get_language_prompt(language: str) -> str:
    """Get system message for specified language"""
    # Asegurar que QUECHUA retorne el prompt correcto
    language_upper = language.upper()
    
    if language_upper == "QUECHUA":
        return Config.LANGUAGE_PROMPTS["QUECHUA"]
    
    return Config.LANGUAGE_PROMPTS.get(language_upper, Config.LANGUAGE_PROMPTS["ESPAÑOL"])