
import { Target, Leaf, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SDGSection = () => {
  const sdgs = [
    {
      number: 2,
      title: "Hambre Cero",
      description: "Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición",
      icon: "🌾",
      color: "from-amber-400 to-orange-500",
      impact: "Protegemos las cosechas de 50,000+ agricultores, asegurando la producción alimentaria ante crisis climáticas"
    },
    {
      number: 13,
      title: "Acción por el Clima",
      description: "Adoptar medidas urgentes para combatir el cambio climático y sus efectos",
      icon: "🌍",
      color: "from-green-400 to-blue-500",
      impact: "Alertas tempranas y adaptación climática reducen emisiones y mejoran la resilencia agrícola"
    },
    {
      number: 15,
      title: "Vida de Ecosistemas Terrestres",
      description: "Proteger, restablecer y promover el uso sostenible de los ecosistemas terrestres",
      icon: "🌿",
      color: "from-green-500 to-emerald-600",
      impact: "Promovemos prácticas agrícolas sostenibles que conservan la biodiversidad y el suelo"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
            <Globe className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Objetivos de Desarrollo Sostenible</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Construyendo un <span className="text-gradient">futuro sostenible</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nuestra plataforma contribuye directamente a tres Objetivos de Desarrollo Sostenible 
            de las Naciones Unidas, creando impacto positivo a nivel global.
          </p>
        </div>

        {/* SDG Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {sdgs.map((sdg, index) => (
            <Card 
              key={sdg.number}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${sdg.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative p-8">
                {/* SDG Badge */}
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="outline" className="text-xs font-bold px-3 py-1">
                    ODS {sdg.number}
                  </Badge>
                  <span className="text-4xl">{sdg.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {sdg.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {sdg.description}
                </p>

                {/* Impact */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-agriculture-green" />
                    <span className="text-sm font-medium text-agriculture-darkGreen">
                      Nuestro Impacto:
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed pl-6">
                    {sdg.impact}
                  </p>
                </div>

                {/* Hover Effect Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${sdg.color} flex items-center justify-center shadow-lg`}>
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-agriculture-green/5 to-agriculture-sky/5 border-agriculture-green/20">
            <div className="flex items-center justify-center space-x-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-agriculture-darkGreen">2030</div>
                <div className="text-sm text-gray-600">Meta Global ODS</div>
              </div>
              
              <div className="w-px h-12 bg-gray-300"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-agriculture-darkGreen">17</div>
                <div className="text-sm text-gray-600">Objetivos Totales</div>
              </div>
              
              <div className="w-px h-12 bg-gray-300"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-agriculture-darkGreen">3</div>
                <div className="text-sm text-gray-600">Que Impactamos</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SDGSection;
