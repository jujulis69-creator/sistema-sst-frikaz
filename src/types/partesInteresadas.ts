// ============================================================================
// TIPOS DE DATOS: GESTIÓN DE PARTES INTERESADAS - FRIKAZ S.A.S.
// Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)
// ============================================================================

export type ClasificacionParteInteresada = 'interna' | 'externa';

export interface ParteInteresada {
  id: string;
  nombre: string;
  clasificacion: ClasificacionParteInteresada;
  descripcion: string;
  necesidadesExpectativas: string;
  peligrosSituaciones: string;
  posiblesAfectaciones: string;
  medidasPrevencionControl: string;
  seguimiento: string;
  fechaActualizacion: string;
}

export type CargoChecklistInterno = 'gerente' | 'operarios' | 'conductor';

export type EstadoCumplimientoChecklist = 'Cumplido' | 'Pendiente' | 'En proceso';

export interface ItemChecklistNecesidad {
  id: string;
  cargo: CargoChecklistInterno;
  numero: number;
  necesidad: string;
  estado: EstadoCumplimientoChecklist;
  observaciones: string;
  evidencias: string;
  responsable: string;
  fechaVerificacion: string;
}

export interface RegistroHistorialChecklist {
  id: string;
  fecha: string;
  cargo: CargoChecklistInterno;
  responsableEvaluador: string;
  porcentajeCumplimiento: number;
  cumplidas: number;
  enProceso: number;
  pendientes: number;
  observacionesGenerales: string;
}

export interface ResumenIndicadoresCargo {
  cargo: CargoChecklistInterno;
  nombreCargo: string;
  total: number;
  cumplidas: number;
  enProceso: number;
  pendientes: number;
  porcentaje: number;
}

export interface IndicadoresGlobalesPartesInteresadas {
  totalNecesidades: number;
  cumplidas: number;
  enProceso: number;
  pendientes: number;
  porcentajeCumplimiento: number;
  porCargo: Record<CargoChecklistInterno, ResumenIndicadoresCargo>;
}
