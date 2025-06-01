import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Play, 
  Clock, 
  User, 
  BookOpen, 
  Zap, 
  Droplets, 
  Sprout, 
  Shield, 
  DollarSign, 
  Settings, 
  Brain,
  Video as VideoIcon,
  Users,
  Download,
  MessageCircle,
  Star,
  Globe
} from "lucide-react";
import { videosDatabase, searchVideos, getVideosByCategory } from "@/data/videosDatabase";

interface VideoContent {
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

interface FarmerProfile {
  crops: string[];
  irrigationMethods: string[];
  chemicals: string[];
  farmSize: string;
  experience: string;
  location: string;
  challenges: string[];
}

const CentroAprendizaje = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("recomendados");
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>({
    crops: ["Papa", "Maíz", "Quinua"],
    irrigationMethods: ["Riego por aspersión", "Riego por goteo"],
    chemicals: ["Fertilizantes orgánicos", "Pesticidas naturales"],
    farmSize: "2-5 hectáreas",
    experience: "5-10 años",
    location: "Región Andina",
    challenges: ["Cambio climático", "Plagas", "Sequías"]
  });

  // Función para obtener thumbnail de YouTube
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoId && videoId[1]) {
      return `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`;
    }
    return "/api/placeholder/320/180";
  };

  // Algoritmo LLM mejorado para recomendaciones personalizadas
  const getPersonalizedRecommendations = (profile: FarmerProfile, videos: VideoContent[]): VideoContent[] => {
    return videos.map(video => {
      let relevanceScore = 0;
      
      // Puntuación basada en cultivos del perfil (peso alto)
      profile.crops.forEach(crop => {
        if (video.tags.some(tag => tag.toLowerCase().includes(crop.toLowerCase()))) {
          relevanceScore += 35;
        }
        // Bonus por coincidencia exacta en título
        if (video.title.toLowerCase().includes(crop.toLowerCase())) {
          relevanceScore += 15;
        }
      });
      
      // Puntuación basada en métodos de riego (peso medio-alto)
      profile.irrigationMethods.forEach(method => {
        if (method.toLowerCase().includes("goteo") && 
            video.tags.some(tag => tag.toLowerCase().includes("goteo"))) {
          relevanceScore += 30;
        }
        if (method.toLowerCase().includes("aspersión") && 
            video.tags.some(tag => tag.toLowerCase().includes("aspersión"))) {
          relevanceScore += 30;
        }
      });
      
      // Puntuación basada en químicos/métodos orgánicos (peso medio)
      if (profile.chemicals.some(chem => chem.toLowerCase().includes("orgánico")) && 
          video.tags.some(tag => tag.toLowerCase().includes("orgánico"))) {
        relevanceScore += 25;
      }
      
      // Puntuación basada en desafíos específicos (peso alto)
      profile.challenges.forEach(challenge => {
        if (challenge.toLowerCase().includes("plaga") && 
            (video.category === "plagas" || video.tags.some(tag => tag.includes("plagas")))) {
          relevanceScore += 30;
        }
        if (challenge.toLowerCase().includes("clima") && 
            (video.category === "clima" || video.tags.some(tag => tag.includes("clima")))) {
          relevanceScore += 30;
        }
        if (challenge.toLowerCase().includes("sequía") && 
            video.tags.some(tag => tag.toLowerCase().includes("sequía") || tag.includes("agua"))) {
          relevanceScore += 25;
        }
        if (challenge.toLowerCase().includes("cambio climático") && 
            video.tags.some(tag => tag.toLowerCase().includes("cambio climático") || tag.includes("adaptación"))) {
          relevanceScore += 35;
        }
      });
      
      // Puntuación basada en ubicación geográfica (peso medio)
      if (profile.location.toLowerCase().includes("andina") && 
          video.tags.some(tag => tag.toLowerCase().includes("andino") || tag.includes("región andina"))) {
        relevanceScore += 20;
      }
      
      // Puntuación basada en experiencia y dificultad (peso bajo-medio)
      if (profile.experience.includes("5-10") && video.difficulty === "Intermedio") {
        relevanceScore += 15;
      } else if (profile.experience.includes("menos") && video.difficulty === "Básico") {
        relevanceScore += 15;
      } else if (profile.experience.includes("más de 10") && video.difficulty === "Avanzado") {
        relevanceScore += 15;
      }
      
      // Puntuación basada en tamaño de finca (peso bajo)
      if (profile.farmSize.includes("2-5") && 
          video.tags.some(tag => tag.toLowerCase().includes("pequeños agricultores"))) {
        relevanceScore += 10;
      }
      
      // Bonus por popularidad (peso muy bajo)
      if (video.views > 20000) {
        relevanceScore += 5;
      }
      
      // Bonus por instructor reconocido (peso bajo)
      if (video.instructor && video.instructor.includes("Dr.")) {
        relevanceScore += 8;
      }
      
      return { ...video, relevanceScore };
    }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  };

  const [recommendedVideos, setRecommendedVideos] = useState<VideoContent[]>([]);

  useEffect(() => {
    const personalizedVideos = getPersonalizedRecommendations(farmerProfile, videosDatabase as VideoContent[]);
    setRecommendedVideos(personalizedVideos);
  }, [farmerProfile]);

  const categories = [
    { id: "recomendados", label: "Recomendados IA", icon: Brain, count: recommendedVideos.length },
    { id: "plagas", label: "Plagas", icon: Shield, count: getVideosByCategory("plagas").length },
    { id: "enfermedades", label: "Enfermedades", icon: Sprout, count: getVideosByCategory("enfermedades").length },
    { id: "clima", label: "Clima", icon: Droplets, count: getVideosByCategory("clima").length },
    { id: "financiamiento", label: "Financiamiento", icon: DollarSign, count: getVideosByCategory("financiamiento").length },
    { id: "tecnologia", label: "Tecnología", icon: Settings, count: getVideosByCategory("tecnologia").length },
    { id: "riego", label: "Riego", icon: Droplets, count: getVideosByCategory("riego").length },
    { id: "cultivos", label: "Cultivos", icon: Sprout, count: getVideosByCategory("cultivos").length }
  ];

  const getFilteredVideos = () => {
    if (selectedCategory === "recomendados") {
      return recommendedVideos;
    }
    
    let videos = getVideosByCategory(selectedCategory) as VideoContent[];
    
    if (searchTerm) {
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return videos;
  };

  const filteredVideos = getFilteredVideos();

  const VideoCard = ({ video }: { video: VideoContent }) => {
    const handleVideoClick = () => {
      window.open(video.url, '_blank');
    };

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-agriculture-terracotta/20 hover:border-l-agriculture-terracotta overflow-hidden"
            onClick={handleVideoClick}>
        <div className="relative">
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={getYouTubeThumbnail(video.url)} 
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "/api/placeholder/320/180";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-lg" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="font-medium">{video.duration}</span>
          </div>
          {video.relevanceScore && video.relevanceScore > 60 && (
            <div className="absolute top-2 left-2 bg-agriculture-gold text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>Recomendado</span>
            </div>
          )}
          {video.subtitles && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
              CC
            </div>
          )}
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-sm leading-5 line-clamp-2 group-hover:text-agriculture-terracotta transition-colors min-h-[2.5rem]">
              {video.title}
            </CardTitle>
            <Badge 
              variant={
                video.difficulty === "Básico" ? "secondary" : 
                video.difficulty === "Intermedio" ? "default" : 
                "outline"
              }
              className="text-xs shrink-0"
            >
              {video.difficulty}
            </Badge>
          </div>
          {video.instructor && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Por:</span> {video.instructor}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          <CardDescription className="text-xs leading-4 line-clamp-2 min-h-[2rem]">
            {video.description}
          </CardDescription>
          
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-muted/20">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{video.views.toLocaleString()} vistas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>{video.language}</span>
              </div>
              {video.relevanceScore && video.relevanceScore > 0 && (
                <div className="text-agriculture-terracotta font-medium">
                  {Math.round(video.relevanceScore)}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-agriculture-terracotta" />
          <h1 className="text-3xl font-bold text-gradient">Centro de Aprendizaje</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Aprende técnicas agrícolas, identifica plagas y enfermedades, y prepárate para 
          fenómenos climáticos con nuestros recursos educativos especializados.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar videos, tutoriales o recursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
          <VideoIcon className="h-8 w-8 text-agriculture-terracotta mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Videos Educativos</h3>
          <p className="text-sm text-muted-foreground">Tutoriales paso a paso</p>
        </Card>
        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
          <MessageCircle className="h-8 w-8 text-agriculture-earth mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Pregunta a la IA</h3>
          <p className="text-sm text-muted-foreground">Consultas personalizadas</p>
        </Card>
        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Download className="h-8 w-8 text-agriculture-brown mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Recursos Descargables</h3>
          <p className="text-sm text-muted-foreground">Guías y manuales PDF</p>
        </Card>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full h-auto p-1 gap-1">
          {categories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex flex-col items-center gap-1 p-3 h-auto min-h-[4rem] text-center"
            >
              <category.icon className="h-4 w-4 shrink-0" />
              <span className="text-xs font-medium leading-tight">{category.label}</span>
              <Badge variant="secondary" className="text-xs min-w-[1.5rem] h-5">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile-based recommendations info */}
        {selectedCategory === "recomendados" && (
          <div className="bg-gradient-to-r from-agriculture-terracotta/10 to-agriculture-earth/10 p-6 rounded-lg border border-agriculture-terracotta/20 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-agriculture-terracotta" />
              <h3 className="font-semibold text-lg">Recomendaciones Personalizadas con IA</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Basadas en tu perfil: <strong>{farmerProfile.crops.join(", ")}</strong> • <strong>{farmerProfile.irrigationMethods.join(", ")}</strong> • <strong>{farmerProfile.location}</strong>
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {farmerProfile.challenges.map(challenge => (
                <Badge key={challenge} variant="outline" className="text-xs">
                  {challenge}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              💡 Los videos están ordenados por relevancia según tu perfil agrícola
            </p>
          </div>
        )}

        {/* Video Grid */}
        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.slice(0, 12).map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          
          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron videos</h3>
              <p className="text-muted-foreground">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente.
              </p>
            </div>
          )}

          {filteredVideos.length > 12 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Cargar más videos ({filteredVideos.length - 12} restantes)
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CentroAprendizaje; 