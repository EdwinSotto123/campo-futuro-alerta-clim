
import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual de AgroClima. ¿En qué puedo ayudarte hoy? Puedo informarte sobre alertas climáticas, consejos de cultivo, financiamiento agrícola y más.',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickQuestions = [
    "¿Hay alertas climáticas para mi zona?",
    "¿Cómo proteger mis cultivos de granizo?",
    "¿Qué subsidios están disponibles?",
    "Números de emergencia agrícola"
  ];

  const botResponses = {
    "alertas": "🌦️ Actualmente hay una alerta de granizo para la región Altiplano-Norte. Te recomiendo cubrir tus cultivos sensibles y revisar los sistemas de drenaje. ¿Necesitas más detalles sobre esta alerta?",
    "granizo": "🛡️ Para proteger tus cultivos del granizo: 1) Usa mallas antigranizo, 2) Planta variedades resistentes, 3) Considera seguros agrícolas, 4) Mantén sistemas de drenaje limpios. ¿Qué tipo de cultivo tienes?",
    "subsidios": "💰 Tenemos información sobre varios programas: Seguro Agrícola Universal (SAU), Fondo de Desarrollo para el Agro (FDA), y subsidios por desastres naturales. ¿Te interesa alguno en particular?",
    "emergencia": "📞 Números importantes: SENASAG: 800-10-2020, Defensa Civil: 165, SENHAMI: 2-2445512. ¿Necesitas contactos específicos de tu región?",
    "default": "Entiendo tu consulta. Te conectaré con un especialista agrícola que podrá ayudarte mejor. Mientras tanto, puedes revisar nuestra sección de consejos o alertas actuales."
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

    // Simulate bot response
    setTimeout(() => {
      let botResponse = botResponses.default;
      
      const input = inputValue.toLowerCase();
      if (input.includes('alerta') || input.includes('clima')) {
        botResponse = botResponses.alertas;
      } else if (input.includes('granizo') || input.includes('proteger')) {
        botResponse = botResponses.granizo;
      } else if (input.includes('subsidio') || input.includes('financ')) {
        botResponse = botResponses.subsidios;
      } else if (input.includes('emergencia') || input.includes('número')) {
        botResponse = botResponses.emergencia;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputValue('');
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    sendMessage();
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full agriculture-gradient shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 left-6 z-50 w-96 h-[500px] flex flex-col shadow-2xl border-2 border-agriculture-green/20">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b agriculture-gradient text-white">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">AgroBot</h3>
                <p className="text-xs opacity-90">Asistente Virtual</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

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
                        ? 'agriculture-gradient text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      message.isBot 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'agriculture-gradient text-white'
                    }`}>
                      <p className="text-sm">{message.text}</p>
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
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Preguntas frecuentes:</p>
              <div className="grid grid-cols-1 gap-1">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-left h-auto p-2 text-xs"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu consulta..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                className="agriculture-gradient text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
