from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
from extract_nvdi import AgroClimaticosExtractor
from extract_clima import obtener_datos_nasa, calcular_indices_agroclimaticos_nasa, generar_recomendaciones_agricolas

app = Flask(__name__)
CORS(app)  # Permitir peticiones CORS

# Inicializar el extractor de datos agroclimáticos
extractor = AgroClimaticosExtractor()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({"status": "ok", "message": "Servidor de datos agroclimáticos activo"})

@app.route('/api/datos-nasa', methods=['GET'])
def get_datos_nasa():
    """Obtiene datos agroclimáticos de NASA POWER API"""
    try:
        # Obtener parámetros de la solicitud
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        dias = request.args.get('dias', default=7, type=int)
        cultivo = request.args.get('cultivo', default=None)
        
        # Validar parámetros
        if lat is None or lon is None:
            return jsonify({"error": "Se requieren latitud y longitud"}), 400
        
        # Obtener datos agroclimáticos
        resultados = extractor.obtener_datos_agroclimaticos_completos(lat, lon, cultivo, dias)
        
        # Si hay error, devolver mensaje
        if "error" in resultados and resultados["error"]:
            return jsonify({"error": resultados["error"]}), 500
        
        # Devolver resultados
        return jsonify(resultados)
    
    except Exception as e:
        return jsonify({"error": f"Error en el servidor: {str(e)}"}), 500

@app.route('/api/mapa-ndvi', methods=['GET'])
def get_mapa_ndvi():
    """Genera y devuelve un mapa NDVI simulado"""
    try:
        # Obtener parámetros
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        radio = request.args.get('radio', default=1, type=float)
        
        # Validar parámetros
        if lat is None or lon is None:
            return jsonify({"error": "Se requieren latitud y longitud"}), 400
        
        # Generar mapa NDVI
        mapa_file = extractor.generar_mapa_ndvi(lat, lon, radio)
        
        if mapa_file and os.path.exists(mapa_file):
            return send_file(mapa_file, mimetype='image/png')
        else:
            return jsonify({"error": "No se pudo generar el mapa NDVI"}), 500
    
    except Exception as e:
        return jsonify({"error": f"Error al generar mapa NDVI: {str(e)}"}), 500

@app.route('/api/grafico-indices', methods=['GET'])
def get_grafico_indices():
    """Genera y devuelve un gráfico de índices agroclimáticos"""
    try:
        # Obtener parámetros
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        dias = request.args.get('dias', default=7, type=int)
        
        # Validar parámetros
        if lat is None or lon is None:
            return jsonify({"error": "Se requieren latitud y longitud"}), 400
        
        # Obtener datos agroclimáticos para calcular índices
        resultados = extractor.obtener_datos_agroclimaticos_completos(lat, lon, None, dias)
        
        # Si hay error, devolver mensaje
        if "error" in resultados and resultados["error"]:
            return jsonify({"error": resultados["error"]}), 500
        
        # Generar gráfico
        grafico_file = extractor.generar_grafico_indices(resultados["indices"])
        
        if grafico_file and os.path.exists(grafico_file):
            return send_file(grafico_file, mimetype='image/png')
        else:
            return jsonify({"error": "No se pudo generar el gráfico de índices"}), 500
    
    except Exception as e:
        return jsonify({"error": f"Error al generar gráfico: {str(e)}"}), 500

@app.route('/api/cultivos-recomendaciones', methods=['GET'])
def get_recomendaciones_cultivos():
    """Devuelve recomendaciones para cultivos basadas en datos agroclimáticos"""
    try:
        # Obtener parámetros
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        # Validar parámetros
        if lat is None or lon is None:
            return jsonify({"error": "Se requieren latitud y longitud"}), 400
        
        # Lista de cultivos a evaluar
        cultivos = ["maiz", "papa", "quinua", "arroz", "cafe", "cacao"]
        
        # Obtener datos básicos (sin cultivo específico)
        resultados_base = extractor.obtener_datos_agroclimaticos_completos(lat, lon)
        
        if "error" in resultados_base and resultados_base["error"]:
            return jsonify({"error": resultados_base["error"]}), 500
        
        # Generar recomendaciones para cada cultivo
        recomendaciones_por_cultivo = {}
        
        for cultivo in cultivos:
            recomendaciones = extractor.generar_recomendaciones(resultados_base["indices"], cultivo)
            recomendaciones_por_cultivo[cultivo] = recomendaciones
        
        return jsonify({
            "cultivos": cultivos,
            "recomendaciones": recomendaciones_por_cultivo,
            "indices": resultados_base["indices"]
        })
    
    except Exception as e:
        return jsonify({"error": f"Error al generar recomendaciones: {str(e)}"}), 500

@app.route('/api/datos-perfil-agroclimatico', methods=['GET'])
def get_datos_perfil_agroclimatico():
    """Obtiene un perfil agroclimático completo para una ubicación"""
    try:
        # Obtener parámetros
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        # Validar parámetros
        if lat is None or lon is None:
            return jsonify({"error": "Se requieren latitud y longitud"}), 400
        
        # Obtener datos agroclimáticos
        resultados = extractor.obtener_datos_agroclimaticos_completos(lat, lon)
        
        # Si hay error, devolver mensaje
        if "error" in resultados and resultados["error"]:
            return jsonify({"error": resultados["error"]}), 500
        
        # Calcular idoneidad para cultivos
        cultivos = ["maiz", "papa", "quinua", "arroz", "cafe", "cacao"]
        idoneidad = {}
        
        for cultivo in cultivos:
            # Lógica simplificada para calcular idoneidad (0-100%)
            # En un sistema real, esto sería más complejo y específico por cultivo
            puntaje = 0
            peso_total = 0
            
            # Temperatura
            if 'temperatura_promedio' in resultados["indices"]:
                temp = resultados["indices"]["temperatura_promedio"]
                if cultivo == "cafe" or cultivo == "cacao":
                    # Cultivos que prefieren climas más cálidos
                    optimo = abs(temp - 25) < 5
                    puntaje += 30 * (1 - min(1, abs(temp - 25) / 10))
                else:
                    # Cultivos que toleran climas más templados
                    optimo = abs(temp - 20) < 5
                    puntaje += 30 * (1 - min(1, abs(temp - 20) / 10))
                peso_total += 30
            
            # Humedad del suelo
            if 'humedad_suelo_superficial' in resultados["indices"]:
                humedad = resultados["indices"]["humedad_suelo_superficial"]
                if cultivo == "arroz":
                    # Arroz requiere mucha agua
                    puntaje += 20 * min(1, humedad / 0.6)
                else:
                    # Otros cultivos prefieren humedad moderada
                    puntaje += 20 * (1 - abs(humedad - 0.4) / 0.4)
                peso_total += 20
            
            # Déficit hídrico
            if 'deficit_hidrico' in resultados["indices"]:
                deficit = resultados["indices"]["deficit_hidrico"]
                puntaje += 20 * max(0, 1 - deficit / 20)
                peso_total += 20
            
            # Radiación solar
            if 'radiacion_solar_promedio' in resultados["indices"]:
                radiacion = resultados["indices"]["radiacion_solar_promedio"]
                # Normalizar a un rango aproximado (100-300 W/m²)
                puntaje += 10 * min(1, max(0, (radiacion - 100) / 200))
                peso_total += 10
            
            # Temperatura del suelo
            if 'temperatura_suelo_promedio' in resultados["indices"]:
                temp_suelo = resultados["indices"]["temperatura_suelo_promedio"]
                puntaje += 20 * (1 - min(1, abs(temp_suelo - 20) / 15))
                peso_total += 20
            
            # Calcular porcentaje final
            idoneidad[cultivo] = round(puntaje / max(1, peso_total) * 100) if peso_total > 0 else 50
        
        # Preparar respuesta
        perfil = {
            "coordenadas": {
                "latitud": lat,
                "longitud": lon
            },
            "indices": resultados["indices"],
            "recomendaciones_generales": resultados["recomendaciones"],
            "idoneidad_cultivos": idoneidad
        }
        
        return jsonify(perfil)
    
    except Exception as e:
        return jsonify({"error": f"Error al generar perfil agroclimático: {str(e)}"}), 500

if __name__ == '__main__':
    # Asegurarse de que exista el directorio temporal
    if not os.path.exists('temp_data'):
        os.makedirs('temp_data')
    
    # Iniciar servidor
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 