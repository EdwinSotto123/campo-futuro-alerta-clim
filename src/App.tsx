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
import AlertasPage from "./pages/Alertas";
import ClimateChallengePage from "./pages/ClimateChallenge";
import IASosteniblePage from "./pages/IA-Sostenible";
import MapaClimaticoPage from "./pages/MapaClimatico";
import AnalisisRAGPage from "./pages/AnalisisRAG";
import MonitoreoSatelitalPage from "./pages/MonitoreoSatelital";
import PlanesAccionPage from "./pages/PlanesAccion";
import CentroEmergenciasPage from "./pages/CentroEmergencias";
import MiParcelaPage from "./pages/MiParcela";
import CentroAprendizajePage from "./pages/CentroAprendizaje";

// Create placeholder pages for routes without full implementation
const AjustesPage = () => <div className="space-y-6"><h1 className="text-3xl font-bold">Ajustes</h1><p>Configure sus preferencias de la aplicación.</p></div>;
const AsistentePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Asistente Virtual</h1>
      <p className="text-lg">Interactúa con Wara, tu asistente virtual para agricultura andina.</p>
      <div className="p-4 bg-white rounded-lg shadow-md border border-agriculture-earth/20">
        <p className="text-sm">Puedes comunicarte con el asistente desde cualquier página usando el botón de chat ubicado en la esquina inferior derecha de la pantalla.</p>
      </div>
    </div>
  );
};

const MascotaPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mascota Andina</h1>
      <p className="text-lg">Conoce a Agro, tu compañero virtual que te brinda consejos para la agricultura sostenible.</p>
      <div className="p-4 bg-white rounded-lg shadow-md border border-agriculture-earth/20">
        <p className="text-sm">Tu mascota virtual aparecerá en la esquina de la pantalla para brindarte consejos contextuales mientras navegas por la aplicación.</p>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/alertas" element={<AppLayout><AlertasPage /></AppLayout>} />
          <Route path="/consejos" element={<AppLayout><ConsejosPage /></AppLayout>} />
          <Route path="/centro-aprendizaje" element={<AppLayout><CentroAprendizajePage /></AppLayout>} />
          <Route path="/monitoreo" element={<AppLayout><MonitoreoPage /></AppLayout>} />
          <Route path="/comunidad" element={<AppLayout><ComunidadPage /></AppLayout>} />
          <Route path="/financiamiento" element={<AppLayout><FinanciamientoPage /></AppLayout>} />
          <Route path="/mi-parcela" element={<AppLayout><MiParcelaPage /></AppLayout>} />
          <Route path="/climate-challenge" element={<AppLayout><ClimateChallengePage /></AppLayout>} />
          <Route path="/ia-sostenible" element={<AppLayout><IASosteniblePage /></AppLayout>} />
          <Route path="/mapa-climatico" element={<AppLayout><MapaClimaticoPage /></AppLayout>} />
          <Route path="/analisis-rag" element={<AppLayout><AnalisisRAGPage /></AppLayout>} />
          <Route path="/monitoreo-satelital" element={<AppLayout><MonitoreoSatelitalPage /></AppLayout>} />
          <Route path="/planes-accion" element={<AppLayout><PlanesAccionPage /></AppLayout>} />
          <Route path="/centro-emergencias" element={<AppLayout><CentroEmergenciasPage /></AppLayout>} />
          <Route path="/ajustes" element={<AppLayout><AjustesPage /></AppLayout>} />
          <Route path="/asistente" element={<AppLayout><AsistentePage /></AppLayout>} />
          <Route path="/mascota" element={<AppLayout><MascotaPage /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
