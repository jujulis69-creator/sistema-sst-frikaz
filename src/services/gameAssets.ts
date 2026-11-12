// ============================================================================
// GESTOR DE ASSETS GRÁFICOS Y AVATARES ILUSTRADOS: «MISIÓN FRIKAZ»
// Frikaz S.A.S. — Sistema de Acreditación y Gamificación SG-SST
// ============================================================================

export interface GameAssetInfo {
  webp: string;
  jpg: string;
  alt: string;
}

// Rutas compatibles tanto con Vite dev server como con la compilación de producción (dist/) y descarga
export const GAME_IMAGES = {
  // Los 6 Avatares Ilustrados Canónicos (exclusivos sin fotos reales)
  avatars: {
    gerente: {
      webp: '/assets/images/avatar_gerente.webp',
      jpg: '/assets/images/avatar_gerente.jpg',
      alt: 'Avatar Ilustrado: Gerente General Frikaz S.A.S.',
    },
    operarioFrito: {
      webp: '/assets/images/avatar_operario_frito.webp',
      jpg: '/assets/images/avatar_operario_frito.jpg',
      alt: 'Avatar Ilustrado: Operario de Frito con EPP térmico',
    },
    operarioPelado: {
      webp: '/assets/images/avatar_operario_pelado.webp',
      jpg: '/assets/images/avatar_operario_pelado.jpg',
      alt: 'Avatar Ilustrado: Operario de Pelado con guante de malla anticorte',
    },
    operarioSeleccion: {
      webp: '/assets/images/avatar_operario_seleccion.webp',
      jpg: '/assets/images/avatar_operario_seleccion.jpg',
      alt: 'Avatar Ilustrado: Operario de Selección con cofia y guantes sanitarios',
    },
    operarioEmpaque: {
      webp: '/assets/images/avatar_operario_empaque.webp',
      jpg: '/assets/images/avatar_operario_empaque.jpg',
      alt: 'Avatar Ilustrado: Operario de Empaque con protección auditiva',
    },
    conductor: {
      webp: '/assets/images/avatar_conductor.webp',
      jpg: '/assets/images/avatar_conductor.jpg',
      alt: 'Avatar Ilustrado: Conductor con chaleco reflectivo PESV',
    },
  },

  // Escenarios y Zonas de Planta Ilustradas
  scenes: {
    heroLobby: {
      webp: '/assets/images/game_factory_hero.webp',
      jpg: '/assets/images/game_factory_hero.jpg',
      alt: 'Fábrica Frikaz S.A.S. — Pantalla Inicial Misión Frikaz',
    },
    mapaMisiones: {
      webp: '/assets/images/game_factory_map.webp',
      jpg: '/assets/images/game_factory_map.jpg',
      alt: 'Mapa de Misiones y Sectores de Planta',
    },
    guiaPersonaje: {
      webp: '/assets/images/game_guide_character.webp',
      jpg: '/assets/images/game_guide_character.jpg',
      alt: 'Personaje Guía SG-SST Frikaz',
    },
    zonaFritura: {
      webp: '/assets/images/zone_frying_line.webp',
      jpg: '/assets/images/zone_frying_line.jpg',
      alt: 'Línea Central de Freído y Control Térmico 180°C',
    },
    zonaPelado: {
      webp: '/assets/images/zone_pelado_prep.webp',
      jpg: '/assets/images/zone_pelado_prep.jpg',
      alt: 'Área de Pelado Mecanizado y Tolvas',
    },
    zonaSeleccion: {
      webp: '/assets/images/zone_selection_prep.webp',
      jpg: '/assets/images/zone_selection_prep.jpg',
      alt: 'Área de Selección y Lavado de Papa y Plátano',
    },
    zonaEmpaque: {
      webp: '/assets/images/zone_empaque_line.webp',
      jpg: '/assets/images/zone_empaque_line.jpg',
      alt: 'Línea de Empaque Automatizado y Sellado Térmico',
    },
    zonaLogistica: {
      webp: '/assets/images/zone_logistics_patio.webp',
      jpg: '/assets/images/zone_logistics_patio.jpg',
      alt: 'Muelle de Despacho, Furgones y Seguridad Vial',
    },
    zonaAmbiental: {
      webp: '/assets/images/zone_eco_waste.webp',
      jpg: '/assets/images/zone_eco_waste.jpg',
      alt: 'Zona de Gestión Ambiental y Drenaje de ACU',
    },
    zonaGerencia: {
      webp: '/assets/images/zone_gerencia_control.webp',
      jpg: '/assets/images/zone_gerencia_control.jpg',
      alt: 'Sala de Control y Supervisión SG-SST',
    },
    misionCompletada: {
      webp: '/assets/images/mision_completada_trophy.webp',
      jpg: '/assets/images/mision_completada_trophy.jpg',
      alt: 'Trofeo de Misión Cumplida y Acreditación Frikaz',
    },
    logo: {
      webp: '/assets/images/frikaz_logo.webp',
      jpg: '/assets/images/frikaz_logo.jpg',
      alt: 'Logotipo Oficial Frikaz S.A.S.',
    },
  },
};

/**
 * Retorna la URL del avatar ilustrado oficial según el cargo o ID del trabajador.
 * Nunca retorna fotos de personas reales ni URLs externas.
 */
export function getAvatarUrlPorCargo(cargoIdOrNombre: string): string {
  const norm = (cargoIdOrNombre || '').toLowerCase();

  if (norm.includes('gerent') || norm.includes('direc') || norm.includes('admin') || norm.includes('vigia')) {
    return GAME_IMAGES.avatars.gerente.webp;
  }
  if (norm.includes('frito') || norm.includes('coccion') || norm.includes('freid')) {
    return GAME_IMAGES.avatars.operarioFrito.webp;
  }
  if (norm.includes('pelado') || norm.includes('corte') || norm.includes('descascar')) {
    return GAME_IMAGES.avatars.operarioPelado.webp;
  }
  if (norm.includes('selecc') || norm.includes('lavado') || norm.includes('calidad') || norm.includes('recepc')) {
    return GAME_IMAGES.avatars.operarioSeleccion.webp;
  }
  if (norm.includes('empaque') || norm.includes('sellad') || norm.includes('embalaje')) {
    return GAME_IMAGES.avatars.operarioEmpaque.webp;
  }
  if (norm.includes('conduct') || norm.includes('transport') || norm.includes('logist') || norm.includes('chofer')) {
    return GAME_IMAGES.avatars.conductor.webp;
  }

  // Fallback por defecto al Operario de Frito
  return GAME_IMAGES.avatars.operarioFrito.webp;
}

/**
 * Retorna el escenario ilustrado oficial correspondiente a una zona o política.
 */
export function getEscenarioZonaUrl(zonaKeyOrTitulo: string): string {
  const norm = (zonaKeyOrTitulo || '').toLowerCase();

  if (norm.includes('frit') || norm.includes('termic') || norm.includes('180') || norm.includes('pol-01')) {
    return GAME_IMAGES.scenes.zonaFritura.webp;
  }
  if (norm.includes('logist') || norm.includes('conduct') || norm.includes('transp') || norm.includes('pol-02') || norm.includes('despacho') || norm.includes('tabaco') || norm.includes('alcohol')) {
    return GAME_IMAGES.scenes.zonaLogistica.webp;
  }
  if (norm.includes('eco') || norm.includes('acu') || norm.includes('ambient') || norm.includes('pr-01') || norm.includes('aceite')) {
    return GAME_IMAGES.scenes.zonaAmbiental.webp;
  }
  if (norm.includes('pelad')) {
    return GAME_IMAGES.scenes.zonaPelado.webp;
  }
  if (norm.includes('selecc')) {
    return GAME_IMAGES.scenes.zonaSeleccion.webp;
  }
  if (norm.includes('empaq')) {
    return GAME_IMAGES.scenes.zonaEmpaque.webp;
  }

  return GAME_IMAGES.scenes.zonaFritura.webp;
}

/**
 * Precarga de imágenes selectiva y ligera (evita congelamiento de memoria).
 * Solo precarga la pantalla inicial y los avatares principales.
 */
export function precargarRecursosCriticos(): void {
  if (typeof window === 'undefined') return;

  const imagenesCriticas = [
    GAME_IMAGES.scenes.heroLobby.webp,
    GAME_IMAGES.scenes.guiaPersonaje.webp,
    GAME_IMAGES.avatars.operarioFrito.webp,
    GAME_IMAGES.avatars.gerente.webp,
  ];

  // Ejecutar en requestIdleCallback o timeout para no bloquear el hilo de ejecución principal
  const cargar = () => {
    imagenesCriticas.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(cargar);
  } else {
    setTimeout(cargar, 300);
  }
}
