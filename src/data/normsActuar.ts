import { NormaPhvaItem } from '../types/phvaEvidence';

export const NORMS_ACTUAR: NormaPhvaItem[] = [
  // MÓDULO 1: ACCIDENTES Y ENFERMEDADES
  {
    id: 'actu-01',
    fase: 'ACTUAR',
    subtema: 'ACCIDENTES Y ENFERMEDADES',
    tituloSituacion: 'Reporte de Accidentes de Trabajo y Enfermedades (FURAT/FUREL)',
    normaOficial: 'Resolución 0156 de 2005 (modificada por Resolución 2851 de 2015)',
    entidadEmisora: 'Ministerio de la Protección Social',
    articulos: 'Artículo 3 (Modificado por Res. 2851 de 2015)',
    area: 'SST',
    descripcion:
      'La Resolución 0156 de 2005 establece la adopción de los formatos para reportar los accidentes de trabajo y las enfermedades laborales. En su artículo 3, señala la obligación del empleador o contratante de reportar estos eventos a las entidades correspondientes, suministrar una copia del informe al trabajador y completar el reporte dentro de los dos (2) días hábiles siguientes a la ocurrencia del accidente o al diagnóstico de la enfermedad profesional.',
    importancia:
      'Permite garantizar el reporte oportuno de los accidentes de trabajo y enfermedades laborales, proteger los derechos de los trabajadores, facilitar su atención médica oportuna, identificar las causas de los accidentes, mantener registros de seguimiento y evitar sanciones legales para Frikaz S.A.S.',
    aplicabilidad:
      'Durante las actividades de Frikaz S.A.S. pueden presentarse situaciones como quemaduras durante la fritura, caídas por pisos resbaladizos, cortaduras durante la manipulación de utensilios o molestias asociadas a movimientos repetitivos. Cuando ocurra un accidente o se diagnostique una enfermedad laboral, Gestión Humana y el líder de SST deben diligenciar el FURAT/FUREL en 2 días hábiles y remitirlo a la EPS y ARL.',
    vigente: true,
    textoVigencia: 'Vigente (Artículo 3 modificado por Resolución 2851 de 2015)',
    jurisdiccionAlcance:
      'Nacional, Colombia. Aplica a producción (fritura, maquinaria), empaque, almacenamiento, distribución y administración.',
    evidenciaCumplimiento:
      'Formato Único de Reporte de Accidente de Trabajo (FURAT) radicado, copia entregada al trabajador, comunicación a la EPS y ARL dentro de los 2 días hábiles y soportes de seguimiento al caso.',
    estado: 'CUMPLE',
    responsable: 'Gestión Humana / Responsable SG-SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Procedimiento de reporte y radicación en línea ante Positiva/Sura activo.',
  },
  {
    id: 'actu-02',
    fase: 'ACTUAR',
    subtema: 'ACCIDENTES Y ENFERMEDADES',
    tituloSituacion: 'Investigación de Accidentes de Trabajo y Enfermedades',
    normaOficial: 'Resolución 1401 de 2007',
    entidadEmisora: 'Ministerio de la Protección Social',
    articulos: 'Artículo 6 / Metodología de Investigación',
    area: 'SST',
    descripcion:
      'La Resolución 1401 de 2007 establece disposiciones para la investigación de incidentes y accidentes de trabajo. En particular, el artículo 6 permite que el aportante utilice la metodología de investigación que mejor se adapte a sus necesidades, a su actividad económica y a sus recursos técnicos y tecnológicos, siempre que le permita cumplir con las obligaciones legales y sirva como herramienta para prevenir futuros accidentes.',
    importancia:
      'Ayuda a Frikaz S.A.S. a identificar las causas de los incidentes y accidentes laborales, prevenir la repetición de situaciones de riesgo, establecer medidas correctivas y preventivas y promover ambientes laborales más seguros.',
    aplicabilidad:
      'Si un trabajador sufre una quemadura durante el proceso de fritura o un atrapamiento en rebanadoras, Frikaz S.A.S. debe conformar el equipo investigador (supervisor, Vigía de SST y responsable del sistema) para aplicar metodologías como el árbol de causas o los 5 porqués y establecer acciones correctivas inmediatas.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, Colombia. Comprende empleadores públicos y privados en todo el territorio.',
    evidenciaCumplimiento:
      'Informe de investigación de incidentes y accidentes con metodología documentada (árbol de causas / 5 porqués), actas de participación del equipo investigador con el Vigía de SST y plan de acción de medidas correctivas.',
    estado: 'CUMPLE',
    responsable: 'Equipo Investigador / Vigía de SST',
    fechaVerificacion: '2026-09-25',
    observaciones: 'Formato de investigación adoptado con árbol de causas y seguimiento a controles.',
  },
  {
    id: 'actu-03',
    fase: 'ACTUAR',
    subtema: 'ACCIDENTES Y ENFERMEDADES',
    tituloSituacion: 'Reubicación Laboral e Integración de Personas con Discapacidad',
    normaOficial: 'Ley 361 de 1997',
    entidadEmisora: 'Congreso de la República de Colombia',
    articulos: 'Artículo 4',
    area: 'SST',
    descripcion:
      'El artículo 4 establece responsabilidades del Estado para garantizar los derechos de las personas con discapacidad, incluyendo la prevención, la atención médica, la rehabilitación, la educación y la integración laboral. También contempla la participación de entidades públicas y privadas en la realización de estos objetivos.',
    importancia:
      'Promueve la inclusión laboral, la igualdad de oportunidades y el respeto por los derechos de las personas con discapacidad, fomentando espacios de trabajo accesibles, incluyentes y libres de discriminación.',
    aplicabilidad:
      'En Frikaz S.A.S., se relaciona con prácticas de inclusión y contratación sin discriminación. Si se contrata o cuenta con un colaborador con discapacidad en labores administrativas, empaque o gestión documental, se deben evaluar los ajustes razonables y de accesibilidad necesarios.',
    vigente: true,
    textoVigencia: 'Vigente en Colombia con reformas posteriores',
    jurisdiccionAlcance:
      'Nacional, Colombia. Promoción de derechos, integración social e inclusión laboral.',
    evidenciaCumplimiento:
      'Registro de ajustes razonables implementados cuando corresponda, evaluación de accesibilidad de las instalaciones y registros de capacitación sobre inclusión y no discriminación.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Gestión Humana',
    fechaVerificacion: '2026-09-15',
    observaciones: 'Evaluación de accesibilidad en planta y protocolo de trato igualitario.',
  },
  {
    id: 'actu-04',
    fase: 'ACTUAR',
    subtema: 'ACCIDENTES Y ENFERMEDADES',
    tituloSituacion: 'Reincorporación al Trabajo y Reubicación tras Incapacidad',
    normaOficial: 'Ley 776 de 2002',
    entidadEmisora: 'Congreso de la República de Colombia',
    articulos: 'Artículo 4: Reincorporación al Trabajo',
    area: 'SST',
    descripcion:
      'Este artículo establece que, cuando un trabajador termina su periodo de incapacidad temporal y recupera su capacidad laboral, el empleador debe reincorporarlo al cargo que desempeñaba o reubicarlo en otro puesto para el cual esté capacitado, de la misma categoría.',
    importancia:
      'Facilita el regreso del trabajador a sus actividades laborales, protege su estabilidad laboral reforzada y promueve su recuperación integral considerando sus condiciones médicas.',
    aplicabilidad:
      'Si un operario de Frikaz S.A.S. sufre un accidente durante la fritura, empaque o manipulación de maquinaria y finaliza su incapacidad temporal, la empresa debe evaluar su reincorporación al cargo habitual o reubicarlo temporalmente en funciones adaptadas según las recomendaciones médicas.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, Colombia. Aplica a trabajadores que finalizan incapacidad temporal por accidente o enfermedad laboral.',
    evidenciaCumplimiento:
      'Registro de reincorporación laboral, certificado o soporte de finalización de la incapacidad y conceptos con recomendaciones médico-ocupacionales pertinentes de la EPS/ARL.',
    estado: 'CUMPLE',
    responsable: 'Gestión Humana / Médico Ocupacional',
    fechaVerificacion: '2026-09-20',
    observaciones: 'Procedimiento de retorno laboral y adaptación de funciones documentado.',
  },

  // MÓDULO 2: SANCIONES
  {
    id: 'actu-05',
    fase: 'ACTUAR',
    subtema: 'SANCIONES',
    tituloSituacion: 'Sanciones en el Sistema de Riesgos Laborales y Afiliación',
    normaOficial: 'Ley 1562 de 2012',
    entidadEmisora: 'Congreso de la República de Colombia',
    articulos: 'Artículo 13: Afiliados al Sistema General de Riesgos Laborales',
    area: 'SST',
    descripcion:
      'El artículo 13 establece quiénes deben estar afiliados de manera obligatoria al Sistema General de Riesgos Laborales y qué trabajadores independientes pueden afiliarse voluntariamente. Su objetivo es garantizar la protección frente a los riesgos derivados del trabajo y prevenir sanciones administrativas para la empresa.',
    importancia:
      'Permite que los trabajadores cuenten con cobertura frente a accidentes de trabajo y enfermedades laborales, ayudando a que la empresa cumpla sus obligaciones de afiliación y cotización y reduzca el riesgo de sanciones graves o multas por parte del Ministerio del Trabajo.',
    aplicabilidad:
      'Frikaz S.A.S. debe garantizar la afiliación oportuna a la ARL de todos los operarios de freidoras, empaque, bodega y administración desde el primer día laboral, así como de aprendices en etapas lectiva y práctica.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, Colombia. Comprende la afiliación de todos los colaboradores en producción, empaque, bodega y administración.',
    evidenciaCumplimiento:
      'Planillas PILA de pago mensual de seguridad social a la ARL, formularios de afiliación radicados previo al ingreso y certificados de estado activo de los 10 trabajadores.',
    estado: 'CUMPLE',
    responsable: 'Gestión Humana / Contador',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Afiliaciones 100% verificadas sin mora ni omisiones en PILA.',
  },
  {
    id: 'actu-06',
    fase: 'ACTUAR',
    subtema: 'SANCIONES',
    tituloSituacion: 'Procedimiento Sancionatorio Ambiental',
    normaOficial: 'Ley 1333 de 2009',
    entidadEmisora: 'Congreso de la República de Colombia',
    articulos: 'Régimen Sancionatorio Ambiental en Colombia',
    area: 'AMBIENTAL',
    descripcion:
      'Establece el procedimiento sancionatorio ambiental en Colombia y faculta a las autoridades ambientales (como la Secretaría Distrital de Ambiente de Bogotá o la CAR) para imponer medidas preventivas (suspensión de actividades, decomiso) y sanciones (multas diarias hasta por 5.000 SMLMV, cierre temporal o definitivo del establecimiento) ante infracciones ambientales.',
    importancia:
      'Previene que Frikaz S.A.S. incurra en infracciones por vertimientos ilegales de grasas a la red de alcantarillado, mala disposición de aceite usado (AVU) o emisiones atmosféricas sin control que generen el sellamiento de la fábrica.',
    aplicabilidad:
      'Mantener al día la trampa de grasas, los certificados de recolección de AVU, la clasificación de residuos según el código de colores y las condiciones técnicas de las chimeneas para atender cualquier inspección de la SDA o CAR sin riesgo de medidas sancionatorias.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional y Distrital Bogotá D.C. Aplicable a todas las actividades industriales de la sede Bosa.',
    evidenciaCumplimiento:
      'Bitácoras de mantenimiento de la trampa de grasas, certificados de disposición de AVU con gestor registrado, manifiestos de RESPEL y registros de inspecciones ambientales internas.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Líder Ambiental',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Cumplimiento preventivo total sin quejas ni requerimientos de la SDA.',
  },
  {
    id: 'actu-07',
    fase: 'ACTUAR',
    subtema: 'SANCIONES',
    tituloSituacion: 'Responsabilidad Penal: Homicidio Culposo',
    normaOficial: 'Código Penal Colombiano (Ley 599 de 2000)',
    entidadEmisora: 'Congreso de la República',
    articulos: 'Artículo 109 (Modificado por Art. 14 de Ley 890 de 2004)',
    area: 'SST',
    descripcion:
      'El artículo 109 establece las consecuencias penales para quien causa la muerte de otra persona por culpa, es decir, por una conducta imprudente, negligente, imperita o por incumplir un deber objetivo de cuidado, sin que exista la intención de causar la muerte.',
    importancia:
      'Sirve como marco de referencia para recordar la estricta responsabilidad patronal y técnica de prevenir accidentes mortales por quemaduras masivas con aceite a alta temperatura, electrocución o atrapamientos en maquinaria.',
    aplicabilidad:
      'Frikaz S.A.S. debe garantizar guardas de seguridad en cortadoras rotativas, paradas de emergencia en freidoras continuas, mantenimiento preventivo y EPP térmico para eliminar la negligencia o falta de previsión en sus procesos.',
    vigente: true,
    textoVigencia: 'Vigente (Modificado por Ley 890 de 2004)',
    jurisdiccionAlcance:
      'Nacional, en todo el territorio colombiano. Aplica a quienes incurran en conductas culposas.',
    evidenciaCumplimiento:
      'Registros de capacitación, inspecciones de maquinaria y equipos, registros de entrega de elementos de protección personal, permisos de trabajo seguro y procedimientos operativos estandarizados.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Responsable SG-SST',
    fechaVerificacion: '2026-09-30',
    observaciones: 'Procedimientos seguros de freído y corte documentados para prevenir eventos graves.',
  },
  {
    id: 'actu-08',
    fase: 'ACTUAR',
    subtema: 'SANCIONES',
    tituloSituacion: 'Responsabilidad Penal: Lesiones Personales Culposas',
    normaOficial: 'Código Penal Colombiano (Ley 599 de 2000)',
    entidadEmisora: 'Congreso de la República',
    articulos: 'Artículo 111 y siguientes',
    area: 'SST',
    descripcion:
      'El artículo 111 de la Ley 599 de 2000 establece que quien cause a otra persona un daño en el cuerpo o en la salud puede incurrir en las sanciones previstas en los artículos siguientes del Código Penal, según las características y gravedad de las lesiones.',
    importancia:
      'Recuerda la obligación legal y moral de prevenir accidentes que puedan menoscabar la integridad física o salud de los trabajadores en la planta de alimentos.',
    aplicabilidad:
      'Prevención activa frente a quemaduras por salpicadura de aceite hirviendo, cortes por cuchillas de rebanadoras, caídas por pisos grasosos o lesiones lumbares por levantamiento de bultos de papa de 50 kg.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, en Colombia. Aplica cuando una conducta reúne los elementos del delito de lesiones.',
    evidenciaCumplimiento:
      'Plan de prevención del SG-SST, reportes e investigaciones de accidentes, actas de inducción y capacitaciones en manipulación de maquinaria y pisos seguros.',
    estado: 'CUMPLE',
    responsable: 'Líder SST / Supervisor de Producción',
    fechaVerificacion: '2026-09-30',
    observaciones: 'Instalación de tapetes antideslizantes y delantales térmicos en área de freído.',
  },
  {
    id: 'actu-09',
    fase: 'ACTUAR',
    subtema: 'SANCIONES',
    tituloSituacion: 'Responsabilidad Penal: Malversación y Dilapidación de Bienes',
    normaOficial: 'Código Penal Colombiano (Ley 599 de 2000)',
    entidadEmisora: 'Congreso de la República',
    articulos: 'Artículo 259',
    area: 'SST',
    descripcion:
      'El artículo 259 de la Ley 599 de 2000 establece sanciones para quien malverse o dilapide los bienes que administra en ejercicio de tutela o curatela, siempre que la conducta no constituya otro delito.',
    importancia:
      'En el contexto de Frikaz S.A.S., sirve principalmente para diferenciar este delito de los asuntos generales de control administrativo, financiero e inventario de materias primas y recursos de la empresa.',
    aplicabilidad:
      'El cuidado de los recursos empresariales en Frikaz S.A.S. se aborda mediante controles internos, políticas de inventario de papa, aceite y empaques, registros contables y procedimientos para autorizar gastos de dotación y mantenimiento del SG-SST.',
    vigente: true,
    textoVigencia: 'Vigente (Modificado por Ley 890 de 2004)',
    jurisdiccionAlcance:
      'Nacional, en Colombia. Control administrativo y financiero de los recursos de la empresa.',
    evidenciaCumplimiento:
      'Inventarios de materias primas y productos terminados, registros de entradas y salidas de bodega y soportes de compras y gastos del presupuesto de SST.',
    estado: 'CUMPLE',
    responsable: 'Administración / Contabilidad',
    fechaVerificacion: '2026-09-30',
    observaciones: 'Presupuesto de SST ejecutado con soportes contables y auditoría interna.',
  },
  {
    id: 'actu-10',
    fase: 'ACTUAR',
    subtema: 'SANCIONES',
    tituloSituacion: 'Delitos contra los Recursos Naturales y el Medio Ambiente',
    normaOficial: 'Ley 2111 de 2021',
    entidadEmisora: 'Congreso de la República de Colombia',
    articulos: 'Sustituye Título XI del Código Penal (Arts. 328 a 339)',
    area: 'AMBIENTAL',
    descripcion:
      'Sustituye el Título XI del Código Penal e introduce tipos penales estrictos para delitos ambientales como contaminación ambiental, daño a los recursos naturales y manejo ilícito de residuos peligrosos.',
    importancia:
      'Evita que Frikaz S.A.S. incurra en responsabilidades penales derivadas de descargas directas de contaminantes o aceites residuales a cuerpos de agua o alcantarillado sin tratamiento.',
    aplicabilidad:
      'Control estricto para impedir el vertimiento de aceites de cocina usados (AVU) o sustancias químicas corrosivas por los desagües, asegurando su entrega formal a gestores autorizados con manifiestos de trazabilidad.',
    vigente: true,
    textoVigencia: 'Vigente (Ley 2111 de 2021)',
    jurisdiccionAlcance:
      'Nacional, Colombia. De aplicación a todas las personas y actividades productivas.',
    evidenciaCumplimiento:
      'Certificados de entrega de AVU y RESPEL a gestores con licencia ambiental, bitácoras de trampa de grasas y registros de no vertimiento de sustancias químicas.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Coordinador Ambiental',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Trazabilidad 100% de aceites usados entregados a gestor de biocombustibles.',
  },

  // MÓDULO 3: GESTIÓN DE NO CONFORMIDADES
  {
    id: 'actu-11',
    fase: 'ACTUAR',
    subtema: 'GESTIÓN DE NO CONFORMIDADES',
    tituloSituacion: 'Acciones Preventivas y Correctivas del SG-SST',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículo 2.2.4.6.33',
    area: 'SST',
    descripcion:
      'Este artículo establece que el empleador debe definir e implementar las acciones preventivas y correctivas necesarias a partir de los resultados de la supervisión, las mediciones de eficacia del SG-SST, las auditorías y la revisión realizada por la alta dirección. Señala la necesidad de identificar las causas fundamentales de las no conformidades, planificar y aplicar medidas de mejora, comprobar su eficacia y documentar las acciones realizadas.',
    importancia:
      'Permite identificar fallas en los procesos de trabajo, corregir condiciones inseguras y prevenir la repetición de incidentes y accidentes laborales en la producción de snacks.',
    aplicabilidad:
      'Si durante una inspección se identifica que el piso del área de fritura permanece resbaladizo por derrames de aceite, la empresa debe analizar la causa, establecer medidas para controlar el riesgo, asignar responsables y verificar que la solución sea efectiva.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, Colombia. Aplica a los empleadores y centros de trabajo del SG-SST.',
    evidenciaCumplimiento:
      'Procedimiento documentado de acciones preventivas y correctivas, formato de registro de no conformidades con análisis de causa raíz, plan de acción y verificación de eficacia.',
    estado: 'CUMPLE',
    responsable: 'Responsable SG-SST / Vigía de SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Planes de acción formulados para hallazgos de auditoría con verificación de cierre.',
  },
  {
    id: 'actu-12',
    fase: 'ACTUAR',
    subtema: 'GESTIÓN DE NO CONFORMIDADES',
    tituloSituacion: 'Mejora Continua del Sistema de Gestión de SST',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículo 2.2.4.6.34',
    area: 'SST',
    descripcion:
      'Este artículo establece que el empleador debe proporcionar las directrices y los recursos necesarios para mejorar continuamente el SG-SST. Para identificar oportunidades de mejora, debe considerar los objetivos del sistema, los resultados de la intervención de riesgos, las auditorías, las investigaciones de accidentes, las recomendaciones de los trabajadores, los programas de prevención, la supervisión de la dirección y los cambios normativos.',
    importancia:
      'Permite que Frikaz S.A.S. evalúe periódicamente sus actividades de prevención, identifique aspectos que necesitan fortalecerse y realice ajustes para mejorar las condiciones de trabajo y evitar la recurrencia de fallas.',
    aplicabilidad:
      'Frikaz S.A.S. aplica este artículo revisando periódicamente sus resultados en seguridad y salud, las condiciones de sus instalaciones y las recomendaciones de sus trabajadores para actualizar el plan de capacitación, los procedimientos operativos y las protecciones de las máquinas.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, Colombia. Involucra la evaluación de riesgos, programas de prevención y auditorías.',
    evidenciaCumplimiento:
      'Registros de investigación de accidentes e incidentes, planes de mejoramiento continuo, registros de seguimiento a indicadores y evaluación de resultados por gerencia.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Líder SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Ciclo de mejora continua evidenciado con actualizaciones en planta.',
  },
  {
    id: 'actu-13',
    fase: 'ACTUAR',
    subtema: 'GESTIÓN DE NO CONFORMIDADES',
    tituloSituacion: 'No Conformidad y Acción Correctiva Ambiental',
    normaOficial: 'ISO 14001:2015',
    entidadEmisora: 'Organización Internacional de Normalización (ISO)',
    articulos: 'Cláusula 10.2: No Conformidad y Acción Correctiva',
    area: 'AMBIENTAL',
    descripcion:
      'Establece las directrices para reaccionar ante una no conformidad ambiental, tomar acciones para controlarla y corregirla, hacer frente a las consecuencias, evaluar la necesidad de acciones para eliminar las causas de la no conformidad y revisar la eficacia de cualquier acción correctiva tomada.',
    importancia:
      'Permite corregir desvíos en la separación de residuos, fallas en la trampa de grasas o aumentos injustificados de consumo de agua, evitando impactos negativos al entorno y sanciones.',
    aplicabilidad:
      'Ante hallazgos ambientales como mezclas de residuos en canecas de reciclaje o retrasos en el mantenimiento de chimeneas, Frikaz S.A.S. documenta la no conformidad, analiza la causa y ejecuta la acción correctiva.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Internacional. Aplicación voluntaria en el marco del Sistema de Gestión Ambiental de Frikaz S.A.S.',
    evidenciaCumplimiento:
      'Formato de no conformidad ambiental, informes de análisis de causa raíz, planes de acción correctiva ambiental y registros de verificación de eficacia.',
    estado: 'CUMPLE',
    responsable: 'Gestión Ambiental / Operaciones',
    fechaVerificacion: '2026-09-28',
    observaciones: 'Acciones correctivas ambientales ejecutadas y cerradas satisfactoriamente.',
  },

  // MÓDULO 4: REQUERIMIENTOS Y CIERRE
  {
    id: 'actu-14',
    fase: 'ACTUAR',
    subtema: 'REQUERIMIENTOS DE LA AUTORIDAD',
    tituloSituacion: 'Respuesta a Requerimientos de la Autoridad y Evaluación Inicial',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículo 2.2.4.6.16: Evaluación Inicial del SG-SST',
    area: 'SST',
    descripcion:
      'Este artículo establece que el empleador debe realizar una evaluación inicial del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) para identificar las prioridades de la empresa y establecer o actualizar el plan de trabajo anual. La evaluación debe contemplar la identificación de los requisitos legales, peligros y riesgos laborales, amenazas, medidas de prevención, necesidades de capacitación, condiciones de salud y resultados de indicadores.',
    importancia:
      'Permite conocer el estado real del SG-SST, responder con solvencia técnica a visitas o requerimientos del Ministerio del Trabajo o entidades de control, y facilitar la asignación de recursos y actualización de medidas preventivas.',
    aplicabilidad:
      'Frikaz S.A.S. evalúa las condiciones de seguridad en las áreas de fritura, preparación, empaque, almacenamiento y distribución de snacks para priorizar capacitaciones, inspecciones y medidas de protección, manteniendo disponibles los soportes ante visitas de las autoridades.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, Colombia. Comprende todas las áreas e instalaciones de la empresa.',
    evidenciaCumplimiento:
      'Documento de evaluación inicial del SG-SST, matriz legal con evidencias de cumplimiento, evaluación de amenazas, plan de prevención ante emergencias y actas de atención a visitas de inspección.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Responsable SG-SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Expediente documental completo para atención de inspecciones laborales.',
  },
  {
    id: 'actu-15',
    fase: 'ACTUAR',
    subtema: 'CIERRE DE CICLO',
    tituloSituacion: 'Cierre de Ciclo: Funciones Ambientales y SINA',
    normaOficial: 'Decreto 1076 de 2015',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulos: 'Artículo 1.1.1.1.1 (Funciones del MADS y SINA)',
    area: 'AMBIENTAL',
    descripcion:
      'Establece que el Ministerio de Ambiente y Desarrollo Sostenible es la entidad encargada de orientar y regular la gestión ambiental en Colombia, así como de formular políticas para proteger, conservar y utilizar de manera sostenible los recursos naturales, dirigiendo el Sistema Nacional Ambiental (SINA).',
    importancia:
      'Permite comprender que la empresa debe desarrollar sus actividades en armonía con las políticas del Estado para la protección del agua, suelo y aire.',
    aplicabilidad:
      'Frikaz S.A.S. cierra su ciclo ambiental asegurando la correcta disposición de residuos de aceite sin verterlos en desagües, la separación de residuos aprovechables y orgánicos, la reducción del desperdicio de agua y energía y la capacitación del personal.',
    vigente: true,
    textoVigencia: 'Vigente (Decreto 1076 de 2015)',
    jurisdiccionAlcance:
      'Nacional, en Colombia. Marco general de referencia para la gestión ambiental de la pyme.',
    evidenciaCumplimiento:
      'Registros de consumo de agua y energía, inspecciones de las instalaciones, soportes de entrega a gestores autorizados y matriz de aspectos e impactos ambientales actualizada.',
    estado: 'CUMPLE',
    responsable: 'Coordinador Ambiental',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Prácticas ambientales articuladas con la política distrital y nacional.',
  },
  {
    id: 'actu-16',
    fase: 'ACTUAR',
    subtema: 'CIERRE DE CICLO',
    tituloSituacion: 'Cierre de Ciclo: Matriz de Aspectos e Impactos Ambientales',
    normaOficial: 'ISO 14001 de 2015',
    entidadEmisora: 'Organización Internacional de Normalización (ISO)',
    articulos: 'Identificación y Evaluación Continua de Aspectos Ambientales',
    area: 'AMBIENTAL',
    descripcion:
      'Orienta la identificación, evaluación y actualización sistemática de los aspectos ambientales significativos derivados de las actividades productivas de la empresa, cerrando el ciclo mediante la retroalimentación de controles.',
    importancia:
      'Garantiza que los cambios en materias primas, nuevos equipos de cocción o variaciones en la producción de snacks sean evaluados antes de generar impactos ambientales imprevistos.',
    aplicabilidad:
      'Revisión y actualización de la matriz ambiental de la planta Frikaz S.A.S. al cierre de cada periodo anual, evaluando la eficiencia de la trampa de grasas, el volumen de AVU generado y la reducción de mermas.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Internacional / Planta Frikaz S.A.S. en Bogotá D.C.',
    evidenciaCumplimiento:
      'Matriz de aspectos e impactos ambientales actualizada con firmas de revisión, informe de cierre ambiental y plan de objetivos para el siguiente ciclo.',
    estado: 'CUMPLE',
    responsable: 'Gestión Ambiental / Dirección',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Matriz ambiental actualizada al cierre del ciclo operativo.',
  },
  {
    id: 'actu-17',
    fase: 'ACTUAR',
    subtema: 'CIERRE DE CICLO',
    tituloSituacion: 'Cierre de Ciclo: Actualización de Matriz de Peligros y Riesgos GTC 45',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículo 2.2.4.6.15',
    area: 'SST',
    descripcion:
      'Establece que la identificación de peligros, evaluación y valoración de riesgos debe actualizarse como mínimo una vez al año, así como cuando ocurran accidentes mortales, eventos catastróficos o cambios importantes en los procesos, instalaciones, máquinas o equipos.',
    importancia:
      'Es fundamental para Frikaz S.A.S. porque permite reconocer oportunamente los peligros presentes en la producción y comercialización de snacks, establecer prioridades y adoptar medidas eficaces para prevenir accidentes y enfermedades laborales.',
    aplicabilidad:
      'Actualización anual de la matriz de peligros evaluando riesgos físicos (quemaduras, cortes, ruido), biomecánicos (cargas), químicos (limpieza), locativos y psicosociales en las áreas de fritura, corte, empaque y distribución.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, en Colombia. Comprende todas las áreas e instalaciones de la sede Bosa.',
    evidenciaCumplimiento:
      'Metodología documentada para evaluar riesgos (GTC 45), actualización anual de la matriz de peligros firmada, y registros de actualización extraordinaria ante modificaciones de equipos o procesos.',
    estado: 'CUMPLE',
    responsable: 'Responsable SG-SST / Vigía de SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Matriz GTC 45 revisada anualmente y comunicada al personal.',
  },
  {
    id: 'actu-18',
    fase: 'ACTUAR',
    subtema: 'CIERRE DE CICLO',
    tituloSituacion: 'Cierre de Ciclo: Actualización de Procesos tras Investigaciones ATEL',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículo 2.2.4.6.32 (Investigación de Accidentes y Enfermedades)',
    area: 'SST',
    descripcion:
      'Establece que las investigaciones de incidentes, accidentes de trabajo y enfermedades laborales deben realizarse conforme a la normativa vigente, incluyendo la Resolución 1401 de 2007. Los resultados deben comunicarse a los trabajadores y a la alta dirección, y deben utilizarse para la actualización de procesos, procedimientos y la mejora continua del SG-SST.',
    importancia:
      'Permite que cada evento o casi-accidente en planta se traduzca en una mejora concreta de ingeniería o de procedimiento, cerrando las brechas de seguridad.',
    aplicabilidad:
      'Analizar las causas de cualquier quemadura con aceite caliente, caída o corte con rebanadoras para actualizar los manuales de operación segura, reubicar protecciones mecánicas o reforzar la capacitación.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, en Colombia. Pautas para investigar causas y mejorar el SG-SST.',
    evidenciaCumplimiento:
      'Informes de investigación de incidentes y accidentes con equipo investigador constituido, actas de divulgación de lecciones aprendidas y procedimientos de trabajo actualizados tras eventos.',
    estado: 'CUMPLE',
    responsable: 'Responsable SG-SST / Supervisor de Planta',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Lecciones aprendidas divulgadas y procedimientos de freído actualizados.',
  },
  {
    id: 'actu-19',
    fase: 'ACTUAR',
    subtema: 'CIERRE DE CICLO',
    tituloSituacion: 'Cierre de Ciclo: Estándares Mínimos para Empresas de 10 o Menos Trabajadores',
    normaOficial: 'Resolución 0312 de 2019',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículo 3: Estándares Mínimos para Empresas con 10 o Menos Trabajadores',
    area: 'SST',
    descripcion:
      'Establece los Estándares Mínimos del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) que deben cumplir las empresas, empleadores y contratantes que tengan diez (10) o menos trabajadores y estén clasificadas en los riesgos laborales I, II o III. Incluye la asignación de responsable competente, afiliación al sistema de seguridad social, capacitación, plan anual, evaluaciones médicas, identificación de peligros y medidas de prevención.',
    importancia:
      'Permite determinar los requisitos mínimos obligatorios que debe cumplir Frikaz S.A.S. para proteger a sus 10 trabajadores y demostrar cumplimiento legal ante auditorías del Ministerio del Trabajo y la ARL.',
    aplicabilidad:
      'Frikaz S.A.S. cuenta con exactamente 10 trabajadores y clasificación de riesgo II/III en freidoras, por lo que verifica y da cumplimiento integral a los estándares del artículo 3 de la Resolución 0312 de 2019.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional, en Colombia. Aplica a empresas con 10 o menos trabajadores en riesgos I, II o III.',
    evidenciaCumplimiento:
      'Soportes de asignación de responsable del SG-SST con curso 50h, afiliación y pago de seguridad social (PILA), plan anual de trabajo, evaluaciones médicas de ingreso y periódicas, matriz de peligros y reporte anual de autoevaluación al MinTrabajo.',
    estado: 'CUMPLE',
    responsable: 'Gerente General / Responsable SG-SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Autoevaluación de estándares mínimos 100% conforme radicada en la plataforma ministerial.',
  },
  {
    id: 'actu-20',
    fase: 'ACTUAR',
    subtema: 'CIERRE DE CICLO',
    tituloSituacion: 'Normas y Guías Técnicas Colombianas: ISO 45001, ISO 14001 y GTC 24',
    normaOficial: 'ISO 45001 / ISO 14001 / GTC 24',
    entidadEmisora: 'ICONTEC / ISO',
    articulos: 'Sistemas de Gestión de SST, Ambiental y Guía Técnica de Residuos',
    area: 'INTEGRAL',
    descripcion:
      'Compilación de normas técnicas y guías voluntarias de referencia que complementan la normativa legal obligatoria colombiana:\n• ISO 45001: Sistemas de Gestión de Seguridad y Salud en el Trabajo.\n• ISO 14001: Sistemas de Gestión Ambiental.\n• GTC 24: Guía técnica para la separación en la fuente de residuos sólidos.',
    importancia:
      'Elevan los estándares de calidad, seguridad y sostenibilidad ambiental de Frikaz S.A.S. al nivel de las mejores prácticas internacionales de la industria de alimentos y snacks.',
    aplicabilidad:
      'Adopción de directrices de mejora continua en seguridad en máquinas freidoras, gestión de aspectos e impactos ambientales y clasificación técnica de residuos sólidos en la sede productiva de Bosa.',
    vigente: true,
    textoVigencia: 'Vigente',
    jurisdiccionAlcance:
      'Nacional e Internacional. Directrices técnicas aplicadas en Frikaz S.A.S.',
    evidenciaCumplimiento:
      'Manual del Sistema Integrado de Gestión adoptando directrices ISO 45001 e ISO 14001, puntos ecológicos rotulados según GTC 24 y registros de separación de residuos en la fuente.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Líder SIG',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Guías técnicas incorporadas en la cultura operativa de la pyme.',
  },
];
