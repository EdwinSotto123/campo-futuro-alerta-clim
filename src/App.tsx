
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import MonitoreoPage from "./pages/Monitoreo";
import ConsejosPage from "./pages/Consejos";
import FinanciamientoPage from "./pages/Financiamiento";
import ComunidadPage from "./pages/Comunidad";

// Create placeholder pages for routes without full implementation
const AlertasPage = () => <div className="space-y-6"><h1 className="text-3xl font-bold">Alertas Climáticas</h1><p>Contenido de alertas climáticas estará disponible aquí.</p></div>;
const AjustesPage = () => <div className="space-y-6"><h1 className="text-3xl font-bold">Ajustes</h1><p>Configure sus preferencias de la aplicación.</p></div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/alertas" element={<AppLayout><AlertasPage /></AppLayout>} />
          <Route path="/consejos" element={<AppLayout><ConsejosPage /></AppLayout>} />
          <Route path="/monitoreo" element={<AppLayout><MonitoreoPage /></AppLayout>} />
          <Route path="/comunidad" element={<AppLayout><ComunidadPage /></AppLayout>} />
          <Route path="/financiamiento" element={<AppLayout><FinanciamientoPage /></AppLayout>} />
          <Route path="/ajustes" element={<AppLayout><AjustesPage /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
