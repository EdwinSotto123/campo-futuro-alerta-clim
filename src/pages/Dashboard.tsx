import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CloudRain, Wheat, Bot, Truck, Coins, User, HelpCircle } from 'lucide-react';
import TutorialGuia from '../components/TutorialGuia';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [primerIngreso, setPrimerIngreso] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Obtener datos del usuario desde Firestore
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsuario({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || `${userData.nombre} ${userData.apellido}`,
              ...userData
            });

            // Verificar si es el primer ingreso
            if (userData.tutorialCompletado === undefined) {
              setPrimerIngreso(true);
            }
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        } finally {
          setCargando(false);
        }
      } else {
        // Redirigir al inicio de sesión si no hay usuario autenticado
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tutorial guiado */}
      <TutorialGuia esPrimerIngreso={primerIngreso} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-emerald-700">WairaAI</h1>
            <div className="flex items-center gap-3">
              <div className="perfil-usuario">
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  <span>{usuario?.displayName || 'Usuario'}</span>
                </Button>
              </div>
              <div className="ayuda-soporte">
                <Button variant="outline" size="sm" className="text-gray-600">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Ayuda
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-6">
        {/* Bienvenida */}
        <section className="dashboard-bienvenida mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-500 to-sky-600 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">¡Bienvenido a WairaAI, {usuario?.nombre || 'Agricultor'}!</h2>
              <p className="text-white/90 mb-4">Tu plataforma de agricultura sostenible y adaptada al cambio climático</p>
              <Button className="bg-white text-emerald-700 hover:bg-gray-100">
                Comenzar ahora
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Tarjetas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Parcela Virtual */}
          <Card className="parcela-virtual border-emerald-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Wheat className="h-5 w-5" />
                Parcela Virtual
              </CardTitle>
              <CardDescription>Gestiona tu granja digital</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Visualiza y administra todos los aspectos de tu parcela virtual.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                onClick={() => navigate('/mi-granja-virtual')}
              >
                Ver mi parcela
              </Button>
            </CardContent>
          </Card>

          {/* Alertas Climáticas */}
          <Card className="alerta-clima border-blue-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <CloudRain className="h-5 w-5" />
                Alertas Climáticas
              </CardTitle>
              <CardDescription>Datos en tiempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Monitorea condiciones climáticas y recibe alertas tempranas.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/alertas')}
              >
                Ver alertas
              </Button>
            </CardContent>
          </Card>

          {/* Agentes IA */}
          <Card className="agentes-ia border-purple-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Bot className="h-5 w-5" />
                Agentes IA
              </CardTitle>
              <CardDescription>Asistentes inteligentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Obtén recomendaciones personalizadas para optimizar tus cultivos.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-purple-600 text-purple-700 hover:bg-purple-50"
                onClick={() => navigate('/asistente')}
              >
                Consultar agentes
              </Button>
            </CardContent>
          </Card>

          {/* Cadena de Suministro */}
          <Card className="cadena-suministro border-amber-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Truck className="h-5 w-5" />
                Cadena de Suministro
              </CardTitle>
              <CardDescription>Optimiza tus recursos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Gestiona proveedores, logística y compradores de forma eficiente.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-amber-600 text-amber-700 hover:bg-amber-50"
                onClick={() => navigate('/suministro')}
              >
                Ver cadena
              </Button>
            </CardContent>
          </Card>

          {/* Finanzas Agrícolas */}
          <Card className="finanzas-agricolas border-green-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Coins className="h-5 w-5" />
                Finanzas Agrícolas
              </CardTitle>
              <CardDescription>Acceso a financiamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Explora opciones de crédito y seguros para agricultura sostenible.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => navigate('/financiamiento')}
              >
                Ver opciones
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-600 text-center">
            © 2023 WairaAI | Creado para Hackathon for Progress with IBM watsonx.ai
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard; 