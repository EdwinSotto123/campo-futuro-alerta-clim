import requests
import pandas as pd
from datetime import datetime
import pytz
import json
import locale
from datetime import timedelta

# Intentar configurar locale para español
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')
except:
    try:
        locale.setlocale(locale.LC_TIME, 'es_ES')
    except:
        print("No se pudo configurar el locale en español. Se usarán nombres en inglés.")

# Coordenadas de Lima, Perú (puedes cambiarlas)
latitude = -12.04
longitude = -77.03

# Zona horaria de Perú
peru_timezone = "America/Lima"

# Función para traducir los códigos de clima a texto descriptivo en español
def traducir_weather_code(code):
    weather_codes = {
        0: "Despejado",
        1: "Mayormente despejado",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Niebla",
        48: "Niebla con escarcha",
        51: "Llovizna ligera",
        53: "Llovizna moderada",
        55: "Llovizna intensa",
        56: "Llovizna helada ligera",
        57: "Llovizna helada intensa",
        61: "Lluvia ligera",
        63: "Lluvia moderada",
        65: "Lluvia intensa",
        66: "Lluvia helada ligera",
        67: "Lluvia helada intensa",
        71: "Nevada ligera",
        73: "Nevada moderada",
        75: "Nevada intensa",
        77: "Granizo",
        80: "Chubascos ligeros",
        81: "Chubascos moderados",
        82: "Chubascos intensos",
        85: "Nevadas ligeras",
        86: "Nevadas intensas",
        95: "Tormenta eléctrica",
        96: "Tormenta con granizo ligero",
        99: "Tormenta con granizo intenso"
    }
    return weather_codes.get(code, f"Desconocido (código {code})")

# Función para calcular índices agroclimáticos
def calcular_indices_agroclimaticos(datos):
    """
    Calcula índices agroclimáticos importantes para cultivos
    a partir de datos meteorológicos.
    """
    indices = {}
    
    # GDD - Grados Día de Crecimiento (si tenemos temperatura)
    if 'temperature_2m_min' in datos and 'temperature_2m_max' in datos:
        temp_base = 10  # Temperatura base común para muchos cultivos
        gdd = ((datos['temperature_2m_max'] + datos['temperature_2m_min']) / 2) - temp_base
        indices['gdd'] = max(0, gdd)  # No puede ser negativo
    
    # Índice de estrés hídrico (simplificado)
    if 'precipitation_sum' in datos and 'temperature_2m_max' in datos:
        # Valor aproximado: relación precipitación/temperatura
        indices['estres_hidrico'] = datos['precipitation_sum'] / (datos['temperature_2m_max'] + 1)
    
    # Horas de luz efectiva (calculada a partir de is_day)
    if 'is_day' in datos:
        indices['horas_luz'] = sum(datos['is_day'])
    
    # Riesgo de heladas
    if 'temperature_2m_min' in datos:
        indices['riesgo_heladas'] = 'Alto' if datos['temperature_2m_min'] < 2 else \
                                   'Medio' if datos['temperature_2m_min'] < 5 else 'Bajo'
    
    # Índice de confort del cultivo (simplificado)
    if 'temperature_2m' in datos and 'relative_humidity_2m' in datos:
        temp = datos['temperature_2m']
        hum = datos['relative_humidity_2m']
        # Fórmula simplificada que asume que temperaturas moderadas y humedad media son ideales
        indices['confort_cultivo'] = 100 - abs(temp - 22) - abs(hum - 60)/2
    
    return indices

# Función para obtener la dirección del viento en formato amigable
def obtener_direccion_viento(grados):
    direcciones = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO", "N"]
    indice = round(grados / 22.5)
    return direcciones[indice % 16]

# Función para formatear la fecha en español
def formatear_fecha(fecha):
    try:
        dia_semana = fecha.strftime("%A").lower()
        dia = fecha.day
        mes = fecha.strftime("%B").lower()
        return f"{dia_semana}, {dia} de {mes}"
    except:
        return fecha.strftime("%d/%m/%Y")

# Parámetros por hora que deseamos extraer
hourly_params = [
    "temperature_2m",
    "relative_humidity_2m",
    "dew_point_2m",
    "precipitation",
    "precipitation_probability",
    "rain",
    "showers",
    "snowfall",
    "cloud_cover",
    "cloud_cover_low",
    "cloud_cover_mid",
    "cloud_cover_high",
    "wind_speed_10m",
    "wind_gusts_10m",
    "wind_direction_10m",
    "surface_pressure",
    "visibility",
    "uv_index",
    "weather_code",
    "is_day"
    # Parámetros que pueden requerir suscripción o no estar disponibles
    # "direct_radiation",
    # "diffuse_radiation",
    # "shortwave_radiation",
    # "et0_fao_evapotranspiration",
    # "vapour_pressure_deficit"
]

# Parámetros diarios básicos que sabemos que están disponibles
daily_params_basic = [
    "temperature_2m_max",
    "temperature_2m_min", 
    "precipitation_sum",
    "rain_sum", 
    "snowfall_sum",
    "precipitation_hours",
    "sunrise", 
    "sunset", 
    "uv_index_max"
]

# Parámetros diarios avanzados que podrían no estar disponibles
daily_params_advanced = [
    "daylight_duration",
    "et0_fao_evapotranspiration_sum",
    "direct_radiation_sum",
    "growing_degree_days_base10"
]

# Parámetros de suelo - pueden requerir una suscripción específica
hourly_soil_params = [
    "soil_temperature_0cm",
    "soil_temperature_6cm",
    "soil_moisture_0_1cm",
    "soil_moisture_1_3cm"
    # Parámetros que pueden requerir suscripción o no estar disponibles
    # "soil_temperature_18cm",
    # "soil_temperature_54cm",
    # "soil_moisture_3_9cm",
    # "soil_moisture_9_27cm",
    # "soil_moisture_27_81cm"
]

# Construir solicitud a la API - Primero probemos con parámetros básicos
url = "https://api.open-meteo.com/v1/forecast"

# Función para mostrar errores de manera más informativa
def handle_api_error(response):
    print(f"Error HTTP: {response.status_code}")
    try:
        error_data = response.json()
        print(f"Mensaje de error de la API: {json.dumps(error_data, indent=2)}")
    except:
        print(f"Respuesta del servidor: {response.text}")

# Función para calcular índices de riesgo para cultivos
def calcular_riesgo_cultivo(datos):
    riesgos = {}
    
    # Riesgo de helada
    if 'temperature_2m_min' in datos and datos['temperature_2m_min'] < 2:
        riesgos['helada'] = {
            'nivel': 'Alto' if datos['temperature_2m_min'] < 0 else 'Medio',
            'descripcion': 'Riesgo de daño a cultivos sensibles al frío'
        }
    
    # Riesgo de sequía
    if 'precipitation_sum' in datos and 'et0_fao_evapotranspiration_sum' in datos:
        balance_hidrico = datos['precipitation_sum'] - datos['et0_fao_evapotranspiration_sum']
        if balance_hidrico < -5:
            riesgos['sequia'] = {
                'nivel': 'Alto' if balance_hidrico < -10 else 'Medio',
                'descripcion': 'Déficit hídrico que puede afectar el desarrollo del cultivo'
            }
    
    # Riesgo de exceso de humedad/pudrición
    if 'precipitation_sum' in datos and datos['precipitation_sum'] > 20:
        riesgos['exceso_humedad'] = {
            'nivel': 'Alto' if datos['precipitation_sum'] > 40 else 'Medio',
            'descripcion': 'El exceso de humedad puede favorecer enfermedades fúngicas'
        }
    
    # Riesgo por radiación UV
    if 'uv_index_max' in datos and datos['uv_index_max'] > 8:
        riesgos['radiacion_uv'] = {
            'nivel': 'Alto' if datos['uv_index_max'] > 10 else 'Medio',
            'descripcion': 'La radiación UV intensa puede causar quemaduras en hojas y frutos'
        }
    
    # Riesgo por viento
    if 'wind_gusts_10m' in datos and max(datos['wind_gusts_10m']) > 40:
        riesgos['viento'] = {
            'nivel': 'Alto' if max(datos['wind_gusts_10m']) > 60 else 'Medio',
            'descripcion': 'Vientos fuertes pueden causar daño mecánico a cultivos'
        }
    
    return riesgos

# Función para mostrar pronóstico en formato amigable
def mostrar_pronostico_amigable(df):
    # Agrupar por día
    df['fecha'] = df['time'].dt.date
    dias_unicos = df['fecha'].unique()
    
    for fecha in dias_unicos:
        df_dia = df[df['fecha'] == fecha]
        fecha_formateada = formatear_fecha(pd.to_datetime(fecha))
        print(f"\n{fecha_formateada.capitalize()}")
        print("-" * 50)
        
        # Mostrar pronóstico por hora (cada 3 horas para no saturar)
        for i in range(0, len(df_dia), 3):
            if i < len(df_dia):
                fila = df_dia.iloc[i]
                hora = fila['time'].strftime("%H:%M")
                temp = fila['temperature_2m']
                desc = traducir_weather_code(fila['weather_code'])
                
                # Verificar si precipitation_probability está disponible
                prob_lluvia = fila.get('precipitation_probability', 0)
                if pd.isna(prob_lluvia):
                    prob_lluvia = 0
                
                viento_dir = obtener_direccion_viento(fila['wind_direction_10m'])
                viento_vel = fila['wind_speed_10m']
                
                # Información básica
                print(f"{hora}  {desc:20} {temp:4.1f}°C  {prob_lluvia:3.0f}%   {viento_dir} {viento_vel:.1f} km/h")
                
                # Información adicional relevante para cultivos
                info_adicional = []
                
                # Radiación UV (si está disponible)
                if 'uv_index' in fila and not pd.isna(fila['uv_index']):
                    uv = fila['uv_index']
                    nivel_uv = "Bajo" if uv < 3 else "Moderado" if uv < 6 else "Alto" if uv < 8 else "Muy Alto" if uv < 11 else "Extremo"
                    info_adicional.append(f"UV: {nivel_uv} ({uv:.1f})")
                
                # Humedad (relevante para enfermedades fúngicas)
                if 'relative_humidity_2m' in fila:
                    hum = fila['relative_humidity_2m']
                    riesgo_hongos = "Alto" if hum > 85 else "Moderado" if hum > 70 else "Bajo"
                    info_adicional.append(f"Humedad: {hum:.0f}% (Riesgo hongos: {riesgo_hongos})")
                
                # Mostrar información adicional si hay disponible
                if info_adicional:
                    print(f"      {' | '.join(info_adicional)}")

# Función para mostrar condiciones agrícolas específicas
def mostrar_condiciones_agricolas(df_daily, df_hourly):
    print("\n=== CONDICIONES AGRÍCOLAS ===")
    
    # 1. Horas de luz (si tenemos sunrise/sunset)
    if 'sunrise' in df_daily and 'sunset' in df_daily:
        sunrise = pd.to_datetime(df_daily['sunrise'].iloc[0])
        sunset = pd.to_datetime(df_daily['sunset'].iloc[0])
        horas_luz = (sunset - sunrise).total_seconds() / 3600
        print(f"Horas de luz: {horas_luz:.1f} horas")
    elif 'daylight_duration' in df_daily:
        print(f"Horas de luz: {df_daily['daylight_duration'].iloc[0]/3600:.1f} horas")
    
    # 2. Evapotranspiración (relevante para riego)
    if 'et0_fao_evapotranspiration_sum' in df_daily:
        et0 = df_daily['et0_fao_evapotranspiration_sum'].iloc[0]
        print(f"Evapotranspiración: {et0:.1f} mm/día")
        print(f"Recomendación de riego: {max(0, et0-df_daily['precipitation_sum'].iloc[0]):.1f} mm/día")
    
    # 3. Grados-día de crecimiento (GDD)
    if 'growing_degree_days_base10' in df_daily:
        gdd = df_daily['growing_degree_days_base10'].iloc[0]
        print(f"Grados-día de crecimiento (base 10°C): {gdd:.1f}")
    elif 'temperature_2m_max' in df_daily and 'temperature_2m_min' in df_daily:
        t_max = df_daily['temperature_2m_max'].iloc[0]
        t_min = df_daily['temperature_2m_min'].iloc[0]
        t_base = 10  # Base común para muchos cultivos
        gdd = max(0, ((t_max + t_min)/2) - t_base)
        print(f"Grados-día de crecimiento (estimado, base 10°C): {gdd:.1f}")
    
    # 4. Condiciones del suelo
    print("\nCondiciones del suelo:")
    temp_suelo = df_hourly.get('soil_temperature_0cm', df_hourly.get('soil_temperature_6cm', None))
    if temp_suelo is not None:
        temp_suelo_actual = temp_suelo.iloc[df_hourly['diff'].idxmin()]
        print(f"- Temperatura: {temp_suelo_actual:.1f}°C")
        
        # Evaluar condiciones para germinación
        if 10 <= temp_suelo_actual <= 25:
            print("  ✓ Temperatura favorable para germinación de la mayoría de cultivos")
        elif temp_suelo_actual < 10:
            print("  ✗ Temperatura baja para germinación, posible retraso")
        else:
            print("  ⚠ Temperatura alta, monitorear estrés en plántulas")
    
    humedad_suelo = df_hourly.get('soil_moisture_0_1cm', df_hourly.get('soil_moisture_1_3cm', None))
    if humedad_suelo is not None:
        humedad_actual = humedad_suelo.iloc[df_hourly['diff'].idxmin()]
        print(f"- Humedad: {humedad_actual:.1f}m³/m³")
        
        # Evaluar condiciones de humedad
        if 0.2 <= humedad_actual <= 0.4:
            print("  ✓ Humedad adecuada para la mayoría de cultivos")
        elif humedad_actual < 0.2:
            print("  ✗ Suelo seco, considerar riego")
        else:
            print("  ⚠ Suelo muy húmedo, riesgo de anoxia radicular")
    
    # 5. Alertas y riesgos para cultivos
    riesgos_encontrados = []
    
    # Riesgo de heladas
    if 'temperature_2m_min' in df_daily and df_daily['temperature_2m_min'].iloc[0] < 5:
        riesgos_encontrados.append(f"⚠ Riesgo de heladas: {df_daily['temperature_2m_min'].iloc[0]:.1f}°C min")
    
    # Riesgo de golpe de calor
    if 'temperature_2m_max' in df_daily and df_daily['temperature_2m_max'].iloc[0] > 30:
        riesgos_encontrados.append(f"⚠ Riesgo de estrés térmico: {df_daily['temperature_2m_max'].iloc[0]:.1f}°C max")
    
    # Riesgo por precipitación excesiva
    if 'precipitation_sum' in df_daily and df_daily['precipitation_sum'].iloc[0] > 20:
        riesgos_encontrados.append(f"⚠ Precipitación abundante: {df_daily['precipitation_sum'].iloc[0]:.1f}mm")
    
    # Riesgo por radiación UV intensa
    if 'uv_index_max' in df_daily and df_daily['uv_index_max'].iloc[0] > 8:
        riesgos_encontrados.append(f"⚠ Radiación UV intensa: índice {df_daily['uv_index_max'].iloc[0]:.1f}")
    
    if riesgos_encontrados:
        print("\nAlertas para cultivos:")
        for riesgo in riesgos_encontrados:
            print(f"  {riesgo}")

# Probar parámetros para ver cuáles están disponibles
def probar_parametros_avanzados(lat, lon, timezone):
    """
    Prueba incrementalmente los parámetros avanzados para determinar cuáles están disponibles
    """
    params_disponibles = []
    
    print("Probando parámetros diarios avanzados...")
    for param in daily_params_advanced:
        try:
            test_params = {
                "latitude": lat,
                "longitude": lon,
                "daily": param,
                "timezone": timezone,
                "forecast_days": 1
            }
            response = requests.get(url, params=test_params)
            if response.status_code == 200 and param in response.json().get('daily', {}):
                params_disponibles.append(param)
                print(f"✓ Parámetro '{param}' está disponible")
            else:
                print(f"✗ Parámetro '{param}' no está disponible")
        except Exception as e:
            print(f"✗ Error al probar '{param}': {e}")
    
    return params_disponibles

# Obtener datos
try:
    print("Probando parámetros avanzados antes de la solicitud principal...")
    parametros_diarios_disponibles = probar_parametros_avanzados(latitude, longitude, peru_timezone)
    
    # Combinar parámetros básicos con los avanzados disponibles
    daily_params_combinados = daily_params_basic + parametros_diarios_disponibles
    
    print(f"\nEnviando solicitud a la API con {len(daily_params_combinados)} parámetros diarios...")
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ",".join(hourly_params),
        "daily": ",".join(daily_params_combinados),
        "timezone": peru_timezone,  # Usar explícitamente la zona horaria de Perú
        "forecast_days": 2  # Pronóstico para 2 días
    }
    
    response = requests.get(url, params=params)
    
    # Procesar respuesta
    if response.status_code == 200:
        data = response.json()
        print("¡Solicitud exitosa! Procesando datos...")
        
        # Extraer datos horarios
        hourly = data['hourly']
        df_hourly = pd.DataFrame(hourly)
        
        # Extraer datos diarios si están disponibles
        if 'daily' in data:
            daily = data['daily']
            df_daily = pd.DataFrame(daily)
            print("\n=== DATOS DIARIOS DISPONIBLES ===")
            print(f"Columnas disponibles: {df_daily.columns.tolist()}")
        
        # Obtener la zona horaria de los datos
        timezone_str = data.get('timezone', 'UTC')
        
        # Obtener hora actual en la misma zona horaria
        now = datetime.now(pytz.timezone(timezone_str))
        
        # Convertir la columna de tiempo a datetime con la misma zona horaria
        df_hourly['time'] = pd.to_datetime(df_hourly['time']).dt.tz_localize(pytz.timezone(timezone_str))
        
        # Encontrar la fila con la hora más cercana a ahora
        df_hourly['diff'] = (df_hourly['time'] - now).abs()
        closest_row = df_hourly.loc[df_hourly['diff'].idxmin()]
        
        # Mostrar solo la fila más actualizada
        print("\n=== DATO METEOROLÓGICO MÁS RECIENTE ===")
        print(closest_row.drop('diff'))
        
        # Mostrar el pronóstico en formato amigable
        print("\n=== PRONÓSTICO POR HORAS ===")
        mostrar_pronostico_amigable(df_hourly)
        
        # Mostrar condiciones específicas para agricultura
        if 'daily' in data:
            mostrar_condiciones_agricolas(df_daily, df_hourly)
        
        # Ahora intentemos con los parámetros de suelo
        print("\nProbando obtener datos de suelo...")
        params_with_soil = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": ",".join(hourly_soil_params),
            "timezone": peru_timezone  # Usar explícitamente la zona horaria de Perú
        }
        
        soil_response = requests.get(url, params=params_with_soil)
        
        if soil_response.status_code == 200:
            soil_data = soil_response.json()
            if 'hourly' in soil_data and all(param in soil_data['hourly'] for param in hourly_soil_params):
                print("¡Datos de suelo disponibles!")
                df_soil = pd.DataFrame(soil_data['hourly'])
                print(f"Parámetros de suelo disponibles: {df_soil.columns.tolist()}")
                
                # Mostrar datos de suelo más recientes
                df_soil['time'] = pd.to_datetime(df_soil['time'])
                current_soil_data = df_soil.iloc[0]  # Datos más recientes
                
                print("\n=== CONDICIONES ACTUALES DEL SUELO ===")
                if 'soil_temperature_0cm' in current_soil_data:
                    print(f"Temperatura superficial: {current_soil_data['soil_temperature_0cm']:.1f}°C")
                if 'soil_temperature_6cm' in current_soil_data:
                    print(f"Temperatura a 6cm: {current_soil_data['soil_temperature_6cm']:.1f}°C")
                if 'soil_moisture_0_1cm' in current_soil_data:
                    print(f"Humedad superficial: {current_soil_data['soil_moisture_0_1cm']:.3f}m³/m³")
                if 'soil_moisture_1_3cm' in current_soil_data:
                    print(f"Humedad a 1-3cm: {current_soil_data['soil_moisture_1_3cm']:.3f}m³/m³")
            else:
                print("La API respondió, pero algunos parámetros de suelo no están disponibles.")
                if 'hourly' in soil_data:
                    print(f"Parámetros disponibles: {list(soil_data['hourly'].keys())}")
        else:
            print("Error al obtener datos de suelo.")
            handle_api_error(soil_response)
        
    else:
        handle_api_error(response)
except Exception as e:  
    print(f"Error al procesar la solicitud: {e}")
