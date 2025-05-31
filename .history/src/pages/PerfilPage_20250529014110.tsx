import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapSelector from "@/components/MapSelector";
import { 
  User, 
  MapPin, 
  Ruler, 
  Sprout, 
  Calendar,
  Phone,
  Mail,
  Home,
  Tractor,
  Droplets,
  Thermometer,
  DollarSign,
  Users,
  BookOpen,
  Award,
  Camera,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Info,
  CheckCircle,
  AlertCircle,
  Leaf,
  Wheat,
  Apple,
  Carrot,
  TreePine,
  Flower,
  Mountain,
  Building,
  Factory,
  Truck,
  Shield,
  Target,
  TrendingUp,
  Clock,
  Globe,
  Star,
  Heart,
  Eye,
  BarChart2,
  Smartphone,
  Zap,
  CloudRain,
  Sun,
  Wind,
  Snowflake,
  Umbrella,
  Activity,
  Recycle,
  Lightbulb,
  Gauge,
  TreeDeciduous,
  Flame,
  Search,
  Navigation
} from "lucide-react";

// Interfaces para el perfil enfocado en ODS 13
interface CultivoClimatico {
  id: string;
  nombre: string;
  variedad: string;
  area: number;
  fechaSiembra: Date;
  fechaCosecha: Date;
  resistenciaSequia: 'baja' | 'media' | 'alta';
  resistenciaHeladas: 'baja' | 'media' | 'alta';
  adaptacionClima: string[];
  huellaCarbono: number; // kg CO2 eq/ha
  capturaCarbon: number; // kg CO2/ha/año
  riesgoClimatico: 'bajo' | 'medio' | 'alto';
  estrategiasAdaptacion: string[];
  icon: React.ElementType;
  color: string;
}

interface UbicacionGeografica {
  latitud: number;
  longitud: number;
  direccion: string;
  departamento: string;
  provincia: string;
  municipio: string;
  comunidad: string;
  altitud: number;
  zonaClimatica: string;
  precipitacionAnual: number; // mm
  temperaturaPromedio: number; // °C
  riesgoSequias: 'bajo' | 'medio' | 'alto';
  riesgoHeladas: 'bajo' | 'medio' | 'alto';
  riesgoGranizo: 'bajo' | 'medio' | 'alto';
  riesgoInundaciones: 'bajo' | 'medio' | 'alto';
}

interface PerfilClimatico {
  // Información Personal
  nombre: string;
  apellidos: string;
  ci: string;
  fechaNacimiento: Date;
  telefono: string;
  email: string;
  foto: string;
  
  // Ubicación Geográfica
  ubicacion: UbicacionGeografica;
  
  // Información Agrícola
  tipoProductor: 'pequeño' | 'mediano' | 'grande' | 'cooperativa';
  experienciaAnios: number;
  areaTotal: number;
  areaProductiva: number;
  tipoSuelo: string;
  sistemaRiego: string[];
  
  // Cultivos Resistentes al Clima
  cultivos: CultivoClimatico[];
  
  // Prácticas de Adaptación Climática
  practicasAdaptacion: string[];
  tecnologiasClimaticas: string[];
  sistemaAlertaTemprana: boolean;
  monitoreoClimatico: string[];
  
  // Mitigación del Cambio Climático
  practicasMitigacion: string[];
  energiasRenovables: string[];
  gestionResiduos: string[];
  capturaCarbonoTotal: number; // toneladas CO2/año
  huellaCarbonoTotal: number; // toneladas CO2 eq/año
  
  // Resiliencia Climática
  planContingencia: boolean;
  segurosClimaticos: string[];
  diversificacionCultivos: number; // número de especies diferentes
  reservasAgua: boolean;
  infraestructuraResistente: string[];
  
  // Conocimiento y Capacitación Climática
  capacitacionesClimaticas: string[];
  conocimientoTradicional: string[];
  redApoyo: string[];
  
  // Objetivos ODS 13
  metasReduccionEmisiones: string[];
  metasAdaptacion: string[];
  metasResiliencia: string[];
  compromisosSostenibilidad: string[];
}

const PerfilPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [searchLocationText, setSearchLocationText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Estado del perfil climático
  const [perfil, setPerfil] = useState<PerfilClimatico>({
    // Información Personal
    nombre: 'Carlos',
    apellidos: 'Mamani Quispe',
    ci: '1234567 LP',
    fechaNacimiento: new Date('1975-03-15'),
    telefono: '+591 70123456',
    email: 'carlos.mamani@gmail.com',
    foto: '',
    
    // Ubicación Geográfica
    ubicacion: {
      latitud: -16.0472,
      longitud: -68.6831,
      direccion: 'Achacachi, Provincia Los Andes, La Paz, Bolivia',
      departamento: 'La Paz',
      provincia: 'Los Andes',
      municipio: 'Pucarani',
      comunidad: 'Achacachi',
      altitud: 3850,
      zonaClimatica: 'Altiplano Norte',
      precipitacionAnual: 650,
      temperaturaPromedio: 8.5,
      riesgoSequias: 'alto',
      riesgoHeladas: 'alto',
      riesgoGranizo: 'medio',
      riesgoInundaciones: 'bajo'
    },
    
    // Información Agrícola
    tipoProductor: 'pequeño',
    experienciaAnios: 25,
    areaTotal: 2.5,
    areaProductiva: 2.0,
    tipoSuelo: 'Franco-arcilloso, bien drenado',
    sistemaRiego: ['Aspersión', 'Goteo'],
    
    // Cultivos Resistentes al Clima
    cultivos: [
      {
        id: '1',
        nombre: 'Papa Nativa',
        variedad: 'Huaycha (resistente a heladas)',
        area: 1.0,
        fechaSiembra: new Date('2024-10-15'),
        fechaCosecha: new Date('2025-03-15'),
        resistenciaSequia: 'media',
        resistenciaHeladas: 'alta',
        adaptacionClima: ['Tolerante a bajas temperaturas', 'Ciclo corto'],
        huellaCarbono: 850,
        capturaCarbon: 1200,
        riesgoClimatico: 'medio',
        estrategiasAdaptacion: ['Siembra escalonada', 'Mulching', 'Riego por goteo'],
        icon: Apple,
        color: 'bg-yellow-100 border-yellow-300'
      },
      {
        id: '2',
        nombre: 'Quinua Real',
        variedad: 'Resistente a sequía',
        area: 0.8,
        fechaSiembra: new Date('2024-11-01'),
        fechaCosecha: new Date('2025-04-30'),
        resistenciaSequia: 'alta',
        resistenciaHeladas: 'alta',
        adaptacionClima: ['Tolerante a sequía', 'Resistente a salinidad'],
        huellaCarbono: 420,
        capturaCarbon: 800,
        riesgoClimatico: 'bajo',
        estrategiasAdaptacion: ['Variedades nativas', 'Rotación con leguminosas'],
        icon: Wheat,
        color: 'bg-green-100 border-green-300'
      },
      {
        id: '3',
        nombre: 'Haba Andina',
        variedad: 'Criolla mejorada',
        area: 0.2,
        fechaSiembra: new Date('2024-09-20'),
        fechaCosecha: new Date('2025-01-20'),
        resistenciaSequia: 'media',
        resistenciaHeladas: 'media',
        adaptacionClima: ['Fijación de nitrógeno', 'Mejora del suelo'],
        huellaCarbono: 200,
        capturaCarbon: 600,
        riesgoClimatico: 'medio',
        estrategiasAdaptacion: ['Asociación con cereales', 'Abono verde'],
        icon: Leaf,
        color: 'bg-blue-100 border-blue-300'
      }
    ],
    
    // Prácticas de Adaptación Climática
    practicasAdaptacion: [
      'Diversificación de cultivos',
      'Uso de variedades resistentes',
      'Sistemas de riego eficientes',
      'Conservación de suelos',
      'Manejo integrado de plagas',
      'Agricultura de conservación'
    ],
    tecnologiasClimaticas: [
      'Estación meteorológica local',
      'Sistema de riego por goteo',
      'Invernaderos con control climático',
      'Sensores de humedad del suelo'
    ],
    sistemaAlertaTemprana: true,
    monitoreoClimatico: ['Temperatura', 'Precipitación', 'Humedad', 'Viento'],
    
    // Mitigación del Cambio Climático
    practicasMitigacion: [
      'Agricultura orgánica',
      'Compostaje de residuos',
      'Reducción de labranza',
      'Rotación de cultivos',
      'Uso de abonos verdes',
      'Manejo sostenible del agua'
    ],
    energiasRenovables: ['Panel solar para riego', 'Biogas de residuos orgánicos'],
    gestionResiduos: ['Compostaje', 'Reciclaje de envases', 'Reutilización de agua'],
    capturaCarbonoTotal: 2.6, // toneladas CO2/año
    huellaCarbonoTotal: 1.47, // toneladas CO2 eq/año
    
    // Resiliencia Climática
    planContingencia: true,
    segurosClimaticos: ['Seguro Agrícola Universal', 'Seguro contra Sequías'],
    diversificacionCultivos: 3,
    reservasAgua: true,
    infraestructuraResistente: ['Invernaderos', 'Sistema de drenaje', 'Almacén resistente'],
    
    // Conocimiento y Capacitación
    capacitacionesClimaticas: [
      'Adaptación al cambio climático',
      'Agricultura climáticamente inteligente',
      'Manejo de riesgos climáticos',
      'Tecnologías de conservación'
    ],
    conocimientoTradicional: [
      'Predicción climática ancestral',
      'Variedades nativas resistentes',
      'Técnicas de conservación de agua',
      'Calendario agrícola tradicional'
    ],
    redApoyo: ['SENAMHI', 'INIAF', 'Cooperativa local', 'ONG climática'],
    
    // Objetivos ODS 13
    metasReduccionEmisiones: [
      'Reducir huella de carbono 30% en 3 años',
      'Implementar agricultura de carbono neutro',
      'Usar 100% energías renovables'
    ],
    metasAdaptacion: [
      'Instalar sistema de alerta temprana',
      'Diversificar cultivos resistentes',
      'Mejorar infraestructura resiliente'
    ],
    metasResiliencia: [
      'Crear reservas de agua de 6 meses',
      'Establecer plan de contingencia familiar',
      'Formar red de apoyo comunitaria'
    ],
    compromisosSostenibilidad: [
      'Certificación orgánica',
      'Participación en mercados de carbono',
      'Educación climática comunitaria'
    ]
  });
  const departamentos = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 
    'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 
    'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 
    'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 
    'Tumbes', 'Ucayali'
  ];

  const zonasClimaticas = [
    'Altiplano Norte', 'Altiplano Central', 'Altiplano Sur',
    'Valles Interandinos', 'Yungas', 'Chaco', 'Llanos Orientales',
    'Amazonia Norte', 'Amazonia Sur'
  ];

  const riesgoNiveles = [
    { value: 'bajo', label: 'Bajo', color: 'text-green-600' },
    { value: 'medio', label: 'Medio', color: 'text-yellow-600' },
    { value: 'alto', label: 'Alto', color: 'text-red-600' }
  ];

  // Función para buscar ubicación usando OpenCage (simulado)
  const handleSearchLocation = async (query: string) => {
    setIsSearching(true);
    try {
      // En producción, aquí usarías la API de OpenCage
      // const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=YOUR_API_KEY&language=es&countrycode=bo`);
      // const data = await response.json();
      
      // Simulación de respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults = [
        {
          formatted: "La Paz, Bolivia",
          geometry: { lat: -16.5000, lng: -68.1500 },
          components: {
            state: "La Paz",
            country: "Bolivia"
          }
        },
        {
          formatted: "Cochabamba, Bolivia", 
          geometry: { lat: -17.3895, lng: -66.1568 },
          components: {
            state: "Cochabamba",
            country: "Bolivia"
          }
        }
      ];
      
      return mockResults;
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };
  const handleLocationSelect = (location: any) => {
    setPerfil(prev => ({
      ...prev,
      ubicacion: {
        ...prev.ubicacion,
        latitud: location.geometry?.lat || location.lat,
        longitud: location.geometry?.lng || location.lng,
        direccion: location.formatted || location.address,
        departamento: location.components?.state || location.department || prev.ubicacion.departamento
      }
    }));
    setShowMapSelector(false);
  };
  // Nuevo handler para MapSelector actualizado con datos de Perú
  const handleMapLocationSelect = (locationData: any) => {
    setPerfil(prev => ({
      ...prev,
      ubicacion: {
        ...prev.ubicacion,
        latitud: locationData.lat,
        longitud: locationData.lng,
        direccion: locationData.address,
        departamento: locationData.department || prev.ubicacion.departamento,
        provincia: locationData.province || prev.ubicacion.provincia,
        municipio: locationData.district || prev.ubicacion.municipio,
        altitud: locationData.altitude || prev.ubicacion.altitud,
        // Actualizar datos climáticos si están disponibles
        zonaClimatica: locationData.climateData?.climate || prev.ubicacion.zonaClimatica,
        temperaturaPromedio: locationData.climateData?.temp ? 
          parseFloat(locationData.climateData.temp.split('-')[0]) : prev.ubicacion.temperaturaPromedio,
        precipitacionAnual: locationData.climateData?.rainfall ? 
          parseFloat(locationData.climateData.rainfall.split('-')[0]) : prev.ubicacion.precipitacionAnual
      }
    }));
    setShowMapSelector(false);
  };

  const calcularImpactoClimatico = () => {
    const balanceCarbon = perfil.capturaCarbonoTotal - perfil.huellaCarbonoTotal;
    const eficienciaClimatica = (perfil.capturaCarbonoTotal / perfil.huellaCarbonoTotal) * 100;
    return { balanceCarbon, eficienciaClimatica };
  };

  const calcularResilienciaClimatica = () => {
    let puntuacion = 0;
    
    // Diversificación de cultivos (max 25 puntos)
    puntuacion += Math.min(perfil.diversificacionCultivos * 8, 25);
    
    // Prácticas de adaptación (max 25 puntos)
    puntuacion += Math.min(perfil.practicasAdaptacion.length * 4, 25);
    
    // Tecnologías climáticas (max 20 puntos)
    puntuacion += Math.min(perfil.tecnologiasClimaticas.length * 5, 20);
    
    // Infraestructura resiliente (max 15 puntos)
    puntuacion += Math.min(perfil.infraestructuraResistente.length * 5, 15);
    
    // Seguros y contingencias (max 15 puntos)
    if (perfil.planContingencia) puntuacion += 8;
    puntuacion += Math.min(perfil.segurosClimaticos.length * 3.5, 7);
    
    return Math.min(puntuacion, 100);
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'bajo': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'alto': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const { balanceCarbon, eficienciaClimatica } = calcularImpactoClimatico();
  const resilienciaScore = calcularResilienciaClimatica();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header con enfoque climático */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Foto de perfil */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={perfil.foto} alt={perfil.nombre} />
                  <AvatarFallback className="bg-white text-green-600 text-2xl font-bold">
                    {perfil.nombre.charAt(0)}{perfil.apellidos.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setPerfil(prev => ({
                          ...prev,
                          foto: event.target?.result as string
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {perfil.nombre} {perfil.apellidos}
                </h1>
                <div className="flex items-center gap-4 text-lg opacity-90 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {perfil.ubicacion.comunidad}, {perfil.ubicacion.departamento}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5" />
                    {perfil.ubicacion.altitud}m s.n.m.
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    {perfil.ubicacion.temperaturaPromedio}°C promedio
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/20 text-white">
                    <Leaf className="h-4 w-4 mr-1" />
                    Agricultor Climáticamente Inteligente
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    <Target className="h-4 w-4 mr-1" />
                    ODS 13 - Acción por el Clima
                  </Badge>
                </div>
                <div className="text-sm opacity-80">
                  Zona Climática: {perfil.ubicacion.zonaClimatica} | 
                  Precipitación: {perfil.ubicacion.precipitacionAnual}mm/año
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Button
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                className={`${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-white/20 hover:bg-white/30'} text-white mb-2`}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </>
                )}
              </Button>
              {isEditing && (
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="ml-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Indicadores Climáticos Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Balance de Carbono</p>
                  <p className={`text-2xl font-bold ${balanceCarbon >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balanceCarbon >= 0 ? '+' : ''}{balanceCarbon.toFixed(2)} t CO₂
                  </p>
                  <p className="text-xs text-gray-500">
                    {balanceCarbon >= 0 ? 'Captura neta' : 'Emisión neta'}
                  </p>
                </div>
                <TreeDeciduous className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resiliencia Climática</p>
                  <p className="text-2xl font-bold text-blue-600">{resilienciaScore.toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">
                    {resilienciaScore >= 80 ? 'Excelente' : resilienciaScore >= 60 ? 'Buena' : 'Mejorable'}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Diversificación</p>
                  <p className="text-2xl font-bold text-purple-600">{perfil.diversificacionCultivos}</p>
                  <p className="text-xs text-gray-500">Especies cultivadas</p>
                </div>
                <Sprout className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Eficiencia Climática</p>
                  <p className="text-2xl font-bold text-orange-600">{eficienciaClimatica.toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">Captura vs Emisión</p>
                </div>
                <Gauge className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Información Climática */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="ubicacion" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ubicación
            </TabsTrigger>
            <TabsTrigger value="cultivos" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              Cultivos
            </TabsTrigger>
            <TabsTrigger value="adaptacion" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Adaptación
            </TabsTrigger>
            <TabsTrigger value="mitigacion" className="flex items-center gap-2">
              <TreeDeciduous className="h-4 w-4" />
              Mitigación
            </TabsTrigger>
            <TabsTrigger value="ods13" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              ODS 13
            </TabsTrigger>
          </TabsList>

          {/* Tab Personal */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Datos básicos del agricultor comprometido con la acción climática
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <Input 
                      value={perfil.nombre} 
                      disabled={!isEditing}
                      onChange={(e) => setPerfil(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Apellidos</label>
                    <Input 
                      value={perfil.apellidos} 
                      disabled={!isEditing}
                      onChange={(e) => setPerfil(prev => ({ ...prev, apellidos: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cédula de Identidad</label>
                    <Input 
                      value={perfil.ci} 
                      disabled={!isEditing}
                      onChange={(e) => setPerfil(prev => ({ ...prev, ci: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <Input 
                      value={perfil.telefono} 
                      disabled={!isEditing}
                      onChange={(e) => setPerfil(prev => ({ ...prev, telefono: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input 
                      value={perfil.email} 
                      disabled={!isEditing}
                      onChange={(e) => setPerfil(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Experiencia en Agricultura</label>
                    <Input 
                      value={`${perfil.experienciaAnios} años`} 
                      disabled={!isEditing}
                      onChange={(e) => setPerfil(prev => ({ 
                        ...prev, 
                        experienciaAnios: parseInt(e.target.value.replace(' años', '')) || 0 
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Ubicación Geográfica */}
          <TabsContent value="ubicacion" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación Geográfica y Clima
                </CardTitle>
                <CardDescription>
                  Información geográfica y climática para análisis de riesgos y adaptación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selector de ubicación */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Dirección Actual</label>
                      <div className="flex gap-2">
                        <Input 
                          value={perfil.ubicacion.direccion} 
                          disabled={!isEditing}
                          placeholder="Buscar ubicación..."
                        />
                        {isEditing && (
                          <Button
                            onClick={() => setShowMapSelector(true)}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Search className="h-4 w-4" />
                            Buscar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>                  {/* Información geográfica */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">País</label>
                      <Input 
                        value="Perú" 
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Departamento</label>
                      <Select 
                        value={perfil.ubicacion.departamento} 
                        disabled={!isEditing}
                        onValueChange={(value) => setPerfil(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, departamento: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departamentos.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Provincia</label>
                      <Input 
                        value={perfil.ubicacion.provincia} 
                        disabled={!isEditing}
                        onChange={(e) => setPerfil(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, provincia: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Distrito</label>
                      <Input 
                        value={perfil.ubicacion.municipio} 
                        disabled={!isEditing}
                        onChange={(e) => setPerfil(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, municipio: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  {/* Coordenadas y altitud */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Latitud</label>
                      <Input 
                        value={perfil.ubicacion.latitud.toFixed(6)} 
                        disabled={!isEditing}
                        onChange={(e) => setPerfil(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, latitud: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Longitud</label>
                      <Input 
                        value={perfil.ubicacion.longitud.toFixed(6)} 
                        disabled={!isEditing}
                        onChange={(e) => setPerfil(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, longitud: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Altitud (m s.n.m.)</label>
                      <Input 
                        value={perfil.ubicacion.altitud} 
                        disabled={!isEditing}
                        onChange={(e) => setPerfil(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, altitud: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Información climática */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CloudRain className="h-5 w-5" />
                    Información Climática
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Zona Climática</label>
                      <Select 
                        value={perfil.ubicacion.zonaClimatica} 
                        disabled={!isEditing}
                        onValueChange={(value) => setPerfil(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, zonaClimatica: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {zonasClimaticas.map(zona => (
                            <SelectItem key={zona} value={zona}>{zona}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Precipitación Anual (mm)</label>
                      <Input 
                        value={perfil.ubicacion.precipitacionAnual} 
                        disabled={!isEditing}
                        onChange={(e) => setPerfil(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, precipitacionAnual: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>

                  {/* Riesgos climáticos */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Evaluación de Riesgos Climáticos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Sequías
                        </label>
                        <Badge className={`w-full justify-center ${getRiesgoColor(perfil.ubicacion.riesgoSequias)}`}>
                          {perfil.ubicacion.riesgoSequias.charAt(0).toUpperCase() + perfil.ubicacion.riesgoSequias.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Snowflake className="h-4 w-4" />
                          Heladas
                        </label>
                        <Badge className={`w-full justify-center ${getRiesgoColor(perfil.ubicacion.riesgoHeladas)}`}>
                          {perfil.ubicacion.riesgoHeladas.charAt(0).toUpperCase() + perfil.ubicacion.riesgoHeladas.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <CloudRain className="h-4 w-4" />
                          Granizo
                        </label>
                        <Badge className={`w-full justify-center ${getRiesgoColor(perfil.ubicacion.riesgoGranizo)}`}>
                          {perfil.ubicacion.riesgoGranizo.charAt(0).toUpperCase() + perfil.ubicacion.riesgoGranizo.slice(1)}
                        </Badge>
                      </div>
                      <div>
                                                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                           <Droplets className="h-4 w-4" />
                           Inundaciones
                         </label>
                        <Badge className={`w-full justify-center ${getRiesgoColor(perfil.ubicacion.riesgoInundaciones)}`}>
                          {perfil.ubicacion.riesgoInundaciones.charAt(0).toUpperCase() + perfil.ubicacion.riesgoInundaciones.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Cultivos Climáticamente Inteligentes */}
          <TabsContent value="cultivos" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Cultivos Climáticamente Inteligentes
                </CardTitle>
                <CardDescription>
                  Cultivos adaptados al cambio climático con enfoque en resiliencia y sostenibilidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {perfil.cultivos.map((cultivo) => (
                    <Card key={cultivo.id} className={`${cultivo.color} border-2`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <cultivo.icon className="h-8 w-8 text-gray-700" />
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">{cultivo.nombre}</h3>
                              <p className="text-gray-600">{cultivo.variedad}</p>
                            </div>
                          </div>
                          <Badge className={`${getRiesgoColor(cultivo.riesgoClimatico)}`}>
                            Riesgo {cultivo.riesgoClimatico}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Información básica */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-700">Información Básica</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Área:</span>
                                <span className="font-medium">{cultivo.area} ha</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Siembra:</span>
                                <span className="font-medium">{cultivo.fechaSiembra.toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cosecha:</span>
                                <span className="font-medium">{cultivo.fechaCosecha.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Resistencia climática */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-700">Resistencia Climática</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Sequía:</span>
                                <Badge className={`${getRiesgoColor(cultivo.resistenciaSequia)}`}>
                                  {cultivo.resistenciaSequia}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Heladas:</span>
                                <Badge className={`${getRiesgoColor(cultivo.resistenciaHeladas)}`}>
                                  {cultivo.resistenciaHeladas}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm font-medium">Adaptaciones:</span>
                              {cultivo.adaptacionClima.map((adaptacion, idx) => (
                                <div key={idx} className="text-xs bg-white/50 px-2 py-1 rounded">
                                  {adaptacion}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Impacto de carbono */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-700">Impacto de Carbono</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Huella:</span>
                                <span className="font-medium text-red-600">{cultivo.huellaCarbono} kg CO₂</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Captura:</span>
                                <span className="font-medium text-green-600">+{cultivo.capturaCarbon} kg CO₂</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-medium">Balance:</span>
                                <span className={`font-bold ${(cultivo.capturaCarbon - cultivo.huellaCarbono) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {(cultivo.capturaCarbon - cultivo.huellaCarbono) >= 0 ? '+' : ''}{(cultivo.capturaCarbon - cultivo.huellaCarbono)} kg CO₂
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Estrategias de adaptación */}
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold text-gray-700 mb-2">Estrategias de Adaptación</h4>
                          <div className="flex flex-wrap gap-2">
                            {cultivo.estrategiasAdaptacion.map((estrategia, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {estrategia}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Adaptación Climática */}
          <TabsContent value="adaptacion" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prácticas de Adaptación */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Prácticas de Adaptación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfil.practicasAdaptacion.map((practica, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">{practica}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tecnologías Climáticas */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Tecnologías Climáticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfil.tecnologiasClimaticas.map((tecnologia, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-purple-600" />
                        <span className="text-sm">{tecnologia}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4" />
                      <span className="font-medium">Sistema de Alerta Temprana</span>
                    </div>
                    <Badge className={perfil.sistemaAlertaTemprana ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {perfil.sistemaAlertaTemprana ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Infraestructura Resiliente */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Infraestructura Resiliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfil.infraestructuraResistente.map((infra, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <Building className="h-5 w-5 text-orange-600" />
                        <span className="text-sm">{infra}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Plan de Contingencia:</span>
                      <Badge className={perfil.planContingencia ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {perfil.planContingencia ? 'Sí' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reservas de Agua:</span>
                      <Badge className={perfil.reservasAgua ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}>
                        {perfil.reservasAgua ? 'Sí' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seguros Climáticos */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5" />
                    Seguros Climáticos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfil.segurosClimaticos.map((seguro, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-sm">{seguro}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Mitigación */}
          <TabsContent value="mitigacion" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prácticas de Mitigación */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreeDeciduous className="h-5 w-5" />
                    Prácticas de Mitigación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfil.practicasMitigacion.map((practica, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <span className="text-sm">{practica}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Energías Renovables */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    Energías Renovables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfil.energiasRenovables.map((energia, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm">{energia}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gestión de Residuos */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Recycle className="h-5 w-5" />
                    Gestión de Residuos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfil.gestionResiduos.map((gestion, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Recycle className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">{gestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Balance de Carbono */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5" />
                    Balance de Carbono
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Huella de Carbono:</span>
                      <span className="text-lg font-bold text-red-600">{perfil.huellaCarbonoTotal} t CO₂ eq</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Captura de Carbono:</span>
                      <span className="text-lg font-bold text-green-600">+{perfil.capturaCarbonoTotal} t CO₂</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${balanceCarbon >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      <span className="text-sm font-medium">Balance Neto:</span>
                      <span className={`text-xl font-bold ${balanceCarbon >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {balanceCarbon >= 0 ? '+' : ''}{balanceCarbon.toFixed(2)} t CO₂
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab ODS 13 */}
          <TabsContent value="ods13" className="space-y-6">
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos de Desarrollo Sostenible 13: Acción por el Clima
                </CardTitle>
                <CardDescription>
                  Compromisos y metas específicas para la acción climática en la agricultura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metas de Reducción de Emisiones */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TreeDeciduous className="h-5 w-5 text-green-600" />
                    Metas de Reducción de Emisiones
                  </h3>
                  <div className="space-y-2">
                    {perfil.metasReduccionEmisiones.map((meta, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{meta}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metas de Adaptación */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Metas de Adaptación
                  </h3>
                  <div className="space-y-2">
                    {perfil.metasAdaptacion.map((meta, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{meta}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metas de Resiliencia */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Metas de Resiliencia
                  </h3>
                  <div className="space-y-2">
                    {perfil.metasResiliencia.map((meta, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Activity className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">{meta}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compromisos de Sostenibilidad */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    Compromisos de Sostenibilidad
                  </h3>
                  <div className="space-y-2">
                    {perfil.compromisosSostenibilidad.map((compromiso, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <Heart className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{compromiso}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progreso hacia ODS 13 */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Progreso hacia ODS 13</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {eficienciaClimatica.toFixed(0)}%
                        </div>
                        <div className="text-sm text-green-700">Eficiencia Climática</div>
                        <Progress value={eficienciaClimatica} className="mt-2" />
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {resilienciaScore.toFixed(0)}%
                        </div>
                        <div className="text-sm text-blue-700">Resiliencia</div>
                        <Progress value={resilienciaScore} className="mt-2" />
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {perfil.diversificacionCultivos}
                        </div>
                        <div className="text-sm text-purple-700">Especies Diversificadas</div>
                        <Progress value={(perfil.diversificacionCultivos / 5) * 100} className="mt-2" />
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>      {/* Selector de Mapa con Leaflet */}
      <MapSelector 
        isOpen={showMapSelector}
        onClose={() => setShowMapSelector(false)}
        onLocationSelect={handleMapLocationSelect}
        initialLocation={{
          lat: perfil.ubicacion.latitud,
          lng: perfil.ubicacion.longitud,
          address: perfil.ubicacion.direccion,
          country: 'Perú',
          department: perfil.ubicacion.departamento,
          province: perfil.ubicacion.provincia,
          district: perfil.ubicacion.municipio,
          altitude: perfil.ubicacion.altitud
        }}
      />
    </div>
  );
};

export default PerfilPage; 