
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight, ChevronDown, Leaf, Umbrella, Sprout, Recycle } from "lucide-react";

const ConsejosPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("impacto");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Consejos de IA Personalizados</h1>
        <p className="text-muted-foreground">
          Recomendaciones inteligentes para una agricultura resiliente y sostenible
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="impacto" className="flex items-center gap-2">
            <Umbrella className="h-4 w-4" />
            <span>Reducir Impacto</span>
          </TabsTrigger>
          <TabsTrigger value="sostenibilidad" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <span>Sostenibilidad</span>
          </TabsTrigger>
          <TabsTrigger value="adaptacion" className="flex items-center gap-2">
            <Recycle className="h-4 w-4" />
            <span>Adaptación</span>
          </TabsTrigger>
          <TabsTrigger value="innovacion" className="flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            <span>Innovación</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Sección: Cómo disminuir el impacto */}
        <TabsContent value="impacto" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-agriculture-terracotta/20 to-agriculture-earth/10">
              <CardHeader>
                <CardTitle className="text-xl text-agriculture-terracotta">¿Cómo Disminuir el Impacto de Eventos Climáticos?</CardTitle>
                <CardDescription>
                  Estrategias prácticas para mitigar el efecto de desastres naturales en cultivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Los eventos climáticos extremos pueden devastar los cultivos. Estas recomendaciones te ayudarán a prepararte y responder eficazmente.</p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-agriculture-brown font-medium">
                      Antes del evento climático
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Establece sistemas de drenaje adecuados para evitar inundaciones</li>
                        <li>Mantén estructuras de protección como mallas antigranizo o cortavientos</li>
                        <li>Diversifica tus cultivos para reducir la vulnerabilidad</li>
                        <li>Contrata seguros agrícolas que cubran desastres climáticos</li>
                        <li>Mantén reservas de agua para periodos de sequía</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-agriculture-brown font-medium">
                      Durante el evento climático
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Implementa sistemas de protección inmediata para cultivos sensibles</li>
                        <li>Ejecuta planes de emergencia previamente establecidos</li>
                        <li>Mantén comunicación con autoridades y otros agricultores de la zona</li>
                        <li>Activa los sistemas de drenaje o riego según sea necesario</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-agriculture-brown font-medium">
                      Después del evento climático
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Evalúa los daños metódicamente y documéntalos para seguros</li>
                        <li>Recupera lo recuperable y desecha lo destruido para evitar plagas</li>
                        <li>Implementa técnicas de recuperación de suelos si es necesario</li>
                        <li>Busca apoyo gubernamental o de ONGs para la recuperación</li>
                        <li>Analiza la experiencia para mejorar tu preparación futura</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full md:w-auto">
                  Solicitar plan personalizado
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preparación para Heladas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Las heladas pueden dañar severamente los cultivos. Considera estas medidas:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Instala sistemas de aspersión de agua para crear un efecto protector</li>
                  <li>Utiliza barreras físicas como coberturas o túneles</li>
                  <li>Planta en áreas elevadas donde el aire frío no se estanque</li>
                  <li>Mantén el suelo húmedo pues contiene mejor el calor</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                  Leer más <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contra Inundaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Las lluvias intensas pueden causar pérdidas cuantiosas:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Construye canales de drenaje estratégicos en tus terrenos</li>
                  <li>Eleva los cultivos sensibles en camas o montículos</li>
                  <li>Establece barreras naturales para contención de agua</li>
                  <li>Planta variedades resistentes a condiciones de exceso de agua</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                  Leer más <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sección: Cómo hacer sostenible */}
        <TabsContent value="sostenibilidad" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-agriculture-gold/20 to-agriculture-brown/10">
              <CardHeader>
                <CardTitle className="text-xl text-agriculture-brown">¿Cómo Hacer Sostenible tu Producción?</CardTitle>
                <CardDescription>
                  Prácticas recomendadas para una agricultura que perdure en el tiempo y respete el medio ambiente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">La sostenibilidad no solo es beneficiosa para el planeta, sino también para la rentabilidad a largo plazo de tu explotación agrícola.</p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-agriculture-earth font-medium">
                      Manejo responsable del agua
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Implementa sistemas de riego por goteo para mayor eficiencia</li>
                        <li>Recoge agua de lluvia para períodos de escasez</li>
                        <li>Utiliza sensores de humedad para optimizar el riego</li>
                        <li>Mantén el suelo con cobertura vegetal para reducir la evaporación</li>
                        <li>Programa el riego en horas de menor evaporación (amanecer o atardecer)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-agriculture-earth font-medium">
                      Salud del suelo
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Practica la rotación de cultivos para mantener la fertilidad del suelo</li>
                        <li>Utiliza abonos orgánicos y compostaje de residuos de cosecha</li>
                        <li>Implementa cultivos de cobertura para evitar la erosión</li>
                        <li>Minimiza la labranza para conservar la estructura del suelo</li>
                        <li>Realiza análisis periódicos de suelo para optimizar fertilizantes</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-agriculture-earth font-medium">
                      Biodiversidad y control natural de plagas
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Fomenta la presencia de insectos benéficos</li>
                        <li>Mantén áreas naturales dentro o alrededor de tu parcela</li>
                        <li>Practica el control integrado de plagas (MIP)</li>
                        <li>Utiliza variedades locales adaptadas a las condiciones</li>
                        <li>Combina cultivos complementarios (policultivos)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full md:w-auto">
                  Certificaciones disponibles
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Energías renovables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Reduce tu huella de carbono y costos operativos:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Sistemas de bombeo solar para riego</li>
                  <li>Generadores eólicos para pequeñas instalaciones</li>
                  <li>Biodigestores para aprovechar residuos orgánicos</li>
                  <li>Programas de financiamiento para energías limpias</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                  Explorar opciones <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Economía circular</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Convierte desechos en recursos valiosos:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Compostaje de residuos de cosecha y procesamiento</li>
                  <li>Reutilización de aguas de lavado para riego</li>
                  <li>Valorización de subproductos para alimentación animal</li>
                  <li>Envases y embalajes biodegradables o reutilizables</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                  Ver ejemplos <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sección: Adaptación al cambio climático */}
        <TabsContent value="adaptacion" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3 bg-gradient-to-br from-agriculture-sky/20 to-white">
              <CardHeader>
                <CardTitle className="text-xl text-agriculture-sky">Adaptación al Cambio Climático</CardTitle>
                <CardDescription>
                  Estrategias para adaptar tu producción a las nuevas condiciones climáticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-agriculture-sky flex items-center">
                      <ChevronDown className="h-4 w-4 mr-1" /> Diversificación de cultivos
                    </h3>
                    <p className="text-sm">Reduce el riesgo distribuyendo tu producción entre diferentes especies y variedades con distintas tolerancias a condiciones climáticas.</p>
                    <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                      Cultivos recomendados <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-agriculture-sky flex items-center">
                      <ChevronDown className="h-4 w-4 mr-1" /> Calendario agrícola adaptado
                    </h3>
                    <p className="text-sm">Ajusta los ciclos de siembra y cosecha según las nuevas tendencias climáticas para evitar periodos críticos de sequía, lluvia o temperaturas extremas.</p>
                    <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                      Crear calendario <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-agriculture-sky flex items-center">
                      <ChevronDown className="h-4 w-4 mr-1" /> Variedades resistentes
                    </h3>
                    <p className="text-sm">Utiliza variedades de cultivos que se adapten mejor a condiciones de estrés como sequías, altas temperaturas o nuevas plagas emergentes.</p>
                    <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                      Catálogo de semillas <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tecnologías de precisión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">La agricultura de precisión optimiza recursos y mejora la adaptabilidad:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Estaciones meteorológicas en campo</li>
                  <li>Sensores de humedad del suelo</li>
                  <li>Mapeo de variabilidad de suelos</li>
                  <li>Aplicaciones móviles para monitoreo</li>
                </ul>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown mt-2">
                  Soluciones accesibles <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Infraestructura adaptativa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Mejora tus instalaciones para enfrentar eventos extremos:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Invernaderos adaptados a altas temperaturas</li>
                  <li>Sistemas de recolección de agua de lluvia</li>
                  <li>Estructuras resistentes a vientos fuertes</li>
                  <li>Zonas de sombra para cultivos sensibles</li>
                </ul>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown mt-2">
                  Diseños eficientes <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gestión de riesgos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Protege tu inversión con estrategias financieras:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Seguros agrícolas paramétricos</li>
                  <li>Reservas económicas para emergencias</li>
                  <li>Diversificación de ingresos</li>
                  <li>Asociaciones y cooperativas</li>
                </ul>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown mt-2">
                  Opciones de seguros <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sección: Innovación agrícola */}
        <TabsContent value="innovacion" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-agriculture-brown/20 to-agriculture-gold/10">
              <CardHeader>
                <CardTitle className="text-xl text-agriculture-brown">Innovación Agrícola</CardTitle>
                <CardDescription>
                  Nuevas tecnologías y enfoques para mejorar la productividad y sostenibilidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Agricultura 4.0</h3>
                    <p className="text-sm">La digitalización llega al campo con herramientas accesibles para agricultores de todos los tamaños:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>Sistemas de monitoreo remoto de cultivos</li>
                      <li>Aplicaciones para detección temprana de plagas</li>
                      <li>Drones para evaluación de estado de cultivos</li>
                      <li>Big data para optimización de decisiones</li>
                    </ul>
                    <Button size="sm" variant="outline" className="mt-2">
                      Explorar soluciones digitales
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Agricultura regenerativa</h3>
                    <p className="text-sm">Más allá de sostener, este enfoque busca regenerar los ecosistemas agrícolas:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>Técnicas de labranza mínima o cero</li>
                      <li>Integración de ganadería y agricultura</li>
                      <li>Manejo holístico de paisajes</li>
                      <li>Captura de carbono en suelos agrícolas</li>
                    </ul>
                    <Button size="sm" variant="outline" className="mt-2">
                      Certificación regenerativa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Biotecnología adaptativa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">Avances en el mejoramiento de cultivos para condiciones climáticas extremas:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-md p-3 text-sm">
                    <p className="font-medium">Tolerancia a sequía</p>
                    <p className="text-xs text-muted-foreground">Variedades que requieren hasta 30% menos agua</p>
                  </div>
                  <div className="border rounded-md p-3 text-sm">
                    <p className="font-medium">Resistencia a calor</p>
                    <p className="text-xs text-muted-foreground">Cultivos que soportan temperaturas hasta 5°C más altas</p>
                  </div>
                  <div className="border rounded-md p-3 text-sm">
                    <p className="font-medium">Tolerancia a salinidad</p>
                    <p className="text-xs text-muted-foreground">Para zonas con intrusión salina por aumento del nivel del mar</p>
                  </div>
                  <div className="border rounded-md p-3 text-sm">
                    <p className="font-medium">Ciclos más cortos</p>
                    <p className="text-xs text-muted-foreground">Variedades de maduración rápida para ventanas climáticas estrechas</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                  Catálogo de semillas <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financiamiento para innovación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">Opciones para implementar nuevas tecnologías en tu explotación:</p>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Subsidios gubernamentales para adopción tecnológica</li>
                  <li>Microcréditos para pequeños productores</li>
                  <li>Programas de cooperación internacional</li>
                  <li>Incubadoras y aceleradoras de agronegocios</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="link" className="p-0 h-auto flex items-center text-agriculture-brown">
                  Ver opciones disponibles <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsejosPage;
