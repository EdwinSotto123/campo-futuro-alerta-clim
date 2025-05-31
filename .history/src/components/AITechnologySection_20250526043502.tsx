import { Brain, Cpu, Database, Satellite, Bot, Zap, Shield, TrendingUp, Eye, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AITechnologySection = () => {
  const aiCapabilities = [
    {
      icon: Brain,
      title: "IBM Watson Analytics",
      description: "Procesamiento de lenguaje natural y análisis predictivo para cultivos andinos",
      features: ["Análisis de patrones climáticos", "Predicción de eventos extremos", "Recomendaciones personalizadas"],
      color: "from-blue-600 to-blue-800",
      textColor: "text-blue-600"
    },
    {
      icon: Satellite,
      title: "Visión Artificial Satelital",
      description: "Análisis de imágenes NASA y Sentinel para monitoreo de cultivos en tiempo real",
      features: ["Detección de estrés hídrico", "Análisis de salud vegetal", "Predicción de rendimiento"],
      color: "from-green-600 to-emerald-800",
      textColor: "text-green-600"
    },
    {
      icon: Database,
      title: "Machine Learning Climático",
      description: "Algoritmos avanzados que aprenden de datos históricos y actuales",
      features: ["Modelos predictivos", "Detección de anomalías", "Optimización de recursos"],
      color: "from-purple-600 to-purple-800",
      textColor: "text-purple-600"
    }
  ];
  const techStack = [
    { name: "IBM Watson", icon: "🔷", desc: "Inteligencia Artificial", highlight: true },
    { name: "IBM Cloud", icon: "☁️", desc: "Infraestructura IA", highlight: true },
    { name: "Computer Vision", icon: "👁️", desc: "Análisis de Imágenes", highlight: false },
    { name: "NASA APIs", icon: "🛰️", desc: "Datos Satelitales", highlight: false },
    { name: "Machine Learning", icon: "🧠", desc: "Aprendizaje Automático", highlight: false },
    { name: "IBM NLP", icon: "💬", desc: "Procesamiento de Lenguaje", highlight: true }
  ];

  const aiMetrics = [
    { value: "99.2%", label: "Precisión predictiva", icon: TrendingUp, color: "text-green-600" },
    { value: "< 1ms", label: "Tiempo de respuesta", icon: Zap, color: "text-blue-600" },
    { value: "24/7", label: "Monitoreo automático", icon: Shield, color: "text-purple-600" },
    { value: "+1M", label: "Datos procesados/min", icon: Database, color: "text-orange-600" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 mb-6">
            <Cpu className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Potenciado por IA de Vanguardia
            </span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">IBM</Badge>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Tecnología de Inteligencia Artificial
            </span>
            <br />
            <span className="text-gray-800">para Agricultura del Futuro</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Nuestra plataforma integra las tecnologías más avanzadas de IBM Watson, NASA y Google 
            para ofrecerte predicciones climáticas con precisión sin precedentes.
          </p>
        </div>

        {/* AI Capabilities Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {aiCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card 
                key={index}
                className="relative p-8 bg-white/80 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${capability.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${capability.color} shadow-lg mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{capability.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{capability.description}</p>
                  
                  <div className="space-y-2">
                    {capability.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.color}`}></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Stack Tecnológico</h3>
            <p className="text-gray-600">Las mejores herramientas de IA del mercado trabajando en conjunto</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, index) => (
              <Card 
                key={index}
                className={`p-4 text-center transition-all duration-300 hover:scale-105 ${
                  tech.highlight 
                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-lg' 
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className={`font-semibold text-sm mb-1 ${tech.highlight ? 'text-blue-700' : 'text-gray-800'}`}>
                  {tech.name}
                </div>
                <div className="text-xs text-gray-600">{tech.desc}</div>
                {tech.highlight && (
                  <Badge variant="outline" className="mt-2 text-xs bg-blue-100 text-blue-700 border-blue-200">
                    Principal
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* AI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {aiMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card 
                key={index}
                className="p-6 text-center bg-white/90 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className={`h-8 w-8 mx-auto mb-3 ${metric.color}`} />
                <div className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="h-8 w-8" />
              <h3 className="text-2xl font-bold">¿Listo para experimentar la IA agrícola?</h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl">
              Accede a predicciones climáticas precisas, recomendaciones personalizadas 
              y análisis avanzados powered by IBM Watson.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg px-8"
              >
                <Eye className="mr-2 h-5 w-5" />
                Probar IA Gratis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8"
              >
                <Layers className="mr-2 h-5 w-5" />
                Ver Documentación
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AITechnologySection;
