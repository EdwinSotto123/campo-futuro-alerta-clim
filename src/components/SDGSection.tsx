import { Target, Leaf, Globe, CloudRain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SDGSection = () => {
  const sdgs = [
    {
      number: 13,
      title: "Acción por el Clima",
      description: "Adoptar medidas urgentes para combatir el cambio climático y sus efectos",
      icon: "🌍",
      color: "from-blue-400 to-green-500",
      impact: "WairaAI proporciona alertas tempranas y estrategias de adaptación climática que reducen emisiones y mejoran la resilencia agrícola ante el cambio climático",
      isPrimary: true
    },
    {
      number: 2,
      title: "Hambre Cero",
      description: "Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición",
      icon: "🌾",
      color: "from-amber-400 to-orange-500",
      impact: "Protegemos las cosechas de 50,000+ agricultores, asegurando la producción alimentaria ante crisis climáticas",
      isPrimary: false
    },
    {
      number: 15,
      title: "Vida de Ecosistemas Terrestres",
      description: "Proteger, restablecer y promover el uso sostenible de los ecosistemas terrestres",
      icon: "🌿",
      color: "from-green-500 to-emerald-600",
      impact: "Promovemos prácticas agrícolas sostenibles que conservan la biodiversidad y el suelo",
      isPrimary: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 mb-6">
            <Globe className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Objetivos de Desarrollo Sostenible</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Impulsando la <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">acción climática</span> global
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            <strong>WairaAI</strong> contribuye directamente a tres Objetivos de Desarrollo Sostenible 
            de las Naciones Unidas, con énfasis especial en el <strong>ODS 13: Acción por el Clima</strong>.
          </p>
        </div>

        {/* Main ODS 13 Card - Highlighted */}
        <div className="mb-10">
          <Card className="relative overflow-hidden shadow-2xl border-0 transform transition-all duration-500 hover:scale-[1.02]">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-green-600/10"></div>
            
            <div className="relative p-8 grid md:grid-cols-5 gap-8 items-center">
              {/* Left - Logo and Number */}
              <div className="md:col-span-1 text-center">
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <CloudRain className="h-12 w-12 text-white" />
                </div>
                <div className="mt-4">
                  <Badge className="px-4 py-2 bg-blue-100 text-blue-800 border-blue-200 text-base font-bold">
                    ODS 13
                  </Badge>
                </div>
              </div>
              
              {/* Right - Content */}
              <div className="md:col-span-4">
                <h3 className="text-2xl font-bold text-blue-700 mb-3">
                  Acción por el Clima
                </h3>
                
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  Adoptar medidas urgentes para combatir el cambio climático y sus efectos. En WairaAI, 
                  este objetivo está en el centro de nuestra misión, proporcionando herramientas tecnológicas
                  que ayudan a los agricultores a adaptarse y mitigar los efectos del cambio climático.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <p className="text-gray-600">
                      Proporcionamos <strong>alertas tempranas de eventos climáticos extremos</strong>, reduciendo pérdidas y adaptando cultivos.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <p className="text-gray-600">
                      Nuestra IA optimiza el uso de recursos hídricos y energéticos, <strong>reduciendo emisiones</strong> en la producción agrícola.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                      <span className="text-white text-xs">3</span>
                    </div>
                    <p className="text-gray-600">
                      Empoderamos a agricultores con <strong>conocimiento climático</strong> para implementar prácticas resilientes al clima.
                    </p>
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/80 rounded-lg p-4 text-center shadow">
                    <div className="text-3xl font-bold text-blue-700">45%</div>
                    <div className="text-sm text-gray-600">Reducción de emisiones</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 text-center shadow">
                    <div className="text-3xl font-bold text-green-600">+30k</div>
                    <div className="text-sm text-gray-600">Agricultores impactados</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 text-center shadow">
                    <div className="text-3xl font-bold text-blue-700">2030</div>
                    <div className="text-sm text-gray-600">Meta de contribución</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary SDG Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {sdgs.filter(sdg => !sdg.isPrimary).map((sdg, index) => (
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
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
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
          <Card className="inline-block p-8 bg-gradient-to-r from-blue-500/5 to-green-500/5 border-blue-200/20">
            <div className="flex items-center justify-center space-x-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700">2030</div>
                <div className="text-sm text-gray-600">Meta Global ODS</div>
              </div>
              
              <div className="w-px h-12 bg-gray-300"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700">17</div>
                <div className="text-sm text-gray-600">Objetivos Totales</div>
              </div>
              
              <div className="w-px h-12 bg-gray-300"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">3</div>
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
