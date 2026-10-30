import ExcelJS from 'exceljs';
import {
  RiesgoGTC45Item,
  TABLA_TECNICA_NC,
} from '../types/gtc45RiskMatrix';
import { RIESGOS_GTC45_DATASET } from '../data/gtc45RiskMatrixData';

const STORAGE_KEY = 'frikaz_gtc45_matrix_v2';

/**
 * Loads risks from localStorage or falls back to the canonical GTC 45 dataset.
 * Automatically backfills cargo / cargosExpuestos if older items were stored without them.
 */
export function loadStoredRisks(): RiesgoGTC45Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const canonicalMap = new Map(RIESGOS_GTC45_DATASET.map((r) => [r.id, r]));
        const merged = parsed.map((item: RiesgoGTC45Item) => {
          const canon = canonicalMap.get(item.id);
          if (canon && (!item.cargo || !item.cargosExpuestos)) {
            return {
              ...item,
              cargo: item.cargo || canon.cargo || 'Operario',
              cargosExpuestos: item.cargosExpuestos || canon.cargosExpuestos || canon.cargo || 'Operario',
            };
          }
          return item;
        });
        return merged;
      }
    }
  } catch (err) {
    console.warn('Error reading risks from localStorage, using initial dataset:', err);
  }
  return RIESGOS_GTC45_DATASET;
}

/**
 * Persists risk matrix to localStorage.
 */
export function saveStoredRisks(risks: RiesgoGTC45Item[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(risks));
  } catch (err) {
    console.error('Error saving risks to localStorage:', err);
  }
}

/**
 * Restores original canonical dataset.
 */
export function resetToInitialRisks(): RiesgoGTC45Item[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting risks:', err);
  }
  return RIESGOS_GTC45_DATASET;
}

/**
 * Exports risk matrix to a styled .xlsx file using ExcelJS.
 */
export async function exportarMatrizGTC45AExcel(
  risks: RiesgoGTC45Item[],
  filtroTitulo: string = 'Completa'
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Frikaz S.A.S. - Sistema SG-SST GTC 45';
  workbook.lastModifiedBy = 'Frikaz S.A.S.';
  workbook.created = new Date();
  workbook.modified = new Date();

  // ==========================================
  // HOJA 1: MATRIZ DE RIESGOS GTC 45
  // ==========================================
  const ws = workbook.addWorksheet('Matriz GTC 45', {
    views: [{ showGridLines: true, state: 'frozen', ySplit: 5 }],
  });

  // Título Corporativo
  ws.mergeCells('A1:AD1');
  const cellA1 = ws.getCell('A1');
  cellA1.value = 'FRIKAZ S.A.S. - MATRIZ DE IDENTIFICACIÓN DE PELIGROS, EVALUACIÓN Y VALORACIÓN DE RIESGOS';
  cellA1.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  cellA1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  cellA1.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 28;

  // Subtítulo
  ws.mergeCells('A2:AD2');
  const cellA2 = ws.getCell('A2');
  cellA2.value = `Metodología: Guía Técnica Colombiana GTC 45 (Segunda Actualización) | Filtro: ${filtroTitulo} | Fecha: ${new Date().toLocaleDateString('es-CO')}`;
  cellA2.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FFE2E8F0' } };
  cellA2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  cellA2.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 20;

  // Fila 3: Vacía decorativa
  ws.getRow(3).height = 6;

  // Fila 4: Secciones Oficiales GTC 45 agrupadas
  // Sec 1: A4:G4 (Actividad y Cargos)
  ws.mergeCells('A4:G4');
  const sec1 = ws.getCell('A4');
  sec1.value = '1. IDENTIFICACIÓN DE LA ACTIVIDAD Y CARGOS';
  sec1.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  sec1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  sec1.alignment = { horizontal: 'center', vertical: 'middle' };

  // Sec 2: H4:J4 (Peligro)
  ws.mergeCells('H4:J4');
  const sec2 = ws.getCell('H4');
  sec2.value = '2. IDENTIFICACIÓN DEL PELIGRO';
  sec2.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  sec2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0369A1' } };
  sec2.alignment = { horizontal: 'center', vertical: 'middle' };

  // Sec 3: K4:M4 (Controles Existentes)
  ws.mergeCells('K4:M4');
  const sec3 = ws.getCell('K4');
  sec3.value = '3. CONTROLES EXISTENTES';
  sec3.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  sec3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };
  sec3.alignment = { horizontal: 'center', vertical: 'middle' };

  // Sec 4: N4:U4 (Evaluación del Riesgo)
  ws.mergeCells('N4:U4');
  const sec4 = ws.getCell('N4');
  sec4.value = '4. EVALUACIÓN Y VALORACIÓN DEL RIESGO (GTC 45)';
  sec4.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  sec4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4338CA' } };
  sec4.alignment = { horizontal: 'center', vertical: 'middle' };

  // Sec 5: V4:X4 (Criterios Controles)
  ws.mergeCells('V4:X4');
  const sec5 = ws.getCell('V4');
  sec5.value = '5. CRITERIOS PARA ESTABLECER CONTROLES';
  sec5.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  sec5.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
  sec5.alignment = { horizontal: 'center', vertical: 'middle' };

  // Sec 6: Y4:AC4 (Medidas de Intervención)
  ws.mergeCells('Y4:AC4');
  const sec6 = ws.getCell('Y4');
  sec6.value = '6. MEDIDAS DE INTERVENCIÓN (JERARQUÍA)';
  sec6.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  sec6.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  sec6.alignment = { horizontal: 'center', vertical: 'middle' };

  // Observaciones: AD4
  const sec7 = ws.getCell('AD4');
  sec7.value = 'OBSERVACIONES';
  sec7.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  sec7.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF475569' } };
  sec7.alignment = { horizontal: 'center', vertical: 'middle' };

  ws.getRow(4).height = 22;

  // Fila 5: Nombres de Columnas
  const headers = [
    'Código',
    'Proceso',
    'Zona / Lugar',
    'Actividades',
    'Tareas',
    'Cargo(s) Expuesto(s)',
    'Rutinaria',
    'Peligro Descripción',
    'Clasificación Peligro',
    'Efectos Posibles',
    'Fuente',
    'Medio',
    'Individuo',
    'ND (Deficiencia)',
    'NE (Exposición)',
    'NP (Probabilidad = ND*NE)',
    'Interpr. NP',
    'NC (Consecuencia)',
    'NR (Riesgo = NP*NC)',
    'Interpr. NR',
    'Aceptabilidad del Riesgo',
    'N° Expuestos',
    'Peor Consecuencia',
    'Requisito Legal Específico',
    'Eliminación',
    'Sustitución',
    'Controles de Ingeniería',
    'Controles Admin / Señalización',
    'Equipos y EPP',
    'Normatividad / Observaciones',
  ];

  const headerRow = ws.getRow(5);
  headers.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: 'FFFFFFFF' } },
      left: { style: 'thin', color: { argb: 'FF64748B' } },
      right: { style: 'thin', color: { argb: 'FF64748B' } },
    };
  });
  headerRow.height = 28;

  // Anchos de columna
  const colWidths = [
    12, 18, 22, 24, 24, 24, 10,
    28, 20, 26,
    22, 22, 24,
    10, 10, 12, 12, 12, 12, 10, 24,
    10, 24, 22,
    22, 22, 26, 26, 26, 24,
  ];
  colWidths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });

  // Agregar filas de datos
  risks.forEach((r, idx) => {
    const rowNum = 6 + idx;
    const row = ws.getRow(rowNum);

    const sinInfo = (v?: string | null) => (v && v.trim().length > 0 ? v : 'Sin información registrada');

    row.getCell(1).value = r.codigo || `GTC45-${idx + 1}`;
    row.getCell(2).value = r.proceso;
    row.getCell(3).value = r.zonaLugar;
    row.getCell(4).value = r.actividades;
    row.getCell(5).value = r.tareas;
    row.getCell(6).value = r.cargo || r.cargosExpuestos || 'Sin información registrada';
    row.getCell(7).value = r.rutinario;

    row.getCell(8).value = r.peligroDescripcion;
    row.getCell(9).value = r.peligroClasificacion;
    row.getCell(10).value = r.efectosPosibles;

    row.getCell(11).value = sinInfo(r.controlesFuente);
    row.getCell(12).value = sinInfo(r.controlesMedio);
    row.getCell(13).value = sinInfo(r.controlesIndividuo);

    row.getCell(14).value = r.nivelDeficiencia;
    row.getCell(15).value = r.nivelExposicion;
    row.getCell(16).value = r.nivelProbabilidad;
    row.getCell(17).value = r.interpretacionNP;
    row.getCell(18).value = r.nivelConsecuencia;
    row.getCell(19).value = r.nivelRiesgo;
    row.getCell(20).value = r.interpretacionNR;
    row.getCell(21).value = r.aceptabilidadRiesgo;

    row.getCell(22).value = r.numeroExpuestos;
    row.getCell(23).value = r.peorConsecuencia;
    row.getCell(24).value = `${r.existenciaRequisitoLegal}${r.requisitoLegalEspecifico ? `: ${r.requisitoLegalEspecifico}` : ''}`;

    row.getCell(25).value = sinInfo(r.medidaEliminacion);
    row.getCell(26).value = sinInfo(r.medidaSustitucion);
    row.getCell(27).value = sinInfo(r.medidaControlesIngenieria);
    row.getCell(28).value = sinInfo(r.medidaControlesAdministrativos);
    row.getCell(29).value = sinInfo(r.medidaEquiposEPP);
    row.getCell(30).value = r.observaciones || sinInfo(r.requisitoLegalEspecifico);

    // Formato de celdas
    for (let c = 1; c <= 30; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Calibri', size: 9 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
      cell.alignment = {
        vertical: 'top',
        wrapText: true,
        horizontal: [1, 7, 14, 15, 16, 17, 18, 19, 20, 22].includes(c) ? 'center' : 'left',
      };
    }

    // Color condicional para Nivel de Riesgo (NR)
    const nrCell = row.getCell(20);
    const aceptCell = row.getCell(21);
    if (r.interpretacionNR === 'I') {
      nrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE11D48' } };
      nrCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      aceptCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E6' } };
      aceptCell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF9F1239' } };
    } else if (r.interpretacionNR === 'II') {
      nrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
      nrCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
      aceptCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
      aceptCell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF92400E' } };
    } else if (r.interpretacionNR === 'III') {
      nrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAB308' } };
      nrCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
      aceptCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF9C3' } };
      aceptCell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF854D0E' } };
    } else {
      nrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
      nrCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      aceptCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
      aceptCell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF065F46' } };
    }

    row.height = 36;
  });

  // ==========================================
  // HOJA 2: CRITERIOS TÉCNICOS NC GTC 45
  // ==========================================
  const wsNc = workbook.addWorksheet('Criterios NC GTC 45', {
    views: [{ showGridLines: true }],
  });

  wsNc.mergeCells('A1:E1');
  const cellNcTitle = wsNc.getCell('A1');
  cellNcTitle.value = 'TABLA TÉCNICA OFICIAL: DETERMINACIÓN DEL NIVEL DE CONSECUENCIA (NC) - GTC 45';
  cellNcTitle.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  cellNcTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  cellNcTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsNc.getRow(1).height = 26;

  const ncHeaders = ['Valor NC', 'Clasificación', 'Definición Técnica Oficial', 'Criterio de Incapacidad', 'Ejemplos Operativos'];
  const ncHeaderRow = wsNc.getRow(3);
  ncHeaders.forEach((h, i) => {
    const c = ncHeaderRow.getCell(i + 1);
    c.value = h;
    c.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  ncHeaderRow.height = 22;

  wsNc.getColumn(1).width = 12;
  wsNc.getColumn(2).width = 22;
  wsNc.getColumn(3).width = 45;
  wsNc.getColumn(4).width = 35;
  wsNc.getColumn(5).width = 45;

  const ncItems: (10 | 25 | 60 | 100)[] = [10, 25, 60, 100];
  ncItems.forEach((val, idx) => {
    const item = TABLA_TECNICA_NC[val];
    const r = wsNc.getRow(4 + idx);
    r.getCell(1).value = item.nc;
    r.getCell(2).value = item.clasificacion;
    r.getCell(3).value = item.definicionTecnica;
    r.getCell(4).value = item.criterioIncapacidad;
    r.getCell(5).value = item.ejemplosOperativos;

    for (let c = 1; c <= 5; c++) {
      const cell = r.getCell(c);
      cell.font = { name: 'Calibri', size: 9 };
      cell.alignment = { vertical: 'top', wrapText: true, horizontal: c === 1 ? 'center' : 'left' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    }
    r.height = 42;
  });

  // Generar y descargar archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Matriz_Riesgos_GTC45_Frikaz_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
