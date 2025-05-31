import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  CloudRain, 
  Truck, 
  TrendingUp, 
  TrendingDown,
  Fuel,
  Sprout,
  MapPin,
  Clock,
  Bell,
  Filter,
  Search,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Snowflake,
  Zap,
  DollarSign,
  Package,
  Factory,
  ShoppingCart,
  Banknote,
  CreditCard,
  BarChart3,
  Activity,
  Target,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Share2,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Download,
  RefreshCw,
  Globe,
  Navigation,
  Route,
  Construction,
  Scissors,
  Users,
  Building,
  Warehouse,
  ShoppingBag,
  PiggyBank,
  Coins,
  Calculator,
  LineChart,
  Brain,
  Sparkles,
  User,
  Settings,
  Star,
  Loader2
} from "lucide-react";

interface PerfilUsuario {
  ubicacion: string;
  cultivos: string[];
  tipoProductor: 'pequeño' | 'mediano' | 'grande';
  configurado: boolean;
}

interface Alerta {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: 'climatica' | 'suministro' | 'precios' | 'infraestructura' | 'normativa' | 'mercado';
  severidad: 'critica' | 'alta' | 'media' | 'baja' | 'informativa';
  ubicacion: string;
  fechaCreacion: string;
  fechaVencimiento?: string;
  fuente: string;
  impacto: string[];
  recomendaciones: string[];
  contacto?: {
    telefono?: string;
    email?: string;
    web?: string;
  };
  activa: boolean;
  verificada: boolean;
  relevancia?: number;
  cultivosAfectados?: string[];
  esWeb?: boolean;
}

const AlertasPage = () => {
  const [activeTab, setActiveTab] = useState('todas');
  const [filtroSeveridad, setFiltroSeveridad] = useState('todas');
  const [filtroUbicacion, setFiltroUbicacion] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarConfigPerfil, setMostrarConfigPerfil] = useState(false);
  const [buscandoWeb, setBuscandoWeb] = useState(false);
  const [analizandoIA, setAnalizandoIA] = useState(false);

  const [perfil, setPerfil] = useState<PerfilUsuario>({
    ubicacion: '',
    cultivos: [],
    tipoProductor: 'pequeño',
    configurado: false
  });

  const alertasBase: Alerta[] = [
    // Alertas Climáticas
    {
      id: '1',
      titulo: 'Heladas Intensas Próximos 3 Días',
      descripcion: 'Se pronostican temperaturas de hasta -8°C en el altiplano. Riesgo extremo para cultivos de papa, quinua y hortalizas.',
      categoria: 'climatica',
      severidad: 'critica',
      ubicacion: 'La Paz - Altiplano',
      fechaCreacion: '2024-06-10T08:00:00Z',
      fechaVencimiento: '2024-06-13T23:59:59Z',
      fuente: 'SENAMHI',
      impacto: ['Pérdida total de cultivos sensibles', 'Daño en sistemas de riego', 'Afectación a ganado'],
      recomendaciones: [
        'Cubrir cultivos con mantas térmicas',
        'Activar sistemas antiheladas',
        'Proteger animales en refugios',
        'Cosechar productos maduros inmediatamente'
      ],
      contacto: {
        telefono: '800-10-5555',
        web: 'www.senamhi.gob.bo'
      },
      activa: true,
      verificada: true,
      cultivosAfectados: ['papa', 'quinua', 'hortalizas']
    },
    {
      id: '2',
      titulo: 'Sequía Prolongada - Nivel Crítico',
      descripcion: 'Déficit hídrico del 70% en la región. Reservas de agua en niveles mínimos históricos.',
      categoria: 'climatica',
      severidad: 'critica',
      ubicacion: 'Santa Cruz - Chaco',
      fechaCreacion: '2024-06-08T10:00:00Z',
      fuente: 'Ministerio de Medio Ambiente',
      impacto: ['Reducción drástica de rendimientos', 'Muerte de ganado', 'Escasez de agua potable'],
      recomendaciones: [
        'Implementar riego por goteo urgente',
        'Reducir densidad de siembra',
        'Usar variedades resistentes a sequía',
        'Conservar agua de lluvia'
      ],
      activa: true,
      verificada: true,
      cultivosAfectados: ['soya', 'maíz', 'sorgo', 'girasol']
    },

    // Alertas de Cadena de Suministro
    {
      id: '3',
      titulo: 'Cierre Carretera La Paz - Oruro',
      descripcion: 'Bloqueo indefinido en el tramo Patacamaya-Oruro. Transporte de insumos agrícolas suspendido.',
      categoria: 'suministro',
      severidad: 'alta',
      ubicacion: 'La Paz - Oruro',
      fechaCreacion: '2024-06-09T14:30:00Z',
      fuente: 'ABC - Administradora Boliviana de Carreteras',
      impacto: ['Desabastecimiento de fertilizantes', 'Retraso en entrega de semillas', 'Incremento de costos de transporte'],
      recomendaciones: [
        'Usar rutas alternativas vía Cochabamba',
        'Coordinar transporte grupal',
        'Adelantar compras de insumos críticos',
        'Contactar proveedores locales'
      ],
      contacto: {
        telefono: '800-12-2222',
        web: 'www.abc.gob.bo'
      },
      activa: true,
      verificada: true,
      cultivosAfectados: ['todos']
    },
    {
      id: '4',
      titulo: 'Escasez de Fertilizantes Importados',
      descripcion: 'Retraso en importaciones desde Brasil. Stock disponible para solo 15 días más.',
      categoria: 'suministro',
      severidad: 'alta',
      ubicacion: 'Nacional',
      fechaCreacion: '2024-06-07T09:00:00Z',
      fuente: 'Cámara Agropecuaria Nacional',
      impacto: ['Incremento de precios 40%', 'Posible desabastecimiento', 'Retraso en siembras'],
      recomendaciones: [
        'Comprar fertilizantes inmediatamente',
        'Considerar abonos orgánicos alternativos',
        'Formar grupos de compra',
        'Contactar cooperativas'
      ],
      activa: true,
      verificada: true,
      cultivosAfectados: ['todos']
    },

    // Alertas de Precios
    {
      id: '5',
      titulo: 'Subida Precio Gasolina 15%',
      descripcion: 'Incremento oficial del precio de combustibles. Impacto directo en costos de producción agrícola.',
      categoria: 'precios',
      severidad: 'media',
      ubicacion: 'Nacional',
      fechaCreacion: '2024-06-06T06:00:00Z',
      fuente: 'Ministerio de Hidrocarburos',
      impacto: ['Aumento costos de transporte', 'Mayor precio de maquinaria', 'Incremento en precios de insumos'],
      recomendaciones: [
        'Optimizar rutas de transporte',
        'Compartir maquinaria entre productores',
        'Planificar compras grupales',
        'Considerar tracción animal'
      ],
      activa: true,
      verificada: true,
      cultivosAfectados: ['todos']
    },
    {
      id: '6',
      titulo: 'Precio Quinua Sube 25% en Mercado Internacional',
      descripcion: 'Demanda europea incrementa significativamente. Oportunidad para productores de quinua.',
      categoria: 'precios',
      severidad: 'informativa',
      ubicacion: 'Altiplano',
      fechaCreacion: '2024-06-05T11:00:00Z',
      fuente: 'Cámara de Exportadores',
      impacto: ['Oportunidad de mejores ingresos', 'Mayor demanda de quinua', 'Incentivo para ampliar cultivos'],
      recomendaciones: [
        'Contactar exportadores certificados',
        'Mejorar calidad del producto',
        'Obtener certificaciones orgánicas',
        'Formar asociaciones de productores'
      ],
      activa: true,
      verificada: true,
      cultivosAfectados: ['quinua']
    },

    // Alertas de Infraestructura
    {
      id: '7',
      titulo: 'Corte de Energía Eléctrica Programado',
      descripcion: 'Mantenimiento de líneas eléctricas. Suspensión del servicio por 8 horas en zona rural.',
      categoria: 'infraestructura',
      severidad: 'media',
      ubicacion: 'Cochabamba - Valle Alto',
      fechaCreacion: '2024-06-04T16:00:00Z',
      fechaVencimiento: '2024-06-12T18:00:00Z',
      fuente: 'ELFEC',
      impacto: ['Sistemas de riego automático inoperativos', 'Refrigeración de productos suspendida', 'Ordeño mecánico afectado'],
      recomendaciones: [
        'Preparar generadores de emergencia',
        'Programar riego manual',
        'Adelantar ordeño matutino',
        'Usar conservadoras con hielo'
      ],
      contacto: {
        telefono: '800-10-3532'
      },
      activa: true,
      verificada: true
    },

    // Alertas Normativas
    {
      id: '8',
      titulo: 'Nueva Normativa Uso de Pesticidas',
      descripcion: 'Prohibición de 12 pesticidas a partir del 1 de julio. Actualizar prácticas de control de plagas.',
      categoria: 'normativa',
      severidad: 'media',
      ubicacion: 'Nacional',
      fechaCreacion: '2024-06-03T08:00:00Z',
      fechaVencimiento: '2024-07-01T00:00:00Z',
      fuente: 'SENASAG',
      impacto: ['Cambio en estrategias de control', 'Necesidad de nuevos productos', 'Posible incremento de costos'],
      recomendaciones: [
        'Revisar inventario de pesticidas',
        'Capacitarse en control biológico',
        'Buscar alternativas orgánicas',
        'Consultar con técnicos especializados'
      ],
      contacto: {
        telefono: '800-10-7777',
        web: 'www.senasag.gob.bo'
      },
      activa: true,
      verificada: true
    },

    // Alertas de Mercado
    {
      id: '9',
      titulo: 'Apertura Nuevo Mercado Mayorista',
      descripcion: 'Inauguración de centro de acopio en El Alto. Nuevas oportunidades de comercialización.',
      categoria: 'mercado',
      severidad: 'informativa',
      ubicacion: 'El Alto',
      fechaCreacion: '2024-06-02T12:00:00Z',
      fuente: 'Alcaldía de El Alto',
      impacto: ['Nuevos canales de venta', 'Mejores precios potenciales', 'Reducción de intermediarios'],
      recomendaciones: [
        'Registrarse como proveedor',
        'Conocer requisitos de calidad',
        'Coordinar entregas grupales',
        'Establecer contactos comerciales'
      ],
      contacto: {
        telefono: '800-10-4444',
        email: 'mercado@elalto.gob.bo'
      },
      activa: true,
      verificada: true
    }
  ];

  const [alertas, setAlertas] = useState<Alerta[]>(alertasBase);

  // Función para calcular relevancia basada en perfil
  const calcularRelevancia = (alerta: Alerta): number => {
    if (!perfil.configurado) return 50;
    
    let relevancia = 50;

    // Relevancia por ubicación
    if (alerta.ubicacion.toLowerCase().includes(perfil.ubicacion.toLowerCase()) || 
        alerta.ubicacion === 'Nacional') {
      relevancia += 30;
    }

    // Relevancia por cultivos
    if (alerta.cultivosAfectados) {
      const cultivosUsuario = perfil.cultivos.map(c => c.toLowerCase());
      const cultivosAlerta = alerta.cultivosAfectados.map(c => c.toLowerCase());
      
      if (cultivosAlerta.includes('todos') || 
          cultivosUsuario.some(cultivo => cultivosAlerta.includes(cultivo))) {
        relevancia += 25;
      }
    }

    // Relevancia por severidad
    switch (alerta.severidad) {
      case 'critica': relevancia += 20; break;
      case 'alta': relevancia += 15; break;
      case 'media': relevancia += 10; break;
      case 'baja': relevancia += 5; break;
      case 'informativa': relevancia += 0; break;
    }

    return Math.min(100, relevancia);
  };

  // Función para buscar alertas en la web usando IA
  const buscarAlertasWeb = async () => {
    setBuscandoWeb(true);
    
    setTimeout(() => {
      const alertasWeb: Alerta[] = [
        {
          id: 'web1',
          titulo: 'Nueva Plaga Detectada en Cultivos de Papa - Región Andina',
          descripcion: 'IA Web: Investigadores reportan nueva variante de polilla que afecta cultivos de papa en zonas altas.',
          categoria: 'climatica',
          severidad: 'alta',
          ubicacion: 'Altiplano',
          fechaCreacion: '2024-06-11T10:30:00Z',
          fuente: 'Agencia de Noticias Agrícolas (Web)',
          impacto: ['Pérdida potencial de cultivos de papa', 'Necesidad de control urgente'],
          recomendaciones: [
            'Monitorear cultivos diariamente',
            'Aplicar control biológico preventivo',
            'Contactar técnicos especializados'
          ],
          activa: true,
          verificada: true,
          esWeb: true,
          cultivosAfectados: ['papa']
        },
        {
          id: 'web2',
          titulo: 'Programa de Subsidios para Riego Tecnificado 2024',
          descripcion: 'IA Web: Gobierno anuncia nuevo programa de financiamiento para sistemas de riego por goteo con 70% de subsidio.',
          categoria: 'mercado',
          severidad: 'informativa',
          ubicacion: 'Nacional',
          fechaCreacion: '2024-06-10T15:45:00Z',
          fuente: 'Portal Gubernamental (Web)',
          impacto: ['Oportunidad de modernización', 'Reducción de costos de riego'],
          recomendaciones: [
            'Solicitar información en municipio',
            'Preparar documentación requerida',
            'Formar grupos de productores'
          ],
          activa: true,
          verificada: true,
          esWeb: true,
          cultivosAfectados: ['todos']
        }
      ];

      // Filtrar por relevancia si el perfil está configurado
      const alertasFiltradas = perfil.configurado 
        ? alertasWeb.filter(a => calcularRelevancia(a) > 60)
        : alertasWeb;

      setAlertas(prev => [...alertasBase, ...alertasFiltradas]);
      setBuscandoWeb(false);
    }, 3000);
  };

  // Función para analizar con IA y personalizar alertas
  const analizarConIA = async () => {
    if (!perfil.configurado) return;

    setAnalizandoIA(true);

    setTimeout(() => {
      const alertasPersonalizadas = alertasBase.map(alerta => ({
        ...alerta,
        relevancia: calcularRelevancia(alerta)
      })).sort((a, b) => (b.relevancia || 0) - (a.relevancia || 0));

      setAlertas(alertasPersonalizadas);
      setAnalizandoIA(false);
    }, 2000);
  };

  // Configurar perfil
  const configurarPerfil = () => {
    if (perfil.ubicacion && perfil.cultivos.length > 0) {
      const perfilActualizado = { ...perfil, configurado: true };
      setPerfil(perfilActualizado);
      setMostrarConfigPerfil(false);
      
      // Analizar automáticamente después de configurar
      setTimeout(() => {
        analizarConIA();
        buscarAlertasWeb();
      }, 500);
    }
  };

  const categorias = [
    { id: 'todas', nombre: 'Todas', icon: Bell, color: 'text-gray-600' },
    { id: 'personalizadas', nombre: 'Para Ti', icon: Star, color: 'text-yellow-600' },
    { id: 'climatica', nombre: 'Climáticas', icon: CloudRain, color: 'text-blue-600' },
    { id: 'suministro', nombre: 'Suministro', icon: Truck, color: 'text-orange-600' },
    { id: 'precios', nombre: 'Precios', icon: TrendingUp, color: 'text-green-600' },
    { id: 'web', nombre: 'Web IA', icon: Globe, color: 'text-purple-600' }
  ];

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'informativa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeveridadIcon = (severidad: string) => {
    switch (severidad) {
      case 'critica': return <XCircle className="h-4 w-4" />;
      case 'alta': return <AlertTriangle className="h-4 w-4" />;
      case 'media': return <AlertCircle className="h-4 w-4" />;
      case 'baja': return <Info className="h-4 w-4" />;
      case 'informativa': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'climatica': return <CloudRain className="h-5 w-5 text-blue-600" />;
      case 'suministro': return <Truck className="h-5 w-5 text-orange-600" />;
      case 'precios': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'infraestructura': return <Construction className="h-5 w-5 text-purple-600" />;
      case 'normativa': return <Building className="h-5 w-5 text-indigo-600" />;
      case 'mercado': return <Target className="h-5 w-5 text-emerald-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRelevanciaColor = (relevancia: number) => {
    if (relevancia >= 80) return 'text-red-600 bg-red-50';
    if (relevancia >= 60) return 'text-orange-600 bg-orange-50';
    if (relevancia >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const alertasFiltradas = alertas.filter(alerta => {
    const matchCategoria = activeTab === 'todas' || 
                          (activeTab === 'personalizadas' && (alerta.relevancia || 0) > 60) ||
                          (activeTab === 'web' && alerta.esWeb) ||
                          alerta.categoria === activeTab;
    const matchSeveridad = filtroSeveridad === 'todas' || alerta.severidad === filtroSeveridad;
    const matchUbicacion = filtroUbicacion === 'todas' || alerta.ubicacion.toLowerCase().includes(filtroUbicacion.toLowerCase());
    const matchBusqueda = busqueda === '' || 
      alerta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchCategoria && matchSeveridad && matchUbicacion && matchBusqueda;
  });

  const alertasCriticas = alertas.filter(a => a.severidad === 'critica' && a.activa).length;
  const alertasPersonalizadas = alertas.filter(a => (a.relevancia || 0) > 60).length;
  const alertasWeb = alertas.filter(a => a.esWeb).length;

  return (
    <div className="space-y-4">
      {/* Header Mejorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-agriculture-terracotta" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth bg-clip-text text-transparent">
              Alertas Inteligentes
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            IA personalizada que te muestra solo lo que realmente te afecta
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800">{alertasCriticas} Críticas</Badge>
            <Badge className="bg-yellow-100 text-yellow-800">{alertasPersonalizadas} Para Ti</Badge>
            <Badge className="bg-purple-100 text-purple-800">{alertasWeb} Web IA</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setMostrarConfigPerfil(!mostrarConfigPerfil)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {perfil.configurado ? 'Ajustar Perfil' : 'Configurar IA'}
          </Button>
          <Button 
            className="bg-agriculture-terracotta hover:bg-agriculture-earth"
            onClick={() => {
              analizarConIA();
              buscarAlertasWeb();
            }}
            disabled={!perfil.configurado}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Actualizar IA
          </Button>
        </div>
      </div>

      {/* Configuración de Perfil */}
      {mostrarConfigPerfil && (
        <Card className="border-2 border-agriculture-gold/30 bg-gradient-to-br from-agriculture-gold/5 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-agriculture-gold" />
              Configura tu Perfil para IA Personalizada
            </CardTitle>
            <CardDescription>
              La IA analizará tu perfil para mostrarte solo las alertas relevantes para ti
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Tu Ubicación</Label>
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
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipoProductor">Tipo de Productor</Label>
                <Select value={perfil.tipoProductor} onValueChange={(value: any) => setPerfil({...perfil, tipoProductor: value})}>
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
            </div>
            
            <div className="space-y-2">
              <Label>Tus Cultivos Principales</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {['papa', 'quinua', 'maíz', 'soya', 'trigo', 'hortalizas'].map((cultivo) => (
                  <Button
                    key={cultivo}
                    variant={perfil.cultivos.includes(cultivo) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const nuevos = perfil.cultivos.includes(cultivo)
                        ? perfil.cultivos.filter(c => c !== cultivo)
                        : [...perfil.cultivos, cultivo];
                      setPerfil({...perfil, cultivos: nuevos});
                    }}
                    className="capitalize"
                  >
                    {cultivo}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={configurarPerfil}
              disabled={!perfil.ubicacion || perfil.cultivos.length === 0}
              className="w-full bg-agriculture-terracotta hover:bg-agriculture-earth"
            >
              <Brain className="h-4 w-4 mr-2" />
              Activar IA Personalizada
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Estado de IA */}
      {perfil.configurado && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">IA Personalizada Activa</p>
                  <p className="text-sm text-blue-600">
                    Configurada para: {perfil.ubicacion} • {perfil.cultivos.join(', ')} • {perfil.tipoProductor}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {analizandoIA && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analizando...</span>
                  </div>
                )}
                {buscandoWeb && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Globe className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">Buscando en web...</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas Críticas Destacadas */}
      {alertasCriticas > 0 && (
        <Alert className="bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">¡Atención! {alertasCriticas} Alertas Críticas</AlertTitle>
          <AlertDescription className="text-red-700">
            La IA ha identificado alertas críticas que requieren tu atención inmediata.
            <Button variant="link" className="p-0 ml-2 text-red-800 underline">
              Ver alertas críticas →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Contenido Principal con Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categorias.map((categoria) => (
            <TabsTrigger 
              key={categoria.id} 
              value={categoria.id} 
              className="flex items-center gap-1 text-xs lg:text-sm"
            >
              <categoria.icon className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden lg:inline">{categoria.nombre}</span>
              <span className="lg:hidden">{categoria.nombre.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {activeTab === 'personalizadas' && !perfil.configurado ? (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Configura tu Perfil</h3>
              <p className="text-muted-foreground mb-6">
                La IA necesita conocer tu ubicación y cultivos para personalizar las alertas
              </p>
              <Button 
                onClick={() => setMostrarConfigPerfil(true)}
                className="bg-agriculture-terracotta hover:bg-agriculture-earth"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar Ahora
              </Button>
            </div>
          ) : activeTab === 'web' && buscandoWeb ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                  <div>
                    <p className="font-medium">IA buscando en la web...</p>
                    <p className="text-sm text-muted-foreground">
                      Analizando noticias, reportes gubernamentales y fuentes especializadas
                    </p>
                  </div>
                </div>
                <Progress value={66} className="mt-4" />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {alertasFiltradas.length} de {alertas.length} alertas
                  {activeTab === 'personalizadas' && ' personalizadas para ti'}
                  {activeTab === 'web' && ' encontradas en la web'}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (activeTab === 'web') {
                      buscarAlertasWeb();
                    } else {
                      analizarConIA();
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {activeTab === 'web' ? 'Buscar en Web' : 'Actualizar'}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence>
                  {alertasFiltradas.map((alerta, index) => (
                    <motion.div
                      key={alerta.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`h-full ${alerta.severidad === 'critica' ? 'border-red-200 bg-red-50' : ''} ${alerta.esWeb ? 'border-purple-200 bg-purple-50' : ''}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {alerta.esWeb ? <Globe className="h-5 w-5 text-purple-600" /> : getCategoriaIcon(alerta.categoria)}
                              <div>
                                <CardTitle className="text-lg">{alerta.titulo}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {alerta.ubicacion}
                                  <span>•</span>
                                  <Clock className="h-3 w-3" />
                                  {new Date(alerta.fechaCreacion).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getSeveridadColor(alerta.severidad)}>
                                {getSeveridadIcon(alerta.severidad)}
                                <span className="ml-1 capitalize">{alerta.severidad}</span>
                              </Badge>
                              {alerta.relevancia && (
                                <Badge className={getRelevanciaColor(alerta.relevancia)}>
                                  <Star className="h-3 w-3 mr-1" />
                                  {alerta.relevancia}% relevante
                                </Badge>
                              )}
                              {alerta.esWeb && (
                                <Badge className="bg-purple-100 text-purple-800">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  IA Web
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{alerta.descripcion}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="font-medium text-sm mb-2">Impacto Esperado:</p>
                              <ul className="text-xs space-y-1">
                                {alerta.impacto.slice(0, 2).map((impacto, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                                    {impacto}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <p className="font-medium text-sm mb-2">Recomendaciones IA:</p>
                              <ul className="text-xs space-y-1">
                                {alerta.recomendaciones.slice(0, 2).map((recomendacion, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {recomendacion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Fuente: {alerta.fuente}</span>
                            {alerta.cultivosAfectados && (
                              <span>Cultivos: {alerta.cultivosAfectados.join(', ')}</span>
                            )}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          {alerta.contacto && (
                            <Button size="sm" className="bg-agriculture-terracotta hover:bg-agriculture-earth">
                              <Phone className="h-4 w-4 mr-2" />
                              Contactar
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {alertasFiltradas.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hay alertas</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === 'personalizadas' 
                      ? "No hay alertas personalizadas. Configura tu perfil para obtener recomendaciones."
                      : activeTab === 'web'
                      ? "No hay alertas de la web. Haz clic en 'Buscar en Web' para obtener las últimas alertas."
                      : "No se encontraron alertas que coincidan con los filtros seleccionados"
                    }
                  </p>
                  {activeTab === 'web' && (
                    <Button 
                      onClick={buscarAlertasWeb}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Buscar en Web
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertasPage; 