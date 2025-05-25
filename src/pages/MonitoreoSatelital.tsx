
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Satellite, Eye, Zap, BarChart3, MapPin, Camera, Download, Share } from "lucide-react";

const MonitoreoSatelitalPage = () => {
  const [selectedSatellite, setSelectedSatellite] = useState("sentinel-2");
  
  const satellites = [
    {
      id: "sentinel-2",
      name: "Sentinel-2",
      resolution: "10m",
      revisit: "5 días",
      bands: "13 bandas espectrales",
      status: "Activo"
    },
    {
      id: "landsat-8",
      name: "Landsat-8",
      resolution: "30m",
      revisit: "16 días", 
      bands: "11 bandas espectrales",
      status: "Activo"
    },
    {
      id: "modis",
      name: "MODIS Terra/Aqua",
      resolution: "250m-1km",
      revisit: "1-2 días",
      bands: "36 bandas espectrales",
      status: "Activo"
    }
  ];

  const indices = [
    {
      name: "NDVI",
      description: "Índice de Vegetación de Diferencia Normalizada",
      value: 0.72,
      status: "Saludable",
      color: "green"
    },
    {
      name: "NDWI", 
      description: "Índice de Agua de Diferencia Normalizada",
      value: 0.45,
      status: "Moderado",
      color: "blue"
    },
    {
      name: "LST",
      description: "Temperatura Superficial de la Tierra",
      value: 18.5,
      status: "Normal",
      color: "orange"
    },
    {
      name: "NDSI",
      description: "Índice de Nieve de Diferencia Normalizada", 
      value: 0.12,
      status: "Bajo",
      color: "gray"
    }
  ];

  const analysisResults = [
    {
      area: "Sector Norte - Cultivos de Papa",
      health: 85,
      trend: "↗ Mejorando",
      recommendations: "Mantener riego actual, monitorear posible estrés hídrico en 2 semanas"
    },
    {
      area: "Sector Central - Cultivos de Quinua", 
      health: 72,
      trend: "→ Estable",
      recommendations: "Considerar fertilización orgánica, verificar densidad de siembra"
    },
    {
      area: "Sector Sur - Pastizales",
      health: 58,
      trend: "↘ Deterioro",
      recommendations: "Implementar rotación de pastoreo, evaluar suplementación"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-agriculture-terracotta">Monitoreo Satelital Avanzado</h1>
          <p className="text-muted-foreground">
            Análisis multispectral con IA - ESA Copernicus + NASA Earth Data
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-500/20 text-blue-700">
          Sentinel-2 + Landsat + MODIS
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel de Control Satelital */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Satellite className="h-5 w-5 text-blue-600" />
                Satélites Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {satellites.map((sat) => (
                  <Button
                    key={sat.id}
                    variant={selectedSatellite === sat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSatellite(sat.id)}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div>
                      <p className="font-medium text-xs">{sat.name}</p>
                      <p className="text-xs opacity-70">{sat.resolution} | {sat.revisit}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Índices Espectrales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {indices.map((index, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{index.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {typeof index.value === 'number' ? 
                          (index.name === 'LST' ? `${index.value}°C` : index.value.toFixed(2)) : 
                          index.value}
                      </Badge>
                    </div>
                    <Progress 
                      value={index.name === 'LST' ? (index.value / 30) * 100 : index.value * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">{index.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualización Principal */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-agriculture-earth" />
                  Imagen Satelital Multispectral
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="bg-gradient-to-br from-green-200 via-yellow-200 to-brown-200 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 rounded-lg" />
                  
                  {/* Simulación de análisis de cultivos */}
                  <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-md text-xs">
                    <p className="font-medium">Sentinel-2 MSI</p>
                    <p>Fecha: 2024-12-25</p>
                    <p>Resolución: 10m</p>
                  </div>
                  
                  {/* Áreas de análisis */}
                  <div className="absolute top-20 left-32 w-16 h-12 border-2 border-green-500 bg-green-500/20 rounded">
                    <div className="bg-green-500 text-white text-xs p-1 rounded-t">Zona A</div>
                  </div>
                  <div className="absolute top-40 right-24 w-20 h-16 border-2 border-yellow-500 bg-yellow-500/20 rounded">
                    <div className="bg-yellow-500 text-white text-xs p-1 rounded-t">Zona B</div>
                  </div>
                  <div className="absolute bottom-28 left-20 w-18 h-14 border-2 border-red-500 bg-red-500/20 rounded">
                    <div className="bg-red-500 text-white text-xs p-1 rounded-t">Zona C</div>
                  </div>
                  
                  <div className="text-center z-10">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-agriculture-earth" />
                    <p className="text-lg font-medium">Vista Multispectral</p>
                    <p className="text-sm text-muted-foreground">Análisis RGB + NIR + SWIR</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button size="sm" variant="outline">RGB Natural</Button>
                  <Button size="sm" variant="outline">Falso Color</Button>
                  <Button size="sm" variant="outline">NDVI</Button>
                  <Button size="sm" variant="outline">Análisis Térmal</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="analisis" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="analisis">Análisis IA</TabsTrigger>
              <TabsTrigger value="temporal">Series Temporales</TabsTrigger>
              <TabsTrigger value="comparacion">Comparación</TabsTrigger>
              <TabsTrigger value="alertas">Alertas Automáticas</TabsTrigger>
            </TabsList>

            <TabsContent value="analisis" className="space-y-4">
              <div className="grid gap-4">
                {analysisResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{result.area}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{result.trend}</span>
                          <Badge variant={result.health > 80 ? "default" : result.health > 60 ? "secondary" : "destructive"}>
                            {result.health}% Salud
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Progress value={result.health} className="h-2" />
                        <div className="p-3 bg-blue-50 rounded-md">
                          <h4 className="text-sm font-medium mb-1">Recomendaciones IA:</h4>
                          <p className="text-sm text-blue-800">{result.recommendations}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="temporal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución Temporal de Cultivos</CardTitle>
                  <CardDescription>Análisis de cambios en los últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-agriculture-earth/10 to-agriculture-sky/10 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-agriculture-earth" />
                      <p className="text-lg font-medium">Gráfico Temporal NDVI</p>
                      <p className="text-sm text-muted-foreground">Integración con Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparacion" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Enero 2024</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gradient-to-br from-green-300 to-green-500 rounded-md mb-2" />
                    <p className="text-xs text-muted-foreground">NDVI Promedio: 0.68</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Diciembre 2024</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-md mb-2" />
                    <p className="text-xs text-muted-foreground">NDVI Promedio: 0.72 (+6%)</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="alertas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Sistema de Alertas Automáticas
                  </CardTitle>
                  <CardDescription>Detección de anomalías usando Machine Learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
                        <h4 className="font-medium text-yellow-800">Estrés Hídrico Detectado</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Sector Norte muestra signos de déficit hídrico (NDWI < 0.3)
                        </p>
                        <Button size="sm" className="mt-2">Ver Detalles</Button>
                      </div>
                      <div className="p-4 bg-green-50 rounded-md border-l-4 border-green-500">
                        <h4 className="font-medium text-green-800">Crecimiento Óptimo</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Sector Central presenta excelente desarrollo vegetativo
                        </p>
                        <Button size="sm" className="mt-2">Ver Detalles</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MonitoreoSatelitalPage;
