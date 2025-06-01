export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  tags: string[];
  thumbnail: string;
  url: string;
  views: number;
  relevanceScore?: number;
  instructor?: string;
  language: string;
  subtitles: boolean;
}

export const videosDatabase: Video[] = [
  // Riego y Agua
  {
    id: "1",
    title: "Riego por goteo uno de los mejores inventos en la agricultura",
    description: "Descubre cómo el riego por goteo revoluciona la agricultura moderna, ahorrando hasta 50% de agua mientras mejora los rendimientos de los cultivos.",
    duration: "12:45",
    category: "riego",
    difficulty: "Intermedio",
    tags: ["riego por goteo", "ahorro de agua", "agricultura moderna", "eficiencia hídrica"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=DOBbBdde9m4",
    views: 45320,
    instructor: "TvAgro",
    language: "Español",
    subtitles: true
  },
  {
    id: "2",
    title: "El MEJOR sistema de RIEGO para el huerto",
    description: "Comparación completa de sistemas de riego para huertos caseros y comerciales. Aprende cuál es el más eficiente para tu cultivo.",
    duration: "18:30",
    category: "riego",
    difficulty: "Básico",
    tags: ["sistema de riego", "huerto", "riego casero", "eficiencia"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=Cnlqi5H2e4o",
    views: 128700,
    instructor: "Huerto Fácil",
    language: "Español",
    subtitles: true
  },
  {
    id: "3",
    title: "Riego por goteo con botellas de plástico - Huerto en casa",
    description: "Sistema de riego casero económico usando botellas recicladas. Perfecto para pequeños huertos y agricultura urbana.",
    duration: "8:15",
    category: "riego",
    difficulty: "Básico",
    tags: ["riego casero", "reciclaje", "huerto urbano", "bajo costo"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=6va1g_Z1V40",
    views: 87650,
    instructor: "Manos de Tierra",
    language: "Español",
    subtitles: true
  },

  // Plagas y Enfermedades
  {
    id: "4",
    title: "Monitoreo de plagas y control orgánico",
    description: "Técnicas profesionales para identificar, monitorear y controlar plagas de forma orgánica sin dañar el medio ambiente.",
    duration: "22:30",
    category: "plagas",
    difficulty: "Intermedio",
    tags: ["control orgánico", "monitoreo", "plagas", "agricultura ecológica"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=gk5V3BrrlpY",
    views: 67890,
    instructor: "Dr. Carlos Agricultura",
    language: "Español",
    subtitles: true
  },
  {
    id: "5",
    title: "Control biológico de plagas en agricultura orgánica",
    description: "Aprende a usar enemigos naturales de las plagas para proteger tus cultivos de manera sostenible y efectiva.",
    duration: "16:45",
    category: "plagas",
    difficulty: "Avanzado",
    tags: ["control biológico", "agricultura orgánica", "enemigos naturales", "sostenibilidad"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=K4eScf6TMaM",
    views: 34560,
    instructor: "Instituto Agropecuario",
    language: "Español",
    subtitles: true
  },

  // Cultivos Específicos
  {
    id: "6",
    title: "Manejo agronómico en la producción de papa",
    description: "Guía completa para el cultivo de papa: desde la preparación del terreno hasta la cosecha, incluyendo manejo de plagas y enfermedades.",
    duration: "28:40",
    category: "cultivos",
    difficulty: "Intermedio",
    tags: ["papa", "manejo agronómico", "producción", "técnicas"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=ChL24PUngAU",
    views: 156780,
    instructor: "INIA Perú",
    language: "Español",
    subtitles: true
  },
  {
    id: "7",
    title: "Manejo Agronómico del Cultivo de Quinua",
    description: "Todo sobre el cultivo de quinua: variedades, siembra, cuidados culturales y cosecha del superfood andino.",
    duration: "24:15",
    category: "cultivos",
    difficulty: "Intermedio",
    tags: ["quinua", "superfood", "cultivo andino", "manejo"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=qn4ovSE3M_Y",
    views: 89320,
    instructor: "Centro Andino",
    language: "Español",
    subtitles: true
  },
  {
    id: "8",
    title: "Siembra y manejo del cultivo de papa - Cómo se cultiva",
    description: "Proceso completo de siembra de papa: selección de semilla, preparación del suelo, siembra y cuidados posteriores.",
    duration: "19:20",
    category: "cultivos",
    difficulty: "Básico",
    tags: ["papa", "siembra", "cultivo", "técnicas básicas"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=cnUINwnxOts",
    views: 203450,
    instructor: "Campo y Ciudad",
    language: "Español",
    subtitles: true
  },
  {
    id: "9",
    title: "Quinua y Kiwicha, Cultivos con historia (Documental)",
    description: "Documental sobre la historia y importancia de la quinua y kiwicha en la alimentación andina y mundial.",
    duration: "45:30",
    category: "cultivos",
    difficulty: "Básico",
    tags: ["quinua", "kiwicha", "historia", "cultivos andinos"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=r-AXHXp5eT4",
    views: 78920,
    instructor: "Documentales Andinos",
    language: "Español",
    subtitles: true
  },

  // Clima y Adaptación
  {
    id: "10",
    title: "Agricultura regenerativa: ¿el futuro?",
    description: "Explora las técnicas de agricultura regenerativa que restauran la salud del suelo y mejoran la resistencia al cambio climático.",
    duration: "25:15",
    category: "clima",
    difficulty: "Avanzado",
    tags: ["agricultura regenerativa", "cambio climático", "suelo", "sostenibilidad"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=vWApHtc5aGY",
    views: 145670,
    instructor: "Futuro Verde",
    language: "Español",
    subtitles: true
  },
  {
    id: "11",
    title: "Mejores papas para la seguridad alimentaria en Colombia",
    description: "Variedades de papa resistentes al clima y plagas para garantizar la seguridad alimentaria en diferentes regiones.",
    duration: "17:45",
    category: "clima",
    difficulty: "Intermedio",
    tags: ["seguridad alimentaria", "papa", "resistencia", "variedades"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=RGFUrTj9tTQ",
    views: 67890,
    instructor: "CIAT Colombia",
    language: "Español",
    subtitles: true
  },

  // Tecnología
  {
    id: "12",
    title: "Agricultura de Precisión mediante sondas y sensores de humedad",
    description: "Tecnología IoT aplicada a la agricultura: sensores de humedad, temperatura y nutrientes para optimizar los cultivos.",
    duration: "19:20",
    category: "tecnologia",
    difficulty: "Avanzado",
    tags: ["IoT", "sensores", "agricultura de precisión", "tecnología"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=29e9csm0TDI",
    views: 45230,
    instructor: "TechAgro",
    language: "Español",
    subtitles: true
  },
  {
    id: "13",
    title: "Tipos de Sistemas de Irrigación - TvAgro",
    description: "Comparativa completa de diferentes sistemas de irrigación: aspersión, goteo, surcos y microaspersión.",
    duration: "16:45",
    category: "tecnologia",
    difficulty: "Intermedio",
    tags: ["sistemas de irrigación", "tecnología", "eficiencia", "comparativa"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=AzNhZdEEWfc",
    views: 98760,
    instructor: "TvAgro Juan Gonzalo Angel",
    language: "Español",
    subtitles: true
  },

  // Fertilización y Suelos
  {
    id: "14",
    title: "Compostaje casero para mejorar el suelo",
    description: "Aprende a hacer compost en casa para enriquecer el suelo de tu huerto de manera natural y económica.",
    duration: "13:25",
    category: "fertilizacion",
    difficulty: "Básico",
    tags: ["compost", "fertilización orgánica", "suelo", "reciclaje"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    views: 156780,
    instructor: "Eco Huerto",
    language: "Español",
    subtitles: true
  },
  {
    id: "15",
    title: "Análisis de suelos para agricultura",
    description: "Cómo interpretar un análisis de suelo y tomar decisiones sobre fertilización y enmiendas necesarias.",
    duration: "20:10",
    category: "fertilizacion",
    difficulty: "Avanzado",
    tags: ["análisis de suelos", "fertilización", "nutrientes", "pH"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    views: 67340,
    instructor: "Laboratorio de Suelos",
    language: "Español",
    subtitles: true
  },

  // Financiamiento
  {
    id: "16",
    title: "Microcréditos para pequeños agricultores",
    description: "Guía completa sobre opciones de financiamiento y microcréditos disponibles para pequeños y medianos agricultores.",
    duration: "22:10",
    category: "financiamiento",
    difficulty: "Básico",
    tags: ["microcréditos", "financiamiento", "pequeños agricultores", "bancos"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
    views: 34670,
    instructor: "Banco Agrario",
    language: "Español",
    subtitles: true
  },
  {
    id: "17",
    title: "Seguros agrícolas: Protección para tu cosecha",
    description: "Todo sobre seguros agrícolas: tipos de cobertura, cómo contratarlos y cuándo son necesarios para proteger tu inversión.",
    duration: "15:30",
    category: "financiamiento",
    difficulty: "Intermedio",
    tags: ["seguros agrícolas", "protección", "riesgos", "inversión"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=lIoGfIr1YLc",
    views: 23890,
    instructor: "Seguros del Campo",
    language: "Español",
    subtitles: true
  },

  // Enfermedades
  {
    id: "18",
    title: "Enfermedades comunes en hortalizas y su control",
    description: "Identifica y controla las principales enfermedades que afectan las hortalizas usando métodos preventivos y curativos.",
    duration: "18:40",
    category: "enfermedades",
    difficulty: "Intermedio",
    tags: ["enfermedades", "hortalizas", "control", "prevención"],
    thumbnail: "/api/placeholder/320/180",
    url: "https://www.youtube.com/watch?v=QH2-TGUlwu4",
    views: 89450,
    instructor: "Dr. Fitopatología",
    language: "Español",
    subtitles: true
  }
];

export const getVideosByCategory = (category: string): Video[] => {
  return videosDatabase.filter(video => video.category === category);
};

export const searchVideos = (query: string): Video[] => {
  const lowercaseQuery = query.toLowerCase();
  return videosDatabase.filter(video => 
    video.title.toLowerCase().includes(lowercaseQuery) ||
    video.description.toLowerCase().includes(lowercaseQuery) ||
    video.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}; 