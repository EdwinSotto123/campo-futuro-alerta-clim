import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import logoWaira from "../logo-waira.png";
import { CloudRain, Lock, Mail, ArrowLeft, Globe, Wheat, Sun, LucideShield } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirigir al dashboard tras el login exitoso
    } catch (err: any) {
      // Manejar errores específicos de Firebase Auth
      let errorMessage = 'Ocurrió un error al iniciar sesión';
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Por favor, inténtalo más tarde.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = 'Error al iniciar sesión con Google';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Has cerrado la ventana de inicio de sesión.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'La solicitud fue cancelada.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Ya existe una cuenta con el mismo correo pero con diferente método de inicio de sesión.';
      }
      setError(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Fondo mejorado con gradientes y elementos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-blue-50 to-sky-100 overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Patrones agrícolas estilizados */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-emerald-700 to-sky-700 opacity-80"></div>
        <div className="absolute top-16 left-5 w-8 h-8 text-emerald-600/30">
          <Wheat className="w-full h-full" />
        </div>
        <div className="absolute top-14 right-20 w-10 h-10 text-sky-600/30">
          <CloudRain className="w-full h-full" />
        </div>
        <div className="absolute top-20 left-1/3 w-6 h-6 text-emerald-600/30">
          <Sun className="w-full h-full" />
        </div>
        <div className="absolute bottom-24 right-10 w-8 h-8 text-sky-600/30">
          <Globe className="w-full h-full" />
        </div>
        <div className="absolute bottom-24 left-10 w-8 h-8 text-emerald-600/30">
          <Wheat className="w-full h-full" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-r from-emerald-700 to-sky-700 opacity-80"></div>
      </div>
      
      {/* Contenedor para efecto de cristal/vidrio */}
      <div className="w-full max-w-md relative z-10 p-3">
        <Card className="backdrop-blur-md bg-white/90 shadow-2xl border-0 overflow-hidden rounded-2xl">
          {/* Elementos decorativos de la tarjeta */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-emerald-500/20 rounded-full transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-sky-500/20 rounded-full transform -translate-x-10 translate-y-10"></div>
          
          {/* Encabezado con logo mejorado */}
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-sky-600 pt-8 pb-6 relative overflow-hidden">
            {/* Efecto brillante en el encabezado */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-y-12"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-lg flex items-center justify-center border-4 border-white/50">
                  <img 
                    src={logoWaira} 
                    alt="WairaAI Logo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-white drop-shadow-md">
                WairaAI
              </CardTitle>
              <CardDescription className="text-white/90 text-center mt-2 text-base">
                Accede a tu parcela virtual inteligente
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 relative z-10">
            {/* Indicador de seguridad */}
            <div className="flex items-center justify-center mb-4 text-sm text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-100">
              <LucideShield className="h-4 w-4 mr-2 text-emerald-600" />
              Conexión segura para proteger tus datos
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Botón de inicio de sesión con Google */}
            <div className="mb-6">
              <Button 
                type="button" 
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-5 border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">Continuar con Google</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-200 absolute w-full"></div>
              <div className="bg-white px-4 z-10 text-sm text-gray-500">o</div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@correo.com"
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 pl-3 py-2.5"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-0">
                    <Mail className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700 flex items-center gap-2 font-medium">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Contraseña
                  </Label>
                  <Button variant="link" size="sm" className="text-emerald-600 p-0 h-auto font-medium hover:text-emerald-700" 
                    onClick={() => navigate('/recuperar-contrasena')}>
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 pl-3 py-2.5"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-0">
                    <Lock className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white py-6 mt-3 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Spinner className="w-5 h-5 mr-2" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Button variant="link" className="text-emerald-600 p-0 font-semibold hover:text-emerald-700" onClick={() => navigate('/registro')}>
                  Regístrate aquí
                </Button>
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6 pt-0">
            <Button 
              variant="ghost" 
              className="text-gray-500 text-xs flex items-center gap-1 hover:bg-gray-100/50" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-3 w-3" />
              Volver a la página principal
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Banner de información */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-white/80 backdrop-blur-sm text-emerald-800 py-2 px-4 rounded-full shadow-md border border-emerald-100 flex items-center">
          <CloudRain className="h-4 w-4 mr-2 text-sky-600" />
          <span className="text-sm">Protegiendo tus cultivos, preservando el planeta</span>
          <Globe className="h-4 w-4 ml-2 text-emerald-600" />
        </div>
      </div>
    </div>
  );
};

export default Login; 