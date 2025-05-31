import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import ConsejosPage from "./pages/Consejos";
import MonitoreoPage from "./pages/Monitoreo";
import ComunidadPage from "./pages/Comunidad";
import FinanciamientoPage from "./pages/Financiamiento";
import AprendiendoPage from "./pages/AprendiendoPage";
import AsistentePage from "./pages/AsistentePage";
import PerfilPage from "./pages/PerfilPage";
import AlertasPage from "./pages/AlertasPage";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MascotaAndinaPage from "@/pages/MascotaAndina";
import MiGranjaVirtual from "@/pages/MiGranjaVirtual";
import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarContrasena from './pages/RecuperarContrasena';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Create placeholder pages for routes without full implementation
const AjustesPage = () => <div className="space-y-6"><h1 className="text-3xl font-bold">Ajustes</h1><p>Configure sus preferencias de la aplicación.</p></div>;
const ConfiguracionPage = () => <div className="space-y-6"><h1 className="text-3xl font-bold">Configuración</h1><p>Configure sus preferencias de la aplicación.</p></div>;

const queryClient = new QueryClient();

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              {/* Ruta de landing page pública */}
              <Route path="/" element={<Landing />} />
              
              {/* Rutas públicas de autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AppLayout><MiGranjaVirtual /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/mi-granja-virtual" 
                element={
                  <ProtectedRoute>
                    <AppLayout><MiGranjaVirtual /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/alertas" 
                element={
                  <ProtectedRoute>
                    <AppLayout><AlertasPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/consejos" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ConsejosPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/monitoreo" 
                element={
                  <ProtectedRoute>
                    <AppLayout><MonitoreoPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/comunidad" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ComunidadPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/financiamiento" 
                element={
                  <ProtectedRoute>
                    <AppLayout><FinanciamientoPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/aprendiendo" 
                element={
                  <ProtectedRoute>
                    <AppLayout><AprendiendoPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ajustes" 
                element={
                  <ProtectedRoute>
                    <AppLayout><AjustesPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/asistente" 
                element={
                  <ProtectedRoute>
                    <AppLayout><AsistentePage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/mascota" 
                element={
                  <ProtectedRoute>
                    <AppLayout><MascotaAndinaPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <AppLayout><PerfilPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/configuracion" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ConfiguracionPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
