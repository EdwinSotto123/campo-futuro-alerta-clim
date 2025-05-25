
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Leaf, Recycle, Zap, Droplets, TreePine, Users } from "lucide-react";

const IASosteniblePage = () => {
  const practicasSostenibles = [
    {
      categoria: "Gestión del Agua",
      icon: <Droplets className="h-5 w-5" />,
      practicas: [
        { nombre: "Riego por goteo inteligente", implementacion: 75, beneficio: "50% menos consumo de agua" },
        { nombre: "Captación de agua de lluvia", implementacion: 60, beneficio: "Autonomía hídrica en sequías" },
        { nombre: "Sensores de humedad del suelo", implementacion: 40, beneficio: "Riego preciso según necesidades" }
      ]
    },
    {
      categoria: "Biodiversidad",
      icon: <TreePine className="h-5 w-5" />,
      practicas: [
        { nombre: "Policultivos andinos", implementacion: 85, beneficio: "Mayor resistencia a plagas" },
        { nombre: "Corredores biológicos", implementacion: 30, beneficio: "Conservación de especies nativas" },
        { nombre: "Rotación de cultivos tradicionales", implementacion: 90, beneficio: "Mejor salud del suelo" }
      ]
    },
    {
      categoria: "Energía Renovable",
      icon: <Zap className="h-5 w-5" />,
      practicas: [
        { nombre: "Paneles solares para riego", implementacion: 25, beneficio: "Reducción 70% costos energéticos" },
        { nombre: "Biodigestores familiares", implementacion: 45, beneficio: "Gas natural de residuos orgánicos" },
        { nombre: "Molinos de viento pequeños", implementacion: 15, beneficio: "Energía para bombeo de agua" }
      ]
    }
  ];

  const impactoAmbiental = [
    { indicador: "Reducción CO2", valor: "2.5 toneladas/año", progreso: 78 },
    { indicador: "Ahorro de agua", valor: "40,000 litros/temporada", progreso: 65 },
    { indicador: "Biodiversidad conservada", valor: "15 especies nativas", progreso: 85 },
    { indicador: "Suelo regenerado", valor: "50 hectáreas", progreso: 55 }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="bg-gradient-to-r from-green-600 to-agriculture-earth text-white">
          IA para Sostenibilidad Agrícola
        </Badge>
        <h1 className="text-3xl font-bold text-agriculture-earth">
          Prácticas Sostenibles Impulsadas por IA
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transformando la agricultura andina mediante inteligencia artificial y conocimiento ancestral 
          para un futuro sostenible y resiliente al cambio climático.
        </p>
      </div>

      <Tabs defaultValue="practicas" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="practicas">Prácticas IA</TabsTrigger>
          <TabsTrigger value="impacto">Impacto Ambiental</TabsTrigger>
          <TabsTrigger value="regeneracion">Regeneración</TabsTrigger>
          <TabsTrigger value="comunidad">Comunidad</TabsTrigger>
        </TabsList>

        <TabsContent value="practicas" className="space-y-6">
          <div className="space-y-6">
            {practicasSostenibles.map((categoria, index) => (
              <Card key={index} className="border-l-4 border-l-agriculture-earth">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-agriculture-earth">
                    {categoria.icon}
                    {categoria.categoria}
                  </CardTitle>
                  <CardDescription>
                    Técnicas optimizadas con inteligencia artificial para máxima sostenibilidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoria.practicas.map((practica, practicaIndex) => (
                      <div key={practicaIndex} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{practica.nombre}</h4>
                          <Badge variant="secondary">{practica.implementacion}%</Badge>
                        </div>
                        <Progress value={practica.implementacion} className="mb-2" />
                        <p className="text-sm text-green-600 font-medium">✓ {practica.beneficio}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impacto" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Impacto Ambiental Medido
                </CardTitle>
                <CardDescription>
                  Resultados cuantificables de las prácticas sostenibles implementadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {impactoAmbiental.map((impacto, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{impacto.indicador}</span>
                      <span className="text-green-600 font-bold">{impacto.valor}</span>
                    </div>
                    <Progress value={impacto.progreso} className="h-2" />
                    <p className="text-xs text-muted-foreground">Meta anual: {impacto.progreso}% completado</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-agriculture-gold/10">
              <CardHeader>
                <CardTitle className="text-agriculture-earth">Certificaciones Sostenibles</CardTitle>
                <CardDescription>
                  Reconocimientos obtenidos por prácticas ambientalmente responsables
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">Agricultura Orgánica</p>
                      <p className="text-sm text-muted-foreground">Certificación libre de químicos sintéticos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-agriculture-earth rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">Carbono Neutro</p>
                      <p className="text-sm text-muted-foreground">Balance neto cero de emisiones</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-agriculture-gold rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">◐</span>
                    </div>
                    <div>
                      <p className="font-medium">Comercio Justo</p>
                      <p className="text-sm text-muted-foreground">En proceso de certificación</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Solicitar Auditoría Sostenible
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regeneracion" className="space-y-6">
          <Card className="bg-gradient-to-br from-agriculture-earth/20 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-agriculture-earth" />
                Agricultura Regenerativa con IA
              </CardTitle>
              <CardDescription>
                Más allá de sostenible: regenerando ecosistemas agrícolas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-agriculture-earth">Técnicas Regenerativas</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-l-green-500 pl-4">
                      <h4 className="font-medium">Compostaje Inteligente</h4>
                      <p className="text-sm text-muted-foreground">
                        IA optimiza mezclas de materiales orgánicos para compost de alta calidad
                      </p>
                    </div>
                    <div className="border-l-4 border-l-agriculture-earth pl-4">
                      <h4 className="font-medium">Microorganismos Beneficiosos</h4>
                      <p className="text-sm text-muted-foreground">
                        Inoculación de suelos con bacterias y hongos que mejoran la fertilidad
                      </p>
                    </div>
                    <div className="border-l-4 border-l-agriculture-gold pl-4">
                      <h4 className="font-medium">Pastoreo Rotacional</h4>
                      <p className="text-sm text-muted-foreground">
                        Integración ganado-agricultura para regeneración de pastizales
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-agriculture-earth">Resultados Medibles</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-md border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Carbono en suelo</span>
                        <span className="text-green-600 font-bold">+35%</span>
                      </div>
                      <Progress value={35} className="mt-1" />
                    </div>
                    <div className="bg-white p-3 rounded-md border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Retención de agua</span>
                        <span className="text-green-600 font-bold">+45%</span>
                      </div>
                      <Progress value={45} className="mt-1" />
                    </div>
                    <div className="bg-white p-3 rounded-md border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Biodiversidad microbiana</span>
                        <span className="text-green-600 font-bold">+60%</span>
                      </div>
                      <Progress value={60} className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comunidad" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-agriculture-terracotta" />
                  Red de Agricultores Sostenibles
                </CardTitle>
                <CardDescription>
                  Conectando comunidades para el intercambio de conocimientos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-agriculture-terracotta">1,247</div>
                  <p className="text-sm text-muted-foreground">Agricultores en la red</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-agriculture-earth">89</div>
                    <p className="text-xs text-muted-foreground">Comunidades activas</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-agriculture-gold">156</div>
                    <p className="text-xs text-muted-foreground">Prácticas compartidas</p>
                  </div>
                </div>
                <Button className="w-full bg-agriculture-terracotta hover:bg-agriculture-earth">
                  Unirse a la Red
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-agriculture-earth">Capacitación y Educación</CardTitle>
                <CardDescription>
                  Programas de formación en sostenibilidad agrícola
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Técnicas de compostaje</span>
                    <Badge variant="secondary">Básico</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manejo integrado de plagas</span>
                    <Badge variant="secondary">Intermedio</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Agricultura regenerativa</span>
                    <Badge variant="secondary">Avanzado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Certificación orgánica</span>
                    <Badge variant="secondary">Especialización</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Ver Cronograma de Cursos
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IASosteniblePage;
