import { NormaPhvaItem } from '../types/phvaEvidence';

export const NORMS_PLANEAR: NormaPhvaItem[] = [
  // MÓDULO 1: DIAGNÓSTICO
  {
    id: 'plan-01',
    fase: 'PLANEAR',
    subtema: 'DIAGNÓSTICO',
    tituloSituacion: '1. Diagnóstico y clasificación de riesgo - SST',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo de Colombia',
    articulos: 'Artículo 2.2.4.6.15',
    area: 'SST',
    descripcion:
      'Establece la obligación de identificar los peligros, evaluar y valorar los riesgos laborales mediante una metodología sistemática, documentada y participativa, que abarque todas las actividades, áreas, máquinas, equipos y trabajadores de la empresa.',
    importancia:
      'Permite prevenir accidentes de trabajo y enfermedades laborales, priorizar los riesgos más críticos, establecer medidas de control y garantizar condiciones de trabajo seguras para todos los colaboradores.',
    aplicabilidad:
      'Aplica a los procesos de preparación y fritura de alimentos, operación de maquinaria, empaque, almacenamiento, limpieza y distribución. La empresa debe identificar riesgos como quemaduras por aceite caliente, atrapamientos, caídas, exposición a sustancias químicas y sobreesfuerzos, implementando medidas preventivas según cada actividad.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'De aplicación nacional en Colombia. Comprende todos los procesos, centros de trabajo, actividades rutinarias y no rutinarias, así como los trabajadores, independientemente de su modalidad de contratación o vinculación, dentro del alcance establecido por la normativa del SG-SST.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe contar con una matriz de identificación de peligros, evaluación y valoración de riesgos actualizada; metodología documentada; inspecciones de seguridad; registros de participación de los trabajadores; mediciones ambientales cuando sean necesarias; capacitaciones; entrega de elementos de protección personal; planes de intervención y seguimiento de las medidas preventivas y correctivas. También debe conservar las actas y registros de comunicación de resultados al COPASST o al Vigía de SST, según corresponda.',
    estado: 'CUMPLE',
    responsable: 'Responsable SG-SST / Vigía de SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Evaluación inicial y matriz de peligros GTC 45 actualizada en planta.',
  },
  {
    id: 'plan-02',
    fase: 'PLANEAR',
    subtema: 'DIAGNÓSTICO',
    tituloSituacion: '1. Diagnóstico y clasificación de riesgo - Ambiental',
    normaOficial: 'Norma Técnica Colombiana ISO 14001:2026',
    entidadEmisora: 'Organización Internacional de Normalización (ISO) / ICONTEC',
    articulos: 'Edición ISO 14001:2026 (Publicada en abril de 2026)',
    area: 'AMBIENTAL',
    descripcion:
      'Establece los lineamientos para identificar los aspectos ambientales de las actividades, productos y servicios, evaluar sus impactos y determinar los riesgos y oportunidades que pueden afectar al medio ambiente. La nueva edición internacional ISO 14001:2026 fue publicada en abril de 2026 y reemplaza la edición internacional de 2015.',
    importancia:
      'Permite prevenir la contaminación, reducir los impactos ambientales, mejorar el uso de los recursos naturales y establecer acciones para controlar los riesgos ambientales derivados de las actividades empresariales.',
    aplicabilidad:
      'Se aplica al diagnóstico ambiental de las actividades de producción y comercialización de snacks. La empresa debe identificar y clasificar los riesgos relacionados con el consumo de agua y energía, la generación de residuos orgánicos y plásticos, el manejo del aceite usado, las emisiones y los vertimientos que puedan generarse. A partir de esta evaluación, se deben establecer controles para prevenir la contaminación y reducir los impactos ambientales.',
    vigente: true,
    textoVigencia: 'Vigente (Nueva edición ISO 14001:2026)',
    jurisdiccionAlcance:
      'La ISO es una norma internacional aplicable a organizaciones de cualquier tamaño y sector. En Frikaz S.A.S., orienta la gestión ambiental de las áreas de producción, almacenamiento, empaque, limpieza y distribución. Su aplicación como estándar de gestión es voluntaria, sin perjuicio de las obligaciones ambientales legales que sí sean exigibles en Colombia.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe conservar una matriz de aspectos e impactos ambientales, diagnóstico y clasificación de riesgos, registros de consumo de agua y energía, soportes de gestión y entrega de residuos y aceite usado, inspecciones ambientales, permisos aplicables, planes de prevención y contingencia, indicadores ambientales y registros de seguimiento a las acciones correctivas.',
    estado: 'CUMPLE',
    responsable: 'Líder de Gestión Ambiental / Gerencia',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Matriz ambiental adoptada bajo lineamientos ISO 14001:2026.',
  },
  {
    id: 'plan-03',
    fase: 'PLANEAR',
    subtema: 'DIAGNÓSTICO',
    tituloSituacion: '2. Política y objetivos ambientales y de SST - SST',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo de Colombia',
    articulos: 'Artículos 2.2.4.6.5 al 2.2.4.6.9',
    area: 'SST',
    descripcion:
      'Establece los requisitos para formular, firmar, divulgar y revisar la política de SST, definir sus objetivos y garantizar que el empleador asigne responsabilidades, recursos y personal competente para implementar, mantener y mejorar el SG-SST. También determina las obligaciones de las Administradoras de Riesgos Laborales (ARL) en materia de asesoría y capacitación.',
    importancia:
      'Permite establecer el compromiso de la empresa con la prevención de accidentes y enfermedades laborales, el cumplimiento de la normativa vigente, la participación de los trabajadores y la mejora continua de las condiciones de seguridad y salud en el trabajo.',
    aplicabilidad:
      'La empresa debe contar con una política de SST firmada por su representante legal, divulgada a todos los trabajadores y revisada como mínimo anualmente. Debe asignar responsabilidades, recursos y personal encargado del sistema, elaborar el plan anual de trabajo, identificar y controlar los riesgos asociados a la fritura, las quemaduras, la maquinaria, las caídas y la manipulación de cargas, y garantizar capacitaciones y participación de los colaboradores.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'De aplicación nacional en Colombia. Comprende las obligaciones del empleador en todos los centros de trabajo y respecto de los trabajadores, independientemente de su modalidad de contratación, así como las disposiciones aplicables a contratistas y subcontratistas. También establece obligaciones de asesoría y capacitación para las ARL.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe conservar la política de SST firmada y fechada, registros de divulgación, objetivos del sistema, matriz legal actualizada, asignación de responsabilidades, presupuesto y recursos destinados al SG-SST, plan anual de trabajo, registros de capacitación, actas del COPASST o del Vigía de SST según corresponda, rendición de cuentas anual, evaluaciones del sistema, evidencias de controles de riesgos y registros de asesoría y asistencia técnica de la ARL.',
    estado: 'CUMPLE',
    responsable: 'Representante Legal / Gerente General',
    fechaVerificacion: '2026-09-20',
    observaciones: 'Política firmada y divulgada a los 10 trabajadores de Frikaz S.A.S.',
  },
  {
    id: 'plan-04',
    fase: 'PLANEAR',
    subtema: 'DIAGNÓSTICO',
    tituloSituacion: '2. Política y objetivos ambientales y de SST - Ambiental',
    normaOficial: 'Ley 99 de 1993',
    entidadEmisora: 'Congreso de la República / SINA',
    articulos: 'Sistema Nacional Ambiental (SINA)',
    area: 'AMBIENTAL',
    descripcion:
      'Ley 99 de 1993 organiza el Sistema Nacional Ambiental (SINA) y establece los principios generales de la política ambiental colombiana. Orienta la protección de los recursos naturales, la prevención del deterioro ambiental y el desarrollo sostenible. Para Frikaz S.A.S., sirve como marco legal para definir compromisos y objetivos ambientales relacionados con sus actividades productivas.',
    importancia:
      'Permite orientar las acciones de la empresa hacia la prevención de la contaminación, el uso responsable del agua y la energía, la gestión adecuada de residuos y la protección del medio ambiente, contribuyendo al cumplimiento de las obligaciones ambientales aplicables.',
    aplicabilidad:
      'La empresa puede aplicar estos principios mediante una política ambiental que promueva el ahorro de agua y energía, la separación y disposición adecuada de residuos, el manejo responsable del aceite de fritura usado y la prevención de vertimientos y emisiones contaminantes. También debe identificar y cumplir las obligaciones ambientales específicas que correspondan a sus actividades.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, República de Colombia. Organiza el Sistema Nacional Ambiental (SINA) y establece principios para la protección de los recursos naturales y el desarrollo sostenible. Sus disposiciones y las normas ambientales que las desarrollan aplican a Frikaz S.A.S. según sus actividades y obligaciones específicas.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. puede demostrar la aplicación de estos principios mediante una política ambiental documentada, objetivos ambientales, matriz de aspectos e impactos ambientales, registros de consumo de agua y energía, soportes de entrega de residuos a gestores autorizados cuando corresponda, registros de manejo de aceite usado, planes de prevención de la contaminación y permisos ambientales exigibles según su operación.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Gestión Ambiental',
    fechaVerificacion: '2026-09-20',
    observaciones: 'Política ambiental integrada en carteleras de la planta Bosa.',
  },

  // MÓDULO 2: PELIGROS Y ASPECTOS AMBIENTALES
  {
    id: 'plan-05',
    fase: 'PLANEAR',
    subtema: 'PELIGROS Y ASPECTOS AMBIENTALES',
    tituloSituacion: '1. Identificación de peligros y aspectos - SST',
    normaOficial: 'Decreto 1443 de 2014',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículo 15 (Compilado en Art. 2.2.4.6.15 del Decreto 1072 de 2015)',
    area: 'SST',
    descripcion:
      'Establece la obligación de identificar los peligros, evaluar y valorar los riesgos laborales mediante una metodología sistemática que abarque las actividades, instalaciones, máquinas, equipos y trabajadores, para establecer medidas de prevención y control. Actualmente, esta disposición está compilada en el artículo 2.2.4.6.15 del Decreto 1072 de 2015.',
    importancia:
      'Permite prevenir accidentes y enfermedades laborales, reconocer condiciones inseguras, priorizar los riesgos y establecer controles para proteger la salud y la integridad de los trabajadores.',
    aplicabilidad:
      'La empresa debe identificar los peligros presentes en la preparación y fritura de alimentos, operación de maquinaria, empaque, almacenamiento, limpieza y distribución. Debe evaluar riesgos como quemaduras por aceite caliente, atrapamientos, caídas, exposición a sustancias químicas y sobreesfuerzos, e implementar medidas preventivas adecuadas.',
    vigente: true,
    textoVigencia: 'Vigente (Compilado en Decreto 1072 de 2015)',
    jurisdiccionAlcance:
      'Nacional, República de Colombia. Aplica a los procesos, actividades rutinarias y no rutinarias, instalaciones, equipos y trabajadores comprendidos en el SG-SST, independientemente de su modalidad de contratación o vinculación.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe contar con una matriz de identificación de peligros, evaluación y valoración de riesgos actualizada como mínimo anualmente; registros de inspecciones de seguridad; evaluaciones y mediciones ambientales cuando sean necesarias; evidencias de capacitación; reportes e investigaciones de accidentes e incidentes; planes de intervención y seguimiento de controles; y actas de participación del COPASST o del Vigía de SST, según corresponda.',
    estado: 'CUMPLE',
    responsable: 'Responsable SG-SST',
    fechaVerificacion: '2026-10-02',
    observaciones: 'Metodología GTC 45 aplicada en áreas de freidoras y corte.',
  },
  {
    id: 'plan-06',
    fase: 'PLANEAR',
    subtema: 'PELIGROS Y ASPECTOS AMBIENTALES',
    tituloSituacion: '1. Identificación de peligros y aspectos - Ambiental',
    normaOficial: 'ISO 14001:2026',
    entidadEmisora: 'Organización Internacional de Normalización (ISO)',
    articulos: 'Requisitos del SGA / Aspectos e Impactos Ambientales',
    area: 'AMBIENTAL',
    descripcion:
      'Establece los requisitos para implementar un sistema de gestión ambiental que permita identificar los aspectos ambientales de las actividades, productos y servicios, evaluar sus impactos y gestionar los riesgos y oportunidades ambientales. La edición 2026 refuerza la consideración del cambio climático, la biodiversidad, la disponibilidad de recursos y el desempeño ambiental medible.',
    importancia:
      'Permite prevenir la contaminación, reducir los residuos, optimizar el consumo de agua y energía y mejorar el desempeño ambiental de la empresa mediante controles y objetivos verificables.',
    aplicabilidad:
      'La empresa debe identificar y evaluar los aspectos ambientales asociados con la fritura, el empaque, la limpieza, el almacenamiento y la distribución de snacks. Debe considerar el consumo de agua y energía, la generación de residuos orgánicos y plásticos, el manejo del aceite usado y los posibles vertimientos y emisiones. Según los resultados, debe establecer controles, responsables, indicadores y acciones de mejora.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Internacional. Es aplicable a organizaciones de cualquier tamaño y sector. En Frikaz S.A.S., puede abarcar las áreas de producción, almacenamiento, empaque, limpieza, administración y distribución. Su implementación y certificación son voluntarias, sin sustituir las obligaciones ambientales legales aplicables en Colombia.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe conservar una matriz de aspectos e impactos ambientales, evaluación de riesgos y oportunidades, objetivos e indicadores ambientales, registros de consumo de agua y energía, soportes de gestión de residuos y aceite usado, controles de vertimientos y emisiones cuando correspondan, planes de contingencia, auditorías internas y registros de seguimiento y mejora del sistema.',
    estado: 'CUMPLE',
    responsable: 'Líder Ambiental / Gerencia',
    fechaVerificacion: '2026-10-02',
    observaciones: 'Evaluación de aspectos ambientales e impactos en planta Bosa.',
  },
  {
    id: 'plan-07',
    fase: 'PLANEAR',
    subtema: 'PELIGROS Y ASPECTOS AMBIENTALES',
    tituloSituacion: '2. Uso adecuado de recursos naturales - Ambiental',
    normaOficial: 'Ley 99 de 1993',
    entidadEmisora: 'Congreso de la República / SINA',
    articulos: 'Conservación y Aprovechamiento Sostenible de Recursos Naturales',
    area: 'AMBIENTAL',
    descripcion:
      'La Ley 99 de 1993 establece los principios generales de la política ambiental colombiana y promueve el uso sostenible, la conservación y la protección de los recursos naturales renovables y del medio ambiente, mediante la organización del Sistema Nacional Ambiental (SINA).',
    importancia:
      'Permite orientar las actividades empresariales hacia el aprovechamiento responsable de los recursos naturales, la prevención de la contaminación y la reducción de los impactos ambientales, contribuyendo al desarrollo sostenible.',
    aplicabilidad:
      'La empresa debe promover el uso eficiente del agua y la energía durante la preparación y fritura de snacks, evitar el desperdicio de materias primas, separar adecuadamente los residuos, gestionar correctamente el aceite de cocina usado y prevenir la contaminación del suelo y del agua. También debe cumplir los requisitos ambientales específicos que correspondan a sus actividades.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, República de Colombia. Establece principios para la conservación, protección y aprovechamiento sostenible de los recursos naturales. En Frikaz S.A.S., orienta las prácticas ambientales de producción, limpieza, almacenamiento y disposición de residuos, según las obligaciones aplicables a cada actividad.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. puede conservar registros de consumo de agua y energía, controles para reducir desperdicios, matriz de aspectos e impactos ambientales, soportes de entrega de residuos y aceite usado a gestores autorizados cuando corresponda, procedimientos de ahorro de recursos, inspecciones ambientales y planes de prevención de la contaminación.',
    estado: 'CUMPLE',
    responsable: 'Gestión Ambiental / Jefe de Planta',
    fechaVerificacion: '2026-09-28',
    observaciones: 'Monitoreo mensual de consumo de agua, energía y gas en cocción.',
  },

  // MÓDULO 3: ASIGNACIÓN
  {
    id: 'plan-08',
    fase: 'PLANEAR',
    subtema: 'ASIGNACIÓN',
    tituloSituacion: '1. Responsable del SG-SST',
    normaOficial: 'Decreto 1443 de 2014',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Compilado en Decreto 1072 de 2015',
    area: 'SST',
    descripcion:
      'Establece disposiciones para implementar el Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST), incluyendo la asignación de responsabilidades, la planificación, la ejecución y el seguimiento de las medidas de prevención de riesgos laborales. Estas disposiciones se encuentran actualmente compiladas en el Decreto 1072 de 2015.',
    importancia:
      'Permite garantizar que exista una persona competente encargada de coordinar el SG-SST, verificar el cumplimiento de las obligaciones legales y promover la prevención de accidentes y enfermedades laborales.',
    aplicabilidad:
      'La empresa debe designar un responsable del SG-SST que cuente con el perfil, la formación y las licencias que exija la normativa aplicable. Esta persona debe coordinar la identificación de peligros, la evaluación de riesgos, el plan anual de trabajo, las capacitaciones, las inspecciones y el seguimiento de las medidas preventivas en las áreas de fritura, empaque, almacenamiento y distribución.',
    vigente: true,
    textoVigencia: 'Vigente (Compilado en Decreto 1072 de 2015)',
    jurisdiccionAlcance:
      'Nacional, República de Colombia. Aplica a los empleadores y contratantes sujetos a las disposiciones del SG-SST. En Frikaz S.A.S., comprende la coordinación del sistema en todos los procesos y centros de trabajo, con participación de la dirección, los trabajadores y sus representantes.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe conservar el documento de designación del responsable del SG-SST, soportes de formación y licencia cuando sean exigibles, certificado del curso obligatorio de capacitación de 50 horas o su actualización según corresponda, plan anual de trabajo, matriz de peligros, cronograma de capacitaciones, informes de inspección, registros de seguimiento y evidencias de evaluación y mejora del sistema.',
    estado: 'CUMPLE',
    responsable: 'Gerente General / Responsable Asignado',
    fechaVerificacion: '2026-09-10',
    observaciones: 'Designación formal del responsable del SG-SST con curso 50h vigente.',
  },

  // MÓDULO 4: MATRIZ LEGAL Y PLAN ANUAL DE TRABAJO EN SSYY AMBIENTAL
  {
    id: 'plan-09',
    fase: 'PLANEAR',
    subtema: 'MATRIZ LEGAL Y PLAN ANUAL',
    tituloSituacion: '1. Manejo de residuos y reglamentación como generadores - RESPEL',
    normaOficial: 'Decreto 4741 de 2005',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulos: 'Compilado en Decreto 1076 de 2015 (Título 6, Capítulo 1)',
    area: 'AMBIENTAL',
    descripcion:
      'Establecía disposiciones para prevenir la generación de residuos peligrosos y regular su manejo integral, con el propósito de proteger la salud humana y el medio ambiente. Actualmente, sus disposiciones están compiladas en el Decreto 1076 de 2015, especialmente en el título 6 del capítulo 1, sobre residuos peligrosos (RESPEL).',
    importancia:
      'Permite prevenir la contaminación del suelo y del agua, reducir los riesgos asociados al manejo de residuos peligrosos y garantizar que estos sean almacenados, transportados y entregados de manera segura a gestores autorizados.',
    aplicabilidad:
      'La empresa debe identificar y clasificar los residuos generados durante la producción de snacks, la fritura, la limpieza y el mantenimiento de equipos. Debe prestar especial atención a envases contaminados con sustancias químicas, residuos de productos de limpieza y aceites usados, determinando si presentan características de peligrosidad. Los residuos que se clasifiquen como peligrosos deben manejarse conforme a los requisitos aplicables.',
    vigente: true,
    textoVigencia: 'Vigente (Compilado en Decreto 1076 de 2015)',
    jurisdiccionAlcance:
      'Nacional, República de Colombia. Aplica a las personas naturales o jurídicas que generan, gestionan o manejan residuos peligrosos. En Frikaz S.A.S., comprende la identificación, separación, almacenamiento, transporte y entrega de los residuos peligrosos que se generen en sus actividades.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe conservar la identificación y clasificación de residuos, el plan de gestión integral de residuos peligrosos cuando corresponda, registros de cantidades generadas, etiquetas y condiciones de almacenamiento, comprobantes de recolección y entrega a gestores autorizados, certificados de aprovechamiento o disposición final y soportes de capacitación. También debe verificar si está obligada a inscribirse en el Registro de Generadores de Residuos Peligrosos, según las cantidades generadas y las condiciones legales aplicables.',
    estado: 'CUMPLE',
    responsable: 'Coordinador Ambiental / Operaciones',
    fechaVerificacion: '2026-09-25',
    observaciones: 'Acopio con dique y entrega a gestor con licencia ambiental.',
  },
  {
    id: 'plan-10',
    fase: 'PLANEAR',
    subtema: 'MATRIZ LEGAL Y PLAN ANUAL',
    tituloSituacion: '2. Vertimientos, emisiones y ruido - Emisión de Ruido',
    normaOficial: 'Resolución 0627 de 2006',
    entidadEmisora: 'Ministerio de Ambiente, Vivienda y Desarrollo Territorial',
    articulos: 'Normas Nacionales de Emisión de Ruido y Ruido Ambiental',
    area: 'AMBIENTAL',
    descripcion:
      'Establece las normas nacionales para la emisión de ruido y el ruido ambiental en Colombia, incluyendo criterios de medición y límites permisibles según el sector y el horario.',
    importancia:
      'Permite controlar la contaminación acústica, prevenir afectaciones a la comunidad y promover el funcionamiento responsable de las actividades industriales y comerciales.',
    aplicabilidad:
      'Aplica al ruido generado por máquinas, equipos y actividades de producción cuando puedan afectar el ambiente o a la comunidad cercana. La empresa debe identificar las fuentes de ruido y aplicar medidas de control cuando corresponda.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Es de ámbito nacional y su cumplimiento es supervisado por las autoridades ambientales competentes, de acuerdo con sus funciones legales.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe contar con registros de identificación de las fuentes de ruido, mediciones cuando sean necesarias, mantenimiento preventivo de maquinaria, implementación de medidas de control y seguimiento ambiental, así como evidencias de atención a quejas o reportes relacionados con el ruido.',
    estado: 'CUMPLE',
    responsable: 'Mantenimiento / Gestión Ambiental',
    fechaVerificacion: '2026-09-25',
    observaciones: 'Mantenimiento y aislamiento de cortadoras y extractores de planta.',
  },
  {
    id: 'plan-11',
    fase: 'PLANEAR',
    subtema: 'MATRIZ LEGAL Y PLAN ANUAL',
    tituloSituacion: '2. Vertimientos, emisiones y ruido - Ley contra el Ruido',
    normaOficial: 'Ley 2450 de 2025',
    entidadEmisora: 'Congreso de la República de Colombia',
    articulos: 'Ley contra el Ruido / Calidad Acústica en Colombia',
    area: 'AMBIENTAL',
    descripcion:
      'Establece los objetivos, lineamientos y responsabilidades para formular e implementar una política de calidad acústica en Colombia, con el fin de prevenir, evaluar, controlar y reducir los impactos del ruido y las vibraciones.',
    importancia:
      'Busca proteger la salud de las personas, el ambiente y la convivencia mediante la prevención y reducción de la contaminación acústica.',
    aplicabilidad:
      'Aplica a la gestión del ruido generado por las máquinas, los equipos y las actividades de producción que puedan afectar a la comunidad o al entorno. Frikaz debe identificar sus fuentes de ruido y adoptar medidas preventivas y correctivas cuando corresponda.',
    vigente: true,
    textoVigencia: 'Vigente (Ley 2450 de 2025)',
    jurisdiccionAlcance:
      'Es de alcance nacional en Colombia. Establece responsabilidades para las entidades nacionales y territoriales, las autoridades ambientales y las autoridades de policía en la gestión de la calidad acústica.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe conservar registros de identificación de las fuentes de ruido, mediciones cuando sean necesarias, mantenimiento preventivo de máquinas y equipos, implementación de medidas para reducir el ruido y seguimiento a posibles afectaciones a la comunidad. También debe conservar los soportes de las acciones correctivas adoptadas cuando se identifiquen incumplimientos.',
    estado: 'CUMPLE',
    responsable: 'Gestión Ambiental / Seguridad Física',
    fechaVerificacion: '2026-10-05',
    observaciones: 'Evaluación de niveles sonoros en turnos de freído y empaque.',
  },
  {
    id: 'plan-12',
    fase: 'PLANEAR',
    subtema: 'MATRIZ LEGAL Y PLAN ANUAL',
    tituloSituacion: '3. Matriz de Requisitos Legales',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Definición y Actualización de Matriz Legal SG-SST',
    area: 'SST',
    descripcion:
      'El Decreto 1072 de 2015 define la matriz legal como la recopilación de los requisitos normativos exigibles a una empresa, de acuerdo con las actividades propias de su actividad productiva. Esta matriz establece los lineamientos legales y técnicos necesarios para desarrollar el Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) y debe actualizarse cuando se emitan nuevas disposiciones aplicables.',
    importancia:
      'Permite identificar las obligaciones legales que debe cumplir la empresa en materia de SST, verificar su cumplimiento, prevenir sanciones y facilitar la planificación de acciones para proteger la seguridad y la salud de los trabajadores.',
    aplicabilidad:
      'Aplica a Frikaz S.A.S. porque la empresa debe identificar y registrar las normas de SST relacionadas con sus actividades de producción, manipulación de aceite caliente, operación de maquinaria, almacenamiento, manipulación de cargas y demás tareas laborales. La matriz debe permitir verificar cada requisito, establecer responsables y conservar las evidencias correspondientes.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Es una norma de alcance nacional en Colombia. Las disposiciones del capítulo sobre el SG-SST son de obligatorio cumplimiento para los empleadores públicos y privados y demás sujetos contemplados en el artículo 2.2.4.6.1. La matriz debe incluir los requisitos del Sistema General de Riesgos Laborales que sean aplicables a la organización.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe contar con una matriz de requisitos legales documentada y actualizada que incluya las normas aplicables en SST, los artículos correspondientes, las obligaciones que debe cumplir, los responsables, el estado de cumplimiento y las evidencias de verificación. También debe conservar registros de las revisiones y actualizaciones realizadas, así como los documentos que demuestren el cumplimiento de cada requisito.',
    estado: 'CUMPLE',
    responsable: 'Responsable SG-SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Matriz legal sistematizada con hipervínculos a SUIN-Juriscol.',
  },
  {
    id: 'plan-13',
    fase: 'PLANEAR',
    subtema: 'MATRIZ LEGAL Y PLAN ANUAL',
    tituloSituacion: '4. Plan Anual de Trabajo en SST',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículos 2.2.4.6.8, num. 7; 2.2.4.6.12, num. 5; y 2.2.4.6.31',
    area: 'SST',
    descripcion:
      'El Decreto 1072 de 2015 establece la obligación del empleador de diseñar y desarrollar un plan de trabajo anual para alcanzar los objetivos del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST). Este plan debe incluir metas, responsabilidades, recursos y un cronograma de actividades, y debe estar firmado por el empleador y el responsable del SG-SST.',
    importancia:
      'Permite organizar las actividades de prevención de accidentes y enfermedades laborales, asignar recursos y responsables, establecer fechas de ejecución y evaluar el cumplimiento de los objetivos de SST de la empresa.',
    aplicabilidad:
      'Aplica a Frikaz S.A.S. porque debe planificar las actividades necesarias para prevenir los riesgos laborales asociados con la manipulación de aceite caliente, la operación de maquinaria, el almacenamiento de productos, la manipulación de cargas y las demás actividades de sus trabajadores. El plan debe establecer actividades preventivas, capacitaciones, inspecciones, mantenimiento y seguimiento, según los riesgos identificados.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Es una norma de alcance nacional en Colombia. Las disposiciones del SG-SST son aplicables a los empleadores y demás sujetos contemplados en el artículo 2.2.4.6.1, en los términos establecidos por la normativa.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. debe conservar el plan de trabajo anual del SG-SST, firmado por el empleador y el responsable del sistema, que incluya objetivos, metas, actividades, responsables, recursos y cronograma. También debe contar con registros de ejecución de las actividades, listas de asistencia a capacitaciones, informes de inspecciones, evidencias de mantenimiento, seguimiento a indicadores y resultados de la revisión por la alta dirección.',
    estado: 'CUMPLE',
    responsable: 'Gerente General / Responsable SG-SST',
    fechaVerificacion: '2026-09-30',
    observaciones: 'Plan anual de trabajo 2026 firmado y con cronograma en ejecución.',
  },
  {
    id: 'plan-14',
    fase: 'PLANEAR',
    subtema: 'MATRIZ LEGAL Y PLAN ANUAL',
    tituloSituacion: '4. Plan Anual de Actividades Ambientales',
    normaOficial: 'Decreto 1076 de 2015',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulos: 'Reglamentación del Sector Ambiental',
    area: 'AMBIENTAL',
    descripcion:
      'El Decreto 1076 de 2015 compila la reglamentación del sector ambiental colombiano y establece disposiciones aplicables a la protección y al uso de los recursos naturales, según la actividad desarrollada.',
    importancia:
      'Permite identificar obligaciones ambientales que deben incorporarse a la planificación de la empresa para prevenir la contaminación, proteger los recursos naturales y cumplir los requisitos legales aplicables.',
    aplicabilidad:
      'En Frikaz S.A.S., puede orientar la planificación de actividades relacionadas con el uso eficiente del agua, la gestión de residuos, el manejo del aceite de cocina usado y el control de vertimientos, de acuerdo con las obligaciones específicas que correspondan.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Tiene alcance nacional en Colombia y se aplica a personas naturales y jurídicas y a las autoridades ambientales dentro de las condiciones y competencias establecidas en el decreto.',
    evidenciaCumplimiento:
      'Frikaz S.A.S. puede conservar un plan anual de actividades ambientales con objetivos, metas, responsables, recursos y cronograma; registros de consumo de agua y energía; soportes de gestión y entrega de residuos; evidencias del manejo del aceite usado; y registros de seguimiento a los requisitos ambientales aplicables.',
    estado: 'CUMPLE',
    responsable: 'Líder Ambiental / Gerencia',
    fechaVerificacion: '2026-09-30',
    observaciones: 'Cronograma ambiental articulado con auditorías y SDA.',
  },
];
