
import { ReactNode } from "react";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Mascot from "@/components/Mascot";
import Chatbot from "@/components/Chatbot";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="pb-12">
          <Header />
          <main className="container px-4 py-8">
            {children}
          </main>
          <footer className="border-t bg-background/80 backdrop-blur-sm mt-8">
            <div className="container flex h-14 items-center justify-between px-4">
              <p className="text-sm text-muted-foreground">
                © 2024 AgroClima. Desarrollado para proteger la agricultura sostenible.
              </p>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
      
      {/* Interactive Elements */}
      <Mascot />
      <Chatbot />
    </div>
  );
};

export default AppLayout;
