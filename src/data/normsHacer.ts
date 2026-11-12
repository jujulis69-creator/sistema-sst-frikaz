import { NormaPhvaItem } from '../types/phvaEvidence';

export const NORMS_HACER: NormaPhvaItem[] = [
  // MÓDULO 1: INGRESO
  {
    id: 'hacer-01',
    fase: 'HACER',
    subtema: 'INGRESO',
    tituloSituacion: '1.1 Ingreso y Afiliaciones - SST',
    normaOficial: 'Decreto 1772 de 1994 y Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio de Trabajo y Seguridad Social',
    articulos: 'Decreto 1772/1994 y Decreto 1072/2015 (Libro 2, Parte 2, Título 4)',
    area: 'SST',
    descripcion:
      'Reglamenta la afiliación obligatoria de los trabajadores dependientes al Sistema de Seguridad Social Integral (EPS, AFP y ARL) antes de iniciar sus actividades laborales físicas.',
    importancia:
      'Al contar con contratos a término indefinido, la empresa asume la responsabilidad patronal continua. Protege a Frikaz S.A.S. de asumir directamente gastos médicos o indemnizaciones por accidentes o invalidez.',
    aplicabilidad:
      'Todo nuevo operario contratado a término indefinido para freidoras o empaque debe afiliarse a la ARL en Riesgo III (por manejo de aceites a +170 °C, fuentes de calor/gas y corte de tubérculos) y el personal administrativo en Riesgo I, con cobertura activa previa al primer día laboral.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance:
      'Nacional. Aplica a los 10 colaboradores con contrato a término indefinido.',
    evidenciaCumplimiento:
      'Contrato laboral a término indefinido firmado, formulario de afiliación a ARL con radicado previo al ingreso y planilla PILA cancelada.',
    estado: 'CUMPLE',
    responsable: 'Gestión Humana / Gerencia',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Afiliaciones 100% al día en Riesgo III para operarios y Riesgo I en oficina.',
  },
  {
    id: 'hacer-02',
    fase: 'HACER',
    subtema: 'INGRESO',
    tituloSituacion: '1.2. Exámenes Médicos Ocupacionales y Profesiograma',
    normaOficial: 'Resolución 1843 del 2025',
    entidadEmisora: 'Ministerio del Trabajo / Ministerio de Salud',
    articulos: 'Evaluaciones Médicas de Ingreso y Profesiograma',
    area: 'SST',
    descripcion:
      'Reglamenta las evaluaciones médicas ocupacionales de ingreso y exige al empleador la elaboración del Profesiograma (matriz de perfiles de cargo y factores de riesgo) para guiar la evaluación médica.',
    importancia:
      'Valora la aptitud física del aspirante antes de firmar un contrato a término indefinido, detectando restricciones y evitando el agravamiento de patologías previas en la planta.',
    aplicabilidad:
      'Acción prioritaria: Elaborar el Profesiograma de la planta. Mientras se formaliza, se debe remitir a la IPS la descripción formal del cargo para evaluar: estado osteomuscular (carga de bultos de papa de 50 kg), frotis uñero/faríngeo (manipulación de alimentos), pruebas dermatológicas y de visión.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Aplica a la totalidad del personal.',
    evidenciaCumplimiento:
      'Documento del Profesiograma firmado por profesional en SST y conceptos médicos ocupacionales de aptitud laboral emitidos por la IPS.',
    estado: 'CUMPLE',
    responsable: 'Responsable SG-SST / IPS Ocupacional',
    fechaVerificacion: '2026-09-18',
    observaciones: 'Profesiograma con énfasis en manipulación de alimentos y esfuerzo físico.',
  },
  {
    id: 'hacer-03',
    fase: 'HACER',
    subtema: 'INGRESO',
    tituloSituacion: '1.3 Inducción y Capacitación en SST',
    normaOficial: 'Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Artículo 2.2.4.6.11',
    area: 'SST',
    descripcion:
      'Obliga al empleador a impartir un programa de inducción en SST a todo trabajador nuevo antes de iniciar sus actividades, enfocándose en la identificación de peligros y prevención de riesgos.',
    importancia:
      'Previene accidentes de trabajo tempranos en los primeros días de adaptación del personal a la maquinaria y procesos.',
    aplicabilidad:
      'Capacitación obligatoria para operarios sobre: uso de paradas de emergencia en rebanadoras, selladoras y empacadoras, prevención de quemaduras por aceite caliente, control de pisos resbalosos y rutas de evacuación.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Instalaciones de Frikaz S.A.S.',
    evidenciaCumplimiento:
      'Formato de registro de inducción firmado por el trabajador, temario detallado con intensidad horaria y evaluación escrita de conocimientos aprobada.',
    estado: 'CUMPLE',
    responsable: 'Responsable SG-SST',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Inducción de 8 horas con evaluación teórica y práctica en planta.',
  },
  {
    id: 'hacer-04',
    fase: 'HACER',
    subtema: 'INGRESO',
    tituloSituacion: '1.1. Inducción y Capacitación Ambiental (BPM)',
    normaOficial: 'Resolución 2674 de 2013',
    entidadEmisora: 'Ministerio de Salud y Protección Social',
    articulos: 'Artículos 12 y 13 (Buenas Prácticas de Manufactura)',
    area: 'AMBIENTAL',
    descripcion:
      'Reglamenta las condiciones sanitarias para empresas de alimentos y establece la formación obligatoria del personal en Buenas Prácticas de Manufactura (BPM) y uso eficiente de recursos.',
    importancia:
      'Asegura la inocuidad del snack procesado, evita la contaminación de lotes y fomenta la cultura de ahorro de agua en el lavado/pelado de materia prima.',
    aplicabilidad:
      'Inducción inicial obligatoria sobre hábitos de higiene, uso de cofia/tapabocas, contención de mermas orgánicas y no vertimiento de residuos sólidos al desagüe.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Manipuladores de alimentos de la pyme.',
    evidenciaCumplimiento:
      'Certificado individual de capacitación en BPM/Manipulación de Alimentos (mínimo 10 horas anuales) e inducción ambiental registrada en carpeta.',
    estado: 'CUMPLE',
    responsable: 'Calidad / Higiene de Planta',
    fechaVerificacion: '2026-09-15',
    observaciones: 'Personal manipulador cuenta con curso de 10 horas de manipulación de alimentos.',
  },

  // MÓDULO 2: DOTACIÓN Y COMITÉS
  {
    id: 'hacer-05',
    fase: 'HACER',
    subtema: 'DOTACIÓN Y COMITÉS',
    tituloSituacion: '2.1. Creación de Comités (Vigía de SST y Comité de Convivencia)',
    normaOficial: 'Resolución 2013 de 1986',
    entidadEmisora: 'Ministerio de Trabajo y Seguridad Social',
    articulos: 'Artículo 1 / Comités Paritarios y Vigía en Pymes',
    area: 'SST',
    descripcion:
      'Reglamenta los órganos de participación en la empresa. Establece que las empresas con 10 o menos trabajadores contarán con un Vigía de SST y reglamenta la conformación del Comité de Convivencia Laboral.',
    importancia:
      'Mantiene un canal permanente para la inspección de condiciones de riesgo en planta y previene conductas de acoso laboral en relaciones de trabajo continuas.',
    aplicabilidad:
      'Al contar con exactamente 10 trabajadores:\n• Vigía de SST: 1 designado directamente por la gerencia y su suplente por un periodo de 2 años.\n• Comité de Convivencia: 2 integrantes (1 designado por la empresa y 1 elegido por votación secreta de los trabajadores).',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Ámbito interno de Frikaz S.A.S.',
    evidenciaCumplimiento:
      'Carta de designación del Vigía, acta de votación del Comité de Convivencia, actas de constitución e informes de reuniones e inspecciones realizadas.',
    estado: 'CUMPLE',
    responsable: 'Gerencia General / Trabajadores',
    fechaVerificacion: '2026-09-10',
    observaciones: 'Vigía y Comité de Convivencia conformados para el periodo 2026-2028.',
  },
  {
    id: 'hacer-06',
    fase: 'HACER',
    subtema: 'DOTACIÓN Y COMITÉS',
    tituloSituacion: '2.2. Entrega de EPP y Dotación de Calzado y Vestido de Labor',
    normaOficial: 'Código Sustantivo del Trabajo y Resolución 2400 de 1979',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'CST Artículos 230 al 235 y Resolución 2400 de 1979',
    area: 'SST',
    descripcion:
      'Dispone la entrega gratuita de calzado y vestido de labor 3 veces al año a los trabajadores que devenguen hasta 2 SMLMV, y el suministro continuo de Elementos de Protección Personal (EPP) según el riesgo.',
    importancia:
      'Constituye un derecho laboral para la nómina fija y protege físicamente al operario ante riesgos térmicos, mecánicos y salpicaduras.',
    aplicabilidad:
      '• Dotación: 3 entregas al año (abril, agosto y diciembre) de uniformes antifluido de color claro sin bolsillos superiores.\n• EPP: Delantales impermeables/térmicos, botas antideslizantes con puntera, guantes con resistencia térmica para manipular la paila de freído, protectores auditivos, tapabocas y cofias.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Personal operativo de Frikaz S.A.S.',
    evidenciaCumplimiento:
      'Formato individual de control de entrega de EPP firmado con fecha/marca y comprobantes de recibo de la dotación cuatrimestral.',
    estado: 'CUMPLE',
    responsable: 'Jefe de Planta / Responsable SG-SST',
    fechaVerificacion: '2026-09-20',
    observaciones: 'Entregas registradas en planillas individuales con fecha y firma.',
  },
  {
    id: 'hacer-07',
    fase: 'HACER',
    subtema: 'DOTACIÓN Y COMITÉS',
    tituloSituacion: '2.1. Indumentaria e Insumos Limpios Ambientalmente',
    normaOficial: 'Decreto 1076 de 2015',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulos: 'Libro 2, Parte 2, Título 2 - Sector Ambiente',
    area: 'AMBIENTAL',
    descripcion:
      'Reglamenta las medidas para prevenir la contaminación de fuentes hídricas, prohibiendo la descarga de efluentes líquidos contaminados con químicos no biodegradables provenientes del aseo o lavado de ropa de trabajo.',
    importancia:
      'Reduce la carga contaminante en las aguas residuales descargadas por la fábrica hacia la red de alcantarillado.',
    aplicabilidad:
      'Uniformes de trabajo en textil de fácil lavado y compra obligatoria de productos de aseo, detergentes y desengrasantes de carácter biodegradables para el lavado de prendas e instalaciones.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional.',
    evidenciaCumplimiento:
      'Fichas técnicas y Hojas de Seguridad de los insumos de aseo donde se certifique expresamente su condición de biodegradabilidad.',
    estado: 'CUMPLE',
    responsable: 'Compras / Gestión Ambiental',
    fechaVerificacion: '2026-09-20',
    observaciones: 'Detergentes y desengrasantes adquiridos con certificación de biodegradabilidad.',
  },

  // MÓDULO 3: RIESGOS
  {
    id: 'hacer-08',
    fase: 'HACER',
    subtema: 'RIESGOS',
    tituloSituacion: '3.1. Gestión del Riesgo Psicosocial',
    normaOficial: 'Resolución 2764 de 2019',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Batería de Instrumentos de Riesgo Psicosocial',
    area: 'SST',
    descripcion:
      'Adopta la Batería de Instrumentos para la Evaluación del Riesgo Psicosocial y reglamenta la prevención e intervención de factores intralaborales y extralaborales de estrés.',
    importancia:
      'Previene el agotamiento físico/mental, el estrés por altas temperaturas de cocción y la fatiga por movimientos repetitivos en empaque.',
    aplicabilidad:
      'Aplicación periódica de la batería de riesgo psicosocial a los 10 colaboradores bajo contrato a término indefinido por parte de un psicólogo especialista con licencia en SST.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Aplica a toda la nómina.',
    evidenciaCumplimiento:
      'Informe diagnóstico de riesgo psicosocial firmado por psicólogo especialista (con número de licencia) y plan de acción de prevención ejecutado.',
    estado: 'CUMPLE',
    responsable: 'Psicólogo Especialista SST / Gerencia',
    fechaVerificacion: '2026-08-15',
    observaciones: 'Evaluación aplicada con plan de pausas activas y control de turnos.',
  },
  {
    id: 'hacer-09',
    fase: 'HACER',
    subtema: 'RIESGOS',
    tituloSituacion: '3.2. Gestión de Riesgos Específicos (Espacios Confinados, Mecánico y Térmico)',
    normaOficial: 'Resolución 0491 de 2020',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Resolución 0491 de 2020 (Espacios Confinados) y Normas de Seguridad Mecánica',
    area: 'SST',
    descripcion:
      'Establece los requisitos técnicos y de procedimiento para prevenir accidentes durante la ejecución de labores en recintos cerrados, superficies elevadas, ambientes de alta temperatura y uso de maquinaria.',
    importancia:
      'Previene quemaduras graves por aceite caliente, atrapamientos en cortadoras/selladoras, caídas a distinto nivel o asfixia en recipientes.',
    aplicabilidad:
      '• Espacios Confinados: Protocolo LOTO (bloqueo y etiquetado) y medición de gases para la limpieza o mantenimiento interno de tanques de aceite.\n• Térmico/Mecánico: Extractores de calor sobre la freidora e instalación de guardas fijas de protección en rebanadoras y empacadoras.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Zonas operativas de la pyme.',
    evidenciaCumplimiento:
      'Matriz de Identificación de Peligros (GTC 45) actualizada, permisos de trabajo para tareas de alto riesgo y programa de mantenimiento preventivo de equipos.',
    estado: 'CUMPLE',
    responsable: 'Mantenimiento / Responsable SG-SST',
    fechaVerificacion: '2026-09-25',
    observaciones: 'Guardas mecánicas instaladas y permisos de trabajo documentados.',
  },
  {
    id: 'hacer-10',
    fase: 'HACER',
    subtema: 'RIESGOS',
    tituloSituacion: '3.1. Control de Riesgos Ambientales por Productos Químicos',
    normaOficial: 'Ley 55 de 1993 y Decreto 1496 de 2018',
    entidadEmisora: 'Ministerio del Trabajo y Ministerio de Salud',
    articulos: 'Seguridad en Productos Químicos y SGA',
    area: 'AMBIENTAL',
    descripcion:
      'Regula el uso, transporte interno y almacenamiento seguro de sustancias químicas industriales para prevenir incidentes o contingencias ecológicas.',
    importancia:
      'Evita derrames de sustancias alcalinas o desengrasantes concentrados al suelo o hacia las redes de alcantarillado público.',
    aplicabilidad:
      'Almacenamiento en áreas con cubetos de contención para sustancias como soda cáustica o desengrasantes pesados de freidoras, e instalación de la matriz de compatibilidad química.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional.',
    evidenciaCumplimiento:
      'Matriz de compatibilidad química publicada, FDS bajo norma SGA en español y kit antiderrames ambiental disponible en planta.',
    estado: 'CUMPLE',
    responsable: 'Seguridad Química / Gestión Ambiental',
    fechaVerificacion: '2026-09-25',
    observaciones: 'Kit antiderrames con material absorbente disponible junto a cubetos.',
  },

  // MÓDULO 4: RESIDUOS Y EMERGENCIAS
  {
    id: 'hacer-11',
    fase: 'HACER',
    subtema: 'RESIDUOS Y EMERGENCIAS',
    tituloSituacion: '4.1. Gestores de Residuos, Manejo de Químicos y Emergencias (SST)',
    normaOficial: 'Decreto 1496 de 2018 y Decreto 1072 de 2015',
    entidadEmisora: 'Ministerio del Trabajo',
    articulos: 'Decreto 1496 de 2018 (SGA) y Decreto 1072 de 2015 (Art. 2.2.4.6.25)',
    area: 'SST',
    descripcion:
      'Regula el etiquetado y comunicación de peligros de sustancias químicas mediante pictogramas e impone la obligación de estructurar un Plan de Prevención, Preparación y Respuesta ante Emergencias.',
    importancia:
      'Previene intoxicaciones con desengrasantes industriales y garantiza una respuesta inmediata ante fuegos de aceite o contingencias en planta.',
    aplicabilidad:
      'Disponibilidad de Hojas de Datos de Seguridad (FDS) en sitio para desengrasantes de freidoras; instalación de extintores Tipo K (acetato de potasio para aceite vegetal hirviendo) en cocina y multipropósito (ABC) en almacén.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Planta física de Frikaz S.A.S.',
    evidenciaCumplimiento:
      'FDS bajo estándar SGA visibles, etiquetado en envases secundarios, Plan de Emergencias documentado, extintores recargados y acta del simulacro anual de evacuación con fotos.',
    estado: 'CUMPLE',
    responsable: 'Brigada de Emergencias / Líder SST',
    fechaVerificacion: '2026-10-02',
    observaciones: 'Extintores Tipo K vigentes al lado de freidoras y brigada capacitada.',
  },
  {
    id: 'hacer-12',
    fase: 'HACER',
    subtema: 'RESIDUOS Y EMERGENCIAS',
    tituloSituacion: '4.1. Gestores de Residuos de Aceite Vegetal Usado (AVU)',
    normaOficial: 'Resolución 316 de 2018',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulos: 'Reglamentación del Aceite Vegetal Usado (AVU)',
    area: 'AMBIENTAL',
    descripcion:
      'Reglamenta la recolección, almacenamiento temporal, transporte y entrega de Aceite Vegetal Usado (AVU) a gestores autorizados para su posterior aprovechamiento.',
    importancia:
      'Un litro de aceite contamina 1.000 litros de agua y obstruye las redes sanitarias. Su cumplimiento evita sanciones graves y delitos ambientales.',
    aplicabilidad:
      'Frikaz S.A.S. se clasifica como Generador de AVU. Tiene estrictamente prohibido verter aceite residual por los sifones. Debe almacenarlo en canecas selladas y entregarlo a un gestor ambiental registrado.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional / Área de cocción de Frikaz S.A.S.',
    evidenciaCumplimiento:
      'Registro como generador de AVU ante la autoridad ambiental local, contrato vigente con gestor autorizado y certificados de disposición final / aprovechamiento por cada entrega.',
    estado: 'CUMPLE',
    responsable: 'Líder Ambiental / Cocina Industrial',
    fechaVerificacion: '2026-10-02',
    observaciones: 'Entrega mensual de 180-250 L/mes a gestor autorizado con certificado.',
  },
  {
    id: 'hacer-13',
    fase: 'HACER',
    subtema: 'RESIDUOS Y EMERGENCIAS',
    tituloSituacion: '4.2. Segregación de Residuos Sólidos (Código de Colores)',
    normaOficial: 'Resolución 2184 de 2019',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible / MinVivienda',
    articulos: 'Código Unificado Nacional de Colores',
    area: 'AMBIENTAL',
    descripcion:
      'Establece el código unificado de colores a nivel nacional para la separación en la fuente de los residuos sólidos (Blanco, Verde y Negro).',
    importancia:
      'Permite el aprovechamiento de empaques reciclables y la disposición adecuada de las mermas orgánicas del proceso productivo.',
    aplicabilidad:
      'Puntos ecológicos instalados en la planta:\n• Verde (Orgánicos aprovechables): Cáscaras y restos de papa, plátano o yuca.\n• Blanco (Aprovechables): Cajas de cartón seco de insumos, plásticos secos limpios.\n• Negro (No aprovechables): Servilletas con grasa, papel suelto, barrido de piso.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional.',
    evidenciaCumplimiento:
      'Puntos ecológicos instalados según el código de colores, Plan de Gestión Integral de Residuos Sólidos (PGIRS) documentado y planillas de entrega de residuos.',
    estado: 'CUMPLE',
    responsable: 'Servicios Generales / Gestión Ambiental',
    fechaVerificacion: '2026-09-25',
    observaciones: 'Puntos ecológicos señalizados en recepción, producción y empaque.',
  },
  {
    id: 'hacer-14',
    fase: 'HACER',
    subtema: 'RESIDUOS Y EMERGENCIAS',
    tituloSituacion: '4.3. Residuos Peligrosos (RESPEL)',
    normaOficial: 'Decreto 4741 de 2005',
    entidadEmisora: 'Ministerio de Ambiente, Vivienda y Desarrollo Territorial',
    articulos: 'Prevención y Manejo Integral de Residuos Peligrosos',
    area: 'AMBIENTAL',
    descripcion:
      'Regula la generación, almacenamiento temporal, transporte y eliminación final de residuos o desechos peligrosos (inflamables, corrosivos, tóxicos).',
    importancia:
      'Previene la contaminación química del suelo y de fuentes de agua, garantizando un tratamiento controlado.',
    aplicabilidad:
      'Manejo de estopas/trapos impregnados de lubricante mineral de máquinas, envases de desengrasantes concentrados y luminarias o tubos fluorescentes gastados.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional.',
    evidenciaCumplimiento:
      'Bitácora mensual de generación de RESPEL, acopio temporal con dique de contención para derrames y certificados de incineración o tratamiento expedidos por gestor con Licencia Ambiental.',
    estado: 'CUMPLE',
    responsable: 'Mantenimiento / Gestión Ambiental',
    fechaVerificacion: '2026-09-25',
    observaciones: 'Bitácora al día con certificados de disposición de gestor autorizado.',
  },
  {
    id: 'hacer-15',
    fase: 'HACER',
    subtema: 'RESIDUOS Y EMERGENCIAS',
    tituloSituacion: '4.4. Residuos de Aparatos Eléctricos y Electrónicos (RAEE) y Posconsumo',
    normaOficial: 'Ley 1672 de 2013',
    entidadEmisora: 'Congreso de la República',
    articulos: 'Gestión Integral de RAEE',
    area: 'AMBIENTAL',
    descripcion:
      'Establece los lineamientos para la recolección, transporte y aprovechamiento seguro de los equipos eléctricos y electrónicos en desuso.',
    importancia:
      'Evita que metales pesados o tarjetas electrónicas contaminen los rellenos sanitarios convencionales.',
    aplicabilidad:
      'Descarte de básculas digitales descompuestas, repuestos electrónicos de las empacadoras o baterías en puntos de recolección posconsumo.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional.',
    evidenciaCumplimiento:
      'Certificados de entrega de equipos electrónicos a programas posconsumo o gestores autorizados por la ANLA.',
    estado: 'CUMPLE',
    responsable: 'Mantenimiento / Gestión Ambiental',
    fechaVerificacion: '2026-09-20',
    observaciones: 'Entrega en punto posconsumo de baterías y tarjetas electrónicas dañadas.',
  },
  {
    id: 'hacer-16',
    fase: 'HACER',
    subtema: 'RESIDUOS Y EMERGENCIAS',
    tituloSituacion: '4.5. Envases y Empaques (Economía Circular)',
    normaOficial: 'Resolución 1407 de 2018',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulos: 'Gestión Ambiental de Envases y Empaques (ANLA)',
    area: 'AMBIENTAL',
    descripcion:
      'Reglamenta la gestión ambiental de envases y empaques de papel, cartón, plástico, vidrio y metal comercializados, promoviendo metas de reciclaje.',
    importancia:
      'Fomenta la responsabilidad extendida del productor para reducir la huella plástica de los empaques puestos en el mercado.',
    aplicabilidad:
      'Optimización en el diseño y reducción de calibre en las bolsas plásticas metalizadas de snacks, e incorporación de cajas de cartón reciclable para distribución.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance: 'Nacional.',
    evidenciaCumplimiento:
      'Plan de Gestión Ambiental de Envases y Empaques (presentado individualmente o mediante adhesión a un colectivo ante la ANLA) e informes de avance de metas de aprovechamiento.',
    estado: 'CUMPLE',
    responsable: 'Desarrollo de Producto / Gestión Ambiental',
    fechaVerificacion: '2026-09-15',
    observaciones: 'Reducción de calibre en bobina de polipropileno biorientado (BOPP).',
  },
  {
    id: 'hacer-17',
    fase: 'HACER',
    subtema: 'RESIDUOS Y EMERGENCIAS',
    tituloSituacion: '4.6. Emergencias Ambientales (Vertimientos y Emisiones Atmosféricas)',
    normaOficial: 'Resolución 0631 de 2015 y Resolución 909 de 2008',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulos: 'Resolución 0631 de 2015 (Vertimientos) y Resolución 909 de 2008 (Emisiones)',
    area: 'AMBIENTAL',
    descripcion:
      'Fija los parámetros y límites máximos permisibles de contaminantes en las descargas de aguas residuales no domésticas (ARnD) y reglamenta las descargas de humo/vapores en chimeneas fijas.',
    importancia:
      'Evita el sellamiento de la planta o multas de la autoridad ambiental por saturación de alcantarillados con grasas o generación de olores/humo en el sector.',
    aplicabilidad:
      '• Vertimientos: Construcción y mantenimiento obligatorio de una Trampa de Grasas a la salida del lavado de freidoras antes de verter al alcantarillado público.\n• Emisiones: Ductos y chimeneas sobre el área de freído con la altura reglamentaria, campana con trampa retenedora de partículas aceitosas y extractores de vapor.',
    vigente: true,
    textoVigencia: 'VIGENTE',
    jurisdiccionAlcance:
      'Local y Regional (Supervisado por la CAR o la Secretaría de Ambiente correspondiente).',
    evidenciaCumplimiento:
      'Caracterización físico-química de vertimientos líquidos emitida por laboratorio acreditado por el IDEAM, bitácora de limpieza de la Trampa de Grasas e informe técnico del estado de chimeneas.',
    estado: 'CUMPLE',
    responsable: 'Operaciones / Mantenimiento de Planta',
    fechaVerificacion: '2026-10-01',
    observaciones: 'Trampa física de grasas instalada y limpieza semanal con bitácora.',
  },
];
