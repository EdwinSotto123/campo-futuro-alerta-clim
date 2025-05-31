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
import {
  Sprout, Users, Store, Truck, Package, Droplets, Warehouse, 
  Coins, TrendingUp, Calendar, MapPin, Phone, Mail, Star,
  Plus, Edit, Trash2, Eye, Settings, BarChart3, Thermometer,
  CloudRain, Sun, Wind, Leaf, Zap, Target, Clock, Activity
} from 'lucide-react';

// 🌱 TIPOS DE DATOS PARA LA GRANJA VIRTUAL
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
}

interface Almacen {
  id: string;
  nombre: string;
  tipo: 'productos_agricolas' | 'semillas' | 'fertilizantes' | 'herramientas' | 'maquinaria';
  capacidad_total: number; // en toneladas o unidades
  capacidad_usada: number;
  ubicacion: string;
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
const FILAS_GRANJA = 8;
const COLUMNAS_GRANJA = 12;
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
  };

  // 🎨 FUNCIÓN PARA OBTENER EL ESTILO VISUAL DE CADA CELDA
  const obtenerEstiloCelda = (celda: CeldaGranja) => {
    const estilosBase = "w-full h-24 border-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col items-center justify-center text-center p-2";
    
    switch (celda.tipo) {
      case 'cultivo':
        const cultivo = celda.datos as Cultivo;
        return {
          className: `${estilosBase} bg-gradient-to-br from-green-100 to-green-200 border-green-400 hover:shadow-lg`,
          icon: '🌱',
          emoji: obtenerEmojiCultivo(cultivo?.tipo || 'papa'),
          texto: cultivo?.nombre || 'Cultivo',
          subtexto: cultivo?.etapaCrecimiento || 'Nuevo'
        };
      
      case 'proveedor':
        const proveedor = celda.datos as Proveedor;
        return {
          className: `${estilosBase} bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 hover:shadow-lg`,
          icon: '🏪',
          emoji: obtenerEmojiProveedor(proveedor?.tipo || 'semillas'),
          texto: proveedor?.nombre || 'Proveedor',
          subtexto: proveedor?.tipo || 'Nuevo'
        };
      
      case 'cliente':
        const cliente = celda.datos as Cliente;
        return {
          className: `${estilosBase} bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400 hover:shadow-lg`,
          icon: '👥',
          emoji: obtenerEmojiCliente(cliente?.tipo || 'mayorista'),
          texto: cliente?.nombre || 'Cliente',
          subtexto: cliente?.tipo || 'Nuevo'
        };
      
      case 'trabajador':
        const trabajador = celda.datos as Trabajador;
        return {
          className: `${estilosBase} bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 hover:shadow-lg`,
          icon: '👨‍🌾',
          emoji: obtenerEmojiTrabajador(trabajador?.rol || 'agricultor'),
          texto: trabajador?.nombre || 'Trabajador',
          subtexto: trabajador?.rol || 'Nuevo'
        };
      
      case 'almacen':
        const almacen = celda.datos as Almacen;
        return {
          className: `${estilosBase} bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 hover:shadow-lg`,
          icon: '🏭',
          emoji: obtenerEmojiAlmacen(almacen?.tipo || 'productos_agricolas'),
          texto: almacen?.nombre || 'Almacén',
          subtexto: almacen?.tipo || 'Nuevo'
        };
      
      case 'reservorio':
        const reservorio = celda.datos as Reservorio;
        return {
          className: `${estilosBase} bg-gradient-to-br from-cyan-100 to-cyan-200 border-cyan-400 hover:shadow-lg`,
          icon: '💧',
          emoji: obtenerEmojiReservorio(reservorio?.tipo || 'artificial'),
          texto: reservorio?.nombre || 'Reservorio',
          subtexto: `${reservorio?.nivel_actual || 0}%`
        };
      
      default:
        return {
          className: `${estilosBase} bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-gray-400`,
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
        </div>

        {/* 🗺️ VISTA PRINCIPAL DE LA GRANJA */}
        {vistaActual === 'granja' && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-6 w-6" />
                Tu Granja Virtual ({FILAS_GRANJA}x{COLUMNAS_GRANJA})
              </CardTitle>
              <CardDescription>
                Haz click en cualquier parcela para agregar cultivos, proveedores, clientes, trabajadores, almacenes o reservorios
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Grid de la granja */}
              <div 
                className="grid gap-2 auto-rows-fr"
                style={{ gridTemplateColumns: `repeat(${COLUMNAS_GRANJA}, 1fr)` }}
              >
                {granja.map((celda) => {
                  const estilo = obtenerEstiloCelda(celda);
                  return (
                    <div
                      key={celda.id}
                      className={estilo.className}
                      onClick={() => manejarClickCelda(celda)}
                    >
                      <div className="text-2xl mb-1">{estilo.emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{estilo.texto}</div>
                      <div className="text-xs text-gray-500">{estilo.subtexto}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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
        )}
        {tipoSeleccionado === 'proveedor' && (
          <FormularioProveedor formData={formData} setFormData={setFormData} />
        )}
        {tipoSeleccionado === 'cliente' && (
          <FormularioCliente formData={formData} setFormData={setFormData} />
        )}
        {tipoSeleccionado === 'trabajador' && (
          <FormularioTrabajador formData={formData} setFormData={setFormData} />
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

// 🌱 FORMULARIO PARA CULTIVOS
const FormularioCultivo: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del cultivo</Label>
          <Input
            id="nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Papa Huayro"
          />
        </div>
        <div>
          <Label htmlFor="tipo">Tipo de cultivo</Label>
          <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="papa">🥔 Papa</SelectItem>
              <SelectItem value="quinua">🌾 Quinua</SelectItem>
              <SelectItem value="maiz">🌽 Maíz</SelectItem>
              <SelectItem value="habas">🫘 Habas</SelectItem>
              <SelectItem value="oca">🟣 Oca</SelectItem>
              <SelectItem value="ulluco">🟡 Ulluco</SelectItem>
              <SelectItem value="cebada">🌾 Cebada</SelectItem>
              <SelectItem value="trigo">🌾 Trigo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="variedad">Variedad</Label>
          <Input
            id="variedad"
            value={formData.variedad || ''}
            onChange={(e) => setFormData({ ...formData, variedad: e.target.value })}
            placeholder="Ej: Huayro, Peruanita, etc."
          />
        </div>
        <div>
          <Label htmlFor="area">Área (hectáreas)</Label>
          <Input
            id="area"
            type="number"
            step="0.1"
            value={formData.area || ''}
            onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
            placeholder="Ej: 2.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fechaPlantacion">Fecha de plantación</Label>
          <Input
            id="fechaPlantacion"
            type="date"
            value={formData.fechaPlantacion || ''}
            onChange={(e) => setFormData({ ...formData, fechaPlantacion: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="fechaCosechaEstimada">Fecha estimada de cosecha</Label>
          <Input
            id="fechaCosechaEstimada"
            type="date"
            value={formData.fechaCosechaEstimada || ''}
            onChange={(e) => setFormData({ ...formData, fechaCosechaEstimada: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="etapaCrecimiento">Etapa de crecimiento</Label>
          <Select value={formData.etapaCrecimiento || ''} onValueChange={(value) => setFormData({ ...formData, etapaCrecimiento: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semilla">🌰 Semilla</SelectItem>
              <SelectItem value="germinacion">🌱 Germinación</SelectItem>
              <SelectItem value="crecimiento">🌿 Crecimiento</SelectItem>
              <SelectItem value="floracion">🌸 Floración</SelectItem>
              <SelectItem value="fructificacion">🍃 Fructificación</SelectItem>
              <SelectItem value="cosecha">🌾 Lista para cosecha</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rendimientoEstimado">Rendimiento estimado (kg/ha)</Label>
          <Input
            id="rendimientoEstimado"
            type="number"
            value={formData.rendimientoEstimado || ''}
            onChange={(e) => setFormData({ ...formData, rendimientoEstimado: parseFloat(e.target.value) })}
            placeholder="Ej: 15000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notas">Notas adicionales</Label>
        <Textarea
          id="notas"
          value={formData.notas || ''}
          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
          placeholder="Observaciones, tratamientos aplicados, etc."
          rows={3}
        />
      </div>
    </div>
  );
};

// 🏪 FORMULARIO PARA PROVEEDORES
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

      <div>
        <Label htmlFor="ubicacion">Ubicación</Label>
        <Input
          id="ubicacion"
          value={formData.ubicacion || ''}
          onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
          placeholder="Ej: Sector Norte de la finca"
        />
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
    </div>
  );
};

// 💧 FORMULARIO PARA RESERVORIOS
const FormularioReservorio: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
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
    </div>
  );
};

export default MiGranjaVirtual;
