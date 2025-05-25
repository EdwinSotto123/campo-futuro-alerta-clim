
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Satellite, Eye, Camera, Zap, AlertTriangle, Download, Play, Pause } from "lucide-react";

const MonitoreoSatelitalPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSatellite, setSelectedSatellite] = useState("sentinel-2");

  const satellites = [
    { id: "sentinel-2", name: "Sentinel-2", resolution: "10m", frequency: "5 días" },
    { id: "landsat-8", name: "Landsat 8", resolution: "30m", frequency: "16 días" },
    { id: "modis", name: "MODIS", resolution: "250m", frequency: "Diario" },
    { id: "planetscope", name: "PlanetScope", resolution: "3m", frequency: "Diario" }
  ];

  const analysisResults = [
    {
      metric: "Índice de Vegetación (NDVI)",
      value: "0.78",
      status: "Saludable",
      trend: "+5% vs mes anterior",
      color: "text-green-600"
    },
    {
      metric: "Estrés Hídrico",
      value: "Moderado",
      status: "Atención",
      trend: "↑ Incrementando",
      color: "text-yellow-600"
    },
    {
      metric: "Detección de Plagas",
      value: "2 zonas",
      status: "Alerta",
      trend: "Nueva detección",
      color: "text-red-600"
    },
    {
      metric: "Estimación de Rendimiento",
      value: "85%",
      status: "Bueno",
      trend: "Según proyección",
      color: "text-blue-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-agriculture-terracotta">Monitoreo Satelital Avanzado</h1>
          <p className="text-muted-foreground">
            Análisis multispectral con IA para agricultura de precisión - ODS 13
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/20 text-green-700">
            IBM Earth Observations
          </Badge>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-700">
            Watson AI
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Control Satelital */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-agriculture-earth" />
                Control Satelital
              </CardTitle>
              <CardDescription>Configuración de sensores y análisis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Satélite Activo</label>
                <select 
                  value={selectedSatellite}
                  onChange={(e) => setSelectedSatellite(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  {satellites.map((sat) => (
                    <option key={sat.id} value={sat.id}>
                      {sat.name} - {sat.resolution}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Resolución:</span>
                  <p className="font-medium">
                    {satellites.find(s => s.id === selectedSatellite)?.resolution}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Frecuencia:</span>
                  <p className="font-medium">
                    {satellites.find(s => s.id === selectedSatellite)?.frequency}
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setIsAnalyzing(!isAnalyzing)}
                className="w-full"
                variant={isAnalyzing ? "secondary" : "default"}
              >
                {isAnalyzing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar Análisis
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Análisis IA
                  </>
                )}
              </Button>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Bandas Espectrales Activas:</h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <Badge variant="outline">RGB</Badge>
                  <Badge variant="outline">NIR</Badge>
                  <Badge variant="outline">SWIR</Badge>
                  <Badge variant="outline">Térmica</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Resultados del Análisis IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResults.map((result, index) => (
                <div key={index} className="p-3 rounded-md bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{result.metric}</p>
                    <Badge variant="outline" className={result.color}>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold">{result.value}</p>
                  <p className="text-xs text-muted-foreground">{result.trend}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Visualización Satelital */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-agriculture-earth" />
                  Vista Satelital Multispectral
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Captura
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-green-200 via-yellow-100 to-brown-200 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 rounded-lg" />
                
                {/* Simulación de vista satelital con overlays */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-white/90 p-2 rounded-md text-xs">
                    <p className="font-medium">Coordenadas: -13.5319, -71.9675</p>
                    <p>Fecha: {new Date().toLocaleDateString()}</p>
                    <p>Resolución: {satellites.find(s => s.id === selectedSatellite)?.resolution}</p>
                  </div>
                </div>

                {/* Marcadores de análisis */}
                <div className="absolute top-20 left-32 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white" />
                <div className="absolute top-40 right-24 w-4 h-4 bg-yellow-500 rounded-full animate-pulse border-2 border-white" />
                <div className="absolute bottom-28 left-20 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />

                <div className="text-center z-10">
                  <p className="text-lg font-medium mb-2">Análisis Multispectral en Tiempo Real</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Procesamiento con Watson AI y Sentinel-2
                  </p>
                  {isAnalyzing && (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                      <span className="text-sm">Analizando con IA...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                <Button variant="outline" size="sm">RGB Natural</Button>
                <Button variant="outline" size="sm">Falso Color</Button>
                <Button variant="outline" size="sm">NDVI</Button>
                <Button variant="outline" size="sm">Térmica</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="analisis" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="analisis">Análisis Temporal</TabsTrigger>
          <TabsTrigger value="alertas">Alertas Automáticas</TabsTrigger>
          <TabsTrigger value="reportes">Reportes IA</TabsTrigger>
          <TabsTrigger value="integracion">Integración APIs</TabsTrigger>
        </TabsList>

        <TabsContent value="analisis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evolución Temporal NDVI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-md mb-2 flex items-center justify-center">
                  <p className="text-sm font-medium">Gráfico Temporal - Últimos 12 meses</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tendencia: Mejora gradual del 15% en salud vegetal
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Análisis de Cambios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deforestación detectada</span>
                    <Badge variant="destructive">0.2 ha</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nuevas áreas cultivadas</span>
                    <Badge variant="default">1.5 ha</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estrés hídrico</span>
                    <Badge variant="warning">Moderado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Alertas Automáticas</CardTitle>
              <CardDescription>Detección temprana con IA para prevención de riesgos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <p className="font-medium text-red-800">Alerta Crítica - Plaga Detectada</p>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    Zona norte muestra signos de infestación. Se recomienda intervención inmediata.
                  </p>
                  <p className="text-xs text-red-500 mt-2">Detectado hace 15 minutos</p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <p className="font-medium text-yellow-800">Alerta Moderada - Estrés Hídrico</p>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1">
                    Niveles de humedad del suelo por debajo del óptimo en sector este.
                  </p>
                  <p className="text-xs text-yellow-500 mt-2">Detectado hace 2 horas</p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-md">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <p className="font-medium text-blue-800">Información - Condiciones Óptimas</p>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Sector sur mantiene condiciones ideales para crecimiento.
                  </p>
                  <p className="text-xs text-blue-500 mt-2">Actualizado hace 30 minutos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Inteligentes Generados por IA</CardTitle>
              <CardDescription>Análisis automatizado con recomendaciones personalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">Reporte Semanal - Salud de Cultivos</h4>
                  <p className="text-sm text-green-600 mb-3">
                    Los análisis satelitales muestran una mejora del 12% en la salud general de los cultivos comparado con la semana anterior.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium">NDVI Promedio:</span> 0.78 (+0.05)
                    </div>
                    <div>
                      <span className="font-medium">Área Saludable:</span> 85% (+8%)
                    </div>
                  </div>
                  <Button size="sm" className="mt-2">Descargar Reporte Completo</Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-md">
                  <h4 className="font-medium text-orange-800 mb-2">Recomendaciones IA</h4>
                  <ul className="text-sm text-orange-600 space-y-1">
                    <li>• Incrementar riego en sectores con NDVI &lt; 0.6</li>
                    <li>• Aplicar fertilizante foliar en zona norte</li>
                    <li>• Monitorear desarrollo de plagas en sector identificado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integración con APIs Externas</CardTitle>
              <CardDescription>Conexiones activas con proveedores de datos satelitales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">IBM Environmental Intelligence</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Conectado</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Acceso a datos meteorológicos y alertas climáticas en tiempo real
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">ESA Copernicus</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Conectado</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Imágenes Sentinel-1 y Sentinel-2 para análisis multispectral
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">NASA MODIS</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Conectado</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Datos de temperatura superficial y índices de vegetación globales
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Planet Labs</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">Configurando</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Imágenes de alta resolución diarias para monitoreo detallado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoreoSatelitalPage;
