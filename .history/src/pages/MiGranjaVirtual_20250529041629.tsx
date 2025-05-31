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

// 🏪 FORMULARIO INTELIGENTE PARA PROVEEDORES
const FormularioProveedorInteligente: React.FC<{ formData: any; setFormData: (data: any) => void; ubicacionesExistentes: UbicacionGeodata[] }> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 3;

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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
              <Store className="h-5 w-5" />
              Paso 1: Información Básica del Proveedor
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">🏪 Nombre del proveedor *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: AgroSemillas del Norte SAC"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="tipo">📦 Tipo de proveedor *</Label>
                <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger className="border-orange-200">
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
              <Label>📞 Información de contacto</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="📱 Teléfono"
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="border-orange-200 focus:border-orange-400"
                />
                <Input
                  placeholder="📧 Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="confiabilidad">⭐ Calificación (1-5 estrellas)</Label>
                <Select value={formData.confiabilidad?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, confiabilidad: parseInt(value) })}>
                  <SelectTrigger className="border-orange-200">
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
                <Label htmlFor="tiempoEntrega">🚚 Tiempo de entrega</Label>
                <Input
                  id="tiempoEntrega"
                  value={formData.tiempoEntrega || ''}
                  onChange={(e) => setFormData({ ...formData, tiempoEntrega: e.target.value })}
                  placeholder="Ej: 2-3 días hábiles"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <SelectorMapaInteractivo
              ubicacionSeleccionada={formData.ubicacion}
              onUbicacionSeleccionada={handleUbicacionSeleccionada}
              ubicacionesExistentes={ubicacionesExistentes}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Paso 3: Capacidades Logísticas
            </h3>
            
            <div>
              <Label htmlFor="zonas_cobertura">🗺️ Zonas de cobertura</Label>
              <Input
                id="zonas_cobertura"
                value={formData.zonas_cobertura || ''}
                onChange={(e) => setFormData({ ...formData, zonas_cobertura: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: Lima, Junín, Huancavelica"
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-sm text-gray-500 mt-1">💡 Separar con comas. ¿A qué regiones entrega?</p>
            </div>

            <div>
              <Label htmlFor="backup_proveedores">🔄 Proveedores alternativos</Label>
              <Textarea
                id="backup_proveedores"
                value={formData.backup_proveedores || ''}
                onChange={(e) => setFormData({ ...formData, backup_proveedores: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: AgroLima SAC, Distribuidora Andina, Cooperativa El Mantaro"
                rows={3}
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-sm text-gray-500 mt-1">🔍 La IA evaluará riesgos de dependencia única.</p>
            </div>
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
          {[1, 2, 3].map((paso) => (
            <div
              key={paso}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                paso === pasoActual
                  ? 'bg-orange-600 text-white'
                  : paso < pasoActual
                  ? 'bg-orange-200 text-orange-800'
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
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
};

// 👥 FORMULARIO INTELIGENTE PARA CLIENTES
const FormularioClienteInteligente: React.FC<{ formData: any; setFormData: (data: any) => void; ubicacionesExistentes: UbicacionGeodata[] }> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 3;

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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Paso 1: Información del Cliente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">👤 Nombre del cliente *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Mercado Central de Huancayo"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="tipo">🏢 Tipo de cliente *</Label>
                <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mayorista">🏪 Mayorista</SelectItem>
                    <SelectItem value="minorista">🛒 Minorista</SelectItem>
                    <SelectItem value="restaurante">🍽️ Restaurante</SelectItem>
                    <SelectItem value="mercado_local">🏛️ Mercado local</SelectItem>
                    <SelectItem value="exportacion">✈️ Exportación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precio_promedio">💰 Precio promedio (soles/kg)</Label>
                <Input
                  id="precio_promedio"
                  type="number"
                  step="0.1"
                  value={formData.precio_promedio || ''}
                  onChange={(e) => setFormData({ ...formData, precio_promedio: parseFloat(e.target.value) })}
                  placeholder="Ej: 3.50"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="volumen_compra">📦 Volumen de compra</Label>
                <Input
                  id="volumen_compra"
                  value={formData.volumen_compra || ''}
                  onChange={(e) => setFormData({ ...formData, volumen_compra: e.target.value })}
                  placeholder="Ej: 500-1000 kg/semana"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frecuencia">⏰ Frecuencia de compra</Label>
                <Select value={formData.frecuencia || ''} onValueChange={(value) => setFormData({ ...formData, frecuencia: value })}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="¿Cada cuánto compra?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">📅 Diario</SelectItem>
                    <SelectItem value="semanal">📆 Semanal</SelectItem>
                    <SelectItem value="quincenal">📋 Quincenal</SelectItem>
                    <SelectItem value="mensual">🗓️ Mensual</SelectItem>
                    <SelectItem value="estacional">🗂️ Estacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="calificacion">⭐ Calificación como cliente</Label>
                <Select value={formData.calificacion?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, calificacion: parseInt(value) })}>
                  <SelectTrigger className="border-blue-200">
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

            <div>
              <Label htmlFor="productos_interes">🛒 Productos de interés</Label>
              <Input
                id="productos_interes"
                value={formData.productos_interes || ''}
                onChange={(e) => setFormData({ ...formData, productos_interes: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: papa, quinua, maíz, habas"
                className="border-blue-200 focus:border-blue-400"
              />
              <p className="text-sm text-gray-500 mt-1">💡 Separar con comas.</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <SelectorMapaInteractivo
              ubicacionSeleccionada={formData.ubicacion}
              onUbicacionSeleccionada={handleUbicacionSeleccionada}
              ubicacionesExistentes={ubicacionesExistentes}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Paso 3: Canales de Distribución
            </h3>
            
            <div>
              <Label htmlFor="canales_distribucion">🚛 Canales de distribución</Label>
              <Input
                id="canales_distribucion"
                value={formData.canales_distribucion || ''}
                onChange={(e) => setFormData({ ...formData, canales_distribucion: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: entrega directa, mayorista, distribuidora"
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-sm text-gray-500 mt-1">💡 ¿Cómo llega el producto al cliente final?</p>
            </div>

            <div>
              <Label htmlFor="clientes_alternativos">🔄 Clientes alternativos</Label>
              <Textarea
                id="clientes_alternativos"
                value={formData.clientes_alternativos || ''}
                onChange={(e) => setFormData({ ...formData, clientes_alternativos: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: Mercado de Chilca, Supermercados Peruanos, Restaurant El Dorado"
                rows={3}
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-sm text-gray-500 mt-1">🔍 Clientes backup en caso de cancelaciones.</p>
            </div>
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
          {[1, 2, 3].map((paso) => (
            <div
              key={paso}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                paso === pasoActual
                  ? 'bg-blue-600 text-white'
                  : paso < pasoActual
                  ? 'bg-blue-200 text-blue-800'
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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
};

// 👷 FORMULARIO INTELIGENTE PARA TRABAJADORES
const FormularioTrabajadorInteligente: React.FC<{ formData: any; setFormData: (data: any) => void; ubicacionesExistentes: UbicacionGeodata[] }> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 3;

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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Paso 1: Información Personal del Trabajador
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">👤 Nombres *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Juan Carlos"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label htmlFor="apellidos">👤 Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos || ''}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  placeholder="Ej: Pérez González"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rol">👷 Rol/Función *</Label>
                <Select value={formData.rol || ''} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
                  <SelectTrigger className="border-green-200">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agricultor">🌾 Agricultor</SelectItem>
                    <SelectItem value="operador_maquinaria">🚜 Operador de maquinaria</SelectItem>
                    <SelectItem value="supervisor">👨‍💼 Supervisor</SelectItem>
                    <SelectItem value="veterinario">🐄 Veterinario</SelectItem>
                    <SelectItem value="administrador">💼 Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="especialidad">🎯 Especialidad</Label>
                <Input
                  id="especialidad"
                  value={formData.especialidad || ''}
                  onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                  placeholder="Ej: Cultivos andinos, Riego tecnificado"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="experiencia">📅 Experiencia (años)</Label>
                <Input
                  id="experiencia"
                  type="number"
                  min="0"
                  value={formData.experiencia || ''}
                  onChange={(e) => setFormData({ ...formData, experiencia: parseInt(e.target.value) })}
                  placeholder="Ej: 5"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label htmlFor="salario">💰 Salario (soles/mes)</Label>
                <Input
                  id="salario"
                  type="number"
                  min="0"
                  value={formData.salario || ''}
                  onChange={(e) => setFormData({ ...formData, salario: parseFloat(e.target.value) })}
                  placeholder="Ej: 1200"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label htmlFor="disponibilidad">⏰ Disponibilidad</Label>
                <Select value={formData.disponibilidad || ''} onValueChange={(value) => setFormData({ ...formData, disponibilidad: value })}>
                  <SelectTrigger className="border-green-200">
                    <SelectValue placeholder="Seleccionar disponibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiempo_completo">🕘 Tiempo completo</SelectItem>
                    <SelectItem value="medio_tiempo">🕐 Medio tiempo</SelectItem>
                    <SelectItem value="temporal">📅 Temporal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="habilidades">🛠️ Habilidades específicas</Label>
              <Input
                id="habilidades"
                value={formData.habilidades || ''}
                onChange={(e) => setFormData({ ...formData, habilidades: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: manejo de tractor, sistemas de riego, control de plagas"
                className="border-green-200 focus:border-green-400"
              />
              <p className="text-sm text-gray-500 mt-1">💡 Separar con comas.</p>
            </div>

            <div>
              <Label htmlFor="telefono">📱 Teléfono de contacto</Label>
              <Input
                id="telefono"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 987654321"
                className="border-green-200 focus:border-green-400"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <SelectorMapaInteractivo
              ubicacionSeleccionada={formData.ubicacion}
              onUbicacionSeleccionada={handleUbicacionSeleccionada}
              ubicacionesExistentes={ubicacionesExistentes}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Paso 3: Cobertura y Movilidad
            </h3>
            
            <div>
              <Label htmlFor="cobertura_geografica">🗺️ Cobertura geográfica</Label>
              <Input
                id="cobertura_geografica"
                value={formData.cobertura_geografica || ''}
                onChange={(e) => setFormData({ ...formData, cobertura_geografica: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: Valle del Mantaro, Jauja, Concepción"
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-sm text-gray-500 mt-1">💡 ¿En qué áreas puede trabajar?</p>
            </div>

            <div>
              <Label htmlFor="trabajadores_backup">🔄 Trabajadores de reemplazo</Label>
              <Textarea
                id="trabajadores_backup"
                value={formData.trabajadores_backup || ''}
                onChange={(e) => setFormData({ ...formData, trabajadores_backup: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Ej: María Huamán, Pedro Quispe, Carlos Mendoza"
                rows={3}
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-sm text-gray-500 mt-1">🔍 Personas que pueden reemplazarlo en emergencias.</p>
            </div>

            <div>
              <Label htmlFor="calificacion">⭐ Calificación del trabajador</Label>
              <Select value={formData.calificacion?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, calificacion: parseInt(value) })}>
                <SelectTrigger className="border-purple-200">
                  <SelectValue placeholder="Calificar desempeño" />
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
          {[1, 2, 3].map((paso) => (
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
