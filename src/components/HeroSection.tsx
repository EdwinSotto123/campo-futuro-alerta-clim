
import { ArrowRight, Shield, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const HeroSection = () => {
  const stats = [
    { icon: Shield, value: "95%", label: "Reducción de pérdidas", color: "text-agriculture-green" },
    { icon: Zap, value: "24/7", label: "Monitoreo climático", color: "text-agriculture-sky" },
    { icon: Heart, value: "50K+", label: "Agricultores protegidos", color: "text-agriculture-earth" }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-agriculture-green/10 border border-agriculture-green/20">
                <span className="text-sm font-medium text-agriculture-darkGreen">
                  🌍 Contribuyendo a los ODS 2, 13 y 15
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">Protege tu cosecha</span>
                <br />
                <span className="text-gray-800">ante el cambio climático</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Alertas tempranas, consejos personalizados y asistencia integral para minimizar 
                el impacto de eventos climáticos extremos en tu agricultura.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="agriculture-gradient text-white hover:shadow-lg transition-all duration-300 group"
              >
                Comenzar ahora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-agriculture-green text-agriculture-darkGreen hover:bg-agriculture-green/5"
              >
                Ver demo interactiva
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-sm text-gray-500">
                Integrado con:
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-agriculture-darkGreen">SENHAMI</span>
                <span className="text-gray-300">•</span>
                <span className="font-semibold text-agriculture-darkGreen">NASA</span>
                <span className="text-gray-300">•</span>
                <span className="font-semibold text-agriculture-darkGreen">+5 APIs</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="space-y-6 animate-fade-in">
            <div className="grid gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={index}
                    className="p-6 bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
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

            {/* Emergency Contact Card */}
            <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full animate-pulse mt-2"></div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">🚨 Emergencia Activa</h3>
                  <p className="text-sm text-red-700 mb-2">
                    Alerta de granizo severo para región Altiplano - Norte
                  </p>
                  <Button size="sm" variant="destructive">
                    Ver detalles →
                  </Button>
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
