import { ReactNode } from "react";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AnimalAdvisor from "@/components/AnimalAdvisor";
import VirtualAssistant from "@/components/VirtualAssistant";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}



const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Only show interactive elements on main pages, not on their dedicated pages
  const showInteractive = path !== "/asistente" && path !== "/mascota";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="pb-12">
          <Header />
          <main className="container px-4 py-8">
            {children}
          </main>
          <footer className="border-t bg-background/80 backdrop-blur-sm mt-8 border-agriculture-terracotta/10">
            <div className="container flex h-14 items-center justify-between px-4">
              <p className="text-sm text-muted-foreground">
                © 2024 AgroClima. Desarrollado para proteger la agricultura sostenible en la región andina.
              </p>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
      
      {/* Interactive Elements - only show on main pages */}
      {showInteractive && (
        <>
          <AnimalAdvisor />
          <VirtualAssistant />
        </>
      )}
    </div>
  );
};

export default AppLayout;
