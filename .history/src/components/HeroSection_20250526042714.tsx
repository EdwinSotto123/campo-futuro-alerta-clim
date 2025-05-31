
import { ArrowRight, Brain, Cpu, Satellite, Zap, Shield, Heart, Bot, Eye, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  const aiFeatures = [
    { 
      icon: Brain, 
      title: "IA Predictiva", 
      desc: "Algoritmos avanzados", 
      color: "text-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10"
    },
    { 
      icon: Satellite, 
      title: "Datos Satelitales", 
      desc: "NASA & Sentinel", 
      color: "text-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10"
    },
    { 
      icon: Bot, 
      title: "Watson AI", 
      desc: "IBM Technology", 
      color: "text-green-600",
      bgGradient: "from-green-500/10 to-green-600/10"
    }
  ];

  const stats = [
    { icon: Shield, value: "95%", label: "Reducción de pérdidas", color: "text-emerald-600" },
    { icon: Zap, value: "24/7", label: "Monitoreo en tiempo real", color: "text-blue-600" },
    { icon: TrendingUp, value: "73%", label: "Precisión predictiva", color: "text-purple-600" }
  ];

  const techLogos = [
    { name: "IBM Watson", logo: "🔷", highlight: true },
    { name: "NASA", logo: "🛰️", highlight: false },
    { name: "SENHAMI", logo: "🌤️", highlight: false },
    { name: "Google AI", logo: "🧠", highlight: false }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-600/20 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-green-400/20 to-blue-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-500/10 blur-2xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200/50 backdrop-blur-sm">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Potenciado por Inteligencia Artificial
                </span>
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">IA</Badge>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Campo Futuro
                </span>
                <br />
                <span className="text-gray-800">Alerta Climática</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                La primera plataforma agrícola con <strong>inteligencia artificial IBM Watson</strong> 
                que predice eventos climáticos extremos y protege tu cosecha con tecnología espacial.
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
                className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group px-8 py-6 text-lg"
              >
                <Brain className="mr-3 h-5 w-5" />
                Activar IA
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                Ver Demo IA
              </Button>
            </div>

            {/* Technology Partners */}
            <div className="space-y-3">
              <div className="text-sm text-gray-500 font-medium">
                Potenciado por tecnología líder mundial:
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {techLogos.map((tech, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      tech.highlight 
                        ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 shadow-sm' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tech.logo}</span>
                    <span className={`text-sm font-medium ${tech.highlight ? 'text-blue-700' : 'text-gray-700'}`}>
                      {tech.name}
                    </span>
                    {tech.highlight && <Badge variant="outline" className="text-xs">AI</Badge>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Stats & AI Showcase */}
          <div className="space-y-6 animate-fade-in">
            {/* AI Visualization Card */}
            <Card className="p-8 bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-2xl shadow-blue-500/10">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Motor de IA en tiempo real</span>
                </div>
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 border-2 border-dashed border-blue-300 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                </div>
                <p className="text-sm text-gray-600">
                  Procesando <strong>+1M datos</strong> climáticos por minuto
                </p>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4">
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

            {/* Emergency Alert Card - Now AI-powered */}
            <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full animate-pulse mt-2"></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-red-800">🚨 Alerta IA Activa</h3>
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-700">Watson AI</Badge>
                  </div>
                  <p className="text-sm text-red-700 mb-2">
                    IA detectó granizo severo en 72h - Altiplano Norte
                  </p>
                  <Button size="sm" variant="destructive">
                    Ver predicción IA →
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
