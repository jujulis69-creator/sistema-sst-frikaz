import { NormaPhvaItem } from '../types/phvaEvidence';

export interface DictamenAuditoria {
  nivelCumplimiento: 'EXCELENTE' | 'ACEPTABLE_CON_OBSERVACIONES' | 'CRITICO_EN_RIESGO';
  puntaje: number;
  resultadoLegalMinTrabajo: string;
  resultadoLegalSDABogota: string;
  multasAhorradasCOP: string;
  multasAhorradasSMMLV: number;
  recomendacionesAutomaticas: {
    prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
    norma: string;
    accion: string;
    plazoDias: number;
    fechaSugerida: string;
  }[];
}

const SMMLV_VALOR_2026 = 1423500; // Valor de referencia aproximado SMMLV Colombia

export function ejecutarAutoAuditoria(items: NormaPhvaItem[]): DictamenAuditoria {
  const total = items.length;
  const cumplidas = items.filter((i) => i.estado === 'CUMPLE').length;
  const parciales = items.filter((i) => i.estado === 'PARCIAL').length;
  const noCumplidas = items.filter((i) => i.estado === 'NO_CUMPLE').length;

  const puntaje = Math.round(((cumplidas + parciales * 0.5) / total) * 100);

  let nivelCumplimiento: 'EXCELENTE' | 'ACEPTABLE_CON_OBSERVACIONES' | 'CRITICO_EN_RIESGO' =
    'ACEPTABLE_CON_OBSERVACIONES';
  let resultadoLegalMinTrabajo = '';
  let resultadoLegalSDABogota = '';

  if (puntaje >= 85) {
    nivelCumplimiento = 'EXCELENTE';
    resultadoLegalMinTrabajo = 'APROBADO — Cumple estándares mínimos requeridos para pyme de 10 trabajadores (Res. 0312/2019). Mantener plan anual.';
    resultadoLegalSDABogota = 'CONFORME — Gestión de ACU, vertimientos y residuos sólidos dentro de los parámetros de la SDA Bogotá.';
  } else if (puntaje >= 60) {
    nivelCumplimiento = 'ACEPTABLE_CON_OBSERVACIONES';
    resultadoLegalMinTrabajo = 'PLAN DE MEJORA OBLIGATORIO — Puntaje entre 60% y 85%. Requiere enviar plan de acción correctivo a la ARL dentro de los próximos 30 días.';
    resultadoLegalSDABogota = 'OBSERVACIONES TÉCNICAS — Se requiere actualizar soportes de trampa de grasa y manifiestos de gestor de ACU.';
  } else {
    nivelCumplimiento = 'CRITICO_EN_RIESGO';
    resultadoLegalMinTrabajo = 'CRÍTICO (<60%) — Riesgo inminente de sanción pecuniaria y visita de inspección del Ministerio del Trabajo.';
    resultadoLegalSDABogota = 'NO CONFORME — Riesgo de medidas preventivas de suspensión o decomiso por parte de la Secretaría Distrital de Ambiente.';
  }

  // Multas evitadas aproximadas (según Art. 13 Ley 1562 y Ley 1333): 10 SMMLV por cada norma cumplida
  const smmlvAhorrados = cumplidas * 15 + parciales * 5;
  const copAhorrados = smmlvAhorrados * SMMLV_VALOR_2026;
  const multasAhorradasCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(copAhorrados);

  // Generar recomendaciones automáticas con fechas límite
  const hoy = new Date();
  const recomendacionesAutomaticas: DictamenAuditoria['recomendacionesAutomaticas'] = [];

  items
    .filter((i) => i.estado === 'NO_CUMPLE' || i.estado === 'PARCIAL')
    .forEach((item) => {
      const plazo = item.estado === 'NO_CUMPLE' ? 15 : 30;
      const fechaSugerida = new Date(hoy.getTime() + plazo * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      recomendacionesAutomaticas.push({
        prioridad: item.estado === 'NO_CUMPLE' ? 'ALTA' : 'MEDIA',
        norma: item.normaOficial,
        accion: `Completar evidencia probatoria para: "${item.tituloSituacion}" (${item.evidenciaCumplimiento}).`,
        plazoDias: plazo,
        fechaSugerida,
      });
    });

  return {
    nivelCumplimiento,
    puntaje,
    resultadoLegalMinTrabajo,
    resultadoLegalSDABogota,
    multasAhorradasCOP,
    multasAhorradasSMMLV: smmlvAhorrados,
    recomendacionesAutomaticas,
  };
}

export function descargarPlantillaOficial(tipo: string): void {
  const fecha = new Date().toLocaleDateString('es-CO');
  let titulo = '';
  let contenido = '';

  switch (tipo) {
    case 'RESPONSABLE_SST':
      titulo = 'Acta_Designacion_Responsable_SG_SST_Frikaz';
      contenido = `================================================================================
FRIKAZ S.A.S. — NIT 901.654.892-3
SEDE BOSA PIAMONTE, BOGOTÁ D.C. — PLANTA DE SNACKS FRITOS
SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)
================================================================================

DOCUMENTO OFICIAL: CARTA DE ASIGNACIÓN DEL RESPONSABLE DEL SG-SST
CUMPLIMIENTO: RESOLUCIÓN 0312 DE 2019 (ESTÁNDAR 1) Y DECRETO 1072 DE 2015

Fecha de Emisión: ${fecha}
Ciudad: Bogotá D.C., Colombia

Por medio de la presente, la Gerencia General de FRIKAZ S.A.S., en cumplimiento de lo establecido en el Artículo 3 de la Resolución 0312 de 2019 para empresas de diez (10) o menos trabajadores, procede a designar formalmente al RESPONSABLE DEL DISEÑO E IMPLEMENTACIÓN DEL SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST).

1. DATOS DE LA EMPRESA:
- Razón Social: FRIKAZ S.A.S.
- NIT: 901.654.892-3
- Dirección: Calle 69A Sur # 80J - 14, Piamonte, Bosa (Bogotá D.C.)
- Número de Trabajadores: 10
- Actividad Económica: Producción y comercialización de snacks fritos (papas, plátanos, chicharrones)
- Clase de Riesgo ARL: Clase II / III

2. FUNCIONES Y RESPONSABILIDADES ASIGNADAS:
- Diseñar, administrar y ejecutar el Sistema de Gestión de SST de la planta.
- Coordinar la identificación de peligros y evaluación de riesgos (GTC 45) en freidoras y corte.
- Promover el uso estricto de EPP térmico y calzado antideslizante entre los 10 operarios.
- Coordinar con la ARL las capacitaciones en extintor Clase K y primeros auxilios.
- Realizar seguimiento a las evaluaciones médicas ocupacionales con énfasis en manipulación de alimentos.

3. COMPETENCIA Y CERTIFICACIÓN LEGAL:
Se anexa copia de la certificación vigente del Curso Virtual de 50 Horas en el SG-SST debidamente aprobado y registrado en la base de datos oficial del Ministerio del Trabajo.

En constancia de aceptación y compromiso, se firma en Bogotá D.C. a los ${fecha}.

_________________________________________      _________________________________________
GERENTE GENERAL / REPRESENTANTE LEGAL          RESPONSABLE ASIGNADO DEL SG-SST
FRIKAZ S.A.S.                                  CURSO 50H SST MINTRABAJO
================================================================================`;
      break;

    case 'ACU_MANIFIESTO':
      titulo = 'Manifiesto_Entrega_Aceite_Cocina_Usado_ACU_Frikaz';
      contenido = `================================================================================
FRIKAZ S.A.S. — NIT 901.654.892-3
GESTIÓN AMBIENTAL — CONTROL DE ACEITE DE COCINA USADO (ACU)
RESOLUCIÓN 316 DE 2018 (MADS) Y REGISTRO DISTRITAL SDA BOGOTÁ
================================================================================

CERTIFICADO / MANIFIESTO DE ENTREGA DE ACU A GESTOR AUTORIZADO
Fecha de Entrega: ${fecha}
Sede Generadora: Calle 69A Sur # 80J - 14, Piamonte, Bosa (Bogotá D.C.)

1. DATOS DEL GENERADOR INDUSTRIAL:
- Empresa: FRIKAZ S.A.S.
- Actividad: Fritura industrial por inmersión de tubérculos y cárnicos
- Volumen de Generación Promedio: 180 a 250 Litros / mes
- Registro SDA Bogotá: REG-ACU-BOG-2026-FK

2. DETALLE DEL LOTE ENTREGADO:
- Volumen Entregado: 220 Litros
- Tipo de Aceite: Aceite vegetal comestible usado (palma y soya)
- Estado de los Recipientes: Bidones plásticos de 55 galones con tapa y aro hermético
- Temperatura de Despacho: Temperatura ambiente (< 35°C)
- Sistema Antiderrames: Verificado conforme

3. DATOS DEL GESTOR AMBIENTAL AUTORIZADO (SECRETARÍA DISTRITAL DE AMBIENTE):
- Razón Social del Gestor: BIO-ENERGÍA & VALORIZACIÓN AMBIENTAL BOGOTÁ S.A.S.
- Registro Ambiental SDA: GEST-ACU-SDA-881
- Destino Final Declarado: Fabricación de Biocombustible (Biodiésel B100)
- Conductor / Placa Vehículo: WRO-412

DECLARACIÓN: Se certifica que este aceite NO fue vertido al alcantarillado público ni destinado a consumo humano o animal, cumpliendo al 100% la Resolución 316 de 2018.

_________________________________________      _________________________________________
COORDINADOR AMBIENTAL FRIKAZ S.A.S.            GESTOR AMBIENTAL AUTORIZADO SDA
ENTREGÓ CONFORME                               RECIBIÓ PARA VALORIZACIÓN
================================================================================`;
      break;

    case 'VIGIA_SST':
      titulo = 'Acta_Posesion_Vigia_SST_Frikaz';
      contenido = `================================================================================
FRIKAZ S.A.S. — NIT 901.654.892-3
ACTA DE ELECCIÓN Y POSESIÓN DEL VIGÍA DE SEGURIDAD Y SALUD EN EL TRABAJO
RESOLUCIÓN 2013 DE 1986 Y DECRETO 1072 DE 2015 (PERIODO 2025 - 2027)
================================================================================

Fecha de Elección y Posesión: ${fecha}
Lugar: Instalaciones de planta, Bosa Piamonte, Bogotá D.C.

En las instalaciones de FRIKAZ S.A.S., contando con la asistencia de los diez (10) trabajadores que componen la nómina de la empresa, se llevó a cabo el proceso de votación democrática y libre para elegir al VIGÍA DE SEGURIDAD Y SALUD EN EL TRABAJO, en cumplimiento del Artículo 2 de la Resolución 2013 de 1986.

1. ESCRUTINIO:
- Trabajadores Habilitados: 10
- Votos Depositados: 10
- Resultado Mayoritario: Operador de Planta Designado

2. POSESIÓN FORMAL:
El trabajador electo asume formalmente las funciones de Vigía de SST por un periodo legal de dos (2) años, comprometiéndose a:
- Participar en las inspecciones mensuales de seguridad a freidoras, rebanadoras y pisos.
- Proponer medidas preventivas para evitar accidentes de trabajo y enfermedades laborales.
- Participar como integrante del equipo investigador de incidentes y accidentes de trabajo.
- Servir como canal de comunicación entre los operarios y la Gerencia en temas de SST.

Se firma la presente acta por la Gerencia y la totalidad de los trabajadores.

_________________________________________      _________________________________________
GERENTE GENERAL FRIKAZ S.A.S.                  VIGÍA DE SST ELECTO
REPRESENTANTE DEL EMPLEADOR                    REPRESENTANTE DE LOS TRABAJADORES
================================================================================`;
      break;

    case 'EPP_TERMICO':
      titulo = 'Formato_Entrega_EPP_Fritura_Frikaz';
      contenido = `================================================================================
FRIKAZ S.A.S. — NIT 901.654.892-3
REGISTRO INDIVIDUAL DE ENTREGA Y COMPROMISO DE USO DE EPP
RESOLUCIÓN 2400 DE 1979 (ART. 170-178) Y LEY 9 DE 1979
================================================================================

Fecha de Asignación: ${fecha}
Planta: Frikaz S.A.S. (Bosa Piamonte, Bogotá D.C.)

1. DATOS DEL TRABAJADOR BENEFICIARIO:
- Nombre: Operario de Línea de Fritos
- Cargo: Operador de Freidoras Industriales / Corte de Tubérculos
- Área: Producción Caliente

2. ELEMENTOS DE PROTECCIÓN PERSONAL SUMINISTRADOS:
[X] Guantes de nitrilo térmico de caña larga resistentes a alta temperatura (200°C)
[X] Careta facial de policarbonato con visor de protección contra salpicaduras de aceite
[X] Delantal impermeable y térmico de carnaza de alta resistencia
[X] Calzado de seguridad con suela antideslizante con dibujo profundo y puntera de protección
[X] Guante de malla metálica de acero inoxidable para maniobras de corte y afilado
[X] Tapabocas y gorro de cofia sanitaria para manipulación higiénica de alimentos

3. COMPROMISO DEL TRABAJADOR:
Declaro haber recibido los EPP en perfecto estado de funcionamiento y con la instrucción técnica sobre su uso correcto. Me comprometo a utilizarlos de forma obligatoria y permanente durante la jornada laboral y reportar inmediatamente cualquier desgaste.

_________________________________________      _________________________________________
FIRMA DEL TRABAJADOR OPERARIO                  RESPONSABLE DE ENTREGA / SST
C.C.                                           FRIKAZ S.A.S.
================================================================================`;
      break;

    default:
      titulo = 'Evidencia_Oficial_Frikaz';
      contenido = `FRIKAZ S.A.S. - Evidencia Normativa generada el ${fecha}`;
  }

  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${titulo}_${fecha.replace(/\//g, '-')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
