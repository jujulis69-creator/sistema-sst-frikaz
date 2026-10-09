import {
  NormaPhvaItem,
  IndicadoresAutomaticos,
  FasePhva,
  ResumenFaseCalculado,
  EstadoCumplimiento,
} from '../types/phvaEvidence';
import { INITIAL_PHVA_NORMS } from '../data/phvaNormsData';

const STORAGE_KEY = 'frikaz_phva_evidence_items_v2';

export function getPhvaNorms(): NormaPhvaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PHVA_NORMS));
      return INITIAL_PHVA_NORMS;
    }
    return JSON.parse(raw) as NormaPhvaItem[];
  } catch (err) {
    console.error('Error reading phva norms from localStorage', err);
    return INITIAL_PHVA_NORMS;
  }
}

export function savePhvaNorms(items: NormaPhvaItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving phva norms to localStorage', err);
  }
}

export function updatePhvaNormStatus(
  id: string,
  nuevoEstado: EstadoCumplimiento
): NormaPhvaItem[] {
  const current = getPhvaNorms();
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          estado: nuevoEstado,
          fechaVerificacion: new Date().toISOString().split('T')[0],
        }
      : item
  );
  savePhvaNorms(updated);
  return updated;
}

export function updatePhvaNormFull(updatedItem: NormaPhvaItem): NormaPhvaItem[] {
  const current = getPhvaNorms();
  const exists = current.some((it) => it.id === updatedItem.id);
  const updated = exists
    ? current.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    : [...current, updatedItem];
  savePhvaNorms(updated);
  return updated;
}

export function createPhvaNorm(newItem: Omit<NormaPhvaItem, 'id'>): NormaPhvaItem[] {
  const current = getPhvaNorms();
  const id = `custom-${Date.now()}`;
  const fullItem: NormaPhvaItem = {
    ...newItem,
    id,
  };
  const updated = [...current, fullItem];
  savePhvaNorms(updated);
  return updated;
}

export function deletePhvaNorm(id: string): NormaPhvaItem[] {
  const current = getPhvaNorms();
  const updated = current.filter((item) => item.id !== id);
  savePhvaNorms(updated);
  return updated;
}

export function resetPhvaNormsToDefault(): NormaPhvaItem[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PHVA_NORMS));
  return INITIAL_PHVA_NORMS;
}

export function calcularIndicadoresPhva(items: NormaPhvaItem[]): IndicadoresAutomaticos {
  const fases: FasePhva[] = ['PLANEAR', 'HACER', 'VERIFICAR', 'ACTUAR'];
  const porFase: Record<FasePhva, ResumenFaseCalculado> = {} as any;

  let totalCumplidas = 0;
  let totalParciales = 0;
  let totalNoCumplidas = 0;
  let sstPuntos = 0;
  let sstTotal = 0;
  let ambPuntos = 0;
  let ambTotal = 0;

  fases.forEach((fase) => {
    const faseItems = items.filter((i) => i.fase === fase);
    const cumplidas = faseItems.filter((i) => i.estado === 'CUMPLE').length;
    const parciales = faseItems.filter((i) => i.estado === 'PARCIAL').length;
    const noCumplidas = faseItems.filter((i) => i.estado === 'NO_CUMPLE').length;
    const total = faseItems.length;

    const porcentaje =
      total > 0 ? Math.round(((cumplidas + parciales * 0.5) / total) * 1000) / 10 : 0;

    porFase[fase] = {
      total,
      cumplidas,
      parciales,
      noCumplidas,
      porcentaje,
    };

    totalCumplidas += cumplidas;
    totalParciales += parciales;
    totalNoCumplidas += noCumplidas;
  });

  items.forEach((item) => {
    const pts = item.estado === 'CUMPLE' ? 1.0 : item.estado === 'PARCIAL' ? 0.5 : 0;
    if (item.area === 'SST' || item.area === 'INTEGRAL') {
      sstPuntos += pts;
      sstTotal += 1;
    }
    if (item.area === 'AMBIENTAL' || item.area === 'INTEGRAL') {
      ambPuntos += pts;
      ambTotal += 1;
    }
  });

  const generalPorcentaje =
    items.length > 0
      ? Math.round(((totalCumplidas + totalParciales * 0.5) / items.length) * 1000) / 10
      : 0;

  const sstPorcentaje =
    sstTotal > 0 ? Math.round((sstPuntos / sstTotal) * 1000) / 10 : 0;

  const ambientalPorcentaje =
    ambTotal > 0 ? Math.round((ambPuntos / ambTotal) * 1000) / 10 : 0;

  const totalVigentes = items.filter((i) => i.vigente).length;

  return {
    generalPorcentaje,
    sstPorcentaje,
    ambientalPorcentaje,
    porFase,
    totalNormas: items.length,
    totalVigentes,
    alertasPendientes: totalNoCumplidas + totalParciales,
  };
}

export function exportarMatrizPhvaCsv(items: NormaPhvaItem[]): void {
  const fecha = new Date().toLocaleString('es-CO');
  const rows: string[][] = [
    ['FRIKAZ S.A.S. - MATRIZ AUTOMATIZADA DE REQUISITOS LEGALES SST Y AMBIENTAL'],
    ['EVIDENCIA 1 - HERRAMIENTA POTENCIADA POR IA'],
    [`Fecha de Generación: ${fecha}`],
    ['Ubicación: Bosa, Piamonte, Bogotá D.C. | 10 Trabajadores'],
    [],
    [
      'FASE PHVA',
      'SUBTEMA / COMPONENTE',
      'SITUACIÓN QUE REGULA LA PYME',
      'DISPOSICIÓN LEGAL OFICIAL',
      'ENTIDAD EMISORA',
      'ARTÍCULOS APLICABLES',
      'ÁREA',
      '1. DESCRIPCIÓN (QUÉ REGULA)',
      '2. IMPORTANCIA PARA FRIKAZ S.A.S.',
      '3. APLICABILIDAD CONCRETA',
      '4. ESTADO VIGENCIA',
      '5. JURISDICCIÓN Y ALCANCE',
      '6. EVIDENCIA DE CUMPLIMIENTO',
      'ESTADO DE CUMPLIMIENTO',
      'RESPONSABLE',
      'FECHA VERIFICACIÓN',
      'OBSERVACIONES',
    ],
  ];

  items.forEach((item) => {
    rows.push([
      item.fase,
      item.subtema,
      item.tituloSituacion,
      item.normaOficial,
      item.entidadEmisora,
      item.articulos,
      item.area,
      item.descripcion,
      item.importancia,
      item.aplicabilidad,
      item.vigente ? 'Vigente confirmada' : 'Pendiente validación',
      item.jurisdiccionAlcance,
      item.evidenciaCumplimiento,
      item.estado === 'CUMPLE' ? 'Cumple (100%)' : item.estado === 'PARCIAL' ? 'Cumple parcialmente (50%)' : 'No cumple (0%)',
      item.responsable,
      item.fechaVerificacion,
      item.observaciones,
    ]);
  });

  const escapeCell = (c: any) => `"${String(c || '').replace(/"/g, '""')}"`;
  const csvContent = '\uFEFF' + rows.map((r) => r.map(escapeCell).join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Frikaz_Evidencia1_PHVA_Normativo_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
