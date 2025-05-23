
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SDGSection from "@/components/SDGSection";
import FeaturesSection from "@/components/FeaturesSection";
import Mascot from "@/components/Mascot";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <SDGSection />
      </main>

      {/* Interactive Elements */}
      <Mascot />
      <Chatbot />
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full agriculture-gradient flex items-center justify-center">
                  <span className="text-white font-bold">🌱</span>
                </div>
                <span className="text-xl font-bold">AgroClima</span>
              </div>
              <p className="text-gray-400 text-sm">
                Protegiendo la agricultura ante el cambio climático con tecnología de vanguardia.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Alertas Climáticas</li>
                <li>Consejos IA</li>
                <li>Financiamiento</li>
                <li>Soporte 24/7</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">ODS</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>🌾 Hambre Cero</li>
                <li>🌍 Acción Climática</li>
                <li>🌿 Vida Terrestre</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Emergencias</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 SENASAG: 800-10-2020</li>
                <li>🆘 Defensa Civil: 165</li>
                <li>🌦️ SENHAMI: 2-2445512</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 AgroClima. Desarrollado para proteger la agricultura sostenible.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
