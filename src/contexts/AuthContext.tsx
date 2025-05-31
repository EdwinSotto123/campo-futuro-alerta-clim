import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { obtenerPerfilUsuario, registrarAccesoUsuario, Usuario } from '../services/usuarioService';

// Interfaz para el contexto de autenticación
interface AuthContextType {
  currentUser: User | null;
  profileData: Usuario | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfil de usuario desde Firestore
  const loadUserProfile = async (user: User) => {
    try {
      const profile = await obtenerPerfilUsuario(user.uid);
      if (profile) {
        setProfileData(profile);
        // Registrar el acceso del usuario
        await registrarAccesoUsuario(user.uid);
      } else {
        console.warn('No se encontró perfil para el usuario:', user.uid);
      }
    } catch (err) {
      console.error('Error al cargar el perfil:', err);
      setError('No se pudo cargar el perfil de usuario');
    }
  };

  // Función para refrescar el perfil manualmente
  const refreshProfile = async () => {
    if (currentUser) {
      setLoading(true);
      await loadUserProfile(currentUser);
      setLoading(false);
    }
  };

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await loadUserProfile(user);
      } else {
        setProfileData(null);
      }
      
      setLoading(false);
    });

    // Limpiar suscripción al desmontar
    return unsubscribe;
  }, []);

  // Cerrar sesión
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      throw err;
    }
  };

  // Enviar correo para restablecer contraseña
  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.error('Error al enviar correo de restablecimiento:', err);
      return false;
    }
  };

  // Valor del contexto
  const value: AuthContextType = {
    currentUser,
    profileData,
    loading,
    error,
    signOut,
    sendPasswordResetEmail,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 