import { 
  Home, Bell, BarChart2, CloudRain, Users, PiggyBank, MessageSquare, Settings, Leaf, Bot, HelpCircle, GraduationCap, User, Grid3X3, Tractor
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarSeparator, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();

  // Define the main navigation items
  const navItems = [
    { 
      icon: Home, 
      label: "Inicio", 
      path: "/" 
    },
    { 
      icon: CloudRain, 
      label: "Alertas Climáticas", 
      path: "/alertas" 
    },
    { 
      icon: MessageSquare, 
      label: "Consejos IA", 
      path: "/consejos" 
    },
    { 
      icon: BarChart2, 
      label: "Monitoreo", 
      path: "/monitoreo" 
    },
  ];

  // Define resources navigation items
  const resourceItems = [
    { 
      icon: Users, 
      label: "Comunidad", 
      path: "/comunidad" 
    },
    { 
      icon: PiggyBank, 
      label: "Financiamiento", 
      path: "/financiamiento" 
    },
    { 
      icon: GraduationCap, 
      label: "Aprendiendo", 
      path: "/aprendiendo" 
    },
  ];

  // Define chatbot and assistance items
  const chatItems = [
    { 
      icon: Bot, 
      label: "Asistente Virtual", 
      path: "/asistente" 
    },
    { 
      icon: HelpCircle, 
      label: "Mascota Andina", 
      path: "/mascota" 
    },
  ];

  // Define account items
  const accountItems = [
    { 
      icon: User, 
      label: "Mi Perfil", 
      path: "/perfil" 
    },
    { 
      icon: Settings, 
      label: "Configuración", 
      path: "/configuracion" 
    },
  ];

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar variant="sidebar" collapsible="none" className="border-r border-agriculture-terracotta/20">
      <SidebarHeader className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-gradient-to-br from-agriculture-terracotta to-agriculture-earth h-8 w-8 rounded-full flex items-center justify-center">
            <Leaf className="text-white h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gradient">AgroClima</h3>
            <p className="text-xs text-muted-foreground">Región Andina</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="bg-gradient-to-b from-amber-50 to-orange-50">
        <SidebarGroup>
          <SidebarGroupLabel className="text-agriculture-terracotta font-medium">Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center ${isActive(item.path) ? 'text-agriculture-terracotta font-medium' : 'hover:text-agriculture-terracotta'}`}
                    >
                      <item.icon className={`h-4 w-4 mr-2 ${isActive(item.path) ? 'text-agriculture-terracotta' : ''}`} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-agriculture-brown font-medium">Recursos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center ${isActive(item.path) ? 'text-agriculture-brown font-medium' : 'hover:text-agriculture-brown'}`}
                    >
                      <item.icon className={`h-4 w-4 mr-2 ${isActive(item.path) ? 'text-agriculture-brown' : ''}`} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chatbot and assistance section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-agriculture-gold font-medium">Asistencia</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center ${isActive(item.path) ? 'text-agriculture-gold font-medium' : 'hover:text-agriculture-gold'}`}
                    >
                      <item.icon className={`h-4 w-4 mr-2 ${isActive(item.path) ? 'text-agriculture-gold' : ''}`} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-agriculture-terracotta/10" />
        
        {/* Account section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-agriculture-terracotta font-medium">Mi Cuenta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center ${isActive(item.path) ? 'text-agriculture-terracotta font-medium' : 'hover:text-agriculture-terracotta'}`}
                    >
                      <item.icon className={`h-4 w-4 mr-2 ${isActive(item.path) ? 'text-agriculture-terracotta' : ''}`} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
