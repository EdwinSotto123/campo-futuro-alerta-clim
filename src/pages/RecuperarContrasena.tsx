import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "../lib/firebase";
import { sendPasswordResetEmail } from 'firebase/auth';

const RecuperarContrasena: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      // Manejar errores específicos de Firebase Auth
      let errorMessage = 'Ocurrió un error al enviar el correo';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico inválido.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos. Por favor, inténtalo más tarde.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-green-100">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardTitle className="text-2xl font-bold text-center">🌱 Campo Futuro</CardTitle>
          <CardDescription className="text-white/90 text-center">Recuperar contraseña</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? (
            <div className="space-y-4">
              <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                <AlertDescription>
                  Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña. 
                  Por favor, revisa tu bandeja de entrada.
                </AlertDescription>
              </Alert>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/login')}
              >
                Volver al inicio de sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@correo.com"
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-sm text-gray-600">
                  Ingresa el correo electrónico con el que te registraste para recibir las instrucciones de recuperación.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Spinner className="w-5 h-5 mr-2" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  'Enviar instrucciones'
                )}
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Button variant="link" className="text-green-600 p-0" onClick={() => navigate('/login')}>
                ← Volver al inicio de sesión
              </Button>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" className="text-gray-500 text-xs" onClick={() => navigate('/')}>
              ← Volver a la página principal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecuperarContrasena; 