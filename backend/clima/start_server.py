#!/usr/bin/env python
"""
Script para iniciar el servidor de API de datos agroclimáticos
o ejecutar directamente la extracción de datos
"""
import os
import sys
import subprocess
import argparse
from extract_nvdi import AgroClimaticosExtractor, mostrar_resultados_simples

def ejecutar_extraccion_directa(lat, lon, cultivo=None, dias=3):
    """
    Ejecuta directamente la extracción de datos agroclimáticos y muestra resultados
    
    Parámetros:
    - lat: latitud (float)
    - lon: longitud (float)
    - cultivo: tipo de cultivo (opcional)
    - dias: número de días anteriores a analizar (default: 3)
    """
    try:
        print("🌾 EXTRAYENDO DATOS AGROCLIMÁTICOS NASA POWER")
        print("=" * 60)
        
        # Inicializar extractor
        extractor = AgroClimaticosExtractor()
        
        # Obtener datos agroclimáticos
        resultados = extractor.obtener_datos_agroclimaticos_completos(lat, lon, cultivo, dias)
        
        # Mostrar resultados
        mostrar_resultados_simples(resultados, cultivo)
        
        # Generar mapa NDVI
        mapa_ndvi = extractor.generar_mapa_ndvi(lat, lon)
        if mapa_ndvi:
            print(f"\nMapa NDVI generado: {mapa_ndvi}")
        
        return 0
    
    except Exception as e:
        print(f"❌ Error al extraer datos: {str(e)}")
        return 1

def iniciar_servidor():
    """Inicia el servidor API de datos agroclimáticos"""
    try:
        print("🌾 INICIANDO SERVIDOR DE DATOS AGROCLIMÁTICOS")
        print("=" * 60)
        
        # Verificar dependencias
        dependencias = ["flask", "flask_cors", "pandas", "numpy", "matplotlib"]
        faltantes = []
        
        for dep in dependencias:
            try:
                __import__(dep)
            except ImportError:
                faltantes.append(dep)
        
        if faltantes:
            print(f"❌ Faltan dependencias: {', '.join(faltantes)}")
            print("Instalando dependencias faltantes...")
            
            # Instalar dependencias
            subprocess.check_call([sys.executable, "-m", "pip", "install"] + faltantes)
            print("✅ Dependencias instaladas correctamente")
        
        # Comprobar si existe el directorio temporal
        if not os.path.exists('temp_data'):
            os.makedirs('temp_data')
            print("✅ Directorio temporal creado")
        
        # Obtener el directorio actual
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Iniciar el servidor
        print("\n🚀 Iniciando servidor API...")
        print("El servidor estará disponible en http://localhost:5000")
        print("Endpoints disponibles:")
        print("  - /api/health - Verificar estado del servidor")
        print("  - /api/datos-nasa - Obtener datos agroclimáticos de NASA POWER")
        print("  - /api/mapa-ndvi - Generar mapa NDVI")
        print("  - /api/grafico-indices - Generar gráfico de índices")
        print("  - /api/cultivos-recomendaciones - Obtener recomendaciones para cultivos")
        print("  - /api/datos-perfil-agroclimatico - Obtener perfil agroclimático completo")
        print("\nPresiona Ctrl+C para detener el servidor")
        
        # Ejecutar el servidor
        from api_server import app
        app.run(host='0.0.0.0', port=5000, debug=True)
        
    except KeyboardInterrupt:
        print("\n⛔ Servidor detenido por el usuario")
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {str(e)}")
        return 1
    
    return 0

def main():
    """Función principal que parsea argumentos y ejecuta la acción correspondiente"""
    # Crear parser de argumentos
    parser = argparse.ArgumentParser(description="Servidor de datos agroclimáticos NASA POWER")
    
    # Añadir subparsers para los diferentes modos
    subparsers = parser.add_subparsers(dest="modo", help="Modo de ejecución")
    
    # Subparser para modo servidor
    parser_servidor = subparsers.add_parser("servidor", help="Iniciar servidor API")
    
    # Subparser para modo extracción directa
    parser_extraccion = subparsers.add_parser("extraer", help="Extraer datos agroclimáticos directamente")
    parser_extraccion.add_argument("--lat", type=float, required=False, default=-12.04, 
                                  help="Latitud (default: -12.04, Lima, Perú)")
    parser_extraccion.add_argument("--lon", type=float, required=False, default=-77.03,
                                  help="Longitud (default: -77.03, Lima, Perú)")
    parser_extraccion.add_argument("--cultivo", type=str, required=False, 
                                  help="Tipo de cultivo (ej: maiz, papa, quinua)")
    parser_extraccion.add_argument("--dias", type=int, required=False, default=3,
                                  help="Número de días a analizar (default: 3)")
    
    # Parsear argumentos
    args = parser.parse_args()
    
    # Ejecutar acción según el modo
    if args.modo == "extraer":
        return ejecutar_extraccion_directa(args.lat, args.lon, args.cultivo, args.dias)
    else:
        # Por defecto, iniciar servidor
        return iniciar_servidor()

if __name__ == "__main__":
    sys.exit(main()) 