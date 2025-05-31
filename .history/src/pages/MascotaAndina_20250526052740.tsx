import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Star, 
  Gift, 
  MessageCircle, 
  BookOpen, 
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  Settings,
  HelpCircle,
  Leaf,
  Sun,
  CloudRain,
  Sprout,
  Mountain,
  Wind,
  Snowflake,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Users,
  Globe,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  Navigation,
  Moon,
  Coins,
  ShoppingCart,
  Calendar,
  Plus,
  Clock,
  Trophy,
  Flame,
  Coffee,
  Apple,
  Gamepad2,
  Gem,
  Crown,
  Rocket,
  Brain,
  Wheat,
  Droplets,
  Thermometer,
  Eye,
  Minus,
  RefreshCw,
  Timer,
  AlertTriangle,
  Info,
  X,
  BarChart3
} from "lucide-react";

interface MascotState {
  mood: 'happy' | 'excited' | 'thinking' | 'sleeping' | 'working' | 'celebrating' | 'tired';
  energy: number;
  happiness: number;
  knowledge: number;
  level: number;
  experience: number;
  coins: number;
  streak: number;
  isAnimating: boolean;
  currentAnimation: string;
  lastInteraction: Date;
  totalInteractions: number;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  progress: number;
  target: number;
  reward: {
    coins: number;
    experience: number;
    item?: string;
  };
  completed: boolean;
  icon: React.ElementType;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'decoration' | 'food' | 'toy' | 'upgrade';
  icon: React.ElementType;
  effect: {
    happiness?: number;
    energy?: number;
    knowledge?: number;
  };
  owned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress: number;
  target: number;
  reward: {
    coins: number;
    experience: number;
    title?: string;
  };
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
}

interface Crop {
  id: string;
  name: string;
  type: 'papa' | 'quinua' | 'maiz' | 'habas' | 'oca' | 'ulluco';
  position: { x: number; y: number; gridX?: number; gridY?: number };
  size: { width: number; height: number };
  plantedDate: Date;
  harvestDate: Date;
  growth: number; // 0-100%
  health: number; // 0-100%
  techniques: string[];
  climateRisk: 'low' | 'medium' | 'high';
  emoji: string;
  color: string;
  hectares: number; // Campo agregado para hectáreas
}

interface NewCropForm {
  name: string;
  type: 'papa' | 'quinua' | 'maiz' | 'habas' | 'oca' | 'ulluco';
  hectares: number;
  plantedDate: Date;
  harvestDate: Date;
  techniques: string[];
  climateRisk: 'low' | 'medium' | 'high';
  irrigationMethod: 'riego_por_goteo' | 'aspersion' | 'inundacion' | 'manual' | 'lluvia' | 'other';
  irrigationOther?: string;
  fertilizerType: string;
  irrigationFrequency: 'diario' | 'cada_2_dias' | 'semanal' | 'quincenal' | 'mensual' | 'segun_necesidad';
  irrigationTime: 'madrugada' | 'manana' | 'mediodia' | 'tarde' | 'noche';
  cropLocation: 'ladera' | 'planicie' | 'valle' | 'terraza' | 'invernadero' | 'other';
  cropLocationOther?: string;
}

interface FormErrors {
  name?: string;
  type?: string;
  hectares?: string;
  plantedDate?: string;
  harvestDate?: string;
  techniques?: string;
  climateRisk?: string;
  irrigationMethod?: string;
  irrigationOther?: string;
  fertilizerType?: string;
  irrigationFrequency?: string;
  irrigationTime?: string;
  cropLocation?: string;
}

interface SustainableTechnique {
  id: string;
  name: string;
  description: string;
  type: 'water' | 'soil' | 'climate' | 'biodiversity';
  implemented: boolean;
  impact: number; // 1-5
  icon: React.ElementType;
  benefits: string[];
  commitment: boolean;
}

const MascotaAndinaPage = () => {
  const [mascotState, setMascotState] = useState<MascotState>({
    mood: 'happy',
    energy: 85,
    happiness: 90,
    knowledge: 75,
    level: 3,
    experience: 750,
    coins: 150,
    streak: 5,
    isAnimating: false,
    currentAnimation: 'idle',
    lastInteraction: new Date(),
    totalInteractions: 23
  });

  const [activeTab, setActiveTab] = useState('mascot');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // Estados para la parcela virtual
  const [crops, setCrops] = useState<Crop[]>([]);

  const [sustainableTechniques, setSustainableTechniques] = useState<SustainableTechnique[]>([
    {
      id: 'tech_1',
      name: 'Riego por Goteo',
      description: 'Sistema de riego eficiente que ahorra hasta 50% de agua',
      type: 'water',
      implemented: true,
      impact: 5,
      icon: Droplets,
      benefits: ['Ahorro de agua', 'Mejor crecimiento', 'Menos enfermedades'],
      commitment: true
    },
    {
      id: 'tech_2',
      name: 'Compostaje Orgánico',
      description: 'Producción de abono natural a partir de residuos orgánicos',
      type: 'soil',
      implemented: true,
      impact: 4,
      icon: Leaf,
      benefits: ['Suelo más fértil', 'Menos químicos', 'Reciclaje de residuos'],
      commitment: true
    },
    {
      id: 'tech_3',
      name: 'Terrazas Andinas',
      description: 'Construcción de terrazas para prevenir erosión',
      type: 'climate',
      implemented: false,
      impact: 5,
      icon: Mountain,
      benefits: ['Previene erosión', 'Conserva agua', 'Aumenta área cultivable'],
      commitment: true
    },
    {
      id: 'tech_4',
      name: 'Rotación de Cultivos',
      description: 'Alternancia de cultivos para mantener la fertilidad del suelo',
      type: 'soil',
      implemented: true,
      impact: 4,
      icon: RefreshCw,
      benefits: ['Suelo más sano', 'Control de plagas', 'Mayor productividad'],
      commitment: true
    },
    {
      id: 'tech_5',
      name: 'Captación de Agua de Lluvia',
      description: 'Sistema para recolectar y almacenar agua de lluvia',
      type: 'water',
      implemented: false,
      impact: 4,
      icon: CloudRain,
      benefits: ['Agua gratuita', 'Independencia hídrica', 'Resiliencia climática'],
      commitment: false
    },
    {
      id: 'tech_6',
      name: 'Corredores Biológicos',
      description: 'Espacios para conectar hábitats y promover biodiversidad',
      type: 'biodiversity',
      implemented: false,
      impact: 3,
      icon: Users,
      benefits: ['Más biodiversidad', 'Control natural de plagas', 'Polinización'],
      commitment: false
    }
  ]);

  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [selectedGridPosition, setSelectedGridPosition] = useState<{x: number, y: number} | null>(null);

  // Estados para el formulario de agregar cultivo
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [newCropForm, setNewCropForm] = useState<NewCropForm>({
    name: '',
    type: 'papa',
    hectares: 0,
    plantedDate: new Date(),
    harvestDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 meses por defecto
    techniques: [],
    climateRisk: 'medium'
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Misiones diarias y semanales
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'daily_1',
      title: 'Revisar el Clima del Día',
      description: 'Consulta las condiciones climáticas para planificar tu jornada agrícola',
      type: 'daily',
      progress: 0,
      target: 1,
      reward: { coins: 20, experience: 50, item: 'Semillas de Quinua' },
      completed: false,
      icon: CloudRain,
      difficulty: 'easy'
    },
    {
      id: 'daily_2',
      title: 'Cuidar a tu Compañero Agro',
      description: 'Comparte tu experiencia agrícola con Agro (5 veces)',
      type: 'daily',
      progress: 2,
      target: 5,
      reward: { coins: 30, experience: 75, item: 'Abono Natural' },
      completed: false,
      icon: Heart,
      difficulty: 'easy'
    },
    {
      id: 'daily_3',
      title: 'Consultar Consejos Agrícolas',
      description: 'Pide consejos sobre tus cultivos al asistente inteligente',
      type: 'daily',
      progress: 0,
      target: 1,
      reward: { coins: 40, experience: 100, item: 'Manual de Cultivos' },
      completed: false,
      icon: Brain,
      difficulty: 'medium'
    },
    {
      id: 'daily_4',
      title: 'Monitorear tus Cultivos',
      description: 'Revisa el estado de tus plantas usando el monitoreo satelital',
      type: 'daily',
      progress: 0,
      target: 1,
      reward: { coins: 35, experience: 80, item: 'Fertilizante Orgánico' },
      completed: false,
      icon: Sprout,
      difficulty: 'easy'
    },
    {
      id: 'weekly_1',
      title: 'Agricultor Experimentado',
      description: 'Usa la aplicación 7 días seguidos para mejorar tus cultivos',
      type: 'weekly',
      progress: 5,
      target: 7,
      reward: { coins: 200, experience: 500, item: 'Certificado de Agricultor Digital' },
      completed: false,
      icon: Trophy,
      difficulty: 'hard'
    },
    {
      id: 'weekly_2',
      title: 'Protector del Clima',
      description: 'Revisa alertas climáticas y protege tus cultivos toda la semana',
      type: 'weekly',
      progress: 3,
      target: 7,
      reward: { coins: 250, experience: 600, item: 'Kit de Protección Climática' },
      completed: false,
      icon: Shield,
      difficulty: 'hard'
    }
  ]);

  // Tienda de items
  const [shopItems, setShopItems] = useState<ShopItem[]>([
    {
      id: 'food_1',
      name: 'Granos de Quinua',
      description: 'Alimento nutritivo que da energía a Agro para ayudarte mejor',
      price: 50,
      type: 'food',
      icon: Wheat,
      effect: { energy: 20 },
      owned: false,
      rarity: 'common'
    },
    {
      id: 'food_2',
      name: 'Miel de Abeja Andina',
      description: 'Endulza el día de Agro y lo pone contento para darte mejores consejos',
      price: 75,
      type: 'food',
      icon: Apple,
      effect: { happiness: 25 },
      owned: false,
      rarity: 'common'
    },
    {
      id: 'food_3',
      name: 'Maíz Tostado',
      description: 'Snack tradicional que aumenta la sabiduría agrícola de Agro',
      price: 60,
      type: 'food',
      icon: Coffee,
      effect: { knowledge: 15, energy: 10 },
      owned: false,
      rarity: 'common'
    },
    {
      id: 'tool_1',
      name: 'Herramientas de Campo',
      description: 'Set de herramientas que ayuda a Agro a entender mejor tu trabajo',
      price: 120,
      type: 'toy',
      icon: Settings,
      effect: { happiness: 15, knowledge: 20 },
      owned: false,
      rarity: 'rare'
    },
    {
      id: 'decoration_1',
      name: 'Huerto Miniatura',
      description: 'Un pequeño jardín que recuerda a Agro los cultivos reales',
      price: 200,
      type: 'decoration',
      icon: Sprout,
      effect: { happiness: 30, energy: 10 },
      owned: false,
      rarity: 'epic'
    },
    {
      id: 'decoration_2',
      name: 'Terraza Andina',
      description: 'Replica de las terrazas incas que inspira a Agro',
      price: 180,
      type: 'decoration',
      icon: Mountain,
      effect: { knowledge: 25, happiness: 15 },
      owned: false,
      rarity: 'epic'
    },
    {
      id: 'upgrade_1',
      name: 'Sabiduría Ancestral',
      description: 'Conocimiento tradicional que mejora los consejos de Agro por 1 día',
      price: 300,
      type: 'upgrade',
      icon: BookOpen,
      effect: { knowledge: 50 },
      owned: false,
      rarity: 'legendary'
    },
    {
      id: 'upgrade_2',
      name: 'Conexión Satelital',
      description: 'Mejora la precisión de las predicciones climáticas de Agro',
      price: 350,
      type: 'upgrade',
      icon: Globe,
      effect: { knowledge: 40, energy: 20 },
      owned: false,
      rarity: 'legendary'
    }
  ]);

  // Logros y achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_friend',
      name: 'Primer Compañero',
      description: 'Conociste a Agro, tu asistente agrícola virtual',
      icon: Heart,
      unlocked: true,
      progress: 1,
      target: 1,
      reward: { coins: 50, experience: 100, title: 'Nuevo Agricultor Digital' },
      rarity: 'bronze'
    },
    {
      id: 'daily_farmer',
      name: 'Agricultor Constante',
      description: 'Comparte tu experiencia con Agro 25 veces',
      icon: Sprout,
      unlocked: mascotState.totalInteractions >= 25,
      progress: mascotState.totalInteractions,
      target: 25,
      reward: { coins: 150, experience: 300, title: 'Compañero de Campo' },
      rarity: 'bronze'
    },
    {
      id: 'weather_watcher',
      name: 'Observador del Clima',
      description: 'Consulta el clima 15 días seguidos para proteger tus cultivos',
      icon: CloudRain,
      unlocked: mascotState.streak >= 15,
      progress: mascotState.streak,
      target: 15,
      reward: { coins: 200, experience: 400, title: 'Protector de Cultivos' },
      rarity: 'silver'
    },
    {
      id: 'wise_farmer',
      name: 'Agricultor Sabio',
      description: 'Alcanza 100 puntos de conocimiento agrícola',
      icon: BookOpen,
      unlocked: mascotState.knowledge >= 100,
      progress: mascotState.knowledge,
      target: 100,
      reward: { coins: 300, experience: 750, title: 'Maestro de Cultivos' },
      rarity: 'gold'
    },
    {
      id: 'climate_guardian',
      name: 'Guardián del Clima',
      description: 'Mantén una racha de 30 días cuidando tus cultivos',
      icon: Shield,
      unlocked: mascotState.streak >= 30,
      progress: mascotState.streak,
      target: 30,
      reward: { coins: 500, experience: 1000, title: 'Agricultor Resiliente' },
      rarity: 'gold'
    },
    {
      id: 'andean_master',
      name: 'Maestro Andino',
      description: 'Domina todas las técnicas de agricultura andina',
      icon: Mountain,
      unlocked: mascotState.level >= 10 && mascotState.knowledge >= 150,
      progress: mascotState.level >= 10 ? mascotState.knowledge : 0,
      target: 150,
      reward: { coins: 800, experience: 1500, title: 'Sabio de los Andes' },
      rarity: 'diamond'
    },
    {
      id: 'community_leader',
      name: 'Líder Comunitario',
      description: 'Ayuda a otros agricultores compartiendo tu experiencia',
      icon: Users,
      unlocked: false,
      progress: 0,
      target: 10,
      reward: { coins: 400, experience: 800, title: 'Mentor Agrícola' },
      rarity: 'gold'
    },
    {
      id: 'tech_adopter',
      name: 'Innovador Rural',
      description: 'Usa todas las herramientas tecnológicas de la aplicación',
      icon: Rocket,
      unlocked: false,
      progress: 3,
      target: 5,
      reward: { coins: 350, experience: 700, title: 'Agricultor del Futuro' },
      rarity: 'silver'
    }
  ]);

  // Animaciones de la mascota 2D
  const mascotAnimations = {
    idle: { emoji: '🦉', animation: 'bounce' },
    happy: { emoji: '😊🦉', animation: 'pulse' },
    excited: { emoji: '🤩🦉', animation: 'wiggle' },
    thinking: { emoji: '🤔🦉', animation: 'tilt' },
    sleeping: { emoji: '😴🦉', animation: 'slow-bounce' },
    working: { emoji: '💪🦉', animation: 'shake' },
    celebrating: { emoji: '🎉🦉', animation: 'jump' },
    tired: { emoji: '😵🦉', animation: 'sway' },
    eating: { emoji: '😋🦉', animation: 'munch' },
    playing: { emoji: '🤸🦉', animation: 'spin' }
  };

  // Efectos de sonido (simulados)
  const playSound = (type: 'click' | 'reward' | 'level_up' | 'purchase') => {
    if (!soundEnabled) return;
    // Aquí iría la lógica de sonido real
    console.log(`Playing sound: ${type}`);
  };

  // Función para interactuar con la mascota
  const handleMascotInteraction = () => {
    playSound('click');
    
    // Mensajes aleatorios de interacción agrícola
    const farmingMessages = [
      "¡Agro aprendió sobre tus cultivos de papa! 🥔",
      "¡Compartiste tu experiencia con quinua! 🌾",
      "¡Agro ahora sabe más sobre el riego! 💧",
      "¡Le contaste sobre las heladas! ❄️",
      "¡Agro aprendió sobre abonos naturales! 🌱",
      "¡Compartiste técnicas de siembra! 🌰",
      "¡Agro conoce mejor el clima andino! 🏔️",
      "¡Le enseñaste sobre plagas! 🐛",
      "¡Agro aprendió sobre cosecha! 🚜",
      "¡Compartiste sabiduría ancestral! 📚"
    ];
    
    const randomMessage = farmingMessages[Math.floor(Math.random() * farmingMessages.length)];
    
    setMascotState(prev => {
      const newHappiness = Math.min(100, prev.happiness + 5);
      const newKnowledge = Math.min(100, prev.knowledge + 3);
      const newExperience = prev.experience + 15;
      const newLevel = Math.floor(newExperience / 1000) + 1;
      
      if (newLevel > prev.level) {
        playSound('level_up');
        addNotification(`¡Agro subió al nivel ${newLevel}! Ahora puede darte mejores consejos agrícolas 🎉`);
      }

      return {
        ...prev,
        isAnimating: true,
        currentAnimation: 'happy',
        happiness: newHappiness,
        knowledge: newKnowledge,
        experience: newExperience,
        level: newLevel,
        totalInteractions: prev.totalInteractions + 1,
        lastInteraction: new Date()
      };
    });

    // Mostrar mensaje de interacción
    addNotification(randomMessage);
    
    // Actualizar progreso de misiones
    updateMissionProgress('daily_2', 1);
    
    setTimeout(() => {
      setMascotState(prev => ({
        ...prev,
        isAnimating: false,
        currentAnimation: 'idle'
      }));
    }, 2000);
  };

  // Función para alimentar la mascota
  const feedMascot = (item: ShopItem) => {
    if (mascotState.coins < item.price) {
      addNotification('No tienes suficientes semillas 🌱');
      return;
    }

    playSound('purchase');
    
    const feedingMessages = [
      `¡Agro disfrutó los ${item.name}! Ahora puede ayudarte mejor con tus cultivos ✨`,
      `¡A Agro le encantó el ${item.name}! Su conocimiento agrícola aumentó 🌾`,
      `¡Agro está feliz con el ${item.name}! Ahora tiene más energía para aconsejarte 💪`,
      `¡El ${item.name} le dio mucha sabiduría a Agro sobre agricultura andina! 🏔️`
    ];
    
    const randomFeedingMessage = feedingMessages[Math.floor(Math.random() * feedingMessages.length)];
    
    setMascotState(prev => ({
      ...prev,
      coins: prev.coins - item.price,
      energy: Math.min(100, prev.energy + (item.effect.energy || 0)),
      happiness: Math.min(100, prev.happiness + (item.effect.happiness || 0)),
      knowledge: Math.min(100, prev.knowledge + (item.effect.knowledge || 0)),
      currentAnimation: 'eating'
    }));

    addNotification(randomFeedingMessage);
    
    setTimeout(() => {
      setMascotState(prev => ({
        ...prev,
        currentAnimation: 'happy'
      }));
    }, 3000);
  };

  // Función para actualizar progreso de misiones
  const updateMissionProgress = (missionId: string, amount: number) => {
    setMissions(prev => prev.map(mission => {
      if (mission.id === missionId && !mission.completed) {
        const newProgress = Math.min(mission.target, mission.progress + amount);
        const completed = newProgress >= mission.target;
        
        if (completed && !mission.completed) {
          playSound('reward');
          setMascotState(prevState => ({
            ...prevState,
            coins: prevState.coins + mission.reward.coins,
            experience: prevState.experience + mission.reward.experience
          }));
          addNotification(`¡Tarea completada! +${mission.reward.coins} semillas 🌱 ${mission.reward.item ? `+${mission.reward.item}` : ''}`);
        }
        
        return { ...mission, progress: newProgress, completed };
      }
      return mission;
    }));
  };

  // Función para agregar notificaciones
  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  // Función para comprar items
  const purchaseItem = (item: ShopItem) => {
    if (mascotState.coins < item.price) {
      addNotification('No tienes suficientes semillas 🌱');
      return;
    }

    playSound('purchase');
    
    const purchaseMessages = [
      `¡Conseguiste ${item.name}! Agro está emocionado de usarlo 🎉`,
      `¡Excelente compra! ${item.name} ayudará mucho en tu trabajo agrícola 🚜`,
      `¡Agro está feliz con ${item.name}! Ahora puede darte mejores consejos 🌾`,
      `¡Buena inversión! ${item.name} mejorará tu experiencia agrícola 💪`
    ];
    
    const randomPurchaseMessage = purchaseMessages[Math.floor(Math.random() * purchaseMessages.length)];
    
    setMascotState(prev => ({
      ...prev,
      coins: prev.coins - item.price
    }));

    setShopItems(prev => prev.map(shopItem => 
      shopItem.id === item.id ? { ...shopItem, owned: true } : shopItem
    ));

    addNotification(randomPurchaseMessage);
  };

  // Función para obtener el color del mood
  const getMascotMoodColor = () => {
    switch (mascotState.mood) {
      case 'happy': return 'from-green-400 to-emerald-500';
      case 'excited': return 'from-yellow-400 to-orange-500';
      case 'thinking': return 'from-purple-400 to-pink-500';
      case 'sleeping': return 'from-blue-400 to-indigo-500';
      case 'working': return 'from-orange-400 to-red-500';
      case 'celebrating': return 'from-pink-400 to-rose-500';
      case 'tired': return 'from-gray-400 to-slate-500';
      default: return 'from-green-400 to-emerald-500';
    }
  };

  // Funciones para la gestión de cultivos
  const getCropTypeInfo = (type: string) => {
    const cropTypes = {
      papa: { emoji: '🥔', color: 'bg-yellow-200' },
      quinua: { emoji: '🌾', color: 'bg-green-200' },
      maiz: { emoji: '🌽', color: 'bg-purple-200' },
      habas: { emoji: '🫘', color: 'bg-green-300' },
      oca: { emoji: '🟠', color: 'bg-orange-200' },
      ulluco: { emoji: '🟡', color: 'bg-yellow-300' }
    };
    return cropTypes[type as keyof typeof cropTypes] || cropTypes.papa;
  };

  const generateUniqueId = () => {
    return `crop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const findAvailablePosition = () => {
    // Buscar una posición libre en la parcela (evitando superposiciones)
    const maxAttempts = 50;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const x = Math.random() * 70 + 10; // Entre 10% y 80%
      const y = Math.random() * 60 + 20; // Entre 20% y 80%
      
      // Verificar si la posición está libre (no se superpone con otros cultivos)
      const hasCollision = crops.some(crop => {
        const distance = Math.sqrt(
          Math.pow(crop.position.x - x, 2) + Math.pow(crop.position.y - y, 2)
        );
        return distance < 25; // Distancia mínima entre cultivos
      });
      
      if (!hasCollision) {
        return { x, y };
      }
      
      attempts++;
    }
    
    // Si no se encuentra una posición libre, devolver una posición aleatoria
    return {
      x: Math.random() * 70 + 10,
      y: Math.random() * 60 + 20
    };
  };

  const validateCropForm = (form: NewCropForm): FormErrors => {
    const errors: FormErrors = {};
    
    if (!form.name.trim()) {
      errors.name = 'El nombre del cultivo es obligatorio';
    }
    
    if (form.hectares <= 0 || form.hectares > 100) {
      errors.hectares = 'Las hectáreas deben ser entre 0.1 y 100';
    }
    
    if (form.plantedDate >= form.harvestDate) {
      errors.harvestDate = 'La fecha de cosecha debe ser posterior a la de siembra';
    }
    
    if (form.techniques.length === 0) {
      errors.techniques = 'Debe seleccionar al menos una técnica sostenible';
    }
    
    return errors;
  };

  const handleFormChange = (field: keyof NewCropForm, value: any) => {
    setNewCropForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores del campo modificado
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleTechniqueToggle = (technique: string) => {
    setNewCropForm(prev => ({
      ...prev,
      techniques: prev.techniques.includes(technique)
        ? prev.techniques.filter(t => t !== technique)
        : [...prev.techniques, technique]
    }));
  };

  const handleGridClick = (gridX: number, gridY: number) => {
    setSelectedGridPosition({ x: gridX, y: gridY });
    setShowAddCropModal(true);
  };

  // Función IA para evaluar automáticamente el riesgo climático
  const evaluateClimateRisk = (form: NewCropForm): 'low' | 'medium' | 'high' => {
    const cropInfo = getCropTypeInfo(form.type);
    let riskScore = 0;

    // Factor 1: Tipo de cultivo (resistencia natural)
    const cropRiskFactors: Record<string, number> = {
      'papa': 2,     // Medianamente resistente
      'maiz': 3,     // Susceptible a sequías
      'quinua': 1,   // Muy resistente
      'habas': 2,    // Medianamente resistente
      'oca': 1,      // Resistente al frío
      'ulluco': 1,   // Resistente
      'cebada': 2,   // Moderadamente resistente
      'trigo': 3,    // Susceptible a variaciones
      'tomate': 4,   // Muy susceptible
      'cebolla': 2,  // Resistente
      'zanahoria': 2 // Moderadamente resistente
    };
    riskScore += cropRiskFactors[form.type] || 2;

    // Factor 2: Técnicas sostenibles aplicadas (reducen riesgo)
    const sustainableTechniques = [
      'Rotación de cultivos',
      'Riego por goteo',
      'Manejo integrado de plagas',
      'Terrazas andinas',
      'Control biológico',
      'Asociación de cultivos'
    ];
    const appliedSustainableTechniques = form.techniques.filter(t => 
      sustainableTechniques.includes(t)
    ).length;
    riskScore -= Math.min(appliedSustainableTechniques * 0.5, 2);

    // Factor 3: Época de siembra (mes actual vs optimal)
    const currentMonth = new Date().getMonth();
    const plantMonth = form.plantedDate.getMonth();
    const optimalMonths: Record<string, number[]> = {
      'papa': [8, 9, 10], // Sep-Nov
      'maiz': [9, 10, 11], // Oct-Dic
      'quinua': [8, 9, 10], // Sep-Nov
      'habas': [2, 3, 4],   // Mar-May
      'oca': [8, 9],        // Sep-Oct
      'ulluco': [8, 9, 10], // Sep-Nov
      'cebada': [4, 5, 6],  // May-Jul
      'trigo': [4, 5],      // May-Jun
      'tomate': [8, 9],     // Sep-Oct
      'cebolla': [7, 8],    // Ago-Sep
      'zanahoria': [2, 3, 8, 9] // Mar-Abr, Sep-Oct
    };
    
    const optimal = optimalMonths[form.type] || [currentMonth];
    if (!optimal.includes(plantMonth)) {
      riskScore += 1;
    }

    // Factor 4: Densidad de cultivos (hectáreas)
    if (form.hectares > 5) {
      riskScore += 1; // Mayor área = mayor riesgo de pérdidas
    }

    // Determinar nivel de riesgo final
    if (riskScore <= 2) return 'low';
    if (riskScore <= 4) return 'medium';
    return 'high';
  };

  const handleAddCrop = () => {
    const errors = validateCropForm(newCropForm);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const cropInfo = getCropTypeInfo(newCropForm.type);
    
    // Usar posición de cuadrícula seleccionada o encontrar una posición libre
    let position;
    if (selectedGridPosition) {
      // Convertir coordenadas de cuadrícula a porcentajes
      // Cada celda ocupa exactamente 12.5% de ancho (100%/8) y 16.67% de alto (100%/6)
      // Posicionamos el cultivo para que coincida exactamente con la celda seleccionada
      position = {
        x: selectedGridPosition.x * 12.5, // Inicio de la celda
        y: selectedGridPosition.y * 16.67, // Inicio de la celda
        gridX: selectedGridPosition.x,
        gridY: selectedGridPosition.y
      };
    } else {
      const fallbackPosition = findAvailablePosition();
      position = {
        ...fallbackPosition,
        gridX: Math.floor(fallbackPosition.x / 12.5),
        gridY: Math.floor(fallbackPosition.y / 16.67)
      };
    }

    // Evaluar riesgo climático automáticamente con IA
    const aiClimateRisk = evaluateClimateRisk(newCropForm);
    
    const newCrop: Crop = {
      id: generateUniqueId(),
      name: newCropForm.name,
      type: newCropForm.type,
      position,
      size: { 
        width: 12.5,  // Tamaño exacto de la celda (100%/8 columnas)
        height: 16.67  // Tamaño exacto de la celda (100%/6 filas)
      },
      plantedDate: newCropForm.plantedDate,
      harvestDate: newCropForm.harvestDate,
      growth: Math.floor(Math.random() * 30) + 10, // Crecimiento inicial aleatorio 10-40%
      health: Math.floor(Math.random() * 20) + 80, // Salud inicial 80-100%
      techniques: newCropForm.techniques,
      climateRisk: aiClimateRisk, // IA determina el riesgo automáticamente
      emoji: cropInfo.emoji,
      color: cropInfo.color,
      hectares: newCropForm.hectares
    };
    
    setCrops(prev => [...prev, newCrop]);
    
    // Resetear formulario y estados
    setNewCropForm({
      name: '',
      type: 'papa',
      hectares: 0,
      plantedDate: new Date(),
      harvestDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      techniques: [],
      climateRisk: 'medium'
    });
    
    setFormErrors({});
    setSelectedGridPosition(null);
    setShowAddCropModal(false);
    
    // Mostrar notificaciones de éxito
    addNotification(`¡Cultivo ${newCrop.name} agregado exitosamente! 🌱`);
    
    // Mostrar evaluación de IA del riesgo climático
    const riskMessages = {
      'low': '🟢 IA determinó: Riesgo Climático BAJO - Condiciones favorables para tu cultivo',
      'medium': '🟡 IA determinó: Riesgo Climático MEDIO - Condiciones normales, monitorear regularmente',
      'high': '🔴 IA determinó: Riesgo Climático ALTO - Considera técnicas adicionales de protección'
    };
    setTimeout(() => {
      addNotification(riskMessages[aiClimateRisk]);
    }, 1500);
    
    // Dar experiencia y monedas por agregar cultivo
    setMascotState(prev => ({
      ...prev,
      experience: prev.experience + 25,
      coins: prev.coins + 10
    }));
  };

  // Función para obtener la animación CSS
  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case 'bounce': return 'animate-bounce';
      case 'pulse': return 'animate-pulse';
      case 'wiggle': return 'animate-wiggle';
      case 'tilt': return 'animate-tilt';
      case 'slow-bounce': return 'animate-slow-bounce';
      case 'shake': return 'animate-shake';
      case 'jump': return 'animate-jump';
      case 'sway': return 'animate-sway';
      case 'munch': return 'animate-munch';
      case 'spin': return 'animate-spin';
      default: return '';
    }
  };

  // Efecto para actualizar el mood basado en las estadísticas
  useEffect(() => {
    const updateMood = () => {
      if (mascotState.energy < 20) {
        setMascotState(prev => ({ ...prev, mood: 'tired' }));
      } else if (mascotState.happiness > 80) {
        setMascotState(prev => ({ ...prev, mood: 'happy' }));
      } else if (mascotState.knowledge > 90) {
        setMascotState(prev => ({ ...prev, mood: 'thinking' }));
      } else {
        setMascotState(prev => ({ ...prev, mood: 'happy' }));
      }
    };

    const interval = setInterval(updateMood, 5000);
    return () => clearInterval(interval);
  }, [mascotState.energy, mascotState.happiness, mascotState.knowledge]);

  return (
    <div className="space-y-6 relative">
      {/* Notificaciones */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              {notification}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-agriculture-terracotta to-agriculture-earth bg-clip-text text-transparent">
            Agro - Tu Asistente Agrícola
          </h1>
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Tu compañero virtual que aprende de tu experiencia agrícola. Comparte tu sabiduría del campo 
          y recibe consejos personalizados para mejorar tus cultivos y protegerlos del clima.
        </p>
        
        {/* Estadísticas principales */}
        <div className="flex justify-center gap-6">
                      <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Coins className="h-4 w-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">{mascotState.coins} semillas</span>
            </div>
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-800">Nivel {mascotState.level}</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
            <Flame className="h-4 w-4 text-orange-600" />
            <span className="font-semibold text-orange-800">{mascotState.streak} días</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="mascot" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Mi Mascota
          </TabsTrigger>
          <TabsTrigger value="farm" className="flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            Mi Parcela
          </TabsTrigger>
          <TabsTrigger value="missions" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Misiones
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Tienda
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Logros
          </TabsTrigger>
        </TabsList>

        {/* Tab: Mi Mascota */}
        <TabsContent value="mascot" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mascota Principal */}
            <div className="lg:col-span-2">
              <Card className="relative overflow-hidden">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Agro - Asistente Agrícola Andino
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </CardTitle>
                  <CardDescription>
                    Nivel {mascotState.level} de Conocimiento Agrícola • {mascotState.experience % 1000}/1000 XP para mejorar
                  </CardDescription>
                  <Progress value={(mascotState.experience % 1000) / 10} className="h-2" />
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Mascota Animada 2D */}
                  <div className="flex justify-center">
                    <motion.div
                      className="relative cursor-pointer select-none"
                      onClick={handleMascotInteraction}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Cuerpo principal de la mascota */}
                      <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getMascotMoodColor()} shadow-2xl flex items-center justify-center border-4 border-white relative overflow-hidden`}>
                        {/* Imagen 2D animada de la mascota */}
                        <motion.div
                          className="text-8xl"
                          animate={{
                            y: mascotState.isAnimating ? [-5, 5, -5] : [0, -8, 0],
                            rotate: mascotState.isAnimating ? [0, 10, -10, 0] : [0, 2, -2, 0],
                            scale: mascotState.isAnimating ? [1, 1.1, 1] : [1, 1.02, 1]
                          }}
                          transition={{
                            duration: mascotState.isAnimating ? 0.6 : 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                                                     {(mascotAnimations[mascotState.currentAnimation as keyof typeof mascotAnimations] as any)?.emoji || '🦉'}
                        </motion.div>
                        
                        {/* Efectos de partículas al interactuar */}
                        {mascotState.isAnimating && (
                          <>
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              initial={{ scale: 1, opacity: 0.8 }}
                              animate={{ scale: 1.8, opacity: 0 }}
                              transition={{ duration: 1.5 }}
                            >
                              <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-30"></div>
                            </motion.div>
                            
                            {/* Corazones flotantes */}
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute text-red-500 text-2xl"
                                initial={{ 
                                  x: Math.random() * 40 - 20, 
                                  y: 0, 
                                  opacity: 1,
                                  scale: 0 
                                }}
                                animate={{ 
                                  y: -60, 
                                  opacity: 0,
                                  scale: 1
                                }}
                                transition={{ 
                                  duration: 2,
                                  delay: i * 0.2
                                }}
                              >
                                ❤️
                              </motion.div>
                            ))}
                          </>
                        )}
                      </div>
                      
                      {/* Indicador de estado */}
                      <motion.div 
                        className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {mascotState.mood === 'happy' && <Heart className="h-5 w-5 text-red-500" />}
                        {mascotState.mood === 'excited' && <Star className="h-5 w-5 text-yellow-500" />}
                        {mascotState.mood === 'thinking' && <Brain className="h-5 w-5 text-purple-500" />}
                        {mascotState.mood === 'sleeping' && <Moon className="h-5 w-5 text-blue-500" />}
                        {mascotState.mood === 'working' && <Zap className="h-5 w-5 text-orange-500" />}
                        {mascotState.mood === 'celebrating' && <Trophy className="h-5 w-5 text-gold-500" />}
                        {mascotState.mood === 'tired' && <Coffee className="h-5 w-5 text-brown-500" />}
                      </motion.div>

                      {/* Indicador de nivel */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-agriculture-terracotta text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        Nivel {mascotState.level}
                      </div>
                    </motion.div>
                  </div>

                  {/* Estadísticas detalladas */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium">Energía</span>
                      </div>
                      <Progress value={mascotState.energy} className="h-3" />
                      <span className="text-sm font-bold text-yellow-600">{mascotState.energy}/100</span>
                      <p className="text-xs text-muted-foreground">
                        {mascotState.energy > 80 ? '¡Listo para ayudarte en el campo!' : 
                         mascotState.energy > 50 ? 'Con energía para dar consejos' : 
                         mascotState.energy > 20 ? 'Un poco cansado, dale quinua' : '¡Necesita alimento nutritivo!'}
                      </p>
                      <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-800 font-medium">
                          <Lightbulb className="h-3 w-3 inline mr-1" />
                          Energía Alta: Podrás pedir más recomendaciones personalizadas
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium">Felicidad</span>
                      </div>
                      <Progress value={mascotState.happiness} className="h-3" />
                      <span className="text-sm font-bold text-red-600">{mascotState.happiness}/100</span>
                      <p className="text-xs text-muted-foreground">
                        {mascotState.happiness > 80 ? '¡Emocionado de ayudarte!' : 
                         mascotState.happiness > 50 ? 'Contento de aprender contigo' : 
                         mascotState.happiness > 20 ? 'Necesita más interacción' : '¡Comparte tu experiencia!'}
                      </p>
                      <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-800 font-medium">
                          <Timer className="h-3 w-3 inline mr-1" />
                          Felicidad Alta: Las respuestas serán más rápidas
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-1">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">Conocimiento</span>
                      </div>
                      <Progress value={mascotState.knowledge} className="h-3" />
                      <span className="text-sm font-bold text-blue-600">{mascotState.knowledge}/100</span>
                      <p className="text-xs text-muted-foreground">
                        {mascotState.knowledge > 80 ? '¡Experto en agricultura andina!' : 
                         mascotState.knowledge > 50 ? 'Conoce bien los cultivos' : 
                         mascotState.knowledge > 20 ? 'Aprendiendo sobre el campo' : '¡Enséñale sobre tus cultivos!'}
                      </p>
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800 font-medium">
                          <Brain className="h-3 w-3 inline mr-1" />
                          Conocimiento Alto: Ampliamos mucho más nuestra base de datos
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nota explicativa */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800 mb-1">
                          ¿Por qué cuidar a Agro?
                        </p>
                        <p className="text-xs text-green-700">
                          Estas estadísticas incentivan el uso adecuado de la plataforma. Mientras más interactúes 
                          y uses las herramientas agrícolas, mejor será la experiencia y más precisos los consejos 
                          que recibirás para tus cultivos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones rápidas */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={handleMascotInteraction} 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      <Sprout className="h-5 w-5 mr-2" />
                      Compartir Experiencia (+5 ❤️ +3 🧠)
                    </Button>
                    <Button 
                      onClick={() => feedMascot(shopItems[0])} 
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      size="lg"
                      disabled={mascotState.coins < shopItems[0].price}
                    >
                      <Wheat className="h-5 w-5 mr-2" />
                      Dar Quinua ({shopItems[0].price} 🪙)
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('missions')} 
                      variant="outline"
                      size="lg"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Ver Misiones
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('shop')} 
                      variant="outline"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Ir a Tienda
                    </Button>
                  </div>

                  {/* Controles adicionales */}
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel de información */}
            <div className="space-y-4">
              {/* Estado actual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                    Estado Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Humor:</span>
                    <Badge className={`${
                      mascotState.mood === 'happy' ? 'bg-green-100 text-green-800' :
                      mascotState.mood === 'excited' ? 'bg-yellow-100 text-yellow-800' :
                      mascotState.mood === 'thinking' ? 'bg-purple-100 text-purple-800' :
                      mascotState.mood === 'sleeping' ? 'bg-blue-100 text-blue-800' :
                      mascotState.mood === 'tired' ? 'bg-gray-100 text-gray-800' :
                      'bg-pink-100 text-pink-800'
                    }`}>
                      {mascotState.mood === 'happy' ? '😊 Feliz' :
                       mascotState.mood === 'excited' ? '🤩 Emocionado' :
                       mascotState.mood === 'thinking' ? '🤔 Pensativo' :
                       mascotState.mood === 'sleeping' ? '😴 Durmiendo' :
                       mascotState.mood === 'tired' ? '😵 Cansado' :
                       '🎉 Celebrando'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Última interacción:</span>
                    <span className="text-xs text-muted-foreground">Hace 2 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total interacciones:</span>
                    <Badge variant="secondary">{mascotState.totalInteractions}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Racha actual:</span>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-bold">{mascotState.streak} días</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Beneficios del nivel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Beneficios Nivel {mascotState.level}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>+{mascotState.level * 10}% XP en misiones</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>+{mascotState.level * 5} monedas diarias</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Acceso a items nivel {mascotState.level}</span>
                  </div>
                  {mascotState.level >= 5 && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span>Consejos IA premium</span>
                    </div>
                  )}
                  {mascotState.level >= 10 && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-gold-500" />
                      <span>Predicciones climáticas avanzadas</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Próximo nivel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Próximo Nivel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso:</span>
                      <span>{mascotState.experience % 1000}/1000 XP</span>
                    </div>
                    <Progress value={(mascotState.experience % 1000) / 10} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Faltan {1000 - (mascotState.experience % 1000)} XP para el nivel {mascotState.level + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Mi Parcela Virtual */}
        <TabsContent value="farm" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Sprout className="h-6 w-6 text-green-600" />
              Mi Parcela Virtual
              <Mountain className="h-6 w-6 text-brown-600" />
            </h2>
            <p className="text-muted-foreground">
              Visualiza tus cultivos, técnicas sostenibles y compromisos climáticos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mapa 2D de la Parcela */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-500" />
                    Mi Parcela Virtual - Estilo FarmVille
                  </CardTitle>
                  <CardDescription>
                    Haz clic en una parcela para ver detalles de tus cultivos y técnicas aplicadas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Botón flotante para añadir cultivos */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Mi Parcela Virtual</h3>
                      <p className="text-sm text-muted-foreground">Haz clic en una parcela vacía para plantar un cultivo</p>
                    </div>
                    <motion.button
                      onClick={() => setShowAddCropModal(true)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="h-5 w-5" />
                      Añadir Cultivo
                    </motion.button>
                  </div>

                  {/* Parcela Virtual con Cuadrícula Clickeable */}
                  <div className="relative w-full h-80 bg-gradient-to-br from-green-300 to-green-500 rounded-lg border-2 border-green-200 overflow-hidden">
                    {/* Fondo de pasto */}
                    <div className="absolute inset-0 bg-green-400">
                      {/* Patrón de pasto */}
                      <div className="absolute inset-0 opacity-30">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-green-600 rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`
                            }}
                          ></div>
                        ))}
                      </div>
                      
                      {/* Cuadrícula de parcelas clickeables */}
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 p-2">
                        {[...Array(48)].map((_, index) => {
                          const row = Math.floor(index / 8);
                          const col = index % 8;
                          const isOccupied = crops.some(crop => 
                            crop.position.gridX === col && crop.position.gridY === row
                          );
                          
                          return (
                            <motion.div
                              key={index}
                              className={`
                                border border-green-600 border-opacity-40 rounded cursor-pointer transition-all duration-200
                                ${isOccupied 
                                  ? 'bg-brown-200 bg-opacity-50' 
                                  : 'hover:bg-green-200 hover:bg-opacity-50 hover:border-green-700'
                                }
                              `}
                              onClick={() => !isOccupied && handleGridClick(col, row)}
                              whileHover={!isOccupied ? { scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.2)" } : {}}
                              whileTap={!isOccupied ? { scale: 0.95 } : {}}
                            >
                              {!isOccupied && (
                                <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <Plus className="h-4 w-4 text-green-700" />
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>                         {/* Parcelas de Cultivos Animadas */}
                     {crops.map((crop) => (
                       <motion.div
                         key={crop.id}
                         className={`absolute cursor-pointer rounded-lg border-2 ${
                           selectedCrop?.id === crop.id ? 'border-blue-400 ring-2 ring-blue-300' : 'border-brown-300'
                         } shadow-lg transition-all duration-200 overflow-hidden`}
                         style={{
                           left: `${crop.position.x}%`,
                           top: `${crop.position.y}%`,
                           width: `${crop.size.width}%`,
                           height: `${crop.size.height}%`,
                         }}
                         onClick={() => setSelectedCrop(crop)}
                         whileHover={{ scale: 1.05, y: -2 }}
                         whileTap={{ scale: 0.98 }}
                       >
                          {/* Parcela de Cultivo con Crecimiento Vertical Animado */}
                          <div className="w-full h-full relative">
                            {/* Papa - Parcela con surcos y crecimiento animado */}
                            {crop.type === 'papa' && (
                              <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-300 relative">
                                {/* Surcos de papa */}
                                {[...Array(4)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="absolute w-full h-2 bg-yellow-400 opacity-60"
                                    style={{ top: `${i * 25}%` }}
                                  ></div>
                                ))}
                                
                                {/* Plantas de papa con crecimiento vertical animado */}
                                {[...Array(12)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                      left: `${10 + (i % 4) * 20}%`,
                                      bottom: '10%'
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ 
                                      height: `${Math.min(crop.growth * 0.3, 30)}%`,
                                      y: [0, -2, 0]
                                    }}
                                    transition={{
                                      height: { duration: 2, ease: "easeOut" },
                                      y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                                    }}
                                  >
                                    {/* Tallo principal */}
                                    <div className="w-1 bg-green-600 mx-auto relative">
                                      {/* Hojas que crecen gradualmente */}
                                      {crop.growth > 20 && (
                                        <motion.div
                                          className="absolute -left-1 top-1/4 w-2 h-2 bg-green-500 rounded-full"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
                                          transition={{ 
                                            scale: { delay: i * 0.1 },
                                            rotate: { duration: 4, repeat: Infinity, delay: i * 0.1 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {crop.growth > 40 && (
                                        <motion.div
                                          className="absolute -right-1 top-1/2 w-2 h-2 bg-green-500 rounded-full"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
                                          transition={{ 
                                            scale: { delay: i * 0.1 + 0.5 },
                                            rotate: { duration: 4, repeat: Infinity, delay: i * 0.1 + 0.5 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {crop.growth > 60 && (
                                        <motion.div
                                          className="absolute -left-1 top-3/4 w-2 h-2 bg-green-500 rounded-full"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1, rotate: [0, 8, -8, 0] }}
                                          transition={{ 
                                            scale: { delay: i * 0.1 + 1 },
                                            rotate: { duration: 4, repeat: Infinity, delay: i * 0.1 + 1 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {/* Flores que aparecen cuando está más maduro */}
                                      {crop.growth > 80 && (
                                        <motion.div
                                          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ 
                                            scale: [0, 1, 1.2, 1], 
                                            opacity: [0, 1, 0.8, 1]
                                          }}
                                          transition={{ 
                                            duration: 2, 
                                            repeat: Infinity,
                                            delay: i * 0.2
                                          }}
                                        ></motion.div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Quinua - Parcela con crecimiento vertical */}
                            {crop.type === 'quinua' && (
                              <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 relative">
                                {/* Hileras de quinua */}
                                {[...Array(3)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="absolute w-full h-1 bg-green-400 opacity-50"
                                    style={{ top: `${20 + i * 30}%` }}
                                  ></div>
                                ))}
                                
                                {/* Plantas de quinua con crecimiento vertical animado */}
                                {[...Array(15)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                      left: `${8 + (i % 5) * 18}%`,
                                      bottom: '10%'
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ 
                                      height: `${Math.min(crop.growth * 0.4, 40)}%`,
                                      y: [0, -1, 0]
                                    }}
                                    transition={{
                                      height: { duration: 2.5, ease: "easeOut" },
                                      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
                                    }}
                                  >
                                    {/* Tallo principal de quinua */}
                                    <div className="w-1 bg-green-700 mx-auto relative">
                                      {/* Hojas quinua */}
                                      {crop.growth > 25 && (
                                        <motion.div
                                          className="absolute -left-1 top-1/3 w-1 h-3 bg-green-600 rounded"
                                          initial={{ scaleY: 0 }}
                                          animate={{ 
                                            scaleY: 1,
                                            rotate: [0, 3, -3, 0]
                                          }}
                                          transition={{ 
                                            scaleY: { delay: i * 0.1 },
                                            rotate: { duration: 5, repeat: Infinity, delay: i * 0.1 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {crop.growth > 50 && (
                                        <motion.div
                                          className="absolute -right-1 top-1/2 w-1 h-3 bg-green-600 rounded"
                                          initial={{ scaleY: 0 }}
                                          animate={{ 
                                            scaleY: 1,
                                            rotate: [0, -3, 3, 0]
                                          }}
                                          transition={{ 
                                            scaleY: { delay: i * 0.1 + 0.3 },
                                            rotate: { duration: 5, repeat: Infinity, delay: i * 0.1 + 0.3 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {/* Panícula dorada al final */}
                                      {crop.growth > 75 && (
                                        <motion.div
                                          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-yellow-400 rounded-t-full"
                                          initial={{ scale: 0 }}
                                          animate={{ 
                                            scale: [0, 1, 1.1, 1],
                                            rotate: [0, 2, -2, 0]
                                          }}
                                          transition={{ 
                                            scale: { delay: i * 0.1 + 1 },
                                            rotate: { duration: 3, repeat: Infinity, delay: i * 0.1 }
                                          }}
                                        ></motion.div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Maíz - Parcela con plantas altas animadas */}
                            {crop.type === 'maiz' && (
                              <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-400 relative">
                                {/* Surcos de maíz */}
                                {[...Array(3)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="absolute w-full h-1 bg-green-500 opacity-40"
                                    style={{ top: `${25 + i * 25}%` }}
                                  ></div>
                                ))}
                                
                                {/* Plantas de maíz con crecimiento vertical animado */}
                                {[...Array(9)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                      left: `${15 + (i % 3) * 25}%`,
                                      bottom: '15%'
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ 
                                      height: `${Math.min(crop.growth * 0.5, 50)}%`,
                                      y: [0, -3, 0]
                                    }}
                                    transition={{
                                      height: { duration: 3, ease: "easeOut" },
                                      y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                                    }}
                                  >
                                    {/* Tallo principal de maíz */}
                                    <div className="w-1 bg-green-700 mx-auto relative">
                                      {/* Hojas de maíz que se despliegan */}
                                      {crop.growth > 30 && (
                                        <motion.div
                                          className="absolute -left-2 top-1/4 w-3 h-1 bg-green-600 rounded-full"
                                          initial={{ scaleX: 0 }}
                                          animate={{ 
                                            scaleX: 1,
                                            rotate: [0, 5, -5, 0]
                                          }}
                                          transition={{ 
                                            scaleX: { delay: i * 0.15 },
                                            rotate: { duration: 4, repeat: Infinity, delay: i * 0.15 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {crop.growth > 50 && (
                                        <motion.div
                                          className="absolute -right-2 top-1/2 w-3 h-1 bg-green-600 rounded-full"
                                          initial={{ scaleX: 0 }}
                                          animate={{ 
                                            scaleX: 1,
                                            rotate: [0, -5, 5, 0]
                                          }}
                                          transition={{ 
                                            scaleX: { delay: i * 0.15 + 0.5 },
                                            rotate: { duration: 4, repeat: Infinity, delay: i * 0.15 + 0.5 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {/* Mazorca que aparece */}
                                      {crop.growth > 70 && (
                                        <motion.div
                                          className="absolute -right-1 top-1/3 w-2 h-4 bg-yellow-400 rounded"
                                          initial={{ scale: 0 }}
                                          animate={{ 
                                            scale: [0, 1, 1.05, 1],
                                            rotate: [0, 1, -1, 0]
                                          }}
                                          transition={{ 
                                            scale: { delay: i * 0.1 + 1.5 },
                                            rotate: { duration: 5, repeat: Infinity, delay: i * 0.1 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {/* Penacho dorado en la punta */}
                                      {crop.growth > 85 && (
                                        <motion.div
                                          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full"
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ 
                                            scale: [0, 1, 1.2, 1],
                                            opacity: [0, 1, 0.8, 1],
                                            y: [0, -1, 0]
                                          }}
                                          transition={{ 
                                            scale: { delay: i * 0.1 + 2 },
                                            opacity: { delay: i * 0.1 + 2 },
                                            y: { duration: 3, repeat: Infinity, delay: i * 0.1 }
                                          }}
                                        ></motion.div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Habas - Parcela con plantas trepadoras animadas */}
                            {crop.type === 'habas' && (
                              <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-400 relative">
                                {/* Hileras de habas */}
                                {[...Array(4)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="absolute w-full h-1 bg-green-500 opacity-30"
                                    style={{ top: `${15 + i * 20}%` }}
                                  ></div>
                                ))}
                                
                                {/* Plantas de habas con crecimiento vertical animado */}
                                {[...Array(12)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                      left: `${12 + (i % 4) * 20}%`,
                                      bottom: '12%'
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ 
                                      height: `${Math.min(crop.growth * 0.35, 35)}%`,
                                      y: [0, -1.5, 0]
                                    }}
                                    transition={{
                                      height: { duration: 2.2, ease: "easeOut" },
                                      y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }
                                    }}
                                  >
                                    {/* Tallo de habas */}
                                    <div className="w-1 bg-green-600 mx-auto relative">
                                      {/* Hojas compuestas */}
                                      {crop.growth > 25 && (
                                        <motion.div
                                          className="absolute -left-1 top-1/4 w-2 h-2 bg-green-500 rounded-full"
                                          initial={{ scale: 0 }}
                                          animate={{ 
                                            scale: 1,
                                            rotate: [0, 4, -4, 0]
                                          }}
                                          transition={{ 
                                            scale: { delay: i * 0.12 },
                                            rotate: { duration: 4.5, repeat: Infinity, delay: i * 0.12 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {crop.growth > 50 && (
                                        <motion.div
                                          className="absolute -right-1 top-1/2 w-2 h-2 bg-green-500 rounded-full"
                                          initial={{ scale: 0 }}
                                          animate={{ 
                                            scale: 1,
                                            rotate: [0, -4, 4, 0]
                                          }}
                                          transition={{ 
                                            scale: { delay: i * 0.12 + 0.4 },
                                            rotate: { duration: 4.5, repeat: Infinity, delay: i * 0.12 + 0.4 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {/* Vainas que se forman */}
                                      {crop.growth > 65 && (
                                        <motion.div
                                          className="absolute -left-1 top-2/3 w-1 h-2 bg-green-500 rounded-full"
                                          initial={{ scale: 0 }}
                                          animate={{ 
                                            scale: [0, 1, 1.1, 1],
                                            rotate: [0, 2, -2, 0]
                                          }}
                                          transition={{ 
                                            scale: { delay: i * 0.12 + 0.8 },
                                            rotate: { duration: 4, repeat: Infinity, delay: i * 0.12 }
                                          }}
                                        ></motion.div>
                                      )}
                                      {/* Flores blancas */}
                                      {crop.growth > 45 && crop.growth < 80 && (
                                        <motion.div
                                          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ 
                                            scale: [0, 1, 0],
                                            opacity: [0, 1, 0]
                                          }}
                                          transition={{ 
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                          }}
                                        ></motion.div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Oca y Ulluco - Plantas bajas con tubérculos animados */}
                            {(crop.type === 'oca' || crop.type === 'ulluco') && (
                              <div className={`w-full h-full bg-gradient-to-br ${
                                crop.type === 'oca' ? 'from-purple-200 to-purple-300' : 'from-orange-200 to-orange-300'
                              } relative`}>
                                {/* Plantas bajas con animación */}
                                {[...Array(16)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                      left: `${10 + (i % 4) * 20}%`,
                                      bottom: '20%'
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ 
                                      height: `${Math.min(crop.growth * 0.25, 25)}%`,
                                      y: [0, -0.5, 0]
                                    }}
                                    transition={{
                                      height: { duration: 1.8, ease: "easeOut" },
                                      y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }
                                    }}
                                  >
                                    {/* Hojas bajas */}
                                    <div className="w-2 bg-green-500 mx-auto relative rounded-full">
                                      {crop.growth > 30 && (
                                        <motion.div
                                          className="absolute -left-1 top-1/2 w-2 h-1 bg-green-400 rounded-full"
                                          initial={{ scale: 0 }}
                                          animate={{ 
                                            scale: 1,
                                            rotate: [0, 3, -3, 0]
                                          }}
                                          transition={{ 
                                            scale: { delay: i * 0.08 },
                                            rotate: { duration: 4, repeat: Infinity, delay: i * 0.08 }
                                          }}
                                        ></motion.div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                                
                                {/* Tubérculos subterráneos que aparecen gradualmente */}
                                {crop.growth > 60 && [...Array(12)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className={`absolute w-1 h-1 rounded-full shadow-sm ${
                                      crop.type === 'oca' ? (
                                        i % 3 === 0 ? 'bg-purple-500' : 
                                        i % 3 === 1 ? 'bg-yellow-500' : 'bg-red-500'
                                      ) : 'bg-orange-500'
                                    }`}
                                    style={{
                                      left: `${12 + (i % 4) * 20}%`,
                                      bottom: `${5 + (i % 3) * 3}%`
                                    }}
                                    initial={{ scale: 0, y: 10 }}
                                    animate={{ 
                                      scale: [0, 1, 1.1, 1],
                                      y: [10, 0, -1, 0]
                                    }}
                                    transition={{ 
                                      delay: i * 0.3 + 2,
                                      duration: 1.5,
                                      repeat: Infinity,
                                      repeatDelay: 5
                                    }}
                                  ></motion.div>
                                ))}
                              </div>
                            )}

                            {/* Información superpuesta mejorada */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
                              <motion.div 
                                className="text-xs font-bold text-white text-center drop-shadow-lg mb-1"
                                initial={{ y: 10, opacity: 0 }}
                                whileHover={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                {crop.name}
                              </motion.div>
                              <motion.div 
                                className="text-xs text-white text-center drop-shadow-lg"
                                initial={{ y: 10, opacity: 0 }}
                                whileHover={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                🌱 Crecimiento: {crop.growth}%
                              </motion.div>
                              <motion.div 
                                className="text-xs text-white text-center drop-shadow-lg mt-1"
                                initial={{ y: 10, opacity: 0 }}
                                whileHover={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                ❤️ Salud: {crop.health}%
                              </motion.div>
                              <motion.div 
                                className="text-xs text-green-200 text-center drop-shadow-lg mt-1"
                                initial={{ y: 10, opacity: 0 }}
                                whileHover={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                🎯 Clic para detalles
                              </motion.div>
                            </div>

                            {/* Indicador de riesgo climático animado */}
                            <motion.div 
                              className={`absolute top-1 right-1 w-3 h-3 rounded-full ${
                                crop.climateRisk === 'low' ? 'bg-green-500' :
                                crop.climateRisk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                              } shadow-lg border-2 border-white`}
                              animate={{
                                scale: crop.climateRisk === 'high' ? [1, 1.2, 1] : [1, 1.05, 1],
                                opacity: crop.climateRisk === 'high' ? [1, 0.7, 1] : [1, 0.9, 1]
                              }}
                              transition={{
                                duration: crop.climateRisk === 'high' ? 1 : 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Elementos decorativos del paisaje */}
                      {/* Árboles simples */}
                      <div className="absolute bottom-2 left-2">
                        <div className="text-3xl">🌳</div>
                      </div>
                      
                      <div className="absolute bottom-2 right-2">
                        <div className="text-2xl">🌲</div>
                      </div>

                      {/* Casa/Granero */}
                      <div className="absolute top-2 right-4">
                        <div className="text-3xl">🏠</div>
                      </div>

                      {/* Pozo de agua */}
                      <div className="absolute top-8 left-4">
                        <div className="text-2xl">🪣</div>
                      </div>

                      {/* Sol */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        <div className="text-2xl">☀️</div>
                      </div>

                      {/* Flores decorativas */}
                      <div className="absolute bottom-8 left-1/4">
                        <div className="text-lg">🌸</div>
                      </div>
                      
                      <div className="absolute bottom-6 right-1/3">
                        <div className="text-lg">🌼</div>
                      </div>
                  </div>

                  {/* Leyenda */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Riesgo Bajo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Riesgo Medio</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Riesgo Alto</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel de información del cultivo seleccionado */}
            <div className="space-y-4">
              {selectedCrop ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{selectedCrop.emoji}</span>
                      {selectedCrop.name}
                    </CardTitle>
                    <CardDescription>
                      Plantado el {selectedCrop.plantedDate.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Estadísticas del cultivo */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Crecimiento:</span>
                          <span>{selectedCrop.growth}%</span>
                        </div>
                        <Progress value={selectedCrop.growth} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Salud:</span>
                          <span>{selectedCrop.health}%</span>
                        </div>
                        <Progress value={selectedCrop.health} className="h-2" />
                      </div>
                    </div>

                    {/* Técnicas aplicadas */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        Técnicas Aplicadas:
                      </h4>
                      <div className="space-y-1">
                        {selectedCrop.techniques.map((technique, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Riesgo climático */}
                    <div className={`p-2 rounded-lg ${
                      selectedCrop.climateRisk === 'low' ? 'bg-green-50 border border-green-200' :
                      selectedCrop.climateRisk === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className={`h-4 w-4 ${
                          selectedCrop.climateRisk === 'low' ? 'text-green-600' :
                          selectedCrop.climateRisk === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`} />
                        <span className="font-medium">
                          Riesgo Climático: {
                            selectedCrop.climateRisk === 'low' ? 'Bajo' :
                            selectedCrop.climateRisk === 'medium' ? 'Medio' : 'Alto'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Fecha de cosecha */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Cosecha estimada: {selectedCrop.harvestDate.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Selecciona un cultivo en el mapa para ver sus detalles
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Resumen de la parcela */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Resumen de Parcela
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold text-green-600">{crops.length}</div>
                      <div className="text-xs text-muted-foreground">Cultivos Activos</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-bold text-blue-600">
                        {Math.round(crops.reduce((acc, crop) => acc + crop.growth, 0) / crops.length)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Crecimiento Promedio</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <div className="font-bold text-yellow-600">
                        {Math.round(crops.reduce((acc, crop) => acc + crop.health, 0) / crops.length)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Salud Promedio</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-bold text-purple-600">
                        {sustainableTechniques.filter(t => t.implemented).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Técnicas Activas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Técnicas Sostenibles y Compromisos Climáticos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Técnicas Sostenibles Implementadas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  Técnicas Sostenibles
                </CardTitle>
                <CardDescription>
                  Prácticas implementadas para reducir el impacto ambiental
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sustainableTechniques.filter(t => t.implemented).map((technique) => (
                  <div key={technique.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        {React.createElement(technique.icon, { className: "h-4 w-4 text-green-600" })}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{technique.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{technique.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${
                                i < technique.impact ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">Impacto</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {technique.benefits.map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compromisos Climáticos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Compromisos Climáticos
                </CardTitle>
                <CardDescription>
                  Técnicas planificadas para adaptación al cambio climático
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sustainableTechniques.filter(t => t.commitment && !t.implemented).map((technique) => (
                  <div key={technique.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        {React.createElement(technique.icon, { className: "h-4 w-4 text-blue-600" })}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{technique.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{technique.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${
                                i < technique.impact ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">Impacto Esperado</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {technique.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                ))}

                {/* Técnicas disponibles para comprometerse */}
                {sustainableTechniques.filter(t => !t.commitment && !t.implemented).map((technique) => (
                  <div key={technique.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {React.createElement(technique.icon, { className: "h-4 w-4 text-gray-600" })}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{technique.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{technique.description}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSustainableTechniques(prev => prev.map(t => 
                              t.id === technique.id ? { ...t, commitment: true } : t
                            ));
                            addNotification(`¡Te comprometiste a implementar ${technique.name}! 🌱`);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Comprometerme
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Impacto Ambiental */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Impacto Ambiental y ODS 13
              </CardTitle>
              <CardDescription>
                Tu contribución a la acción por el clima y agricultura sostenible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-bold text-blue-600">45%</div>
                  <div className="text-xs text-muted-foreground">Ahorro de Agua</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Leaf className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="font-bold text-green-600">-30%</div>
                  <div className="text-xs text-muted-foreground">Emisiones CO₂</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="font-bold text-yellow-600">+25%</div>
                  <div className="text-xs text-muted-foreground">Eficiencia Energética</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Mountain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="font-bold text-purple-600">85%</div>
                  <div className="text-xs text-muted-foreground">Conservación Suelo</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Contribución al ODS 13</span>
                </div>
                <p className="text-xs text-green-700">
                  Tus técnicas sostenibles contribuyen directamente a la <strong>Acción por el Clima</strong>. 
                  Has implementado {sustainableTechniques.filter(t => t.implemented).length} de {sustainableTechniques.length} técnicas 
                  disponibles, reduciendo tu huella de carbono y aumentando la resiliencia de tus cultivos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Misiones */}
        <TabsContent value="missions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Misiones Diarias
                </CardTitle>
                <CardDescription>Se reinician cada 24 horas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {missions.filter(m => m.type === 'daily').map((mission) => (
                  <div key={mission.id} className={`p-3 rounded-lg border ${
                    mission.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        mission.difficulty === 'easy' ? 'bg-green-100' :
                        mission.difficulty === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {React.createElement(mission.icon, { 
                          className: `h-4 w-4 ${
                            mission.difficulty === 'easy' ? 'text-green-600' :
                            mission.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                          }` 
                        })}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{mission.title}</h4>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progreso: {mission.progress}/{mission.target}</span>
                            <span className="font-medium">
                              +{mission.reward.coins} 🌱 +{mission.reward.experience} XP
                              {mission.reward.item && ` +${mission.reward.item}`}
                            </span>
                          </div>
                          <Progress value={(mission.progress / mission.target) * 100} className="h-1" />
                        </div>
                      </div>
                      {mission.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  Misiones Semanales
                </CardTitle>
                <CardDescription>Desafíos más grandes con mejores recompensas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {missions.filter(m => m.type === 'weekly').map((mission) => (
                  <div key={mission.id} className={`p-3 rounded-lg border ${
                    mission.completed ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-purple-100">
                        {React.createElement(mission.icon, { className: "h-4 w-4 text-purple-600" })}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{mission.title}</h4>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progreso: {mission.progress}/{mission.target}</span>
                            <span className="font-medium">
                              +{mission.reward.coins} 🌱 +{mission.reward.experience} XP
                              {mission.reward.item && ` +${mission.reward.item}`}
                            </span>
                          </div>
                          <Progress value={(mission.progress / mission.target) * 100} className="h-1" />
                        </div>
                      </div>
                      {mission.completed && (
                        <CheckCircle className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Cómo ganar puntos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                ¿Cómo Ganar Puntos y Monedas?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Compartir Experiencia Agrícola</span>
                  </div>
                  <p className="text-sm text-muted-foreground">+15 XP, +5 Felicidad, +3 Conocimiento por cada vez</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Completar Tareas Agrícolas</span>
                  </div>
                  <p className="text-sm text-muted-foreground">20-500 XP y semillas/herramientas según dificultad</p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Consultar Clima para Cultivos</span>
                  </div>
                  <p className="text-sm text-muted-foreground">+50 XP, semillas de quinua por consulta diaria</p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Pedir Consejos Agrícolas</span>
                  </div>
                  <p className="text-sm text-muted-foreground">+100 XP, manual de cultivos por consulta</p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Ayudar a Otros Agricultores</span>
                  </div>
                  <p className="text-sm text-muted-foreground">+75 XP, herramientas de campo por ayuda</p>
                </div>
                
                <div className="p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-5 w-5 text-pink-600" />
                    <span className="font-medium">Cuidar Cultivos Diariamente</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Bonus diario: +{mascotState.streak * 5} semillas extra</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Tienda */}
        <TabsContent value="shop" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Almacén Agrícola</h2>
              <p className="text-muted-foreground">Intercambia semillas por herramientas y alimentos para mejorar a Agro</p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
              <Coins className="h-5 w-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">{mascotState.coins} semillas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => (
              <Card key={item.id} className={`relative ${
                item.rarity === 'legendary' ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' :
                item.rarity === 'epic' ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50' :
                item.rarity === 'rare' ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50' :
                'border-gray-200'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {React.createElement(item.icon, { 
                        className: `h-6 w-6 ${
                          item.rarity === 'legendary' ? 'text-yellow-600' :
                          item.rarity === 'epic' ? 'text-purple-600' :
                          item.rarity === 'rare' ? 'text-blue-600' :
                          'text-gray-600'
                        }` 
                      })}
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </div>
                    <Badge className={
                      item.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {item.rarity === 'legendary' ? '⭐ Legendario' :
                       item.rarity === 'epic' ? '💜 Épico' :
                       item.rarity === 'rare' ? '💙 Raro' :
                       '⚪ Común'}
                    </Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Efectos:</h4>
                    <div className="space-y-1">
                      {item.effect.energy && (
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>+{item.effect.energy} Energía</span>
                        </div>
                      )}
                      {item.effect.happiness && (
                        <div className="flex items-center gap-2 text-sm">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>+{item.effect.happiness} Felicidad</span>
                        </div>
                      )}
                      {item.effect.knowledge && (
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span>+{item.effect.knowledge} Conocimiento</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg">{item.price} semillas</span>
                    </div>
                    
                    {item.owned ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Comprado
                      </Badge>
                    ) : (
                      <Button 
                        onClick={() => purchaseItem(item)}
                        disabled={mascotState.coins < item.price}
                        size="sm"
                        className={
                          item.rarity === 'legendary' ? 'bg-yellow-500 hover:bg-yellow-600' :
                          item.rarity === 'epic' ? 'bg-purple-500 hover:bg-purple-600' :
                          item.rarity === 'rare' ? 'bg-blue-500 hover:bg-blue-600' :
                          'bg-gray-500 hover:bg-gray-600'
                        }
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Comprar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Items de alimentación rápida */}
          <Card>
                          <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5 text-green-500" />
                  Alimentos del Campo
                </CardTitle>
                <CardDescription>Productos agrícolas para nutrir a Agro y mejorar sus consejos</CardDescription>
              </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {shopItems.filter(item => item.type === 'food').map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => feedMascot(item)}
                    disabled={mascotState.coins < item.price}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    {React.createElement(item.icon, { className: "h-6 w-6" })}
                    <span className="text-xs font-medium">{item.name}</span>
                    <div className="flex items-center gap-1">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs">{item.price} 🌱</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Logros */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Logros y Achievements</h2>
            <p className="text-muted-foreground">Desbloquea logros especiales y gana recompensas exclusivas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${
                achievement.unlocked 
                  ? achievement.rarity === 'diamond' ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-300' :
                    achievement.rarity === 'gold' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' :
                    achievement.rarity === 'silver' ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300' :
                    'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${
                        achievement.unlocked 
                          ? achievement.rarity === 'diamond' ? 'bg-cyan-100' :
                            achievement.rarity === 'gold' ? 'bg-yellow-100' :
                            achievement.rarity === 'silver' ? 'bg-gray-100' :
                            'bg-orange-100'
                          : 'bg-gray-100'
                      }`}>
                        {React.createElement(achievement.icon, { 
                          className: `h-6 w-6 ${
                            achievement.unlocked 
                              ? achievement.rarity === 'diamond' ? 'text-cyan-600' :
                                achievement.rarity === 'gold' ? 'text-yellow-600' :
                                achievement.rarity === 'silver' ? 'text-gray-600' :
                                'text-orange-600'
                              : 'text-gray-400'
                          }` 
                        })}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={
                        achievement.rarity === 'diamond' ? 'bg-cyan-100 text-cyan-800' :
                        achievement.rarity === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                        achievement.rarity === 'silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }>
                        {achievement.rarity === 'diamond' ? '💎 Diamante' :
                         achievement.rarity === 'gold' ? '🥇 Oro' :
                         achievement.rarity === 'silver' ? '🥈 Plata' :
                         '🥉 Bronce'}
                      </Badge>
                      {achievement.unlocked && (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-2" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso:</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Recompensa:</span>
                    <div className="flex items-center gap-2">
                      <span>+{achievement.reward.coins} 🌱</span>
                      <span>+{achievement.reward.experience} XP</span>
                      {achievement.reward.title && (
                        <Badge variant="outline" className="text-xs">
                          {achievement.reward.title}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Estadísticas de logros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Estadísticas de Logros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {achievements.filter(a => a.unlocked).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Logros Desbloqueados</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {achievements.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total de Logros</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Completado</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {achievements.filter(a => a.unlocked && a.rarity === 'diamond').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Logros Diamante</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para agregar cultivo */}
      <Dialog open={showAddCropModal} onOpenChange={setShowAddCropModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-600" />
              Agregar Nuevo Cultivo
            </DialogTitle>
            <DialogDescription>
              {selectedGridPosition 
                ? `Plantando en parcela (${selectedGridPosition.x + 1}, ${selectedGridPosition.y + 1})`
                : "Completa los detalles de tu nuevo cultivo"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Nombre del cultivo */}
            <div className="space-y-2">
              <Label htmlFor="cropName">Nombre del Cultivo</Label>
              <Input
                id="cropName"
                placeholder="Ej: Papa Huayro, Quinua Blanca..."
                value={newCropForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* Tipo de cultivo */}
            <div className="space-y-2">
              <Label htmlFor="cropType">Tipo de Cultivo</Label>
              <Select value={newCropForm.type} onValueChange={(value) => handleFormChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="papa">🥔 Papa</SelectItem>
                  <SelectItem value="quinua">🌾 Quinua</SelectItem>
                  <SelectItem value="maiz">🌽 Maíz</SelectItem>
                  <SelectItem value="habas">🫘 Habas</SelectItem>
                  <SelectItem value="oca">🟠 Oca</SelectItem>
                  <SelectItem value="ulluco">🟡 Ulluco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hectáreas */}
            <div className="space-y-2">
              <Label htmlFor="hectares">Hectáreas</Label>
              <Input
                id="hectares"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                value={newCropForm.hectares || ''}
                onChange={(e) => handleFormChange('hectares', parseFloat(e.target.value) || 0)}
                className={formErrors.hectares ? 'border-red-500' : ''}
              />
              {formErrors.hectares && (
                <p className="text-sm text-red-500">{formErrors.hectares}</p>
              )}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plantedDate">Fecha de Siembra</Label>
                <Input
                  id="plantedDate"
                  type="date"
                  value={newCropForm.plantedDate.toISOString().split('T')[0]}
                  onChange={(e) => handleFormChange('plantedDate', new Date(e.target.value))}
                  className={formErrors.plantedDate ? 'border-red-500' : ''}
                />
                {formErrors.plantedDate && (
                  <p className="text-sm text-red-500">{formErrors.plantedDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="harvestDate">Fecha de Cosecha Estimada</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={newCropForm.harvestDate.toISOString().split('T')[0]}
                  onChange={(e) => handleFormChange('harvestDate', new Date(e.target.value))}
                  className={formErrors.harvestDate ? 'border-red-500' : ''}
                />
                {formErrors.harvestDate && (
                  <p className="text-sm text-red-500">{formErrors.harvestDate}</p>
                )}
              </div>
            </div>

            {/* Evaluación IA de Riesgo Climático */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                Evaluación Automática de Riesgo Climático
              </Label>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-purple-800 mb-1">
                      IA Evaluará Automáticamente el Riesgo
                    </p>
                    <p className="text-xs text-purple-700">
                      Nuestro sistema analizará automáticamente: tipo de cultivo, técnicas sostenibles aplicadas, 
                      época de siembra óptima, y tamaño del área para determinar el riesgo climático más preciso.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Técnicas sostenibles */}
            <div className="space-y-2">
              <Label>Técnicas Sostenibles a Aplicar</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {[
                  'Rotación de cultivos',
                  'Compost orgánico',
                  'Riego por goteo',
                  'Asociación de cultivos',
                  'Manejo integrado de plagas',
                  'Barreras vivas',
                  'Terrazas andinas',
                  'Policultivo',
                  'Fijación de nitrógeno',
                  'Control biológico'
                ].map((technique) => (
                  <div key={technique} className="flex items-center space-x-2">
                    <Checkbox
                      id={technique}
                      checked={newCropForm.techniques.includes(technique)}
                      onCheckedChange={() => handleTechniqueToggle(technique)}
                    />
                    <Label htmlFor={technique} className="text-sm font-normal">
                      {technique}
                    </Label>
                  </div>
                ))}
              </div>
              {formErrors.techniques && (
                <p className="text-sm text-red-500">{formErrors.techniques}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddCropModal(false);
                setSelectedGridPosition(null);
                setFormErrors({});
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddCrop}
              className="bg-green-600 hover:bg-green-700"
            >
              <Sprout className="h-4 w-4 mr-2" />
              Plantar Cultivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MascotaAndinaPage;