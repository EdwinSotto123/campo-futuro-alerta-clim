
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, MessageCircle, Share2, Bell, MapPin, Calendar, ChevronRight } from "lucide-react";

const ComunidadPage = () => {
  const eventos = [
    {
      id: 1,
      titulo: "Preparación para la temporada de lluvias",
      fecha: "12 de junio, 2024",
      ubicacion: "Centro Comunitario, Cochabamba",
      asistentes: 24,
      organizador: {
        nombre: "María Quispe",
        avatar: "/placeholder.svg"
      }
    },
    {
      id: 2,
      titulo: "Taller de sistemas de riego eficientes",
      fecha: "18 de junio, 2024",
      ubicacion: "Granja Modelo, La Paz",
      asistentes: 16,
      organizador: {
        nombre: "Juan Mamani",
        avatar: "/placeholder.svg"
      }
    },
    {
      id: 3,
      titulo: "Intercambio de semillas resistentes",
      fecha: "25 de junio, 2024",
      ubicacion: "Plaza Central, Potosí",
      asistentes: 32,
      organizador: {
        nombre: "Carlos Huanca",
        avatar: "/placeholder.svg"
      }
    }
  ];
  
  const publicaciones = [
    {
      id: 1,
      usuario: {
        nombre: "Roberto Flores",
        avatar: "/placeholder.svg",
        ubicacion: "Altiplano Norte"
      },
      contenido: "¿Alguien más ha notado cambios en el patrón de lluvias este año? En mi zona han sido muy irregulares y estoy teniendo problemas con mi cultivo de papa.",
      tiempo: "hace 2 horas",
      comentarios: 12,
      compartidos: 3
    },
    {
      id: 2,
      usuario: {
        nombre: "Elena Choque",
        avatar: "/placeholder.svg",
        ubicacion: "Valle Central"
      },
      contenido: "Comparto mi experiencia con las mallas antigranizo que instalé el mes pasado. Han sido una excelente inversión considerando las tormentas recientes. Si alguien necesita el contacto del proveedor, puedo compartirlo.",
      tiempo: "hace 5 horas",
      comentarios: 8,
      compartidos: 17
    },
    {
      id: 3,
      usuario: {
        nombre: "Luis Condori",
        avatar: "/placeholder.svg",
        ubicacion: "Región Amazónica"
      },
      contenido: "Alerta: Hemos detectado una nueva plaga en cultivos de maíz en nuestra comunidad. Parece estar relacionada con el aumento de temperatura. Adjunto fotos para que puedan identificarla. Estamos coordinando con el SENASAG para control.",
      tiempo: "hace 1 día",
      comentarios: 23,
      compartidos: 42,
      alerta: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Comunidad Agrícola</h1>
          <p className="text-muted-foreground">
            Conecte, comparta y aprenda con otros agricultores de su región
          </p>
        </div>
        <Button className="agriculture-gradient text-white">
          <Users className="mr-2 h-4 w-4" /> Unirse a un grupo
        </Button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input 
            placeholder="Buscar grupos, eventos o publicaciones..." 
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <MapPin className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            Filtrar por tema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Próximos eventos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Próximos eventos</h2>
            <Button variant="link" className="flex items-center text-agriculture-terracotta">
              Ver todos <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {eventos.map(evento => (
            <Card key={evento.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{evento.titulo}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" /> {evento.fecha}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm flex items-center gap-2 mb-3">
                  <MapPin className="h-3.5 w-3.5" /> {evento.ubicacion}
                </p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={evento.organizador.avatar} alt={evento.organizador.nombre} />
                    <AvatarFallback>{evento.organizador.nombre.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">Organizado por {evento.organizador.nombre}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <span className="text-xs text-muted-foreground">{evento.asistentes} asistentes</span>
                <Button size="sm">Asistir</Button>
              </CardFooter>
            </Card>
          ))}
          
          <Button variant="outline" className="w-full">Crear evento</Button>
        </div>
        
        {/* Columna central - Publicaciones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Crear publicación */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3 items-center mb-4">
                <Avatar>
                  <AvatarFallback>AG</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input placeholder="Comparta su experiencia o pregunta a la comunidad..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Agregar imagen
                </Button>
                <Button size="sm" className="agriculture-gradient text-white">
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Publicaciones */}
          {publicaciones.map(pub => (
            <Card key={pub.id} className={pub.alerta ? "border-agriculture-danger/50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={pub.usuario.avatar} alt={pub.usuario.nombre} />
                      <AvatarFallback>{pub.usuario.nombre.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{pub.usuario.nombre}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" /> 
                        {pub.usuario.ubicacion} · {pub.tiempo}
                      </div>
                    </div>
                  </div>
                  {pub.alerta && (
                    <Badge variant="destructive" className="flex items-center bg-agriculture-danger">
                      <Bell className="h-3 w-3 mr-1" /> Alerta
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{pub.contenido}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-1" /> {pub.comentarios}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center text-muted-foreground">
                    <Share2 className="h-4 w-4 mr-1" /> {pub.compartidos}
                  </Button>
                </div>
                <Button size="sm" variant="outline">Comentar</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComunidadPage;

// Componente Search para el ícono de búsqueda
const Search = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
