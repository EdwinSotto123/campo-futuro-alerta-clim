import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Satellite, 
  Globe, 
  CloudRain, 
  Sun, 
  Thermometer,
  Droplets,
  Wind,
  Eye,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Share,
  Settings,
  Filter,
  Search,
  Layers,
  Zap,
  Gauge,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Wifi,
  WifiOff,
  Database,
  Cpu,
  HardDrive,
  Monitor,
  Radar,
  Navigation,
  Target,
  Crosshair,
  Map,
  Compass,
  Mountain,
  TreePine,
  Wheat,
  Leaf,
  Snowflake,
  Flame,
  Shield,
  Info,
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Users
} from "lucide-react";

interface SatelliteData {
  id: string;
  name: string;
  source: 'NASA' | 'SENAMHI' | 'ESA' | 'NOAA';
  type: string;
  lastUpdate: string;
  status: 'active' | 'maintenance' | 'offline';
  coverage: string;
  resolution: string;
}

interface ClimateIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'normal' | 'warning' | 'critical';
  icon: React.ElementType;
  color: string;
}

interface WeatherLayer {
  id: string;
  name: string;
  description: string;
  source: string;
  enabled: boolean;
  opacity: number;
  icon: React.ElementType;
}

const MonitoreoPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('cusco');
  const [selectedLayer, setSelectedLayer] = useState('temperature');
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [mapView, setMapView] = useState('satellite');

  const satelliteData: SatelliteData[] = [
    {
      id: 'modis-terra',
      name: 'MODIS Terra',
      source: 'NASA',
      type: 'Observación Terrestre',
      lastUpdate: '2024-01-15 14:30 UTC',
      status: 'active',
      coverage: 'Global',
      resolution: '250m - 1km'
    },
    {
      id: 'landsat-8',
      name: 'Landsat 8',
      source: 'NASA',
      type: 'Multiespectral',
      lastUpdate: '2024-01-15 13:45 UTC',
      status: 'active',
      coverage: 'Global',
      resolution: '15m - 30m'
    },
    {
      id: 'sentinel-2',
      name: 'Sentinel-2',
      source: 'ESA',
      type: 'Óptico',
      lastUpdate: '2024-01-15 12:20 UTC',
      status: 'active',
      coverage: 'Global',
      resolution: '10m - 60m'
    },
    {
      id: 'goes-16',
      name: 'GOES-16',
      source: 'NOAA',
      type: 'Meteorológico',
      lastUpdate: '2024-01-15 14:45 UTC',
      status: 'active',
      coverage: 'Américas',
      resolution: '0.5km - 2km'
    },
    {
      id: 'senamhi-radar',
      name: 'Red Radar SENAMHI',
      source: 'SENAMHI',
      type: 'Meteorológico',
      lastUpdate: '2024-01-15 14:50 UTC',
      status: 'active',
      coverage: 'Perú',
      resolution: '1km'
    }
  ];

  const climateIndicators: ClimateIndicator[] = [
    {
      id: 'temperature',
      name: 'Temperatura',
      value: 18,
      unit: '°C',
      trend: 'up',
      change: 2.5,
      status: 'normal',
      icon: Thermometer,
      color: 'text-orange-600'
    },
    {
      id: 'humidity',
      name: 'Humedad del Suelo',
      value: 65,
      unit: '%',
      trend: 'down',
      change: -5.2,
      status: 'warning',
      icon: Droplets,
      color: 'text-blue-600'
    },
    {
      id: 'precipitation',
      name: 'Precipitación',
      value: 12,
      unit: 'mm',
      trend: 'down',
      change: -40,
      status: 'critical',
      icon: CloudRain,
      color: 'text-cyan-600'
    },
    {
      id: 'wind',
      name: 'Viento',
      value: 8,
      unit: 'km/h',
      trend: 'stable',
      change: 0,
      status: 'normal',
      icon: Wind,
      color: 'text-gray-600'
    },
    {
      id: 'ndvi',
      name: 'Índice de Vegetación',
      value: 0.7,
      unit: 'NDVI',
      trend: 'up',
      change: 0.1,
      status: 'normal',
      icon: Leaf,
      color: 'text-green-600'
    },
    {
      id: 'soil-temp',
      name: 'Temperatura del Suelo',
      value: 15,
      unit: '°C',
      trend: 'up',
      change: 1.8,
      status: 'normal',
      icon: Mountain,
      color: 'text-brown-600'
    }
  ];

  const weatherLayers: WeatherLayer[] = [
    {
      id: 'temperature',
      name: 'Temperatura Superficial',
      description: 'Datos MODIS Terra/Aqua',
      source: 'NASA',
      enabled: true,
      opacity: 0.7,
      icon: Thermometer
    },
    {
      id: 'vegetation',
      name: 'Índice de Vegetación',
      description: 'NDVI Sentinel-2',
      source: 'ESA',
      enabled: false,
      opacity: 0.6,
      icon: Leaf
    },
    {
      id: 'soil-moisture',
      name: 'Humedad del Suelo',
      description: 'SMAP NASA',
      source: 'NASA',
      enabled: false,
      opacity: 0.8,
      icon: Droplets
    },
    {
      id: 'precipitation',
      name: 'Precipitación',
      description: 'GPM NASA + SENAMHI',
      source: 'NASA/SENAMHI',
      enabled: false,
      opacity: 0.9,
      icon: CloudRain
    },
    {
      id: 'fire-risk',
      name: 'Riesgo de Incendios',
      description: 'MODIS Fire Detection',
      source: 'NASA',
      enabled: false,
      opacity: 0.8,
      icon: Flame
    }
  ];

  const regions = [
    { id: 'cusco', name: 'Cusco - Valle Sagrado', coords: [-13.5319, -71.9675] },
    { id: 'altiplano', name: 'Altiplano - Puno', coords: [-15.8402, -70.0219] },
    { id: 'arequipa', name: 'Arequipa - Valle del Colca', coords: [-16.4090, -71.5375] },
    { id: 'cajamarca', name: 'Cajamarca - Sierra Norte', coords: [-7.1611, -78.5126] },
    { id: 'huancayo', name: 'Huancayo - Valle del Mantaro', coords: [-12.0653, -75.2049] }
  ];

  const refreshData = async () => {
    setIsLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'stable': return <Activity className="h-3 w-3 text-gray-600" />;
      default: return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRealTime) {
        setLastUpdate(new Date());
      }
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, [isRealTime]);
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Satellite className="h-8 w-8 text-agriculture-terracotta" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth bg-clip-text text-transparent">
              Mapa Climático Inteligente
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Monitoreo satelital con IA - IBM Watson Earth Observations
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">NASA + SENAMHI</Badge>
            <Badge className="bg-green-100 text-green-800">Tiempo Real</Badge>
            <Badge className="bg-purple-100 text-purple-800">IA Predictiva</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar región" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Indicadores Climáticos con Interpretación IA */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Indicadores Climáticos - Más compactos */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {climateIndicators.map((indicator) => (
              <motion.div
                key={indicator.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`border-l-4 ${getStatusColor(indicator.status)} h-full`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <indicator.icon className={`h-4 w-4 ${indicator.color}`} />
                      {getTrendIcon(indicator.trend)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{indicator.value}{indicator.unit}</p>
                      <p className="text-xs text-muted-foreground">{indicator.name}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <span className={indicator.trend === 'up' ? 'text-green-600' : indicator.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                          {indicator.change > 0 ? '+' : ''}{indicator.change}% vs mes anterior
                        </span>
                      </div>
                    </div>
              </CardContent>
            </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Panel de Interpretación IA - Más ancho */}
        <div className="xl:col-span-2">
          <Card className="h-full border-2 border-agriculture-gold/30 bg-gradient-to-br from-agriculture-gold/5 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="h-5 w-5 text-agriculture-gold" />
                Interpretación IA
              </CardTitle>
              <CardDescription className="text-sm">
                ¿Qué significan estos datos para tu cultivo?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  🧠 Análisis RAG en Tiempo Real
                </p>
                <p className="text-xs text-blue-700">
                  Te ayudamos a interpretar estos datos y cómo afectan o benefician a tu cultivo
                </p>
              </div>

              <div className="space-y-2">
                <Alert className="p-2">
                  <CheckCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    <strong>18°C:</strong> Temperatura óptima para papa y quinua.
                  </AlertDescription>
                </Alert>

                <Alert className="p-2 bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  <AlertDescription className="text-xs">
                    <strong>65% Humedad:</strong> Nivel bajo. Considera riego por goteo.
                  </AlertDescription>
                </Alert>

                <Alert className="p-2 bg-red-50 border-red-200">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                  <AlertDescription className="text-xs">
                    <strong>12mm Lluvia:</strong> Crítico. Implementa captación urgente.
                  </AlertDescription>
                </Alert>
              </div>

              <Button 
                className="w-full bg-agriculture-terracotta hover:bg-agriculture-earth"
                size="sm"
                onClick={() => {
                  // Lógica para procesar recomendaciones
                }}
              >
                <Target className="h-4 w-4 mr-2" />
                Procesar Recomendación de Cultivos
              </Button>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p className="font-medium">Basado en:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="outline" className="text-xs px-1 py-0">NASA</Badge>
                  <Badge variant="outline" className="text-xs px-1 py-0">SENAMHI</Badge>
                  <Badge variant="outline" className="text-xs px-1 py-0">IA</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Mapa Principal */}
        <div className="lg:col-span-3">
          <Card className="h-[500px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Vista Satelital en Tiempo Real
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Wifi className="h-3 w-3 mr-1" />
                    Mapbox API
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-sm">
                Datos en tiempo real procesados con IA
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 relative">
              {/* Simulación del Mapa */}
              <div className="h-[400px] bg-gradient-to-br from-green-100 via-blue-50 to-orange-50 relative overflow-hidden rounded-b-lg">
                {/* Controles del Mapa */}
                <div className="absolute top-4 left-4 z-10 space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" size="sm" className="justify-start">
                        <Search className="h-4 w-4 mr-2" />
                        Buscar ubicación...
                      </Button>
                      <div className="flex gap-1">
                        <Button variant={mapView === 'satellite' ? 'default' : 'ghost'} size="sm" onClick={() => setMapView('satellite')}>
                          <Satellite className="h-4 w-4" />
                        </Button>
                        <Button variant={mapView === 'terrain' ? 'default' : 'ghost'} size="sm" onClick={() => setMapView('terrain')}>
                          <Mountain className="h-4 w-4" />
                        </Button>
                        <Button variant={mapView === 'hybrid' ? 'default' : 'ghost'} size="sm" onClick={() => setMapView('hybrid')}>
                          <Layers className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulación del Mapa Interactivo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Punto central del mapa */}
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-orange-200 to-blue-200 opacity-60 animate-pulse"></div>
                    
                    {/* Marcador central */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-agriculture-terracotta rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Indicadores de datos */}
                    <div className="absolute -top-8 -left-8 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
                      <div className="flex items-center gap-2 text-sm">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span>18°C</span>
                      </div>
                    </div>

                    <div className="absolute -top-8 -right-8 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>65%</span>
                      </div>
                    </div>

                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
                      <div className="flex items-center gap-2 text-sm">
                        <CloudRain className="h-4 w-4 text-cyan-500" />
                        <span>12mm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leyenda del mapa */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <h4 className="font-medium text-sm mb-2">Leyenda</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-400 rounded"></div>
                      <span>Temperatura Alta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded"></div>
                      <span>Humedad Alta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded"></div>
                      <span>Vegetación Densa</span>
                    </div>
                  </div>
                </div>

                {/* Información de coordenadas */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <div className="text-xs space-y-1">
                    <div>Lat: -13.5319°</div>
                    <div>Lon: -71.9675°</div>
                    <div>Zoom: 12</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Panel Lateral - Más compacto */}
        <div className="lg:col-span-2 space-y-4">
          {/* Capas del Mapa */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-4 w-4 text-purple-500" />
                Capas del Mapa
              </CardTitle>
              <CardDescription className="text-sm">
                Datos en tiempo real procesados con IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {weatherLayers.map((layer) => (
                <div key={layer.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <layer.icon className="h-3 w-3 text-agriculture-terracotta" />
                      <span className="text-sm font-medium">{layer.name}</span>
                    </div>
                    <Button
                      variant={layer.enabled ? "default" : "outline"}
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        // Toggle layer logic here
                      }}
                    >
                      {layer.enabled ? <Eye className="h-3 w-3" /> : <Eye className="h-3 w-3 opacity-50" />}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground pl-5">
                    {layer.description}
                  </div>
                  {layer.enabled && (
                    <div className="pl-5">
                      <div className="flex items-center gap-2 text-xs">
                        <span>Opacidad:</span>
                        <Progress value={layer.opacity * 100} className="h-1 flex-1" />
                        <span>{Math.round(layer.opacity * 100)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        
          {/* Fuentes de Datos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-green-500" />
                Fuentes de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {satelliteData.slice(0, 3).map((satellite) => (
                <div key={satellite.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        satellite.status === 'active' ? 'bg-green-500' : 
                        satellite.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">{satellite.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {satellite.source}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground pl-4">
                    <div>Resolución: {satellite.resolution}</div>
                    <div>Actualizado: {satellite.lastUpdate.split(' ')[1]}</div>
                  </div>
              </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full mt-2">
                <ExternalLink className="h-3 w-3 mr-2" />
                Ver todas las fuentes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      

      {/* Footer Optimizado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Estado de Conexión */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800 text-sm">Sistema Conectado</p>
                <p className="text-xs text-green-600">
                  Actualizado: {lastUpdate.toLocaleTimeString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Tiempo real</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Compartir con Agrónomo */}
        <Card className="bg-gradient-to-r from-agriculture-gold/10 to-orange-50 border-agriculture-gold/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-agriculture-gold/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-agriculture-terracotta" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-agriculture-earth text-sm">¿Tienes Agrónomo?</p>
                <p className="text-xs text-muted-foreground">
                  Estos datos pueden ayudarle a apoyarte mejor
                </p>
              </div>
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm" className="w-full">
                <Share className="h-3 w-3 mr-2" />
                Compartir Datos
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Exportar Reportes */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-purple-800 text-sm">Reportes Técnicos</p>
                <p className="text-xs text-purple-600">
                  Ideal para consultas profesionales
                </p>
              </div>
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-3 w-3 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje Compacto para Agrónomo */}
      <Card className="bg-gradient-to-r from-agriculture-terracotta/5 to-agriculture-earth/5 border-agriculture-terracotta/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-agriculture-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="h-4 w-4 text-agriculture-terracotta" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-agriculture-earth mb-2 text-sm">
                💡 Consejo: Comparte con tu Agrónomo
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Estos datos satelitales de NASA y SENAMHI pueden ser muy valiosos para tu agrónomo. 
                Le ayudarán a entender mejor las condiciones de tu terreno y darte recomendaciones más precisas.
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs px-2 py-0">
                  <Satellite className="h-3 w-3 mr-1" />
                  NASA
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-0">
                  <Radar className="h-3 w-3 mr-1" />
                  SENAMHI
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-0">
                  <Target className="h-3 w-3 mr-1" />
                  IA
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-0">
                  <Mountain className="h-3 w-3 mr-1" />
                  Agricultura Andina
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoreoPage;
