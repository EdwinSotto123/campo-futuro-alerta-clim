import { useState, useEffect, useCallback } from "react";
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
  Download,
  MessageCircle,
  Star,
  Globe,
  X,
  ChevronDown
} from "lucide-react";
import { videosDatabase, searchVideos, getVideosByCategory, VideoRecord } from "@/data/videosDatabase";

type FarmerProfile = {
  crops: string[];
  irrigationMethods: string[];
  chemicals: string[];
  farmSize: string;
  experience: string;
  location: string;
  challenges: string[];
};

const CentroAprendizaje = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("recomendados");
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const farmerProfile: FarmerProfile = {
    crops: ["Papa", "Maíz", "Quinua"],
    irrigationMethods: ["Riego por aspersión", "Riego por goteo"],
    chemicals: ["Fertilizantes orgánicos", "Pesticidas naturales"],
    farmSize: "2-5 hectáreas",
    experience: "5-10 años",
    location: "Región Andina",
    challenges: ["Cambio climático", "Plagas", "Sequías"]
  };

  // Función para obtener thumbnail de YouTube
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoId && videoId[1]) {
      return `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`;
    }
    return "/api/placeholder/320/180";
  };

  // Función de IA para responder preguntas agrícolas
  const handleAIQuestion = async () => {
    if (!aiQuestion.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse("");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const responses = [
        {
          condition: aiQuestion.toLowerCase().includes("plaga"),
          answer: `🌾 **Recomendaciones para Control de Plagas**\n\nBasado en tus cultivos (${farmerProfile.crops.join(", ")}):\n\n1. **Control Preventivo**: Trampas amarillas para monitoreo\n2. **Control Biológico**: Bacillus thuringiensis para larvas\n3. **Control Orgánico**: Extractos de ajo y jabón potásico\n4. **Rotación de cultivos**: Rompe ciclos de plagas\n\n¿Te gustaría videos específicos sobre control de plagas en ${farmerProfile.crops[0]}?`
        },
        {
          condition: aiQuestion.toLowerCase().includes("riego"),
          answer: `💧 **Recomendaciones de Riego**\n\nPara ${farmerProfile.location} y cultivos de ${farmerProfile.crops.join(", ")}:\n\n1. **Riego por Goteo**: Ahorra 40% de agua\n2. **Frecuencia**: 2-3 veces por semana\n3. **Horarios**: 6-8 AM para evitar evaporación\n4. **Mulching**: Conserva humedad del suelo\n\nCon ${farmerProfile.experience} de experiencia, considera sensores IoT.`
        },
        {
          condition: aiQuestion.toLowerCase().includes("fertiliz"),
          answer: `🌱 **Fertilización Orgánica**\n\nSegún tu preferencia por métodos orgánicos:\n\n1. **Compost**: 3 meses de fermentación\n2. **Humus de lombriz**: Ideal para papa y maíz\n3. **Abonos verdes**: Leguminosas entre cultivos\n4. **Biol**: Estiércol + melaza por 30 días\n\nPara ${farmerProfile.farmSize}: 2-3 ton/hectárea de compost.`
        },
        {
          condition: aiQuestion.toLowerCase().includes("clima") || aiQuestion.toLowerCase().includes("helada"),
          answer: `🌡️ **Adaptación Climática**\n\nPara ${farmerProfile.location}:\n\n1. **Predicción**: Termómetros de máx/mín\n2. **Protección**: Micro túneles térmicos\n3. **Variedades**: Cultivares resistentes al frío\n4. **Riego**: Antes de heladas (efecto térmico)\n\n¿Necesitas variedades de papa resistentes a heladas?`
        }
      ];

      const matchedResponse = responses.find(r => r.condition);
      const finalResponse = matchedResponse?.answer || 
        `🔍 **Consulta Personalizada**\n\n**Tu perfil**: ${farmerProfile.crops.join(", ")} en ${farmerProfile.location}\n**Experiencia**: ${farmerProfile.experience}\n\nPara "${aiQuestion}":\n\n1. Consulta técnicos locales especializados\n2. Revisa condiciones específicas de tu zona\n3. Considera prácticas tradicionales exitosas\n4. Implementa pruebas piloto pequeñas\n\n¿Podrías ser más específico en tu consulta?`;

      setAiResponse(finalResponse);
    } catch (error) {
      setAiResponse("❌ Error procesando consulta. Intenta nuevamente.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Algoritmo de recomendaciones personalizadas
  const getPersonalizedRecommendations = (videos: VideoRecord[]): VideoRecord[] => {
    return videos.map(video => {
      let relevanceScore = 0;
      
      farmerProfile.crops.forEach(crop => {
        if (video.tags.some(tag => tag.toLowerCase().includes(crop.toLowerCase()))) {
          relevanceScore += 35;
        }
        if (video.title.toLowerCase().includes(crop.toLowerCase())) {
          relevanceScore += 15;
        }
      });
      
      farmerProfile.irrigationMethods.forEach(method => {
        if (method.toLowerCase().includes("goteo") && 
            video.tags.some(tag => tag.toLowerCase().includes("goteo"))) {
          relevanceScore += 30;
        }
        if (method.toLowerCase().includes("aspersión") && 
            video.tags.some(tag => tag.toLowerCase().includes("aspersión"))) {
          relevanceScore += 30;
        }
      });
      
      if (farmerProfile.chemicals.some(chem => chem.toLowerCase().includes("orgánico")) && 
          video.tags.some(tag => tag.toLowerCase().includes("orgánico"))) {
        relevanceScore += 25;
      }
      
      farmerProfile.challenges.forEach(challenge => {
        if (challenge.toLowerCase().includes("plaga") && 
            (video.category === "plagas" || video.tags.some(tag => tag.includes("plagas")))) {
          relevanceScore += 30;
        }
        if (challenge.toLowerCase().includes("clima") && 
            (video.category === "clima" || video.tags.some(tag => tag.includes("clima")))) {
          relevanceScore += 30;
        }
      });
      
      if (video.views > 20000) relevanceScore += 5;
      if (video.instructor?.includes("Dr.")) relevanceScore += 8;
      
      return { ...video, relevanceScore };
    }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  };

  const [recommendedVideos, setRecommendedVideos] = useState<VideoRecord[]>([]);

  useEffect(() => {
    const personalizedVideos = getPersonalizedRecommendations(videosDatabase);
    setRecommendedVideos(personalizedVideos);
  }, []);

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
    
    let videos = getVideosByCategory(selectedCategory);
    
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

  // Componente de Chat de IA - SIMPLIFICADO
  const AIChat = () => (
    <Card className="border-agriculture-terracotta/20 bg-gradient-to-br from-white to-agriculture-earth/5 shadow-lg">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={() => setShowAIChat(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="flex items-center gap-2 text-agriculture-terracotta pr-8">
          <Brain className="h-5 w-5" />
          Consulta Agrícola con IA
        </CardTitle>
        <CardDescription>
          Haz preguntas específicas sobre cultivos, plagas, riego, fertilización o cualquier desafío agrícola
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tu consulta:</label>
          <Input
            placeholder="Ej: ¿Cómo controlar plagas en papa de forma orgánica?"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            className="min-h-[2.5rem]"
            disabled={isAiLoading}
          />
        </div>
        
        <Button 
          onClick={handleAIQuestion}
          disabled={isAiLoading || !aiQuestion.trim()}
          className="w-full bg-agriculture-terracotta hover:bg-agriculture-terracotta/90"
        >
          {isAiLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analizando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Preguntar a la IA
            </div>
          )}
        </Button>

        {aiResponse && (
          <div className="bg-agriculture-earth/10 p-4 rounded-lg border border-agriculture-earth/20">
            <div className="flex items-start gap-2 mb-2">
              <Brain className="h-4 w-4 text-agriculture-terracotta mt-1 flex-shrink-0" />
              <span className="text-sm font-medium text-agriculture-terracotta">Especialista IA:</span>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
              {aiResponse}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
          💡 Respuestas personalizadas para: {farmerProfile.crops.join(", ")} en {farmerProfile.location}
        </div>
      </CardContent>
    </Card>
  );

  // Componente de tarjeta de video
  const VideoCard = ({ video }: { video: VideoRecord }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-white to-agriculture-earth/5">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-agriculture-terracotta" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth bg-clip-text text-transparent">
              Centro de Aprendizaje
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
            Aprende técnicas agrícolas, identifica plagas y enfermedades, y prepárate para 
            fenómenos climáticos con nuestros recursos educativos especializados.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Buscar videos, tutoriales o recursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-base border-2 border-agriculture-terracotta/20 focus:border-agriculture-terracotta"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card 
            className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-agriculture-terracotta/20 group"
            onClick={() => {
              setShowAIChat(false);
              setSelectedCategory("recomendados");
            }}
          >
            <VideoIcon className="h-10 w-10 text-agriculture-terracotta mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Videos Educativos</h3>
            <p className="text-sm text-muted-foreground">Tutoriales paso a paso personalizados</p>
          </Card>
          
          <Card 
            className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-agriculture-earth/20 group"
            onClick={() => setShowAIChat(!showAIChat)}
          >
            <MessageCircle className="h-10 w-10 text-agriculture-earth mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Pregunta a la IA</h3>
            <p className="text-sm text-muted-foreground">Consultas agrícolas personalizadas</p>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-agriculture-brown/20 group">
            <Download className="h-10 w-10 text-agriculture-brown mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Recursos Descargables</h3>
            <p className="text-sm text-muted-foreground">Guías y manuales en PDF</p>
          </Card>
        </div>

        {/* Chat de IA */}
        {showAIChat && (
          <div className="max-w-3xl mx-auto">
            <AIChat />
          </div>
        )}

        {/* Categories Tabs */}
        {!showAIChat && (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full h-auto p-2 gap-2 bg-agriculture-earth/5">
              {categories.map(category => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-2 p-4 h-auto min-h-[5rem] text-center data-[state=active]:bg-agriculture-terracotta data-[state=active]:text-white"
                >
                  <category.icon className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-medium leading-tight">{category.label}</span>
                  <Badge variant="secondary" className="text-xs min-w-[1.5rem] h-5 data-[state=active]:bg-white data-[state=active]:text-agriculture-terracotta">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Profile-based recommendations info */}
            {selectedCategory === "recomendados" && (
              <div className="bg-gradient-to-r from-agriculture-terracotta/10 to-agriculture-earth/10 p-6 rounded-lg border border-agriculture-terracotta/20 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-6 w-6 text-agriculture-terracotta" />
                  <h3 className="font-bold text-xl text-agriculture-terracotta">Recomendaciones Personalizadas con IA</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Basadas en tu perfil: <strong>{farmerProfile.crops.join(", ")}</strong> • <strong>{farmerProfile.irrigationMethods.join(", ")}</strong> • <strong>{farmerProfile.location}</strong>
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {farmerProfile.challenges.map(challenge => (
                    <Badge key={challenge} variant="outline" className="text-xs">
                      {challenge}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  ⭐ Los videos están ordenados por relevancia según tu perfil agrícola
                </p>
              </div>
            )}

            {/* Video Grid */}
            <TabsContent value={selectedCategory} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVideos.slice(0, 12).map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
              
              {filteredVideos.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-3">No se encontraron videos</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Intenta con otros términos de búsqueda o selecciona una categoría diferente.
                  </p>
                </div>
              )}

              {filteredVideos.length > 12 && (
                <div className="text-center mt-10">
                  <Button variant="outline" size="lg" className="gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Cargar más videos ({filteredVideos.length - 12} restantes)
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default CentroAprendizaje; 