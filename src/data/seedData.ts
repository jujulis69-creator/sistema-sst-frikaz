import {
  EmpresaFrikazConfig,
  Norm,
  Obligacion,
  PhvaRegistro,
  Evidencia,
  AccionCorrectiva,
  AspectoAmbiental,
  PeligroSST,
} from '../types';

export const INITIAL_EMPRESA_CONFIG: EmpresaFrikazConfig = {
  nombre: 'Frikaz S.A.S.',
  nit: '901.654.892-3',
  direccion: 'Calle 69A Sur # 80J - 14, Piamonte',
  barrio: 'Piamonte',
  localidad: 'Bosa (Localidad 7)',
  ciudad: 'Bogotá D. C.',
  departamento: 'Bogotá D.C.',
  pais: 'Colombia',
  numeroTrabajadores: 10,
  actividadEconomicaGeneral: 'Producción y comercialización de productos fritos tipo snack (papas, plátanos y chicharrones)',
  ciiuPrincipal: '1089 - Elaboración de otros productos alimenticios n.c.p. (Snacks fritos)',
  arl: 'Positiva Compañía de Seguros / Sura (En proceso de actualización de riesgo)',
  claseRiesgoSST: 'Clase II / III (Fritura industrial, calderas de cocción y maquinaria rotativa de corte)',
  justificacionClaseRiesgo:
    'Por contar con 10 trabajadores y operar freidoras industriales por inmersión de aceite vegetal a temperaturas >160°C, marmitas de sancocho y cuchillas mecánicas rebanadoras, el riesgo se evalúa técnicamente entre Clase II y III bajo Decreto 768 de 2022.',
  estandaresMinimosAplicables:
    'Resolución 0312 de 2019 - Capítulo I: 7 Estándares Mínimos (Unidades de 10 o menos trabajadores en Clase I, II o III). Requiere además cumplimiento de normas de manipulación de alimentos y normatividad general de seguridad.',
  procesosProductivos: [
    'Recepción e inspección de materias primas (papa pastusa/capira, plátano macho verde, tocino/lonja de cerdo)',
    'Lavado por inmersión y pelado mecánico de tubérculos',
    'Rebanado y corte calibrado con discos giratorios',
    'Pre-cocción/sancochado de chicharrones en marmita',
    'Fritura continua por inmersión en aceite vegetal caliente (160°C - 180°C)',
    'Desaceitado y centrifugado para reducción de tenor graso',
    'Sazonado, salado y dosificación de especias',
    'Empaque, pesaje y sellado térmico continuo en bolsas bilaminadas',
    'Embalaje en cajas de cartón y despacho comercial a tiendas y distribuidores',
  ],
  maquinariaUtilizada: [
    'Freidoras industriales dobles de acero inoxidable con quemadores a gas y termostato digital',
    'Rebanadora/cortadora rotativa de papas y plátanos con cuchillas de acero inoxidable',
    'Peladora abrasiva mecánica con suministro continuo de agua',
    'Marmita en acero inoxidable para escaldado de chicharrón',
    'Centrífuga desaceitadora con canasta perforada',
    'Selladora de banda continua horizontal con fechador y codificador térmico',
    'Campana extractora de vahos y humos con trampa de grasas en ducto y filtro metálico',
    'Balanza electrónica de precisión comercial (0-15 kg)',
  ],
  insumosPrincipales: [
    'Papa fresca (variedades R-12 / Capira / Pastusa)',
    'Plátano macho verde (procedencia nacional)',
    'Tocino y piel de cerdo con registro INVIMA',
    'Aceite vegetal comestible (palma y soya refinado)',
    'Sal refinada yodada y fluorada, condimentos grado alimenticio',
    'Película flexible de polipropileno biorientado (BOPP) bilaminado para empaque',
    'Gas natural industrial / GLP para quemadores de freidoras',
    'Agua potable de la red distrital (Acueducto de Bogotá)',
    'Detergentes biodegradables y desinfectantes aprobados para industria de alimentos',
  ],
  residuosGenerados: [
    'Cáscaras y restos orgánicos vegetales (aprovechables verdes)',
    'Aceite de Cocina Usado (ACU) retirado de freidoras tras degradación oxidativa',
    'Borras, carboncillo y sedimentos quemados de fritura',
    'Aguas residuales no domésticas (ARnD) con alta carga de grasas, aceites y almidones',
    'Retales y recortes de bolsas plásticas bilaminadas (BOPP)',
    'Cajas de cartón corrugado y papel craft limpio de embalaje',
    'Lodos retenidos en la trampa de grasa',
    'Residuos ordinarios no aprovechables (servilletas con grasa, barreduras)',
  ],
  condicionesAmbientales: [
    'Ubicación urbana en sector mixto residencial-industrial de Bosa Piamonte',
    'Descarga de aguas residuales a la red de alcantarillado público distrital de Bogotá (EAAB)',
    'Trampa de grasa física instalada en la línea de lavado y freidoras (requiere bitácora de limpieza)',
    'Emisión de vahos de fritura mediante campana extractora y ducto vertical sobre cubierta',
    'Generación de ruido mecánico moderado por extractores y motores de corte (dentro del límite diurno)',
  ],
};

export const INITIAL_NORMS: Norm[] = [
  {
    id: 'norm-sst-01',
    codigoIdentificador: 'NOR-SST-001',
    area: 'SST',
    tipoDisposicion: 'Decreto Único Reglamentario',
    numero: '1072',
    anio: 2015,
    nombreOficial:
      'Decreto Único Reglamentario del Sector Trabajo - Título 4, Capítulo 6: Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST)',
    entidadEmisora: 'Ministerio del Trabajo de Colombia',
    articulosAplicables: 'Artículos 2.2.4.6.1 al 2.2.4.6.37',
    descripcion:
      'Compila y reglamenta de forma obligatoria las directrices para la implementación del Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST) para todos los empleadores públicos y privados en el territorio colombiano.',
    importanciaFrikaz:
      'Es la norma marco que exige a Frikaz S.A.S. estructurar una política formal, objetivos, asignación de recursos, gestión de peligros en la planta de fritos y plan anual de trabajo para proteger a los 10 operarios.',
    aplicabilidadConcreta:
      'Frikaz S.A.S. debe formular la Política de SST firmada por gerencia, asignar responsabilidades, realizar evaluación inicial y mantener el plan anual de trabajo debidamente documentado.',
    jurisdiccion: 'Nacional',
    alcance:
      'Aplica a todo el personal de Frikaz S.A.S. (10 trabajadores vinculados directa o indirectamente), contratistas, proveedores y visitantes en la sede de Bosa Piamonte.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas:
      'Aclarado en estándares mínimos por la Resolución 0312 de 2019 y circular anual de reporte de autoevaluación.',
    fechaUltimaConsulta: '2026-09-15',
    fuenteOficial: 'SUIN-Juriscol / Ministerio del Trabajo',
    enlaceFuente: 'https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Decretos/30019946',
    responsable: 'Gerente General / Responsable SST Frikaz',
    estadoRevision: 'Revisada',
    observaciones:
      'Base estructural del SG-SST de la empresa. Revisada con vigencia plena en plataforma oficial.',
  },
  {
    id: 'norm-sst-02',
    codigoIdentificador: 'NOR-SST-002',
    area: 'SST',
    tipoDisposicion: 'Resolución',
    numero: '0312',
    anio: 2019,
    nombreOficial:
      'Por la cual se definen los Estándares Mínimos del Sistema de Gestión de la Seguridad y Salud en el Trabajo SG-SST',
    entidadEmisora: 'Ministerio del Trabajo',
    articulosAplicables: 'Artículos 3 al 8 (Capítulo I: 7 Estándares Mínimos para empresas <= 10 trabajadores)',
    descripcion:
      'Establece los estándares mínimos de obligatorio cumplimiento que deben aplicar los empleadores con diez (10) o menos trabajadores clasificados con riesgo I, II o III, simplificando la carga documental a 7 requisitos esenciales.',
    importanciaFrikaz:
      'Determina con exactitud técnica los 7 estándares que la ley exige a Frikaz S.A.S. para estar 100% blindada ante requerimientos del Ministerio del Trabajo y la ARL.',
    aplicabilidadConcreta:
      'Cumplir estrictamente con: 1) Asignación de responsable con curso 50h SST, 2) Afiliación a seguridad social (salud, pensión, ARL), 3) Capacitación en SST, 4) Plan Anual de Trabajo, 5) Evaluaciones médicas ocupacionales, 6) Identificación de peligros (GTC 45) y 7) Medidas de prevención y control.',
    jurisdiccion: 'Nacional',
    alcance:
      'Empresas, empleadores y contratantes con diez o menos trabajadores clasificados en riesgo I, II o III.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Rige desde su publicación y derogó la anterior Resolución 1111 de 2017.',
    fechaUltimaConsulta: '2026-09-18',
    fuenteOficial: 'Gestor Normativo de Función Pública / MinTrabajo',
    enlaceFuente:
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=91368',
    responsable: 'Líder SST / Asesor Externo con Licencia SST',
    estadoRevision: 'Revisada',
    observaciones:
      'Los 7 estándares representan la médula de auditoría obligatoria para Frikaz S.A.S.',
  },
  {
    id: 'norm-sst-03',
    codigoIdentificador: 'NOR-SST-003',
    area: 'SST',
    tipoDisposicion: 'Ley',
    numero: '9',
    anio: 1979,
    nombreOficial:
      'Código Sanitario Nacional - Título III: Salud Ocupacional y Normas Generales de Preservación del Medio Ambiente',
    entidadEmisora: 'Congreso de la República de Colombia',
    articulosAplicables: 'Artículos 80 al 154 (Salud Ocupacional en lugares de trabajo)',
    descripcion:
      'Establece las normas para preservar, conservar y mejorar la salud de los individuos en sus ocupaciones, regular condiciones de higiene industrial, recipientes sometidos a presión y calor, y orden y aseo.',
    importanciaFrikaz:
      'Obliga a mantener condiciones seguras de ventilación, pisos no resbaladizos con grasa, protección contra superficies calientes y suministro de agua potable y servicios higiénicos.',
    aplicabilidadConcreta:
      'Instalar protectores y aislamiento térmico en freidoras, garantizar desengrase diario de pisos para evitar resbalones y suministrar agua potable y casilleros a los 10 operarios.',
    jurisdiccion: 'Nacional',
    alcance: 'Todo lugar de trabajo y actividad industrial en el territorio nacional.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas:
      'Permanentemente vigente con múltiples desarrollos reglamentarios posteriores.',
    fechaUltimaConsulta: '2026-08-30',
    fuenteOficial: 'SUIN-Juriscol',
    enlaceFuente: 'https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1572520',
    responsable: 'Jefe de Planta / Administrador Frikaz',
    estadoRevision: 'Revisada',
    observaciones: 'Pilar histórico de la salud ocupacional y saneamiento en Colombia.',
  },
  {
    id: 'norm-sst-04',
    codigoIdentificador: 'NOR-SST-004',
    area: 'SST',
    tipoDisposicion: 'Resolución',
    numero: '2400',
    anio: 1979,
    nombreOficial:
      'Estatuto de Seguridad Industrial - Por la cual se establecen algunas disposiciones sobre vivienda, higiene y seguridad en los establecimientos de trabajo',
    entidadEmisora: 'Ministerio de Trabajo y Seguridad Social',
    articulosAplicables:
      'Artículos 170-178 (EPP), Artículos 296-302 (Calor y hornos/freidoras), Artículos 17-28 (Edificaciones y pisos)',
    descripcion:
      'Norma técnica detallada sobre resguardos de maquinaria con partes móviles (cuchillas de rebanado), prevención y control de incendios en cocinas industriales, y suministro gratuito de elementos de protección personal (EPP).',
    importanciaFrikaz:
      'La operación de freidoras a gas/aceite hirviendo y rebanadoras mecánicas exige resguardos en cuchillas, delantales impermeables/térmicos, guantes para alta temperatura y extintores tipo K.',
    aplicabilidadConcreta:
      'Dotar a los operarios de freidoras con guantes térmicos de caña larga, careta facial contra salpicaduras de aceite, delantal impermeable y dotar la planta con extintor de acetato de potasio (Clase K) para grasas.',
    jurisdiccion: 'Nacional',
    alcance: 'Establecimientos industriales con fuentes de calor y maquinaria mecánica.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Vigente con complementos del Decreto 1072 de 2015.',
    fechaUltimaConsulta: '2026-09-02',
    fuenteOficial: 'MinTrabajo / SUIN-Juriscol',
    enlaceFuente: 'https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Resolucion/2400-1979',
    responsable: 'Responsable SST / Operaciones',
    estadoRevision: 'Revisada',
    observaciones:
      'Crucial para el control de riesgos de quemaduras térmicas y amputaciones en corte de papa/plátano.',
  },
  {
    id: 'norm-sst-05',
    codigoIdentificador: 'NOR-SST-005',
    area: 'SST',
    tipoDisposicion: 'Resolución',
    numero: '2013',
    anio: 1986,
    nombreOficial:
      'Por la cual se reglamenta la organización y funcionamiento de los comités de medicina, higiene y seguridad industrial (Vigía de SST / COPASST)',
    entidadEmisora: 'Ministerio de Trabajo y Seguridad Social y MinSalud',
    articulosAplicables: 'Artículo 2 y 3 (Designación de Vigía de SST para empresas de menos de 10 trabajadores o COPASST al llegar a 10)',
    descripcion:
      'Reglamenta la participación de los trabajadores en la prevención de riesgos laborales. Para empresas con exactamente 10 trabajadores se conforma el COPASST con un representante principal y suplente por cada parte, o el Vigía de SST si el número promedio es inferior.',
    importanciaFrikaz:
      'Al contar exactamente con 10 trabajadores, Frikaz S.A.S. debe tener constituida y activa la figura de representación (Vigía de SST o COPASST de 1 representante por parte) con actas mensuales de inspección.',
    aplicabilidadConcreta:
      'Elegir al representante de los trabajadores por votación libre, designar al del empleador, levantar acta de constitución y programar reuniones e inspecciones mensuales de seguridad.',
    jurisdiccion: 'Nacional',
    alcance: 'Todos los centros de trabajo de Frikaz S.A.S.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Compilada y complementada por el Decreto 1072 de 2015 Art. 2.2.4.6.8.',
    fechaUltimaConsulta: '2026-09-10',
    fuenteOficial: 'Función Pública',
    enlaceFuente: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=13598',
    responsable: 'Gerente General / Vigía de SST',
    estadoRevision: 'Revisada',
    observaciones: 'Obligatorio mantener carpeta con actas mensuales firmadas.',
  },
  {
    id: 'norm-sst-06',
    codigoIdentificador: 'NOR-SST-006',
    area: 'SST',
    tipoDisposicion: 'Resolución',
    numero: '652',
    anio: 2012,
    nombreOficial:
      'Por la cual se define la conformación y funcionamiento del Comité de Convivencia Laboral en entidades públicas y empresas privadas',
    entidadEmisora: 'Ministerio del Trabajo',
    articulosAplicables: 'Artículos 1 al 14 (Modificada por Resolución 1356 de 2012)',
    descripcion:
      'Establece medidas preventivas y correctivas del acoso laboral. Para empresas con menos de 20 trabajadores, el comité estará integrado por dos (2) miembros: un representante de los trabajadores y uno del empleador.',
    importanciaFrikaz:
      'Obliga a Frikaz S.A.S. a tener formalmente conformado su Comité de Convivencia Laboral bipartito para prevenir conductas de acoso y garantizar ambiente laboral armónico.',
    aplicabilidadConcreta:
      'Conformar el comité con 1 delegado de gerencia y 1 de operarios elegidos por votación, sesionar trimestralmente y mantener acta de confidencialidad.',
    jurisdiccion: 'Nacional',
    alcance: 'Todo el personal laboral de Frikaz S.A.S.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Modificada en su conformación para microempresas por la Resolución 1356 de 2012.',
    fechaUltimaConsulta: '2026-09-12',
    fuenteOficial: 'MinTrabajo / SUIN-Juriscol',
    enlaceFuente: 'https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Resolucion/652-2012',
    responsable: 'Comité de Convivencia / Gerencia',
    estadoRevision: 'Revisada',
    observaciones: 'Reuniones ordinarias cada 3 meses según Res 1356 de 2012.',
  },
  {
    id: 'norm-amb-01',
    codigoIdentificador: 'NOR-AMB-001',
    area: 'Ambiental',
    tipoDisposicion: 'Resolución',
    numero: '316',
    anio: 2018,
    nombreOficial:
      'Por la cual se establecen disposiciones respecto de la gestión de los Aceites de Cocina Usados (ACU) y se dictan otras disposiciones',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible (MADS)',
    articulosAplicables: 'Artículos 4, 5, 6, 7 y 8 (Obligaciones de los Generadores Industriales y Comerciales de ACU)',
    descripcion:
      'Reglamenta integralmente la recolección, almacenamiento y disposición de Aceites de Cocina Usados (ACU) en todo el territorio nacional, prohibiendo su vertimiento al alcantarillado público o su reutilización ilegal para consumo humano o animal.',
    importanciaFrikaz:
      'NORMA CRÍTICA AMBIENTAL: Frikaz S.A.S. es un generador industrial de ACU derivado de la fritura de papa, plátano y chicharrón. El incumplimiento acarrea multas graves y clausura por parte de la Secretaría Distrital de Ambiente de Bogotá.',
    aplicabilidadConcreta:
      'Inscribirse como Generador de ACU ante la Secretaría Distrital de Ambiente (SDA) de Bogotá; almacenar el aceite usado en bidones plásticos herméticos etiquetados y en zona techada; entregarlo exclusivamente a un gestor de ACU autorizado por la SDA; exigir certificado de recolección y llevar libro de registro de entregas.',
    jurisdiccion: 'Nacional y Distrital (Bogotá D.C.)',
    alcance:
      'Toda la línea de fritura de Frikaz S.A.S., personal de cocina industrial y gestores ambientales contratados.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas:
      'Articulada con el Registro de Generadores de ACU de la Secretaría Distrital de Ambiente de Bogotá.',
    fechaUltimaConsulta: '2026-09-20',
    fuenteOficial: 'Ministerio de Ambiente y Desarrollo Sostenible / SDA Bogotá',
    enlaceFuente: 'https://www.minambiente.gov.co/documento-normativa/resolucion-316-de-2018/',
    responsable: 'Jefe de Planta / Coordinador de Gestión Ambiental Frikaz',
    estadoRevision: 'Revisada',
    observaciones:
      'Exige bitácora de control de recambio de aceite y archivo físico/digital de manifiestos del gestor.',
  },
  {
    id: 'norm-amb-02',
    codigoIdentificador: 'NOR-AMB-002',
    area: 'Ambiental',
    tipoDisposicion: 'Resolución',
    numero: '2184',
    anio: 2019,
    nombreOficial:
      'Por la cual se modifica la Resolución 668 de 2016 y se adopta el formato para el uso racional de bolsas plásticas y el código unificado de colores para la separación de residuos en la fuente',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible y MinVivienda',
    articulosAplicables: 'Artículo 4 (Código de colores blanco, verde y negro)',
    descripcion:
      'Establece el código obligatorio nacional de colores para la separación de residuos sólidos en la fuente: Blanco (aprovechables limpios: cartón, plástico), Verde (orgánicos aprovechables: restos agrícolas), Negro (no aprovechables: barrido, servilletas usadas).',
    importanciaFrikaz:
      'En la producción de snacks se generan altos volúmenes de cáscara de papa y plátano (verde), cajas y retales limpios de plástico (blanco), y residuos de aseo (negro). La separación adecuada es exigible en inspecciones de la SDA y la Alcaldía Local de Bosa.',
    aplicabilidadConcreta:
      'Dotar los puntos ecológicos en la planta con canecas rotuladas verde, blanca y negra; capacitar a los 10 trabajadores y entregar orgánicos y reciclables a rutas o asociaciones autorizadas.',
    jurisdiccion: 'Nacional',
    alcance: 'Área de producción, empaque, comedor y oficinas de Frikaz S.A.S.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Vigente y obligatoria a nivel nacional desde el 1 de enero de 2021.',
    fechaUltimaConsulta: '2026-09-14',
    fuenteOficial: 'MinAmbiente / Función Pública',
    enlaceFuente:
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=105574',
    responsable: 'Encargado de Servicios Generales y Gestión Ambiental',
    estadoRevision: 'Revisada',
    observaciones: 'Puntos ecológicos señalizados instalados en zona de pelado y empaque.',
  },
  {
    id: 'norm-amb-03',
    codigoIdentificador: 'NOR-AMB-003',
    area: 'Ambiental',
    tipoDisposicion: 'Resolución',
    numero: '0631',
    anio: 2015,
    nombreOficial:
      'Por la cual se establecen los parámetros y los valores límites máximos permisibles en los vertimientos puntuales a cuerpos de aguas superficiales y a los sistemas de alcantarillado público',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulosAplicables:
      'Capítulo V, Artículo 10 (Sector industrial de elaboración de productos alimenticios y grasas)',
    descripcion:
      'Regula los límites de concentración de Grasas y Aceites, DBO5, DQO, Sólidos Suspendidos Totales (SST) y pH vertidos al alcantarillado público de las actividades de procesamiento de alimentos.',
    importanciaFrikaz:
      'El lavado de papas (almidón) y la limpieza de freidoras/utensilios generan aguas residuales no domésticas (ARnD) con contenido graso que no pueden ser arrojadas directamente al alcantarillado sin tratamiento previo de trampa de grasa.',
    aplicabilidadConcreta:
      'Operar y mantener permanentemente una trampa de grasas eficiente antes de la descarga a la red de la EAAB, registrar la limpieza periódica y asegurar que no haya descargas directas de aceite usado.',
    jurisdiccion: 'Nacional',
    alcance: 'Línea de lavado, área de freidoras y tubería de descarga a red pública de Bosa.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Articulada a nivel local con la Resolución SDA 3957 de 2009 de Bogotá.',
    fechaUltimaConsulta: '2026-09-08',
    fuenteOficial: 'MinAmbiente / SUIN-Juriscol',
    enlaceFuente:
      'https://www.minambiente.gov.co/documento-normativa/resolucion-0631-de-2015/',
    responsable: 'Jefe de Planta / Operaciones',
    estadoRevision: 'Revisada',
    observaciones:
      'Se requiere registro de vertimientos y control de lodos de la trampa de grasa.',
  },
  {
    id: 'norm-amb-04',
    codigoIdentificador: 'NOR-AMB-004',
    area: 'Ambiental',
    tipoDisposicion: 'Norma Técnica Distrital',
    numero: '3957',
    anio: 2009,
    nombreOficial:
      'Por la cual se establece la norma técnica, para el control y manejo de los vertimientos realizados a la red de alcantarillado público en el Distrito Capital',
    entidadEmisora: 'Secretaría Distrital de Ambiente de Bogotá (SDA)',
    articulosAplicables: 'Artículos 3 al 18 (Registro de Vertimientos y obligaciones de usuarios no residenciales en Bogotá)',
    descripcion:
      'Disposición regulatoria distrital específica para Bogotá D.C. que obliga a establecimientos comerciales e industriales que vierten aguas residuales no domésticas (grasas, alimentos) a registrar su vertimiento ante la SDA y presentar caracterización cuando la autoridad lo requiera.',
    importanciaFrikaz:
      'Al estar ubicada en la localidad de Bosa en Bogotá D.C., Frikaz S.A.S. se encuentra bajo la jurisdicción directa de la SDA y de la Empresa de Acueducto y Alcantarillado de Bogotá (EAAB).',
    aplicabilidadConcreta:
      'Radicar el Registro de Vertimientos ante la ventanilla ambiental de la SDA, mantener la hoja de vida de la trampa de grasas y entregar los lodos a empresa de saneamiento autorizada.',
    jurisdiccion: 'Distrital (Bogotá D.C.)',
    alcance: 'Instalaciones productivas de Frikaz S.A.S. en Bogotá.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Vigente y fiscalizada por la SDA mediante visitas técnicas de inspección.',
    fechaUltimaConsulta: '2026-09-05',
    fuenteOficial: 'Secretaría Distrital de Ambiente de Bogotá (SDA)',
    enlaceFuente: 'https://www.ambientebogota.gov.co/normatividad-distrital',
    responsable: 'Gerencia General / Asesor Ambiental',
    estadoRevision: 'En revisión',
    observaciones:
      'Pendiente verificar actualización del radicado del registro ante la plataforma de la SDA.',
  },
  {
    id: 'norm-amb-05',
    codigoIdentificador: 'NOR-AMB-005',
    area: 'Ambiental',
    tipoDisposicion: 'Resolución',
    numero: '1407',
    anio: 2018,
    nombreOficial:
      'Por la cual se reglamenta la gestión ambiental de los residuos de envases y empaques de papel, cartón, plástico, vidrio, metal y se modifica la Resolución 1344 de 2020',
    entidadEmisora: 'Ministerio de Ambiente y Desarrollo Sostenible',
    articulosAplicables: 'Artículos 2, 4 y 6 (Productores y comercializadores que ponen empaques en el mercado nacional)',
    descripcion:
      'Fija metas de recolección y aprovechamiento de residuos de envases y empaques puestos en el mercado colombiano mediante planes individuales o colectivos a través de la ANDI o gremios afines.',
    importanciaFrikaz:
      'Frikaz S.A.S. envasa snacks en bolsas de plástico (BOPP bilaminado) y los distribuye en el mercado, por lo que debe evaluar su condición de productor/envasador respecto a las metas de aprovechamiento.',
    aplicabilidadConcreta:
      'Evaluar el tonelaje anual de plástico BOPP y cartón puesto en el mercado. Si califica según umbrales de MADS, adherirse a un plan colectivo de posconsumo o certificar trazabilidad con el proveedor del empaque.',
    jurisdiccion: 'Nacional',
    alcance: 'Productos envasados comercializados por Frikaz S.A.S.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Modificada por la Resolución 1344 de 2020 y Resolución 2184 de 2019.',
    fechaUltimaConsulta: '2026-08-22',
    fuenteOficial: 'MinAmbiente',
    enlaceFuente: 'https://www.minambiente.gov.co/documento-normativa/resolucion-1407-de-2018/',
    responsable: 'Comercial / Gerencia Frikaz',
    estadoRevision: 'En revisión',
    observaciones:
      'Se está cuantificando el peso total de películas plásticas adquiridas en el último ejercicio contable.',
  },
  {
    id: 'norm-amb-06',
    codigoIdentificador: 'NOR-AMB-006',
    area: 'Ambiental',
    tipoDisposicion: 'Ley',
    numero: '373',
    anio: 1997,
    nombreOficial:
      'Por la cual se establece el programa para el uso eficiente y ahorro del agua',
    entidadEmisora: 'Congreso de la República de Colombia',
    articulosAplicables: 'Artículos 1, 2, 3 y 4',
    descripcion:
      'Dispone que toda entidad usuaria del recurso hídrico debe formular y ejecutar un Programa de Uso Eficiente y Ahorro del Agua (PUEAA) que incluya tecnologías ahorradoras y reducción de pérdidas.',
    importanciaFrikaz:
      'El proceso de lavado y pelado de tubérculos demanda agua continuamente. El uso eficiente previene sobrecostos tarifarios de la EAAB y minimiza el volumen de aguas residuales generadas.',
    aplicabilidadConcreta:
      'Implementar boquillas aspersoras economizadoras en la peladora mecánica, monitorear el consumo mensual por kilogramo de papa procesada y capacitar al personal.',
    jurisdiccion: 'Nacional',
    alcance: 'Área de lavado de tubérculos y servicios sanitarios.',
    estadoVigencia: 'Vigente verificada',
    modificacionesIdentificadas: 'Vigente y articulada con las políticas de ahorro de la EAAB.',
    fechaUltimaConsulta: '2026-08-15',
    fuenteOficial: 'SUIN-Juriscol',
    enlaceFuente: 'https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1657662',
    responsable: 'Jefe de Planta / Operarios de lavado',
    estadoRevision: 'Revisada',
    observaciones:
      'Monitoreo bimestral de metros cúbicos consumidos contra recibo de la EAAB.',
  },
];

export const INITIAL_OBLIGACIONES: Obligacion[] = [
  {
    id: 'obl-01',
    codigo: 'OBL-SST-001',
    normaId: 'norm-sst-02',
    articuloNumeral: 'Artículo 3, Estándar 1 (Res. 0312/2019)',
    descripcionObligacion:
      'Asignar una persona responsable del diseño e implementación del Sistema de Gestión de SST con el curso virtual de 50 horas de SST o técnico/tecnólogo en SST para empresas en riesgo I, II o III.',
    justificacionAplicabilidad:
      'Frikaz S.A.S. cuenta con 10 trabajadores y por ley debe contar con un responsable asignado y certificado.',
    actividadNecesaria:
      'Designar formalmente mediante carta firmada por la gerencia al líder de SST y adjuntar certificado vigente de 50 horas / 20 horas de actualización.',
    responsable: 'Gerente General (Frikaz S.A.S.)',
    fechaLimite: '2026-10-30',
    frecuencia: 'Anual',
    recursosNecesarios: 'Presupuesto para actualización de curso y horas de dedicación asignadas.',
    indicadorCumplimiento: 'Carta de asignación firmada y certificado de capacitación vigente al 100%.',
    evidenciaRequerida: 'Carta de designación firmada por gerencia y certificado SENA/MinTrabajo 50h SST.',
    estadoCumplimiento: 'Cumple y tiene evidencia verificada',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-09-20',
    observaciones: 'Designación actualizada para el periodo 2026.',
  },
  {
    id: 'obl-02',
    codigo: 'OBL-SST-002',
    normaId: 'norm-sst-02',
    articuloNumeral: 'Artículo 3, Estándar 2 (Res. 0312/2019)',
    descripcionObligacion:
      'Afiliación a los Sistemas Generales de Seguridad Social en Salud, Pensión y Riesgos Laborales (ARL) de la totalidad de los diez (10) trabajadores.',
    justificacionAplicabilidad:
      'Ningún trabajador de producción o comercialización puede operar sin cobertura de ARL y EPS.',
    actividadNecesaria:
      'Verificar mensualmente la planilla integrada de liquidación de aportes (PILA) de los 10 trabajadores.',
    responsable: 'Gestión Humana y Nómina',
    fechaLimite: '2026-10-15',
    frecuencia: 'Mensual',
    recursosNecesarios: 'Presupuesto de seguridad social y plataforma SOI/Aportes en Línea.',
    indicadorCumplimiento: '10 de 10 trabajadores con aporte pagado antes del día 10 de cada mes.',
    evidenciaRequerida: 'Comprobante de pago de Planilla PILA del mes en curso y soporte de ARL.',
    estadoCumplimiento: 'Cumple y tiene evidencia verificada',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-10-05',
    observaciones: 'Todos los operarios de freidoras y corte cuentan con afiliación activa.',
  },
  {
    id: 'obl-03',
    codigo: 'OBL-SST-003',
    normaId: 'norm-sst-02',
    articuloNumeral: 'Artículo 3, Estándar 3 (Res. 0312/2019)',
    descripcionObligacion:
      'Elaborar y ejecutar el Programa de Capacitación en Seguridad y Salud en el Trabajo, enfocado en riesgos de quemaduras, corte, primeros auxilios y manipulación de alimentos.',
    justificacionAplicabilidad:
      'Los operarios de freidoras y rebanadoras deben recibir inducción y reentrenamiento para prevenir accidentes graves.',
    actividadNecesaria:
      'Ejecutar las sesiones programadas: 1) Prevención de quemaduras con aceite caliente, 2) Uso seguro de rebanadoras, 3) Manejo de extintor Clase K.',
    responsable: 'Responsable SST / ARL',
    fechaLimite: '2026-10-25',
    frecuencia: 'Trimestral',
    recursosNecesarios: 'Salón o área de descanso, presentaciones, refrigerio y asesor de la ARL.',
    indicadorCumplimiento: 'Número de trabajadores capacitados / 10 trabajadores totales >= 90%.',
    evidenciaRequerida: 'Cronograma anual de capacitación, listas de asistencia firmadas y evaluaciones.',
    estadoCumplimiento: 'Cumple parcialmente',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-09-18',
    observaciones: 'Se ejecutó módulo de primeros auxilios; falta el módulo práctico de extintor Clase K.',
  },
  {
    id: 'obl-04',
    codigo: 'OBL-SST-004',
    normaId: 'norm-sst-02',
    articuloNumeral: 'Artículo 3, Estándar 5 (Res. 0312/2019)',
    descripcionObligacion:
      'Realizar las evaluaciones médicas ocupacionales periódicas, de ingreso y egreso con médico especialista en medicina del trabajo, incluyendo frotis faríngeo y KOH para manipuladores de alimentos.',
    justificacionAplicabilidad:
      'Por ser fábrica de fritos, se requiere certificación médica ocupacional con énfasis osteomuscular y de aptitud para manipulación higiénica de alimentos.',
    actividadNecesaria:
      'Remitir a los 10 trabajadores al centro de salud ocupacional autorizado para exámenes periódicos anuales.',
    responsable: 'Responsable SST / Gerente',
    fechaLimite: '2026-10-12',
    frecuencia: 'Anual',
    recursosNecesarios: 'Presupuesto de exámenes médicos ocupacionales ($120.000 por trabajador aprox).',
    indicadorCumplimiento: '10 certificados de aptitud médica emitidos y recomendaciones implementadas.',
    evidenciaRequerida: 'Conceptos médicos ocupacionales de aptitud física y manipulación de alimentos.',
    estadoCumplimiento: 'No cumple',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-09-10',
    observaciones:
      'Vencidos los exámenes periódicos anuales de 4 operarios de la línea de fritura desde agosto 2026.',
  },
  {
    id: 'obl-05',
    codigo: 'OBL-SST-005',
    normaId: 'norm-sst-04',
    articuloNumeral: 'Artículos 170-178 (Res. 2400/1979)',
    descripcionObligacion:
      'Suministro gratuito y reposición inmediata de Elementos de Protección Personal (EPP) específicos: guantes de nitrilo térmico para alta temperatura, careta facial, delantal de carnaza/impermeable y calzado con suela antideslizante con puntera.',
    justificacionAplicabilidad:
      'La temperatura del aceite en freidoras alcanza 170°C y el suelo presenta grasitud por lo que el calzado y los guantes son vitales.',
    actividadNecesaria:
      'Entregar dotación con formato de entrega firmado, inspeccionar estado semanalmente y reponer por desgaste.',
    responsable: 'Jefe de Planta / Líder SST',
    fechaLimite: '2026-10-20',
    frecuencia: 'Permanente',
    recursosNecesarios: 'Stock de seguridad de EPP en almacén de planta.',
    indicadorCumplimiento: '100% de operarios con EPP reglamentario y formato de entrega firmado.',
    evidenciaRequerida: 'Registros de entrega de EPP firmados por los operarios e inspecciones de uso.',
    estadoCumplimiento: 'Cumple y tiene evidencia verificada',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-09-28',
    observaciones: 'Dotación entregada en septiembre 2026. Se mantiene stock de guantes térmicos.',
  },
  {
    id: 'obl-06',
    codigo: 'OBL-AMB-001',
    normaId: 'norm-amb-01',
    articuloNumeral: 'Artículos 4, 6 y 7 (Res. 316/2018 MADS)',
    descripcionObligacion:
      'Registro oficial como Generador Industrial de Aceite de Cocina Usado (ACU) ante la Secretaría Distrital de Ambiente de Bogotá (SDA), almacenamiento en bidones rotulados con dique antiderrames y entrega exclusiva a gestores autorizados con certificado de disposición final o valorización.',
    justificacionAplicabilidad:
      'Frikaz S.A.S. produce cerca de 180 a 250 litros de aceite usado al mes procedentes de sus freidoras continuas.',
    actividadNecesaria:
      '1) Mantener registro activo en el aplicativo SDA de ACU. 2) Almacenar en recipientes con rótulo de ACU. 3) Entregar a gestor con manifiesto y certificado.',
    responsable: 'Coordinador Ambiental / Jefe de Planta',
    fechaLimite: '2026-11-05',
    frecuencia: 'Permanente',
    recursosNecesarios: 'Bidones plásticos de 55 galones con tapa aro, dique de retención y gestor contratado.',
    indicadorCumplimiento: 'Litros entregados a gestor con certificado / Litros de ACU generados = 100%.',
    evidenciaRequerida:
      'Certificados de recolección de ACU del gestor autorizado por la SDA y bitácora de generación.',
    estadoCumplimiento: 'Cumple y tiene evidencia verificada',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-09-25',
    observaciones:
      'Convenio activo con gestor ambiental autorizado por la SDA. Última entrega de 220 L en septiembre.',
  },
  {
    id: 'obl-07',
    codigo: 'OBL-AMB-002',
    normaId: 'norm-amb-02',
    articuloNumeral: 'Artículo 4 (Res. 2184/2019 MADS)',
    descripcionObligacion:
      'Implementación del código unificado de colores (Verde para cáscaras orgánicas de papa/plátano, Blanco para plásticos limpios y cartón, Negro para no aprovechables) en todos los puntos ecológicos de la fábrica.',
    justificacionAplicabilidad:
      'Generación diaria de cáscara y retales plásticos en Bosa exige separación estricta para recolección selectiva.',
    actividadNecesaria:
      'Verificar estado de canecas, bolsas plásticas del color correspondiente y entrega de cáscara a gestor de compostaje.',
    responsable: 'Servicios Generales / Auxiliar de Producción',
    fechaLimite: '2026-10-18',
    frecuencia: 'Permanente',
    recursosNecesarios: 'Bolsas plásticas calibre 2 de colores verde, blanco y negro y canecas de 53 litros.',
    indicadorCumplimiento: 'Puntos ecológicos con código de color completo = 3 de 3.',
    evidenciaRequerida: 'Registro fotográfico de puntos ecológicos y constancias de entrega de residuos.',
    estadoCumplimiento: 'Cumple y tiene evidencia verificada',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-09-22',
    observaciones: 'Puntos ecológicos señalizados en área de pelado, freidoras y empaque.',
  },
  {
    id: 'obl-08',
    codigo: 'OBL-AMB-003',
    normaId: 'norm-amb-03',
    articuloNumeral: 'Artículo 10 (Res. 0631/2015) y Res. SDA 3957/2009',
    descripcionObligacion:
      'Operación, mantenimiento preventivo y limpieza periódica de la trampa de grasa instalada en la red interna de vertimientos, con bitácora de descolmatación para no superar límites de grasas y aceites hacia la red de alcantarillado público.',
    justificacionAplicabilidad:
      'La empresa realiza lavado de materias primas y áreas con presencia de aceites vegetales comestibles.',
    actividadNecesaria:
      'Realizar limpieza quincenal de la trampa de grasas, retiro de natas y grasas cuajadas, y consignar fecha y peso en la bitácora.',
    responsable: 'Jefe de Mantenimiento / Planta',
    fechaLimite: '2026-10-14',
    frecuencia: 'Bimestral',
    recursosNecesarios: 'Palas raspadoras, canecas para grasa retenida y servicio de succión programado.',
    indicadorCumplimiento: 'Limpiezas ejecutadas conforme a cronograma = 100%.',
    evidenciaRequerida: 'Bitácora física/digital de limpieza de trampa de grasa con firma y fecha.',
    estadoCumplimiento: 'Pendiente de verificación',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-09-15',
    observaciones:
      'Limpieza ejecutada por operario pero falta adjuntar el registro firmado del mes en curso.',
  },
  {
    id: 'obl-09',
    codigo: 'OBL-AMB-004',
    normaId: 'norm-amb-05',
    articuloNumeral: 'Resolución 1407 de 2018 y Res. 1344 de 2020',
    descripcionObligacion:
      'Presentación del Plan de Gestión Ambiental de Residuos de Envases y Empaques (Papel, Cartón, Plástico) o certificación de no obligatoriedad por volumen mínimo de comercialización.',
    justificacionAplicabilidad:
      'Frikaz empaca productos en plástico BOPP bilaminado comercializados en tiendas de barrio.',
    actividadNecesaria:
      'Cuantificar peso anual de empaques puestos en mercado para definir si supera el umbral o si se asocia a plan colectivo.',
    responsable: 'Gerencia General / Contador',
    fechaLimite: '2026-11-30',
    frecuencia: 'Anual',
    recursosNecesarios: 'Facturación de compras de bolsas de empaque y asesoría ambiental.',
    indicadorCumplimiento: 'Informe técnico de volumen de empaque radicado o clasificado.',
    evidenciaRequerida: 'Certificación contable de kilos de material de empaque puesto en el mercado.',
    estadoCumplimiento: 'Pendiente de ejecución',
    estadoAplicabilidad: 'Pendiente de evaluación',
    fechaUltimaVerificacion: '2026-08-25',
    observaciones:
      'En espera de consolidar los datos de compras de bobinas de polipropileno del primer semestre.',
  },
  {
    id: 'obl-10',
    codigo: 'OBL-SST-007',
    normaId: 'norm-sst-05',
    articuloNumeral: 'Artículo 2 y 3 (Res. 2013/1986 y Dec. 1072/2015)',
    descripcionObligacion:
      'Elección democrática y posesión formal del Vigía de Seguridad y Salud en el Trabajo (o COPASST para 10 trabajadores) con reuniones y recorridos de inspección mensuales documentados.',
    justificacionAplicabilidad:
      'Exigencia legal obligatoria de participación de los trabajadores en la identificación de condiciones inseguras.',
    actividadNecesaria:
      'Convocar elecciones entre los operarios, levantar acta de escrutinio, acta de posesión y actas mensuales de reunión.',
    responsable: 'Gerente General y Trabajadores',
    fechaLimite: '2026-10-28',
    frecuencia: 'Mensual',
    recursosNecesarios: '1 hora mensual laboral remunerada para recorridos de inspección.',
    indicadorCumplimiento: 'Actas de reunión mensual firmadas = 1 por mes.',
    evidenciaRequerida: 'Acta de constitución vigente y actas de reuniones mensuales del Vigía/COPASST.',
    estadoCumplimiento: 'Cumple y tiene evidencia verificada',
    estadoAplicabilidad: 'Aplicable',
    fechaUltimaVerificacion: '2026-09-30',
    observaciones: 'Vigía electo para el periodo 2025-2027. Acta de reunión de septiembre radicada.',
  },
];

export const INITIAL_PHVA_REGISTROS: PhvaRegistro[] = [
  {
    id: 'phva-01',
    obligacionId: 'obl-01',
    normaId: 'norm-sst-02',
    tituloActividad: 'Designación formal del responsable del SG-SST y verificación de curso 50h',
    planear: {
      descripcion:
        'Definir el perfil requerido según Res 0312/2019 para empresa de 10 trabajadores y programar la emisión del memorando de designación.',
      objetivo: 'Contar con un responsable idóneo con asignación de funciones y tiempo dentro de la jornada.',
      requisitoLegal: 'Resolución 0312 de 2019, Artículo 3, Estándar 1.',
      actividadesPlanificacion:
        'Revisar hojas de vida de personal interno o asesor SST con licencia, proyectar carta de designación.',
      recursos: 'Plantilla de carta de designación y presupuesto de honorarios.',
      responsable: 'Gerente General',
      fechaProgramada: '2026-01-15',
      indicadorEsperado: '1 documento de designación suscrito.',
      completado: true,
    },
    hacer: {
      descripcion:
        'Firma de la designación por parte de la Gerencia de Frikaz S.A.S. y aceptación por el profesional designado con entrega del certificado del curso de 50 horas.',
      actividadesEjecutadas:
        'Se firmó la carta de asignación de responsabilidades en SST y se archivó copia de la cédula y certificado SENA.',
      procedimientosAplicados: 'Procedimiento de selección y asignación de roles del SG-SST.',
      recursosUtilizados: 'Impresión y carpeta digital institucional.',
      responsable: 'Gerente General',
      fechaEjecucion: '2026-01-20',
      evidenciasObtenidas: 'Carta de designación firmada y Certificado Curso 50h MinTrabajo.',
      completado: true,
    },
    verificar: {
      descripcion:
        'Comprobación de la vigencia de la certificación y correspondencia con los lineamientos del Ministerio del Trabajo.',
      criteriosEvaluacion: 'Certificado de 50h o actualización de 20h registrado en la base de datos nacional.',
      metodoVerificacion: 'Validación en la plataforma virtual del Fondo de Riesgos Laborales / MinTrabajo.',
      revisionEvidencias: 'Documento original verificado y archivado.',
      resultado: 'Conforme',
      hallazgos: 'El certificado se encuentra activo y cubre los requerimientos para riesgo II/III.',
      fechaRevision: '2026-09-20',
      responsableVerificacion: 'Asesor Jurídico / Auditor SST',
      completado: true,
    },
    actuar: {
      descripcion:
        'Mantenimiento continuo de las competencias del responsable y programación de curso de actualización de 20h previo a su vencimiento.',
      incumplimientoIdentificado: 'Ninguno a la fecha.',
      accionCorrectivaMejora:
        'Programar en el cronograma de 2027 la actualización de 20 horas con la ARL.',
      responsable: 'Responsable SST',
      fechaLimite: '2027-01-20',
      estadoAccion: 'Verificada y cerrada',
      evidenciaEjecucion: 'Cronograma anual de formación continua.',
      verificacionEficacia: 'Cumplimiento satisfactorio verificado.',
      fechaCierre: '2026-09-20',
      completado: true,
    },
    fechaActualizacion: '2026-09-20',
  },
  {
    id: 'phva-04',
    obligacionId: 'obl-04',
    normaId: 'norm-sst-02',
    tituloActividad: 'Jornada de Evaluaciones Médicas Ocupacionales Periódicas para Operarios de Freidoras',
    planear: {
      descripcion:
        'Programar la jornada de exámenes médicos ocupacionales periódicos con énfasis osteomuscular y manipulación de alimentos (frotis faríngeo, coprológico y KOH de uñas) para los 10 colaboradores.',
      objetivo:
        'Detectar de manera temprana patologías de origen laboral y asegurar la aptitud sanitaria para procesamiento de snacks fritos.',
      requisitoLegal: 'Resolución 0312 de 2019 Estándar 5, y Resolución 2346 de 2007.',
      actividadesPlanificacion:
        'Cotizar con IPS de salud ocupacional con licencia en Bogotá (Bosa/Kennedy) y elaborar profesiograma.',
      recursos: 'Presupuesto de $1.200.000 COP para exámenes de los 10 operarios.',
      responsable: 'Responsable SST',
      fechaProgramada: '2026-08-15',
      indicadorEsperado: '10 de 10 trabajadores evaluados.',
      completado: true,
    },
    hacer: {
      descripcion:
        'Se enviaron 6 trabajadores en agosto, pero quedaron pendientes 4 operarios del turno de fritura nocturna y corte por alta demanda de pedidos de snack.',
      actividadesEjecutadas:
        'Se realizaron exámenes a 6 operarios de empaque y distribución. Pendientes 4 de la línea caliente.',
      procedimientosAplicados: 'Protocolo de exámenes médicos periódicos.',
      recursosUtilizados: '$720.000 COP ejecutados.',
      responsable: 'Responsable SST',
      fechaEjecucion: '2026-08-28',
      evidenciasObtenidas: '6 certificados de aptitud médica recibidos. Faltan 4.',
      completado: false,
    },
    verificar: {
      descripcion:
        'Auditoría al cumplimiento del plan de medicina preventiva. Se constata incumplimiento en el plazo legal.',
      criteriosEvaluacion: '100% de la planta evaluada antes del 31 de agosto.',
      metodoVerificacion: 'Cotejo de lista de trabajadores contra conceptos médicos recibidos.',
      revisionEvidencias: 'Faltan 4 conceptos de operarios expuestos a calor y cuchillas.',
      resultado: 'No Conforme',
      hallazgos:
        'Cuatro (4) operarios de freidoras y pelado no tienen evaluación médica periódica vigente correspondiente al año 2026.',
      fechaRevision: '2026-09-10',
      responsableVerificacion: 'Líder SST / Auditor Interno',
      completado: true,
    },
    actuar: {
      descripcion:
        'Apertura inmediata de Acción Correctiva AC-2026-001 para reprogramar los turnos y remitir a los 4 operarios faltantes a la IPS.',
      incumplimientoIdentificado:
        'Vencimiento de exámenes médicos periódicos en 4 operarios de producción de freidoras.',
      accionCorrectivaMejora:
        'Reprogramar citas prioritarias en la IPS para los 4 operarios faltantes entre el 15 y 22 de octubre de 2026, cubriendo turnos con operarios de apoyo.',
      responsable: 'Jefe de Planta y Gerente',
      fechaLimite: '2026-10-22',
      estadoAccion: 'En ejecución',
      evidenciaEjecucion: 'Orden de servicio y citas médicas agendadas con la IPS.',
      verificacionEficacia: 'Pendiente de recepción de los 4 certificados médicos restantes.',
      fechaCierre: '',
      completado: false,
    },
    fechaActualizacion: '2026-09-10',
  },
  {
    id: 'phva-06',
    obligacionId: 'obl-06',
    normaId: 'norm-amb-01',
    tituloActividad: 'Gestión Integral, Almacenamiento Seguro y Entrega de Aceite de Cocina Usado (ACU)',
    planear: {
      descripcion:
        'Diseñar protocolo de manejo de ACU que contemple enfriamiento previo del aceite, filtrado de borras gruesas, trasvase a canecas plásticas con embudo y rotulado según Resolución 316 de 2018.',
      objetivo:
        'Evitar vertimientos al alcantarillado, prevenir quemaduras de operarios durante el drenaje de freidoras y certificar el 100% del aceite degradado.',
      requisitoLegal: 'Resolución 316 de 2018 MinAmbiente.',
      actividadesPlanificacion:
        'Adquirir dique antiderrames, seleccionar gestor autorizado ante la SDA y elaborar bitácora de control.',
      recursos: '2 canecas herméticas de 55 galones, embudos de acero inoxidable, dique de contención.',
      responsable: 'Coordinador Ambiental',
      fechaProgramada: '2026-02-01',
      indicadorEsperado: '100% del ACU recolectado y certificado.',
      completado: true,
    },
    hacer: {
      descripcion:
        'Operación continua: drenaje de freidoras a temperatura menor a 50°C, almacenamiento bajo techo y entrega mensual al gestor autorizado de Bogotá.',
      actividadesEjecutadas:
        'Drenaje cada 3-4 días según medición de compuestos polares (<24%). Entrega mensual programada.',
      procedimientosAplicados: 'Instructivo Operativo IO-AMB-02: Drenaje y Acopio de ACU.',
      recursosUtilizados: 'Bidones plásticos rotulados y dotación de guantes de neopreno.',
      responsable: 'Operarios de freidoras y Jefe de Planta',
      fechaEjecucion: '2026-09-25',
      evidenciasObtenidas: 'Certificado de recolección No. ACU-BOG-2026-881 por 220 litros.',
      completado: true,
    },
    verificar: {
      descripcion:
        'Revisión documental del manifiesto emitido por el gestor y contraste con los inventarios de aceite vegetal virgen consumido en la producción de snacks.',
      criteriosEvaluacion:
        'El gestor debe estar registrado en la Secretaría Distrital de Ambiente de Bogotá y emitir certificado con destino de valorización (biodiésel).',
      metodoVerificacion:
        'Consulta de registro del gestor en portal SDA y verificación del volumen en kilogramos/litros.',
      revisionEvidencias: 'Certificado oficial archivado en el módulo de evidencias.',
      resultado: 'Conforme',
      hallazgos: 'Trazabilidad completa. El aceite usado fue destinado a producción de biocombustible.',
      fechaRevision: '2026-09-26',
      responsableVerificacion: 'Coordinador Ambiental',
      completado: true,
    },
    actuar: {
      descripcion:
        'Optimización del filtrado preliminar para alargar la vida útil del aceite en freidora y reducir el volumen de borras generadas.',
      incumplimientoIdentificado: 'Ninguno en el periodo.',
      accionCorrectivaMejora:
        'Evaluar la adquisición de un filtro continuo de papel para freidora que disminuya el recambio prematuro.',
      responsable: 'Jefe de Planta',
      fechaLimite: '2026-12-15',
      estadoAccion: 'Verificada y cerrada',
      evidenciaEjecucion: 'Cotizaciones de filtro de acero inoxidable.',
      verificacionEficacia: 'Proceso estable y cumpliendo normativa distrital.',
      fechaCierre: '2026-09-26',
      completado: true,
    },
    fechaActualizacion: '2026-09-26',
  },
  {
    id: 'phva-08',
    obligacionId: 'obl-08',
    normaId: 'norm-amb-03',
    tituloActividad: 'Mantenimiento y descolmatación quincenal de la trampa de grasa de aguas de proceso',
    planear: {
      descripcion:
        'Establecer cronograma de mantenimiento quincenal de la trampa de grasa subterránea de la planta para retener aceites residuales del lavado de utensilios.',
      objetivo:
        'Garantizar que las aguas vertidas al alcantarillado no colmaten la red ni superen parámetros de la Res 0631/2015.',
      requisitoLegal: 'Resolución 0631 de 2015 y Resolución SDA 3957 de 2009.',
      actividadesPlanificacion:
        'Diseñar formato de bitácora de limpieza de trampa de grasa con fecha, responsable y volumen retirado.',
      recursos: 'Herramientas de raspado, canecas para lodos grasos, elementos de bioseguridad.',
      responsable: 'Jefe de Mantenimiento',
      fechaProgramada: '2026-09-01',
      indicadorEsperado: '2 limpiezas mensuales ejecutadas y registradas.',
      completado: true,
    },
    hacer: {
      descripcion:
        'El operario realizó el raspado y retiro de capa de grasa el 15 y 30 de septiembre, pero no diligenció el formato físico correspondiente.',
      actividadesEjecutadas: 'Retiro físico de natas y grasas acumuladas en el compartimento.',
      procedimientosAplicados: 'Procedimiento de limpieza de trampa de grasa.',
      recursosUtilizados: 'Bolsas de alta densidad y palas plásticas.',
      responsable: 'Operario de mantenimiento',
      fechaEjecucion: '2026-09-30',
      evidenciasObtenidas: 'Falta formato firmado del mes de septiembre.',
      completado: false,
    },
    verificar: {
      descripcion:
        'Inspección visual de la trampa y revisión de la carpeta de registros ambientales.',
      criteriosEvaluacion: 'Bitácora diligenciada y firmada por el supervisor.',
      metodoVerificacion: 'Revisión documental en sitio.',
      revisionEvidencias: 'No reposa la evidencia documental de la última limpieza en la carpeta.',
      resultado: 'Conforme con observaciones',
      hallazgos:
        'La trampa está físicamente limpia, pero no existe trazabilidad documental firmada de la limpieza de la segunda quincena de septiembre.',
      fechaRevision: '2026-10-02',
      responsableVerificacion: 'Coordinador Ambiental',
      completado: true,
    },
    actuar: {
      descripcion:
        'Requerir el diligenciamiento inmediato de la bitácora e implementar registro digital fotográfico con celular institucional en cada mantenimiento.',
      incumplimientoIdentificado:
        'Falta de evidencia documental en la bitácora de limpieza de trampa de grasa.',
      accionCorrectivaMejora:
        'Diligenciar la bitácora con firma del operario e implementar hoja de registro plastificada al lado de la trampa con lapicero indeleble.',
      responsable: 'Jefe de Mantenimiento',
      fechaLimite: '2026-10-15',
      estadoAccion: 'En ejecución',
      evidenciaEjecucion: 'Formato diligenciado y registro fotográfico.',
      verificacionEficacia: 'Pendiente de verificación en próxima visita de supervisión.',
      fechaCierre: '',
      completado: false,
    },
    fechaActualizacion: '2026-10-02',
  },
];

export const INITIAL_EVIDENCIAS: Evidencia[] = [
  {
    id: 'evi-01',
    codigo: 'EVI-SST-001',
    nombre: 'Carta de Designación Responsable del SG-SST y Certificado 50h',
    normaId: 'norm-sst-02',
    obligacionId: 'obl-01',
    actividadPhvaId: 'phva-01',
    tipoArchivo: 'PDF',
    descripcion:
      'Carta firmada por el Representante Legal de Frikaz S.A.S. nombrando al Líder de SST y copia del certificado del Curso Virtual de 50 horas expedido por el Ministerio del Trabajo.',
    fechaEmision: '2026-01-20',
    fechaVencimiento: '2028-01-20',
    responsable: 'Gerente General',
    ubicacionOEnlace: '/documentos/sst/designacion_lider_sst_2026.pdf',
    archivoNombre: 'designacion_lider_sst_frikaz_2026.pdf',
    estadoRevision: 'Verificada y suficiente',
    observaciones: 'Documento original verificado y vigente.',
  },
  {
    id: 'evi-02',
    codigo: 'EVI-SST-002',
    nombre: 'Planilla PILA y Certificado de Cobertura ARL Septiembre 2026',
    normaId: 'norm-sst-02',
    obligacionId: 'obl-02',
    tipoArchivo: 'PDF',
    descripcion:
      'Soporte de pago de aportes de la seguridad social integral (Salud, Pensión, ARL Positiva) para los 10 trabajadores de la nómina de Frikaz S.A.S.',
    fechaEmision: '2026-10-05',
    fechaVencimiento: '2026-11-10',
    responsable: 'Nómina y Gestión Humana',
    ubicacionOEnlace: '/documentos/seguridad_social/pila_septiembre_2026.pdf',
    archivoNombre: 'pila_pago_septiembre_2026.pdf',
    estadoRevision: 'Verificada y suficiente',
    observaciones: 'Pago oportuno realizado a través de operador autorizado.',
  },
  {
    id: 'evi-03',
    codigo: 'EVI-SST-003',
    nombre: 'Registros de Dotación y EPP Específicos para Fritura y Corte',
    normaId: 'norm-sst-04',
    obligacionId: 'obl-05',
    tipoArchivo: 'PDF',
    descripcion:
      'Actas individuales de entrega de calzado antideslizante con puntera, delantal impermeable, careta de policarbonato y guantes de carnaza y nitrilo térmico para los 10 trabajadores.',
    fechaEmision: '2026-09-28',
    fechaVencimiento: '2027-01-28',
    responsable: 'Jefe de Planta / Líder SST',
    ubicacionOEnlace: '/documentos/sst/entrega_dotacion_epp_sep2026.pdf',
    archivoNombre: 'actas_entrega_epp_sep_2026.pdf',
    estadoRevision: 'Verificada y suficiente',
    observaciones: 'Firmado por los 10 colaboradores con número de cédula.',
  },
  {
    id: 'evi-04',
    codigo: 'EVI-AMB-001',
    nombre: 'Certificado de Recolección y Valorización de ACU No. 881',
    normaId: 'norm-amb-01',
    obligacionId: 'obl-06',
    actividadPhvaId: 'phva-06',
    tipoArchivo: 'PDF',
    descripcion:
      'Manifiesto de recolección de 220 litros de Aceite de Cocina Usado emitido por el gestor ambiental autorizado por la Secretaría Distrital de Ambiente de Bogotá.',
    fechaEmision: '2026-09-25',
    fechaVencimiento: '2026-10-25',
    responsable: 'Coordinador Ambiental',
    ubicacionOEnlace: '/documentos/ambiental/manifiesto_acu_sep2026_881.pdf',
    archivoNombre: 'manifiesto_acu_sep2026_881.pdf',
    estadoRevision: 'Verificada y suficiente',
    observaciones: 'Destino final verificado para producción de biocombustible biodiésel.',
  },
  {
    id: 'evi-05',
    codigo: 'EVI-AMB-002',
    nombre: 'Registro Fotográfico de Puntos Ecológicos con Código Res 2184',
    normaId: 'norm-amb-02',
    obligacionId: 'obl-07',
    tipoArchivo: 'Imagen',
    descripcion:
      'Fotografías fechadas de los 3 puntos ecológicos instalados en planta con canecas rotuladas verde (orgánicos/cáscaras), blanco (plásticos/cartón) y negro (ordinarios).',
    fechaEmision: '2026-09-22',
    responsable: 'Servicios Generales',
    ubicacionOEnlace: '/documentos/ambiental/fotos_puntos_ecologicos.jpg',
    archivoNombre: 'fotos_puntos_ecologicos_2026.jpg',
    estadoRevision: 'Verificada y suficiente',
    observaciones: 'Canecas debidamente identificadas con bolsa del color correspondiente.',
  },
  {
    id: 'evi-06',
    codigo: 'EVI-SST-004',
    nombre: 'Acta de Elección y Posesión del Vigía de Seguridad y Salud en el Trabajo',
    normaId: 'norm-sst-05',
    obligacionId: 'obl-10',
    tipoArchivo: 'PDF',
    descripcion:
      'Acta de votación democrática entre los 10 operarios de Frikaz S.A.S. y designación oficial del Vigía de SST y su suplente para el periodo 2025-2027.',
    fechaEmision: '2025-05-14',
    fechaVencimiento: '2027-05-14',
    responsable: 'Gerencia y Representante de Trabajadores',
    ubicacionOEnlace: '/documentos/sst/acta_vigia_sst_2025_2027.pdf',
    archivoNombre: 'acta_eleccion_vigia_sst_frikaz.pdf',
    estadoRevision: 'Verificada y suficiente',
    observaciones: 'Vigente por dos años reglamentarios.',
  },
];

export const INITIAL_ACCIONES_CORRECTIVAS: AccionCorrectiva[] = [
  {
    id: 'ac-01',
    codigo: 'AC-2026-001',
    obligacionId: 'obl-04',
    normaId: 'norm-sst-02',
    hallazgo:
      'Cuatro (4) operarios de la línea de freidoras y corte no cuentan con evaluaciones médicas ocupacionales periódicas correspondientes a 2026, encontrándose vencidas.',
    causaIdentificada:
      'Priorización de turnos de entrega de pedidos durante agosto y falta de coordinación con el proveedor de salud ocupacional para turnos rotativos.',
    accionPropuesta:
      'Agendar citas prioritarias en la IPS de salud ocupacional en horarios matutinos cubriendo los turnos con relevos de apoyo, y archivar los conceptos de aptitud.',
    responsable: 'Jefe de Planta y Líder SST',
    fechaApertura: '2026-09-10',
    fechaLimite: '2026-10-22',
    estado: 'En ejecución',
    evidenciaEjecucion: 'Orden de servicio y programación de citas confirmada por la IPS para el 16 de octubre.',
    fechaVerificacion: '2026-10-23',
    resultadoVerificacionEficacia: 'Pendiente de verificación',
    fechaCierre: '',
  },
  {
    id: 'ac-02',
    codigo: 'AC-2026-002',
    obligacionId: 'obl-08',
    normaId: 'norm-amb-03',
    hallazgo:
      'Ausencia de registro documental firmado en la bitácora de descolmatación de la trampa de grasa correspondiente a la segunda quincena de septiembre.',
    causaIdentificada:
      'El operario realizó la labor física pero no tenía el formato físico disponible en la pared adyacente a la trampa.',
    accionPropuesta:
      'Instalar una carpeta plastificada con bitácora en la pared de la zona de trampas de grasa, capacitar al operario sobre el registro inmediato y tomar foto como soporte.',
    responsable: 'Jefe de Mantenimiento',
    fechaApertura: '2026-10-02',
    fechaLimite: '2026-10-15',
    estado: 'En ejecución',
    evidenciaEjecucion: 'Instalación de porta-hojas plastificado con lapicero indeleble e instructivo visual.',
    fechaVerificacion: '2026-10-16',
    resultadoVerificacionEficacia: 'Pendiente de verificación',
    fechaCierre: '',
  },
  {
    id: 'ac-03',
    codigo: 'AC-2026-003',
    obligacionId: 'obl-03',
    normaId: 'norm-sst-02',
    hallazgo:
      'Incumplimiento en la meta de cobertura de la capacitación práctica sobre control de amagos de incendio con extintores tipo K para grasas de fritura.',
    causaIdentificada:
      'Postergación del taller práctico por lluvia e indisponibilidad del instructor de la empresa de recarga de extintores.',
    accionPropuesta:
      'Reprogramar el taller práctico con simulacro en patio cubierto con apoyo de la ARL y la empresa certificada de extintores.',
    responsable: 'Líder SST',
    fechaApertura: '2026-08-10',
    fechaLimite: '2026-09-15',
    estado: 'Verificada y cerrada',
    evidenciaEjecucion:
      'Lista de asistencia firmada por los 10 colaboradores y certificado de entrenamiento en extintores Clase K.',
    fechaVerificacion: '2026-09-16',
    resultadoVerificacionEficacia: 'Eficaz (Cierre aprobado)',
    fechaCierre: '2026-09-16',
  },
];

export const INITIAL_ASPECTOS_AMBIENTALES: AspectoAmbiental[] = [
  {
    id: 'asp-01',
    categoria: 'Aceite de Cocina Usado (ACU)',
    actividadProductiva: 'Fritura industrial por inmersión de papas, plátanos y chicharrones',
    impactoPotencial:
      'Contaminación severa de redes de alcantarillado público y cuerpos de agua (1 litro contamina hasta 1.000 litros de agua).',
    normaAplicableRef: 'Resolución 316 de 2018 (MADS) y Registro ACU de la SDA',
    obligacionLegalRef: 'OBL-AMB-001',
    medidaControl:
      'Almacenamiento en bidones de 55 galones con dique antiderrames y entrega exclusiva a gestor autorizado por la SDA con manifiesto.',
    registroAutoridad: 'Registro de Generadores de ACU ante Secretaría Distrital de Ambiente de Bogotá',
    responsable: 'Coordinador Ambiental / Jefe de Planta',
    evidenciaAsociada: 'Certificado de recolección No. 881 y bitácora de recambio',
    estadoCumplimiento: 'Cumpliendo 100%',
    accionMejora: 'Instalación de sistema de filtrado fino para optimizar rendimiento de aceite.',
  },
  {
    id: 'asp-02',
    categoria: 'Residuos Sólidos Ordinarios y Aprovechables',
    actividadProductiva: 'Pelado y rebanado de tubérculos y desempaque de materias primas',
    impactoPotencial:
      'Generación de lixiviados por materia orgánica en descomposición y colapso de rellenos sanitarios (Doña Juana).',
    normaAplicableRef: 'Resolución 2184 de 2019 (Código de Colores) y Decreto 1076 de 2015',
    obligacionLegalRef: 'OBL-AMB-002',
    medidaControl:
      'Separación en la fuente con código de colores (Verde para cáscaras orgánicas, Blanco para cartón/plástico limpio, Negro para ordinarios).',
    registroAutoridad: 'Plan de Gestión Integral de Residuos Sólidos (PGIRS Bogotá)',
    responsable: 'Servicios Generales / Auxiliares de Planta',
    evidenciaAsociada: 'Puntos ecológicos con registro fotográfico fechado',
    estadoCumplimiento: 'Cumpliendo 100%',
    accionMejora: 'Alianza con granja porcina/avícola cercana para aprovechamiento de cáscaras.',
  },
  {
    id: 'asp-03',
    categoria: 'Aguas Residuales No Domésticas (Vertimientos)',
    actividadProductiva: 'Lavado de tubérculos, utensilios y pisos de la zona de fritura',
    impactoPotencial:
      'Colmatación de redes de alcantarillado distrital con grasas saponificadas y elevación de DBO/DQO.',
    normaAplicableRef: 'Resolución 0631 de 2015 (MADS) y Resolución SDA 3957 de 2009',
    obligacionLegalRef: 'OBL-AMB-003',
    medidaControl:
      'Trampa de grasa física en acero con bafles deflectores y descolmatación quincenal programada.',
    registroAutoridad: 'Registro de Vertimientos ante la Secretaría Distrital de Ambiente (SDA)',
    responsable: 'Jefe de Mantenimiento',
    evidenciaAsociada: 'Bitácora quincenal de mantenimiento de trampa de grasa',
    estadoCumplimiento: 'Parcial (Requiere actualizar soporte documental)',
    accionMejora: 'Implementar toma semestral de muestra puntual para análisis de grasas y aceites.',
  },
  {
    id: 'asp-04',
    categoria: 'Empaques y Plásticos Bilaminados',
    actividadProductiva: 'Envasado, sellado térmico y distribución de productos fritos',
    impactoPotencial:
      'Generación de residuos posconsumo de plástico no biodegradable en el mercado.',
    normaAplicableRef: 'Resolución 1407 de 2018 y Ley 2232 de 2022',
    obligacionLegalRef: 'OBL-AMB-004',
    medidaControl:
      'Control de merma en selladoras y evaluación de adhesión a plan colectivo de aprovechamiento de empaques.',
    registroAutoridad: 'Registro ante MADS según umbral de toneladas comercializadas',
    responsable: 'Gerencia General / Comercial',
    evidenciaAsociada: 'Consolidado contable de compras de bobinas de polipropileno',
    estadoCumplimiento: 'En evaluación de umbral',
    accionMejora: 'Estudiar viabilidad técnica de empaques monomaterial más fáciles de reciclar.',
  },
  {
    id: 'asp-05',
    categoria: 'Emisiones Atmosféricas y Vahos de Fritura',
    actividadProductiva: 'Fritura continua con evaporación de humedad y vahos de aceite a 170°C',
    impactoPotencial:
      'Emisión de olores ofensivos en zona residencial de Bosa y vahos con material particulado fino.',
    normaAplicableRef: 'Resolución 2254 de 2017 y Resolución SDA 6982 de 2011',
    obligacionLegalRef: 'NOR-AMB-004',
    medidaControl:
      'Campana extractora de acero inoxidable con filtros lavables de malla metálica y ducto vertical sobre tejado.',
    registroAutoridad: 'Control de olores y emisiones de fuentes fijas SDA',
    responsable: 'Mantenimiento de Planta',
    evidenciaAsociada: 'Cronograma de lavado de filtros de campana cada 8 días',
    estadoCumplimiento: 'Cumpliendo 100%',
    accionMejora: 'Instalación de filtro de carbón activado secundario en ducto de salida.',
  },
  {
    id: 'asp-06',
    categoria: 'Consumo de Agua',
    actividadProductiva: 'Lavado continuo de papas y plátanos antes del pelado mecánico',
    impactoPotencial: 'Agotamiento del recurso hídrico y sobrecosto tarifario en la EAAB.',
    normaAplicableRef: 'Ley 373 de 1997 (Programa de Uso Eficiente y Ahorro del Agua - PUEAA)',
    obligacionLegalRef: 'NOR-AMB-006',
    medidaControl:
      'Boquillas aspersoras economizadoras en la peladora mecánica y circuito de recirculación preliminar de agua para lavado primario.',
    registroAutoridad: 'PUEAA - Empresa de Acueducto y Alcantarillado de Bogotá (EAAB)',
    responsable: 'Jefe de Planta',
    evidenciaAsociada: 'Facturas bimestrales de la EAAB con registro de metros cúbicos',
    estadoCumplimiento: 'Cumpliendo 100%',
    accionMejora: 'Monitoreo del indicador m3 de agua consumida por tonelada de papa procesada.',
  },
];

export const INITIAL_PELIGROS_SST: PeligroSST[] = [
  {
    id: 'pel-01',
    categoriaPeligro: 'Físico (Temperaturas extremas / Calor de freidoras)',
    procesoRelacionado: 'Fritura por inmersión en freidoras industriales',
    peligroEspecifico:
      'Contacto con aceite vegetal hirviendo a 160°C - 180°C y superficies metálicas desprotegidas.',
    efectoPosibleSalud:
      'Quemaduras de segundo y tercer grado en manos, brazos, rostro o piernas por salpicaduras o volcamiento.',
    normaRelacionadaRef: 'Res. 2400/1979 Art. 296-302 y Res. 0312/2019',
    controlesExistentes:
      'Termostato digital automático, canastillas de inmersión lenta con mango aislado, delantal térmico, careta facial y guantes de caña alta.',
    eppRequerido:
      'Guantes térmicos resistentes a 200°C, careta de policarbonato, delantal de carnaza o impermeable de alta densidad y botas de seguridad.',
    capacitacionRequerida: 'Protocolo de inmersión lenta y primeros auxilios para quemaduras térmicas.',
    responsable: 'Líder SST / Operador de freidora',
    estadoControl: 'Controlado con EPP y termostato automático',
  },
  {
    id: 'pel-02',
    categoriaPeligro: 'Mecánico (Cortes por rebanadoras y cuchillas rotativas)',
    procesoRelacionado: 'Rebanado y corte de papas y plátanos',
    peligroEspecifico:
      'Atrapamiento de dedos o contacto con cuchillas afiladas en movimiento rotativo continuo.',
    efectoPosibleSalud:
      'Heridas cortopunzantes profundas, laceraciones o amputaciones de falanges de manos.',
    normaRelacionadaRef: 'Res. 2400/1979 Art. 266-295 (Resguardos de maquinaria)',
    controlesExistentes:
      'Tolva de alimentación cerrada con empujador plástico (prohibido empujar con la mano), interruptor de parada de emergencia.',
    eppRequerido: 'Guante de malla de acero inoxidable para maniobras de limpieza y cambio de cuchilla.',
    capacitacionRequerida: 'Bloqueo y etiquetado (LOTO) para limpieza y cambio de cuchillas rotativas.',
    responsable: 'Operador de corte / Jefe de Planta',
    estadoControl: 'Controlado con guarda y empujador plástico',
  },
  {
    id: 'pel-03',
    categoriaPeligro: 'Locativo (Pisos resbalosos por salpicadura de grasa)',
    procesoRelacionado: 'Tránsito de operarios entre freidoras, centrifugado y empaque',
    peligroEspecifico:
      'Piso liso con película de grasa vegetal y humedad proveniente de las tinas de lavado.',
    efectoPosibleSalud:
      'Caídas al mismo nivel, traumatismos craneoencefálicos, luxaciones o caídas sobre freidoras.',
    normaRelacionadaRef: 'Ley 9 de 1979 Art. 90-95 y Res. 2400/1979 Art. 17',
    controlesExistentes:
      'Aplicación de desengrasante biodegradable dos veces al día, tapetes antifatiga calados y canaletas de desagüe.',
    eppRequerido: 'Botas de seguridad con suela de poliuretano antideslizante con dibujo profundo.',
    capacitacionRequerida: 'Programa de orden y aseo 5S y reporte de derrames inmediatos.',
    responsable: 'Servicios Generales y Operarios',
    estadoControl: 'Controlado con calzado antideslizante y desengrase diario',
  },
  {
    id: 'pel-04',
    categoriaPeligro: 'Tecnológico (Incendio por aceite caliente >160°C o gas)',
    procesoRelacionado: 'Calentamiento de freidoras con quemadores de gas natural/GLP',
    peligroEspecifico:
      'Sobrecalentamiento del aceite (>220°C autoignición) o fuga de gas en conexiones de mangueras y quemadores.',
    efectoPosibleSalud:
      'Quemaduras extensas, asfixia por humo, pérdidas materiales totales y riesgo de explosión.',
    normaRelacionadaRef: 'Res. 2400/1979 Art. 205-234 y Res. 0312/2019 Estándar 7',
    controlesExistentes:
      'Válvula de corte rápido de gas exterior, termostato de seguridad de corte a 200°C, extintor de acetato de potasio Clase K.',
    eppRequerido: 'Dotación ignífuga para brigadistas.',
    capacitacionRequerida: 'Uso y manejo de extintores Clase K y simulacro anual de evacuación.',
    responsable: 'Brigada de Emergencia / Responsable SST',
    estadoControl: 'Controlado con extintor Clase K y válvula de corte de gas',
  },
  {
    id: 'pel-05',
    categoriaPeligro: 'Biomecánico (Bipedestación y manipulación manual de bultos)',
    procesoRelacionado: 'Carga de bultos de papa de 50 kg y jornada de empaque de pie',
    peligroEspecifico:
      'Levantamiento manual de bultos pesados de materias primas y postura bípeda prolongada en línea de empaque.',
    efectoPosibleSalud:
      'Lumbalgias mecánicas, hernias discales, espasmos musculares y síndrome de fatiga postural.',
    normaRelacionadaRef: 'Res. 2400/1979 Art. 388-397 (Manejo de cargas) y Res. 0312/2019',
    controlesExistentes:
      'Carretilla zorra para transporte de bultos de papa y plátano, rotación de puestos cada 2 horas y pausas activas.',
    eppRequerido: 'Cinturón faja lumbar ergonómica durante cargue y descargue.',
    capacitacionRequerida: 'Higiene postural y técnicas de levantamiento seguro de cargas.',
    responsable: 'Líder SST y Trabajadores',
    estadoControl: 'Controlado con carretilla zorra y pausas activas guiadas',
  },
];
