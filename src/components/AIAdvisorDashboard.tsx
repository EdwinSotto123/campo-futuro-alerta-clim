import { Brain, Users, GanttChart, Sprout, AlertTriangle, Search, ArrowRight, Cpu, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AIAdvisorDashboard = () => {
  // Simulación del proceso RAG con watsonx.ai
  const ragProcess = {
    retrieve: {
      query: "Riesgo de heladas en cultivos de papa región altiplano",
      sources: [
        { type: "Datos históricos", confianza: "95%", origen: "Estación meteorológica local" },
        { type: "Pronóstico climático", confianza: "87%", origen: "Servicio meteorológico nacional" },
        { type: "Datos de sensores", confianza: "92%", origen: "Red de sensores IoT" }
      ]
    },
    rerank: {
      criterios: [
        "Relevancia temporal: últimas 24 horas",
        "Proximidad geográfica: región específica",
        "Precisión de mediciones: error < 1°C"
      ],
      resultadosPriorizados: [
        "Alerta de helada nocturna (-2°C) prevista",
        "Humedad del suelo en niveles críticos",
        "Patrón histórico de daños por heladas"
      ]
    },
    generate: {
      modelo: "IBM watsonx.ai Granite-13B",
      contextualización: "Adaptado para agricultura de altura",
      salidas: {
        agricultor: "Riesgo de helada en las próximas 48 horas. Protege tus cultivos de papa.",
        tecnico: "3 zonas presentan riesgo alto de estrés hídrico",
        gobierno: "Riesgo de pérdida del 20% de cultivos si no se implementan medidas"
      }
    }
  };

  // Datos de ejemplo (en un caso real vendrían de una API de IA)
  const recommendations = {
    agricultor: {
      alertas: [
        "Riesgo de helada en las próximas 48 horas. Protege tus cultivos de papa.",
        "La humedad del suelo está al 30%. Considera riego en los próximos 2 días."
      ],
      recomendaciones: [
        "Basado en el pronóstico, adelanta la cosecha de maíz 5 días.",
        "Aplica riego por goteo para optimizar el uso del agua."
      ]
    },
    tecnico: {
      alertas: [
        "3 zonas presentan riesgo alto de estrés hídrico",
        "Detectada tendencia de sequía en región norte"
      ],
      metricas: {
        riesgoSequia: 75,
        alertasActivas: 12,
        zonasAfectadas: 3
      }
    },
    gobierno: {
      proyecciones: [
        "Riesgo de pérdida del 20% de cultivos si no se implementan medidas",
        "Potencial ahorro de 30% en recursos hídricos con nuevas políticas"
      ],
      estadisticas: {
        zonasRiesgo: 5,
        agricultoresAfectados: 1200,
        hectareasEnRiesgo: 5000
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Asistente IA Agroclimático</h2>
          <p className="text-muted-foreground">Potenciado por IBM watsonx.ai</p>
        </div>
        <Badge variant="outline" className="bg-blue-100">
          Actualizado hace 5 minutos
        </Badge>
      </div>

      {/* Proceso RAG */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-500" />
            Proceso RAG (Retrieval-Augmented Generation)
          </CardTitle>
          <CardDescription>
            Visualización del proceso de generación de recomendaciones usando watsonx.ai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Retrieve */}
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  1. Retrieve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-sm">Query:</p>
                  <p className="text-sm">{ragProcess.retrieve.query}</p>
                </div>
                <div className="space-y-2">
                  {ragProcess.retrieve.sources.map((source, index) => (
                    <div key={index} className="bg-white p-2 rounded-md text-sm">
                      <div className="flex justify-between">
                        <span>{source.type}</span>
                        <Badge variant="secondary">{source.confianza}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{source.origen}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rerank */}
            <Card className="bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  2. Rerank
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-white p-3 rounded-lg space-y-2">
                  <p className="font-semibold text-sm">Criterios de priorización:</p>
                  <ul className="text-sm space-y-1">
                    {ragProcess.rerank.criterios.map((criterio, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                        {criterio}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  {ragProcess.rerank.resultadosPriorizados.map((resultado, index) => (
                    <div key={index} className="bg-white p-2 rounded-md text-sm flex items-center gap-2">
                      <span className="font-mono text-purple-500">{index + 1}</span>
                      {resultado}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate */}
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  3. Generate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-white p-3 rounded-lg space-y-2">
                  <div>
                    <p className="font-semibold text-sm">Modelo:</p>
                    <p className="text-sm">{ragProcess.generate.modelo}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Contextualización:</p>
                    <p className="text-sm">{ragProcess.generate.contextualización}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(ragProcess.generate.salidas).map(([tipo, salida], index) => (
                    <div key={index} className="bg-white p-2 rounded-md text-sm">
                      <p className="font-semibold capitalize">{tipo}:</p>
                      <p>{salida}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Sección Agricultor */}
      <Card className="border-l-4 border-l-agriculture-earth">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-agriculture-earth" />
            <CardTitle>Recomendaciones para Agricultor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Alertas Urgentes
              </h4>
              <ul className="mt-2 space-y-2">
                {recommendations.agricultor.alertas.map((alerta, index) => (
                  <li key={index} className="text-sm bg-red-50 p-2 rounded-md">
                    {alerta}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Recomendaciones</h4>
              <ul className="mt-2 space-y-2">
                {recommendations.agricultor.recomendaciones.map((rec, index) => (
                  <li key={index} className="text-sm bg-blue-50 p-2 rounded-md">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección Técnico */}
      <Card className="border-l-4 border-l-agriculture-sky">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-agriculture-sky" />
            <CardTitle>Panel Técnico de Campo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="bg-agriculture-sky/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{recommendations.tecnico.metricas.riesgoSequia}%</div>
                  <p className="text-sm text-muted-foreground">Riesgo de Sequía</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-agriculture-sky/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{recommendations.tecnico.metricas.alertasActivas}</div>
                  <p className="text-sm text-muted-foreground">Alertas Activas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-agriculture-sky/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{recommendations.tecnico.metricas.zonasAfectadas}</div>
                  <p className="text-sm text-muted-foreground">Zonas Afectadas</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Alertas del Sistema</h4>
            <ul className="space-y-2">
              {recommendations.tecnico.alertas.map((alerta, index) => (
                <li key={index} className="text-sm bg-yellow-50 p-2 rounded-md">
                  {alerta}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Sección Gobierno */}
      <Card className="border-l-4 border-l-agriculture-gold">
        <CardHeader>
          <div className="flex items-center gap-2">
            <GanttChart className="h-6 w-6 text-agriculture-gold" />
            <CardTitle>Análisis para Políticas Públicas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="bg-agriculture-gold/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{recommendations.gobierno.estadisticas.zonasRiesgo}</div>
                  <p className="text-sm text-muted-foreground">Zonas en Riesgo</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-agriculture-gold/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{recommendations.gobierno.estadisticas.agricultoresAfectados}</div>
                  <p className="text-sm text-muted-foreground">Agricultores Afectados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-agriculture-gold/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{recommendations.gobierno.estadisticas.hectareasEnRiesgo}</div>
                  <p className="text-sm text-muted-foreground">Hectáreas en Riesgo</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Proyecciones y Recomendaciones</h4>
            <ul className="space-y-2">
              {recommendations.gobierno.proyecciones.map((proy, index) => (
                <li key={index} className="text-sm bg-orange-50 p-2 rounded-md">
                  {proy}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAdvisorDashboard; 