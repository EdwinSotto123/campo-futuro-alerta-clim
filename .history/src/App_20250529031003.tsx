import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import MonitoreoPage from "./pages/Monitoreo";
import ConsejosPage from "./pages/Consejos";
import FinanciamientoPage from "./pages/Financiamiento";
import ComunidadPage from "./pages/Comunidad";
import AsistentePage from "./pages/AsistentePage";
import AprendiendoPage from "./pages/AprendiendoPage";
import PerfilPage from "./pages/PerfilPage";
import AlertasPage from "./pages/AlertasPage";

// Create placeholder pages for routes without full implementation
const AjustesPage = () => <div className="space-y-6"><h1 className="text-3xl font-bold">Ajustes</h1><p>Configure sus preferencias de la aplicación.</p></div>;
const ConfiguracionPage = () => <div className="space-y-6"><h1 className="text-3xl font-bold">Configuración</h1><p>Configure sus preferencias de la aplicación.</p></div>;

import MascotaAndinaPage from "@/pages/MascotaAndina";
import MiGranjaVirtualPage from "@/pages/MiGranjaVirtual";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/alertas" element={<AppLayout><AlertasPage /></AppLayout>} />
          <Route path="/consejos" element={<AppLayout><ConsejosPage /></AppLayout>} />
          <Route path="/monitoreo" element={<AppLayout><MonitoreoPage /></AppLayout>} />
          <Route path="/comunidad" element={<AppLayout><ComunidadPage /></AppLayout>} />
          <Route path="/financiamiento" element={<AppLayout><FinanciamientoPage /></AppLayout>} />          <Route path="/aprendiendo" element={<AppLayout><AprendiendoPage /></AppLayout>} />
          <Route path="/mi-granja-virtual" element={<AppLayout><MiGranjaVirtualPage /></AppLayout>} />
          <Route path="/ajustes" element={<AppLayout><AjustesPage /></AppLayout>} /><Route path="/asistente" element={<AppLayout><AsistentePage /></AppLayout>} />
          <Route path="/mascota" element={<AppLayout><MascotaAndinaPage /></AppLayout>} />
          <Route path="/perfil" element={<AppLayout><PerfilPage /></AppLayout>} />
          <Route path="/configuracion" element={<AppLayout><ConfiguracionPage /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
