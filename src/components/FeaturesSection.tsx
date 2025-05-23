
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

const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: AlertTriangle,
      title: "Alertas Climáticas Tempranas",
      description: "Recibe notificaciones en tiempo real sobre condiciones meteorológicas adversas",
      details: ["APIs de SENHAMI y NASA", "Predicciones 72h adelantadas", "SMS y notificaciones push"],
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: Brain,
      title: "Consejos Personalizados con IA",
      description: "Recomendaciones específicas basadas en tu ubicación, cultivos y condiciones",
      details: ["Análisis de suelo y clima", "Calendario de siembra", "Técnicas de prevención"],
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Phone,
      title: "Guía de Emergencia Completa",
      description: "Acceso inmediato a contactos, protocolos y canales de apoyo institucional",
      details: ["Números de emergencia", "Protocolos paso a paso", "Canales gubernamentales"],
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: CreditCard,
      title: "Financiamiento y Subsidios",
      description: "Información clara sobre requisitos y procesos para acceder a ayuda financiera",
      details: ["Subsidios por desastre", "Microcréditos agrícolas", "Seguros climáticos"],
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MessageSquare,
      title: "Chatbot Inteligente",
      description: "Asistente virtual 24/7 para resolver consultas y guiar en situaciones críticas",
      details: ["Respuestas inmediatas", "Múltiples idiomas", "Escalamiento a expertos"],
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Smartphone,
      title: "Diseño Móvil Optimizado",
      description: "Interfaz intuitiva accesible desde cualquier dispositivo, incluso con conectividad limitada",
      details: ["Modo offline", "Bajo consumo de datos", "Interfaz simplificada"],
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  const techFeatures = [
    { icon: Satellite, label: "Datos Satelitales NASA", desc: "Imágenes y análisis en tiempo real" },
    { icon: TrendingUp, label: "Predicción Avanzada", desc: "Algoritmos de machine learning" },
    { icon: Shield, label: "Seguridad Garantizada", desc: "Encriptación y protección de datos" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            🚀 Funcionalidades Principales
          </Badge>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Todo lo que necesitas para <span className="text-gradient">proteger tu agricultura</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Una suite completa de herramientas diseñadas específicamente para agricultores 
            que enfrentan los desafíos del cambio climático.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
              >
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-agriculture-green rounded-full mr-2"></div>
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
