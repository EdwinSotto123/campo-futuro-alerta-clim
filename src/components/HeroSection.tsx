import { ArrowRight, Brain, Cpu, Satellite, Zap, Shield, Heart, Bot, Eye, TrendingUp, Globe, BarChart, CloudRain, Coins, Tractor, Wheat, ShoppingCart, Droplets, Users, Sun, Wind, Store, Truck, Factory, Package, User, Warehouse, HardHat, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import logoWaira from "../logo-waira.png";

const HeroSection = () => {
  const aiFeatures = [
    { 
      icon: Brain, 
      title: "Granite Models", 
      desc: "IBM watsonx.ai", 
      color: "text-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10"
    },
    { 
      icon: Satellite, 
      title: "APIs NASA", 
      desc: "Datos en tiempo real", 
      color: "text-emerald-600",
      bgGradient: "from-emerald-500/10 to-emerald-600/10"
    },
    { 
      icon: Bot, 
      title: "Agentes IA", 
      desc: "LangChain + RAG", 
      color: "text-amber-600",
      bgGradient: "from-amber-500/10 to-amber-600/10"
    }
  ];

  const stats = [
    { icon: CloudRain, value: "95%", label: "Precisión climática", color: "text-sky-600" },
    { icon: Wheat, value: "+500", label: "Parcelas virtuales", color: "text-emerald-600" },
    { icon: BarChart, value: "73%", label: "Optimización recursos", color: "text-amber-600" },
    { icon: Globe, value: "ODS 13", label: "Acción por el Clima", color: "text-blue-600" }
  ];

  const techLogos = [
    { name: "IBM watsonx.ai", logo: "🔷", highlight: true },
    { name: "NASA", logo: "🛰️", highlight: false },
    { name: "SENHAMI", logo: "🌤️", highlight: false },
    { name: "LangChain", logo: "⛓️", highlight: false }
  ];

  // Datos para la parcela virtual
  const parcelaData = [
    { type: 'cultivo', icon: '🌽', name: 'Maíz', status: 'Creciendo', health: 'Óptimo', water: 'Adecuado' },
    { type: 'cultivo', icon: '🥔', name: 'Papa', status: 'Cosecha', health: 'Excelente', water: 'Moderado' },
    { type: 'cultivo', icon: '🌱', name: 'Quinua', status: 'Germinando', health: 'Bueno', water: 'Alto' },
    { type: 'reserva', icon: '💧', name: 'Reserva Agua', status: '80%', resourceType: 'Recurso' },
    { type: 'suministro', icon: '🏭', name: 'Proveedor Semillas', transactionType: 'Compra' },
    { type: 'mercado', icon: '👨‍🌾', name: 'Mercado Local', transactionType: 'Venta' },
    { type: 'personal', icon: '👨‍🌾', name: 'Personal', role: 'Agricultor' }
  ];

  // Cadena de suministro completa
  const supplyChainData = [
    { type: 'proveedor', name: 'Proveedor', icon: Factory, color: 'text-amber-600', desc: 'Suministros agrícolas' },
    { type: 'almacen', name: 'Almacén', icon: Warehouse, color: 'text-emerald-600', desc: 'Almacenamiento' },
    { type: 'transporte', name: 'Transporte', icon: Truck, color: 'text-blue-600', desc: 'Logística' },
    { type: 'mercado', name: 'Compradores', icon: User, color: 'text-purple-600', desc: 'Venta directa' },
    { type: 'mercado', name: 'Exportación', icon: Globe, color: 'text-indigo-600', desc: 'Comercio internacional' }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-400/20 to-sky-600/20 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-amber-400/20 to-emerald-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/10 to-emerald-500/10 blur-2xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              {/* AI Badge */}
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={logoWaira} 
                  alt="WairaAI Logo" 
                  className="h-16 w-auto object-contain" 
                />
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-200/50 backdrop-blur-sm">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Hackathon for Progress - Climate Challenge
                </span>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">IBM</Badge>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
                  WairaAI
                </span>
                <br />
                <span className="text-gray-800">Parcela Virtual Inteligente</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Plataforma con <strong>múltiples agentes Granite Model de IBM watsonx.ai </strong> 
                que monitorea tu parcela virtual, predice eventos climáticos, optimiza tu cadena de suministro y 
                recomienda opciones financieras para contribuir al ODS 13.
              </p>

              {/* AI Features Mini Cards */}
              <div className="grid grid-cols-3 gap-3">
                {aiFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card 
                      key={index}
                      className={`p-4 bg-gradient-to-br ${feature.bgGradient} border-0 hover:shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                      <div className="text-center">
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${feature.color}`} />
                        <div className="text-sm font-semibold text-gray-800">{feature.title}</div>
                        <div className="text-xs text-gray-600">{feature.desc}</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 group px-8 py-6 text-lg"
              >
                <Tractor className="mr-3 h-5 w-5" />
                Crear Parcela Virtual
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            {/* Technology Partners */}
            <div className="space-y-3">
              <div className="text-sm text-gray-500 font-medium">
                Impulsado por tecnología de vanguardia:
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {techLogos.map((tech, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      tech.highlight 
                        ? 'bg-gradient-to-r from-blue-600/10 to-emerald-600/10 border border-blue-200/50 shadow-sm' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tech.logo}</span>
                    <span className={`text-sm font-medium ${tech.highlight ? 'text-blue-700' : 'text-gray-700'}`}>
                      {tech.name}
                    </span>
                    {tech.highlight && <Badge variant="outline" className="text-xs">Granite</Badge>}
                  </div>
                ))}
              </div>
            </div>

            {/* Ecosistema de Agentes IA */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  Ecosistema de Agentes IA Especializados
                </h3>
                <p className="text-sm text-gray-600">
                  Múltiples agentes IA colaborando para proteger tu cultivo y el planeta
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-blue-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-blue-100">
                      <CloudRain className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-blue-700">Agente Climático</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Monitoreo y predicción de eventos climáticos extremos
                  </p>
                </div>
                
                <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-emerald-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-emerald-100">
                      <Wheat className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h4 className="font-medium text-emerald-700">Agente Agrícola</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Recomendaciones para optimizar cultivos y recursos
                  </p>
                </div>
                
                <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-amber-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-amber-100">
                      <Coins className="h-5 w-5 text-amber-600" />
                    </div>
                    <h4 className="font-medium text-amber-700">Agente Financiero</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Evaluación y recomendación de créditos agrícolas
                  </p>
                </div>
                
                <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-purple-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-purple-100">
                      <Bot className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-purple-700">Agente RAG</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Búsqueda avanzada y procesamiento de información
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Virtual Farm Visualization */}
          <div className="space-y-6 animate-fade-in">
            {/* Virtual Farm Visualization Card */}
            <Card className="p-8 bg-gradient-to-br from-white to-emerald-50/50 border-0 shadow-2xl shadow-emerald-500/10">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Wheat className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-600">Parcela Virtual Interactiva</span>
                  <div className="ml-2 px-3 py-1 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-100 shadow-sm">
                    <span className="text-xs font-medium bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      Replica tu cadena y cultivo para que la IA pueda identificar puntos débiles y aumentar sostenibilidad
                    </span>
                  </div>
                </div>
                
                {/* Parcela Virtual Mejorada */}
                <div className="relative flex flex-col md:flex-row gap-4">
                  
                  {/* Representación de la parcela - AHORA CON LEYENDA FUERA */}
                  <div className="w-full md:w-3/4 h-72 bg-emerald-100/80 rounded-lg relative overflow-hidden border-2 border-emerald-200">
                    {/* Cuadrícula de parcela */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-0.5">
                      {Array.from({ length: 36 }).map((_, i) => {
                        // Definimos los tipos de casillas para mayor claridad
                        const hasCrop = i === 3 || i === 9 || i === 15 || i === 21;
                        const cropType = hasCrop ? ['🌽', '🥔', '🌱'][Math.floor(Math.random() * 3)] : null;
                        const isWater = i === 2 || i === 26;
                        const isPersonalField = i === 5 || i === 11;
                        const isBorder = i < 6 || i > 29 || i % 6 === 0;
                        const isFactory = i === 17;
                        const isWarehouse = i === 23;
                        const isBuyer = i === 29;
                        const isExport = i === 30;
                        const isSpecialist = i === 35;
                        
                        // Determinamos colores específicos para cada tipo
                        let bgColorClass = '';
                        let borderColorClass = '';
                        
                        if (isWater) {
                          bgColorClass = 'bg-sky-300/60 hover:bg-sky-400/70';
                          borderColorClass = 'border-sky-400';
                        } else if (isPersonalField) {
                          bgColorClass = 'bg-amber-200/60 hover:bg-amber-300/70';
                          borderColorClass = 'border-amber-300';
                        } else if (hasCrop) {
                          bgColorClass = 'bg-emerald-400/60 hover:bg-emerald-500/70';
                          borderColorClass = 'border-emerald-400';
                        } else if (isFactory) {
                          bgColorClass = 'bg-red-200/60 hover:bg-red-300/70';
                          borderColorClass = 'border-red-300';
                        } else if (isWarehouse) {
                          bgColorClass = 'bg-orange-200/60 hover:bg-orange-300/70';
                          borderColorClass = 'border-orange-300';
                        } else if (isBuyer) {
                          bgColorClass = 'bg-purple-200/60 hover:bg-purple-300/70';
                          borderColorClass = 'border-purple-300';
                        } else if (isExport) {
                          bgColorClass = 'bg-indigo-200/60 hover:bg-indigo-300/70';
                          borderColorClass = 'border-indigo-300';
                        } else if (isSpecialist) {
                          bgColorClass = 'bg-yellow-200/60 hover:bg-yellow-300/70';
                          borderColorClass = 'border-yellow-300';
                        } else if (isBorder) {
                          bgColorClass = 'bg-emerald-300/40 hover:bg-emerald-400/50';
                          borderColorClass = 'border-emerald-300';
                        } else {
                          bgColorClass = 'bg-emerald-200/50 hover:bg-emerald-300/60';
                          borderColorClass = 'border-emerald-200';
                        }
                        
                        return (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`flex items-center justify-center border cursor-pointer transition-all duration-200 ${bgColorClass} ${borderColorClass}`}
                                >
                                  {cropType && <span className="text-lg">{cropType}</span>}
                                  {isWater && <Droplets className="h-5 w-5 text-sky-600" />}
                                  {isFactory && <Factory className="h-4 w-4 text-red-700" />}
                                  {isWarehouse && <Warehouse className="h-4 w-4 text-orange-700" />}
                                  {isBuyer && <User className="h-4 w-4 text-purple-700" />}
                                  {isExport && <Globe className="h-4 w-4 text-indigo-700" />}
                                  {isPersonalField && <HardHat className="h-4 w-4 text-amber-700" />}
                                  {isSpecialist && <HardHat className="h-4 w-4 text-yellow-700" />}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {hasCrop && (
                                  <div className="space-y-1">
                                    <p className="font-medium text-xs">{cropType === '🌽' ? 'Maíz' : cropType === '🥔' ? 'Papa' : 'Quinua'}</p>
                                    <div className="flex items-center gap-1 text-xs">
                                      <Sun className="h-3 w-3 text-amber-500" />
                                      <span>Estado: {['Germinando', 'Creciendo', 'Floreciendo', 'Cosecha'][Math.floor(Math.random() * 4)]}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                      <Droplets className="h-3 w-3 text-sky-500" />
                                      <span>Riego: {['Bajo', 'Moderado', 'Óptimo'][Math.floor(Math.random() * 3)]}</span>
                                    </div>
                                  </div>
                                )}
                                {isWater && <p className="text-xs">Fuente de agua: Río Chillón</p>}
                                {isPersonalField && <p className="text-xs">Personal agrícola en la parcela</p>}
                                {isFactory && <p className="text-xs font-medium">Proveedores de semillas y fertilizantes</p>}
                                {isWarehouse && <p className="text-xs font-medium">Almacén de insumos agrícolas</p>}
                                {isBuyer && <p className="text-xs font-medium">Compradores locales</p>}
                                {isExport && <p className="text-xs font-medium">Centro de exportación internacional</p>}
                                {isSpecialist && <p className="text-xs font-medium">Personal agrícola especializado</p>}
                                {!hasCrop && !isWater && !isPersonalField && !isFactory && !isWarehouse && !isBuyer && !isExport && !isSpecialist && <p className="text-xs">Parcela disponible</p>}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                    
                    {/* Indicadores climáticos */}
                    <div className="absolute top-2 right-2 z-10">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                              <CloudRain className="h-5 w-5 text-sky-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1 max-w-xs">
                              <p className="font-medium text-xs">Pronóstico: Probabilidad de lluvia</p>
                              <div className="flex items-center gap-1 text-xs">
                                <CloudRain className="h-3 w-3 text-sky-500" />
                                <span>Probabilidad: 65% en las próximas 24h</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Wind className="h-3 w-3 text-blue-500" />
                                <span>Alerta: Viento moderado previsto</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  {/* Leyenda de la parcela - AHORA FUERA, AL LADO DERECHO */}
                  <div className="w-full md:w-1/4 bg-white/95 rounded-lg p-3 shadow-sm border border-emerald-100 h-72 flex flex-col justify-center">
                    <div className="space-y-3 text-xs">
                      <div className="font-semibold text-gray-700 text-sm border-b pb-1 mb-2">Leyenda:</div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-emerald-400/60 border border-emerald-400 rounded-sm"></span>
                          <span className="text-gray-700">Cultivos</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-sky-300/60 border border-sky-400 rounded-sm"></span>
                          <span className="text-gray-700">Fuente de agua</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-amber-200/60 border border-amber-300 rounded-sm"></span>
                          <span className="text-gray-700">Personal</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-red-200/60 border border-red-300 rounded-sm"></span>
                          <span className="text-gray-700">Proveedores</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-orange-200/60 border border-orange-300 rounded-sm"></span>
                          <span className="text-gray-700">Almacén</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-purple-200/60 border border-purple-300 rounded-sm"></span>
                          <span className="text-gray-700">Compradores</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-indigo-200/60 border border-indigo-300 rounded-sm"></span>
                          <span className="text-gray-700">Exportación</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-yellow-200/60 border border-yellow-300 rounded-sm"></span>
                          <span className="text-gray-700">Tecnico</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Información de la parcela con cadena de suministro */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-white/80 rounded p-2 shadow-sm border border-emerald-100">
                    <div className="flex items-center gap-1 text-xs text-emerald-700">
                      <Wheat className="h-3.5 w-3.5" />
                      <span className="font-medium">Multiples Cultivos</span>
                    </div>
                    <p className="text-xs text-gray-600">Maíz, Papa, Quinua, etc</p>
                  </div>
                  
                  <div className="bg-white/80 rounded p-2 shadow-sm border border-purple-100">
                    <div className="flex items-center gap-1 text-xs text-purple-700">
                      <Factory className="h-3.5 w-3.5" />
                      <span className="font-medium">Proveedores</span>
                    </div>
                    <p className="text-xs text-gray-600">Semillas, Fertilizantes</p>
                  </div>
                  
                  <div className="bg-white/80 rounded p-2 shadow-sm border border-blue-100">
                    <div className="flex items-center gap-1 text-xs text-blue-700">
                      <User className="h-3.5 w-3.5" />
                      <span className="font-medium">Compradores</span>
                    </div>
                    <p className="text-xs text-gray-600">Local, Exportación</p>
                  </div>
                </div>

                {/* Detalle de la cadena de suministro */}
                <div className="mt-3 bg-white/80 rounded p-2 shadow-sm border border-gray-100">
                  <div className="text-xs font-medium text-gray-700 mb-1.5">Cadena de Suministro Completa:</div>
                  <div className="flex items-center justify-between">
                    {supplyChainData.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <TooltipProvider key={idx}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center">
                                <div className={`p-1.5 rounded-full bg-gray-50 ${item.color}`}>
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-[10px] mt-0.5">{item.name}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs font-medium">{item.name}</p>
                              <p className="text-xs">{item.desc}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                    
                    {/* Flechas conectoras */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
                      {Array(4).fill(0).map((_, idx) => (
                        <ArrowRight key={idx} className="h-3 w-3 text-gray-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={index}
                    className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Multi-Agent Integration Card */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full animate-pulse mt-2"></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-blue-800">🤖 Múltiples Agentes IA Colaborativos</h3>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">Granite</Badge>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Agentes especializados en clima, cultivos, finanzas y cadena de suministro trabajando juntos
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                      Ver Agentes →
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-500 text-blue-600">
                      Simular Evento
                  </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
