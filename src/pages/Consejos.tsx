import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  CloudRain, 
  Sun, 
  Snowflake, 
  Wind, 
  Thermometer,
  Droplets,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Leaf,
  Sprout,
  Mountain,
  Zap,
  TrendingUp,
  Calendar,
  MapPin,
  Send,
  Lightbulb,
  BookOpen,
  Users,
  Globe,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  Eye,
  MessageSquare,
  Download,
  Share,
  Bookmark,
  RefreshCw,
  Settings,
  Filter,
  Search,
  Bell,
  Info,
  HelpCircle,
  Sparkles,
  TreePine,
  Wheat,
  Apple,
  Tractor,
  Factory,
  Recycle,
  Gauge,
  Plus,
  Minus,
  Edit,
  Save,
  Trash2,
  Copy,
  FileText,
  ClipboardList,
  Timer,
  DollarSign,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Archive,
  FolderOpen,
  Bot,
  User,
  Loader2,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RotateCcw,
  CheckSquare,
  Square,
  AlertCircle,
  XCircle
} from "lucide-react";

interface Cultivo {
  id: string;
  nombre: string;
  variedad: string;
  hectareas: number;
  fechaSiembra: string;
  etapaActual: string;
  riesgos: string[];
  prioridad: 'alta' | 'media' | 'baja';
}

interface PlanAccion {
  id: string;
  titulo: string;
  descripcion: string;
  cultivos: string[];
  fechaCreacion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'pausado';
  prioridad: 'critica' | 'alta' | 'media' | 'baja';
  categoria: string;
  tareas: Tarea[];
  presupuesto: number;
  progreso: number;
  notas: string;
  conversacionId?: string;
}

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fechaLimite: string;
  recursos: string[];
  costo: number;
  responsable: string;
  notas: string;
}

interface Conversacion {
  id: string;
  titulo: string;
  fechaCreacion: string;
  ultimaActividad: string;
  mensajes: Mensaje[];
  planGenerado?: string;
  etiquetas: string[];
  favorita: boolean;
  archivada: boolean;
}

interface Mensaje {
  id: string;
  tipo: 'usuario' | 'ia';
  contenido: string;
  timestamp: string;
  reacciones?: string[];
  adjuntos?: string[];
}

interface PerfilAgricultor {
  nombre: string;
  ubicacion: string;
  coordenadas?: { lat: number; lng: number };
  tipoFinca: 'familiar' | 'comercial' | 'cooperativa' | 'empresa';
  hectareasTotales: number;
  experiencia: number;
  cultivos: Cultivo[];
  presupuestoAnual: number;
  objetivos: string[];
  desafios: string[];
  tecnologias: string[];
  certificaciones: string[];
  contactoEmergencia: string;
  preferenciasIA: {
    nivelDetalle: 'basico' | 'intermedio' | 'avanzado';
    frecuenciaNotificaciones: 'alta' | 'media' | 'baja';
    tiposAlerta: string[];
    idiomaPreferido: 'es' | 'qu' | 'ay';
  };
}

const ConsejosPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  
  // Estados del perfil
  const [perfil, setPerfil] = useState<PerfilAgricultor>({
    nombre: '',
    ubicacion: '',
    tipoFinca: 'familiar',
    hectareasTotales: 0,
    experiencia: 0,
    cultivos: [],
    presupuestoAnual: 0,
    objetivos: [],
    desafios: [],
    tecnologias: [],
    certificaciones: [],
    contactoEmergencia: '',
    preferenciasIA: {
      nivelDetalle: 'intermedio',
      frecuenciaNotificaciones: 'media',
      tiposAlerta: [],
      idiomaPreferido: 'es'
    }
  });

  // Estados del chat IA
  const [mensajeActual, setMensajeActual] = useState('');
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [cargandoRespuesta, setCargandoRespuesta] = useState(false);
  
  // Estados del wizard de configuración inicial
  const [mostrandoWizard, setMostrandoWizard] = useState(false);
  const [pasoActualWizard, setPasoActualWizard] = useState(0);
  const [tipoWizard, setTipoWizard] = useState<'desastres' | 'otros' | null>(null);
  const [subtipoDesastres, setSubtipoDesastres] = useState<'adaptacion' | 'sostenible' | null>(null);
  const [respuestaPersonalizada, setRespuestaPersonalizada] = useState('');
  const [mostrandoInputPersonalizado, setMostrandoInputPersonalizado] = useState(false);
  
  const [datosWizard, setDatosWizard] = useState({
    tipoPlan: '',
    subtipoPlan: '',
    fenomenoClimatico: '',
    faseDesastre: '',
    objetivo: '',
    presupuesto: '',
    tiempoDisponible: '',
    urgencia: '',
    necesitaProveedores: false,
    experienciaPrevia: '',
    cultivosAfectados: [] as string[],
    ubicacionEspecifica: '',
    recursosDisponibles: [] as string[]
  });

  // Preguntas para planes de desastres/cambio climático
  const preguntasDesastres = [
    {
      titulo: "¿Qué tipo de plan necesitas?",
      descripcion: "Selecciona el enfoque principal de tu plan",
      campo: "tipoPlan",
      opciones: [
        'Plan de Acción contra Desastres y Adaptación al Cambio Climático',
        'Plan de Acción para Otros Propósitos'
      ],
      sinPersonalizado: true
    },
    {
      titulo: "¿Qué enfoque específico necesitas?",
      descripcion: "Selecciona el tipo de adaptación climática",
      campo: "subtipoPlan",
      opciones: [
        'Adaptación contra Fenómenos Climáticos Extremos',
        'Agricultura Sostenible y Resiliente',
        '✏️ Otros - Escríbelo tú mismo'
      ],
      mostrarSi: () => tipoWizard === 'desastres',
      sinPersonalizado: false
    },
    {
      titulo: "¿Contra qué fenómeno te quieres preparar?",
      descripcion: "Selecciona el evento climático de mayor riesgo en tu zona",
      campo: "fenomenoClimatico",
      opciones: [
        '🌊 Inundaciones y Lluvias Extremas',
        '☀️ Sequías Prolongadas',
        '❄️ Heladas y Granizadas',
        '🌪️ Vientos Fuertes y Tormentas',
        '🔥 Olas de Calor Extremo',
        '🦗 Plagas por Cambio Climático',
        '✏️ Otros - Escríbelo tú mismo'
      ],
      mostrarSi: () => tipoWizard === 'desastres' && subtipoDesastres === 'adaptacion',
      sinPersonalizado: false
    },
    {
      titulo: "¿En qué fase te encuentras?",
      descripcion: "Esto determina las acciones prioritarias",
      campo: "faseDesastre",
      opciones: [
        '⚠️ ANTES: Preparación y Prevención',
        '🚨 DURANTE: Respuesta de Emergencia',
        '🔄 DESPUÉS: Recuperación y Reconstrucción',
        '✏️ Otros - Escríbelo tú mismo'
      ],
      mostrarSi: () => tipoWizard === 'desastres' && subtipoDesastres === 'adaptacion',
      sinPersonalizado: false
    },
    {
      titulo: "¿Qué práctica sostenible quieres implementar?",
      descripcion: "Selecciona el enfoque de sostenibilidad",
      campo: "objetivo",
      opciones: [
        '🌱 Conservación de Suelos y Agua',
        '♻️ Agricultura Regenerativa',
        '🌿 Manejo Integrado de Plagas',
        '💧 Sistemas de Riego Eficiente',
        '🌾 Diversificación de Cultivos',
        '🔋 Energías Renovables Agrícolas',
        '✏️ Otros - Escríbelo tú mismo'
      ],
      mostrarSi: () => tipoWizard === 'desastres' && subtipoDesastres === 'sostenible',
      sinPersonalizado: false
    }
  ];

  // Preguntas para otros propósitos (formulario original)
  const preguntasOtros = [
    {
      titulo: "¿Qué quieres lograr?",
      descripcion: "Selecciona tu objetivo principal",
      campo: "objetivo",
      opciones: [
        'Mejorar producción de cultivos',
        'Proteger contra plagas',
        'Preparar para temporada seca',
        'Aumentar ingresos',
        'Implementar riego tecnificado',
        'Diversificar cultivos',
        '✏️ Otros - Escríbelo tú mismo'
      ],
      sinPersonalizado: false
    }
  ];

  // Preguntas comunes para ambos tipos
  const preguntasComunes = [
    {
      titulo: "¿Cuánto dinero tienes disponible?",
      descripcion: "Esto nos ayuda a sugerir opciones realistas",
      campo: "presupuesto",
      opciones: [
        'Menos de 1,000 Bs',
        '1,000 - 5,000 Bs',
        '5,000 - 10,000 Bs',
        '10,000 - 20,000 Bs',
        'Más de 20,000 Bs',
        'Sin presupuesto definido',
        '✏️ Otros - Escríbelo tú mismo'
      ],
      sinPersonalizado: false
    },
    {
      titulo: "¿Cuánto tiempo tienes?",
      descripcion: "Para implementar las recomendaciones",
      campo: "tiempoDisponible",
      opciones: [
        '1 semana',
        '2-4 semanas',
        '1-2 meses',
        '3+ meses',
        '✏️ Otros - Escríbelo tú mismo'
      ],
      sinPersonalizado: false
    },
    {
      titulo: "¿Qué tan urgente es?",
      descripcion: "Esto afecta la prioridad de las recomendaciones",
      campo: "urgencia",
      opciones: [
        { valor: 'Muy urgente', color: 'bg-red-100 text-red-800 border-red-200' },
        { valor: 'Moderado', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        { valor: 'Puedo esperar', color: 'bg-green-100 text-green-800 border-green-200' },
        { valor: '✏️ Otros - Escríbelo tú mismo', color: 'bg-blue-100 text-blue-800 border-blue-200' }
      ],
      sinPersonalizado: false
    },
    {
      titulo: "¿Necesitas ayuda con proveedores?",
      descripcion: "Te podemos conectar con proveedores confiables",
      campo: "necesitaProveedores",
      opciones: [
        { valor: true, texto: 'Sí, necesito ayuda', icono: CheckCircle },
        { valor: false, texto: 'No, ya tengo contactos', icono: XCircle },
        { valor: 'personalizado', texto: '✏️ Otros - Escríbelo tú mismo', icono: Edit }
      ],
      sinPersonalizado: false
    },
    {
      titulo: "¿Cuál es tu experiencia?",
      descripcion: "Para adaptar las explicaciones a tu nivel",
      campo: "experienciaPrevia",
      opciones: [
        'Principiante',
        'Intermedio',
        'Experimentado',
        '✏️ Otros - Escríbelo tú mismo'
      ],
      sinPersonalizado: false
    },
    {
      titulo: "¿Qué cultivos están involucrados?",
      descripcion: "Puedes seleccionar varios (último paso)",
      campo: "cultivosAfectados",
      multiple: true,
      opciones: ['Papa', 'Quinua', 'Maíz', 'Trigo', 'Haba', 'Tomate', 'Cebolla', 'Otros', '✏️ Escríbelo tú mismo'],
      sinPersonalizado: false
    }
  ];

  // Función para obtener las preguntas según el tipo de wizard
  const obtenerPreguntasActuales = () => {
    let preguntas = [...preguntasDesastres];
    
    // Filtrar preguntas según el tipo y subtipo
    preguntas = preguntas.filter(pregunta => {
      if (pregunta.mostrarSi) {
        return pregunta.mostrarSi();
      }
      return true;
    });

    // Si es "otros", agregar la pregunta específica después de la primera
    if (tipoWizard === 'otros' && pasoActualWizard > 0) {
      preguntas = [preguntas[0], ...preguntasOtros];
    }

    // Agregar preguntas comunes al final
    return [...preguntas, ...preguntasComunes];
  };

  const preguntasWizard = obtenerPreguntasActuales();

  // Estados de planes de acción
  const [planes, setPlanes] = useState<PlanAccion[]>([]);
  const [planActivo, setPlanActivo] = useState<string | null>(null);
  const [mostrarFormularioPlan, setMostrarFormularioPlan] = useState(false);

  // Estados de cultivos
  const [mostrarFormularioCultivo, setMostrarFormularioCultivo] = useState(false);
  const [cultivoEditando, setCultivoEditando] = useState<string | null>(null);

  const cultivosDisponibles = [
    'Papa', 'Quinua', 'Maíz', 'Trigo', 'Cebada', 'Haba', 'Oca', 'Papalisa',
    'Tomate', 'Cebolla', 'Zanahoria', 'Lechuga', 'Acelga', 'Espinaca',
    'Frijol', 'Arveja', 'Lenteja', 'Soya', 'Girasol', 'Café', 'Cacao'
  ];

  const variedadesPorCultivo: Record<string, string[]> = {
    'Papa': ['Waych\'a', 'Imilla negra', 'Huaycha', 'Revolución', 'Desiree', 'Alpha'],
    'Quinua': ['Real', 'Sajama', 'Patacamaya', 'Jancko Amaya', 'Surumi'],
    'Maíz': ['Blanco Urubamba', 'Amarillo duro', 'Morado', 'Chulpi', 'Confite'],
    'Trigo': ['Totora', 'Illimani', 'Centenario', 'Mexicano'],
    'Tomate': ['Río Grande', 'Platense', 'Cherry', 'Beef Master']
  };

  // Función para crear nueva conversación
  const crearNuevaConversacion = () => {
    const nuevaConversacion: Conversacion = {
      id: Date.now().toString(),
      titulo: 'Nueva Consulta',
      fechaCreacion: new Date().toISOString(),
      ultimaActividad: new Date().toISOString(),
      mensajes: [],
      etiquetas: [],
      favorita: false,
      archivada: false
    };
    
    setConversaciones(prev => [nuevaConversacion, ...prev]);
    setConversacionActiva(nuevaConversacion.id);
  };

  // Función para iniciar wizard de configuración
  const iniciarWizard = () => {
    setMostrandoWizard(true);
    setPasoActualWizard(0);
    setTipoWizard(null);
    setSubtipoDesastres(null);
    setRespuestaPersonalizada('');
    setMostrandoInputPersonalizado(false);
    
    // Limpiar datos previos
    setDatosWizard({
      tipoPlan: '',
      subtipoPlan: '',
      fenomenoClimatico: '',
      faseDesastre: '',
      objetivo: '',
      presupuesto: '',
      tiempoDisponible: '',
      urgencia: '',
      necesitaProveedores: false,
      experienciaPrevia: '',
      cultivosAfectados: [],
      ubicacionEspecifica: '',
      recursosDisponibles: []
    });
  };

  // Función para avanzar en el wizard
  const siguientePasoWizard = () => {
    if (pasoActualWizard < preguntasWizard.length - 1) {
      setPasoActualWizard(prev => prev + 1);
    } else {
      // Último paso: finalizar wizard e iniciar chat
      finalizarWizard();
    }
  };

  // Función para retroceder en el wizard
  const pasoAnteriorWizard = () => {
    if (pasoActualWizard > 0) {
      setPasoActualWizard(prev => prev - 1);
    }
  };

  // Función para finalizar wizard e iniciar chat
  const finalizarWizard = () => {
    setMostrandoWizard(false);
    
    // Crear mensaje de bienvenida personalizado
    const mensajeBienvenida: Mensaje = {
      id: Date.now().toString(),
      tipo: 'ia',
      contenido: `¡Perfecto! He registrado toda tu información:

🎯 **Tu objetivo:** ${datosWizard.objetivo}
💰 **Presupuesto:** ${datosWizard.presupuesto}
⏱️ **Tiempo disponible:** ${datosWizard.tiempoDisponible}
🚨 **Urgencia:** ${datosWizard.urgencia}
👥 **Proveedores:** ${datosWizard.necesitaProveedores ? 'Necesita ayuda' : 'Ya tiene contactos'}
📚 **Experiencia:** ${datosWizard.experienciaPrevia}
🌱 **Cultivos:** ${datosWizard.cultivosAfectados.join(', ')}

Ahora puedes hacerme cualquier pregunta específica y te daré recomendaciones personalizadas basadas en esta información. 

¿En qué te gustaría que te ayude primero?`,
      timestamp: new Date().toISOString()
    };

    if (conversacionActiva) {
      setConversaciones(prev => prev.map(conv => 
        conv.id === conversacionActiva 
          ? { 
              ...conv, 
              mensajes: [...conv.mensajes, mensajeBienvenida],
              ultimaActividad: new Date().toISOString(),
              titulo: `Plan: ${datosWizard.objetivo}`
            }
          : conv
      ));
    }
  };

  // Función para manejar selección en wizard
  const manejarSeleccionWizard = (valor: any) => {
    const preguntaActual = preguntasWizard[pasoActualWizard];
    
    // Verificar si se seleccionó "Otros - Escríbelo tú mismo"
    if (typeof valor === 'string' && valor.includes('✏️ Otros') || valor === 'personalizado' || valor.includes('✏️ Escríbelo')) {
      setMostrandoInputPersonalizado(true);
      return;
    }
    
    // Manejar lógica especial para la primera pregunta
    if (preguntaActual.campo === 'tipoPlan') {
      if (valor.includes('Desastres')) {
        setTipoWizard('desastres');
      } else {
        setTipoWizard('otros');
      }
    }
    
    // Manejar lógica para subtipo de desastres
    if (preguntaActual.campo === 'subtipoPlan') {
      if (valor.includes('Adaptación')) {
        setSubtipoDesastres('adaptacion');
      } else if (valor.includes('Sostenible')) {
        setSubtipoDesastres('sostenible');
      }
    }
    
    if ('multiple' in preguntaActual && preguntaActual.multiple) {
      // Para selección múltiple (cultivos)
      setDatosWizard(prev => ({
        ...prev,
        [preguntaActual.campo]: prev.cultivosAfectados.includes(valor)
          ? prev.cultivosAfectados.filter((item: string) => item !== valor)
          : [...prev.cultivosAfectados, valor]
      }));
    } else {
      // Para selección única
      setDatosWizard(prev => ({
        ...prev,
        [preguntaActual.campo]: valor
      }));
    }
  };

  // Función para manejar respuesta personalizada
  const manejarRespuestaPersonalizada = () => {
    if (respuestaPersonalizada.trim()) {
      const preguntaActual = preguntasWizard[pasoActualWizard];
      setDatosWizard(prev => ({
        ...prev,
        [preguntaActual.campo]: respuestaPersonalizada
      }));
      setMostrandoInputPersonalizado(false);
      setRespuestaPersonalizada('');
    }
  };

  // Función para verificar si puede continuar
  const puedeAvanzar = () => {
    // Si está mostrando input personalizado, no puede avanzar hasta que guarde
    if (mostrandoInputPersonalizado) {
      return false;
    }
    
    const preguntaActual = preguntasWizard[pasoActualWizard];
    const valorActual = datosWizard[preguntaActual.campo as keyof typeof datosWizard];
    
    if ('multiple' in preguntaActual && preguntaActual.multiple) {
      return Array.isArray(valorActual) && valorActual.length > 0;
    }
    
    return valorActual !== '' && valorActual !== false && valorActual !== undefined;
  };

  // Función para generar plan desde datos del wizard
  const generarPlanPersonalizadoChat = () => {
    if (!conversacionActiva) return;

    const prompt = `
**Información del Agricultor:**
- Objetivo: ${datosWizard.objetivo}
- Presupuesto disponible: ${datosWizard.presupuesto}
- Tiempo disponible: ${datosWizard.tiempoDisponible}
- Necesita proveedores: ${datosWizard.necesitaProveedores ? 'Sí' : 'No'}
- Urgencia: ${datosWizard.urgencia}
- Experiencia previa: ${datosWizard.experienciaPrevia}
- Cultivos afectados: ${datosWizard.cultivosAfectados.join(', ')}
`;

    setCargandoRespuesta(true);

    // Agregar el prompt como mensaje del usuario
    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      tipo: 'usuario',
      contenido: `Genera un plan detallado basado en mi información:\n\n${prompt}`,
      timestamp: new Date().toISOString()
    };

    setConversaciones(prev => prev.map(conv => 
      conv.id === conversacionActiva 
        ? { 
            ...conv, 
            mensajes: [...conv.mensajes, mensajeUsuario],
            ultimaActividad: new Date().toISOString()
          }
        : conv
    ));

    // Generar respuesta de IA
    setTimeout(() => {
      const respuestaIA = generarPlanPersonalizado(datosWizard);
      
      const mensajeIA: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'ia',
        contenido: respuestaIA,
        timestamp: new Date().toISOString()
      };

      setConversaciones(prev => prev.map(conv => 
        conv.id === conversacionActiva 
          ? { 
              ...conv, 
              mensajes: [...conv.mensajes, mensajeIA],
              ultimaActividad: new Date().toISOString()
            }
          : conv
      ));

      setCargandoRespuesta(false);
    }, 3000);
  };

  // Función para enviar mensaje a la IA
  const enviarMensaje = async () => {
    if (!mensajeActual.trim() || !conversacionActiva) return;

    const nuevoMensaje: Mensaje = {
      id: Date.now().toString(),
      tipo: 'usuario',
      contenido: mensajeActual,
      timestamp: new Date().toISOString()
    };

    // Agregar mensaje del usuario
    setConversaciones(prev => prev.map(conv => 
      conv.id === conversacionActiva 
        ? { 
            ...conv, 
            mensajes: [...conv.mensajes, nuevoMensaje],
            ultimaActividad: new Date().toISOString(),
            titulo: conv.mensajes.length === 0 ? mensajeActual.slice(0, 50) + '...' : conv.titulo
          }
        : conv
    ));

    setMensajeActual('');
    setCargandoRespuesta(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const respuestaIA = generarRespuestaIA(mensajeActual);
      
      const mensajeIA: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'ia',
        contenido: respuestaIA,
        timestamp: new Date().toISOString()
      };

      setConversaciones(prev => prev.map(conv => 
        conv.id === conversacionActiva 
          ? { 
              ...conv, 
              mensajes: [...conv.mensajes, mensajeIA],
              ultimaActividad: new Date().toISOString()
            }
          : conv
      ));

      setCargandoRespuesta(false);
    }, 2500);
  };

  // Función para generar plan personalizado desde wizard
  const generarPlanPersonalizado = (datos: typeof datosWizard): string => {
    return `**🎯 PLAN PERSONALIZADO GENERADO**

Basándome en la información que proporcionaste, he creado un plan específico para tu situación:

**📋 RESUMEN DE TU SOLICITUD:**
- **Objetivo:** ${datos.objetivo}
- **Presupuesto:** ${datos.presupuesto}
- **Tiempo disponible:** ${datos.tiempoDisponible}
- **Urgencia:** ${datos.urgencia}

**📅 PLAN DE ACCIÓN DETALLADO:**

**FASE 1: PREPARACIÓN (Semana 1)**
1. **Evaluación inicial del terreno**
   - Análisis de suelo y condiciones actuales
   - Inventario de recursos disponibles
   - Costo estimado: 200-500 Bs

2. **Adquisición de materiales**
   ${datos.necesitaProveedores ? '- Te ayudo a contactar proveedores confiables' : '- Usar recursos disponibles'}
   - Lista de materiales necesarios
   - Comparación de precios

**FASE 2: IMPLEMENTACIÓN (Semanas 2-3)**
3. **Ejecución de medidas**
   - Aplicación de técnicas específicas para ${datos.cultivosAfectados.join(', ')}
   - Monitoreo diario de progreso
   - Ajustes según condiciones climáticas

4. **Seguimiento intensivo**
   - Control de plagas y enfermedades
   - Riego y fertilización programada

**FASE 3: EVALUACIÓN (Semana 4)**
5. **Análisis de resultados**
   - Medición de indicadores clave
   - Documentación de lecciones aprendidas
   - Planificación de próximos pasos

**💰 PRESUPUESTO DETALLADO:**
- Materiales: 60% del presupuesto
- Mano de obra: 25% del presupuesto  
- Contingencias: 15% del presupuesto
- **Total estimado:** ${datos.presupuesto}

**📞 PROVEEDORES RECOMENDADOS:**
${datos.necesitaProveedores ? `
- Semillas certificadas: Agro Semillas La Paz
- Fertilizantes: Distribuidora Agrícola Central
- Herramientas: Ferretería Agrícola Boliviana
` : 'Utilizarás tus recursos actuales disponibles'}

**⚠️ CONSIDERACIONES ESPECIALES:**
- Nivel de urgencia: ${datos.urgencia}
- Experiencia previa: ${datos.experienciaPrevia}

**🎯 PROBABILIDAD DE ÉXITO: 90%**

¿Te gustaría que convierta este plan en tareas específicas que puedas seguir paso a paso?`;
  };

  // Función para generar respuesta de IA contextualizada
  const generarRespuestaIA = (pregunta: string): string => {
    const preguntaLower = pregunta.toLowerCase();
    
    if (preguntaLower.includes('plan') || preguntaLower.includes('planificar')) {
      return `**Plan de Acción Personalizado Generado**

Basándome en tu perfil agrícola y la consulta realizada, he creado un plan de acción específico:

🎯 **Objetivo Principal:** ${pregunta}

📋 **Plan Recomendado:**
1. **Evaluación inicial** (Semana 1)
   - Análisis de suelo y condiciones actuales
   - Inventario de recursos disponibles
   - Identificación de riesgos específicos

2. **Implementación** (Semanas 2-4)
   - Preparación de materiales y herramientas
   - Ejecución de medidas preventivas
   - Monitoreo continuo de indicadores

3. **Seguimiento** (Semanas 5-8)
   - Evaluación de resultados
   - Ajustes según condiciones
   - Documentación de lecciones aprendidas

💰 **Presupuesto estimado:** 1,500 - 3,000 Bs
⏱️ **Duración:** 6-8 semanas
🎯 **Probabilidad de éxito:** 85%

¿Te gustaría que genere un plan detallado con tareas específicas?`;
    }

    if (preguntaLower.includes('cultivo') || preguntaLower.includes('sembrar')) {
      return `**Recomendaciones para tus Cultivos**

Considerando tu ubicación y experiencia, aquí tienes recomendaciones específicas:

🌱 **Para tus cultivos actuales:**
${perfil.cultivos.map(c => `- **${c.nombre}**: Actualmente en ${c.etapaActual}, requiere atención en ${c.riesgos.join(', ')}`).join('\n')}

📅 **Calendario de actividades:**
- **Esta semana:** Monitoreo de plagas y riego
- **Próximas 2 semanas:** Fertilización foliar
- **Mes siguiente:** Preparación para cosecha

⚠️ **Alertas importantes:**
- Riesgo de heladas en los próximos 5 días
- Condiciones favorables para tizón tardío
- Precio de fertilizantes en alza (+15%)

🔧 **Acciones recomendadas:**
1. Aplicar protección antiheladas
2. Monitorear humedad del suelo
3. Preparar cosecha temprana si es necesario

¿Necesitas un plan específico para algún cultivo?`;
    }

    return `**Análisis IA Personalizado**

He analizado tu consulta considerando tu perfil agrícola:

📍 **Tu contexto:**
- Ubicación: ${perfil.ubicacion || 'No especificada'}
- Experiencia: ${perfil.experiencia} años
- Cultivos principales: ${perfil.cultivos.map(c => c.nombre).join(', ') || 'No especificados'}

💡 **Recomendación específica:**
Basándome en tu situación particular, te sugiero enfocarte en prácticas de agricultura climáticamente inteligente que se adapten a tu nivel de experiencia y recursos disponibles.

🎯 **Próximos pasos:**
1. Completa tu perfil agrícola para recomendaciones más precisas
2. Define tus objetivos específicos para esta temporada
3. Considera implementar tecnologías apropiadas para tu escala

¿Te gustaría que profundice en algún aspecto específico o genere un plan de acción detallado?`;
  };

  // Función para generar plan de acción desde conversación
  const generarPlanDesdeConversacion = (conversacionId: string) => {
    const conversacion = conversaciones.find(c => c.id === conversacionId);
    if (!conversacion) return;

    const nuevoPlan: PlanAccion = {
      id: Date.now().toString(),
      titulo: `Plan: ${conversacion.titulo}`,
      descripcion: 'Plan generado automáticamente desde conversación con IA',
      cultivos: perfil.cultivos.map(c => c.id),
      fechaCreacion: new Date().toISOString(),
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      estado: 'pendiente',
      prioridad: 'media',
      categoria: 'General',
      tareas: [
        {
          id: '1',
          titulo: 'Evaluación inicial',
          descripcion: 'Realizar diagnóstico de la situación actual',
          completada: false,
          fechaLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          recursos: ['Herramientas de evaluación'],
          costo: 0,
          responsable: 'Agricultor',
          notas: ''
        },
        {
          id: '2',
          titulo: 'Implementación de medidas',
          descripcion: 'Ejecutar las recomendaciones de la IA',
          completada: false,
          fechaLimite: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          recursos: ['Materiales específicos'],
          costo: 500,
          responsable: 'Agricultor',
          notas: ''
        }
      ],
      presupuesto: 1000,
      progreso: 0,
      notas: '',
      conversacionId: conversacionId
    };

    setPlanes(prev => [nuevoPlan, ...prev]);
    
    // Marcar conversación como generadora de plan
    setConversaciones(prev => prev.map(conv => 
      conv.id === conversacionId 
        ? { ...conv, planGenerado: nuevoPlan.id }
        : conv
    ));

    setActiveTab('planes');
    setPlanActivo(nuevoPlan.id);
  };

  // Función para agregar cultivo
  const agregarCultivo = (nuevoCultivo: Omit<Cultivo, 'id'>) => {
    const cultivo: Cultivo = {
      id: Date.now().toString(),
      ...nuevoCultivo
    };
    
    setPerfil(prev => ({
      ...prev,
      cultivos: [...prev.cultivos, cultivo]
    }));
    
    setMostrarFormularioCultivo(false);
  };

  // Función para actualizar progreso de plan
  const actualizarProgresoPlan = (planId: string) => {
    setPlanes(prev => prev.map(plan => {
      if (plan.id === planId) {
        const tareasCompletadas = plan.tareas.filter(t => t.completada).length;
        const progreso = (tareasCompletadas / plan.tareas.length) * 100;
        const estado = progreso === 100 ? 'completado' : progreso > 0 ? 'en_progreso' : 'pendiente';
        
        return { ...plan, progreso, estado };
      }
      return plan;
    }));
  };

  // Función para completar tarea
  const completarTarea = (planId: string, tareaId: string) => {
    setPlanes(prev => prev.map(plan => {
      if (plan.id === planId) {
        const nuevasTareas = plan.tareas.map(tarea => 
          tarea.id === tareaId ? { ...tarea, completada: !tarea.completada } : tarea
        );
        return { ...plan, tareas: nuevasTareas };
      }
      return plan;
    }));
    
    actualizarProgresoPlan(planId);
  };

  // Verificar si el perfil está completo
  useEffect(() => {
    const completo = perfil.nombre && perfil.ubicacion && perfil.cultivos.length > 0;
    setPerfilCompleto(!!completo);
  }, [perfil]);

  // Crear conversación inicial si no existe
  useEffect(() => {
    if (conversaciones.length === 0) {
      crearNuevaConversacion();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-agriculture-terracotta" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth bg-clip-text text-transparent">
            Asistente IA Agrícola Avanzado
          </h1>
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Sistema inteligente que crea <strong>planes de acción personalizados</strong>, guarda conversaciones 
          y gestiona tus cultivos para una agricultura más eficiente y sostenible.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">Planes Personalizados</Badge>
          <Badge className="bg-green-100 text-green-800">Gestión de Cultivos</Badge>
          <Badge className="bg-purple-100 text-purple-800">Conversaciones Guardadas</Badge>
          <Badge className="bg-orange-100 text-orange-800">IA Contextual</Badge>
        </div>
      </div>

      {/* Alerta de perfil incompleto */}
      {!perfilCompleto && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Completa tu perfil agrícola</strong> para obtener recomendaciones más precisas y planes de acción personalizados.
            <Button 
              variant="link" 
              className="p-0 ml-2 text-yellow-800 underline"
              onClick={() => setMostrarPerfil(true)}
            >
              Completar ahora →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Navegación principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="planes" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Planes de Acción
          </TabsTrigger>
          <TabsTrigger value="cultivos" className="flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            Mis Cultivos
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Mi Perfil
          </TabsTrigger>
        </TabsList>
        
        {/* Tab: Chat IA */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
            {/* Lista de conversaciones */}
            <div className="lg:col-span-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Conversaciones</h3>
                <Button size="sm" onClick={crearNuevaConversacion}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {conversaciones.map((conv) => (
                  <Card 
                    key={conv.id}
                    className={`cursor-pointer transition-all ${
                      conversacionActiva === conv.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setConversacionActiva(conv.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{conv.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conv.ultimaActividad).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {conv.mensajes.length} mensajes
                            </Badge>
                            {conv.planGenerado && (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                Plan creado
                              </Badge>
                            )}
                          </div>
                        </div>
                        {conv.favorita && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
              </CardContent>
            </Card>
                ))}
              </div>
            </div>

            {/* Área de chat */}
            <div className="lg:col-span-3 flex flex-col">
              {mostrandoWizard ? (
                /* Wizard de configuración inicial */
                <div className="flex-1 flex flex-col">
                  {/* Header del wizard */}
                  <div className="p-4 border-b bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-800">Configuración Inicial</h3>
                        <p className="text-sm text-blue-600">
                          Paso {pasoActualWizard + 1} de {preguntasWizard.length}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((pasoActualWizard + 1) / preguntasWizard.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-600 font-medium">
                          {Math.round(((pasoActualWizard + 1) / preguntasWizard.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenido del wizard */}
                  <div className="flex-1 flex items-center justify-center p-8">
                    <Card className="w-full max-w-2xl border-blue-200">
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-blue-800">
                          {preguntasWizard[pasoActualWizard]?.titulo}
                        </CardTitle>
                        <CardDescription className="text-lg">
                          {preguntasWizard[pasoActualWizard]?.descripcion}
                        </CardDescription>
              </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Input personalizado */}
                        {mostrandoInputPersonalizado ? (
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-medium text-blue-800 mb-2">Escribe tu respuesta personalizada:</h4>
                              <Textarea
                                placeholder="Describe tu situación específica..."
                                value={respuestaPersonalizada}
                                onChange={(e) => setRespuestaPersonalizada(e.target.value)}
                                rows={4}
                                className="w-full"
                              />
                              <div className="flex gap-2 mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setMostrandoInputPersonalizado(false);
                                    setRespuestaPersonalizada('');
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={manejarRespuestaPersonalizada}
                                  disabled={!respuestaPersonalizada.trim()}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Guardar Respuesta
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Renderizar opciones según el tipo de pregunta */
                          preguntasWizard[pasoActualWizard]?.campo === 'urgencia' ? (
                          <div className="grid grid-cols-1 gap-3">
                            {(preguntasWizard[pasoActualWizard].opciones as Array<{valor: string, color: string}>).map((opcion) => (
                              <Button
                                key={opcion.valor}
                                variant={datosWizard.urgencia === opcion.valor ? "default" : "outline"}
                                size="lg"
                                className={`h-auto py-4 px-6 text-left justify-start ${
                                  datosWizard.urgencia === opcion.valor ? '' : opcion.color
                                }`}
                                onClick={() => manejarSeleccionWizard(opcion.valor)}
                              >
                                <div>
                                  <div className="font-medium">{opcion.valor}</div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        ) : preguntasWizard[pasoActualWizard]?.campo === 'necesitaProveedores' ? (
                          <div className="grid grid-cols-1 gap-3">
                            {(preguntasWizard[pasoActualWizard].opciones as Array<{valor: boolean, texto: string, icono: any}>).map((opcion) => {
                              const IconComponent = opcion.icono;
                              return (
                                <Button
                                  key={opcion.valor.toString()}
                                  variant={datosWizard.necesitaProveedores === opcion.valor ? "default" : "outline"}
                                  size="lg"
                                  className="h-auto py-4 px-6 text-left justify-start"
                                  onClick={() => manejarSeleccionWizard(opcion.valor)}
                                >
                                  <IconComponent className="h-5 w-5 mr-3" />
                                  <div className="font-medium">{opcion.texto}</div>
                                </Button>
                              );
                            })}
                          </div>
                        ) : ('multiple' in preguntasWizard[pasoActualWizard] && preguntasWizard[pasoActualWizard].multiple) ? (
                          <div className="grid grid-cols-2 gap-3">
                            {(preguntasWizard[pasoActualWizard].opciones as string[]).map((opcion) => (
                              <Button
                                key={opcion}
                                variant={datosWizard.cultivosAfectados.includes(opcion) ? "default" : "outline"}
                                size="lg"
                                className="h-auto py-4 px-6 text-left justify-start"
                                onClick={() => manejarSeleccionWizard(opcion)}
                              >
                                {datosWizard.cultivosAfectados.includes(opcion) && (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                <div className="font-medium">{opcion}</div>
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {(preguntasWizard[pasoActualWizard]?.opciones as string[]).map((opcion) => (
                              <Button
                                key={opcion}
                                variant={datosWizard[preguntasWizard[pasoActualWizard].campo as keyof typeof datosWizard] === opcion ? "default" : "outline"}
                                size="lg"
                                className="h-auto py-4 px-6 text-left justify-start"
                                onClick={() => manejarSeleccionWizard(opcion)}
                              >
                                <div className="font-medium">{opcion}</div>
                              </Button>
                            ))}
                          </div>
                        )
                        )}
              </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={pasoAnteriorWizard}
                          disabled={pasoActualWizard === 0}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Anterior
                </Button>
                        
                        <Button 
                          onClick={siguientePasoWizard}
                          disabled={!puedeAvanzar()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {pasoActualWizard === preguntasWizard.length - 1 ? (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Empezar Chat
                            </>
                          ) : (
                            <>
                              Siguiente
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                </Button>
              </CardFooter>
            </Card>
                  </div>
                </div>
              ) : conversacionActiva ? (
                <>
                  {/* Header del chat */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <h3 className="font-semibold">
                        {conversaciones.find(c => c.id === conversacionActiva)?.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Asistente IA especializado en agricultura andina
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => generarPlanDesdeConversacion(conversacionActiva)}
                        disabled={!conversaciones.find(c => c.id === conversacionActiva)?.mensajes.length}
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Generar Plan
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={generarPlanPersonalizadoChat}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Plan Personalizado
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversaciones.find(c => c.id === conversacionActiva)?.mensajes.map((mensaje) => (
                      <div 
                        key={mensaje.id}
                        className={`flex ${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-3 max-w-[80%] ${
                          mensaje.tipo === 'usuario' ? 'flex-row-reverse' : ''
                        }`}>
                          <div className={`p-2 rounded-full ${
                            mensaje.tipo === 'usuario' 
                              ? 'bg-blue-100' 
                              : 'bg-green-100'
                          }`}>
                            {mensaje.tipo === 'usuario' ? (
                              <User className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Bot className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          
                          <div className={`p-3 rounded-lg ${
                            mensaje.tipo === 'usuario'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <div className="prose prose-sm max-w-none">
                              {mensaje.contenido.split('\n').map((line, index) => (
                                <div key={index} className="mb-1">
                                  {line.startsWith('**') && line.endsWith('**') ? (
                                    <strong>{line.replace(/\*\*/g, '')}</strong>
                                  ) : (
                                    <span>{line}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-xs mt-2 opacity-70">
                              {new Date(mensaje.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {cargandoRespuesta && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100">
                            <Bot className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">IA analizando tu consulta...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input de mensaje */}
                  <div className="p-4 border-t">
                    {/* Botones de acceso rápido */}
                    <div className="flex gap-2 mb-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={iniciarWizard}
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Empezar Configuración
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setMensajeActual('¿Cómo puedo mejorar la producción de mis cultivos?')}
                        className="text-xs"
                      >
                        💡 Mejorar producción
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setMensajeActual('¿Qué hacer contra las plagas en mis cultivos?')}
                        className="text-xs"
                      >
                        🐛 Control de plagas
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Escribe tu consulta o haz click en 'Empezar Configuración' para un plan personalizado..."
                        value={mensajeActual}
                        onChange={(e) => setMensajeActual(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                        disabled={cargandoRespuesta}
                      />
                      <Button 
                        onClick={enviarMensaje}
                        disabled={!mensajeActual.trim() || cargandoRespuesta}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {!perfilCompleto && (
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 Completa tu perfil para obtener recomendaciones más precisas
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Selecciona una conversación</h3>
                    <p className="text-muted-foreground">
                      O crea una nueva para comenzar a chatear con la IA
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Tab: Planes de Acción */}
        <TabsContent value="planes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Planes de Acción</h2>
              <p className="text-muted-foreground">
                Gestiona tus planes personalizados generados por IA
              </p>
            </div>
            <Button onClick={() => setMostrarFormularioPlan(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Plan
            </Button>
          </div>

          {planes.length === 0 ? (
            <Card className="p-12 text-center">
              <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes planes de acción</h3>
              <p className="text-muted-foreground mb-4">
                Crea planes personalizados o genera uno desde una conversación con la IA
              </p>
              <Button onClick={() => setActiveTab('chat')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Ir al Chat IA
                </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {planes.map((plan) => (
                <Card key={plan.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.titulo}</CardTitle>
                        <CardDescription>{plan.descripcion}</CardDescription>
                      </div>
                      <Badge className={
                        plan.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        plan.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                        plan.estado === 'pausado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {plan.estado.replace('_', ' ')}
                      </Badge>
                    </div>
              </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span>{Math.round(plan.progreso)}%</span>
                      </div>
                      <Progress value={plan.progreso} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Tareas:</span>
                        <span>{plan.tareas.filter(t => t.completada).length}/{plan.tareas.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Presupuesto:</span>
                        <span>{plan.presupuesto} Bs</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Fecha límite:</span>
                        <span>{new Date(plan.fechaFin).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {plan.tareas.slice(0, 3).map((tarea) => (
                        <div key={tarea.id} className="flex items-center gap-2 text-sm">
                          <Checkbox 
                            checked={tarea.completada}
                            onCheckedChange={() => completarTarea(plan.id, tarea.id)}
                          />
                          <span className={tarea.completada ? 'line-through text-muted-foreground' : ''}>
                            {tarea.titulo}
                          </span>
                        </div>
                      ))}
                      {plan.tareas.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{plan.tareas.length - 3} tareas más
                        </p>
                      )}
                    </div>
              </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Mis Cultivos */}
        <TabsContent value="cultivos" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Mis Cultivos</h2>
              <p className="text-muted-foreground">
                Gestiona información detallada de tus cultivos actuales
              </p>
            </div>
            <Button onClick={() => setMostrarFormularioCultivo(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cultivo
            </Button>
          </div>

          {perfil.cultivos.length === 0 ? (
            <Card className="p-12 text-center">
              <Sprout className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes cultivos registrados</h3>
              <p className="text-muted-foreground mb-4">
                Agrega información sobre tus cultivos para obtener recomendaciones personalizadas
              </p>
              <Button onClick={() => setMostrarFormularioCultivo(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Cultivo
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perfil.cultivos.map((cultivo) => (
                <Card key={cultivo.id}>
              <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{cultivo.nombre}</CardTitle>
                        <CardDescription>{cultivo.variedad}</CardDescription>
                      </div>
                      <Badge className={
                        cultivo.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                        cultivo.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {cultivo.prioridad}
                      </Badge>
                    </div>
              </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Hectáreas:</span>
                        <p className="font-medium">{cultivo.hectareas} ha</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Etapa:</span>
                        <p className="font-medium">{cultivo.etapaActual}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground text-sm">Fecha de siembra:</span>
                      <p className="font-medium">{new Date(cultivo.fechaSiembra).toLocaleDateString()}</p>
                    </div>
                    
                    {cultivo.riesgos.length > 0 && (
                      <div>
                        <span className="text-muted-foreground text-sm">Riesgos identificados:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cultivo.riesgos.map((riesgo, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {riesgo}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
              </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCultivoEditando(cultivo.id)}
                    >
                      <Edit className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
              ))}
          </div>
          )}

          {/* Formulario de cultivo */}
          {mostrarFormularioCultivo && (
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle>Agregar Nuevo Cultivo</CardTitle>
                <CardDescription>
                  Proporciona información detallada para obtener recomendaciones precisas
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Cultivo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el cultivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {cultivosDisponibles.map((cultivo) => (
                          <SelectItem key={cultivo} value={cultivo.toLowerCase()}>
                            {cultivo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Variedad</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la variedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Variedad general</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Hectáreas</Label>
                    <Input type="number" placeholder="0.0" step="0.1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fecha de Siembra</Label>
                    <Input type="date" />
                </div>
                  
                  <div className="space-y-2">
                    <Label>Etapa Actual</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la etapa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preparacion">Preparación del suelo</SelectItem>
                        <SelectItem value="siembra">Siembra</SelectItem>
                        <SelectItem value="germinacion">Germinación</SelectItem>
                        <SelectItem value="crecimiento">Crecimiento vegetativo</SelectItem>
                        <SelectItem value="floracion">Floración</SelectItem>
                        <SelectItem value="fructificacion">Fructificación</SelectItem>
                        <SelectItem value="maduracion">Maduración</SelectItem>
                        <SelectItem value="cosecha">Cosecha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Prioridad</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Nivel de prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Riesgos Identificados (opcional)</Label>
                  <Textarea 
                    placeholder="Describe cualquier riesgo o problema que hayas observado..."
                    rows={3}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setMostrarFormularioCultivo(false)}
                >
                  Cancelar
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cultivo
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* Tab: Mi Perfil */}
        <TabsContent value="perfil" className="space-y-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Mi Perfil Agrícola</h2>
              <p className="text-muted-foreground">
                Información completa para recomendaciones personalizadas de IA
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Información básica */}
              <Card className="lg:col-span-2">
              <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
              </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre Completo</Label>
                      <Input 
                        value={perfil.nombre}
                        onChange={(e) => setPerfil(prev => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Tu nombre completo"
                      />
                  </div>
                  
                    <div className="space-y-2">
                      <Label>Ubicación</Label>
                      <Input 
                        value={perfil.ubicacion}
                        onChange={(e) => setPerfil(prev => ({ ...prev, ubicacion: e.target.value }))}
                        placeholder="Ciudad, departamento"
                      />
                  </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de Finca</Label>
                      <Select 
                        value={perfil.tipoFinca}
                        onValueChange={(value: any) => setPerfil(prev => ({ ...prev, tipoFinca: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="familiar">Familiar</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="cooperativa">Cooperativa</SelectItem>
                          <SelectItem value="empresa">Empresa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Hectáreas Totales</Label>
                      <Input 
                        type="number"
                        value={perfil.hectareasTotales}
                        onChange={(e) => setPerfil(prev => ({ ...prev, hectareasTotales: Number(e.target.value) }))}
                        placeholder="0.0"
                        step="0.1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Años de Experiencia</Label>
                      <Input 
                        type="number"
                        value={perfil.experiencia}
                        onChange={(e) => setPerfil(prev => ({ ...prev, experiencia: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Presupuesto Anual (Bs)</Label>
                      <Input 
                        type="number"
                        value={perfil.presupuestoAnual}
                        onChange={(e) => setPerfil(prev => ({ ...prev, presupuestoAnual: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Contacto de Emergencia</Label>
                    <Input 
                      value={perfil.contactoEmergencia}
                      onChange={(e) => setPerfil(prev => ({ ...prev, contactoEmergencia: e.target.value }))}
                      placeholder="Teléfono o contacto de emergencia"
                    />
                </div>
              </CardContent>
            </Card>
            
              {/* Estadísticas */}
            <Card>
              <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {perfil.cultivos.length}
                  </div>
                    <p className="text-sm text-muted-foreground">Cultivos Registrados</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {conversaciones.length}
                  </div>
                    <p className="text-sm text-muted-foreground">Conversaciones IA</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {planes.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Planes de Acción</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(planes.reduce((acc, plan) => acc + plan.progreso, 0) / (planes.length || 1))}%
                    </div>
                    <p className="text-sm text-muted-foreground">Progreso Promedio</p>
                </div>
              </CardContent>
            </Card>
            </div>
            
            {/* Preferencias de IA */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preferencias de IA</CardTitle>
                <CardDescription>
                  Personaliza cómo la IA interactúa contigo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nivel de Detalle</Label>
                    <Select 
                      value={perfil.preferenciasIA.nivelDetalle}
                      onValueChange={(value: any) => setPerfil(prev => ({
                        ...prev,
                        preferenciasIA: { ...prev.preferenciasIA, nivelDetalle: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Frecuencia de Notificaciones</Label>
                    <Select 
                      value={perfil.preferenciasIA.frecuenciaNotificaciones}
                      onValueChange={(value: any) => setPerfil(prev => ({
                        ...prev,
                        preferenciasIA: { ...prev.preferenciasIA, frecuenciaNotificaciones: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Idioma Preferido</Label>
                    <Select 
                      value={perfil.preferenciasIA.idiomaPreferido}
                      onValueChange={(value: any) => setPerfil(prev => ({
                        ...prev,
                        preferenciasIA: { ...prev.preferenciasIA, idiomaPreferido: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="qu">Quechua</SelectItem>
                        <SelectItem value="ay">Aymara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Perfil
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
