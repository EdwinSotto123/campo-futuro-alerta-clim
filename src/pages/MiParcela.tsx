
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
  Corn,
  Barn
} from "lucide-react";

const MiParcela = () => {
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

  // Datos de ejemplo para los cultivos con colores más realistas
  const crops = [
    { id: 1, name: "Tomates", icon: Apple, stage: "Floración", health: 85, days: 45, color: "bg-red-500" },
    { id: 2, name: "Maíz", icon: Corn, stage: "Crecimiento", health: 92, days: 30, color: "bg-yellow-500" },
    { id: 3, name: "Lechugas", icon: Carrot, stage: "Maduro", health: 78, days: 5, color: "bg-green-500" },
    { id: 4, name: "Trigo", icon: Wheat, stage: "Siembra", health: 100, days: 90, color: "bg-amber-400" },
    { id: 5, name: "Zanahorias", icon: Carrot, stage: "Crecimiento", health: 88, days: 25, color: "bg-orange-500" },
    { id: 6, name: "Papas", icon: Apple, stage: "Floración", health: 95, days: 40, color: "bg-yellow-600" },
  ];

  const buildings = [
    { id: 1, name: "Granero", icon: Barn, x: 15, y: 15, color: "bg-red-700" },
    { id: 2, name: "Casa", icon: Home, x: 85, y: 20, color: "bg-blue-600" },
    { id: 3, name: "Tractor", icon: Tractor, x: 250, y: 30, color: "bg-green-700" },
    { id: 4, name: "Almacén", icon: Truck, x: 320, y: 25, color: "bg-gray-600" },
  ];

  // Configuración de parcelas en disposición de granja isométrica
  const plots = [
    // Fila superior
    { id: 1, crop: crops[0], x: 50, y: 80, width: 60, height: 40, rotation: 0 },
    { id: 2, crop: crops[1], x: 120, y: 80, width: 60, height: 40, rotation: 0 },
    { id: 3, crop: crops[2], x: 190, y: 80, width: 60, height: 40, rotation: 0 },
    { id: 4, crop: crops[3], x: 260, y: 80, width: 60, height: 40, rotation: 0 },
    
    // Fila media
    { id: 5, crop: crops[4], x: 50, y: 130, width: 60, height: 40, rotation: 0 },
    { id: 6, crop: crops[5], x: 120, y: 130, width: 60, height: 40, rotation: 0 },
    { id: 7, crop: crops[0], x: 190, y: 130, width: 60, height: 40, rotation: 0 },
    { id: 8, crop: crops[1], x: 260, y: 130, width: 60, height: 40, rotation: 0 },
    
    // Fila inferior
    { id: 9, crop: crops[2], x: 50, y: 180, width: 60, height: 40, rotation: 0 },
    { id: 10, crop: crops[3], x: 120, y: 180, width: 60, height: 40, rotation: 0 },
    { id: 11, crop: crops[4], x: 190, y: 180, width: 60, height: 40, rotation: 0 },
    { id: 12, crop: crops[5], x: 260, y: 180, width: 60, height: 40, rotation: 0 },
  ];

  const trees = [
    { x: 20, y: 240, size: "h-8 w-8" },
    { x: 320, y: 240, size: "h-6 w-6" },
    { x: 350, y: 190, size: "h-7 w-7" },
    { x: 10, y: 150, size: "h-5 w-5" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Mi Parcela</h1>
          <p className="text-lg text-muted-foreground">Tu granja virtual estilo Farm Village</p>
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
        {/* Vista de la Granja - Estilo Farm Village */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Barn className="h-5 w-5 text-red-600" />
                Vista de la Granja
              </CardTitle>
              <CardDescription>Haz clic en los cultivos para ver detalles • Estilo Farm Village</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="relative w-full h-80 bg-gradient-to-br from-green-300 via-green-400 to-green-500 rounded-lg overflow-hidden border-4 border-green-600 shadow-inner"
                style={{ 
                  backgroundImage: `
                    linear-gradient(45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%),
                    linear-gradient(-45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%),
                    linear-gradient(-45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%)
                  `,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                {/* Caminos */}
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-600 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-600 opacity-60"></div>
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-600 opacity-60"></div>
                <div className="absolute top-0 right-0 w-1 h-full bg-yellow-600 opacity-60"></div>

                {/* Edificios */}
                {buildings.map((building) => (
                  <div
                    key={building.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-all duration-200 z-20"
                    style={{ left: building.x, top: building.y }}
                  >
                    <div className={`${building.color} p-3 rounded-lg shadow-lg border-2 border-gray-800 relative`}>
                      <building.icon className="h-6 w-6 text-white" />
                      {/* Sombra del edificio */}
                      <div className="absolute -bottom-1 -right-1 w-full h-full bg-black opacity-20 rounded-lg -z-10"></div>
                    </div>
                    <div className="text-xs text-center mt-1 font-semibold text-white bg-black bg-opacity-70 px-2 py-1 rounded">
                      {building.name}
                    </div>
                  </div>
                ))}

                {/* Parcelas de cultivos */}
                {plots.map((plot) => (
                  <div
                    key={plot.id}
                    className={`absolute cursor-pointer transition-all duration-200 z-10 ${
                      selectedPlot === plot.id ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      left: plot.x,
                      top: plot.y,
                      width: plot.width,
                      height: plot.height,
                    }}
                    onClick={() => setSelectedPlot(plot.id)}
                  >
                    <div className={`w-full h-full ${plot.crop.color} rounded-lg border-2 border-green-800 shadow-lg relative overflow-hidden transform perspective-1000`}>
                      {/* Efecto 3D de la parcela */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20"></div>
                      
                      {/* Patrón de filas de cultivo */}
                      <div className="absolute inset-0 flex flex-col justify-center p-1">
                        {Array.from({ length: 3 }).map((_, rowIndex) => (
                          <div key={rowIndex} className="flex justify-center gap-1 mb-1">
                            {Array.from({ length: 4 }).map((_, colIndex) => (
                              <div 
                                key={colIndex} 
                                className="w-2 h-2 bg-green-800 rounded-full opacity-80"
                                style={{
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}
                              ></div>
                            ))}
                          </div>
                        ))}
                      </div>
                      
                      {/* Ícono del cultivo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <plot.crop.icon className="h-6 w-6 text-white z-10 drop-shadow-lg" />
                      </div>
                      
                      {/* Información básica */}
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="text-xs font-semibold text-white text-center bg-black bg-opacity-60 px-1 py-0.5">
                          {plot.crop.name}
                        </div>
                      </div>
                      
                      {/* Indicador de salud */}
                      <div className="absolute top-1 right-1">
                        <div className={`w-2 h-2 rounded-full ${
                          plot.crop.health > 80 ? 'bg-green-400' : 
                          plot.crop.health > 60 ? 'bg-yellow-400' : 'bg-red-400'
                        } shadow-sm`}></div>
                      </div>
                      
                      {/* Sombra de la parcela */}
                      <div className="absolute -bottom-1 -right-1 w-full h-full bg-black opacity-15 rounded-lg -z-10"></div>
                    </div>
                  </div>
                ))}

                {/* Árboles decorativos */}
                {trees.map((tree, index) => (
                  <div
                    key={index}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-5"
                    style={{ left: tree.x, top: tree.y }}
                  >
                    <TreePine className={`${tree.size} text-green-800 drop-shadow-lg`} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-full h-full">
                      <TreePine className={`${tree.size} text-black opacity-20`} />
                    </div>
                  </div>
                ))}
                
                {/* Sol */}
                <div className="absolute top-4 right-4 z-30">
                  <div className="relative">
                    <Sun className="h-10 w-10 text-yellow-300 animate-pulse drop-shadow-lg" />
                    <div className="absolute inset-0 h-10 w-10 bg-yellow-200 rounded-full opacity-50 animate-ping"></div>
                  </div>
                </div>

                {/* Flores decorativas */}
                <div className="absolute bottom-4 left-8">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de información */}
        <div className="space-y-4">
          {/* Información del cultivo seleccionado */}
          {selectedPlot && (
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
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
                        <span className="text-sm font-medium">Estado:</span>
                        <Badge variant="secondary">{crop.stage}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Salud:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
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
                        <span className="text-sm font-medium">Días restantes:</span>
                        <Badge variant="outline">{crop.days} días</Badge>
                      </div>
                      <div className="space-y-2 pt-2">
                        <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
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
              <CardTitle className="text-lg">Estadísticas de la Granja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Parcelas activas:</span>
                <Badge className="bg-green-600">{plots.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cosecha próxima:</span>
                <Badge variant="outline">5 días</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Salud promedio:</span>
                <Badge variant="secondary">89%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ingresos estimados:</span>
                <Badge className="bg-yellow-600">$3,200</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full justify-start bg-green-600 hover:bg-green-700">
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
