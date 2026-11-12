// ============================================================================
// SERVICIO OFICIAL: PARTES INTERESADAS Y CHECKLISTS - FRIKAZ S.A.S.
// Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST)
// Sede: Bosa, Bogotá D.C. — NIT: 901.458.723-1
// ============================================================================

import ExcelJS from 'exceljs';
import {
  ParteInteresada,
  CargoChecklistInterno,
  ItemChecklistNecesidad,
  RegistroHistorialChecklist,
  IndicadoresGlobalesPartesInteresadas,
  ResumenIndicadoresCargo,
} from '../types/partesInteresadas';

const STORAGE_KEY_PARTES = 'frikaz_partes_interesadas_v1';
const STORAGE_KEY_CHECKLIST = 'frikaz_checklist_partes_v1';
const STORAGE_KEY_HISTORIAL = 'frikaz_historial_checklist_v1';

// ----------------------------------------------------------------------------
// DATOS SEMILLA: PARTES INTERESADAS (INTERNAS Y EXTERNAS)
// ----------------------------------------------------------------------------

export const PARTES_INTERESADAS_INICIALES: ParteInteresada[] = [
  // A. PARTES INTERESADAS INTERNAS
  {
    id: 'pi-int-01',
    nombre: 'Gerente (Alta Dirección)',
    clasificacion: 'interna',
    descripcion:
      'Representante legal y máxima autoridad directiva de Frikaz S.A.S. Responsable de la asignación de recursos y sostenibilidad del negocio.',
    necesidadesExpectativas:
      'Contar con información actualizada sobre los riesgos laborales, asegurar el cumplimiento legal integral, optimizar la inversión en SST y garantizar la continuidad operativa sin accidentes ni sanciones.',
    peligrosSituaciones:
      'Responsabilidad legal y penal por accidentes graves o mortales, sanciones económicas por incumplimiento de estándares mínimos (Res. 0312/2019), pérdidas financieras e interrupción de la producción.',
    posiblesAfectaciones:
      'Demandas laborales, multas del Ministerio del Trabajo, daño a la reputación corporativa y sobrecostos por ausentismo o indemnizaciones.',
    medidasPrevencionControl:
      'Asignación oportuna de presupuesto anual, revisión gerencial semestral del SG-SST, auditorías periódicas, asesoría técnica del ingeniero externo y seguimiento mensual de indicadores.',
    seguimiento:
      'Comité directivo mensual, informe de rendición de cuentas anual y revisión de auditoría del SG-SST.',
    fechaActualizacion: '2026-03-01',
  },
  {
    id: 'pi-int-02',
    nombre: 'Operarios (Producción y Planta)',
    clasificacion: 'interna',
    descripcion:
      'Personal operativo encargado de la selección, lavado, pelado abrasivo, tajado, freído en marmitas/pailas continuas (>160°C) y empaque térmico de snacks.',
    necesidadesExpectativas:
      'Disponer de condiciones seguras de trabajo, maquinaria con guardas de protección, EPP certificados y térmicos, capacitación continua, pausas activas y primeros auxilios inmediatos.',
    peligrosSituaciones:
      'Quemaduras de 1°, 2° y 3° grado por aceite caliente a alta temperatura, atrapamiento en rebanadoras o peladoras, caídas al mismo nivel por pisos resbalosos con grasa o agua, fatiga muscular por bipedestación prolongada y cortes con cuchillas.',
    posiblesAfectaciones:
      'Quemaduras corporales graves, heridas abiertas, amputaciones traumáticas, fracturas, secuelas incapacitantes y desmotivación laboral.',
    medidasPrevencionControl:
      'Mantenimiento preventivo quincenal a freidoras y selladoras, suministro de guantes térmicos de caña larga, delantales impermeables, calzado antideslizante dieléctrico, campana de extracción con trampa de grasas y señalización de advertencia.',
    seguimiento:
      'Inspecciones de seguridad semanales, reportes diarios de condiciones inseguras por el Vigía de SST y charlas de 5 minutos al inicio del turno.',
    fechaActualizacion: '2026-03-01',
  },
  {
    id: 'pi-int-03',
    nombre: 'Conductor (Logística y Distribución)',
    clasificacion: 'interna',
    descripcion:
      'Personal encargado del cargue, aseguramiento, transporte y entrega física de productos fritos y snacks a clientes, tiendas y mayoristas.',
    necesidadesExpectativas:
      'Vehículo de carga en óptimas condiciones técnico-mecánicas, mantenimiento preventivo al día, rutas y tiempos de entrega realistas, elementos de seguridad vial y apoyo ergonómico en descargue.',
    peligrosSituaciones:
      'Accidentes de tránsito en vías urbanas y rurales, fallas mecánicas de frenos o dirección, sobreesfuerzo por levantamiento manual de canastillas pesadas, estrés vial y asaltos o inseguridad ciudadana.',
    posiblesAfectaciones:
      'Politraumatismos, fracturas, latigazo cervical, lumbalgias agudas, hernias discales, pérdidas materiales del vehículo y producto.',
    medidasPrevencionControl:
      'Plan Estratégico de Seguridad Vial (PESV), inspección preoperacional diaria del vehículo, mantenimiento preventivo programado, faja ergonómica y guantes de agarre, capacitación en manejo defensivo y ergonomía en manipulación de cargas.',
    seguimiento:
      'Revisión diaria de la lista preoperacional vehicular, control de kilometraje y reporte de incidentes en ruta con el Coordinador de Logística.',
    fechaActualizacion: '2026-03-01',
  },

  // B. PARTES INTERESADAS EXTERNAS
  {
    id: 'pi-ext-01',
    nombre: 'Proveedores (Materias Primas e Insumos)',
    clasificacion: 'externa',
    descripcion:
      'Suministradores de papa, plátano, tocino para chicharrón, aceites vegetales comestibles, condimentos, empaques bilaminados, gas y químicos de limpieza.',
    necesidadesExpectativas:
      'Condiciones seguras en las zonas de descargue de Frikaz S.A.S., cumplimiento puntual de pedidos y pagos, especificaciones técnicas claras y protocolos de bioseguridad en recepción.',
    peligrosSituaciones:
      'Atropellamiento en patio de maniobras, caída de bultos o canastillas en recepción, contacto con zonas calientes de planta si ingresan sin autorización, derrames de aceite en descargue.',
    posiblesAfectaciones:
      'Lesiones a transportadores de proveedores, contaminación de materias primas por mala manipulación, retrasos en la cadena de suministros y reclamos comerciales.',
    medidasPrevencionControl:
      'Procedimiento seguro de recibo de materias primas, delimitación y demarcación de zonas de descargue, inducción básica de SST para visitantes y contratistas, uso obligatorio de calzado de seguridad y EPP.',
    seguimiento:
      'Evaluación periódica de proveedores, lista de verificación en recepción y control de acceso de transportadores.',
    fechaActualizacion: '2026-03-01',
  },
  {
    id: 'pi-ext-02',
    nombre: 'Ingeniero Externo de Seguridad y Salud en el Trabajo (Staff)',
    clasificacion: 'externa',
    descripcion:
      'Profesional con licencia vigente en SST contratado por horas o asesoría técnica para el diseño, auditoría, formulación de planes y asesoramiento técnico normativo a Frikaz S.A.S.',
    necesidadesExpectativas:
      'Acceso oportuno a la información y registros de la empresa, apoyo decidido de la gerencia para implementar controles, honestidad en los reportes de incidentes y cumplimiento de las recomendaciones técnicas.',
    peligrosSituaciones:
      'Ocultamiento de accidentes laborales por parte de la empresa, falta de asignación presupuestal para ejecutar las acciones correctivas, resistencia al cambio por parte de los operarios.',
    posiblesAfectaciones:
      'Sanciones éticas o legales al profesional si no se corrigen desviaciones críticas, desactualización del SG-SST frente a nuevas normas del Ministerio del Trabajo.',
    medidasPrevencionControl:
      'Contrato de prestación de servicios con cronograma claro, reuniones mensuales formales con Gerencia y Vigía de SST, actas de compromiso firmadas y trazabilidad digital de recomendaciones.',
    seguimiento:
      'Cronograma anual de actividades de SST, matriz de seguimiento de acciones correctivas e informes de auditoría interna semestrales.',
    fechaActualizacion: '2026-03-01',
  },
  {
    id: 'pi-ext-03',
    nombre: 'Ministerio del Trabajo',
    clasificacion: 'externa',
    descripcion:
      'Autoridad gubernamental en Colombia encargada de la inspección, vigilancia y control de las normas laborales y del Sistema de Gestión de la Seguridad y Salud en el Trabajo.',
    necesidadesExpectativas:
      'Cumplimiento estricto del Decreto 1072 de 2015 y la Resolución 0312 de 2019 (Estándares Mínimos), reporte oportuno de accidentes graves/mortales y autoevaluación anual registrada en la plataforma ministerial.',
    peligrosSituaciones:
      'Visitas de inspección sorpresivas con hallazgo de no conformidades, omisión en la investigación de accidentes laborales, falta de afiliación al sistema de seguridad social integral.',
    posiblesAfectaciones:
      'Cierre temporal o definitivo del establecimiento, multas acumulativas de hasta 500 salarios mínimos legales vigentes, investigaciones administrativas sancionatorias.',
    medidasPrevencionControl:
      'Cumplimiento verificable de los Estándares Mínimos, autoevaluación y plan de mejora anual registrado, investigación oportuna de todos los incidentes con el Vigía de SST y archivo documental riguroso.',
    seguimiento:
      'Autoevaluación anual en la plataforma Fondo de Riesgos Laborales, auditoría de cumplimiento legal y simulacros de inspección.',
    fechaActualizacion: '2026-03-01',
  },
  {
    id: 'pi-ext-04',
    nombre: 'Ministerio de Salud y Protección Social',
    clasificacion: 'externa',
    descripcion:
      'Entidad nacional rectora de las políticas de salud pública, salud laboral, prevención de enfermedades profesionales y articulación con ARL y EPS.',
    necesidadesExpectativas:
      'Articulación de los programas de medicina preventiva y del trabajo con las políticas nacionales, vigilancia epidemiológica de enfermedades laborales y reporte de ausentismo médico.',
    peligrosSituaciones:
      'Brote de enfermedades transmisibles en planta de alimentos, enfermedades osteomusculares crónicas no diagnosticadas, falta de exámenes médicos ocupacionales de ingreso y periódicos.',
    posiblesAfectaciones:
      'Pérdida de capacidad laboral de trabajadores, calificación de origen laboral por la Junta de Calificación de Invalidez, demandas por reintegro laboral reforzado.',
    medidasPrevencionControl:
      'Profesiograma actualizado para cada cargo, exámenes médicos ocupacionales con énfasis osteomuscular y cardiovascular, pausas activas programadas y seguimiento estricto a recomendaciones médicas.',
    seguimiento:
      'Indicadores de ausentismo por causa médica trimestral, consolidado anual de condiciones de salud y custodia de historias clínicas por IPS externa autorizada.',
    fechaActualizacion: '2026-03-01',
  },
  {
    id: 'pi-ext-05',
    nombre: 'Secretaría Distrital de Salud (Bogotá)',
    clasificacion: 'externa',
    descripcion:
      'Autoridad distrital sanitaria con jurisdicción en Bosa encargada de la inspección higiénico-sanitaria, concepto técnico sanitario de alimentos y condiciones de salubridad laboral.',
    necesidadesExpectativas:
      'Cumplimiento riguroso de la Resolución 2674 de 2013 (Buenas Prácticas de Manufactura - BPM), control de plagas, manejo de residuos sólidos y grasas, y manipulación higiénica de alimentos por personal sano.',
    peligrosSituaciones:
      'Contaminación cruzada de snacks, acumulación excesiva de grasas en ductos o trampas, falta de carnets de manipulación de alimentos o exámenes médicos para manipuladores.',
    posiblesAfectaciones:
      'Concepto sanitario Desfavorable, decomiso de producto, suspensión temporal de actividades por medida sanitaria preventiva, multas económicas.',
    medidasPrevencionControl:
      'Plan de Saneamiento Básico (limpieza, plagas, agua potable y residuos), exámenes médicos de frotis de garganta y coprológico a operarios, capacitación anual en BPM y mantenimiento de trampa de grasa.',
    seguimiento:
      'Auditorías mensuales internas de BPM, análisis microbiológico de superficies y producto terminado, y registros de disposición de aceite usado.',
    fechaActualizacion: '2026-03-01',
  },
  {
    id: 'pi-ext-06',
    nombre: 'Clientes y Consumidores',
    clasificacion: 'externa',
    descripcion:
      'Consumidores finales, tiendas de barrio, supermercados y distribuidores que adquieren y consumen los snacks de papas, plátanos y chicharrón Frikaz S.A.S.',
    necesidadesExpectativas:
      'Productos inocuos, frescos, crujientes, con etiquetado nutricional claro, libres de cuerpos extraños y producidos en instalaciones limpias y seguras que respeten los derechos laborales.',
    peligrosSituaciones:
      'Contaminación física (trozos de plástico, metal o cabello), rancidez prematura del aceite, presencia de alérgenos no declarados en el empaque.',
    posiblesAfectaciones:
      'Intoxicaciones alimentarias, demandas por daños al consumidor, pérdida masiva de ventas, retiro forzoso de lotes de producto del mercado.',
    medidasPrevencionControl:
      'Filtros y detectores visuales en empaque, rotación estricta de lotes (PEPS), control de temperatura y acidez de aceite de freído, uso obligatorio de cofia, tapabocas y batas sin botones en planta.',
    seguimiento:
      'Canal de Peticiones, Quejas y Reclamos (PQR), trazabilidad por número de lote y fecha de vencimiento en empaques y muestreos de calidad quincenales.',
    fechaActualizacion: '2026-03-01',
  },
];

// ----------------------------------------------------------------------------
// DATOS SEMILLA: CHECKLIST DE NECESIDADES INTERNAS (GERENTE, OPERARIOS, CONDUCTOR)
// ----------------------------------------------------------------------------

export const CHECKLIST_INICIAL_CARGOS: ItemChecklistNecesidad[] = [
  // 1. GERENTE (7 NECESIDADES ESPECÍFICAS)
  {
    id: 'chk-ger-01',
    cargo: 'gerente',
    numero: 1,
    necesidad: 'Contar con información actualizada sobre los riesgos laborales.',
    estado: 'Cumplido',
    observaciones:
      'Matriz GTC 45 actualizada en 2026 con 6 secciones completas y panel de valoración de riesgo.',
    evidencias: 'Matriz de Riesgos GTC 45 Frikaz S.A.S. versión digital 2026',
    responsable: 'Coordinador / Vigía de SST',
    fechaVerificacion: '2026-02-15',
  },
  {
    id: 'chk-ger-02',
    cargo: 'gerente',
    numero: 2,
    necesidad: 'Garantizar el cumplimiento de los requisitos legales en SST.',
    estado: 'En proceso',
    observaciones:
      'Matriz legal con 15 normas evaluadas; en proceso de ajuste del nuevo estándar de riesgo psicosocial.',
    evidencias: 'Matriz Legal SST con Res. 0312/2019 y Dec. 1072/2015',
    responsable: 'Gerente General / Asesor Legal Externo',
    fechaVerificacion: '2026-02-28',
  },
  {
    id: 'chk-ger-03',
    cargo: 'gerente',
    numero: 3,
    necesidad: 'Disponer de recursos económicos, humanos y técnicos para el SG-SST.',
    estado: 'Cumplido',
    observaciones:
      'Presupuesto anual 2026 aprobado para compra de EPP térmicos, mantenimiento de campanas y asesoría.',
    evidencias: 'Acta de Aprobación de Presupuesto SST 2026 firmada',
    responsable: 'Gerente General',
    fechaVerificacion: '2026-01-20',
  },
  {
    id: 'chk-ger-04',
    cargo: 'gerente',
    numero: 4,
    necesidad: 'Promover un ambiente laboral seguro y saludable.',
    estado: 'Cumplido',
    observaciones:
      'Política de SST firmada, socializada e instalada en cartelera principal de planta.',
    evidencias: 'Política SST Frikaz S.A.S. con firma y registro de asistencia a divulgación',
    responsable: 'Gerente General / Coordinador SST',
    fechaVerificacion: '2026-02-10',
  },
  {
    id: 'chk-ger-05',
    cargo: 'gerente',
    numero: 5,
    necesidad: 'Realizar seguimiento a la implementación del SG-SST.',
    estado: 'En proceso',
    observaciones:
      'Revisión gerencial programada para cierre de semestre con análisis de indicadores automáticos.',
    evidencias: 'Cronograma de Rendición de Cuentas y Revisiones por la Dirección 2026',
    responsable: 'Gerente General',
    fechaVerificacion: '2026-03-01',
  },
  {
    id: 'chk-ger-06',
    cargo: 'gerente',
    numero: 6,
    necesidad: 'Promover actividades de bienestar y prevención de riesgos.',
    estado: 'En proceso',
    observaciones:
      'Convenio coordinado con la Caja de Compensación y ARL para jornadas de salud visual y pausas activas.',
    evidencias: 'Plan de Bienestar y Salud Ocupacional Frikaz 2026',
    responsable: 'Gestión Humana / Vigía de SST',
    fechaVerificacion: '2026-02-22',
  },
  {
    id: 'chk-ger-07',
    cargo: 'gerente',
    numero: 7,
    necesidad: 'Participar en las actividades de capacitación y seguimiento.',
    estado: 'Cumplido',
    observaciones:
      'Gerente completó curso de 50 horas del SG-SST y asistió a la socialización de roles y responsabilidades.',
    evidencias: 'Certificado de curso 50 horas SENA y acta de reunión directiva SST',
    responsable: 'Gerente General',
    fechaVerificacion: '2026-01-25',
  },

  // 2. OPERARIOS (9 NECESIDADES ESPECÍFICAS)
  {
    id: 'chk-ope-01',
    cargo: 'operarios',
    numero: 1,
    necesidad: 'Contar con maquinaria y herramientas en buenas condiciones.',
    estado: 'Cumplido',
    observaciones:
      'Peladora abrasiva y selladora continua con mantenimiento preventivo realizado en febrero 2026.',
    evidencias: 'Hoja de vida de maquinaria y ficha técnica de mantenimiento preventivo',
    responsable: 'Técnico de Mantenimiento / Jefe de Planta',
    fechaVerificacion: '2026-02-18',
  },
  {
    id: 'chk-ope-02',
    cargo: 'operarios',
    numero: 2,
    necesidad: 'Recibir elementos de protección personal adecuados.',
    estado: 'Cumplido',
    observaciones:
      'Entrega de guantes de carnaza con aislamiento térmico para fritura, delantales impermeables y botas antideslizantes.',
    evidencias: 'Formato firmado de entrega y dotación individual de EPP a operarios',
    responsable: 'Coordinador / Vigía de SST',
    fechaVerificacion: '2026-02-05',
  },
  {
    id: 'chk-ope-03',
    cargo: 'operarios',
    numero: 3,
    necesidad: 'Disponer de espacios de trabajo limpios, organizados y seguros.',
    estado: 'Cumplido',
    observaciones:
      'Aplicación diaria de técnica 5S en áreas de tajado y empaque con desengrase de pisos.',
    evidencias: 'Lista de chequeo de orden, aseo y desinfección de planta',
    responsable: 'Jefe de Planta / Operarios',
    fechaVerificacion: '2026-03-02',
  },
  {
    id: 'chk-ope-04',
    cargo: 'operarios',
    numero: 4,
    necesidad: 'Recibir capacitaciones sobre manipulación de alimentos y prevención de riesgos.',
    estado: 'Cumplido',
    observaciones:
      'Taller de 10 horas de Manipulación Higiénica de Alimentos y Buenas Prácticas de Manufactura (BPM).',
    evidencias: 'Certificaciones individuales de manipulación de alimentos vigentes',
    responsable: 'Ingeniero de Alimentos / Asesor Externo',
    fechaVerificacion: '2026-01-30',
  },
  {
    id: 'chk-ope-05',
    cargo: 'operarios',
    numero: 5,
    necesidad: 'Contar con pausas y condiciones laborales adecuadas.',
    estado: 'En proceso',
    observaciones:
      'Implementadas pausas activas en el turno de la mañana (10:00 am); pendiente formalizar turno de tarde.',
    evidencias: 'Registro fotográfico y planilla de pausas activas matutinas',
    responsable: 'Vigía de SST / Líder de Producción',
    fechaVerificacion: '2026-02-25',
  },
  {
    id: 'chk-ope-06',
    cargo: 'operarios',
    numero: 6,
    necesidad: 'Conocer los procedimientos seguros para manipular aceite caliente.',
    estado: 'Cumplido',
    observaciones:
      'Procedimiento Estándar de Operación (POE) de fritura y filtrado seguro de aceite publicado en zona de pailas.',
    evidencias: 'Instructivo visual POE-FRI-02 fijado en zona de marmitas y evaluación teórica',
    responsable: 'Coordinador SST / Maestro Fritador',
    fechaVerificacion: '2026-02-12',
  },
  {
    id: 'chk-ope-07',
    cargo: 'operarios',
    numero: 7,
    necesidad: 'Recibir información sobre los riesgos de cortes, quemaduras, atrapamientos y caídas.',
    estado: 'Cumplido',
    observaciones:
      'Inducción de riesgos específicos en el puesto y entrega de manual de seguridad por cargo.',
    evidencias: 'Registro de inducción específica y entrega de manual de seguridad',
    responsable: 'Coordinador / Vigía de SST',
    fechaVerificacion: '2026-02-14',
  },
  {
    id: 'chk-ope-08',
    cargo: 'operarios',
    numero: 8,
    necesidad: 'Garantizar el mantenimiento preventivo de las máquinas.',
    estado: 'En proceso',
    observaciones:
      'Mantenimiento de rebanadora y freidoras ejecutado; pendiente programar extractor y campana para fin de mes.',
    evidencias: 'Cronograma preventivo de maquinaria 2026 con órdenes de servicio',
    responsable: 'Jefe de Planta / Mantenimiento',
    fechaVerificacion: '2026-02-27',
  },
  {
    id: 'chk-ope-09',
    cargo: 'operarios',
    numero: 9,
    necesidad: 'Contar con señalización adecuada en las áreas de producción.',
    estado: 'Pendiente',
    observaciones:
      'Falta reponer 3 avisos reflectivos de peligro por temperatura >160°C y demarcación de piso resbaloso en lavado.',
    evidencias: 'Cotización aprobada para compra de señalética fotoluminiscente NTC 1461',
    responsable: 'Coordinador SST / Compras',
    fechaVerificacion: '2026-03-03',
  },

  // 3. CONDUCTOR (8 NECESIDADES ESPECÍFICAS)
  {
    id: 'chk-con-01',
    cargo: 'conductor',
    numero: 1,
    necesidad: 'Contar con un vehículo en buenas condiciones.',
    estado: 'Cumplido',
    observaciones:
      'Furgón de reparto con revisión técnico-mecánica vigente y cambio de llantas realizado.',
    evidencias: 'Certificado de Revisión Técnico-Mecánica RUNT y factura de mantenimiento',
    responsable: 'Conductor / Administrador de Flota',
    fechaVerificacion: '2026-02-16',
  },
  {
    id: 'chk-con-02',
    cargo: 'conductor',
    numero: 2,
    necesidad: 'Tener documentación vigente y elementos de seguridad vial.',
    estado: 'Cumplido',
    observaciones:
      'SOAT, tarjeta de propiedad, licencia C2 al día y kit de carretera reglamentario verificado con extintor cargado.',
    evidencias: 'Póliza SOAT vigente hasta nov 2026 e inspección de kit de carretera',
    responsable: 'Conductor / Coordinador SST',
    fechaVerificacion: '2026-02-10',
  },
  {
    id: 'chk-con-03',
    cargo: 'conductor',
    numero: 3,
    necesidad: 'Disponer de horarios organizados y tiempos adecuados para las entregas.',
    estado: 'En proceso',
    observaciones:
      'Se definieron 2 zonas de reparto (Norte y Sur); se requiere ajustar ventanas de entrega en horas pico de Bogotá.',
    evidencias: 'Plan de Rutas Logísticas Frikaz 2026 y hoja de tiempos de despacho',
    responsable: 'Coordinador Logístico / Gerencia',
    fechaVerificacion: '2026-02-24',
  },
  {
    id: 'chk-con-04',
    cargo: 'conductor',
    numero: 4,
    necesidad: 'Recibir capacitación en seguridad vial y prevención de accidentes.',
    estado: 'Cumplido',
    observaciones:
      'Curso de manejo defensivo y seguridad vial completado en alianza con la ARL.',
    evidencias: 'Certificado de capacitación en Manejo Defensivo y Seguridad Vial ARL',
    responsable: 'Asesor ARL / Coordinador SST',
    fechaVerificacion: '2026-01-28',
  },
  {
    id: 'chk-con-05',
    cargo: 'conductor',
    numero: 5,
    necesidad: 'Contar con elementos de protección para realizar las entregas.',
    estado: 'Cumplido',
    observaciones:
      'Dotación de chaleco reflectivo reglamentario, guantes de nitrilo antideslizante y calzado de seguridad con puntera.',
    evidencias: 'Registro firmado de entrega de EPP para personal de transporte',
    responsable: 'Coordinador SST',
    fechaVerificacion: '2026-02-08',
  },
  {
    id: 'chk-con-06',
    cargo: 'conductor',
    numero: 6,
    necesidad: 'Recibir orientación sobre manipulación manual de cargas.',
    estado: 'Cumplido',
    observaciones:
      'Técnicas ergonómicas para levantar y trasladar canastillas de snacks (límite máx. 25 kg para hombres).',
    evidencias: 'Acta de inducción en Higiene Postural y Manejo Manual de Cargas',
    responsable: 'Fisioterapeuta ARL / Vigía de SST',
    fechaVerificacion: '2026-02-19',
  },
  {
    id: 'chk-con-07',
    cargo: 'conductor',
    numero: 7,
    necesidad: 'Realizar inspecciones periódicas al vehículo.',
    estado: 'Cumplido',
    observaciones:
      'Diligenciamiento diario de la lista de chequeo preoperacional vehicular antes de salir de la sede Bosa.',
    evidencias: 'Taletario físico y consolidado digital de listas preoperacionales vehiculares',
    responsable: 'Conductor / Coordinador SST',
    fechaVerificacion: '2026-03-04',
  },
  {
    id: 'chk-con-08',
    cargo: 'conductor',
    numero: 8,
    necesidad: 'Contar con condiciones adecuadas para los tiempos de conducción y descanso.',
    estado: 'En proceso',
    observaciones:
      'Se estipuló pausa de 20 minutos cada 2.5 horas de conducción; pendiente monitoreo a través del reporte de GPS.',
    evidencias: 'Política interna de prevención de fatiga y microsueños Frikaz S.A.S.',
    responsable: 'Gerente / Coordinador Logístico',
    fechaVerificacion: '2026-02-26',
  },
];

// ----------------------------------------------------------------------------
// DATOS SEMILLA: HISTORIAL DE SEGUIMIENTO DEL CHECKLIST
// ----------------------------------------------------------------------------

export const HISTORIAL_INICIAL_CHECKLIST: RegistroHistorialChecklist[] = [
  {
    id: 'rev-01',
    fecha: '2026-03-04',
    cargo: 'operarios',
    responsableEvaluador: 'Ing. Carlos Mendoza (Coordinador SST)',
    porcentajeCumplimiento: 67,
    cumplidas: 6,
    enProceso: 2,
    pendientes: 1,
    observacionesGenerales:
      'Buena adherencia al uso de guantes térmicos y POE de freído. Se dio orden de compra urgente para la reposición de la señalética faltante en el área de lavado y pailas.',
  },
  {
    id: 'rev-02',
    fecha: '2026-02-26',
    cargo: 'conductor',
    responsableEvaluador: 'Ing. Carlos Mendoza (Coordinador SST)',
    porcentajeCumplimiento: 75,
    cumplidas: 6,
    enProceso: 2,
    pendientes: 0,
    observacionesGenerales:
      'Inspección preoperacional al 100% de cumplimiento. Se coordina con logística la optimización de las ventanas de entrega para evitar sobretiempos en tráfico.',
  },
  {
    id: 'rev-03',
    fecha: '2026-02-15',
    cargo: 'gerente',
    responsableEvaluador: 'Ing. Carlos Mendoza (Coordinador SST)',
    porcentajeCumplimiento: 57,
    cumplidas: 4,
    enProceso: 3,
    pendientes: 0,
    observacionesGenerales:
      'Presupuesto y recursos garantizados. En proceso la preparación del informe de revisión semestral gerencial y plan de bienestar.',
  },
];

// ----------------------------------------------------------------------------
// PERSISTENCIA EN LOCALSTORAGE
// ----------------------------------------------------------------------------

export function getStoredPartesInteresadas(): ParteInteresada[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTES);
    if (!raw) {
      saveStoredPartesInteresadas(PARTES_INTERESADAS_INICIALES);
      return PARTES_INTERESADAS_INICIALES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveStoredPartesInteresadas(PARTES_INTERESADAS_INICIALES);
    return PARTES_INTERESADAS_INICIALES;
  } catch (error) {
    console.error('Error leyendo partes interesadas de localStorage:', error);
    return PARTES_INTERESADAS_INICIALES;
  }
}

export function saveStoredPartesInteresadas(partes: ParteInteresada[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PARTES, JSON.stringify(partes));
  } catch (error) {
    console.error('Error guardando partes interesadas en localStorage:', error);
  }
}

export function getStoredChecklistItems(): ItemChecklistNecesidad[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHECKLIST);
    if (!raw) {
      saveStoredChecklistItems(CHECKLIST_INICIAL_CARGOS);
      return CHECKLIST_INICIAL_CARGOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveStoredChecklistItems(CHECKLIST_INICIAL_CARGOS);
    return CHECKLIST_INICIAL_CARGOS;
  } catch (error) {
    console.error('Error leyendo checklist de localStorage:', error);
    return CHECKLIST_INICIAL_CARGOS;
  }
}

export function saveStoredChecklistItems(items: ItemChecklistNecesidad[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(items));
  } catch (error) {
    console.error('Error guardando checklist en localStorage:', error);
  }
}

export function getStoredHistorialChecklist(): RegistroHistorialChecklist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORIAL);
    if (!raw) {
      saveStoredHistorialChecklist(HISTORIAL_INICIAL_CHECKLIST);
      return HISTORIAL_INICIAL_CHECKLIST;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveStoredHistorialChecklist(HISTORIAL_INICIAL_CHECKLIST);
    return HISTORIAL_INICIAL_CHECKLIST;
  } catch (error) {
    console.error('Error leyendo historial de checklist de localStorage:', error);
    return HISTORIAL_INICIAL_CHECKLIST;
  }
}

export function saveStoredHistorialChecklist(historial: RegistroHistorialChecklist[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORIAL, JSON.stringify(historial));
  } catch (error) {
    console.error('Error guardando historial de checklist en localStorage:', error);
  }
}

// ----------------------------------------------------------------------------
// CÁLCULO DE INDICADORES AUTOMÁTICOS
// ----------------------------------------------------------------------------

export function calcularIndicadoresPartesInteresadas(
  items: ItemChecklistNecesidad[]
): IndicadoresGlobalesPartesInteresadas {
  const cargos: CargoChecklistInterno[] = ['gerente', 'operarios', 'conductor'];

  const nombresCargos: Record<CargoChecklistInterno, string> = {
    gerente: 'Gerente (Alta Dirección)',
    operarios: 'Operarios (Producción y Planta)',
    conductor: 'Conductor (Logística y Distribución)',
  };

  const porCargo = {} as Record<CargoChecklistInterno, ResumenIndicadoresCargo>;

  let totalGlobal = 0;
  let cumplidasGlobal = 0;
  let enProcesoGlobal = 0;
  let pendientesGlobal = 0;

  for (const c of cargos) {
    const itemsCargo = items.filter((it) => it.cargo === c);
    const total = itemsCargo.length;
    const cumplidas = itemsCargo.filter((it) => it.estado === 'Cumplido').length;
    const enProceso = itemsCargo.filter((it) => it.estado === 'En proceso').length;
    const pendientes = itemsCargo.filter((it) => it.estado === 'Pendiente').length;
    const porcentaje = total > 0 ? Math.round((cumplidas / total) * 100) : 0;

    porCargo[c] = {
      cargo: c,
      nombreCargo: nombresCargos[c],
      total,
      cumplidas,
      enProceso,
      pendientes,
      porcentaje,
    };

    totalGlobal += total;
    cumplidasGlobal += cumplidas;
    enProcesoGlobal += enProceso;
    pendientesGlobal += pendientes;
  }

  const porcentajeGlobal =
    totalGlobal > 0 ? Math.round((cumplidasGlobal / totalGlobal) * 100) : 0;

  return {
    totalNecesidades: totalGlobal,
    cumplidas: cumplidasGlobal,
    enProceso: enProcesoGlobal,
    pendientes: pendientesGlobal,
    porcentajeCumplimiento: porcentajeGlobal,
    porCargo,
  };
}

// ----------------------------------------------------------------------------
// EXPORTACIÓN A EXCEL NATIVO CON EXCELJS
// ----------------------------------------------------------------------------

export async function exportarChecklistExcel(
  cargo: CargoChecklistInterno,
  items: ItemChecklistNecesidad[]
): Promise<void> {
  const nombresCargo: Record<CargoChecklistInterno, string> = {
    gerente: 'GERENTE (ALTA DIRECCIÓN)',
    operarios: 'OPERARIOS (PRODUCCIÓN Y PLANTA)',
    conductor: 'CONDUCTOR (LOGÍSTICA Y DISTRIBUCIÓN)',
  };

  const itemsCargo = items.filter((it) => it.cargo === cargo);
  const nombreCargoOficial = nombresCargo[cargo];

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Frikaz S.A.S. - Sistema de Gestión SST';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(`Checklist_${cargo.toUpperCase()}`, {
    views: [{ showGridLines: true }],
  });

  // ENCABEZADO INSTITUCIONAL
  worksheet.mergeCells('A1:G1');
  worksheet.mergeCells('A2:G2');
  worksheet.mergeCells('A3:G3');

  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'FRIKAZ S.A.S. — SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO';
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' },
  };

  const subtitleCell = worksheet.getCell('A2');
  subtitleCell.value = `CHECKLIST DE EVALUACIÓN DE NECESIDADES EN SST — ${nombreCargoOficial}`;
  subtitleCell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFEA580C' } };
  subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  subtitleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8FAFC' },
  };

  const metaCell = worksheet.getCell('A3');
  metaCell.value = `Sede: Bosa, Bogotá D.C. | NIT: 901.458.723-1 | Fecha de Emisión: ${new Date().toLocaleDateString('es-CO')} | Documento Oficial SG-SST`;
  metaCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF64748B' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.addRow([]);

  // CABECERA DE TABLA
  const headerRow = worksheet.addRow([
    'ÍTEM',
    'NECESIDAD EN SEGURIDAD Y SALUD EN EL TRABAJO',
    'ESTADO',
    'OBSERVACIONES Y DIAGNÓSTICO',
    'EVIDENCIAS / SOPORTE DOCUMENTAL',
    'RESPONSABLE ASIGNADO',
    'FECHA VERIFICACIÓN',
  ]);

  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: 'FFEA580C' } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } },
    };
  });

  // FILAS DE DATOS
  itemsCargo.forEach((item) => {
    const row = worksheet.addRow([
      item.numero,
      item.necesidad,
      item.estado.toUpperCase(),
      item.observaciones || 'Sin observaciones registradas',
      item.evidencias || 'Sin evidencias adjuntas',
      item.responsable || 'Por asignar',
      item.fechaVerificacion || 'Pendiente',
    ]);

    row.height = 36;

    // Colores de estado
    const estadoCell = row.getCell(3);
    if (item.estado === 'Cumplido') {
      estadoCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDCFCE7' }, // emerald 100
      };
      estadoCell.font = { bold: true, color: { argb: 'FF166534' } };
    } else if (item.estado === 'En proceso') {
      estadoCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' }, // amber 100
      };
      estadoCell.font = { bold: true, color: { argb: 'FF92400E' } };
    } else {
      estadoCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFE4E6' }, // rose 100
      };
      estadoCell.font = { bold: true, color: { argb: 'FF9F1239' } };
    }

    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };

    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  });

  // FILA RESUMEN DE CUMPLIMIENTO
  worksheet.addRow([]);
  const cumplidasCount = itemsCargo.filter((it) => it.estado === 'Cumplido').length;
  const enProcesoCount = itemsCargo.filter((it) => it.estado === 'En proceso').length;
  const pendientesCount = itemsCargo.filter((it) => it.estado === 'Pendiente').length;
  const porcentaje = itemsCargo.length > 0 ? Math.round((cumplidasCount / itemsCargo.length) * 100) : 0;

  const totalRow = worksheet.addRow([
    'RESUMEN',
    `Total: ${itemsCargo.length} necesidades | Cumplidas: ${cumplidasCount} | En proceso: ${enProcesoCount} | Pendientes: ${pendientesCount}`,
    `${porcentaje}% CUMPLIDO`,
    'Evaluación realizada conforme al Decreto 1072/2015 y Res. 0312/2019',
    '',
    '',
    new Date().toLocaleDateString('es-CO'),
  ]);

  totalRow.height = 24;
  totalRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF1F5F9' },
    };
  });

  // ANCHO DE COLUMNAS
  worksheet.columns = [
    { width: 8 },  // Ítem
    { width: 42 }, // Necesidad
    { width: 16 }, // Estado
    { width: 38 }, // Observaciones
    { width: 34 }, // Evidencias
    { width: 28 }, // Responsable
    { width: 18 }, // Fecha
  ];

  // DESCARGA EN EL NAVEGADOR
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Checklist_SST_${cargo.toUpperCase()}_Frikaz_SAS.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportarMatrizExcel(partes: ParteInteresada[]): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Frikaz S.A.S. - Sistema de Gestión SST';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Matriz_Partes_Interesadas', {
    views: [{ showGridLines: true }],
  });

  worksheet.mergeCells('A1:H1');
  worksheet.mergeCells('A2:H2');

  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'FRIKAZ S.A.S. — MATRIZ DE IDENTIFICACIÓN Y GESTIÓN DE PARTES INTERESADAS';
  titleCell.font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' },
  };

  const subCell = worksheet.getCell('A2');
  subCell.value = `SG-SST Decreto 1072 de 2015 / ISO 45001 | Total Partes: ${partes.length} | Fecha: ${new Date().toLocaleDateString('es-CO')}`;
  subCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF64748B' } };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.addRow([]);

  const headerRow = worksheet.addRow([
    'PARTE INTERESADA',
    'CLASIFICACIÓN',
    'DESCRIPCIÓN Y ROL',
    'NECESIDADES Y EXPECTATIVAS',
    'PELIGROS O SITUACIONES QUE LA AFECTAN',
    'POSIBLES AFECTACIONES',
    'MEDIDAS DE PREVENCIÓN Y CONTROL',
    'MECANISMO DE SEGUIMIENTO',
  ]);

  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: 'FFEA580C' } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } },
    };
  });

  partes.forEach((p) => {
    const row = worksheet.addRow([
      p.nombre,
      p.clasificacion === 'interna' ? 'INTERNA' : 'EXTERNA',
      p.descripcion,
      p.necesidadesExpectativas,
      p.peligrosSituaciones,
      p.posiblesAfectaciones,
      p.medidasPrevencionControl,
      p.seguimiento,
    ]);

    row.height = 48;

    const clasifCell = row.getCell(2);
    if (p.clasificacion === 'interna') {
      clasifCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEDE9FE' }, // purple 100
      };
      clasifCell.font = { bold: true, color: { argb: 'FF5B21B6' } };
    } else {
      clasifCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0F2FE' }, // sky 100
      };
      clasifCell.font = { bold: true, color: { argb: 'FF075985' } };
    }

    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(7).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row.getCell(8).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  });

  worksheet.columns = [
    { width: 28 },
    { width: 16 },
    { width: 34 },
    { width: 38 },
    { width: 38 },
    { width: 34 },
    { width: 42 },
    { width: 32 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Matriz_Partes_Interesadas_Frikaz_SAS.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
