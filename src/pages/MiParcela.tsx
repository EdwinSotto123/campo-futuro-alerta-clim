
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Thermometer, 
  TreePine,
  Home,
  Truck,
  Tractor,
  Wheat,
  Apple,
  Carrot,
  Corn
} from "lucide-react";

const MiParcela = () => {
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

  // Datos de ejemplo para los cultivos
  const crops = [
    { id: 1, name: "Tomates", icon: Apple, stage: "Crecimiento", health: 85, days: 45, color: "bg-red-400" },
    { id: 2, name: "Maíz", icon: Corn, stage: "Floración", health: 92, days: 30, color: "bg-yellow-400" },
    { id: 3, name: "Zanahorias", icon: Carrot, stage: "Maduro", health: 78, days: 5, color: "bg-orange-400" },
    { id: 4, name: "Trigo", icon: Wheat, stage: "Siembra", health: 100, days: 90, color: "bg-amber-300" },
  ];

  const buildings = [
    { id: 1, name: "Granero", icon: Home, x: 10, y: 10 },
    { id: 2, name: "Tractor", icon: Tractor, x: 150, y: 80 },
    { id: 3, name: "Almacén", icon: Truck, x: 250, y: 40 },
  ];

  const plots = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    crop: crops[i % crops.length],
    x: (i % 4) * 120 + 50,
    y: Math.floor(i / 4) * 100 + 120,
    width: 100,
    height: 80,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Mi Parcela</h1>
          <p className="text-lg text-muted-foreground">Gestiona tu granja virtual estilo Farm Village</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Sprout className="h-4 w-4 mr-2" />
            Plantar
          </Button>
          <Button variant="outline">
            <Droplets className="h-4 w-4 mr-2" />
            Regar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vista de la Granja */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vista de la Granja</CardTitle>
              <CardDescription>Haz clic en los cultivos para obtener información detallada</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="relative w-full h-96 bg-gradient-to-br from-green-200 to-green-300 rounded-lg overflow-hidden border-4 border-green-400"
                style={{ 
                  backgroundImage: `
                    radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.3) 2px, transparent 2px),
                    radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              >
                {/* Edificios */}
                {buildings.map((building) => (
                  <div
                    key={building.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                    style={{ left: building.x, top: building.y }}
                  >
                    <div className="bg-red-600 p-3 rounded-lg shadow-lg border-2 border-red-800">
                      <building.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs text-center mt-1 font-semibold text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                      {building.name}
                    </div>
                  </div>
                ))}

                {/* Parcelas de cultivos */}
                {plots.map((plot) => (
                  <div
                    key={plot.id}
                    className={`absolute cursor-pointer hover:scale-105 transition-all duration-200 ${
                      selectedPlot === plot.id ? 'ring-4 ring-yellow-400' : ''
                    }`}
                    style={{
                      left: plot.x,
                      top: plot.y,
                      width: plot.width,
                      height: plot.height,
                    }}
                    onClick={() => setSelectedPlot(plot.id)}
                  >
                    <div className={`w-full h-full ${plot.crop.color} rounded-lg border-2 border-green-600 shadow-lg flex flex-col items-center justify-center relative overflow-hidden`}>
                      {/* Patrón de cultivo */}
                      <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="bg-green-600 rounded-full opacity-60"></div>
                        ))}
                      </div>
                      
                      {/* Ícono del cultivo */}
                      <plot.crop.icon className="h-8 w-8 text-white z-10 drop-shadow-lg" />
                      
                      {/* Información básica */}
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="text-xs font-semibold text-white text-center bg-black bg-opacity-50 rounded px-1">
                          {plot.crop.name}
                        </div>
                      </div>
                      
                      {/* Indicador de salud */}
                      <div className="absolute top-1 right-1">
                        <div className={`w-3 h-3 rounded-full ${
                          plot.crop.health > 80 ? 'bg-green-400' : 
                          plot.crop.health > 60 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Elementos decorativos */}
                <div className="absolute bottom-4 left-4">
                  <TreePine className="h-8 w-8 text-green-800" />
                </div>
                <div className="absolute bottom-4 right-4">
                  <TreePine className="h-6 w-6 text-green-800" />
                </div>
                
                {/* Sol */}
                <div className="absolute top-4 right-4">
                  <Sun className="h-10 w-10 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de información */}
        <div className="space-y-4">
          {/* Información del cultivo seleccionado */}
          {selectedPlot && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plots.find(p => p.id === selectedPlot)?.crop.icon && (
                    <plots.find(p => p.id === selectedPlot)!.crop.icon className="h-5 w-5" />
                  )}
                  {plots.find(p => p.id === selectedPlot)?.crop.name}
                </CardTitle>
                <CardDescription>Parcela #{selectedPlot}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const crop = plots.find(p => p.id === selectedPlot)?.crop;
                  if (!crop) return null;
                  
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Estado:</span>
                        <Badge variant="secondary">{crop.stage}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Salud:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div 
                              className={`h-full rounded ${
                                crop.health > 80 ? 'bg-green-500' : 
                                crop.health > 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${crop.health}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{crop.health}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Días restantes:</span>
                        <Badge variant="outline">{crop.days} días</Badge>
                      </div>
                      <div className="space-y-2 pt-2">
                        <Button size="sm" className="w-full">
                          <Droplets className="h-4 w-4 mr-2" />
                          Regar
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Thermometer className="h-4 w-4 mr-2" />
                          Fertilizar
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Estadísticas generales */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de la Granja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Parcelas activas:</span>
                <Badge>{plots.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cosecha próxima:</span>
                <Badge variant="outline">3 días</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Salud promedio:</span>
                <Badge variant="secondary">86%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ingresos estimados:</span>
                <Badge className="bg-green-600">$2,450</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full justify-start">
                <Sprout className="h-4 w-4 mr-2" />
                Plantar nuevo cultivo
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Droplets className="h-4 w-4 mr-2" />
                Regar todas las parcelas
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Truck className="h-4 w-4 mr-2" />
                Cosechar cultivos maduros
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MiParcela;
