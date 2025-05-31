import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Droplets, Users, Store, Sprout, FileText, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Tipos para las diferentes celdas
interface BaseCell {
  id: string;
  row: number;
  col: number;
  type: 'crop' | 'water' | 'vendor' | 'supplier' | 'empty';
}

interface CropCell extends BaseCell {
  type: 'crop';
  data: {
    name: string;
    variety: string;
    plantingDate: string;
    harvestDate: string;
    area: number;
    techniques: string[];
    notes: string;
  };
}

interface WaterCell extends BaseCell {
  type: 'water';
  data: {
    source: string;
    type: 'well' | 'river' | 'reservoir' | 'irrigation';
    capacity: number;
    quality: string;
    notes: string;
  };
}

interface VendorCell extends BaseCell {
  type: 'vendor';
  data: {
    name: string;
    contact: string;
    products: string[];
    location: string;
    rating: number;
    notes: string;
  };
}

interface SupplierCell extends BaseCell {
  type: 'supplier';
  data: {
    name: string;
    contact: string;
    services: string[];
    location: string;
    pricing: string;
    notes: string;
  };
}

interface EmptyCell extends BaseCell {
  type: 'empty';
  data: null;
}

type GridCell = CropCell | WaterCell | VendorCell | SupplierCell | EmptyCell;

const GranjaVirtualPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Grid dimensions: 8 columns x 6 rows
  const GRID_COLS = 8;
  const GRID_ROWS = 6;
  
  // Initialize grid with empty cells
  const initializeGrid = (): GridCell[] => {
    const grid: GridCell[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        grid.push({
          id: `${row}-${col}`,
          row,
          col,
          type: 'empty',
          data: null
        });
      }
    }
    return grid;
  };

  const [grid, setGrid] = useState<GridCell[]>(initializeGrid());

  // Determine cell background and content based on type and position
  const getCellDisplay = (cell: GridCell) => {
    // Last 3 columns are reserved for crops
    const isCropZone = cell.col >= GRID_COLS - 3;
    
    if (cell.type === 'crop') {
      return {
        bgColor: 'bg-green-500',
        textColor: 'text-black',
        content: 'MI CULTIVO',
        icon: <Sprout className="w-4 h-4" />
      };
    }
    
    if (cell.type === 'water') {
      return {
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        content: 'AGUA',
        icon: <Droplets className="w-4 h-4" />
      };
    }
    
    if (cell.type === 'vendor') {
      return {
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        content: 'VENDEDOR',
        icon: <Store className="w-4 h-4" />
      };
    }
    
    if (cell.type === 'supplier') {
      return {
        bgColor: 'bg-purple-500',
        textColor: 'text-white',
        content: 'PROVEEDOR',
        icon: <Users className="w-4 h-4" />
      };
    }
    
    // Empty cell - show zone type
    if (isCropZone) {
      return {
        bgColor: 'bg-green-100 hover:bg-green-200 border-green-300 border-dashed border-2',
        textColor: 'text-green-700',
        content: 'ZONA CULTIVO',
        icon: <Sprout className="w-3 h-3 opacity-50" />
      };
    } else {
      return {
        bgColor: 'bg-gray-100 hover:bg-gray-200 border-gray-300 border-dashed border-2',
        textColor: 'text-gray-600',
        content: 'DISPONIBLE',
        icon: null
      };
    }
  };

  const handleCellClick = (cell: GridCell) => {
    setSelectedCell(cell);
    setIsDialogOpen(true);
  };

  const updateCell = (cellId: string, newType: GridCell['type'], newData: any) => {
    setGrid(prevGrid => 
      prevGrid.map(cell => 
        cell.id === cellId 
          ? { ...cell, type: newType, data: newData }
          : cell
      )
    );
    setIsDialogOpen(false);
    toast({
      title: "Celda actualizada",
      description: "La información se ha guardado correctamente.",
    });
  };

  const getCellTypeOptions = (cell: GridCell) => {
    const isCropZone = cell.col >= GRID_COLS - 3;
    
    if (isCropZone) {
      return [
        { value: 'crop', label: 'Cultivo' },
        { value: 'empty', label: 'Vacío' }
      ];
    } else {
      return [
        { value: 'water', label: 'Fuente de Agua' },
        { value: 'vendor', label: 'Vendedor' },
        { value: 'supplier', label: 'Proveedor' },
        { value: 'empty', label: 'Vacío' }
      ];
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-800">🌱 Mi Granja Virtual</h1>
        <p className="text-gray-600">
          Gestiona tu cadena de suministro agrícola de manera visual e interactiva
        </p>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leyenda del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Cultivos (últimas 3 columnas)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Fuentes de Agua</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Vendedores</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm">Proveedores</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Display */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de la Granja</CardTitle>
          <CardDescription>
            Haga clic en cualquier celda para agregar o editar información
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="grid gap-2 mx-auto max-w-4xl"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`
            }}
          >
            {grid.map((cell) => {
              const display = getCellDisplay(cell);
              return (
                <div
                  key={cell.id}
                  className={`
                    aspect-square min-h-[80px] cursor-pointer transition-all duration-200
                    flex flex-col items-center justify-center text-center p-2 rounded-md
                    ${display.bgColor} ${display.textColor}
                  `}
                  onClick={() => handleCellClick(cell)}
                >
                  {display.icon}
                  <span className="text-xs font-semibold mt-1 leading-tight">
                    {display.content}
                  </span>
                  {cell.type !== 'empty' && cell.data && (
                    <span className="text-xs opacity-80 truncate w-full">
                      {(cell.data as any).name || (cell.data as any).source || 'Configurado'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cell Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Configurar Celda ({selectedCell?.row + 1}, {selectedCell?.col + 1})
            </DialogTitle>
          </DialogHeader>
          
          {selectedCell && (
            <CellEditForm 
              cell={selectedCell} 
              onSave={updateCell}
              cellTypeOptions={getCellTypeOptions(selectedCell)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component for editing cell data
interface CellEditFormProps {
  cell: GridCell;
  onSave: (cellId: string, type: GridCell['type'], data: any) => void;
  cellTypeOptions: { value: string; label: string }[];
}

const CellEditForm: React.FC<CellEditFormProps> = ({ cell, onSave, cellTypeOptions }) => {
  const [cellType, setCellType] = useState<string>(cell.type);
  const [formData, setFormData] = useState<any>(cell.data || {});

  const handleSave = () => {
    if (cellType === 'empty') {
      onSave(cell.id, 'empty', null);
    } else {
      onSave(cell.id, cellType as GridCell['type'], formData);
    }
  };

  const renderFormFields = () => {
    switch (cellType) {
      case 'crop':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="crop-name">Nombre del Cultivo</Label>
              <Input
                id="crop-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Papa Nativa"
              />
            </div>
            <div>
              <Label htmlFor="crop-variety">Variedad</Label>
              <Input
                id="crop-variety"
                value={formData.variety || ''}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                placeholder="Ej: Papa Huayro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planting-date">Fecha de Siembra</Label>
                <Input
                  id="planting-date"
                  type="date"
                  value={formData.plantingDate || ''}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="harvest-date">Fecha de Cosecha</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={formData.harvestDate || ''}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="area">Área (hectáreas)</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                value={formData.area || ''}
                onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
                placeholder="0.5"
              />
            </div>
            <div>
              <Label htmlFor="techniques">Técnicas de Cultivo</Label>
              <Textarea
                id="techniques"
                value={formData.techniques?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, techniques: e.target.value.split(', ').filter(t => t.trim()) })}
                placeholder="Riego por goteo, Abono orgánico, Control biológico"
              />
            </div>
            <div>
              <Label htmlFor="crop-notes">Notas Adicionales</Label>
              <Textarea
                id="crop-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observaciones sobre el cultivo..."
              />
            </div>
          </div>
        );

      case 'water':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="water-source">Nombre de la Fuente</Label>
              <Input
                id="water-source"
                value={formData.source || ''}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="Ej: Pozo Central"
              />
            </div>
            <div>
              <Label htmlFor="water-type">Tipo de Fuente</Label>
              <Select value={formData.type || ''} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="well">Pozo</SelectItem>
                  <SelectItem value="river">Río</SelectItem>
                  <SelectItem value="reservoir">Reservorio</SelectItem>
                  <SelectItem value="irrigation">Sistema de Riego</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacidad (litros/hora)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="quality">Calidad del Agua</Label>
              <Select value={formData.quality || ''} onValueChange={(value) => setFormData({ ...formData, quality: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar calidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excelente</SelectItem>
                  <SelectItem value="good">Buena</SelectItem>
                  <SelectItem value="fair">Regular</SelectItem>
                  <SelectItem value="poor">Deficiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="water-notes">Notas</Label>
              <Textarea
                id="water-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional sobre la fuente de agua..."
              />
            </div>
          </div>
        );

      case 'vendor':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vendor-name">Nombre del Vendedor</Label>
              <Input
                id="vendor-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <Label htmlFor="vendor-contact">Contacto</Label>
              <Input
                id="vendor-contact"
                value={formData.contact || ''}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Teléfono, email, etc."
              />
            </div>
            <div>
              <Label htmlFor="vendor-products">Productos que Compra</Label>
              <Textarea
                id="vendor-products"
                value={formData.products?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, products: e.target.value.split(', ').filter(p => p.trim()) })}
                placeholder="Papa, Maíz, Quinua"
              />
            </div>
            <div>
              <Label htmlFor="vendor-location">Ubicación</Label>
              <Input
                id="vendor-location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ciudad, mercado, etc."
              />
            </div>
            <div>
              <Label htmlFor="vendor-rating">Calificación (1-5)</Label>
              <Input
                id="vendor-rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="vendor-notes">Notas</Label>
              <Textarea
                id="vendor-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional sobre el vendedor..."
              />
            </div>
          </div>
        );

      case 'supplier':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier-name">Nombre del Proveedor</Label>
              <Input
                id="supplier-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Agroquímicos del Valle"
              />
            </div>
            <div>
              <Label htmlFor="supplier-contact">Contacto</Label>
              <Input
                id="supplier-contact"
                value={formData.contact || ''}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Teléfono, email, etc."
              />
            </div>
            <div>
              <Label htmlFor="supplier-services">Servicios/Productos</Label>
              <Textarea
                id="supplier-services"
                value={formData.services?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, services: e.target.value.split(', ').filter(s => s.trim()) })}
                placeholder="Semillas, Fertilizantes, Pesticidas, Maquinaria"
              />
            </div>
            <div>
              <Label htmlFor="supplier-location">Ubicación</Label>
              <Input
                id="supplier-location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Dirección del proveedor"
              />
            </div>
            <div>
              <Label htmlFor="supplier-pricing">Información de Precios</Label>
              <Textarea
                id="supplier-pricing"
                value={formData.pricing || ''}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                placeholder="Precios por producto, descuentos, etc."
              />
            </div>
            <div>
              <Label htmlFor="supplier-notes">Notas</Label>
              <Textarea
                id="supplier-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional sobre el proveedor..."
              />
            </div>
          </div>
        );

      default:
        return (
          <p className="text-gray-500">Seleccione un tipo de celda para configurar.</p>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="cell-type">Tipo de Celda</Label>
        <Select value={cellType} onValueChange={setCellType}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            {cellTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {cellType !== 'empty' && renderFormFields()}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => {}}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default GranjaVirtualPage;
