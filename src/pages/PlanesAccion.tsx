
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle, Zap, Shield, Target } from "lucide-react";

const PlanesAccionPage = () => {
  const [selectedPhase, setSelectedPhase] = useState("antes");

  const actionPlans = {
    antes: [
      {
        title: "Preparación de Suelos",
        urgency: "high",
        timeFrame: "2-4 semanas antes",
        actions: [
          "Análisis de pH del suelo",
          "Aplicación de materia orgánica",
          "Nivelación de terrenos",
          "Instalación de sistemas de drenaje"
        ],
        progress: 75
      },
      {
        title: "Selección de Semillas Resistentes",
        urgency: "medium",
        timeFrame: "1-2 meses antes",
        actions: [
          "Identificar variedades adaptadas al clima",
          "Adquirir semillas certificadas",
          "Pruebas de germinación",
          "Planificación de siembra escalonada"
        ],
        progress: 90
      }
    ],
    durante: [
      {
        title: "Monitoreo Activo",
        urgency: "critical",
        timeFrame: "Tiempo real",
        actions: [
          "Verificar sistemas de alerta",
          "Monitorear condiciones climáticas",
          "Ajustar riego según necesidades",
          "Aplicar medidas de protección"
        ],
        progress: 60
      },
      {
        title: "Respuesta Rápida",
        urgency: "critical",
        timeFrame: "Inmediato",
        actions: [
          "Activar planes de contingencia",
          "Proteger cultivos vulnerables",
          "Comunicar con otros agricultores",
          "Documentar impactos"
        ],
        progress: 45
      }
    ],
    despues: [
      {
        title: "Evaluación de Daños",
        urgency: "high",
        timeFrame: "1-3 días después",
        actions: [
          "Inspeccionar cultivos afectados",
          "Calcular pérdidas económicas",
          "Evaluar infraestructura dañada",
          "Documentar para seguros"
        ],
        progress: 30
      },
      {
        title: "Recuperación y Rehabilitación",
        urgency: "medium",
        timeFrame: "1-4 semanas después",
        actions: [
          "Replantear cultivos perdidos",
          "Reparar sistemas de riego",
          "Aplicar tratamientos de recuperación",
          "Planificar mejoras futuras"
        ],
        progress: 20
      }
    ]
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "text-red-600 bg-red-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      default: return "text-green-600 bg-green-100";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical": return AlertTriangle;
      case "high": return Zap;
      case "medium": return Clock;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-agriculture-terracotta">Planes de Acción Climática</h1>
          <p className="text-muted-foreground">
            Estrategias personalizadas para antes, durante y después de eventos climáticos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-500/20 text-blue-700">
            IA Predictiva
          </Badge>
          <Badge variant="outline" className="bg-green-500/20 text-green-700">
            ODS 13
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Button
          variant={selectedPhase === "antes" ? "default" : "outline"}
          onClick={() => setSelectedPhase("antes")}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Antes del Evento
        </Button>
        <Button
          variant={selectedPhase === "durante" ? "default" : "outline"}
          onClick={() => setSelectedPhase("durante")}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Durante el Evento
        </Button>
        <Button
          variant={selectedPhase === "despues" ? "default" : "outline"}
          onClick={() => setSelectedPhase("despues")}
          className="flex items-center gap-2"
        >
          <Target className="h-4 w-4" />
          Después del Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actionPlans[selectedPhase as keyof typeof actionPlans].map((plan, index) => {
          const UrgencyIcon = getUrgencyIcon(plan.urgency);
          return (
            <Card key={index} className="border-l-4 border-l-agriculture-terracotta">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.title}</CardTitle>
                  <Badge className={getUrgencyColor(plan.urgency)}>
                    <UrgencyIcon className="h-3 w-3 mr-1" />
                    {plan.urgency}
                  </Badge>
                </div>
                <CardDescription>
                  Tiempo estimado: {plan.timeFrame}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso del Plan</span>
                    <span>{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Acciones Requeridas:</h4>
                  <ul className="space-y-1">
                    {plan.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full" size="sm">
                  Iniciar Plan de Acción
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones IA Personalizadas</CardTitle>
          <CardDescription>
            Basadas en tu ubicación, tipo de cultivo y condiciones actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Para Pequeños Agricultores</h4>
              <p className="text-sm text-blue-600">
                Enfoque en técnicas de bajo costo y alta eficiencia. Uso de recursos locales y conocimiento tradicional.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">Para Medianos Agricultores</h4>
              <p className="text-sm text-green-600">
                Combinación de tecnología moderna con prácticas sostenibles. Inversión gradual en infraestructura.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-md">
              <h4 className="font-medium text-purple-800 mb-2">Para Grandes Agricultores</h4>
              <p className="text-sm text-purple-600">
                Implementación de sistemas avanzados de monitoreo y automatización para optimizar recursos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanesAccionPage;
