// Types for GTC 45 Risk Identification, Evaluation and Assessment Matrix
// (Matriz de Identificación de Peligros, Evaluación y Valoración de Riesgos GTC 45)

export type TipoClasificacionPeligro =
  | 'Físico'
  | 'Químico'
  | 'Biológico'
  | 'Biomecánico'
  | 'Psicosocial'
  | 'Condiciones de Seguridad'
  | 'Fenómenos Naturales';

export type InterpretacionNP = 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';

export type InterpretacionNR = 'I' | 'II' | 'III' | 'IV';

export type AceptabilidadRiesgo =
  | 'I - No Aceptable'
  | 'II - No Aceptable o Aceptable con control específico'
  | 'III - Mejorable'
  | 'IV - Aceptable';

export interface CriterioTecnicoNC {
  nc: 10 | 25 | 60 | 100;
  clasificacion: 'Leve' | 'Grave' | 'Muy Grave' | 'Mortal o Catastrófico';
  colorBadge: string;
  bgLight: string;
  borderColor: string;
  definicionTecnica: string;
  criterioIncapacidad: string;
  ejemplosOperativos: string;
}

export const TABLA_TECNICA_NC: Record<10 | 25 | 60 | 100, CriterioTecnicoNC> = {
  10: {
    nc: 10,
    clasificacion: 'Leve',
    colorBadge: 'bg-emerald-500 text-white',
    bgLight: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200',
    borderColor: 'border-emerald-500',
    definicionTecnica:
      'Lesiones superficiales o molestias pasajeras que requieren únicamente primeros auxilios, sin generar secuelas permanentes ni afectación funcional relevante.',
    criterioIncapacidad: 'Sin incapacidad o incapacidad temporal corta de 1 a 3 días.',
    ejemplosOperativos:
      'Rasguños, cortaduras menores, pequeñas contusiones, fatiga visual, cefalea leve o irritación ocular/cutánea temporal por vapores o polvo.',
  },
  25: {
    nc: 25,
    clasificacion: 'Grave',
    colorBadge: 'bg-amber-500 text-slate-950 font-bold',
    bgLight: 'bg-amber-950/40 border-amber-500/30 text-amber-200',
    borderColor: 'border-amber-500',
    definicionTecnica:
      'Lesiones que requieren tratamiento médico especializado, incapacidad temporal de mediana duración, pero con recuperación total sin secuelas permanentes ni invalidez.',
    criterioIncapacidad: 'Incapacidad temporal de 4 a 30 días.',
    ejemplosOperativos:
      'Esguinces o luxaciones, quemaduras de 1.° o 2.° grado limitadas (contacto con aceite o vapor), fisuras óseas, fracturas simples de falanges o extremidades menores, heridas profundas con necesidad de sutura.',
  },
  60: {
    nc: 60,
    clasificacion: 'Muy Grave',
    colorBadge: 'bg-orange-600 text-white font-bold',
    bgLight: 'bg-orange-950/40 border-orange-500/30 text-orange-200',
    borderColor: 'border-orange-500',
    definicionTecnica:
      'Lesiones graves con alto compromiso de salud del trabajador, hospitalización prolongada, invalidez parcial permanente o secuelas permanentes funcionales o anatómicas.',
    criterioIncapacidad: 'Incapacidad prolongada (> 30 días) o declaración de invalidez parcial permanente (pérdida de capacidad laboral < 50%).',
    ejemplosOperativos:
      'Fracturas de huesos largos (fémur, húmero, columna vertebral), amputación traumática de dedos, pérdida parcial de audición (hipoacusia neurosensorial inducida por ruido), pérdida de visión en un ojo, quemaduras de 3.° grado extensas.',
  },
  100: {
    nc: 100,
    clasificacion: 'Mortal o Catastrófico',
    colorBadge: 'bg-rose-600 text-white font-black',
    bgLight: 'bg-rose-950/40 border-rose-500/30 text-rose-200',
    borderColor: 'border-rose-500',
    definicionTecnica:
      'Eventos fatales o lesiones de extrema gravedad e irreversibles con potencial de cobrar vidas humanas, amputaciones mayores múltiples o causar invalidez permanente total en uno o varios trabajadores simultáneamente.',
    criterioIncapacidad: 'Incapacidad permanente total (PCL >= 50%), gran invalidez o fallecimiento.',
    ejemplosOperativos:
      'Muerte o politraumatismo por caída de altura sin protección, electrocución fatal con alta tensión, atrapamiento de cuerpo entero en tornillo sinfín o mezcladora, explosión de caldera / fuga masiva de gas con deflagración, colapso estructural por sismo mayor.',
  },
};

export interface RiesgoGTC45Item {
  id: string;
  codigo?: string;

  // 1. Identificación de la actividad
  proceso: string;
  zonaLugar: string;
  actividades: string;
  tareas: string;
  rutinario: 'SÍ' | 'NO';

  // 2. Identificación del peligro
  peligroDescripcion: string;
  peligroClasificacion: TipoClasificacionPeligro;
  efectosPosibles: string;

  // 3. Controles existentes
  controlesFuente: string;
  controlesMedio: string;
  controlesIndividuo: string;

  // 4. Evaluación del riesgo (GTC 45)
  nivelDeficiencia: 2 | 6 | 10;
  nivelExposicion: 1 | 2 | 3 | 4;
  nivelProbabilidad: number; // ND * NE
  interpretacionNP: InterpretacionNP;
  nivelConsecuencia: 10 | 25 | 60 | 100;
  nivelRiesgo: number; // NP * NC
  interpretacionNR: InterpretacionNR;
  aceptabilidadRiesgo: AceptabilidadRiesgo;

  // 5. Criterios para establecer controles
  numeroExpuestos: number;
  peorConsecuencia: string;
  existenciaRequisitoLegal: 'SÍ' | 'NO';
  requisitoLegalEspecifico?: string;

  // 6. Medidas de intervención
  medidaEliminacion: string;
  medidaSustitucion: string;
  medidaControlesIngenieria: string;
  medidaControlesAdministrativos: string;
  medidaEquiposEPP: string;

  // Metadata opcional
  observaciones?: string;
  fechaEvaluacion?: string;
}
