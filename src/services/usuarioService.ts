import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Interfaz para datos de usuario
export interface Usuario {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaRegistro: Date;
  tipo: 'agricultor' | 'tecnico' | 'administrador';
  ubicacion?: {
    departamento?: string;
    provincia?: string;
    distrito?: string;
    direccion?: string;
    coordenadas?: {
      lat: number;
      lng: number;
    };
  };
  contacto?: {
    telefono?: string;
    celular?: string;
    telegramId?: string;
  };
  configuracion: {
    alertasActivadas: boolean;
    temaOscuro: boolean;
    idioma: 'es' | 'en' | 'pt' | 'qu';
  };
  metadata?: {
    ultimoAcceso?: Date;
    dispositivosConectados?: number;
    zonaHoraria?: string;
  };
  permisos?: string[];
}

/**
 * Crea un nuevo perfil de usuario en Firestore
 * @param userId ID del usuario (de Firebase Auth)
 * @param userData Datos del usuario
 */
export const crearPerfilUsuario = async (userId: string, userData: Usuario) => {
  // Agregar campos de metadata
  const userWithMetadata = {
    ...userData,
    metadata: {
      ultimoAcceso: new Date(),
      dispositivosConectados: 1,
      zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  };
  
  await setDoc(doc(db, 'usuarios', userId), userWithMetadata);
  return { id: userId, ...userWithMetadata };
};

/**
 * Obtiene el perfil de un usuario por su ID
 * @param userId ID del usuario
 */
export const obtenerPerfilUsuario = async (userId: string): Promise<Usuario | null> => {
  try {
    const docRef = doc(db, 'usuarios', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data() as Usuario;
      return { id: userId, ...userData };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    throw error;
  }
};

/**
 * Actualiza el perfil de un usuario
 * @param userId ID del usuario
 * @param userData Datos a actualizar
 */
export const actualizarPerfilUsuario = async (userId: string, userData: Partial<Usuario>) => {
  try {
    // Actualizar la fecha de último acceso
    if (!userData.metadata) {
      userData.metadata = {};
    }
    userData.metadata.ultimoAcceso = new Date();
    
    await updateDoc(doc(db, 'usuarios', userId), userData);
    return { id: userId, ...userData };
  } catch (error) {
    console.error("Error al actualizar perfil de usuario:", error);
    throw error;
  }
};

/**
 * Actualiza la configuración de un usuario
 * @param userId ID del usuario
 * @param config Configuración a actualizar
 */
export const actualizarConfiguracionUsuario = async (userId: string, config: Partial<Usuario['configuracion']>) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    
    // Primero obtenemos el documento actual para no sobrescribir otras configuraciones
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data() as Usuario;
      const configuracionActualizada = {
        ...userData.configuracion,
        ...config
      };
      
      await updateDoc(userRef, { configuracion: configuracionActualizada });
      return configuracionActualizada;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    throw error;
  }
};

/**
 * Registra el acceso de un usuario
 * @param userId ID del usuario
 */
export const registrarAccesoUsuario = async (userId: string) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    
    // Actualizamos el último acceso
    await updateDoc(userRef, { 
      'metadata.ultimoAcceso': new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error al registrar acceso:", error);
    return false;
  }
}; 