import { collection, query, where, orderBy, limit, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  crearDocumento,
  crearDocumentoConId,
  actualizarDocumento,
  eliminarDocumento,
  obtenerDocumento,
  obtenerTodosLosDocumentos,
  obtenerDocumentosPorFiltro,
  obtenerDocumentosConQuery
} from './firestoreService';

// Nombre de la colección en Firestore
const COLECCION = 'celdas_granja';

// Tipos importados de la aplicación
export type TipoCelda = 'cultivo' | 'proveedor' | 'cliente' | 'trabajador' | 'almacen' | 'reservorio' | 'vacio';

export interface CeldaGranja {
  id?: string;
  tipo: TipoCelda;
  subtipo?: string; // Subtipo específico (mayorista, distribuidor, etc.)
  fila: number;
  columna: number;
  datos?: any; // Datos específicos según el tipo
  propietario: string; // ID del usuario dueño de la granja
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Crea una nueva celda en la granja
 * @param celda Datos de la celda a crear
 * @returns La celda creada con su ID
 */
export const crearCeldaGranja = async (celda: CeldaGranja) => {
  return await crearDocumento(COLECCION, celda);
};

/**
 * Actualiza una celda existente
 * @param id ID de la celda
 * @param celda Datos a actualizar
 * @returns La celda actualizada
 */
export const actualizarCeldaGranja = async (id: string, celda: Partial<CeldaGranja>) => {
  return await actualizarDocumento(COLECCION, id, celda);
};

/**
 * Elimina una celda
 * @param id ID de la celda
 * @returns Objeto con el ID y estado de eliminación
 */
export const eliminarCeldaGranja = async (id: string) => {
  return await eliminarDocumento(COLECCION, id);
};

/**
 * Obtiene una celda por su ID
 * @param id ID de la celda
 * @returns La celda si existe
 */
export const obtenerCeldaGranja = async (id: string) => {
  return await obtenerDocumento(COLECCION, id) as CeldaGranja;
};

/**
 * Obtiene todas las celdas de un propietario
 * @param propietarioId ID del propietario
 * @returns Array de celdas del propietario
 */
export const obtenerCeldasPorPropietario = async (propietarioId: string) => {
  return await obtenerDocumentosPorFiltro(COLECCION, 'propietario', '==', propietarioId) as CeldaGranja[];
};

/**
 * Obtiene celdas por tipo
 * @param propietarioId ID del propietario
 * @param tipo Tipo de celda (cultivo, proveedor, etc.)
 * @returns Array de celdas del tipo especificado
 */
export const obtenerCeldasPorTipo = async (propietarioId: string, tipo: TipoCelda) => {
  const condiciones: QueryConstraint[] = [
    where('propietario', '==', propietarioId),
    where('tipo', '==', tipo)
  ];
  
  return await obtenerDocumentosConQuery(COLECCION, condiciones) as CeldaGranja[];
};

/**
 * Obtiene una celda por su posición en la granja
 * @param propietarioId ID del propietario
 * @param fila Número de fila
 * @param columna Número de columna
 * @returns La celda en esa posición, si existe
 */
export const obtenerCeldaPorPosicion = async (propietarioId: string, fila: number, columna: number) => {
  const condiciones: QueryConstraint[] = [
    where('propietario', '==', propietarioId),
    where('fila', '==', fila),
    where('columna', '==', columna)
  ];
  
  const celdas = await obtenerDocumentosConQuery(COLECCION, condiciones) as CeldaGranja[];
  return celdas.length > 0 ? celdas[0] : null;
};

/**
 * Inicializa una granja vacía para un nuevo usuario
 * @param propietarioId ID del propietario
 * @param filas Número de filas de la granja
 * @param columnas Número de columnas de la granja
 * @returns Array de celdas creadas
 */
export const inicializarGranjaVacia = async (propietarioId: string, filas: number, columnas: number) => {
  const celdasCreadas: CeldaGranja[] = [];
  
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      const nuevaCelda: CeldaGranja = {
        tipo: 'vacio',
        fila: i,
        columna: j,
        propietario: propietarioId
      };
      
      const celdaCreada = await crearCeldaGranja(nuevaCelda);
      celdasCreadas.push(celdaCreada as unknown as CeldaGranja);
    }
  }
  
  return celdasCreadas;
}; 