
import { useState, useEffect } from "react";
import { Bot, User, Send, X, BookOpen, PanelLeft, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  category?: string;
  attachments?: {
    type: "image" | "map" | "chart" | "link";
    url: string;
    title?: string;
  }[];
}

const VirtualAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy Wara, tu asistente virtual para AgroClima. Estoy aquí para ayudarte a proteger tus cultivos y aprovechar los recursos de forma sostenible. ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date(),
      category: "saludo",
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const quickQuestions = [
    { text: "¿Hay alertas de sequía en mi zona?", category: "clima" },
    { text: "¿Cómo proteger mis cultivos de papa?", category: "consejos" },
    { text: "¿Qué subsidios hay disponibles?", category: "financiamiento" },
    { text: "Analizar mi terreno con IA", category: "monitoreo" }
  ];

  const botResponses = {
    "clima": {
      text: "Según el análisis de IBM Watson y los datos satelitales, hay una alerta de sequía moderada para la región del Altiplano Norte durante los próximos 15 días. Te recomiendo revisar el apartado de Monitoreo para más detalles y considerar implementar riego por goteo para optimizar el uso de agua.",
      attachments: [
        {
          type: "map",
          url: "https://placehold.co/300x200/D35400/FFFFFF/png?text=Mapa+de+Sequía",
          title: "Mapa de sequía - Altiplano Norte"
        }
      ]
    },
    "consejos": {
      text: "Para proteger tus cultivos de papa en la región andina: 1) Utiliza variedades nativas resistentes a la sequía como la 'Waycha', 2) Implementa zanjas de infiltración para captar agua de lluvia, 3) Aplica mulch orgánico para conservar la humedad, 4) Usa biopreparados contra el tizón tardío. ¿Te gustaría información más específica sobre alguno de estos puntos?",
      attachments: [
        {
          type: "image",
          url: "https://placehold.co/300x200/A04000/FFFFFF/png?text=Técnicas+de+Cultivo",
          title: "Técnicas ancestrales y modernas"
        }
      ]
    },
    "financiamiento": {
      text: "Actualmente hay varios programas disponibles: 1) Fondo Andino para Agricultura Sostenible (préstamos a tasas preferenciales), 2) Programa de Seguro Agrícola ante Eventos Climáticos (PSAEC), 3) Microcréditos para sistemas de riego eficiente. Puedes ver más detalles en la sección de Financiamiento o te puedo enviar los requisitos de alguno en específico.",
      attachments: [
        {
          type: "link",
          url: "/financiamiento",
          title: "Ver programas disponibles"
        }
      ]
    },
    "monitoreo": {
      text: "Para analizar tu terreno con IA, necesito que me compartas una imagen satelital o fotografía aérea de tu parcela. Nuestro sistema IBM Vision la analizará para detectar: nivel de estrés hídrico, estado de los cultivos, posibles plagas y recomendaciones de manejo. También puedes subir imágenes en la sección de Monitoreo para un análisis más detallado.",
      attachments: [
        {
          type: "chart",
          url: "https://placehold.co/300x200/C27500/FFFFFF/png?text=Análisis+IA",
          title: "Ejemplo de análisis con IA"
        }
      ]
    },
    "default": {
      text: "Comprendo tu consulta. Estoy conectando con nuestra base de conocimiento andino y modernas prácticas agrícolas para darte la mejor respuesta. ¿Podrías proporcionarme más detalles sobre tu ubicación y tipo de cultivo para darte información más precisa?",
      attachments: []
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Determinar la categoría de la respuesta
    let responseCategory = "default";
    const input = inputValue.toLowerCase();
    
    if (input.includes('sequía') || input.includes('clima') || input.includes('lluvia') || input.includes('temperatura')) {
      responseCategory = "clima";
    } else if (input.includes('cultivo') || input.includes('proteger') || input.includes('sembrar') || input.includes('papa')) {
      responseCategory = "consejos";
    } else if (input.includes('subsidio') || input.includes('financ') || input.includes('préstamo') || input.includes('dinero')) {
      responseCategory = "financiamiento";
    } else if (input.includes('analizar') || input.includes('monitoreo') || input.includes('detectar') || input.includes('imagen')) {
      responseCategory = "monitoreo";
    }

    const response = botResponses[responseCategory as keyof typeof botResponses];

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        category: responseCategory,
        attachments: response.attachments
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputValue('');
  };

  const handleQuickQuestion = (question: string, category: string) => {
    setInputValue(question);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    const response = botResponses[category as keyof typeof botResponses];

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        category: category,
        attachments: response.attachments
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-agriculture-earth shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-24 z-50 w-96 h-[500px] flex flex-col shadow-2xl border-2 border-agriculture-earth/30">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-agriculture-earth text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-agriculture-gold">
                <span className="text-xl">🦙</span>
              </Avatar>
              <div>
                <h3 className="font-semibold">Wara</h3>
                <p className="text-xs opacity-90">Asistente Virtual Andino</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab("chat")}>
                    Chat Principal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("knowledge")}>
                    Base de Conocimiento
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 data-[state=active]:flex-1">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.isBot 
                            ? 'bg-agriculture-earth text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          message.isBot 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-agriculture-earth text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          
                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="rounded-md overflow-hidden border border-gray-200">
                                  {attachment.type === 'image' || attachment.type === 'chart' || attachment.type === 'map' ? (
                                    <div className="space-y-1">
                                      <img 
                                        src={attachment.url} 
                                        alt={attachment.title || 'Attachment'} 
                                        className="w-full h-auto object-cover"
                                      />
                                      {attachment.title && (
                                        <p className="text-xs p-2 bg-gray-50 text-gray-600">{attachment.title}</p>
                                      )}
                                    </div>
                                  ) : attachment.type === 'link' && (
                                    <a 
                                      href={attachment.url}
                                      className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-blue-600"
                                    >
                                      <BookOpen className="h-4 w-4 mr-2" />
                                      {attachment.title || 'Ver más información'}
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <p className={`text-xs mt-1 ${
                            message.isBot ? 'text-gray-500' : 'text-white/70'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Quick Questions */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 border-t bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600">Sugerencias:</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 p-0 text-gray-500"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </div>
                  
                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-1">
                      {quickQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto p-2 text-xs border-agriculture-earth/20 hover:bg-agriculture-earth/10 hover:text-agriculture-earth"
                          onClick={() => handleQuickQuestion(question.text, question.category)}
                        >
                          {question.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe tu consulta sobre agricultura andina..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    size="icon"
                    className="bg-agriculture-earth text-white hover:bg-agriculture-brown"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="knowledge" className="flex-1 flex flex-col p-4 m-0 data-[state=active]:flex-1">
              <h3 className="text-lg font-semibold mb-3">Base de conocimiento</h3>
              <ScrollArea className="flex-1">
                <div className="space-y-4">
                  <Card className="p-3">
                    <h4 className="font-medium text-sm mb-1">Fuentes de datos</h4>
                    <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                      <li>IBM Watson para análisis climático</li>
                      <li>Imágenes satelitales (LANDSAT, Sentinel)</li>
                      <li>Estaciones meteorológicas locales</li>
                      <li>Base de conocimiento de cultivos andinos</li>
                      <li>RAG (Retrieval Augmented Generation)</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-3">
                    <h4 className="font-medium text-sm mb-1">Capacidades del asistente</h4>
                    <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                      <li>Predicción de eventos climáticos</li>
                      <li>Análisis de cultivos con visión artificial</li>
                      <li>Recomendaciones de cultivos por temporada</li>
                      <li>Identificación de plagas y enfermedades</li>
                      <li>Información sobre financiamiento agrícola</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-3">
                    <h4 className="font-medium text-sm mb-1">Regiones soportadas</h4>
                    <div className="flex items-center justify-center p-2">
                      <div className="p-1 bg-gray-100 rounded-md">
                        <MapPin className="h-4 w-4 text-agriculture-earth mb-1 mx-auto" />
                        <p className="text-xs text-center">Región Andina</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </>
  );
};

export default VirtualAssistant;
