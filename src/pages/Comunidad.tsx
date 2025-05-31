import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageCircle, 
  Share2, 
  Bell, 
  MapPin, 
  Calendar, 
  ChevronRight,
  Search,
  Filter,
  Plus,
  Heart,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  MessageSquare,
  Send,
  Image,
  Video,
  FileText,
  Bookmark,
  MoreHorizontal,
  UserPlus,
  Settings,
  HelpCircle,
  Lightbulb,
  Sprout,
  Droplets,
  Sun,
  CloudRain,
  Bug,
  Wheat,
  TreePine,
  Mountain,
  Globe,
  Target,
  Award,
  Zap,
  Activity
} from "lucide-react";

interface Usuario {
  id: string;
  nombre: string;
  avatar: string;
  ubicacion: string;
  especialidad: string;
  nivel: 'Principiante' | 'Intermedio' | 'Experto' | 'Maestro';
  puntos: number;
  verificado: boolean;
}

interface Publicacion {
  id: string;
  usuario: Usuario;
  contenido: string;
  tiempo: string;
  tipo: 'pregunta' | 'consejo' | 'alerta' | 'experiencia' | 'evento';
  categoria: string;
  likes: number;
  comentarios: number;
  compartidos: number;
  imagenes?: string[];
  urgente?: boolean;
  resuelto?: boolean;
}

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion: string;
  modalidad: 'Presencial' | 'Virtual' | 'Híbrido';
  asistentes: number;
  maxAsistentes: number;
  organizador: Usuario;
  categoria: string;
  precio: number;
  destacado: boolean;
}

const ComunidadPage = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  const usuarios: Usuario[] = [
    {
      id: '1',
      nombre: 'María Quispe',
      avatar: '👩‍🌾',
      ubicacion: 'Cochabamba',
      especialidad: 'Cultivos Andinos',
      nivel: 'Experto',
      puntos: 2450,
      verificado: true
    },
    {
      id: '2',
      nombre: 'Juan Mamani',
      avatar: '👨‍🌾',
      ubicacion: 'La Paz',
      especialidad: 'Riego Tecnificado',
      nivel: 'Maestro',
      puntos: 3200,
      verificado: true
    },
    {
      id: '3',
      nombre: 'Elena Choque',
      avatar: '👩‍🌾',
      ubicacion: 'Potosí',
      especialidad: 'Agricultura Orgánica',
      nivel: 'Intermedio',
      puntos: 1800,
      verificado: false
    }
  ];

  const publicaciones: Publicacion[] = [
    {
      id: '1',
      usuario: usuarios[0],
      contenido: '🌱 ¡Excelentes resultados con la rotación de cultivos! Este año implementé papa-quinua-descanso y la productividad aumentó 30%. ¿Alguien más ha probado esta técnica en el altiplano?',
      tiempo: 'hace 2 horas',
      tipo: 'experiencia',
      categoria: 'Técnicas de Cultivo',
      likes: 24,
      comentarios: 8,
      compartidos: 12,
      imagenes: ['cultivo1.jpg', 'cultivo2.jpg']
    },
    {
      id: '2',
      usuario: usuarios[1],
      contenido: '⚠️ ALERTA CLIMÁTICA: Se pronostican heladas intensas para los próximos 3 días en el altiplano. Recomiendo cubrir cultivos sensibles y preparar sistemas de protección antiheladas.',
      tiempo: 'hace 4 horas',
      tipo: 'alerta',
      categoria: 'Clima',
      likes: 45,
      comentarios: 15,
      compartidos: 28,
      urgente: true
    },
    {
      id: '3',
      usuario: usuarios[2],
      contenido: '❓ Necesito ayuda: Mis plantas de tomate están mostrando manchas amarillas en las hojas. ¿Podría ser alguna enfermedad? Adjunto fotos. Cualquier consejo es bienvenido.',
      tiempo: 'hace 6 horas',
      tipo: 'pregunta',
      categoria: 'Sanidad Vegetal',
      likes: 12,
      comentarios: 23,
      compartidos: 5,
      imagenes: ['tomate_enfermo.jpg']
    }
  ];

  const eventos: Evento[] = [
    {
      id: '1',
      titulo: 'Taller: Agricultura Climáticamente Inteligente',
      descripcion: 'Aprende técnicas avanzadas para adaptar tus cultivos al cambio climático',
      fecha: '2024-06-15',
      hora: '09:00',
      ubicacion: 'Centro de Capacitación Agrícola - Cochabamba',
      modalidad: 'Presencial',
      asistentes: 24,
      maxAsistentes: 40,
      organizador: usuarios[0],
      categoria: 'Capacitación',
      precio: 0,
      destacado: true
    },
    {
      id: '2',
      titulo: 'Intercambio de Semillas Nativas',
      descripcion: 'Evento comunitario para intercambiar y preservar variedades locales',
      fecha: '2024-06-20',
      hora: '08:00',
      ubicacion: 'Plaza Central - Potosí',
      modalidad: 'Presencial',
      asistentes: 67,
      maxAsistentes: 100,
      organizador: usuarios[2],
      categoria: 'Intercambio',
      precio: 0,
      destacado: false
    },
    {
      id: '3',
      titulo: 'Webinar: Sistemas de Riego por Goteo',
      descripcion: 'Capacitación virtual sobre instalación y mantenimiento de riego eficiente',
      fecha: '2024-06-18',
      hora: '19:00',
      ubicacion: 'Plataforma Virtual',
      modalidad: 'Virtual',
      asistentes: 156,
      maxAsistentes: 200,
      organizador: usuarios[1],
      categoria: 'Tecnología',
      precio: 25,
      destacado: true
    }
  ];

  const categorias = [
    { id: 'todos', nombre: 'Todos', icon: Globe, color: 'text-gray-600' },
    { id: 'cultivos', nombre: 'Cultivos', icon: Sprout, color: 'text-green-600' },
    { id: 'clima', nombre: 'Clima', icon: CloudRain, color: 'text-blue-600' },
    { id: 'riego', nombre: 'Riego', icon: Droplets, color: 'text-cyan-600' },
    { id: 'plagas', nombre: 'Plagas', icon: Bug, color: 'text-red-600' },
    { id: 'tecnologia', nombre: 'Tecnología', icon: Zap, color: 'text-purple-600' },
    { id: 'mercado', nombre: 'Mercado', icon: TrendingUp, color: 'text-orange-600' }
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'pregunta': return <HelpCircle className="h-4 w-4 text-blue-500" />;
      case 'consejo': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'alerta': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'experiencia': return <Star className="h-4 w-4 text-green-500" />;
      case 'evento': return <Calendar className="h-4 w-4 text-purple-500" />;
      default: return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Principiante': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-blue-100 text-blue-800';
      case 'Experto': return 'bg-purple-100 text-purple-800';
      case 'Maestro': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Mejorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-agriculture-terracotta" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth bg-clip-text text-transparent">
              Comunidad Agrícola
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Conecta, aprende y crece junto a agricultores de toda la región andina
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">2,847 Miembros Activos</Badge>
            <Badge className="bg-blue-100 text-blue-800">156 Expertos</Badge>
            <Badge className="bg-purple-100 text-purple-800">24/7 Disponible</Badge>
      </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </Button>
          <Button className="bg-agriculture-terracotta hover:bg-agriculture-earth">
            <UserPlus className="h-4 w-4 mr-2" />
            Invitar Amigos
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="h-6 w-6 text-blue-500" />
          </div>
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">Consultas Resueltas</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-6 w-6 text-green-500" />
                </div>
            <p className="text-2xl font-bold">48</p>
            <p className="text-sm text-muted-foreground">Eventos Este Mes</p>
              </CardContent>
            </Card>
          
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-yellow-500" />
        </div>
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Expertos Verificados</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">89%</p>
            <p className="text-sm text-muted-foreground">Satisfacción</p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda y Filtros Mejorados */}
          <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar preguntas, consejos, eventos o agricultores..." 
                className="pl-10"
              />
                </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {categorias.map((categoria) => (
                <Button
                  key={categoria.id}
                  variant={filtroCategoria === categoria.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroCategoria(categoria.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <categoria.icon className={`h-4 w-4 ${categoria.color}`} />
                  {categoria.nombre}
                </Button>
              ))}
            </div>
              </div>
            </CardContent>
          </Card>
          
      {/* Contenido Principal con Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="eventos" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Eventos
          </TabsTrigger>
          <TabsTrigger value="expertos" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Expertos
          </TabsTrigger>
          <TabsTrigger value="grupos" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Grupos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar Izquierdo */}
            <div className="space-y-4">
              {/* Crear Publicación */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Compartir con la Comunidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>AG</AvatarFallback>
                    </Avatar>
                    <Input placeholder="¿Qué quieres compartir hoy?" className="flex-1" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Pregunta
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Consejo
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Foto
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Alerta
                    </Button>
                  </div>
                  
                  <Button className="w-full bg-agriculture-terracotta hover:bg-agriculture-earth">
                    <Send className="h-4 w-4 mr-2" />
                    Publicar
                  </Button>
                </CardContent>
              </Card>

              {/* Alertas Importantes */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    Alertas Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Alert className="p-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Heladas previstas:</strong> Próximos 3 días en altiplano
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="p-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Nueva plaga:</strong> Detectada en cultivos de maíz - Región Sur
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Feed Principal */}
            <div className="lg:col-span-3 space-y-4">
              <AnimatePresence>
                {publicaciones.map((pub, index) => (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`${pub.urgente ? 'border-red-200 bg-red-50' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="text-lg">{pub.usuario.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{pub.usuario.nombre}</p>
                                {pub.usuario.verificado && (
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                )}
                                <Badge className={getNivelColor(pub.usuario.nivel)} variant="outline">
                                  {pub.usuario.nivel}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {pub.usuario.ubicacion}
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                {pub.tiempo}
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {pub.categoria}
                                </Badge>
                      </div>
                    </div>
                  </div>
                          
                          <div className="flex items-center gap-2">
                            {getTipoIcon(pub.tipo)}
                            {pub.urgente && (
                              <Badge className="bg-red-100 text-red-800">
                                Urgente
                    </Badge>
                  )}
                          </div>
                </div>
              </CardHeader>
                      
              <CardContent>
                        <p className="text-sm leading-relaxed mb-3">{pub.contenido}</p>
                        
                        {pub.imagenes && pub.imagenes.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {pub.imagenes.map((img, idx) => (
                              <div key={idx} className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                                <Image className="h-8 w-8 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        )}
              </CardContent>
                      
                      <CardFooter className="flex justify-between items-center pt-3 border-t">
                <div className="flex gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            {pub.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            {pub.comentarios}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            {pub.compartidos}
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Comentar
                  </Button>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventos.map((evento) => (
              <motion.div
                key={evento.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`h-full ${evento.destacado ? 'border-agriculture-gold/50 bg-agriculture-gold/5' : ''}`}>
                  {evento.destacado && (
                    <div className="bg-agriculture-gold text-white text-xs px-3 py-1 rounded-t-lg">
                      ⭐ Evento Destacado
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg leading-tight">{evento.titulo}</CardTitle>
                      <Badge variant="outline" className={`
                        ${evento.modalidad === 'Virtual' ? 'bg-blue-100 text-blue-800' : 
                          evento.modalidad === 'Presencial' ? 'bg-green-100 text-green-800' : 
                          'bg-purple-100 text-purple-800'}
                      `}>
                        {evento.modalidad}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {evento.descripcion}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{evento.fecha} a las {evento.hora}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{evento.ubicacion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{evento.asistentes}/{evento.maxAsistentes} asistentes</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{evento.organizador.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{evento.organizador.nombre}</p>
                        <p className="text-xs text-muted-foreground">{evento.organizador.especialidad}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-sm">
                      {evento.precio === 0 ? (
                        <Badge className="bg-green-100 text-green-800">Gratuito</Badge>
                      ) : (
                        <span className="font-semibold">Bs. {evento.precio}</span>
                      )}
                    </div>
                    <Button size="sm" className="bg-agriculture-terracotta hover:bg-agriculture-earth">
                      Inscribirse
                    </Button>
              </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expertos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usuarios.map((usuario) => (
              <Card key={usuario.id} className="text-center">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-20 w-20 text-3xl">
                      <AvatarFallback>{usuario.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="font-semibold">{usuario.nombre}</h3>
                        {usuario.verificado && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{usuario.ubicacion}</p>
                    </div>
                    
                    <Badge className={getNivelColor(usuario.nivel)}>
                      {usuario.nivel}
                    </Badge>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium">{usuario.especialidad}</p>
                      <p className="text-xs text-muted-foreground">{usuario.puntos} puntos</p>
                    </div>
                    
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Consultar
                      </Button>
                      <Button size="sm" className="flex-1 bg-agriculture-terracotta hover:bg-agriculture-earth">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Seguir
                      </Button>
                    </div>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>
        </TabsContent>

        <TabsContent value="grupos" className="space-y-4">
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Grupos Temáticos</h3>
            <p className="text-muted-foreground mb-6">
              Únete a grupos especializados según tus intereses y cultivos
            </p>
            <Button className="bg-agriculture-terracotta hover:bg-agriculture-earth">
              <Plus className="h-4 w-4 mr-2" />
              Crear Grupo
            </Button>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComunidadPage;
