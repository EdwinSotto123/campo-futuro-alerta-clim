
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PiggyBank, FileText, Building, ChevronRight, AlertCircle } from "lucide-react";

const FinanciamientoPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financiamiento Agrícola</h1>
        <p className="text-muted-foreground">
          Opciones de apoyo financiero para agricultores afectados por emergencias climáticas
        </p>
      </div>

      <Alert variant="destructive" className="bg-red-100 text-red-800 border-red-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>¡Importante!</AlertTitle>
        <AlertDescription>
          El Ministerio de Desarrollo Rural ha activado un fondo de emergencia para agricultores afectados por las recientes heladas. Las solicitudes cierran en 15 días.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="subsidios" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          <TabsTrigger value="subsidios" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            <span>Subsidios</span>
          </TabsTrigger>
          <TabsTrigger value="creditos" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Créditos</span>
          </TabsTrigger>
          <TabsTrigger value="seguros" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Seguros Agrícolas</span>
          </TabsTrigger>
        </TabsList>

        {/* Sección de Subsidios */}
        <TabsContent value="subsidios" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Programa de Emergencia Agrícola</CardTitle>
                    <CardDescription>Ministerio de Desarrollo Rural</CardDescription>
                  </div>
                  <Badge className="bg-agriculture-gold">Activo</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Descripción:</p>
                    <p className="text-sm text-muted-foreground">Apoyo económico directo a pequeños y medianos productores afectados por heladas, sequías o inundaciones.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Requisitos:</p>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground">
                      <li>Declaración de pérdidas con evidencia fotográfica</li>
                      <li>Título de propiedad o certificado de posesión</li>
                      <li>Registro en el padrón de agricultores</li>
                      <li>No haber recibido otro subsidio en los últimos 12 meses</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium">Monto máximo:</p>
                      <p className="text-lg font-bold text-agriculture-brown">Bs. 10,000</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Plazo solicitud:</p>
                      <p className="text-sm">15 días restantes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Ver requisitos completos</Button>
                <Button>Solicitar ahora</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Fondo de Desarrollo Agrario</CardTitle>
                    <CardDescription>Gobernación Regional</CardDescription>
                  </div>
                  <Badge className="bg-agriculture-gold">Activo</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Descripción:</p>
                    <p className="text-sm text-muted-foreground">Financiamiento no reembolsable para proyectos de infraestructura agrícola resiliente al clima.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Requisitos:</p>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground">
                      <li>Proyecto técnico con medidas de adaptación climática</li>
                      <li>Asociación formal de al menos 10 agricultores</li>
                      <li>Contrapartida del 20% del costo total</li>
                      <li>Evaluación de impacto ambiental simplificada</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium">Monto máximo:</p>
                      <p className="text-lg font-bold text-agriculture-brown">Bs. 50,000</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Plazo solicitud:</p>
                      <p className="text-sm">Convocatoria abierta</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Ver requisitos completos</Button>
                <Button>Solicitar ahora</Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Programa de Asistencia Técnica</CardTitle>
                <CardDescription>Ministerio de Desarrollo Productivo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Además del apoyo financiero, este programa ofrece asistencia técnica especializada para la implementación de medidas de mitigación y adaptación al cambio climático en comunidades rurales.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium text-sm">Capacitación agroclimática</h4>
                    <p className="text-xs text-muted-foreground">Talleres presenciales y virtuales sobre prácticas resilientes</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium text-sm">Visitas técnicas</h4>
                    <p className="text-xs text-muted-foreground">Evaluación en campo y recomendaciones personalizadas</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium text-sm">Insumos adaptados</h4>
                    <p className="text-xs text-muted-foreground">Provisión de semillas y materiales resistentes a condiciones adversas</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Postular a mi comunidad</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Sección de Créditos */}
        <TabsContent value="creditos" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3 bg-gradient-to-br from-agriculture-sky/10 to-white">
              <CardHeader>
                <CardTitle>Líneas de Crédito Preferenciales</CardTitle>
                <CardDescription>Con tasas reducidas para agricultores afectados por fenómenos climáticos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-agriculture-brown font-medium">Banco de Desarrollo Productivo</h3>
                    <p className="text-sm">Crédito "Siembra Segura" con tasa del 5% anual y plazos adaptados a ciclos agrícolas.</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Tasa de interés:</span>
                        <span className="font-medium">5% anual</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Plazo máximo:</span>
                        <span className="font-medium">5 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monto máximo:</span>
                        <span className="font-medium">Bs. 100,000</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">Más información</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-agriculture-brown font-medium">Cooperativa Agraria Nacional</h3>
                    <p className="text-sm">Créditos solidarios para grupos de agricultores con garantía comunitaria.</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Tasa de interés:</span>
                        <span className="font-medium">7% anual</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Plazo máximo:</span>
                        <span className="font-medium">3 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monto máximo:</span>
                        <span className="font-medium">Bs. 50,000</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">Más información</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-agriculture-brown font-medium">Banco Unión</h3>
                    <p className="text-sm">Programa "Reconstrucción Rural" para recuperación tras desastres.</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Tasa de interés:</span>
                        <span className="font-medium">6% anual</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Plazo máximo:</span>
                        <span className="font-medium">7 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monto máximo:</span>
                        <span className="font-medium">Bs. 200,000</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">Más información</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requisitos generales</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Cédula de identidad vigente</li>
                  <li>Documento que acredite la propiedad o posesión del terreno</li>
                  <li>Declaración de la última cosecha o actividad productiva</li>
                  <li>Plan de inversión para el monto solicitado</li>
                  <li>Historial crediticio (no excluyente)</li>
                  <li>Constancia de afectación por desastre (para créditos de recuperación)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Garantías aceptadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Prenda agraria sobre cosechas futuras</li>
                  <li>Garantía hipotecaria sobre el terreno</li>
                  <li>Garantía solidaria de grupos organizados</li>
                  <li>Maquinaria agrícola como garantía prendaria</li>
                  <li>Warrants de productos almacenados</li>
                  <li>Fondo de garantía para pequeños productores (cubre hasta el 50%)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proceso de solicitud</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-6 text-sm space-y-2">
                  <li>Pre-evaluación en línea o en oficina</li>
                  <li>Presentación de documentos requeridos</li>
                  <li>Visita técnica a la propiedad</li>
                  <li>Evaluación de viabilidad y capacidad de pago</li>
                  <li>Aprobación y desembolso</li>
                  <li>Seguimiento y asistencia técnica</li>
                </ol>
                <Button className="w-full mt-4">Iniciar pre-evaluación</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sección de Seguros Agrícolas */}
        <TabsContent value="seguros" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-agriculture-earth/15 to-white">
              <CardHeader>
                <CardTitle>Programa Nacional de Seguro Agrícola</CardTitle>
                <CardDescription>Proteja su inversión contra eventos climáticos adversos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">El Seguro Agrícola es una herramienta financiera que permite al productor agropecuario transferir los riesgos asociados a eventos climáticos adversos a una compañía aseguradora mediante el pago de una prima.</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="text-agriculture-brown font-medium mb-2">Seguro Catastrófico</div>
                    <p className="text-sm mb-4">Cobertura básica subsidiada para pequeños productores ante eventos de gran magnitud.</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Costo:</span>
                        <span className="font-medium">Subsidiado</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cobertura:</span>
                        <span className="font-medium">Hasta Bs. 5,000/ha</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-4">Verificar elegibilidad</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-agriculture-gold text-white text-xs px-2 py-1">Recomendado</div>
                    <div className="text-agriculture-brown font-medium mb-2">Seguro Multirriesgo</div>
                    <p className="text-sm mb-4">Protección contra sequías, inundaciones, heladas, granizo y otros eventos climáticos.</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Costo:</span>
                        <span className="font-medium">3-5% del valor asegurado</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cobertura:</span>
                        <span className="font-medium">Hasta 80% de inversión</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-4">Solicitar cotización</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="text-agriculture-brown font-medium mb-2">Seguro Paramétrico</div>
                    <p className="text-sm mb-4">Indemnización automática basada en índices meteorológicos como precipitación o temperatura.</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Costo:</span>
                        <span className="font-medium">2-4% del valor asegurado</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cobertura:</span>
                        <span className="font-medium">Liquidación inmediata</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-4">Más información</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>¿Cómo funciona el seguro agrícola?</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-6 text-sm space-y-2">
                  <li><span className="font-medium">Evaluación inicial:</span> Un técnico visita su parcela para verificar las condiciones de los cultivos.</li>
                  <li><span className="font-medium">Contratación:</span> Se establece la suma asegurada según el tipo de cultivo y área.</li>
                  <li><span className="font-medium">Monitoreo:</span> Durante el ciclo agrícola se monitorean condiciones climáticas.</li>
                  <li><span className="font-medium">Aviso de siniestro:</span> En caso de evento climático adverso, debe notificar en 72 horas.</li>
                  <li><span className="font-medium">Evaluación de daños:</span> Un perito evalúa y cuantifica las pérdidas.</li>
                  <li><span className="font-medium">Indemnización:</span> Pago según porcentaje de daño verificado.</li>
                </ol>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver simulación</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultivos asegurables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-agriculture-brown"></div>
                    <span>Papa</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-agriculture-brown"></div>
                    <span>Maíz</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-agriculture-brown"></div>
                    <span>Trigo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-agriculture-brown"></div>
                    <span>Quinua</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-agriculture-brown"></div>
                    <span>Haba</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-agriculture-brown"></div>
                    <span>Soya</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-agriculture-brown"></div>
                    <span>Arroz</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-agriculture-brown"></div>
                    <span>Hortalizas</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">*Para otros cultivos consultar disponibilidad.</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full flex items-center justify-center">
                  Ver requisitos específicos por cultivo <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanciamientoPage;
