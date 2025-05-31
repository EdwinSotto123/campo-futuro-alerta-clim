import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Leaf, CloudRain, Cpu, Bot, Database } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import AITechnologySection from "@/components/AITechnologySection";
import FeaturesSection from "@/components/FeaturesSection";
import SDGSection from "@/components/SDGSection";
import logoWaira from "../logo-waira.png";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      {/* Encabezado */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 overflow-hidden rounded-full flex items-center justify-center shadow-lg">
              <img 
                src={logoWaira} 
                alt="WairaAI Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              WairaAI
            </h1>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Hackathon for Progress
            </Badge>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white"
              onClick={() => navigate('/registro')}
            >
              Registrarse
            </Button>
          </div>
        </div>
      </header>
      
      {/* Banner con frase principal */}
      <div className="bg-gradient-to-r from-emerald-700 to-sky-700 text-white py-3">
        <div className="container mx-auto text-center">
          <p className="text-sm md:text-base font-medium flex items-center justify-center gap-2">
            <CloudRain className="h-4 w-4" />
            Protegiendo tus cultivos, preservando el planeta
            <Globe className="h-4 w-4" />
          </p>
        </div>
      </div>
      
      {/* Banner de IBM watsonx.ai y Hackathon */}
      <div className="bg-blue-50 py-4 border-y border-blue-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-full">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Potenciado por IBM watsonx.ai</h3>
                <p className="text-sm text-blue-700">Granite Models + APIs NASA + LangChain</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                CLIMATE CHALLENGE
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                ODS 13
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Agricultura Sostenible
              </Badge>
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600"
              onClick={() => window.open('https://github.com/IBM/watsonx-ai', '_blank')}
            >
              Explorar watsonx.ai
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      
      
      
      {/* Contenido Original de la página de inicio */}
      <HeroSection />
      <AITechnologySection />
      <FeaturesSection />
      <SDGSection />
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-900 to-sky-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">🌬️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">WairaAI</h2>
                  <Badge className="bg-blue-700 text-white border-0">Hackathon for Progress</Badge>
                </div>
              </div>
              <p className="max-w-xs text-emerald-200">
                Plataforma inteligente para la acción climática (ODS 13) que integra agentes IA, IBM watsonx.ai y tecnologías NASA para agricultura sostenible.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Plataforma</h3>
                <ul className="space-y-2 text-sky-200">
                  <li><a href="#" className="hover:text-white">Alertas Climáticas</a></li>
                  <li><a href="#" className="hover:text-white">Granja Virtual</a></li>
                  <li><a href="#" className="hover:text-white">Agentes IA</a></li>
                  <li><a href="#" className="hover:text-white">Cadena de Suministro</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Recursos</h3>
                <ul className="space-y-2 text-sky-200">
                  <li><a href="#" className="hover:text-white">APIs & Servicios</a></li>
                  <li><a href="#" className="hover:text-white">Documentación</a></li>
                  <li><a href="#" className="hover:text-white">GitHub</a></li>
                  <li><a href="#" className="hover:text-white">IBM watsonx.ai</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Hackathon</h3>
                <ul className="space-y-2 text-sky-200">
                  <li><a href="#" className="hover:text-white">Sobre el Reto</a></li>
                  <li><a href="#" className="hover:text-white">ODS 13</a></li>
                  <li><a href="#" className="hover:text-white">Nuestro Equipo</a></li>
                  <li><a href="#" className="hover:text-white">Contacto</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-emerald-800 mt-12 pt-8 text-emerald-300">
            <p>© 2023 WairaAI. Desarrollado para Hackathon for Progress with RAG and IBM watsonx.ai</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Badge variant="outline" className="border-emerald-700 text-emerald-300">
                GRANITE MODEL
              </Badge>
              <Badge variant="outline" className="border-emerald-700 text-emerald-300">
                RAG
              </Badge>
              <Badge variant="outline" className="border-emerald-700 text-emerald-300">
                LangChain
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Mini componente para las tarjetas de agentes
const AgentCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => {
  return (
    <div className={`p-4 rounded-lg border ${color} flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Landing; 