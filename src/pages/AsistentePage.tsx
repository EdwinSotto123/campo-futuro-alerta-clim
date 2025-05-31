import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bot, 
  User,
  Send, 
  Camera,
  Mic,
  Bug,
  Leaf,
  Download,
  Clock,
  Activity,
  Zap,
  Play,
  ExternalLink,
  Eye,
  AlertTriangle,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  Thermometer,
  Droplets,
  Shield,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  DollarSign,
  Umbrella,
  Flame,
  Navigation,
  Bell,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight,
  Timer,
  Target,
  History,
  Upload,
  MessageSquare,
  FileText,
  Headphones
} from "lucide-react";

interface WeatherAlert {
  id: string;
  type: 'sequía' | 'inundación' | 'granizo' | 'helada' | 'viento' | 'calor';
  severity: 'baja' | 'media' | 'alta' | 'extrema';
  title: string;
  description: string;
  region: string;
  startDate: Date;
  endDate: Date;
  probability: number;
  impact: string;
  recommendations: {
    before: string[];
    during: string[];
    after: string[];
  };
  financing: {
    available: boolean;
    programs: string[];
    requirements: string[];
  };
  icon: React.ElementType;
  color: string;
  badgeColor: string;
}

interface ClimatePhase {
  phase: 'antes' | 'durante' | 'después';
  title: string;
  icon: string;
  color: string;
  actions: string[];
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  category?: string;
  attachments?: AttachmentType[];
  analysis?: AnalysisResult;
  weatherAlert?: WeatherAlert;
}

interface AttachmentType {
  type: "image" | "document" | "audio";
  url: string;
  name: string;
  size?: string;
}

interface AnalysisResult {
  type: 'plaga' | 'enfermedad' | 'insecto' | 'cultivo' | 'suelo' | 'clima';
  confidence: number;
  detected: string;
  recommendations: string[];
  severity?: 'baja' | 'media' | 'alta';
  treatment?: string;
  urgency?: string;
}

const AsistentePage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🌦️ ¡Hola! Soy Wara, tu asistente climático. ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'antes' | 'durante' | 'después'>('antes');

  // Alertas climáticas simuladas de SENAMHI
  const weatherAlerts: WeatherAlert[] = [
    {
      id: '1',
      type: 'sequía',
      severity: 'alta',
      title: 'Alerta de Sequía Severa',
      description: 'Déficit hídrico del 40% en región Altiplano Norte',
      region: 'La Paz - Altiplano Norte',
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      probability: 85,
      impact: 'Pérdida potencial del 30-50% en cultivos de papa y quinua',
      recommendations: {
        before: [
          'Implementar sistemas de riego por goteo',
          'Aplicar mulch orgánico en cultivos',
          'Sembrar variedades resistentes a sequía',
          'Construir zanjas de infiltración',
          'Revisar seguros agrícolas'
        ],
        during: [
          'Regar solo en horas de menor evaporación (5-7 AM)',
          'Suspender fertilización hasta mejores condiciones',
          'Monitorear estrés hídrico en plantas',
          'Aplicar riego de salvamento en cultivos prioritarios'
        ],
        after: [
          'Evaluar daños en cultivos',
          'Solicitar compensaciones del seguro',
          'Planificar siembra de recuperación',
          'Implementar mejoras en sistema de riego'
        ]
      },
      financing: {
        available: true,
        programs: ['Seguro Agrícola Universal (SAU)', 'Fondo de Emergencia Climática', 'Créditos BDP Sequía'],
        requirements: ['Registro en SENASAG', 'Evaluación de daños', 'Declaración jurada']
      },
      icon: Sun,
      color: 'bg-orange-100 border-orange-300',
      badgeColor: 'bg-orange-500'
    },
    {
      id: '2',
      type: 'granizo',
      severity: 'media',
      title: 'Riesgo de Granizo',
      description: 'Condiciones favorables para granizo en valles',
      region: 'Cochabamba - Valles Centrales',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      probability: 65,
      impact: 'Daño potencial en cultivos de tomate, maíz y hortalizas',
      recommendations: {
        before: [
          'Instalar mallas antigranizo',
          'Cosechar productos maduros',
          'Proteger almácigos y plantines',
          'Revisar techos de invernaderos',
          'Activar pólizas de seguro'
        ],
        during: [
          'Refugiarse en lugares seguros',
          'No intentar proteger cultivos durante la tormenta',
          'Documentar daños con fotos',
          'Evitar trabajar en campo abierto'
        ],
        after: [
          'Evaluar daños inmediatamente',
          'Reportar siniestros al seguro en 48h',
          'Aplicar tratamientos preventivos contra hongos',
          'Resembrar áreas dañadas'
        ]
      },
      financing: {
        available: true,
        programs: ['PSAEC Granizo', 'Seguro Catastrófico'],
        requirements: ['Denuncia inmediata', 'Fotos de daños', 'Evaluación técnica']
      },
      icon: Snowflake,
      color: 'bg-blue-100 border-blue-300',
      badgeColor: 'bg-blue-500'
    },
    {
      id: '3',
      type: 'helada',
      severity: 'extrema',
      title: 'Alerta Extrema de Heladas',
      description: 'Temperaturas bajo -5°C esperadas',
      region: 'Oruro - Altiplano Sur',
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      probability: 95,
      impact: 'Pérdida total en cultivos sensibles sin protección',
      recommendations: {
        before: [
          'Encender fogatas o braseros en cultivos',
          'Cubrir plantas con mantas o plásticos',
          'Regar abundantemente antes de la helada',
          'Cosechar productos susceptibles',
          'Preparar sistemas de calefacción'
        ],
        during: [
          'Mantener fogatas encendidas toda la noche',
          'Monitorear temperatura constantemente',
          'Activar sistemas de aspersión si disponible',
          'No caminar sobre cultivos helados'
        ],
        after: [
          'Evaluar daños al mediodía siguiente',
          'No tocar plantas heladas en la mañana',
          'Aplicar bioestimulantes para recuperación',
          'Planificar replantación si es necesario'
        ]
      },
      financing: {
        available: true,
        programs: ['Seguro Heladas PSAEC', 'Fondo de Contingencia Climática'],
        requirements: ['Registro de temperaturas', 'Evaluación técnica', 'Declaración de emergencia']
      },
      icon: Thermometer,
      color: 'bg-purple-100 border-purple-300',
      badgeColor: 'bg-purple-500'
    }
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extrema': return 'bg-red-600 text-white';
      case 'alta': return 'bg-red-500 text-white';
      case 'media': return 'bg-yellow-500 text-white';
      case 'baja': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'sequía': return <Sun className="h-5 w-5" />;
      case 'inundación': return <CloudRain className="h-5 w-5" />;
      case 'granizo': return <Snowflake className="h-5 w-5" />;
      case 'helada': return <Thermometer className="h-5 w-5" />;
      case 'viento': return <Wind className="h-5 w-5" />;
      case 'calor': return <Flame className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getPhaseData = (phase: 'antes' | 'durante' | 'después'): ClimatePhase => {
    switch (phase) {
      case 'antes':
        return {
          phase: 'antes',
          title: 'PREPARACIÓN',
          icon: '🛡️',
          color: 'bg-blue-500',
          actions: ['Prevenir', 'Proteger', 'Planificar']
        };
      case 'durante':
        return {
          phase: 'durante',
          title: 'EMERGENCIA',
          icon: '⚡',
          color: 'bg-red-500',
          actions: ['Actuar', 'Protegerse', 'Documentar']
        };
      case 'después':
        return {
          phase: 'después',
          title: 'RECUPERACIÓN',
          icon: '🔄',
          color: 'bg-green-500',
          actions: ['Evaluar', 'Recuperar', 'Mejorar']
        };
    }
  };

  const handleAlertClick = (alert: WeatherAlert) => {
    const alertMessage: Message = {
      id: Date.now().toString(),
      text: `Quiero información detallada sobre la ${alert.title} en ${alert.region}`,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, alertMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateWeatherResponse(alert),
        isBot: true,
        timestamp: new Date(),
        category: "clima",
        weatherAlert: alert
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateWeatherResponse = (alert: WeatherAlert): string => {
    return `🌦️ **${alert.title} - ${alert.region}**

**📊 SITUACIÓN ACTUAL:**
• Probabilidad: ${alert.probability}%
• Severidad: ${alert.severity.toUpperCase()}
• Duración: ${alert.startDate.toLocaleDateString()} - ${alert.endDate.toLocaleDateString()}
• Impacto: ${alert.impact}

**🎯 RECOMENDACIONES POR FASE:**

**🛡️ ANTES (Preparación):**
${alert.recommendations.before.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**⚡ DURANTE (Emergencia):**
${alert.recommendations.during.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**🔄 DESPUÉS (Recuperación):**
${alert.recommendations.after.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**💰 FINANCIAMIENTO DISPONIBLE:**
${alert.financing.available ? 
  `• Programas: ${alert.financing.programs.join(', ')}\n• Requisitos: ${alert.financing.requirements.join(', ')}` :
  'No hay programas específicos disponibles actualmente'
}

¿Necesitas ayuda con alguna fase específica?`;
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateClimateResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
        category: "clima"
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);

    setInputValue('');
  };

  const generateClimateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('antes') || lowerInput.includes('preparar') || lowerInput.includes('prevenir')) {
      return `🛡️ **PREPARACIÓN ANTES DEL EVENTO CLIMÁTICO:**

**📋 ACCIONES PRIORITARIAS:**
1. **Monitoreo constante** - Revisar pronósticos diarios
2. **Protección física** - Instalar coberturas, mallas, cortavientos
3. **Recursos hídricos** - Almacenar agua, revisar sistemas de riego
4. **Seguros agrícolas** - Verificar pólizas vigentes
5. **Insumos de emergencia** - Tener fungicidas, fertilizantes listos

**💰 FINANCIAMIENTO PREVENTIVO:**
• Créditos para infraestructura resiliente
• Subsidios para sistemas de protección
• Seguros con cobertura ampliada

**⏰ CRONOGRAMA RECOMENDADO:**
• 15 días antes: Planificación y compras
• 7 días antes: Instalación de protecciones
• 3 días antes: Verificación final

¿Qué evento específico te preocupa?`;
    }
    
    if (lowerInput.includes('durante') || lowerInput.includes('emergencia') || lowerInput.includes('ahora')) {
      return `⚡ **ACCIONES DURANTE LA EMERGENCIA CLIMÁTICA:**

**🚨 PRIORIDADES INMEDIATAS:**
1. **Seguridad personal** - No arriesgar vidas por cultivos
2. **Documentación** - Tomar fotos/videos de daños
3. **Comunicación** - Reportar a autoridades locales
4. **Monitoreo** - Seguir evolución del evento

**📱 CONTACTOS DE EMERGENCIA:**
• SENAMHI: 2-2445512
• Defensa Civil: 165
• SENASAG: 800-10-2020

**📸 DOCUMENTAR DAÑOS:**
• Fotos antes, durante y después
• Videos de la situación
• Registro de pérdidas

**💡 RECUERDA:** Tu seguridad es lo más importante. Los cultivos se pueden recuperar.

¿Estás enfrentando una emergencia ahora?`;
    }
    
    if (lowerInput.includes('después') || lowerInput.includes('recuperar') || lowerInput.includes('daños')) {
      return `🔄 **RECUPERACIÓN DESPUÉS DEL EVENTO:**

**📊 EVALUACIÓN DE DAÑOS:**
1. **Inspección detallada** - Revisar cada parcela
2. **Clasificación de daños** - Leve, moderado, severo, total
3. **Documentación completa** - Fotos, mediciones, reportes
4. **Valorización económica** - Calcular pérdidas

**💰 GESTIÓN DE SEGUROS:**
• Reportar siniestro en 48-72 horas
• Presentar documentación completa
• Solicitar evaluación técnica
• Seguir proceso de compensación

**🌱 PLAN DE RECUPERACIÓN:**
• Rehabilitación de suelos
• Replantación estratégica
• Mejoras en infraestructura
• Diversificación de cultivos

**🎯 OPORTUNIDADES:**
• Acceso a créditos blandos
• Programas de reconstrucción
• Capacitación en resiliencia

¿Qué tipo de daños has identificado?`;
    }

    if (lowerInput.includes('financiamiento') || lowerInput.includes('seguro') || lowerInput.includes('crédito')) {
      return `💰 **FINANCIAMIENTO Y SEGUROS CLIMÁTICOS:**

**🛡️ SEGUROS DISPONIBLES:**
• **SAU (Seguro Agrícola Universal)** - Cobertura básica
• **PSAEC** - Eventos climáticos específicos
• **Seguro Ganadero** - Protección de animales
• **Microseguros** - Para pequeños productores

**💳 CRÉDITOS ESPECIALES:**
• **BDP Agro** - Tasas preferenciales 5.5%
• **Banco Unión** - Línea climática 6%
• **CRECER** - Microcréditos rurales
• **Fondo Verde** - Proyectos sostenibles

**📋 REQUISITOS GENERALES:**
• Registro en SENASAG
• Cédula de identidad
• Título de propiedad o contrato
• Plan de inversión

**⚡ FONDOS DE EMERGENCIA:**
• Fondo de Contingencia Nacional
• Programa de Asistencia Técnica
• Subsidios por desastres naturales

¿Necesitas ayuda con algún trámite específico?`;
    }

    return `🌦️ Como tu asistente climático, puedo ayudarte con:

**📊 INFORMACIÓN DISPONIBLE:**
• Pronósticos detallados de SENAMHI
• Alertas tempranas por región
• Recomendaciones por fase (antes/durante/después)
• Financiamiento y seguros disponibles

**🎯 PREGÚNTAME SOBRE:**
• "¿Cómo prepararme para sequía?"
• "¿Qué hacer durante granizada?"
• "¿Cómo recuperarme después de helada?"
• "¿Qué seguros necesito?"

**📱 TAMBIÉN PUEDO:**
• Analizar fotos de daños climáticos
• Conectarte con técnicos especializados
• Ayudarte con trámites de seguros

¿Qué información específica necesitas?`;
  };

  const quickClimateActions = [
    { 
      icon: Shield, 
      text: 'Preparación', 
      description: 'Antes del evento',
      action: () => setInputValue('¿Cómo prepararme antes de un evento climático?'),
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    { 
      icon: Zap, 
      text: 'Emergencia', 
      description: 'Durante el evento',
      action: () => setInputValue('¿Qué hacer durante una emergencia climática?'),
      color: 'bg-red-50 hover:bg-red-100 border-red-200'
    },
    { 
      icon: Activity, 
      text: 'Recuperación', 
      description: 'Después del evento',
      action: () => setInputValue('¿Cómo recuperarme después de daños climáticos?'),
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    { 
      icon: DollarSign, 
      text: 'Financiamiento', 
      description: 'Seguros y créditos',
      action: () => setInputValue('¿Qué financiamiento está disponible para eventos climáticos?'),
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
    },
    { 
      icon: TrendingUp, 
      text: 'Pronósticos', 
      description: 'Datos SENAMHI',
      action: () => setInputValue('¿Cuál es el pronóstico climático para mi región?'),
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    { 
      icon: Upload, 
      text: 'Reportar Daño', 
      description: 'Documentar pérdidas',
      action: () => fileInputRef.current?.click(),
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    }
  ];

  const analysisOptions = [
    {
      icon: Bug,
      title: 'Detectar Plagas',
      subtitle: 'Identifica insectos dañinos',
      color: 'bg-red-50 hover:bg-red-100 border-red-200'
    },
    {
      icon: Leaf,
      title: 'Enfermedades',
      subtitle: 'Analiza problemas en plantas',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    },
    {
      icon: Eye,
      title: 'Estado del Cultivo',
      subtitle: 'Evalúa salud general',
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      icon: Droplets,
      title: 'Análisis de Suelo',
      subtitle: 'Condiciones del terreno',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Principal - Más Compacto */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">🤖 Wara - Asistente Climático</h1>
              <p className="text-sm opacity-90">Tu compañero inteligente para la agricultura resiliente</p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white px-3 py-1">
                🚨 {weatherAlerts.length} Alertas Activas
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4">
        {/* Layout Principal - Optimizado para menos scroll */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
          
          {/* Columna Izquierda - Alertas Compactas */}
          <div className="xl:col-span-1 space-y-4">
            
            {/* Alertas Climáticas - Más Compactas */}
            <Card className="shadow-lg">
              <CardHeader className="bg-orange-50 py-3">
                <CardTitle className="flex items-center gap-2 text-orange-700 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Alertas SENAMHI
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {weatherAlerts.map((alert) => {
                    const IconComponent = alert.icon;
                    return (
                      <div 
                        key={alert.id} 
                        className={`p-3 rounded-lg border ${alert.color} cursor-pointer hover:shadow-md transition-all`}
                        onClick={() => handleAlertClick(alert)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <IconComponent className="h-4 w-4" />
                          <Badge className={`${alert.badgeColor} text-white text-xs`}>
                            {alert.probability}%
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-xs mb-1">{alert.title}</h4>
                        <p className="text-xs text-gray-600 truncate">{alert.region}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas - Grid Compacto */}
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-50 py-3">
                <CardTitle className="flex items-center gap-2 text-blue-700 text-sm">
                  <Zap className="h-4 w-4" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {quickClimateActions.slice(0, 4).map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-auto p-2 ${action.color} border text-xs flex-col`}
                        onClick={action.action}
                      >
                        <IconComponent className="h-4 w-4 mb-1" />
                        <div className="text-center">
                          <div className="font-semibold">{action.text}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                {/* Botones adicionales en fila */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {quickClimateActions.slice(4).map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index + 4}
                        variant="outline"
                        className={`h-auto p-2 ${action.color} border text-xs flex-col`}
                        onClick={action.action}
                      >
                        <IconComponent className="h-4 w-4 mb-1" />
                        <div className="text-center">
                          <div className="font-semibold">{action.text}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Análisis de Imágenes - Más Compacto */}
            <Card className="shadow-lg">
              <CardHeader className="bg-green-50 py-3">
                <CardTitle className="flex items-center gap-2 text-green-700 text-sm">
                  <Camera className="h-4 w-4" />
                  Análisis IA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {analysisOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-auto p-2 ${option.color} border text-xs flex-col`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <IconComponent className="h-4 w-4 mb-1" />
                        <div className="text-center">
                          <div className="font-semibold text-xs">{option.title}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors cursor-pointer"
                     onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                  <p className="text-xs font-medium">Subir Imagen</p>
                  <p className="text-xs text-gray-500">JPG, PNG</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Central y Derecha - Chat Expandido */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg h-full">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">Chat con Wara</CardTitle>
                      <CardDescription className="text-white/90 text-sm">
                        Pregúntame sobre clima, cultivos, plagas, financiamiento y más
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      En línea
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-[calc(100vh-220px)]">
                {/* Área de mensajes - Altura optimizada */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                          message.isBot 
                            ? 'bg-gray-100 text-gray-800 border border-gray-200' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {message.isBot && (
                            <div className="flex items-center gap-2 mb-1">
                              <Bot className="h-3 w-3" />
                              <span className="font-medium text-xs">Wara</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Bot className="h-3 w-3" />
                            <span className="font-medium text-xs">Wara</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input del chat - Más compacto */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Escribe tu consulta aquí... (ej: ¿Cómo prepararme para sequía?)"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 h-10"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-blue-500 hover:bg-blue-600 h-10 px-4"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Sugerencias rápidas - Una sola fila */}
                  <div className="flex flex-wrap gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue('¿Cómo prepararme para una sequía?')}
                      className="text-xs h-7 px-2"
                    >
                      🌵 Sequía
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue('¿Qué seguros agrícolas necesito?')}
                      className="text-xs h-7 px-2"
                    >
                      💰 Seguros
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue('¿Cómo detectar plagas en mis cultivos?')}
                      className="text-xs h-7 px-2"
                    >
                      🐛 Plagas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue('¿Qué hacer después de una helada?')}
                      className="text-xs h-7 px-2"
                    >
                      ❄️ Helada
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue('¿Cuál es el pronóstico para mi región?')}
                      className="text-xs h-7 px-2"
                    >
                      📊 Pronóstico
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedFile(file);
            setInputValue(`He subido una imagen de ${file.name} para análisis`);
          }
        }}
      />
    </div>
  );
};

export default AsistentePage; 