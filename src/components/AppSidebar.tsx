
import { 
  Home, Bell, BarChart2, CloudRain, Users, PiggyBank, MessageSquare, Settings, Leaf, Bot, HelpCircle, Globe, TreePine, Map, Brain, Satellite, Shield, AlertTriangle
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
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
  ];

  // Define Climate Challenge items with advanced features
  const climateItems = [
    { 
      icon: Globe, 
      label: "Climate Challenge", 
      path: "/climate-challenge" 
    },
    { 
      icon: TreePine, 
      label: "IA Sostenible", 
      path: "/ia-sostenible" 
    },
    { 
      icon: Map, 
      label: "Mapa Climático", 
      path: "/mapa-climatico" 
    },
    { 
      icon: Brain, 
      label: "Análisis RAG", 
      path: "/analisis-rag" 
    },
    { 
      icon: Satellite, 
      label: "Monitoreo Satelital", 
      path: "/monitoreo-satelital" 
    },
    { 
      icon: Shield, 
      label: "Planes de Acción", 
      path: "/planes-accion" 
    },
    { 
      icon: AlertTriangle, 
      label: "Centro de Emergencias", 
      path: "/centro-emergencias" 
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

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar variant="inset" className="border-r border-agriculture-terracotta/20">
      <SidebarHeader className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-2">
            <div className="bg-gradient-to-br from-agriculture-terracotta to-agriculture-earth h-8 w-8 rounded-full flex items-center justify-center">
              <Leaf className="text-white h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <h3 className="font-semibold text-lg text-gradient">AgroClima</h3>
                <p className="text-xs text-muted-foreground">Call for Code 2024</p>
              </div>
            )}
          </div>
          <SidebarTrigger />
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
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={collapsed ? item.label : undefined}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center ${isActive(item.path) ? 'text-agriculture-terracotta font-medium' : 'hover:text-agriculture-terracotta'}`}
                    >
                      <item.icon className={`h-4 w-4 mr-2 ${isActive(item.path) ? 'text-agriculture-terracotta' : ''}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-green-600 font-medium">Climate Challenge - ODS 13</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {climateItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={collapsed ? item.label : undefined}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center ${isActive(item.path) ? 'text-green-600 font-medium' : 'hover:text-green-600'}`}
                    >
                      <item.icon className={`h-4 w-4 mr-2 ${isActive(item.path) ? 'text-green-600' : ''}`} />
                      {!collapsed && <span>{item.label}</span>}
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
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={collapsed ? item.label : undefined}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center ${isActive(item.path) ? 'text-agriculture-brown font-medium' : 'hover:text-agriculture-brown'}`}
                    >
                      <item.icon className={`h-4 w-4 mr-2 ${isActive(item.path) ? 'text-agriculture-brown' : ''}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chatbot and assistance section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-agriculture-gold font-medium">Asistencia IA</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={collapsed ? item.label : undefined}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center ${isActive(item.path) ? 'text-agriculture-gold font-medium' : 'hover:text-agriculture-gold'}`}
                    >
                      <item.icon className={`h-4 w-4 mr-2 ${isActive(item.path) ? 'text-agriculture-gold' : ''}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-agriculture-terracotta/10" />
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/ajustes")} tooltip={collapsed ? "Ajustes" : undefined}>
                  <Link 
                    to="/ajustes" 
                    className={`flex items-center ${isActive("/ajustes") ? 'text-agriculture-gold font-medium' : 'hover:text-agriculture-gold'}`}
                  >
                    <Settings className={`h-4 w-4 mr-2 ${isActive("/ajustes") ? 'text-agriculture-gold' : ''}`} />
                    {!collapsed && <span>Ajustes</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
