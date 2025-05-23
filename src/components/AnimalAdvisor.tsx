
import { useState, useEffect } from "react";
import { X, MessageCircle, RefreshCw, Zap, Droplet, Sprout, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Tip {
  id: number;
  text: string;
  category: "water" | "energy" | "crops" | "climate";
  icon: React.ReactNode;
}

const AnimalAdvisor = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tipCategory, setTipCategory] = useState<"water" | "energy" | "crops" | "climate">("climate");

  const animalTips: Record<string, Tip[]> = {
    water: [
      { id: 1, text: "💧 Construye zanjas de infiltración en terrazas para capturar agua de lluvia y reducir la erosión.", category: "water", icon: <Droplet className="h-4 w-4" /> },
      { id: 2, text: "💧 Implementa sistemas de riego por goteo solar para optimizar el uso del agua en regiones secas.", category: "water", icon: <Droplet className="h-4 w-4" /> },
      { id: 3, text: "💧 Utiliza técnicas de cosecha de agua como qochas (pequeños reservorios) para almacenarla durante la época de lluvias.", category: "water", icon: <Droplet className="h-4 w-4" /> },
    ],
    energy: [
      { id: 4, text: "⚡ Instala pequeños paneles solares para alimentar sistemas de riego tecnificado y reducir costos.", category: "energy", icon: <Zap className="h-4 w-4" /> },
      { id: 5, text: "⚡ Considera molinos de viento tradicionales adaptados para generar energía para tus necesidades básicas.", category: "energy", icon: <Zap className="h-4 w-4" /> },
      { id: 6, text: "⚡ Utiliza bombas de agua solares para elevar agua desde ríos o pozos hasta tus cultivos en altura.", category: "energy", icon: <Zap className="h-4 w-4" /> },
    ],
    crops: [
      { id: 7, text: "🌱 Utiliza el sistema de waru waru (camellones) para controlar la temperatura y humedad del suelo.", category: "crops", icon: <Sprout className="h-4 w-4" /> },
      { id: 8, text: "🌱 Implementa cultivos mixtos como el tradicional sistema andino de cultivo de maíz, frijol y calabaza.", category: "crops", icon: <Sprout className="h-4 w-4" /> },
      { id: 9, text: "🌱 Usa variedades nativas de papa, quinua y otros cultivos andinos resistentes a las heladas.", category: "crops", icon: <Sprout className="h-4 w-4" /> },
    ],
    climate: [
      { id: 10, text: "🌦️ Observa los bioindicadores locales como el comportamiento de ciertos insectos para predecir heladas.", category: "climate", icon: <Sun className="h-4 w-4" /> },
      { id: 11, text: "🌦️ Utiliza terrazas en pendientes para crear microclimas y proteger cultivos de vientos fríos.", category: "climate", icon: <Sun className="h-4 w-4" /> },
      { id: 12, text: "🌦️ Consulta regularmente el pronóstico climático especializado en nuestra app para planificar siembras.", category: "climate", icon: <Sun className="h-4 w-4" /> },
    ]
  };

  useEffect(() => {
    // Show first tip after 3 seconds
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showBubble) {
      // Auto-hide bubble after 12 seconds
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 12000);

      return () => clearTimeout(timer);
    }
  }, [showBubble, currentTip]);

  const handleAnimalClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    if (showBubble) {
      // Change tip within same category
      const categoryTips = animalTips[tipCategory];
      const nextIndex = (currentTip + 1) % categoryTips.length;
      setCurrentTip(nextIndex);
    } else {
      // Show bubble
      setShowBubble(true);
    }
  };

  const closeBubble = () => {
    setShowBubble(false);
  };

  const changeCategory = (category: "water" | "energy" | "crops" | "climate") => {
    setTipCategory(category);
    setCurrentTip(0);
    setShowBubble(true);
  };

  const activeTips = animalTips[tipCategory];
  const currentActiveTip = activeTips[currentTip % activeTips.length];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-6 z-50">
      {/* Speech Bubble */}
      {showBubble && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-20 left-0 max-w-xs"
        >
          <Card className="p-4 bg-white shadow-lg border-2 border-agriculture-earth/20">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                {currentActiveTip.icon}
                <h4 className="font-semibold text-agriculture-earth text-sm">
                  Consejo Ancestral
                </h4>
              </div>
              <div className="flex space-x-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 p-0 hover:bg-agriculture-earth/10"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => changeCategory("water")}>
                      <Droplet className="h-4 w-4 mr-2" /> Agua
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeCategory("energy")}>
                      <Zap className="h-4 w-4 mr-2" /> Energía
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeCategory("crops")}>
                      <Sprout className="h-4 w-4 mr-2" /> Cultivos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeCategory("climate")}>
                      <Sun className="h-4 w-4 mr-2" /> Clima
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0 hover:bg-agriculture-earth/10"
                  onClick={closeBubble}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="max-h-32">
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentActiveTip.text}
              </p>
            </ScrollArea>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">
                Sabiduría andina ancestral
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs px-2 border-agriculture-earth/20 hover:bg-agriculture-earth/10 hover:text-agriculture-earth"
                onClick={() => {
                  const categoryTips = animalTips[tipCategory];
                  const nextIndex = (currentTip + 1) % categoryTips.length;
                  setCurrentTip(nextIndex);
                }}
              >
                Siguiente
              </Button>
            </div>

            {/* Speech bubble arrow */}
            <div className="absolute bottom-[-8px] left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
          </Card>
        </motion.div>
      )}

      {/* Animal Character */}
      <motion.div 
        className={`
          relative cursor-pointer select-none 
          hover:scale-105 transition-all duration-300
        `}
        animate={{ 
          scale: isAnimating ? 1.1 : 1,
          rotate: isAnimating ? [0, -5, 5, -3, 0] : 0 
        }}
        onClick={handleAnimalClick}
      >
        {/* Animal Body */}
        <div className="w-16 h-16 rounded-full bg-agriculture-earth shadow-lg flex items-center justify-center border-4 border-white">
          <span className="text-2xl">🦙</span>
        </div>

        {/* Interaction indicator */}
        <motion.div 
          className="absolute -top-1 -right-1 w-4 h-4 bg-agriculture-gold rounded-full"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <MessageCircle className="w-3 h-3 text-white m-0.5" />
        </motion.div>

        {/* Name tag */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-md border border-agriculture-earth/20">
          <span className="text-xs font-medium text-agriculture-earth">Wari</span>
        </div>
      </motion.div>

      {/* Hide animal button */}
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

export default AnimalAdvisor;
