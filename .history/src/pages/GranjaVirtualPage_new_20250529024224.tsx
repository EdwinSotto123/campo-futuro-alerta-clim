import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Droplets, Users, Store, Sprout, FileText, Calendar, MapPin, DollarSign,
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Info,
  Thermometer, CloudRain, Sun, Wind, Shield, TrendingUp, Activity,
  BarChart3, PieChart, Settings, Eye, Edit, Trash2, Plus, Star,
  Clock, Target, Zap, Leaf, Gauge, X
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Types and interfaces
interface Crop {
  id: string;
  name: string;
  type: 'papa' | 'quinua' | 'maiz' | 'habas' | 'oca' | 'ulluco';
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  area: number;
  plotLocation: string;
  plotLocationOther?: string;
  irrigationMethod: string;
  irrigationOther?: string;
  irrigationFrequency: string;
  irrigationTime: string;
  irrigationTimesPerWeek: number;
  fertilizerType: string;
  fertilizerBrand: string;
  fertilizerFrequency: string;
  sustainableTechniques: string[];
  notes: string;
  sunExposure: string;
  waterSource: string;
  soilType: string;
  position: { x: number; y: number };
  growthStage: 'seed' | 'sprout' | 'growing' | 'flowering' | 'harvest';
  health: number;
  climateRisk: number;
  createdAt: string;
  updatedAt: string;
}

interface BaseCell {
  id: string;
  row: number;
  col: number;
  type: 'crop' | 'water' | 'vendor' | 'supplier' | 'empty';
}

interface CropCell extends BaseCell {
  type: 'crop';
  data: Crop;
}

interface WaterCell extends BaseCell {
  type: 'water';
  data: {
    name: string;
    waterType: string;
    quality: string;
    flow: string;
    notes: string;
  };
}

interface VendorCell extends BaseCell {
  type: 'vendor';
  data: {
    name: string;
    products: string;
    contact: string;
    priceRange: string;
    notes: string;
  };
}

interface SupplierCell extends BaseCell {
  type: 'supplier';
  data: {
    name: string;
    supplies: string;
    contact: string;
    deliveryTime: string;
    terms: string;
    notes: string;
  };
}

interface EmptyCell extends BaseCell {
  type: 'empty';
  data: null;
}

type GridCell = CropCell | WaterCell | VendorCell | SupplierCell | EmptyCell;

// Crop information constants
const cropTypes = {
  papa: { name: 'Papa', icon: '🥔', season: 'Todo el año', minDays: 90, maxDays: 120 },
  quinua: { name: 'Quinua', icon: '🌾', season: 'Abril-Agosto', minDays: 120, maxDays: 180 },
  maiz: { name: 'Maíz', icon: '🌽', season: 'Octubre-Abril', minDays: 100, maxDays: 140 },
  habas: { name: 'Habas', icon: '🫘', season: 'Marzo-Julio', minDays: 90, maxDays: 120 },
  oca: { name: 'Oca', icon: '🥔', season: 'Abril-Agosto', minDays: 180, maxDays: 240 },
  ulluco: { name: 'Ulluco', icon: '🥔', season: 'Abril-Agosto', minDays: 150, maxDays: 210 }
};

const GRID_ROWS = 8;
const GRID_COLS = 10;

// Helper function to evaluate climate risk
const evaluateClimateRisk = (formData: any): number => {
  let riskScore = 0;
  const today = new Date();
  const plantingDate = new Date(formData.plantingDate);
  const harvestDate = new Date(formData.expectedHarvestDate);
  
  // Seasonal risk assessment
  const plantingMonth = plantingDate.getMonth();
  const harvestMonth = harvestDate.getMonth();
  
  // High-risk months (dry season in Andes: May-September)
  const drySeasonMonths = [4, 5, 6, 7, 8]; // May-September
  if (drySeasonMonths.includes(plantingMonth)) {
    riskScore += 15;
  }
  if (drySeasonMonths.includes(harvestMonth)) {
    riskScore += 10;
  }
  
  // Crop-specific risk factors
  const cropRiskFactors = {
    papa: { baseRisk: 10, droughtSensitive: true, frostSensitive: true },
    quinua: { baseRisk: 5, droughtSensitive: false, frostSensitive: false },
    maiz: { baseRisk: 8, droughtSensitive: true, frostSensitive: true },
    habas: { baseRisk: 7, droughtSensitive: false, frostSensitive: true },
    oca: { baseRisk: 6, droughtSensitive: false, frostSensitive: false },
    ulluco: { baseRisk: 6, droughtSensitive: false, frostSensitive: false }
  };
  
  const cropFactor = cropRiskFactors[formData.type as keyof typeof cropRiskFactors];
  riskScore += cropFactor.baseRisk;
  
  return Math.min(100, Math.max(0, riskScore));
};

// Form validation
const validateCropForm = (formData: any, step: number) => {
  const errors: any = {};
  
  if (step >= 1) {
    if (!formData.name) errors.name = 'El nombre es requerido';
    if (!formData.variety) errors.variety = 'La variedad es requerida';
    if (!formData.plantingDate) errors.plantingDate = 'La fecha de siembra es requerida';
    if (!formData.expectedHarvestDate) errors.expectedHarvestDate = 'La fecha de cosecha es requerida';
  }
  
  if (step >= 2) {
    if (!formData.area || formData.area <= 0) errors.area = 'El área debe ser mayor a 0';
    if (!formData.plotLocation) errors.plotLocation = 'La ubicación es requerida';
  }
  
  if (step >= 3) {
    if (!formData.irrigationMethod) errors.irrigationMethod = 'El método de riego es requerido';
    if (!formData.irrigationFrequency) errors.irrigationFrequency = 'La frecuencia de riego es requerida';
    if (!formData.fertilizerType) errors.fertilizerType = 'El tipo de fertilizante es requerido';
  }
  
  return errors;
};

// CropDetailSidebar Component
const CropDetailSidebar: React.FC<{ 
  crop: Crop; 
  onClose: () => void; 
  onEdit: () => void; 
  onDelete: () => void 
}> = ({ crop, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate crop metrics
  const daysSincePlanting = Math.floor((new Date().getTime() - new Date(crop.plantingDate).getTime()) / (1000 * 3600 * 24));
  const daysToHarvest = Math.floor((new Date(crop.expectedHarvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const totalDays = Math.floor((new Date(crop.expectedHarvestDate).getTime() - new Date(crop.plantingDate).getTime()) / (1000 * 3600 * 24));
  const growthProgress = Math.min(100, Math.max(0, (daysSincePlanting / totalDays) * 100));
  
  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600 bg-green-100';
    if (health >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  const getRiskColor = (risk: number) => {
    if (risk <= 20) return 'text-green-600 bg-green-100';
    if (risk <= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  const getGrowthStageInfo = (stage: string) => {
    const stages = {
      seed: { name: 'Semilla', icon: '🌱', progress: 10, color: 'bg-gray-200' },
      sprout: { name: 'Brote', icon: '🌿', progress: 30, color: 'bg-green-200' },
      growing: { name: 'Crecimiento', icon: '🌾', progress: 60, color: 'bg-green-400' },
      flowering: { name: 'Floración', icon: '🌸', progress: 80, color: 'bg-yellow-400' },
      harvest: { name: 'Cosecha', icon: '🌾', progress: 100, color: 'bg-orange-400' }
    };
    return stages[stage as keyof typeof stages] || stages.seed;
  };
  
  const stageInfo = getGrowthStageInfo(crop.growthStage);
  const cropInfo = cropTypes[crop.type];

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-2xl border-l z-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cropInfo.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{crop.name}</h2>
              <p className="text-sm text-gray-600">{cropInfo.name} - {crop.variety}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} className="flex-1">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="growth">Crecimiento</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Health and Risk Status */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Salud del Cultivo</span>
                    <Badge className={getHealthColor(crop.health)}>
                      {crop.health}%
                    </Badge>
                  </div>
                  <Progress value={crop.health} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Riesgo Climático</span>
                    <Badge className={getRiskColor(crop.climateRisk)}>
                      {crop.climateRisk}%
                    </Badge>
                  </div>
                  <Progress value={crop.climateRisk} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Growth Stage */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{stageInfo.icon}</span>
                  <div>
                    <h3 className="font-semibold">{stageInfo.name}</h3>
                    <p className="text-sm text-gray-600">Etapa actual de crecimiento</p>
                  </div>
                </div>
                <Progress value={stageInfo.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">{stageInfo.progress}% completado</p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Cronología
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Días desde siembra:</span>
                    <span className="font-medium">{daysSincePlanting} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Días hasta cosecha:</span>
                    <span className="font-medium">{daysToHarvest > 0 ? `${daysToHarvest} días` : 'Listo para cosechar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progreso:</span>
                    <span className="font-medium">{Math.round(growthProgress)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            {/* Growth Progress */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Progreso de Crecimiento</h3>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">{stageInfo.icon}</div>
                    <div className="text-sm text-gray-600">{Math.round(growthProgress)}% Completado</div>
                  </div>
                </div>
                <Progress value={growthProgress} className="h-3" />
              </CardContent>
            </Card>

            {/* Environmental Conditions */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Condiciones Ambientales</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span>Exposición: {crop.sunExposure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Fuente: {crop.waterSource}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span>Suelo: {crop.soilType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Área: {crop.area} m²</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Irrigation Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Información de Riego</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Método:</span>
                    <span className="font-medium">{crop.irrigationMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frecuencia:</span>
                    <span className="font-medium">{crop.irrigationFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horario:</span>
                    <span className="font-medium">{crop.irrigationTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Veces por semana:</span>
                    <span className="font-medium">{crop.irrigationTimesPerWeek}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fertilization */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Fertilización</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-medium">{crop.fertilizerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marca:</span>
                    <span className="font-medium">{crop.fertilizerBrand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frecuencia:</span>
                    <span className="font-medium">{crop.fertilizerFrequency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Ubicación</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Parcela:</span>
                    <span className="font-medium">{crop.plotLocation}</span>
                  </div>
                  {crop.plotLocationOther && (
                    <div className="flex justify-between">
                      <span>Detalle:</span>
                      <span className="font-medium">{crop.plotLocationOther}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {crop.notes && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Notas</h3>
                  <p className="text-sm text-gray-600">{crop.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Main Component
const GranjaVirtualPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Initialize grid
  const [grid, setGrid] = useState<GridCell[]>(() => {
    const initialGrid: GridCell[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        initialGrid.push({
          id: `${row}-${col}`,
          row,
          col,
          type: 'empty',
          data: null
        });
      }
    }
    return initialGrid;
  });

  // Form state for new crop
  const [newCropForm, setNewCropForm] = useState({
    name: '',
    type: 'papa' as 'papa' | 'quinua' | 'maiz' | 'habas' | 'oca' | 'ulluco',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
    area: 0,
    plotLocation: '',
    plotLocationOther: '',
    irrigationMethod: '',
    irrigationOther: '',
    irrigationFrequency: '',
    irrigationTime: '',
    irrigationTimesPerWeek: 1,
    fertilizerType: '',
    fertilizerBrand: '',
    fertilizerFrequency: '',
    sustainableTechniques: [] as string[],
    notes: '',
    sunExposure: '',
    waterSource: '',
    soilType: ''
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [selectedGridPosition, setSelectedGridPosition] = useState<{ row: number; col: number } | null>(null);

  // Handle cell click
  const handleCellClick = (cell: GridCell) => {
    if (cell.type === 'crop') {
      setSelectedCrop(cell.data);
      setShowSidebar(true);
    } else {
      setSelectedCell(cell);
      setSelectedGridPosition({ row: cell.row, col: cell.col });
      setIsDialogOpen(true);
    }
  };

  // Update cell in grid
  const updateCell = (cellId: string, type: string, data: any) => {
    setGrid(prev => prev.map(cell => {
      if (cell.id === cellId) {
        return { ...cell, type: type as any, data };
      }
      return cell;
    }));
    setIsDialogOpen(false);
    setSelectedCell(null);
    setSelectedGridPosition(null);
    
    // Reset form
    setNewCropForm({
      name: '',
      type: 'papa',
      variety: '',
      plantingDate: '',
      expectedHarvestDate: '',
      area: 0,
      plotLocation: '',
      plotLocationOther: '',
      irrigationMethod: '',
      irrigationOther: '',
      irrigationFrequency: '',
      irrigationTime: '',
      irrigationTimesPerWeek: 1,
      fertilizerType: '',
      fertilizerBrand: '',
      fertilizerFrequency: '',
      sustainableTechniques: [],
      notes: '',
      sunExposure: '',
      waterSource: '',
      soilType: ''
    });
    setCurrentFormStep(1);
    setFormErrors({});
  };

  // Handle crop save
  const handleCropSave = () => {
    const errors = validateCropForm(newCropForm, 4);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Error en el formulario",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedGridPosition) return;

    const climateRisk = evaluateClimateRisk(newCropForm);
    
    const newCrop: Crop = {
      id: `crop-${Date.now()}`,
      ...newCropForm,
      position: {
        x: (selectedGridPosition.col / GRID_COLS) * 100,
        y: (selectedGridPosition.row / GRID_ROWS) * 100
      },
      growthStage: 'seed',
      health: 100,
      climateRisk,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updateCell(selectedCell!.id, 'crop', newCrop);
    
    toast({
      title: "Cultivo agregado exitosamente",
      description: `Riesgo climático evaluado: ${climateRisk}%`,
    });
  };

  // Get cell display
  const getCellDisplay = (cell: GridCell) => {
    switch (cell.type) {
      case 'crop':
        const crop = cell.data as Crop;
        const cropInfo = cropTypes[crop.type];
        return (
          <div className="w-full h-full bg-green-100 border-2 border-green-300 rounded-lg p-2 hover:bg-green-200 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-2xl mb-1">{cropInfo.icon}</div>
              <div className="text-xs font-medium text-green-800">{crop.name}</div>
              <div className="text-xs text-green-600">{cropInfo.name}</div>
              <div className="flex justify-between mt-1">
                <span className="text-xs bg-green-200 px-1 rounded">♥{crop.health}%</span>
                <span className="text-xs bg-yellow-200 px-1 rounded">⚠{crop.climateRisk}%</span>
              </div>
            </div>
          </div>
        );
      case 'water':
        return (
          <div className="w-full h-full bg-blue-100 border-2 border-blue-300 rounded-lg p-2 hover:bg-blue-200 transition-colors cursor-pointer">
            <div className="text-center">
              <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-blue-800">Agua</div>
            </div>
          </div>
        );
      case 'vendor':
        return (
          <div className="w-full h-full bg-purple-100 border-2 border-purple-300 rounded-lg p-2 hover:bg-purple-200 transition-colors cursor-pointer">
            <div className="text-center">
              <Store className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-purple-800">Vendedor</div>
            </div>
          </div>
        );
      case 'supplier':
        return (
          <div className="w-full h-full bg-orange-100 border-2 border-orange-300 rounded-lg p-2 hover:bg-orange-200 transition-colors cursor-pointer">
            <div className="text-center">
              <Users className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-orange-800">Proveedor</div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="text-center">
              <Plus className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-500">Agregar</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <div className="flex h-screen relative">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'pr-96' : ''}`}>
          <div className="p-6">
            {/* Header with Farm Statistics and Tools */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    🌱 MI GRANJA VIRTUAL
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                      {grid.filter(c => c.type === 'crop').length} Cultivos Activos
                    </Badge>
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Gestiona tu cadena de suministro y cultivos de forma integral
                  </p>
                </div>

                {/* Toolbar de Herramientas */}
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 bg-white rounded-lg p-2 shadow-sm border">
                    <Button
                      variant={showSidebar ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Panel Info
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Vista de Análisis",
                          description: "Analizando datos de cultivos..."
                        });
                      }}
                      className="flex items-center gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Análisis
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Exportando Datos",
                          description: "Preparando reporte de la granja..."
                        });
                      }}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Card className="p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Cultivos</p>
                      <p className="text-lg font-bold text-green-600">
                        {grid.filter(c => c.type === 'crop').length}
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Fuentes de Agua</p>
                      <p className="text-lg font-bold text-blue-600">
                        {grid.filter(c => c.type === 'water').length}
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Vendedores</p>
                      <p className="text-lg font-bold text-purple-600">
                        {grid.filter(c => c.type === 'vendor').length}
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Proveedores</p>
                      <p className="text-lg font-bold text-orange-600">
                        {grid.filter(c => c.type === 'supplier').length}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Indicadores de Estado de Cultivos */}
              {grid.filter(c => c.type === 'crop').length > 0 && (
                <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Estado General de Cultivos
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(grid.filter(c => c.type === 'crop').reduce((acc, cell) => acc + (cell.data as Crop).health, 0) / grid.filter(c => c.type === 'crop').length)}%
                      </div>
                      <div className="text-sm text-gray-600">Salud Promedio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {Math.round(grid.filter(c => c.type === 'crop').reduce((acc, cell) => acc + (cell.data as Crop).climateRisk, 0) / grid.filter(c => c.type === 'crop').length)}%
                      </div>
                      <div className="text-sm text-gray-600">Riesgo Climático</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {grid.filter(c => c.type === 'crop' && (c.data as Crop).growthStage === 'harvest').length}
                      </div>
                      <div className="text-sm text-gray-600">Listos para Cosecha</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Farm Grid */}
            <Card className="p-6 bg-white shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Distribución de la Granja
                </CardTitle>
                <CardDescription>
                  Haz clic en las celdas para agregar cultivos, fuentes de agua, vendedores o proveedores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-2">
                  {grid.map((cell) => (
                    <div
                      key={cell.id}
                      className="aspect-square"
                      onClick={() => handleCellClick(cell)}
                    >
                      {getCellDisplay(cell)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lateral Sidebar */}
        {showSidebar && selectedCrop && (
          <CropDetailSidebar 
            crop={selectedCrop}
            onClose={() => {
              setShowSidebar(false);
              setSelectedCrop(null);
            }}
            onEdit={() => {
              toast({
                title: "Función de edición",
                description: "La edición será implementada próximamente."
              });
            }}
            onDelete={() => {
              toast({
                title: "Función de eliminación",
                description: "La eliminación será implementada próximamente."
              });
            }}
          />
        )}
      </div>

      {/* Simple Form Dialog for adding elements */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Elemento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => {
                  const newCrop: Crop = {
                    id: `crop-${Date.now()}`,
                    name: `Cultivo ${Date.now()}`,
                    type: 'papa',
                    variety: 'Blanca',
                    plantingDate: new Date().toISOString().split('T')[0],
                    expectedHarvestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    area: 100,
                    plotLocation: 'Parcela A',
                    irrigationMethod: 'Por aspersión',
                    irrigationFrequency: 'Diario',
                    irrigationTime: '06:00',
                    irrigationTimesPerWeek: 7,
                    fertilizerType: 'Orgánico',
                    fertilizerBrand: 'CompoSur',
                    fertilizerFrequency: 'Semanal',
                    sustainableTechniques: ['Rotación de cultivos'],
                    notes: 'Cultivo de prueba',
                    sunExposure: 'Pleno sol',
                    waterSource: 'Pozo',
                    soilType: 'Franco',
                    position: { x: 0, y: 0 },
                    growthStage: 'seed',
                    health: Math.floor(Math.random() * 30) + 70,
                    climateRisk: Math.floor(Math.random() * 40) + 10,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  };
                  updateCell(selectedCell!.id, 'crop', newCrop);
                }}
              >
                <Sprout className="h-6 w-6" />
                Cultivo
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => {
                  updateCell(selectedCell!.id, 'water', {
                    name: 'Fuente de Agua',
                    waterType: 'Pozo',
                    quality: 'Buena',
                    flow: 'Alto',
                    notes: ''
                  });
                }}
              >
                <Droplets className="h-6 w-6" />
                Agua
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => {
                  updateCell(selectedCell!.id, 'vendor', {
                    name: 'Vendedor Local',
                    products: 'Herramientas',
                    contact: '123-456-789',
                    priceRange: '$50-200',
                    notes: ''
                  });
                }}
              >
                <Store className="h-6 w-6" />
                Vendedor
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => {
                  updateCell(selectedCell!.id, 'supplier', {
                    name: 'Proveedor',
                    supplies: 'Semillas',
                    contact: '123-456-789',
                    deliveryTime: '1-2 días',
                    terms: 'Contado',
                    notes: ''
                  });
                }}
              >
                <Users className="h-6 w-6" />
                Proveedor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GranjaVirtualPage;
