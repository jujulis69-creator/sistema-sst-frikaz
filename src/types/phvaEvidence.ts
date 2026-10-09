export type FasePhva = 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';

export type SubtemaPhva =
  // PLANEAR
  | 'DIAGNÓSTICO'
  | 'ASIGNACIÓN'
  | 'MATRIZ LEGAL Y PLAN ANUAL'
  | 'PELIGROS Y ASPECTOS AMBIENTALES'
  // HACER
  | 'INGRESO'
  | 'DOTACIÓN Y COMITÉS'
  | 'RIESGOS'
  | 'RESIDUOS Y EMERGENCIAS'
  // VERIFICAR
  | 'EVALUACIÓN'
  | 'AUDITORÍA'
  | 'EVALUACIÓN DEL CUMPLIMIENTO LEGAL'
  | 'REVISIÓN POR LA DIRECCIÓN'
  // ACTUAR
  | 'ACCIDENTES Y ENFERMEDADES'
  | 'SANCIONES'
  | 'REQUERIMIENTOS DE LA AUTORIDAD'
  | 'CIERRE DE CICLO';

export type EstadoCumplimiento = 'CUMPLE' | 'PARCIAL' | 'NO_CUMPLE';

export interface NormaPhvaItem {
  id: string;
  fase: FasePhva;
  subtema: SubtemaPhva | string;
  tituloSituacion: string; // Situación que regula y aplica a la pyme Frikaz S.A.S.
  normaOficial: string; // ej. "Decreto 1072 de 2015"
  entidadEmisora: string; // ej. "Ministerio del Trabajo"
  articulos: string; // ej. "Artículos 2.2.4.6.5 al 2.2.4.6.7"
  area: 'SST' | 'AMBIENTAL' | 'INTEGRAL';

  // LOS 6 CÍRCULOS OBLIGATORIOS DE LA EVIDENCIA (SLIDE 1):
  descripcion: string; // 1. DESCRIPCIÓN: Qué regula la disposición
  importancia: string; // 2. IMPORTANCIA: Por qué es crucial para Frikaz S.A.S. (10 trab., snacks fritos)
  aplicabilidad: string; // 3. APLICABILIDAD: Qué debe hacer concretamente Frikaz S.A.S.
  vigente: boolean; // 4. VIGENTE: Vigencia confirmada oficial
  textoVigencia: string; // Detalle de vigencia oficial en SUIN / MinTrabajo / SDA
  jurisdiccionAlcance: string; // 5. JURISDICCIÓN Y ALCANCE: Nacional / Distrital Bogotá, cobertura
  evidenciaCumplimiento: string; // 6. EVIDENCIA PARA CUMPLIMIENTO: Documento o soporte que demuestra cumplimiento

  // AUTOMATIZACIÓN Y SEGUIMIENTO:
  estado: EstadoCumplimiento;
  responsable: string;
  fechaVerificacion: string;
  observaciones: string;
}

export interface ResumenFaseCalculado {
  total: number;
  cumplidas: number;
  parciales: number;
  noCumplidas: number;
  porcentaje: number;
}

export interface IndicadoresAutomaticos {
  generalPorcentaje: number;
  sstPorcentaje: number;
  ambientalPorcentaje: number;
  porFase: Record<FasePhva, ResumenFaseCalculado>;
  totalNormas: number;
  totalVigentes: number;
  alertasPendientes: number;
}
