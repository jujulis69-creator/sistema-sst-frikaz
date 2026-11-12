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
import {
  crearCajaCalidadDocxTable,
  obtenerMetadatosDocumentoCalidad,
  cargarLogoFrikazBytes,
  DOCX_FONT,
  DOCX_FONT_SIZE_BODY as DOCX_FONT_SIZE_12,
  DOCX_LINE_SPACING_1_5,
  DOCX_MARGIN_1_INCH,
} from './calidadDocumentalService';

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
      'Representante legal y máxima autoridad ejecutiva de Frikaz S.A.S. Responsable directo de liderar la política corporativa y asignar los recursos integrales para el SG-SST (Decreto 1072 de 2015, Art. 2.2.4.6.8).',
    responsabilidades: [
      'Liderar, aprobar y rendir cuentas sobre el desempeño del SG-SST de Frikaz S.A.S. ante los trabajadores, las autoridades de inspección del Ministerio del Trabajo y la ARL.',
      'Definir, firmar, divulgar y actualizar anualmente la Política Integral de Seguridad y Salud en el Trabajo.',
      'Asignar oportunamente los recursos humanos, técnicos, locativos y financieros para la dotación de EPP térmico de alta temperatura (200°C), mantenimiento de freidoras y sistemas contra incendios Clase K.',
      'Garantizar la elección democrática, posesión y funcionamiento permanente del Vigía de Seguridad y Salud en el Trabajo (Resolución 2013 de 1986).',
      'Presidir la revisión anual por la alta dirección del SG-SST, adoptando medidas para la mejora continua del sistema y el bienestar laboral de los 10 colaboradores.',
      'Garantizar el cumplimiento ambiental en la gestión y entrega de Aceite de Cocina Usado (ACU) a gestores autorizados por la Secretaría Distrital de Ambiente (SDA).',
    ],
    compromisos: [
      'Presidir puntualmente las sesiones de rendición de cuentas del SG-SST y la revisión directiva anual.',
      'Asegurar disponibilidad presupuestal continua para la reposición técnica de calzado antideslizante y protección térmica.',
      'Mantener canales de comunicación directos y continuos con el Coordinador/Vigía de SST sin intermediarios.',
      'Respaldar el derecho de cualquier trabajador a suspender actividades ante un peligro inminente para su integridad física (ej. fuga de gas combustible o sobrecalentamiento incontrolado de freidoras).',
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
      'Encargado del diseño, administración, ejecución y verificación técnica del SG-SST en Frikaz S.A.S., garantizando el cumplimiento de los 7 Estándares Mínimos de la Resolución 0312 de 2019 y el Decreto 1072 de 2015.',
    responsabilidades: [
      'Planificar, coordinar, implementar y auditar anualmente el Plan de Trabajo del SG-SST y el Plan de Capacitaciones con apoyo de la ARL.',
      'Elaborar, validar y mantener actualizada la Matriz de Peligros y Valoración de Riesgos (GTC 45) y la Matriz Legal colombiana vigente.',
      'Ejecutar inspecciones preoperacionales y periódicas a freidoras industriales a gas, ductos de extracción de humos, sistemas de corte y estado de pisos.',
      'Investigar el 100% de los incidentes y accidentes de trabajo ocurridos en la empresa dentro de los 15 días hábiles conforme a la Resolución 1401 de 2007.',
      'Supervisar la entrega, inspección técnica, uso obligatorio y reposición de Elementos de Protección Personal (EPP).',
      'Coordinar con la ARL las capacitaciones en combate de fuegos Clase K (grasas y aceites vegetales), primeros auxilios en quemaduras y pausas activas.',
      'Custodiar los manifiestos de disposición final de Aceite de Cocina Usado (ACU) registrados ante la Secretaría Distrital de Ambiente (SDA).',
    ],
    compromisos: [
      'Mantener vigente y actualizada la certificación del Curso Virtual de 50 Horas en el SG-SST avalado por el Ministerio del Trabajo.',
      'Realizar inspecciones periódicas rigurosas en planta sin previo aviso para verificar el porte de EPP y condiciones de seguridad.',
      'Actuar con imparcialidad técnica, confidencialidad médica y compromiso ético en la salvaguarda de los trabajadores.',
      'Informar inmediatamente a la Gerencia General cualquier desviación crítica en los sistemas térmicos o de gas de la planta.',
    ],
    ordenNivel: 2,
  },

  // NIVEL 3. NIVEL OPERATIVO (5 CARGOS)
  {
    id: 'cargo-operario-seleccion',
    nombre: 'Operario de Selección',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Planta de Producción – Área de Recepción, Selección y Lavado de Materia Prima',
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
      'Responsable de clasificar, inspeccionar y seleccionar papa, plátano y materias primas agrícolas para la línea de fritura, aplicando normas de higiene, ergonomía y seguridad locativa (Decreto 1072/2015 Art. 2.2.4.6.10).',
    responsabilidades: [
      'Cumplir los protocolos de selección, clasificación y lavado, aplicando técnicas ergonómicas seguras en la manipulación manual de canastillas de tubérculos.',
      'Utilizar permanentemente los Elementos de Protección Personal suministrados: delantal impermeable, botas de seguridad impermeables antideslizantes, cofia y guantes de nitrilo.',
      'Evitar el sobreesfuerzo biomecánico respetando las cargas máximas permitidas (25 kg hombres, 12.5 kg mujeres) con flexión de rodillas y columna recta.',
      'Mantener el área de lavado limpia y con drenaje constante para evitar encharcamientos y caídas a nivel por pisos resbaladizos.',
      'Reportar inmediatamente cualquier presencia de humedad descontrolada, fisuras en piletas de lavado o condiciones locativas inseguras.',
      'Participar obligatoriamente en las pausas activas programadas y capacitaciones preventivas del SG-SST.',
    ],
    compromisos: [
      'Solicitar apoyo de un compañero o utilizar la carretilla zorra para el traslado de canastillas pesadas.',
      'Realizar estiramientos periódicos de miembros superiores y zona lumbar para evitar fatiga osteomuscular.',
      'Reportar de forma oportuna cualquier dolor lumbar o síntoma osteomuscular asociado al trabajo.',
    ],
    ordenNivel: 3,
  },
  {
    id: 'cargo-operario-pelado',
    nombre: 'Operario de Pelado',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Planta de Producción – Área de Pelado, Descascarado y Corte Mecanizado',
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
      'Encargado del pelado, acondicionamiento y rebanado manual o asistido por máquina de tubérculos y plátanos, expuesto a riesgos mecánicos cortopunzantes y movimientos repetitivos.',
    responsabilidades: [
      'Operar con estricto apego técnico las rebanadoras, peladoras mecánicas y cuchillos de trabajo, verificando guardas de seguridad antes de su encendido.',
      'Utilizar de manera obligatoria el guante de malla de acero inoxidable anticorte en la mano no dominante durante operaciones con cuchillos o peladores manuales.',
      'Efectuar la limpieza de rebanadoras y cuchillas únicamente con la maquinaria desenergizada, apagada y desconectada de la red eléctrica.',
      'Mantener el puesto de trabajo despejado, depositando las cáscaras y residuos en los recipientes orgánicos para evitar caídas y proliferación biológica.',
      'Reportar inmediatamente desgaste, falta de filo, mangos deteriorados en herramientas de corte o anomalías en las guardas de protección.',
      'Participar en las capacitaciones de prevención de riesgo mecánico y primeros auxilios en heridas cortantes.',
    ],
    compromisos: [
      'Nunca operar máquinas rebanadoras sin las guardas de protección fijas ni aproximar las manos a las cuchillas giratorias.',
      'Utilizar el empujador de alimentos homologado durante el rebanado de materias primas.',
      'Almacenar las herramientas de corte en sus fundas protectoras y nunca dejarlas sobre superficies con filos expuestos.',
    ],
    ordenNivel: 3,
  },
  {
    id: 'cargo-operario-frito',
    nombre: 'Operario de Frito',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Planta de Producción – Área de Cocción y Freidoras Industriales a Gas',
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
      'Operador especializado en la línea de freidoras industriales a gas (180°C). Expuesto a temperaturas extremas, aceite vegetal caliente en ebullición, gases de combustión y riesgo de quemaduras graves.',
    responsabilidades: [
      'Operar las freidoras industriales cumpliendo estrictamente los parámetros de temperatura (máximo 180°C) y nivel de aceite vegetal.',
      'Utilizar de forma permanente y obligatoria el kit de protección térmica: guantes largos de carnaza/nitrilo térmico (200°C), careta de policarbonato con mentonera, delantal térmico y calzado de seguridad antideslizante con ranurado profundo.',
      'Verificar rigurosamente que las rodajas de papa y plátano hayan sido escurridas y secadas antes de sumergirlas en la cuba de fritura, previniendo salpicaduras violentas por vapor de agua.',
      'Inspeccionar diariamente quemadores, tuberías de gas, válvulas y campana de extracción de humos previo al encendido.',
      'Conocer la ubicación exacta y técnica de accionamiento del extintor Clase K (acetato de potasio) y de la válvula de corte general de gas ante emergencias.',
      'Efectuar el drenaje y filtrado de Aceite de Cocina Usado (ACU) ÚNICAMENTE cuando la temperatura haya descendido por debajo de 40°C, depositándolo en tambores herméticos para la SDA.',
    ],
    compromisos: [
      'NUNCA verter agua sobre el aceite caliente ni utilizar agua para extinguir conatos de fuego en las freidoras.',
      'Suspender inmediatamente la operación ante cualquier olor a gas o sobrecalentamiento visible del aceite.',
      'Mantener el piso circundante a las freidoras rigurosamente seco y libre de películas grasas.',
      'Acudir puntualmente a las pausas activas para disipar la carga térmica corporal.',
    ],
    ordenNivel: 3,
  },
  {
    id: 'cargo-operario-empaque',
    nombre: 'Operario de Empaque',
    nivelJerarquico: 'NIVEL_OPERATIVO',
    nivelNombre: 'Nivel 3. Nivel Operativo',
    areaProceso: 'Planta de Producción – Área de Empaque, Sellado Térmico y Embalaje',
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
      'Responsable de dosificar, sellar en mordazas calientes y embalar los snacks terminados en cajas y paquetes comerciales, expuesto a movimientos repetitivos, calor en selladoras y manipulación de cajas.',
    responsabilidades: [
      'Operar con precaución las máquinas selladoras de polietileno por calor, evitando el contacto directo con las mordazas térmicas calientes.',
      'Aplicar normas estrictas de Buenas Prácticas de Manufactura (BPM - Res. 2674/2013): uso de cofia, tapabocas, delantal limpio y guantes sanitarios.',
      'Adoptar posturas ergonómicas neutrales durante el pesaje y embolsado, mitigando el riesgo de lesiones musculoesqueléticas en muñecas y hombros.',
      'Efectuar el apilamiento de cajas de producto terminado de forma trabada, sin sobrepasar la altura segura de 1.5 metros para evitar desplomes.',
      'Reportar averías eléctricas, desgaste en cables de selladoras o condiciones locativas deficientes en la mesa de empaque.',
      'Participar activamente en las pausas activas programadas de estiramiento de extremidades superiores.',
    ],
    compromisos: [
      'No tocar las resistencias ni mordazas calientes de las selladoras sin verificar su enfriamiento previo.',
      'Respetar las pausas de descanso osteomuscular cada 2 horas de labor continua.',
      'Mantener despejada el área de paso y la báscula de pesaje libre de obstáculos.',
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
      'Encargado del transporte, distribución comercial y entrega de snacks a clientes en Bogotá y municipios vecinos, bajo lineamientos del Plan Estratégico de Seguridad Vial (PESV - Res. 40595/2022).',
    responsabilidades: [
      'Conducir bajo principios de manejo defensivo y estricto respeto a las normas de tránsito y límites de velocidad de la Ley 769 de 2002.',
      'Diligenciar diariamente la lista de chequeo de inspección preoperacional del vehículo (frenos, luces, dirección, neumáticos, fluidos y cinturones).',
      'Verificar la vigencia y porte obligatorio de documentos: SOAT, Revisión Técnico-Mecánica, Licencia de Conducción y equipo de carretera completo.',
      'Realizar las maniobras de cargue, aseguramiento de carga y descargue en puntos de venta utilizando técnicas ergonómicas y calzado de seguridad.',
      'Reportar inmediatamente cualquier siniestro vial, falla mecánica o incidente en carretera a la empresa y a la ARL.',
      'Participar en los programas de capacitación en seguridad vial, fatiga y prevención de accidentes de tránsito.',
    ],
    compromisos: [
      'CERO TOLERANCIA al consumo de alcohol o sustancias psicoactivas antes y durante la conducción.',
      'Prohibición total del uso de teléfonos celulares mientras el vehículo se encuentre en marcha sin sistema de manos libres autorizado.',
      'Uso permanente del cinturón de seguridad y exigencia de su porte a cualquier acompañante.',
      'Realizar pausas de descanso contra la fatiga vial en recorridos de alta congestión o trayectos mayores a dos horas.',
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
export function construirDocumentoResponsabilidadesDocx(
  cargo: CargoSST,
  infoTrabajador?: {
    nombreTrabajador?: string;
    numeroIdentificacion?: string;
    fechaAsignacion?: string;
  },
  logoBytes?: Uint8Array | null
): Document {
  const fechaHoy =
    infoTrabajador?.fechaAsignacion ||
    new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const fechaCorta = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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
    top: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
    left: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
    right: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
  };

  const meta = obtenerMetadatosDocumentoCalidad(cargo.id, fechaCorta);

  // CAJA DE CONTROL DE CALIDAD ADAPTADA PARA ASIGNACIÓN DE RESPONSABILIDADES
  const tablaCajaCalidad = crearCajaCalidadDocxTable({
    codigo: meta.codigo,
    fecha: fechaCorta,
    version: meta.version,
    nombreEmpresa: 'Frikaz S.A.S',
    tituloDocumento: `ASIGNACIÓN DE RESPONSABILIDADES EN SST – ${cargo.nombre.toUpperCase()}`,
    tipoDocumento: 'responsabilidades',
    logoBytes,
  });

  const doc = new Document({
    creator: 'FRIKAZ S.A.S. - Sistema de Gestión SG-SST',
    title: `Asignación de Responsabilidades SST - ${cargo.nombre}`,
    description: `Documento oficial de asignación de responsabilidades y compromisos en Seguridad y Salud en el Trabajo para el cargo de ${cargo.nombre}. Formato formal en Times New Roman 12 pt.`,
    styles: {
      default: {
        document: {
          run: {
            font: DOCX_FONT,
            size: DOCX_FONT_SIZE_12,
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: DOCX_LINE_SPACING_1_5,
              after: 180,
            },
            alignment: AlignmentType.JUSTIFIED,
          },
        },
        heading1: {
          run: {
            font: DOCX_FONT,
            size: DOCX_FONT_SIZE_12,
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: DOCX_LINE_SPACING_1_5,
              before: 240,
              after: 180,
            },
            alignment: AlignmentType.CENTER,
          },
        },
        heading2: {
          run: {
            font: DOCX_FONT,
            size: DOCX_FONT_SIZE_12,
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: DOCX_LINE_SPACING_1_5,
              before: 220,
              after: 140,
            },
            alignment: AlignmentType.LEFT,
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: DOCX_FONT,
            size: DOCX_FONT_SIZE_12,
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: DOCX_LINE_SPACING_1_5,
              after: 180,
            },
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: DOCX_MARGIN_1_INCH, // 1 pulgada (2.54 cm)
              bottom: DOCX_MARGIN_1_INCH,
              left: DOCX_MARGIN_1_INCH,
              right: DOCX_MARGIN_1_INCH,
            },
          },
        },
        children: [
          // 1. CAJA DE CONTROL DE CALIDAD OFICIAL DE FRIKAZ S.A.S. (3 COLUMNAS)
          tablaCajaCalidad,

          // 2. SUBTÍTULO CON MARCO NORMATIVO COLOMBIANO
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 140, after: 180 },
            children: [
              new TextRun({
                text: 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)',
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '000000',
              }),
              new TextRun({
                text: '\nDecreto Único Reglamentario 1072 de 2015 (Artículos 2.2.4.6.8 y 2.2.4.6.10) · Resolución 0312 de 2019',
                italics: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '444444',
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
                    width: { size: 32, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: 'CARGO ASIGNADO:',
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 68, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: cargo.nombre.toUpperCase(),
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
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
                    width: { size: 32, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: 'NIVEL JERÁRQUICO:',
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 68, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: cargo.nivelNombre,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
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
                    width: { size: 32, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: 'ÁREA O PROCESO:',
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 68, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: cargo.areaProceso,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
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
                    width: { size: 32, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: 'NOMBRE DEL TRABAJADOR:',
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 68, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: nombreTrabajador,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
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
                    width: { size: 32, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: 'NÚMERO DE IDENTIFICACIÓN:',
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 68, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: numeroIdentificacion,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
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
                    width: { size: 32, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: 'FECHA DE ASIGNACIÓN:',
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 68, type: WidthType.PERCENTAGE },
                    borders: tableBorderLight,
                    children: [
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: fechaHoy,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
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
          new Paragraph({ spacing: { line: DOCX_LINE_SPACING_1_5, after: 200 } }),

          // 1. OBJETIVO DE LA ASIGNACIÓN DE RESPONSABILIDADES
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 180, after: 120 },
            children: [
              new TextRun({
                text: '1. OBJETIVO DE LA ASIGNACIÓN DE RESPONSABILIDADES',
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 220 },
            children: [
              new TextRun({
                text: `Establecer, comunicar y formalizar las responsabilidades y compromisos específicos en materia de Seguridad y Salud en el Trabajo para el cargo de `,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: cargo.nombre,
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
              }),
              new TextRun({
                text: ` en FRIKAZ S.A.S., garantizando la prevención de accidentes laborales, enfermedades laborales y la mejora continua de las condiciones laborales en los procesos de producción y comercialización de snacks.`,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
              }),
            ],
          }),

          // 2. DESCRIPCIÓN DE LAS RESPONSABILIDADES ESPECÍFICAS DEL CARGO
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 180, after: 120 },
            children: [
              new TextRun({
                text: '2. RESPONSABILIDADES ESPECÍFICAS DEL CARGO EN MATERIA DE SST',
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '000000',
              }),
            ],
          }),
          ...cargo.responsabilidades.map(
            (resp) =>
              new Paragraph({
                bullet: { level: 0 },
                alignment: AlignmentType.JUSTIFIED,
                spacing: { line: DOCX_LINE_SPACING_1_5, after: 100 },
                children: [
                  new TextRun({
                    text: resp,
                    size: DOCX_FONT_SIZE_12,
                    font: DOCX_FONT,
                  }),
                ],
              })
          ),

          // 3. COMPROMISOS DEL TRABAJADOR FRENTE AL SG-SST
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 200, after: 120 },
            children: [
              new TextRun({
                text: '3. COMPROMISOS DEL TRABAJADOR FRENTE AL SG-SST',
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '000000',
              }),
            ],
          }),
          ...cargo.compromisos.map(
            (comp) =>
              new Paragraph({
                bullet: { level: 0 },
                alignment: AlignmentType.JUSTIFIED,
                spacing: { line: DOCX_LINE_SPACING_1_5, after: 100 },
                children: [
                  new TextRun({
                    text: comp,
                    size: DOCX_FONT_SIZE_12,
                    font: DOCX_FONT,
                  }),
                ],
              })
          ),

          // 4. DECLARACIÓN DE CONOCIMIENTO Y ACEPTACIÓN
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 200, after: 120 },
            children: [
              new TextRun({
                text: '4. DECLARACIÓN DE CONOCIMIENTO Y ACEPTACIÓN',
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 260 },
            children: [
              new TextRun({
                text: 'Yo, en calidad de colaborador(a) de FRIKAZ S.A.S., manifiesto expresamente que he recibido, leído, comprendido y aceptado las responsabilidades y compromisos en Seguridad y Salud en el Trabajo correspondientes a mi cargo. Me comprometo a cumplirlos a cabalidad, acatar los procedimientos seguros de trabajo, hacer uso adecuado y permanente de los elementos de protección personal suministrados, reportar oportunamente cualquier condición o acto inseguro, y participar activamente en las capacitaciones programadas por la empresa.',
                size: DOCX_FONT_SIZE_12,
                italics: true,
                font: DOCX_FONT,
              }),
            ],
          }),

          // 5. ESPACIO PARA FIRMAS
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 180, after: 180 },
            children: [
              new TextRun({
                text: '5. CONSTANCIA DE FIRMAS',
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '000000',
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
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 600, after: 80 },
                        children: [
                          new TextRun({
                            text: '____________________________________________',
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
                        children: [
                          new TextRun({
                            text: 'Firma del trabajador:',
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
                        children: [
                          new TextRun({
                            text: `Nombre completo: ${nombreTrabajador}`,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
                        children: [
                          new TextRun({
                            text: `Documento de identidad: ${numeroIdentificacion}`,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
                        children: [
                          new TextRun({
                            text: `Fecha: ${fechaHoy}`,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
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
                        spacing: { line: DOCX_LINE_SPACING_1_5, before: 600, after: 80 },
                        children: [
                          new TextRun({
                            text: '____________________________________________',
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
                        children: [
                          new TextRun({
                            text: 'Firma del responsable de SST / Empleador:',
                            bold: true,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
                        children: [
                          new TextRun({
                            text: 'Nombre: Coordinador / Vigía de SST',
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
                        children: [
                          new TextRun({
                            text: 'Empresa: FRIKAZ S.A.S.',
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
                        children: [
                          new TextRun({
                            text: `Fecha: ${fechaHoy}`,
                            size: DOCX_FONT_SIZE_12,
                            font: DOCX_FONT,
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

  return doc;
}

export async function exportarResponsabilidadesWord(
  cargo: CargoSST,
  infoTrabajador?: {
    nombreTrabajador?: string;
    numeroIdentificacion?: string;
    fechaAsignacion?: string;
  }
): Promise<void> {
  const logoBytes = await cargarLogoFrikazBytes();
  const doc = construirDocumentoResponsabilidadesDocx(cargo, infoTrabajador, logoBytes);
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

export async function generarResponsabilidadesWordBase64(
  cargo: CargoSST,
  infoTrabajador?: {
    nombreTrabajador?: string;
    numeroIdentificacion?: string;
    fechaAsignacion?: string;
  }
): Promise<{ base64: string; filename: string }> {
  const logoBytes = await cargarLogoFrikazBytes();
  const doc = construirDocumentoResponsabilidadesDocx(cargo, infoTrabajador, logoBytes);
  const base64 = await Packer.toBase64String(doc);
  const cleanCargoName = cargo.nombre
    .replace(/[^\w\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '_');
  const filename = `Asignacion_Responsabilidades_SST_${cleanCargoName}_Frikaz.docx`;
  return { base64, filename };
}

// ============================================================================
// EXPORTADOR WORD (.DOCX) - POLÍTICA DEL SG-SST (FRIKAZ S.A.S.)
// ============================================================================
export function construirDocumentoPoliticaDocx(
  politica: PoliticaSSTData,
  logoBytes?: Uint8Array | null
): Document {
  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fechaCorta = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const tablaCajaCalidad = crearCajaCalidadDocxTable({
    codigo: 'FRK-SST-POL-01',
    fecha: fechaCorta,
    version: politica.versionActual.replace(/[^\d]/g, '') || '02',
    nombreEmpresa: 'Frikaz S.A.S',
    tituloDocumento: 'POLÍTICA INTEGRAL DE SEGURIDAD Y SALUD EN EL TRABAJO',
    tipoDocumento: 'politica',
    logoBytes,
  });

  return new Document({
    creator: 'FRIKAZ S.A.S. - Sistema de Gestión SG-SST',
    title: 'Política de Seguridad y Salud en el Trabajo - Frikaz S.A.S.',
    description: 'Documento oficial de la Política de SST conforme al Decreto 1072 de 2015. Formato formal en Times New Roman 12 pt con Caja de Calidad.',
    styles: {
      default: {
        document: {
          run: {
            font: DOCX_FONT,
            size: DOCX_FONT_SIZE_12,
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: DOCX_LINE_SPACING_1_5,
              after: 180,
            },
            alignment: AlignmentType.JUSTIFIED,
          },
        },
        heading1: {
          run: {
            font: DOCX_FONT,
            size: DOCX_FONT_SIZE_12,
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: DOCX_LINE_SPACING_1_5,
              before: 240,
              after: 180,
            },
            alignment: AlignmentType.CENTER,
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: DOCX_FONT,
            size: DOCX_FONT_SIZE_12,
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: DOCX_LINE_SPACING_1_5,
              after: 180,
            },
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      ],
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
          // CAJA DE CONTROL DE CALIDAD OFICIAL DE FRIKAZ S.A.S. (3 COLUMNAS)
          tablaCajaCalidad,

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 140, after: 180 },
            children: [
              new TextRun({
                text: 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)',
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '000000',
              }),
              new TextRun({
                text: `\nNIT: ${politica.nit} · Planta Bosa Piamonte, Bogotá D.C. · Decreto 1072 de 2015 (Art. 2.2.4.6.5)`,
                italics: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '444444',
              }),
            ],
          }),

          // ESTADO Y VERSIÓN
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 200 },
            children: [
              new TextRun({
                text: `Estado del Documento: ${politica.estado.toUpperCase()} · Versión Vigente: ${politica.versionActual}`,
                italics: true,
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
                color: '000000',
              }),
            ],
          }),

          // TEXTO INTRODUCTORIO
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 200 },
            children: [
              new TextRun({
                text: politica.declaracionIntroductoria,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
              }),
            ],
          }),

          // COMPROMISOS ENUMERADOS
          ...politica.compromisos.flatMap((comp) => [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { line: DOCX_LINE_SPACING_1_5, before: 100, after: 80 },
              children: [
                new TextRun({
                  text: `${comp.id}. `,
                  bold: true,
                  size: DOCX_FONT_SIZE_12,
                  font: DOCX_FONT,
                }),
                new TextRun({
                  text: comp.descripcion,
                  size: DOCX_FONT_SIZE_12,
                  font: DOCX_FONT,
                }),
              ],
            }),
          ]),

          // CIERRE DE COMUNICACIÓN Y REVISIÓN ANUAL
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 200, after: 360 },
            children: [
              new TextRun({
                text: politica.comunicacionRevision,
                size: DOCX_FONT_SIZE_12,
                italics: true,
                font: DOCX_FONT,
              }),
            ],
          }),

          // ESPACIO PARA FIRMA DEL GERENTE GENERAL
          new Paragraph({
            spacing: { line: DOCX_LINE_SPACING_1_5, before: 400, after: 80 },
            children: [
              new TextRun({
                text: 'Firma: __________________________________________________',
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
            children: [
              new TextRun({
                text: `${politica.cargoFirmante}`,
                bold: true,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
            children: [
              new TextRun({
                text: `Empresa: ${politica.empresa} (NIT ${politica.nit})`,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
              }),
            ],
          }),
          new Paragraph({
            spacing: { line: DOCX_LINE_SPACING_1_5, after: 40 },
            children: [
              new TextRun({
                text: `Fecha de emisión y vigencia: ${fechaHoy}`,
                size: DOCX_FONT_SIZE_12,
                font: DOCX_FONT,
              }),
            ],
          }),
        ],
      },
    ],
  });
}

export async function exportarPoliticaWord(politica: PoliticaSSTData): Promise<void> {
  const logoBytes = await cargarLogoFrikazBytes();
  const doc = construirDocumentoPoliticaDocx(politica, logoBytes);
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

export async function generarPoliticaWordBase64(
  politica: PoliticaSSTData
): Promise<{ base64: string; filename: string }> {
  const logoBytes = await cargarLogoFrikazBytes();
  const doc = construirDocumentoPoliticaDocx(politica, logoBytes);
  const base64 = await Packer.toBase64String(doc);
  const filename = `Politica_SST_Frikaz_SAS_${new Date().toISOString().split('T')[0]}.docx`;
  return { base64, filename };
}

