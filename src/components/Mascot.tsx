
import { useState, useEffect } from "react";
import { X, MessageCircle, RefreshCw, BookOpen, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

const tutorials = [
  {
    id: 1,
    title: "Preparación para Sequías",
    duration: "5 min",
    steps: [
      "Identifica los signos tempranos de sequía",
      "Implementa técnicas de conservación de agua",
      "Selecciona cultivos resistentes a la sequía",
      "Crea un plan de riego eficiente"
    ]
  },
  {
    id: 2,
    title: "Manejo de Plagas con IA",
    duration: "7 min",
    steps: [
      "Usa la cámara para detectar plagas",
      "Interpreta los resultados de IA",
      "Aplica tratamientos recomendados",
      "Monitorea la efectividad"
    ]
  },
  {
    id: 3,
    title: "Alertas Climáticas Tempranas",
    duration: "3 min",
    steps: [
      "Configura notificaciones personalizadas",
      "Interpreta mapas meteorológicos",
      "Toma acciones preventivas",
      "Reporta condiciones locales"
    ]
  }
];

const Mascot = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialProgress, setTutorialProgress] = useState(0);
  const [isPlayingTutorial, setIsPlayingTutorial] = useState(false);

  useEffect(() => {
    // Show first tip after 2 seconds
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showBubble && !showTutorial) {
      // Auto-hide bubble after 8 seconds
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showBubble, currentTip, showTutorial]);

  useEffect(() => {
    if (isPlayingTutorial) {
      const timer = setInterval(() => {
        setTutorialProgress(prev => {
          if (prev >= 100) {
            const tutorial = tutorials[currentTutorial];
            if (tutorialStep < tutorial.steps.length - 1) {
              setTutorialStep(prev => prev + 1);
              return 0;
            } else {
              setIsPlayingTutorial(false);
              return 100;
            }
          }
          return prev + 10;
        });
      }, 300);

      return () => clearInterval(timer);
    }
  }, [isPlayingTutorial, currentTutorial, tutorialStep]);

  const handleMascotClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    if (showBubble && !showTutorial) {
      // Change tip
      setCurrentTip((prev) => (prev + 1) % mascotTips.length);
    } else {
      // Show bubble
      setShowBubble(true);
    }
  };

  const startTutorial = (tutorialId: number) => {
    setCurrentTutorial(tutorialId);
    setTutorialStep(0);
    setTutorialProgress(0);
    setShowTutorial(true);
    setShowBubble(true);
  };

  const toggleTutorialPlay = () => {
    setIsPlayingTutorial(!isPlayingTutorial);
  };

  const closeBubble = () => {
    setShowBubble(false);
    setShowTutorial(false);
    setIsPlayingTutorial(false);
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % mascotTips.length);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tutorial/Tip Bubble */}
      {showBubble && (
        <Card className="absolute bottom-20 right-0 p-4 max-w-sm bg-white shadow-lg border-2 border-agriculture-green/20 animate-fade-in">
          {showTutorial ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-agriculture-darkGreen text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Tutorial: {tutorials[currentTutorial].title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Duración: {tutorials[currentTutorial].duration}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0"
                  onClick={closeBubble}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Paso {tutorialStep + 1} de {tutorials[currentTutorial].steps.length}</span>
                  <span>{Math.round(tutorialProgress)}%</span>
                </div>
                <Progress value={tutorialProgress} className="h-1" />
              </div>

              <div className="p-3 bg-agriculture-green/10 rounded-md">
                <p className="text-sm font-medium">
                  {tutorials[currentTutorial].steps[tutorialStep]}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleTutorialPlay}
                  className="flex items-center gap-1"
                >
                  {isPlayingTutorial ? (
                    <>
                      <Pause className="h-3 w-3" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      Continuar
                    </>
                  )}
                </Button>
                <span className="text-xs text-muted-foreground">
                  Tutorial {currentTutorial + 1} de {tutorials.length}
                </span>
              </div>
            </div>
          ) : (
            <div>
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
              
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {mascotTips[currentTip]}
              </p>
              
              <div className="flex justify-between items-center mb-2">
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

              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-2">Tutoriales disponibles:</p>
                <div className="flex flex-wrap gap-1">
                  {tutorials.map((tutorial, index) => (
                    <Button
                      key={tutorial.id}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => startTutorial(index)}
                    >
                      {tutorial.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Speech bubble arrow */}
          <div className="absolute bottom-[-8px] right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
          <div className="absolute bottom-[-6px] right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-agriculture-green/20"></div>
        </Card>
      )}

      {/* Animated Mascot Character */}
      <div 
        className={`
          relative cursor-pointer select-none transform transition-all duration-300
          ${isAnimating ? 'scale-110 rotate-12' : 'scale-100'}
          hover:scale-105 animate-float
        `}
        onClick={handleMascotClick}
      >
        {/* Mascot Body with enhanced animation */}
        <div className={`w-16 h-16 rounded-full agriculture-gradient shadow-lg flex items-center justify-center border-4 border-white transition-all duration-300 ${isPlayingTutorial ? 'animate-pulse' : ''}`}>
          <span className={`text-2xl transition-transform duration-300 ${isPlayingTutorial ? 'animate-bounce' : 'animate-bounce-gentle'}`}>
            🦉
          </span>
        </div>

        {/* Enhanced interaction indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full transition-all duration-300 ${showTutorial ? 'bg-blue-500 animate-pulse' : 'bg-agriculture-sky animate-pulse-glow'}`}>
          {showTutorial ? (
            <BookOpen className="w-3 h-3 text-white m-0.5" />
          ) : (
            <MessageCircle className="w-3 h-3 text-white m-0.5" />
          )}
        </div>

        {/* Enhanced name tag with status */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border border-agriculture-green/20">
          <div className="text-center">
            <span className="text-xs font-medium text-agriculture-darkGreen block">Agro</span>
            <span className="text-xs text-muted-foreground">
              {showTutorial ? "Enseñando" : "Asistente"}
            </span>
          </div>
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
