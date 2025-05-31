
import { 
  AlertTriangle, 
  Brain, 
  Phone, 
  CreditCard, 
  MessageSquare, 
  Smartphone,
  Satellite,
  TrendingUp,
  Shield
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FeaturesSection = () => {  const mainFeatures = [
    {
      icon: AlertTriangle,
      title: "Alertas Climáticas con IA",
      description: "Predicciones ultratempranas potenciadas por IBM Watson y datos satelitales NASA",
      details: ["IA predictiva 72h adelantada", "Análisis de patrones climáticos", "Notificaciones multicanal"],
      color: "text-red-600",
      bgColor: "bg-red-50",
      aiPowered: true
    },
    {
      icon: Brain,
      title: "Asesor Virtual Inteligente",
      description: "Watson AI personaliza recomendaciones según tu ubicación, cultivos y condiciones",
      details: ["Machine Learning adaptativo", "Análisis multiespectral", "Calendarios optimizados"],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      aiPowered: true
    },
    {
      icon: Phone,
      title: "Protocolo de Emergencia Inteligente",
      description: "Sistema automatizado que conecta con autoridades y expertos en tiempo real",
      details: ["Escalamiento automático", "Geolocalización precisa", "Respuesta coordinada"],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      aiPowered: false
    },
    {
      icon: CreditCard,
      title: "Financiamiento Inteligente",
      description: "IA analiza tu perfil y recomienda las mejores opciones de financiamiento disponibles",
      details: ["Matching automático", "Análisis de elegibilidad", "Seguros personalizados"],
      color: "text-green-600",
      bgColor: "bg-green-50",
      aiPowered: true
    },    {
      icon: MessageSquare,
      title: "Asistente Watson 24/7",
      description: "Chatbot potenciado por IBM Watson con procesamiento de lenguaje natural avanzado",
      details: ["NLP multiidioma", "Aprendizaje continuo", "Escalamiento inteligente"],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      aiPowered: true
    },
    {
      icon: Smartphone,
      title: "App Inteligente Adaptativa",
      description: "Interfaz que aprende de tus patrones de uso y se optimiza automáticamente",
      details: ["UI adaptativa", "Sincronización AI", "Predicción de necesidades"],
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      aiPowered: true
    }
  ];

  const techFeatures = [
    { icon: Satellite, label: "Datos Satelitales NASA", desc: "Imágenes y análisis en tiempo real" },
    { icon: TrendingUp, label: "Predicción Avanzada", desc: "Algoritmos de machine learning" },
    { icon: Shield, label: "Seguridad Garantizada", desc: "Encriptación y protección de datos" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200/50 mb-6">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Funcionalidades Potenciadas por IA
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Herramientas <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">inteligentes</span> para 
            <br /><span className="text-gradient">agricultura resiliente</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Cada funcionalidad está diseñada con inteligencia artificial para ofrecerte 
            la mejor experiencia y resultados precisos en tiempo real.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md relative overflow-hidden"
              >
                {/* AI Badge */}
                {feature.aiPowered && (
                  <Badge 
                    variant="outline" 
                    className="absolute top-4 right-4 text-xs bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200"
                  >
                    🤖 IA
                  </Badge>
                )}
                
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2 pr-12">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <div className={`w-1 h-1 rounded-full mr-2 ${feature.aiPowered ? 'bg-purple-500' : 'bg-agriculture-green'}`}></div>
                      {detail}
                    </div>
                  ))}
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full group-hover:bg-agriculture-green/5 group-hover:text-agriculture-darkGreen transition-colors"
                >
                  Explorar función →
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Technical Features */}
        <div className="bg-gradient-to-r from-gray-50 to-green-50/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Tecnología de Vanguardia
            </h3>
            <p className="text-gray-600">
              Respaldado por las mejores tecnologías y fuentes de datos del mundo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {techFeatures.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 agriculture-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {tech.label}
                  </h4>
                  
                  <p className="text-sm text-gray-600">
                    {tech.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 agriculture-gradient text-white">
            <h3 className="text-2xl font-bold mb-2">
              ¿Listo para proteger tu cosecha?
            </h3>
            <p className="mb-6 opacity-90">
              Únete a miles de agricultores que ya confían en AgroClima
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Registrarse gratis
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Ver demostración
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
