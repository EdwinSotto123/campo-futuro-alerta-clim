import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { MapSelector } from "@/components/MapSelector";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  HelpCircle, 
  Lightbulb, 
  BookOpen, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Leaf,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  Sprout,
  BarChart3,
  Plus,
  Activity,
  Zap,
  Store,
  Coins,
  Truck,
  Target
} from "lucide-react";

// 🎨 ESTILOS CSS SIMPLIFICADOS Y FUNCIONALES
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes gentlePulse {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
    }
    50% { 
      box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
  }
  
  .animate-gentle-pulse {
    animation: gentlePulse 2s ease-in-out infinite;
  }
  
  .smooth-hover {
    transition: all 0.2s ease-in-out;
  }
  
  .smooth-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  `;

// Inyectar estilos personalizados
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

// 🌱 TIPOS DE DATOS PARA LA GRANJA VIRTUAL

// 📍 INTERFAZ COMÚN DE UBICACIÓN Y MOVILIDAD
interface UbicacionGeodata {
  departamento: string;
  provincia: string;
  distrito: string;
  coordenadas?: { lat: number; lng: number };
  altitud?: number;
  caracteristicas_geograficas: string[]; // ['montañoso', 'valle', 'costa', 'selva']
  accesibilidad: 'excelente' | 'buena' | 'regular' | 'dificil';
  carreteras_principales: string[]; // ['PE-3N', 'Carretera Central']
  distancia_capital_km: number;
}

interface MovilidadLogistica {
  transporte_principal: 'vehiculo_propio' | 'contratado' | 'cooperativa' | 'publico' | 'mixto';
  vehiculos_disponibles: string[]; // ['camioneta', 'camion', 'motocicleta', 'bicicleta']
  capacidad_carga_kg: number;
  frecuencia_transporte: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'por_demanda';
  rutas_criticas: string[]; // Carreteras que si se cierran afectan operación
  backup_transporte: string; // Plan B de transporte
  costos_transporte_mes: number;
}

interface Cultivo {
  id: string;
  nombre: string;
  tipo: 'papa' | 'quinua' | 'maiz' | 'habas' | 'oca' | 'ulluco' | 'cebada' | 'trigo';
  variedad: string;
  fechaPlantacion: string;
  fechaCosechaEstimada: string;
  area: number; // en hectáreas
  etapaCrecimiento: 'semilla' | 'germinacion' | 'crecimiento' | 'floracion' | 'fructificacion' | 'cosecha';
  salud: number; // 0-100
  riesgClimatico: number; // 0-100
  rendimientoEstimado: number; // kg/ha
  costoInversion: number;
  posicion: { fila: number; columna: number };
  notas: string;
  // 🆕 CAMPOS MEJORADOS
  ubicacion: UbicacionGeodata;
  movilidad: MovilidadLogistica;
  mercados_destino: string[]; // A donde se vende la producción
  dependencias_criticas: string[]; // Insumos/servicios críticos para este cultivo
}

interface Proveedor {
  id: string;
  nombre: string;
  tipo: 'semillas' | 'fertilizantes' | 'pesticidas' | 'herramientas' | 'maquinaria';
  contacto: {
    telefono: string;
    email: string;
    direccion: string;
  };
  productos: {
    nombre: string;
    precio: number;
    unidad: string;
    calidad: number; // 1-5 estrellas
  }[];
  confiabilidad: number; // 1-5 estrellas
  tiempoEntrega: string;
  posicion: { fila: number; columna: number };
  // 🆕 CAMPOS MEJORADOS
  ubicacion: UbicacionGeodata;
  movilidad: MovilidadLogistica;
  zonas_cobertura: string[]; // Departamentos o provincias que atiende
  backup_proveedores: string[]; // Proveedores alternativos en caso de fallos
}

interface Cliente {
  id: string;
  nombre: string;
  tipo: 'mayorista' | 'minorista' | 'restaurante' | 'mercado_local' | 'exportacion';
  contacto: {
    telefono: string;
    email: string;
    direccion: string;
  };
  productos_interes: string[];
  precio_promedio: number;
  volumen_compra: string;
  frecuencia: string;
  calificacion: number; // 1-5 estrellas
  posicion: { fila: number; columna: number };
  // 🆕 CAMPOS MEJORADOS
  ubicacion: UbicacionGeodata;
  movilidad: MovilidadLogistica;
  canales_distribucion: string[]; // Como llega el producto al cliente final
  clientes_alternativos: string[]; // Backup en caso de cancelaciones
}

interface Trabajador {
  id: string;
  nombre: string;
  apellidos: string;
  rol: 'agricultor' | 'operador_maquinaria' | 'supervisor' | 'veterinario' | 'administrador';
  especialidad: string;
  experiencia: number; // años
  salario: number;
  contacto: {
    telefono: string;
    direccion: string;
  };
  habilidades: string[];
  disponibilidad: 'tiempo_completo' | 'medio_tiempo' | 'temporal';
  calificacion: number; // 1-5 estrellas
  posicion: { fila: number; columna: number };
  // 🆕 CAMPOS MEJORADOS
  ubicacion: UbicacionGeodata;
  movilidad: MovilidadLogistica;
  cobertura_geografica: string[]; // Areas que puede atender
  trabajadores_backup: string[]; // Reemplazos en emergencias
}

interface Almacen {
  id: string;
  nombre: string;
  tipo: 'productos_agricolas' | 'semillas' | 'fertilizantes' | 'herramientas' | 'maquinaria';
  capacidad_total: number; // en toneladas o unidades
  capacidad_usada: number;
  ubicacion: UbicacionGeodata; // Reutilizando la interface común
  temperatura_control: boolean;
  humedad_control: boolean;
  items: {
    nombre: string;
    cantidad: number;
    unidad: string;
    fecha_ingreso: string;
    fecha_vencimiento?: string;
    valor: number;
  }[];
  posicion: { fila: number; columna: number };
  // 🆕 CAMPOS MEJORADOS
  movilidad: MovilidadLogistica;
  almacenes_backup: string[]; // Almacenes alternativos
  rutas_distribucion: string[]; // Rutas de salida de productos
}

interface Reservorio {
  id: string;
  nombre: string;
  tipo: 'natural' | 'artificial' | 'pozo' | 'rio' | 'lago';
  capacidad: number; // en litros
  nivel_actual: number; // porcentaje
  calidad_agua: 'excelente' | 'buena' | 'regular' | 'mala';
  sistemas_riego: string[];
  costo_mantenimiento: number;
  posicion: { fila: number; columna: number };
  // 🆕 CAMPOS MEJORADOS
  ubicacion: UbicacionGeodata;
  red_distribucion: string[]; // Parcelas que irriga
  fuentes_backup: string[]; // Fuentes alternativas de agua
  transporte_agua: 'gravedad' | 'bombeo' | 'mixto';
}

// Tipo para celdas de la granja
type TipoCelda = 'cultivo' | 'proveedor' | 'cliente' | 'trabajador' | 'almacen' | 'reservorio' | 'vacio';

interface CeldaGranja {
  id: string;
  tipo: TipoCelda;
  fila: number;
  columna: number;
  datos?: Cultivo | Proveedor | Cliente | Trabajador | Almacen | Reservorio;
}

// 🎨 CONFIGURACIÓN DE LA GRANJA
const FILAS_GRANJA = 6;
const COLUMNAS_GRANJA = 6;
const TOTAL_CELDAS = FILAS_GRANJA * COLUMNAS_GRANJA;

// 🌾 COMPONENTE PRINCIPAL
const MiGranjaVirtual: React.FC = () => {
  const { toast } = useToast();
  
  // Estados principales
  const [granja, setGranja] = useState<CeldaGranja[]>([]);
  const [celdaSeleccionada, setCeldaSeleccionada] = useState<CeldaGranja | null>(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoCelda>('vacio');
  const [vistaActual, setVistaActual] = useState<'granja' | 'estadisticas' | 'reportes'>('granja');

  // Inicializar granja vacía
  useEffect(() => {
    const granjaInicial: CeldaGranja[] = [];
    for (let fila = 0; fila < FILAS_GRANJA; fila++) {
      for (let columna = 0; columna < COLUMNAS_GRANJA; columna++) {
        granjaInicial.push({
          id: `celda-${fila}-${columna}`,
          tipo: 'vacio',
          fila,
          columna
        });
      }
    }
    setGranja(granjaInicial);  }, []);

  // 📚 DATOS PARA EL SISTEMA DE CONSEJOS Y GUÍAS
  const consejos = {
    cultivos_andinos: {
      titulo: "🌾 Cultivos Andinos",
      items: [
        {
          tipo: "papa",
          emoji: "🥔",
          consejo: "Las papas nativas se adaptan mejor a altitudes entre 3,500-4,200 msnm. Planta en surcos separados 80cm.",
          temporada: "Oct-Nov"
        },
        {
          tipo: "quinua",
          emoji: "🌾",
          consejo: "La quinua requiere suelos bien drenados. Evita el encharcamiento durante la floración.",
          temporada: "Set-Oct"
        },
        {
          tipo: "maiz",
          emoji: "🌽",
          consejo: "El maíz amiláceo prospera entre 2,800-3,500 msnm. Asocia con frijoles para mejor nutrición del suelo.",
          temporada: "Oct-Dic"
        },
        {
          tipo: "habas",
          emoji: "🫘",
          consejo: "Las habas fijan nitrógeno. Plantarlas mejora la fertilidad del suelo para siguientes cultivos.",
          temporada: "Mar-Abr"
        }
      ]
    },
    planificacion: {
      titulo: "📋 Planificación Agrícola",
      items: [
        {
          tipo: "rotacion",
          emoji: "🔄",
          consejo: "Rota cultivos cada temporada: papa → quinua → habas → descanso. Mantiene la fertilidad del suelo.",
          temporada: "Todo el año"
        },
        {
          tipo: "calendario",
          emoji: "📅",
          consejo: "Sigue el calendario lunar andino: siembra en luna nueva para cultivos de hoja, luna llena para tubérculos.",
          temporada: "Según lunar"
        },
        {
          tipo: "diversificacion",
          emoji: "🌱",
          consejo: "Diversifica cultivos para reducir riesgos. Nunca dependas de un solo cultivo principal.",
          temporada: "Todo el año"
        }
      ]
    },
    infraestructura: {
      titulo: "🏗️ Infraestructura",
      items: [
        {
          tipo: "terrazas",
          emoji: "🏔️",
          consejo: "Construye terrazas en pendientes mayores a 15%. Previene erosión y optimiza el riego.",
          temporada: "May-Ago"
        },
        {
          tipo: "riego",
          emoji: "💧",
          consejo: "Implementa riego por aspersión en cultivos de cobertura y por goteo en cultivos en hileras.",
          temporada: "Todo el año"
        },
        {
          tipo: "almacenes",
          emoji: "🏭",
          consejo: "Almacenes elevados y ventilados conservan mejor los productos. Usa tarimas para evitar humedad.",
          temporada: "Post-cosecha"
        }
      ]
    },
    mercadeo: {
      titulo: "💰 Mercadeo",
      items: [
        {
          tipo: "cooperativas",
          emoji: "🤝",
          consejo: "Únete a cooperativas locales para mejor poder de negociación y acceso a mercados.",
          temporada: "Todo el año"
        },
        {
          tipo: "valor_agregado",
          emoji: "⚡",
          consejo: "Procesa productos (papa seca, quinua perlada) para aumentar el valor de venta.",
          temporada: "Post-cosecha"
        },
        {
          tipo: "mercados",
          emoji: "🏪",
          consejo: "Diversifica canales: mercados locales, ferias regionales y venta directa al consumidor.",
          temporada: "Todo el año"
        }
      ]
    },
    clima: {
      titulo: "🌤️ Adaptación Climática",
      items: [
        {
          tipo: "heladas",
          emoji: "❄️",
          consejo: "Usa mantas térmicas o riego por aspersión durante heladas. Planta variedades resistentes.",
          temporada: "Jun-Ago"
        },
        {
          tipo: "sequia",
          emoji: "☀️",
          consejo: "Implementa mulch orgánico para retener humedad. Cultiva variedades tolerantes a sequía.",
          temporada: "May-Set"
        },
        {
          tipo: "lluvias",
          emoji: "🌧️",
          consejo: "Mejora drenaje con zanjas. Siembra cultivos de cobertura para proteger el suelo.",
          temporada: "Nov-Mar"
        }
      ]
    }
  };

  const elementos = [
    {
      emoji: "🌱",
      titulo: "Cultivos",
      descripcion: "Plantas y cultivos que forman la base de tu producción agrícola",
      usos: [
        "Selecciona variedades adaptadas a tu altitud y clima",
        "Planifica rotaciones para mantener fertilidad del suelo",
        "Asocia cultivos complementarios (maíz + frijol)",
        "Monitorea etapas de crecimiento y necesidades hídricas"
      ],
      consejos: [
        "Las papas nativas son más resistentes que las comerciales",
        "La quinua requiere suelos bien drenados",
        "Asocia leguminosas para fijar nitrógeno",
        "Usa semillas certificadas para mejor rendimiento"
      ]
    },
    {
      emoji: "🏪",
      titulo: "Proveedores",
      descripcion: "Red de proveedores de insumos, semillas, fertilizantes y herramientas",
      usos: [
        "Registra proveedores confiables de tu región",
        "Compara precios y calidad de productos",
        "Establece acuerdos de pago y entrega",
        "Mantén contactos de emergencia para insumos críticos"
      ],
      consejos: [
        "Diversifica proveedores para reducir riesgos",
        "Negocia mejores precios por volumen",
        "Verifica certificaciones de productos orgánicos",
        "Mantén buenas relaciones para obtener crédito"
      ]
    },
    {
      emoji: "👥",
      titulo: "Clientes",
      descripcion: "Red de compradores, distribuidores y mercados para tus productos",
      usos: [
        "Identifica mercados objetivo para cada cultivo",
        "Negocia contratos de venta anticipada",
        "Desarrolla relaciones de largo plazo",
        "Diversifica canales de comercialización"
      ],
      consejos: [
        "Ofrece productos de calidad consistente",
        "Cumple siempre con fechas de entrega acordadas",
        "Investiga precios de mercado regularmente",
        "Considera certificaciones orgánicas para mejor precio"
      ]
    },
    {
      emoji: "👨‍🌾",
      titulo: "Personal",
      descripcion: "Trabajadores, especialistas y personal de apoyo para las operaciones",
      usos: [
        "Planifica mano de obra según calendario agrícola",
        "Capacita en técnicas agrícolas modernas",
        "Asigna responsabilidades específicas por área",
        "Implementa medidas de seguridad laboral"
      ],
      consejos: [
        "Invierte en capacitación técnica",
        "Reconoce y premia el buen desempeño",
        "Mantén comunicación clara sobre objetivos",
        "Proporciona herramientas adecuadas"
      ]
    },
    {
      emoji: "🏭",
      titulo: "Almacenes",
      descripcion: "Espacios para almacenar productos, insumos y herramientas",
      usos: [
        "Almacena productos post-cosecha adecuadamente",
        "Mantén inventarios de insumos y herramientas",
        "Controla temperatura y humedad",
        "Implementa sistema de rotación PEPS"
      ],
      consejos: [
        "Ventilación adecuada previene hongos",
        "Usa tarimas para evitar humedad del suelo",
        "Mantén registro de entradas y salidas",
        "Separa productos por tipo y calidad"
      ]
    },
    {
      emoji: "💧",
      titulo: "Reservorios",
      descripcion: "Fuentes y sistemas de almacenamiento de agua para riego",
      usos: [
        "Almacena agua de lluvia en época húmeda",
        "Instala sistemas de riego eficientes",
        "Monitorea calidad del agua regularmente",
        "Planifica distribución según necesidades de cultivos"
      ],
      consejos: [
        "Cubre reservorios para evitar evaporación",
        "Instala filtros para mejorar calidad",
        "Usa riego por goteo para ahorrar agua",
        "Mantén registro de niveles de agua"
      ]
    }
  ];

  const indicadores = [
    {
      nombre: "Temperatura",
      valor: "18°C",
      estado: "normal",
      descripcion: "Ideal para cultivos andinos",
      icono: <Thermometer className="h-6 w-6 text-blue-500" />
    },
    {
      nombre: "Humedad",
      valor: "65%",
      estado: "normal",
      descripcion: "Nivel adecuado",
      icono: <Droplets className="h-6 w-6 text-blue-400" />
    },
    {
      nombre: "Viento",
      valor: "12 km/h",
      estado: "normal",
      descripcion: "Viento moderado",
      icono: <Wind className="h-6 w-6 text-gray-500" />
    },
    {
      nombre: "UV",
      valor: "Alto",
      estado: "alerta",
      descripcion: "Protección necesaria",
      icono: <Sun className="h-6 w-6 text-orange-500" />
    }
  ];

  const alertasActivas = [
    {
      tipo: "helada",
      nivel: "medio",
      mensaje: "Posibles heladas entre las 02:00 y 06:00 hrs. Temperaturas pueden descender hasta -2°C.",
      accion: "Cubre cultivos sensibles y activa riego por aspersión"
    },
    {
      tipo: "viento",
      nivel: "bajo",
      mensaje: "Vientos de hasta 25 km/h esperados esta tarde.",
      accion: "Refuerza tutores en cultivos altos"
    }
  ];

  // 🎨 FUNCIONES AUXILIARES PARA COLORES Y ESTILOS
  const getColorByEstado = (estado: string) => {
    switch (estado) {
      case 'normal': return 'border-green-200 bg-green-50';
      case 'alerta': return 'border-orange-200 bg-orange-50';
      case 'critico': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getColorByNivel = (nivel: string) => {
    switch (nivel) {
      case 'bajo': return 'border-l-yellow-400 bg-yellow-50';
      case 'medio': return 'border-l-orange-400 bg-orange-50';
      case 'alto': return 'border-l-red-400 bg-red-50';
      default: return 'border-l-gray-400 bg-gray-50';
    }
  };

  // 🎯 FUNCIONES PARA MANEJAR LA GRANJA
  const manejarClickCelda = (celda: CeldaGranja) => {
    setCeldaSeleccionada(celda);
    setDialogoAbierto(true);
  };

  const actualizarCelda = (celdaId: string, tipo: TipoCelda, datos?: any) => {
    setGranja(prev => prev.map(celda => 
      celda.id === celdaId 
        ? { ...celda, tipo, datos }
        : celda
    ));
    setDialogoAbierto(false);
    toast({
      title: "¡Elemento agregado!",
      description: `Se ha agregado ${tipo} a tu granja virtual.`,
    });
  };  // 🎨 FUNCIÓN PARA OBTENER EL ESTILO VISUAL DE CADA CELDA (SIMPLIFICADA Y FUNCIONAL)
  const obtenerEstiloCelda = (celda: CeldaGranja) => {
    const estilosBase = "w-full h-24 border-2 rounded-lg smooth-hover cursor-pointer flex flex-col items-center justify-center text-center p-2 relative";
    
    switch (celda.tipo) {
      case 'cultivo':
        const cultivo = celda.datos as Cultivo;
        return {
          className: `${estilosBase} bg-gradient-to-br from-green-100 to-green-200 border-green-400 hover:from-green-200 hover:to-green-300`,
          icon: '🌱',
          emoji: obtenerEmojiCultivo(cultivo?.tipo || 'papa'),
          texto: cultivo?.nombre || 'Cultivo',
          subtexto: cultivo?.etapaCrecimiento || 'Nuevo'
        };
      
      case 'proveedor':
        const proveedor = celda.datos as Proveedor;
        return {
          className: `${estilosBase} bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 hover:from-blue-200 hover:to-blue-300`,
          icon: '🏪',
          emoji: obtenerEmojiProveedor(proveedor?.tipo || 'semillas'),
          texto: proveedor?.nombre || 'Proveedor',
          subtexto: proveedor?.tipo || 'Nuevo'
        };
      
      case 'cliente':
        const cliente = celda.datos as Cliente;
        return {
          className: `${estilosBase} bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400 hover:from-purple-200 hover:to-purple-300`,
          icon: '👥',
          emoji: obtenerEmojiCliente(cliente?.tipo || 'mayorista'),
          texto: cliente?.nombre || 'Cliente',
          subtexto: cliente?.tipo || 'Nuevo'
        };
      
      case 'trabajador':
        const trabajador = celda.datos as Trabajador;
        return {
          className: `${estilosBase} bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 hover:from-orange-200 hover:to-orange-300`,
          icon: '👨‍🌾',
          emoji: obtenerEmojiTrabajador(trabajador?.rol || 'agricultor'),
          texto: trabajador?.nombre || 'Trabajador',
          subtexto: trabajador?.rol || 'Nuevo'
        };
      
      case 'almacen':
        const almacen = celda.datos as Almacen;
        return {
          className: `${estilosBase} bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 hover:from-yellow-200 hover:to-yellow-300`,
          icon: '🏭',
          emoji: obtenerEmojiAlmacen(almacen?.tipo || 'productos_agricolas'),
          texto: almacen?.nombre || 'Almacén',
          subtexto: almacen?.tipo || 'Nuevo'
        };
      
      case 'reservorio':
        const reservorio = celda.datos as Reservorio;
        return {
          className: `${estilosBase} bg-gradient-to-br from-cyan-100 to-cyan-200 border-cyan-400 hover:from-cyan-200 hover:to-cyan-300`,
          icon: '💧',
          emoji: obtenerEmojiReservorio(reservorio?.tipo || 'artificial'),
          texto: reservorio?.nombre || 'Reservorio',
          subtexto: `${reservorio?.nivel_actual || 0}%`
        };
      
      default:
        return {
          className: `${estilosBase} bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:from-green-50 hover:to-green-100 hover:border-green-300 animate-gentle-pulse`,
          icon: '➕',
          emoji: '🌍',
          texto: 'Agregar',
          subtexto: 'Click aquí'
        };
    }
  };

  // 🎯 FUNCIONES PARA OBTENER EMOJIS ESPECÍFICOS
  const obtenerEmojiCultivo = (tipo: string) => {
    const emojis = {
      papa: '🥔', quinua: '🌾', maiz: '🌽', habas: '🫘', 
      oca: '🟣', ulluco: '🟡', cebada: '🌾', trigo: '🌾'
    };
    return emojis[tipo as keyof typeof emojis] || '🌱';
  };

  const obtenerEmojiProveedor = (tipo: string) => {
    const emojis = {
      semillas: '🌱', fertilizantes: '🧪', pesticidas: '🚫', 
      herramientas: '🔧', maquinaria: '🚜'
    };
    return emojis[tipo as keyof typeof emojis] || '🏪';
  };

  const obtenerEmojiCliente = (tipo: string) => {
    const emojis = {
      mayorista: '🏢', minorista: '🏪', restaurante: '🍽️', 
      mercado_local: '🏬', exportacion: '✈️'
    };
    return emojis[tipo as keyof typeof emojis] || '👥';
  };

  const obtenerEmojiTrabajador = (rol: string) => {
    const emojis = {
      agricultor: '👨‍🌾', operador_maquinaria: '👨‍🔧', supervisor: '👨‍💼', 
      veterinario: '👨‍⚕️', administrador: '👨‍💻'
    };
    return emojis[rol as keyof typeof emojis] || '👨‍🌾';
  };

  const obtenerEmojiAlmacen = (tipo: string) => {
    const emojis = {
      productos_agricolas: '📦', semillas: '🌱', fertilizantes: '🧪', 
      herramientas: '🔧', maquinaria: '🚜'
    };
    return emojis[tipo as keyof typeof emojis] || '🏭';
  };

  const obtenerEmojiReservorio = (tipo: string) => {
    const emojis = {
      natural: '🏞️', artificial: '🏗️', pozo: '🕳️', 
      rio: '🏞️', lago: '🏞️'
    };
    return emojis[tipo as keyof typeof emojis] || '💧';
  };

  // 📊 ESTADÍSTICAS DE LA GRANJA
  const calcularEstadisticas = () => {
    const cultivos = granja.filter(c => c.tipo === 'cultivo').length;
    const proveedores = granja.filter(c => c.tipo === 'proveedor').length;
    const clientes = granja.filter(c => c.tipo === 'cliente').length;
    const trabajadores = granja.filter(c => c.tipo === 'trabajador').length;
    const almacenes = granja.filter(c => c.tipo === 'almacen').length;
    const reservorios = granja.filter(c => c.tipo === 'reservorio').length;
    const ocupadas = granja.filter(c => c.tipo !== 'vacio').length;
    const vacias = granja.filter(c => c.tipo === 'vacio').length;

    return {
      cultivos, proveedores, clientes, trabajadores, 
      almacenes, reservorios, ocupadas, vacias,
      porcentajeOcupacion: ((ocupadas / TOTAL_CELDAS) * 100).toFixed(1)
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        
        {/* 🏆 HEADER CON TÍTULO Y ESTADÍSTICAS */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                🌱 MI GRANJA VIRTUAL
                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                  {stats.ocupadas}/{TOTAL_CELDAS} Parcelas
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">
                Tu simulador agrícola completo - Gestiona cultivos, proveedores, clientes y más
              </p>
            </div>
            
            {/* Navegación */}
            <div className="flex gap-2">
              <Button 
                variant={vistaActual === 'granja' ? 'default' : 'outline'}
                onClick={() => setVistaActual('granja')}
              >
                🌾 Granja
              </Button>
              <Button 
                variant={vistaActual === 'estadisticas' ? 'default' : 'outline'}
                onClick={() => setVistaActual('estadisticas')}
              >
                📊 Stats
              </Button>
              <Button 
                variant={vistaActual === 'reportes' ? 'default' : 'outline'}
                onClick={() => setVistaActual('reportes')}
              >
                📈 Reportes
              </Button>
            </div>
          </div>

          {/* 📊 ESTADÍSTICAS RÁPIDAS */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-6">
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">🌱</div>
                <div className="font-bold text-lg">{stats.cultivos}</div>
                <div className="text-xs text-gray-600">Cultivos</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">🏪</div>
                <div className="font-bold text-lg">{stats.proveedores}</div>
                <div className="text-xs text-gray-600">Proveedores</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">👥</div>
                <div className="font-bold text-lg">{stats.clientes}</div>
                <div className="text-xs text-gray-600">Clientes</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">👨‍🌾</div>
                <div className="font-bold text-lg">{stats.trabajadores}</div>
                <div className="text-xs text-gray-600">Personal</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">🏭</div>
                <div className="font-bold text-lg">{stats.almacenes}</div>
                <div className="text-xs text-gray-600">Almacenes</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">💧</div>
                <div className="font-bold text-lg">{stats.reservorios}</div>
                <div className="text-xs text-gray-600">Agua</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">📊</div>
                <div className="font-bold text-lg">{stats.porcentajeOcupacion}%</div>
                <div className="text-xs text-gray-600">Ocupación</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">🎯</div>
                <div className="font-bold text-lg">{stats.vacias}</div>
                <div className="text-xs text-gray-600">Disponibles</div>
              </CardContent>
            </Card>
          </div>
        </div>        {/* 🗺️ VISTA PRINCIPAL DE LA GRANJA */}
        {vistaActual === 'granja' && (
          <ResizablePanelGroup direction="horizontal" className="h-[600px] rounded-lg border">
            {/* Panel Izquierdo - Grid de la Granja */}
            <ResizablePanel defaultSize={70} minSize={50}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-6 w-6" />
                    Tu Granja Virtual ({FILAS_GRANJA}x{COLUMNAS_GRANJA})
                  </CardTitle>
                  <CardDescription>
                    Haz click en cualquier parcela para agregar cultivos, proveedores, clientes, trabajadores, almacenes o reservorios
                  </CardDescription>
                </CardHeader>                <CardContent className="h-[calc(100%-120px)] overflow-auto bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 p-4 rounded-lg relative">
                  {/* Partículas de fondo animadas */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-300 rounded-full animate-float opacity-60"></div>
                    <div className="absolute top-20 right-20 w-3 h-3 bg-lime-400 rounded-full animate-wiggle opacity-50"></div>
                    <div className="absolute bottom-20 left-20 w-1 h-1 bg-green-500 rounded-full animate-heartbeat opacity-70"></div>
                    <div className="absolute bottom-10 right-10 w-2 h-2 bg-emerald-400 rounded-full animate-float opacity-60"></div>
                  </div>
                  
                  {/* Grid de la granja con efectos visuales súper mejorados */}
                  <div 
                    className="grid gap-4 auto-rows-fr p-6 bg-gradient-to-br from-white/30 via-emerald-50/40 to-lime-50/30 backdrop-blur-xl rounded-3xl border-2 border-white/40 shadow-2xl relative overflow-hidden"
                    style={{ gridTemplateColumns: `repeat(${COLUMNAS_GRANJA}, 1fr)` }}
                  >
                    {/* Efecto de brillo de fondo que se mueve */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                    
                    {granja.map((celda, index) => {
                      const estilo = obtenerEstiloCelda(celda);
                      return (
                        <div
                          key={celda.id}
                          className={`${estilo.className} group relative`}
                          style={{ 
                            animationDelay: `${index * 80}ms`,
                            animation: 'slideInGlow 1s ease-out forwards'
                          }}
                          onClick={() => manejarClickCelda(celda)}
                        >
                          {/* Múltiples efectos de brillo y movimiento */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-full group-hover:translate-y-full delay-200"></div>
                          
                          {/* Emoji con múltiples efectos */}
                          <div className="text-4xl mb-2 transform group-hover:scale-150 group-hover:rotate-12 transition-all duration-500 drop-shadow-2xl filter group-hover:brightness-125">{estilo.emoji}</div>
                          
                          {/* Texto principal con efecto de neón */}
                          <div className="text-xs font-black text-white drop-shadow-lg group-hover:text-yellow-200 transition-colors duration-300">{estilo.texto}</div>
                          
                          {/* Subtexto con efectos mejorados */}
                          <div className="text-xs text-white/95 drop-shadow-md font-bold group-hover:text-yellow-100 transition-colors duration-300">{estilo.subtexto}</div>
                          
                          {/* Múltiples indicadores para elementos ocupados */}
                          {celda.tipo !== 'vacio' && (
                            <>
                              <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping shadow-lg"></div>
                              <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-300 rounded-full animate-pulse"></div>
                              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            </>
                          )}
                          
                          {/* Partículas que aparecen en hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
                            <div className="absolute bottom-2 right-2 w-1 h-1 bg-pink-300 rounded-full animate-ping delay-100"></div>
                            <div className="absolute top-2 right-8 w-1 h-1 bg-cyan-300 rounded-full animate-ping delay-200"></div>
                            <div className="absolute bottom-8 left-2 w-1 h-1 bg-purple-300 rounded-full animate-ping delay-300"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />            {/* Panel Derecho - Dashboard Súper Mejorado con Efectos Espectaculares */}
            <ResizablePanel defaultSize={30} minSize={25}>
              <Card className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-4 border-indigo-300 shadow-2xl relative overflow-hidden">
                {/* Partículas de fondo animadas en el dashboard */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-5 left-5 w-3 h-3 bg-blue-300 rounded-full animate-float opacity-40"></div>
                  <div className="absolute top-1/3 right-8 w-2 h-2 bg-indigo-400 rounded-full animate-wiggle opacity-50"></div>
                  <div className="absolute bottom-1/3 left-6 w-1 h-1 bg-purple-500 rounded-full animate-heartbeat opacity-60"></div>
                  <div className="absolute bottom-5 right-5 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-50"></div>
                </div>
                
                <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <CardTitle className="flex items-center gap-3 relative z-10">
                    <BarChart3 className="h-6 w-6 animate-spin" />
                    <span className="text-xl font-black">🌟 Dashboard Súper Granja</span>
                    <div className="ml-auto">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)] overflow-auto space-y-5 p-6 relative">
                  {/* Estadísticas Súper Mejoradas con Efectos Espectaculares */}
                  <div className="space-y-5">
                    {/* Cultivos - Efecto Arcoíris */}
                    <div className="bg-gradient-to-r from-emerald-400 via-green-500 to-lime-500 p-5 rounded-2xl text-white shadow-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-500 relative overflow-hidden group neon-glow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="flex items-center gap-3 font-black text-lg">
                          🌱 <span className="animate-wiggle">Cultivos</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <span className="font-black text-2xl drop-shadow-lg">{stats.cultivos}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.cultivos / TOTAL_CELDAS) * 100} className="mt-3 h-4 bg-white/20 rounded-full overflow-hidden" />
                      <div className="absolute top-2 right-2 text-2xl animate-heartbeat">✨</div>
                    </div>

                    {/* Proveedores - Efecto Océano */}
                    <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 p-5 rounded-2xl text-white shadow-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-500 relative overflow-hidden group neon-glow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="flex items-center gap-3 font-black text-lg">
                          🏪 <span className="animate-float">Proveedores</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <span className="font-black text-2xl drop-shadow-lg">{stats.proveedores}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.proveedores / TOTAL_CELDAS) * 100} className="mt-3 h-4 bg-white/20 rounded-full overflow-hidden" />
                      <div className="absolute top-2 right-2 text-2xl animate-wiggle">💫</div>
                    </div>

                    {/* Clientes - Efecto Galaxia */}
                    <div className="bg-gradient-to-r from-fuchsia-400 via-purple-500 to-violet-600 p-5 rounded-2xl text-white shadow-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-500 relative overflow-hidden group neon-glow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="flex items-center gap-3 font-black text-lg">
                          👥 <span className="animate-rainbow">Clientes</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <span className="font-black text-2xl drop-shadow-lg">{stats.clientes}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.clientes / TOTAL_CELDAS) * 100} className="mt-3 h-4 bg-white/20 rounded-full overflow-hidden" />
                      <div className="absolute top-2 right-2 text-2xl animate-heartbeat">🌟</div>
                    </div>

                    {/* Personal - Efecto Fuego */}
                    <div className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 p-5 rounded-2xl text-white shadow-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-500 relative overflow-hidden group neon-glow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="flex items-center gap-3 font-black text-lg">
                          👨‍🌾 <span className="animate-wiggle">Personal</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <span className="font-black text-2xl drop-shadow-lg">{stats.trabajadores}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.trabajadores / TOTAL_CELDAS) * 100} className="mt-3 h-4 bg-white/20 rounded-full overflow-hidden" />
                      <div className="absolute top-2 right-2 text-2xl animate-float">🔥</div>
                    </div>

                    {/* Almacenes - Efecto Dorado */}
                    <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 p-5 rounded-2xl text-white shadow-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-500 relative overflow-hidden group neon-glow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="flex items-center gap-3 font-black text-lg">
                          🏭 <span className="animate-glow">Almacenes</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <span className="font-black text-2xl drop-shadow-lg">{stats.almacenes}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.almacenes / TOTAL_CELDAS) * 100} className="mt-3 h-4 bg-white/20 rounded-full overflow-hidden" />
                      <div className="absolute top-2 right-2 text-2xl animate-heartbeat">💎</div>
                    </div>

                    {/* Reservorios - Efecto Cristal */}
                    <div className="bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 p-5 rounded-2xl text-white shadow-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-500 relative overflow-hidden group neon-glow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="flex items-center gap-3 font-black text-lg">
                          💧 <span className="animate-shimmer">Reservorios</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <span className="font-black text-2xl drop-shadow-lg">{stats.reservorios}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.reservorios / TOTAL_CELDAS) * 100} className="mt-3 h-4 bg-white/20 rounded-full overflow-hidden" />
                      <div className="absolute top-2 right-2 text-2xl animate-float">💧</div>
                    </div>

                    {/* Disponibles - Efecto Mágico */}
                    <div className="bg-gradient-to-r from-gray-400 via-slate-500 to-zinc-600 p-5 rounded-2xl text-white shadow-2xl transform hover:scale-110 hover:rotate-2 transition-all duration-500 relative overflow-hidden group neon-glow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="flex items-center gap-3 font-black text-lg">
                          🎯 <span className="animate-wiggle">Disponibles</span>                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <span className="font-black text-2xl drop-shadow-lg">{stats.vacias}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.vacias / TOTAL_CELDAS) * 100} className="mt-3 h-4 bg-white/20 rounded-full overflow-hidden" />
                      <div className="absolute top-2 right-2 text-2xl animate-wiggle">🎯</div>
                    </div>
                  </div>

                  {/* Información de Celda Seleccionada Súper Mejorada */}
                  {celdaSeleccionada && (
                    <div className="border-t-4 border-gradient-to-r from-indigo-500 to-purple-500 pt-6 mt-6 relative">
                      <div className="absolute -top-2 left-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        ✨ CELDA SELECCIONADA ✨
                      </div>
                      
                      <div className="bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 p-6 rounded-3xl border-4 border-indigo-300 shadow-2xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden group">
                        {/* Efectos de fondo animados */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                        <div className="absolute top-2 left-2 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-200"></div>
                        <div className="absolute top-2 right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-400"></div>
                        
                        <div className="text-center mb-6 relative z-10">
                          <div className="text-8xl mb-4 animate-bounce transform hover:scale-125 transition-transform duration-300 drop-shadow-2xl filter hover:brightness-125">
                            {obtenerEstiloCelda(celdaSeleccionada).emoji}
                          </div>
                          <div className="text-2xl font-black text-indigo-800 drop-shadow-lg animate-pulse">
                            {obtenerEstiloCelda(celdaSeleccionada).texto}
                          </div>
                          <div className="text-lg text-purple-600 font-bold mt-2 animate-wiggle">
                            {obtenerEstiloCelda(celdaSeleccionada).subtexto}
                          </div>
                        </div>
                        
                        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 text-sm space-y-3 border-2 border-white/50 relative z-10">
                          <div className="flex justify-between items-center">
                            <strong className="text-indigo-700">📍 Posición:</strong> 
                            <span className="bg-indigo-100 px-3 py-1 rounded-full font-bold text-indigo-800">
                              Fila {celdaSeleccionada.fila + 1}, Col {celdaSeleccionada.columna + 1}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <strong className="text-purple-700">🏷️ Tipo:</strong> 
                            <span className="bg-purple-100 px-3 py-1 rounded-full font-bold text-purple-800 capitalize">
                              {celdaSeleccionada.tipo}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <strong className="text-pink-700">⚡ Estado:</strong> 
                            <span className={`px-3 py-1 rounded-full font-bold ${celdaSeleccionada.datos ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {celdaSeleccionada.datos ? '🟢 Ocupada' : '🟡 Disponible'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Acciones Rápidas Súper Mejoradas */}
                  <div className="border-t-4 border-gradient-to-r from-emerald-500 to-cyan-500 pt-6 mt-6 relative">
                    <div className="absolute -top-2 left-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      🚀 ACCIONES RÁPIDAS
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <Button 
                        size="lg" 
                        className="w-full justify-start text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                        onClick={() => setVistaActual('estadisticas')}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
                        <BarChart3 className="h-5 w-5 mr-3 animate-spin" />
                        <span className="relative z-10">📊 Ver Estadísticas Completas</span>
                      </Button>
                      
                      <Button 
                        size="lg" 
                        className="w-full justify-start text-sm bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                        onClick={() => {
                          const primeraCeldaVacia = granja.find(c => c.tipo === 'vacio');
                          if (primeraCeldaVacia) manejarClickCelda(primeraCeldaVacia);
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
                        <Plus className="h-5 w-5 mr-3 animate-bounce" />
                        <span className="relative z-10">➕ Agregar Nuevo Elemento</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}

        {/* 📊 VISTA DE ESTADÍSTICAS */}
        {vistaActual === 'estadisticas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Elementos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      🌱 Cultivos
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={(stats.cultivos / TOTAL_CELDAS) * 100} className="w-20" />
                      <span className="font-medium">{stats.cultivos}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      🏪 Proveedores
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={(stats.proveedores / TOTAL_CELDAS) * 100} className="w-20" />
                      <span className="font-medium">{stats.proveedores}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      👥 Clientes
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={(stats.clientes / TOTAL_CELDAS) * 100} className="w-20" />
                      <span className="font-medium">{stats.clientes}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      👨‍🌾 Personal
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={(stats.trabajadores / TOTAL_CELDAS) * 100} className="w-20" />
                      <span className="font-medium">{stats.trabajadores}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{stats.porcentajeOcupacion}%</div>
                    <div className="text-sm text-gray-600">Ocupación Total</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{stats.ocupadas}</div>
                      <div className="text-xs text-gray-600">Parcelas Usadas</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-600">{stats.vacias}</div>
                      <div className="text-xs text-gray-600">Disponibles</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>

      {/* 🎯 DIÁLOGO PARA AGREGAR/EDITAR ELEMENTOS */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {celdaSeleccionada?.tipo === 'vacio' 
                ? `Agregar elemento en Parcela ${celdaSeleccionada?.fila + 1}-${celdaSeleccionada?.columna + 1}`
                : `Editar elemento en Parcela ${celdaSeleccionada?.fila! + 1}-${celdaSeleccionada?.columna! + 1}`
              }
            </DialogTitle>
          </DialogHeader>
          
          {celdaSeleccionada && (
            <FormularioElemento 
              celda={celdaSeleccionada}
              onGuardar={actualizarCelda}
              onCancelar={() => setDialogoAbierto(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 💡 SISTEMA DE CONSEJOS Y GUÍAS PARA AGRICULTORES */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            Consejos y Guías Agrícolas
          </CardTitle>
          <CardDescription>
            Sabiduría ancestral y técnicas modernas para la agricultura andina
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cultivos_andinos" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="cultivos_andinos">Cultivos</TabsTrigger>
              <TabsTrigger value="planificacion">Planificación</TabsTrigger>
              <TabsTrigger value="infraestructura">Infraestructura</TabsTrigger>
              <TabsTrigger value="mercadeo">Mercadeo</TabsTrigger>
              <TabsTrigger value="clima">Clima</TabsTrigger>
            </TabsList>
            
            {Object.entries(consejos).map(([key, categoria]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="grid gap-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                    {categoria.titulo}
                  </h3>
                  {categoria.items.map((item, index) => (
                    <Card key={index} className="smooth-hover">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{item.emoji}</div>
                          <div className="flex-1">
                            <div className="font-medium capitalize text-green-700">
                              {item.tipo.replace('_', ' ')}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.consejo}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Sun className="h-3 w-3 mr-1" />
                                {item.temporada}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* 🎯 GUÍA DE USO DE LA GRANJA VIRTUAL */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Guía de Uso - Granja Virtual
          </CardTitle>
          <CardDescription>
            Aprende a usar cada elemento para maximizar tu productividad agrícola
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {elementos.map((elemento, index) => (
              <Card key={index} className="smooth-hover">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{elemento.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-green-700 mb-2">
                        {elemento.titulo}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {elemento.descripcion}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-blue-700 mb-2 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Cómo usar:
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {elemento.usos.map((uso, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-500 text-xs mt-1">▸</span>
                                {uso}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm text-orange-700 mb-2 flex items-center gap-1">
                            <Lightbulb className="h-4 w-4" />
                            Consejos:
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {elemento.consejos.map((consejo, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-orange-500 text-xs mt-1">★</span>
                                {consejo}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 🌡️ INDICADORES CLIMÁTICOS Y ALERTAS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-6 w-6 text-orange-500" />
            Monitoreo Climático
          </CardTitle>
          <CardDescription>
            Indicadores en tiempo real y alertas para tu zona
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Indicadores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {indicadores.map((indicador, index) => (
              <Card key={index} className={`text-center ${getColorByEstado(indicador.estado)}`}>
                <CardContent className="p-3">
                  <div className="flex justify-center mb-2">
                    {indicador.icono}
                  </div>
                  <div className="font-bold text-lg">{indicador.valor}</div>
                  <div className="text-xs font-medium">{indicador.nombre}</div>
                  <div className="text-xs opacity-75">{indicador.descripcion}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alertas */}
          {alertasActivas.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas Activas
              </h3>
              <div className="space-y-3">
                {alertasActivas.map((alerta, index) => (
                  <Card key={index} className={`border-l-4 ${getColorByNivel(alerta.nivel)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium capitalize">
                            Alerta de {alerta.tipo} - Nivel {alerta.nivel}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {alerta.mensaje}
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Info className="h-3 w-3 mr-1" />
                              Acción recomendada: {alerta.accion}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// 📝 COMPONENTE PARA FORMULARIOS DE ELEMENTOS
interface FormularioElementoProps {
  celda: CeldaGranja;
  onGuardar: (celdaId: string, tipo: TipoCelda, datos?: any) => void;
  onCancelar: () => void;
}

const FormularioElemento: React.FC<FormularioElementoProps> = ({ celda, onGuardar, onCancelar }) => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoCelda>(celda.tipo !== 'vacio' ? celda.tipo : 'cultivo');
  const [formData, setFormData] = useState<any>({});

  const tiposDisponibles = [
    { value: 'cultivo', label: '🌱 Cultivo', descripcion: 'Plantas y cultivos agrícolas' },
    { value: 'proveedor', label: '🏪 Proveedor', descripcion: 'Proveedores de insumos y servicios' },
    { value: 'cliente', label: '👥 Cliente', descripcion: 'Compradores y distribuidores' },
    { value: 'trabajador', label: '👨‍🌾 Personal', descripcion: 'Trabajadores y empleados' },
    { value: 'almacen', label: '🏭 Almacén', descripcion: 'Almacenes y bodegas' },
    { value: 'reservorio', label: '💧 Reservorio', descripcion: 'Fuentes y almacenamiento de agua' },
  ];

  const manejarGuardar = () => {
    onGuardar(celda.id, tipoSeleccionado, formData);
  };

  return (
    <div className="space-y-6">
      {/* Selector de tipo */}
      {celda.tipo === 'vacio' && (
        <div>
          <Label className="text-base font-medium">Tipo de elemento a agregar</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {tiposDisponibles.map((tipo) => (
              <Card 
                key={tipo.value}
                className={`cursor-pointer transition-all ${
                  tipoSeleccionado === tipo.value 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setTipoSeleccionado(tipo.value as TipoCelda)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{tipo.label.split(' ')[0]}</div>
                  <div className="font-medium text-sm">{tipo.label.split(' ').slice(1).join(' ')}</div>
                  <div className="text-xs text-gray-500 mt-1">{tipo.descripcion}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Formularios específicos según el tipo */}
      <div className="mt-6">
        {tipoSeleccionado === 'cultivo' && (
          <FormularioCultivo formData={formData} setFormData={setFormData} />
        )}        {tipoSeleccionado === 'proveedor' && (
          <FormularioProveedorInteligente 
            formData={formData} 
            setFormData={setFormData}
            ubicacionesExistentes={[]} 
          />
        )}
        {tipoSeleccionado === 'cliente' && (
          <FormularioClienteInteligente 
            formData={formData} 
            setFormData={setFormData}
            ubicacionesExistentes={[]} 
          />
        )}
        {tipoSeleccionado === 'trabajador' && (
          <FormularioTrabajadorInteligente 
            formData={formData} 
            setFormData={setFormData}
            ubicacionesExistentes={[]} 
          />
        )}
        {tipoSeleccionado === 'almacen' && (
          <FormularioAlmacen formData={formData} setFormData={setFormData} />
        )}
        {tipoSeleccionado === 'reservorio' && (
          <FormularioReservorio formData={formData} setFormData={setFormData} />
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button onClick={manejarGuardar}>
          Guardar
        </Button>
      </div>
    </div>
  );
};

// 🌱 FORMULARIO PARA CULTIVOS - OPTIMIZADO PARA IA
const FormularioCultivo: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 6; // 🆕 Aumentamos a 6 pasos

  // 🤖 Función para evaluación automática de riesgo climático por IA
  const evaluarRiesgoClimaticoIA = (datos: any) => {
    // Simulación de IA que evalúa múltiples factores
    let puntajeRiesgo = 0;
    
    // Factores de riesgo por tipo de cultivo
    const riesgosPorCultivo = { papa: 0.3, quinua: 0.1, maiz: 0.2, habas: 0.2, oca: 0.4, ulluco: 0.3, cebada: 0.2, trigo: 0.2 };
    puntajeRiesgo += riesgosPorCultivo[datos.tipo] || 0.3;
    
    // Factores ambientales
    if (datos.tipoSuelo === 'arcilloso') puntajeRiesgo += 0.2;
    if (datos.exposicionSolar === 'parcial') puntajeRiesgo += 0.1;
    if (datos.fuenteAgua === 'lejos') puntajeRiesgo += 0.3;
    if (datos.ubicacionParcela === 'ladera') puntajeRiesgo += 0.2;
    
    // 🆕 Factores geográficos
    if (datos.accesibilidad === 'dificil') puntajeRiesgo += 0.3;
    if (datos.distancia_capital_km > 200) puntajeRiesgo += 0.2;
    if (datos.altitud > 4000) puntajeRiesgo += 0.2;
    
    // 🆕 Factores de movilidad
    if (datos.transporte_principal === 'publico') puntajeRiesgo += 0.2;
    if (datos.rutas_criticas?.length === 1) puntajeRiesgo += 0.3;
    if (datos.frecuencia_transporte === 'mensual') puntajeRiesgo += 0.2;
    
    // Factores de manejo
    if (datos.metodoRiego === 'manual') puntajeRiesgo += 0.1;
    if (datos.tipoFertilizante === 'quimico') puntajeRiesgo += 0.1;
    
    if (puntajeRiesgo < 0.3) return 'low';
    if (puntajeRiesgo < 0.6) return 'medium';
    return 'high';
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Paso 1: Información Básica del Cultivo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">🏷️ Nombre del cultivo *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Papa Huayro del Valle"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label htmlFor="tipo">🌱 Tipo de cultivo *</Label>
                <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger className="border-green-200">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="papa">🥔 Papa (Solanum tuberosum)</SelectItem>
                    <SelectItem value="quinua">🌾 Quinua (Chenopodium quinoa)</SelectItem>
                    <SelectItem value="maiz">🌽 Maíz (Zea mays)</SelectItem>
                    <SelectItem value="habas">🫘 Habas (Vicia faba)</SelectItem>
                    <SelectItem value="oca">🟣 Oca (Oxalis tuberosa)</SelectItem>
                    <SelectItem value="ulluco">🟡 Ulluco (Ullucus tuberosus)</SelectItem>
                    <SelectItem value="cebada">🌾 Cebada (Hordeum vulgare)</SelectItem>
                    <SelectItem value="trigo">🌾 Trigo (Triticum aestivum)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="variedad">🧬 Variedad específica *</Label>
                <Input
                  id="variedad"
                  value={formData.variedad || ''}
                  onChange={(e) => setFormData({ ...formData, variedad: e.target.value })}
                  placeholder="Ej: Huayro, Peruanita, Blanca, etc."
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label htmlFor="area">📏 Área plantada (hectáreas) *</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.area || ''}
                  onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
                  placeholder="Ej: 2.5"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaPlantacion">📅 Fecha de plantación *</Label>
                <Input
                  id="fechaPlantacion"
                  type="date"
                  value={formData.fechaPlantacion || ''}
                  onChange={(e) => setFormData({ ...formData, fechaPlantacion: e.target.value })}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label htmlFor="fechaCosechaEstimada">🗓️ Fecha estimada de cosecha *</Label>
                <Input
                  id="fechaCosechaEstimada"
                  type="date"
                  value={formData.fechaCosechaEstimada || ''}
                  onChange={(e) => setFormData({ ...formData, fechaCosechaEstimada: e.target.value })}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Paso 2: Sistema de Riego y Fertilización
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metodoRiego">💧 Método de riego *</Label>
                <Select value={formData.metodoRiego || ''} onValueChange={(value) => setFormData({ ...formData, metodoRiego: value })}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goteo">💧 Riego por goteo</SelectItem>
                    <SelectItem value="aspersion">🌧️ Riego por aspersión</SelectItem>
                    <SelectItem value="surcos">🌊 Riego por surcos</SelectItem>
                    <SelectItem value="manual">🪣 Riego manual</SelectItem>
                    <SelectItem value="lluvia">☔ Dependiente de lluvia</SelectItem>
                  </SelectContent>
                </Select>
                           </div>
              <div>
                <Label htmlFor="frecuenciaRiego">⏰ Frecuencia de riego</Label>
                <Select value={formData.frecuenciaRiego || ''} onValueChange={(value) => setFormData({ ...formData, frecuenciaRiego: value })}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="¿Cada cuánto riega?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">🗓️ Diario</SelectItem>
                    <SelectItem value="interdiario">📅 Interdiario (cada 2 días)</SelectItem>
                    <SelectItem value="semanal">📆 Semanal</SelectItem>
                    <SelectItem value="quincenal">📋 Quincenal</SelectItem>
                    <SelectItem value="segun_necesidad">🌡️ Según necesidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoFertilizante">🧪 Tipo de fertilizante *</Label>
                <Select value={formData.tipoFertilizante || ''} onValueChange={(value) => setFormData({ ...formData, tipoFertilizante: value })}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="Tipo de fertilizante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organico">🌿 Orgánico (compost, humus)</SelectItem>
                    <SelectItem value="quimico">⚗️ Químico (NPK, urea)</SelectItem>
                    <SelectItem value="mixto">🔄 Mixto (orgánico + químico)</SelectItem>
                    <SelectItem value="ninguno">❌ Sin fertilizante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="marcaFertilizante">🏷️ Marca/Tipo específico</Label>
                <Input
                  id="marcaFertilizante"
                  value={formData.marcaFertilizante || ''}
                  onChange={(e) => setFormData({ ...formData, marcaFertilizante: e.target.value })}
                  placeholder="Ej: Abonaza, NPK 20-20-20, etc."
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="frecuenciaFertilizacion">📊 Frecuencia de fertilización</Label>
              <Select value={formData.frecuenciaFertilizacion || ''} onValueChange={(value) => setFormData({ ...formData, frecuenciaFertilizacion: value })}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="¿Cada cuánto fertiliza?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">📅 Semanal</SelectItem>
                  <SelectItem value="quincenal">📋 Quincenal</SelectItem>
                  <SelectItem value="mensual">📆 Mensual</SelectItem>
                  <SelectItem value="estacional">🗓️ Por estación</SelectItem>
                  <SelectItem value="una_vez">1️⃣ Solo al plantar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Paso 3: Condiciones de la Parcela
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ubicacionParcela">🏔️ Ubicación de la parcela *</Label>
                <Select value={formData.ubicacionParcela || ''} onValueChange={(value) => setFormData({ ...formData, ubicacionParcela: value })}>
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="Ubicación topográfica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planicie">🌾 Planicie</SelectItem>
                    <SelectItem value="ladera">⛰️ Ladera</SelectItem>
                    <SelectItem value="valle">🏞️ Valle</SelectItem>
                    <SelectItem value="meseta">🏔️ Meseta</SelectItem>
                    <SelectItem value="terraza">🪜 Terraza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="exposicionSolar">☀️ Exposición solar *</Label>
                <Select value={formData.exposicionSolar || ''} onValueChange={(value) => setFormData({ ...formData, exposicionSolar: value })}>
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="Horas de sol directo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completa">☀️ Sol completo (6+ horas)</SelectItem>
                    <SelectItem value="parcial">🌤️ Sol parcial (3-6 horas)</SelectItem>
                    <SelectItem value="sombra">☁️ Mayormente sombra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoSuelo">🌍 Tipo de suelo *</Label>
                <Select value={formData.tipoSuelo || ''} onValueChange={(value) => setFormData({ ...formData, tipoSuelo: value })}>
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="Composición del suelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="franco">🌰 Franco (equilibrado)</SelectItem>
                    <SelectItem value="arcilloso">🧱 Arcilloso (pesado)</SelectItem>
                    <SelectItem value="arenoso">🏖️ Arenoso (ligero)</SelectItem>
                    <SelectItem value="limoso">💧 Limoso (fértil)</SelectItem>
                    <SelectItem value="rocoso">🪨 Rocoso (con piedras)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fuenteAgua">💧 Acceso a fuente de agua *</Label>
                <Select value={formData.fuenteAgua || ''} onValueChange={(value) => setFormData({ ...formData, fuenteAgua: value })}>
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="Cercanía del agua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muy_cerca">💧 Muy cerca (río/pozo)</SelectItem>
                    <SelectItem value="cerca">🚰 Cerca (caminata corta)</SelectItem>
                    <SelectItem value="lejos">🚶 Lejos (transporte necesario)</SelectItem>
                    <SelectItem value="lluvia_solo">☔ Solo lluvia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="altitud">🏔️ Altitud aproximada (msnm)</Label>
              <Input
                id="altitud"
                type="number"
                min="0"
                value={formData.altitud || ''}
                onChange={(e) => setFormData({ ...formData, altitud: parseInt(e.target.value) })}
                placeholder="Ej: 3200 metros sobre el nivel del mar"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
        );      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Paso 4: Metas y Observaciones Agronómicas 📊
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rendimientoEstimado">📈 Rendimiento esperado (kg/ha)</Label>
                <Input
                  id="rendimientoEstimado"
                  type="number"
                  min="0"
                  value={formData.rendimientoEstimado || ''}
                  onChange={(e) => setFormData({ ...formData, rendimientoEstimado: parseFloat(e.target.value) })}
                  placeholder="Ej: 15000 kg por hectárea"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="costoInversion">💰 Inversión estimada (soles)</Label>
                <Input
                  id="costoInversion"
                  type="number"
                  min="0"
                  value={formData.costoInversion || ''}
                  onChange={(e) => setFormData({ ...formData, costoInversion: parseFloat(e.target.value) })}
                  placeholder="Ej: 5000 soles"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="etapaCrecimiento">🌱 Etapa actual de crecimiento</Label>
              <Select value={formData.etapaCrecimiento || ''} onValueChange={(value) => setFormData({ ...formData, etapaCrecimiento: value })}>
                <SelectTrigger className="border-purple-200">
                  <SelectValue placeholder="¿En qué etapa está?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planificacion">📋 En planificación</SelectItem>
                  <SelectItem value="semilla">🌰 Recién sembrado</SelectItem>
                  <SelectItem value="germinacion">🌱 Germinando</SelectItem>
                  <SelectItem value="crecimiento">🌿 En crecimiento</SelectItem>
                  <SelectItem value="floracion">🌸 Floreciendo</SelectItem>
                  <SelectItem value="fructificacion">🍃 Formando frutos</SelectItem>
                  <SelectItem value="cosecha">🌾 Listo para cosecha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notas">📝 Observaciones y notas importantes</Label>
              <Textarea
                id="notas"
                value={formData.notas || ''}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Anote problemas observados, tratamientos aplicados, condiciones especiales del suelo, plagas detectadas, etc."
                rows={4}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            {/* Vista previa de evaluación IA */}
            {formData.tipo && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-purple-50 rounded-lg border-l-4 border-purple-400">
                <h4 className="text-md font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  🤖 Evaluación Agronómica Preliminar
                </h4>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const riesgo = evaluarRiesgoClimaticoIA(formData);
                    const mensajes = {
                      'low': '🟢 Condiciones AGRONÓMICAS FAVORABLES - Manejo adecuado detectado',
                      'medium': '🟡 Condiciones NORMALES - Algunos aspectos mejorables',
                      'high': '🔴 ATENCIÓN REQUERIDA - Factores de riesgo agronómico identificados'
                    };
                    return (
                      <div className={`p-2 rounded ${riesgo === 'low' ? 'bg-green-100' : riesgo === 'medium' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                        {mensajes[riesgo]}
                      </div>
                    );
                  })()}
                  <p className="text-gray-600">
                    💡 Los siguientes pasos recopilarán datos geográficos y logísticos para completar 
                    el análisis integral de riesgo.
                  </p>
                </div>
              </div>
            )}
          </div>);

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Paso 5: Ubicación Geográfica Inteligente 🗺️
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="departamento">🏛️ Departamento *</Label>
                <Select value={formData.departamento || ''} onValueChange={(value) => setFormData({ ...formData, departamento: value })}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ancash">Ancash</SelectItem>
                    <SelectItem value="apurimac">Apurímac</SelectItem>
                    <SelectItem value="ayacucho">Ayacucho</SelectItem>
                    <SelectItem value="cajamarca">Cajamarca</SelectItem>
                    <SelectItem value="cusco">Cusco</SelectItem>
                    <SelectItem value="huancavelica">Huancavelica</SelectItem>
                    <SelectItem value="junin">Junín</SelectItem>
                    <SelectItem value="lima">Lima</SelectItem>
                    <SelectItem value="puno">Puno</SelectItem>
                    <SelectItem value="otros">Otros...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="provincia">🏘️ Provincia *</Label>
                <Input
                  id="provincia"
                  value={formData.provincia || ''}
                  onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                  placeholder="Ej: Huancayo"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="distrito">🏡 Distrito *</Label>
                <Input
                  id="distrito"
                  value={formData.distrito || ''}
                  onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
                  placeholder="Ej: El Tambo"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accesibilidad">🛣️ Accesibilidad *</Label>
                <Select value={formData.accesibilidad || ''} onValueChange={(value) => setFormData({ ...formData, accesibilidad: value })}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="Facilidad de acceso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">🛣️ Excelente (carretera asfaltada)</SelectItem>
                    <SelectItem value="buena">🚗 Buena (carretera afirmada)</SelectItem>
                    <SelectItem value="regular">🛤️ Regular (trocha carrozable)</SelectItem>
                    <SelectItem value="dificil">🥾 Difícil (solo a pie/caballo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="distancia_capital_km">📏 Distancia a capital provincial (km)</Label>
                <Input
                  id="distancia_capital_km"
                  type="number"
                  min="0"
                  value={formData.distancia_capital_km || ''}
                  onChange={(e) => setFormData({ ...formData, distancia_capital_km: parseInt(e.target.value) || 0 })}
                  placeholder="Ej: 25"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="carreteras_principales">🛣️ Carreteras principales de acceso</Label>
              <Input
                id="carreteras_principales"
                value={formData.carreteras_principales || ''}
                onChange={(e) => setFormData({ ...formData, carreteras_principales: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: PE-3N, Carretera Central, Vía Los Libertadores"
                className="border-blue-200 focus:border-blue-400"
              />
              <p className="text-sm text-gray-500 mt-1">💡 Separar con comas. Esto ayuda a evaluar riesgos de transporte.</p>
            </div>

            <div>
              <Label htmlFor="caracteristicas_geograficas">🏔️ Características geográficas</Label>
              <Input
                id="caracteristicas_geograficas"
                value={formData.caracteristicas_geograficas || ''}
                onChange={(e) => setFormData({ ...formData, caracteristicas_geograficas: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: montañoso, valle, cerca de río, zona sísmica"
                className="border-blue-200 focus:border-blue-400"
              />
              <p className="text-sm text-gray-500 mt-1">💡 Separar con comas. Ayuda a la IA a evaluar riesgos naturales.</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Paso 6: Movilidad y Logística Estratégica 🚛
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transporte_principal">🚐 Transporte principal *</Label>
                <Select value={formData.transporte_principal || ''} onValueChange={(value) => setFormData({ ...formData, transporte_principal: value })}>
                  <SelectTrigger className="border-indigo-200">
                    <SelectValue placeholder="Medio de transporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehiculo_propio">🚗 Vehículo propio</SelectItem>
                    <SelectItem value="contratado">🚛 Transporte contratado</SelectItem>
                    <SelectItem value="cooperativa">🤝 Cooperativa de transporte</SelectItem>
                    <SelectItem value="publico">🚌 Transporte público</SelectItem>
                    <SelectItem value="mixto">🔄 Mixto (combinado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="capacidad_carga_kg">📦 Capacidad de carga (kg)</Label>
                <Input
                  id="capacidad_carga_kg"
                  type="number"
                  min="0"
                  value={formData.capacidad_carga_kg || ''}
                  onChange={(e) => setFormData({ ...formData, capacidad_carga_kg: parseInt(e.target.value) })}
                  placeholder="Ej: 2000"
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frecuencia_transporte">⏰ Frecuencia de transporte *</Label>
                <Select value={formData.frecuencia_transporte || ''} onValueChange={(value) => setFormData({ ...formData, frecuencia_transporte: value })}>
                  <SelectTrigger className="border-indigo-200">
                    <SelectValue placeholder="¿Cada cuánto transporta?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">📅 Diario</SelectItem>
                    <SelectItem value="semanal">📆 Semanal</SelectItem>
                    <SelectItem value="quincenal">📋 Quincenal</SelectItem>
                    <SelectItem value="mensual">🗓️ Mensual</SelectItem>
                    <SelectItem value="por_demanda">🎯 Por demanda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="costos_transporte_mes">💰 Costos de transporte/mes (soles)</Label>
                <Input
                  id="costos_transporte_mes"
                  type="number"
                  min="0"
                  value={formData.costos_transporte_mes || ''}
                  onChange={(e) => setFormData({ ...formData, costos_transporte_mes: parseInt(e.target.value) })}
                  placeholder="Ej: 800"
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="vehiculos_disponibles">🚚 Vehículos disponibles</Label>
              <Input
                id="vehiculos_disponibles"
                value={formData.vehiculos_disponibles || ''}
                onChange={(e) => setFormData({ ...formData, vehiculos_disponibles: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: camioneta, camión, motocicleta, bicicleta"
                className="border-indigo-200 focus:border-indigo-400"
              />
              <p className="text-sm text-gray-500 mt-1">💡 Separar con comas. La IA evalúa versatilidad logística.</p>
            </div>

            <div>
              <Label htmlFor="rutas_criticas">⚠️ Rutas críticas (riesgo si se cierran)</Label>
              <Input
                id="rutas_criticas"
                value={formData.rutas_criticas || ''}
                onChange={(e) => setFormData({ ...formData, rutas_criticas: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: Puente Izcuchaca, Carretera a Huancayo"
                className="border-indigo-200 focus:border-indigo-400"
              />
              <p className="text-sm text-gray-500 mt-1">🚨 Identifica puntos únicos de falla en su cadena logística.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="backup_transporte">🔄 Plan B de transporte</Label>
                <Input
                  id="backup_transporte"
                  value={formData.backup_transporte || ''}
                  onChange={(e) => setFormData({ ...formData, backup_transporte: e.target.value })}
                  placeholder="Ej: Transporte público, cooperativa vecina"
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>
              <div>
                <Label htmlFor="mercados_destino">🎯 Mercados destino principales</Label>
                <Input
                  id="mercados_destino"
                  value={formData.mercados_destino || ''}
                  onChange={(e) => setFormData({ ...formData, mercados_destino: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="Ej: Mercado Mayorista, Lima, Huancayo"
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dependencias_criticas">🔗 Dependencias críticas para este cultivo</Label>
              <Textarea
                id="dependencias_criticas"
                value={formData.dependencias_criticas || ''}
                onChange={(e) => setFormData({ ...formData, dependencias_criticas: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: Proveedor único de semillas, electricidad para riego, combustible para transporte, técnico especializado"
                rows={3}
                className="border-indigo-200 focus:border-indigo-400"
              />
              <p className="text-sm text-gray-500 mt-1">🔍 La IA identificará riesgos de dependencia y sugerirá alternativas.</p>
            </div>

            {/* Vista final de evaluación IA con factores geográficos y logísticos */}
            {formData.tipo && formData.departamento && formData.transporte_principal && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-indigo-50 rounded-lg border-l-4 border-green-400">
                <h4 className="text-md font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  🤖 Evaluación Final IA - Análisis Integral
                </h4>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const riesgo = evaluarRiesgoClimaticoIA(formData);
                    const mensajes = {
                      'low': '🟢 RIESGO BAJO - Condiciones geográficas y logísticas favorables',
                      'medium': '🟡 RIESGO MEDIO - Monitorear dependencias críticas identificadas',
                      'high': '🔴 RIESGO ALTO - Múltiples factores de vulnerabilidad detectados'
                    };
                    const recomendaciones = {
                      'low': '✅ Operación viable. Considere expandir gradualmente.',
                      'medium': '⚠️ Implemente planes de contingencia para rutas críticas.',
                      'high': '🚨 Evalúe diversificar proveedores y rutas antes de proceder.'
                    };
                    return (
                      <div className="space-y-2">
                        <div className={`p-2 rounded ${riesgo === 'low' ? 'bg-green-100' : riesgo === 'medium' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                          {mensajes[riesgo]}
                        </div>
                        <div className="p-2 bg-blue-50 rounded">
                          <strong>💡 Recomendación:</strong> {recomendaciones[riesgo]}
                        </div>
                      </div>
                    );
                  })()}
                  <p className="text-gray-600">
                    🧠 La IA analizó factores agronómicos, geográficos, logísticos y de dependencias críticas 
                    para generar esta evaluación integral de riesgo.
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso mejorado */}
      <div className="bg-gradient-to-r from-green-400 to-teal-500 p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {[1, 2, 3, 4].map((paso, index) => (
              <div key={paso} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    paso === pasoActual
                      ? 'bg-white text-green-600 scale-110 shadow-lg'
                      : paso < pasoActual
                      ? 'bg-green-200 text-green-800 shadow-md'
                      : 'bg-green-100/30 text-white border-2 border-white/50'
                  }`}
                >
                  {paso < pasoActual ? '✓' : paso}
                </div>
                {index < 3 && (
                  <div className={`w-8 h-1 mx-2 rounded-full transition-all duration-300 ${
                    paso < pasoActual ? 'bg-green-200' : 'bg-white/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-white font-medium">
            Paso {pasoActual} de {totalPasos}
          </div>
        </div>
        
        <div className="text-white/90 text-sm">
          {pasoActual === 1 && '👤 Información personal y laboral del trabajador'}
          {pasoActual === 2 && '📍 Ubicación y datos de movilidad'}
          {pasoActual === 3 && '⚙️ Condiciones laborales y beneficios'}
          {pasoActual === 4 && '🚨 Emergencias y análisis final'}
        </div>
      </div>

      {/* Contenido del paso actual */}
      {renderPaso()}

      {/* Navegación mejorada */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={() => setPasoActual(Math.max(1, pasoActual - 1))}
          disabled={pasoActual === 1}
          className="flex items-center gap-2 px-6 py-2 border-green-300 text-green-600 hover:bg-green-50"
        >
          ← Anterior
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setPasoActual(Math.min(totalPasos, pasoActual + 1))}
            disabled={pasoActual === totalPasos}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
          >
            {pasoActual === totalPasos ? 'Finalizar' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 🏪 FORMULARIO PARA PROVEEDORES (Legacy - mantener compatibilidad)
const FormularioProveedor: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del proveedor</Label>
          <Input
            id="nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: AgroSemillas del Norte"
          />
        </div>
        <div>
          <Label htmlFor="tipo">Tipo de proveedor</Label>
          <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semillas">🌱 Semillas</SelectItem>
              <SelectItem value="fertilizantes">🧪 Fertilizantes</SelectItem>
              <SelectItem value="pesticidas">🚫 Pesticidas</SelectItem>
              <SelectItem value="herramientas">🔧 Herramientas</SelectItem>
              <SelectItem value="maquinaria">🚜 Maquinaria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Información de contacto</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Teléfono"
            value={formData.telefono || ''}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <Input
          placeholder="Dirección"
          value={formData.direccion || ''}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="confiabilidad">Calificación (1-5 estrellas)</Label>
          <Select value={formData.confiabilidad?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, confiabilidad: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue placeholder="Calificar proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">⭐ 1 estrella</SelectItem>
              <SelectItem value="2">⭐⭐ 2 estrellas</SelectItem>
              <SelectItem value="3">⭐⭐⭐ 3 estrellas</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ 4 estrellas</SelectItem>
              <SelectItem value="5">⭐⭐⭐⭐⭐ 5 estrellas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tiempoEntrega">Tiempo de entrega</Label>
          <Input
            id="tiempoEntrega"
            value={formData.tiempoEntrega || ''}
            onChange={(e) => setFormData({ ...formData, tiempoEntrega: e.target.value })}
            placeholder="Ej: 2-3 días hábiles"
          />
        </div>
      </div>
    </div>
  );
};

// 👥 FORMULARIO PARA CLIENTES
const FormularioCliente: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del cliente</Label>
          <Input
            id="nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Mercado Central de Lima"
          />
        </div>
        <div>
          <Label htmlFor="tipo">Tipo de cliente</Label>
          <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mayorista">🏢 Mayorista</SelectItem>
              <SelectItem value="minorista">🏪 Minorista</SelectItem>
              <SelectItem value="restaurante">🍽️ Restaurante</SelectItem>
              <SelectItem value="mercado_local">🏬 Mercado Local</SelectItem>
              <SelectItem value="exportacion">✈️ Exportación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Información de contacto</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Teléfono"
            value={formData.telefono || ''}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <Input
          placeholder="Dirección"
          value={formData.direccion || ''}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="precio_promedio">Precio promedio de compra (S/)</Label>
          <Input
            id="precio_promedio"
            type="number"
            step="0.01"
            value={formData.precio_promedio || ''}
            onChange={(e) => setFormData({ ...formData, precio_promedio: parseFloat(e.target.value) })}
            placeholder="Ej: 2.50"
          />
        </div>
        <div>
          <Label htmlFor="volumen_compra">Volumen de compra típico</Label>
          <Input
            id="volumen_compra"
            value={formData.volumen_compra || ''}
            onChange={(e) => setFormData({ ...formData, volumen_compra: e.target.value })}
            placeholder="Ej: 500 kg por semana"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="frecuencia">Frecuencia de compra</Label>
          <Select value={formData.frecuencia || ''} onValueChange={(value) => setFormData({ ...formData, frecuencia: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diaria">📅 Diaria</SelectItem>
              <SelectItem value="semanal">🗓️ Semanal</SelectItem>
              <SelectItem value="quincenal">📆 Quincenal</SelectItem>
              <SelectItem value="mensual">🗓️ Mensual</SelectItem>
              <SelectItem value="estacional">🍂 Estacional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="calificacion">Calificación del cliente</Label>
          <Select value={formData.calificacion?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, calificacion: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue placeholder="Calificar cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">⭐ 1 estrella</SelectItem>
              <SelectItem value="2">⭐⭐ 2 estrellas</SelectItem>
              <SelectItem value="3">⭐⭐⭐ 3 estrellas</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ 4 estrellas</SelectItem>
              <SelectItem value="5">⭐⭐⭐⭐⭐ 5 estrellas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

// 👨‍🌾 FORMULARIO PARA TRABAJADORES
const FormularioTrabajador: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Juan Carlos"
          />
        </div>
        <div>
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            value={formData.apellidos || ''}
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            placeholder="Ej: Mamani Condori"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rol">Rol/Puesto</Label>
          <Select value={formData.rol || ''} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agricultor">👨‍🌾 Agricultor</SelectItem>
              <SelectItem value="operador_maquinaria">👨‍🔧 Operador de Maquinaria</SelectItem>
              <SelectItem value="supervisor">👨‍💼 Supervisor</SelectItem>
              <SelectItem value="veterinario">👨‍⚕️ Veterinario</SelectItem>
              <SelectItem value="administrador">👨‍💻 Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="especialidad">Especialidad</Label>
          <Input
            id="especialidad"
            value={formData.especialidad || ''}
            onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
            placeholder="Ej: Cultivo de papas, Riego tecnificado"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="experiencia">Años de experiencia</Label>
          <Input
            id="experiencia"
            type="number"
            value={formData.experiencia || ''}
            onChange={(e) => setFormData({ ...formData, experiencia: parseInt(e.target.value) })}
            placeholder="Ej: 5"
          />
        </div>
        <div>
          <Label htmlFor="salario">Salario mensual (S/)</Label>
          <Input
            id="salario"
            type="number"
            value={formData.salario || ''}
            onChange={(e) => setFormData({ ...formData, salario: parseFloat(e.target.value) })}
            placeholder="Ej: 1200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono || ''}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="Ej: +51 987 654 321"
          />
        </div>
        <div>
          <Label htmlFor="disponibilidad">Disponibilidad</Label>
          <Select value={formData.disponibilidad || ''} onValueChange={(value) => setFormData({ ...formData, disponibilidad: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar disponibilidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiempo_completo">⏰ Tiempo Completo</SelectItem>
              <SelectItem value="medio_tiempo">🕐 Medio Tiempo</SelectItem>
              <SelectItem value="temporal">📅 Temporal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          value={formData.direccion || ''}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          placeholder="Dirección completa"
        />
      </div>
    </div>
  );
};

// 🏭 FORMULARIO PARA ALMACENES
const FormularioAlmacen: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
  const [showMapSelector, setShowMapSelector] = useState(false);

  const handleLocationSelect = (location: any) => {
    setFormData({ 
      ...formData, 
      ubicacion: {
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        coordenadas: { lat: location.lat, lng: location.lng },
        altitud: location.altitude || 0,
        caracteristicas_geograficas: location.climateData ? [location.climateData.region] : [],
        accesibilidad: 'buena',
        carreteras_principales: [],
        distancia_capital_km: 0
      }
    });
    setShowMapSelector(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del almacén</Label>
          <Input
            id="nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Almacén Principal"
          />
        </div>
        <div>
          <Label htmlFor="tipo">Tipo de almacén</Label>
          <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="productos_agricolas">📦 Productos Agrícolas</SelectItem>
              <SelectItem value="semillas">🌱 Semillas</SelectItem>
              <SelectItem value="fertilizantes">🧪 Fertilizantes</SelectItem>
              <SelectItem value="herramientas">🔧 Herramientas</SelectItem>
              <SelectItem value="maquinaria">🚜 Maquinaria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacidad_total">Capacidad total (toneladas)</Label>
          <Input
            id="capacidad_total"
            type="number"
            step="0.1"
            value={formData.capacidad_total || ''}
            onChange={(e) => setFormData({ ...formData, capacidad_total: parseFloat(e.target.value) })}
            placeholder="Ej: 50"
          />
        </div>
        <div>
          <Label htmlFor="capacidad_usada">Capacidad usada (toneladas)</Label>
          <Input
            id="capacidad_usada"
            type="number"
            step="0.1"
            value={formData.capacidad_usada || ''}
            onChange={(e) => setFormData({ ...formData, capacidad_usada: parseFloat(e.target.value) })}
            placeholder="Ej: 25"
          />
        </div>
      </div>

      {/* Ubicación con MapSelector */}
      <div>
        <Label>📍 Ubicación del Almacén</Label>
        <div className="mt-2 space-y-2">
          {formData.ubicacion && formData.ubicacion.departamento ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">
                    {formData.ubicacion.distrito}, {formData.ubicacion.provincia}
                  </p>
                  <p className="text-sm text-green-600">
                    {formData.ubicacion.departamento}
                  </p>
                  {formData.ubicacion.coordenadas && (
                    <p className="text-xs text-green-500">
                      Lat: {formData.ubicacion.coordenadas.lat.toFixed(4)}, 
                      Lng: {formData.ubicacion.coordenadas.lng.toFixed(4)}
                    </p>
                  )}
                </div>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowMapSelector(true)}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Cambiar
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              type="button"
              variant="outline" 
              className="w-full justify-center"
              onClick={() => setShowMapSelector(true)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Seleccionar Ubicación en el Mapa
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="temperatura_control"
            checked={formData.temperatura_control || false}
            onChange={(e) => setFormData({ ...formData, temperatura_control: e.target.checked })}
          />
          <Label htmlFor="temperatura_control">🌡️ Control de temperatura</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="humedad_control"
            checked={formData.humedad_control || false}
            onChange={(e) => setFormData({ ...formData, humedad_control: e.target.checked })}
          />
          <Label htmlFor="humedad_control">💧 Control de humedad</Label>
        </div>
      </div>

      {/* MapSelector Modal */}
      <MapSelector
        isOpen={showMapSelector}
        onClose={() => setShowMapSelector(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={formData.ubicacion?.coordenadas ? {
          lat: formData.ubicacion.coordenadas.lat,
          lng: formData.ubicacion.coordenadas.lng,
          address: `${formData.ubicacion.distrito}, ${formData.ubicacion.provincia}, ${formData.ubicacion.departamento}`,
          country: 'Peru',
          department: formData.ubicacion.departamento,
          province: formData.ubicacion.provincia,
          district: formData.ubicacion.distrito
        } : undefined}
      />
    </div>
  );
};

// 💧 FORMULARIO PARA RESERVORIOS
const FormularioReservorio: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
  const [showMapSelector, setShowMapSelector] = useState(false);

  const handleLocationSelect = (location: any) => {
    setFormData({ 
      ...formData, 
      ubicacion: {
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        coordenadas: { lat: location.lat, lng: location.lng },
        altitud: location.altitude || 0,
        caracteristicas_geograficas: location.climateData ? [location.climateData.region] : [],
        accesibilidad: 'buena',
        carreteras_principales: [],
        distancia_capital_km: 0
      }
    });
    setShowMapSelector(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del reservorio</Label>
          <Input
            id="nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Reservorio Principal"
          />
        </div>
        <div>
          <Label htmlFor="tipo">Tipo de fuente</Label>
          <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="natural">🏞️ Natural</SelectItem>
              <SelectItem value="artificial">🏗️ Artificial</SelectItem>
              <SelectItem value="pozo">🕳️ Pozo</SelectItem>
              <SelectItem value="rio">🏞️ Río</SelectItem>
              <SelectItem value="lago">🏞️ Lago</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ubicación con MapSelector */}
      <div>
        <Label>📍 Ubicación del Reservorio</Label>
        <div className="mt-2 space-y-2">
          {formData.ubicacion && formData.ubicacion.departamento ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-800">
                    {formData.ubicacion.distrito}, {formData.ubicacion.provincia}
                  </p>
                  <p className="text-sm text-blue-600">
                    {formData.ubicacion.departamento}
                  </p>
                  {formData.ubicacion.coordenadas && (
                    <p className="text-xs text-blue-500">
                      Lat: {formData.ubicacion.coordenadas.lat.toFixed(4)}, 
                      Lng: {formData.ubicacion.coordenadas.lng.toFixed(4)}
                    </p>
                  )}
                  {formData.ubicacion.altitud && (
                    <p className="text-xs text-blue-500">
                      Altitud: {formData.ubicacion.altitud}m
                    </p>
                  )}
                </div>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowMapSelector(true)}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Cambiar
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              type="button"
              variant="outline" 
              className="w-full justify-center"
              onClick={() => setShowMapSelector(true)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Seleccionar Ubicación en el Mapa
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacidad">Capacidad (litros)</Label>
          <Input
            id="capacidad"
            type="number"
            value={formData.capacidad || ''}
            onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
            placeholder="Ej: 50000"
          />
        </div>
        <div>
          <Label htmlFor="nivel_actual">Nivel actual (%)</Label>
          <Input
            id="nivel_actual"
            type="number"
            min="0"
            max="100"
            value={formData.nivel_actual || ''}
            onChange={(e) => setFormData({ ...formData, nivel_actual: parseInt(e.target.value) })}
            placeholder="Ej: 75"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="calidad_agua">Calidad del agua</Label>
          <Select value={formData.calidad_agua || ''} onValueChange={(value) => setFormData({ ...formData, calidad_agua: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar calidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excelente">🟢 Excelente</SelectItem>
              <SelectItem value="buena">🔵 Buena</SelectItem>
              <SelectItem value="regular">🟡 Regular</SelectItem>
              <SelectItem value="mala">🔴 Mala</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="costo_mantenimiento">Costo mantenimiento mensual (S/)</Label>
          <Input
            id="costo_mantenimiento"
            type="number"
            step="0.01"
            value={formData.costo_mantenimiento || ''}
            onChange={(e) => setFormData({ ...formData, costo_mantenimiento: parseFloat(e.target.value) })}
            placeholder="Ej: 500"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="sistemas_riego">Sistemas de riego conectados</Label>
        <Textarea
          id="sistemas_riego"
          value={formData.sistemas_riego || ''}
          onChange={(e) => setFormData({ ...formData, sistemas_riego: e.target.value })}
          placeholder="Ej: Goteo sector A, Aspersión sector B, etc."
          rows={3}
        />
      </div>

      {/* MapSelector Modal */}
      <MapSelector
        isOpen={showMapSelector}
        onClose={() => setShowMapSelector(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={formData.ubicacion?.coordenadas ? {
          lat: formData.ubicacion.coordenadas.lat,
          lng: formData.ubicacion.coordenadas.lng,
          address: `${formData.ubicacion.distrito}, ${formData.ubicacion.provincia}, ${formData.ubicacion.departamento}`,
          country: 'Peru',
          department: formData.ubicacion.departamento,
          province: formData.ubicacion.provincia,
          district: formData.ubicacion.distrito
        } : undefined}
      />
    </div>
  );
};

export default MiGranjaVirtual;
