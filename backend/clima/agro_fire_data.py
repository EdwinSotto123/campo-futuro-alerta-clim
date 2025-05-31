import requests
import pandas as pd
import json
import numpy as np
from datetime import datetime, timedelta
from math import radians, cos, sin, asin, sqrt
import pytz
import io
from PIL import Image
import matplotlib.pyplot as plt
import base64

# API Keys and Constants
FIRMS_MAP_KEY = '5b33c76b88ff4059647daa35e91856d8'
OPENMETEO_API_URL = "https://api.open-meteo.com/v1/forecast"
# NASA Earth Data API key - Get yours at https://earthdata.nasa.gov/
NASA_EARTHDATA_KEY = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6ImVkd2luMTQxNCIsImV4cCI6MTc1MzkxMzU4NywiaWF0IjoxNzQ4NzI5NTg3LCJpc3MiOiJodHRwczovL3Vycy5lYXJ0aGRhdGEubmFzYS5nb3YiLCJpZGVudGl0eV9wcm92aWRlciI6ImVkbF9vcHMiLCJhY3IiOiJlZGwiLCJhc3N1cmFuY2VfbGV2ZWwiOjN9.umJGLO1aX85vRqQJNNo2s4xT_GUgAwGXkjl-MBUx8DI4eT_jvnMo-yMquKvk6jGj04tH9DMx-p0_zIeDzFHtDqUhNSekzuovmKeSgV8wSs38-lHLR7qYt6zZihaT4QvGqUH8o7zKGoCSaF0hieFxAgComGvK_32iLsXuxJcv9jIHgCvfwGUkTPWL_SnryQuzlWVN4txj85WepzTTy8zO6Yeho0oIfLoLOlHCmxhuCjMNRFRZpQf-SW8CdSCCqT0P7k3RMv02lXjtdjNl22Sx5s2tKzf1MrEShQyR1u_PBLFASPDjF_39bBb0BhjfEmOG0yfHXgzDo_GsJC1SOWeLNg'  # Add your key if needed

# Custom JSON encoder to handle NumPy types
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.integer, np.int64, np.int32, np.int16, np.int8)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64, np.float32)):
            return float(obj)
        elif isinstance(obj, (np.ndarray,)):
            return obj.tolist()
        elif isinstance(obj, np.bool_):
            return bool(obj)
        elif pd.isna(obj):
            return None
        return super(NumpyEncoder, self).default(obj)

def haversine(lon1, lat1, lon2, lat2):
    """Calculate great circle distance between two points in kilometers"""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return 6371 * c  # Earth radius in km

def get_weather_code_description(code):
    """Translate weather codes to Spanish descriptions"""
    weather_codes = {
        0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado",
        3: "Nublado", 45: "Niebla", 48: "Niebla con escarcha",
        51: "Llovizna ligera", 53: "Llovizna moderada", 55: "Llovizna intensa",
        61: "Lluvia ligera", 63: "Lluvia moderada", 65: "Lluvia intensa",
        80: "Chubascos ligeros", 81: "Chubascos moderados", 82: "Chubascos intensos",
        95: "Tormenta eléctrica", 96: "Tormenta con granizo ligero", 99: "Tormenta con granizo intenso"
    }
    return weather_codes.get(code, f"Desconocido (código {code})")

def get_wind_direction(degrees):
    """Convert wind direction degrees to cardinal directions"""
    directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", 
                 "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO", "N"]
    index = round(degrees / 22.5)
    return directions[index % 16]

def get_fires_data(latitude, longitude, radius_km=20, days=3, verbose=False):
    """Get forest fire data from NASA FIRMS API"""
    if verbose:
        print(f"Buscando incendios cerca de: Lat {latitude}, Lon {longitude}")
    
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
    datasets = ["VIIRS_NOAA20_NRT", "VIIRS_SNPP_NRT", "MODIS_NRT"]
    
    all_fires = []
    sources_info = {}
    
    # Get today and yesterday dates for active fire detection
    today = datetime.now().strftime('%Y-%m-%d')
    yesterday = (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d')
    
    # Try each data source
    for dataset in datasets:
        if verbose:
            print(f"\nConsultando fuente: {dataset}...")
        
        url = f'https://firms.modaps.eosdis.nasa.gov/api/area/csv/{FIRMS_MAP_KEY}/{dataset}/{area}/{days}'
        
        try:
            # Get data from FIRMS API
            df = pd.read_csv(url)
            
            if df.empty:
                if verbose:
                    print(f"- No se encontraron incendios en {dataset}")
                sources_info[dataset] = 0
                continue
                
            # Process date formats
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
    
    # Build the response
    response_data = {
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
    
    if verbose:
        print(f"\nTotal de incendios encontrados: {len(all_fires)}")
        print(f"Incendios ACTIVOS (hoy/ayer): {len(active_fires)}")
    
    return response_data

def get_agroclimatic_data(latitude, longitude, timezone="UTC", days=2, verbose=False):
    """Get agroclimatic data from Open-Meteo API"""
    if verbose:
        print(f"Obteniendo datos agroclimáticos para: Lat {latitude}, Lon {longitude}")
    
    # Parámetros horarios
    hourly_params = [
        "temperature_2m", "relative_humidity_2m", "dew_point_2m", "precipitation",
        "precipitation_probability", "rain", "wind_speed_10m", "wind_direction_10m", 
        "surface_pressure", "visibility", "uv_index", "weather_code", "is_day"
    ]
    
    # Parámetros diarios
    daily_params = [
        "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "rain_sum",
        "precipitation_hours", "sunrise", "sunset", "uv_index_max", 
        "daylight_duration", "et0_fao_evapotranspiration_sum"
    ]
    
    # Parámetros de suelo
    soil_params = [
        "soil_temperature_0cm", "soil_temperature_6cm", 
        "soil_moisture_0_1cm", "soil_moisture_1_3cm"
    ]
    
    try:
        # Request main weather data
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": ",".join(hourly_params),
            "daily": ",".join(daily_params),
            "timezone": timezone,
            "forecast_days": days
        }
        
        response = requests.get(OPENMETEO_API_URL, params=params)
        
        if response.status_code != 200:
            if verbose:
                print(f"Error en la API: {response.status_code}")
            return {"error": f"Error en la API: {response.status_code}"}
        
        main_data = response.json()
        
        # Request soil data
        soil_params_req = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": ",".join(soil_params),
            "timezone": timezone
        }
        
        soil_response = requests.get(OPENMETEO_API_URL, params=soil_params_req)
        soil_data = soil_response.json() if soil_response.status_code == 200 else None
        
        # Process the data
        hourly_df = pd.DataFrame(main_data['hourly'])
        daily_df = pd.DataFrame(main_data['daily'])
        
        # Convert time to datetime
        hourly_df['time'] = pd.to_datetime(hourly_df['time'])
        daily_df['time'] = pd.to_datetime(daily_df['time'])
        
        # Find the current hour data
        now = datetime.now(pytz.timezone(timezone))
        hourly_df['diff'] = abs((hourly_df['time'] - pd.Timestamp(now.replace(tzinfo=None))).dt.total_seconds())
        current_hour_index = hourly_df['diff'].idxmin()
        current_hour_data = hourly_df.loc[current_hour_index].to_dict()
        
        # Process soil data if available
        soil_current = {}
        if soil_data and 'hourly' in soil_data:
            soil_df = pd.DataFrame(soil_data['hourly'])
            soil_df['time'] = pd.to_datetime(soil_df['time'])
            soil_df['diff'] = abs((soil_df['time'] - pd.Timestamp(now.replace(tzinfo=None))).dt.total_seconds())
            soil_current_index = soil_df['diff'].idxmin()
            
            for param in soil_params:
                if param in soil_df.columns:
                    soil_current[param] = soil_df.loc[soil_current_index, param]
        
        # Calculate agricultural indices
        agricultural_indices = {}
        
        # GDD - Growing Degree Days
        if 'temperature_2m_max' in daily_df and 'temperature_2m_min' in daily_df:
            temp_base = 10  # Base temperature for many crops
            day_temp = daily_df.iloc[0]
            gdd = ((day_temp['temperature_2m_max'] + day_temp['temperature_2m_min']) / 2) - temp_base
            agricultural_indices['gdd'] = max(0, gdd)
        
        # Water stress index (simplified)
        if 'precipitation_sum' in daily_df and 'temperature_2m_max' in daily_df:
            day_data = daily_df.iloc[0]
            agricultural_indices['estres_hidrico'] = day_data['precipitation_sum'] / (day_data['temperature_2m_max'] + 1)
        
        # Frost risk
        if 'temperature_2m_min' in daily_df:
            min_temp = daily_df.iloc[0]['temperature_2m_min']
            agricultural_indices['riesgo_heladas'] = 'Alto' if min_temp < 2 else 'Medio' if min_temp < 5 else 'Bajo'
        
        # Calculate crop risks
        crop_risks = {}
        
        # Frost risk
        if 'temperature_2m_min' in daily_df and daily_df.iloc[0]['temperature_2m_min'] < 2:
            min_temp = daily_df.iloc[0]['temperature_2m_min']
            crop_risks['helada'] = {
                'nivel': 'Alto' if min_temp < 0 else 'Medio',
                'descripcion': 'Riesgo de daño a cultivos sensibles al frío'
            }
        
        # Drought risk
        if 'precipitation_sum' in daily_df and 'et0_fao_evapotranspiration_sum' in daily_df:
            day_data = daily_df.iloc[0]
            balance = day_data['precipitation_sum'] - day_data['et0_fao_evapotranspiration_sum']
            if balance < -5:
                crop_risks['sequia'] = {
                    'nivel': 'Alto' if balance < -10 else 'Medio',
                    'descripcion': 'Déficit hídrico que puede afectar el desarrollo del cultivo'
                }
        
        # Excess moisture risk
        if 'precipitation_sum' in daily_df and daily_df.iloc[0]['precipitation_sum'] > 20:
            precip = daily_df.iloc[0]['precipitation_sum']
            crop_risks['exceso_humedad'] = {
                'nivel': 'Alto' if precip > 40 else 'Medio',
                'descripcion': 'El exceso de humedad puede favorecer enfermedades fúngicas'
            }
        
        # UV radiation risk
        if 'uv_index_max' in daily_df and daily_df.iloc[0]['uv_index_max'] > 8:
            uv = daily_df.iloc[0]['uv_index_max']
            crop_risks['radiacion_uv'] = {
                'nivel': 'Alto' if uv > 10 else 'Medio',
                'descripcion': 'La radiación UV intensa puede causar quemaduras en hojas y frutos'
            }
        
        # Prepare daily forecast data
        daily_forecast = []
        for _, day in daily_df.iterrows():
            day_data = {
                "fecha": day['time'].strftime("%Y-%m-%d"),
                "temperatura_maxima": day['temperature_2m_max'],
                "temperatura_minima": day['temperature_2m_min'],
                "precipitacion": day['precipitation_sum'],
                "horas_precipitacion": day['precipitation_hours'],
                "indice_uv_max": day['uv_index_max'],
                "amanecer": day['sunrise'],
                "atardecer": day['sunset'],
                "duracion_dia": day.get('daylight_duration', 0) / 3600,  # Convert to hours
                "evapotranspiracion": day.get('et0_fao_evapotranspiration_sum', 0)
            }
            daily_forecast.append(day_data)
        
        # Prepare hourly forecast (every 3 hours to reduce data size)
        hourly_forecast = []
        for i in range(0, len(hourly_df), 3):
            hour = hourly_df.iloc[i]
            hour_data = {
                "hora": hour['time'].strftime("%Y-%m-%d %H:%M"),
                "temperatura": hour['temperature_2m'],
                "humedad": hour['relative_humidity_2m'],
                "precipitacion": hour['precipitation'],
                "probabilidad_precipitacion": hour.get('precipitation_probability', 0),
                "viento_velocidad": hour['wind_speed_10m'],
                "viento_direccion": hour['wind_direction_10m'],
                "viento_direccion_cardinal": get_wind_direction(hour['wind_direction_10m']),
                "presion": hour['surface_pressure'],
                "indice_uv": hour['uv_index'],
                "codigo_clima": hour['weather_code'],
                "descripcion_clima": get_weather_code_description(hour['weather_code']),
                "es_dia": bool(hour['is_day']),
                "visibilidad": hour.get('visibility', 0)
            }
            hourly_forecast.append(hour_data)
        
        # Construct the final agroclimatic data
        agroclimatic_data = {
            "ubicacion": {
                "latitud": latitude,
                "longitude": longitude,
                "zona_horaria": timezone
            },
            "clima_actual": {
                "hora": current_hour_data['time'].strftime("%Y-%m-%d %H:%M"),
                "temperatura": current_hour_data['temperature_2m'],
                "humedad": current_hour_data['relative_humidity_2m'],
                "punto_rocio": current_hour_data['dew_point_2m'],
                "descripcion": get_weather_code_description(current_hour_data['weather_code']),
                "presion": current_hour_data['surface_pressure'],
                "viento": {
                    "velocidad": current_hour_data['wind_speed_10m'],
                    "direccion": current_hour_data['wind_direction_10m'],
                    "direccion_cardinal": get_wind_direction(current_hour_data['wind_direction_10m'])
                },
                "indice_uv": current_hour_data['uv_index'],
                "visibilidad": current_hour_data.get('visibility', 0)
            },
            "suelo": soil_current,
            "indices_agricolas": agricultural_indices,
            "riesgos_cultivos": crop_risks,
            "pronostico_diario": daily_forecast,
            "pronostico_horario": hourly_forecast
        }
        
        return agroclimatic_data
        
    except Exception as e:
        if verbose:
            print(f"Error obteniendo datos agroclimáticos: {str(e)}")
        return {"error": str(e)}

def get_glam_ndvi_data(latitude, longitude, radius_km=10, verbose=False):
    """
    Obtiene datos NDVI del API GLAM de NASA basado en coordenadas geográficas.
    Usa el ID específico para Perú (28434) para obtener datos reales.
    
    Args:
        latitude (float): Latitud del punto central
        longitude (float): Longitud del punto central
        radius_km (float): Radio de búsqueda aproximado en kilómetros
        verbose (bool): Si es True, muestra mensajes de progreso
    
    Returns:
        dict: Objeto con datos de NDVI y otros índices de vegetación
    """
    if verbose:
        print(f"Consultando API GLAM para índices de vegetación en Perú: Lat {latitude}, Lon {longitude}")
    
    # Inicializar respuesta
    vegetation_data = {
        "indices": {},
        "anomalias": {},
        "metadata": {
            "ubicacion": {
                "latitud": latitude,
                "longitud": longitude,
                "radio_km": radius_km
            },
            "fecha_consulta": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "fuentes": ["NASA GLAM/GIMMS NDVI"]
        }
    }
    
    try:
        # Obtener el año actual y el anterior para comparación
        current_year = datetime.now().year
        prev_year = current_year - 1
        
        # Configurar parámetros para la API GLAM
        # Usamos la versión más reciente (v16), satélite MODIS Terra (MOD) y NDVI como capa
        params = {
            "version": "v16",
            "sat": "MOD",  # MODIS Terra
            "layer": "NDVI",
            "shape": "ADM",  # Administrative boundaries
            "ids": "28434",  # ID específico para Perú
            "ts_type": "seasonal",  # Datos estacionales
            "format": "csv"
        }
        
        # Agregar años para comparación
        # NOTA: Necesitamos agregar cada año como parámetro separado en la URL
        # pero la función requests.get maneja esto automáticamente si usamos una lista
        params["years"] = [current_year, prev_year]
        
        # Configurar los meses (por defecto, últimos 6 meses)
        current_month = datetime.now().month
        start_month = max(1, current_month - 6)
        params["start_month"] = start_month
        params["num_months"] = min(12, current_month - start_month + 7)
        
        # URL de la API GLAM
        glam_url = "https://glam1.gsfc.nasa.gov/api/gettbl/v4"
        
        if verbose:
            print(f"Consultando API GLAM con parámetros: {params}")
            print(f"URL: {glam_url}")
        
        # Hacer la solicitud a la API
        response = requests.get(glam_url, params=params)
        
        if response.status_code == 200:
            # Procesar los datos CSV
            try:
                # Guardar respuesta en un archivo temporal para debugging
                if verbose:
                    with open('glam_response.csv', 'wb') as f:
                        f.write(response.content)
                    print("Respuesta guardada en glam_response.csv")
                
                # Convertir respuesta a DataFrame
                df = pd.read_csv(io.StringIO(response.content.decode('utf-8')))
                
                if verbose:
                    print(f"Datos recibidos de GLAM: {len(df)} registros")
                    print(f"Columnas: {df.columns.tolist()}")
                
                # Extraer los valores NDVI más recientes
                if not df.empty:
                    # Procesar los datos según la estructura real
                    # Normalmente GLAM devuelve columnas como 'year', 'month', 'ndvi', etc.
                    
                    # Extraer NDVI y otros índices
                    for column in df.columns:
                        if column.lower() == 'ndvi':
                            ndvi_values = df[column].dropna()
                            if len(ndvi_values) > 0:
                                ndvi_mean = float(ndvi_values.mean())
                                ndvi_min = float(ndvi_values.min())
                                ndvi_max = float(ndvi_values.max())
                                
                                # Agregar a la respuesta
                                vegetation_data["indices"]["ndvi"] = {
                                    "valor": round(ndvi_mean, 3),
                                    "min": round(ndvi_min, 3),
                                    "max": round(ndvi_max, 3),
                                    "descripcion": "Índice de Vegetación de Diferencia Normalizada",
                                    "fuente": "NASA GLAM/MODIS"
                                }
                                
                                # Estimar EVI basado en NDVI (relación aproximada)
                                vegetation_data["indices"]["evi"] = {
                                    "valor": round(ndvi_mean * 0.85, 3),
                                    "descripcion": "Índice de Vegetación Mejorado (estimado a partir de NDVI)",
                                    "fuente": "NASA GLAM/MODIS (derivado)"
                                }
                                
                                # Calcular anomalía si hay datos de años anteriores
                                if 'year' in df.columns and len(df['year'].unique()) > 1:
                                    current_ndvi = df[df['year'] == current_year][column].mean()
                                    prev_ndvi = df[df['year'] == prev_year][column].mean()
                                    
                                    if not pd.isna(current_ndvi) and not pd.isna(prev_ndvi):
                                        anomalia = float(current_ndvi - prev_ndvi)
                                        vegetation_data["anomalias"]["ndvi"] = {
                                            "valor": round(anomalia, 3),
                                            "descripcion": f"Diferencia respecto al año {prev_year}",
                                            "periodo_referencia": f"{prev_year}-{current_year}"
                                        }
                                
                                # Clasificar estado de vegetación basado en NDVI
                                estado, descripcion = clasificar_vegetacion_por_ndvi(ndvi_mean)
                                vegetation_data["estado_vegetacion"] = {
                                    "clasificacion": estado,
                                    "descripcion": descripcion,
                                    "ndvi": round(ndvi_mean, 3)
                                }
                                
                                # Calcular índice de estrés hídrico (inverso del NDVI normalizado)
                                # El estrés hídrico está inversamente relacionado con el NDVI
                                # NDVI alto -> bajo estrés hídrico
                                # NDVI bajo -> alto estrés hídrico
                                estres_hidrico = max(0, min(1, 1 - (ndvi_mean / max(0.8, ndvi_max))))
                                nivel_estres, desc_estres = clasificar_estres_hidrico(estres_hidrico)
                                
                                vegetation_data["estres_hidrico"] = {
                                    "indice": round(estres_hidrico, 2),
                                    "nivel": nivel_estres,
                                    "descripcion": desc_estres,
                                    "fuente": "Calculado a partir de NDVI (NASA GLAM)"
                                }
                                
                                # Intentar encontrar y agregar otros índices si están disponibles
                                for potential_index in ['evi', 'lai', 'fpar']:
                                    if potential_index in df.columns:
                                        values = df[potential_index].dropna()
                                        if len(values) > 0:
                                            mean_value = float(values.mean())
                                            vegetation_data["indices"][potential_index] = {
                                                "valor": round(mean_value, 3),
                                                "descripcion": get_index_description(potential_index),
                                                "fuente": "NASA GLAM/MODIS"
                                            }
                        elif column.lower() in ['lai', 'fpar', 'evi']:
                            # Procesar otros índices si están disponibles directamente
                            index_name = column.lower()
                            values = df[column].dropna()
                            if len(values) > 0:
                                mean_value = float(values.mean())
                                vegetation_data["indices"][index_name] = {
                                    "valor": round(mean_value, 3),
                                    "descripcion": get_index_description(index_name),
                                    "fuente": "NASA GLAM/MODIS"
                                }
                    
                    # Si no encontramos NDVI, buscar cualquier columna que pueda contener datos de vegetación
                    if "ndvi" not in vegetation_data["indices"]:
                        for column in df.columns:
                            # Buscar columnas que podrían contener datos de vegetación
                            if any(veg_term in column.lower() for veg_term in ['ndvi', 'vegetation', 'veg', 'index']):
                                values = df[column].dropna()
                                if len(values) > 0:
                                    mean_value = float(values.mean())
                                    vegetation_data["indices"]["vegetation_index"] = {
                                        "valor": round(mean_value, 3),
                                        "descripcion": f"Índice de vegetación ({column})",
                                        "fuente": "NASA GLAM/MODIS"
                                    }
                                    
                                    # Ya que encontramos un índice, usarlo para estimar el estado de vegetación
                                    if "estado_vegetacion" not in vegetation_data:
                                        # Normalizar el valor para usarlo con nuestra función de clasificación
                                        # Asumimos que valores más altos indican mejor vegetación
                                        norm_value = min(1, max(0, mean_value))
                                        estado, descripcion = clasificar_vegetacion_por_ndvi(norm_value)
                                        vegetation_data["estado_vegetacion"] = {
                                            "clasificacion": estado,
                                            "descripcion": descripcion,
                                            "valor_indice": round(mean_value, 3),
                                            "fuente": f"Basado en {column}"
                                        }
                                    break
                else:
                    if verbose:
                        print("La respuesta de GLAM no contiene datos")
                    vegetation_data["error"] = "La respuesta de GLAM no contiene datos"
            except Exception as e:
                if verbose:
                    print(f"Error procesando datos de GLAM: {str(e)}")
                
                # Intentar guardar la respuesta cruda para depuración
                with open('glam_error_response.txt', 'wb') as f:
                    f.write(response.content)
                
                vegetation_data["error"] = f"Error procesando datos GLAM: {str(e)}"
        else:
            if verbose:
                print(f"Error consultando API GLAM: {response.status_code}")
                print(f"Respuesta: {response.text}")
            
            # Guardar respuesta de error para depuración
            with open('glam_error_response.txt', 'wb') as f:
                f.write(response.content)
            
            vegetation_data["error"] = f"Error API GLAM: {response.status_code}"
    
    except Exception as e:
        if verbose:
            print(f"Error general consultando GLAM: {str(e)}")
        
        vegetation_data["error"] = str(e)
    
    return vegetation_data

def get_index_description(index_name):
    """Devuelve la descripción para diferentes índices de vegetación"""
    descriptions = {
        'ndvi': "Índice de Vegetación de Diferencia Normalizada",
        'evi': "Índice de Vegetación Mejorado",
        'lai': "Índice de Área Foliar",
        'fpar': "Fracción de Radiación Fotosintéticamente Activa"
    }
    return descriptions.get(index_name.lower(), f"Índice {index_name}")

def clasificar_vegetacion_por_ndvi(ndvi_value):
    """Clasifica el estado de vegetación basado en el valor NDVI"""
    if ndvi_value < 0:
        return "No vegetación", "Suelo desnudo, agua o infraestructura"
    elif ndvi_value < 0.2:
        return "Pobre", "Vegetación escasa o estresada"
    elif ndvi_value < 0.4:
        return "Regular", "Vegetación moderada"
    elif ndvi_value < 0.6:
        return "Bueno", "Vegetación saludable"
    else:
        return "Excelente", "Vegetación muy densa y saludable"

def clasificar_estres_hidrico(estres_value):
    """Clasifica el nivel de estrés hídrico basado en el índice"""
    if estres_value < 0.3:
        return "Bajo", "Bajo riesgo de estrés hídrico"
    elif estres_value < 0.6:
        return "Moderado", "Vigilar condiciones de humedad del suelo"
    else:
        return "Alto", "Posible déficit hídrico significativo"

def get_vegetation_indices(latitude, longitude, radius_km=10, verbose=False):
    """
    Obtiene índices de vegetación utilizando la API GLAM
    basados en la latitud y longitud proporcionadas
    """
    if verbose:
        print(f"Obteniendo índices de vegetación para: Lat {latitude}, Lon {longitude}")
    
    # Obtener datos de GLAM directamente
    vegetation_data = get_glam_ndvi_data(latitude, longitude, radius_km, verbose)
    
    # No usamos datos simulados, solo devolvemos lo que obtengamos de la API
    return vegetation_data

def generate_unified_data_for_firestore(latitude, longitude, timezone="America/Lima", radius_km=20, days=3, verbose=False):
    """
    Generate a unified data structure for Firestore that combines 
    agroclimatic data, forest fire information and vegetation indices
    """
    # Get current timestamp for the record
    timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    
    # Get all datasets
    agroclimatic_data = get_agroclimatic_data(latitude, longitude, timezone, days, verbose)
    fire_data = get_fires_data(latitude, longitude, radius_km, days, verbose)
    vegetation_data = get_vegetation_indices(latitude, longitude, radius_km, verbose)
    
    # Create a location key for Firestore
    location_id = f"loc_{latitude:.6f}_{longitude:.6f}".replace('.', '_')
    
    # Create the unified structure
    unified_data = {
        "location_id": location_id,
        "timestamp": timestamp,
        "metadata": {
            "latitud": latitude,
            "longitud": longitude,
            "timezone": timezone,
            "radio_busqueda_km": radius_km,
            "dias_pronostico": days,
            "fecha_actualizacion": timestamp
        },
        "agroclimatico": agroclimatic_data,
        "incendios": fire_data,
        "vegetacion": vegetation_data
    }
    
    # Create a daily collection path suggestion
    date_str = datetime.now().strftime("%Y%m%d")
    collection_path = f"agro_fire_data/{date_str}/locations"
    document_id = location_id
    
    # Add Firestore path recommendations
    unified_data["_firestore_info"] = {
        "suggested_collection": collection_path,
        "suggested_document_id": document_id,
        "collection_strategy": "Daily collection with location documents"
    }
    
    return unified_data

def save_to_json(data, filename):
    """Save data to a JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, cls=NumpyEncoder)
    return filename


# Example usage
if __name__ == "__main__":
    # Example coordinates (Lima, Peru)
    latitude = -12.04
    longitude = -77.03
    timezone = "America/Lima"
    radius_km = 50
    days = 5
    
    print(f"Generando datos unificados para Lat: {latitude}, Lon: {longitude}")
    
    # Generate unified data
    unified_data = generate_unified_data_for_firestore(
        latitude, longitude, timezone, radius_km, days, verbose=True
    )
    
    # Save to a file
    filename = save_to_json(unified_data, 'agro_fire_unified_data.json')
    print(f"\nDatos unificados guardados en '{filename}'")
