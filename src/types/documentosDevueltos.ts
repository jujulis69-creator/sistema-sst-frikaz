// ============================================================================
// TIPOS DE DATOS: BANDEJA DE DOCUMENTOS DEVUELTOS POR CORREO - FRIKAZ S.A.S.
// Cuenta oficial: frikaz.fritosnacks@gmail.com
// ============================================================================

export type TipoDocumentoCorreo =
  | 'responsabilidades'
  | 'politicas'
  | 'otros';

export type EstadoDocumentoCorreo =
  | 'Pendiente de devolución'
  | 'Recibido'
  | 'En revisión'
  | 'Aprobado'
  | 'Requiere corrección';

export interface TrazabilidadEventoDocumento {
  id: string;
  fechaHora: string;
  evento: string;
  autor: string;
  detalles: string;
  estadoResultante: EstadoDocumentoCorreo;
}

export interface DocumentoDevuelto {
  id: string;
  envioId: string; // Ej: ENV-2026-001 (referencia cruzada de envío)
  nombreTrabajador: string;
  correoElectronico: string;
  cargo: string;
  tipoDocumento: TipoDocumentoCorreo;
  nombreArchivo: string;
  tamanoArchivo: string;
  tipoMime: string;
  asuntoCorreo: string;
  fechaEnvio: string;
  fechaRecepcion: string | null;
  estado: EstadoDocumentoCorreo;
  cuentaReceptora: string; // frikaz.fritosnacks@gmail.com
  hiloCorreoId: string;
  cuerpoMensajeOriginal: string;
  cuerpoRespuestaTrabajador: string;
  observacionesRevision: string;
  revisadoPor: string | null;
  fechaRevision: string | null;
  contenidoDocumentoUrl?: string; // Data URL o URL blob para previsualización directa
  detallesDocumento: {
    numeroDocumento?: string;
    empresa: string;
    declaracionAceptacion: string;
    fechaFirma?: string;
    firmaRegistrada: boolean;
  };
  trazabilidad: TrazabilidadEventoDocumento[];
}

export interface FiltrosDocumentosDevueltos {
  busqueda: string;
  tipoDocumento: 'todos' | TipoDocumentoCorreo;
  estado: 'todos' | EstadoDocumentoCorreo;
  cargo: string;
}

export interface MetricasBandejaDocumentos {
  totalDocumentos: number;
  recibidos: number;
  enRevision: number;
  aprobados: number;
  requierenCorreccion: number;
  pendientesDevolucion: number;
  porcentajeAprobacion: number;
}
