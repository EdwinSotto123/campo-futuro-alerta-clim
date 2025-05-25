
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Cloud, Thermometer, Droplets, Wind, Bell, Clock, MapPin } from "lucide-react";

const AlertasPage = () => {
  const [selectedRegion, setSelectedRegion] = useState("altiplano-norte");

  const alertasActivas = [
    {
      id: 1,
      tipo: "sequía",
      severidad: "alta",
      region: "Altiplano Norte",
      descripcion: "Déficit hídrico severo previsto para los próximos 15 días",
      fecha: "2024-12-25",
      acciones: ["Implementar riego de emergencia", "Proteger cultivos sensibles", "Revisar reservas de agua"]
    },
    {
      id: 2,
      tipo: "heladas",
      severidad: "media",
      region: "Valle Central",
      descripcion: "Temperaturas mínimas de -2°C esperadas entre el 26-28 de diciembre",
      fecha: "2024-12-26",
      acciones: ["Instalar protección contra heladas", "Cubrir cultivos jóvenes", "Preparar calefacción en invernaderos"]
    },
    {
      id: 3,
      tipo: "granizo",
      severidad: "alta",
      region: "Región Sur",
      descripcion: "Sistema tormentoso con potencial de granizo de gran tamaño",
      fecha: "2024-12-27",
      acciones: ["Instalar mallas antigranizo", "Cosechar cultivos maduros", "Proteger infraestructura"]
    }
  ];

  const recomendacionesPreventivas = [
    {
      evento: "Antes del evento climático",
      acciones: [
        "Monitorear constantemente las alertas meteorológicas",
        "Preparar sistemas de protección móviles",
        "Revisar y mantener equipos de emergencia",
        "Coordinar con agricultores vecinos",
        "Documentar estado actual de cultivos"
      ]
    },
    {
      evento: "Durante el evento climático",
      acciones: [
        "Activar protocolos de emergencia establecidos",
        "Mantener comunicación con autoridades",
        "Implementar medidas de protección inmediata",
        "Registrar daños en tiempo real",
        "Evitar exposición innecesaria"
      ]
    },
    {
      evento: "Después del evento climático",
      acciones: [
        "Evaluar daños sistemáticamente",
        "Documentar pérdidas para seguros",
        "Implementar recuperación de cultivos",
        "Buscar asistencia técnica y financiera",
        "Analizar lecciones aprendidas"
      ]
    }
  ];

  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baja': return 'secondary';
      default: return 'default';
    }
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case 'sequía': return <Droplets className="h-4 w-4" />;
      case 'heladas': return <Thermometer className="h-4 w-4" />;
      case 'granizo': return <Cloud className="h-4 w-4" />;
      case 'viento': return <Wind className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-agriculture-terracotta">Sistema de Alertas Climáticas</h1>
          <p className="text-muted-foreground">
            Alertas tempranas impulsadas por IA para proteger la agricultura andina - ODS 13: Acción por el Clima
          </p>
        </div>
        <Badge variant="outline" className="bg-agriculture-earth/20 text-agriculture-brown flex items-center gap-2">
          <Bell className="h-3 w-3" />
          {alertasActivas.length} alertas activas
        </Badge>
      </div>

      <Tabs defaultValue="alertas" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="alertas">Alertas Activas</TabsTrigger>
          <TabsTrigger value="prevencion">Prevención</TabsTrigger>
          <TabsTrigger value="monitoreo">Monitoreo IA</TabsTrigger>
        </TabsList>

        <TabsContent value="alertas" className="space-y-4">
          <div className="grid gap-4">
            {alertasActivas.map((alerta) => (
              <Alert key={alerta.id} className="border-l-4 border-l-agriculture-terracotta">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getEventIcon(alerta.tipo)}
                    {alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1)} - {alerta.region}
                  </span>
                  <Badge variant={getSeverityColor(alerta.severidad)}>
                    {alerta.severidad.toUpperCase()}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>{alerta.descripcion}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Fecha prevista: {alerta.fecha}
                    <MapPin className="h-3 w-3 ml-2" />
                    {alerta.region}
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium mb-2">Acciones Recomendadas:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {alerta.acciones.map((accion, index) => (
                        <li key={index}>{accion}</li>
                      ))}
                    </ul>
                  </div>
                  <Button size="sm" className="bg-agriculture-earth hover:bg-agriculture-brown">
                    Ver Plan Detallado
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prevencion" className="space-y-4">
          <Card className="bg-gradient-to-br from-agriculture-gold/20 to-agriculture-brown/10">
            <CardHeader>
              <CardTitle className="text-agriculture-brown">Estrategias de Prevención - Call for Code Climate Challenge</CardTitle>
              <CardDescription>
                Protocolos de acción para minimizar el impacto climático en la agricultura andina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recomendacionesPreventivas.map((recomendacion, index) => (
                <div key={index} className="border-l-4 border-l-agriculture-terracotta pl-4">
                  <h3 className="font-semibold text-agriculture-earth mb-3">{recomendacion.evento}</h3>
                  <div className="grid gap-2">
                    {recomendacion.acciones.map((accion, actionIndex) => (
                      <div key={actionIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-agriculture-terracotta rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">{accion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoreo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-agriculture-terracotta" />
                  IA Predictiva - IBM Watson
                </CardTitle>
                <CardDescription>
                  Sistema de monitoreo continuo con inteligencia artificial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-agriculture-sky/10 rounded-md">
                  <h4 className="font-medium text-agriculture-sky mb-2">Fuentes de Datos</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Imágenes satelitales en tiempo real</li>
                    <li>• Estaciones meteorológicas IoT</li>
                    <li>• Modelos climáticos globales</li>
                    <li>• Sensores de humedad del suelo</li>
                  </ul>
                </div>
                <div className="p-3 bg-agriculture-earth/10 rounded-md">
                  <h4 className="font-medium text-agriculture-earth mb-2">Capacidades de IA</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Predicción de eventos extremos</li>
                    <li>• Análisis de patrones climáticos</li>
                    <li>• Recomendaciones personalizadas</li>
                    <li>• Alertas tempranas automatizadas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-agriculture-brown">ODS 13: Acción por el Clima</CardTitle>
                <CardDescription>
                  Contribución directa a los Objetivos de Desarrollo Sostenible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-agriculture-gold rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Meta 13.1</p>
                      <p className="text-xs text-muted-foreground">Fortalecer la resistencia y capacidad de adaptación</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-agriculture-gold rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Meta 13.2</p>
                      <p className="text-xs text-muted-foreground">Incorporar medidas de cambio climático</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-agriculture-gold rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Meta 13.3</p>
                      <p className="text-xs text-muted-foreground">Mejorar educación y sensibilización</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-agriculture-gold text-white hover:bg-agriculture-brown">
                  Ver Impacto Medido
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertasPage;
