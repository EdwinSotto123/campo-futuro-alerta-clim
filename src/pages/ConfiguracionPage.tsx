import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  Camera,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Wifi,
  Battery,
  HardDrive,
  RefreshCw
} from "lucide-react";

interface ConfiguracionUsuario {
  // Perfil
  nombre: string;
  email: string;
  telefono: string;
  foto: string;
  
  // Notificaciones
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  alertasClimaticas: boolean;
  recordatoriosCultivos: boolean;
  noticiasAgricultura: boolean;
  
  // Apariencia
  tema: 'claro' | 'oscuro' | 'auto';
  idioma: 'es' | 'qu' | 'ay';
  tamanoFuente: 'pequeño' | 'mediano' | 'grande';
  
  // Privacidad
  perfilPublico: boolean;
  compartirUbicacion: boolean;
  compartirDatos: boolean;
  
  // Sistema
  sincronizacionAuto: boolean;
  respaldoAuto: boolean;
  limpiezaCache: boolean;
}

const ConfiguracionPage = () => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionUsuario>({
    // Perfil
    nombre: 'Carlos Mamani Quispe',
    email: 'carlos.mamani@gmail.com',
    telefono: '+591 70123456',
    foto: '',
    
    // Notificaciones
    notificacionesEmail: true,
    notificacionesPush: true,
    alertasClimaticas: true,
    recordatoriosCultivos: true,
    noticiasAgricultura: false,
    
    // Apariencia
    tema: 'auto',
    idioma: 'es',
    tamanoFuente: 'mediano',
    
    // Privacidad
    perfilPublico: false,
    compartirUbicacion: true,
    compartirDatos: false,
    
    // Sistema
    sincronizacionAuto: true,
    respaldoAuto: true,
    limpiezaCache: false
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const idiomas = [
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'qu', label: 'Quechua', flag: '🏔️' },
    { value: 'ay', label: 'Aymara', flag: '🏔️' }
  ];

  const temas = [
    { value: 'claro', label: 'Claro', icon: Sun },
    { value: 'oscuro', label: 'Oscuro', icon: Moon },
    { value: 'auto', label: 'Automático', icon: Monitor }
  ];

  const handleSaveConfig = () => {
    // Aquí se guardaría la configuración
    console.log('Configuración guardada:', configuracion);
  };

  const handleExportData = () => {
    // Exportar datos del usuario
    console.log('Exportando datos...');
  };

  const handleImportData = () => {
    // Importar datos del usuario
    console.log('Importando datos...');
  };

  const handleClearCache = () => {
    // Limpiar caché
    console.log('Limpiando caché...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <Settings className="h-12 w-12" />
            <div>
              <h1 className="text-4xl font-bold">Configuración</h1>
              <p className="text-lg opacity-90">Personaliza tu experiencia en AgroClima</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="apariencia" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Apariencia
            </TabsTrigger>
            <TabsTrigger value="privacidad" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacidad
            </TabsTrigger>
            <TabsTrigger value="sistema" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          {/* Tab Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Perfil
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal y foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foto de perfil */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={configuracion.foto} alt={configuracion.nombre} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                      {configuracion.nombre.split(' ').map(n => n.charAt(0)).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Cambiar Foto
                    </Button>
                    <p className="text-sm text-gray-500">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                    <Input 
                      value={configuracion.nombre}
                      onChange={(e) => setConfiguracion(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input 
                      type="email"
                      value={configuracion.email}
                      onChange={(e) => setConfiguracion(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <Input 
                      value={configuracion.telefono}
                      onChange={(e) => setConfiguracion(prev => ({ ...prev, telefono: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Cambio de contraseña */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contraseña Actual</label>
                      <div className="relative">
                        <Input 
                          type={mostrarPassword ? "text" : "password"}
                          value={passwordActual}
                          onChange={(e) => setPasswordActual(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setMostrarPassword(!mostrarPassword)}
                        >
                          {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                      <Input 
                        type="password"
                        value={passwordNueva}
                        onChange={(e) => setPasswordNueva(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                      <Input 
                        type="password"
                        value={confirmarPassword}
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="mt-4">
                    <Lock className="h-4 w-4 mr-2" />
                    Actualizar Contraseña
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Notificaciones */}
          <TabsContent value="notificaciones" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferencias de Notificaciones
                </CardTitle>
                <CardDescription>
                  Controla qué notificaciones quieres recibir y cómo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">Notificaciones por Email</span>
                      </div>
                      <p className="text-sm text-gray-500">Recibe notificaciones en tu correo electrónico</p>
                    </div>
                    <Switch 
                      checked={configuracion.notificacionesEmail}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, notificacionesEmail: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="font-medium">Notificaciones Push</span>
                      </div>
                      <p className="text-sm text-gray-500">Recibe notificaciones en tu dispositivo</p>
                    </div>
                    <Switch 
                      checked={configuracion.notificacionesPush}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, notificacionesPush: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="font-medium">Alertas Climáticas</span>
                      </div>
                      <p className="text-sm text-gray-500">Alertas de SENAMHI sobre clima extremo</p>
                    </div>
                    <Switch 
                      checked={configuracion.alertasClimaticas}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, alertasClimaticas: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="font-medium">Recordatorios de Cultivos</span>
                      </div>
                      <p className="text-sm text-gray-500">Recordatorios sobre siembra, riego y cosecha</p>
                    </div>
                    <Switch 
                      checked={configuracion.recordatoriosCultivos}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, recordatoriosCultivos: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="font-medium">Noticias de Agricultura</span>
                      </div>
                      <p className="text-sm text-gray-500">Noticias y consejos sobre agricultura</p>
                    </div>
                    <Switch 
                      checked={configuracion.noticiasAgricultura}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, noticiasAgricultura: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Apariencia */}
          <TabsContent value="apariencia" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Personalización de Apariencia
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la aplicación según tus preferencias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Tema</label>
                    <div className="grid grid-cols-3 gap-4">
                      {temas.map((tema) => (
                        <div
                          key={tema.value}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            configuracion.tema === tema.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setConfiguracion(prev => ({ ...prev, tema: tema.value as any }))}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <tema.icon className="h-8 w-8" />
                            <span className="font-medium">{tema.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Idioma</label>
                    <Select 
                      value={configuracion.idioma}
                      onValueChange={(value) => setConfiguracion(prev => ({ ...prev, idioma: value as any }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {idiomas.map((idioma) => (
                          <SelectItem key={idioma.value} value={idioma.value}>
                            <div className="flex items-center gap-2">
                              <span>{idioma.flag}</span>
                              <span>{idioma.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Tamaño de Fuente</label>
                    <Select 
                      value={configuracion.tamanoFuente}
                      onValueChange={(value) => setConfiguracion(prev => ({ ...prev, tamanoFuente: value as any }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeño">Pequeño</SelectItem>
                        <SelectItem value="mediano">Mediano</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Privacidad */}
          <TabsContent value="privacidad" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Privacidad
                </CardTitle>
                <CardDescription>
                  Controla qué información compartes y con quién
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-medium">Perfil Público</span>
                      <p className="text-sm text-gray-500">Permite que otros usuarios vean tu perfil</p>
                    </div>
                    <Switch 
                      checked={configuracion.perfilPublico}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, perfilPublico: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-medium">Compartir Ubicación</span>
                      <p className="text-sm text-gray-500">Permite usar tu ubicación para alertas locales</p>
                    </div>
                    <Switch 
                      checked={configuracion.compartirUbicacion}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, compartirUbicacion: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-medium">Compartir Datos Agrícolas</span>
                      <p className="text-sm text-gray-500">Permite usar tus datos para mejorar recomendaciones</p>
                    </div>
                    <Switch 
                      checked={configuracion.compartirDatos}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, compartirDatos: checked }))}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Gestión de Datos</h3>
                  <div className="space-y-3">
                    <Button variant="outline" onClick={handleExportData} className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar mis datos
                    </Button>
                    <Button variant="outline" onClick={handleImportData} className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar datos
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar mi cuenta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Sistema */}
          <TabsContent value="sistema" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configuración del Sistema
                </CardTitle>
                <CardDescription>
                  Ajustes técnicos y de rendimiento de la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-medium">Sincronización Automática</span>
                      <p className="text-sm text-gray-500">Sincroniza datos automáticamente en segundo plano</p>
                    </div>
                    <Switch 
                      checked={configuracion.sincronizacionAuto}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, sincronizacionAuto: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-medium">Respaldo Automático</span>
                      <p className="text-sm text-gray-500">Crea respaldos automáticos de tus datos</p>
                    </div>
                    <Switch 
                      checked={configuracion.respaldoAuto}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, respaldoAuto: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-medium">Limpieza Automática de Caché</span>
                      <p className="text-sm text-gray-500">Limpia automáticamente archivos temporales</p>
                    </div>
                    <Switch 
                      checked={configuracion.limpiezaCache}
                      onCheckedChange={(checked) => setConfiguracion(prev => ({ ...prev, limpiezaCache: checked }))}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Mantenimiento</h3>
                  <div className="space-y-3">
                    <Button variant="outline" onClick={handleClearCache} className="w-full justify-start">
                      <HardDrive className="h-4 w-4 mr-2" />
                      Limpiar Caché (234 MB)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sincronizar Datos
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Crear Respaldo Manual
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Información del Sistema</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Versión:</span>
                      <span className="ml-2 font-medium">AgroClima v1.0.0</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Última actualización:</span>
                      <span className="ml-2 font-medium">15 Ene 2025</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Espacio usado:</span>
                      <span className="ml-2 font-medium">1.2 GB</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estado:</span>
                      <Badge className="ml-2 bg-green-100 text-green-800">Conectado</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botón de guardar global */}
        <div className="flex justify-end">
          <Button onClick={handleSaveConfig} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPage; 