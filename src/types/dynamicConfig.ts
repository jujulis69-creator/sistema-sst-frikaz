export type ModalidadContrato =
  | 'indefinido'
  | 'fijo'
  | 'obra_labor'
  | 'aprendizaje'
  | 'servicios'
  | 'temporal_mision'
  | 'teletrabajo'
  | 'otra';

export type SectorEconomico = 'primario' | 'secundario' | 'terciario' | 'otro';

export type ClaseRiesgoLaboral =
  | 'Clase I (Mínimo)'
  | 'Clase II (Bajo)'
  | 'Clase III (Medio)'
  | 'Clase IV (Alto)'
  | 'Clase V (Máximo)';

export type ModalidadTrabajo =
  | 'Presencial en planta'
  | 'Mixto / Híbrido'
  | 'Trabajo remoto / Teletrabajo';

export interface CaracterizacionEmpresaDinamica {
  // A. Contratos
  modalidadesContrato: ModalidadContrato[];
  detallesContratos: {
    cantidadIndefinido: number;
    cantidadFijo: number;
    cantidadObraLabor: number;
    cantidadAprendices: number;
    cantidadServicios: number;
    cantidadTemporalMision: number;
    otrasModalidadesTexto: string;
  };

  // B. Trabajadores
  numeroTrabajadores: number;

  // C. Sector & Actividad
  sectorEconomico: SectorEconomico;
  ciiuPrincipal: string;
  actividadEconomicaConcreta: string;
  descripcionCadenaValor: string;

  // D. Otras variables condicionantes
  claseRiesgoSST: ClaseRiesgoLaboral;
  arlNombre: string;
  modalidadTrabajo: ModalidadTrabajo;
  procesosProductivos: string[];
  maquinariaEquipos: string[];
  sustanciasQuimicas: string[];
  aspectosAmbientales: string[];
  residuosGenerados: string[];
  consumoAguaEnergia: {
    fuenteAgua: string;
    consumoEstimadoM3Mes: number;
    fuenteEnergia: string;
    combustibleTermico: string; // ej. Gas Natural / GLP
  };
  permisosAutorizaciones: string[];
  sedesInstalaciones: {
    areaM2: number;
    pisosNiveles: number;
    trampaGrasasOperativa: boolean;
    campanaExtractoraFiltros: boolean;
    direccionPlanta: string;
    localidad: string;
    ciudad: string;
  };
}

export type EstadoResultadoRegla =
  | 'APLICABLE'
  | 'NO_APLICABLE'
  | 'REQUIERE_REVISION'
  | 'PENDIENTE_INFORMACION'
  | 'MODIFICADA_ALCANCE';

export interface ReglaNormativa {
  id: string;
  normaReferencia: string;
  disposicionArticulo: string;
  area: 'SST' | 'AMBIENTAL' | 'INTEGRAL';
  fasePhva: 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';
  condicionAplicacion: string;
  datosRequeridos: string[];
  umbralLegalTexto: string;
  explicacionSencilla: string;
  fuenteOficial: string;
  fechaVerificacion: string;
  evaluar: (config: CaracterizacionEmpresaDinamica) => {
    resultado: EstadoResultadoRegla;
    explicacion: string;
    informacionPendiente?: string;
    requiereRevisionHumana: boolean;
    cambiosPropuestos?: {
      nuevoEstadoCumplimiento?: 'CUMPLE' | 'PARCIAL' | 'NO_CUMPLE' | 'PENDIENTE' | 'NO_APLICA';
      nuevaDescripcion?: string;
      nuevaImportancia?: string;
      nuevaAplicabilidad?: string;
      nuevaEvidencia?: string;
      nuevoResponsable?: string;
    };
  };
}

export interface PropuestaCambioNorma {
  id: string;
  normaId: string;
  normaOficial: string;
  articulos: string;
  area: 'SST' | 'AMBIENTAL' | 'INTEGRAL';
  fasePhva: 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';
  categoriaAlerta:
    | 'NORMA_NUEVA_APLICABLE'
    | 'REVISION_APLICABILIDAD'
    | 'OBLIGACION_MODIFICADA'
    | 'EVIDENCIA_AJUSTE'
    | 'INFORMACION_PENDIENTE'
    | 'SIN_CAMBIOS';
  motivoAlerta: string;
  justificacionLegal: string;
  valorAnteriorTexto: string;
  valorPropuestoTexto: string;
  estadoPropuesta: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'MODIFICADA';
  decisionUsuario?: {
    accion: 'APROBAR' | 'RECHAZAR' | 'MODIFICAR';
    fecha: string;
    responsable: string;
    justificacion?: string;
  };
}

export interface ResumenEvaluacionImpacto {
  id: string;
  fechaHora: string;
  usuarioResponsable: string;
  variableModificada: string;
  valorAnterior: any;
  valorNuevo: any;
  totalNormasEvaluadas: number;
  totalNormasAfectadas: number;
  normasNuevasAplicables: PropuestaCambioNorma[];
  normasParaRevisar: PropuestaCambioNorma[];
  normasSinCambios: PropuestaCambioNorma[];
  obligacionesModificadas: PropuestaCambioNorma[];
  evidenciasAjustar: PropuestaCambioNorma[];
  datosPendientes: PropuestaCambioNorma[];
  propuestas: PropuestaCambioNorma[];
  resumenEjecutivo: string;
}

export interface RegistroHistorialCambio {
  id: string;
  timestamp: string;
  usuario: string;
  caracteristicaModificada: string;
  valorAnterior: string;
  valorNuevo: string;
  cantidadNormasReevaluadas: number;
  resumenResultado: string;
  propuestasGeneradas: number;
  propuestasAprobadas: number;
  propuestasRechazadas: number;
  estadoFinal: 'APLICADO_TOTAL' | 'APLICADO_PARCIAL' | 'RECHAZADO' | 'PENDIENTE';
}
