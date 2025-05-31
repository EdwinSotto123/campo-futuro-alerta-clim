import requests
import pandas as pd
import json
from datetime import datetime, timedelta
from math import radians, cos, sin, asin, sqrt

# FIRMS MAP KEY 
MAP_KEY = '5b33c76b88ff4059647daa35e91856d8'

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    # Radius of earth in kilometers is 6371
    km = 6371 * c
    return km

def get_fires_data(latitude, longitude, radius_km=20, days=3, verbose=False):
    """
    Obtiene datos de incendios de múltiples fuentes para consumir como JSON
    
    Args:
        latitude (float): Latitud del punto de referencia
        longitude (float): Longitud del punto de referencia
        radius_km (float): Radio de búsqueda en kilómetros
        days (int): Número de días a buscar hacia atrás
        verbose (bool): Si es True, muestra mensajes de progreso
    
    Returns:
        dict: Objeto JSON estructurado con información de incendios
    """
    if verbose:
        print(f"Buscando incendios cerca de: Lat {latitude}, Lon {longitude}")
        print(f"Radio de búsqueda: {radius_km} km, Últimos {days} días")
    
    # Calculate a bounding box for the initial query
    degree_buffer = radius_km / 111.0
    
    # Create bounding box coordinates
    min_lat = latitude - degree_buffer
    max_lat = latitude + degree_buffer
    min_lon = longitude - degree_buffer
    max_lon = longitude + degree_buffer
    
    # Format the area parameter for the FIRMS API
    area = f"{min_lon},{min_lat},{max_lon},{max_lat}"
    
    # Define all data sources to check
    datasets = [
        "VIIRS_NOAA20_NRT",  # VIIRS on NOAA-20 satellite
        "VIIRS_SNPP_NRT",    # VIIRS on Suomi NPP satellite
        "MODIS_NRT"          # MODIS (Terra and Aqua satellites)
    ]
    
    all_fires = []
    sources_info = {}
    
    # Get today and yesterday dates for active fire detection
    today = datetime.now().strftime('%Y-%m-%d')
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    
    # Try each data source
    for dataset in datasets:
        if verbose:
            print(f"\nConsultando fuente: {dataset}...")
        
        url = f'https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/{dataset}/{area}/{days}'
        
        try:
            # Get data from FIRMS API
            df = pd.read_csv(url)
            
            if df.empty:
                if verbose:
                    print(f"- No se encontraron incendios en {dataset}")
                sources_info[dataset] = 0
                continue
                
            # Process date formats depending on the dataset
            if dataset == "MODIS_NRT":
                # Convert acq_time to string with leading zeros
                df['acq_time'] = df['acq_time'].apply(lambda x: str(x).zfill(4))
            else:
                # VIIRS format
                df['acq_time'] = df['acq_time'].apply(lambda x: str(x).zfill(4))
            
            # Calculate distance for each fire
            dataset_fires = []
            for _, fire in df.iterrows():
                distance = haversine(longitude, latitude, fire['longitude'], fire['latitude'])
                if distance <= radius_km:
                    # Get acquisition date
                    acq_date = fire['acq_date']
                    
                    # Format time
                    acq_time_str = str(fire['acq_time']).zfill(4)
                    acq_time = f"{acq_time_str[:2]}:{acq_time_str[2:]}"
                    
                    # Determine confidence level
                    if 'confidence' in fire:
                        confidence = fire['confidence']
                        if isinstance(confidence, str):
                            if confidence == 'n':
                                confidence_desc = "Nominal"
                                confidence_val = 50
                            elif confidence == 'l':
                                confidence_desc = "Baja"
                                confidence_val = 30
                            elif confidence == 'h':
                                confidence_desc = "Alta"
                                confidence_val = 80
                            else:
                                confidence_desc = str(confidence)
                                confidence_val = 50
                        else:
                            # For numeric confidence values
                            confidence_desc = f"{confidence}%"
                            confidence_val = confidence
                    else:
                        confidence_desc = "N/A"
                        confidence_val = 0
                    
                    # Check if this is today's or yesterday's fire (active)
                    is_active = acq_date in [today, yesterday]
                    
                    # FRP (Fire Radiative Power) - indicates fire intensity
                    frp = fire.get('frp', 0)
                    if pd.isna(frp):
                        frp = 0
                    
                    # Create standardized fire data object
                    fire_data = {
                        "id": f"{dataset}_{acq_date}_{acq_time}_{fire['latitude']}_{fire['longitude']}",
                        "source": dataset,
                        "latitude": float(fire['latitude']),
                        "longitude": float(fire['longitude']),
                        "distancia_km": round(distance, 2),
                        "fecha": acq_date,
                        "hora": acq_time,
                        "fecha_deteccion": f"{acq_date}T{acq_time}:00",
                        "estado": "activo" if is_active else "inactivo",
                        "confianza": {
                            "valor": confidence_val,
                            "descripcion": confidence_desc
                        },
                        "intensidad": float(frp),
                        "periodo": "día" if fire.get('daynight', 'D') == 'D' else "noche"
                    }
                    
                    dataset_fires.append(fire_data)
            
            # Add to overall results
            all_fires.extend(dataset_fires)
            sources_info[dataset] = len(dataset_fires)
            
            if verbose:
                print(f"- Encontrados {len(dataset_fires)} incendios en {dataset}")
                
        except Exception as e:
            if verbose:
                print(f"Error consultando {dataset}: {str(e)}")
            sources_info[dataset] = f"Error: {str(e)}"
    
    # Sort all fires by distance
    all_fires.sort(key=lambda x: x["distancia_km"])
    
    # Count active fires (today/yesterday)
    active_fires = [fire for fire in all_fires if fire["estado"] == "activo"]
    
    # Build the response JSON
    response_json = {
        "ubicacion": {
            "latitud": latitude,
            "longitud": longitude,
            "radio_km": radius_km
        },
        "consulta": {
            "fecha": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "dias_consultados": days,
            "fuentes": list(sources_info.keys())
        },
        "resultados": {
            "total_incendios": len(all_fires),
            "incendios_activos": len(active_fires),
            "fuentes_datos": sources_info
        },
        "incendios_forestales": all_fires
    }
    
    # Optional verbose output
    if verbose:
        print("\n======= RESUMEN DE BÚSQUEDA DE INCENDIOS =======")
        print(f"Total de incendios encontrados: {len(all_fires)}")
        print(f"Incendios ACTIVOS (hoy/ayer): {len(active_fires)}")
        
        for source, count in sources_info.items():
            print(f"- {source}: {count} incendios")
        
        if active_fires:
            print("\n🔥 INCENDIOS ACTIVOS 🔥")
            for i, fire in enumerate(active_fires[:5]):
                print(f"{i+1}. Fuente: {fire['source']} | Distancia: {fire['distancia_km']} km | Fecha: {fire['fecha']} | Hora: {fire['hora']}")
    
    return response_json

def get_fires_json(latitude, longitude, radius_km=20, days=3):
    """
    Función para usar en un endpoint - devuelve un string JSON
    """
    results = get_fires_data(latitude, longitude, radius_km, days)
    return json.dumps(results, indent=2)

# Función para crear un endpoint Flask (ejemplo)
def create_fires_endpoint(app):
    """
    Crea un endpoint en una aplicación Flask para consultar incendios
    
    Ejemplo de uso:
    
    from flask import Flask, jsonify, request
    app = Flask(__name__)
    create_fires_endpoint(app)
    
    # Endpoint: /api/fires?lat=-11.21822&lon=-77.2971&radius=20&days=3
    """
    @app.route('/api/fires', methods=['GET'])
    def fires_endpoint():
        from flask import jsonify, request
        
        # Get parameters from query string
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        radius = request.args.get('radius', default=20, type=float)
        days = request.args.get('days', default=3, type=int)
        
        # Validate parameters
        if lat is None or lon is None:
            return jsonify({
                "error": "Se requieren los parámetros 'lat' y 'lon'"
            }), 400
        
        # Get fires data
        result = get_fires_data(lat, lon, radius, days)
        
        # Return JSON response
        return jsonify(result)

# Ejemplo de uso directo (para pruebas)
if __name__ == "__main__":
    # Coordenadas de ejemplo
    latitude = -11.21822
    longitude = -77.2971
    radius_km = 20
    days = 3
    
    # Obtener datos (modo verbose para ver el progreso)
    result_json = get_fires_data(latitude, longitude, radius_km, days, verbose=True)
    
    # Guardar en un archivo para inspección
    with open('incendios_forestales.json', 'w', encoding='utf-8') as f:
        json.dump(result_json, f, ensure_ascii=False, indent=2)
    
    print("\nDatos guardados en 'incendios_forestales.json'")


1. INCENDIOS ACTIVOS cerca
2. temperature_2m
3. ESTADO DE CIELO: Niebla, NUBLADO, etc
4. 