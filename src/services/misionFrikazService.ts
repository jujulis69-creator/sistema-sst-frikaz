// ============================================================================
// SERVICIO DE GESTIÓN: «MISIÓN FRIKAZ – PROTEGE NUESTRA EMPRESA»
// Frikaz S.A.S. — Sede Bosa, Bogotá D.C.
// ============================================================================

import {
  TrabajadorFrikaz,
  PoliticaMisionFrikaz,
  PasaporteDigital,
  IntentoEvaluacion,
  ProgresoPoliticaTrabajador,
  InsigniaDigital,
  MetricasAdminMisionFrikaz,
} from '../types/misionFrikaz';
import { getStoredPoliticaSST } from './organigramaService';

const STORAGE_KEY_TRABAJADORES = 'frikaz_mision_trabajadores_v2';
const STORAGE_KEY_PROGRESOS = 'frikaz_mision_progresos_v2';
const STORAGE_KEY_INTENTOS = 'frikaz_mision_intentos_v2';
const STORAGE_KEY_POLITICAS_CONFIG = 'frikaz_mision_politicas_config_v2';
const STORAGE_KEY_SESION_ACTIVA = 'frikaz_mision_sesion_activa_v2';

// ----------------------------------------------------------------------------
// PLANTILLA DE TRABAJADORES CANÓNICOS DE FRIKAZ S.A.S.
// Estrictamente los 7 cargos definidos en CARGOS_SST_CANONICOS sin nombres ficticios
// ----------------------------------------------------------------------------
export const TRABAJADORES_CANONICOS: TrabajadorFrikaz[] = [
  {
    id: 'FRK-OPR-FRITO',
    nombre: 'Colaborador: Operario de Frito',
    cedula: '1.020.485.912',
    cargoId: 'cargo-operario-frito',
    cargoNombre: 'Operario de Frito',
    correo: 'frikaz.fritosnacks@gmail.com',
    area: 'Planta de Producción – Área de Cocción y Freidoras Industriales a Gas',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    esAdmin: false,
  },
  {
    id: 'FRK-OPR-PELADO',
    nombre: 'Colaborador: Operario de Pelado',
    cedula: '80.124.553',
    cargoId: 'cargo-operario-pelado',
    cargoNombre: 'Operario de Pelado',
    correo: 'frikaz.fritosnacks@gmail.com',
    area: 'Planta de Producción – Área de Pelado, Descascarado y Corte Mecanizado',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    esAdmin: false,
  },
  {
    id: 'FRK-OPR-SELECCION',
    nombre: 'Colaborador: Operario de Selección',
    cedula: '51.992.304',
    cargoId: 'cargo-operario-seleccion',
    cargoNombre: 'Operario de Selección',
    correo: 'frikaz.fritosnacks@gmail.com',
    area: 'Planta de Producción – Área de Recepción, Selección y Lavado de Materia Prima',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    esAdmin: false,
  },
  {
    id: 'FRK-OPR-EMPAQUE',
    nombre: 'Colaborador: Operario de Empaque',
    cedula: '52.981.442',
    cargoId: 'cargo-operario-empaque',
    cargoNombre: 'Operario de Empaque',
    correo: 'frikaz.fritosnacks@gmail.com',
    area: 'Planta de Producción – Área de Empaque, Sellado Térmico y Embalaje',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    esAdmin: false,
  },
  {
    id: 'FRK-CND-LOGISTICA',
    nombre: 'Colaborador: Conductor',
    cedula: '79.882.114',
    cargoId: 'cargo-conductor',
    cargoNombre: 'Conductor',
    correo: 'frikaz.fritosnacks@gmail.com',
    area: 'Logística, Transporte y Distribución Comercial',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    esAdmin: false,
  },
  {
    id: 'FRK-SST-VIGIA',
    nombre: 'Colaborador: Coordinador / Vigía de SST',
    cedula: '1.032.441.876',
    cargoId: 'cargo-coordinador-vigia-sst',
    cargoNombre: 'Coordinador / Vigía de SST',
    correo: 'frikaz.fritosnacks@gmail.com',
    area: 'Seguridad y Salud en el Trabajo (SG-SST)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    esAdmin: true,
  },
  {
    id: 'FRK-DIR-GERENCIA',
    nombre: 'Colaborador: Gerente General',
    cedula: '1.014.223.889',
    cargoId: 'cargo-gerente-general',
    cargoNombre: 'Gerente General',
    correo: 'frikaz.fritosnacks@gmail.com',
    area: 'Dirección General y Gestión Estratégica',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=250&q=80',
    esAdmin: true,
  },
];


// ----------------------------------------------------------------------------
// BANCO CANÓNICO DE POLÍTICAS, ESCENARIOS REALES Y PREGUNTAS
// ----------------------------------------------------------------------------
export const POLITICAS_MISION_BASE: PoliticaMisionFrikaz[] = [
  {
    id: 'FRK-SST-POL-01',
    codigoCalidad: 'FRK-SST-POL-01',
    titulo: 'POLÍTICA INTEGRAL DE SEGURIDAD Y SALUD EN EL TRABAJO',
    subtitulo: 'Compromiso rector con la vida, prevención de quemaduras y mejora continua',
    version: '02',
    fechaEmision: '2026-01-15',
    esObligatoria: true,
    icono: 'ShieldCheck',
    colorAcento: '#F59E0B',
    insigniaNombre: 'Guardián de la Vida Frikaz',
    insigniaDescripcion: 'Dominio absoluto de la Política Integral de SST y los 4 compromisos legales de Frikaz S.A.S.',
    insigniaIcono: 'Award',
    resumenEjecutivo:
      'En Frikaz S.A.S., empresa dedicada a la fabricación artesanal de snacks (papas, plátanos y chicharrones), nuestro capital más valioso es el equipo humano. La empresa asume el compromiso legal y moral de proteger la integridad física de todos los colaboradores mediante la identificación de peligros en freidoras a 180°C, ergonomía, suministro de EPP térmico de alta temperatura y mejora continua.',

    // Atributos de Videojuego
    imagenZona: '/src/assets/images/frikaz_zone_frying_line_1794397643230.jpg',
    sectorPlantaNombre: 'Sector Alfa: Línea Central de Freído y Control Térmico',
    dificultad: 'Nivel 1: Recluta',
    puntosXp: 350,
    dialogoGuiaBienvenida:
      '¡Bienvenido a la línea de freído! El aceite alcanza 180°C. Cada segundo de atención protege tu vida y la de tus compañeros. ¡Explora el sector e identifica cualquier anomalía!',
    hotspots: [
      {
        id: 'hs-temp',
        x: 42,
        y: 38,
        titulo: 'Termostato a 195°C',
        descripcion: '¡Peligro térmico! La temperatura supera en 15°C el límite operativo seguro de 180°C.',
        esPeligro: true,
        consejoGuia: 'Cerrar inmediatamente la válvula de gas para cortar la fuente de calor.',
      },
      {
        id: 'hs-water',
        x: 28,
        y: 68,
        titulo: 'Papa húmeda goteando',
        descripcion: 'Riesgo crítico de vaporización explosiva por agua en contacto con aceite caliente.',
        esPeligro: true,
        consejoGuia: 'Todo tubérculo debe ser centrifugado y secado antes de sumergirse.',
      },
      {
        id: 'hs-extintor',
        x: 82,
        y: 55,
        titulo: 'Extintor Clase K',
        descripcion: 'Agente sofocante de acetato de potasio especial para aceites vegetales comestibles.',
        esPeligro: false,
        consejoGuia: '¡Equipo correcto! Genera una espuma jabonosa que enfría y corta el oxígeno sin salpicar.',
      },
    ],
    desafioTerminal: {
      codigoProtocolo: 'FRK-SAFE-180',
      instruccion: 'Ingresa el protocolo de corte de emergencia ante sobrecalentamiento crítico de la freidora:',
      pregunta: '¿Cuál es la primera acción ante el switch maestro?',
      opciones: [
        { id: 't-1', etiqueta: 'Accionar Válvula Solenoide de Corte General de Gas y detener cargue', esCorrecta: true },
        { id: 't-2', etiqueta: 'Arrojar un cubo de hielo a la tina de fritura para enfriar', esCorrecta: false },
        { id: 't-3', etiqueta: 'Acelerar el empaque para vaciar la máquina más rápido', esCorrecta: false },
      ],
    },
    compromisosClave: [
      {
        numero: 1,
        titulo: 'Proteger la seguridad y salud de todos los colaboradores',
        descripcion:
          'Prevenir lesiones, accidentes de trabajo y enfermedades laborales priorizando los peligros de temperaturas extremas (180°C), riesgo biomecánico y locativo.',
        aplicacionEnPlanta:
          'Uso innegociable de careta facial, delantal térmico y guantes de 200°C en la zona de cocción.',
      },
      {
        numero: 2,
        titulo: 'Cumplir la normatividad nacional vigente',
        descripcion:
          'Acatar estrictamente el Decreto 1072 de 2015, la Resolución 0312 de 2019 y las disposiciones ambientales de la Secretaría Distrital de Ambiente (SDA).',
        aplicacionEnPlanta:
          'Reporte y registro formal de todo incidente antes de 24 horas y entrega de ACU a gestores autorizados.',
      },
      {
        numero: 3,
        titulo: 'Garantizar la consulta y participación activa',
        descripcion:
          'Promover la elección del Vigía de SST, la comunicación de condiciones inseguras y el derecho inalienable a suspender labores ante riesgo inminente.',
        aplicacionEnPlanta:
          'Cualquier operario puede detener la freidora si detecta fuga de gas o sobrecalentamiento sin represalias.',
      },
      {
        numero: 4,
        titulo: 'Mejorar continuamente el SG-SST',
        descripcion:
          'Evaluar anualmente los indicadores de accidentabilidad, auditar los puestos y destinar recursos técnicos y financieros para modernizar la planta.',
        aplicacionEnPlanta:
          'Inspecciones preoperacionales diarias a quemadores y reposición periódica de calzado con ranurado profundo.',
      },
    ],
    responsabilidadesPorNivel: [
      {
        nivel: 'Alta Dirección (Gerencia)',
        responsabilidad: 'Asignar presupuesto, presidir rendición de cuentas y firmar la política anualmente.',
      },
      {
        nivel: 'Vigía / Coordinador SST',
        responsabilidad: 'Auditar la matriz GTC 45, investigar accidentes en 15 días e inspeccionar EPP.',
      },
      {
        nivel: 'Nivel Operativo (Trabajadores)',
        responsabilidad: 'Suministrar información clara sobre su salud, portar EPP y cumplir protocolos seguros.',
      },
    ],
    escenario: {
      titulo: 'Incidente Crítico en la Línea de Freído a Gas (180°C)',
      ubicacionPlanta: 'Planta Bosa – Módulo Central de Freidoras Industriales a Gas',
      peligroAsociado: 'Físico (Calor extremo por contacto con aceite vegetal a 180°C) y Locativo (Superficies encharcadas con grasa)',
      descripcionCaso:
        'Es viernes a las 11:30 AM en plena producción de papas onduladas. El termómetro análogo de la freidora #1 marca 195°C (15°C por encima del límite seguro de 180°C). El operario de turno nota que la campana extractora hace un zumbido irregular y pequeñas gotas de condensación fría del ducto están cayendo cerca de la tina caliente. Además, hay una película resbaladiza de aceite en el suelo y una canastilla con 25 kg de papa recién lavada aún con exceso de agua goteando. El supervisor de turno apura la producción porque el camión de distribución sale en 40 minutos.',
      elementosInvolucrados: [
        'Freidora a gas sobrecalentada a 195°C',
        'Canastilla con papa húmeda escurriendo agua sobre el aceite',
        'Piso con película de grasa resbalosa frente a la freidora',
        'Extintor Clase K ubicado a 4 metros',
        'Presión de tiempo para entrega de lote de producto',
      ],
      desafioObservacion:
        'Analiza las condiciones de la escena. Según la Política de SST y el protocolo de Frikaz S.A.S., ¿cuál es la secuencia correcta de decisiones para neutralizar la amenaza y proteger la vida de todos en planta?',
      pistas: [
        'Pista 1: El agua jamás debe entrar en contacto con aceite a 180°C porque genera vaporización explosiva instantánea (salpicaduras graves).',
        'Pista 2: La Política de Frikaz S.A.S. otorga a todo trabajador el derecho explícito de suspender labores ante riesgo inminente.',
        'Pista 3: La temperatura máxima de operación en Frikaz es 180°C.',
      ],
    },
    preguntas: [
      {
        id: 'p1-1',
        numero: 1,
        enunciado:
          'Ante el sobrecalentamiento de la freidora a 195°C y la presencia de papa con exceso de agua cerca de la tina caliente, ¿cuál es la primera acción OBLIGATORIA según la Política de SST de Frikaz S.A.S.?',
        contextoCaso: 'La freidora supera en 15°C el límite operativo y hay riesgo de vaporización explosiva.',
        pesoPuntos: 20,
        fundamentoNormativo: 'Decreto 1072 de 2015, Art. 2.2.4.6.8 y Compromiso 1 y 3 de la Política de Frikaz.',
        opciones: [
          {
            id: 'opt-1-1',
            texto: 'Verter inmediatamente la papa húmeda para bajar la temperatura del aceite por choque térmico.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO Y PELIGROSO: Verter agua o productos muy húmedos en aceite hirviendo provoca una expansión explosiva de vapor que causa salpicaduras masivas y quemaduras de 3er grado.',
          },
          {
            id: 'opt-1-2',
            texto: 'Cerrar la válvula de paso de gas, apagar el quemador, suspender el cargue de papa húmeda y notificar de inmediato al Vigía de SST.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! En Frikaz S.A.S. prima la vida sobre la velocidad de entrega. Cortar el suministro calórico y suspender la actividad ante riesgo inminente es la directriz rectora de la Política de SST.',
          },
          {
            id: 'opt-1-3',
            texto: 'Acelerar el empaque y no reportar nada para evitar retrasar la salida del camión repartidor.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La presión comercial jamás justifica omitir un protocolo de seguridad que pone en peligro a los 10 colaboradores de la empresa.',
          },
          {
            id: 'opt-1-4',
            texto: 'Echar agua fría con balde al exterior de la tina de fritura para enfriar el metal rápidamente.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: El agua cerca de la zona caliente puede filtrarse a la cuba o generar choque térmico con fractura del metal y derrame incontrolado.',
          },
        ],
      },
      {
        id: 'p1-2',
        numero: 2,
        enunciado:
          '¿Cuál es la dotación de Elementos de Protección Personal (EPP) innegociable que debe portar el Operario de Frito según la matriz de requisitos de Frikaz S.A.S.?',
        contextoCaso: 'Operación a pie de cuba con aceite vegetal a 180°C.',
        pesoPuntos: 20,
        fundamentoNormativo: 'Resolución 2400 de 1979 y Decreto 1072 de 2015.',
        opciones: [
          {
            id: 'opt-2-1',
            texto: 'Careta de policarbonato con mentonera, guantes de nitrilo/carnaza térmica resistentes a 200°C, delantal térmico impermeable y calzado de seguridad con suela antideslizante profunda.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! Esta configuración protege contra las salpicaduras de 180°C en rostro, tórax y manos, mientras que el calzado evita caídas en pisos con películas de grasa.',
          },
          {
            id: 'opt-2-2',
            texto: 'Solo tapabocas quirúrgico, guantes desechables de látex y tenis deportivos cómodos.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: El látex se derrite instantáneamente en contacto con aceite caliente provocando lesiones cutáneas graves y los tenis no previenen resbalones.',
          },
          {
            id: 'opt-2-3',
            texto: 'Gafas de sol oscuras y botas pantaneras de caucho común.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: No brindan cobertura facial completa contra salpicaduras ni resistencia térmica adecuada.',
          },
          {
            id: 'opt-2-4',
            texto: 'Únicamente guantes de tela de algodón para evitar mancharse las manos de grasa.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La tela absorbe el aceite hirviendo actuando como mecha contra la piel.',
          },
        ],
      },
      {
        id: 'p1-3',
        numero: 3,
        enunciado:
          'Si ocurriera un conato de fuego en la superficie del aceite caliente de la freidora, ¿cuál es el único tipo de extintor que debe ser utilizado según el estándar técnico de Frikaz?',
        contextoCaso: 'Combustión de aceite vegetal comestible a altas temperaturas.',
        pesoPuntos: 20,
        fundamentoNormativo: 'Norma NFPA 10 y Resolución 2400 de 1979.',
        opciones: [
          {
            id: 'opt-3-1',
            texto: 'Manguera de agua a presión del grifo de lavado de materias primas.',
            esCorrecta: false,
            retroalimentacion: '¡FATAL! El agua en aceite ardiendo produce una bola de fuego gigantesca por ebullición violenta (boilover). Nunca use agua en fuegos de cocina.',
          },
          {
            id: 'opt-3-2',
            texto: 'Extintor Clase K (a base de acetato de potasio líquido que saponifica el aceite formando una capa sofocante y enfriadora).',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! Los extintores Clase K están especialmente diseñados para grasas y aceites de cocina; generan una espuma jabonosa que enfría y corta el oxígeno sin salpicar.',
          },
          {
            id: 'opt-3-3',
            texto: 'Soplar fuertemente la llama con una bandeja metálica de empaque.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Aviva la llama proporcionando más oxígeno y arriesga la integridad del colaborador.',
          },
          {
            id: 'opt-3-4',
            texto: 'Extintor de agua presurizada corriente.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Dispersa el aceite encendido en todas las direcciones del recinto.',
          },
        ],
      },
      {
        id: 'p1-4',
        numero: 4,
        enunciado:
          'Respecto a la participación y reporte en el SG-SST de Frikaz S.A.S., ¿qué derecho y deber tienen TODOS los trabajadores frente a una condición insegura detectada?',
        contextoCaso: 'Un piso resbaloso no señalizado o un quemador con olor a gas.',
        pesoPuntos: 20,
        fundamentoNormativo: 'Decreto 1072 de 2015, Art. 2.2.4.6.10 y Política de SST Frikaz.',
        opciones: [
          {
            id: 'opt-4-1',
            texto: 'Ignorarlo si no pertenece a su turno de trabajo asignado.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La seguridad es una responsabilidad compartida de los 10 colaboradores de Frikaz S.A.S.',
          },
          {
            id: 'opt-4-2',
            texto: 'Reportarlo de inmediato al Vigía de SST o Gerente, suspender la labor si hay peligro inminente y documentarlo sin temor a sanciones.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! La Política de Frikaz garantiza el canal abierto de participación y ampara el derecho a no laborar bajo condiciones de peligro no controlado.',
          },
          {
            id: 'opt-4-3',
            texto: 'Esperar a la reunión anual de gerencia para mencionarlo como sugerencia.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Las condiciones críticas deben atenderse en tiempo real antes de que se conviertan en un accidente de trabajo.',
          },
          {
            id: 'opt-4-4',
            texto: 'Publicar una queja en redes sociales antes de comentarlo internamente.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: El conducto regular es el reporte técnico interno a través del Vigía y el canal de SST.',
          },
        ],
      },
      {
        id: 'p1-5',
        numero: 5,
        enunciado:
          '¿Cuál es la frecuencia mínima obligatoria con la que la Alta Dirección y el Vigía de SST deben revisar y actualizar la Política de Seguridad y Salud en el Trabajo de Frikaz S.A.S.?',
        contextoCaso: 'Mantenimiento del ciclo PHVA y mejora continua.',
        pesoPuntos: 20,
        fundamentoNormativo: 'Decreto 1072 de 2015, Art. 2.2.4.6.7.',
        opciones: [
          {
            id: 'opt-5-1',
            texto: 'Cada 10 años únicamente cuando cambie el representante legal de la empresa.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La norma colombiana exige revisiones periódicas mucho más dinámicas.',
          },
          {
            id: 'opt-5-2',
            texto: 'Como mínimo una vez al año (anualmente), firmada y fechada por la Alta Dirección.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! El Decreto 1072/2015 estipula que la política debe ser revisada mínimo una vez al año para asegurar que siga siendo pertinente a los peligros de la pyme.',
          },
          {
            id: 'opt-5-3',
            texto: 'Solo si ocurre un accidente mortal en la fábrica de snacks.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: El SG-SST es eminentemente preventivo, no reactivo.',
          },
          {
            id: 'opt-5-4',
            texto: 'No requiere revisión una vez redactada por primera vez.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La falta de revisión anual constituye un hallazgo de no conformidad en los estándares mínimos de la Resolución 0312/2019.',
          },
        ],
      },
    ],
  },
  {
    id: 'FRK-SST-POL-02',
    codigoCalidad: 'FRK-SST-POL-02',
    titulo: 'POLÍTICA DE PREVENCIÓN DE CONSUMO DE TABACO, ALCOHOL Y SUSTANCIAS PSICOACTIVAS',
    subtitulo: 'Tolerancia cero con el alcohol y drogas en plantas de fritura y rutas de distribución',
    version: '01',
    fechaEmision: '2026-01-20',
    esObligatoria: true,
    icono: 'ShieldAlert',
    colorAcento: '#EF4444',
    insigniaNombre: 'Defensor de la Vida y Sobriedad',
    insigniaDescripcion: 'Compromiso riguroso con la cero tolerancia a sustancias psicoactivas en planta y conducción.',
    insigniaIcono: 'CheckCircle2',
    resumenEjecutivo:
      'Frikaz S.A.S. mantiene una política de TOLERANCIA CERO ante la posesión, consumo, distribución o presencia laboral bajo efectos de bebidas alcohólicas, drogas ilícitas, sustancias psicoactivas o tabaco dentro de las instalaciones de la planta de producción (Bosa) y en los vehículos de reparto. La manipulación de freidoras a 180°C y la conducción de vehículos de carga pesada exigen un estado psicofísico y de reflejos al 100%.',

    // Atributos de Videojuego
    imagenZona: '/src/assets/images/frikaz_zone_logistics_patio_1794397643649.jpg',
    sectorPlantaNombre: 'Sector Beta: Muelle de Despacho, Furgones y Cero Adicciones',
    dificultad: 'Nivel 2: Operativo',
    puntosXp: 400,
    dialogoGuiaBienvenida:
      '¡Atención al muelle de despacho! Conducir o manipular furgones exige 100% de reflejos. La política es de Tolerancia Cero absoluta. ¡Revisa el perímetro e inspecciona los vehículos!',
    hotspots: [
      {
        id: 'hs-conductor',
        x: 18,
        y: 75,
        titulo: 'Conductor con aliento alcohólico',
        descripcion: 'Sospecha de consumo de licor previa a la salida de ruta con 400 kg de snacks.',
        esPeligro: true,
        consejoGuia: 'Separar inmediatamente del furgón y aplicar prueba preventiva con alcohosensor.',
      },
      {
        id: 'hs-cigarrillo',
        x: 62,
        y: 62,
        titulo: 'Colilla en zona de corrugados',
        descripcion: 'Peligro inminente de conato de incendio en zona de cartón y empaque.',
        esPeligro: true,
        consejoGuia: 'Frikaz S.A.S. es 100% libre de humo. Está prohibido fumar en toda la sede.',
      },
      {
        id: 'hs-sendero',
        x: 52,
        y: 86,
        titulo: 'Paso Peatonal Demarcado',
        descripcion: 'Línea de vida pintada en amarillo para circulación segura de personal.',
        esPeligro: false,
        consejoGuia: '¡Correcto! Utilizar siempre las franjas peatonales delimitadas.',
      },
    ],
    desafioTerminal: {
      codigoProtocolo: 'FRK-ZERO-TOL',
      instruccion: 'Desbloquea la salida del furgón confirmando la condición psicofísica requerida:',
      pregunta: '¿Qué nivel de alcoholemia es admisible para iniciar labores en Frikaz S.A.S.?',
      opciones: [
        { id: 't2-1', etiqueta: '0.00 mg/L (Tolerancia Cero Estricta y Absoluta)', esCorrecta: true },
        { id: 't2-2', etiqueta: 'Hasta 0.39 mg/L si durmió más de 4 horas', esCorrecta: false },
        { id: 't2-3', etiqueta: 'Cualquier nivel si se toman dos tazas de café caliente', esCorrecta: false },
      ],
    },
    compromisosClave: [
      {
        numero: 1,
        titulo: 'Tolerancia cero al consumo y porte de sustancias',
        descripcion:
          'Prohibición tajante de ingresar o laborar bajo el influjo de alcohol o estupefacientes en planta, oficinas y vehículos.',
        aplicacionEnPlanta:
          'Pruebas aleatorias de alcoholemia antes del encendido de freidoras y salida de furgones.',
      },
      {
        numero: 2,
        titulo: 'Prohibición estricta de fumar en toda la sede',
        descripcion:
          'Espacio 100% libre de humo de tabaco o cigarrillos electrónicos (vapeadores), por bioseguridad alimentaria e inflamabilidad.',
        aplicacionEnPlanta:
          'Cero fuentes de ignición en áreas con gas natural, grasas y material corrugado de empaque.',
      },
      {
        numero: 3,
        titulo: 'Prevención integral y apoyo al bienestar',
        descripcion:
          'Promoción de estilos de vida saludables, capacitaciones periódicas con la ARL y orientación confidencial.',
        aplicacionEnPlanta:
          'Campañas mensuales sobre manejo del estrés y consecuencias del consumo en la salud osteomuscular y refleja.',
      },
    ],
    responsabilidadesPorNivel: [
      {
        nivel: 'Gerencia y Vigía SST',
        responsabilidad: 'Gestionar las pruebas de tamizaje con la ARL y garantizar ambientes seguros.',
      },
      {
        nivel: 'Operarios y Conductores',
        responsabilidad: 'Presentarse en óptimas condiciones de sobriedad, reportar medicamentos que generen somnolencia y rechazar el consumo.',
      },
    ],
    escenario: {
      titulo: 'Sospecha en Turno Matutino: Conducción y Cocina Industrial',
      ubicacionPlanta: 'Planta Bosa – Zona de Cargue y Despacho de Snacks',
      peligroAsociado: 'Peligro Psicosocial y Condiciones de Seguridad (Tránsito vehicular y quemaduras por disminución de reflejos)',
      descripcionCaso:
        'Lunes 6:00 AM. Al iniciar la jornada, durante el saludo de seguridad, se percibe un aliento con olor a licor y dificultad leve de articulación en uno de los colaboradores asignado al furgón de reparto de Soacha. El trabajador asegura que durmió 5 horas y que solo bebió un par de cervezas la noche anterior, alegando que "se siente perfecto" para manejar porque conoce la ruta de memoria. Al mismo tiempo, en el vestier se encuentra una colilla de cigarrillo apagada en un rincón cerca a las cajas de cartón de empaque.',
      elementosInvolucrados: [
        'Conductor con sospecha de alcoholemia positiva',
        'Furgón de reparto con 400 kg de producto terminado listo para salir a vía pública',
        'Colilla de cigarrillo en área contigua a material altamente inflamable',
        'Alcohosensor preventivo calibrado en enfermería/SST',
      ],
      desafioObservacion:
        '¿Cómo debe actuar la empresa y los compañeros de trabajo según la Política de Alcohol y Drogas y el Código Sustantivo del Trabajo de Colombia?',
      pistas: [
        'Pista 1: El Código Sustantivo del Trabajo (Art. 60) prohíbe presentarse al trabajo en estado de embriaguez o bajo la influencia de narcóticos.',
        'Pista 2: La ley vial colombiana (Ley 1696) establece sanción desde Grado 0 de alcoholemia.',
        'Pista 3: En Frikaz el humo de tabaco está prohibido en el 100% de las instalaciones por riesgo de incendio y contaminación de alimentos.',
      ],
    },
    preguntas: [
      {
        id: 'p2-1',
        numero: 1,
        enunciado:
          '¿Cuál es la postura oficial y legal de Frikaz S.A.S. respecto al consumo de alcohol previo a la jornada de trabajo o durante ella?',
        contextoCaso: 'Un operario o conductor afirma haber bebido "poco" la noche anterior.',
        pesoPuntos: 25,
        fundamentoNormativo: 'Código Sustantivo del Trabajo Art. 60 y Ley 1566 de 2012.',
        opciones: [
          {
            id: 'opt-2-1-1',
            texto: 'Se permite trabajar siempre que el colaborador beba dos tazas de café bien cargado.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: El café no metaboliza el alcohol en sangre ni restablece la velocidad de reflejos ante una maniobra de emergencia.',
          },
          {
            id: 'opt-2-1-2',
            texto: 'Tolerancia Cero: Queda estrictamente prohibido laborar con cualquier grado de alcoholemia o influjo de sustancias psicoactivas.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! En Frikaz S.A.S. la política es de tolerancia cero estricta para garantizar la vida del propio colaborador, sus compañeros y la comunidad.',
          },
          {
            id: 'opt-2-1-3',
            texto: 'Solo se prohíbe para el Gerente, pero los operarios pueden trabajar si usan guantes.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La política aplica universalmente a todos los niveles de la organización sin distinción jerárquica.',
          },
          {
            id: 'opt-2-1-4',
            texto: 'Se permite si el trabajador promete conducir más despacio por la derecha.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La Ley 1696 de 2013 y el SG-SST prohíben categóricamente la conducción bajo cualquier vestigio de alcohol.',
          },
        ],
      },
      {
        id: 'p2-2',
        numero: 2,
        enunciado:
          'Si un trabajador consume medicamentos recetados por su médico tratante que causan somnolencia o alteran la concentración, ¿qué debe hacer conforme a la política?',
        contextoCaso: 'Medicamentos antihistamínicos o ansiolíticos prescritos por la EPS.',
        pesoPuntos: 25,
        fundamentoNormativo: 'Decreto 1072 de 2015 Art. 2.2.4.6.10.',
        opciones: [
          {
            id: 'opt-2-2-1',
            texto: 'Ocultarlo para no generar sospechas entre los compañeros de planta.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Ocultar un fármaco con efecto sedante al operar freidoras o furgones es un acto inseguro de altísima gravedad.',
          },
          {
            id: 'opt-2-2-2',
            texto: 'Informar previamente al Responsable del SG-SST y presentar la fórmula médica para reasignar temporalmente sus funciones a labores de bajo riesgo.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! El deber legal del trabajador es informar sobre su estado de salud. La empresa reubicará temporalmente sus tareas para evitar accidentes.',
          },
          {
            id: 'opt-2-2-3',
            texto: 'Tomar doble dosis para contrarrestar la somnolencia con energía.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Aumentar la dosis empeora los efectos adversos y arriesga la salud del colaborador.',
          },
          {
            id: 'opt-2-2-4',
            texto: 'No tomar el medicamento y trabajar enfermo sin consultar al médico.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La salud es prioritaria; la empresa coordina la labor sin suspender el tratamiento médico prescrito.',
          },
        ],
      },
      {
        id: 'p2-3',
        numero: 3,
        enunciado:
          '¿Por qué está totalmente prohibido fumar o vapear dentro de las instalaciones de Frikaz S.A.S. (incluidos vestieres, baños y patios)?',
        contextoCaso: 'Sede con presencia de gas combustible, aceites comestibles y empaque corrugado.',
        pesoPuntos: 25,
        fundamentoNormativo: 'Ley 1335 de 2009 (Espacios libres de humo) y Res. 2400 de 1979.',
        opciones: [
          {
            id: 'opt-2-3-1',
            texto: 'Porque el humo puede contaminar la inocuidad de los alimentos fritos y las cenizas/chispas constituyen un potencial foco de incendio en áreas con gas y cartón.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! Combina dos pilares: la protección de la salud respiratoria y prevención de incendios Clase B/K, además del cumplimiento sanitario de BPM en snacks.',
          },
          {
            id: 'opt-2-3-2',
            texto: 'Solo está prohibido si el cigarrillo no tiene filtro.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La prohibición es absoluta para tabaco, cigarrillos con o sin filtro y vaporizadores.',
          },
          {
            id: 'opt-2-3-3',
            texto: 'Porque a la gerencia no le agrada el olor a menta.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Es una disposición fundamentada en normas de seguridad industrial y salud pública nacional.',
          },
          {
            id: 'opt-2-3-4',
            texto: 'Está permitido si se fuma debajo de la campana extractora con el motor encendido.',
            esCorrecta: false,
            retroalimentacion: '¡PELIGROSO! La campana contiene vapores de grasa acumulada; una chispa encendería un fuego incontrolable en el ducto de extracción.',
          },
        ],
      },
      {
        id: 'p2-4',
        numero: 4,
        enunciado:
          '¿Cuál es el procedimiento que Frikaz S.A.S. implementa cuando se sospecha que un colaborador se presenta bajo el efecto del alcohol en planta?',
        contextoCaso: 'Detección en el filtro de ingreso matutino.',
        pesoPuntos: 25,
        fundamentoNormativo: 'Sentencia C-636 de 2016 y Código Sustantivo del Trabajo.',
        opciones: [
          {
            id: 'opt-2-4-1',
            texto: 'Expulsarlo a empujones a la calle sin dejar registro formal.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: La empresa debe garantizar el debido proceso, la dignidad humana y la seguridad del colaborador.',
          },
          {
            id: 'opt-2-4-2',
            texto: 'Separarlo inmediatamente de zonas de riesgo, aplicar prueba técnica de tamizaje (alcohosensor) con un testigo del Vigía/compañero y levantar acta de custodia.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! Se resguarda la integridad del trabajador impidiendo su acceso a maquinaria peligrosa, asegurando transparencia con testigos y registro documental legal.',
          },
          {
            id: 'opt-2-4-3',
            texto: 'Hacerlo correr 5 vueltas alrededor de la bodega para que sude el alcohol.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Carece de sentido técnico y atenta contra la salud física del colaborador.',
          },
          {
            id: 'opt-2-4-4',
            texto: 'Ignorarlo hasta que cometa una equivocación en la freidora.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Eso generaría una omisión negligente y un accidente laboral previsible.',
          },
        ],
      },
    ],
  },
  {
    id: 'FRK-SST-PR-01',
    codigoCalidad: 'FRK-SST-PR-01',
    titulo: 'PROCEDIMIENTO OPERATIVO SEGURO EN FREIDORAS INDUSTRIALES Y ACEITE CALIENTE',
    subtitulo: 'Reglas de oro para control térmico a 180°C y prevención de choques de vapor',
    version: '01',
    fechaEmision: '2026-02-01',
    esObligatoria: true,
    icono: 'Flame',
    colorAcento: '#EA580C',
    insigniaNombre: 'Maestro del Control Térmico Frikaz',
    insigniaDescripcion: 'Experto en la operación segura de freidoras continuas, control de termostatos y disposición de ACU.',
    insigniaIcono: 'Award',
    resumenEjecutivo:
      'El proceso de freído industrial de papa y plátano en Frikaz S.A.S. opera con aceite vegetal a temperaturas de hasta 180°C sobre quemadores de gas natural de alta potencia. Este instructivo establece los estándares innegociables de inspección preoperacional, presecado de materia prima, purga segura, respuesta ante conatos con acetato de potasio y drenaje ambiental de ACU.',

    // Atributos de Videojuego
    imagenZona: '/src/assets/images/frikaz_zone_eco_waste_1794397659815.jpg',
    sectorPlantaNombre: 'Sector Gamma: Batería de Freidoras y Gestión Ambiental de ACU',
    dificultad: 'Nivel 3: Experto',
    puntosXp: 450,
    dialogoGuiaBienvenida:
      '¡Llegaste a la zona de drenaje y disposición ecológica! El aceite usado caliente puede causar quemaduras de tercer grado. ¡Comprueba las condiciones antes de abrir las válvulas!',
    hotspots: [
      {
        id: 'hs-balde',
        x: 45,
        y: 65,
        titulo: 'Balde plástico doméstico',
        descripcion: 'Material no industrial que se deforma y desintegra a más de 80°C derramando aceite.',
        esPeligro: true,
        consejoGuia: 'Nunca trasvasar líquidos calientes en plástico no certificado térmicamente.',
      },
      {
        id: 'hs-tambores',
        x: 18,
        y: 72,
        titulo: 'Tambores Herméticos SDA',
        descripcion: 'Canecas metálicas rotuladas con sellos de trazabilidad para gestor autorizado.',
        esPeligro: false,
        consejoGuia: 'Disposición oficial de Aceite de Cocina Usado conforme a la Secretaría Distrital de Ambiente.',
      },
      {
        id: 'hs-temp-drenaje',
        x: 75,
        y: 75,
        titulo: 'Temperatura de aceite a 140°C',
        descripcion: 'Aceite aún a alta temperatura. Peligro crítico de quemaduras de 3er grado.',
        esPeligro: true,
        consejoGuia: 'El protocolo exige esperar el enfriamiento completo por debajo de 40°C antes de drenar.',
      },
    ],
    desafioTerminal: {
      codigoProtocolo: 'FRK-ACU-DISP',
      instruccion: 'Autoriza la apertura de la compuerta de residuos especiales:',
      pregunta: '¿Cuál es la temperatura máxima para iniciar el drenaje de aceite de freidoras?',
      opciones: [
        { id: 't3-1', etiqueta: 'Menos de 40°C (Frío al tacto con guante)', esCorrecta: true },
        { id: 't3-2', etiqueta: '120°C para agilizar el flujo de salida', esCorrecta: false },
        { id: 't3-3', etiqueta: 'Apenas se apaga el quemador de gas', esCorrecta: false },
      ],
    },
    compromisosClave: [
      {
        numero: 1,
        titulo: 'Verificación preoperacional obligatoria',
        descripcion:
          'Inspeccionar termostatos análogos y digitales, perillas de gas, válvulas de corte y campanas antes de encender pilotos.',
        aplicacionEnPlanta:
          'Diligenciamiento diario de la lista de chequeo de freidoras FRK-SST-FOR-01.',
      },
      {
        numero: 2,
        titulo: 'Presecado y escurrido de tubérculos',
        descripcion:
          'Garantizar que las rodajas de papa no posean películas de agua libre al sumergirlas en la cuba de cocción.',
        aplicacionEnPlanta:
          'Uso del centrifugador o canastillas de escurrido mínimo 7 minutos antes del fritado.',
      },
      {
        numero: 3,
        titulo: 'Drenaje de aceite solo por debajo de 40°C',
        descripcion:
          'Nunca evacuar aceite de cocina caliente; esperar el enfriamiento completo en turno posterior.',
        aplicacionEnPlanta:
          'Traslado hermético en canecas rotuladas para gestores autorizados por la SDA.',
      },
    ],
    responsabilidadesPorNivel: [
      {
        nivel: 'Operario de Frito',
        responsabilidad: 'Portar kit térmico (200°C), controlar termostato a 180°C y jamás desatender la freidora encendida.',
      },
      {
        nivel: 'Mantenimiento y SST',
        responsabilidad: 'Calibración trimestral de termostatos y mantenimiento preventivo de quemadores y chimeneas.',
      },
    ],
    escenario: {
      titulo: 'Drenaje de Aceite Usado al Cierre de Turno',
      ubicacionPlanta: 'Planta Bosa – Batería de Freidoras #2 y Zona de Residuos',
      peligroAsociado: 'Físico (Quemadura térmica de tercer grado por contacto con líquidos a alta temperatura)',
      descripcionCaso:
        'Es viernes a las 4:45 PM y la jornada termina a las 5:00 PM. El aceite vegetal de la freidora #2 ya cumplió sus ciclos de calidad (muestra coloración oscura y exceso de polímeros). El operario quiere "dejar todo listo" para salir a su hora y pretende abrir la válvula de desagüe inferior directamente sobre un balde plástico común, con el aceite recién apagado que aún se encuentra a 140°C.',
      elementosInvolucrados: [
        'Aceite vegetal usado a 140°C dentro de la freidora',
        'Válvula manual de drenaje inferior',
        'Balde plástico doméstico no apto para altas temperaturas',
        'Prisa por finalizar la jornada laboral a tiempo',
      ],
      desafioObservacion:
        '¿Cuál es el peligro crítico de esta acción y qué manda el procedimiento oficial de Frikaz S.A.S.?',
      pistas: [
        'Pista 1: Los baldes plásticos estándar se derriten a temperaturas mayores de 80°C, provocando derrames violentos en las piernas y pies del operario.',
        'Pista 2: La regla de oro en Frikaz es drenar únicamente cuando el aceite esté por debajo de 40°C (frío al tacto en la pared exterior).',
      ],
    },
    preguntas: [
      {
        id: 'p3-1',
        numero: 1,
        enunciado:
          '¿Cuál es la temperatura máxima permitida para realizar el drenaje y filtrado de Aceite de Cocina Usado (ACU) en las freidoras de Frikaz S.A.S.?',
        contextoCaso: 'Evacuación de aceite degradado hacia los tambores de almacenamiento SDA.',
        pesoPuntos: 34,
        fundamentoNormativo: 'Procedimiento FRK-SST-PR-01 y Estándar de Seguridad Industrial.',
        opciones: [
          {
            id: 'opt-3-1-1',
            texto: 'A 180°C apenas se apagan los quemadores para que fluya más rápido por las tuberías.',
            esCorrecta: false,
            retroalimentacion: '¡GRAVÍSIMO! Manipular aceite a 180°C fuera de la cuba genera vapores asfixiantes y si se derrama destruye ropa y causa quemaduras de tercer grado que requieren injerto.',
          },
          {
            id: 'opt-3-1-2',
            texto: 'Por debajo de 40°C, habiendo dejado enfriar la freidora apagada durante el reposo programado.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! El protocolo de Frikaz exige esperar a que el aceite descienda por debajo de 40°C para eliminar completamente el riesgo de quemadura y derretimiento de recipientes.',
          },
          {
            id: 'opt-3-1-3',
            texto: 'A 100°C siempre y cuando se use tapabocas de tela.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: A 100°C el aceite aún tiene capacidad calórica extrema para causar daños irreparables.',
          },
        ],
      },
      {
        id: 'p3-2',
        numero: 2,
        enunciado:
          '¿Por qué nunca se debe utilizar un balde de plástico común para trasvasar líquidos calientes en la planta?',
        contextoCaso: 'Uso inadecuado de herramientas no industriales.',
        pesoPuntos: 33,
        fundamentoNormativo: 'Resolución 2400 de 1979 y Ficha Técnica de Materiales.',
        opciones: [
          {
            id: 'opt-3-2-1',
            texto: 'Porque el polipropileno o polietileno estándar colapsa y se desintegra con calor superior a 80°C, derramando el líquido sobre el cuerpo del trabajador.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! Los recipientes plásticos sufren deformación súbita perdiendo su base estructural, vertiendo el líquido hirviendo sobre los pies y miembros inferiores.',
          },
          {
            id: 'opt-3-2-2',
            texto: 'Únicamente porque el color del balde no combina con el uniforme de la empresa.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: Es una cuestión de resistencia mecánica y seguridad física vital.',
          },
          {
            id: 'opt-3-2-3',
            texto: 'Porque hace mucho ruido al rozar con el piso de baldosín.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: El riesgo reside en la deformación térmica inminente del plástico.',
          },
        ],
      },
      {
        id: 'p3-3',
        numero: 3,
        enunciado:
          '¿Qué se debe hacer con el Aceite de Cocina Usado (ACU) retirado de las freidoras de Frikaz S.A.S. según la norma ambiental y el SG-SST?',
        contextoCaso: 'Cumplimiento con la Secretaría Distrital de Ambiente (SDA) de Bogotá.',
        pesoPuntos: 33,
        fundamentoNormativo: 'Resolución 316 de 2018 y Procedimiento FRK-SST-PR-02.',
        opciones: [
          {
            id: 'opt-3-3-1',
            texto: 'Verterlo por el sifón del piso del área de lavado aplicando agua caliente para que no se tranque la cañería.',
            esCorrecta: false,
            retroalimentacion: '¡PROHIBIDO POR LA LEY! Verter aceite al alcantarillado contamina miles de litros de agua, tapona redes y acarrea multas millonarias de la SDA.',
          },
          {
            id: 'opt-3-3-2',
            texto: 'Almacenarlo en tambores herméticos debidamente rotulados y entregarlo exclusivamente a un gestor ambiental autorizado por la SDA con su manifiesto de trazabilidad.',
            esCorrecta: true,
            retroalimentacion: '¡CORRECTO! Frikaz S.A.S. cuenta con protocolo de economía circular y custodia de manifiestos oficiales de disposición final ante la autoridad distrital.',
          },
          {
            id: 'opt-3-3-3',
            texto: 'Regalarlo en botellas plásticas a los vecinos del barrio para que rieguen plantas.',
            esCorrecta: false,
            retroalimentacion: 'INCORRECTO: El ACU no es fertilizante y su disposición informal está penada.',
          },
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// GESTIÓN DE CONFIGURACIÓN Y PERSISTENCIA
// ----------------------------------------------------------------------------

export function getStoredPoliticasMision(): PoliticaMisionFrikaz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POLITICAS_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_POLITICAS_CONFIG, JSON.stringify(POLITICAS_MISION_BASE));
      return POLITICAS_MISION_BASE;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Rehidratar con propiedades de videojuego si faltaban en storage previo
      return parsed.map((stored: PoliticaMisionFrikaz) => {
        const base = POLITICAS_MISION_BASE.find((b) => b.id === stored.id);
        if (!base) return stored;
        return {
          ...base,
          ...stored,
          imagenZona: base.imagenZona,
          sectorPlantaNombre: base.sectorPlantaNombre,
          dificultad: base.dificultad,
          puntosXp: base.puntosXp,
          dialogoGuiaBienvenida: base.dialogoGuiaBienvenida,
          hotspots: base.hotspots,
          desafioTerminal: base.desafioTerminal,
          esObligatoria: typeof stored.esObligatoria === 'boolean' ? stored.esObligatoria : base.esObligatoria,
        };
      });
    }
    return POLITICAS_MISION_BASE;
  } catch (err) {
    console.error('Error cargando políticas de Misión Frikaz:', err);
    return POLITICAS_MISION_BASE;
  }
}

export function saveStoredPoliticasMision(politicas: PoliticaMisionFrikaz[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_POLITICAS_CONFIG, JSON.stringify(politicas));
  } catch (err) {
    console.error('Error guardando políticas de Misión Frikaz:', err);
  }
}

export function getStoredTrabajadores(): TrabajadorFrikaz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRABAJADORES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TRABAJADORES, JSON.stringify(TRABAJADORES_CANONICOS));
      return TRABAJADORES_CANONICOS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_TRABAJADORES, JSON.stringify(TRABAJADORES_CANONICOS));
      return TRABAJADORES_CANONICOS;
    }
    // Asegurar que solo contenga los 7 cargos canónicos y sin nombres ficticios
    const idsCanonicos = new Set(TRABAJADORES_CANONICOS.map((t) => t.id));
    const tieneInvalidos = parsed.some((t) => !idsCanonicos.has(t.id));
    if (tieneInvalidos || parsed.length !== TRABAJADORES_CANONICOS.length) {
      localStorage.setItem(STORAGE_KEY_TRABAJADORES, JSON.stringify(TRABAJADORES_CANONICOS));
      return TRABAJADORES_CANONICOS;
    }
    return parsed;
  } catch (err) {
    console.error('Error cargando trabajadores:', err);
    return TRABAJADORES_CANONICOS;
  }
}

export function getStoredSesionActiva(): TrabajadorFrikaz {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESION_ACTIVA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) {
        // Cotejar con la lista canónica para evitar nombres ficticios persistidos de sesiones anteriores
        const coincide = TRABAJADORES_CANONICOS.find((t) => t.id === parsed.id || t.cargoId === parsed.cargoId);
        if (coincide) return coincide;
      }
    }
  } catch (err) {
    console.error('Error leyendo sesión activa:', err);
  }
  // Por defecto el primer operario de planta (Operario de Frito) para activación obligatoria de la Misión
  return TRABAJADORES_CANONICOS[0];
}

export function setStoredSesionActiva(trabajador: TrabajadorFrikaz): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESION_ACTIVA, JSON.stringify(trabajador));
  } catch (err) {
    console.error('Error guardando sesión activa:', err);
  }
}

export async function validarAccesoBackend(
  trabajadorId: string,
  cargoId?: string
): Promise<{
  accesoAutorizado: boolean;
  totalObligatorias: number;
  totalSuperadas: number;
  misionesPendientes: string[];
  mensaje: string;
}> {
  try {
    const res = await fetch('/api/mision-frikaz/validar-acceso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trabajadorId, cargoId }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        accesoAutorizado: Boolean(data.accesoAutorizado),
        totalObligatorias: data.totalObligatorias || 3,
        totalSuperadas: data.totalSuperadas || 0,
        misionesPendientes: data.misionesPendientes || [],
        mensaje: data.mensaje || '',
      };
    }
  } catch (err) {
    console.warn('[Misión Frikaz] Error conectando con el validador de backend:', err);
  }

  // Fallback seguro del lado cliente
  const pasaporte = getPasaporteDigital(trabajadorId);
  return {
    accesoAutorizado: pasaporte.esEmbajadorFrikaz,
    totalObligatorias: pasaporte.totalObligatorias,
    totalSuperadas: pasaporte.totalSuperadas,
    misionesPendientes: pasaporte.esEmbajadorFrikaz ? [] : ['FRK-SST-POL-01'],
    mensaje: pasaporte.esEmbajadorFrikaz
      ? 'Acceso autorizado.'
      : 'Acceso restringido: Misiones obligatorias pendientes.',
  };
}

export function getStoredProgresos(): Record<string, Record<string, ProgresoPoliticaTrabajador>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESOS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo progresos:', err);
  }
  return {};
}

export function saveStoredProgresos(
  progresos: Record<string, Record<string, ProgresoPoliticaTrabajador>>
): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESOS, JSON.stringify(progresos));
  } catch (err) {
    console.error('Error guardando progresos:', err);
  }
}

export function getStoredIntentos(): IntentoEvaluacion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTENTOS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo intentos:', err);
  }
  return [];
}

export function saveStoredIntentos(intentos: IntentoEvaluacion[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_INTENTOS, JSON.stringify(intentos));
  } catch (err) {
    console.error('Error guardando intentos:', err);
  }
}

// ----------------------------------------------------------------------------
// OBTENCIÓN Y CÁLCULO DEL PASAPORTE DIGITAL
// ----------------------------------------------------------------------------

export function getPasaporteDigital(trabajadorId: string): PasaporteDigital {
  const trabajadores = getStoredTrabajadores();
  const trabajador = trabajadores.find((t) => t.id === trabajadorId) || TRABAJADORES_CANONICOS[0];
  const politicas = getStoredPoliticasMision();
  const todosLosProgresos = getStoredProgresos();
  const trabajadorProgresos = todosLosProgresos[trabajadorId] || {};

  const obligatorias = politicas.filter((p) => p.esObligatoria);
  let totalSuperadas = 0;

  const progresosCompletos: Record<string, ProgresoPoliticaTrabajador> = {};
  const insignias: InsigniaDigital[] = [];

  for (const pol of politicas) {
    const prog = trabajadorProgresos[pol.id] || {
      politicaId: pol.id,
      estado: 'PENDIENTE',
      puntajeMaximo: 0,
      intentosTotales: 0,
    };
    progresosCompletos[pol.id] = prog;

    if (prog.estado === 'SUPERADA') {
      if (pol.esObligatoria) totalSuperadas++;
    }

    insignias.push({
      id: `insignia-${pol.id}`,
      politicaId: pol.id,
      nombre: pol.insigniaNombre,
      descripcion: pol.insigniaDescripcion,
      icono: pol.insigniaIcono,
      colorGradiente: pol.colorAcento,
      fechaObtencion: prog.fechaSuperacion,
      obtenida: prog.estado === 'SUPERADA',
    });
  }

  const porcentajeAvance =
    obligatorias.length > 0
      ? Math.round((totalSuperadas / obligatorias.length) * 100)
      : 100;

  const esEmbajadorFrikaz = totalSuperadas >= obligatorias.length && obligatorias.length > 0;

  return {
    trabajador,
    progresos: progresosCompletos,
    insignias,
    porcentajeAvance,
    totalObligatorias: obligatorias.length,
    totalSuperadas,
    esEmbajadorFrikaz,
    fechaAcreditacionEmbajador: esEmbajadorFrikaz ? new Date().toISOString() : undefined,
  };
}

// ----------------------------------------------------------------------------
// EVALUACIÓN DE RESPUESTAS (FRONTEND + LLAMADA AL BACKEND)
// ----------------------------------------------------------------------------

export interface EvaluacionPayload {
  trabajadorId: string;
  politicaId: string;
  respuestas: {
    preguntaId: string;
    opcionSeleccionadaId: string;
  }[];
  duracionSegundos: number;
}

export interface ResultadoEvaluacion {
  intento: IntentoEvaluacion;
  aprobado: boolean;
  puntaje: number;
  pasaporteActualizado: PasaporteDigital;
  retroalimentaciones: {
    preguntaId: string;
    esCorrecta: boolean;
    textoRetroalimentacion: string;
  }[];
  mensajeServidor?: string;
}

export async function procesarEvaluacionMision(
  payload: EvaluacionPayload
): Promise<ResultadoEvaluacion> {
  const politicas = getStoredPoliticasMision();
  const politica = politicas.find((p) => p.id === payload.politicaId);
  const trabajadores = getStoredTrabajadores();
  const trabajador = trabajadores.find((t) => t.id === payload.trabajadorId) || TRABAJADORES_CANONICOS[0];

  if (!politica) {
    throw new Error(`Política no encontrada: ${payload.politicaId}`);
  }

  // 1. Calificar localmente para respuesta inmediata y resiliente
  let puntosTotales = 0;
  let puntosPosibles = 0;
  const respuestasDetalle: any[] = [];
  const retroalimentaciones: any[] = [];

  for (const pregunta of politica.preguntas) {
    puntosPosibles += pregunta.pesoPuntos;
    const respUsuario = payload.respuestas.find((r) => r.preguntaId === pregunta.id);
    const opcionSeleccionada = pregunta.opciones.find(
      (o) => o.id === (respUsuario ? respUsuario.opcionSeleccionadaId : '')
    );

    const esCorrecta = Boolean(opcionSeleccionada && opcionSeleccionada.esCorrecta);
    const puntosObtenidos = esCorrecta ? pregunta.pesoPuntos : 0;
    puntosTotales += puntosObtenidos;

    respuestasDetalle.push({
      preguntaId: pregunta.id,
      opcionSeleccionadaId: respUsuario?.opcionSeleccionadaId || '',
      esCorrecta,
      puntosObtenidos,
    });

    retroalimentaciones.push({
      preguntaId: pregunta.id,
      esCorrecta,
      textoRetroalimentacion:
        opcionSeleccionada?.retroalimentacion ||
        'No se seleccionó una respuesta válida para esta pregunta.',
    });
  }

  const puntaje = puntosPosibles > 0 ? Math.round((puntosTotales / puntosPosibles) * 100) : 0;
  const aprobado = puntaje >= 80;

  // 2. Registrar el intento
  const todosLosIntentos = getStoredIntentos();
  const intentosPrevios = todosLosIntentos.filter(
    (i) => i.trabajadorId === trabajador.id && i.politicaId === politica.id
  );
  const numeroIntento = intentosPrevios.length + 1;

  const nuevoIntento: IntentoEvaluacion = {
    id: `intento-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    trabajadorId: trabajador.id,
    trabajadorNombre: trabajador.nombre,
    trabajadorCargo: trabajador.cargoNombre,
    trabajadorCedula: trabajador.cedula,
    politicaId: politica.id,
    politicaCodigo: politica.codigoCalidad,
    politicaTitulo: politica.titulo,
    fechaInicio: new Date(Date.now() - payload.duracionSegundos * 1000).toISOString(),
    fechaFin: new Date().toISOString(),
    duracionSegundos: payload.duracionSegundos,
    puntaje,
    aprobado,
    numeroIntento,
    respuestas: respuestasDetalle,
  };

  todosLosIntentos.unshift(nuevoIntento);
  saveStoredIntentos(todosLosIntentos);

  // 3. Actualizar progreso del trabajador
  const todosLosProgresos = getStoredProgresos();
  if (!todosLosProgresos[trabajador.id]) {
    todosLosProgresos[trabajador.id] = {};
  }

  const progresoActual = todosLosProgresos[trabajador.id][politica.id] || {
    politicaId: politica.id,
    estado: 'PENDIENTE',
    puntajeMaximo: 0,
    intentosTotales: 0,
  };

  const nuevoPuntajeMax = Math.max(progresoActual.puntajeMaximo, puntaje);
  const nuevoEstado = aprobado
    ? 'SUPERADA'
    : progresoActual.estado === 'SUPERADA'
    ? 'SUPERADA'
    : 'NO_SUPERADA';

  todosLosProgresos[trabajador.id][politica.id] = {
    politicaId: politica.id,
    estado: nuevoEstado,
    puntajeMaximo: nuevoPuntajeMax,
    intentosTotales: progresoActual.intentosTotales + 1,
    fechaUltimoIntento: nuevoIntento.fechaFin,
    fechaSuperacion: aprobado ? nuevoIntento.fechaFin : progresoActual.fechaSuperacion,
  };

  saveStoredProgresos(todosLosProgresos);

  // 4. Intentar enviar al backend Express para trazabilidad en servidor y Google Sheets
  let mensajeServidor: string | undefined;
  try {
    const res = await fetch('/api/mision-frikaz/evaluar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoIntento),
    });
    if (res.ok) {
      const data = await res.json();
      mensajeServidor = data.message;
      nuevoIntento.sincronizadoGoogleSheets = data.sincronizadoGoogleSheets;
    }
  } catch {
    // Si el backend no responde, la experiencia frontend y la persistencia local siguen funcionando al 100%
  }

  const pasaporteActualizado = getPasaporteDigital(trabajador.id);

  return {
    intento: nuevoIntento,
    aprobado,
    puntaje,
    pasaporteActualizado,
    retroalimentaciones,
    mensajeServidor,
  };
}

// ----------------------------------------------------------------------------
// VERIFICAR SI EL TRABAJADOR TIENE POLÍTICAS PENDIENTES (GATEKEEPER)
// ----------------------------------------------------------------------------
export function tienePoliticasPendientes(trabajadorId: string): boolean {
  const pasaporte = getPasaporteDigital(trabajadorId);
  // Todo colaborador con misiones obligatorias pendientes debe ingresar obligatoriamente al juego
  return !pasaporte.esEmbajadorFrikaz;
}

// ----------------------------------------------------------------------------
// OBTENER MÉTRICAS ADMINISTRATIVAS
// ----------------------------------------------------------------------------
export function getMetricasAdminMision(): MetricasAdminMisionFrikaz {
  const trabajadores = getStoredTrabajadores();
  const politicas = getStoredPoliticasMision();
  const intentos = getStoredIntentos();

  let totalCompletados100 = 0;
  let totalEnProceso = 0;

  for (const t of trabajadores) {
    const pasaporte = getPasaporteDigital(t.id);
    if (pasaporte.esEmbajadorFrikaz) {
      totalCompletados100++;
    } else {
      totalEnProceso++;
    }
  }

  const intentosAprobados = intentos.filter((i) => i.aprobado).length;
  const tasaAprobacionGlobal =
    intentos.length > 0 ? Math.round((intentosAprobados / intentos.length) * 100) : 0;

  // Promedios por política
  const promedioIntentosPorPolitica: Record<string, number> = {};
  for (const pol of politicas) {
    const intentosPol = intentos.filter((i) => i.politicaId === pol.id);
    if (intentosPol.length > 0) {
      const sumaPuntajes = intentosPol.reduce((acc, curr) => acc + curr.puntaje, 0);
      promedioIntentosPorPolitica[pol.id] = Math.round(sumaPuntajes / intentosPol.length);
    } else {
      promedioIntentosPorPolitica[pol.id] = 0;
    }
  }

  // Identificar preguntas más falladas
  const conteoFallosPorPregunta: Record<string, { fallos: number; total: number; enunciado: string; politicaId: string }> = {};

  for (const pol of politicas) {
    for (const preg of pol.preguntas) {
      conteoFallosPorPregunta[preg.id] = {
        fallos: 0,
        total: 0,
        enunciado: preg.enunciado,
        politicaId: pol.id,
      };
    }
  }

  for (const intento of intentos) {
    for (const r of intento.respuestas) {
      if (conteoFallosPorPregunta[r.preguntaId]) {
        conteoFallosPorPregunta[r.preguntaId].total++;
        if (!r.esCorrecta) {
          conteoFallosPorPregunta[r.preguntaId].fallos++;
        }
      }
    }
  }

  const preguntasMasFalladas = Object.entries(conteoFallosPorPregunta)
    .filter(([_, data]) => data.total > 0)
    .map(([preguntaId, data]) => ({
      politicaId: data.politicaId,
      preguntaId,
      enunciado: data.enunciado,
      tasaFallo: Math.round((data.fallos / data.total) * 100),
    }))
    .sort((a, b) => b.tasaFallo - a.tasaFallo)
    .slice(0, 5);

  return {
    totalTrabajadores: trabajadores.length,
    totalCompletados100,
    totalEnProceso,
    tasaAprobacionGlobal,
    promedioIntentosPorPolitica,
    preguntasMasFalladas,
    ultimosIntentos: intentos.slice(0, 20),
  };
}
