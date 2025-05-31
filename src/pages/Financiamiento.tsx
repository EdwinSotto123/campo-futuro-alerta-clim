import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PiggyBank, 
  FileText, 
  Building, 
  ChevronRight, 
  AlertCircle,
  AlertTriangle,
  Brain,
  Target,
  Calculator,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  User,
  Briefcase,
  DollarSign,
  Calendar,
  Percent,
  Award,
  Info,
  Search,
  Filter,
  Download,
  Share,
  Phone,
  Mail,
  ExternalLink,
  Lightbulb,
  BarChart3,
  Zap,
  Sparkles,
  RefreshCw,
  Send,
  Eye,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Users,
  Globe,
  Banknote,
  CreditCard,
  Wallet,
  HandCoins,
  Coins
} from "lucide-react";

interface PerfilAgricultor {
  nombre: string;
  ubicacion: string;
  tipoProductor: string;
  hectareas: string;
  cultivos: string[];
  experiencia: string;
  ingresoAnual: string;
  necesidadFinanciamiento: string;
  montoRequerido: string;
  plazoPreferido: string;
  tipoGarantia: string;
  afectacionClimatica: boolean;
  tipoAfectacion: string;
  asociacion: boolean;
  historialCrediticio: string;
}

interface OpcionFinanciamiento {
  id: string;
  nombre: string;
  tipo: 'subsidio' | 'credito' | 'seguro' | 'programa';
  entidad: string;
  descripcion: string;
  montoMaximo: number;
  tasaInteres?: number;
  plazoMaximo: string;
  requisitos: string[];
  ventajas: string[];
  compatibilidad: number;
  urgencia: 'alta' | 'media' | 'baja';
  estado: 'activo' | 'proximo' | 'cerrado';
  fechaLimite?: string;
  documentos: string[];
  contacto: {
    telefono: string;
    email: string;
    direccion: string;
  };
}

const FinanciamientoPage = () => {
  const [activeTab, setActiveTab] = useState('ia-recomendador');
  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const [analizando, setAnalizando] = useState(false);
  const [recomendaciones, setRecomendaciones] = useState<OpcionFinanciamiento[]>([]);
  const [perfil, setPerfil] = useState<PerfilAgricultor>({
    nombre: '',
    ubicacion: '',
    tipoProductor: '',
    hectareas: '',
    cultivos: [],
    experiencia: '',
    ingresoAnual: '',
    necesidadFinanciamiento: '',
    montoRequerido: '',
    plazoPreferido: '',
    tipoGarantia: '',
    afectacionClimatica: false,
    tipoAfectacion: '',
    asociacion: false,
    historialCrediticio: ''
  });

  const opcionesFinanciamiento: OpcionFinanciamiento[] = [
    {
      id: '1',
      nombre: 'Programa de Emergencia Agrícola',
      tipo: 'subsidio',
      entidad: 'Ministerio de Desarrollo Rural',
      descripcion: 'Apoyo económico directo para agricultores afectados por eventos climáticos extremos',
      montoMaximo: 10000,
      plazoMaximo: 'No aplica',
      requisitos: [
        'Declaración de pérdidas con evidencia fotográfica',
        'Título de propiedad o certificado de posesión',
        'Registro en el padrón de agricultores',
        'No haber recibido subsidio en últimos 12 meses'
      ],
      ventajas: [
        'No requiere devolución',
        'Proceso simplificado',
        'Desembolso rápido (15 días)',
        'Sin garantías adicionales'
      ],
      compatibilidad: 95,
      urgencia: 'alta',
      estado: 'activo',
      fechaLimite: '2024-07-15',
      documentos: ['CI', 'Título propiedad', 'Fotos daños', 'Formulario solicitud'],
      contacto: {
        telefono: '800-12345',
        email: 'emergencia@mdr.gob.bo',
        direccion: 'Av. Camacho 1471, La Paz'
      }
    },
    {
      id: '2',
      nombre: 'Crédito Siembra Segura',
      tipo: 'credito',
      entidad: 'Banco de Desarrollo Productivo',
      descripcion: 'Línea de crédito preferencial para capital de trabajo agrícola con tasa subsidiada',
      montoMaximo: 100000,
      tasaInteres: 5,
      plazoMaximo: '5 años',
      requisitos: [
        'Plan de inversión detallado',
        'Garantía hipotecaria o prendaria',
        'Historial crediticio favorable',
        'Evaluación técnica del proyecto'
      ],
      ventajas: [
        'Tasa de interés preferencial 5%',
        'Período de gracia hasta 12 meses',
        'Asistencia técnica incluida',
        'Seguro de vida incluido'
      ],
      compatibilidad: 88,
      urgencia: 'media',
      estado: 'activo',
      documentos: ['CI', 'Plan inversión', 'Garantías', 'Estados financieros'],
      contacto: {
        telefono: '800-67890',
        email: 'creditos@bdp.com.bo',
        direccion: 'Av. 16 de Julio 1628, La Paz'
      }
    },
    {
      id: '3',
      nombre: 'Seguro Multirriesgo Climático',
      tipo: 'seguro',
      entidad: 'Seguros Universales',
      descripcion: 'Protección integral contra eventos climáticos adversos con cobertura hasta 80%',
      montoMaximo: 50000,
      plazoMaximo: '1 año renovable',
      requisitos: [
        'Evaluación técnica de cultivos',
        'Historial productivo de 2 años',
        'Implementación de buenas prácticas',
        'Pago de prima (3-5% valor asegurado)'
      ],
      ventajas: [
        'Cobertura contra múltiples riesgos',
        'Indemnización rápida',
        'Prima subsidiada para pequeños productores',
        'Asesoría técnica preventiva'
      ],
      compatibilidad: 82,
      urgencia: 'media',
      estado: 'activo',
      documentos: ['CI', 'Título propiedad', 'Historial productivo', 'Evaluación técnica'],
      contacto: {
        telefono: '800-11111',
        email: 'seguros@universales.com.bo',
        direccion: 'Av. Arce 2177, La Paz'
      }
    },
    {
      id: '4',
      nombre: 'Fondo de Desarrollo Agrario',
      tipo: 'programa',
      entidad: 'Gobernación Regional',
      descripcion: 'Financiamiento para proyectos de infraestructura agrícola resiliente al clima',
      montoMaximo: 50000,
      plazoMaximo: 'No aplica',
      requisitos: [
        'Proyecto técnico con medidas de adaptación',
        'Asociación formal mínimo 10 agricultores',
        'Contrapartida 20% del costo total',
        'Evaluación de impacto ambiental'
      ],
      ventajas: [
        'Financiamiento no reembolsable',
        'Asistencia técnica especializada',
        'Fortalecimiento organizacional',
        'Impacto comunitario'
      ],
      compatibilidad: 75,
      urgencia: 'baja',
      estado: 'activo',
      documentos: ['Proyecto técnico', 'Personería jurídica', 'Contrapartida', 'EIA'],
      contacto: {
        telefono: '800-22222',
        email: 'desarrollo@gobernacion.bo',
        direccion: 'Plaza Murillo s/n, La Paz'
      }
    }
  ];

  const analizarPerfil = async () => {
    setAnalizando(true);
    
    // Simular análisis de IA
    setTimeout(() => {
      // Filtrar y ordenar opciones según el perfil
      const recomendacionesFiltradas = opcionesFinanciamiento
        .map(opcion => {
          let compatibilidad = opcion.compatibilidad;
          
          // Ajustar compatibilidad según perfil
          if (perfil.afectacionClimatica && opcion.tipo === 'subsidio') {
            compatibilidad += 10;
          }
          
          if (perfil.tipoProductor === 'pequeño' && opcion.montoMaximo <= 20000) {
            compatibilidad += 5;
          }
          
          if (perfil.asociacion && opcion.tipo === 'programa') {
            compatibilidad += 8;
          }
          
          return { ...opcion, compatibilidad: Math.min(100, compatibilidad) };
        })
        .sort((a, b) => b.compatibilidad - a.compatibilidad);
      
      setRecomendaciones(recomendacionesFiltradas);
      setAnalizando(false);
    }, 3000);
  };

  const getCompatibilidadColor = (compatibilidad: number) => {
    if (compatibilidad >= 90) return 'text-green-600 bg-green-50';
    if (compatibilidad >= 75) return 'text-blue-600 bg-blue-50';
    if (compatibilidad >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'subsidio': return <HandCoins className="h-5 w-5 text-green-600" />;
      case 'credito': return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'seguro': return <Shield className="h-5 w-5 text-purple-600" />;
      case 'programa': return <Users className="h-5 w-5 text-orange-600" />;
      default: return <Coins className="h-5 w-5 text-gray-600" />;
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Mejorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <PiggyBank className="h-8 w-8 text-agriculture-terracotta" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth bg-clip-text text-transparent">
              Financiamiento Agrícola
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Encuentra las mejores opciones de financiamiento con ayuda de nuestra IA
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">47 Opciones Activas</Badge>
            <Badge className="bg-blue-100 text-blue-800">IA Personalizada</Badge>
            <Badge className="bg-purple-100 text-purple-800">Asesoría Gratuita</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Asesoría Telefónica
          </Button>
          <Button className="bg-agriculture-terracotta hover:bg-agriculture-earth">
            <Download className="h-4 w-4 mr-2" />
            Guía Completa
          </Button>
        </div>
      </div>

      {/* Alerta Importante */}
      <Alert className="bg-orange-50 border-orange-200">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800">¡Oportunidad Limitada!</AlertTitle>
        <AlertDescription className="text-orange-700">
          El Ministerio de Desarrollo Rural ha activado un fondo de emergencia para agricultores afectados por heladas. 
          <strong> Solicitudes cierran en 12 días.</strong>
          <Button variant="link" className="p-0 ml-2 text-orange-800 underline">
            Ver detalles →
          </Button>
        </AlertDescription>
      </Alert>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Banknote className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold">Bs. 2.4M</p>
            <p className="text-sm text-muted-foreground">Financiamiento Disponible</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">1,847</p>
            <p className="text-sm text-muted-foreground">Solicitudes Aprobadas</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">7 días</p>
            <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Percent className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">94%</p>
            <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal con Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ia-recomendador" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            IA Recomendador
          </TabsTrigger>
          <TabsTrigger value="subsidios" className="flex items-center gap-2">
            <HandCoins className="h-4 w-4" />
            Subsidios
          </TabsTrigger>
          <TabsTrigger value="creditos" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Créditos
          </TabsTrigger>
          <TabsTrigger value="seguros" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguros
          </TabsTrigger>
        </TabsList>

        {/* Tab IA Recomendador */}
        <TabsContent value="ia-recomendador" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario de Perfil */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-agriculture-gold/30 bg-gradient-to-br from-agriculture-gold/5 to-white">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-agriculture-gold" />
                    Coloca tus Datos - IA Analizará tu Perfil
                  </CardTitle>
                  <CardDescription>
                    Nuestra IA buscará las opciones que más se adapten a tu perfil y necesidades específicas
                  </CardDescription>
              </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Información Personal */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información Personal
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input
                          id="nombre"
                          placeholder="Ej: Juan Pérez Mamani"
                          value={perfil.nombre}
                          onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                        />
                  </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ubicacion">Ubicación</Label>
                        <Select value={perfil.ubicacion} onValueChange={(value) => setPerfil({...perfil, ubicacion: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu región" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="la-paz">La Paz</SelectItem>
                            <SelectItem value="cochabamba">Cochabamba</SelectItem>
                            <SelectItem value="santa-cruz">Santa Cruz</SelectItem>
                            <SelectItem value="potosi">Potosí</SelectItem>
                            <SelectItem value="oruro">Oruro</SelectItem>
                            <SelectItem value="tarija">Tarija</SelectItem>
                            <SelectItem value="chuquisaca">Chuquisaca</SelectItem>
                            <SelectItem value="beni">Beni</SelectItem>
                            <SelectItem value="pando">Pando</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    </div>
                  </div>

                  {/* Información Productiva */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Información Productiva
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tipoProductor">Tipo de Productor</Label>
                        <Select value={perfil.tipoProductor} onValueChange={(value) => setPerfil({...perfil, tipoProductor: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pequeño">Pequeño (menos de 5 ha)</SelectItem>
                            <SelectItem value="mediano">Mediano (5-20 ha)</SelectItem>
                            <SelectItem value="grande">Grande (más de 20 ha)</SelectItem>
                          </SelectContent>
                        </Select>
          </div>
                      
                  <div className="space-y-2">
                        <Label htmlFor="hectareas">Hectáreas Cultivadas</Label>
                        <Input
                          id="hectareas"
                          placeholder="Ej: 3.5"
                          value={perfil.hectareas}
                          onChange={(e) => setPerfil({...perfil, hectareas: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="experiencia">Años de Experiencia</Label>
                        <Select value={perfil.experiencia} onValueChange={(value) => setPerfil({...perfil, experiencia: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona experiencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3">1-3 años</SelectItem>
                            <SelectItem value="4-10">4-10 años</SelectItem>
                            <SelectItem value="11-20">11-20 años</SelectItem>
                            <SelectItem value="20+">Más de 20 años</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ingresoAnual">Ingreso Anual Estimado</Label>
                        <Select value={perfil.ingresoAnual} onValueChange={(value) => setPerfil({...perfil, ingresoAnual: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona rango" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-20000">Bs. 0 - 20,000</SelectItem>
                            <SelectItem value="20000-50000">Bs. 20,000 - 50,000</SelectItem>
                            <SelectItem value="50000-100000">Bs. 50,000 - 100,000</SelectItem>
                            <SelectItem value="100000+">Más de Bs. 100,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Necesidades de Financiamiento */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Necesidades de Financiamiento
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="necesidadFinanciamiento">¿Para qué necesitas financiamiento?</Label>
                        <Select value={perfil.necesidadFinanciamiento} onValueChange={(value) => setPerfil({...perfil, necesidadFinanciamiento: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona necesidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="capital-trabajo">Capital de trabajo</SelectItem>
                            <SelectItem value="infraestructura">Infraestructura</SelectItem>
                            <SelectItem value="maquinaria">Maquinaria y equipos</SelectItem>
                            <SelectItem value="emergencia">Emergencia climática</SelectItem>
                            <SelectItem value="expansion">Expansión productiva</SelectItem>
                          </SelectContent>
                        </Select>
                  </div>
                  
                  <div className="space-y-2">
                        <Label htmlFor="montoRequerido">Monto Requerido (Bs.)</Label>
                        <Input
                          id="montoRequerido"
                          placeholder="Ej: 15000"
                          value={perfil.montoRequerido}
                          onChange={(e) => setPerfil({...perfil, montoRequerido: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="plazoPreferido">Plazo Preferido</Label>
                        <Select value={perfil.plazoPreferido} onValueChange={(value) => setPerfil({...perfil, plazoPreferido: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona plazo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6-meses">6 meses</SelectItem>
                            <SelectItem value="1-año">1 año</SelectItem>
                            <SelectItem value="2-años">2 años</SelectItem>
                            <SelectItem value="3-5-años">3-5 años</SelectItem>
                            <SelectItem value="mas-5-años">Más de 5 años</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="historialCrediticio">Historial Crediticio</Label>
                        <Select value={perfil.historialCrediticio} onValueChange={(value) => setPerfil({...perfil, historialCrediticio: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona historial" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excelente">Excelente</SelectItem>
                            <SelectItem value="bueno">Bueno</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="sin-historial">Sin historial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Situación Especial */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Situación Especial
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="afectacionClimatica"
                          checked={perfil.afectacionClimatica}
                          onChange={(e) => setPerfil({...perfil, afectacionClimatica: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="afectacionClimatica">
                          He sido afectado por eventos climáticos en los últimos 12 meses
                        </Label>
                      </div>
                      
                      {perfil.afectacionClimatica && (
                        <div className="space-y-2">
                          <Label htmlFor="tipoAfectacion">Tipo de Afectación</Label>
                          <Select value={perfil.tipoAfectacion} onValueChange={(value) => setPerfil({...perfil, tipoAfectacion: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="heladas">Heladas</SelectItem>
                              <SelectItem value="sequia">Sequía</SelectItem>
                              <SelectItem value="inundaciones">Inundaciones</SelectItem>
                              <SelectItem value="granizo">Granizo</SelectItem>
                              <SelectItem value="plagas">Plagas</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="asociacion"
                          checked={perfil.asociacion}
                          onChange={(e) => setPerfil({...perfil, asociacion: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="asociacion">
                          Pertenezco a una asociación o cooperativa de productores
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={analizarPerfil}
                    disabled={analizando || !perfil.nombre || !perfil.ubicacion}
                    className="w-full bg-agriculture-terracotta hover:bg-agriculture-earth"
                    size="lg"
                  >
                    {analizando ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Analizando tu Perfil con IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Buscar Opciones Personalizadas
                      </>
                    )}
                  </Button>
              </CardContent>
            </Card>
          </div>

            {/* Panel de Resultados */}
            <div className="space-y-4">
              {/* Estado del Análisis */}
              <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Estado del Análisis
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  {analizando ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-sm">Analizando perfil...</span>
                      </div>
                      <Progress value={66} className="h-2" />
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>✓ Evaluando información personal</p>
                        <p>✓ Analizando capacidad financiera</p>
                        <p className="text-blue-600">→ Buscando opciones compatibles</p>
                        <p className="text-gray-400">○ Generando recomendaciones</p>
                      </div>
                    </div>
                  ) : recomendaciones.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Análisis Completado</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Se encontraron <strong>{recomendaciones.length} opciones</strong> compatibles con tu perfil</p>
                        <p>Compatibilidad promedio: <strong>{Math.round(recomendaciones.reduce((acc, rec) => acc + rec.compatibilidad, 0) / recomendaciones.length)}%</strong></p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Completa el formulario para obtener recomendaciones personalizadas
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>

              {/* Tips de IA */}
              <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Lightbulb className="h-5 w-5" />
                    Tips de IA
                  </CardTitle>
              </CardHeader>
                <CardContent className="text-sm text-blue-700 space-y-2">
                  <p>• Completa todos los campos para mejores recomendaciones</p>
                  <p>• Si fuiste afectado por clima, tienes prioridad en subsidios</p>
                  <p>• Las asociaciones tienen acceso a programas especiales</p>
                  <p>• Un buen historial crediticio mejora tus opciones</p>
              </CardContent>
            </Card>
            </div>
                  </div>

          {/* Resultados de Recomendaciones */}
          {recomendaciones.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Recomendaciones Personalizadas
                </h2>
                <Badge variant="outline" className="text-sm">
                  {recomendaciones.length} opciones encontradas
                </Badge>
                  </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence>
                  {recomendaciones.map((opcion, index) => (
                    <motion.div
                      key={opcion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`h-full ${opcion.compatibilidad >= 90 ? 'border-green-200 bg-green-50' : ''}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {getTipoIcon(opcion.tipo)}
                              <div>
                                <CardTitle className="text-lg">{opcion.nombre}</CardTitle>
                                <CardDescription>{opcion.entidad}</CardDescription>
                  </div>
                  </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getCompatibilidadColor(opcion.compatibilidad)}>
                                {opcion.compatibilidad}% Compatible
                              </Badge>
                              <Badge className={getUrgenciaColor(opcion.urgencia)}>
                                {opcion.urgencia === 'alta' ? 'Urgente' : 
                                 opcion.urgencia === 'media' ? 'Moderado' : 'Sin prisa'}
                              </Badge>
                  </div>
                  </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{opcion.descripcion}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Monto Máximo:</p>
                              <p className="text-lg font-bold text-agriculture-terracotta">
                                Bs. {opcion.montoMaximo.toLocaleString()}
                              </p>
                  </div>
                            <div>
                              <p className="font-medium">
                                {opcion.tasaInteres ? 'Tasa de Interés:' : 'Plazo:'}
                              </p>
                              <p className="text-lg font-bold">
                                {opcion.tasaInteres ? `${opcion.tasaInteres}% anual` : opcion.plazoMaximo}
                              </p>
                  </div>
                </div>
                          
                          <div className="space-y-2">
                            <p className="font-medium text-sm">Principales Ventajas:</p>
                            <ul className="text-xs space-y-1">
                              {opcion.ventajas.slice(0, 3).map((ventaja, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {ventaja}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {opcion.fechaLimite && (
                            <Alert className="p-3">
                              <Clock className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                <strong>Fecha límite:</strong> {opcion.fechaLimite}
                              </AlertDescription>
                            </Alert>
                          )}
              </CardContent>
                        
                        <CardFooter className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Button size="sm" className="flex-1 bg-agriculture-terracotta hover:bg-agriculture-earth">
                            <Send className="h-4 w-4 mr-2" />
                            Solicitar
                </Button>
              </CardFooter>
            </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Otros Tabs (simplificados) */}
        <TabsContent value="subsidios" className="space-y-4">
          <div className="text-center py-12">
            <HandCoins className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Subsidios Disponibles</h3>
            <p className="text-muted-foreground mb-6">
              Explora todas las opciones de subsidios gubernamentales
            </p>
            <Button className="bg-agriculture-terracotta hover:bg-agriculture-earth">
              Ver Todos los Subsidios
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="creditos" className="space-y-4">
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Líneas de Crédito</h3>
            <p className="text-muted-foreground mb-6">
              Encuentra créditos con tasas preferenciales para agricultores
            </p>
            <Button className="bg-agriculture-terracotta hover:bg-agriculture-earth">
              Explorar Créditos
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="seguros" className="space-y-4">
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Seguros Agrícolas</h3>
            <p className="text-muted-foreground mb-6">
              Protege tu inversión contra riesgos climáticos
            </p>
            <Button className="bg-agriculture-terracotta hover:bg-agriculture-earth">
              Ver Seguros Disponibles
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanciamientoPage;
