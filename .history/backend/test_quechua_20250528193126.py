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

def test_quechua_prompt():
    """Probar prompt del sistema en Quechua"""
    print("\n🗣️ PROBANDO PROMPT EN QUECHUA:")
    print("-" * 40)
    
    quechua_prompt = Config.get_language_prompt("QUECHUA")
    print(f"✅ Sistema rimay (Mensaje del sistema):")
    print(f"   {quechua_prompt}")
    
    return True

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
        
        # Mensaje del sistema en Quechua
        quechua_system_message = Config.get_language_prompt("QUECHUA")
        
        # Mensaje de usuario pidiendo información agrícola en Quechua
        user_message = """
        Willaykuy Perú suyupi papa tarpuykunamanta. Kay tapukuykunata kutichiy:
        
        1. ¿Imayna ruwana papa tarpuy allin kanampaq?
        2. ¿Ima pachapi papa tarpuna allin?
        3. ¿Ima unquykunatan papa unqurikun?
        
        Quechuallapi kutichiy, aswan sut'i kaykunapi ruwanapaq yachaykunawan.
        """
        
        print("📤 Enviando consulta en Quechua sobre cultivo de papa...")
        
        # Enviar consulta a IBM Granite
        response = ibm_client.chat(user_message, quechua_system_message)
        
        # Extraer respuesta
        quechua_response = ibm_client.get_response_text(response)
        
        print("📥 Respuesta recibida en Quechua:")
        print("="*50)
        print(quechua_response)
        print("="*50)
        
        # Verificar que la respuesta contiene palabras en Quechua
        quechua_words = ["papa", "tarpuy", "chakra", "allpa", "yaku", "inti", "killa", "wata"]
        words_found = [word for word in quechua_words if word.lower() in quechua_response.lower()]
        
        if words_found:
            print(f"✅ Respuesta en Quechua confirmada. Palabras quechua detectadas: {words_found}")
            return True
        else:
            print("⚠️ La respuesta podría no estar completamente en Quechua")
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
        
        quechua_system_message = Config.get_language_prompt("QUECHUA")
        
        # Consulta específica sobre términos agrícolas andinos
        agricultural_query = """
        Kay andino mikhuykunamanta willaykuy:
        - Papa (diferentes tipos)
        - Quinua 
        - Kiwicha
        - Oca
        - Ulluku
        - Tarwi
        
        Sapan mikhuy kaqmanta willakuy:
        1. Iman kaq (qué es)
        2. Imayna tarpuna (cómo cultivar)
        3. Iman allin kaq (beneficios)
        
        Tukuy kutichiykunata quechuallapi ruway.
        """
        
        print("📤 Consultando sobre cultivos andinos en Quechua...")
        
        response = ibm_client.chat(agricultural_query, quechua_system_message)
        agricultural_response = ibm_client.get_response_text(response)
        
        print("📥 Respuesta sobre cultivos andinos:")
        print("="*50)
        print(agricultural_response)
        print("="*50)
        
        # Verificar términos agrícolas andinos
        andean_terms = ["papa", "quinua", "kiwicha", "oca", "ulluku", "tarwi", "tarpuy", "chakra", "allpa"]
        terms_found = [term for term in andean_terms if term.lower() in agricultural_response.lower()]
        
        if len(terms_found) >= 3:
            print(f"✅ Términos agrícolas andinos detectados: {terms_found}")
            return True
        else:
            print(f"⚠️ Pocos términos agrícolas andinos detectados: {terms_found}")
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
        
        quechua_system_message = Config.get_language_prompt("QUECHUA")
        current_date = Config.get_current_date_text("QUECHUA")
        
        # Consulta sobre alerta climática
        weather_query = f"""
        Kunan pacha: {current_date}
        
        Perú suyupi chakra llamkaqkunapaq willakuy:
        
        ¿Imayna pacha kanqa kay p'unchaykunapi?
        - Yakupakay (inundaciones) kay Perú suyupi
        - Ch'akiy (sequía) chakrakunapi  
        - Wayra (vientos) millay
        - Para (lluvia) achka utaq pisi
        
        Chakra llamkaqkunaman yuyaychay quy:
        1. Ima ruwananku kay pachawan
        2. Imayna chakranku waqaychakunman
        3. Ima pachapi tarpunanku utaq cosechakunman
        
        Quechuallapi kutichiy, allin willaykunawan.
        """
        
        print("📤 Enviando consulta sobre clima en Quechua...")
        
        response = ibm_client.chat(weather_query, quechua_system_message)
        weather_response = ibm_client.get_response_text(response)
        
        print("📥 Alerta climática en Quechua:")
        print("="*50)
        print(weather_response)
        print("="*50)
        
        # Verificar términos climáticos en quechua
        weather_terms = ["pacha", "para", "inti", "wayra", "yakupakay", "ch'akiy", "phuyukuna"]
        weather_found = [term for term in weather_terms if term.lower() in weather_response.lower()]
        
        if weather_found:
            print(f"✅ Términos climáticos en Quechua detectados: {weather_found}")
            return True
        else:
            print("⚠️ Pocos términos climáticos en Quechua detectados")
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
    total_tests = len(results)
    
    print(f"\n📊 RESULTADO FINAL:")
    print(f"   Pruebas exitosas: {successful_tests}/{total_tests}")
    print(f"   Porcentaje de éxito: {(successful_tests/total_tests)*100:.1f}%")
    
    if successful_tests >= 3:
        print("🎉 SOPORTE DE QUECHUA FUNCIONANDO CORRECTAMENTE")
    else:
        print("⚠️ SOPORTE DE QUECHUA NECESITA AJUSTES")
    
    return successful_tests >= 3

if __name__ == "__main__":
    success = run_all_quechua_tests()
    exit(0 if success else 1)