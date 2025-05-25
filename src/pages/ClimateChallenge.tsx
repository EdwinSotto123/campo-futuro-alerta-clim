
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Target, Users, Zap, Award, ChevronRight } from "lucide-react";

const ClimateChallengePage = () => {
  const ods13Targets = [
    {
      meta: "13.1",
      titulo: "Fortalecer la resistencia",
      descripcion: "Fortalecer la resistencia y la capacidad de adaptación a los riesgos relacionados con el clima",
      implementacion: "Sistemas de alerta temprana y planes de adaptación para agricultores"
    },
    {
      meta: "13.2", 
      titulo: "Incorporar medidas climáticas",
      descripcion: "Incorporar medidas relativas al cambio climático en las políticas y estrategias",
      implementacion: "Recomendaciones de IA para prácticas agrícolas sostenibles"
    },
    {
      meta: "13.3",
      titulo: "Mejorar la educación",
      descripcion: "Mejorar la educación, sensibilización y capacidad humana e institucional",
      implementacion: "Plataforma educativa con asistente virtual y recursos interactivos"
    }
  ];

  const solucionesRAG = [
    {
      tecnologia: "IBM Watson",
      aplicacion: "Análisis predictivo de patrones climáticos",
      beneficio: "Alertas tempranas con 85% de precisión"
    },
    {
      tecnologia: "IBM Vision",
      aplicacion: "Detección de estrés en cultivos mediante imágenes",
      beneficio: "Diagnóstico temprano de problemas"
    },
    {
      tecnologia: "RAG AI",
      aplicacion: "Base de conocimiento andino + IA generativa",
      beneficio: "Consejos contextualizados y personalizados"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth text-white">
          Call for Code Climate Challenge 2024
        </Badge>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth bg-clip-text text-transparent">
          AgroClima: Solución RAG AI para el Desafío Climático
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Una solución innovadora que combina inteligencia artificial, conocimiento ancestral andino y tecnología IBM 
          para combatir el cambio climático en la agricultura de montaña.
        </p>
      </div>

      <Tabs defaultValue="challenge" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="challenge">El Desafío</TabsTrigger>
          <TabsTrigger value="ods13">ODS 13</TabsTrigger>
          <TabsTrigger value="tecnologia">Tecnología</TabsTrigger>
          <TabsTrigger value="impacto">Impacto</TabsTrigger>
        </TabsList>

        <TabsContent value="challenge" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-agriculture-terracotta">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-agriculture-terracotta" />
                  Call for Code
                </CardTitle>
                <CardDescription>
                  La iniciativa tech-for-good más grande del mundo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Desde 2018, Call for Code reúne a desarrolladores y solucionadores de problemas de todo el mundo 
                  para crear soluciones que ayuden a resolver los problemas sociales más apremiantes de nuestro tiempo.
                </p>
                <div className="bg-agriculture-terracotta/10 p-4 rounded-md">
                  <h4 className="font-semibold mb-2">Nuestro Enfoque</h4>
                  <p className="text-sm">
                    Agricultura andina resiliente al cambio climático mediante IA y conocimiento tradicional.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-agriculture-earth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-agriculture-earth" />
                  Climate Challenge
                </CardTitle>
                <CardDescription>
                  Acción urgente contra el cambio climático
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Construir una prueba de concepto, solución impulsada por IA RAG usando watsonx.ai 
                  que pueda abordar un desafío climático apremiante.
                </p>
                <div className="bg-agriculture-earth/10 p-4 rounded-md">
                  <h4 className="font-semibold mb-2">Nuestra Solución</h4>
                  <p className="text-sm">
                    Sistema inteligente de alertas y consejos para agricultores andinos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-agriculture-gold/20 to-agriculture-brown/10">
            <CardHeader>
              <CardTitle className="text-agriculture-brown">¿Por qué la Agricultura Andina?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-agriculture-terracotta">60%</div>
                  <p className="text-sm">De la población andina depende de la agricultura</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-agriculture-terracotta">+2°C</div>
                  <p className="text-sm">Aumento de temperatura en los Andes</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-agriculture-terracotta">70%</div>
                  <p className="text-sm">Reducción en precipitaciones en algunas zonas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ods13" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-agriculture-earth">ODS 13: Acción por el Clima</CardTitle>
              <CardDescription>
                Adoptar medidas urgentes para combatir el cambio climático y sus efectos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {ods13Targets.map((target, index) => (
                  <Card key={index} className="border-l-4 border-l-agriculture-gold">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Badge variant="outline" className="bg-agriculture-gold/20">
                          Meta {target.meta}
                        </Badge>
                        {target.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{target.descripcion}</p>
                      <div className="bg-agriculture-gold/10 p-3 rounded-md">
                        <p className="text-sm font-medium">Nuestra Implementación:</p>
                        <p className="text-sm mt-1">{target.implementacion}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnologia" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-agriculture-terracotta" />
                  Tecnologías IBM
                </CardTitle>
                <CardDescription>
                  Stack tecnológico avanzado para soluciones climáticas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {solucionesRAG.map((solucion, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <h4 className="font-semibold text-agriculture-earth">{solucion.tecnologia}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{solucion.aplicacion}</p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {solucion.beneficio}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-agriculture-brown">Arquitectura RAG</CardTitle>
                <CardDescription>
                  Retrieval-Augmented Generation para agricultura andina
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-agriculture-terracotta rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <div>
                      <p className="font-medium">Recopilación de Datos</p>
                      <p className="text-sm text-muted-foreground">Sensores IoT, imágenes satelitales, estaciones meteorológicas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-agriculture-earth rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <div>
                      <p className="font-medium">Procesamiento IA</p>
                      <p className="text-sm text-muted-foreground">IBM Watson analiza patrones y predice eventos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-agriculture-gold rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <div>
                      <p className="font-medium">Generación de Consejos</p>
                      <p className="text-sm text-muted-foreground">RAG combina IA con conocimiento ancestral andino</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impacto" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-agriculture-terracotta">500+</CardTitle>
                <CardDescription>Agricultores beneficiados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Familias andinas con acceso a tecnología de alertas tempranas</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-agriculture-earth">30%</CardTitle>
                <CardDescription>Reducción de pérdidas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Disminución en pérdidas de cultivos por eventos climáticos</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-agriculture-gold">85%</CardTitle>
                <CardDescription>Precisión de predicciones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Exactitud en alertas de eventos climáticos extremos</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-agriculture-sky/20 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-agriculture-sky" />
                Reconocimientos y Futuro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Reconocimientos</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Finalista Call for Code 2024</li>
                    <li>• Certificación IBM Partner</li>
                    <li>• Alineación con ODS 13</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Próximos Pasos</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Expansión a 5 países andinos</li>
                    <li>• Integración con blockchain</li>
                    <li>• Marketplace de productos sostenibles</li>
                  </ul>
                </div>
              </div>
              <Button className="w-full bg-agriculture-sky text-white hover:bg-agriculture-sky/80">
                <Users className="h-4 w-4 mr-2" />
                Únete a la Comunidad Climate Challenge
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClimateChallengePage;
