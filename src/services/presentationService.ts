import {
  ConfiguracionPresentacion,
  CONFIG_PRESENTACION_DEFAULT,
} from '../types/presentationConfig';

const STORAGE_KEY = 'frikaz_presentacion_config_v1';

function cleanEvidencia1(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  if (/evidencia\s*1/i.test(val)) {
    return val
      .replace(/Evidencia\s*1\s*[—–-]\s*/gi, '')
      .replace(/EVIDENCIA\s*1\s*[—–-]\s*/gi, '')
      .replace(/\(Evidencia\s*1\):\s*/gi, '')
      .replace(/Evidencia\s*1/gi, 'Sistema')
      .replace(/EVIDENCIA\s*1/gi, 'SISTEMA DE GESTIÓN');
  }
  return val;
}

export function getPresentationConfig(): ConfiguracionPresentacion {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure merged with default in case of missing keys and sanitized
      const res: ConfiguracionPresentacion = {
        appHeader: {
          ...CONFIG_PRESENTACION_DEFAULT.appHeader,
          ...(parsed.appHeader || {}),
          subtitulo: cleanEvidencia1(
            parsed.appHeader?.subtitulo,
            CONFIG_PRESENTACION_DEFAULT.appHeader.subtitulo
          ),
        },
        banner: {
          ...CONFIG_PRESENTACION_DEFAULT.banner,
          ...(parsed.banner || {}),
          etiqueta: cleanEvidencia1(
            parsed.banner?.etiqueta,
            CONFIG_PRESENTACION_DEFAULT.banner.etiqueta
          ),
        },
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
          titulo: cleanEvidencia1(
            parsed.guiaDocente?.titulo,
            CONFIG_PRESENTACION_DEFAULT.guiaDocente.titulo
          ),
        },
        matrizTabla: {
          ...CONFIG_PRESENTACION_DEFAULT.matrizTabla,
          ...(parsed.matrizTabla || {}),
        },
      };
      return res;
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
