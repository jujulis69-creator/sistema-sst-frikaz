// ============================================================================
// SERVICIO DE GESTIÓN: DOCUMENTOS DEVUELTOS POR CORREO - FRIKAZ S.A.S.
// Cuenta oficial conectada: frikaz.fritosnacks@gmail.com
// ============================================================================

import {
  DocumentoDevuelto,
  EstadoDocumentoCorreo,
  TipoDocumentoCorreo,
  MetricasBandejaDocumentos,
  TrazabilidadEventoDocumento,
} from '../types/documentosDevueltos';

const STORAGE_KEY_DOCS_DEVUELTOS = 'frikaz_documentos_devueltos_correo_v1';
export const CUENTA_GMAIL_OFICIAL = 'frikaz.fritosnacks@gmail.com';

// ----------------------------------------------------------------------------
// DATOS SEMILLA INICIALES CON EVIDENCIA DOCUMENTAL REALISTA
// ----------------------------------------------------------------------------

export const DOCUMENTOS_DEVUELTOS_INICIALES: DocumentoDevuelto[] = [
  {
    id: 'doc-001',
    envioId: 'FRK-ENV-2026-001',
    nombreTrabajador: 'Juan Carlos Ramírez Peña',
    correoElectronico: 'juan.ramirez.frikaz@gmail.com',
    cargo: 'Operario de Frito',
    tipoDocumento: 'responsabilidades',
    nombreArchivo: 'Responsabilidades_Operario_Frito_JuanRamirez_Firmado.pdf',
    tamanoArchivo: '245 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: 'Re: [FRK-ENV-2026-001] Notificación Oficial Responsabilidades SST — Operario de Frito',
    fechaEnvio: '2026-03-01 08:30',
    fechaRecepcion: '2026-03-02 14:15',
    estado: 'Recibido',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: 'th-9842109847120',
    cuerpoMensajeOriginal:
      'Estimado Juan Carlos Ramírez Peña:\nAdjunto remitimos su formato de Responsabilidades y Compromisos en SST como Operario de Frito. Por favor devolver firmado.',
    cuerpoRespuestaTrabajador:
      'Buenas tardes. Adjunto el documento de responsabilidades debidamente firmado por mi parte. Saludos cordiales.\nJuan Carlos Ramírez - Planta Frikaz Bosa.',
    observacionesRevision: 'Documento recibido desde Gmail. Pendiente de verificación por Talento Humano.',
    revisadoPor: null,
    fechaRevision: null,
    detallesDocumento: {
      numeroDocumento: 'C.C. 1.024.589.632',
      empresa: 'Frikaz S.A.S. — Sede Bosa',
      declaracionAceptacion:
        'Yo, Juan Carlos Ramírez Peña, manifiesto expresamente que he recibido, leído y aceptado las responsabilidades de SST para el cargo de Operario de Frito (procedimientos seguros en pailas >160°C, uso de guantes térmicos y reporte de incidentes).',
      fechaFirma: '2026-03-02',
      firmaRegistrada: true,
    },
    trazabilidad: [
      {
        id: 'tz-001-1',
        fechaHora: '2026-03-01 08:30',
        evento: 'Envío inicial desde Organigrama',
        autor: 'Sistema SG-SST (Frikaz)',
        detalles: 'Se envió documento de responsabilidades a juan.ramirez.frikaz@gmail.com',
        estadoResultante: 'Pendiente de devolución',
      },
      {
        id: 'tz-001-2',
        fechaHora: '2026-03-02 14:15',
        evento: 'Recepción automática Gmail',
        autor: 'Gmail API (frikaz.fritosnacks@gmail.com)',
        detalles: 'Se detectó correo entrante con archivo adjunto PDF (245 KB) e hilo FRK-ENV-2026-001',
        estadoResultante: 'Recibido',
      },
    ],
  },
  {
    id: 'doc-002',
    envioId: 'FRK-ENV-2026-002',
    nombreTrabajador: 'Carlos Eduardo Gómez Nieto',
    correoElectronico: 'carlos.gomez.conductor@gmail.com',
    cargo: 'Conductor',
    tipoDocumento: 'responsabilidades',
    nombreArchivo: 'Responsabilidades_Conductor_CarlosGomez_Firmado.pdf',
    tamanoArchivo: '312 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: 'Re: [FRK-ENV-2026-002] Asignación y Compromisos SST Conductor — Frikaz S.A.S.',
    fechaEnvio: '2026-02-28 10:15',
    fechaRecepcion: '2026-03-01 11:20',
    estado: 'Aprobado',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: 'th-8374928172938',
    cuerpoMensajeOriginal:
      'Estimado Carlos Eduardo Gómez:\nRemitimos documento de responsabilidades de Seguridad Vial y SST para el cargo de Conductor. Favor devolver firmado.',
    cuerpoRespuestaTrabajador:
      'Buen día equipo SST. Envío el archivo con mi firma y número de cédula. Quedo atento a la entrega del kit preoperacional.\nCarlos Gómez - Distribución.',
    observacionesRevision: 'Firma y huella verificadas conforme al documento de identidad. Cumple con todos los requisitos del PESV y Dec. 1072/2015.',
    revisadoPor: 'Lic. Martha Helena Roa (Talento Humano / SST)',
    fechaRevision: '2026-03-01 16:30',
    detallesDocumento: {
      numeroDocumento: 'C.C. 79.845.120',
      empresa: 'Frikaz S.A.S. — Sede Bosa',
      declaracionAceptacion:
        'Yo, Carlos Eduardo Gómez Nieto, conductor de distribución, acepto el cumplimiento estricto de las normas de seguridad vial, inspección preoperacional diaria y ergonomía en cargue.',
      fechaFirma: '2026-03-01',
      firmaRegistrada: true,
    },
    trazabilidad: [
      {
        id: 'tz-002-1',
        fechaHora: '2026-02-28 10:15',
        evento: 'Envío inicial desde Organigrama',
        autor: 'Sistema SG-SST (Frikaz)',
        detalles: 'Notificación enviada a carlos.gomez.conductor@gmail.com',
        estadoResultante: 'Pendiente de devolución',
      },
      {
        id: 'tz-002-2',
        fechaHora: '2026-03-01 11:20',
        evento: 'Recepción automática Gmail',
        autor: 'Gmail API (frikaz.fritosnacks@gmail.com)',
        detalles: 'Correo recibido con archivo PDF adjunto',
        estadoResultante: 'Recibido',
      },
      {
        id: 'tz-002-3',
        fechaHora: '2026-03-01 16:30',
        evento: 'Aprobación de Talento Humano',
        autor: 'Lic. Martha Helena Roa',
        detalles: 'Documento revisado y marcado como Aprobado en el archivo maestro',
        estadoResultante: 'Aprobado',
      },
    ],
  },
  {
    id: 'doc-003',
    envioId: 'FRK-ENV-2026-003',
    nombreTrabajador: 'María Fernanda López Castro',
    correoElectronico: 'maria.lopez.empaque@gmail.com',
    cargo: 'Operario de Empaque',
    tipoDocumento: 'responsabilidades',
    nombreArchivo: 'Responsabilidades_Empaque_MariaLopez.pdf',
    tamanoArchivo: '198 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: 'Re: [FRK-ENV-2026-003] Responsabilidades SST Operario de Empaque — Frikaz S.A.S.',
    fechaEnvio: '2026-03-02 09:00',
    fechaRecepcion: '2026-03-03 16:40',
    estado: 'En revisión',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: 'th-4928192837123',
    cuerpoMensajeOriginal:
      'Estimada María Fernanda:\nSe remite documento oficial de funciones y compromisos de autocuidado para la zona de empaque y sellado continuo.',
    cuerpoRespuestaTrabajador:
      'Hola, adjunto el archivo que me enviaron firmado. Muchas gracias.\nMaría López.',
    observacionesRevision: 'Documento en proceso de verificación por la coordinación de SST.',
    revisadoPor: 'Ing. Carlos Mendoza (Coordinador SST)',
    fechaRevision: '2026-03-04 09:10',
    detallesDocumento: {
      numeroDocumento: 'C.C. 1.018.472.991',
      empresa: 'Frikaz S.A.S. — Sede Bosa',
      declaracionAceptacion:
        'Yo, María Fernanda López Castro, acepto las responsabilidades de uso de cofia, tapabocas, calzado antideslizante y manipulación segura de la selladora térmica.',
      fechaFirma: '2026-03-03',
      firmaRegistrada: true,
    },
    trazabilidad: [
      {
        id: 'tz-003-1',
        fechaHora: '2026-03-02 09:00',
        evento: 'Envío inicial desde Organigrama',
        autor: 'Sistema SG-SST',
        detalles: 'Notificación enviada con plantilla de responsabilidades',
        estadoResultante: 'Pendiente de devolución',
      },
      {
        id: 'tz-003-2',
        fechaHora: '2026-03-03 16:40',
        evento: 'Recepción automática Gmail',
        autor: 'Gmail API (frikaz.fritosnacks@gmail.com)',
        detalles: 'Documento devuelto recibido en bandeja de entrada',
        estadoResultante: 'Recibido',
      },
      {
        id: 'tz-003-3',
        fechaHora: '2026-03-04 09:10',
        evento: 'Paso a revisión técnica',
        autor: 'Ing. Carlos Mendoza',
        detalles: 'Iniciada validación de firmas y legibilidad',
        estadoResultante: 'En revisión',
      },
    ],
  },
  {
    id: 'doc-004',
    envioId: 'FRK-ENV-2026-004',
    nombreTrabajador: 'Pedro Nel Castro Morales',
    correoElectronico: 'pedro.castro.pelado@gmail.com',
    cargo: 'Operario de Pelado',
    tipoDocumento: 'responsabilidades',
    nombreArchivo: 'Responsabilidades_Pelado_PedroCastro_Incompleto.pdf',
    tamanoArchivo: '185 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: 'Re: [FRK-ENV-2026-004] Responsabilidades SST Pelado — Frikaz S.A.S.',
    fechaEnvio: '2026-03-01 11:00',
    fechaRecepcion: '2026-03-03 10:10',
    estado: 'Requiere corrección',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: 'th-1928374650192',
    cuerpoMensajeOriginal:
      'Estimado Pedro Nel:\nFavor diligenciar y firmar el formato de responsabilidades de operario de pelado mecánico y tajado.',
    cuerpoRespuestaTrabajador:
      'Buenas, mando la foto del papel firmado pero creo que se cortó la parte de abajo.\nPedro.',
    observacionesRevision:
      'Falta firma en la casilla de aceptación formal y el número de cédula aparece cortado en el escaneo. Se solicita reenviar el documento escaneado completamente.',
    revisadoPor: 'Lic. Martha Helena Roa (Talento Humano)',
    fechaRevision: '2026-03-03 15:20',
    detallesDocumento: {
      numeroDocumento: 'C.C. 80.123.456 (Ilegible)',
      empresa: 'Frikaz S.A.S. — Sede Bosa',
      declaracionAceptacion:
        'Documento con firma incompleta o truncada en el margen inferior.',
      fechaFirma: '2026-03-03',
      firmaRegistrada: false,
    },
    trazabilidad: [
      {
        id: 'tz-004-1',
        fechaHora: '2026-03-01 11:00',
        evento: 'Envío inicial desde Organigrama',
        autor: 'Sistema SG-SST',
        detalles: 'Envío de documento de responsabilidades',
        estadoResultante: 'Pendiente de devolución',
      },
      {
        id: 'tz-004-2',
        fechaHora: '2026-03-03 10:10',
        evento: 'Recepción automática Gmail',
        autor: 'Gmail API (frikaz.fritosnacks@gmail.com)',
        detalles: 'Archivo recibido con formato ilegible',
        estadoResultante: 'Recibido',
      },
      {
        id: 'tz-004-3',
        fechaHora: '2026-03-03 15:20',
        evento: 'Solicitud de corrección',
        autor: 'Lic. Martha Helena Roa',
        detalles: 'Se solicita al trabajador reenviar el documento firmado completamente',
        estadoResultante: 'Requiere corrección',
      },
    ],
  },
  {
    id: 'doc-005',
    envioId: 'FRK-ENV-2026-005',
    nombreTrabajador: 'Andrés Felipe Morales Dávila',
    correoElectronico: 'gerencia.frikaz@gmail.com',
    cargo: 'Gerente General',
    tipoDocumento: 'politicas',
    nombreArchivo: 'Politica_SST_Aprobada_Gerencia_2026.pdf',
    tamanoArchivo: '420 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: 'Re: [FRK-ENV-2026-005] Aprobación y Formalización Política SST Frikaz S.A.S.',
    fechaEnvio: '2026-02-25 14:00',
    fechaRecepcion: '2026-02-26 09:30',
    estado: 'Aprobado',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: 'th-9912039485712',
    cuerpoMensajeOriginal:
      'Estimado Gerente General:\nRemitimos para su firma de aprobación la Política de Seguridad y Salud en el Trabajo periodo 2026.',
    cuerpoRespuestaTrabajador:
      'Aprobada y firmada. Proceder con la divulgación a todo el personal de planta y publicación en cartelera principal.\nAndrés Morales - Gerente General.',
    observacionesRevision: 'Política formalizada con firma del Representante Legal. Lista para divulgación y auditoría.',
    revisadoPor: 'Ing. Carlos Mendoza (Coordinador SST)',
    fechaRevision: '2026-02-26 11:00',
    detallesDocumento: {
      numeroDocumento: 'C.C. 19.458.963',
      empresa: 'Frikaz S.A.S. — NIT: 901.458.723-1',
      declaracionAceptacion:
        'En calidad de Representante Legal de Frikaz S.A.S., apruebo la Política del SG-SST y me comprometo a destinar los recursos necesarios para su cabal cumplimiento.',
      fechaFirma: '2026-02-26',
      firmaRegistrada: true,
    },
    trazabilidad: [
      {
        id: 'tz-005-1',
        fechaHora: '2026-02-25 14:00',
        evento: 'Envío desde Módulo de Políticas',
        autor: 'Sistema SG-SST',
        detalles: 'Solicitud formal de aprobación gerencial',
        estadoResultante: 'Pendiente de devolución',
      },
      {
        id: 'tz-005-2',
        fechaHora: '2026-02-26 09:30',
        evento: 'Recepción automática Gmail',
        autor: 'Gmail API (frikaz.fritosnacks@gmail.com)',
        detalles: 'Archivo PDF devuelto con firma de Gerencia',
        estadoResultante: 'Recibido',
      },
      {
        id: 'tz-005-3',
        fechaHora: '2026-02-26 11:00',
        evento: 'Aprobación oficial',
        autor: 'Ing. Carlos Mendoza',
        detalles: 'Política radicada como VIGENTE en el sistema documental',
        estadoResultante: 'Aprobado',
      },
    ],
  },
  {
    id: 'doc-006',
    envioId: 'FRK-ENV-2026-006',
    nombreTrabajador: 'Diana Marcela Torres Rincón',
    correoElectronico: 'diana.torres.seleccion@gmail.com',
    cargo: 'Operario de Selección',
    tipoDocumento: 'politicas',
    nombreArchivo: 'Politica_SST_Divulgacion_DianaTorres.pdf',
    tamanoArchivo: '210 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: 'Re: [FRK-ENV-2026-006] Constancia de Divulgación y Compromiso Política SST — Frikaz',
    fechaEnvio: '2026-03-03 10:00',
    fechaRecepcion: '2026-03-04 11:45',
    estado: 'Recibido',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: 'th-1102938475612',
    cuerpoMensajeOriginal:
      'Estimada Diana Marcela:\nAdjuntamos la Política de SST para su conocimiento y constancia firmada de divulgación.',
    cuerpoRespuestaTrabajador:
      'Recibido y firmado. Gracias.\nDiana Torres - Selección y Lavado.',
    observacionesRevision: 'Documento recibido en bandeja de correo. Pendiente de verificación de firma.',
    revisadoPor: null,
    fechaRevision: null,
    detallesDocumento: {
      numeroDocumento: 'C.C. 52.894.120',
      empresa: 'Frikaz S.A.S. — Sede Bosa',
      declaracionAceptacion:
        'Constancia de recepción, lectura y comprensión de los 4 compromisos de la Política de SST de Frikaz S.A.S.',
      fechaFirma: '2026-03-04',
      firmaRegistrada: true,
    },
    trazabilidad: [
      {
        id: 'tz-006-1',
        fechaHora: '2026-03-03 10:00',
        evento: 'Envío desde Módulo de Políticas',
        autor: 'Sistema SG-SST',
        detalles: 'Envío de constancia de divulgación de la política',
        estadoResultante: 'Pendiente de devolución',
      },
      {
        id: 'tz-006-2',
        fechaHora: '2026-03-04 11:45',
        evento: 'Recepción automática Gmail',
        autor: 'Gmail API (frikaz.fritosnacks@gmail.com)',
        detalles: 'Devolución de archivo firmado detectada',
        estadoResultante: 'Recibido',
      },
    ],
  },
  {
    id: 'doc-007',
    envioId: 'FRK-ENV-2026-007',
    nombreTrabajador: 'Jhon Jairo Vargas Silva',
    correoElectronico: 'jhon.vargas.logistica@gmail.com',
    cargo: 'Conductor (Suplente)',
    tipoDocumento: 'responsabilidades',
    nombreArchivo: 'Pendiente_de_devolucion.pdf',
    tamanoArchivo: '0 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: '[FRK-ENV-2026-007] Notificación Responsabilidades Conductor Suplente — Frikaz S.A.S.',
    fechaEnvio: '2026-03-04 15:30',
    fechaRecepcion: null,
    estado: 'Pendiente de devolución',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: 'th-8849201928475',
    cuerpoMensajeOriginal:
      'Estimado Jhon Jairo:\nFavor revisar el documento adjunto con las responsabilidades del cargo de conductor suplente y devolver firmado.',
    cuerpoRespuestaTrabajador: '',
    observacionesRevision: 'Documento enviado el 4 de marzo. Se envió recordatorio vía correo electrónico.',
    revisadoPor: null,
    fechaRevision: null,
    detallesDocumento: {
      numeroDocumento: 'C.C. 1.030.584.220',
      empresa: 'Frikaz S.A.S. — Sede Bosa',
      declaracionAceptacion: 'Pendiente de firma por parte del trabajador.',
      fechaFirma: undefined,
      firmaRegistrada: false,
    },
    trazabilidad: [
      {
        id: 'tz-007-1',
        fechaHora: '2026-03-04 15:30',
        evento: 'Envío inicial desde Organigrama',
        autor: 'Sistema SG-SST',
        detalles: 'Envío de documento de responsabilidades a jhon.vargas.logistica@gmail.com',
        estadoResultante: 'Pendiente de devolución',
      },
    ],
  },
  {
    id: 'doc-008',
    envioId: 'FRK-ENV-2026-008',
    nombreTrabajador: 'Laboratorio Bromatológico Andino (Contratista)',
    correoElectronico: 'calidad@laboratorioandino.com.co',
    cargo: 'Otros / Proveedor Externo',
    tipoDocumento: 'otros',
    nombreArchivo: 'Certificado_Microbiologico_Aceite_Fritura_Lote202603.pdf',
    tamanoArchivo: '512 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: 'Re: [FRK-ENV-2026-008] Resultados de Ensayo Microbiológico y Acidez — Frikaz',
    fechaEnvio: '2026-03-02 11:20',
    fechaRecepcion: '2026-03-04 17:10',
    estado: 'Aprobado',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: 'th-7749201928374',
    cuerpoMensajeOriginal:
      'Estimado Laboratorio:\nRemitimos muestras de aceite vegetal de fritura y snack terminado para análisis de acidez y microorganismos.',
    cuerpoRespuestaTrabajador:
      'Adjuntamos informe de resultados microbiológicos. Todos los parámetros se encuentran dentro de los límites de la Resolución 2674/2013.',
    observacionesRevision: 'Certificado conforme a estándares BPM y de calidad alimentaria.',
    revisadoPor: 'Ing. Carlos Mendoza (Coordinador SST / Calidad)',
    fechaRevision: '2026-03-05 08:30',
    detallesDocumento: {
      numeroDocumento: 'NIT: 900.284.112-8',
      empresa: 'Laboratorio Bromatológico Andino S.A.S.',
      declaracionAceptacion:
        'Certificación de conformidad analítica para muestras de aceite y snacks producidos en Frikaz S.A.S.',
      fechaFirma: '2026-03-04',
      firmaRegistrada: true,
    },
    trazabilidad: [
      {
        id: 'tz-008-1',
        fechaHora: '2026-03-02 11:20',
        evento: 'Envío de solicitud de análisis',
        autor: 'Sistema SG-SST / Calidad',
        detalles: 'Solicitud enviada a calidad@laboratorioandino.com.co',
        estadoResultante: 'Pendiente de devolución',
      },
      {
        id: 'tz-008-2',
        fechaHora: '2026-03-04 17:10',
        evento: 'Recepción automática Gmail',
        autor: 'Gmail API (frikaz.fritosnacks@gmail.com)',
        detalles: 'Certificado analítico recibido como adjunto PDF',
        estadoResultante: 'Recibido',
      },
      {
        id: 'tz-008-3',
        fechaHora: '2026-03-05 08:30',
        evento: 'Aprobación técnica de Talento Humano',
        autor: 'Ing. Carlos Mendoza',
        detalles: 'Verificado y aprobado para custodia en carpeta sanitaria',
        estadoResultante: 'Aprobado',
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// PERSISTENCIA EN LOCALSTORAGE
// ----------------------------------------------------------------------------

export function getStoredDocumentosDevueltos(): DocumentoDevuelto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOCS_DEVUELTOS);
    if (!raw) {
      saveStoredDocumentosDevueltos(DOCUMENTOS_DEVUELTOS_INICIALES);
      return DOCUMENTOS_DEVUELTOS_INICIALES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveStoredDocumentosDevueltos(DOCUMENTOS_DEVUELTOS_INICIALES);
    return DOCUMENTOS_DEVUELTOS_INICIALES;
  } catch (error) {
    console.error('Error leyendo documentos devueltos de localStorage:', error);
    return DOCUMENTOS_DEVUELTOS_INICIALES;
  }
}

export function saveStoredDocumentosDevueltos(documentos: DocumentoDevuelto[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DOCS_DEVUELTOS, JSON.stringify(documentos));
  } catch (error) {
    console.error('Error guardando documentos devueltos en localStorage:', error);
  }
}

// ----------------------------------------------------------------------------
// ACTUALIZAR ESTADO DE UN DOCUMENTO CON TRAZABILIDAD
// ----------------------------------------------------------------------------

export function actualizarEstadoDocumento(
  documentos: DocumentoDevuelto[],
  id: string,
  nuevoEstado: EstadoDocumentoCorreo,
  observaciones: string,
  revisor: string = 'Responsable Talento Humano'
): DocumentoDevuelto[] {
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const actualizados = documentos.map((doc) => {
    if (doc.id !== id) return doc;

    const nuevoEvento: TrazabilidadEventoDocumento = {
      id: `tz-${Date.now()}`,
      fechaHora: nowStr,
      evento: `Cambio de estado a "${nuevoEstado}"`,
      autor: revisor,
      detalles: observaciones || `Actualización manual por ${revisor}`,
      estadoResultante: nuevoEstado,
    };

    return {
      ...doc,
      estado: nuevoEstado,
      observacionesRevision: observaciones || doc.observacionesRevision,
      revisadoPor: revisor,
      fechaRevision: nowStr,
      trazabilidad: [...doc.trazabilidad, nuevoEvento],
    };
  });

  saveStoredDocumentosDevueltos(actualizados);
  return actualizados;
}

// ----------------------------------------------------------------------------
// REGISTRAR / SIMULAR ENVÍO DE DOCUMENTO (CONEXIÓN ORGANIGRAMA / POLÍTICAS)
// ----------------------------------------------------------------------------

export function registrarNuevoEnvioDocumento(
  documentos: DocumentoDevuelto[],
  datos: {
    nombreTrabajador: string;
    correoElectronico: string;
    cargo: string;
    tipoDocumento: TipoDocumentoCorreo;
    asuntoPersonalizado?: string;
  }
): { documentosActualizados: DocumentoDevuelto[]; nuevoDocId: string; envioId: string } {
  const count = documentos.length + 1;
  const numPad = String(count).padStart(3, '0');
  const envioId = `FRK-ENV-2026-${numPad}`;
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const asunto =
    datos.asuntoPersonalizado ||
    (datos.tipoDocumento === 'responsabilidades'
      ? `[${envioId}] Notificación y Compromisos de Responsabilidades SST — ${datos.cargo}`
      : datos.tipoDocumento === 'politicas'
      ? `[${envioId}] Divulgación y Compromiso con la Política SST — Frikaz S.A.S.`
      : `[${envioId}] Envío de Documento Oficial SG-SST — ${datos.cargo}`);

  const nuevoDoc: DocumentoDevuelto = {
    id: `doc-${Date.now()}`,
    envioId,
    nombreTrabajador: datos.nombreTrabajador,
    correoElectronico: datos.correoElectronico,
    cargo: datos.cargo,
    tipoDocumento: datos.tipoDocumento,
    nombreArchivo: `Pendiente_de_devolucion_${datos.nombreTrabajador.replace(/\s+/g, '_')}.pdf`,
    tamanoArchivo: '0 KB',
    tipoMime: 'application/pdf',
    asuntoCorreo: asunto,
    fechaEnvio: nowStr,
    fechaRecepcion: null,
    estado: 'Pendiente de devolución',
    cuentaReceptora: CUENTA_GMAIL_OFICIAL,
    hiloCorreoId: `th-${Date.now().toString(36)}`,
    cuerpoMensajeOriginal: `Estimado(a) ${datos.nombreTrabajador}:\nRemitimos desde la plataforma de SG-SST de Frikaz S.A.S. el documento de ${datos.tipoDocumento === 'responsabilidades' ? 'Responsabilidades de su Cargo' : 'Política Institucional'}. Por favor devolver este correo con el documento firmado adjunto a frikaz.fritosnacks@gmail.com.`,
    cuerpoRespuestaTrabajador: '',
    observacionesRevision: 'Documento enviado al correo del trabajador. En espera de respuesta.',
    revisadoPor: null,
    fechaRevision: null,
    detallesDocumento: {
      empresa: 'Frikaz S.A.S. — Sede Bosa, Bogotá D.C.',
      declaracionAceptacion: 'Pendiente de devolución por parte del colaborador.',
      firmaRegistrada: false,
    },
    trazabilidad: [
      {
        id: `tz-${Date.now()}-1`,
        fechaHora: nowStr,
        evento: `Envío desde ${datos.tipoDocumento === 'responsabilidades' ? 'Organigrama' : 'Políticas'}`,
        autor: 'Sistema SG-SST (Frikaz)',
        detalles: `Notificación enviada a ${datos.correoElectronico} con ID ${envioId}`,
        estadoResultante: 'Pendiente de devolución',
      },
    ],
  };

  const actualizados = [nuevoDoc, ...documentos];
  saveStoredDocumentosDevueltos(actualizados);
  return { documentosActualizados: actualizados, nuevoDocId: nuevoDoc.id, envioId };
}

// ----------------------------------------------------------------------------
// SIMULACIÓN O REGISTRO DE RECEPCIÓN AUTOMÁTICA GMAIL
// ----------------------------------------------------------------------------

export function simularRecepcionDocumentoTrabajador(
  documentos: DocumentoDevuelto[],
  id: string,
  nombreArchivoDevuelto?: string
): DocumentoDevuelto[] {
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const actualizados = documentos.map((doc) => {
    if (doc.id !== id) return doc;

    const nombreArchivo =
      nombreArchivoDevuelto ||
      (doc.tipoDocumento === 'responsabilidades'
        ? `Responsabilidades_${doc.cargo.replace(/\s+/g, '_')}_${doc.nombreTrabajador.replace(/\s+/g, '_')}_Firmado.pdf`
        : `Politica_SST_${doc.nombreTrabajador.replace(/\s+/g, '_')}_Firmada.pdf`);

    const nuevoEvento: TrazabilidadEventoDocumento = {
      id: `tz-${Date.now()}`,
      fechaHora: nowStr,
      evento: 'Recepción automática Gmail',
      autor: `Gmail API (${CUENTA_GMAIL_OFICIAL})`,
      detalles: `Se recibió respuesta en el hilo ${doc.envioId} con archivo adjunto ${nombreArchivo} (230 KB)`,
      estadoResultante: 'Recibido',
    };

    return {
      ...doc,
      estado: 'Recibido' as EstadoDocumentoCorreo,
      fechaRecepcion: nowStr,
      nombreArchivo,
      tamanoArchivo: '230 KB',
      cuerpoRespuestaTrabajador: `Buen día. Adjunto el documento firmado solicitado para los registros del SG-SST.\nAtentamente,\n${doc.nombreTrabajador}\n${doc.cargo} - Frikaz S.A.S.`,
      observacionesRevision: 'Documento recibido en bandeja de correo. Listo para revisión por Talento Humano.',
      detallesDocumento: {
        ...doc.detallesDocumento,
        fechaFirma: nowStr.split(' ')[0],
        firmaRegistrada: true,
      },
      trazabilidad: [...doc.trazabilidad, nuevoEvento],
    };
  });

  saveStoredDocumentosDevueltos(actualizados);
  return actualizados;
}

// ----------------------------------------------------------------------------
// CÁLCULO DE MÉTRICAS DEL MÓDULO
// ----------------------------------------------------------------------------

export function calcularMetricasDocumentos(documentos: DocumentoDevuelto[]): MetricasBandejaDocumentos {
  const total = documentos.length;
  const recibidos = documentos.filter((d) => d.estado === 'Recibido').length;
  const enRevision = documentos.filter((d) => d.estado === 'En revisión').length;
  const aprobados = documentos.filter((d) => d.estado === 'Aprobado').length;
  const requierenCorreccion = documentos.filter((d) => d.estado === 'Requiere corrección').length;
  const pendientesDevolucion = documentos.filter((d) => d.estado === 'Pendiente de devolución').length;

  const totalConRespuesta = total - pendientesDevolucion;
  const porcentajeAprobacion =
    totalConRespuesta > 0 ? Math.round((aprobados / totalConRespuesta) * 100) : 0;

  return {
    totalDocumentos: total,
    recibidos,
    enRevision,
    aprobados,
    requierenCorreccion,
    pendientesDevolucion,
    porcentajeAprobacion,
  };
}
