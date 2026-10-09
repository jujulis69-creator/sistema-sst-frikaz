import {
  ConfiguracionPresentacion,
  CONFIG_PRESENTACION_DEFAULT,
} from '../types/presentationConfig';

const STORAGE_KEY = 'frikaz_presentacion_config_v1';

export function getPresentationConfig(): ConfiguracionPresentacion {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure merged with default in case of missing keys
      return {
        banner: { ...CONFIG_PRESENTACION_DEFAULT.banner, ...(parsed.banner || {}) },
        fases: {
          PLANEAR: {
            ...CONFIG_PRESENTACION_DEFAULT.fases.PLANEAR,
            ...(parsed.fases?.PLANEAR || {}),
          },
          HACER: {
            ...CONFIG_PRESENTACION_DEFAULT.fases.HACER,
            ...(parsed.fases?.HACER || {}),
          },
          VERIFICAR: {
            ...CONFIG_PRESENTACION_DEFAULT.fases.VERIFICAR,
            ...(parsed.fases?.VERIFICAR || {}),
          },
          ACTUAR: {
            ...CONFIG_PRESENTACION_DEFAULT.fases.ACTUAR,
            ...(parsed.fases?.ACTUAR || {}),
          },
        },
        guiaDocente: {
          ...CONFIG_PRESENTACION_DEFAULT.guiaDocente,
          ...(parsed.guiaDocente || {}),
        },
      };
    }
  } catch (err) {
    console.error('Error loading presentation config:', err);
  }
  return JSON.parse(JSON.stringify(CONFIG_PRESENTACION_DEFAULT));
}

export function savePresentationConfig(
  config: ConfiguracionPresentacion
): ConfiguracionPresentacion {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving presentation config:', err);
  }
  return config;
}

export function resetPresentationConfig(): ConfiguracionPresentacion {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting presentation config:', err);
  }
  return JSON.parse(JSON.stringify(CONFIG_PRESENTACION_DEFAULT));
}
