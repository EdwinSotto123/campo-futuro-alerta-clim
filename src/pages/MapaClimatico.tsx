
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Satellite, Thermometer, Droplets, Wind, Cloud, AlertTriangle, Search } from "lucide-react";

const MapaClimaticoPage = () => {
  const [selectedRegion, setSelectedRegion] = useState("cusco");
  const [searchLocation, setSearchLocation] = useState("");
  const [mapData, setMapData] = useState({
    temperature: 18,
    humidity: 65,
    precipitation: 12,
    windSpeed: 8,
    riskLevel: "medium"
  });

  const regions = [
    { id: "cusco", name: "Cusco - Valle Sagrado", coords: [-13.5319, -71.9675] },
    { id: "altiplano", name: "Altiplano - Puno", coords: [-15.8402, -70.0219] },
    { id: "arequipa", name: "Arequipa - Valle del Colca", coords: [-16.4090, -71.5375] },
    { id: "cajamarca", name: "Cajamarca - Sierra Norte", coords: [-7.1611, -78.5136] }
  ];

  const climateIndicators = [
    {
      icon: Thermometer,
      label: "Temperatura",
      value: `${mapData.temperature}°C`,
      trend: "↑ +2°C vs mes anterior",
      color: "text-orange-600"
    },
    {
      icon: Droplets,
      label: "Humedad del Suelo",
      value: `${mapData.humidity}%`,
      trend: "↓ -15% crítico",
      color: "text-blue-600"
    },
    {
      icon: Cloud,
      label: "Precipitación",
      value: `${mapData.precipitation}mm`,
      trend: "↓ -45% vs promedio",
      color: "text-gray-600"
    },
    {
      icon: Wind,
      label: "Viento",
      value: `${mapData.windSpeed} km/h`,
      trend: "→ Normal",
      color: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-agriculture-terracotta">Mapa Climático Inteligente</h1>
          <p className="text-muted-foreground">
            Monitoreo satelital con IA - IBM Watson Earth Observations
          </p>
        </div>
        <Badge variant="outline" className="bg-green-500/20 text-green-700">
          RAG + Mapbox + Sentinel-2
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-agriculture-earth" />
                  Vista Satelital en Tiempo Real
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Buscar ubicación..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-48"
                  />
                  <Button size="icon" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg h-96 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black/5 rounded-lg" />
                <div className="text-center z-10">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-agriculture-earth" />
                  <p className="text-lg font-medium">Mapa Interactivo</p>
                  <p className="text-sm text-muted-foreground">Integración con Mapbox API</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Datos: Landsat 8, Sentinel-2, MODIS
                  </p>
                </div>
                
                {/* Marcadores simulados */}
                <div className="absolute top-20 left-32 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <div className="absolute top-40 right-24 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                <div className="absolute bottom-28 left-20 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant={selectedRegion === region.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRegion(region.id)}
                    className="text-xs"
                  >
                    {region.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Datos */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Indicadores Climáticos</CardTitle>
              <CardDescription>Datos en tiempo real procesados con IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {climateIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                  <indicator.icon className={`h-5 w-5 ${indicator.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{indicator.label}</p>
                    <p className="text-lg font-bold">{indicator.value}</p>
                    <p className="text-xs text-muted-foreground">{indicator.trend}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Análisis RAG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
                  <p className="text-sm font-medium">Recomendación IA</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Basado en patrones históricos y conocimiento andino tradicional
                  </p>
                </div>
                <p className="text-sm">
                  Se recomienda implementar sistemas de captación de agua de lluvia 
                  en los próximos 15 días debido a la predicción de precipitaciones.
                </p>
                <Button size="sm" className="w-full">
                  Ver Análisis Completo RAG
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="capas" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="capas">Capas del Mapa</TabsTrigger>
          <TabsTrigger value="historico">Datos Históricos</TabsTrigger>
          <TabsTrigger value="prediccion">Predicción IA</TabsTrigger>
          <TabsTrigger value="rag">Consultas RAG</TabsTrigger>
        </TabsList>

        <TabsContent value="capas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Temperatura Superficial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gradient-to-r from-blue-200 via-yellow-200 to-red-200 rounded-md mb-2" />
                <p className="text-xs text-muted-foreground">Datos: MODIS Terra/Aqua</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Índice de Vegetación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gradient-to-r from-yellow-200 via-green-300 to-green-600 rounded-md mb-2" />
                <p className="text-xs text-muted-foreground">NDVI - Sentinel-2</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Humedad del Suelo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gradient-to-r from-orange-200 via-blue-300 to-blue-600 rounded-md mb-2" />
                <p className="text-xs text-muted-foreground">SMAP - NASA</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Tendencias Climáticas</CardTitle>
              <CardDescription>Últimos 30 años de datos meteorológicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-t from-agriculture-earth/10 to-agriculture-sky/10 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium">Gráfico de Tendencias</p>
                  <p className="text-sm text-muted-foreground">Integración con Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediccion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predicción Climática con IA</CardTitle>
              <CardDescription>Modelos predictivos basados en Watson ML</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-800">Próximos 7 días</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Probabilidad de lluvia: 65%<br/>
                      Temperatura promedio: 16-22°C
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-md">
                    <h4 className="font-medium text-green-800">Próximos 30 días</h4>
                    <p className="text-sm text-green-600 mt-1">
                      Tendencia: Estación seca moderada<br/>
                      Recomendación: Conservar agua
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rag" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consultas Inteligentes RAG</CardTitle>
              <CardDescription>Pregunta sobre el clima usando lenguaje natural</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ej: ¿Cuál es el mejor momento para sembrar quinua en esta zona?"
                    className="flex-1"
                  />
                  <Button>Consultar IA</Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Consultas frecuentes:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      Riesgo de heladas esta semana
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      Mejor época para cosechar papa
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      Predicción de sequías
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapaClimaticoPage;
