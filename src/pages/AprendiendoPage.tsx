import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  ExternalLink,
  Clock,
  Star,
  Users,
  Filter,
  MessageSquare,
  GraduationCap,
  ArrowLeft,
  Bug,
  Zap,
  CloudRain,
  DollarSign,
  Tractor,
  Brain,
  Send,
  Bot,
  User,
  Lightbulb,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  Bookmark
} from "lucide-react";

interface Pregunta {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
  timestamp: string;
  fuentes: string[];
  relevancia: number;
  util: boolean | null;
}

interface PreguntaSugerida {
  texto: string;
  categoria: string;
  icon: any;
}

const AprendiendoPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('videos');
  
  // Estados para IA y RAG
  const [preguntaActual, setPreguntaActual] = useState('');
  const [cargandoRespuesta, setCargandoRespuesta] = useState(false);
  const [historialPreguntas, setHistorialPreguntas] = useState<Pregunta[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(true);

  const videoCategories = [
    {
      id: 'plagas',
      title: 'Identificación de Plagas',
      icon: Bug,
      emoji: '🐛',
      count: 5,
      description: 'Aprende a identificar y controlar las principales plagas que afectan los cultivos andinos'
    },
    {
      id: 'enfermedades',
      title: 'Enfermedades de Cultivos',
      icon: Zap,
      emoji: '🦠',
      count: 3,
      description: 'Reconoce síntomas y tratamientos para enfermedades comunes en agricultura'
    },
    {
      id: 'clima',
      title: 'Preparación Climática',
      icon: CloudRain,
      emoji: '🌦️',
      count: 8,
      description: 'Estrategias de adaptación y preparación para fenómenos climáticos extremos'
    },
    {
      id: 'financiamiento',
      title: 'Financiamiento Agrícola',
      icon: DollarSign,
      emoji: '💰',
      count: 4,
      description: 'Opciones de crédito, seguros y apoyo financiero para agricultores'
    },
    {
      id: 'tecnologia',
      title: 'Tecnología Agrícola',
      icon: Tractor,
      emoji: '🚜',
      count: 6,
      description: 'Herramientas y tecnologías modernas para mejorar la productividad'
    }
  ];

  // Videos por categoría
  const videosByCategory = {
    plagas: [
      {
        title: '¿Cómo identificar plagas en cultivos de papa?',
        description: 'Aprende a reconocer las principales plagas que afectan los cultivos de papa.',
        duration: '12:30',
        views: '15.2K',
        rating: 4.8,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo1'
      },
      {
        title: 'Control biológico de plagas en quinua',
        description: 'Métodos naturales y sostenibles para controlar plagas.',
        duration: '18:45',
        views: '8.7K',
        rating: 4.9,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo3'
      },
      {
        title: 'Manejo integrado de plagas en hortalizas',
        description: 'Estrategias combinadas para el control efectivo de plagas.',
        duration: '22:15',
        views: '12.3K',
        rating: 4.7,
        level: 'Avanzado',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo4'
      },
      {
        title: 'Identificación de áfidos en cultivos andinos',
        description: 'Reconoce y controla los áfidos que afectan cultivos de altura.',
        duration: '14:20',
        views: '9.8K',
        rating: 4.6,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo5'
      },
      {
        title: 'Prevención de plagas en almacenamiento',
        description: 'Protege tus cosechas durante el almacenamiento.',
        duration: '16:30',
        views: '11.2K',
        rating: 4.8,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo6'
      }
    ],
    enfermedades: [
      {
        title: 'Enfermedades fúngicas en papa',
        description: 'Identifica y trata las principales enfermedades causadas por hongos.',
        duration: '19:45',
        views: '13.5K',
        rating: 4.9,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo7'
      },
      {
        title: 'Tizón tardío: prevención y control',
        description: 'Manejo efectivo del tizón tardío en cultivos de papa.',
        duration: '25:10',
        views: '18.7K',
        rating: 4.8,
        level: 'Avanzado',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo8'
      },
      {
        title: 'Enfermedades virales en quinua',
        description: 'Reconoce síntomas de virus y estrategias de prevención.',
        duration: '17:20',
        views: '7.9K',
        rating: 4.7,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo9'
      }
    ],
    clima: [
      {
        title: 'Preparación para sequías prolongadas',
        description: 'Estrategias de conservación de agua y selección de cultivos resistentes.',
        duration: '16:20',
        views: '20.1K',
        rating: 4.9,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo2'
      },
      {
        title: 'Protección contra heladas',
        description: 'Métodos para proteger cultivos de las heladas nocturnas.',
        duration: '21:30',
        views: '16.8K',
        rating: 4.8,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo10'
      },
      {
        title: 'Manejo de cultivos en época de lluvias',
        description: 'Estrategias para el exceso de humedad y precipitaciones.',
        duration: '18:45',
        views: '14.2K',
        rating: 4.7,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo11'
      },
      {
        title: 'Sistemas de riego eficientes',
        description: 'Optimiza el uso del agua con sistemas de riego modernos.',
        duration: '24:15',
        views: '22.3K',
        rating: 4.9,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo12'
      },
      {
        title: 'Predicción climática para agricultores',
        description: 'Usa herramientas meteorológicas para planificar cultivos.',
        duration: '15:50',
        views: '19.5K',
        rating: 4.8,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo13'
      },
      {
        title: 'Adaptación al cambio climático',
        description: 'Estrategias a largo plazo para la agricultura resiliente.',
        duration: '28:30',
        views: '25.7K',
        rating: 4.9,
        level: 'Avanzado',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo14'
      },
      {
        title: 'Construcción de invernaderos',
        description: 'Guía completa para construir invernaderos eficientes.',
        duration: '32:20',
        views: '17.9K',
        rating: 4.8,
        level: 'Avanzado',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo15'
      },
      {
        title: 'Manejo de vientos fuertes',
        description: 'Protege tus cultivos de vientos destructivos.',
        duration: '13:40',
        views: '12.1K',
        rating: 4.6,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo16'
      }
    ],
    financiamiento: [
      {
        title: 'Créditos agrícolas: cómo acceder',
        description: 'Guía paso a paso para obtener financiamiento agrícola.',
        duration: '20:15',
        views: '24.3K',
        rating: 4.8,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo17'
      },
      {
        title: 'Seguros agrícolas en Bolivia',
        description: 'Protege tu inversión con seguros especializados.',
        duration: '18:30',
        views: '15.7K',
        rating: 4.7,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo18'
      },
      {
        title: 'Cooperativas y asociaciones',
        description: 'Beneficios de formar parte de cooperativas agrícolas.',
        duration: '22:45',
        views: '18.9K',
        rating: 4.9,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo19'
      },
      {
        title: 'Planificación financiera agrícola',
        description: 'Administra eficientemente los recursos de tu finca.',
        duration: '26:10',
        views: '13.4K',
        rating: 4.8,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo20'
      }
    ],
    tecnologia: [
      {
        title: 'Drones en la agricultura',
        description: 'Aplicaciones de drones para monitoreo de cultivos.',
        duration: '23:20',
        views: '28.5K',
        rating: 4.9,
        level: 'Avanzado',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo21'
      },
      {
        title: 'Sensores de humedad del suelo',
        description: 'Optimiza el riego con tecnología de sensores.',
        duration: '17:45',
        views: '16.2K',
        rating: 4.8,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo22'
      },
      {
        title: 'Apps móviles para agricultores',
        description: 'Las mejores aplicaciones para gestionar tu finca.',
        duration: '19:30',
        views: '21.7K',
        rating: 4.7,
        level: 'Básico',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo23'
      },
      {
        title: 'Sistemas de riego automatizado',
        description: 'Instala sistemas de riego inteligentes.',
        duration: '25:50',
        views: '19.8K',
        rating: 4.8,
        level: 'Avanzado',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo24'
      },
      {
        title: 'Energía solar en agricultura',
        description: 'Aprovecha la energía solar para tu finca.',
        duration: '21:15',
        views: '14.6K',
        rating: 4.9,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo25'
      },
      {
        title: 'Tractores y maquinaria moderna',
        description: 'Guía de selección de maquinaria agrícola.',
        duration: '29:40',
        views: '23.1K',
        rating: 4.8,
        level: 'Intermedio',
        youtubeUrl: 'https://youtube.com/watch?v=ejemplo26'
      }
    ]
  };

  const featuredVideos = [
    {
      title: '¿Cómo identificar plagas en cultivos de papa?',
      description: 'Aprende a reconocer las principales plagas que afectan los cultivos de papa.',
      duration: '12:30',
      views: '15.2K',
      rating: 4.8,
      category: 'Plagas',
      level: 'Básico',
      youtubeUrl: 'https://youtube.com/watch?v=ejemplo1'
    },
    {
      title: 'Preparación para sequías prolongadas',
      description: 'Estrategias de conservación de agua y selección de cultivos resistentes.',
      duration: '16:20',
      views: '20.1K',
      rating: 4.9,
      category: 'Clima',
      level: 'Básico',
      youtubeUrl: 'https://youtube.com/watch?v=ejemplo2'
    },
    {
      title: 'Control biológico de plagas en quinua',
      description: 'Métodos naturales y sostenibles para controlar plagas.',
      duration: '18:45',
      views: '8.7K',
      rating: 4.9,
      category: 'Plagas',
      level: 'Intermedio',
      youtubeUrl: 'https://youtube.com/watch?v=ejemplo3'
    }
  ];

  const resources = [
    {
      title: 'Manual de Buenas Prácticas Agrícolas',
      type: 'PDF',
      size: '2.5 MB',
      description: 'Guía completa sobre prácticas sostenibles en agricultura andina.'
    },
    {
      title: 'Calendario de Siembra Regional',
      type: 'PDF',
      size: '1.8 MB',
      description: 'Fechas óptimas de siembra según el clima regional.'
    },
    {
      title: 'Guía de Identificación de Plagas',
      type: 'PDF',
      size: '4.2 MB',
      description: 'Manual visual para identificar plagas comunes.'
    }
  ];

  // Preguntas sugeridas para IA
  const preguntasSugeridas: PreguntaSugerida[] = [
    {
      texto: "¿Cuál es la mejor época para sembrar papa en el altiplano?",
      categoria: "Siembra",
      icon: CloudRain
    },
    {
      texto: "¿Cómo puedo identificar si mi cultivo tiene tizón tardío?",
      categoria: "Enfermedades",
      icon: Bug
    },
    {
      texto: "¿Qué fertilizantes orgánicos puedo usar para quinua?",
      categoria: "Nutrición",
      icon: Lightbulb
    },
    {
      texto: "¿Cómo proteger mis cultivos de las heladas?",
      categoria: "Clima",
      icon: Zap
    },
    {
      texto: "¿Qué créditos agrícolas están disponibles en Bolivia?",
      categoria: "Financiamiento",
      icon: DollarSign
    },
    {
      texto: "¿Cómo implementar riego por goteo en mi parcela?",
      categoria: "Tecnología",
      icon: Tractor
    }
  ];

  // Función para procesar pregunta con IA y RAG
  const procesarPreguntaIA = async (pregunta: string) => {
    setCargandoRespuesta(true);
    setMostrarSugerencias(false);
    
    // Simular procesamiento de IA con RAG
    setTimeout(() => {
      const nuevaPregunta: Pregunta = {
        id: Date.now().toString(),
        pregunta: pregunta,
        respuesta: generarRespuestaIA(pregunta),
        categoria: determinarCategoria(pregunta),
        timestamp: new Date().toLocaleString(),
        fuentes: [
          "Manual de Buenas Prácticas Agrícolas - INIAF",
          "Guía Técnica de Cultivos Andinos - SENASAG",
          "Base de Datos Climática - SENAMHI"
        ],
        relevancia: 95,
        util: null
      };
      
      setHistorialPreguntas(prev => [nuevaPregunta, ...prev]);
      setCargandoRespuesta(false);
      setPreguntaActual('');
    }, 2500);
  };

  // Función para generar respuesta basada en RAG
  const generarRespuestaIA = (pregunta: string): string => {
    const preguntaLower = pregunta.toLowerCase();
    
    if (preguntaLower.includes('papa') && preguntaLower.includes('sembrar')) {
      return `**Época óptima para siembra de papa en el altiplano:**

🌱 **Temporada principal:** Octubre - Noviembre
- Aprovecha las primeras lluvias de la temporada
- Temperatura del suelo: 8-12°C
- Humedad relativa: 60-70%

📅 **Calendario específico:**
- **Altiplano Norte (La Paz):** 15 octubre - 15 noviembre
- **Altiplano Central:** 1-30 noviembre  
- **Altiplano Sur (Potosí):** 15 noviembre - 15 diciembre

⚠️ **Consideraciones climáticas:**
- Evitar siembra antes de octubre (riesgo de heladas)
- Monitorear pronósticos de El Niño/La Niña
- Preparar protección antiheladas para noviembre

🔬 **Variedades recomendadas:**
- **Waych'a:** Resistente a heladas, ciclo corto (120 días)
- **Imilla negra:** Tolerante a sequía
- **Huaycha:** Adaptada a altura (3800-4200 msnm)

💡 **Tip IA:** Usa el calendario lunar - siembra en luna creciente para mejor brotación.`;
    }
    
    if (preguntaLower.includes('tizón') || preguntaLower.includes('enfermedad')) {
      return `**Identificación del Tizón Tardío (Phytophthora infestans):**

🔍 **Síntomas tempranos:**
- Manchas irregulares café-verdosas en hojas
- Bordes amarillentos alrededor de las manchas
- Aparición en hojas inferiores primero

🚨 **Síntomas avanzados:**
- Manchas se extienden rápidamente
- Hojas se vuelven negras y se secan
- Tallos presentan lesiones oscuras
- Tubérculos con manchas café-rojizas

🌡️ **Condiciones favorables:**
- Temperatura: 15-20°C
- Humedad relativa: >90%
- Lluvias frecuentes o neblina persistente

⚡ **Acción inmediata:**
1. **Eliminar** plantas afectadas inmediatamente
2. **Aplicar** fungicida cúprico preventivo
3. **Mejorar** ventilación entre surcos
4. **Evitar** riego por aspersión

🛡️ **Prevención:**
- Rotación de cultivos (3-4 años)
- Variedades resistentes (Revolución, Desiree)
- Monitoreo semanal en época húmeda
- Aplicación preventiva cada 15 días

📊 **Probabilidad de infección hoy:** Basado en datos meteorológicos actuales - MEDIA`;
    }
    
    if (preguntaLower.includes('fertilizante') || preguntaLower.includes('quinua')) {
      return `**Fertilización Orgánica para Quinua:**

🌿 **Fertilizantes orgánicos recomendados:**

**1. Estiércol de llama/alpaca:**
- Dosis: 2-3 ton/ha
- Aplicación: 30 días antes de siembra
- Ventaja: Rico en potasio, ideal para quinua

**2. Compost de residuos agrícolas:**
- Dosis: 1.5-2 ton/ha  
- Composición: Rastrojos + estiércol + ceniza
- Tiempo de compostaje: 3-4 meses

**3. Humus de lombriz:**
- Dosis: 500-800 kg/ha
- Aplicación: Al momento de siembra
- Beneficio: Mejora estructura del suelo

🧪 **Fórmula orgánica completa:**
- **Base:** 2 ton/ha estiércol de llama
- **Complemento:** 300 kg/ha ceniza de quinua
- **Activador:** 200 kg/ha humus de lombriz

📅 **Cronograma de aplicación:**
- **60 días antes:** Incorporar estiércol
- **Siembra:** Aplicar humus en surco
- **45 días después:** Fertilización foliar con biol

🔬 **Biol casero para quinua:**
- 50 kg estiércol fresco
- 200 L agua
- 5 kg melaza o azúcar
- Fermentar 60 días en biodigestor

💰 **Costo estimado:** 800-1200 Bs/ha (vs 2000 Bs/ha químico)`;
    }
    
    // Respuesta genérica con RAG
    return `**Respuesta generada por IA Agrícola:**

Basándome en la base de conocimientos agrícolas andinos y las mejores prácticas documentadas, aquí tienes información relevante sobre tu consulta:

🔍 **Análisis de tu pregunta:**
La IA ha identificado que tu consulta se relaciona con prácticas agrícolas específicas para la región andina.

📚 **Fuentes consultadas:**
- Manual de Buenas Prácticas Agrícolas (INIAF)
- Guía Técnica de Cultivos Andinos
- Base de datos climática regional
- Experiencias documentadas de productores

💡 **Recomendación personalizada:**
Para obtener una respuesta más específica, te sugiero reformular tu pregunta incluyendo:
- Tipo de cultivo específico
- Ubicación geográfica (departamento/provincia)
- Época del año o etapa del cultivo
- Problema específico que enfrentas

🤝 **¿Necesitas más ayuda?**
Puedes hacer preguntas más específicas o consultar con nuestros expertos técnicos a través del chat de la comunidad.

⭐ **Califica esta respuesta** para ayudarnos a mejorar el sistema de IA.`;
  };

  // Función para determinar categoría de la pregunta
  const determinarCategoria = (pregunta: string): string => {
    const preguntaLower = pregunta.toLowerCase();
    
    if (preguntaLower.includes('plaga') || preguntaLower.includes('insecto')) return 'Plagas';
    if (preguntaLower.includes('enfermedad') || preguntaLower.includes('hongo')) return 'Enfermedades';
    if (preguntaLower.includes('clima') || preguntaLower.includes('lluvia') || preguntaLower.includes('helada')) return 'Clima';
    if (preguntaLower.includes('crédito') || preguntaLower.includes('financiamiento')) return 'Financiamiento';
    if (preguntaLower.includes('tecnología') || preguntaLower.includes('riego')) return 'Tecnología';
    if (preguntaLower.includes('fertilizante') || preguntaLower.includes('abono')) return 'Nutrición';
    if (preguntaLower.includes('siembra') || preguntaLower.includes('cosecha')) return 'Siembra';
    
    return 'General';
  };

  // Función para manejar envío de pregunta
  const handleEnviarPregunta = () => {
    if (preguntaActual.trim()) {
      procesarPreguntaIA(preguntaActual.trim());
    }
  };

  // Función para marcar respuesta como útil
  const marcarUtil = (id: string, util: boolean) => {
    setHistorialPreguntas(prev => 
      prev.map(p => p.id === id ? { ...p, util } : p)
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveTab('videos');
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
  };

  const getCurrentCategoryData = () => {
    return videoCategories.find(cat => cat.id === activeCategory);
  };

  const getCurrentVideos = () => {
    return activeCategory ? videosByCategory[activeCategory as keyof typeof videosByCategory] || [] : [];
  };

  const filteredVideos = getCurrentVideos().filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-green-600 flex items-center justify-center gap-3">
          <GraduationCap className="h-10 w-10" />
          Centro de Aprendizaje
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Aprende técnicas agrícolas, identifica plagas y enfermedades, y prepárate para fenómenos climáticos 
          con nuestros recursos educativos especializados.
        </p>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar videos, tutoriales o recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contenido principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos Educativos
          </TabsTrigger>
          <TabsTrigger value="ia-preguntas" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Pregunta a la IA
          </TabsTrigger>
          <TabsTrigger value="recursos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Recursos Descargables
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          {!activeCategory ? (
            <>
              {/* Categorías */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Categorías de Aprendizaje</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoCategories.map(category => (
                    <Card 
                      key={category.id} 
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <category.icon className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="text-4xl">{category.emoji}</div>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-green-600">
                            {category.count} video{category.count !== 1 ? 's' : ''}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            Ver todos
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Videos destacados */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Videos Destacados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredVideos.map((video, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                          <Play className="h-16 w-16 text-green-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </Badge>
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          {video.level}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {video.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {video.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {video.rating}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(video.youtubeUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Vista de categoría específica */
            <div className="space-y-6">
              {/* Header de categoría */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToCategories}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a categorías
                </Button>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    {getCurrentCategoryData()?.icon && React.createElement(getCurrentCategoryData()!.icon, {
                      className: "h-8 w-8 text-green-600"
                    })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{getCurrentCategoryData()?.title}</h2>
                    <p className="text-gray-600">{getCurrentCategoryData()?.description}</p>
                  </div>
                </div>
              </div>

              {/* Videos de la categoría */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                        <Play className="h-16 w-16 text-green-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        <Clock className="h-3 w-3 mr-1" />
                        {video.duration}
                      </Badge>
                      <Badge className="absolute top-2 left-2 bg-green-600">
                        {video.level}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {video.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {video.rating}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(video.youtubeUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredVideos.length === 0 && searchTerm && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No se encontraron videos que coincidan con "{searchTerm}"</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ia-preguntas" className="space-y-6">
          {/* Header de IA */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-blue-600">Asistente IA Agrícola</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Haz preguntas específicas sobre agricultura andina. Nuestra IA utiliza RAG (Retrieval-Augmented Generation) 
              para brindarte respuestas precisas basadas en conocimiento técnico especializado.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>Powered by IA</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Base de conocimiento técnico</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Respuestas verificadas</span>
              </div>
            </div>
          </div>

          {/* Área de pregunta */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">¿Qué quieres aprender hoy?</h3>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Escribe tu pregunta sobre agricultura, cultivos, plagas, clima, financiamiento..."
                      value={preguntaActual}
                      onChange={(e) => setPreguntaActual(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEnviarPregunta()}
                      className="text-base"
                      disabled={cargandoRespuesta}
                    />
                  </div>
                  <Button 
                    onClick={handleEnviarPregunta}
                    disabled={!preguntaActual.trim() || cargandoRespuesta}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {cargandoRespuesta ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Preguntas sugeridas */}
                {mostrarSugerencias && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">💡 Preguntas sugeridas:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {preguntasSugeridas.map((sugerencia, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto p-3 hover:bg-blue-50"
                          onClick={() => {
                            setPreguntaActual(sugerencia.texto);
                            setMostrarSugerencias(false);
                          }}
                        >
                          <sugerencia.icon className="h-4 w-4 mr-2 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">{sugerencia.texto}</div>
                            <div className="text-xs text-gray-500">{sugerencia.categoria}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estado de carga */}
          {cargandoRespuesta && (
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <div className="text-center">
                    <p className="font-medium text-blue-600">IA procesando tu pregunta...</p>
                    <p className="text-sm text-gray-500">
                      Analizando base de conocimientos agrícolas • Generando respuesta personalizada
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Consultando fuentes técnicas...</span>
                    <span>70%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial de preguntas y respuestas */}
          {historialPreguntas.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Historial de Consultas</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setMostrarSugerencias(true)}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ver Sugerencias
                </Button>
              </div>

              {historialPreguntas.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    {/* Pregunta del usuario */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.pregunta}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{item.timestamp}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.categoria}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Respuesta de la IA */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="prose prose-sm max-w-none">
                            {item.respuesta.split('\n').map((line, index) => (
                              <div key={index} className="mb-2">
                                {line.startsWith('**') && line.endsWith('**') ? (
                                  <h4 className="font-bold text-blue-800 mb-1">
                                    {line.replace(/\*\*/g, '')}
                                  </h4>
                                ) : line.startsWith('🔍') || line.startsWith('🌱') || line.startsWith('📅') || 
                                       line.startsWith('⚠️') || line.startsWith('🔬') || line.startsWith('💡') ||
                                       line.startsWith('🚨') || line.startsWith('🌡️') || line.startsWith('⚡') ||
                                       line.startsWith('🛡️') || line.startsWith('📊') || line.startsWith('🌿') ||
                                       line.startsWith('🧪') || line.startsWith('💰') || line.startsWith('📚') ||
                                       line.startsWith('🤝') || line.startsWith('⭐') ? (
                                  <p className="text-gray-700 font-medium">{line}</p>
                                ) : line.trim() ? (
                                  <p className="text-gray-600">{line}</p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Fuentes y acciones */}
                        <div className="mt-4 space-y-3">
                          {/* Fuentes */}
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">📚 Fuentes consultadas:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.fuentes.map((fuente, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {fuente}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">¿Te fue útil esta respuesta?</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => marcarUtil(item.id, true)}
                                className={`h-8 w-8 p-0 ${item.util === true ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => marcarUtil(item.id, false)}
                                className={`h-8 w-8 p-0 ${item.util === false ? 'text-red-600 bg-red-50' : 'text-gray-400'}`}
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Relevancia */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Relevancia:</span>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full" 
                                  style={{width: `${item.relevancia}%`}}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-green-600">{item.relevancia}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Información adicional */}
          {historialPreguntas.length === 0 && !cargandoRespuesta && (
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-full shadow-sm">
                      <Lightbulb className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      ¿Cómo funciona nuestro Asistente IA?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Utiliza tecnología RAG (Retrieval-Augmented Generation) para consultar nuestra base de conocimientos 
                      agrícolas y generar respuestas precisas y contextualizadas.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-600" />
                      <span>Busca en bases de datos técnicas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span>Procesa con IA avanzada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Genera respuestas verificadas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recursos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      {resource.title}
                    </CardTitle>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{resource.size}</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Sección de ayuda */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">¿No encuentras lo que buscas?</h3>
          <p className="text-gray-600 mb-4">
            Nuestro asistente virtual puede ayudarte a encontrar información específica.
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Consultar Asistente Virtual
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AprendiendoPage; 