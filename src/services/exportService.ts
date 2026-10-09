import {
  Norm,
  Obligacion,
  PhvaRegistro,
  Evidencia,
  AccionCorrectiva,
  IndicadoresCumplimiento,
  EmpresaFrikazConfig,
} from '../types';

function escapeCsvCell(cell: any): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell).replace(/"/g, '""');
  return `"${str}"`;
}

function downloadCsv(filename: string, rows: string[][]): void {
  // UTF-8 BOM \uFEFF ensures Excel recognizes Spanish accents properly
  const csvContent = '\uFEFF' + rows.map((r) => r.map(escapeCsvCell).join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const FECHA_HOY = () => new Date().toISOString().split('T')[0];

export function exportMatrizNormativaCsv(norms: Norm[], areaFilter?: 'SST' | 'Ambiental'): void {
  const filtered = areaFilter ? norms.filter((n) => n.area === areaFilter) : norms;
  const filename = `Frikaz_Matriz_Normativa_${areaFilter || 'Completa'}_${FECHA_HOY()}.csv`;

  const rows: string[][] = [
    [
      'FRIKAZ S.A.S. - MATRIZ DE REQUISITOS LEGALES SST Y AMBIENTAL',
      `Fecha de Generación: ${new Date().toLocaleString('es-CO')}`,
      'Ubicación: Bosa, Bogotá D.C.',
      'Trabajadores: 10',
    ],
    [],
    [
      'CÓDIGO',
      'ÁREA',
      'TIPO DISPOSICIÓN',
      'NÚMERO',
      'AÑO',
      'NOMBRE OFICIAL',
      'ENTIDAD EMISORA',
      'ARTÍCULOS APLICABLES',
      'DESCRIPCIÓN',
      'IMPORTANCIA PARA FRIKAZ S.A.S.',
      'APLICABILIDAD CONCRETA',
      'JURISDICCIÓN',
      'ALCANCE',
      'ESTADO VIGENCIA',
      'MODIFICACIONES',
      'FECHA CONSULTA',
      'FUENTE OFICIAL',
      'ENLACE FUENTE',
      'RESPONSABLE',
      'ESTADO REVISIÓN',
      'OBSERVACIONES',
    ],
  ];

  filtered.forEach((n) => {
    rows.push([
      n.codigoIdentificador,
      n.area,
      n.tipoDisposicion,
      n.numero,
      String(n.anio),
      n.nombreOficial,
      n.entidadEmisora,
      n.articulosAplicables,
      n.descripcion,
      n.importanciaFrikaz,
      n.aplicabilidadConcreta,
      n.jurisdiccion,
      n.alcance,
      n.estadoVigencia,
      n.modificacionesIdentificadas,
      n.fechaUltimaConsulta,
      n.fuenteOficial,
      n.enlaceFuente,
      n.responsable,
      n.estadoRevision,
      n.observaciones,
    ]);
  });

  downloadCsv(filename, rows);
}

export function exportObligacionesCsv(obligaciones: Obligacion[], norms: Norm[], filtroIncumplidas = false): void {
  const normMap = new Map<string, Norm>();
  norms.forEach((n) => normMap.set(n.id, n));

  const items = filtroIncumplidas
    ? obligaciones.filter((o) => o.estadoCumplimiento === 'No cumple')
    : obligaciones;

  const filename = filtroIncumplidas
    ? `Frikaz_Obligaciones_Incumplidas_${FECHA_HOY()}.csv`
    : `Frikaz_Matriz_Obligaciones_${FECHA_HOY()}.csv`;

  const rows: string[][] = [
    [
      `FRIKAZ S.A.S. - ${filtroIncumplidas ? 'REPORTE DE OBLIGACIONES INCUMPLIDAS' : 'MATRIZ DE OBLIGACIONES LEGALES'}`,
      `Fecha de Generación: ${new Date().toLocaleString('es-CO')}`,
    ],
    [],
    [
      'CÓDIGO OBLIGACIÓN',
      'ÁREA',
      'NORMA RELACIONADA',
      'ARTÍCULO / NUMERAL',
      'DESCRIPCIÓN DE LA OBLIGACIÓN',
      'JUSTIFICACIÓN APLICABILIDAD',
      'ACTIVIDAD NECESARIA',
      'RESPONSABLE',
      'FECHA LÍMITE',
      'FRECUENCIA',
      'RECURSOS NECESARIOS',
      'INDICADOR CUMPLIMIENTO',
      'EVIDENCIA REQUERIDA',
      'ESTADO CUMPLIMIENTO',
      'APLICABILIDAD',
      'FECHA ÚLTIMA VERIFICACIÓN',
      'OBSERVACIONES',
    ],
  ];

  items.forEach((o) => {
    const norm = normMap.get(o.normaId);
    rows.push([
      o.codigo,
      norm?.area || 'N/A',
      norm ? `${norm.tipoDisposicion} ${norm.numero} de ${norm.anio}` : 'N/A',
      o.articuloNumeral,
      o.descripcionObligacion,
      o.justificacionAplicabilidad,
      o.actividadNecesaria,
      o.responsable,
      o.fechaLimite,
      o.frecuencia,
      o.recursosNecesarios,
      o.indicadorCumplimiento,
      o.evidenciaRequerida,
      o.estadoCumplimiento,
      o.estadoAplicabilidad,
      o.fechaUltimaVerificacion,
      o.observaciones,
    ]);
  });

  downloadCsv(filename, rows);
}

export function exportEvidenciasFaltantesCsv(obligaciones: Obligacion[], evidencias: Evidencia[], norms: Norm[]): void {
  const normMap = new Map<string, Norm>();
  norms.forEach((n) => normMap.set(n.id, n));

  const verifiedObligIds = new Set(
    evidencias.filter((e) => e.estadoRevision === 'Verificada y suficiente').map((e) => e.obligacionId)
  );

  const faltantes = obligaciones.filter(
    (o) => o.estadoAplicabilidad === 'Aplicable' && !verifiedObligIds.has(o.id)
  );

  const filename = `Frikaz_Evidencias_Faltantes_${FECHA_HOY()}.csv`;

  const rows: string[][] = [
    [
      'FRIKAZ S.A.S. - REPORTE DE EVIDENCIAS FALTANTES O INSUFICIENTES',
      `Fecha: ${new Date().toLocaleString('es-CO')}`,
    ],
    [],
    [
      'CÓDIGO OBLIGACIÓN',
      'ÁREA',
      'NORMA',
      'ARTÍCULO',
      'EVIDENCIA REQUERIDA POR LEY',
      'ESTADO CUMPLIMIENTO',
      'RESPONSABLE',
      'FECHA LÍMITE',
      'ACCIÓN REQUERIDA',
    ],
  ];

  faltantes.forEach((o) => {
    const norm = normMap.get(o.normaId);
    rows.push([
      o.codigo,
      norm?.area || 'N/A',
      norm ? `${norm.tipoDisposicion} ${norm.numero}` : 'N/A',
      o.articuloNumeral,
      o.evidenciaRequerida,
      o.estadoCumplimiento,
      o.responsable,
      o.fechaLimite,
      'Recopilar, verificar y cargar soporte documental en el sistema',
    ]);
  });

  downloadCsv(filename, rows);
}

export function exportPhvaCsv(phvaList: PhvaRegistro[], obligaciones: Obligacion[], norms: Norm[]): void {
  const obligMap = new Map<string, Obligacion>();
  obligaciones.forEach((o) => obligMap.set(o.id, o));
  const normMap = new Map<string, Norm>();
  norms.forEach((n) => normMap.set(n.id, n));

  const filename = `Frikaz_Seguimiento_PHVA_${FECHA_HOY()}.csv`;

  const rows: string[][] = [
    [
      'FRIKAZ S.A.S. - MATRIZ DE SEGUIMIENTO AL CICLO PHVA',
      `Fecha: ${new Date().toLocaleString('es-CO')}`,
    ],
    [],
    [
      'ID ACTIVIDAD',
      'TÍTULO ACTIVIDAD',
      'NORMA',
      'OBLIGACIÓN',
      'P - OBJETIVO PLANEAR',
      'P - RESPONSABLE',
      'P - FECHA PROG.',
      'P - ESTADO',
      'H - ACTIVIDAD EJECUTADA',
      'H - FECHA EJECUCIÓN',
      'H - EVIDENCIA OBTENIDA',
      'H - ESTADO',
      'V - MÉTODO VERIFICACIÓN',
      'V - RESULTADO',
      'V - HALLAZGOS',
      'V - FECHA REV.',
      'V - ESTADO',
      'A - ACCIÓN DE MEJORA',
      'A - ESTADO ACCIÓN',
      'A - EFICACIA',
      'A - FECHA CIERRE',
    ],
  ];

  phvaList.forEach((p) => {
    const oblig = obligMap.get(p.obligacionId);
    const norm = normMap.get(p.normaId);
    rows.push([
      p.id,
      p.tituloActividad,
      norm ? `${norm.tipoDisposicion} ${norm.numero}` : 'N/A',
      oblig?.codigo || 'N/A',
      p.planear.objetivo,
      p.planear.responsable,
      p.planear.fechaProgramada,
      p.planear.completado ? 'Completado' : 'Pendiente',
      p.hacer.actividadesEjecutadas,
      p.hacer.fechaEjecucion,
      p.hacer.evidenciasObtenidas,
      p.hacer.completado ? 'Completado' : 'Pendiente',
      p.verificar.metodoVerificacion,
      p.verificar.resultado,
      p.verificar.hallazgos,
      p.verificar.fechaRevision,
      p.verificar.completado ? 'Completado' : 'Pendiente',
      p.actuar.accionCorrectivaMejora,
      p.actuar.estadoAccion,
      p.actuar.verificacionEficacia,
      p.actuar.fechaCierre || 'No cerrado',
    ]);
  });

  downloadCsv(filename, rows);
}

export function exportAccionesCorrectivasCsv(acciones: AccionCorrectiva[], obligaciones: Obligacion[]): void {
  const obligMap = new Map<string, Obligacion>();
  obligaciones.forEach((o) => obligMap.set(o.id, o));

  const filename = `Frikaz_Acciones_Correctivas_${FECHA_HOY()}.csv`;

  const rows: string[][] = [
    [
      'FRIKAZ S.A.S. - PLAN DE ACCIONES CORRECTIVAS Y DE MEJORA',
      `Fecha: ${new Date().toLocaleString('es-CO')}`,
    ],
    [],
    [
      'CÓDIGO',
      'OBLIGACIÓN VINCULADA',
      'HALLAZGO / INCUMPLIMIENTO',
      'CAUSA RAÍZ IDENTIFICADA',
      'ACCIÓN CORRECTIVA PROPUESTA',
      'RESPONSABLE',
      'FECHA APERTURA',
      'FECHA LÍMITE',
      'ESTADO ACCIÓN',
      'EVIDENCIA DE EJECUCIÓN',
      'FECHA VERIFICACIÓN',
      'RESULTADO DE EFICACIA',
      'FECHA DE CIERRE',
    ],
  ];

  acciones.forEach((a) => {
    const oblig = obligMap.get(a.obligacionId);
    rows.push([
      a.codigo,
      oblig ? `${oblig.codigo} - ${oblig.descripcionObligacion.slice(0, 40)}...` : 'N/A',
      a.hallazgo,
      a.causaIdentificada,
      a.accionPropuesta,
      a.responsable,
      a.fechaApertura,
      a.fechaLimite,
      a.estado,
      a.evidenciaEjecucion,
      a.fechaVerificacion,
      a.resultadoVerificacionEficacia,
      a.fechaCierre || 'Pendiente de Cierre',
    ]);
  });

  downloadCsv(filename, rows);
}

export function exportIndicadoresCsv(indicadores: IndicadoresCumplimiento, empresa: EmpresaFrikazConfig): void {
  const filename = `Frikaz_Indicadores_Cumplimiento_${FECHA_HOY()}.csv`;

  const rows: string[][] = [
    ['FRIKAZ S.A.S. - TABLERO OFICIAL DE INDICADORES NORMATIVOS SST Y AMBIENTAL'],
    [`Empresa: ${empresa.nombre} | NIT: ${empresa.nit}`],
    [`Ubicación: ${empresa.direccion}, ${empresa.ciudad} | Trabajadores: ${empresa.numeroTrabajadores}`],
    [`Fecha de Generación: ${new Date().toLocaleString('es-CO')}`],
    [],
    ['INDICADOR DE GESTIÓN', 'VALOR ACTUAL', 'UNIDAD / INTERPRETACIÓN'],
    ['Total de Normas Registradas', String(indicadores.totalNormas), 'Normas en la matriz'],
    ['Normas Vigentes Verificadas', String(indicadores.normasVigentesVerificadas), 'Vigencia oficial confirmada'],
    ['Normas Pendientes de Validación', String(indicadores.normasPendientesValidacion), 'Por validar en SUIN/SDA'],
    ['Total Obligaciones Legales', String(indicadores.totalObligaciones), 'Obligaciones totales'],
    ['Obligaciones Aplicables a Frikaz S.A.S.', String(indicadores.obligacionesAplicables), 'Obligaciones exigibles'],
    ['Obligaciones Cumplidas y Verificadas', String(indicadores.obligacionesCumplidasVerificadas), 'Con evidencia suficiente'],
    ['Obligaciones Parcialmente Cumplidas', String(indicadores.obligacionesParciales), 'En proceso de cierre'],
    ['Obligaciones Incumplidas (No Cumple)', String(indicadores.obligacionesIncumplidas), 'Requiere acción correctiva'],
    ['Obligaciones Pendientes de Ejecución/Verificación', String(indicadores.obligacionesPendientesEjecucion + indicadores.obligacionesPendientesVerificacion), 'Programadas'],
    ['Obligaciones No Aplica (Con Justificación)', String(indicadores.obligacionesNoAplica), 'Excluidas de cálculo'],
    ['Evidencias Faltantes o Insuficientes', String(indicadores.evidenciasFaltantes), 'Obligaciones sin soporte'],
    ['Actividades Próximas a Vencer (<= 15 días)', String(indicadores.actividadesProximasVencer), 'Alerta preventiva'],
    ['Actividades Vencidas', String(indicadores.actividadesVencidas), 'Fecha límite expirada'],
    ['Acciones Correctivas Abiertas', String(indicadores.accionesCorrectivasAbiertas), 'En ejecución o vencidas'],
    ['Porcentaje de Cumplimiento SST', `${indicadores.porcentajeCumplimientoSST}%`, 'Meta legal: >= 85%'],
    ['Porcentaje de Cumplimiento Ambiental', `${indicadores.porcentajeCumplimientoAmbiental}%`, 'Meta distrital: >= 85%'],
    ['Porcentaje General de Cumplimiento', `${indicadores.porcentajeCumplimientoGeneral}%`, 'Cumplimiento normativo consolidado'],
  ];

  downloadCsv(filename, rows);
}
