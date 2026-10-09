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
import {
  INITIAL_EMPRESA_CONFIG,
  INITIAL_NORMS,
  INITIAL_OBLIGACIONES,
  INITIAL_PHVA_REGISTROS,
  INITIAL_EVIDENCIAS,
  INITIAL_ACCIONES_CORRECTIVAS,
  INITIAL_ASPECTOS_AMBIENTALES,
  INITIAL_PELIGROS_SST,
} from '../data/seedData';

const STORAGE_KEYS = {
  EMPRESA: 'frikaz_normativa_empresa_v1',
  NORMS: 'frikaz_normativa_normas_v1',
  OBLIGACIONES: 'frikaz_normativa_obligaciones_v1',
  PHVA: 'frikaz_normativa_phva_v1',
  EVIDENCIAS: 'frikaz_normativa_evidencias_v1',
  ACCIONES: 'frikaz_normativa_acciones_v1',
  ASPECTOS: 'frikaz_normativa_aspectos_v1',
  PELIGROS: 'frikaz_normativa_peligros_v1',
};

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

export function subscribeToDataChanges(callback: ChangeListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyChanges(): void {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('Error in storage change listener:', err);
    }
  });
}

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyChanges();
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// ------------------- INITIALIZATION -------------------
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.NORMS)) {
    localStorage.setItem(STORAGE_KEYS.NORMS, JSON.stringify(INITIAL_NORMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OBLIGACIONES)) {
    localStorage.setItem(STORAGE_KEYS.OBLIGACIONES, JSON.stringify(INITIAL_OBLIGACIONES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PHVA)) {
    localStorage.setItem(STORAGE_KEYS.PHVA, JSON.stringify(INITIAL_PHVA_REGISTROS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVIDENCIAS)) {
    localStorage.setItem(STORAGE_KEYS.EVIDENCIAS, JSON.stringify(INITIAL_EVIDENCIAS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACCIONES)) {
    localStorage.setItem(STORAGE_KEYS.ACCIONES, JSON.stringify(INITIAL_ACCIONES_CORRECTIVAS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPRESA)) {
    localStorage.setItem(STORAGE_KEYS.EMPRESA, JSON.stringify(INITIAL_EMPRESA_CONFIG));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASPECTOS)) {
    localStorage.setItem(STORAGE_KEYS.ASPECTOS, JSON.stringify(INITIAL_ASPECTOS_AMBIENTALES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PELIGROS)) {
    localStorage.setItem(STORAGE_KEYS.PELIGROS, JSON.stringify(INITIAL_PELIGROS_SST));
  }
}

// ------------------- COMPANY PROFILE -------------------
export function getEmpresaConfig(): EmpresaFrikazConfig {
  return getStoredItem<EmpresaFrikazConfig>(STORAGE_KEYS.EMPRESA, INITIAL_EMPRESA_CONFIG);
}

export function saveEmpresaConfig(config: EmpresaFrikazConfig): void {
  setStoredItem(STORAGE_KEYS.EMPRESA, config);
}

// ------------------- NORMS -------------------
export function getNorms(): Norm[] {
  return getStoredItem<Norm[]>(STORAGE_KEYS.NORMS, INITIAL_NORMS);
}

export function saveNorm(norm: Norm): void {
  const norms = getNorms();
  const existingIdx = norms.findIndex((n) => n.id === norm.id);
  if (existingIdx >= 0) {
    norms[existingIdx] = norm;
  } else {
    norms.unshift(norm);
  }
  setStoredItem(STORAGE_KEYS.NORMS, norms);
}

export function deleteNorm(normId: string): void {
  const norms = getNorms().filter((n) => n.id !== normId);
  setStoredItem(STORAGE_KEYS.NORMS, norms);

  // Also remove cascaded obligations, phva, evidencias, acciones
  const obligs = getObligaciones();
  const deletedObligIds = new Set(obligs.filter((o) => o.normaId === normId).map((o) => o.id));
  
  const remainingObligs = obligs.filter((o) => o.normaId !== normId);
  setStoredItem(STORAGE_KEYS.OBLIGACIONES, remainingObligs);

  const phva = getPhvaList().filter((p) => !deletedObligIds.has(p.obligacionId) && p.normaId !== normId);
  setStoredItem(STORAGE_KEYS.PHVA, phva);

  const evidencias = getEvidencias().filter((e) => e.normaId !== normId && !deletedObligIds.has(e.obligacionId));
  setStoredItem(STORAGE_KEYS.EVIDENCIAS, evidencias);

  const acciones = getAccionesCorrectivas().filter((a) => a.normaId !== normId && !deletedObligIds.has(a.obligacionId));
  setStoredItem(STORAGE_KEYS.ACCIONES, acciones);
}

// ------------------- OBLIGACIONES -------------------
export function getObligaciones(): Obligacion[] {
  return getStoredItem<Obligacion[]>(STORAGE_KEYS.OBLIGACIONES, INITIAL_OBLIGACIONES);
}

export function saveObligacion(oblig: Obligacion): void {
  const items = getObligaciones();
  const idx = items.findIndex((o) => o.id === oblig.id);
  if (idx >= 0) {
    items[idx] = oblig;
  } else {
    items.unshift(oblig);
  }
  setStoredItem(STORAGE_KEYS.OBLIGACIONES, items);
}

export function deleteObligacion(obligId: string): void {
  const items = getObligaciones().filter((o) => o.id !== obligId);
  setStoredItem(STORAGE_KEYS.OBLIGACIONES, items);

  const phva = getPhvaList().filter((p) => p.obligacionId !== obligId);
  setStoredItem(STORAGE_KEYS.PHVA, phva);

  const evidencias = getEvidencias().filter((e) => e.obligacionId !== obligId);
  setStoredItem(STORAGE_KEYS.EVIDENCIAS, evidencias);

  const acciones = getAccionesCorrectivas().filter((a) => a.obligacionId !== obligId);
  setStoredItem(STORAGE_KEYS.ACCIONES, acciones);
}

// ------------------- PHVA -------------------
export function getPhvaList(): PhvaRegistro[] {
  return getStoredItem<PhvaRegistro[]>(STORAGE_KEYS.PHVA, INITIAL_PHVA_REGISTROS);
}

export function savePhvaRegistro(registro: PhvaRegistro): void {
  const items = getPhvaList();
  const idx = items.findIndex((p) => p.id === registro.id);
  if (idx >= 0) {
    items[idx] = registro;
  } else {
    items.unshift(registro);
  }
  setStoredItem(STORAGE_KEYS.PHVA, items);
}

// ------------------- EVIDENCIAS -------------------
export function getEvidencias(): Evidencia[] {
  return getStoredItem<Evidencia[]>(STORAGE_KEYS.EVIDENCIAS, INITIAL_EVIDENCIAS);
}

export function saveEvidencia(evidencia: Evidencia): void {
  const items = getEvidencias();
  const idx = items.findIndex((e) => e.id === evidencia.id);
  if (idx >= 0) {
    items[idx] = evidencia;
  } else {
    items.unshift(evidencia);
  }
  setStoredItem(STORAGE_KEYS.EVIDENCIAS, items);
}

export function deleteEvidencia(evidenciaId: string): void {
  const items = getEvidencias().filter((e) => e.id !== evidenciaId);
  setStoredItem(STORAGE_KEYS.EVIDENCIAS, items);
}

// ------------------- ACCIONES CORRECTIVAS -------------------
export function getAccionesCorrectivas(): AccionCorrectiva[] {
  return getStoredItem<AccionCorrectiva[]>(STORAGE_KEYS.ACCIONES, INITIAL_ACCIONES_CORRECTIVAS);
}

export function saveAccionCorrectiva(accion: AccionCorrectiva): void {
  const items = getAccionesCorrectivas();
  const idx = items.findIndex((a) => a.id === accion.id);
  if (idx >= 0) {
    items[idx] = accion;
  } else {
    items.unshift(accion);
  }
  setStoredItem(STORAGE_KEYS.ACCIONES, items);
}

export function deleteAccionCorrectiva(accionId: string): void {
  const items = getAccionesCorrectivas().filter((a) => a.id !== accionId);
  setStoredItem(STORAGE_KEYS.ACCIONES, items);
}

// ------------------- ASPECTOS AMBIENTALES -------------------
export function getAspectosAmbientales(): AspectoAmbiental[] {
  return getStoredItem<AspectoAmbiental[]>(STORAGE_KEYS.ASPECTOS, INITIAL_ASPECTOS_AMBIENTALES);
}

export function saveAspectoAmbiental(aspecto: AspectoAmbiental): void {
  const items = getAspectosAmbientales();
  const idx = items.findIndex((a) => a.id === aspecto.id);
  if (idx >= 0) {
    items[idx] = aspecto;
  } else {
    items.unshift(aspecto);
  }
  setStoredItem(STORAGE_KEYS.ASPECTOS, items);
}

// ------------------- PELIGROS SST -------------------
export function getPeligrosSST(): PeligroSST[] {
  return getStoredItem<PeligroSST[]>(STORAGE_KEYS.PELIGROS, INITIAL_PELIGROS_SST);
}

export function savePeligroSST(peligro: PeligroSST): void {
  const items = getPeligrosSST();
  const idx = items.findIndex((p) => p.id === peligro.id);
  if (idx >= 0) {
    items[idx] = peligro;
  } else {
    items.unshift(peligro);
  }
  setStoredItem(STORAGE_KEYS.PELIGROS, items);
}

// ------------------- BACKUP & RESTORE -------------------
export interface FullDatabaseBackup {
  version: string;
  timestamp: string;
  empresa: EmpresaFrikazConfig;
  normas: Norm[];
  obligaciones: Obligacion[];
  phva: PhvaRegistro[];
  evidencias: Evidencia[];
  acciones: AccionCorrectiva[];
  aspectos: AspectoAmbiental[];
  peligros: PeligroSST[];
}

export function exportFullDatabase(): string {
  const backup: FullDatabaseBackup = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    empresa: getEmpresaConfig(),
    normas: getNorms(),
    obligaciones: getObligaciones(),
    phva: getPhvaList(),
    evidencias: getEvidencias(),
    acciones: getAccionesCorrectivas(),
    aspectos: getAspectosAmbientales(),
    peligros: getPeligrosSST(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importFullDatabase(jsonContent: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonContent) as FullDatabaseBackup;
    if (!data.normas || !data.obligaciones) {
      return { success: false, message: 'El archivo JSON no contiene una estructura de base de datos válida.' };
    }
    if (data.empresa) setStoredItem(STORAGE_KEYS.EMPRESA, data.empresa);
    if (data.normas) setStoredItem(STORAGE_KEYS.NORMS, data.normas);
    if (data.obligaciones) setStoredItem(STORAGE_KEYS.OBLIGACIONES, data.obligaciones);
    if (data.phva) setStoredItem(STORAGE_KEYS.PHVA, data.phva);
    if (data.evidencias) setStoredItem(STORAGE_KEYS.EVIDENCIAS, data.evidencias);
    if (data.acciones) setStoredItem(STORAGE_KEYS.ACCIONES, data.acciones);
    if (data.aspectos) setStoredItem(STORAGE_KEYS.ASPECTOS, data.aspectos);
    if (data.peligros) setStoredItem(STORAGE_KEYS.PELIGROS, data.peligros);
    return { success: true, message: 'Base de datos restaurada exitosamente.' };
  } catch (err: any) {
    return { success: false, message: `Error al procesar el archivo: ${err?.message || 'Formato inválido'}` };
  }
}

export function resetDatabaseToOfficialSeed(): void {
  setStoredItem(STORAGE_KEYS.EMPRESA, INITIAL_EMPRESA_CONFIG);
  setStoredItem(STORAGE_KEYS.NORMS, INITIAL_NORMS);
  setStoredItem(STORAGE_KEYS.OBLIGACIONES, INITIAL_OBLIGACIONES);
  setStoredItem(STORAGE_KEYS.PHVA, INITIAL_PHVA_REGISTROS);
  setStoredItem(STORAGE_KEYS.EVIDENCIAS, INITIAL_EVIDENCIAS);
  setStoredItem(STORAGE_KEYS.ACCIONES, INITIAL_ACCIONES_CORRECTIVAS);
  setStoredItem(STORAGE_KEYS.ASPECTOS, INITIAL_ASPECTOS_AMBIENTALES);
  setStoredItem(STORAGE_KEYS.PELIGROS, INITIAL_PELIGROS_SST);
}
