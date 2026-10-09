import { FasePhva } from './phvaEvidence';

export interface ModuloPresentacion {
  subtema: string;
  titulo: string;
  desc: string;
}

export interface FasePresentacionConfig {
  tituloFase: string;
  subtituloFase: string;
  modulos: ModuloPresentacion[];
}

export interface ConfiguracionPresentacion {
  banner: {
    etiqueta: string;
    subetiqueta: string;
    empresaInfo: string;
    titulo: string;
    descripcion: string;
  };
  fases: Record<FasePhva, FasePresentacionConfig>;
  guiaDocente: {
    titulo: string;
    descripcion: string;
  };
}

export const CONFIG_PRESENTACION_DEFAULT: ConfiguracionPresentacion = {
  banner: {
    etiqueta: 'EVIDENCIA 1 — PRESENTACIÓN OFICIAL',
    subetiqueta: 'HERRAMIENTA AUTOMATIZADA',
    empresaInfo: 'Frikaz S.A.S. (Bosa, Bogotá — 10 Trabajadores)',
    titulo: 'Sistema Automatizado PHVA — Normativa SST y Ambiental',
    descripcion:
      'Seguimiento inteligente en tiempo real para Frikaz S.A.S. en las 4 fases del ciclo PHVA. Cada norma integra los 6 requisitos obligatorios de la evidencia curricular: Descripción, Importancia, Aplicabilidad, Vigencia oficial, Jurisdicción/Alcance y Evidencia probatoria.',
  },
  fases: {
    PLANEAR: {
      tituloFase: 'PLANEAR — Identificar Normativa (vigente) que regula cada situación y aplique a la pyme:',
      subtituloFase:
        'Estructura curricular de la presentación. Haga clic en cualquier situación para ver o editar los 6 círculos obligatorios de la evidencia.',
      modulos: [
        {
          subtema: 'DIAGNÓSTICO',
          titulo: 'Diagnóstico & Clasificación de Riesgo',
          desc: 'Diagnóstico y clasificación de riesgo (ARL) y Política/objetivos ambientales y SST.',
        },
        {
          subtema: 'ASIGNACIÓN',
          titulo: 'Asignación del Responsable',
          desc: 'Responsable formal del SG-SST con certificación de 50 horas (Res. 0312/2019).',
        },
        {
          subtema: 'MATRIZ LEGAL Y PLAN ANUAL',
          titulo: 'Matriz Legal y Plan Anual de Trabajo',
          desc: 'Manejo de residuos/ACU, vertimientos, emisiones, ruido, matriz legal y cronograma anual.',
        },
        {
          subtema: 'PELIGROS Y ASPECTOS AMBIENTALES',
          titulo: 'Peligros y Aspectos Ambientales',
          desc: 'Identificación de peligros (GTC 45) en fritura/corte y uso eficiente de recursos naturales.',
        },
      ],
    },
    HACER: {
      tituloFase: 'HACER — Identificar Normativa (vigente) que regula cada situación y aplique a la pyme:',
      subtituloFase:
        'Implementación operativa del sistema en planta de snacks fritos. Cobertura de comités, EPP térmico y residuos.',
      modulos: [
        {
          subtema: 'INGRESO',
          titulo: 'Ingreso, Exámenes & Capacitación',
          desc: 'Afiliaciones al SGSS, exámenes médicos ocupacionales de alimentos e inducción.',
        },
        {
          subtema: 'DOTACIÓN Y COMITÉS',
          titulo: 'Dotación & Comités',
          desc: 'Creación de Vigía de SST, Comité de Convivencia y dotación con EPP térmico para freidoras.',
        },
        {
          subtema: 'RIESGOS',
          titulo: 'Riesgos Laborales Específicos',
          desc: 'Riesgo psicosocial (Batería Res. 2764) y riesgos específicos: cuchillas, calor y alturas.',
        },
        {
          subtema: 'RESIDUOS Y EMERGENCIAS',
          titulo: 'Residuos & Emergencias',
          desc: 'Gestor autorizado de ACU (Res. 316), código de colores (Res. 2184) y extintor Clase K.',
        },
      ],
    },
    VERIFICAR: {
      tituloFase: 'VERIFICAR — Identificar Normativa (vigente) que regula cada situación y aplique a la pyme:',
      subtituloFase:
        'Evaluación objetiva, auditoría interna, monitoreo ambiental y revisión directiva por los estándares mínimos.',
      modulos: [
        {
          subtema: 'EVALUACIÓN',
          titulo: 'Evaluación & Indicadores',
          desc: 'Desarrollo de indicadores de gestión y autoevaluación anual de estándares mínimos.',
        },
        {
          subtema: 'AUDITORÍA',
          titulo: 'Auditoría & Seguimiento',
          desc: 'Auditoría interna anual y seguimiento a vertimientos EAAB, manifiestos ACU y emisiones.',
        },
        {
          subtema: 'EVALUACIÓN DEL CUMPLIMIENTO LEGAL',
          titulo: 'Cumplimiento Legal & Código Dorado',
          desc: 'Revisión semestral de la matriz legal y política de salud mental "Código Dorado".',
        },
        {
          subtema: 'REVISIÓN POR LA DIRECCIÓN',
          titulo: 'Revisión por la Dirección',
          desc: 'Revisión y compromiso de la alta dirección, reforma laboral y contrato de aprendizaje.',
        },
      ],
    },
    ACTUAR: {
      tituloFase: 'ACTUAR — Identificar Normativa (vigente) que regula cada situación y aplique a la pyme:',
      subtituloFase:
        'Acciones correctivas, investigación de accidentes ATEL, respuesta a requerimientos y ciclo de mejora continua.',
      modulos: [
        {
          subtema: 'ACCIDENTES Y ENFERMEDADES',
          titulo: 'Accidentes & Enfermedades (ATEL)',
          desc: 'Reporte FURAT en 48h, informe de investigación con Vigía de SST y reubicación laboral.',
        },
        {
          subtema: 'SANCIONES',
          titulo: 'Sanciones & No Conformidades',
          desc: 'Prevención de multas administrativas MinTrabajo/SDA y plan de acciones correctivas.',
        },
        {
          subtema: 'REQUERIMIENTOS DE LA AUTORIDAD',
          titulo: 'Requerimientos de la Autoridad',
          desc: 'Respuesta formal a inspecciones y prevención de responsabilidad penal y civil patronal.',
        },
        {
          subtema: 'CIERRE DE CICLO',
          titulo: 'Cierre de Ciclo & Mejora Continua',
          desc: 'Actualización de matrices GTC 45 y ambiental, mejora de procesos y normas técnicas.',
        },
      ],
    },
  },
  guiaDocente: {
    titulo: 'Guía de Evaluación del Docente (Evidencia 1): Los 6 Círculos Obligatorios',
    descripcion:
      'Cada norma identificada en esta herramienta responde a los 6 elementos evaluados en el proyector: 1. Descripción (qué regula), 2. Importancia (por qué es clave para Frikaz S.A.S. con 10 trabajadores y freidoras), 3. Aplicabilidad (qué debe hacer la pyme), 4. Vigente (comprobación de vigencia en la normativa colombiana), 5. Jurisdicción y Alcance (ámbito distrital Bogotá SDA / MinTrabajo nacional), y 6. Evidencia para Cumplimiento (soporte documental exigido).',
  },
};
