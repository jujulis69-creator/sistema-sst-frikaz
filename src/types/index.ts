export type AreaNormativa = 'SST' | 'Ambiental';

export type TipoDisposicion =
  | 'Ley'
  | 'Decreto'
  | 'Decreto Único Reglamentario'
  | 'Resolución'
  | 'Circular'
  | 'Norma Técnica Distrital'
  | 'Acuerdo Distrital';

export type Jurisdiccion =
  | 'Nacional'
  | 'Distrital (Bogotá D.C.)'
  | 'Departamental'
  | 'Nacional y Distrital (Bogotá D.C.)';

export type EstadoVigencia =
  | 'Vigente verificada'
  | 'Pendiente de validación normativa'
  | 'Modificada'
  | 'Derogada'
  | 'No aplicable con justificación';

export type EstadoRevision = 'Revisada' | 'En revisión' | 'Pendiente';

export type EstadoAplicabilidad = 'Aplicable' | 'No aplica con justificación' | 'Pendiente de evaluación';

export type EstadoCumplimientoObligacion =
  | 'Cumple y tiene evidencia verificada'
  | 'Cumple parcialmente'
  | 'No cumple'
  | 'Pendiente de ejecución'
  | 'Pendiente de verificación'
  | 'No aplica con justificación'
  | 'Pendiente de evaluación';

export type FrecuenciaObligacion =
  | 'Única vez'
  | 'Mensual'
  | 'Bimestral'
  | 'Trimestral'
  | 'Semestral'
  | 'Anual'
  | 'Permanente';

export type ResultadoVerificacion =
  | 'Conforme'
  | 'No Conforme'
  | 'Conforme con observaciones'
  | 'Pendiente';

export type EstadoAccionCorrectiva =
  | 'Abierta'
  | 'En ejecución'
  | 'Verificada y cerrada'
  | 'Vencida';

export type ResultadoEficacia =
  | 'Eficaz (Cierre aprobado)'
  | 'No eficaz (Requiere nueva acción)'
  | 'Pendiente de verificación';

export type TipoArchivo =
  | 'PDF'
  | 'Excel'
  | 'Word'
  | 'Imagen'
  | 'Registro Físico / Digital';

export type EstadoRevisionEvidencia =
  | 'Verificada y suficiente'
  | 'Pendiente de revisión'
  | 'Rechazada / Insuficiente'
  | 'Vencida';

export interface Norm {
  id: string;
  codigoIdentificador: string;
  area: AreaNormativa;
  tipoDisposicion: TipoDisposicion;
  numero: string;
  anio: number;
  nombreOficial: string;
  entidadEmisora: string;
  articulosAplicables: string;
  descripcion: string;
  importanciaFrikaz: string;
  aplicabilidadConcreta: string;
  jurisdiccion: Jurisdiccion;
  alcance: string;
  estadoVigencia: EstadoVigencia;
  modificacionesIdentificadas: string;
  fechaUltimaConsulta: string;
  fuenteOficial: string;
  enlaceFuente: string;
  responsable: string;
  estadoRevision: EstadoRevision;
  observaciones: string;
}

export interface Obligacion {
  id: string;
  codigo: string;
  normaId: string;
  articuloNumeral: string;
  descripcionObligacion: string;
  justificacionAplicabilidad: string;
  actividadNecesaria: string;
  responsable: string;
  fechaLimite: string;
  frecuencia: FrecuenciaObligacion;
  recursosNecesarios: string;
  indicadorCumplimiento: string;
  evidenciaRequerida: string;
  estadoCumplimiento: EstadoCumplimientoObligacion;
  estadoAplicabilidad: EstadoAplicabilidad;
  fechaUltimaVerificacion: string;
  observaciones: string;
}

export interface FasePlanear {
  descripcion: string;
  objetivo: string;
  requisitoLegal: string;
  actividadesPlanificacion: string;
  recursos: string;
  responsable: string;
  fechaProgramada: string;
  indicadorEsperado: string;
  completado: boolean;
}

export interface FaseHacer {
  descripcion: string;
  actividadesEjecutadas: string;
  procedimientosAplicados: string;
  recursosUtilizados: string;
  responsable: string;
  fechaEjecucion: string;
  evidenciasObtenidas: string;
  completado: boolean;
}

export interface FaseVerificar {
  descripcion: string;
  criteriosEvaluacion: string;
  metodoVerificacion: string;
  revisionEvidencias: string;
  resultado: ResultadoVerificacion;
  hallazgos: string;
  fechaRevision: string;
  responsableVerificacion: string;
  completado: boolean;
}

export interface FaseActuar {
  descripcion: string;
  incumplimientoIdentificado: string;
  accionCorrectivaMejora: string;
  responsable: string;
  fechaLimite: string;
  estadoAccion: 'No requerida' | 'Abierta' | 'En ejecución' | 'Verificada y cerrada';
  evidenciaEjecucion: string;
  verificacionEficacia: string;
  fechaCierre: string;
  completado: boolean;
}

export interface PhvaRegistro {
  id: string;
  obligacionId: string;
  normaId: string;
  tituloActividad: string;
  planear: FasePlanear;
  hacer: FaseHacer;
  verificar: FaseVerificar;
  actuar: FaseActuar;
  fechaActualizacion: string;
}

export interface Evidencia {
  id: string;
  codigo: string;
  nombre: string;
  normaId: string;
  obligacionId: string;
  actividadPhvaId?: string;
  tipoArchivo: TipoArchivo;
  descripcion: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  responsable: string;
  ubicacionOEnlace: string;
  archivoNombre?: string;
  archivoDataUrl?: string;
  estadoRevision: EstadoRevisionEvidencia;
  observaciones: string;
}

export interface AccionCorrectiva {
  id: string;
  codigo: string;
  obligacionId: string;
  normaId: string;
  hallazgo: string;
  causaIdentificada: string;
  accionPropuesta: string;
  responsable: string;
  fechaApertura: string;
  fechaLimite: string;
  estado: EstadoAccionCorrectiva;
  evidenciaEjecucion: string;
  fechaVerificacion: string;
  resultadoVerificacionEficacia: ResultadoEficacia;
  fechaCierre?: string;
}

export interface AspectoAmbiental {
  id: string;
  categoria:
    | 'Aceite de Cocina Usado (ACU)'
    | 'Residuos Sólidos Ordinarios y Aprovechables'
    | 'Aguas Residuales No Domésticas (Vertimientos)'
    | 'Empaques y Plásticos Bilaminados'
    | 'Consumo de Agua'
    | 'Consumo de Energía y Gas'
    | 'Emisiones Atmosféricas y Vahos de Fritura'
    | 'Ruido Ambiental';
  actividadProductiva: string;
  impactoPotencial: string;
  normaAplicableRef: string;
  obligacionLegalRef: string;
  medidaControl: string;
  registroAutoridad: string;
  responsable: string;
  evidenciaAsociada: string;
  estadoCumplimiento: string;
  accionMejora: string;
}

export interface PeligroSST {
  id: string;
  categoriaPeligro:
    | 'Físico (Temperaturas extremas / Calor de freidoras)'
    | 'Mecánico (Cortes por rebanadoras y cuchillas rotativas)'
    | 'Locativo (Pisos resbalosos por salpicadura de grasa)'
    | 'Químico (Gases de combustión y detergentes de desengrase)'
    | 'Biológico (Manipulación de materias primas agrícolas)'
    | 'Biomecánico (Bipedestación y manipulación manual de bultos)'
    | 'Tecnológico (Incendio por aceite caliente >160°C o gas)'
    | 'Psicosocial (Ritmo de producción en línea)';
  procesoRelacionado: string;
  peligroEspecifico: string;
  efectoPosibleSalud: string;
  normaRelacionadaRef: string;
  controlesExistentes: string;
  eppRequerido: string;
  capacitacionRequerida: string;
  responsable: string;
  estadoControl: string;
}

export interface EmpresaFrikazConfig {
  nombre: string;
  nit: string;
  direccion: string;
  barrio: string;
  localidad: string;
  ciudad: string;
  departamento: string;
  pais: string;
  numeroTrabajadores: number;
  actividadEconomicaGeneral: string;
  ciiuPrincipal: string;
  arl: string;
  claseRiesgoSST: string;
  justificacionClaseRiesgo: string;
  estandaresMinimosAplicables: string;
  procesosProductivos: string[];
  maquinariaUtilizada: string[];
  insumosPrincipales: string[];
  residuosGenerados: string[];
  condicionesAmbientales: string[];
}

export interface AlertaItem {
  id: string;
  tipo:
    | 'ACTIVIDAD_VENCIDA'
    | 'ACTIVIDAD_POR_VENCER'
    | 'EVIDENCIA_FALTANTE'
    | 'EVIDENCIA_VENCIDA'
    | 'OBLIGACION_INCUMPLIDA'
    | 'ACCION_CORRECTIVA_ATRASADA'
    | 'NORMA_PENDIENTE_VALIDACION';
  severidad: 'urgente' | 'advertencia' | 'informativa';
  titulo: string;
  descripcion: string;
  referencia: string;
  fechaRelevante?: string;
  area: AreaNormativa;
}

export interface IndicadoresCumplimiento {
  totalNormas: number;
  normasVigentesVerificadas: number;
  normasPendientesValidacion: number;
  normasModificadas: number;
  normasDerogadas: number;
  totalObligaciones: number;
  obligacionesAplicables: number;
  obligacionesCumplidasVerificadas: number;
  obligacionesParciales: number;
  obligacionesIncumplidas: number;
  obligacionesPendientesEjecucion: number;
  obligacionesPendientesVerificacion: number;
  obligacionesNoAplica: number;
  evidenciasFaltantes: number;
  actividadesProximasVencer: number;
  actividadesVencidas: number;
  accionesCorrectivasAbiertas: number;
  porcentajeCumplimientoSST: number;
  porcentajeCumplimientoAmbiental: number;
  porcentajeCumplimientoGeneral: number;
  fasesPhvaCompletadas: {
    planear: number;
    hacer: number;
    verificar: number;
    actuar: number;
    total: number;
  };
}
