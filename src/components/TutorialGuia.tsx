import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { Button } from './ui/button';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface TutorialGuiaProps {
  esPrimerIngreso?: boolean;
}

/**
 * Componente de tutorial guiado que muestra globos y flechas sobre la interfaz
 * para explicar cada sección de la aplicación.
 */
const TutorialGuia: React.FC<TutorialGuiaProps> = ({ esPrimerIngreso = false }) => {
  const [run, setRun] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);

  // Ejecutar el tutorial automáticamente en el primer ingreso
  useEffect(() => {
    const verificarEstadoTutorial = async () => {
      const usuario = auth.currentUser;
      if (usuario) {
        try {
          const docRef = doc(db, 'usuarios', usuario.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Si es la primera vez que ingresa o si explícitamente se solicita el tutorial
            if (esPrimerIngreso || (data.tutorialCompletado === false)) {
              setRun(true);
            }
          }
        } catch (error) {
          console.error("Error al verificar el estado del tutorial:", error);
        }
      }
    };

    verificarEstadoTutorial();
  }, [esPrimerIngreso]);

  // Marcar el tutorial como completado
  const marcarTutorialCompletado = async () => {
    const usuario = auth.currentUser;
    if (usuario) {
      try {
        const docRef = doc(db, 'usuarios', usuario.uid);
        await updateDoc(docRef, {
          tutorialCompletado: true
        });
      } catch (error) {
        console.error("Error al actualizar el estado del tutorial:", error);
      }
    }
  };

  // Definir los pasos del tutorial
  const pasos: Step[] = [
    {
      target: '.dashboard-bienvenida',
      content: '¡Bienvenido a WairaAI! Te guiaremos a través de las principales funciones de la plataforma.',
      placement: 'center',
      disableBeacon: true,
      title: '👋 ¡Bienvenido a WairaAI!'
    },
    {
      target: '.parcela-virtual',
      content: 'Esta es tu parcela virtual. Aquí puedes visualizar y gestionar tus cultivos, recursos y toda la cadena de suministro agrícola.',
      placement: 'bottom',
      title: '🌱 Parcela Virtual Interactiva'
    },
    {
      target: '.alerta-clima',
      content: 'Recibe alertas en tiempo real sobre eventos climáticos que podrían afectar tus cultivos, basadas en datos de satélites y APIs de NASA.',
      placement: 'bottom',
      title: '🌦️ Alertas Climáticas'
    },
    {
      target: '.agentes-ia',
      content: 'Nuestros agentes de IA especializados te ayudan con recomendaciones personalizadas para optimizar tus cultivos y recursos.',
      placement: 'bottom',
      title: '🤖 Agentes IA'
    },
    {
      target: '.cadena-suministro',
      content: 'Gestiona toda tu cadena de suministro desde proveedores hasta compradores, optimizando costos y reduciendo tu huella de carbono.',
      placement: 'bottom',
      title: '🔄 Cadena de Suministro'
    },
    {
      target: '.finanzas-agricolas',
      content: 'Accede a opciones de financiamiento y seguros específicos para agricultura sostenible y adaptación al cambio climático.',
      placement: 'bottom',
      title: '💰 Finanzas Agrícolas'
    },
    {
      target: '.perfil-usuario',
      content: 'Configura tu perfil, preferencias y ajusta las notificaciones según tus necesidades.',
      placement: 'bottom',
      title: '👤 Tu Perfil'
    },
    {
      target: '.ayuda-soporte',
      content: 'Si necesitas ayuda adicional, aquí encontrarás recursos, documentación y soporte técnico.',
      placement: 'bottom',
      title: '❓ Ayuda y Soporte'
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">¡Listo para comenzar!</h3>
          <p className="mb-4">Ahora tienes las herramientas para gestionar tu agricultura de forma sostenible y adaptada al cambio climático.</p>
          <Button 
            className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white"
            onClick={() => setRun(false)}
          >
            ¡Comenzar a usar WairaAI!
          </Button>
        </div>
      ),
      placement: 'center',
      title: '🚀 ¡Todo listo!'
    }
  ];

  // Manejar los callbacks del tutorial
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    
    // Actualizar el paso actual
    setPasoActual(index);

    // Cuando el tutorial termina (por completarlo o saltarlo)
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      marcarTutorialCompletado();
    }
  };

  // Permitir iniciar el tutorial manualmente
  const iniciarTutorial = () => {
    setRun(true);
    setPasoActual(0);
  };

  return (
    <>
      {/* Botón para iniciar el tutorial manualmente */}
      <Button 
        onClick={iniciarTutorial}
        variant="outline" 
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-white shadow-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        <span className="mr-2">?</span> Tutorial
      </Button>

      {/* Componente Joyride para el tour interactivo */}
      <Joyride
        steps={pasos}
        run={run}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        stepIndex={pasoActual}
        styles={{
          options: {
            primaryColor: '#059669', // Color emerald-600
            zIndex: 10000,
            arrowColor: '#ffffff',
            backgroundColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            textColor: '#374151',
            width: 320,
          },
          tooltip: {
            borderRadius: '0.75rem',
            padding: '1rem',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#059669',
            borderRadius: '0.5rem',
            color: '#ffffff',
            fontSize: '14px',
          },
          buttonBack: {
            color: '#6B7280',
            marginRight: 10,
            fontSize: '14px',
          },
          buttonSkip: {
            color: '#6B7280',
            fontSize: '14px',
          }
        }}
        locale={{
          back: 'Anterior',
          close: 'Cerrar',
          last: 'Finalizar',
          next: 'Siguiente',
          skip: 'Omitir',
          open: 'Abrir el tour guiado'
        }}
      />
    </>
  );
};

export default TutorialGuia; 