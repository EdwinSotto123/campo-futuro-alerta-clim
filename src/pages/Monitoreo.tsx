
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { CloudRain, Droplets, Flame, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Datos simulados - estos serían reemplazados con datos reales de una API
const climaData = [
  { name: "Ene", temperatura: 28, precipitacion: 65, humedad: 65 },
  { name: "Feb", temperatura: 29, precipitacion: 59, humedad: 70 },
  { name: "Mar", temperatura: 27, precipitacion: 80, humedad: 76 },
  { name: "Abr", temperatura: 26, precipitacion: 81, humedad: 80 },
  { name: "May", temperatura: 24, precipitacion: 56, humedad: 70 },
  { name: "Jun", temperatura: 22, precipitacion: 55, humedad: 65 },
  { name: "Jul", temperatura: 20, precipitacion: 40, humedad: 60 },
];

const riesgoIncendioData = [
  { name: "Región Norte", riesgo: 80 },
  { name: "Región Centro", riesgo: 40 },
  { name: "Región Sur", riesgo: 60 },
  { name: "Región Este", riesgo: 90 },
  { name: "Región Oeste", riesgo: 30 },
];

const estresHidricoData = [
  { name: "Zona A", value: 35, estado: "Moderado" },
  { name: "Zona B", value: 65, estado: "Alto" },
  { name: "Zona C", value: 20, estado: "Bajo" },
  { name: "Zona D", value: 80, estado: "Crítico" },
];

const COLORS = ['#36A2EB', '#FF6384', '#FFCE56', '#E74C3C'];

const MonitoreoPage = () => {
  const [selectedTab, setSelectedTab] = useState("clima");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Monitoreo Agroclimático</h1>
          <p className="text-muted-foreground">
            Datos en tiempo real para la toma de decisiones en su actividad agrícola
          </p>
        </div>
        <Badge variant="outline" className="bg-agriculture-earth/20 text-agriculture-brown">
          Última actualización: {new Date().toLocaleDateString()}
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="clima" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            <span>Clima</span>
          </TabsTrigger>
          <TabsTrigger value="incendios" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span>Riesgo de Incendios</span>
          </TabsTrigger>
          <TabsTrigger value="hidrico" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span>Estrés Hídrico</span>
          </TabsTrigger>
          <TabsTrigger value="predicciones" className="flex items-center gap-2">
            <CloudRain className="h-4 w-4" />
            <span>Predicciones</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clima" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Temperatura y Precipitación</CardTitle>
                <CardDescription>Datos de los últimos 7 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer 
                  config={{ 
                    temperatura: { color: '#D35400' },
                    precipitacion: { color: '#3498DB' }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={climaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="temperatura" 
                        stroke="var(--color-temperatura)" 
                        name="Temperatura (°C)" 
                        strokeWidth={2}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="precipitacion" 
                        stroke="var(--color-precipitacion)" 
                        name="Precipitación (mm)" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Humedad Relativa</CardTitle>
                <CardDescription>Porcentaje por mes</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer 
                  config={{ 
                    humedad: { color: '#3498DB' }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={climaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="humedad" 
                        stroke="var(--color-humedad)" 
                        fill="var(--color-humedad)" 
                        fillOpacity={0.3} 
                        name="Humedad (%)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="incendios" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Riesgo de Incendios por Región</CardTitle>
              <CardDescription>Nivel de riesgo en escala 0-100</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                config={{ 
                  riesgo: { color: '#E74C3C' }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riesgoIncendioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar 
                      dataKey="riesgo" 
                      fill="var(--color-riesgo)" 
                      name="Nivel de Riesgo" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hidrico" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estrés Hídrico por Zonas</CardTitle>
              <CardDescription>Distribución del nivel de estrés hídrico</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={estresHidricoData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {estresHidricoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Nivel de Estrés']} />
                  <Legend formatter={(value) => {
                    const item = estresHidricoData.find(d => d.name === value);
                    return `${value} (${item?.estado})`;
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predicciones" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Predicciones Climáticas</CardTitle>
              <CardDescription>Pronóstico para los próximos 15 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-60">
                <p className="text-center text-muted-foreground">
                  Los datos de predicciones climáticas estarán disponibles próximamente.
                  <br />Estamos integrando APIs meteorológicas para ofrecer pronósticos precisos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-agriculture-gold/10 border-agriculture-gold/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Alerta Climática</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Hay una alerta de tormentas intensas para la región Altiplano-Norte en las próximas 48 horas.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-agriculture-sky/10 border-agriculture-sky/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Humedad del Suelo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Los niveles de humedad están por debajo del óptimo en la región central. Se recomienda riego.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-agriculture-earth/10 border-agriculture-earth/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Heladas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Posibles heladas en zonas de alta montaña durante la madrugada. Proteja sus cultivos sensibles.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonitoreoPage;
