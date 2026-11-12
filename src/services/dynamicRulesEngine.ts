import {
  CaracterizacionEmpresaDinamica,
  ReglaNormativa,
  ResumenEvaluacionImpacto,
  PropuestaCambioNorma,
  RegistroHistorialCambio,
  ModalidadContrato,
  SectorEconomico,
} from '../types/dynamicConfig';
import { NormaPhvaItem } from '../types/phvaEvidence';

export const CONFIGURACION_FRIKAZ_INICIAL: CaracterizacionEmpresaDinamica = {
  modalidadesContrato: ['indefinido', 'fijo'],
  detallesContratos: {
    cantidadIndefinido: 6,
    cantidadFijo: 4,
    cantidadObraLabor: 0,
    cantidadAprendices: 0,
    cantidadServicios: 0,
    cantidadTemporalMision: 0,
    otrasModalidadesTexto: '',
  },
  numeroTrabajadores: 10,
  sectorEconomico: 'secundario',
  ciiuPrincipal: '1089 - Elaboración de otros productos alimenticios n.c.p. (Snacks fritos)',
  actividadEconomicaConcreta:
    'Producción y comercialización de productos fritos tipo snack (papas, plátanos y chicharrones)',
  descripcionCadenaValor:
    'Procesamiento artesanal e industrial de tubérculos y cárnicos: pelado, rebanado, fritura por inmersión continua a >160°C, centrifugado, sazonado y envasado en bolsas termoselladas.',
  claseRiesgoSST: 'Clase II (Bajo)',
  arlNombre: 'Positiva Compañía de Seguros / Sura',
  modalidadTrabajo: 'Presencial en planta',
  procesosProductivos: [
    'Recepción y selección de materias primas',
    'Lavado y pelado mecánico',
    'Rebanado con cuchillas rotativas',
    'Fritura por inmersión en aceite caliente (>160°C)',
    'Desaceitado y sazonado',
    'Pesaje y sellado continuo térmico',
    'Almacenamiento y despacho',
  ],
  maquinariaEquipos: [
    'Freidoras industriales dobles continuas con termostato (>160°C)',
    'Rebanadora rotativa con cuchillas mecánicas',
    'Peladora abrasiva mecánica con agua',
    'Marmita en acero inoxidable para escaldado',
    'Selladora continua de banda térmica con fechador',
    'Campana extractora de humos con trampa de grasas en ducto',
    'Trampa física de retención de grasas en red hidrosanitaria',
  ],
  sustanciasQuimicas: [
    'Aceite vegetal comestible para fritura a altas temperaturas',
    'Gas natural por tubería / GLP para quemadores industriales',
    'Detergente desengrasante alcalino de grado alimenticio',
    'Hipoclorito de sodio y desinfectantes para BPM de alimentos',
  ],
  aspectosAmbientales: [
    'Generación de Aceite de Cocina Usado (ACU): 180 a 250 L/mes',
    'Vertimientos no domésticos de aguas con grasa y sólidos suspendidos',
    'Emisiones de vahos y olores de fritura por ducto vertical',
    'Residuos orgánicos (cáscaras de papa y plátano)',
    'Residuos aprovechables (cajas de cartón y empaques BOPP)',
  ],
  residuosGenerados: [
    'Aceite de Cocina Usado (ACU)',
    'Residuos orgánicos de pelado',
    'Cartón y plástico de embalaje',
    'Residuos peligrosos (envases de desengrasantes, luminarias)',
  ],
  consumoAguaEnergia: {
    fuenteAgua: 'Red de Acueducto de Bogotá (EAAB)',
    consumoEstimadoM3Mes: 45,
    fuenteEnergia: 'Red eléctrica Codensa / Enel 220V trifásica',
    combustibleTermico: 'Gas Natural Vanti (Acometida industrial)',
  },
  permisosAutorizaciones: [
    'Concepto Sanitario Favorable Secretaría Distrital de Salud (Bosa)',
    'Inscripción de Generador de ACU ante la SDA Bogotá (Res. 316/2018)',
    'Certificado de Inspección Técnica de Bomberos Bogotá',
    'Registro Sanitario / Notificación Sanitaria INVIMA para alimentos',
  ],
  sedesInstalaciones: {
    areaM2: 240,
    pisosNiveles: 1,
    trampaGrasasOperativa: true,
    campanaExtractoraFiltros: true,
    direccionPlanta: 'Calle 69A Sur # 80J - 14, Piamonte, Bosa',
    localidad: 'Bosa (Localidad 7)',
    ciudad: 'Bogotá D.C.',
  },
};

const STORAGE_KEY_CONFIG = 'frikaz_caracterizacion_dinamica_v3';
const STORAGE_KEY_HISTORIAL = 'frikaz_historial_caracterizacion_v3';

export function getCaracterizacionActual(): CaracterizacionEmpresaDinamica {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(CONFIGURACION_FRIKAZ_INICIAL));
      return CONFIGURACION_FRIKAZ_INICIAL;
    }
    return { ...CONFIGURACION_FRIKAZ_INICIAL, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error al cargar caracterización dinámica', err);
    return CONFIGURACION_FRIKAZ_INICIAL;
  }
}

export function saveCaracterizacion(config: CaracterizacionEmpresaDinamica): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Error al guardar caracterización dinámica', err);
  }
}

export function getHistorialCambios(): RegistroHistorialCambio[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORIAL);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer historial', err);
    return [];
  }
}

export function registrarEnHistorial(item: RegistroHistorialCambio): void {
  try {
    const actual = getHistorialCambios();
    const actualizado = [item, ...actual].slice(0, 50); // Mantiene últimos 50 registros
    localStorage.setItem(STORAGE_KEY_HISTORIAL, JSON.stringify(actualizado));
  } catch (err) {
    console.error('Error al registrar en historial', err);
  }
}

// ==========================================
// MOTOR DE REGLAS DE APLICABILIDAD COLOMBIANA
// ==========================================

export const REGLAS_NORMATIVAS_COLOMBIA: ReglaNormativa[] = [
  // 1. Estándares Mínimos SG-SST (Res. 0312 de 2019)
  {
    id: 'REG-0312-ESTANDARES',
    normaReferencia: 'Resolución 0312 de 2019',
    disposicionArticulo: 'Capítulos I, II y III (Artículos 3, 9 y 16)',
    area: 'SST',
    fasePhva: 'PLANEAR',
    condicionAplicacion: 'Tamaño de empresa y clase de riesgo laboral ARL',
    datosRequeridos: ['numeroTrabajadores', 'claseRiesgoSST'],
    umbralLegalTexto:
      '<=10 trab. Riesgo I, II, III: 7 Estándares | 11 a 50 trab. Riesgo I, II, III: 21 Estándares | >50 trab. O Riesgo IV/V: 60 Estándares',
    explicacionSencilla:
      'Determina la cantidad de estándares obligatorios que el Ministerio del Trabajo exige implementar y auditar anualmente.',
    fuenteOficial: 'Ministerio del Trabajo / SUIN-Juriscol',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const n = cfg.numeroTrabajadores;
      const esRiesgoAlto =
        cfg.claseRiesgoSST.includes('Clase IV') || cfg.claseRiesgoSST.includes('Clase V');

      if (esRiesgoAlto || n > 50) {
        return {
          resultado: 'MODIFICADA_ALCANCE',
          explicacion: `Con ${n} trabajadores o Clase de Riesgo IV/V, aplican los 60 Estándares Mínimos completos de la Resolución 0312/2019 (Capítulo III). Se requiere plan anual ampliado, auditoría externa y profesional con posgrado en SST.`,
          requiereRevisionHumana: true,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 0312 de 2019 - Capítulo III: Exigibilidad de los 60 Estándares Mínimos del SG-SST para empresas de más de 50 trabajadores o en clases de riesgo IV y V.`,
            nuevaImportancia: `Para Frikaz S.A.S. con ${n} trabajadores y ${cfg.claseRiesgoSST}, es mandatorio implementar los 60 estándares, requiriendo mediciones higiénicas, profesiogramas detallados y auditoría formal anual.`,
            nuevaAplicabilidad: `Contratar profesional en SST con licencia y curso 50h, realizar autoevaluación en plataforma MinTrabajo y registrar plan de mejoramiento.`,
            nuevaEvidencia: `Tabla de autoevaluación de los 60 Estándares firmada con radicado ante ARL y Ministerio del Trabajo.`,
          },
        };
      }

      if (n >= 11 && n <= 50) {
        return {
          resultado: 'MODIFICADA_ALCANCE',
          explicacion: `Al tener ${n} trabajadores en ${cfg.claseRiesgoSST}, Frikaz S.A.S. escala de 7 a 21 Estándares Mínimos (Capítulo II de la Res. 0312/2019).`,
          requiereRevisionHumana: true,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 0312 de 2019 - Capítulo II: 21 Estándares Mínimos para empresas de 11 a 50 trabajadores clasificadas en riesgo I, II o III.`,
            nuevaImportancia: `Con ${n} trabajadores, Frikaz S.A.S. pasa automáticamente de 7 a 21 estándares exigibles. Se incorporan obligaciones de evaluaciones médicas periódicas obligatorias, investigación de incidentes con COPASST y plan de capacitación formal.`,
            nuevaAplicabilidad: `Actualizar la matriz de estándares mínimos a 21 ítems, validar perfil del responsable del SG-SST (mínimo tecnólogo con licencia y curso 50h) y radicar informe anual en diciembre.`,
            nuevaEvidencia: `Evaluación de los 21 estándares mínimos en formato oficial del MinTrabajo con soportes y plan de trabajo anual.`,
          },
        };
      }

      return {
        resultado: 'APLICABLE',
        explicacion: `Con ${n} trabajadores en ${cfg.claseRiesgoSST}, aplican los 7 Estándares Mínimos del Capítulo I de la Res. 0312/2019 para microempresas.`,
        requiereRevisionHumana: false,
        cambiosPropuestos: {
          nuevaDescripcion: `Resolución 0312 de 2019 - Capítulo I: 7 Estándares Mínimos para unidades de 10 o menos trabajadores en clases de riesgo I, II o III.`,
          nuevaImportancia: `Para los ${n} colaboradores de Frikaz S.A.S., se garantiza el cumplimiento normativo esencial optimizando recursos administrativos sin descuidar la protección física.`,
          nuevaAplicabilidad: `Mantener actualizados los 7 estándares: asignación responsable, afiliación a seguridad social, plan de trabajo anual, capacitaciones, evaluaciones médicas, identificación de peligros y medidas preventivas.`,
          nuevaEvidencia: `Acta de autoevaluación anual de 7 estándares con soportes documentales y reporte a la ARL.`,
        },
      };
    },
  },

  // 2. Participación en SST: COPASST vs Vigía de SST
  {
    id: 'REG-PARTICIPACION-COPASST-VIGIA',
    normaReferencia: 'Resolución 2013 de 1986 / Decreto 1072 de 2015 Art. 2.2.4.6.2',
    disposicionArticulo: 'Resolución 2013/1986 Art. 1 y 2 | Dec 1072/2015 Art. 2.2.4.6.2 y 2.2.4.6.8',
    area: 'SST',
    fasePhva: 'HACER',
    condicionAplicacion: 'Número total de trabajadores vinculados',
    datosRequeridos: ['numeroTrabajadores'],
    umbralLegalTexto:
      '<=9 trabajadores: Vigía de SST | >=10 trabajadores: Comité Paritario de SST (COPASST con 1 representante por parte de 10 a 49 trab.)',
    explicacionSencilla:
      'Define si la empresa debe elegir un Vigía de SST o conformar un Comité Paritario (COPASST) con representantes electos por votación.',
    fuenteOficial: 'Ministerio del Trabajo / Presidencia de la República',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const n = cfg.numeroTrabajadores;
      if (n >= 10) {
        return {
          resultado: 'APLICABLE',
          explicacion: `Al tener ${n} trabajadores (umbral legal >= 10), la ley exige conformación obligatoria del COPASST (Comité Paritario de Seguridad y Salud en el Trabajo) con mínimo 1 representante principal y 1 suplente por el empleador, y 1 principal y 1 suplente electo democráticamente por los trabajadores (total 4 integrantes).`,
          requiereRevisionHumana: true,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 2013 de 1986 y Decreto 1072 de 2015: Conformación, funcionamiento y actas mensuales del Comité Paritario de Seguridad y Salud en el Trabajo (COPASST).`,
            nuevaImportancia: `Para Frikaz S.A.S. con ${n} trabajadores, es obligatorio tener COPASST activo. Canaliza la participación laboral en inspecciones locativas a freidoras, investigación de incidentes y propuesta de mejoras.`,
            nuevaAplicabilidad: `Convocar elecciones democráticas de trabajadores, emitir acta de designación del empleador, realizar posesión por 2 años y sostener reuniones mensuales obligatorias (mínimo 4 horas semanales de dedicación).`,
            nuevaEvidencia: `Acta de conformación y escrutinio del COPASST, resolución de designación patronal y carpetas con 12 actas mensuales de reunión firmadas.`,
          },
        };
      } else {
        return {
          resultado: 'MODIFICADA_ALCANCE',
          explicacion: `Al tener ${n} trabajadores (< 10 trabajadores), la ley colombiana exonera de constituir COPASST y exige en su lugar la designación de un Vigía de Seguridad y Salud en el Trabajo nombrado por la gerencia.`,
          requiereRevisionHumana: false,
          cambiosPropuestos: {
            nuevaDescripcion: `Decreto 1072 de 2015 (Art. 2.2.4.6.2): Designación, funciones y registro de gestión del Vigía de Seguridad y Salud en el Trabajo para empresas de menos de 10 trabajadores.`,
            nuevaImportancia: `Para los ${n} trabajadores de Frikaz S.A.S., el Vigía sustituye legalmente al COPASST, realizando inspecciones a freidoras y maquinaria sin la carga de votaciones paritarias.`,
            nuevaAplicabilidad: `Designar formalmente al Vigía mediante comunicación escrita, brindarle capacitación de 50 horas y registrar sus recorridos mensuales de inspección.`,
            nuevaEvidencia: `Carta formal de designación del Vigía de SST, constancia de capacitación y actas de inspección trimestrales/mensuales.`,
          },
        };
      }
    },
  },

  // 3. Comité de Convivencia Laboral (Res. 652 de 2012 y Res. 1356 de 2012)
  {
    id: 'REG-CONVIVENCIA-LABORAL',
    normaReferencia: 'Resolución 652 de 2012 / Resolución 1356 de 2012',
    disposicionArticulo: 'Resolución 1356/2012 Art. 1 (modifica Art. 3 de Res. 652/2012)',
    area: 'SST',
    fasePhva: 'HACER',
    condicionAplicacion: 'Número de trabajadores',
    datosRequeridos: ['numeroTrabajadores'],
    umbralLegalTexto:
      '<=10 trabajadores: 2 miembros (1 empleador, 1 trabajadores) | 11 a 50 trabajadores: 4 miembros (2 empleador, 2 trabajadores)',
    explicacionSencilla:
      'Regula el tamaño y composición del Comité de Convivencia Laboral para prevención del acoso laboral.',
    fuenteOficial: 'Ministerio del Trabajo',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const n = cfg.numeroTrabajadores;
      if (n > 10) {
        return {
          resultado: 'MODIFICADA_ALCANCE',
          explicacion: `Con ${n} trabajadores, el Comité de Convivencia Laboral debe conformarse por 4 miembros (2 representantes del empleador con sus suplentes, y 2 de los trabajadores con sus suplentes). Ya no basta con 2 miembros.`,
          requiereRevisionHumana: true,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 652 de 2012 y 1356 de 2012: Conformación ampliada a 4 miembros del Comité de Convivencia Laboral (empresas de 11 a 50 trabajadores).`,
            nuevaImportancia: `Para Frikaz S.A.S. con ${n} colaboradores, el comité debe ampliar sus integrantes para prevenir quejas de acoso laboral e intervenir el riesgo psicosocial de turnos de fritura.`,
            nuevaAplicabilidad: `Abrir proceso de elección para 2 representantes principales de trabajadores y designar 2 representantes de la gerencia, sesionando mínimo cada trimestre.`,
            nuevaEvidencia: `Acta de votación de 4 miembros del Comité de Convivencia y actas de sesión trimestral ordinaria.`,
          },
        };
      } else {
        return {
          resultado: 'APLICABLE',
          explicacion: `Con ${n} trabajadores (<=10), el Comité de Convivencia Laboral se compone por 2 miembros (1 representante del empleador y 1 de los trabajadores con sus respectivos suplentes).`,
          requiereRevisionHumana: false,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 652 de 2012 y 1356 de 2012: Comité de Convivencia Laboral simplificado (2 miembros) para empresas de hasta 10 trabajadores.`,
            nuevaImportancia: `Garantiza en Frikaz S.A.S. el procedimiento confidencial ante quejas de acoso laboral cumpliendo el estándar legal proporcionado al tamaño de la planta.`,
            nuevaAplicabilidad: `Mantener vigente el periodo de 2 años de los 2 miembros elegidos y archivar actas trimestrales con reserva legal.`,
            nuevaEvidencia: `Acta de conformación de 2 miembros y actas trimestrales de no existencia de quejas o trámite confidencial.`,
          },
        };
      }
    },
  },

  // 4. Modalidad de Contrato: Aprendices SENA (Ley 789 de 2002)
  {
    id: 'REG-CONTRATO-APRENDIZAJE',
    normaReferencia: 'Ley 789 de 2002 / Decreto 1072 de 2015 Art. 2.2.6.3.1',
    disposicionArticulo: 'Ley 789/2002 Art. 30 y Decreto 1072/2015',
    area: 'SST',
    fasePhva: 'HACER',
    condicionAplicacion: 'Presencia de aprendices SENA o pasantes técnicos',
    datosRequeridos: ['modalidadesContrato'],
    umbralLegalTexto:
      'Aplica si la empresa vincula estudiantes en etapa lectiva o práctica mediante contrato de aprendizaje',
    explicacionSencilla:
      'Exige afiliación a ARL en etapa práctica, prohíbe exponer a aprendices menores a labores peligrosas y exige dotación/inducción.',
    fuenteOficial: 'Ministerio del Trabajo / SENA',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const tieneAprendices = cfg.modalidadesContrato.includes('aprendizaje');
      if (tieneAprendices) {
        return {
          resultado: 'APLICABLE',
          explicacion: `Se registró modalidad de Contrato de Aprendizaje. La empresa patrocinadora Frikaz S.A.S. tiene la obligación legal de afiliar al aprendiz a ARL (tarifa riesgo de la empresa) en etapa práctica, expedir EPP idéntico a los trabajadores y prohibir estrictamente que aprendices menores de edad operen freidoras a >160°C o rebanadoras de corte mecánico.`,
          requiereRevisionHumana: true,
          cambiosPropuestos: {
            nuevaDescripcion: `Ley 789 de 2002 y Decreto 1072 de 2015: Protección en SST y afiliación a ARL para aprendices SENA en etapa práctica.`,
            nuevaImportancia: `Crucial para Frikaz S.A.S.: evita sanciones graves del MinTrabajo por riesgos laborales en aprendices en áreas calientes o con maquinaria rotativa.`,
            nuevaAplicabilidad: `Registrar en planilla PILA aportes a ARL del aprendiz, realizar inducción completa de seguridad de 2 días y certificar entrega de dotación sanitaria y EPP térmico.`,
            nuevaEvidencia: `Contrato de aprendizaje firmado, certificación de afiliación activa a ARL y formato de inducción en SST firmada por el aprendiz.`,
          },
        };
      } else {
        return {
          resultado: 'NO_APLICABLE',
          explicacion: `Actualmente la empresa no tiene vinculados aprendices bajo contrato de aprendizaje. La obligación permanece en seguimiento normativo.`,
          requiereRevisionHumana: false,
          cambiosPropuestos: {
            nuevaDescripcion: `Disposición de aprendices en reserva: Frikaz S.A.S. no cuenta con aprendices vinculados en el periodo actual.`,
          },
        };
      }
    },
  },

  // 5. Modalidad: Prestación de Servicios (Decreto 723 de 2013 / Dec 1072 de 2015)
  {
    id: 'REG-PRESTACION-SERVICIOS',
    normaReferencia: 'Decreto 723 de 2013 / Decreto 1072 de 2015 Art. 2.2.4.2.2.1',
    disposicionArticulo: 'Decreto 723 de 2013 Art. 2, 4 y 6',
    area: 'SST',
    fasePhva: 'HACER',
    condicionAplicacion: 'Presencia de contratistas independientes o por prestación de servicios',
    datosRequeridos: ['modalidadesContrato'],
    umbralLegalTexto: 'Aplica a contratos de prestación de servicios civiles o comerciales',
    explicacionSencilla:
      'Verificación previa de afiliación y pago de aportes a ARL, EPS y Pensión como requisito para autorizar ingreso a planta y pagos.',
    fuenteOficial: 'Ministerio del Trabajo / Presidencia',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const tieneServicios = cfg.modalidadesContrato.includes('servicios');
      if (tieneServicios) {
        return {
          resultado: 'APLICABLE',
          explicacion: `Al vincular contratistas por prestación de servicios, Frikaz S.A.S. debe verificar mensualmente el pago de seguridad social (PILA), realizar inducción de peligros en planta de fritura y coordinar la cobertura de ARL según la clase de riesgo de la labor (riesgo I a V).`,
          requiereRevisionHumana: true,
          cambiosPropuestos: {
            nuevaDescripcion: `Decreto 723 de 2013 y Dec. 1072/2015: Gestión de contratistas independientes, verificación de afiliación al Sistema de Riesgos Laborales e inducción en planta.`,
            nuevaImportancia: `Para Frikaz S.A.S., evita responsabilidad solidaria ante accidentes de contratistas de mantenimiento de freidoras o distribuidores independientes.`,
            nuevaAplicabilidad: `Exigir planilla PILA con aportes a ARL/Salud antes del ingreso a la fábrica y antes de aprobar cuentas de cobro, así como inducción locativa y permiso para trabajos calientes.`,
            nuevaEvidencia: `Carpetas de contratistas con soportes mensuales de pago PILA a ARL, planilla de inducción y permisos de trabajo en freidoras.`,
          },
        };
      } else {
        return {
          resultado: 'NO_APLICABLE',
          explicacion: `No se registran contratistas independientes de prestación de servicios en la operación habitual.`,
          requiereRevisionHumana: false,
        };
      }
    },
  },

  // 6. Sector Secundario / Alimentos: Buenas Prácticas de Manufactura (Res. 2674 de 2013)
  {
    id: 'REG-ALIMENTOS-BPM-2674',
    normaReferencia: 'Resolución 2674 de 2013',
    disposicionArticulo: 'Capítulos II, III y VIII (Manipulación, edificación y salud del personal)',
    area: 'INTEGRAL',
    fasePhva: 'HACER',
    condicionAplicacion: 'Sector secundario agroindustrial / elaboración de alimentos para consumo humano',
    datosRequeridos: ['sectorEconomico', 'ciiuPrincipal'],
    umbralLegalTexto:
      'Obligatorio para toda planta de fabricación, procesamiento, envase y almacenamiento de alimentos en Colombia',
    explicacionSencilla:
      'Exige certificación médica para manipular alimentos (frotis de garganta, coprológico, KOH), indumentaria sanitaria blanca, cofia y capacitación continua en inocuidad alimentaria.',
    fuenteOficial: 'Ministerio de Salud y Protección Social / INVIMA',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const esAlimentos =
        cfg.sectorEconomico === 'secundario' &&
        (cfg.ciiuPrincipal.includes('1089') ||
          cfg.actividadEconomicaConcreta.toLowerCase().includes('snack') ||
          cfg.actividadEconomicaConcreta.toLowerCase().includes('alimento'));

      if (esAlimentos) {
        return {
          resultado: 'APLICABLE',
          explicacion: `Por operar en el Sector Secundario de manufactura de snacks fritos alimenticios (CIIU 1089), aplica plenamente la Resolución 2674/2013. Todo el personal manipulador debe contar con certificado médico de aptitud sanitaria anual y carné de manipulación con mínimo 10 horas de capacitación.`,
          requiereRevisionHumana: false,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 2674 de 2013: Requisitos sanitarios, Buenas Prácticas de Manufactura (BPM) e higiene del personal para fabricación de snacks fritos.`,
            nuevaImportancia: `Es la licencia operativa fundamental de Frikaz S.A.S. ante el INVIMA y la Secretaría de Salud de Bosa. Su incumplimiento genera clausura inmediata de la planta.`,
            nuevaAplicabilidad: `Realizar exámenes clínicos paraclínicos a los ${cfg.numeroTrabajadores} operarios, suministrar dotación blanca sin botones ni bolsillos superiores, cofia y tapabocas, y llevar registros de limpieza y desinfección diarios.`,
            nuevaEvidencia: `Certificados de aptitud médica para manipulación de alimentos de los trabajadores, plan de capacitación en inocuidad y planilla de inspección sanitaria de planta.`,
          },
        };
      } else {
        return {
          resultado: 'REQUIERE_REVISION',
          explicacion: `El sector económico o CIIU actual no corresponde típicamente a manufactura de alimentos. Se requiere validar si la planta continúa procesando comestibles.`,
          requiereRevisionHumana: true,
          informacionPendiente:
            'Verificar si se elaboran alimentos para consumo humano bajo el nuevo sector seleccionado.',
        };
      }
    },
  },

  // 7. Aspecto Ambiental: Aceite de Cocina Usado - ACU (Res. 316 de 2018)
  {
    id: 'REG-AMBIENTAL-ACU-316',
    normaReferencia: 'Resolución 316 de 2018',
    disposicionArticulo: 'Artículos 6, 7 y 8 (Obligaciones de los generadores industriales y comerciales)',
    area: 'AMBIENTAL',
    fasePhva: 'VERIFICAR',
    condicionAplicacion: 'Generación de Aceite de Cocina Usado en procesos de fritura',
    datosRequeridos: ['maquinariaEquipos', 'aspectosAmbientales'],
    umbralLegalTexto:
      'Generadores industriales/comerciales que utilicen aceites vegetales para freír alimentos',
    explicacionSencilla:
      'Inscripción ante la Secretaría Distrital de Ambiente (SDA), prohibición de vertimiento al alcantarillado o basura, almacenamiento en canecas rotuladas y entrega exclusiva a gestor autorizado con certificado.',
    fuenteOficial: 'Ministerio de Ambiente y Desarrollo Sostenible / SDA Bogotá',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const tieneFreidoras = cfg.maquinariaEquipos.some((m) =>
        m.toLowerCase().includes('freidora')
      );
      const generaACU = cfg.aspectosAmbientales.some((a) =>
        a.toLowerCase().includes('aceite de cocina usado') || a.toLowerCase().includes('acu')
      );

      if (tieneFreidoras || generaACU) {
        return {
          resultado: 'APLICABLE',
          explicacion: `Al operar freidoras industriales continuas y generar entre 180 y 250 L/mes de ACU, Frikaz S.A.S. está catalogada como Generador Comercial/Industrial ante la SDA Bogotá bajo Resolución 316/2018.`,
          requiereRevisionHumana: false,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 316 de 2018: Gestión ambientalmente adecuada de Aceites de Cocina Usados (ACU) en establecimientos de fritura industrial.`,
            nuevaImportancia: `Evita contaminación de cuerpos hídricos de la cuenca Tunjuelo/Bogotá y sanciones ambientales de la SDA de hasta 5.000 SMLMV por vertimiento ilegal.`,
            nuevaAplicabilidad: `Mantener registro vigente ante la SDA, almacenar en canecas azules rotuladas sobre estibas con contención, llevar planilla de balance de masa y entregar únicamente a gestor con licencia ambiental.`,
            nuevaEvidencia: `Certificados de recolección de ACU expedidos por gestor autorizado por la SDA con volúmenes en kilogramos/litros y constancia de reporte anual ante el aplicativo web de la autoridad.`,
          },
        };
      } else {
        return {
          resultado: 'REQUIERE_REVISION',
          explicacion: `No se identificaron freidoras ni generación de ACU en los parámetros actuales. Confirmar si la planta no utiliza aceites vegetales de fritura.`,
          requiereRevisionHumana: true,
          informacionPendiente:
            'Indicar si se eliminaron los procesos térmicos de fritura con aceite vegetal.',
        };
      }
    },
  },

  // 8. Vertimientos No Domésticos y Trampa de Grasas (Res. 0631 de 2015)
  {
    id: 'REG-VERTIMIENTOS-0631',
    normaReferencia: 'Resolución 0631 de 2015',
    disposicionArticulo: 'Capítulo VI (Parámetros para actividades de elaboración de alimentos)',
    area: 'AMBIENTAL',
    fasePhva: 'HACER',
    condicionAplicacion: 'Descarga de aguas residuales no domésticas a la red de alcantarillado',
    datosRequeridos: ['sedesInstalaciones', 'aspectosAmbientales'],
    umbralLegalTexto:
      'Límites máximos permisibles de Grasas y Aceites (GyA), DBO, DQO y sólidos suspendidos en vertimientos de alimentos',
    explicacionSencilla:
      'Exige trampa física de grasas en funcionamiento, plan de mantenimiento periódico y caracterización de aguas si la autoridad ambiental lo requiere.',
    fuenteOficial: 'Ministerio de Ambiente y Desarrollo Sostenible',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const tieneTrampa = cfg.sedesInstalaciones.trampaGrasasOperativa;
      if (tieneTrampa) {
        return {
          resultado: 'APLICABLE',
          explicacion: `Frikaz S.A.S. cuenta con trampa física de grasas instalada. La Resolución 0631/2015 le exige asegurar que el vertimiento a la red de alcantarillado de la EAAB no supere los límites permisibles de grasas y aceites (GyA) mediante bitácora de desengrase y retiro quincenal de natas.`,
          requiereRevisionHumana: false,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 0631 de 2015: Parámetros y valores límites máximos permisibles en vertimientos puntuales a cuerpos de aguas superficiales y alcantarillado público.`,
            nuevaImportancia: `Protege las redes hidrosanitarias de Bosa contra taponamientos por grasas solidificadas y cumple los requerimientos de la EAAB y la SDA.`,
            nuevaAplicabilidad: `Ejecutar limpieza quincenal de la trampa de grasas, disponer los lodos grasosos con gestor autorizado (no al inodoro/lavaplatos) y registrar fechas en la bitácora ambiental.`,
            nuevaEvidencia: `Bitácora de limpieza de trampa de grasas con firmas del operario y certificados de disposición final de natas grasas.`,
          },
        };
      } else {
        return {
          resultado: 'PENDIENTE_INFORMACION',
          explicacion: `ALERTA: Se indicó que la trampa de grasas NO está operativa o no está registrada. Se generará incumplimiento inmediato de la Res. 0631/2015 al verter aguas de lavado de tubérculos y freidoras al alcantarillado.`,
          requiereRevisionHumana: true,
          informacionPendiente:
            'Instalar o poner en marcha de manera urgente la trampa de grasas en la línea de efluentes de producción.',
        };
      }
    },
  },

  // 9. Emisiones Atmosféricas y Vahos de Fritura (Res. 909 de 2008)
  {
    id: 'REG-EMISIONES-909',
    normaReferencia: 'Resolución 909 de 2008 / Decreto 1076 de 2015',
    disposicionArticulo: 'Capítulo IV y V (Estándares para fuentes fijas de combustión y cocción)',
    area: 'AMBIENTAL',
    fasePhva: 'VERIFICAR',
    condicionAplicacion: 'Operación de ductos de extracción de humos y quemadores a gas',
    datosRequeridos: ['sedesInstalaciones', 'consumoAguaEnergia'],
    umbralLegalTexto:
      'Ductos de extracción vertical por encima de caballete de cubierta con filtros de retención de grasa',
    explicacionSencilla:
      'Regula la dispersión de olores ofensivos, vahos grasos y gases de combustión de los quemadores para no afectar a la comunidad residencial colindante de Bosa Piamonte.',
    fuenteOficial: 'Ministerio de Ambiente y Desarrollo Sostenible / SDA',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const tieneCampana = cfg.sedesInstalaciones.campanaExtractoraFiltros;
      if (tieneCampana) {
        return {
          resultado: 'APLICABLE',
          explicacion: `La campana extractora y ducto vertical sobre cubierta mitigan las emisiones de olores y vahos hacia las viviendas vecinas de Bosa Piamonte. Se requiere mantenimiento y desengrase mensual de filtros metálicos.`,
          requiereRevisionHumana: false,
          cambiosPropuestos: {
            nuevaDescripcion: `Resolución 909 de 2008: Control de emisiones atmosféricas y ductos de dispersión en fuentes fijas de cocción y combustión de gas.`,
            nuevaImportancia: `Evita querellas ciudadanas ante la Alcaldía Local de Bosa por olores molestos de fritura de chicharrón y garantiza tiro adecuado de los gases quemados.`,
            nuevaAplicabilidad: `Limpiar los filtros metálicos de la campana cada 15 días e inspeccionar el ducto vertical y extractor centrífugo semestralmente.`,
            nuevaEvidencia: `Registro de mantenimiento preventivo del sistema de extracción de vapores y certificado de lavado de ductos.`,
          },
        };
      } else {
        return {
          resultado: 'REQUIERE_REVISION',
          explicacion: `Campana de extracción sin filtros o inoperativa. Riesgo severo de acumulación de grasa inflamable en ductos y quejas vecinales por olores.`,
          requiereRevisionHumana: true,
          informacionPendiente:
            'Confirmar estado de filtros y altura técnica del ducto vertical sobre la cubierta.',
        };
      }
    },
  },

  // 10. Seguridad Contra Incendios y Extintores Clase K (NTC 2885 / NFPA 10 / Res. 2400 de 1979)
  {
    id: 'REG-EXTINTORES-CLASE-K',
    normaReferencia: 'NTC 2885 / NFPA 10 / Resolución 2400 de 1979',
    disposicionArticulo: 'NTC 2885 Numeral 5.5 (Fuegos en artefactos de cocina con aceites vegetales)',
    area: 'SST',
    fasePhva: 'HACER',
    condicionAplicacion: 'Presencia de freidoras industriales con aceite caliente >160°C',
    datosRequeridos: ['maquinariaEquipos'],
    umbralLegalTexto:
      'Obligatoriedad de extintores de acetato de potasio (Clase K) ubicados a menos de 9 metros de artefactos de fritura',
    explicacionSencilla:
      'Prohíbe usar agua o extintores comunes de polvo ABC sobre freidoras calientes (causan explosión por evaporación súbita de agua). Exige extintor Clase K específico.',
    fuenteOficial: 'Cuerpo Oficial de Bomberos de Bogotá / ICONTEC',
    fechaVerificacion: '2026-03-15',
    evaluar: (cfg) => {
      const tieneFreidoras = cfg.maquinariaEquipos.some((m) =>
        m.toLowerCase().includes('freidora')
      );
      if (tieneFreidoras) {
        return {
          resultado: 'APLICABLE',
          explicacion: `Al operar freidoras con aceite vegetal a más de 160°C, Frikaz S.A.S. está obligada a contar con extintor Clase K cargado con acetato de potasio a menos de 9 metros, termostato de corte y brigada capacitada en no arrojar agua a la tina.`,
          requiereRevisionHumana: false,
          cambiosPropuestos: {
            nuevaDescripcion: `NTC 2885 y Resolución 2400 de 1979: Protección contra incendios en cocinas industriales y extintores portátiles Clase K.`,
            nuevaImportancia: `Vital para salvaguardar la vida de los operarios de planta: el aceite vegetal caliente arde a más de 300°C y el uso indebido de agua generaría una bola de fuego explosiva.`,
            nuevaAplicabilidad: `Mantener el extintor Clase K de 6 litros señalizado, con inspección mensual de manómetro y recarga anual certificada por empresa acreditada por Bomberos.`,
            nuevaEvidencia: `Ficha técnica del extintor Clase K, hoja de vida del equipo con inspecciones mensuales y certificado de recarga vigente con anillo de verificación.`,
          },
        };
      } else {
        return {
          resultado: 'MODIFICADA_ALCANCE',
          explicacion: `Sin freidoras industriales, se requeriría únicamente extintor convencional Solkaflam / Polvo Químico Seco ABC para oficinas y embalaje.`,
          requiereRevisionHumana: true,
        };
      }
    },
  },
];

// ==========================================
// FUNCIÓN PRINCIPAL DE EVALUACIÓN DE IMPACTO
// ==========================================

export function evaluarImpactoCambio(
  configAnterior: CaracterizacionEmpresaDinamica,
  configNueva: CaracterizacionEmpresaDinamica,
  normasActuales: NormaPhvaItem[],
  usuario: string = 'Auditor SG-SST Frikaz'
): ResumenEvaluacionImpacto {
  const timestamp = new Date().toISOString();

  // 1. Detectar variables modificadas
  const diferencias: string[] = [];
  if (configAnterior.numeroTrabajadores !== configNueva.numeroTrabajadores) {
    diferencias.push(
      `Cantidad de trabajadores: ${configAnterior.numeroTrabajadores} → ${configNueva.numeroTrabajadores}`
    );
  }
  if (
    JSON.stringify(configAnterior.modalidadesContrato) !==
    JSON.stringify(configNueva.modalidadesContrato)
  ) {
    diferencias.push(
      `Modalidades de contrato: [${configAnterior.modalidadesContrato.join(', ')}] → [${configNueva.modalidadesContrato.join(', ')}]`
    );
  }
  if (configAnterior.sectorEconomico !== configNueva.sectorEconomico) {
    diferencias.push(
      `Sector económico: ${configAnterior.sectorEconomico} → ${configNueva.sectorEconomico}`
    );
  }
  if (configAnterior.claseRiesgoSST !== configNueva.claseRiesgoSST) {
    diferencias.push(
      `Clase de riesgo ARL: ${configAnterior.claseRiesgoSST} → ${configNueva.claseRiesgoSST}`
    );
  }
  if (configAnterior.ciiuPrincipal !== configNueva.ciiuPrincipal) {
    diferencias.push(`Código CIIU: ${configAnterior.ciiuPrincipal} → ${configNueva.ciiuPrincipal}`);
  }
  if (
    configAnterior.maquinariaEquipos.length !== configNueva.maquinariaEquipos.length ||
    JSON.stringify(configAnterior.maquinariaEquipos) !==
      JSON.stringify(configNueva.maquinariaEquipos)
  ) {
    diferencias.push(
      `Maquinaria y equipos: ${configNueva.maquinariaEquipos.length} elementos configurados`
    );
  }
  if (
    configAnterior.sustanciasQuimicas.length !== configNueva.sustanciasQuimicas.length ||
    JSON.stringify(configAnterior.sustanciasQuimicas) !==
      JSON.stringify(configNueva.sustanciasQuimicas)
  ) {
    diferencias.push(
      `Sustancias químicas: ${configNueva.sustanciasQuimicas.length} productos registrados`
    );
  }

  const variableModificada = diferencias.length > 0 ? diferencias.join(' | ') : 'Sin cambios';

  // 2. Ejecutar motor de reglas sobre la configuración nueva
  const propuestasGeneradas: PropuestaCambioNorma[] = [];
  const normasNuevasAplicables: PropuestaCambioNorma[] = [];
  const normasParaRevisar: PropuestaCambioNorma[] = [];
  const normasSinCambios: PropuestaCambioNorma[] = [];
  const obligacionesModificadas: PropuestaCambioNorma[] = [];
  const evidenciasAjustar: PropuestaCambioNorma[] = [];
  const datosPendientes: PropuestaCambioNorma[] = [];

  REGLAS_NORMATIVAS_COLOMBIA.forEach((regla) => {
    const evaluacionAnterior = regla.evaluar(configAnterior);
    const evaluacionNueva = regla.evaluar(configNueva);

    // Buscar si existe en la matriz de 74 normas
    const normaEnMatriz = normasActuales.find(
      (n) =>
        n.normaOficial.toLowerCase().includes(regla.normaReferencia.toLowerCase().split(' ')[0]) ||
        n.descripcion.toLowerCase().includes(regla.normaReferencia.toLowerCase().split(' ')[0])
    );

    const normaId = normaEnMatriz ? normaEnMatriz.id : `prop-${regla.id}`;
    const articulos = normaEnMatriz ? normaEnMatriz.articulos : regla.disposicionArticulo;

    let categoriaAlerta: PropuestaCambioNorma['categoriaAlerta'] = 'SIN_CAMBIOS';
    let motivo = '';

    if (evaluacionNueva.resultado === 'PENDIENTE_INFORMACION') {
      categoriaAlerta = 'INFORMACION_PENDIENTE';
      motivo = `Falta información técnica: ${evaluacionNueva.informacionPendiente || 'Revisar datos requeridos'}`;
    } else if (evaluacionAnterior.resultado !== evaluacionNueva.resultado) {
      if (
        evaluacionAnterior.resultado === 'NO_APLICABLE' &&
        evaluacionNueva.resultado === 'APLICABLE'
      ) {
        categoriaAlerta = 'NORMA_NUEVA_APLICABLE';
        motivo = `Nueva disposición legal aplicable activada por los cambios empresariales`;
      } else if (evaluacionNueva.resultado === 'MODIFICADA_ALCANCE') {
        categoriaAlerta = 'OBLIGACION_MODIFICADA';
        motivo = `El alcance de la obligación cambió por umbral o nueva condición legal`;
      } else if (evaluacionNueva.requiereRevisionHumana) {
        categoriaAlerta = 'REVISION_APLICABILIDAD';
        motivo = `Requiere criterio del auditor SG-SST para validar evidencia específica`;
      }
    } else if (evaluacionNueva.requiereRevisionHumana) {
      categoriaAlerta = 'REVISION_APLICABILIDAD';
      motivo = `Condición legal sensible que amerita confirmación de cumplimiento`;
    } else {
      categoriaAlerta = 'SIN_CAMBIOS';
      motivo = `La norma conserva su aplicabilidad verificada sin alteraciones`;
    }

    const propuesta: PropuestaCambioNorma = {
      id: `prop-${regla.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      normaId,
      normaOficial: regla.normaReferencia,
      articulos,
      area: regla.area,
      fasePhva: regla.fasePhva,
      categoriaAlerta,
      motivoAlerta: motivo,
      justificacionLegal: `${regla.disposicionArticulo}. ${regla.umbralLegalTexto}. ${evaluacionNueva.explicacion}`,
      valorAnteriorTexto: evaluacionAnterior.explicacion,
      valorPropuestoTexto: evaluacionNueva.explicacion,
      estadoPropuesta: 'PENDIENTE',
    };

    propuestasGeneradas.push(propuesta);

    if (categoriaAlerta === 'NORMA_NUEVA_APLICABLE') {
      normasNuevasAplicables.push(propuesta);
    } else if (categoriaAlerta === 'REVISION_APLICABILIDAD') {
      normasParaRevisar.push(propuesta);
    } else if (categoriaAlerta === 'OBLIGACION_MODIFICADA') {
      obligacionesModificadas.push(propuesta);
      evidenciasAjustar.push(propuesta);
    } else if (categoriaAlerta === 'INFORMACION_PENDIENTE') {
      datosPendientes.push(propuesta);
    } else {
      normasSinCambios.push(propuesta);
    }
  });

  const totalAfectadas =
    normasNuevasAplicables.length +
    normasParaRevisar.length +
    obligacionesModificadas.length +
    datosPendientes.length;

  // 3. Generar Resumen Ejecutivo dinámico exigido por la especificación
  let resumenEjecutivo = '';
  if (configAnterior.numeroTrabajadores !== configNueva.numeroTrabajadores) {
    resumenEjecutivo = `Se actualizó la cantidad de trabajadores de ${configAnterior.numeroTrabajadores} a ${configNueva.numeroTrabajadores}. Se identificaron ${totalAfectadas} obligaciones que requieren revisión. ${normasSinCambios.length} conservan su evaluación actual y ${datosPendientes.length + normasParaRevisar.length} necesitan validar los nuevos datos antes de determinar su aplicabilidad.`;
  } else if (diferencias.length > 0) {
    resumenEjecutivo = `Se actualizaron las condiciones empresariales (${diferencias[0]}). Se detectaron ${totalAfectadas} normas con impacto regulatorio potencial, ${normasSinCambios.length} normas estables sin afectación directa y ${propuestasGeneradas.length} verificaciones del motor completadas.`;
  } else {
    resumenEjecutivo = `Se realizó una validación preventiva de las características empresariales. Las ${normasSinCambios.length} normas vigentes mantienen consistencia con el perfil operativo de Frikaz S.A.S.`;
  }

  const resumen: ResumenEvaluacionImpacto = {
    id: `eval-${Date.now()}`,
    fechaHora: timestamp,
    usuarioResponsable: usuario,
    variableModificada,
    valorAnterior: configAnterior,
    valorNuevo: configNueva,
    totalNormasEvaluadas: REGLAS_NORMATIVAS_COLOMBIA.length,
    totalNormasAfectadas: totalAfectadas,
    normasNuevasAplicables,
    normasParaRevisar,
    normasSinCambios,
    obligacionesModificadas,
    evidenciasAjustar,
    datosPendientes,
    propuestas: propuestasGeneradas,
    resumenEjecutivo,
  };

  return resumen;
}

// ==========================================
// APLICACIÓN REAL DE PROPUESTAS A LAS 74 NORMAS
// ==========================================

export function aplicarPropuestasANormas(
  normasActuales: NormaPhvaItem[],
  propuestasAprobadas: PropuestaCambioNorma[],
  configNueva: CaracterizacionEmpresaDinamica,
  usuario: string = 'Auditor SG-SST Frikaz'
): {
  normasActualizadas: NormaPhvaItem[];
  conteoActualizadas: number;
} {
  let conteo = 0;
  const mapaPropuestas = new Map<string, PropuestaCambioNorma>();
  propuestasAprobadas.forEach((p) => {
    mapaPropuestas.set(p.normaOficial.toLowerCase().split(' ')[0], p);
  });

  const normasActualizadas = normasActuales.map((norma) => {
    const key = norma.normaOficial.toLowerCase().split(' ')[0];
    const propuesta = mapaPropuestas.get(key);

    if (!propuesta) return norma;

    // Buscar regla correspondiente para extraer datos propuestos
    const regla = REGLAS_NORMATIVAS_COLOMBIA.find((r) =>
      r.normaReferencia.toLowerCase().includes(key)
    );

    if (!regla) return norma;

    const resRegla = regla.evaluar(configNueva);
    const props = resRegla.cambiosPropuestos;

    conteo++;

    return {
      ...norma,
      descripcion: props?.nuevaDescripcion || norma.descripcion,
      importancia: props?.nuevaImportancia || norma.importancia,
      aplicabilidad: props?.nuevaAplicabilidad || norma.aplicabilidad,
      evidenciaCumplimiento: props?.nuevaEvidencia || norma.evidenciaCumplimiento,
      estado: props?.nuevoEstadoCumplimiento || norma.estado,
      responsable: props?.nuevoResponsable || norma.responsable,
      fechaVerificacion: new Date().toISOString().split('T')[0],
      observaciones: `Actualizado automáticamente por Caracterización Dinámica: ${propuesta.justificacionLegal.slice(0, 150)}...`,
    };
  });

  return {
    normasActualizadas,
    conteoActualizadas: conteo,
  };
}
