
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Phone, MessageSquare, MapPin, Clock, Users, Truck } from "lucide-react";

const CentroEmergenciasPage = () => {
  const [emergencyType, setEmergencyType] = useState("");
  const [emergencyDescription, setEmergencyDescription] = useState("");

  const emergencyContacts = [
    {
      title: "SENAMHI - Servicio Nacional de Meteorología",
      phone: "+51-1-614-1414",
      description: "Información meteorológica y alertas climáticas",
      available: "24/7"
    },
    {
      title: "SENASA - Sanidad Agraria",
      phone: "+51-1-313-3300",
      description: "Emergencias fitosanitarias y plagas",
      available: "Lun-Vie 8AM-6PM"
    },
    {
      title: "Defensa Civil",
      phone: "115",
      description: "Emergencias y desastres naturales",
      available: "24/7"
    },
    {
      title: "MINAGRI - Ministerio de Agricultura",
      phone: "+51-1-209-8800",
      description: "Apoyo técnico y programas de emergencia",
      available: "Lun-Vie 8AM-5PM"
    }
  ];

  const activeEmergencies = [
    {
      id: "E001",
      type: "Sequía Severa",
      location: "Cusco - Valle Sagrado",
      severity: "high",
      reported: "hace 2 horas",
      affected: "120 agricultores",
      status: "En atención"
    },
    {
      id: "E002",
      type: "Plaga de Mosca Blanca",
      location: "Arequipa - Valle del Colca",
      severity: "medium",
      reported: "hace 6 horas",
      affected: "45 hectáreas",
      status: "Evaluando"
    },
    {
      id: "E003",
      type: "Granizada",
      location: "Junín - Valle del Mantaro",
      severity: "critical",
      reported: "hace 30 minutos",
      affected: "200 hectáreas",
      status: "Urgente"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-green-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Centro de Respuesta de Emergencias</h1>
          <p className="text-muted-foreground">
            Respuesta inmediata para emergencias climáticas y agrícolas - Disponible 24/7
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-red-500/20 text-red-700 animate-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Estado de Alerta
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reporte de Emergencia */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Reportar Emergencia
            </CardTitle>
            <CardDescription>
              Informa inmediatamente cualquier emergencia climática o agrícola
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tipo de Emergencia</label>
              <select 
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">Seleccionar tipo</option>
                <option value="sequia">Sequía</option>
                <option value="inundacion">Inundación</option>
                <option value="granizada">Granizada</option>
                <option value="helada">Helada</option>
                <option value="plaga">Plaga/Enfermedad</option>
                <option value="incendio">Incendio</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Ubicación Exacta</label>
              <Input placeholder="Ingresa tu ubicación o coordenadas" className="mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium">Descripción de la Emergencia</label>
              <Textarea 
                placeholder="Describe la situación, extensión del daño, cultivos afectados..."
                value={emergencyDescription}
                onChange={(e) => setEmergencyDescription(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Usar GPS
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Reportar Ahora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contactos de Emergencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contactos de Emergencia
            </CardTitle>
            <CardDescription>
              Números importantes para diferentes tipos de emergencias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="p-3 border rounded-md">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">{contact.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {contact.available}
                  </Badge>
                </div>
                <p className="text-lg font-bold text-blue-600">{contact.phone}</p>
                <p className="text-xs text-muted-foreground">{contact.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Emergencias Activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emergencias Activas en Tu Región
          </CardTitle>
          <CardDescription>
            Monitoreo en tiempo real de emergencias reportadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeEmergencies.map((emergency) => (
              <div key={emergency.id} className="p-4 border rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(emergency.severity)}`} />
                    <h4 className="font-medium">{emergency.type}</h4>
                    <Badge variant="outline">{emergency.id}</Badge>
                  </div>
                  <Badge variant={emergency.status === "Urgente" ? "destructive" : "outline"}>
                    {emergency.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{emergency.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{emergency.reported}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{emergency.affected}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Más Info
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recursos de Emergencia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Equipos Móviles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Unidades de respuesta rápida disponibles
            </p>
            <Badge className="bg-green-500">3 equipos activos</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Especialistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Agrónomos y técnicos de campo
            </p>
            <Badge className="bg-blue-500">12 disponibles</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Comunicación directa con especialistas
            </p>
            <Button size="sm" className="w-full">Iniciar Chat</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CentroEmergenciasPage;
