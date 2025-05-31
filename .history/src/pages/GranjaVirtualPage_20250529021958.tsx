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
  Clock, Target, Zap, Leaf, WaterDrop, Gauge
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Advanced crop types and interfaces from MascotaAndina
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

interface NewCropForm {
  name: string;
  type: 'papa' | 'quinua' | 'maiz' | 'habas' | 'oca' | 'ulluco';
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  area: number;
  plotLocation: string;
  plotLocationOther: string;
  irrigationMethod: string;
  irrigationOther: string;
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
}

interface FormErrors {
  [key: string]: string;
}

// Crop type definitions with emojis and colors
const cropTypes = {
  papa: { emoji: '🥔', color: '#8B4513', name: 'Papa' },
  quinua: { emoji: '🌾', color: '#DAA520', name: 'Quinua' },
  maiz: { emoji: '🌽', color: '#FFD700', name: 'Maíz' },
  habas: { emoji: '🫘', color: '#228B22', name: 'Habas' },
  oca: { emoji: '🍠', color: '#FF6347', name: 'Oca' },
  ulluco: { emoji: '🥕', color: '#FF4500', name: 'Ulluco' }
};

// Tipos para las diferentes celdas
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
    source: string;
    type: 'well' | 'river' | 'reservoir' | 'irrigation';
    capacity: number;
    quality: string;
    flowRate: number;
    depth?: number;
    treatment: string[];
    maintenanceSchedule: string;
    notes: string;
  };
}

interface VendorCell extends BaseCell {
  type: 'vendor';
  data: {
    name: string;
    contact: string;
    email: string;
    products: string[];
    location: string;
    rating: number;
    priceRange: string;
    paymentTerms: string;
    deliveryOptions: string[];
    certifications: string[];
    notes: string;
  };
}

interface SupplierCell extends BaseCell {
  type: 'supplier';
  data: {
    name: string;
    contact: string;
    email: string;
    services: string[];
    location: string;
    pricing: string;
    availability: string;
    qualityCertifications: string[];
    deliveryTime: string;
    minimumOrder: string;
    discounts: string;
    notes: string;
  };
}

interface EmptyCell extends BaseCell {
  type: 'empty';
  data: null;
}

interface EmptyCell extends BaseCell {
  type: 'empty';
  data: null;
}

type GridCell = CropCell | WaterCell | VendorCell | SupplierCell | EmptyCell;

// AI Climate Risk Evaluation System
const evaluateClimateRisk = (crop: NewCropForm): number => {
  let riskScore = 0;
  const today = new Date();
  const plantingDate = new Date(crop.plantingDate);
  const harvestDate = new Date(crop.expectedHarvestDate);
  
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
  
  const cropFactor = cropRiskFactors[crop.type];
  riskScore += cropFactor.baseRisk;
  
  // Water source risk
  const waterRiskFactors = {
    'Lluvia': 25,
    'Pozo': 10,
    'Rio': 15,
    'Reservorio': 5,
    'Sistema de riego': 3
  };
  riskScore += waterRiskFactors[crop.waterSource] || 20;
  
  // Irrigation method risk
  const irrigationRiskFactors = {
    'Riego por goteo': -10,
    'Riego por aspersion': -5,
    'Riego por inundacion': 10,
    'Riego manual': 15,
    'Solo lluvia': 25
  };
  riskScore += irrigationRiskFactors[crop.irrigationMethod] || 0;
  
  // Soil type risk
  const soilRiskFactors = {
    'Arcilloso': 5,
    'Arenoso': 15,
    'Franco': -5,
    'Humifero': -10,
    'Pedregoso': 20
  };
  riskScore += soilRiskFactors[crop.soilType] || 0;
  
  // Sun exposure risk
  const sunRiskFactors = {
    'Pleno sol': 5,
    'Media sombra': -5,
    'Sombra': 10
  };
  riskScore += sunRiskFactors[crop.sunExposure] || 0;
  
  // Fertilizer impact
  if (crop.fertilizerType === 'Organico') {
    riskScore -= 5;
  } else if (crop.fertilizerType === 'Quimico') {
    riskScore += 3;
  }
  
  // Sustainable techniques bonus
  riskScore -= crop.sustainableTechniques.length * 2;
  
  // Time-based risk (planting too early/late in season)
  const monthlyRisk = [15, 10, 5, 3, 8, 12, 15, 18, 12, 5, 3, 10];
  riskScore += monthlyRisk[plantingMonth];
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, riskScore));
};

// Form validation functions
const validateCropForm = (form: NewCropForm, currentStep: number): FormErrors => {
  const errors: FormErrors = {};
  
  if (currentStep >= 1) {
    if (!form.name.trim()) errors.name = 'El nombre del cultivo es requerido';
    if (!form.type) errors.type = 'El tipo de cultivo es requerido';
    if (!form.variety.trim()) errors.variety = 'La variedad es requerida';
    if (!form.plantingDate) errors.plantingDate = 'La fecha de siembra es requerida';
    if (!form.expectedHarvestDate) errors.expectedHarvestDate = 'La fecha de cosecha es requerida';
    if (!form.area || form.area <= 0) errors.area = 'El área debe ser mayor a 0';
    
    // Validate date logic
    if (form.plantingDate && form.expectedHarvestDate) {
      const plantingDate = new Date(form.plantingDate);
      const harvestDate = new Date(form.expectedHarvestDate);
      if (harvestDate <= plantingDate) {
        errors.expectedHarvestDate = 'La fecha de cosecha debe ser posterior a la siembra';
      }
    }
  }
  
  if (currentStep >= 2) {
    if (!form.irrigationMethod) errors.irrigationMethod = 'El método de riego es requerido';
    if (form.irrigationMethod === 'Otro' && !form.irrigationOther.trim()) {
      errors.irrigationOther = 'Especifique el método de riego';
    }
    if (!form.irrigationFrequency) errors.irrigationFrequency = 'La frecuencia de riego es requerida';
    if (!form.irrigationTime) errors.irrigationTime = 'El tiempo de riego es requerido';
    if (!form.irrigationTimesPerWeek || form.irrigationTimesPerWeek < 1) {
      errors.irrigationTimesPerWeek = 'Debe regar al menos una vez por semana';
    }
  }
  
  if (currentStep >= 3) {
    if (!form.fertilizerType) errors.fertilizerType = 'El tipo de fertilizante es requerido';
    if (!form.fertilizerBrand.trim()) errors.fertilizerBrand = 'La marca o tipo específico es requerido';
    if (!form.fertilizerFrequency) errors.fertilizerFrequency = 'La frecuencia de fertilización es requerida';
  }
  
  if (currentStep >= 4) {
    if (!form.plotLocation) errors.plotLocation = 'La ubicación de la parcela es requerida';
    if (form.plotLocation === 'Otro' && !form.plotLocationOther.trim()) {
      errors.plotLocationOther = 'Especifique la ubicación de la parcela';
    }
    if (!form.sunExposure) errors.sunExposure = 'La exposición al sol es requerida';
    if (!form.waterSource) errors.waterSource = 'La fuente de agua es requerida';
    if (!form.soilType) errors.soilType = 'El tipo de suelo es requerido';
  }
  
  return errors;
};

const validateCurrentStep = (form: NewCropForm, step: number): boolean => {
  const errors = validateCropForm(form, step);
  return Object.keys(errors).length === 0;
};

// Multi-step crop form component
interface CropMultiStepFormProps {
  form: NewCropForm;
  setForm: React.Dispatch<React.SetStateAction<NewCropForm>>;
  currentStep: number;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
  onSave: () => void;
}

const CropMultiStepForm: React.FC<CropMultiStepFormProps> = ({
  form,
  setForm,
  currentStep,
  errors,
  onNext,
  onPrev,
  onSave
}) => {
  const updateForm = (field: keyof NewCropForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleTechnique = (technique: string) => {
    setForm(prev => ({
      ...prev,
      sustainableTechniques: prev.sustainableTechniques.includes(technique)
        ? prev.sustainableTechniques.filter(t => t !== technique)
        : [...prev.sustainableTechniques, technique]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Paso 1: Información Básica del Cultivo
            </h3>
            
            <div>
              <Label htmlFor="crop-name">Nombre del Cultivo *</Label>
              <Input
                id="crop-name"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Ej: Papa Nativa del Valle"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="crop-type">Tipo de Cultivo *</Label>
              <Select value={form.type} onValueChange={(value: any) => updateForm('type', value)}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(cropTypes).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{info.emoji}</span>
                        <span>{info.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
            </div>

            <div>
              <Label htmlFor="variety">Variedad *</Label>
              <Input
                id="variety"
                value={form.variety}
                onChange={(e) => updateForm('variety', e.target.value)}
                placeholder="Ej: Papa Huayro, Quinua Blanca"
                className={errors.variety ? 'border-red-500' : ''}
              />
              {errors.variety && <p className="text-sm text-red-500 mt-1">{errors.variety}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planting-date">Fecha de Siembra *</Label>
                <Input
                  id="planting-date"
                  type="date"
                  value={form.plantingDate}
                  onChange={(e) => updateForm('plantingDate', e.target.value)}
                  className={errors.plantingDate ? 'border-red-500' : ''}
                />
                {errors.plantingDate && <p className="text-sm text-red-500 mt-1">{errors.plantingDate}</p>}
              </div>
              <div>
                <Label htmlFor="harvest-date">Fecha Esperada de Cosecha *</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={form.expectedHarvestDate}
                  onChange={(e) => updateForm('expectedHarvestDate', e.target.value)}
                  className={errors.expectedHarvestDate ? 'border-red-500' : ''}
                />
                {errors.expectedHarvestDate && <p className="text-sm text-red-500 mt-1">{errors.expectedHarvestDate}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="area">Área de Cultivo (hectáreas) *</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                min="0"
                value={form.area || ''}
                onChange={(e) => updateForm('area', parseFloat(e.target.value) || 0)}
                placeholder="0.25"
                className={errors.area ? 'border-red-500' : ''}
              />
              {errors.area && <p className="text-sm text-red-500 mt-1">{errors.area}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Paso 2: Sistema de Riego
            </h3>

            <div>
              <Label htmlFor="irrigation-method">Método de Riego *</Label>
              <Select value={form.irrigationMethod} onValueChange={(value) => updateForm('irrigationMethod', value)}>
                <SelectTrigger className={errors.irrigationMethod ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Riego por goteo">Riego por goteo</SelectItem>
                  <SelectItem value="Riego por aspersion">Riego por aspersión</SelectItem>
                  <SelectItem value="Riego por inundacion">Riego por inundación</SelectItem>
                  <SelectItem value="Riego manual">Riego manual</SelectItem>
                  <SelectItem value="Solo lluvia">Solo lluvia</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              {errors.irrigationMethod && <p className="text-sm text-red-500 mt-1">{errors.irrigationMethod}</p>}
            </div>

            {form.irrigationMethod === 'Otro' && (
              <div>
                <Label htmlFor="irrigation-other">Especificar método de riego *</Label>
                <Input
                  id="irrigation-other"
                  value={form.irrigationOther}
                  onChange={(e) => updateForm('irrigationOther', e.target.value)}
                  placeholder="Describe el método de riego"
                  className={errors.irrigationOther ? 'border-red-500' : ''}
                />
                {errors.irrigationOther && <p className="text-sm text-red-500 mt-1">{errors.irrigationOther}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="irrigation-frequency">Frecuencia de Riego *</Label>
              <Select value={form.irrigationFrequency} onValueChange={(value) => updateForm('irrigationFrequency', value)}>
                <SelectTrigger className={errors.irrigationFrequency ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diario">Diario</SelectItem>
                  <SelectItem value="Cada 2 dias">Cada 2 días</SelectItem>
                  <SelectItem value="Cada 3 dias">Cada 3 días</SelectItem>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Quincenal">Quincenal</SelectItem>
                  <SelectItem value="Segun necesidad">Según necesidad</SelectItem>
                </SelectContent>
              </Select>
              {errors.irrigationFrequency && <p className="text-sm text-red-500 mt-1">{errors.irrigationFrequency}</p>}
            </div>

            <div>
              <Label htmlFor="irrigation-time">Tiempo de Riego por Sesión *</Label>
              <Select value={form.irrigationTime} onValueChange={(value) => updateForm('irrigationTime', value)}>
                <SelectTrigger className={errors.irrigationTime ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 minutos">15 minutos</SelectItem>
                  <SelectItem value="30 minutos">30 minutos</SelectItem>
                  <SelectItem value="1 hora">1 hora</SelectItem>
                  <SelectItem value="2 horas">2 horas</SelectItem>
                  <SelectItem value="Medio dia">Medio día</SelectItem>
                  <SelectItem value="Todo el dia">Todo el día</SelectItem>
                </SelectContent>
              </Select>
              {errors.irrigationTime && <p className="text-sm text-red-500 mt-1">{errors.irrigationTime}</p>}
            </div>

            <div>
              <Label htmlFor="irrigation-times-week">Veces por Semana *</Label>
              <Input
                id="irrigation-times-week"
                type="number"
                min="1"
                max="7"
                value={form.irrigationTimesPerWeek}
                onChange={(e) => updateForm('irrigationTimesPerWeek', parseInt(e.target.value) || 1)}
                className={errors.irrigationTimesPerWeek ? 'border-red-500' : ''}
              />
              {errors.irrigationTimesPerWeek && <p className="text-sm text-red-500 mt-1">{errors.irrigationTimesPerWeek}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Paso 3: Fertilización y Técnicas
            </h3>

            <div>
              <Label htmlFor="fertilizer-type">Tipo de Fertilizante *</Label>
              <Select value={form.fertilizerType} onValueChange={(value) => updateForm('fertilizerType', value)}>
                <SelectTrigger className={errors.fertilizerType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Organico">Orgánico</SelectItem>
                  <SelectItem value="Quimico">Químico</SelectItem>
                  <SelectItem value="Mixto">Mixto (orgánico + químico)</SelectItem>
                  <SelectItem value="Ninguno">Ninguno</SelectItem>
                </SelectContent>
              </Select>
              {errors.fertilizerType && <p className="text-sm text-red-500 mt-1">{errors.fertilizerType}</p>}
            </div>

            <div>
              <Label htmlFor="fertilizer-brand">Marca o Tipo Específico *</Label>
              <Input
                id="fertilizer-brand"
                value={form.fertilizerBrand}
                onChange={(e) => updateForm('fertilizerBrand', e.target.value)}
                placeholder="Ej: Compost casero, Urea, NPK 15-15-15"
                className={errors.fertilizerBrand ? 'border-red-500' : ''}
              />
              {errors.fertilizerBrand && <p className="text-sm text-red-500 mt-1">{errors.fertilizerBrand}</p>}
            </div>

            <div>
              <Label htmlFor="fertilizer-frequency">Frecuencia de Fertilización *</Label>
              <Select value={form.fertilizerFrequency} onValueChange={(value) => updateForm('fertilizerFrequency', value)}>
                <SelectTrigger className={errors.fertilizerFrequency ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solo al plantar">Solo al plantar</SelectItem>
                  <SelectItem value="Mensual">Mensual</SelectItem>
                  <SelectItem value="Bimensual">Cada 2 meses</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                  <SelectItem value="Segun necesidad">Según necesidad</SelectItem>
                </SelectContent>
              </Select>
              {errors.fertilizerFrequency && <p className="text-sm text-red-500 mt-1">{errors.fertilizerFrequency}</p>}
            </div>

            <div>
              <Label>Técnicas Sostenibles (opcional)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'Rotación de cultivos',
                  'Compostaje',
                  'Control biológico',
                  'Cultivos de cobertura',
                  'Asociación de cultivos',
                  'Mulching',
                  'Captación de lluvia',
                  'Semillas nativas'
                ].map((technique) => (
                  <div key={technique} className="flex items-center space-x-2">
                    <Checkbox
                      id={technique}
                      checked={form.sustainableTechniques.includes(technique)}
                      onCheckedChange={() => toggleTechnique(technique)}
                    />
                    <Label htmlFor={technique} className="text-sm">{technique}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Paso 4: Ubicación y Condiciones
            </h3>

            <div>
              <Label htmlFor="plot-location">Ubicación de la Parcela *</Label>
              <Select value={form.plotLocation} onValueChange={(value) => updateForm('plotLocation', value)}>
                <SelectTrigger className={errors.plotLocation ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Terraza superior">Terraza superior</SelectItem>
                  <SelectItem value="Terraza media">Terraza media</SelectItem>
                  <SelectItem value="Terraza inferior">Terraza inferior</SelectItem>
                  <SelectItem value="Ladera">Ladera</SelectItem>
                  <SelectItem value="Planicie">Planicie</SelectItem>
                  <SelectItem value="Cerca del rio">Cerca del río</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              {errors.plotLocation && <p className="text-sm text-red-500 mt-1">{errors.plotLocation}</p>}
            </div>

            {form.plotLocation === 'Otro' && (
              <div>
                <Label htmlFor="plot-location-other">Especificar ubicación *</Label>
                <Input
                  id="plot-location-other"
                  value={form.plotLocationOther}
                  onChange={(e) => updateForm('plotLocationOther', e.target.value)}
                  placeholder="Describe la ubicación de la parcela"
                  className={errors.plotLocationOther ? 'border-red-500' : ''}
                />
                {errors.plotLocationOther && <p className="text-sm text-red-500 mt-1">{errors.plotLocationOther}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="sun-exposure">Exposición al Sol *</Label>
              <Select value={form.sunExposure} onValueChange={(value) => updateForm('sunExposure', value)}>
                <SelectTrigger className={errors.sunExposure ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar exposición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pleno sol">Pleno sol (8+ horas)</SelectItem>
                  <SelectItem value="Media sombra">Media sombra (4-6 horas)</SelectItem>
                  <SelectItem value="Sombra">Sombra (menos de 4 horas)</SelectItem>
                </SelectContent>
              </Select>
              {errors.sunExposure && <p className="text-sm text-red-500 mt-1">{errors.sunExposure}</p>}
            </div>

            <div>
              <Label htmlFor="water-source">Fuente de Agua *</Label>
              <Select value={form.waterSource} onValueChange={(value) => updateForm('waterSource', value)}>
                <SelectTrigger className={errors.waterSource ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lluvia">Lluvia</SelectItem>
                  <SelectItem value="Pozo">Pozo</SelectItem>
                  <SelectItem value="Rio">Río</SelectItem>
                  <SelectItem value="Reservorio">Reservorio</SelectItem>
                  <SelectItem value="Sistema de riego">Sistema de riego</SelectItem>
                </SelectContent>
              </Select>
              {errors.waterSource && <p className="text-sm text-red-500 mt-1">{errors.waterSource}</p>}
            </div>

            <div>
              <Label htmlFor="soil-type">Tipo de Suelo *</Label>
              <Select value={form.soilType} onValueChange={(value) => updateForm('soilType', value)}>
                <SelectTrigger className={errors.soilType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arcilloso">Arcilloso</SelectItem>
                  <SelectItem value="Arenoso">Arenoso</SelectItem>
                  <SelectItem value="Franco">Franco</SelectItem>
                  <SelectItem value="Humifero">Humífero</SelectItem>
                  <SelectItem value="Pedregoso">Pedregoso</SelectItem>
                </SelectContent>
              </Select>
              {errors.soilType && <p className="text-sm text-red-500 mt-1">{errors.soilType}</p>}
            </div>

            <div>
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateForm('notes', e.target.value)}
                placeholder="Observaciones, condiciones especiales, etc."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Paso {currentStep} de 4</span>
          <span>{((currentStep - 1) / 3) * 100}% completado</span>
        </div>
        <Progress value={((currentStep - 1) / 3) * 100} className="w-full" />
      </div>

      {/* Step content */}
      {renderStepContent()}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={onPrev}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
        
        {currentStep < 4 ? (
          <Button 
            onClick={onNext}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={onSave}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            Guardar Cultivo
          </Button>
        )}
      </div>
    </div>
  );
};

const GranjaVirtualPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Multi-step form state for crops
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [selectedGridPosition, setSelectedGridPosition] = useState<{ row: number; col: number } | null>(null);
  
  // Form state
  const [newCropForm, setNewCropForm] = useState<NewCropForm>({
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
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
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
    
    if (cell.type === 'crop' && cell.data) {
      const cropData = cell.data as Crop;
      const cropInfo = cropTypes[cropData.type];
      return {
        bgColor: 'bg-green-500',
        textColor: 'text-black',
        content: 'MI CULTIVO',
        icon: <span className="text-lg">{cropInfo.emoji}</span>,
        subtitle: cropData.name,
        health: cropData.health,
        risk: cropData.climateRisk
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
    setSelectedGridPosition({ row: cell.row, col: cell.col });
    
    // Reset form state when opening a new cell
    if (cell.type === 'empty' && cell.col >= GRID_COLS - 3) {
      // Crop zone - prepare for multi-step form
      setCurrentFormStep(1);
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
      setFormErrors({});
    }
    
    setIsDialogOpen(true);
  };

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
    
    // Show climate risk assessment
    const riskLevel = climateRisk < 30 ? 'bajo' : climateRisk < 60 ? 'medio' : 'alto';
    const riskColor = climateRisk < 30 ? 'text-green-600' : climateRisk < 60 ? 'text-yellow-600' : 'text-red-600';
    
    toast({
      title: "Cultivo agregado exitosamente",
      description: `Riesgo climático evaluado: ${riskLevel} (${climateRisk}%)`,
    });
  };

  const nextFormStep = () => {
    const isValid = validateCurrentStep(newCropForm, currentFormStep);
    if (!isValid) {
      const errors = validateCropForm(newCropForm, currentFormStep);
      setFormErrors(errors);
      toast({
        title: "Complete los campos requeridos",
        description: "Debe llenar todos los campos obligatorios antes de continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setFormErrors({});
    setCurrentFormStep(prev => Math.min(4, prev + 1));
  };

  const prevFormStep = () => {
    setCurrentFormStep(prev => Math.max(1, prev - 1));
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
    setCurrentFormStep(1);
    toast({
      title: "Celda actualizada",
      description: "La información se ha guardado correctamente.",
    });
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-600';
    if (risk < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskIcon = (risk: number) => {
    if (risk < 30) return <CheckCircle className="w-3 h-3" />;
    if (risk < 60) return <AlertTriangle className="w-3 h-3" />;
    return <AlertTriangle className="w-3 h-3" />;
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
        <CardContent>          <div 
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
                    flex flex-col items-center justify-center text-center p-2 rounded-md relative
                    ${display.bgColor} ${display.textColor}
                  `}
                  onClick={() => handleCellClick(cell)}
                >
                  {display.icon}
                  <span className="text-xs font-semibold mt-1 leading-tight">
                    {display.content}
                  </span>
                  
                  {/* Crop-specific information */}
                  {cell.type === 'crop' && cell.data && (
                    <>
                      <span className="text-xs opacity-90 truncate w-full">
                        {(cell.data as Crop).name}
                      </span>
                      
                      {/* Health and Risk indicators */}
                      <div className="absolute top-1 right-1 flex flex-col gap-1">
                        {/* Health indicator */}
                        <div className="flex items-center gap-1 bg-white/20 rounded-full px-1">
                          <div className={`w-2 h-2 rounded-full ${
                            (cell.data as Crop).health > 80 ? 'bg-green-400' :
                            (cell.data as Crop).health > 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-xs font-bold">
                            {(cell.data as Crop).health}%
                          </span>
                        </div>
                        
                        {/* Risk indicator */}
                        <div className={`flex items-center gap-1 bg-white/20 rounded-full px-1 ${
                          getRiskColor((cell.data as Crop).climateRisk)
                        }`}>
                          {getRiskIcon((cell.data as Crop).climateRisk)}
                          <span className="text-xs font-bold">
                            {(cell.data as Crop).climateRisk}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Other cell types */}
                  {cell.type !== 'empty' && cell.type !== 'crop' && cell.data && (
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
            <>
              {selectedCell.type === 'empty' && selectedCell.col >= GRID_COLS - 3 ? (
                <CropMultiStepForm
                  form={newCropForm}
                  setForm={setNewCropForm}
                  currentStep={currentFormStep}
                  errors={formErrors}
                  onNext={nextFormStep}
                  onPrev={prevFormStep}
                  onSave={handleCropSave}
                />
              ) : (
                <CellEditForm 
                  cell={selectedCell} 
                  onSave={updateCell}
                  cellTypeOptions={getCellTypeOptions(selectedCell)}
                />
              )}
            </>
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
        );      case 'water':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="water-source">Nombre de la Fuente *</Label>
              <Input
                id="water-source"
                value={formData.source || ''}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="Ej: Pozo Central, Río Andino"
              />
            </div>
            <div>
              <Label htmlFor="water-type">Tipo de Fuente *</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacidad (L/h)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="1000"
                />
              </div>
              <div>
                <Label htmlFor="flow-rate">Caudal (L/min)</Label>
                <Input
                  id="flow-rate"
                  type="number"
                  value={formData.flowRate || ''}
                  onChange={(e) => setFormData({ ...formData, flowRate: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                />
              </div>
            </div>
            {formData.type === 'well' && (
              <div>
                <Label htmlFor="depth">Profundidad (metros)</Label>
                <Input
                  id="depth"
                  type="number"
                  value={formData.depth || ''}
                  onChange={(e) => setFormData({ ...formData, depth: parseInt(e.target.value) || 0 })}
                  placeholder="15"
                />
              </div>
            )}
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
              <Label htmlFor="treatment">Tratamientos Aplicados</Label>
              <Textarea
                id="treatment"
                value={formData.treatment?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value.split(', ').filter(t => t.trim()) })}
                placeholder="Filtración, Cloración, Sedimentación"
              />
            </div>
            <div>
              <Label htmlFor="maintenance">Cronograma de Mantenimiento</Label>
              <Input
                id="maintenance"
                value={formData.maintenanceSchedule || ''}
                onChange={(e) => setFormData({ ...formData, maintenanceSchedule: e.target.value })}
                placeholder="Mensual, Trimestral, etc."
              />
            </div>
            <div>
              <Label htmlFor="water-notes">Notas Adicionales</Label>
              <Textarea
                id="water-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional sobre la fuente de agua..."
              />
            </div>
          </div>
        );      case 'vendor':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vendor-name">Nombre del Vendedor *</Label>
              <Input
                id="vendor-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Juan Pérez, Mercado Central"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor-contact">Teléfono</Label>
                <Input
                  id="vendor-contact"
                  value={formData.contact || ''}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+51 999 123 456"
                />
              </div>
              <div>
                <Label htmlFor="vendor-email">Email</Label>
                <Input
                  id="vendor-email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vendedor@email.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="vendor-products">Productos que Compra</Label>
              <Textarea
                id="vendor-products"
                value={formData.products?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, products: e.target.value.split(', ').filter(p => p.trim()) })}
                placeholder="Papa, Maíz, Quinua, Habas"
              />
            </div>
            <div>
              <Label htmlFor="vendor-location">Ubicación del Negocio</Label>
              <Input
                id="vendor-location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Mercado San Pedro, Cusco"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor-rating">Calificación (1-5)</Label>
                <Input
                  id="vendor-rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating || ''}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 1 })}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="price-range">Rango de Precios</Label>
                <Select value={formData.priceRange || ''} onValueChange={(value) => setFormData({ ...formData, priceRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rango" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bajo">Bajo (S/. 1-2 por kg)</SelectItem>
                    <SelectItem value="Medio">Medio (S/. 2-4 por kg)</SelectItem>
                    <SelectItem value="Alto">Alto (S/. 4+ por kg)</SelectItem>
                    <SelectItem value="Variable">Variable según producto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="payment-terms">Términos de Pago</Label>
              <Input
                id="payment-terms"
                value={formData.paymentTerms || ''}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                placeholder="Contado, 15 días, 30 días"
              />
            </div>
            <div>
              <Label htmlFor="delivery-options">Opciones de Entrega</Label>
              <Textarea
                id="delivery-options"
                value={formData.deliveryOptions?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, deliveryOptions: e.target.value.split(', ').filter(d => d.trim()) })}
                placeholder="Recojo en chacra, Transporte incluido, Punto de acopio"
              />
            </div>
            <div>
              <Label htmlFor="certifications">Certificaciones Requeridas</Label>
              <Textarea
                id="certifications"
                value={formData.certifications?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value.split(', ').filter(c => c.trim()) })}
                placeholder="Orgánico, GlobalGAP, Comercio Justo"
              />
            </div>
            <div>
              <Label htmlFor="vendor-notes">Notas Adicionales</Label>
              <Textarea
                id="vendor-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional sobre el vendedor, condiciones especiales..."
              />
            </div>
          </div>
        );      case 'supplier':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier-name">Nombre del Proveedor *</Label>
              <Input
                id="supplier-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Agroquímicos del Valle S.A.C."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier-contact">Teléfono</Label>
                <Input
                  id="supplier-contact"
                  value={formData.contact || ''}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+51 999 654 321"
                />
              </div>
              <div>
                <Label htmlFor="supplier-email">Email</Label>
                <Input
                  id="supplier-email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ventas@proveedor.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="supplier-services">Servicios/Productos que Ofrece</Label>
              <Textarea
                id="supplier-services"
                value={formData.services?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, services: e.target.value.split(', ').filter(s => s.trim()) })}
                placeholder="Semillas certificadas, Fertilizantes, Pesticidas, Maquinaria agrícola, Asesoría técnica"
              />
            </div>
            <div>
              <Label htmlFor="supplier-location">Ubicación/Dirección</Label>
              <Input
                id="supplier-location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Av. La Cultura 123, Cusco"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availability">Disponibilidad</Label>
                <Select value={formData.availability || ''} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar disponibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanente">Permanente</SelectItem>
                    <SelectItem value="Estacional">Estacional</SelectItem>
                    <SelectItem value="Bajo pedido">Bajo pedido</SelectItem>
                    <SelectItem value="Limitada">Limitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="delivery-time">Tiempo de Entrega</Label>
                <Input
                  id="delivery-time"
                  value={formData.deliveryTime || ''}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  placeholder="2-3 días, 1 semana"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="minimum-order">Pedido Mínimo</Label>
              <Input
                id="minimum-order"
                value={formData.minimumOrder || ''}
                onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                placeholder="S/. 100, 50 kg, Sin mínimo"
              />
            </div>
            <div>
              <Label htmlFor="quality-certifications">Certificaciones de Calidad</Label>
              <Textarea
                id="quality-certifications"
                value={formData.qualityCertifications?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, qualityCertifications: e.target.value.split(', ').filter(c => c.trim()) })}
                placeholder="ISO 9001, SENASA, Certificación orgánica"
              />
            </div>
            <div>
              <Label htmlFor="discounts">Descuentos y Promociones</Label>
              <Textarea
                id="discounts"
                value={formData.discounts || ''}
                onChange={(e) => setFormData({ ...formData, discounts: e.target.value })}
                placeholder="10% por compras mayores a S/. 500, Descuento por pronto pago"
              />
            </div>
            <div>
              <Label htmlFor="supplier-pricing">Información de Precios</Label>
              <Textarea
                id="supplier-pricing"
                value={formData.pricing || ''}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                placeholder="Lista de precios, condiciones comerciales..."
              />
            </div>
            <div>
              <Label htmlFor="supplier-notes">Notas Adicionales</Label>
              <Textarea
                id="supplier-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional sobre el proveedor, historial de compras..."
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
