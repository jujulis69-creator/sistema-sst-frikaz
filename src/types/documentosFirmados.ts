// ============================================================================
// TIPOS DE DATOS: DOCUMENTOS FIRMADOS RECIBIDOS Y ENVÍOS - FRIKAZ S.A.S.
// Sede: Bosa, Bogotá D.C. — Cuenta Oficial: frikaz.fritosnacks@gmail.com
// ============================================================================

export type TipoDocumentoFirmado =
  | 'responsabilidades'
  | 'politicas'
  | 'otros';

export type EstadoDocumentoFirmado =
  | 'Recibido'
  | 'Pendiente de revisión'
  | 'Aprobado'
  | 'Requiere corrección';

export interface HistorialTrazabilidadItem {
  id: string;
  fechaHora: string;
  evento: string;
  responsable: string;
  detalles: string;
  estadoResultante: EstadoDocumentoFirmado;
}

export interface DocumentoFirmadoRecibido {
  id: string;
  envioId: string; // Ej: FRK-ENV-2026-001 (identificador único de trazabilidad)
  nombreTrabajador: string;
  correoTrabajador: string;
  cargo: string;
  tipoDocumento: TipoDocumentoFirmado;
  nombreArchivoRecibido: string;
  tamanoArchivo: string;
  asuntoCorreo: string;
  fechaEnvioOriginal: string;
  fechaRecepcion: string;
  estado: EstadoDocumentoFirmado;
  cuentaReceptora: string; // frikaz.fritosnacks@gmail.com
  hiloCorreoId: string;
  mensajeTrabajador: string;
  observacionesRevision: string;
  revisadoPor: string | null;
  fechaRevision: string | null;
  detallesFirma: {
    numeroDocumento?: string;
    empresa: string;
    declaracionAceptacion: string;
    fechaFirma: string;
    firmaRegistrada: boolean;
  };
  trazabilidad: HistorialTrazabilidadItem[];
}

export interface RegistroEnvioPendiente {
  id: string;
  envioId: string;
  nombreTrabajador: string;
  correoTrabajador: string;
  cargo: string;
  tipoDocumento: TipoDocumentoFirmado;
  nombreDocumentoEnviado: string;
  asunto: string;
  cuerpo: string;
  fechaEnvio: string;
  cuentaEmisora: string; // frikaz.fritosnacks@gmail.com
  estado: 'Enviado - Esperando devolución';
}

export interface MetricasDocumentosFirmados {
  totalRecibidos: number;
  recibidos: number;
  pendientesRevision: number;
  aprobados: number;
  requierenCorreccion: number;
  porcentajeAprobados: number;
}
