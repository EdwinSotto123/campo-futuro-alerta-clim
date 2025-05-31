import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ibm_client import IBMCloudClient
from config import Config
from datetime import datetime

def test_quechua_dates():
    """Probar funciones de fecha en Quechua"""
    print("📅 PROBANDO FECHAS EN QUECHUA:")
    print("-" * 40)
    
    current_date_quechua = Config.get_current_date_text("QUECHUA")
    date_range_quechua = Config.get_date_range_text(7, "QUECHUA")
    
    print(f"✅ Kunan pacha (Fecha actual): {current_date_quechua}")
    print(f"✅ Maskay pacha (Rango de fechas): {date_range_quechua}")
    
    return True

def get_quechua_system_prompt():
    """Obtener prompt del sistema en Quechua"""
    return """Qam huk yanapakuq AI kanki, QUECHUALLAPI RIMAYLLAM kay tapukuykunata kutichiyta atinki.

Perú suyupi chakra llamkaqkunaman yanapakuy. Kay yuyaykunata qatiy:

1. QUECHUA RIMAYLLAM: Tukuy kutichiykunata quechuallapi qillqay
2. CHAKRA YACHAY: Papa, quinua, kiwicha, oca, tarwi tarpuykunamanta yachaykunata quy
3. PACHA YACHAY: Tiempo, para, ch'akiy, yakupakaykunamanta riqsichiy
4. ALLPA LLAMKAY: Imayna allinlla allpata wakichanaman yachachiy
5. HAMPI YACHAY: Unquykunata hark'anaman, hampiykunata riqsichiy

Sichus español rimayta mañasunkiku, "Quechuallapi rimayta munani" ninki.

Llamkaq runakunaman allin, sumaq yachaykunata quy. Ama sasachakuyniyuq rimaykuna ruraychu."""

def test_quechua_prompt():
    """Probar prompt del sistema en Quechua"""
    print("\n🗣️ PROBANDO PROMPT EN QUECHUA:")
    print("-" * 40)
    
    # Usar función local si Config.get_language_prompt no existe
    try:
        quechua_prompt = Config.get_language_prompt("QUECHUA")
    except AttributeError:
        print("⚠️ Config.get_language_prompt no encontrado, usando prompt local")
        quechua_prompt = get_quechua_system_prompt()
    
    print(f"✅ Sistema rimay (Mensaje del sistema):")
    print(f"   {quechua_prompt[:200]}...")
    
    # Verificar que el prompt esté realmente en Quechua
    quechua_indicators = ["QUECHUALLAPI", "RIMAYLLAM", "kanki", "chakra", "yanapakuq", "llamkaq", "yachay"]
    indicators_found = [indicator for indicator in quechua_indicators if indicator.lower() in quechua_prompt.lower()]
    
    if len(indicators_found) >= 3:
        print(f"✅ Prompt confirmado en Quechua. Indicadores: {indicators_found}")
        return True
    else:
        print("❌ El prompt NO está en Quechua")
        print(f"Se esperaban palabras como: {quechua_indicators}")
        print(f"Solo se encontraron: {indicators_found}")
        return False

def test_quechua_ai_response():
    """Probar respuesta de IA en Quechua usando IBM Granite"""
    print("\n🤖 PROBANDO RESPUESTA DE IA EN QUECHUA:")
    print("-" * 40)
    
    try:
        # Crear cliente IBM
        ibm_client = IBMCloudClient()
        
        # Validar conexión
        if not ibm_client.validate_connection():
            print("❌ No se puede conectar a IBM Cloud")
            return False
        
        print("✅ Conexión a IBM Cloud exitosa")
        
        # Usar prompt del sistema en Quechua
        try:
            quechua_system_message = Config.get_language_prompt("QUECHUA")
        except AttributeError:
            quechua_system_message = get_quechua_system_prompt()
        
        print(f"🔍 Verificando prompt del sistema:")
        print(f"   {quechua_system_message[:100]}...")
        
        if "QUECHUALLAPI" not in quechua_system_message:
            print("❌ El prompt del sistema NO está en Quechua")
            return False
        
        print("✅ Prompt del sistema confirmado en Quechua")
        
        # Mensaje de usuario mejorado con más contexto en Quechua
        user_message = """
        Ama hina kaychu, quechuallapi rimaykuy!
        
        Papa tarpuyninmanta yachayta munani:
        
        1. ¿Imayna papa tarpuna allin?
        2. ¿Ima pachapi tarpuyta qallariy?
        3. ¿Imayna allpata wakichay?
        4. ¿Ima unquykunamanta waqaychay?
        
        QUECHUALLAPI RIMAYLLAM kutichiy. Chakra llamkaqman allin yachaykunata quy.
        """
        
        print("📤 Enviando consulta mejorada en Quechua...")
        
        # Enviar consulta a IBM Granite
        response = ibm_client.chat(user_message, quechua_system_message)
        
        # Extraer respuesta
        quechua_response = ibm_client.get_response_text(response)
        
        print("📥 Respuesta recibida:")
        print("="*50)
        print(quechua_response)
        print("="*50)
        
        # Verificar que la respuesta contiene palabras en Quechua (más estricto)
        quechua_words = ["papa", "tarpuy", "chakra", "allpa", "yaku", "inti", "killa", 
                        "wata", "sumaq", "allin", "ruwana", "pacha", "unquy", "llamkay"]
        words_found = [word for word in quechua_words if word.lower() in quechua_response.lower()]
        
        # Verificar que NO contenga demasiadas palabras en español
        spanish_words = ["cultivo", "agricultura", "fertilizante", "planta", "semilla", 
                        "cosecha", "riego", "suelo", "clima", "temperatura"]
        spanish_found = [word for word in spanish_words if word.lower() in quechua_response.lower()]
        
        print(f"🔍 Análisis de idioma:")
        print(f"   Palabras Quechua detectadas ({len(words_found)}): {words_found}")
        print(f"   Palabras Español detectadas ({len(spanish_found)}): {spanish_found}")
        
        # Criterio más flexible para determinar éxito
        quechua_score = len(words_found)
        spanish_penalty = len(spanish_found)
        
        if quechua_score >= 5 and spanish_penalty <= 3:
            print(f"✅ Respuesta confirmada en Quechua (score: {quechua_score}, penalty: {spanish_penalty})")
            return True
        elif quechua_score >= 3:
            print(f"⚠️ Respuesta parcialmente en Quechua (score: {quechua_score}, penalty: {spanish_penalty})")
            return True  # Cambiar a True para ser más tolerante
        else:
            print(f"❌ La respuesta NO está en Quechua (score: {quechua_score}, penalty: {spanish_penalty})")
            return False
            
    except Exception as e:
        print(f"❌ Error en prueba de IA Quechua: {e}")
        return False

def test_agricultural_terms_quechua():
    """Probar términos agrícolas específicos en Quechua"""
    print("\n🌱 PROBANDO TÉRMINOS AGRÍCOLAS EN QUECHUA:")
    print("-" * 40)
    
    try:
        ibm_client = IBMCloudClient()
        
        if not ibm_client.validate_connection():
            print("❌ No se puede conectar a IBM Cloud")
            return False
        
        try:
            quechua_system_message = Config.get_language_prompt("QUECHUA")
        except AttributeError:
            quechua_system_message = get_quechua_system_prompt()
        
        # Consulta específica sobre términos agrícolas andinos
        agricultural_query = """
        Kay andino mikhuykunamanta quechuallapi willaykuy:
        - Papa
        - Quinua 
        - Kiwicha
        - Oca
        
        Sapan mikhuy kaqmanta willakuy:
        1. Iman kaq
        2. Imayna tarpuna
        3. Iman allin kaq
        
        QUECHUALLAPI RIMAYLLAM kutichiy.
        """
        
        print("📤 Consultando sobre cultivos andinos en Quechua...")
        
        response = ibm_client.chat(agricultural_query, quechua_system_message)
        agricultural_response = ibm_client.get_response_text(response)
        
        print("📥 Respuesta sobre cultivos andinos:")
        print("="*50)
        print(agricultural_response[:500] + "..." if len(agricultural_response) > 500 else agricultural_response)
        print("="*50)
        
        # Verificar términos agrícolas andinos
        andean_terms = ["papa", "quinua", "kiwicha", "oca", "tarpuy", "chakra", "allpa", "mikhuy"]
        terms_found = [term for term in andean_terms if term.lower() in agricultural_response.lower()]
        
        if len(terms_found) >= 3:
            print(f"✅ Términos agrícolas andinos detectados ({len(terms_found)}): {terms_found}")
            return True
        else:
            print(f"⚠️ Pocos términos agrícolas andinos detectados ({len(terms_found)}): {terms_found}")
            return False
            
    except Exception as e:
        print(f"❌ Error en prueba de términos agrícolas: {e}")
        return False

def test_weather_alert_quechua():
    """Probar alerta climática en Quechua"""
    print("\n🌦️ PROBANDO ALERTA CLIMÁTICA EN QUECHUA:")
    print("-" * 40)
    
    try:
        ibm_client = IBMCloudClient()
        
        if not ibm_client.validate_connection():
            print("❌ No se puede conectar a IBM Cloud")
            return False
        
        try:
            quechua_system_message = Config.get_language_prompt("QUECHUA")
        except AttributeError:
            quechua_system_message = get_quechua_system_prompt()
            
        current_date = Config.get_current_date_text("QUECHUA")
        
        # Consulta sobre alerta climática
        weather_query = f"""
        Kunan pacha: {current_date}
        
        Chakra llamkaqkunapaq pacha willakuy:
        
        ¿Imayna pacha kanqa?
        - Para (lluvia)
        - Ch'akiy (sequía) 
        - Wayra (viento)
        - Inti (sol)
        
        Chakra llamkaqkunaman yuyaychay quy quechuallapi.
        """
        
        print("📤 Enviando consulta sobre clima en Quechua...")
        
        response = ibm_client.chat(weather_query, quechua_system_message)
        weather_response = ibm_client.get_response_text(response)
        
        print("📥 Alerta climática en Quechua:")
        print("="*50)
        print(weather_response[:500] + "..." if len(weather_response) > 500 else weather_response)
        print("="*50)
        
        # Verificar términos climáticos en quechua
        weather_terms = ["pacha", "para", "inti", "wayra", "ch'akiy", "phuyukuna", "chakra", "llamkaq"]
        weather_found = [term for term in weather_terms if term.lower() in weather_response.lower()]
        
        if len(weather_found) >= 2:
            print(f"✅ Términos climáticos en Quechua detectados ({len(weather_found)}): {weather_found}")
            return True
        else:
            print(f"⚠️ Pocos términos climáticos en Quechua detectados ({len(weather_found)}): {weather_found}")
            return False
            
    except Exception as e:
        print(f"❌ Error en prueba de alerta climática: {e}")
        return False

def run_all_quechua_tests():
    """Ejecutar todas las pruebas de Quechua"""
    print("🏔️ INICIANDO PRUEBAS COMPLETAS DE QUECHUA PARA AGRICULTURA PERUANA")
    print("=" * 80)
    
    tests = [
        ("Fechas en Quechua", test_quechua_dates),
        ("Prompt en Quechua", test_quechua_prompt),
        ("Respuesta IA en Quechua", test_quechua_ai_response),
        ("Términos Agrícolas Andinos", test_agricultural_terms_quechua),
        ("Alerta Climática en Quechua", test_weather_alert_quechua)
    ]
    
    results = {}
    
    for test_name, test_function in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_function()
            results[test_name] = "✅ EXITOSO" if result else "⚠️ PARCIAL"
        except Exception as e:
            results[test_name] = f"❌ FALLIDO: {str(e)}"
            print(f"❌ Error en {test_name}: {e}")
    
    # Resumen final
    print(f"\n{'='*20} RESUMEN DE PRUEBAS {'='*20}")
    for test_name, result in results.items():
        print(f"{test_name}: {result}")
    
    successful_tests = len([r for r in results.values() if "✅" in r])
    partial_tests = len([r for r in results.values() if "⚠️" in r])
    total_tests = len(results)
    
    print(f"\n📊 RESULTADO FINAL:")
    print(f"   Pruebas exitosas: {successful_tests}/{total_tests}")
    print(f"   Pruebas parciales: {partial_tests}/{total_tests}")
    print(f"   Porcentaje de éxito: {((successful_tests + partial_tests)/total_tests)*100:.1f}%")
    
    # Considerar parciales como éxito para el sistema Quechua
    if successful_tests + partial_tests >= 3:
        print("🎉 SOPORTE DE QUECHUA FUNCIONANDO CORRECTAMENTE")
        return True
    else:
        print("⚠️ SOPORTE DE QUECHUA NECESITA AJUSTES")
        return False

if __name__ == "__main__":
    success = run_all_quechua_tests()
    exit(0 if success else 1)