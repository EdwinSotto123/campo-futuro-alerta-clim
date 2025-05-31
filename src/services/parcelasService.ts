import { 
  collection, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
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
const COLECCION = 'parcelas';

// Interfaz para definir la estructura de una parcela
export interface Parcela {
  id?: string;
  nombre: string;
  cultivo: string;
  area: number;
  unidadArea: 'hectareas' | 'metros_cuadrados' | 'acres';
  fechaSiembra?: Date | null;
  fechaCosecha?: Date | null;
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
  propietario: string; // ID del usuario
  estado: 'activa' | 'inactiva' | 'cosechada';
  notas?: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Crea una nueva parcela
 * @param parcela Datos de la parcela a crear
 * @returns La parcela creada con su ID
 */
export const crearParcela = async (parcela: Parcela) => {
  return await crearDocumento(COLECCION, parcela);
};

/**
 * Actualiza una parcela existente
 * @param id ID de la parcela
 * @param parcela Datos a actualizar
 * @returns La parcela actualizada
 */
export const actualizarParcela = async (id: string, parcela: Partial<Parcela>) => {
  return await actualizarDocumento(COLECCION, id, parcela);
};

/**
 * Elimina una parcela
 * @param id ID de la parcela
 * @returns Objeto con el ID y estado de eliminación
 */
export const eliminarParcela = async (id: string) => {
  return await eliminarDocumento(COLECCION, id);
};

/**
 * Obtiene una parcela por su ID
 * @param id ID de la parcela
 * @returns La parcela si existe
 */
export const obtenerParcela = async (id: string) => {
  return await obtenerDocumento(COLECCION, id) as Parcela;
};

/**
 * Obtiene todas las parcelas
 * @returns Array de parcelas
 */
export const obtenerTodasLasParcelas = async () => {
  return await obtenerTodosLosDocumentos(COLECCION) as Parcela[];
};

/**
 * Obtiene parcelas de un propietario específico
 * @param propietarioId ID del propietario
 * @returns Array de parcelas del propietario
 */
export const obtenerParcelasPorPropietario = async (propietarioId: string) => {
  return await obtenerDocumentosPorFiltro(COLECCION, 'propietario', '==', propietarioId) as Parcela[];
};

/**
 * Obtiene parcelas por cultivo
 * @param cultivo Tipo de cultivo
 * @returns Array de parcelas con ese cultivo
 */
export const obtenerParcelasPorCultivo = async (cultivo: string) => {
  return await obtenerDocumentosPorFiltro(COLECCION, 'cultivo', '==', cultivo) as Parcela[];
};

/**
 * Obtiene parcelas activas ordenadas por fecha de siembra
 * @param propietarioId ID del propietario
 * @param limite Número máximo de parcelas a obtener
 * @returns Array de parcelas activas ordenadas
 */
export const obtenerParcelasActivasOrdenadas = async (propietarioId: string, limite?: number) => {
  const condiciones: QueryConstraint[] = [
    where('propietario', '==', propietarioId),
    where('estado', '==', 'activa'),
    orderBy('fechaSiembra', 'desc')
  ];
  
  if (limite) {
    condiciones.push(limit(limite));
  }
  
  return await obtenerDocumentosConQuery(COLECCION, condiciones) as Parcela[];
}; 