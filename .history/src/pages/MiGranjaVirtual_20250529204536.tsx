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

// Clean, professional styles
const customStyles = `
  .professional-border {
    border: 1px solid #d1d5db;
    background: #ffffff;
  }
  
  .professional-highlight {
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border: 1px solid #e5e7eb;
  }
  
  .clean-label::before {
    content: '';
  }
`;

// Inyectar estilos personalizados
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}
import {
  Sprout, Users, Store, Truck, Package, Droplets, Warehouse, 
  Coins, TrendingUp, Calendar, MapPin, Phone, Mail, Star,
  Plus, Edit, Trash2, Eye, Settings, BarChart3, Thermometer,
  CloudRain, Sun, Wind, Leaf, Zap, Target, Clock, Activity,
  User, Briefcase, GraduationCap, Car, Heart, Shield, 
  AlertTriangle, Brain, Link, Network
} from 'lucide-react';

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
    setGranja(granjaInicial);
  }, []);

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
  };  // 🎨 FUNCIÓN PARA OBTENER EL ESTILO VISUAL DE CADA CELDA (¡SÚPER MEJORADA CON COLORES ESPECTACULARES Y ANIMACIONES!)
  const obtenerEstiloCelda = (celda: CeldaGranja) => {
    const estilosBase = "w-full h-24 border-2 rounded-lg transition-shadow duration-300 hover:shadow-md cursor-pointer flex flex-col items-center justify-center text-center p-2";
    
    switch (celda.tipo) {
      case 'cultivo':
        const cultivo = celda.datos as Cultivo;
        return {
          className: `${estilosBase} bg-green-100 border-green-300 hover:bg-green-200`,
          icon: '🌱',
          emoji: obtenerEmojiCultivo(cultivo?.tipo || 'papa'),
          texto: cultivo?.nombre || 'Cultivo',
          subtexto: cultivo?.etapaCrecimiento || 'Nuevo'
        };
      
      case 'proveedor':
        const proveedor = celda.datos as Proveedor;
        return {
          className: `${estilosBase} bg-blue-100 border-blue-300 hover:bg-blue-200`,
          icon: '🏪',
          emoji: obtenerEmojiProveedor(proveedor?.tipo || 'semillas'),
          texto: proveedor?.nombre || 'Proveedor',
          subtexto: proveedor?.tipo || 'Nuevo'
        };
      
      case 'cliente':
        const cliente = celda.datos as Cliente;
        return {
          className: `${estilosBase} bg-purple-100 border-purple-300 hover:bg-purple-200`,
          icon: '👥',
          emoji: obtenerEmojiCliente(cliente?.tipo || 'mayorista'),
          texto: cliente?.nombre || 'Cliente',
          subtexto: cliente?.tipo || 'Nuevo'
        };
      
      case 'trabajador':
        const trabajador = celda.datos as Trabajador;
        return {
          className: `${estilosBase} bg-orange-100 border-orange-300 hover:bg-orange-200`,
          icon: '👨‍🌾',
          emoji: obtenerEmojiTrabajador(trabajador?.rol || 'agricultor'),
          texto: trabajador?.nombre || 'Trabajador',
          subtexto: trabajador?.rol || 'Nuevo'
        };
      
      case 'almacen':
        const almacen = celda.datos as Almacen;
        return {
          className: `${estilosBase} bg-yellow-100 border-yellow-300 hover:bg-yellow-200`,
          icon: '🏭',
          emoji: obtenerEmojiAlmacen(almacen?.tipo || 'productos_agricolas'),
          texto: almacen?.nombre || 'Almacén',
          subtexto: almacen?.tipo || 'Nuevo'
        };
      
      case 'reservorio':
        const reservorio = celda.datos as Reservorio;
        return {
          className: `${estilosBase} bg-cyan-100 border-cyan-300 hover:bg-cyan-200`,
          icon: '💧',
          emoji: obtenerEmojiReservorio(reservorio?.tipo || 'artificial'),
          texto: reservorio?.nombre || 'Reservorio',
          subtexto: `${reservorio?.nivel_actual || 0}%`
        };
      
      default:
        return {
          className: `${estilosBase} bg-gray-100 border-gray-300 hover:bg-gray-200`,
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
    <div className="min-h-screen bg-gray-50">
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
                </CardHeader>                <CardContent className="h-[calc(100%-120px)] overflow-auto bg-green-50 p-4 rounded-lg relative">
                    {/* Grid de la granja con diseño profesional */}
                  <div 
                    className="grid gap-3 auto-rows-fr p-4 bg-white rounded-lg border border-gray-200 shadow-sm relative"
                    style={{ gridTemplateColumns: `repeat(${COLUMNAS_GRANJA}, 1fr)` }}
                  >
                      {granja.map((celda, index) => {
                      const estilo = obtenerEstiloCelda(celda);
                      return (
                        <div
                          key={celda.id}
                          className={`${estilo.className} group relative cursor-pointer transition-all duration-200 hover:shadow-md`}
                          onClick={() => manejarClickCelda(celda)}
                        >
                          {/* Emoji principal */}
                          <div className="text-3xl mb-2">{estilo.emoji}</div>
                          
                          {/* Texto principal */}
                          <div className="text-xs font-semibold text-gray-700">{estilo.texto}</div>
                          
                          {/* Subtexto */}
                          <div className="text-xs text-gray-600">{estilo.subtexto}</div>
                          
                          {/* Indicador simple para elementos ocupados */}
                          {celda.tipo !== 'vacia' && (
                            <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />            {/* Panel Derecho - Dashboard Súper Mejorado con Efectos Espectaculares */}
            <ResizablePanel defaultSize={30} minSize={25}>              <Card className="h-full bg-gray-50 border border-gray-200 shadow-lg relative overflow-hidden">
                  <CardHeader className="bg-green-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xl font-semibold">Panel de Control de la Granja</span>
                    <div className="ml-auto">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)] overflow-auto space-y-5 p-6 relative">
                  {/* Estadísticas Súper Mejoradas con Efectos Espectaculares */}
                  <div className="space-y-5">                    {/* Cultivos */}
                    <div className="bg-green-50 border-green-200 border-2 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-3 font-semibold text-lg text-green-800">
                          🌱 <span>Cultivos</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 rounded-lg px-4 py-2">
                            <span className="font-bold text-2xl text-green-700">{stats.cultivos}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.cultivos / TOTAL_CELDAS) * 100} className="mt-3 h-3 bg-green-100" />
                    </div>                    {/* Proveedores */}
                    <div className="bg-blue-50 border-blue-200 border-2 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-3 font-semibold text-lg text-blue-800">
                          🏪 <span>Proveedores</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 rounded-lg px-4 py-2">
                            <span className="font-bold text-2xl text-blue-700">{stats.proveedores}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.proveedores / TOTAL_CELDAS) * 100} className="mt-3 h-3 bg-blue-100" />
                    </div>                    {/* Clientes */}
                    <div className="bg-purple-50 border-purple-200 border-2 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-3 font-semibold text-lg text-purple-800">
                          👥 <span>Clientes</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 rounded-lg px-4 py-2">
                            <span className="font-bold text-2xl text-purple-700">{stats.clientes}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.clientes / TOTAL_CELDAS) * 100} className="mt-3 h-3 bg-purple-100" />
                    </div>                    {/* Personal */}
                    <div className="bg-orange-50 border-orange-200 border-2 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-3 font-semibold text-lg text-orange-800">
                          👨‍🌾 <span>Personal</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 rounded-lg px-4 py-2">
                            <span className="font-bold text-2xl text-orange-700">{stats.trabajadores}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.trabajadores / TOTAL_CELDAS) * 100} className="mt-3 h-3 bg-orange-100" />
                    </div>                    {/* Almacenes */}
                    <div className="bg-yellow-50 border-yellow-200 border-2 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-3 font-semibold text-lg text-yellow-800">
                          🏭 <span>Almacenes</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 rounded-lg px-4 py-2">
                            <span className="font-bold text-2xl text-yellow-700">{stats.almacenes}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.almacenes / TOTAL_CELDAS) * 100} className="mt-3 h-3 bg-yellow-100" />
                    </div>                    {/* Reservorios */}
                    <div className="bg-cyan-50 border-cyan-200 border-2 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-3 font-semibold text-lg text-cyan-800">
                          💧 <span>Reservorios</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-cyan-100 rounded-lg px-4 py-2">
                            <span className="font-bold text-2xl text-cyan-700">{stats.reservorios}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.reservorios / TOTAL_CELDAS) * 100} className="mt-3 h-3 bg-cyan-100" />
                    </div>                    {/* Disponibles */}
                    <div className="bg-gray-50 border-gray-200 border-2 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-3 font-semibold text-lg text-gray-800">
                          🎯 <span>Disponibles</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 rounded-lg px-4 py-2">
                            <span className="font-bold text-2xl text-gray-700">{stats.vacias}</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(stats.vacias / TOTAL_CELDAS) * 100} className="mt-3 h-3 bg-gray-100" />
                    </div>
                  </div>                  {/* Información de Celda Seleccionada */}
                  {celdaSeleccionada && (
                    <div className="border-t-2 border-gray-200 pt-6 mt-6">
                      <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold mb-4">
                        📍 CELDA SELECCIONADA
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-md">
                        <div className="text-center mb-6">
                          <div className="text-6xl mb-4">
                            {obtenerEstiloCelda(celdaSeleccionada).emoji}
                          </div>
                          <div className="text-xl font-semibold text-gray-800">
                            {obtenerEstiloCelda(celdaSeleccionada).texto}
                          </div>
                          <div className="text-md text-gray-600 mt-2">
                            {obtenerEstiloCelda(celdaSeleccionada).subtexto}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-3 border border-gray-200">
                          <div className="flex justify-between items-center">
                            <strong className="text-gray-700">📍 Posición:</strong> 
                            <span className="bg-gray-200 px-3 py-1 rounded-md font-medium text-gray-800">
                              Fila {celdaSeleccionada.fila + 1}, Col {celdaSeleccionada.columna + 1}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <strong className="text-gray-700">🏷️ Tipo:</strong> 
                            <span className="bg-blue-100 px-3 py-1 rounded-md font-medium text-blue-800 capitalize">
                              {celdaSeleccionada.tipo}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <strong className="text-gray-700">⚡ Estado:</strong> 
                            <span className={`px-3 py-1 rounded-md font-medium ${celdaSeleccionada.datos ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {celdaSeleccionada.datos ? '🟢 Ocupada' : '🟡 Disponible'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Acciones Rápidas Súper Mejoradas */}                  <div className="border-t-4 border-green-500 pt-6 mt-6 relative">
                    <div className="absolute -top-2 left-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      🚀 ACCIONES RÁPIDAS
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <Button 
                        size="lg" 
                        className="w-full justify-start text-sm bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-md transition-all duration-200"
                        onClick={() => setVistaActual('estadisticas')}                      >
                        <BarChart3 className="h-5 w-5 mr-3" />
                        <span>📊 Ver Estadísticas Completas</span>
                      </Button>
                      
                      <Button 
                        size="lg" 
                        className="w-full justify-start text-sm bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-md transition-all duration-200"
                        onClick={() => {
                          const primeraCeldaVacia = granja.find(c => c.tipo === 'vacio');
                          if (primeraCeldaVacia) manejarClickCelda(primeraCeldaVacia);
                        }}                      >
                        <Plus className="h-5 w-5 mr-3" />
                        <span>➕ Agregar Nuevo Elemento</span>
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
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <h4 className="text-md font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  🤖 Evaluación Agronómica Preliminar
                </h4>
                <div className="space-y-2 text-sm">
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
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
                  onChange={(e) => setFormData({ ...formData, distancia_capital_km: parseInt(e.target.value) })}
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
              <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
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
      {/* Indicador de progreso */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6].map((paso) => (
            <div
              key={paso}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                paso === pasoActual
                  ? 'bg-green-600 text-white'
                  : paso < pasoActual
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {paso}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Paso {pasoActual} de {totalPasos}
        </div>
      </div>

      {/* Contenido del paso actual */}
      {renderPaso()}

      {/* Navegación */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setPasoActual(Math.max(1, pasoActual - 1))}
          disabled={pasoActual === 1}
          className="flex items-center gap-2"
        >
          ← Anterior
        </Button>
        <Button
          onClick={() => setPasoActual(Math.min(totalPasos, pasoActual + 1))}
          disabled={pasoActual === totalPasos}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
};

// 📍 SELECTOR DE MAPA INTERACTIVO - COMPONENTE INTELIGENTE
const SelectorMapaInteractivo: React.FC<{ 
  ubicacionSeleccionada: UbicacionGeodata | null; 
  onUbicacionSeleccionada: (ubicacion: UbicacionGeodata) => void;
  ubicacionesExistentes: UbicacionGeodata[];
}> = ({ ubicacionSeleccionada, onUbicacionSeleccionada, ubicacionesExistentes }) => {
  const { toast } = useToast();
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [coordenadasTemp, setCoordenadasTemp] = useState({ lat: -12.0464, lng: -77.0428 }); // Lima por defecto

  const handleSeleccionarUbicacionExistente = (ubicacion: UbicacionGeodata) => {
    onUbicacionSeleccionada(ubicacion);
    toast({
      title: "📍 Ubicación reutilizada",
      description: `Se reutilizó la ubicación de ${ubicacion.distrito}, ${ubicacion.provincia}`,
    });
  };

  const handleCrearNuevaUbicacion = () => {
    setMostrarMapa(true);
  };

  const handleConfirmarCoordenadas = () => {
    // Crear nueva ubicación con coordenadas seleccionadas
    const nuevaUbicacion: Partial<UbicacionGeodata> = {
      coordenadas: coordenadasTemp,
      // Los demás campos se completarán en el formulario
    };
    onUbicacionSeleccionada(nuevaUbicacion as UbicacionGeodata);
    setMostrarMapa(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">📍 Ubicación Geográfica</Label>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCrearNuevaUbicacion}
          className="text-blue-600 border-blue-200"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Seleccionar en mapa
        </Button>
      </div>

      {/* Ubicaciones existentes para reutilizar */}
      {ubicacionesExistentes.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            🔄 Reutilizar ubicación existente
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ubicacionesExistentes.map((ubicacion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSeleccionarUbicacionExistente(ubicacion)}
                className="justify-start text-left h-auto p-3"
              >
                <div>
                  <div className="font-medium">{ubicacion.distrito}, {ubicacion.provincia}</div>
                  <div className="text-xs text-gray-500">{ubicacion.departamento} • {ubicacion.accesibilidad}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Ubicación seleccionada */}
      {ubicacionSeleccionada && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Ubicación seleccionada</span>
          </div>
          <div className="text-sm text-green-700">
            {ubicacionSeleccionada.distrito && ubicacionSeleccionada.provincia && (
              <div>{ubicacionSeleccionada.distrito}, {ubicacionSeleccionada.provincia}</div>
            )}
            {ubicacionSeleccionada.coordenadas && (
              <div className="text-xs">
                Coords: {ubicacionSeleccionada.coordenadas.lat.toFixed(4)}, {ubicacionSeleccionada.coordenadas.lng.toFixed(4)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de mapa simplificado */}
      {mostrarMapa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">📍 Seleccionar ubicación en el mapa</h3>
            
            {/* Simulación de mapa - en una implementación real usaríamos Google Maps o Leaflet */}
            <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Simulación de mapa interactivo</p>
                <p className="text-sm text-gray-500">
                  Coordenadas actuales: {coordenadasTemp.lat.toFixed(4)}, {coordenadasTemp.lng.toFixed(4)}
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline" onClick={() => setCoordenadasTemp({lat: -12.0464, lng: -77.0428})}>
                      Lima
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setCoordenadasTemp({lat: -13.5319, lng: -71.9675})}>
                      Cusco
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setCoordenadasTemp({lat: -12.0619, lng: -75.2090})}>
                      Huancayo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarMapa(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmarCoordenadas} className="bg-blue-600 hover:bg-blue-700">
                Confirmar ubicación
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🏪 FORMULARIO INTELIGENTE PARA PROVEEDORES MEJORADO
const FormularioProveedorInteligente: React.FC<{ formData: any; setFormData: (data: any) => void; ubicacionesExistentes: UbicacionGeodata[] }> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 4; // Expandido a 4 pasos

  const handleUbicacionSeleccionada = (ubicacion: UbicacionGeodata) => {
    setFormData({ 
      ...formData, 
      ubicacion,
      departamento: ubicacion.departamento,
      provincia: ubicacion.provincia,
      distrito: ubicacion.distrito 
    });
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">Información de la Empresa</h3>
              <p className="text-gray-600">Registra los datos básicos del proveedor y su estructura empresarial</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <Label htmlFor="nombre" className="text-base font-semibold text-orange-800">🏪 Razón Social / Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: AgroSemillas del Norte SAC"
                    className="mt-2 border-orange-200 focus:border-orange-400 bg-white"
                  />
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Label htmlFor="ruc" className="text-base font-semibold text-blue-800">📋 RUC / Documento *</Label>
                  <Input
                    id="ruc"
                    value={formData.ruc || ''}
                    onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                    placeholder="Ej: 20123456789"
                    className="mt-2 border-blue-200 focus:border-blue-400 bg-white"
                  />
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <Label htmlFor="tamano_empresa" className="text-base font-semibold text-green-800">🏢 Tamaño de Empresa</Label>
                  <Select value={formData.tamano_empresa || ''} onValueChange={(value) => setFormData({ ...formData, tamano_empresa: value })}>
                    <SelectTrigger className="mt-2 border-green-200 bg-white">
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="microempresa">🏠 Microempresa (1-10 trabajadores)</SelectItem>
                      <SelectItem value="pequena">🏬 Pequeña empresa (11-100 trabajadores)</SelectItem>
                      <SelectItem value="mediana">🏭 Mediana empresa (101-1000 trabajadores)</SelectItem>
                      <SelectItem value="grande">🏢 Gran empresa (+1000 trabajadores)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Label htmlFor="tipo" className="text-base font-semibold text-purple-800">📦 Especialidad Principal *</Label>
                  <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger className="mt-2 border-purple-200 bg-white">
                      <SelectValue placeholder="Seleccionar especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semillas">🌱 Semillas y Material Genético</SelectItem>
                      <SelectItem value="fertilizantes">🧪 Fertilizantes y Nutrientes</SelectItem>
                      <SelectItem value="pesticidas">🚫 Pesticidas y Fitosanitarios</SelectItem>
                      <SelectItem value="herramientas">🔧 Herramientas y Equipos Menores</SelectItem>
                      <SelectItem value="maquinaria">🚜 Maquinaria Agrícola</SelectItem>
                      <SelectItem value="sistemas_riego">💧 Sistemas de Riego</SelectItem>
                      <SelectItem value="insumos_organicos">🌿 Insumos Orgánicos</SelectItem>
                      <SelectItem value="servicios_tecnicos">👨‍🔬 Servicios Técnicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-base font-semibold text-gray-800">📞 Información de Contacto</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <Input
                      placeholder="📱 Teléfono principal"
                      value={formData.telefono || ''}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="border-gray-200 focus:border-gray-400 bg-white"
                    />
                    <Input
                      placeholder="📱 WhatsApp (opcional)"
                      value={formData.whatsapp || ''}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="border-gray-200 focus:border-gray-400 bg-white"
                    />
                    <Input
                      placeholder="📧 Email empresarial"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-gray-200 focus:border-gray-400 bg-white"
                    />
                    <Input
                      placeholder="🌐 Página web (opcional)"
                      value={formData.sitio_web || ''}
                      onChange={(e) => setFormData({ ...formData, sitio_web: e.target.value })}
                      className="border-gray-200 focus:border-gray-400 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <Label htmlFor="anos_experiencia" className="text-base font-semibold text-yellow-800">📅 Años de Experiencia</Label>
                <Input
                  id="anos_experiencia"
                  type="number"
                  value={formData.anos_experiencia || ''}
                  onChange={(e) => setFormData({ ...formData, anos_experiencia: parseInt(e.target.value) || 0 })}
                  placeholder="Ej: 15"
                  className="mt-2 border-yellow-200 focus:border-yellow-400 bg-white"
                />
              </div>
              
              <div className="p-4 bg-pink-50 rounded-lg">
                <Label htmlFor="confiabilidad" className="text-base font-semibold text-pink-800">⭐ Nuestra Calificación</Label>
                <Select value={formData.confiabilidad?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, confiabilidad: parseInt(value) })}>
                  <SelectTrigger className="mt-2 border-pink-200 bg-white">
                    <SelectValue placeholder="Calificar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ Deficiente</SelectItem>
                    <SelectItem value="2">⭐⭐ Regular</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Bueno</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Muy Bueno</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg">
                <Label htmlFor="certificaciones" className="text-base font-semibold text-indigo-800">🏆 Certificaciones</Label>
                <Input
                  id="certificaciones"
                  value={formData.certificaciones || ''}
                  onChange={(e) => setFormData({ ...formData, certificaciones: e.target.value })}
                  placeholder="Ej: ISO, SENASA, Orgánico"
                  className="mt-2 border-indigo-200 focus:border-indigo-400 bg-white"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">Ubicación y Presencia Geográfica</h3>
              <p className="text-gray-600">Define la ubicación principal y áreas de cobertura del proveedor</p>
            </div>

            <SelectorMapaInteractivo
              ubicacionSeleccionada={formData.ubicacion}
              onUbicacionSeleccionada={handleUbicacionSeleccionada}
              ubicacionesExistentes={ubicacionesExistentes}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Label htmlFor="direccion_completa" className="text-base font-semibold text-blue-800">🏠 Dirección Completa</Label>
                <Textarea
                  id="direccion_completa"
                  value={formData.direccion_completa || ''}
                  onChange={(e) => setFormData({ ...formData, direccion_completa: e.target.value })}
                  placeholder="Ej: Av. La Marina 2355, San Miguel, Lima, Perú"
                  rows={2}
                  className="mt-2 border-blue-200 focus:border-blue-400 bg-white"
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <Label htmlFor="zonas_cobertura" className="text-base font-semibold text-green-800">🗺️ Zonas de Cobertura</Label>
                <Textarea
                  id="zonas_cobertura"
                  value={Array.isArray(formData.zonas_cobertura) ? formData.zonas_cobertura.join(', ') : formData.zonas_cobertura || ''}
                  onChange={(e) => setFormData({ ...formData, zonas_cobertura: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="Ej: Lima, Junín, Huancavelica, Ayacucho"
                  rows={2}
                  className="mt-2 border-green-200 focus:border-green-400 bg-white"
                />
                <p className="text-sm text-green-600 mt-1">💡 Separar departamentos con comas</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <Label className="text-base font-semibold text-purple-800">🚛 Información de Accesibilidad</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <Label htmlFor="accesibilidad" className="text-sm font-medium">Nivel de Accesibilidad</Label>
                  <Select value={formData.accesibilidad || ''} onValueChange={(value) => setFormData({ ...formData, accesibilidad: value })}>
                    <SelectTrigger className="mt-1 border-purple-200 bg-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelente">🛣️ Excelente (carretera asfaltada)</SelectItem>
                      <SelectItem value="buena">🚗 Buena (afirmado en buen estado)</SelectItem>
                      <SelectItem value="regular">⚠️ Regular (trocha carrozable)</SelectItem>
                      <SelectItem value="dificil">🚵 Difícil (solo a pie/bestias)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="distancia_capital" className="text-sm font-medium">Distancia a Capital (km)</Label>
                  <Input
                    id="distancia_capital"
                    type="number"
                    value={formData.distancia_capital || ''}
                    onChange={(e) => setFormData({ ...formData, distancia_capital: parseInt(e.target.value) || 0 })}
                    placeholder="150"
                    className="mt-1 border-purple-200 focus:border-purple-400 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">Condiciones Comerciales</h3>
              <p className="text-gray-600">Precios, términos de pago y condiciones de negocio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <Label htmlFor="politica_precios" className="text-base font-semibold text-green-800">💰 Política de Precios</Label>
                  <Select value={formData.politica_precios || ''} onValueChange={(value) => setFormData({ ...formData, politica_precios: value })}>
                    <SelectTrigger className="mt-2 border-green-200 bg-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="competitivo">💚 Muy competitivo</SelectItem>
                      <SelectItem value="promedio">💛 Promedio del mercado</SelectItem>
                      <SelectItem value="premium">💙 Premium (alta calidad)</SelectItem>
                      <SelectItem value="variable">🔄 Variable según volumen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <Label htmlFor="descuentos_volumen" className="text-base font-semibold text-blue-800">📊 Descuentos por Volumen</Label>
                  <Textarea
                    id="descuentos_volumen"
                    value={formData.descuentos_volumen || ''}
                    onChange={(e) => setFormData({ ...formData, descuentos_volumen: e.target.value })}
                    placeholder="Ej: 5% más de 1000kg, 10% más de 5000kg"
                    rows={2}
                    className="mt-2 border-blue-200 focus:border-blue-400 bg-white"
                  />
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <Label htmlFor="terminos_pago" className="text-base font-semibold text-purple-800">💳 Términos de Pago</Label>
                  <Select value={formData.terminos_pago || ''} onValueChange={(value) => setFormData({ ...formData, terminos_pago: value })}>
                    <SelectTrigger className="mt-2 border-purple-200 bg-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contado">💵 Contado</SelectItem>
                      <SelectItem value="15_dias">📅 15 días</SelectItem>
                      <SelectItem value="30_dias">📅 30 días</SelectItem>
                      <SelectItem value="45_dias">📅 45 días</SelectItem>
                      <SelectItem value="60_dias">📅 60 días</SelectItem>
                      <SelectItem value="negociable">🤝 Negociable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <Label htmlFor="garantias" className="text-base font-semibold text-orange-800">🛡️ Garantías Ofrecidas</Label>
                  <Textarea
                    id="garantias"
                    value={formData.garantias || ''}
                    onChange={(e) => setFormData({ ...formData, garantias: e.target.value })}
                    placeholder="Ej: Garantía de calidad 12 meses, devolución si no cumple especificaciones"
                    rows={3}
                    className="mt-2 border-orange-200 focus:border-orange-400 bg-white"
                  />
                </div>

                <div className="p-4 bg-pink-50 rounded-lg">
                  <Label htmlFor="servicios_adicionales" className="text-base font-semibold text-pink-800">⭐ Servicios Adicionales</Label>
                  <Textarea
                    id="servicios_adicionales"
                    value={formData.servicios_adicionales || ''}
                    onChange={(e) => setFormData({ ...formData, servicios_adicionales: e.target.value })}
                    placeholder="Ej: Asesoría técnica, capacitación, análisis de suelo"
                    rows={3}
                    className="mt-2 border-pink-200 focus:border-pink-400 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <Label htmlFor="calificacion_precio" className="text-base font-semibold text-yellow-800">💰 Calificación Precio</Label>
                <Select value={formData.calificacion_precio?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, calificacion_precio: parseInt(value) })}>
                  <SelectTrigger className="mt-2 border-yellow-200 bg-white">
                    <SelectValue placeholder="Calificar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ Muy caro</SelectItem>
                    <SelectItem value="2">⭐⭐ Caro</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Justo</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Bueno</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg">
                <Label htmlFor="calificacion_calidad" className="text-base font-semibold text-teal-800">🏆 Calificación Calidad</Label>
                <Select value={formData.calificacion_calidad?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, calificacion_calidad: parseInt(value) })}>
                  <SelectTrigger className="mt-2 border-teal-200 bg-white">
                    <SelectValue placeholder="Calificar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ Deficiente</SelectItem>
                    <SelectItem value="2">⭐⭐ Regular</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Buena</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Muy buena</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-cyan-50 rounded-lg">
                <Label htmlFor="calificacion_servicio" className="text-base font-semibold text-cyan-800">🤝 Calificación Servicio</Label>
                <Select value={formData.calificacion_servicio?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, calificacion_servicio: parseInt(value) })}>
                  <SelectTrigger className="mt-2 border-cyan-200 bg-white">
                    <SelectValue placeholder="Calificar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ Deficiente</SelectItem>
                    <SelectItem value="2">⭐⭐ Regular</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Bueno</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Muy bueno</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">Logística y Contingencias</h3>
              <p className="text-gray-600">Capacidades de entrega y planes de respaldo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Label htmlFor="tiempoEntrega" className="text-base font-semibold text-purple-800">🚚 Tiempo de Entrega</Label>
                  <Input
                    id="tiempoEntrega"
                    value={formData.tiempoEntrega || ''}
                    onChange={(e) => setFormData({ ...formData, tiempoEntrega: e.target.value })}
                    placeholder="Ej: 2-3 días hábiles"
                    className="mt-2 border-purple-200 focus:border-purple-400 bg-white"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <Label htmlFor="capacidad_entrega" className="text-base font-semibold text-blue-800">📦 Capacidad de Entrega</Label>
                  <Select value={formData.capacidad_entrega || ''} onValueChange={(value) => setFormData({ ...formData, capacidad_entrega: value })}>
                    <SelectTrigger className="mt-2 border-blue-200 bg-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequena">📦 Pequeña (hasta 500kg/día)</SelectItem>
                      <SelectItem value="mediana">📫 Mediana (500kg-2ton/día)</SelectItem>
                      <SelectItem value="grande">🚛 Grande (2-10 ton/día)</SelectItem>
                      <SelectItem value="industrial">🏭 Industrial (+10 ton/día)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <Label htmlFor="modalidades_entrega" className="text-base font-semibold text-green-800">🛣️ Modalidades de Entrega</Label>
                  <div className="space-y-2 mt-2">
                    {['Delivery gratis en zona', 'Recojo en almacén', 'Flete a convenir', 'Envío por transportista'].map((modalidad) => (
                      <label key={modalidad} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.modalidades_entrega?.includes(modalidad) || false}
                          onChange={(e) => {
                            const modalidades = formData.modalidades_entrega || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, modalidades_entrega: [...modalidades, modalidad] });
                            } else {
                              setFormData({ ...formData, modalidades_entrega: modalidades.filter(m => m !== modalidad) });
                            }
                          }}
                          className="text-green-600"
                        />
                        <span className="text-sm">{modalidad}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <Label htmlFor="horarios_atencion" className="text-base font-semibold text-orange-800">🕐 Horarios de Atención</Label>
                  <Textarea
                    id="horarios_atencion"
                    value={formData.horarios_atencion || ''}
                    onChange={(e) => setFormData({ ...formData, horarios_atencion: e.target.value })}
                    placeholder="Ej: Lun-Vie: 8:00-18:00, Sáb: 8:00-13:00"
                    rows={2}
                    className="mt-2 border-orange-200 focus:border-orange-400 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <Label htmlFor="backup_proveedores" className="text-base font-semibold text-red-800">🔄 Proveedores de Respaldo</Label>
                  <Textarea
                    id="backup_proveedores"
                    value={Array.isArray(formData.backup_proveedores) ? formData.backup_proveedores.join(', ') : formData.backup_proveedores || ''}
                    onChange={(e) => setFormData({ ...formData, backup_proveedores: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Ej: AgroLima SAC, Distribuidora Andina, Cooperativa El Mantaro"
                    rows={3}
                    className="mt-2 border-red-200 focus:border-red-400 bg-white"
                  />
                  <p className="text-sm text-red-600 mt-1">🚨 Importante para reducir riesgos de desabastecimiento</p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <Label htmlFor="politica_devoluciones" className="text-base font-semibold text-yellow-800">↩️ Política de Devoluciones</Label>
                  <Textarea
                    id="politica_devoluciones"
                    value={formData.politica_devoluciones || ''}
                    onChange={(e) => setFormData({ ...formData, politica_devoluciones: e.target.value })}
                    placeholder="Ej: Acepta devoluciones hasta 7 días, productos defectuosos cambio inmediato"
                    rows={2}
                    className="mt-2 border-yellow-200 focus:border-yellow-400 bg-white"
                  />
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <Label htmlFor="contacto_emergencia" className="text-base font-semibold text-indigo-800">🚨 Contacto de Emergencia</Label>
                  <Input
                    id="contacto_emergencia"
                    value={formData.contacto_emergencia || ''}
                    onChange={(e) => setFormData({ ...formData, contacto_emergencia: e.target.value })}
                    placeholder="Ej: +51 999 123 456 (24h)"
                    className="mt-2 border-indigo-200 focus:border-indigo-400 bg-white"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor="observaciones" className="text-base font-semibold text-gray-800">📝 Observaciones Adicionales</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones || ''}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    placeholder="Notas importantes, experiencias previas, recomendaciones..."
                    rows={3}
                    className="mt-2 border-gray-200 focus:border-gray-400 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Resumen de IA */}
            <div className="p-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">IA</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">🤖 Análisis Inteligente del Proveedor</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• <strong>Nivel de Riesgo:</strong> {formData.backup_proveedores?.length > 0 ? '🟢 Bajo (tiene respaldos)' : '🟡 Medio (sin respaldos)'}</p>
                    <p>• <strong>Capacidad Logística:</strong> {formData.capacidad_entrega === 'industrial' ? '🟢 Excelente' : formData.capacidad_entrega === 'grande' ? '🟡 Buena' : '🟠 Limitada'}</p>
                    <p>• <strong>Cobertura Geográfica:</strong> {formData.zonas_cobertura?.length > 3 ? '🟢 Amplia' : '🟡 Regional'}</p>
                    <p>• <strong>Recomendación:</strong> Evaluar histórico de entregas y validar referencias antes de pedidos grandes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso mejorado */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          {[1, 2, 3, 4].map((paso, index) => (
            <React.Fragment key={paso}>
              <div                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  paso === pasoActual
                    ? 'bg-orange-500 text-white shadow-md'
                    : paso < pasoActual
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {paso < pasoActual ? '✓' : paso}
              </div>
              {index < 3 && (
                <div
                  className={`w-8 h-1 rounded-full transition-all duration-300 ${
                    paso < pasoActual ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Paso {pasoActual} de {totalPasos}
        </div>
      </div>

      {/* Títulos de pasos */}
      <div className="grid grid-cols-4 gap-2 text-xs text-center mb-6">
        {[
          { title: 'Empresa', icon: '🏪' },
          { title: 'Ubicación', icon: '📍' },
          { title: 'Comercial', icon: '💰' },
          { title: 'Logística', icon: '🚛' }
        ].map((step, index) => (
          <div key={index} className={`p-2 rounded ${index + 1 === pasoActual ? 'bg-orange-100 text-orange-800' : 'text-gray-500'}`}>
            <div className="text-base mb-1">{step.icon}</div>
            <div className="font-medium">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Contenido del paso actual */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          {renderPaso()}
        </CardContent>
      </Card>

      {/* Navegación mejorada */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={() => setPasoActual(Math.max(1, pasoActual - 1))}
          disabled={pasoActual === 1}
          className="flex items-center gap-2 px-6 py-2 hover:bg-gray-50"
        >
          ← Anterior
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setPasoActual(Math.min(totalPasos, pasoActual + 1))}
            disabled={pasoActual === totalPasos}
            className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600"
          >
            {pasoActual === totalPasos ? 'Finalizar' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 👥 FORMULARIO INTELIGENTE PARA CLIENTES MEJORADO
const FormularioClienteInteligente: React.FC<{ formData: any; setFormData: (data: any) => void; ubicacionesExistentes: UbicacionGeodata[] }> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 4; // Expandido a 4 pasos

  const handleUbicacionSeleccionada = (ubicacion: UbicacionGeodata) => {
    setFormData({ 
      ...formData, 
      ubicacion,
      departamento: ubicacion.departamento,
      provincia: ubicacion.provincia,
      distrito: ubicacion.distrito 
    });
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                Paso 1: Información Empresarial del Cliente 🏢
              </h3>
              <p className="text-blue-600 text-sm">Datos comerciales y de contacto empresarial</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-blue-700 font-medium">👤 Nombre/Razón Social *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Mercado Central de Huancayo SAC"
                  className="border-blue-300 focus:border-blue-500 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruc" className="text-blue-700 font-medium">📄 RUC</Label>
                <Input
                  id="ruc"
                  value={formData.ruc || ''}
                  onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                  placeholder="Ej: 20123456789"
                  className="border-blue-300 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-blue-700 font-medium">🏢 Tipo de cliente *</Label>
                <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger className="border-blue-300 bg-white">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mayorista">🏪 Mayorista Regional</SelectItem>
                    <SelectItem value="minorista">🛒 Minorista Local</SelectItem>
                    <SelectItem value="restaurante">🍽️ Restaurante/Hotel</SelectItem>
                    <SelectItem value="mercado_local">🏛️ Mercado Municipal</SelectItem>
                    <SelectItem value="supermercado">🛍️ Cadena de Supermercados</SelectItem>
                    <SelectItem value="exportacion">✈️ Empresa Exportadora</SelectItem>
                    <SelectItem value="procesadora">🏭 Industria Procesadora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tamaño_empresa" className="text-blue-700 font-medium">📊 Tamaño de empresa</Label>
                <Select value={formData.tamaño_empresa || ''} onValueChange={(value) => setFormData({ ...formData, tamaño_empresa: value })}>
                  <SelectTrigger className="border-blue-300 bg-white">
                    <SelectValue placeholder="Clasificación empresarial" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="microempresa">🏪 Microempresa (1-10 empleados)</SelectItem>
                    <SelectItem value="pequeña">🏢 Pequeña empresa (11-50 empleados)</SelectItem>
                    <SelectItem value="mediana">🏭 Mediana empresa (51-250 empleados)</SelectItem>
                    <SelectItem value="grande">🏬 Gran empresa (+250 empleados)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contacto_principal" className="text-blue-700 font-medium">👨‍💼 Contacto principal</Label>
                <Input
                  id="contacto_principal"
                  value={formData.contacto_principal || ''}
                  onChange={(e) => setFormData({ ...formData, contacto_principal: e.target.value })}
                  placeholder="Ej: Carlos Mendoza (Gerente de Compras)"
                  className="border-blue-300 focus:border-blue-500 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-blue-700 font-medium">📞 Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: +51 964 123 456"
                  className="border-blue-300 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-700 font-medium">📧 Email corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej: compras@mercadocentral.com"
                  className="border-blue-300 focus:border-blue-500 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="años_mercado" className="text-blue-700 font-medium">📅 Años en el mercado</Label>
                <Input
                  id="años_mercado"
                  type="number"
                  min="0"
                  value={formData.años_mercado || ''}
                  onChange={(e) => setFormData({ ...formData, años_mercado: parseInt(e.target.value) })}
                  placeholder="Ej: 15"
                  className="border-blue-300 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Paso 2: Ubicación y Accesibilidad 🗺️
              </h3>
              <p className="text-green-600 text-sm">Localización geográfica y datos logísticos</p>
            </div>

            <SelectorMapaInteractivo
              ubicacionSeleccionada={formData.ubicacion}
              onUbicacionSeleccionada={handleUbicacionSeleccionada}
              ubicacionesExistentes={ubicacionesExistentes}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="direccion_completa" className="text-green-700 font-medium">📍 Dirección completa</Label>
                <Textarea
                  id="direccion_completa"
                  value={formData.direccion_completa || ''}
                  onChange={(e) => setFormData({ ...formData, direccion_completa: e.target.value })}
                  placeholder="Ej: Jr. Real 1245, Cercado de Huancayo, Provincia de Huancayo"
                  rows={3}
                  className="border-green-300 focus:border-green-500 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarios_atencion" className="text-green-700 font-medium">⏰ Horarios de atención</Label>
                <Textarea
                  id="horarios_atencion"
                  value={formData.horarios_atencion || ''}
                  onChange={(e) => setFormData({ ...formData, horarios_atencion: e.target.value })}
                  placeholder="Ej: Lunes a Sábado: 6:00 AM - 6:00 PM"
                  rows={3}
                  className="border-green-300 focus:border-green-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facilidades_descarga" className="text-green-700 font-medium">🚛 Facilidades de descarga</Label>
                <Select value={formData.facilidades_descarga || ''} onValueChange={(value) => setFormData({ ...formData, facilidades_descarga: value })}>
                  <SelectTrigger className="border-green-300 bg-white">
                    <SelectValue placeholder="Capacidad de recepción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">🚛 Excelente (muelle de carga)</SelectItem>
                    <SelectItem value="buena">📦 Buena (acceso vehicular)</SelectItem>
                    <SelectItem value="regular">🛒 Regular (descarga manual)</SelectItem>
                    <SelectItem value="limitada">🎒 Limitada (solo pequeños vehículos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="almacenamiento" className="text-green-700 font-medium">🏪 Capacidad de almacenamiento</Label>
                <Select value={formData.almacenamiento || ''} onValueChange={(value) => setFormData({ ...formData, almacenamiento: value })}>
                  <SelectTrigger className="border-green-300 bg-white">
                    <SelectValue placeholder="Instalaciones disponibles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amplio">🏭 Amplio (cámaras frigoríficas)</SelectItem>
                    <SelectItem value="medio">🏪 Medio (almacén seco)</SelectItem>
                    <SelectItem value="basico">📦 Básico (estantes)</SelectItem>
                    <SelectItem value="sin_almacen">🛒 Sin almacén (venta directa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">
                Paso 3: Condiciones Comerciales 💼
              </h3>
              <p className="text-purple-600 text-sm">Términos de negociación y preferencias de compra</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="precio_promedio" className="text-purple-700 font-medium">💰 Precio promedio (S/./kg)</Label>
                <Input
                  id="precio_promedio"
                  type="number"
                  step="0.01"
                  value={formData.precio_promedio || ''}
                  onChange={(e) => setFormData({ ...formData, precio_promedio: parseFloat(e.target.value) })}
                  placeholder="Ej: 3.50"
                  className="border-purple-300 focus:border-purple-500 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volumen_compra_min" className="text-purple-700 font-medium">📦 Volumen mínimo (kg)</Label>
                <Input
                  id="volumen_compra_min"
                  type="number"
                  value={formData.volumen_compra_min || ''}
                  onChange={(e) => setFormData({ ...formData, volumen_compra_min: parseInt(e.target.value) })}
                  placeholder="Ej: 500"
                  className="border-purple-300 focus:border-purple-500 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volumen_compra_max" className="text-purple-700 font-medium">📈 Volumen máximo (kg)</Label>
                <Input
                  id="volumen_compra_max"
                  type="number"
                  value={formData.volumen_compra_max || ''}
                  onChange={(e) => setFormData({ ...formData, volumen_compra_max: parseInt(e.target.value) })}
                  placeholder="Ej: 5000"
                  className="border-purple-300 focus:border-purple-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="frecuencia" className="text-purple-700 font-medium">⏰ Frecuencia de compra</Label>
                <Select value={formData.frecuencia || ''} onValueChange={(value) => setFormData({ ...formData, frecuencia: value })}>
                  <SelectTrigger className="border-purple-300 bg-white">
                    <SelectValue placeholder="¿Cada cuánto compra?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">📅 Diario</SelectItem>
                    <SelectItem value="interdiario">📅 Interdiario (día por medio)</SelectItem>
                    <SelectItem value="semanal">📆 Semanal</SelectItem>
                    <SelectItem value="quincenal">📋 Quincenal</SelectItem>
                    <SelectItem value="mensual">🗓️ Mensual</SelectItem>
                    <SelectItem value="estacional">🗂️ Estacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="forma_pago" className="text-purple-700 font-medium">💳 Forma de pago preferida</Label>
                <Select value={formData.forma_pago || ''} onValueChange={(value) => setFormData({ ...formData, forma_pago: value })}>
                  <SelectTrigger className="border-purple-300 bg-white">
                    <SelectValue placeholder="Método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">💵 Efectivo al contado</SelectItem>
                    <SelectItem value="transferencia">🏦 Transferencia bancaria</SelectItem>
                    <SelectItem value="credito_7">📅 Crédito 7 días</SelectItem>
                    <SelectItem value="credito_15">📅 Crédito 15 días</SelectItem>
                    <SelectItem value="credito_30">📅 Crédito 30 días</SelectItem>
                    <SelectItem value="consignacion">🤝 Consignación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-purple-700 font-medium">🛒 Productos de interés principal</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'Papa', 'Quinua', 'Maíz', 'Habas', 'Cebada', 'Trigo', 
                  'Olluco', 'Mashua', 'Tarwi', 'Kiwicha', 'Cañihua', 'Verduras'
                ].map((producto) => (
                  <label key={producto} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.productos_interes || []).includes(producto)}
                      onChange={(e) => {
                        const productos = formData.productos_interes || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, productos_interes: [...productos, producto] });
                        } else {
                          setFormData({ ...formData, productos_interes: productos.filter(p => p !== producto) });
                        }
                      }}
                      className="w-4 h-4 text-purple-600 rounded border-purple-300"
                    />
                    <span className="text-sm text-purple-700">{producto}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="calidad_exigida" className="text-purple-700 font-medium">⭐ Nivel de calidad exigido</Label>
                <Select value={formData.calidad_exigida || ''} onValueChange={(value) => setFormData({ ...formData, calidad_exigida: value })}>
                  <SelectTrigger className="border-purple-300 bg-white">
                    <SelectValue placeholder="Estándares de calidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">⭐⭐⭐⭐⭐ Premium (exportación)</SelectItem>
                    <SelectItem value="primera">⭐⭐⭐⭐ Primera calidad</SelectItem>
                    <SelectItem value="segunda">⭐⭐⭐ Segunda calidad</SelectItem>
                    <SelectItem value="comercial">⭐⭐ Calidad comercial</SelectItem>
                    <SelectItem value="industrial">⭐ Uso industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="calificacion_cliente" className="text-purple-700 font-medium">🏆 Calificación como cliente</Label>
                <Select value={formData.calificacion_cliente?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, calificacion_cliente: parseInt(value) })}>
                  <SelectTrigger className="border-purple-300 bg-white">
                    <SelectValue placeholder="Evaluar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente cliente</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Buen cliente</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Cliente regular</SelectItem>
                    <SelectItem value="2">⭐⭐ Cliente complicado</SelectItem>
                    <SelectItem value="1">⭐ Cliente problemático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">
                Paso 4: Logística y Contingencias 🚛
              </h3>
              <p className="text-amber-600 text-sm">Canales de distribución y planes de respaldo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tipo_entrega" className="text-amber-700 font-medium">🚚 Tipo de entrega preferida</Label>
                <Select value={formData.tipo_entrega || ''} onValueChange={(value) => setFormData({ ...formData, tipo_entrega: value })}>
                  <SelectTrigger className="border-amber-300 bg-white">
                    <SelectValue placeholder="Modalidad de entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puerta_a_puerta">🏠 Puerta a puerta</SelectItem>
                    <SelectItem value="recojo_granja">🚜 Recojo en granja</SelectItem>
                    <SelectItem value="punto_encuentro">📍 Punto de encuentro</SelectItem>
                    <SelectItem value="tercerizado">🚛 Transporte tercerizado</SelectItem>
                    <SelectItem value="propio">🚐 Transporte propio del cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiempo_entrega" className="text-amber-700 font-medium">⏱️ Tiempo máximo de entrega</Label>
                <Select value={formData.tiempo_entrega || ''} onValueChange={(value) => setFormData({ ...formData, tiempo_entrega: value })}>
                  <SelectTrigger className="border-amber-300 bg-white">
                    <SelectValue placeholder="Plazo de entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mismo_dia">⚡ Mismo día</SelectItem>
                    <SelectItem value="24_horas">📅 24 horas</SelectItem>
                    <SelectItem value="48_horas">📅 48 horas</SelectItem>
                    <SelectItem value="3_dias">📅 3 días</SelectItem>
                    <SelectItem value="semana">📅 1 semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="canales_distribucion" className="text-amber-700 font-medium">🔄 Canales de distribución finales</Label>
              <Textarea
                id="canales_distribucion"
                value={formData.canales_distribucion || ''}
                onChange={(e) => setFormData({ ...formData, canales_distribucion: e.target.value })}
                placeholder="Ej: Venta directa al consumidor, distribución a bodegas, provee a restaurantes locales"
                rows={3}
                className="border-amber-300 focus:border-amber-500 bg-white"
              />
              <p className="text-sm text-amber-600">💡 ¿Cómo llega el producto al consumidor final?</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientes_alternativos" className="text-amber-700 font-medium">🔄 Clientes alternativos (backup)</Label>
              <Textarea
                id="clientes_alternativos"
                value={formData.clientes_alternativos || ''}
                onChange={(e) => setFormData({ ...formData, clientes_alternativos: e.target.value })}
                placeholder="Ej: Mercado de Chilca, Supermercados Metro, Restaurant El Dorado, Agrocentro Los Andes"
                rows={3}
                className="border-amber-300 focus:border-amber-500 bg-white"
              />
              <p className="text-sm text-amber-600">🔍 Clientes backup en caso de cancelaciones o problemas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contacto_emergencia" className="text-amber-700 font-medium">🆘 Contacto de emergencia</Label>
                <Input
                  id="contacto_emergencia"
                  value={formData.contacto_emergencia || ''}
                  onChange={(e) => setFormData({ ...formData, contacto_emergencia: e.target.value })}
                  placeholder="Ej: Ana López - 964 789 123"
                  className="border-amber-300 focus:border-amber-500 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dias_operacion" className="text-amber-700 font-medium">📅 Días de operación</Label>
                <Select value={formData.dias_operacion || ''} onValueChange={(value) => setFormData({ ...formData, dias_operacion: value })}>
                  <SelectTrigger className="border-amber-300 bg-white">
                    <SelectValue placeholder="Horarios de trabajo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lunes_viernes">📅 Lunes a Viernes</SelectItem>
                    <SelectItem value="lunes_sabado">📅 Lunes a Sábado</SelectItem>
                    <SelectItem value="todos_dias">📅 Todos los días</SelectItem>
                    <SelectItem value="fines_semana">📅 Solo fines de semana</SelectItem>
                    <SelectItem value="variable">📅 Horario variable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Análisis IA integrado */}
            {formData.tipo && formData.volumen_compra_min && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="text-md font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  🤖 Análisis Comercial Inteligente
                </h4>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const volumen = formData.volumen_compra_min || 0;
                    const frecuencia = formData.frecuencia || '';
                    let categoria = 'CLIENTE ESTÁNDAR';
                    let color = 'bg-yellow-100';
                    
                    if (volumen > 2000 && ['diario', 'interdiario'].includes(frecuencia)) {
                      categoria = 'CLIENTE VIP - Alto volumen';
                      color = 'bg-green-100';
                    } else if (volumen < 100) {
                      categoria = 'CLIENTE OCASIONAL - Bajo volumen';
                      color = 'bg-orange-100';
                    }
                    
                    return (
                      <div className={`p-2 rounded ${color}`}>
                        🏆 {categoria}
                      </div>
                    );
                  })()}
                  <p className="text-gray-600">
                    💡 Potencial de venta: {formData.volumen_compra_min ? 
                      `${formData.volumen_compra_min * (formData.frecuencia === 'diario' ? 30 : formData.frecuencia === 'semanal' ? 4 : 2)} kg/mes aprox.` : 
                      'Calcular con datos de volumen'}
                  </p>
                  <p className="text-gray-600">
                    🎯 Prioridad comercial: {formData.calificacion_cliente >= 4 ? 'ALTA' : formData.calificacion_cliente >= 3 ? 'MEDIA' : 'REVISAR'}
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
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center space-x-3">
          {[1, 2, 3, 4].map((paso) => (
            <div key={paso} className="flex items-center">
              <div                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  paso === pasoActual
                    ? 'bg-blue-500 text-white shadow-md'
                    : paso < pasoActual
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {paso < pasoActual ? '✓' : paso}
              </div>
              {paso < 4 && (
                <div
                  className={`w-8 h-1 mx-2 rounded-full transition-all duration-300 ${
                    paso < pasoActual ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm font-medium text-blue-700 bg-white px-3 py-1 rounded-full">
          Paso {pasoActual} de {totalPasos}
        </div>
      </div>

      {/* Contenido del paso actual */}
      {renderPaso()}

      {/* Navegación mejorada */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={() => setPasoActual(Math.max(1, pasoActual - 1))}
          disabled={pasoActual === 1}
          className="flex items-center gap-2 px-6 py-2 border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          ← Anterior
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setPasoActual(Math.min(totalPasos, pasoActual + 1))}
            disabled={pasoActual === totalPasos}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            {pasoActual === totalPasos ? 'Finalizar' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 👷 FORMULARIO INTELIGENTE PARA TRABAJADORES MEJORADO
const FormularioTrabajadorInteligente: React.FC<{ formData: any; setFormData: (data: any) => void; ubicacionesExistentes: UbicacionGeodata[] }> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 4; // Expandido a 4 pasos

  const handleUbicacionSeleccionada = (ubicacion: UbicacionGeodata) => {
    setFormData({ 
      ...formData, 
      ubicacion,
      departamento: ubicacion.departamento,
      provincia: ubicacion.provincia,
      distrito: ubicacion.distrito 
    });
  };

  // Cálculo de análisis inteligente de trabajador
  const calcularAnalisisLaboral = () => {
    const experiencia = formData.experiencia || 0;
    const calificacion = formData.calificacion || 0;
    const salario = formData.salario || 0;
    
    let categoria = 'Principiante';
    let potencialRendimiento = 'Medio';
    let recomendaciones = [];

    if (experiencia >= 10 && calificacion >= 4) {
      categoria = 'Experto Senior';
      potencialRendimiento = 'Muy Alto';
      recomendaciones.push('Ideal para roles de supervisión');
    } else if (experiencia >= 5 && calificacion >= 3) {
      categoria = 'Experimentado';
      potencialRendimiento = 'Alto';
      recomendaciones.push('Puede liderar equipos pequeños');
    } else if (experiencia >= 2) {
      categoria = 'Intermedio';
      potencialRendimiento = 'Medio-Alto';
      recomendaciones.push('Requiere supervisión ocasional');
    } else {
      recomendaciones.push('Necesita entrenamiento y supervisión constante');
    }

    if (salario < 1000) recomendaciones.push('Considerar ajuste salarial competitivo');
    if (calificacion < 3) recomendaciones.push('Implementar plan de mejora de desempeño');

    return { categoria, potencialRendimiento, recomendaciones };
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Información Personal del Trabajador</h3>
                  <p className="text-green-100">Complete los datos básicos del trabajador</p>
                </div>
              </div>
            </div>

            {/* Sección 1: Datos Personales */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 shadow-sm">
              <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                👤 Datos Personales
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre" className="text-green-700 font-medium">Nombres *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Juan Carlos"
                    className="border-green-300 focus:border-green-500 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos" className="text-green-700 font-medium">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos || ''}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    placeholder="Ej: Pérez González"
                    className="border-green-300 focus:border-green-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="telefono" className="text-green-700 font-medium">📱 Teléfono de contacto</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Ej: 987654321"
                    className="border-green-300 focus:border-green-500 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="dni" className="text-green-700 font-medium">🪪 DNI</Label>
                  <Input
                    id="dni"
                    value={formData.dni || ''}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    placeholder="Ej: 12345678"
                    className="border-green-300 focus:border-green-500 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edad" className="text-green-700 font-medium">🎂 Edad</Label>
                  <Input
                    id="edad"
                    type="number"
                    min="18"
                    max="70"
                    value={formData.edad || ''}
                    onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) })}
                    placeholder="Ej: 35"
                    className="border-green-300 focus:border-green-500 bg-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="direccion" className="text-green-700 font-medium">🏠 Dirección de residencia</Label>
                <Input
                  id="direccion"
                  value={formData.direccion || ''}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Ej: Jr. Los Andes 123, Huancayo"
                  className="border-green-300 focus:border-green-500 bg-white"
                />
              </div>
            </div>

            {/* Sección 2: Información Laboral */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg border border-teal-200 shadow-sm">
              <h4 className="text-lg font-semibold text-teal-700 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                👷 Información Laboral
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rol" className="text-teal-700 font-medium">Rol/Función *</Label>
                  <Select value={formData.rol || ''} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
                    <SelectTrigger className="border-teal-300 bg-white">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agricultor">🌾 Agricultor</SelectItem>
                      <SelectItem value="operador_maquinaria">🚜 Operador de maquinaria</SelectItem>
                      <SelectItem value="supervisor">👨‍💼 Supervisor</SelectItem>
                      <SelectItem value="veterinario">🐄 Veterinario</SelectItem>
                      <SelectItem value="administrador">💼 Administrador</SelectItem>
                      <SelectItem value="tecnico_riego">💧 Técnico en riego</SelectItem>
                      <SelectItem value="almacenero">📦 Almacenero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="especialidad" className="text-teal-700 font-medium">🎯 Especialidad</Label>
                  <Input
                    id="especialidad"
                    value={formData.especialidad || ''}
                    onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                    placeholder="Ej: Cultivos andinos, Riego tecnificado"
                    className="border-teal-300 focus:border-teal-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="experiencia" className="text-teal-700 font-medium">📅 Experiencia (años)</Label>
                  <Input
                    id="experiencia"
                    type="number"
                    min="0"
                    value={formData.experiencia || ''}
                    onChange={(e) => setFormData({ ...formData, experiencia: parseInt(e.target.value) })}
                    placeholder="Ej: 5"
                    className="border-teal-300 focus:border-teal-500 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="salario" className="text-teal-700 font-medium">💰 Salario (soles/mes)</Label>
                  <Input
                    id="salario"
                    type="number"
                    min="0"
                    value={formData.salario || ''}
                    onChange={(e) => setFormData({ ...formData, salario: parseFloat(e.target.value) })}
                    placeholder="Ej: 1200"
                    className="border-teal-300 focus:border-teal-500 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="disponibilidad" className="text-teal-700 font-medium">⏰ Disponibilidad</Label>
                  <Select value={formData.disponibilidad || ''} onValueChange={(value) => setFormData({ ...formData, disponibilidad: value })}>
                    <SelectTrigger className="border-teal-300 bg-white">
                      <SelectValue placeholder="Seleccionar disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiempo_completo">🕘 Tiempo completo</SelectItem>
                      <SelectItem value="medio_tiempo">🕐 Medio tiempo</SelectItem>
                      <SelectItem value="temporal">📅 Temporal</SelectItem>
                      <SelectItem value="estacional">🌱 Estacional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="habilidades" className="text-teal-700 font-medium">🛠️ Habilidades específicas</Label>
                <Textarea
                  id="habilidades"
                  value={Array.isArray(formData.habilidades) ? formData.habilidades.join(', ') : formData.habilidades || ''}
                  onChange={(e) => setFormData({ ...formData, habilidades: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="Ej: manejo de tractor, sistemas de riego, control de plagas, cosecha manual"
                  className="border-teal-300 focus:border-teal-500 bg-white"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">💡 Separar con comas.</p>
              </div>
            </div>

            {/* Sección 3: Formación y Certificaciones */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200 shadow-sm">
              <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                🎓 Formación y Certificaciones
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nivel_educativo" className="text-amber-700 font-medium">📚 Nivel educativo</Label>
                  <Select value={formData.nivel_educativo || ''} onValueChange={(value) => setFormData({ ...formData, nivel_educativo: value })}>
                    <SelectTrigger className="border-amber-300 bg-white">
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primaria">📖 Primaria</SelectItem>
                      <SelectItem value="secundaria">📚 Secundaria</SelectItem>
                      <SelectItem value="tecnico">🔧 Técnico</SelectItem>
                      <SelectItem value="universitario">🎓 Universitario</SelectItem>
                      <SelectItem value="postgrado">👨‍🎓 Postgrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="instituciones" className="text-amber-700 font-medium">🏫 Instituciones de formación</Label>
                  <Input
                    id="instituciones"
                    value={formData.instituciones || ''}
                    onChange={(e) => setFormData({ ...formData, instituciones: e.target.value })}
                    placeholder="Ej: INIA, SENASA, Universidad Nacional del Centro"
                    className="border-amber-300 focus:border-amber-500 bg-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="certificaciones" className="text-amber-700 font-medium">🏆 Certificaciones y cursos</Label>
                <Textarea
                  id="certificaciones"
                  value={formData.certificaciones || ''}
                  onChange={(e) => setFormData({ ...formData, certificaciones: e.target.value })}
                  placeholder="Ej: Certificación en BPA, Curso de manejo integrado de plagas, Capacitación en riego tecnificado"
                  className="border-amber-300 focus:border-amber-500 bg-white"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">🏅 Incluya certificaciones relevantes para la agricultura.</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ubicación y Movilidad</h3>
                  <p className="text-blue-100">Seleccione la ubicación de trabajo y datos de movilidad</p>
                </div>
              </div>
            </div>

            <SelectorMapaInteractivo
              ubicacionSeleccionada={formData.ubicacion}
              onUbicacionSeleccionada={handleUbicacionSeleccionada}
              ubicacionesExistentes={ubicacionesExistentes}
            />

            {/* Información adicional de movilidad */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm">
              <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <Car className="h-5 w-5" />
                🚗 Información de Movilidad
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medio_transporte" className="text-blue-700 font-medium">🚌 Medio de transporte principal</Label>
                  <Select value={formData.medio_transporte || ''} onValueChange={(value) => setFormData({ ...formData, medio_transporte: value })}>
                    <SelectTrigger className="border-blue-300 bg-white">
                      <SelectValue placeholder="Seleccionar transporte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="propio">🚗 Vehículo propio</SelectItem>
                      <SelectItem value="motocicleta">🏍️ Motocicleta</SelectItem>
                      <SelectItem value="bicicleta">🚲 Bicicleta</SelectItem>
                      <SelectItem value="publico">🚌 Transporte público</SelectItem>
                      <SelectItem value="a_pie">🚶 A pie</SelectItem>
                      <SelectItem value="empresa">🚐 Transporte de empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="licencia_conducir" className="text-blue-700 font-medium">🪪 Licencia de conducir</Label>
                  <Select value={formData.licencia_conducir || ''} onValueChange={(value) => setFormData({ ...formData, licencia_conducir: value })}>
                    <SelectTrigger className="border-blue-300 bg-white">
                      <SelectValue placeholder="Tipo de licencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ninguna">❌ No tiene</SelectItem>
                      <SelectItem value="A1">🏍️ A1 - Motocicleta</SelectItem>
                      <SelectItem value="B1">🚗 B1 - Auto</SelectItem>
                      <SelectItem value="B2a">🚐 B2a - Camioneta</SelectItem>
                      <SelectItem value="B2b">🚛 B2b - Camión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="radio_movilidad" className="text-blue-700 font-medium">📏 Radio de movilidad (km)</Label>
                  <Input
                    id="radio_movilidad"
                    type="number"
                    min="1"
                    max="200"
                    value={formData.radio_movilidad || ''}
                    onChange={(e) => setFormData({ ...formData, radio_movilidad: parseInt(e.target.value) })}
                    placeholder="Ej: 25"
                    className="border-blue-300 focus:border-blue-500 bg-white"
                  />
                  <p className="text-sm text-gray-500 mt-1">🗺️ Distancia máxima que puede viajar para trabajar.</p>
                </div>
                <div>
                  <Label htmlFor="costo_movilidad" className="text-blue-700 font-medium">💸 Costo de movilidad diaria (soles)</Label>
                  <Input
                    id="costo_movilidad"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.costo_movilidad || ''}
                    onChange={(e) => setFormData({ ...formData, costo_movilidad: parseFloat(e.target.value) })}
                    placeholder="Ej: 15.50"
                    className="border-blue-300 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Condiciones Laborales</h3>
                  <p className="text-purple-100">Configure horarios, beneficios y condiciones de trabajo</p>
                </div>
              </div>
            </div>

            {/* Sección 1: Horarios y Disponibilidad */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm">
              <h4 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                ⏰ Horarios y Disponibilidad
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horario_inicio" className="text-purple-700 font-medium">🌅 Hora de inicio</Label>
                  <Input
                    id="horario_inicio"
                    type="time"
                    value={formData.horario_inicio || ''}
                    onChange={(e) => setFormData({ ...formData, horario_inicio: e.target.value })}
                    className="border-purple-300 focus:border-purple-500 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="horario_fin" className="text-purple-700 font-medium">🌇 Hora de finalización</Label>
                  <Input
                    id="horario_fin"
                    type="time"
                    value={formData.horario_fin || ''}
                    onChange={(e) => setFormData({ ...formData, horario_fin: e.target.value })}
                    className="border-purple-300 focus:border-purple-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="dias_trabajo" className="text-purple-700 font-medium">📅 Días de trabajo</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => (
                      <div key={dia} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`dia-${index}`}
                          checked={formData.dias_trabajo?.includes(dia) || false}
                          onChange={(e) => {
                            const dias = formData.dias_trabajo || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, dias_trabajo: [...dias, dia] });
                            } else {
                              setFormData({ ...formData, dias_trabajo: dias.filter(d => d !== dia) });
                            }
                          }}
                          className="rounded border-purple-300"
                        />
                        <label htmlFor={`dia-${index}`} className="text-sm font-medium text-purple-700">{dia}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="horas_extras" className="text-purple-700 font-medium">⏳ Disponibilidad horas extras</Label>
                  <Select value={formData.horas_extras || ''} onValueChange={(value) => setFormData({ ...formData, horas_extras: value })}>
                    <SelectTrigger className="border-purple-300 bg-white">
                      <SelectValue placeholder="Seleccionar disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">✅ Sí, disponible</SelectItem>
                      <SelectItem value="limitado">⚠️ Limitado (ocasional)</SelectItem>
                      <SelectItem value="no">❌ No disponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sección 2: Beneficios y Condiciones */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200 shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                💼 Beneficios y Condiciones
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-indigo-700 font-medium">🏥 Beneficios incluidos</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      { key: 'seguro_salud', label: '🏥 Seguro de salud' },
                      { key: 'vacaciones', label: '🏖️ Vacaciones pagadas' },
                      { key: 'gratificaciones', label: '💰 Gratificaciones' },
                      { key: 'cts', label: '🏛️ CTS' },
                      { key: 'alimentacion', label: '🍽️ Alimentación' },
                      { key: 'transporte', label: '🚌 Transporte' },
                      { key: 'uniforme', label: '👕 Uniforme/EPP' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={key}
                          checked={formData.beneficios?.[key] || false}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            beneficios: { ...formData.beneficios, [key]: e.target.checked }
                          })}
                          className="rounded border-indigo-300"
                        />
                        <label htmlFor={key} className="text-sm text-indigo-700">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="tipo_contrato" className="text-indigo-700 font-medium">📄 Tipo de contrato</Label>
                  <Select value={formData.tipo_contrato || ''} onValueChange={(value) => setFormData({ ...formData, tipo_contrato: value })}>
                    <SelectTrigger className="border-indigo-300 bg-white">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indefinido">📜 Plazo indefinido</SelectItem>
                      <SelectItem value="fijo">📝 Plazo fijo</SelectItem>
                      <SelectItem value="temporal">⏱️ Temporal</SelectItem>
                      <SelectItem value="estacional">🌱 Estacional</SelectItem>
                      <SelectItem value="locacion">🤝 Locación de servicios</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="mt-4">
                    <Label htmlFor="fecha_inicio_contrato" className="text-indigo-700 font-medium">📅 Fecha inicio contrato</Label>
                    <Input
                      id="fecha_inicio_contrato"
                      type="date"
                      value={formData.fecha_inicio_contrato || ''}
                      onChange={(e) => setFormData({ ...formData, fecha_inicio_contrato: e.target.value })}
                      className="border-indigo-300 focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="periodo_prueba" className="text-indigo-700 font-medium">🔍 Período de prueba (días)</Label>
                    <Input
                      id="periodo_prueba"
                      type="number"
                      min="0"
                      max="180"
                      value={formData.periodo_prueba || ''}
                      onChange={(e) => setFormData({ ...formData, periodo_prueba: parseInt(e.target.value) })}
                      placeholder="Ej: 90"
                      className="border-indigo-300 focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Emergencias y Análisis Final</h3>
                  <p className="text-red-100">Información de emergencia y análisis inteligente del trabajador</p>
                </div>
              </div>
            </div>

            {/* Sección 1: Contactos de Emergencia */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200 shadow-sm">
              <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                🚨 Contactos de Emergencia
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contacto_emergencia_nombre" className="text-red-700 font-medium">👤 Nombre del contacto</Label>
                  <Input
                    id="contacto_emergencia_nombre"
                    value={formData.contacto_emergencia_nombre || ''}
                    onChange={(e) => setFormData({ ...formData, contacto_emergencia_nombre: e.target.value })}
                    placeholder="Ej: María Pérez Huamán"
                    className="border-red-300 focus:border-red-500 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="contacto_emergencia_telefono" className="text-red-700 font-medium">📞 Teléfono de emergencia</Label>
                  <Input
                    id="contacto_emergencia_telefono"
                    value={formData.contacto_emergencia_telefono || ''}
                    onChange={(e) => setFormData({ ...formData, contacto_emergencia_telefono: e.target.value })}
                    placeholder="Ej: 987123456"
                    className="border-red-300 focus:border-red-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="parentesco" className="text-red-700 font-medium">👨‍👩‍👧‍👦 Parentesco</Label>
                  <Select value={formData.parentesco || ''} onValueChange={(value) => setFormData({ ...formData, parentesco: value })}>
                    <SelectTrigger className="border-red-300 bg-white">
                      <SelectValue placeholder="Seleccionar parentesco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="esposo/a">💑 Esposo/a</SelectItem>
                      <SelectItem value="padre">👨 Padre</SelectItem>
                      <SelectItem value="madre">👩 Madre</SelectItem>
                      <SelectItem value="hermano/a">👫 Hermano/a</SelectItem>
                      <SelectItem value="hijo/a">👶 Hijo/a</SelectItem>
                      <SelectItem value="otro">👤 Otro familiar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="trabajadores_backup" className="text-red-700 font-medium">🔄 Trabajadores de reemplazo</Label>
                  <Input
                    id="trabajadores_backup"
                    value={Array.isArray(formData.trabajadores_backup) ? formData.trabajadores_backup.join(', ') : formData.trabajadores_backup || ''}
                    onChange={(e) => setFormData({ ...formData, trabajadores_backup: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Ej: Carlos Mendoza, Ana Torres"
                    className="border-red-300 focus:border-red-500 bg-white"
                  />
                  <p className="text-sm text-gray-500 mt-1">🔍 Separar con comas.</p>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="cobertura_geografica" className="text-red-700 font-medium">🗺️ Cobertura geográfica de trabajo</Label>
                <Textarea
                  id="cobertura_geografica"
                  value={Array.isArray(formData.cobertura_geografica) ? formData.cobertura_geografica.join(', ') : formData.cobertura_geografica || ''}
                  onChange={(e) => setFormData({ ...formData, cobertura_geografica: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="Ej: Valle del Mantaro, Jauja, Concepción, Huancayo"
                  className="border-red-300 focus:border-red-500 bg-white"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">💡 Áreas geográficas donde puede trabajar efectivamente.</p>
              </div>
            </div>

            {/* Sección 2: Evaluación y Calificación */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 shadow-sm">
              <h4 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                ⭐ Evaluación y Desempeño
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calificacion" className="text-yellow-700 font-medium">🌟 Calificación general</Label>
                  <Select value={formData.calificacion?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, calificacion: parseInt(value) })}>
                    <SelectTrigger className="border-yellow-300 bg-white">
                      <SelectValue placeholder="Calificar desempeño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">⭐ 1 estrella - Deficiente</SelectItem>
                      <SelectItem value="2">⭐⭐ 2 estrellas - Regular</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ 3 estrellas - Bueno</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ 4 estrellas - Muy bueno</SelectItem>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ 5 estrellas - Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fecha_evaluacion" className="text-yellow-700 font-medium">📅 Fecha de última evaluación</Label>
                  <Input
                    id="fecha_evaluacion"
                    type="date"
                    value={formData.fecha_evaluacion || ''}
                    onChange={(e) => setFormData({ ...formData, fecha_evaluacion: e.target.value })}
                    className="border-yellow-300 focus:border-yellow-500 bg-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="observaciones" className="text-yellow-700 font-medium">📝 Observaciones y comentarios</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones || ''}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Ej: Trabajador muy responsable, puntual y con buena disposición. Requiere capacitación en nuevas técnicas de riego..."
                  className="border-yellow-300 focus:border-yellow-500 bg-white"
                  rows={4}
                />
              </div>
            </div>

            {/* Sección 3: Análisis Inteligente */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg border border-emerald-200 shadow-sm">
              <h4 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                🧠 Análisis Inteligente del Trabajador
              </h4>

              {(() => {
                const analisis = calcularAnalisisLaboral();
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-emerald-200">
                        <div className="text-sm font-medium text-emerald-600">Categoría</div>
                        <div className="text-lg font-bold text-emerald-800">{analisis.categoria}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-emerald-200">
                        <div className="text-sm font-medium text-emerald-600">Potencial Rendimiento</div>
                        <div className="text-lg font-bold text-emerald-800">{analisis.potencialRendimiento}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-emerald-200">
                        <div className="text-sm font-medium text-emerald-600">Experiencia</div>
                        <div className="text-lg font-bold text-emerald-800">{formData.experiencia || 0} años</div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-emerald-200">
                      <div className="text-sm font-medium text-emerald-600 mb-2">🎯 Recomendaciones del Sistema</div>
                      <ul className="space-y-1">
                        {analisis.recomendaciones.map((rec, index) => (
                          <li key={index} className="text-sm text-emerald-700 flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-emerald-200">
                      <div className="text-sm font-medium text-emerald-600 mb-2">📊 Resumen de Datos</div>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <p><strong>Salario:</strong> S/ {formData.salario || 0} mensuales</p>
                        <p><strong>Disponibilidad:</strong> {formData.disponibilidad || 'No especificada'}</p>
                        <p><strong>Movilidad:</strong> {formData.medio_transporte || 'No especificado'} - Radio {formData.radio_movilidad || 0} km</p>
                        <p><strong>Especialidad:</strong> {formData.especialidad || 'Sin especialidad definida'}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
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
                <div                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    paso === pasoActual
                      ? 'bg-white text-green-600 shadow-md'
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
