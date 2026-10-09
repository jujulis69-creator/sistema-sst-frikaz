import {
  Norm,
  Obligacion,
  PhvaRegistro,
  Evidencia,
  AccionCorrectiva,
  IndicadoresCumplimiento,
  AlertaItem,
  AreaNormativa,
} from '../types';

/**
 * Helper to parse YYYY-MM-DD string into Date object at midnight UTC
 */
export function parseDate(dateStr?: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(year, month, day);
}

/**
 * Calculate difference in days between target date and current local date.
 * Returns negative if target date is in the past.
 */
export function getDaysDifference(targetDateStr?: string, referenceDate: Date = new Date()): number | null {
  const target = parseDate(targetDateStr);
  if (!target) return null;
  
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine dynamic activity deadline state
 */
export function getActivityStatus(fechaLimite?: string, completada: boolean = false): {
  estado: 'Cumplida' | 'Vencida' | 'Proxima' | 'En tiempo' | 'Sin fecha';
  diasRestantes: number | null;
  etiqueta: string;
} {
  if (completada) {
    return { estado: 'Cumplida', diasRestantes: null, etiqueta: 'Cumplida y verificada' };
  }
  if (!fechaLimite || fechaLimite.trim() === '') {
    return { estado: 'Sin fecha', diasRestantes: null, etiqueta: 'Sin fecha asignada' };
  }
  const diff = getDaysDifference(fechaLimite);
  if (diff === null) {
    return { estado: 'Sin fecha', diasRestantes: null, etiqueta: 'Fecha inválida' };
  }
  if (diff < 0) {
    return { estado: 'Vencida', diasRestantes: diff, etiqueta: `Vencida hace ${Math.abs(diff)} día(s)` };
  }
  if (diff <= 15) {
    return { estado: 'Proxima', diasRestantes: diff, etiqueta: `Vence en ${diff} día(s)` };
  }
  return { estado: 'En tiempo', diasRestantes: diff, etiqueta: `Vence en ${diff} día(s)` };
}

/**
 * Compute all 15 automated compliance KPIs for Frikaz S.A.S.
 */
export function computeIndicadores(
  norms: Norm[],
  obligaciones: Obligacion[],
  phvaList: PhvaRegistro[],
  evidencias: Evidencia[],
  acciones: AccionCorrectiva[]
): IndicadoresCumplimiento {
  const totalNormas = norms.length;
  const normasVigentesVerificadas = norms.filter((n) => n.estadoVigencia === 'Vigente verificada').length;
  const normasPendientesValidacion = norms.filter((n) => n.estadoVigencia === 'Pendiente de validación normativa').length;
  const normasModificadas = norms.filter((n) => n.estadoVigencia === 'Modificada').length;
  const normasDerogadas = norms.filter((n) => n.estadoVigencia === 'Derogada').length;

  const totalObligaciones = obligaciones.length;
  
  // Applicable obligations exclude 'No aplica con justificación' and 'Pendiente de evaluación' from compliance denominator
  const aplicables = obligaciones.filter((o) => o.estadoAplicabilidad === 'Aplicable');
  const obligacionesAplicables = aplicables.length;

  const obligacionesCumplidasVerificadas = aplicables.filter(
    (o) => o.estadoCumplimiento === 'Cumple y tiene evidencia verificada'
  ).length;

  const obligacionesParciales = aplicables.filter(
    (o) => o.estadoCumplimiento === 'Cumple parcialmente'
  ).length;

  const obligacionesIncumplidas = aplicables.filter(
    (o) => o.estadoCumplimiento === 'No cumple'
  ).length;

  const obligacionesPendientesEjecucion = aplicables.filter(
    (o) => o.estadoCumplimiento === 'Pendiente de ejecución'
  ).length;

  const obligacionesPendientesVerificacion = aplicables.filter(
    (o) => o.estadoCumplimiento === 'Pendiente de verificación'
  ).length;

  const obligacionesNoAplica = obligaciones.filter(
    (o) => o.estadoAplicabilidad === 'No aplica con justificación'
  ).length;

  // Evidencias faltantes: obligaciones aplicables sin evidencias verificadas
  const obligationsWithVerifiedEvidence = new Set(
    evidencias
      .filter((e) => e.estadoRevision === 'Verificada y suficiente')
      .map((e) => e.obligacionId)
  );

  const evidenciasFaltantes = aplicables.filter(
    (o) => !obligationsWithVerifiedEvidence.has(o.id)
  ).length;

  // Overdue and upcoming activities
  let actividadesProximasVencer = 0;
  let actividadesVencidas = 0;

  obligaciones.forEach((o) => {
    const isCompleted = o.estadoCumplimiento === 'Cumple y tiene evidencia verificada';
    if (!isCompleted && o.fechaLimite) {
      const diff = getDaysDifference(o.fechaLimite);
      if (diff !== null) {
        if (diff < 0) {
          actividadesVencidas++;
        } else if (diff <= 15) {
          actividadesProximasVencer++;
        }
      }
    }
  });

  // Acciones correctivas abiertas ('Abierta' o 'En ejecución' o 'Vencida')
  const accionesCorrectivasAbiertas = acciones.filter(
    (a) => a.estado === 'Abierta' || a.estado === 'En ejecución' || a.estado === 'Vencida'
  ).length;

  // Cumulative Area Compliance Calculations
  // Norm area map
  const normAreaMap = new Map<string, AreaNormativa>();
  norms.forEach((n) => normAreaMap.set(n.id, n.area));

  const sstAplicables = aplicables.filter((o) => normAreaMap.get(o.normaId) === 'SST');
  const ambAplicables = aplicables.filter((o) => normAreaMap.get(o.normaId) === 'Ambiental');

  const sstCumplidas = sstAplicables.filter((o) => o.estadoCumplimiento === 'Cumple y tiene evidencia verificada').length;
  const sstParciales = sstAplicables.filter((o) => o.estadoCumplimiento === 'Cumple parcialmente').length;

  const ambCumplidas = ambAplicables.filter((o) => o.estadoCumplimiento === 'Cumple y tiene evidencia verificada').length;
  const ambParciales = ambAplicables.filter((o) => o.estadoCumplimiento === 'Cumple parcialmente').length;

  // Strict percentage calculation: (cumplidas * 1.0 + parciales * 0.5) / aplicables * 100
  const porcentajeCumplimientoSST = sstAplicables.length > 0
    ? Math.round(((sstCumplidas + sstParciales * 0.5) / sstAplicables.length) * 1000) / 10
    : 0;

  const porcentajeCumplimientoAmbiental = ambAplicables.length > 0
    ? Math.round(((ambCumplidas + ambParciales * 0.5) / ambAplicables.length) * 1000) / 10
    : 0;

  const porcentajeCumplimientoGeneral = obligacionesAplicables > 0
    ? Math.round(((obligacionesCumplidasVerificadas + obligacionesParciales * 0.5) / obligacionesAplicables) * 1000) / 10
    : 0;

  // PHVA completion counters
  let planearCompletado = 0;
  let hacerCompletado = 0;
  let verificarCompletado = 0;
  let actuarCompletado = 0;

  phvaList.forEach((p) => {
    if (p.planear.completado) planearCompletado++;
    if (p.hacer.completado) hacerCompletado++;
    if (p.verificar.completado) verificarCompletado++;
    if (p.actuar.completado) actuarCompletado++;
  });

  return {
    totalNormas,
    normasVigentesVerificadas,
    normasPendientesValidacion,
    normasModificadas,
    normasDerogadas,
    totalObligaciones,
    obligacionesAplicables,
    obligacionesCumplidasVerificadas,
    obligacionesParciales,
    obligacionesIncumplidas,
    obligacionesPendientesEjecucion,
    obligacionesPendientesVerificacion,
    obligacionesNoAplica,
    evidenciasFaltantes,
    actividadesProximasVencer,
    actividadesVencidas,
    accionesCorrectivasAbiertas,
    porcentajeCumplimientoSST,
    porcentajeCumplimientoAmbiental,
    porcentajeCumplimientoGeneral,
    fasesPhvaCompletadas: {
      planear: planearCompletado,
      hacer: hacerCompletado,
      verificar: verificarCompletado,
      actuar: actuarCompletado,
      total: phvaList.length * 4,
    },
  };
}

/**
 * Generate real-time actionable alerts for the alerts center
 */
export function generateAlertas(
  norms: Norm[],
  obligaciones: Obligacion[],
  evidencias: Evidencia[],
  acciones: AccionCorrectiva[]
): AlertaItem[] {
  const alertas: AlertaItem[] = [];
  const normMap = new Map<string, Norm>();
  norms.forEach((n) => normMap.set(n.id, n));

  // 1. Actividades vencidas
  obligaciones.forEach((o) => {
    const isCompleted = o.estadoCumplimiento === 'Cumple y tiene evidencia verificada';
    if (!isCompleted && o.fechaLimite) {
      const diff = getDaysDifference(o.fechaLimite);
      const norm = normMap.get(o.normaId);
      const area = norm?.area || 'SST';

      if (diff !== null && diff < 0) {
        alertas.push({
          id: `alert-vencida-${o.id}`,
          tipo: 'ACTIVIDAD_VENCIDA',
          severidad: 'urgente',
          titulo: `Obligación Vencida: ${o.codigo}`,
          descripcion: `La actividad "${o.actividadNecesaria}" superó la fecha límite programada (${o.fechaLimite}). Vencida hace ${Math.abs(diff)} día(s).`,
          referencia: `${norm?.tipoDisposicion || 'Norma'} ${norm?.numero || ''} - ${o.articuloNumeral}`,
          fechaRelevante: o.fechaLimite,
          area,
        });
      } else if (diff !== null && diff <= 15 && diff >= 0) {
        alertas.push({
          id: `alert-proxima-${o.id}`,
          tipo: 'ACTIVIDAD_POR_VENCER',
          severidad: 'advertencia',
          titulo: `Obligación Próxima a Vencer: ${o.codigo}`,
          descripcion: `La actividad "${o.actividadNecesaria}" vence en ${diff} día(s) (Límite: ${o.fechaLimite}). Requiere ejecución inmediata.`,
          referencia: `${norm?.tipoDisposicion || 'Norma'} ${norm?.numero || ''} - ${o.articuloNumeral}`,
          fechaRelevante: o.fechaLimite,
          area,
        });
      }
    }
  });

  // 2. Obligaciones incumplidas
  obligaciones
    .filter((o) => o.estadoCumplimiento === 'No cumple' && o.estadoAplicabilidad === 'Aplicable')
    .forEach((o) => {
      const norm = normMap.get(o.normaId);
      const area = norm?.area || 'SST';
      alertas.push({
        id: `alert-incumplida-${o.id}`,
        tipo: 'OBLIGACION_INCUMPLIDA',
        severidad: 'urgente',
        titulo: `Incumplimiento Normativo Detectado: ${o.codigo}`,
        descripcion: `La obligación "${o.descripcionObligacion}" se encuentra en estado "No cumple". Requiere apertura de acción correctiva y asignación de recursos.`,
        referencia: `${norm?.tipoDisposicion || 'Norma'} ${norm?.numero || ''} - ${o.articuloNumeral}`,
        fechaRelevante: o.fechaLimite,
        area,
      });
    });

  // 3. Acciones correctivas atrasadas o abiertas
  acciones.forEach((a) => {
    const diff = getDaysDifference(a.fechaLimite);
    const norm = normMap.get(a.normaId);
    const area = norm?.area || 'SST';

    if (a.estado !== 'Verificada y cerrada') {
      if (diff !== null && diff < 0) {
        alertas.push({
          id: `alert-ac-vencida-${a.id}`,
          tipo: 'ACCION_CORRECTIVA_ATRASADA',
          severidad: 'urgente',
          titulo: `Acción Correctiva Vencida: ${a.codigo}`,
          descripcion: `La acción correctiva para el hallazgo "${a.hallazgo}" superó su fecha límite (${a.fechaLimite}) sin cierre verificado.`,
          referencia: `Acción ${a.codigo}`,
          fechaRelevante: a.fechaLimite,
          area,
        });
      } else if (diff !== null && diff <= 10) {
        alertas.push({
          id: `alert-ac-abierta-${a.id}`,
          tipo: 'ACCION_CORRECTIVA_ATRASADA',
          severidad: 'advertencia',
          titulo: `Acción Correctiva por Vencer: ${a.codigo}`,
          descripcion: `Plazo de ejecución finaliza en ${diff} día(s). Responsable: ${a.responsable}.`,
          referencia: `Acción ${a.codigo}`,
          fechaRelevante: a.fechaLimite,
          area,
        });
      }
    }
  });

  // 4. Evidencias vencidas
  evidencias.forEach((e) => {
    if (e.fechaVencimiento) {
      const diff = getDaysDifference(e.fechaVencimiento);
      const norm = normMap.get(e.normaId);
      const area = norm?.area || 'SST';

      if (diff !== null && diff < 0) {
        alertas.push({
          id: `alert-evi-vencida-${e.id}`,
          tipo: 'EVIDENCIA_VENCIDA',
          severidad: 'urgente',
          titulo: `Evidencia Documental Vencida: ${e.codigo}`,
          descripcion: `El documento "${e.nombre}" expiró el ${e.fechaVencimiento}. Requiere actualización o renovación inmediata.`,
          referencia: e.ubicacionOEnlace,
          fechaRelevante: e.fechaVencimiento,
          area,
        });
      }
    }
  });

  // 5. Normas pendientes de validación
  norms
    .filter((n) => n.estadoVigencia === 'Pendiente de validación normativa')
    .forEach((n) => {
      alertas.push({
        id: `alert-norma-val-${n.id}`,
        tipo: 'NORMA_PENDIENTE_VALIDACION',
        severidad: 'informativa',
        titulo: `Disposición Pendiente de Validación: ${n.codigoIdentificador}`,
        descripcion: `La norma "${n.nombreOficial}" requiere consulta en SUIN-Juriscol / entidad emisora para certificar vigencia oficial.`,
        referencia: `${n.tipoDisposicion} ${n.numero} de ${n.anio}`,
        fechaRelevante: n.fechaUltimaConsulta,
        area: n.area,
      });
    });

  return alertas;
}
