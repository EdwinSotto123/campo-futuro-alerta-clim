
import { 
  Home, Bell, BarChart2, CloudRain, Users, PiggyBank, MessageSquare, Settings, Menu
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
import { Button } from "@/components/ui/button";

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

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-2">
            <div className="agriculture-gradient h-8 w-8 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌱</span>
            </div>
            {!collapsed && (
              <div>
                <h3 className="font-semibold text-lg text-gradient">AgroClima</h3>
                <p className="text-xs text-muted-foreground">Tu asistente agrícola</p>
              </div>
            )}
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={collapsed ? item.label : undefined}>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Recursos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={collapsed ? item.label : undefined}>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/ajustes")} tooltip={collapsed ? "Ajustes" : undefined}>
                  <Link to="/ajustes" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
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
