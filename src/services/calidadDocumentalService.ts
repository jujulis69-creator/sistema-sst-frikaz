import {
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  VerticalAlign,
  WidthType,
  BorderStyle,
  Document,
  Packer,
  HeadingLevel,
} from 'docx';

// ============================================================================
// CONSTANTES TIPOGRÁFICAS Y DE FORMATO INSTITUCIONAL (FRIKAZ S.A.S.)
// ============================================================================
export const DOCX_FONT = 'Times New Roman';
export const DOCX_FONT_SIZE_BODY = 24; // 12 pt (en medios puntos de docx)
export const DOCX_FONT_SIZE_TITLE = 22; // 11 pt para títulos de tabla
export const DOCX_FONT_SIZE_META = 20; // 10 pt para etiquetas de metadatos
export const DOCX_LINE_SPACING_1_5 = 360; // Interlineado 1.5 (240 * 1.5)
export const DOCX_MARGIN_1_INCH = 1440; // 1 pulgada = 2.54 cm = 1440 twips

// Cache para almacenar en memoria los bytes del logo de Frikaz
let cachedLogoBytes: Uint8Array | null = null;

/**
 * Carga de forma segura y resiliente los bytes del logotipo de Frikaz S.A.S.
 * Funciona en navegadores web (Fetch API) y en entornos Node.js (fs).
 */
export async function cargarLogoFrikazBytes(): Promise<Uint8Array | null> {
  if (cachedLogoBytes && cachedLogoBytes.length > 0) {
    return cachedLogoBytes;
  }

  // Entorno de navegador Web (Vite SPA)
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    try {
      const response = await fetch('/frikaz_logo.jpg');
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        cachedLogoBytes = new Uint8Array(arrayBuffer);
        return cachedLogoBytes;
      }
    } catch {
      // Ignorar error y probar fallback
    }
  }

  // Entorno Node.js (SSR o compilador)
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const publicPath = path.resolve(process.cwd(), 'public', 'frikaz_logo.jpg');
      if (fs.existsSync(publicPath)) {
        const fileBuf = fs.readFileSync(publicPath);
        cachedLogoBytes = new Uint8Array(fileBuf);
        return cachedLogoBytes;
      }
    } catch {
      // Fallback
    }
  }

  return null;
}

// ============================================================================
// TIPOS Y MODELO DE CONTROL DOCUMENTAL
// ============================================================================

export type TipoDocumentoCalidad =
  | 'responsabilidades' // Asignación formal de responsabilidades por cargo
  | 'politica'          // Política de Seguridad y Salud en el Trabajo
  | 'manual'            // Manual del Sistema de Gestión (SG-SST) o Matriz Legal
  | 'procedimiento'     // Procedimiento de operación segura
  | 'instructivo'       // Instructivo técnico de seguridad
  | 'formato'           // Formatos, registros o listas de chequeo
  | 'acta'              // Actas de conformación, asignación o comités
  | 'informe';          // Informes gerenciales y auditorías

export interface MetadatosCalidad {
  codigo: string;
  fecha: string;
  version: string;
  nombreEmpresa?: string;
  tituloDocumento: string;
  tipoDocumento: TipoDocumentoCalidad;
  subtitulo?: string;
}

export interface OpcionesCajaCalidad extends MetadatosCalidad {
  logoBytes?: Uint8Array | null;
  anchoPorcentaje?: number;
}

// ============================================================================
// DICCIONARIO CANÓNICO DE CÓDIGOS, FECHAS Y VERSIONES DE FRIKAZ S.A.S.
// ============================================================================
export const CODIGOS_CANONICOS_SST: Record<
  string,
  { codigo: string; version: string; titulo: string; tipo: TipoDocumentoCalidad }
> = {
  // CARGOS Y RESPONSABILIDADES
  'cargo-gerente-general': {
    codigo: 'FRK-SST-RES-01',
    version: '01',
    titulo: 'ASIGNACIÓN DE RESPONSABILIDADES EN SST – GERENTE GENERAL',
    tipo: 'responsabilidades',
  },
  'cargo-coordinador-vigia-sst': {
    codigo: 'FRK-SST-RES-02',
    version: '01',
    titulo: 'ASIGNACIÓN DE RESPONSABILIDADES EN SST – COORDINADOR / VIGÍA DE SST',
    tipo: 'responsabilidades',
  },
  'cargo-operario-frito': {
    codigo: 'FRK-SST-RES-03',
    version: '01',
    titulo: 'ASIGNACIÓN DE RESPONSABILIDADES EN SST – OPERARIO DE FRITO (LÍNEA CALIENTE)',
    tipo: 'responsabilidades',
  },
  'cargo-operario-seleccion': {
    codigo: 'FRK-SST-RES-04',
    version: '01',
    titulo: 'ASIGNACIÓN DE RESPONSABILIDADES EN SST – OPERARIO DE SELECCIÓN Y LAVADO',
    tipo: 'responsabilidades',
  },
  'cargo-operario-pelado': {
    codigo: 'FRK-SST-RES-05',
    version: '01',
    titulo: 'ASIGNACIÓN DE RESPONSABILIDADES EN SST – OPERARIO DE PELADO Y CORTE',
    tipo: 'responsabilidades',
  },
  'cargo-operario-empaque': {
    codigo: 'FRK-SST-RES-06',
    version: '01',
    titulo: 'ASIGNACIÓN DE RESPONSABILIDADES EN SST – OPERARIO DE EMPAQUE Y SELLADO',
    tipo: 'responsabilidades',
  },
  'cargo-conductor': {
    codigo: 'FRK-SST-RES-07',
    version: '01',
    titulo: 'ASIGNACIÓN DE RESPONSABILIDADES EN SST – CONDUCTOR / DISTRIBUCIÓN COMERCIAL',
    tipo: 'responsabilidades',
  },
  'cargo-tecnico-mantenimiento': {
    codigo: 'FRK-SST-RES-08',
    version: '01',
    titulo: 'ASIGNACIÓN DE RESPONSABILIDADES EN SST – TÉCNICO DE MANTENIMIENTO Y SERVICIOS',
    tipo: 'responsabilidades',
  },

  // POLÍTICAS INSTITUCIONALES
  politica_sst: {
    codigo: 'FRK-SST-POL-01',
    version: '02',
    titulo: 'POLÍTICA INTEGRAL DE SEGURIDAD Y SALUD EN EL TRABAJO',
    tipo: 'politica',
  },
  politica_alcohol_drogas: {
    codigo: 'FRK-SST-POL-02',
    version: '01',
    titulo: 'POLÍTICA DE PREVENCIÓN DE CONSUMO DE TABACO, ALCOHOL Y SUSTANCIAS PSICOACTIVAS',
    tipo: 'politica',
  },

  // PROCEDIMIENTOS E INSTRUCTIVOS
  procedimiento_freidoras: {
    codigo: 'FRK-SST-PR-01',
    version: '01',
    titulo: 'PROCEDIMIENTO OPERATIVO SEGURO EN FREIDORAS INDUSTRIALES Y MANEJO DE ACEITE CALIENTE',
    tipo: 'procedimiento',
  },
  instructivo_epp_termico: {
    codigo: 'FRK-SST-INS-01',
    version: '01',
    titulo: 'INSTRUCTIVO TÉCNICO DE USO, INSPECCIÓN Y REPOSICIÓN DE EPP TÉRMICO Y MECÁNICO',
    tipo: 'instructivo',
  },
  procedimiento_acu: {
    codigo: 'FRK-SST-PR-02',
    version: '01',
    titulo: 'PROCEDIMIENTO DE GESTIÓN INTEGRAL Y DISPOSICIÓN AMBIENTAL DE ACEITE DE COCINA USADO (ACU)',
    tipo: 'procedimiento',
  },

  // FORMATOS Y REGISTROS
  formato_inspeccion_freidoras: {
    codigo: 'FRK-SST-FOR-01',
    version: '01',
    titulo: 'FORMATO DE INSPECCIÓN PREOPERACIONAL DE FREIDORAS INDUSTRIALES Y SISTEMAS DE GAS',
    tipo: 'formato',
  },
  registro_entrega_epp: {
    codigo: 'FRK-SST-REG-01',
    version: '01',
    titulo: 'REGISTRO INDIVIDUAL DE ENTREGA Y COMPROMISO DE USO DE ELEMENTOS DE PROTECCIÓN PERSONAL',
    tipo: 'formato',
  },
  manifiesto_acu: {
    codigo: 'FRK-SST-REG-02',
    version: '01',
    titulo: 'MANIFIESTO DE ENTREGA Y DISPOSICIÓN FINAL DE ACEITE DE COCINA USADO (ACU)',
    tipo: 'formato',
  },

  // ACTAS
  acta_responsable_sst: {
    codigo: 'FRK-SST-ACT-01',
    version: '01',
    titulo: 'ACTA FORMAL DE DESIGNACIÓN DEL RESPONSABLE DEL DISEÑO E IMPLEMENTACIÓN DEL SG-SST',
    tipo: 'acta',
  },
  acta_vigia_sst: {
    codigo: 'FRK-SST-ACT-02',
    version: '01',
    titulo: 'ACTA DE ELECCIÓN Y CONSTITUCIÓN DEL VIGÍA DE SEGURIDAD Y SALUD EN EL TRABAJO',
    tipo: 'acta',
  },

  // MANUALES E INFORMES
  manual_sgsst: {
    codigo: 'FRK-SST-MN-01',
    version: '01',
    titulo: 'MANUAL DEL SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)',
    tipo: 'manual',
  },
  informe_rendicion_cuentas: {
    codigo: 'FRK-SST-INF-01',
    version: '01',
    titulo: 'INFORME ANUAL DE RENDICIÓN DE CUENTAS DEL DESEMPEÑO DEL SG-SST',
    tipo: 'informe',
  },
  matriz_gtc45: {
    codigo: 'FRK-SST-MN-02',
    version: '01',
    titulo: 'MATRIZ DE IDENTIFICACIÓN DE PELIGROS, EVALUACIÓN Y VALORACIÓN DE RIESGOS (GTC 45)',
    tipo: 'manual',
  },
};

/**
 * Obtiene los metadatos oficiales del sistema de calidad según el tipo o ID.
 */
export function obtenerMetadatosDocumentoCalidad(
  idOCategoria: string,
  fechaCustom?: string
): MetadatosCalidad {
  const registro = CODIGOS_CANONICOS_SST[idOCategoria];
  const fechaHoy =
    fechaCustom ||
    new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  if (registro) {
    return {
      codigo: registro.codigo,
      fecha: fechaHoy,
      version: registro.version,
      nombreEmpresa: 'Frikaz S.A.S',
      tituloDocumento: registro.titulo,
      tipoDocumento: registro.tipo,
    };
  }

  return {
    codigo: 'FRK-SST-DOC-01',
    fecha: fechaHoy,
    version: '01',
    nombreEmpresa: 'Frikaz S.A.S',
    tituloDocumento: 'DOCUMENTO OFICIAL DEL SG-SST',
    tipoDocumento: 'responsabilidades',
  };
}

// ============================================================================
// CONSTRUCTOR CENTRALIZADO DE LA CAJA DE CALIDAD DOCUMENTAL EN DOCX
// ============================================================================

/**
 * Genera la Tabla de Caja de Calidad Oficial conforme al modelo exacto
 * de FRIKAZ S.A.S. adjunto por el usuario (3 columnas, bordes sólidos,
 * logotipo a la izquierda, nombre de empresa + título al centro, y
 * Código / Fecha / Versión a la derecha).
 *
 * Adapta dinámicamente dimensiones, márgenes y distribución según el
 * tipo de documento (`responsabilidades`, `politica`, `manual`, `formato`, etc.).
 */
export function crearCajaCalidadDocxTable(opciones: OpcionesCajaCalidad): Table {
  const {
    codigo,
    fecha,
    version,
    nombreEmpresa = 'Frikaz S.A.S',
    tituloDocumento,
    tipoDocumento,
    logoBytes = null,
  } = opciones;

  // 1. Configuración de dimensiones según tipo de documento
  let colLogoWidth = 24;
  let colTitleWidth = 52;
  let colMetaWidth = 24;
  let logoImgWidth = 115;
  let logoImgHeight = 50;
  let cellTopPadding = 90;
  let cellBottomPadding = 90;
  let titleFontSize = DOCX_FONT_SIZE_TITLE;

  switch (tipoDocumento) {
    case 'responsabilidades':
      // Documento puntual de una sola página: máxima compacidad para no desbordar
      colLogoWidth = 23;
      colTitleWidth = 53;
      colMetaWidth = 24;
      logoImgWidth = 108;
      logoImgHeight = 46;
      cellTopPadding = 70;
      cellBottomPadding = 70;
      titleFontSize = 21;
      break;

    case 'politica':
      // Política institucional: presentación corporativa formal
      colLogoWidth = 24;
      colTitleWidth = 52;
      colMetaWidth = 24;
      logoImgWidth = 118;
      logoImgHeight = 52;
      cellTopPadding = 100;
      cellBottomPadding = 100;
      titleFontSize = DOCX_FONT_SIZE_TITLE;
      break;

    case 'manual':
      // Documento extenso / carátula: presencia visual destacada
      colLogoWidth = 25;
      colTitleWidth = 50;
      colMetaWidth = 25;
      logoImgWidth = 125;
      logoImgHeight = 55;
      cellTopPadding = 120;
      cellBottomPadding = 120;
      titleFontSize = 24;
      break;

    case 'procedimiento':
    case 'instructivo':
      // Procedimiento operativo: visualización clara del código de proceso
      colLogoWidth = 22;
      colTitleWidth = 54;
      colMetaWidth = 24;
      logoImgWidth = 110;
      logoImgHeight = 48;
      cellTopPadding = 80;
      cellBottomPadding = 80;
      titleFontSize = 21;
      break;

    case 'formato':
      // Listas de chequeo e inspección: ancho estricto alineado a la cuadrícula
      colLogoWidth = 20;
      colTitleWidth = 56;
      colMetaWidth = 24;
      logoImgWidth = 105;
      logoImgHeight = 45;
      cellTopPadding = 60;
      cellBottomPadding = 60;
      titleFontSize = 20;
      break;

    case 'acta':
    case 'informe':
      colLogoWidth = 23;
      colTitleWidth = 53;
      colMetaWidth = 24;
      logoImgWidth = 112;
      logoImgHeight = 48;
      cellTopPadding = 85;
      cellBottomPadding = 85;
      titleFontSize = 22;
      break;
  }

  // 2. Definición de bordes limpios y sólidos (negro profesional como en el modelo)
  const borderSolido = {
    style: BorderStyle.SINGLE,
    size: 6,
    color: '000000',
  };
  const cellBorders = {
    top: borderSolido,
    bottom: borderSolido,
    left: borderSolido,
    right: borderSolido,
  };

  const cellMargins = {
    top: cellTopPadding,
    bottom: cellBottomPadding,
    left: 120,
    right: 120,
  };

  // 3. Contenido de la celda de Logo (Imagen o tipografía formal de respaldo)
  const childrenLogoCell: Paragraph[] = [];
  if (logoBytes && logoBytes.length > 0) {
    childrenLogoCell.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 40 },
        children: [
          new ImageRun({
            data: logoBytes,
            transformation: {
              width: logoImgWidth,
              height: logoImgHeight,
            },
            type: 'jpg',
          }),
        ],
      })
    );
  } else {
    // Si la imagen no está cargada en memoria, se despliega el membrete gráfico institucional
    childrenLogoCell.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({
            text: 'PRODUCTOS COMESTIBLES',
            bold: true,
            size: 16,
            font: DOCX_FONT,
            color: '666666',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 10, after: 20 },
        children: [
          new TextRun({
            text: 'FRIKAZ',
            bold: true,
            size: 26,
            font: DOCX_FONT,
            color: 'D9381E', // Rojo corporativo Frikaz
          }),
        ],
      })
    );
  }

  // 4. Construcción de la tabla de 3 columnas según el documento modelo
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // ==========================================
      // FILA 1 DE LA CAJA DE CALIDAD
      // ==========================================
      new TableRow({
        children: [
          // COL 1: LOGOTIPO (FUSIONADA VERTICALMENTE 3 FILAS)
          new TableCell({
            rowSpan: 3,
            width: { size: colLogoWidth, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: cellMargins,
            verticalAlign: VerticalAlign.CENTER,
            children: childrenLogoCell,
          }),

          // COL 2: NOMBRE DE LA EMPRESA
          new TableCell({
            width: { size: colTitleWidth, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: cellMargins,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: nombreEmpresa,
                    bold: true,
                    size: DOCX_FONT_SIZE_BODY, // 12 pt
                    font: DOCX_FONT,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),

          // COL 3 (FILA 1): CÓDIGO DEL DOCUMENTO
          new TableCell({
            width: { size: colMetaWidth, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: cellMargins,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 30, after: 30 },
                children: [
                  new TextRun({
                    text: 'Código: ',
                    bold: true,
                    size: DOCX_FONT_SIZE_META,
                    font: DOCX_FONT,
                    color: '000000',
                  }),
                  new TextRun({
                    text: codigo,
                    bold: false,
                    size: DOCX_FONT_SIZE_META,
                    font: DOCX_FONT,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),

      // ==========================================
      // FILA 2 DE LA CAJA DE CALIDAD
      // ==========================================
      new TableRow({
        children: [
          // COL 2: NOMBRE Y TÍTULO DEL DOCUMENTO (FUSIONADA 2 FILAS)
          new TableCell({
            rowSpan: 2,
            width: { size: colTitleWidth, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: cellMargins,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: tituloDocumento.toUpperCase(),
                    bold: true,
                    size: titleFontSize,
                    font: DOCX_FONT,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),

          // COL 3 (FILA 2): FECHA DE ELABORACIÓN / EMISIÓN
          new TableCell({
            width: { size: colMetaWidth, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: cellMargins,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 30, after: 30 },
                children: [
                  new TextRun({
                    text: 'Fecha: ',
                    bold: true,
                    size: DOCX_FONT_SIZE_META,
                    font: DOCX_FONT,
                    color: '000000',
                  }),
                  new TextRun({
                    text: fecha,
                    bold: false,
                    size: DOCX_FONT_SIZE_META,
                    font: DOCX_FONT,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),

      // ==========================================
      // FILA 3 DE LA CAJA DE CALIDAD
      // ==========================================
      new TableRow({
        children: [
          // COL 3 (FILA 3): NÚMERO DE VERSIÓN
          new TableCell({
            width: { size: colMetaWidth, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: cellMargins,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 30, after: 30 },
                children: [
                  new TextRun({
                    text: 'Versión: ',
                    bold: true,
                    size: DOCX_FONT_SIZE_META,
                    font: DOCX_FONT,
                    color: '000000',
                  }),
                  new TextRun({
                    text: version,
                    bold: false,
                    size: DOCX_FONT_SIZE_META,
                    font: DOCX_FONT,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ============================================================================
// GENERADORES OFICIALES DE FORMATOS Y DOCUMENTOS EN MICROSOFT WORD (.DOCX)
// ============================================================================

/**
 * Descarga en el navegador un Documento Word generado
 */
export async function descargarDocumentoDocx(doc: Document, filename: string): Promise<void> {
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * 1. Acta de Designación del Responsable del SG-SST (FRK-SST-ACT-01)
 */
export async function generarActaResponsableDocx(logoBytes?: Uint8Array | null): Promise<Document> {
  const fechaHoy = new Date().toLocaleDateString('es-CO');
  const borderLight = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
  };

  const tableHeader = crearCajaCalidadDocxTable({
    codigo: 'FRK-SST-ACT-01',
    fecha: fechaHoy,
    version: '01',
    nombreEmpresa: 'Frikaz S.A.S',
    tituloDocumento: 'ACTA DE DESIGNACIÓN DEL RESPONSABLE DEL SG-SST',
    tipoDocumento: 'acta',
    logoBytes,
  });

  return new Document({
    creator: 'FRIKAZ S.A.S. - SG-SST',
    title: 'Acta de Designación del Responsable del SG-SST',
    styles: {
      default: {
        document: {
          run: { font: DOCX_FONT, size: DOCX_FONT_SIZE_BODY, color: '000000' },
          paragraph: { spacing: { line: DOCX_LINE_SPACING_1_5, after: 180 }, alignment: AlignmentType.JUSTIFIED },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: DOCX_MARGIN_1_INCH,
              bottom: DOCX_MARGIN_1_INCH,
              left: DOCX_MARGIN_1_INCH,
              right: DOCX_MARGIN_1_INCH,
            },
          },
        },
        children: [
          tableHeader,
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 180, after: 180 },
            children: [
              new TextRun({
                text: 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)',
                bold: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: '\nCumplimiento Resolución 0312 de 2019 (Estándar 1) y Decreto 1072 de 2015 (Art. 2.2.4.6.8)',
                italics: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
                color: '444444',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 180 },
            children: [
              new TextRun({
                text: 'En la ciudad de Bogotá D.C., a los ',
                font: DOCX_FONT,
                size: DOCX_FONT_SIZE_BODY,
              }),
              new TextRun({
                text: `${fechaHoy}`,
                bold: true,
                font: DOCX_FONT,
                size: DOCX_FONT_SIZE_BODY,
              }),
              new TextRun({
                text: ', en las instalaciones de la planta de producción de ',
                font: DOCX_FONT,
                size: DOCX_FONT_SIZE_BODY,
              }),
              new TextRun({
                text: 'FRIKAZ S.A.S. (NIT 901.654.892-3)',
                bold: true,
                font: DOCX_FONT,
                size: DOCX_FONT_SIZE_BODY,
              }),
              new TextRun({
                text: ', ubicada en la Calle 69A Sur # 80J - 14, barrio Piamonte, localidad de Bosa, la Gerencia General en uso de sus facultades legales y en estricto cumplimiento del Artículo 3 de la Resolución 0312 de 2019 del Ministerio del Trabajo para empresas clasificadas en Riesgo I, II o III con diez (10) o menos trabajadores, procede a formalizar la designación de la persona responsable del diseño, administración y ejecución del SG-SST.',
                font: DOCX_FONT,
                size: DOCX_FONT_SIZE_BODY,
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 180, after: 120 },
            children: [
              new TextRun({
                text: '1. DATOS GENERALES DE LA ORGANIZACIÓN',
                bold: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    borders: borderLight,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Razón Social:', bold: true, font: DOCX_FONT })] })],
                  }),
                  new TableCell({
                    width: { size: 65, type: WidthType.PERCENTAGE },
                    borders: borderLight,
                    children: [new Paragraph({ children: [new TextRun({ text: 'FRIKAZ S.A.S.', font: DOCX_FONT })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    borders: borderLight,
                    children: [new Paragraph({ children: [new TextRun({ text: 'NIT:', bold: true, font: DOCX_FONT })] })],
                  }),
                  new TableCell({
                    width: { size: 65, type: WidthType.PERCENTAGE },
                    borders: borderLight,
                    children: [new Paragraph({ children: [new TextRun({ text: '901.654.892-3', font: DOCX_FONT })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    borders: borderLight,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Actividad Económica:', bold: true, font: DOCX_FONT })] })],
                  }),
                  new TableCell({
                    width: { size: 65, type: WidthType.PERCENTAGE },
                    borders: borderLight,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Elaboración de snacks y productos fritos artesanales (CIIU 1089)', font: DOCX_FONT })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    borders: borderLight,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Total de Trabajadores:', bold: true, font: DOCX_FONT })] })],
                  }),
                  new TableCell({
                    width: { size: 65, type: WidthType.PERCENTAGE },
                    borders: borderLight,
                    children: [new Paragraph({ children: [new TextRun({ text: '10 trabajadores en nómina y planta', font: DOCX_FONT })] })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 200, after: 120 },
            children: [
              new TextRun({
                text: '2. FUNCIONES Y RESPONSABILIDADES ASIGNADAS',
                bold: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [
              new TextRun({
                text: 'Diseñar, administrar, implementar y actualizar anualmente el SG-SST de Frikaz S.A.S. conforme a los 7 Estándares Mínimos de la Res. 0312/2019.',
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [
              new TextRun({
                text: 'Elaborar y mantener al día la Matriz de Identificación de Peligros, Evaluación y Valoración de Riesgos bajo la metodología GTC 45, con especial énfasis en riesgo térmico en freidoras a 180°C y biomecánico en pelado/empaque.',
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [
              new TextRun({
                text: 'Supervisar el suministro, uso obligatorio e inspección técnica de los Elementos de Protección Personal (EPP térmico, caretas antifluido y calzado antideslizante).',
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [
              new TextRun({
                text: 'Coordinar con la ARL las capacitaciones en control de fuegos Clase K (grasas y aceites vegetales), primeros auxilios y evacuación de emergencia.',
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [
              new TextRun({
                text: 'Garantizar el cumplimiento ambiental en la entrega de Aceite de Cocina Usado (ACU) a gestores autorizados conforme a la Res. 0316/2018 SDA.',
                font: DOCX_FONT,
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 200, after: 120 },
            children: [
              new TextRun({
                text: '3. COMPETENCIA Y CERTIFICACIÓN LEGAL',
                bold: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 240 },
            children: [
              new TextRun({
                text: 'El responsable designado acredita la aprobación del Curso Virtual de cincuenta (50) horas en el SG-SST avalado por el Ministerio del Trabajo de Colombia, cumpliendo a cabalidad con el perfil de competencia técnica exigido por la normatividad nacional.',
                font: DOCX_FONT,
              }),
            ],
          }),

          // Firmas
          new Paragraph({
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 400, after: 180 },
            children: [
              new TextRun({
                text: 'En constancia de compromiso y aceptación recíproca, se firma en Bogotá D.C.',
                italics: true,
                font: DOCX_FONT,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________', font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'GERENTE GENERAL / REPRESENTANTE LEGAL', bold: true, font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'FRIKAZ S.A.S. · NIT 901.654.892-3', font: DOCX_FONT })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________', font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'RESPONSABLE ASIGNADO DEL SG-SST', bold: true, font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'CURSO 50 HORAS MINTRABAJO', font: DOCX_FONT })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });
}

/**
 * 2. Manifiesto Oficial de Entrega de Aceite de Cocina Usado (ACU) (FRK-SST-REG-02)
 */
export async function generarManifiestoACUDocx(logoBytes?: Uint8Array | null): Promise<Document> {
  const fechaHoy = new Date().toLocaleDateString('es-CO');
  const borderLight = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  const tableHeader = crearCajaCalidadDocxTable({
    codigo: 'FRK-SST-REG-02',
    fecha: fechaHoy,
    version: '01',
    nombreEmpresa: 'Frikaz S.A.S',
    tituloDocumento: 'MANIFIESTO DE DISPOSICIÓN DE ACEITE DE COCINA USADO (ACU)',
    tipoDocumento: 'formato',
    logoBytes,
  });

  return new Document({
    creator: 'FRIKAZ S.A.S. - Gestión Ambiental y SST',
    title: 'Manifiesto de Entrega de Aceite de Cocina Usado',
    styles: {
      default: {
        document: {
          run: { font: DOCX_FONT, size: DOCX_FONT_SIZE_BODY, color: '000000' },
          paragraph: { spacing: { line: DOCX_LINE_SPACING_1_5, after: 180 }, alignment: AlignmentType.JUSTIFIED },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: DOCX_MARGIN_1_INCH,
              bottom: DOCX_MARGIN_1_INCH,
              left: DOCX_MARGIN_1_INCH,
              right: DOCX_MARGIN_1_INCH,
            },
          },
        },
        children: [
          tableHeader,
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 140, after: 160 },
            children: [
              new TextRun({
                text: 'SISTEMA DE GESTIÓN AMBIENTAL Y SST – FRIKAZ S.A.S.',
                bold: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: '\nResolución 0316 de 2018 (MADS) y Registro Especial ante la Secretaría Distrital de Ambiente (SDA)',
                italics: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
                color: '444444',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 180 },
            children: [
              new TextRun({
                text: 'El presente manifiesto certifica la entrega técnica, trazable y ambientalmente segura de los remanentes de Aceite de Cocina Usado (ACU) generados en el proceso de cocción y fritura de snacks de la planta de ',
                font: DOCX_FONT,
              }),
              new TextRun({
                text: 'FRIKAZ S.A.S. (Bosa Piamonte, Bogotá D.C.)',
                bold: true,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: ', garantizando que el residuo graso NO ha sido vertido a las redes de alcantarillado público de la EAAB ni dispuesto de forma ilícita.',
                font: DOCX_FONT,
              }),
            ],
          }),

          // Tabla técnica de entrega
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'GENERADOR:', bold: true, font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'FRIKAZ S.A.S. · NIT 901.654.892-3', font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'REGISTRO SDA BOGOTÁ:', bold: true, font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'ACU-SDA-BOS-2026-089 (Generador Comercial Autorizado)', font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'CANTIDAD RECOLECTADA:', bold: true, font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: '55 Galones (Tambor hermético normalizado)', font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'CONDICIÓN TÉRMICA:', bold: true, font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'Enfriado por debajo de 30°C (Cumplimiento de seguridad)', font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'GESTOR AMBIENTAL:', bold: true, font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'Gestor Autorizado con Licencia Ambiental SDA vigente', font: DOCX_FONT })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 400, after: 120 },
            children: [
              new TextRun({
                text: 'Firmas de entrega y recepción técnica de residuos:',
                bold: true,
                font: DOCX_FONT,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________', font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'ENTREGA: RESPONSABLE DE PLANTA / SST', bold: true, font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'FRIKAZ S.A.S.', font: DOCX_FONT })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________', font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'RECIBE: CONDUCTOR / GESTOR AMBIENTAL SDA', bold: true, font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'EMPRESA RECOLECTORA AUTORIZADA', font: DOCX_FONT })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });
}

/**
 * 3. Acta de Elección y Posesión del Vigía de SST (FRK-SST-ACT-02)
 */
export async function generarActaVigiaDocx(logoBytes?: Uint8Array | null): Promise<Document> {
  const fechaHoy = new Date().toLocaleDateString('es-CO');
  const tableHeader = crearCajaCalidadDocxTable({
    codigo: 'FRK-SST-ACT-02',
    fecha: fechaHoy,
    version: '01',
    nombreEmpresa: 'Frikaz S.A.S',
    tituloDocumento: 'ACTA DE ELECCIÓN Y POSESIÓN DEL VIGÍA DE SST',
    tipoDocumento: 'acta',
    logoBytes,
  });

  return new Document({
    creator: 'FRIKAZ S.A.S. - SG-SST',
    title: 'Acta de Elección y Posesión del Vigía de SST',
    styles: {
      default: {
        document: {
          run: { font: DOCX_FONT, size: DOCX_FONT_SIZE_BODY, color: '000000' },
          paragraph: { spacing: { line: DOCX_LINE_SPACING_1_5, after: 180 }, alignment: AlignmentType.JUSTIFIED },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: DOCX_MARGIN_1_INCH,
              bottom: DOCX_MARGIN_1_INCH,
              left: DOCX_MARGIN_1_INCH,
              right: DOCX_MARGIN_1_INCH,
            },
          },
        },
        children: [
          tableHeader,
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 140, after: 160 },
            children: [
              new TextRun({
                text: 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)',
                bold: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: '\nResolución 2013 de 1986, Decreto 1295 de 1994 y Decreto 1072 de 2015 (Art. 2.2.4.6.2)',
                italics: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
                color: '444444',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 180 },
            children: [
              new TextRun({
                text: 'En las instalaciones de FRIKAZ S.A.S. (Bosa Piamonte, Bogotá D.C.), se reunió la totalidad de los diez (10) trabajadores vinculados a la planta y áreas comerciales con el propósito de llevar a cabo la elección libre, democrática y formal del ',
                font: DOCX_FONT,
              }),
              new TextRun({
                text: 'VIGÍA DE SEGURIDAD Y SALUD EN EL TRABAJO',
                bold: true,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: ' para el período constitucional de dos (2) años.',
                font: DOCX_FONT,
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 160, after: 100 },
            children: [
              new TextRun({
                text: 'COMPROMISOS Y FUNCIONES LEGALES DEL VIGÍA ELECTO:',
                bold: true,
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [new TextRun({ text: 'Participar activamente en las inspecciones mensuales de seguridad a freidoras industriales, rebanadoras, sistemas de extracción de humos y pisos antideslizantes.', font: DOCX_FONT })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [new TextRun({ text: 'Proponer medidas técnicas correctivas para evitar accidentes por quemaduras con aceite y cortes de tubérculos.', font: DOCX_FONT })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [new TextRun({ text: 'Actuar como integrante obligatorio del equipo investigador de cualquier incidente o accidente laboral ocurrido en la planta.', font: DOCX_FONT })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 80 },
            children: [new TextRun({ text: 'Canalizar las inquietudes, reportes de condiciones inseguras y solicitudes de los operarios ante la Gerencia General.', font: DOCX_FONT })],
          }),

          new Paragraph({
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 360, after: 120 },
            children: [new TextRun({ text: 'Constancia de firmas:', bold: true, font: DOCX_FONT })],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________', font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'GERENTE GENERAL / EMPLEADOR', bold: true, font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'FRIKAZ S.A.S.', font: DOCX_FONT })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________', font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'VIGÍA DE SST ELECTO', bold: true, font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'REPRESENTANTE DE LOS TRABAJADORES', font: DOCX_FONT })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });
}

/**
 * 4. Registro de Entrega y Compromiso de EPP Térmico y Mecánico (FRK-SST-REG-01)
 */
export async function generarEntregaEPPTermicoDocx(logoBytes?: Uint8Array | null): Promise<Document> {
  const fechaHoy = new Date().toLocaleDateString('es-CO');
  const borderLight = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  const tableHeader = crearCajaCalidadDocxTable({
    codigo: 'FRK-SST-REG-01',
    fecha: fechaHoy,
    version: '01',
    nombreEmpresa: 'Frikaz S.A.S',
    tituloDocumento: 'REGISTRO DE ENTREGA Y COMPROMISO DE USO DE EPP',
    tipoDocumento: 'formato',
    logoBytes,
  });

  return new Document({
    creator: 'FRIKAZ S.A.S. - SG-SST',
    title: 'Registro de Entrega de EPP Térmico y Mecánico',
    styles: {
      default: {
        document: {
          run: { font: DOCX_FONT, size: DOCX_FONT_SIZE_BODY, color: '000000' },
          paragraph: { spacing: { line: DOCX_LINE_SPACING_1_5, after: 180 }, alignment: AlignmentType.JUSTIFIED },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: DOCX_MARGIN_1_INCH,
              bottom: DOCX_MARGIN_1_INCH,
              left: DOCX_MARGIN_1_INCH,
              right: DOCX_MARGIN_1_INCH,
            },
          },
        },
        children: [
          tableHeader,
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 140, after: 160 },
            children: [
              new TextRun({
                text: 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)',
                bold: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: '\nResolución 2400 de 1979 (Artículos 170 al 178) y Ley 9 de 1979',
                italics: true,
                size: DOCX_FONT_SIZE_BODY,
                font: DOCX_FONT,
                color: '444444',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 180 },
            children: [
              new TextRun({
                text: 'En la planta de producción de FRIKAZ S.A.S. (Bosa Piamonte, Bogotá D.C.), se hace entrega formal y técnica de la dotación y Elementos de Protección Personal (EPP) especificados a continuación para el control de los factores de riesgo térmico, mecánico y locativo:',
                font: DOCX_FONT,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ítem', bold: true, font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'Descripción del Elemento de Protección Personal (EPP)', bold: true, font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Norma / Certificación', bold: true, font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '1', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'Guantes térmicos de caña larga resistentes a alta temperatura (200°C) para operación de freidoras', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'EN 407 / NTC 2219', font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '2', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'Careta de policarbonato con visor panorámico y mentonera contra salpicaduras de aceite caliente', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ANSI Z87.1', font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '3', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'Calzado de seguridad industrial con suela antideslizante con ranurado profundo y puntera de protección', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ASTM F2413 / NTC 2257', font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '4', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'Guante de malla metálica de acero inoxidable para maniobras de corte, trozado y pelado de tubérculos', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'EN 1082-1 Anticorte', font: DOCX_FONT })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '5', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ children: [new TextRun({ text: 'Delantal impermeable de carnaza y nitrilo de protección corporal completa ante salpicaduras', font: DOCX_FONT })] })] }),
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: borderLight, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Res. 2400/79', font: DOCX_FONT })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 200, after: 120 },
            children: [
              new TextRun({
                text: 'DECLARACIÓN DEL TRABAJADOR: ',
                bold: true,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: 'Declaro bajo juramento que recibí en perfecto estado los EPP relacionados, que fui capacitado(a) en su uso correcto, almacenamiento higiénico y mantenimiento, y me comprometo a utilizarlos de manera obligatoria y continua durante mi jornada laboral.',
                italics: true,
                font: DOCX_FONT,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________', font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'FIRMA DEL TRABAJADOR / OPERARIO', bold: true, font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'C.C. ___________________ Huella:', font: DOCX_FONT })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________', font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'RESPONSABLE ENTREGA / SST', bold: true, font: DOCX_FONT })] }),
                      new Paragraph({ children: [new TextRun({ text: 'FRIKAZ S.A.S.', font: DOCX_FONT })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });
}

/**
 * Exportador multipropósito para los formatos oficiales con caja de calidad
 */
export async function exportarPlantillaOficialDocx(tipo: string): Promise<void> {
  const logoBytes = await cargarLogoFrikazBytes();
  let doc: Document;
  let filename = 'Documento_Oficial_Frikaz.docx';

  switch (tipo) {
    case 'RESPONSABLE_SST':
      doc = await generarActaResponsableDocx(logoBytes);
      filename = 'FRK-SST-ACT-01_Acta_Designacion_Responsable_SST_Frikaz.docx';
      break;
    case 'ACU_MANIFIESTO':
      doc = await generarManifiestoACUDocx(logoBytes);
      filename = 'FRK-SST-REG-02_Manifiesto_Disposicion_ACU_Frikaz.docx';
      break;
    case 'VIGIA_SST':
      doc = await generarActaVigiaDocx(logoBytes);
      filename = 'FRK-SST-ACT-02_Acta_Eleccion_Vigia_SST_Frikaz.docx';
      break;
    case 'EPP_TERMICO':
      doc = await generarEntregaEPPTermicoDocx(logoBytes);
      filename = 'FRK-SST-REG-01_Registro_Entrega_EPP_Termico_Frikaz.docx';
      break;
    default:
      doc = await generarActaResponsableDocx(logoBytes);
      filename = 'Documento_Oficial_Frikaz.docx';
  }

  await descargarDocumentoDocx(doc, filename);
}
