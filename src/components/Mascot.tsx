
import { useState, useEffect } from "react";
import { X, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mascotTips = [
  "🌦️ Revisa las alertas climáticas cada mañana para planificar tu día de trabajo",
  "📱 Mantén tus datos de contacto actualizados para recibir alertas de emergencia",
  "🌱 Diversifica tus cultivos para reducir riesgos ante eventos climáticos extremos",
  "💧 Implementa sistemas de drenaje antes de la temporada de lluvias",
  "📞 Guarda los números de emergencia agrícola en tu teléfono",
  "🏦 Conoce los requisitos de financiamiento antes de que ocurra un desastre",
  "👥 Conecta con otros agricultores de tu zona para compartir experiencias",
  "📊 Lleva un registro de tus cultivos para acceder mejor a los subsidios"
];

const Mascot = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show first tip after 2 seconds
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showBubble) {
      // Auto-hide bubble after 8 seconds
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showBubble, currentTip]);

  const handleMascotClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    if (showBubble) {
      // Change tip
      setCurrentTip((prev) => (prev + 1) % mascotTips.length);
    } else {
      // Show bubble
      setShowBubble(true);
    }
  };

  const closeBubble = () => {
    setShowBubble(false);
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % mascotTips.length);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Speech Bubble */}
      {showBubble && (
        <Card className="absolute bottom-20 right-0 p-4 max-w-xs bg-white shadow-lg border-2 border-agriculture-green/20 animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-agriculture-darkGreen text-sm">
              💡 Consejo de Agro
            </h4>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0"
                onClick={nextTip}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0"
                onClick={closeBubble}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            {mascotTips[currentTip]}
          </p>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-muted-foreground">
              Consejo {currentTip + 1} de {mascotTips.length}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 text-xs px-2"
              onClick={nextTip}
            >
              Siguiente
            </Button>
          </div>

          {/* Speech bubble arrow */}
          <div className="absolute bottom-[-8px] right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
          <div className="absolute bottom-[-6px] right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-agriculture-green/20"></div>
        </Card>
      )}

      {/* Mascot Character */}
      <div 
        className={`
          relative cursor-pointer select-none transform transition-all duration-300
          ${isAnimating ? 'scale-110 rotate-12' : 'scale-100'}
          hover:scale-105 animate-float
        `}
        onClick={handleMascotClick}
      >
        {/* Mascot Body */}
        <div className="w-16 h-16 rounded-full agriculture-gradient shadow-lg flex items-center justify-center border-4 border-white">
          <span className="text-2xl animate-bounce-gentle">🦉</span>
        </div>

        {/* Interaction indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-agriculture-sky rounded-full animate-pulse-glow">
          <MessageCircle className="w-3 h-3 text-white m-0.5" />
        </div>

        {/* Name tag */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-md border border-agriculture-green/20">
          <span className="text-xs font-medium text-agriculture-darkGreen">Agro</span>
        </div>
      </div>

      {/* Hide mascot button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-50"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default Mascot;
