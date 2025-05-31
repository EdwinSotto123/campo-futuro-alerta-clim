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
  Sprout, Users, Store, Truck, Package, Droplets, Warehouse, 
  Coins, TrendingUp, Calendar, MapPin, Phone, Mail, Star,
  Plus, Edit, Trash2, Eye, Settings, BarChart3, Thermometer,
  CloudRain, Sun, Wind, Leaf, Zap, Target, Clock, Activity,
  User, Briefcase, GraduationCap, Car, Heart, Shield, 
  AlertTriangle, Brain, Link, Network, Pencil
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { auth, db } from "../lib/firebase"; // Importar auth y db para operaciones de Firestore
import { useAuthState } from "react-firebase-hooks/auth"; // Importar hook para estado de autenticación
import { Spinner } from "@/components/ui/spinner"; // Asegúrate de tener este componente o crea uno
import {
  obtenerCeldasPorPropietario,
  crearCeldaGranja,
  actualizarCeldaGranja,
  eliminarCeldaGranja,
  inicializarGranjaVacia,
  CeldaGranja as CeldaGranjaType
} from "../services/granjaService";
import { doc, getDoc, setDoc, collection } from "firebase/firestore"; // Importar operaciones de Firestore

// 🎨 ESTILOS CSS PERSONALIZADOS PARA ANIMACIONES MEJORADAS Y SÚPER VIVOS
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(2deg);
    }
  }
  
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px currentColor;
    }
    50% {
      box-shadow: 0 0 25px currentColor, 0 0 40px currentColor;
    }
  }
  
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    25% { filter: hue-rotate(90deg); }
    50% { filter: hue-rotate(180deg); }
    75% { filter: hue-rotate(270deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(3deg); }
    75% { transform: rotate(-3deg); }
  }
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes slideInGlow {
    from {
      opacity: 0;
      transform: translateX(-100%) scale(0.5);
      filter: blur(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
      filter: blur(0px);
    }
  }
    /* Removed custom animation classes for cleaner appearance */
  
  .glassmorphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .gradient-border {
    position: relative;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
    background-size: 400% 400%;
    animation: gradientShift 3s ease infinite;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
    /* Removed neon-glow effect for cleaner appearance */
  
  .sparkle::before {
    content: '✨';
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 12px;
    animation: wiggle 2s ease-in-out infinite;
  }

  .farm-form {
    background: linear-gradient(135deg, #f0f9eb 0%, #e6f3d7 100%);
    border: 2px solid #a8d08d;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: fadeInUp 0.5s ease-out;
  }

  .farm-input {
    background-color: white;
    border: 2px solid #a8d08d;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .farm-input:focus {
    border-color: #7cb342;
    box-shadow: 0 0 0 2px rgba(124, 179, 66, 0.2);
  }

  .farm-select {
    background-color: white;
    border: 2px solid #a8d08d;
    border-radius: 8px;
  }

  .farm-select:focus {
    border-color: #7cb342;
  }

  .farm-label {
    color: #2e7d32;
    font-weight: 600;
  }

  .farm-button {
    background: linear-gradient(135deg, #7cb342 0%, #558b2f 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .farm-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .farm-card {
    background: white;
    border: 2px solid #a8d08d;
    border-radius: 12px;
    overflow: hidden;
  }

  .farm-card-header {
    background: linear-gradient(135deg, #7cb342 0%, #558b2f 100%);
    color: white;
    padding: 1rem;
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
export interface UbicacionGeodata {
  departamento: string;
  provincia: string;
  distrito: string;
  coordenadas?: { lat: number; lng: number };
  altitud?: number;
  caracteristicas_geograficas: string[]; // ['montañoso', 'valle', 'costa', 'selva']
  accesibilidad: 'excelente' | 'buena' | 'regular' | 'dificil';
  carreteras_principales: string[]; // ['PE-3N', 'Carretera Central']
  distancia_capital_km: number;
  clima?: string;
  temperatura?: string;
  precipitacion?: string;
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
  // Reemplazar estos campos individuales
  // precio_promedio: number;
  // volumen_compra: string;
  // Nuevo campo para productos con detalles
  productos_compra: {
    nombre: string;
    cantidad_kg: number;
    precio_kg: number;
    seleccionado: boolean;
  }[];
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
    hectareas_correspondientes: number;
    origen: string;
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
  propietario?: string;
}

// 🎨 CONFIGURACIÓN DE LA GRANJA
const FILAS = 5;
const COLUMNAS = 5;
const TOTAL_CELDAS = FILAS * COLUMNAS;

// Estilos personalizados para formularios tipo FarmVille
const farmStyles = `
  .farm-form {
    background: linear-gradient(to bottom, #f0f9eb, #e8f5e9);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 2px solid #a5d6a7;
  }

  .farm-label {
    color: #2e7d32;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
  }

  .farm-input {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #a5d6a7;
    border-radius: 0.5rem;
    padding: 0.75rem;
    transition: all 0.3s ease;
  }

  .farm-input:hover, .farm-input:focus {
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  .farm-select {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #a5d6a7;
    border-radius: 0.5rem;
    padding: 0.75rem;
    transition: all 0.3s ease;
  }

  .farm-select:hover, .farm-select:focus {
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  .farm-button {
    background: linear-gradient(to bottom, #4caf50, #388e3c);
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .farm-button:hover {
    background: linear-gradient(to bottom, #388e3c, #2e7d32);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .farm-button:active {
    transform: translateY(0);
  }

  .farm-section {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #c8e6c9;
  }

  .farm-section-title {
    color: #1b5e20;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

// 🌾 COMPONENTE PRINCIPAL
const MiGranjaVirtual: React.FC = () => {
  // Estado de autenticación
  const [user, loading, error] = useAuthState(auth);
  
  // Estados
  const [granja, setGranja] = useState<CeldaGranja[]>([]);
  const [vistaActual, setVistaActual] = useState<'granja' | 'estadisticas'>('granja');
  const [celdaSeleccionada, setCeldaSeleccionada] = useState<CeldaGranja | null>(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [mostrarFormularioEdicion, setMostrarFormularioEdicion] = useState(false);
  const [mostrarFormularioPerfil, setMostrarFormularioPerfil] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error404, setError404] = useState<string | null>(null);
  const [perfilUsuario, setPerfilUsuario] = useState<any>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  
  const { toast } = useToast();

  // Cargar los datos de la granja desde Firestore cuando el componente se monta
  useEffect(() => {
    const cargarGranja = async () => {
      if (!user) return;
      
      try {
        setCargando(true);
        const celdas = await obtenerCeldasPorPropietario(user.uid);
        
        if (celdas.length === 0) {
          // Si el usuario no tiene una granja, inicializar una vacía
          const nuevasCeldas = await inicializarGranjaVacia(user.uid, FILAS, COLUMNAS);
          setGranja(nuevasCeldas as CeldaGranja[]);
          toast({
            title: "Granja creada",
            description: "Se ha creado una nueva granja virtual para ti.",
          });
        } else {
          setGranja(celdas as unknown as CeldaGranja[]);
        }
      } catch (err) {
        console.error("Error al cargar la granja:", err);
        setError404("Error al cargar la granja. Por favor, intenta de nuevo más tarde.");
        toast({
          title: "Error",
          description: "No se pudo cargar la granja virtual.",
          variant: "destructive",
        });
      } finally {
        setCargando(false);
      }
    };
    
    if (!loading) {
      cargarGranja();
    }
  }, [user, loading, toast]);

  // Cargar perfil de usuario desde Firestore
  useEffect(() => {
    const cargarPerfilUsuario = async () => {
      if (!user) return;
      
      try {
        setCargandoPerfil(true);
        const perfilRef = doc(db, "perfiles", user.uid);
        const perfilDoc = await getDoc(perfilRef);
        
        if (perfilDoc.exists()) {
          setPerfilUsuario(perfilDoc.data());
        }
      } catch (err) {
        console.error("Error al cargar el perfil de usuario:", err);
        toast({
          title: "Error",
          description: "No se pudo cargar tu perfil de usuario.",
          variant: "destructive",
        });
      } finally {
        setCargandoPerfil(false);
      }
    };
    
    if (!loading) {
      cargarPerfilUsuario();
    }
  }, [user, loading, toast]);

  // Guardar perfil de usuario en Firestore
  const guardarPerfilUsuario = async (datos: any) => {
    if (!user) return;
    
    try {
      setCargandoPerfil(true);
      const perfilRef = doc(db, "perfiles", user.uid);
      await setDoc(perfilRef, {
        ...datos,
        uid: user.uid,
        actualizado: new Date().toISOString()
      });
      
      setPerfilUsuario(datos);
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil de agricultor ha sido actualizado correctamente.",
      });
    } catch (err) {
      console.error("Error al guardar el perfil de usuario:", err);
      toast({
        title: "Error",
        description: "No se pudo guardar tu perfil de usuario.",
        variant: "destructive",
      });
    } finally {
      setCargandoPerfil(false);
      setMostrarFormularioPerfil(false);
    }
  };

  // Manejar el clic en una celda
  const manejarClickCelda = (celda: CeldaGranja) => {
    setCeldaSeleccionada(celda);
    
    // Verificar si es la celda central (YO)
    const filaMedia = Math.floor(FILAS / 2);
    const columnaMedia = Math.floor(COLUMNAS / 2);
    const esCeldaCentral = (celda.fila === 0 && celda.columna === 2);
    
    if (esCeldaCentral) {
      setMostrarFormularioPerfil(true);
    } else if (celda.tipo === 'vacio') {
      setDialogoAbierto(true);
    } else {
      setMostrarFormularioEdicion(true);
    }
  };

  // Manejar la edición de una celda
  const handleEditarCelda = (celda: CeldaGranja) => {
    setCeldaSeleccionada(celda);
    setMostrarFormularioEdicion(true);
  };

  // Manejar la eliminación de una celda
  const handleEliminarCelda = async (celdaId: string) => {
    // Mostrar confirmación antes de eliminar
    if (window.confirm("¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.")) {
      try {
        // Primero, eliminar de Firestore
        await eliminarCeldaGranja(celdaId);
        
        // Luego, actualizar la celda a 'vacio' en el estado local
        actualizarCelda(celdaId, 'vacio');
        setCeldaSeleccionada(null);
        
        toast({
          title: "Elemento eliminado",
          description: "El elemento ha sido eliminado correctamente.",
        });
      } catch (err) {
        console.error("Error al eliminar la celda:", err);
        toast({
          title: "Error",
          description: "No se pudo eliminar el elemento.",
          variant: "destructive",
        });
      }
    }
  };

  // Actualizar una celda
  const actualizarCelda = async (celdaId: string, tipo: TipoCelda, datos?: any) => {
    if (!user) return;
    try {
      // Determinar el subtipo según el tipo de celda
      let subtipo = undefined;
      if (tipo === 'proveedor' || tipo === 'cliente' || tipo === 'almacen' || tipo === 'reservorio' || tipo === 'cultivo') {
        subtipo = datos?.tipo;
      } else if (tipo === 'trabajador') {
        subtipo = datos?.rol;
      }
      // Actualizar en Firestore
      const datosActualizados: Partial<CeldaGranjaType> = {
        tipo,
        subtipo,
        datos,
      };
      await actualizarCeldaGranja(celdaId, datosActualizados);
      // Actualizar el estado local
      setGranja(prev => prev.map(celda => 
        celda.id === celdaId 
          ? { ...celda, tipo, subtipo, datos }
          : celda
      ));
      setDialogoAbierto(false);
      setMostrarFormularioEdicion(false);
      toast({
        title: tipo === 'vacio' ? "Elemento eliminado" : "Elemento actualizado",
        description: tipo === 'vacio' 
          ? "Se ha eliminado el elemento de tu granja virtual."
          : `Se ha ${celdaSeleccionada?.tipo === 'vacio' ? 'agregado' : 'actualizado'} ${tipo} en tu granja virtual.`,
      });
    } catch (err) {
      console.error("Error al actualizar la celda:", err);
      toast({
        title: "Error",
        description: "No se pudo actualizar el elemento.",
        variant: "destructive",
      });
    }
  };

  // 🎨 FUNCIÓN PARA OBTENER EL ESTILO VISUAL DE CADA CELDA (¡SÚPER MEJORADA CON COLORES ESPECTACULARES Y ANIMACIONES!)
  const obtenerEstiloCelda = (celda: CeldaGranja) => {
    const estilosBase = "w-full h-24 border-4 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-center p-2 relative overflow-hidden backdrop-blur-md group";
    
    switch (celda.tipo) {      case 'cultivo':
        const cultivo = celda.datos as Cultivo;
        return {
          className: `${estilosBase} bg-gradient-to-br from-lime-400 via-emerald-500 to-green-600 border-emerald-300`,
          icon: '🌱',
          emoji: obtenerEmojiCultivo(cultivo?.tipo || 'papa'),
          texto: cultivo?.nombre || 'Cultivo',
          subtexto: cultivo?.etapaCrecimiento || 'Nuevo'
        };
      
      case 'proveedor':
        const proveedor = celda.datos as Proveedor;
        return {          className: `${estilosBase} bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-700 border-cyan-300`,
          icon: '🏪',
          emoji: obtenerEmojiProveedor(proveedor?.tipo || 'semillas'),
          texto: proveedor?.nombre || 'Proveedor',
          subtexto: proveedor?.tipo || 'Nuevo'
        };
      
      case 'cliente':
        const cliente = celda.datos as Cliente;
        return {
          className: `${estilosBase} bg-gradient-to-br from-fuchsia-400 via-purple-500 to-violet-700 border-fuchsia-300`,
          icon: '👥',
          emoji: obtenerEmojiCliente(cliente?.tipo || 'mayorista'),
          texto: cliente?.nombre || 'Cliente',
          subtexto: cliente?.tipo || 'Nuevo'
        };
        case 'trabajador':
        const trabajador = celda.datos as Trabajador;
        return {
          className: `${estilosBase} bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 border-amber-300`,
          icon: '👨‍🌾',
          emoji: obtenerEmojiTrabajador(trabajador?.rol || 'agricultor'),
          texto: trabajador?.nombre || 'Trabajador',
          subtexto: trabajador?.rol || 'Nuevo'
        };
      
      case 'almacen':
        const almacen = celda.datos as Almacen;
        return {
          className: `${estilosBase} bg-gradient-to-br from-yellow-400 via-orange-500 to-red-700 border-yellow-300`,
          icon: '🏭',
          emoji: obtenerEmojiAlmacen(almacen?.tipo || 'productos_agricolas'),
          texto: almacen?.nombre || 'Almacén',
          subtexto: almacen?.tipo || 'Nuevo'
        };
        case 'reservorio':
        const reservorio = celda.datos as Reservorio;
        return {
          className: `${estilosBase} bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-700 border-sky-300`,
          icon: '💧',
          emoji: obtenerEmojiReservorio(reservorio?.tipo || 'artificial'),
          texto: reservorio?.nombre || 'Reservorio',
          subtexto: `${reservorio?.nivel_actual || 0}%`
        };
      
      default:
        return {
          className: `${estilosBase} bg-gradient-to-br from-green-100 via-green-200 to-green-300 border-green-300`,
          icon: '🍃',
          emoji: '🍃',
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
    // Separar elementos por tipo
    const cultivos = granja.filter(celda => celda.tipo === 'cultivo');
    const proveedores = granja.filter(celda => celda.tipo === 'proveedor');
    const clientes = granja.filter(celda => celda.tipo === 'cliente');
    const trabajadores = granja.filter(celda => celda.tipo === 'trabajador');
    const almacenes = granja.filter(celda => celda.tipo === 'almacen');
    const reservorios = granja.filter(celda => celda.tipo === 'reservorio');
    
    // Calcular área total cultivada
    const areaTotalCultivada = cultivos.reduce((total, celda) => {
      const cultivo = celda.datos as Cultivo;
      return total + (cultivo?.area || 0);
    }, 0);
    
    // Calcular volumen total de compra
    const volumenTotalCompra = clientes.reduce((total, celda) => {
      const cliente = celda.datos as Cliente;
      
      // Comprobar si el cliente tiene la propiedad productos_compra
      if (!cliente || !cliente.productos_compra || !Array.isArray(cliente.productos_compra)) {
        return total;
      }
      
      // Sumar las cantidades de todos los productos
      const volumenCliente = cliente.productos_compra.reduce((subtotal, producto) => {
        return subtotal + (producto.cantidad_kg || 0);
      }, 0);
      
      return total + volumenCliente;
    }, 0);
    
    // Calcular capacidad total de almacenamiento
    const capacidadTotalAlmacenamiento = almacenes.reduce((total, celda) => {
      const almacen = celda.datos as Almacen;
      return total + (almacen?.capacidad_total || 0);
    }, 0);
    
    // Calcular capacidad total de agua
    const capacidadTotalAgua = reservorios.reduce((total, celda) => {
      const reservorio = celda.datos as Reservorio;
      return total + (reservorio?.capacidad || 0);
    }, 0);
    
    // Calcular celdas ocupadas y vacías
    const ocupadas = TOTAL_CELDAS - granja.filter(celda => celda.tipo === 'vacio').length;
    const vacias = TOTAL_CELDAS - ocupadas;
    const porcentajeOcupacion = Math.round((ocupadas / TOTAL_CELDAS) * 100);
    
    return {
      // Datos numéricos
      areaTotalCultivada,
      volumenTotalCompra,
      capacidadTotalAlmacenamiento,
      capacidadTotalAgua,
      totalCultivos: cultivos.length,
      totalProveedores: proveedores.length,
      totalClientes: clientes.length,
      totalTrabajadores: trabajadores.length,
      
      // Datos para mostrar en estadísticas
      cultivos: cultivos.length,
      proveedores: proveedores.length, 
      clientes: clientes.length,
      trabajadores: trabajadores.length,
      almacenes: almacenes.length,
      reservorios: reservorios.length,
      ocupadas,
      vacias,
      porcentajeOcupacion
    };
  };

  const stats = calcularEstadisticas();

  // Renderizar pantalla de carga
  if (loading || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <Spinner className="w-10 h-10 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-green-800">Cargando tu granja virtual...</h2>
          <p className="text-gray-600 mt-2">Esto puede tardar unos segundos</p>
        </div>
      </div>
    );
  }

  // Renderizar pantalla de error
  if (error || error404) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error404 || "No se pudo acceder a tu granja virtual. Por favor, verifica tu conexión e inténtalo de nuevo."}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  // Renderizar pantalla de inicio de sesión requerido
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-green-500 text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Inicio de sesión requerido</h2>
          <p className="text-gray-700 mb-4">Debes iniciar sesión para acceder a tu granja virtual.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Ir a iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

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
                📊 Estadísticas
              </Button>
              <Button 
                onClick={() => window.open('/alertas-climaticas', '_self')}
                variant="outline"
              >
                🌦️ Alertas
              </Button>
            </div>
          </div>

          {/* 📋 DESCRIPCIÓN DE LA IA Y USO DE DATOS */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5" /> 
              ¿Cómo la IA usará los datos de tu granja virtual?
            </h3>
            <p className="text-sm text-gray-700">
              Tu granja virtual es una representación digital de tu operación agrícola real. La IA analizará datos como ubicación, 
              clima, cadenas de suministro, distancias, y recursos para generar alertas climáticas, recomendaciones 
              de sostenibilidad, optimización de rutas, prevención de riesgos y estrategias de contingencia. 
              Completa información en cada categoría para obtener análisis más precisos y personalizados.
            </p>
          </div>

          {/* 📊 ESTADÍSTICAS RÁPIDAS */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-6">
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">🌱</div>
                <div className="font-bold text-lg">{stats.cultivos}</div>
                <div className="text-xs text-gray-600">Cultivos</div>
                <div className="text-xs text-green-700 mt-1 bg-green-50 p-1 rounded">¿Cómo lo planto y cómo lo cuido?</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">🏪</div>
                <div className="font-bold text-lg">{stats.proveedores}</div>
                <div className="text-xs text-gray-600">Proveedores</div>
                <div className="text-xs text-blue-700 mt-1 bg-blue-50 p-1 rounded">¿A quién le compro mis insumos?</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">👥</div>
                <div className="font-bold text-lg">{stats.clientes}</div>
                <div className="text-xs text-gray-600">Clientes</div>
                <div className="text-xs text-purple-700 mt-1 bg-purple-50 p-1 rounded">¿Quién me compra mis productos?</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">👨‍🌾</div>
                <div className="font-bold text-lg">{stats.trabajadores}</div>
                <div className="text-xs text-gray-600">Personal</div>
                <div className="text-xs text-orange-700 mt-1 bg-orange-50 p-1 rounded">¿Quiénes me ayudan en agricultura?</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">🏭</div>
                <div className="font-bold text-lg">{stats.almacenes}</div>
                <div className="text-xs text-gray-600">Almacenes</div>
                <div className="text-xs text-yellow-700 mt-1 bg-yellow-50 p-1 rounded">¿Dónde guardo mis equipos y cultivos?</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">💧</div>
                <div className="font-bold text-lg">{stats.reservorios}</div>
                <div className="text-xs text-gray-600">Agua</div>
                <div className="text-xs text-sky-700 mt-1 bg-sky-50 p-1 rounded">¿De qué fuente proviene el agua de riego?</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">📊</div>
                <div className="font-bold text-lg">{stats.porcentajeOcupacion}%</div>
                <div className="text-xs text-gray-600">Ocupación</div>
                <div className="text-xs text-emerald-700 mt-1 bg-emerald-50 p-1 rounded">¿Qué tan diversificada está mi granja?</div>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-2">
                <div className="text-2xl">🎯</div>
                <div className="font-bold text-lg">{stats.vacias}</div>
                <div className="text-xs text-gray-600">Disponibles</div>
                <div className="text-xs text-indigo-700 mt-1 bg-indigo-50 p-1 rounded">¿Qué otros cultivos podría sembrar?</div>
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
                    MI GRANJA VIRTUAL 
                  </CardTitle>
                  <CardDescription>
                    Haz click en cualquier parcela para agregar cultivos, proveedores, clientes, trabajadores, almacenes o reservorios
                  </CardDescription>
                </CardHeader>                <CardContent className="h-[calc(100%-120px)] overflow-auto bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 p-4 rounded-lg relative">
                  {/* Partículas de fondo animadas */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">                    <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-300 rounded-full opacity-60"></div>
                    <div className="absolute top-20 right-20 w-3 h-3 bg-lime-400 rounded-full opacity-50"></div>
                    <div className="absolute bottom-20 left-20 w-1 h-1 bg-green-500 rounded-full opacity-70"></div>
                    <div className="absolute bottom-10 right-10 w-2 h-2 bg-emerald-400 rounded-full opacity-60"></div>
                  </div>
                  
                  {/* Grid de la granja con efectos visuales súper mejorados */}
                  <div 
                    className="grid gap-4 auto-rows-fr p-6 bg-gradient-to-br from-white/30 via-emerald-50/40 to-lime-50/30 backdrop-blur-xl rounded-3xl border-2 border-white/40 shadow-2xl relative overflow-hidden"
                    style={{ gridTemplateColumns: `repeat(${COLUMNAS}, 1fr)` }}
                  >
                    {/* Efecto de brillo de fondo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    
                    {granja.map((celda, index) => {
                      // La celda YO siempre estará en la posición 1-3 (fila 0, columna 2)
                      const esCeldaCentral = (celda.fila === 0 && celda.columna === 2);
                      
                      const estilo = obtenerEstiloCelda(celda);
                      
                      return (
                        <div
                          key={celda.id}
                          className={`${estilo.className} group relative ${esCeldaCentral ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 border-yellow-300 shadow-xl animate-pulse' : ''}`}
                          style={{ 
                            animationDelay: `${index * 80}ms`,
                            animation: 'slideInGlow 1s ease-out forwards',
                            transform: esCeldaCentral ? 'scale(1.05)' : 'scale(1)',
                            zIndex: esCeldaCentral ? 10 : 1
                          }}
                          onClick={() => manejarClickCelda(celda)}
                        >
                          {/* Emoji */}
                          <div className="text-4xl mb-2 drop-shadow-2xl">
                            {esCeldaCentral ? '👑' : estilo.emoji}
                          </div>
                          
                          {/* Texto principal */}
                          <div className={`text-xs font-black ${esCeldaCentral ? 'text-white text-base' : 'text-white'} drop-shadow-lg`}>
                            {esCeldaCentral ? 'YO' : estilo.texto}
                          </div>
                          
                          {/* Subtexto */}
                          <div className={`text-xs ${esCeldaCentral ? 'text-white' : 'text-white/95'} drop-shadow-md font-bold`}>
                            {esCeldaCentral ? 'Mi Perfil' : estilo.subtexto}
                          </div>
                          
                          {/* Indicadores para elementos ocupados */}
                          {celda.tipo !== 'vacio' && !esCeldaCentral && (
                            <>
                              <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-400 rounded-full shadow-lg"></div>
                              <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-300 rounded-full"></div>
                              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                            </>
                          )}
                          
                          {/* Corona para la celda central */}
                          {esCeldaCentral && (
                            <div className="absolute -top-2 -right-2 text-lg animate-bounce">✨</div>
                          )}
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
                <div className="absolute inset-0 overflow-hidden pointer-events-none">                  {/* Removed animated decorative particles for cleaner appearance */}
                </div>
                  <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <CardTitle className="flex items-center gap-3 relative z-10">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xl font-black">🌟 Dashboard Súper Granja</span>
                    <div className="ml-auto">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)] overflow-auto space-y-5 p-6 relative">
                  {/* Estadísticas Súper Mejoradas con Efectos Espectaculares */}
                  

                  {/* Información de Celda Seleccionada Súper Mejorada */}
                  {celdaSeleccionada && (
                    <div className="border-t-4 border-gradient-to-r from-indigo-500 to-purple-500 pt-6 mt-6 relative">
                      <div className="absolute -top-2 left-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        ✨ CELDA SELECCIONADA ✨
                      </div>
                      
                      <div className="bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 p-6 rounded-3xl border-4 border-indigo-300 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-2 left-2 w-2 h-2 bg-pink-400 rounded-full"></div>
                        
                        <div className="text-center mb-6 relative z-10">
                          <div className="text-8xl mb-4 drop-shadow-2xl">
                            {obtenerEstiloCelda(celdaSeleccionada).emoji}
                          </div>
                          <div className="text-2xl font-black text-indigo-800 drop-shadow-lg">
                            {celdaSeleccionada.datos ? (celdaSeleccionada.datos as any).nombre : 'Nueva Parcela'}
                          </div>
                          <div className="text-lg text-purple-600 font-bold mt-2">
                            {celdaSeleccionada.tipo.charAt(0).toUpperCase() + celdaSeleccionada.tipo.slice(1)}
                          </div>
                        </div>
                        
                        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 text-sm space-y-3 border-2 border-white/50 relative z-10">
                          <div className="flex justify-between items-center">
                            <strong className="text-indigo-700">📍 Posición:</strong> 
                            <span className="bg-indigo-100 px-3 py-1 rounded-full font-bold text-indigo-800">
                              Fila {celdaSeleccionada.fila + 1}, Col {celdaSeleccionada.columna + 1}
                            </span>
                          </div>
                          {celdaSeleccionada.datos && (
                            <>
                              {celdaSeleccionada.tipo === 'cultivo' && (() => {
                                const datos = celdaSeleccionada.datos as Cultivo;
                                return <>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">🌾 Tipo:</strong><span className="bg-green-100 px-3 py-1 rounded-full font-bold text-green-800">{datos.tipo}</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">🔖 Variedad:</strong><span className="bg-blue-100 px-3 py-1 rounded-full font-bold text-blue-800">{datos.variedad}</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">📏 Área:</strong><span className="bg-blue-100 px-3 py-1 rounded-full font-bold text-blue-800">{datos.area} ha</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">🎯 Rendimiento:</strong><span className="bg-yellow-100 px-3 py-1 rounded-full font-bold text-yellow-800">{datos.rendimientoEstimado} kg/ha</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">💚 Salud:</strong><div className="w-32 bg-gray-200 rounded-full h-2.5"><div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${datos.salud}%` }}></div></div></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">⚠️ Riesgo Climático:</strong><div className="w-32 bg-gray-200 rounded-full h-2.5"><div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${datos.riesgClimatico}%` }}></div></div></div>
                                  {datos.ubicacion && (
                                    <>
                                      <div className="mt-2 font-bold text-indigo-700">📌 Ubicación</div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div><span className="font-semibold">Departamento:</span> {datos.ubicacion.departamento}</div>
                                        <div><span className="font-semibold">Provincia:</span> {datos.ubicacion.provincia}</div>
                                        <div><span className="font-semibold">Distrito:</span> {datos.ubicacion.distrito}</div>
                                        <div><span className="font-semibold">Altitud:</span> {datos.ubicacion.altitud} m.s.n.m.</div>
                                        <div><span className="font-semibold">Clima:</span> {datos.ubicacion.clima}</div>
                                        <div><span className="font-semibold">Temp.:</span> {datos.ubicacion.temperatura}</div>
                                        <div><span className="font-semibold">Precipitación:</span> {datos.ubicacion.precipitacion}</div>
                          </div>
                                    </>
                                  )}
                                </>;
                              })()}
                              {celdaSeleccionada.tipo === 'proveedor' && (() => {
                                const datos = celdaSeleccionada.datos as Proveedor;
                                return <>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">🏭 Tipo:</strong><span className="bg-green-100 px-3 py-1 rounded-full font-bold text-green-800">{datos.tipo}</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">⭐ Confiabilidad:</strong><div className="flex gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < datos.confiabilidad ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}</div></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">⏱️ Tiempo Entrega:</strong><span className="bg-blue-100 px-3 py-1 rounded-full font-bold text-blue-800">{datos.tiempoEntrega}</span></div>
                                  {datos.ubicacion && (
                                    <>
                                      <div className="mt-2 font-bold text-indigo-700">📌 Ubicación</div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div><span className="font-semibold">Departamento:</span> {datos.ubicacion.departamento}</div>
                                        <div><span className="font-semibold">Provincia:</span> {datos.ubicacion.provincia}</div>
                                        <div><span className="font-semibold">Distrito:</span> {datos.ubicacion.distrito}</div>
                                        <div><span className="font-semibold">Altitud:</span> {datos.ubicacion.altitud} m.s.n.m.</div>
                                        <div><span className="font-semibold">Clima:</span> {datos.ubicacion.clima}</div>
                                        <div><span className="font-semibold">Temp.:</span> {datos.ubicacion.temperatura}</div>
                                        <div><span className="font-semibold">Precipitación:</span> {datos.ubicacion.precipitacion}</div>
                          </div>
                                    </>
                                  )}
                                </>;
                              })()}
                              {celdaSeleccionada.tipo === 'cliente' && (() => {
                                const datos = celdaSeleccionada.datos as Cliente;
                                return <>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">👥 Tipo:</strong><span className="bg-green-100 px-3 py-1 rounded-full font-bold text-green-800">{datos.tipo}</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">💰 Volumen Compra:</strong><span className="bg-blue-100 px-3 py-1 rounded-full font-bold text-blue-800">
                                    {datos.productos_compra?.reduce((total, prod) => total + (prod.cantidad_kg || 0), 0) || 0} kg
                                  </span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">⭐ Calificación:</strong><div className="flex gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < datos.calificacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}</div></div>
                                  {datos.ubicacion && (
                                    <>
                                      <div className="mt-2 font-bold text-indigo-700">📌 Ubicación</div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div><span className="font-semibold">Departamento:</span> {datos.ubicacion.departamento}</div>
                                        <div><span className="font-semibold">Provincia:</span> {datos.ubicacion.provincia}</div>
                                        <div><span className="font-semibold">Distrito:</span> {datos.ubicacion.distrito}</div>
                                        <div><span className="font-semibold">Altitud:</span> {datos.ubicacion.altitud} m.s.n.m.</div>
                                        <div><span className="font-semibold">Clima:</span> {datos.ubicacion.clima}</div>
                                        <div><span className="font-semibold">Temp.:</span> {datos.ubicacion.temperatura}</div>
                                        <div><span className="font-semibold">Precipitación:</span> {datos.ubicacion.precipitacion}</div>
                        </div>
                                    </>
                                  )}
                                </>;
                              })()}
                              {celdaSeleccionada.tipo === 'trabajador' && (() => {
                                const datos = celdaSeleccionada.datos as Trabajador;
                                return <>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">👨‍🌾 Rol:</strong><span className="bg-green-100 px-3 py-1 rounded-full font-bold text-green-800">{datos.rol}</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">📚 Experiencia:</strong><span className="bg-blue-100 px-3 py-1 rounded-full font-bold text-blue-800">{datos.experiencia} años</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">⭐ Calificación:</strong><div className="flex gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < datos.calificacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}</div></div>
                                  {datos.ubicacion && (
                                    <>
                                      <div className="mt-2 font-bold text-indigo-700">📌 Ubicación</div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div><span className="font-semibold">Departamento:</span> {datos.ubicacion.departamento}</div>
                                        <div><span className="font-semibold">Provincia:</span> {datos.ubicacion.provincia}</div>
                                        <div><span className="font-semibold">Distrito:</span> {datos.ubicacion.distrito}</div>
                                        <div><span className="font-semibold">Altitud:</span> {datos.ubicacion.altitud} m.s.n.m.</div>
                                        <div><span className="font-semibold">Clima:</span> {datos.ubicacion.clima}</div>
                                        <div><span className="font-semibold">Temp.:</span> {datos.ubicacion.temperatura}</div>
                                        <div><span className="font-semibold">Precipitación:</span> {datos.ubicacion.precipitacion}</div>
                      </div>
                                    </>
                                  )}
                                </>;
                              })()}
                              {celdaSeleccionada.tipo === 'almacen' && (() => {
                                const datos = celdaSeleccionada.datos as Almacen;
                                return <>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">🏭 Tipo:</strong><span className="bg-green-100 px-3 py-1 rounded-full font-bold text-green-800">{datos.tipo}</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">📦 Capacidad:</strong><span className="bg-blue-100 px-3 py-1 rounded-full font-bold text-blue-800">{datos.capacidad_usada} / {datos.capacidad_total}</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">🌡️ Control:</strong><span className="bg-purple-100 px-3 py-1 rounded-full font-bold text-purple-800">{datos.temperatura_control ? 'Temperatura' : 'No'} / {datos.humedad_control ? 'Humedad' : 'No'}</span></div>
                                  {datos.ubicacion && (
                                    <>
                                      <div className="mt-2 font-bold text-indigo-700">📌 Ubicación</div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div><span className="font-semibold">Departamento:</span> {datos.ubicacion.departamento}</div>
                                        <div><span className="font-semibold">Provincia:</span> {datos.ubicacion.provincia}</div>
                                        <div><span className="font-semibold">Distrito:</span> {datos.ubicacion.distrito}</div>
                                        <div><span className="font-semibold">Altitud:</span> {datos.ubicacion.altitud} m.s.n.m.</div>
                                        <div><span className="font-semibold">Clima:</span> {datos.ubicacion.clima}</div>
                                        <div><span className="font-semibold">Temp.:</span> {datos.ubicacion.temperatura}</div>
                                        <div><span className="font-semibold">Precipitación:</span> {datos.ubicacion.precipitacion}</div>
                                      </div>
                                    </>
                                  )}
                                </>;
                              })()}
                              {celdaSeleccionada.tipo === 'reservorio' && (() => {
                                const datos = celdaSeleccionada.datos as Reservorio;
                                return <>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">💧 Tipo:</strong><span className="bg-green-100 px-3 py-1 rounded-full font-bold text-green-800">{datos.tipo}</span></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">📊 Nivel:</strong><div className="w-32 bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${datos.nivel_actual}%` }}></div></div></div>
                                  <div className="flex justify-between items-center"><strong className="text-indigo-700">💦 Calidad:</strong><span className="bg-blue-100 px-3 py-1 rounded-full font-bold text-blue-800">{datos.calidad_agua}</span></div>
                                  {datos.ubicacion && (
                                    <>
                                      <div className="mt-2 font-bold text-indigo-700">📌 Ubicación</div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div><span className="font-semibold">Departamento:</span> {datos.ubicacion.departamento}</div>
                                        <div><span className="font-semibold">Provincia:</span> {datos.ubicacion.provincia}</div>
                                        <div><span className="font-semibold">Distrito:</span> {datos.ubicacion.distrito}</div>
                                        <div><span className="font-semibold">Altitud:</span> {datos.ubicacion.altitud} m.s.n.m.</div>
                                        <div><span className="font-semibold">Clima:</span> {datos.ubicacion.clima}</div>
                                        <div><span className="font-semibold">Temp.:</span> {datos.ubicacion.temperatura}</div>
                                        <div><span className="font-semibold">Precipitación:</span> {datos.ubicacion.precipitacion}</div>
                                      </div>
                                    </>
                                  )}
                                </>;
                              })()}
                            </>
                          )}
                        </div>
                        
                        {/* Botones de acción para editar/eliminar */}
                        {celdaSeleccionada.tipo !== 'vacio' && (
                          <div className="mt-4 flex justify-center gap-3">
                            <Button 
                              onClick={() => handleEditarCelda(celdaSeleccionada)} 
                              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </Button>
                            <Button 
                              onClick={() => handleEliminarCelda(celdaSeleccionada.id)} 
                              variant="destructive" 
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </Button>
                          </div>
                        )}
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
                        className="w-full justify-start text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg"
                        onClick={() => setVistaActual('estadisticas')}                      >
                        <BarChart3 className="h-5 w-5 mr-3" />
                        <span>📊 Ver Estadísticas Completas</span>
                      </Button>
                      
                      <Button 
                        size="lg" 
                        className="w-full justify-start text-sm bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg"
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
        <DialogContent className="max-w-4xl w-full max-h-[70vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>
              {celdaSeleccionada?.tipo === 'vacio' 
                ? `Agregar elemento en Parcela ${celdaSeleccionada?.fila + 1}-${celdaSeleccionada?.columna + 1}`
                : `Editar elemento en Parcela ${celdaSeleccionada?.fila! + 1}-${celdaSeleccionada?.columna! + 1}`
              }
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-0">
          {celdaSeleccionada && (
            <FormularioElemento 
              celda={celdaSeleccionada}
              onGuardar={actualizarCelda}
              onCancelar={() => setDialogoAbierto(false)}
            />
          )}
          </div>
        </DialogContent>
      </Dialog>

      {mostrarFormularioEdicion && celdaSeleccionada && (
        <Dialog open={mostrarFormularioEdicion} onOpenChange={setMostrarFormularioEdicion}>
          <DialogContent className="max-w-2xl w-full max-h-[70vh] p-0 flex flex-col">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>
                {celdaSeleccionada.tipo === 'vacio' ? 'Agregar Elemento' : 'Editar Elemento'}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 pt-0">
              <FormularioElemento
                celda={celdaSeleccionada}
                onGuardar={(celdaId, tipo, datos) => {
                  actualizarCelda(celdaId, tipo, datos);
                  setMostrarFormularioEdicion(false);
                }}
                onCancelar={() => {
                  setMostrarFormularioEdicion(false);
                  if (celdaSeleccionada.tipo === 'vacio') {
                    setCeldaSeleccionada(null);
                  }
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* 🧑‍🌾 DIÁLOGO PARA EL PERFIL DEL USUARIO */}
      <Dialog open={mostrarFormularioPerfil} onOpenChange={setMostrarFormularioPerfil}>
        <DialogContent className="max-w-4xl w-full max-h-[80vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-t-lg">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <User className="h-6 w-6" />
              Mi Perfil de Agricultor
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {cargandoPerfil ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Spinner className="w-12 h-12 text-yellow-500 mb-4" />
                <p className="text-lg font-medium text-gray-700">Cargando tu perfil...</p>
              </div>
            ) : (
              <FormularioPerfil 
                datos={perfilUsuario}
                onGuardar={(datos) => {
                  guardarPerfilUsuario(datos);
                }}
                onCancelar={() => setMostrarFormularioPerfil(false)}
              />
            )}
          </div>
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
                key={tipo.value}                className={`cursor-pointer ${
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
const FormularioCultivo: React.FC<{ 
  formData: any; 
  setFormData: (data: any) => void;
  ubicacionesExistentes?: UbicacionGeodata[];
}> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [showMapSelector, setShowMapSelector] = useState(false);

  const handleLocationSelect = (location: any) => {
    setFormData({
      ...formData,
      ubicacion: {
        pais: 'Perú',
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        direccion: location.address || '',
        coordenadas: { 
          lat: location.lat, 
          lng: location.lng 
        },
        altitud: location.altitude || 0,
        caracteristicas_geograficas: location.climateData ? [location.climateData.region] : [],
        clima: location.climateData?.climate || '',
        temperatura: location.climateData?.temperature || '',
        precipitacion: location.climateData?.precipitation || '',
        accesibilidad: 'buena',
        carreteras_principales: [],
        distancia_capital_km: 0
      }
    });
    setShowMapSelector(false);
  };

  return (
    <div className="farm-form space-y-4">
      {/* Eliminar la sección explicativa del formulario */}
      <div className="farm-section">
        <h3 className="farm-section-title">🌱 Información del Cultivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipo" className="farm-label">Tipo de cultivo *</Label>
            <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger className="farm-select">
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
          <div>
            <Label htmlFor="variedad" className="farm-label">Variedad *</Label>
            <Input
              id="variedad"
              value={formData.variedad || ''}
              onChange={(e) => setFormData({ ...formData, variedad: e.target.value })}
              className="farm-input"
              placeholder="Ej: Papa Canchán"
            />
          </div>
        </div>
      </div>

      <div className="farm-section">
        <h3 className="farm-section-title">📏 Dimensiones y Rendimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
            <Label htmlFor="area" className="farm-label">Área (hectáreas) *</Label>
                <Input
                  id="area"
                  type="number"
              min="0"
                  step="0.1"
                  value={formData.area || ''}
                  onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
              className="farm-input"
                  placeholder="Ej: 2.5"
                />
              </div>
              <div>
            <Label htmlFor="rendimientoEstimado" className="farm-label">Rendimiento estimado (kg/ha) *</Label>
                <Input
              id="rendimientoEstimado"
              type="number"
              min="0"
              value={formData.rendimientoEstimado || ''}
              onChange={(e) => setFormData({ ...formData, rendimientoEstimado: parseFloat(e.target.value) })}
              className="farm-input"
              placeholder="Ej: 25000"
                />
              </div>
              <div>
            <Label htmlFor="costoInversion" className="farm-label">Costo de inversión (S/) *</Label>
                <Input
              id="costoInversion"
              type="number"
              min="0"
              value={formData.costoInversion || ''}
              onChange={(e) => setFormData({ ...formData, costoInversion: parseFloat(e.target.value) })}
              className="farm-input"
              placeholder="Ej: 15000"
                />
              </div>
            </div>
          </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🌱 Técnicas de Cultivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
            <Label htmlFor="sistemaCultivo" className="farm-label">Sistema de cultivo *</Label>
            <Select value={formData.sistemaCultivo || ''} onValueChange={(value) => setFormData({ ...formData, sistemaCultivo: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar sistema" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="convencional">🌾 Convencional</SelectItem>
                <SelectItem value="organico">🌱 Orgánico</SelectItem>
                <SelectItem value="hidroponico">💧 Hidropónico</SelectItem>
                <SelectItem value="invernadero">🏗️ Invernadero</SelectItem>
                <SelectItem value="agroecologico">🌿 Agroecológico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
            <Label htmlFor="metodoSiembra" className="farm-label">Método de siembra *</Label>
            <Select value={formData.metodoSiembra || ''} onValueChange={(value) => setFormData({ ...formData, metodoSiembra: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="directa">🌱 Siembra Directa</SelectItem>
                <SelectItem value="trasplante">🌿 Trasplante</SelectItem>
                <SelectItem value="surcos">🌾 Surcos</SelectItem>
                <SelectItem value="camellones">🏔️ Camellones</SelectItem>
                <SelectItem value="terrazas">🏞️ Terrazas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
            </div>

      <div className="farm-section">
        <h3 className="farm-section-title">💧 Sistema de Riego</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
            <Label htmlFor="tipoRiego" className="farm-label">Tipo de riego *</Label>
            <Select value={formData.tipoRiego || ''} onValueChange={(value) => setFormData({ ...formData, tipoRiego: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="goteo">💧 Goteo</SelectItem>
                <SelectItem value="aspersion">🌧️ Aspersión</SelectItem>
                <SelectItem value="gravedad">🌊 Gravedad</SelectItem>
                <SelectItem value="inundacion">🌊 Inundación</SelectItem>
                <SelectItem value="microaspersion">💦 Microaspersión</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
            <Label htmlFor="frecuenciaRiego" className="farm-label">Frecuencia de riego *</Label>
            <Select value={formData.frecuenciaRiego || ''} onValueChange={(value) => setFormData({ ...formData, frecuenciaRiego: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="diario">Diario</SelectItem>
                <SelectItem value="alternado">Día por medio</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="quincenal">Quincenal</SelectItem>
                <SelectItem value="por_necesidad">Por necesidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
            </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🌿 Fertilización y Nutrientes</h3>
        <div className="grid grid-cols-1 gap-4">
              <div>
            <Label htmlFor="tipoFertilizante" className="farm-label">Tipo de fertilizante principal *</Label>
            <Select value={formData.tipoFertilizante || ''} onValueChange={(value) => setFormData({ ...formData, tipoFertilizante: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="organico">🌱 Orgánico</SelectItem>
                <SelectItem value="quimico">🧪 Químico</SelectItem>
                <SelectItem value="mixto">🔄 Mixto</SelectItem>
                <SelectItem value="biofertilizante">🦠 Biofertilizante</SelectItem>
                <SelectItem value="compost">🍂 Compost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
            <Label htmlFor="frecuenciaFertilizacion" className="farm-label">Frecuencia de fertilización *</Label>
            <Select value={formData.frecuenciaFertilizacion || ''} onValueChange={(value) => setFormData({ ...formData, frecuenciaFertilizacion: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="pre_siembra">Pre-siembra</SelectItem>
                <SelectItem value="siembra">Siembra</SelectItem>
                <SelectItem value="crecimiento">Durante crecimiento</SelectItem>
                <SelectItem value="floracion">Floración</SelectItem>
                <SelectItem value="fructificacion">Fructificación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            <div>
            <Label htmlFor="analisisSuelo" className="farm-label">Último análisis de suelo</Label>
            <Textarea
              id="analisisSuelo"
              value={formData.analisisSuelo || ''}
              onChange={(e) => setFormData({ ...formData, analisisSuelo: e.target.value })}
              className="farm-input"
              placeholder="Detalles del análisis de suelo (pH, nutrientes, etc.)"
              />
            </div>
          </div>
      </div>

      <div className="farm-section">
        <h3 className="farm-section-title">📅 Ciclo de Cultivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
            <Label htmlFor="fechaPlantacion" className="farm-label">Fecha de plantación *</Label>
                <Input
              id="fechaPlantacion"
              type="date"
              value={formData.fechaPlantacion || ''}
              onChange={(e) => setFormData({ ...formData, fechaPlantacion: e.target.value })}
              className="farm-input"
                />
              </div>
              <div>
            <Label htmlFor="fechaCosechaEstimada" className="farm-label">Fecha estimada de cosecha *</Label>
                <Input
              id="fechaCosechaEstimada"
              type="date"
              value={formData.fechaCosechaEstimada || ''}
              onChange={(e) => setFormData({ ...formData, fechaCosechaEstimada: e.target.value })}
              className="farm-input"
            />
          </div>
              </div>
            </div>

      <div className="farm-section">
        <h3 className="farm-section-title">📊 Monitoreo y Control</h3>
        <div className="grid grid-cols-1 gap-4">
            <div>
            <Label htmlFor="estadoCultivo" className="farm-label">Estado actual del cultivo *</Label>
            <Select value={formData.estadoCultivo || ''} onValueChange={(value) => setFormData({ ...formData, estadoCultivo: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="excelente">⭐ Excelente</SelectItem>
                <SelectItem value="bueno">👍 Bueno</SelectItem>
                <SelectItem value="regular">👌 Regular</SelectItem>
                <SelectItem value="deficiente">⚠️ Deficiente</SelectItem>
                <SelectItem value="critico">❌ Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
            <Label htmlFor="problemasDetectados" className="farm-label">Problemas detectados</Label>
              <Textarea
              id="problemasDetectados"
              value={formData.problemasDetectados || ''}
              onChange={(e) => setFormData({ ...formData, problemasDetectados: e.target.value })}
              className="farm-input"
              placeholder="Describa cualquier problema detectado (plagas, enfermedades, deficiencias, etc.)"
              />
            </div>
              <div>
            <Label htmlFor="medidasPreventivas" className="farm-label">Medidas preventivas aplicadas</Label>
            <Textarea
              id="medidasPreventivas"
              value={formData.medidasPreventivas || ''}
              onChange={(e) => setFormData({ ...formData, medidasPreventivas: e.target.value })}
              className="farm-input"
              placeholder="Describa las medidas preventivas aplicadas"
                />
              </div>
              </div>
            </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🗺️ Ubicación y Clima</h3>
        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="outline" 
            onClick={() => setShowMapSelector(true)}
            className="w-full farm-button"
          >
            {formData.ubicacion ? 'Cambiar ubicación' : 'Seleccionar ubicación'}
          </Button>
          
          {formData.ubicacion && (
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2">
            <div>
                  <Label className="text-sm font-medium text-green-800">País</Label>
                  <div className="text-sm">{formData.ubicacion.pais}</div>
            </div>
            <div>
                  <Label className="text-sm font-medium text-green-800">Departamento</Label>
                  <div className="text-sm">{formData.ubicacion.departamento}</div>
            </div>
              <div>
                  <Label className="text-sm font-medium text-green-800">Provincia</Label>
                  <div className="text-sm">{formData.ubicacion.provincia}</div>
              </div>
              <div>
                  <Label className="text-sm font-medium text-green-800">Distrito</Label>
                  <div className="text-sm">{formData.ubicacion.distrito}</div>
              </div>
              <div>
                  <Label className="text-sm font-medium text-green-800">Altitud</Label>
                  <div className="text-sm">{formData.ubicacion.altitud} m.s.n.m.</div>
              </div>
              <div>
                  <Label className="text-sm font-medium text-green-800">Clima</Label>
                  <div className="text-sm">{formData.ubicacion.clima}</div>
              </div>
            <div>
                  <Label className="text-sm font-medium text-green-800">Temperatura</Label>
                  <div className="text-sm">{formData.ubicacion.temperatura}</div>
            </div>
            <div>
                  <Label className="text-sm font-medium text-green-800">Precipitación</Label>
                  <div className="text-sm">{formData.ubicacion.precipitacion}</div>
            </div>
                </div>
              </div>
            )}
        </div>
      </div>

      <Dialog open={showMapSelector} onOpenChange={setShowMapSelector}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecciona la ubicación del cultivo</DialogTitle>
          </DialogHeader>
          <MapSelector
            isOpen={showMapSelector}
            onClose={() => setShowMapSelector(false)}
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.ubicacion}
            ubicacionesExistentes={ubicacionesExistentes}
          />
        </DialogContent>
      </Dialog>
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

      
    </div>
  );
};

// 🏪 FORMULARIO INTELIGENTE PARA PROVEEDORES MEJORADO
const FormularioProveedorInteligente: React.FC<{ formData: any; setFormData: (data: any) => void; ubicacionesExistentes: UbicacionGeodata[] }> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [showMapSelector, setShowMapSelector] = useState(false);

  const handleLocationSelect = (location: any) => {
    setFormData({ 
      ...formData, 
      ubicacion: {
        pais: 'Perú',
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        direccion: location.address || '',
        coordenadas: { 
          lat: location.lat, 
          lng: location.lng 
        },
        altitud: location.altitude || 0,
        caracteristicas_geograficas: location.climateData ? [location.climateData.region] : [],
        clima: location.climateData?.climate || '',
        temperatura: location.climateData?.temperature || '',
        precipitacion: location.climateData?.precipitation || '',
        accesibilidad: 'buena',
        carreteras_principales: [],
        distancia_capital_km: 0
      }
    });
    setShowMapSelector(false);
  };

        return (
    <div className="farm-form space-y-4">
      <div className="farm-section">
        <h3 className="farm-section-title">🏪 Información del Proveedor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre" className="farm-label">Nombre del proveedor *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="farm-input"
              placeholder="Ej: AgroInsumos Perú"
                  />
                </div>
          <div>
            <Label htmlFor="tipo" className="farm-label">Tipo de proveedor *</Label>
                  <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger className="farm-select">
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
            </div>

      <div className="farm-section">
        <h3 className="farm-section-title">📦 Productos y Servicios</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="productos" className="farm-label">Productos principales *</Label>
            <Textarea
              id="productos"
              value={formData.productos || ''}
              onChange={(e) => setFormData({ ...formData, productos: e.target.value })}
              className="farm-input"
              placeholder="Lista de productos principales que ofrece"
                />
              </div>
          <div>
            <Label htmlFor="certificaciones" className="farm-label">Certificaciones</Label>
            <Textarea
                  id="certificaciones"
                  value={formData.certificaciones || ''}
                  onChange={(e) => setFormData({ ...formData, certificaciones: e.target.value })}
              className="farm-input"
              placeholder="Certificaciones de calidad, orgánicas, etc."
                />
              </div>
            </div>
          </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🚚 Logística y Entrega</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
            <Label htmlFor="tiempoEntrega" className="farm-label">Tiempo de entrega promedio *</Label>
            <Select value={formData.tiempoEntrega || ''} onValueChange={(value) => setFormData({ ...formData, tiempoEntrega: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar tiempo" />
                    </SelectTrigger>
                    <SelectContent>
                <SelectItem value="inmediato">Inmediato (24h)</SelectItem>
                <SelectItem value="rapido">Rápido (2-3 días)</SelectItem>
                <SelectItem value="normal">Normal (1 semana)</SelectItem>
                <SelectItem value="largo">Largo (2+ semanas)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
            <Label htmlFor="capacidadEntrega" className="farm-label">Capacidad de entrega *</Label>
            <Select value={formData.capacidadEntrega || ''} onValueChange={(value) => setFormData({ ...formData, capacidadEntrega: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar capacidad" />
                    </SelectTrigger>
                    <SelectContent>
                <SelectItem value="pequena">Pequeña (hasta 1 ton)</SelectItem>
                <SelectItem value="mediana">Mediana (1-5 ton)</SelectItem>
                <SelectItem value="grande">Grande (5+ ton)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
              </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🗺️ Ubicación y Cobertura</h3>
        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="outline" 
            onClick={() => setShowMapSelector(true)}
            className="w-full farm-button"
          >
            {formData.ubicacion ? 'Cambiar ubicación' : 'Seleccionar ubicación'}
          </Button>
          <div>
            <Label htmlFor="zonasCobertura" className="farm-label">Zonas de cobertura *</Label>
                  <Textarea
              id="zonasCobertura"
              value={formData.zonasCobertura || ''}
              onChange={(e) => setFormData({ ...formData, zonasCobertura: e.target.value })}
              className="farm-input"
              placeholder="Departamentos o provincias que atiende"
                  />
                </div>
              </div>
            </div>

      <Dialog open={showMapSelector} onOpenChange={setShowMapSelector}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecciona la ubicación del proveedor</DialogTitle>
          </DialogHeader>
          <MapSelector
            isOpen={showMapSelector}
            onClose={() => setShowMapSelector(false)}
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.ubicacion}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// 👥 FORMULARIO INTELIGENTE PARA CLIENTES MEJORADO
const FormularioClienteInteligente: React.FC<{ 
  formData: any; 
  setFormData: (data: any) => void;
  ubicacionesExistentes?: UbicacionGeodata[];
}> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");
  const [otroProducto, setOtroProducto] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [precio, setPrecio] = useState<number>(0);
  const [frecuenciaProducto, setFrecuenciaProducto] = useState<string>("semanal");
  
  // Lista predefinida de productos agrícolas comunes en Perú
  const productosAgricolas = [
    { nombre: 'Papa', precio_sugerido: 2.50 },
    { nombre: 'Maíz', precio_sugerido: 3.20 },
    { nombre: 'Quinua', precio_sugerido: 15.00 },
    { nombre: 'Habas', precio_sugerido: 4.80 },
    { nombre: 'Oca', precio_sugerido: 3.50 },
    { nombre: 'Olluco', precio_sugerido: 4.00 },
    { nombre: 'Cebada', precio_sugerido: 2.80 },
    { nombre: 'Trigo', precio_sugerido: 3.00 },
    { nombre: 'Café', precio_sugerido: 18.00 },
    { nombre: 'Cacao', precio_sugerido: 12.00 },
    { nombre: 'Arroz', precio_sugerido: 3.50 },
    { nombre: 'Otros', precio_sugerido: 0.00 },
  ];

  // Inicializar productos_compra si no existe
  useEffect(() => {
    if (!formData.productos_compra) {
      setFormData({
        ...formData,
        productos_compra: []
      });
    }
  }, []);

  const handleAgregarProducto = () => {
    let nombreProducto = productoSeleccionado;
    if (productoSeleccionado === "Otros" && otroProducto.trim() !== "") {
      nombreProducto = otroProducto;
    } else if (productoSeleccionado === "Otros" && otroProducto.trim() === "") {
      return; // No añadir si es "Otros" pero no se ha especificado el nombre
    } else if (productoSeleccionado === "") {
      return; // No añadir si no se ha seleccionado un producto
    }
    
    const nuevoProducto = {
      nombre: nombreProducto,
      cantidad_kg: cantidad,
      precio_kg: precio,
      frecuencia: frecuenciaProducto
    };
    
    setFormData({
      ...formData,
      productos_compra: [...(formData.productos_compra || []), nuevoProducto]
    });
    
    // Limpiar el formulario
    setProductoSeleccionado("");
    setOtroProducto("");
    setCantidad(0);
    setPrecio(0);
    setFrecuenciaProducto("semanal");
  };
  
  const handleEliminarProducto = (index: number) => {
    const nuevosProductos = [...formData.productos_compra];
    nuevosProductos.splice(index, 1);
    setFormData({
      ...formData,
      productos_compra: nuevosProductos
    });
  };

  const handleLocationSelect = (location: any) => {
    setFormData({ 
      ...formData, 
      ubicacion: {
        pais: 'Perú',
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        direccion: location.address || '',
        coordenadas: { 
          lat: location.lat, 
          lng: location.lng 
        },
        altitud: location.altitude || 0,
        caracteristicas_geograficas: location.climateData ? [location.climateData.region] : [],
        clima: location.climateData?.climate || '',
        temperatura: location.climateData?.temperature || '',
        precipitacion: location.climateData?.precipitation || '',
        accesibilidad: 'buena',
        carreteras_principales: [],
        distancia_capital_km: 0
      }
    });
    setShowMapSelector(false);
  };

  // Cuando se selecciona un producto, establecer el precio sugerido
  useEffect(() => {
    if (productoSeleccionado && productoSeleccionado !== "Otros") {
      const productoEncontrado = productosAgricolas.find(p => p.nombre === productoSeleccionado);
      if (productoEncontrado) {
        setPrecio(productoEncontrado.precio_sugerido);
      }
    } else if (productoSeleccionado === "Otros") {
      setPrecio(0);
    }
  }, [productoSeleccionado]);

  return (
    <div className="farm-form space-y-4">
      <div className="farm-section">
        <h3 className="farm-section-title">👥 Información del Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre" className="farm-label">Nombre del cliente *</Label>
            <Input
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="farm-input"
              placeholder="Ej: Mercado Central de Lima"
            />
          </div>
          <div>
            <Label htmlFor="tipo" className="farm-label">Tipo de cliente *</Label>
            <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mercado">🏪 Mercado</SelectItem>
                <SelectItem value="restaurante">🍽️ Restaurante</SelectItem>
                <SelectItem value="distribuidor">🚚 Distribuidor</SelectItem>
                <SelectItem value="exportador">🌎 Exportador</SelectItem>
                <SelectItem value="procesador">🏭 Procesador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🛒 Productos que Compra</h3>
        
        {/* Formulario para añadir productos */}
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h4 className="text-green-800 font-medium mb-3">Añadir Producto</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="producto" className="farm-label">Producto *</Label>
              <Select 
                value={productoSeleccionado} 
                onValueChange={setProductoSeleccionado}
              >
                <SelectTrigger className="farm-select">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productosAgricolas.map((producto, index) => (
                    <SelectItem key={index} value={producto.nombre}>
                      {producto.nombre === "Otros" ? "✏️ Otros (especificar)" : producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {productoSeleccionado === "Otros" && (
              <div>
                <Label htmlFor="otroProducto" className="farm-label">Especificar producto *</Label>
                <Input
                  id="otroProducto"
                  value={otroProducto}
                  onChange={(e) => setOtroProducto(e.target.value)}
                  className="farm-input"
                  placeholder="Ej: Aguaymanto, Kiwicha, etc."
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="cantidad" className="farm-label">Cantidad (kg) *</Label>
              <Input
                id="cantidad"
                type="number"
                min="0"
                step="0.1"
                value={cantidad || ''}
                onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)}
                className="farm-input"
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="precio" className="farm-label">Precio (S/kg) *</Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                value={precio || ''}
                onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
                className="farm-input"
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="frecuenciaProducto" className="farm-label">Frecuencia *</Label>
              <Select 
                value={frecuenciaProducto} 
                onValueChange={setFrecuenciaProducto}
              >
                <SelectTrigger className="farm-select">
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diaria</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quincenal">Quincenal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="temporada">Por Temporada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={handleAgregarProducto}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!productoSeleccionado || (productoSeleccionado === "Otros" && !otroProducto.trim()) || cantidad <= 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Producto
          </Button>
        </div>
        
        {/* Lista de productos añadidos */}
        <div className="space-y-3">
          <h4 className="text-green-800 font-medium">Productos Añadidos</h4>
          
          {formData.productos_compra && formData.productos_compra.length > 0 ? (
            <div className="space-y-2">
              {formData.productos_compra.map((producto: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200">
                  <div>
                    <div className="font-medium">{producto.nombre}</div>
                    <div className="text-sm text-gray-600">
                      {producto.cantidad_kg} kg a S/{producto.precio_kg}/kg • {producto.frecuencia}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEliminarProducto(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Total de productos:</span>
                  <span className="font-semibold text-green-900">{formData.productos_compra.length}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium text-green-800">Volumen total (kg):</span>
                  <span className="font-semibold text-green-900">
                    {formData.productos_compra
                      .reduce((sum: number, p: any) => sum + (p.cantidad_kg || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium text-green-800">Valor total (S/):</span>
                  <span className="font-semibold text-green-900">
                    {formData.productos_compra
                      .reduce((sum: number, p: any) => sum + ((p.cantidad_kg || 0) * (p.precio_kg || 0)), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-500">No hay productos añadidos</div>
              <div className="text-sm text-gray-400">Usa el formulario de arriba para añadir productos</div>
            </div>
          )}
        </div>
        
        {/* Observaciones adicionales */}
        <div className="mt-4">
          <Label htmlFor="observaciones" className="farm-label">Observaciones adicionales</Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones || ''}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            className="farm-input"
            placeholder="Detalles específicos sobre los productos, requisitos de calidad, etc."
            rows={3}
          />
        </div>
      </div>

      <div className="farm-section">
        <h3 className="farm-section-title">📅 Información de Compra</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="frecuenciaGeneral" className="farm-label">Frecuencia general de compra *</Label>
            <Select value={formData.frecuenciaGeneral || ''} onValueChange={(value) => setFormData({ ...formData, frecuenciaGeneral: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diaria">Diaria</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="quincenal">Quincenal</SelectItem>
                <SelectItem value="mensual">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="metodoPago" className="farm-label">Método de pago preferido</Label>
            <Select value={formData.metodoPago || ''} onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                <SelectItem value="yape">Yape/Plin</SelectItem>
                <SelectItem value="credito">Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🗺️ Ubicación y Clima</h3>
        <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
            onClick={() => setShowMapSelector(true)}
            className="w-full farm-button"
        >
            {formData.ubicacion ? 'Cambiar ubicación' : 'Seleccionar ubicación'}
        </Button>
          
          {formData.ubicacion && (
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm font-medium text-green-800">País</Label>
                  <div className="text-sm">{formData.ubicacion.pais}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Departamento</Label>
                  <div className="text-sm">{formData.ubicacion.departamento}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Provincia</Label>
                  <div className="text-sm">{formData.ubicacion.provincia}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Distrito</Label>
                  <div className="text-sm">{formData.ubicacion.distrito}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Altitud</Label>
                  <div className="text-sm">{formData.ubicacion.altitud} m.s.n.m.</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Clima</Label>
                  <div className="text-sm">{formData.ubicacion.clima}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Temperatura</Label>
                  <div className="text-sm">{formData.ubicacion.temperatura}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Precipitación</Label>
                  <div className="text-sm">{formData.ubicacion.precipitacion}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showMapSelector} onOpenChange={setShowMapSelector}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecciona la ubicación del cliente</DialogTitle>
          </DialogHeader>
          <MapSelector
            isOpen={showMapSelector}
            onClose={() => setShowMapSelector(false)}
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.ubicacion}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// 👷 FORMULARIO INTELIGENTE PARA TRABAJADORES MEJORADO
const FormularioTrabajadorInteligente: React.FC<{ 
  formData: any; 
  setFormData: (data: any) => void;
  ubicacionesExistentes?: UbicacionGeodata[];
}> = ({ formData, setFormData, ubicacionesExistentes = [] }) => {
  const [showMapSelector, setShowMapSelector] = useState(false);

  const handleLocationSelect = (location: any) => {
                setFormData({ 
                  ...formData, 
      ubicacion: {
        pais: 'Perú',
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        direccion: location.address || '',
        coordenadas: { 
          lat: location.lat, 
          lng: location.lng 
        },
        altitud: location.altitude || 0,
        caracteristicas_geograficas: location.climateData ? [location.climateData.region] : [],
        clima: location.climateData?.climate || '',
        temperatura: location.climateData?.temperature || '',
        precipitacion: location.climateData?.precipitation || '',
        accesibilidad: 'buena',
        carreteras_principales: [],
        distancia_capital_km: 0
      }
    });
    setShowMapSelector(false);
  };

        return (
    <div className="farm-form space-y-4">
      <div className="farm-section">
        <h3 className="farm-section-title">👨‍🌾 Información del Trabajador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
            <Label htmlFor="nombre" className="farm-label">Nombre *</Label>
                  <Input
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="farm-input"
              placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
            <Label htmlFor="rol" className="farm-label">Rol *</Label>
            <Select value={formData.rol || ''} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                <SelectItem value="campesino">👨‍🌾 Campesino</SelectItem>
                <SelectItem value="supervisor">👨‍💼 Supervisor</SelectItem>
                <SelectItem value="técnico">👨‍🔧 Técnico Agrícola</SelectItem>
                <SelectItem value="operario">👨‍🏭 Operario de Maquinaria</SelectItem>
                <SelectItem value="jefe">👨‍💼 Jefe de Campo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🎯 Especialidades y Experiencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
            <Label htmlFor="especialidad" className="farm-label">Especialidad *</Label>
            <Select value={formData.especialidad || ''} onValueChange={(value) => setFormData({ ...formData, especialidad: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                <SelectItem value="cultivo_papa">🥔 Cultivo de Papa</SelectItem>
                <SelectItem value="cultivo_quinua">🌾 Cultivo de Quinua</SelectItem>
                <SelectItem value="riego">💧 Sistemas de Riego</SelectItem>
                <SelectItem value="maquinaria">🚜 Maquinaria Agrícola</SelectItem>
                <SelectItem value="fertilizacion">🌱 Fertilización</SelectItem>
                <SelectItem value="control_plagas">🐛 Control de Plagas</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
          <div>
            <Label htmlFor="añosExperiencia" className="farm-label">Años de experiencia *</Label>
                    <Input
              id="añosExperiencia"
                      type="number"
                      min="0"
              value={formData.añosExperiencia || ''}
              onChange={(e) => setFormData({ ...formData, añosExperiencia: parseInt(e.target.value) })}
              className="farm-input"
              placeholder="Ej: 5"
            />
                </div>
                <div>
            <Label htmlFor="disponibilidad" className="farm-label">Disponibilidad *</Label>
            <Select value={formData.disponibilidad || ''} onValueChange={(value) => setFormData({ ...formData, disponibilidad: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                <SelectItem value="tiempo_completo">Tiempo Completo</SelectItem>
                <SelectItem value="tiempo_parcial">Tiempo Parcial</SelectItem>
                <SelectItem value="temporal">Temporal</SelectItem>
                <SelectItem value="por_estacion">Por Estación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
              </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🗺️ Ubicación y Clima</h3>
        <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
            onClick={() => setShowMapSelector(true)}
            className="w-full farm-button"
        >
            {formData.ubicacion ? 'Cambiar ubicación' : 'Seleccionar ubicación'}
        </Button>
          
          {formData.ubicacion && (
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2">
        <div>
                  <Label className="text-sm font-medium text-green-800">País</Label>
                  <div className="text-sm">{formData.ubicacion.pais}</div>
        </div>
        <div>
                  <Label className="text-sm font-medium text-green-800">Departamento</Label>
                  <div className="text-sm">{formData.ubicacion.departamento}</div>
        </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Provincia</Label>
                  <div className="text-sm">{formData.ubicacion.provincia}</div>
      </div>
        <div>
                  <Label className="text-sm font-medium text-green-800">Distrito</Label>
                  <div className="text-sm">{formData.ubicacion.distrito}</div>
        </div>
        <div>
                  <Label className="text-sm font-medium text-green-800">Altitud</Label>
                  <div className="text-sm">{formData.ubicacion.altitud} m.s.n.m.</div>
        </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Clima</Label>
                  <div className="text-sm">{formData.ubicacion.clima}</div>
      </div>
        <div>
                  <Label className="text-sm font-medium text-green-800">Temperatura</Label>
                  <div className="text-sm">{formData.ubicacion.temperatura}</div>
        </div>
        <div>
                  <Label className="text-sm font-medium text-green-800">Precipitación</Label>
                  <div className="text-sm">{formData.ubicacion.precipitacion}</div>
        </div>
      </div>
        </div>
          )}
        </div>
      </div>

      <Dialog open={showMapSelector} onOpenChange={setShowMapSelector}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecciona la ubicación del trabajador</DialogTitle>
          </DialogHeader>
          <MapSelector
            isOpen={showMapSelector}
            onClose={() => setShowMapSelector(false)}
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.ubicacion}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// 🏭 FORMULARIO PARA ALMACENES
const FormularioAlmacen: React.FC<{ formData: any; setFormData: (data: any) => void }> = ({ formData, setFormData }) => {
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");
  const [otroProducto, setOtroProducto] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [unidad, setUnidad] = useState<string>("kg");
  const [fechaIngreso, setFechaIngreso] = useState<string>("");
  const [fechaVencimiento, setFechaVencimiento] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [hectareasCorrespondientes, setHectareasCorrespondientes] = useState<number>(0);
  const [origen, setOrigen] = useState<string>("");
  
  // Lista de productos agrícolas y otros items comunes en almacenes
  const productosAlmacenables = [
    { nombre: 'Papa', unidad_default: 'kg' },
    { nombre: 'Maíz', unidad_default: 'kg' },
    { nombre: 'Quinua', unidad_default: 'kg' },
    { nombre: 'Habas', unidad_default: 'kg' },
    { nombre: 'Semillas', unidad_default: 'kg' },
    { nombre: 'Fertilizante', unidad_default: 'kg' },
    { nombre: 'Pesticidas', unidad_default: 'litros' },
    { nombre: 'Herramientas', unidad_default: 'unidades' },
    { nombre: 'Maquinaria', unidad_default: 'unidades' },
    { nombre: 'Otros', unidad_default: 'kg' },
  ];

  // Inicializar items del almacén si no existe
  useEffect(() => {
    if (!formData.items) {
      setFormData({
        ...formData,
        items: [],
        capacidad_total: 0,
        capacidad_usada: 0
      });
    }
  }, []);

  const handleLocationSelect = (location: any) => {
    setFormData({ 
      ...formData, 
      ubicacion: {
        pais: 'Perú',
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        direccion: location.address || '',
        coordenadas: { 
          lat: location.lat, 
          lng: location.lng 
        },
        altitud: location.altitude || 0,
        caracteristicas_geograficas: location.climateData ? [location.climateData.region] : [],
        clima: location.climateData?.climate || '',
        temperatura: location.climateData?.temperature || '',
        precipitacion: location.climateData?.precipitation || '',
        accesibilidad: 'buena',
        carreteras_principales: [],
        distancia_capital_km: 0
      }
    });
    setShowMapSelector(false);
  };
  
  const handleAgregarProducto = () => {
    let nombreProducto = productoSeleccionado;
    if (productoSeleccionado === "Otros" && otroProducto.trim() !== "") {
      nombreProducto = otroProducto;
    } else if (productoSeleccionado === "Otros" && otroProducto.trim() === "") {
      return; // No añadir si es "Otros" pero no se ha especificado el nombre
    } else if (productoSeleccionado === "") {
      return; // No añadir si no se ha seleccionado un producto
    }
    
    const nuevoItem = {
      nombre: nombreProducto,
      cantidad: cantidad,
      unidad: unidad,
      fecha_ingreso: fechaIngreso,
      fecha_vencimiento: fechaVencimiento !== "" ? fechaVencimiento : undefined,
      valor: valor,
      hectareas_correspondientes: hectareasCorrespondientes,
      origen: origen
    };
    
    // Actualizar la capacidad usada
    let nuevaCapacidadUsada = (formData.capacidad_usada || 0);
    if (unidad === "kg" || unidad === "litros") {
      nuevaCapacidadUsada += cantidad;
    } else {
      // Para unidades, contamos cada unidad como 50kg promedio
      nuevaCapacidadUsada += cantidad * 50;
    }
    
    setFormData({
      ...formData,
      items: [...(formData.items || []), nuevoItem],
      capacidad_usada: nuevaCapacidadUsada
    });
    
    // Limpiar formulario
    setProductoSeleccionado("");
    setOtroProducto("");
    setCantidad(0);
    setUnidad("kg");
    setFechaIngreso("");
    setFechaVencimiento("");
    setValor(0);
    setHectareasCorrespondientes(0);
    setOrigen("");
  };
  
  const handleEliminarItem = (index: number) => {
    const itemsActuales = [...formData.items];
    const itemEliminado = itemsActuales[index];
    
    // Actualizar la capacidad usada
    let nuevaCapacidadUsada = formData.capacidad_usada;
    if (itemEliminado.unidad === "kg" || itemEliminado.unidad === "litros") {
      nuevaCapacidadUsada -= itemEliminado.cantidad;
    } else {
      // Para unidades, contamos cada unidad como 50kg promedio
      nuevaCapacidadUsada -= itemEliminado.cantidad * 50;
    }
    
    itemsActuales.splice(index, 1);
    setFormData({
      ...formData,
      items: itemsActuales,
      capacidad_usada: nuevaCapacidadUsada
    });
  };
  
  // Cuando se selecciona un producto, establecer la unidad por defecto
  useEffect(() => {
    if (productoSeleccionado && productoSeleccionado !== "Otros") {
      const productoEncontrado = productosAlmacenables.find(p => p.nombre === productoSeleccionado);
      if (productoEncontrado) {
        setUnidad(productoEncontrado.unidad_default);
      }
    }
  }, [productoSeleccionado]);
  
  // Calcular el porcentaje de uso del almacén
  const porcentajeUso = formData.capacidad_total > 0 
    ? Math.min(100, Math.round((formData.capacidad_usada / formData.capacidad_total) * 100)) 
    : 0;

  return (
    <div className="farm-form space-y-4">
      <div className="farm-section">
        <h3 className="farm-section-title">🏭 Información del Almacén</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre" className="farm-label">Nombre del almacén *</Label>
            <Input
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="farm-input"
              placeholder="Ej: Almacén Central"
            />
          </div>
          <div>
            <Label htmlFor="tipo" className="farm-label">Tipo de almacén *</Label>
            <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger className="farm-select">
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
      </div>
      
      <div className="farm-section">
        <h3 className="farm-section-title">📊 Capacidad y Condiciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capacidad_total" className="farm-label">Capacidad total (kg) *</Label>
            <Input
              id="capacidad_total"
              type="number"
              min="0"
              value={formData.capacidad_total || ''}
              onChange={(e) => setFormData({ ...formData, capacidad_total: parseFloat(e.target.value) })}
              className="farm-input"
              placeholder="Ej: 5000"
            />
          </div>
          <div>
            <Label htmlFor="capacidad_usada" className="farm-label">Capacidad usada actual</Label>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-sm">
                <span>{formData.capacidad_usada || 0} kg</span>
                <span>{porcentajeUso}%</span>
              </div>
              <Progress value={porcentajeUso} className="h-2" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="temperatura_control"
              checked={formData.temperatura_control || false}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, temperatura_control: checked === true })
              }
            />
            <Label htmlFor="temperatura_control" className="font-medium cursor-pointer">
              Control de temperatura
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="humedad_control"
              checked={formData.humedad_control || false}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, humedad_control: checked === true })
              }
            />
            <Label htmlFor="humedad_control" className="font-medium cursor-pointer">
              Control de humedad
            </Label>
          </div>
        </div>
      </div>
      
      <div className="farm-section">
        <h3 className="farm-section-title">📋 Inventario Detallado</h3>
        
        {/* Formulario para añadir productos al almacén */}
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h4 className="text-green-800 font-medium mb-3">Añadir Producto al Inventario</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="producto" className="farm-label">Producto *</Label>
              <Select 
                value={productoSeleccionado} 
                onValueChange={setProductoSeleccionado}
              >
                <SelectTrigger className="farm-select">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productosAlmacenables.map((producto, index) => (
                    <SelectItem key={index} value={producto.nombre}>
                      {producto.nombre === "Otros" ? "✏️ Otros (especificar)" : producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {productoSeleccionado === "Otros" && (
              <div>
                <Label htmlFor="otroProducto" className="farm-label">Especificar producto *</Label>
                <Input
                  id="otroProducto"
                  value={otroProducto}
                  onChange={(e) => setOtroProducto(e.target.value)}
                  className="farm-input"
                  placeholder="Ej: Aguaymanto, Kiwicha, etc."
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="cantidad" className="farm-label">Cantidad *</Label>
              <Input
                id="cantidad"
                type="number"
                min="0"
                step="0.1"
                value={cantidad || ''}
                onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)}
                className="farm-input"
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="unidad" className="farm-label">Unidad *</Label>
              <Select 
                value={unidad} 
                onValueChange={setUnidad}
              >
                <SelectTrigger className="farm-select">
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                  <SelectItem value="toneladas">Toneladas</SelectItem>
                  <SelectItem value="litros">Litros</SelectItem>
                  <SelectItem value="unidades">Unidades</SelectItem>
                  <SelectItem value="sacos">Sacos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="valor" className="farm-label">Valor (S/)</Label>
              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                value={valor || ''}
                onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                className="farm-input"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="fecha_ingreso" className="farm-label">Fecha de ingreso *</Label>
              <Input
                id="fecha_ingreso"
                type="date"
                value={fechaIngreso}
                onChange={(e) => setFechaIngreso(e.target.value)}
                className="farm-input"
              />
            </div>
            <div>
              <Label htmlFor="fecha_vencimiento" className="farm-label">Fecha de vencimiento</Label>
              <Input
                id="fecha_vencimiento"
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="farm-input"
              />
            </div>
            <div>
              <Label htmlFor="hectareas" className="farm-label">Hectáreas correspondientes</Label>
              <Input
                id="hectareas"
                type="number"
                min="0"
                step="0.01"
                value={hectareasCorrespondientes || ''}
                onChange={(e) => setHectareasCorrespondientes(parseFloat(e.target.value) || 0)}
                className="farm-input"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="origen" className="farm-label">Origen / Procedencia</Label>
            <Input
              id="origen"
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              className="farm-input"
              placeholder="Ej: Producción propia, Proveedor XYZ, etc."
            />
          </div>
          
          <Button
            onClick={handleAgregarProducto}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!productoSeleccionado || (productoSeleccionado === "Otros" && !otroProducto.trim()) || cantidad <= 0 || !fechaIngreso}
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir al Inventario
          </Button>
        </div>
        
        {/* Lista de productos en inventario */}
        <div className="space-y-3">
          <h4 className="text-green-800 font-medium">Productos en Inventario</h4>
          
          {formData.items && formData.items.length > 0 ? (
            <div className="space-y-2">
              {formData.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200">
                  <div>
                    <div className="font-medium">{item.nombre}</div>
                    <div className="text-sm text-gray-600">
                      {item.cantidad} {item.unidad} • Valor: S/{item.valor} • Ingreso: {item.fecha_ingreso}
                    </div>
                    {item.hectareas_correspondientes > 0 && (
                      <div className="text-xs text-green-600">
                        Corresponde a {item.hectareas_correspondientes} hectáreas
                      </div>
                    )}
                    {item.origen && (
                      <div className="text-xs text-blue-600">
                        Origen: {item.origen}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEliminarItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Total de productos:</span>
                  <span className="font-semibold text-green-900">{formData.items.length}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium text-green-800">Valor total (S/):</span>
                  <span className="font-semibold text-green-900">
                    {formData.items
                      .reduce((sum: number, item: any) => sum + (item.valor || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium text-green-800">Capacidad ocupada:</span>
                  <span className="font-semibold text-green-900">
                    {formData.capacidad_usada} kg ({porcentajeUso}%)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-500">No hay productos en inventario</div>
              <div className="text-sm text-gray-400">Usa el formulario de arriba para añadir productos</div>
            </div>
          )}
        </div>
      </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🗺️ Ubicación</h3>
        <Button 
          variant="outline" 
          onClick={() => setShowMapSelector(true)}
          className="w-full farm-button"
        >
          {formData.ubicacion ? 'Cambiar ubicación' : 'Seleccionar ubicación'}
        </Button>
        
        {formData.ubicacion && (
          <div className="mt-4 bg-green-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-medium text-green-800">Departamento</Label>
                <div className="text-sm">{formData.ubicacion.departamento}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800">Provincia</Label>
                <div className="text-sm">{formData.ubicacion.provincia}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800">Distrito</Label>
                <div className="text-sm">{formData.ubicacion.distrito}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800">Altitud</Label>
                <div className="text-sm">{formData.ubicacion.altitud} m.s.n.m.</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="farm-section">
        <h3 className="farm-section-title">🚚 Logística y Rutas</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="almacenes_backup" className="farm-label">Almacenes de respaldo</Label>
            <Input
              id="almacenes_backup"
              value={formData.almacenes_backup || ''}
              onChange={(e) => setFormData({ ...formData, almacenes_backup: e.target.value })}
              className="farm-input"
              placeholder="Ej: Almacén secundario en Huancayo, Depósito en Lima"
            />
          </div>
          <div>
            <Label htmlFor="rutas_distribucion" className="farm-label">Rutas de distribución</Label>
            <Textarea
              id="rutas_distribucion"
              value={formData.rutas_distribucion || ''}
              onChange={(e) => setFormData({ ...formData, rutas_distribucion: e.target.value })}
              className="farm-input"
              placeholder="Describe las rutas principales de distribución desde este almacén"
              rows={3}
            />
          </div>
        </div>
      </div>

      <Dialog open={showMapSelector} onOpenChange={setShowMapSelector}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecciona la ubicación del almacén</DialogTitle>
          </DialogHeader>
          <MapSelector
            isOpen={showMapSelector}
            onClose={() => setShowMapSelector(false)}
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.ubicacion}
          />
        </DialogContent>
      </Dialog>
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
        pais: 'Perú',
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        direccion: location.address || '',
        coordenadas: { 
          lat: location.lat, 
          lng: location.lng 
        },
        altitud: location.altitude || 0,
        caracteristicas_geograficas: location.climateData ? [location.climateData.region] : [],
        clima: location.climateData?.climate || '',
        temperatura: location.climateData?.temperature || '',
        precipitacion: location.climateData?.precipitation || '',
        accesibilidad: 'buena',
        carreteras_principales: [],
        distancia_capital_km: 0
      }
    });
    setShowMapSelector(false);
  };

  // Función para marcar un campo como "No tengo información"
  const marcarSinInfo = (campo: string) => {
    setFormData({ 
      ...formData, 
      [campo]: "sin_informacion" 
    });
  };

  // Calcular el porcentaje de nivel actual
  const nivelActualPorcentaje = formData.nivel_actual || 0;

  return (
    <div className="farm-form space-y-4">
      <div className="farm-section">
        <h3 className="farm-section-title">💧 Información de la Fuente de Agua</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre" className="farm-label">Nombre de la fuente de agua *</Label>
            <Input
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="farm-input"
              placeholder="Ej: Río Grande, Manantial El Mirador..."
            />
          </div>
          <div>
            <Label htmlFor="tipo" className="farm-label">Tipo de fuente de agua *</Label>
            <Select value={formData.tipo || ''} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rio">🏞️ Río</SelectItem>
                <SelectItem value="represa">🏞️ Represa</SelectItem>
                <SelectItem value="pozo">⛲ Pozo</SelectItem>
                <SelectItem value="laguna">🌊 Laguna</SelectItem>
                <SelectItem value="cisterna">💧 Cisterna</SelectItem>
                <SelectItem value="estanque">🌊 Estanque</SelectItem>
                <SelectItem value="canal">🚿 Canal de riego</SelectItem>
                <SelectItem value="manantial">💦 Manantial</SelectItem>
                <SelectItem value="lluvia">☔ Agua de lluvia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="farm-section">
        <h3 className="farm-section-title">📊 Capacidad y Disponibilidad</h3>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="usoPrincipal" className="farm-label">Uso principal *</Label>
            <Select value={formData.usoPrincipal || ''} onValueChange={(value) => setFormData({ ...formData, usoPrincipal: value })}>
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar uso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="riego">💧 Riego</SelectItem>
                <SelectItem value="consumo">🚰 Consumo</SelectItem>
                <SelectItem value="ganaderia">🐄 Ganadería</SelectItem>
                <SelectItem value="multiple">🔄 Múltiple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="nivel_actual" className="farm-label">¿Qué tan lleno está ahora? (%)</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => marcarSinInfo('nivel_actual')}
                  className="text-xs h-6 mt-0.5"
                >
                  No sé
                </Button>
              </div>
              {formData.nivel_actual === "sin_informacion" ? (
                <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-500 italic">
                  No tengo esta información
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    id="nivel_actual"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.nivel_actual || ''}
                    onChange={(e) => setFormData({ ...formData, nivel_actual: parseFloat(e.target.value) })}
                    className="farm-input"
                    placeholder="Ej: 75"
                  />
                  <div className="w-full bg-blue-100 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${nivelActualPorcentaje}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label htmlFor="disponibilidad_anual" className="farm-label">Disponibilidad en el año</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => marcarSinInfo('disponibilidad_anual')}
                  className="text-xs h-6 mt-0.5"
                >
                  No sé
                </Button>
              </div>
              {formData.disponibilidad_anual === "sin_informacion" ? (
                <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-500 italic">
                  No tengo esta información
                </div>
              ) : (
                <Select 
                  value={formData.disponibilidad_anual || ''} 
                  onValueChange={(value) => setFormData({ ...formData, disponibilidad_anual: value })}
                >
                  <SelectTrigger className="farm-select">
                    <SelectValue placeholder="Seleccionar disponibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanente">Todo el año</SelectItem>
                    <SelectItem value="estacional">Solo algunos meses</SelectItem>
                    <SelectItem value="variable">Variable (depende del año)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="calidad_agua" className="farm-label">Calidad del agua</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => marcarSinInfo('calidad_agua')}
                className="text-xs h-6 mt-0.5"
              >
                No sé
              </Button>
            </div>
            {formData.calidad_agua === "sin_informacion" ? (
              <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-500 italic">
                No tengo esta información
              </div>
            ) : (
              <Select 
                value={formData.calidad_agua || ''} 
                onValueChange={(value) => setFormData({ ...formData, calidad_agua: value })}
              >
                <SelectTrigger className="farm-select">
                  <SelectValue placeholder="Seleccionar calidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excelente">Excelente (Muy limpia)</SelectItem>
                  <SelectItem value="buena">Buena (Apta para riego)</SelectItem>
                  <SelectItem value="regular">Regular (Algo contaminada)</SelectItem>
                  <SelectItem value="mala">Mala (Muy contaminada)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
      
      <div className="farm-section">
        <h3 className="farm-section-title">🚿 Riego Simple</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sistema_riego_principal" className="farm-label">¿Qué sistema de riego utiliza principalmente?</Label>
            <Select 
              value={formData.sistema_riego_principal || ''} 
              onValueChange={(value) => setFormData({ ...formData, sistema_riego_principal: value })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar sistema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gravedad">Por gravedad (inundación)</SelectItem>
                <SelectItem value="goteo">Por goteo</SelectItem>
                <SelectItem value="aspersion">Por aspersión (como lluvia)</SelectItem>
                <SelectItem value="manual">Manual (con baldes o mangueras)</SelectItem>
                <SelectItem value="ninguno">No utilizo sistema de riego</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="hectareas_regadas" className="farm-label">¿Cuántas hectáreas riega?</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => marcarSinInfo('hectareas_regadas')}
                className="text-xs h-6 mt-0.5"
              >
                No sé
              </Button>
            </div>
            {formData.hectareas_regadas === "sin_informacion" ? (
              <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-500 italic">
                No tengo esta información
              </div>
            ) : (
              <Input
                id="hectareas_regadas"
                type="number"
                min="0"
                step="0.1"
                value={formData.hectareas_regadas || ''}
                onChange={(e) => setFormData({ ...formData, hectareas_regadas: parseFloat(e.target.value) })}
                className="farm-input"
                placeholder="Ej: 2.5"
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="farm-section">
        <h3 className="farm-section-title">🔄 Alternativas</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fuentes_backup" className="farm-label">¿Tiene otras fuentes de agua si esta falla?</Label>
            <Select 
              value={formData.tiene_fuentes_backup || ''} 
              onValueChange={(value) => setFormData({ ...formData, tiene_fuentes_backup: value })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí, tengo otras fuentes</SelectItem>
                <SelectItem value="no">No tengo alternativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.tiene_fuentes_backup === "si" && (
            <div>
              <Label htmlFor="descripcion_backup" className="farm-label">Describa brevemente sus fuentes alternativas</Label>
              <Textarea
                id="descripcion_backup"
                value={formData.descripcion_backup || ''}
                onChange={(e) => setFormData({ ...formData, descripcion_backup: e.target.value })}
                className="farm-input"
                placeholder="Ej: Tengo un pozo pequeño para emergencias, uso agua de lluvia cuando es posible..."
                rows={2}
              />
            </div>
          )}
        </div>
      </div>

      <div className="farm-section">
        <h3 className="farm-section-title">🗺️ Ubicación</h3>
        <Button 
          variant="outline" 
          onClick={() => setShowMapSelector(true)}
          className="w-full farm-button"
        >
          {formData.ubicacion ? 'Cambiar ubicación' : 'Seleccionar ubicación'}
        </Button>
        
        {formData.ubicacion && (
          <div className="mt-4 bg-green-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-medium text-green-800">Departamento</Label>
                <div className="text-sm">{formData.ubicacion.departamento}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800">Provincia</Label>
                <div className="text-sm">{formData.ubicacion.provincia}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800">Distrito</Label>
                <div className="text-sm">{formData.ubicacion.distrito}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800">Altitud</Label>
                <div className="text-sm">{formData.ubicacion.altitud} m.s.n.m.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showMapSelector} onOpenChange={setShowMapSelector}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecciona la ubicación de la fuente de agua</DialogTitle>
          </DialogHeader>
          <MapSelector
            isOpen={showMapSelector}
            onClose={() => setShowMapSelector(false)}
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.ubicacion}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// 👨‍🌾 FORMULARIO PARA PERFIL DE AGRICULTOR
interface FormularioPerfilProps {
  datos: any;
  onGuardar: (datos: any) => void;
  onCancelar: () => void;
}

const FormularioPerfil: React.FC<FormularioPerfilProps> = ({ datos, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState(datos || {
    nombre: '',
    apellidos: '',
    tipo_productor: 'pequeno',
    edad: '',
    genero: '',
    nivel_educacion: '',
    anos_experiencia: '',
    asociacion: '',
    celular: '',
    email: '',
    ubicacion_principal: null,
    productos_principales: [],
    certificaciones: [],
    conocimientos: {
      uso_tecnologia: 'basico',
      manejo_riego: 'tradicional',
      comercializacion: 'local',
      control_plagas: 'tradicional'
    },
    necesidades: {
      capacitacion: false,
      financiamiento: false,
      tecnologia: false,
      comercializacion: false,
      certificacion: false
    },
    redes_sociales: {
      facebook: '',
      whatsapp: '',
      otra: ''
    }
  });

  const [showMapSelector, setShowMapSelector] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [guardando, setGuardando] = useState(false);

  const tiposProductor = [
    { value: 'pequeno', label: 'Pequeño agricultor (menos de 3 hectáreas)' },
    { value: 'mediano', label: 'Mediano agricultor (3-10 hectáreas)' },
    { value: 'grande', label: 'Gran agricultor (más de 10 hectáreas)' },
    { value: 'cooperativa', label: 'Miembro de cooperativa' },
    { value: 'comunidad', label: 'Miembro de comunidad campesina' }
  ];

  const nivelesEducacion = [
    { value: 'primaria', label: 'Educación primaria' },
    { value: 'secundaria', label: 'Educación secundaria' },
    { value: 'tecnico', label: 'Educación técnica' },
    { value: 'universitaria', label: 'Educación universitaria' },
    { value: 'posgrado', label: 'Posgrado' },
    { value: 'autodidacta', label: 'Autodidacta' }
  ];

  const certificacionesDisponibles = [
    { value: 'organico', label: 'Certificación orgánica' },
    { value: 'comercio_justo', label: 'Comercio justo' },
    { value: 'global_gap', label: 'Global G.A.P.' },
    { value: 'haccp', label: 'HACCP' },
    { value: 'denominacion_origen', label: 'Denominación de origen' },
    { value: 'ninguna', label: 'Ninguna certificación' }
  ];

  const handleLocationSelect = (location: any) => {
    setFormData({
      ...formData,
      ubicacion_principal: {
        pais: 'Perú',
        departamento: location.department || '',
        provincia: location.province || '',
        distrito: location.district || '',
        direccion: location.address || '',
        coordenadas: {
          lat: location.lat,
          lng: location.lng
        },
        altitud: location.altitude || 0,
        clima: location.climateData?.climate || '',
        temperatura: location.climateData?.temperature || '',
        precipitacion: location.climateData?.precipitation || ''
      }
    });
    setShowMapSelector(false);
  };

  const agregarProducto = () => {
    if (nuevoProducto.trim() !== '') {
      setFormData({
        ...formData,
        productos_principales: [...(formData.productos_principales || []), nuevoProducto]
      });
      setNuevoProducto('');
    }
  };

  const eliminarProducto = (index: number) => {
    const nuevosProductos = [...formData.productos_principales];
    nuevosProductos.splice(index, 1);
    setFormData({
      ...formData,
      productos_principales: nuevosProductos
    });
  };

  const toggleCertificacion = (value: string) => {
    const certificaciones = formData.certificaciones || [];
    const index = certificaciones.indexOf(value);
    
    if (index === -1) {
      setFormData({
        ...formData,
        certificaciones: [...certificaciones, value]
      });
    } else {
      const nuevasCertificaciones = [...certificaciones];
      nuevasCertificaciones.splice(index, 1);
      setFormData({
        ...formData,
        certificaciones: nuevasCertificaciones
      });
    }
  };

  const handleSubmit = () => {
    setGuardando(true);
    onGuardar(formData);
  };

  return (
    <div className="space-y-6">
      {/* Sección de Información Personal */}
      <div className="farm-section">
        <h3 className="farm-section-title flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre" className="farm-label">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="farm-input"
              placeholder="Ej: Juan"
            />
          </div>
          <div>
            <Label htmlFor="apellidos" className="farm-label">Apellidos *</Label>
            <Input
              id="apellidos"
              value={formData.apellidos || ''}
              onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              className="farm-input"
              placeholder="Ej: Pérez López"
            />
          </div>
          <div>
            <Label htmlFor="edad" className="farm-label">Edad</Label>
            <Input
              id="edad"
              type="number"
              min="18"
              max="100"
              value={formData.edad || ''}
              onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
              className="farm-input"
              placeholder="Ej: 45"
            />
          </div>
          <div>
            <Label htmlFor="genero" className="farm-label">Género</Label>
            <Select 
              value={formData.genero || ''} 
              onValueChange={(value) => setFormData({ ...formData, genero: value })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
                <SelectItem value="prefiero_no_decir">Prefiero no decir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sección de Contacto */}
      <div className="farm-section">
        <h3 className="farm-section-title flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Información de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="celular" className="farm-label">Celular</Label>
            <Input
              id="celular"
              value={formData.celular || ''}
              onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
              className="farm-input"
              placeholder="Ej: 999 888 777"
            />
          </div>
          <div>
            <Label htmlFor="email" className="farm-label">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="farm-input"
              placeholder="Ej: juan@ejemplo.com"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label className="farm-label mb-2">Redes sociales</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="bg-blue-500 text-white p-2 rounded">f</span>
              <Input
                value={formData.redes_sociales?.facebook || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  redes_sociales: { ...formData.redes_sociales, facebook: e.target.value } 
                })}
                className="farm-input ml-2"
                placeholder="Usuario de Facebook"
              />
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white p-2 rounded">w</span>
              <Input
                value={formData.redes_sociales?.whatsapp || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  redes_sociales: { ...formData.redes_sociales, whatsapp: e.target.value } 
                })}
                className="farm-input ml-2"
                placeholder="Número de WhatsApp"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Perfil de Agricultor */}
      <div className="farm-section">
        <h3 className="farm-section-title flex items-center gap-2">
          <Sprout className="h-5 w-5" />
          Perfil de Agricultor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipo_productor" className="farm-label">Tipo de productor *</Label>
            <Select 
              value={formData.tipo_productor || ''} 
              onValueChange={(value) => setFormData({ ...formData, tipo_productor: value })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposProductor.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="anos_experiencia" className="farm-label">Años de experiencia en agricultura</Label>
            <Input
              id="anos_experiencia"
              type="number"
              min="0"
              value={formData.anos_experiencia || ''}
              onChange={(e) => setFormData({ ...formData, anos_experiencia: e.target.value })}
              className="farm-input"
              placeholder="Ej: 15"
            />
          </div>
          <div>
            <Label htmlFor="nivel_educacion" className="farm-label">Nivel de educación</Label>
            <Select 
              value={formData.nivel_educacion || ''} 
              onValueChange={(value) => setFormData({ ...formData, nivel_educacion: value })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                {nivelesEducacion.map(nivel => (
                  <SelectItem key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="asociacion" className="farm-label">Asociación/Cooperativa</Label>
            <Input
              id="asociacion"
              value={formData.asociacion || ''}
              onChange={(e) => setFormData({ ...formData, asociacion: e.target.value })}
              className="farm-input"
              placeholder="Ej: Cooperativa Agraria Valle Verde"
            />
          </div>
        </div>
      </div>

      {/* Sección de Productos */}
      <div className="farm-section">
        <h3 className="farm-section-title flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          Productos Principales
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={nuevoProducto}
              onChange={(e) => setNuevoProducto(e.target.value)}
              className="farm-input"
              placeholder="Ej: Papa nativa, Quinua, Maíz choclo..."
            />
            <Button 
              onClick={agregarProducto}
              className="farm-button"
              disabled={nuevoProducto.trim() === ''}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
          
          {formData.productos_principales && formData.productos_principales.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.productos_principales.map((producto: string, index: number) => (
                <Badge 
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-2"
                >
                  {producto}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-4 w-4 p-0 text-green-800 hover:text-red-500"
                    onClick={() => eliminarProducto(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-lg">
              No has agregado productos principales
            </div>
          )}
        </div>
      </div>

      {/* Sección de Certificaciones */}
      <div className="farm-section">
        <h3 className="farm-section-title flex items-center gap-2">
          <Star className="h-5 w-5" />
          Certificaciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certificacionesDisponibles.map(cert => (
            <div key={cert.value} className="flex items-center space-x-2">
              <Checkbox
                id={`cert-${cert.value}`}
                checked={(formData.certificaciones || []).includes(cert.value)}
                onCheckedChange={() => toggleCertificacion(cert.value)}
              />
              <Label
                htmlFor={`cert-${cert.value}`}
                className="cursor-pointer"
              >
                {cert.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Conocimientos */}
      <div className="farm-section">
        <h3 className="farm-section-title flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Conocimientos y Habilidades
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="uso_tecnologia" className="farm-label">Uso de tecnología</Label>
            <Select 
              value={formData.conocimientos?.uso_tecnologia || 'basico'} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                conocimientos: { ...formData.conocimientos, uso_tecnologia: value } 
              })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguno">Ninguno</SelectItem>
                <SelectItem value="basico">Básico</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="manejo_riego" className="farm-label">Manejo de riego</Label>
            <Select 
              value={formData.conocimientos?.manejo_riego || 'tradicional'} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                conocimientos: { ...formData.conocimientos, manejo_riego: value } 
              })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tradicional">Tradicional (gravedad)</SelectItem>
                <SelectItem value="tecnificado">Tecnificado (goteo/aspersión)</SelectItem>
                <SelectItem value="mixto">Mixto</SelectItem>
                <SelectItem value="experto">Experto en sistemas de riego</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="comercializacion" className="farm-label">Comercialización</Label>
            <Select 
              value={formData.conocimientos?.comercializacion || 'local'} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                conocimientos: { ...formData.conocimientos, comercializacion: value } 
              })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Mercado local</SelectItem>
                <SelectItem value="regional">Mercado regional</SelectItem>
                <SelectItem value="nacional">Mercado nacional</SelectItem>
                <SelectItem value="exportacion">Exportación</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="control_plagas" className="farm-label">Control de plagas</Label>
            <Select 
              value={formData.conocimientos?.control_plagas || 'tradicional'} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                conocimientos: { ...formData.conocimientos, control_plagas: value } 
              })}
            >
              <SelectTrigger className="farm-select">
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tradicional">Tradicional (químico)</SelectItem>
                <SelectItem value="biologico">Control biológico</SelectItem>
                <SelectItem value="integrado">Manejo integrado de plagas</SelectItem>
                <SelectItem value="organico">Orgánico certificado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sección de Necesidades */}
      <div className="farm-section">
        <h3 className="farm-section-title flex items-center gap-2">
          <Target className="h-5 w-5" />
          Necesidades para Mejorar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="necesidad-capacitacion"
              checked={formData.necesidades?.capacitacion || false}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                necesidades: { ...formData.necesidades, capacitacion: checked === true }
              })}
            />
            <Label
              htmlFor="necesidad-capacitacion"
              className="cursor-pointer"
            >
              Capacitación técnica
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="necesidad-financiamiento"
              checked={formData.necesidades?.financiamiento || false}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                necesidades: { ...formData.necesidades, financiamiento: checked === true }
              })}
            />
            <Label
              htmlFor="necesidad-financiamiento"
              className="cursor-pointer"
            >
              Acceso a financiamiento
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="necesidad-tecnologia"
              checked={formData.necesidades?.tecnologia || false}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                necesidades: { ...formData.necesidades, tecnologia: checked === true }
              })}
            />
            <Label
              htmlFor="necesidad-tecnologia"
              className="cursor-pointer"
            >
              Acceso a tecnología
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="necesidad-comercializacion"
              checked={formData.necesidades?.comercializacion || false}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                necesidades: { ...formData.necesidades, comercializacion: checked === true }
              })}
            />
            <Label
              htmlFor="necesidad-comercializacion"
              className="cursor-pointer"
            >
              Mejores canales de comercialización
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="necesidad-certificacion"
              checked={formData.necesidades?.certificacion || false}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                necesidades: { ...formData.necesidades, certificacion: checked === true }
              })}
            />
            <Label
              htmlFor="necesidad-certificacion"
              className="cursor-pointer"
            >
              Obtención de certificaciones
            </Label>
          </div>
        </div>
      </div>

      {/* Sección de Ubicación */}
      <div className="farm-section">
        <h3 className="farm-section-title flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación Principal
        </h3>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setShowMapSelector(true)}
            className="w-full farm-button"
          >
            {formData.ubicacion_principal ? 'Cambiar ubicación' : 'Seleccionar ubicación'}
          </Button>
          
          {formData.ubicacion_principal && (
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm font-medium text-green-800">Departamento</Label>
                  <div className="text-sm">{formData.ubicacion_principal.departamento}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Provincia</Label>
                  <div className="text-sm">{formData.ubicacion_principal.provincia}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Distrito</Label>
                  <div className="text-sm">{formData.ubicacion_principal.distrito}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Altitud</Label>
                  <div className="text-sm">{formData.ubicacion_principal.altitud} m.s.n.m.</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Clima</Label>
                  <div className="text-sm">{formData.ubicacion_principal.clima}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800">Temperatura</Label>
                  <div className="text-sm">{formData.ubicacion_principal.temperatura}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-yellow-500 hover:bg-yellow-600"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Guardando...
            </>
          ) : (
            'Guardar Perfil'
          )}
        </Button>
      </div>

      <Dialog open={showMapSelector} onOpenChange={setShowMapSelector}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecciona tu ubicación principal</DialogTitle>
          </DialogHeader>
          <MapSelector
            isOpen={showMapSelector}
            onClose={() => setShowMapSelector(false)}
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.ubicacion_principal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiGranjaVirtual;
