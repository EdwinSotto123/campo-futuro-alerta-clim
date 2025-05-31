import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  WhereFilterOp
} from 'firebase/firestore';

/**
 * Servicio para interactuar con Firestore
 */

/**
 * Crea un nuevo documento con ID generado automáticamente
 * @param coleccion Nombre de la colección
 * @param datos Datos a guardar en el documento
 * @returns El documento creado con su ID
 */
export const crearDocumento = async (coleccion: string, datos: any) => {
  try {
    const datosConTimestamp = {
      ...datos,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, coleccion), datosConTimestamp);
    return { id: docRef.id, ...datosConTimestamp };
  } catch (error) {
    console.error(`Error al crear documento en ${coleccion}:`, error);
    throw error;
  }
};

/**
 * Crea o sobrescribe un documento con ID específico
 * @param coleccion Nombre de la colección
 * @param id ID del documento
 * @param datos Datos a guardar en el documento
 * @returns El documento creado
 */
export const crearDocumentoConId = async (coleccion: string, id: string, datos: any) => {
  try {
    const datosConTimestamp = {
      ...datos,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, coleccion, id), datosConTimestamp);
    return { id, ...datosConTimestamp };
  } catch (error) {
    console.error(`Error al crear documento con ID en ${coleccion}:`, error);
    throw error;
  }
};

/**
 * Actualiza un documento existente
 * @param coleccion Nombre de la colección
 * @param id ID del documento
 * @param datos Datos a actualizar
 * @returns El documento actualizado
 */
export const actualizarDocumento = async (coleccion: string, id: string, datos: any) => {
  try {
    const datosActualizados = {
      ...datos,
      updatedAt: serverTimestamp()
    };
    
    const docRef = doc(db, coleccion, id);
    await updateDoc(docRef, datosActualizados);
    return { id, ...datosActualizados };
  } catch (error) {
    console.error(`Error al actualizar documento en ${coleccion}:`, error);
    throw error;
  }
};

/**
 * Elimina un documento
 * @param coleccion Nombre de la colección
 * @param id ID del documento
 * @returns Objeto con el ID y estado de eliminación
 */
export const eliminarDocumento = async (coleccion: string, id: string) => {
  try {
    const docRef = doc(db, coleccion, id);
    await deleteDoc(docRef);
    return { id, eliminado: true };
  } catch (error) {
    console.error(`Error al eliminar documento en ${coleccion}:`, error);
    throw error;
  }
};

/**
 * Obtiene un documento por su ID
 * @param coleccion Nombre de la colección
 * @param id ID del documento
 * @returns El documento si existe
 */
export const obtenerDocumento = async (coleccion: string, id: string) => {
  try {
    const docRef = doc(db, coleccion, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error(`Documento no encontrado en ${coleccion}`);
    }
  } catch (error) {
    console.error(`Error al obtener documento de ${coleccion}:`, error);
    throw error;
  }
};

/**
 * Obtiene todos los documentos de una colección
 * @param coleccion Nombre de la colección
 * @returns Array de documentos
 */
export const obtenerTodosLosDocumentos = async (coleccion: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, coleccion));
    
    const documentos: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documentos.push({ id: doc.id, ...doc.data() });
    });
    
    return documentos;
  } catch (error) {
    console.error(`Error al obtener documentos de ${coleccion}:`, error);
    throw error;
  }
};

/**
 * Obtiene documentos que cumplen con una condición
 * @param coleccion Nombre de la colección
 * @param campo Campo por el que filtrar
 * @param operador Operador de comparación
 * @param valor Valor a comparar
 * @returns Array de documentos filtrados
 */
export const obtenerDocumentosPorFiltro = async (
  coleccion: string, 
  campo: string, 
  operador: WhereFilterOp, 
  valor: any
) => {
  try {
    const q = query(collection(db, coleccion), where(campo, operador, valor));
    const querySnapshot = await getDocs(q);
    
    const documentos: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documentos.push({ id: doc.id, ...doc.data() });
    });
    
    return documentos;
  } catch (error) {
    console.error(`Error al obtener documentos de ${coleccion} por filtro:`, error);
    throw error;
  }
};

/**
 * Obtiene documentos con múltiples condiciones, ordenamiento y limitación
 * @param coleccion Nombre de la colección
 * @param condiciones Array de restricciones (where, orderBy, limit)
 * @returns Array de documentos filtrados
 */
export const obtenerDocumentosConQuery = async (
  coleccion: string,
  condiciones: QueryConstraint[]
) => {
  try {
    const q = query(collection(db, coleccion), ...condiciones);
    const querySnapshot = await getDocs(q);
    
    const documentos: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documentos.push({ id: doc.id, ...doc.data() });
    });
    
    return documentos;
  } catch (error) {
    console.error(`Error al obtener documentos con query de ${coleccion}:`, error);
    throw error;
  }
}; 