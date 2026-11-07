import {
  CargoSST,
  PoliticaSSTData,
  RegistroHistorialPolitica,
} from '../types/organigramaSst';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
} from 'docx';

const STORAGE_KEY_POLITICA = 'frikaz_politica_sgsst_v1';
const STORAGE_KEY_CARGOS = 'frikaz_cargos_sgsst_v1';

// ============================================================================
// DATOS CANÓNICOS DEL ORGANIGRAMA Y RESPONSABILIDADES SST (FRIKAZ S.A.S.)
// ============================================================================
export const CARGOS_SST_CANONICOS: CargoSST[] = [
  // NIVEL 1. ALTA DIRECCIÓN
  {
    id: 'cargo-gerente-general',
    nombre: 'Gerente General',
    nivelJerarquico: 'ALTA_DIRECCION',
    nivelNombre: 'Nivel 1. Alta Dirección',
    areaProceso: 'Dirección General y Gestión Estratégica',
    icono: 'Crown',
    colorTheme: {
      badgeBg: 'bg-purple-500/20',
      badgeText: 'text-purple-300',
      border: 'border-purple-500/40',
      accent: 'text-purple-400',
      gradient: 'from-purple-950/70 via-slate-900 to-slate-950',
      cardBg: 'bg-slate-900/90',
    },
    descripcionPuesto:
      'Máxima autoridad ejecutiva y representante legal de Frikaz S.A.S. Responsable directo de garantizar los recursos y liderar el SG-SST.',
    responsabilidades: [
      'Liderar y asumir la responsabilidad general del Sistema de Gestión de Seguridad y Salud en el Trabajo.',
      'Respaldar y aprobar la Política de SST.',
      'Asignar los recursos humanos, técnicos y económicos necesarios para el funcionamiento del sistema.',
      'Promover condiciones de trabajo seguras para todos los colaboradores.',
      'Realizar seguimiento al cumplimiento de las actividades del SG-SST.',
      'Apoyar las acciones de mejora continua.',
    ],
    compromisos: [
      'Asistir puntualmente a las revisiones anuales por la alta dirección del SG-SST.',
      'Garantizar la disponibilidad oportuna de presupuesto para prevención de riesgos laborales.',
      'Asegurar canales de comunicación abiertos y continuos con el Coordinador / Vigía de SST.',
      'Fomentar una cultura corporativa de prevención, autocuidado y reporte voluntario de condiciones inseguras.',
    ],
    ordenNivel: 1,
  },

  // NIVEL 2. RESPONSABLE DEL SG-SST
  {
    id: 'cargo-coordinador-vigia-sst',
    nombre: 'Coordinador / Vigía de SST',
    nivelJerarquico: 'RESPONSABLE_SST',
    nivelNombre: 'Nivel 2. Responsable del SG-SST',
    areaProceso: 'Seguridad y Salud en el Trabajo (SG-SST)',
    icono: 'ShieldCheck',
    colorTheme: {
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300',
      border: 'border-emerald-500/40',
      accent: 'text-emerald-400',
      gradient: 'from-emerald-950/70 via-slate-900 to-slate-950',
      cardBg: 'bg-slate-900/90',
    },
    descripcionPuesto:
      'Encargado de planificar, coordinar, ejecutar y verificar el SG-SST en Frikaz S.A.S., velando por el cumplimiento del Decreto 1072 de 2015 y la Res. 0312 de 2019.',
    responsabilidades: [
      'Planificar y apoyar el desarrollo del SG-SST.',
      'Identificar los peligros y apoyar la valoración de los riesgos laborales.',
      'Realizar seguimiento a las actividades de prevención.',
      'Promover capacitaciones y actividades de seguridad y salud en el trabajo.',
      'Mantener actualizada la documentación del sistema.',
      'Apoyar el cumplimiento de los requisitos establecidos en el Decreto 1072 de 2015.',
      'Informar a la gerencia sobre las novedades y necesidades del sistema.',
    ],
    compromisos: [
      'Mantener actualizada la Matriz de Riesgos bajo metodología GTC 45 y la Matriz Legal.',
      'Realizar inspecciones periódicas de seguridad en planta de producción y vehículos.',
      'Investigar todos los incidentes y accidentes de trabajo dentro de los plazos legales.',
      'Actuar con imparcialidad, confidencialidad y rigor técnico en la protección del equipo humano.',
    ],
    ordenNivel: 2,
  },

  // NIVEL 3. NIVEL OPERATIVO (5 CARGOS)
  {
    id: 'cargo-operario-seleccion',
    nombre: 'Operario de Selección',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Planta de Producción – Área de Selección y Lavado de Materia Prima',
    icono: 'CheckCircle2',
    colorTheme: {
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-300',
      border: 'border-blue-500/40',
      accent: 'text-blue-400',
      gradient: 'from-blue-950/70 via-slate-900 to-slate-950',
      cardBg: 'bg-slate-900/90',
    },
    descripcionPuesto:
      'Responsable de clasificar, inspeccionar y seleccionar papa, plátano y materias primas de calidad para el proceso de fritura.',
    responsabilidades: [
      'Cumplir las normas de seguridad establecidas para su puesto de trabajo.',
      'Utilizar correctamente los elementos de protección personal.',
      'Mantener el área de selección organizada y limpia.',
      'Reportar condiciones inseguras y situaciones que puedan generar accidentes.',
      'Adoptar posturas adecuadas durante el desarrollo de sus actividades.',
      'Participar en las capacitaciones y actividades de prevención.',
    ],
    compromisos: [
      'Realizar pausas activas programadas para mitigar la fatiga osteomuscular y el riesgo biomecánico.',
      'Evitar el sobreesfuerzo manipulando canastillas de materia prima con técnicas ergonómicas seguras.',
      'Reportar inmediatamente cualquier presencia de humedad excesiva o pisos resbaladizos.',
    ],
    ordenNivel: 3,
  },
  {
    id: 'cargo-operario-pelado',
    nombre: 'Operario de Pelado',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Planta de Producción – Área de Pelado, Descascarado y Corte',
    icono: 'Scissors',
    colorTheme: {
      badgeBg: 'bg-cyan-500/20',
      badgeText: 'text-cyan-300',
      border: 'border-cyan-500/40',
      accent: 'text-cyan-400',
      gradient: 'from-cyan-950/70 via-slate-900 to-slate-950',
      cardBg: 'bg-slate-900/90',
    },
    descripcionPuesto:
      'Encargado del pelado manual o asistido y adecuación inicial de tubérculos y plátanos previos al corte y fritura.',
    responsabilidades: [
      'Cumplir los procedimientos seguros establecidos para el pelado de los productos.',
      'Utilizar correctamente los elementos de protección personal.',
      'Manipular las herramientas de trabajo de manera segura.',
      'Mantener el puesto de trabajo limpio y organizado.',
      'Reportar daños en herramientas, equipos o condiciones inseguras.',
      'Evitar movimientos repetitivos y posturas inadecuadas.',
    ],
    compromisos: [
      'Utilizar guantes con protección anticorte al manipular cuchillos o peladores manuales.',
      'Reportar de inmediato desgaste, mangos sueltos o anomalías en las herramientas de corte.',
      'Mantener despejada la mesa de trabajo evitando acumulación de residuos o cáscaras resbaladizas.',
    ],
    ordenNivel: 3,
  },
  {
    id: 'cargo-operario-frito',
    nombre: 'Operario de Frito',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Planta de Producción – Área de Cocción y Freidoras Industriales',
    icono: 'Flame',
    colorTheme: {
      badgeBg: 'bg-orange-500/20',
      badgeText: 'text-orange-300',
      border: 'border-orange-500/40',
      accent: 'text-orange-400',
      gradient: 'from-orange-950/70 via-slate-900 to-slate-950',
      cardBg: 'bg-slate-900/90',
    },
    descripcionPuesto:
      'Operador especializado en la línea de fritura continua y freidoras a gas. Expuesto a temperaturas elevadas y aceite caliente.',
    responsabilidades: [
      'Cumplir las medidas de seguridad establecidas para el proceso de fritura.',
      'Utilizar los elementos de protección personal correspondientes, especialmente guantes térmicos y calzado antideslizante.',
      'Mantener precaución durante la manipulación de aceite caliente y equipos de fritura.',
      'Evitar el contacto directo con superficies a altas temperaturas.',
      'Reportar fugas, derrames, fallas de equipos y situaciones de riesgo.',
      'Mantener despejada y organizada el área de trabajo.',
    ],
    compromisos: [
      'No verter agua ni materias primas con exceso de humedad directamente sobre el aceite a alta temperatura.',
      'Inspeccionar el sistema de gas, válvulas y quemadores antes de iniciar cada ciclo productivo.',
      'Conocer con exactitud la ubicación y operación del extintor para fuegos Clase K (grasas y aceites).',
      'Portar siempre el calzado de seguridad con suela antideslizante de alta adherencia y guantes largos de protección térmica.',
    ],
    ordenNivel: 3,
  },
  {
    id: 'cargo-operario-empaque',
    nombre: 'Operario de Empaque',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Planta de Producción – Área de Empaque, Sellado y Embalaje',
    icono: 'Package',
    colorTheme: {
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      border: 'border-amber-500/40',
      accent: 'text-amber-400',
      gradient: 'from-amber-950/70 via-slate-900 to-slate-950',
      cardBg: 'bg-slate-900/90',
    },
    descripcionPuesto:
      'Responsable de dosificar, sellar en calor y embalar los snacks terminados en cajas y paquetes para su distribución.',
    responsabilidades: [
      'Cumplir las normas de seguridad correspondientes al proceso de empaque.',
      'Utilizar correctamente los elementos de protección personal.',
      'Mantener el orden y la limpieza del área.',
      'Manipular adecuadamente los materiales y herramientas de empaque.',
      'Adoptar posturas adecuadas para evitar molestias musculares.',
      'Reportar condiciones inseguras y participar en las actividades de prevención.',
    ],
    compromisos: [
      'Evitar tocar directamente las mordazas calientes de la máquina selladora de bolsas.',
      'Apilar las cajas de snacks de forma trabada sin sobrepasar la altura segura de apilamiento.',
      'Practicar higiene respiratoria, uso de cofia, tapabocas y guantes de manipulación de alimentos.',
    ],
    ordenNivel: 3,
  },
  {
    id: 'cargo-conductor',
    nombre: 'Conductor',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Logística, Transporte y Distribución Comercial',
    icono: 'Truck',
    colorTheme: {
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300',
      border: 'border-emerald-500/40',
      accent: 'text-emerald-400',
      gradient: 'from-emerald-950/70 via-slate-900 to-slate-950',
      cardBg: 'bg-slate-900/90',
    },
    descripcionPuesto:
      'Encargado de la conducción de vehículos de reparto de snacks hacia clientes, tiendas y puntos de distribución en Bogotá y municipios aledaños.',
    responsabilidades: [
      'Cumplir las normas de tránsito y seguridad vial.',
      'Realizar la inspección preoperacional del vehículo antes de iniciar los recorridos.',
      'Reportar fallas mecánicas o condiciones que puedan afectar la seguridad.',
      'Utilizar correctamente los elementos de protección personal requeridos.',
      'Realizar de manera segura las actividades de cargue y descargue.',
      'Respetar las rutas y condiciones de transporte establecidas por la empresa.',
    ],
    compromisos: [
      'Cero tolerancia al consumo de alcohol o sustancias psicoactivas antes y durante la conducción.',
      'Portar siempre cinturón de seguridad y exigir su uso al acompañante.',
      'Realizar pausas activas contra la fatiga vial en trayectos largos o congestión vehicular severa.',
      'Mantener al día el botiquín reglamentario, extintor vehicular vigente y equipo de carretera.',
    ],
    ordenNivel: 3,
  },
];

// ============================================================================
// DATOS CANÓNICOS DE LA POLÍTICA DEL SG-SST (FRIKAZ S.A.S.)
// ============================================================================
export const POLITICA_SST_CANONICA: PoliticaSSTData = {
  id: 'politica-frikaz-sgsst-2026',
  empresa: 'Frikaz S.A.S.',
  nit: '901.234.567-8',
  direccion: 'Calle 65 Sur # 78-45, Bosa, Bogotá D.C., Colombia',
  actividadPrincipal:
    'Fabricación y comercialización de snacks fritos tipo artesanal (papas, plátanos y chicharrones) · CIIU 1089',
  titulo: 'POLÍTICA DE SEGURIDAD Y SALUD EN EL TRABAJO',
  declaracionIntroductoria:
    'En Frikaz S.A.S., empresa dedicada a la fabricación y comercialización de snacks, estamos convencidos de que nuestro capital más importante es nuestro personal. Por ello, la alta dirección se compromete a:',
  compromisos: [
    {
      id: 1,
      titulo: 'Proteger la seguridad y salud',
      descripcion:
        'Proteger la seguridad y salud de todos los colaboradores (Gerente, operarios de selección, frito, pelado, empaque y conductores), proveedores y terceros mediante la prevención de lesiones, enfermedades laborales e incidentes, gestionando de manera prioritaria los peligros asociados a la producción de snacks (riesgo biomecánico por posturas prolongadas, riesgo físico por temperaturas altas en la zona de frito, riesgo locativo y condiciones de tránsito vial).',
    },
    {
      id: 2,
      titulo: 'Cumplir con la normatividad nacional vigente',
      descripcion:
        'Cumplir con la normatividad nacional vigente aplicable en materia de riesgos laborales y otros compromisos que suscriba la organización.',
    },
    {
      id: 3,
      titulo: 'Garantizar la consulta y la participación activa',
      descripcion:
        'Garantizar la consulta y la participación activa de los trabajadores y sus representantes en todos los elementos del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST).',
    },
    {
      id: 4,
      titulo: 'Mejorar continuamente',
      descripcion:
        'Mejorar continuamente el desempeño del SG-SST y su integración con los demás procesos de la empresa.',
    },
  ],
  comunicacionRevision:
    'Esta política será comunicada a todos los niveles de la organización, estará disponible para las partes interesadas y se revisará como mínimo una vez al año.',
  nombreFirmante: 'Gerente General',
  cargoFirmante: 'Gerente General – Frikaz S.A.S.',
  estado: 'Pendiente de aprobación',
  fechaUltimaActualizacion: new Date().toISOString().split('T')[0],
  fechaAprobacion: undefined,
  versionActual: 'Versión 1.0 (2026)',
  historialCambios: [
    {
      id: 'hist-01',
      fecha: new Date().toISOString().split('T')[0],
      hora: '08:00 AM',
      version: 'Versión 1.0',
      autor: 'Coordinador SG-SST / Frikaz S.A.S.',
      motivoCambio: 'Elaboración y emisión inicial de la Política de SST para Frikaz S.A.S.',
      estado: 'Pendiente de aprobación',
      detallesModificacion:
        'Estructuración inicial de los 4 compromisos legales prioritarios conforme al Decreto 1072 de 2015.',
    },
  ],
};

// ============================================================================
// GESTIÓN DE PERSISTENCIA EN LOCALSTORAGE
// ============================================================================
export function getStoredPoliticaSST(): PoliticaSSTData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POLITICA);
    if (!raw) return POLITICA_SST_CANONICA;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error('Error cargando política SST de localStorage:', e);
    return POLITICA_SST_CANONICA;
  }
}

export function saveStoredPoliticaSST(data: PoliticaSSTData): void {
  try {
    localStorage.setItem(STORAGE_KEY_POLITICA, JSON.stringify(data));
  } catch (e) {
    console.error('Error guardando política SST en localStorage:', e);
  }
}

export function resetStoredPoliticaSST(): PoliticaSSTData {
  try {
    localStorage.removeItem(STORAGE_KEY_POLITICA);
    return POLITICA_SST_CANONICA;
  } catch (e) {
    console.error('Error reiniciando política SST:', e);
    return POLITICA_SST_CANONICA;
  }
}

export function getStoredCargosSST(): CargoSST[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CARGOS);
    if (!raw) return CARGOS_SST_CANONICOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : CARGOS_SST_CANONICOS;
  } catch (e) {
    console.error('Error cargando cargos SST de localStorage:', e);
    return CARGOS_SST_CANONICOS;
  }
}

export function saveStoredCargosSST(data: CargoSST[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CARGOS, JSON.stringify(data));
  } catch (e) {
    console.error('Error guardando cargos SST en localStorage:', e);
  }
}

// ============================================================================
// EXPORTADOR WORD (.DOCX) - ASIGNACIÓN INDIVIDUAL DE RESPONSABILIDADES SST
// ============================================================================
export async function exportarResponsabilidadesWord(
  cargo: CargoSST,
  infoTrabajador?: {
    nombreTrabajador?: string;
    numeroIdentificacion?: string;
    fechaAsignacion?: string;
  }
): Promise<void> {
  const fechaHoy =
    infoTrabajador?.fechaAsignacion ||
    new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const nombreTrabajador =
    infoTrabajador?.nombreTrabajador?.trim() ||
    '______________________________________________________';

  const numeroIdentificacion =
    infoTrabajador?.numeroIdentificacion?.trim() ||
    '____________________________________';

  const tableBorderNone = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  };

  const tableBorderLight = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  };

  const doc = new Document({
    creator: 'Frikaz S.A.S. - Sistema de Gestión SG-SST',
    title: `Asignación de Responsabilidades SST - ${cargo.nombre}`,
    description: `Documento oficial de asignación de responsabilidades y compromisos en Seguridad y Salud en el Trabajo para el cargo de ${cargo.nombre}.`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // ENCABEZADO FORMAL
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'FRIKAZ S.A.S.',
                bold: true,
                size: 32, // 16pt
                color: 'C2410C', // Orange dark
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'NIT: 901.234.567-8 · BOSA, BOGOTÁ D.C.',
                size: 18, // 9pt
                color: '64748B',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)',
                bold: true,
                size: 20, // 10pt
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'ASIGNACIÓN DE RESPONSABILIDADES EN SEGURIDAD Y SALUD EN EL TRABAJO',
                bold: true,
                size: 24, // 12pt
                color: '0F172A',
                font: 'Calibri',
              }),
            ],
          }),

          // SUBTÍTULO CON MARCO NORMATIVO
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'En cumplimiento del Decreto Único Reglamentario 1072 de 2015 (Artículo 2.2.4.6.8) y la Resolución 0312 de 2019',
                italics: true,
                size: 18,
                color: '475569',
                font: 'Calibri',
              }),
            ],
          }),

          // TABLA DE INFORMACIÓN DEL TRABAJADOR
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'CARGO ASIGNADO:',
                            bold: true,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cargo.nombre.toUpperCase(),
                            bold: true,
                            size: 19,
                            color: 'C2410C',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'NIVEL JERÁRQUICO:',
                            bold: true,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cargo.nivelNombre,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'ÁREA O PROCESO:',
                            bold: true,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cargo.areaProceso,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'NOMBRE DEL TRABAJADOR:',
                            bold: true,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: nombreTrabajador,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'NÚMERO DE IDENTIFICACIÓN:',
                            bold: true,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: numeroIdentificacion,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'FECHA DE ASIGNACIÓN:',
                            bold: true,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: fechaHoy,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // SEPARADOR
          new Paragraph({ spacing: { after: 240 } }),

          // 1. OBJETIVO DE LA ASIGNACIÓN DE RESPONSABILIDADES
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 120 },
            children: [
              new TextRun({
                text: '1. OBJETIVO DE LA ASIGNACIÓN DE RESPONSABILIDADES',
                bold: true,
                size: 21,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Establecer, comunicar y formalizar las responsabilidades y compromisos específicos en materia de Seguridad y Salud en el Trabajo para el cargo de `,
                size: 20,
                font: 'Calibri',
              }),
              new TextRun({
                text: cargo.nombre,
                bold: true,
                size: 20,
                font: 'Calibri',
              }),
              new TextRun({
                text: ` en FRIKAZ S.A.S., garantizando la prevención de accidentes laborales, enfermedades laborales y la mejora continua de las condiciones laborales en los procesos de producción y comercialización de snacks.`,
                size: 20,
                font: 'Calibri',
              }),
            ],
          }),

          // 2. DESCRIPCIÓN DE LAS RESPONSABILIDADES ESPECÍFICAS DEL CARGO
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 120 },
            children: [
              new TextRun({
                text: '2. RESPONSABILIDADES ESPECÍFICAS DEL CARGO EN MATERIA DE SST',
                bold: true,
                size: 21,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          }),
          ...cargo.responsabilidades.map(
            (resp) =>
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: resp,
                    size: 20,
                    font: 'Calibri',
                  }),
                ],
              })
          ),

          // 3. COMPROMISOS DEL TRABAJADOR FRENTE AL SG-SST
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '3. COMPROMISOS DEL TRABAJADOR FRENTE AL SG-SST',
                bold: true,
                size: 21,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          }),
          ...cargo.compromisos.map(
            (comp) =>
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: comp,
                    size: 20,
                    font: 'Calibri',
                  }),
                ],
              })
          ),

          // 4. DECLARACIÓN DE CONOCIMIENTO Y ACEPTACIÓN
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '4. DECLARACIÓN DE CONOCIMIENTO Y ACEPTACIÓN',
                bold: true,
                size: 21,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'Yo, en calidad de colaborador(a) de FRIKAZ S.A.S., manifiesto expresamente que he recibido, leído, comprendido y aceptado las responsabilidades y compromisos en Seguridad y Salud en el Trabajo correspondientes a mi cargo. Me comprometo a cumplirlos a cabalidad, acatar los procedimientos seguros de trabajo, hacer uso adecuado y permanente de los elementos de protección personal suministrados, reportar oportunamente cualquier condición o acto inseguro, y participar activamente en las capacitaciones programadas por la empresa.',
                size: 20,
                italics: true,
                font: 'Calibri',
              }),
            ],
          }),

          // 5. ESPACIO PARA FIRMAS
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: '5. CONSTANCIA DE FIRMAS',
                bold: true,
                size: 21,
                color: '1E293B',
                font: 'Calibri',
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
                    borders: tableBorderNone,
                    children: [
                      new Paragraph({
                        spacing: { before: 500, after: 80 },
                        children: [
                          new TextRun({
                            text: '____________________________________________',
                            size: 20,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 40 },
                        children: [
                          new TextRun({
                            text: 'Firma del trabajador:',
                            bold: true,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 40 },
                        children: [
                          new TextRun({
                            text: `Nombre completo: ${nombreTrabajador}`,
                            size: 18,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 40 },
                        children: [
                          new TextRun({
                            text: `Documento de identidad: ${numeroIdentificacion}`,
                            size: 18,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 40 },
                        children: [
                          new TextRun({
                            text: `Fecha: ${fechaHoy}`,
                            size: 18,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: tableBorderNone,
                    children: [
                      new Paragraph({
                        spacing: { before: 500, after: 80 },
                        children: [
                          new TextRun({
                            text: '____________________________________________',
                            size: 20,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 40 },
                        children: [
                          new TextRun({
                            text: 'Firma del responsable de SST:',
                            bold: true,
                            size: 19,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 40 },
                        children: [
                          new TextRun({
                            text: 'Nombre: Coordinador / Vigía de SST',
                            size: 18,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 40 },
                        children: [
                          new TextRun({
                            text: 'Empresa: Frikaz S.A.S.',
                            size: 18,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 40 },
                        children: [
                          new TextRun({
                            text: `Fecha: ${fechaHoy}`,
                            size: 18,
                            font: 'Calibri',
                          }),
                        ],
                      }),
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

  const blob = await Packer.toBlob(doc);
  const cleanCargoName = cargo.nombre
    .replace(/[^\w\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '_');
  const filename = `Asignacion_Responsabilidades_SST_${cleanCargoName}_Frikaz.docx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// ============================================================================
// EXPORTADOR WORD (.DOCX) - POLÍTICA DEL SG-SST (FRIKAZ S.A.S.)
// ============================================================================
export async function exportarPoliticaWord(politica: PoliticaSSTData): Promise<void> {
  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const doc = new Document({
    creator: 'Frikaz S.A.S. - Sistema de Gestión SG-SST',
    title: 'Política de Seguridad y Salud en el Trabajo - Frikaz S.A.S.',
    description: 'Documento oficial de la Política de SST conforme al Decreto 1072 de 2015.',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // MEMBRETE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'FRIKAZ S.A.S.',
                bold: true,
                size: 32,
                color: 'C2410C',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `NIT: ${politica.nit} · BOGOTÁ D.C.`,
                size: 18,
                color: '64748B',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)',
                bold: true,
                size: 20,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          }),

          // TÍTULO DE LA POLÍTICA
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: politica.titulo,
                bold: true,
                size: 26,
                color: '0F172A',
                font: 'Calibri',
              }),
            ],
          }),

          // ESTADO Y VERSIÓN
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: `Estado del Documento: ${politica.estado.toUpperCase()} · ${politica.versionActual}`,
                italics: true,
                bold: true,
                size: 18,
                color: politica.estado === 'Vigente' ? '047857' : 'B45309',
                font: 'Calibri',
              }),
            ],
          }),

          // TEXTO INTRODUCTORIO
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: politica.declaracionIntroductoria,
                size: 21,
                font: 'Calibri',
              }),
            ],
          }),

          // COMPROMISOS ENUMERADOS
          ...politica.compromisos.flatMap((comp) => [
            new Paragraph({
              spacing: { before: 140, after: 60 },
              children: [
                new TextRun({
                  text: `${comp.id}. `,
                  bold: true,
                  size: 21,
                  color: 'C2410C',
                  font: 'Calibri',
                }),
                new TextRun({
                  text: comp.descripcion,
                  size: 21,
                  font: 'Calibri',
                }),
              ],
            }),
          ]),

          // CIERRE DE COMUNICACIÓN Y REVISIÓN ANUAL
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 240, after: 400 },
            children: [
              new TextRun({
                text: politica.comunicacionRevision,
                size: 20,
                italics: true,
                font: 'Calibri',
              }),
            ],
          }),

          // FIRMA DEL GERENTE
          new Paragraph({
            spacing: { before: 500, after: 80 },
            children: [
              new TextRun({
                text: 'Firma: __________________________________________________',
                size: 20,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${politica.cargoFirmante}`,
                bold: true,
                size: 21,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `Empresa: ${politica.empresa}`,
                size: 19,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `Fecha: ${fechaHoy}`,
                size: 19,
                color: '475569',
                font: 'Calibri',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `Politica_SST_Frikaz_SAS_${new Date().toISOString().split('T')[0]}.docx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
