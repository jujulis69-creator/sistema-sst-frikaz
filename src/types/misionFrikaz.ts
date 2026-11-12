// ============================================================================
// TIPOS DE DATOS: «MISIÓN FRIKAZ – PROTEGE NUESTRA EMPRESA»
// Frikaz S.A.S. — Sistema de Acreditación y Gamificación SG-SST
// ============================================================================

export type EstadoMision = 'PENDIENTE' | 'EN_PROCESO' | 'NO_SUPERADA' | 'SUPERADA';

export interface TrabajadorFrikaz {
  id: string;
  nombre: string;
  cedula: string;
  cargoId: string;
  cargoNombre: string;
  correo: string;
  area: string;
  avatarUrl?: string;
  esAdmin?: boolean;
}

export interface OpcionRespuesta {
  id: string;
  texto: string;
  esCorrecta: boolean;
  retroalimentacion: string;
}

export interface PreguntaEvaluacion {
  id: string;
  numero: number;
  enunciado: string;
  contextoCaso?: string;
  opciones: OpcionRespuesta[];
  pesoPuntos: number; // Por defecto 20 si son 5 preguntas = 100 puntos
  fundamentoNormativo: string;
}

export interface EscenarioProblema {
  titulo: string;
  ubicacionPlanta: string;
  peligroAsociado: string;
  descripcionCaso: string;
  elementosInvolucrados: string[];
  desafioObservacion: string;
  pistas: string[];
}

export interface PeligroHotspot {
  id: string;
  x: number; // Porcentaje X en la imagen (10 - 90)
  y: number; // Porcentaje Y en la imagen (10 - 90)
  titulo: string;
  descripcion: string;
  esPeligro: boolean;
  consejoGuia: string;
}

export interface DesafioTerminalSeguridad {
  codigoProtocolo: string;
  instruccion: string;
  pregunta: string;
  opciones: {
    id: string;
    etiqueta: string;
    esCorrecta: boolean;
  }[];
}

export interface PoliticaMisionFrikaz {
  id: string; // ej. 'FRK-SST-POL-01'
  codigoCalidad: string;
  titulo: string;
  subtitulo: string;
  version: string;
  fechaEmision: string;
  esObligatoria: boolean;
  icono: string; // lucide icon name
  colorAcento: string;
  insigniaNombre: string;
  insigniaDescripcion: string;
  insigniaIcono: string;
  resumenEjecutivo: string;

  // Propiedades de Videojuego
  imagenZona: string;
  sectorPlantaNombre: string;
  dificultad: 'Nivel 1: Recluta' | 'Nivel 2: Operativo' | 'Nivel 3: Experto';
  puntosXp: number;
  dialogoGuiaBienvenida: string;
  hotspots: PeligroHotspot[];
  desafioTerminal: DesafioTerminalSeguridad;

  compromisosClave: {
    numero: number;
    titulo: string;
    descripcion: string;
    aplicacionEnPlanta: string;
  }[];
  responsabilidadesPorNivel: {
    nivel: string;
    responsabilidad: string;
  }[];
  escenario: EscenarioProblema;
  preguntas: PreguntaEvaluacion[];
}

export interface RespuestaUsuario {
  preguntaId: string;
  opcionSeleccionadaId: string;
  esCorrecta: boolean;
  puntosObtenidos: number;
}

export interface IntentoEvaluacion {
  id: string;
  trabajadorId: string;
  trabajadorNombre: string;
  trabajadorCargo: string;
  trabajadorCedula: string;
  politicaId: string;
  politicaCodigo: string;
  politicaTitulo: string;
  fechaInicio: string;
  fechaFin: string;
  duracionSegundos: number;
  puntaje: number; // 0 - 100
  aprobado: boolean; // >= 80%
  numeroIntento: number;
  respuestas: RespuestaUsuario[];
  sincronizadoGoogleSheets?: boolean;
}

export interface InsigniaDigital {
  id: string;
  politicaId: string;
  nombre: string;
  descripcion: string;
  icono: string;
  colorGradiente: string;
  fechaObtencion?: string;
  obtenida: boolean;
}

export interface ProgresoPoliticaTrabajador {
  politicaId: string;
  estado: EstadoMision;
  puntajeMaximo: number;
  intentosTotales: number;
  fechaUltimoIntento?: string;
  fechaSuperacion?: string;
}

export interface PasaporteDigital {
  trabajador: TrabajadorFrikaz;
  progresos: Record<string, ProgresoPoliticaTrabajador>;
  insignias: InsigniaDigital[];
  porcentajeAvance: number; // 0 - 100%
  totalObligatorias: number;
  totalSuperadas: number;
  esEmbajadorFrikaz: boolean;
  fechaAcreditacionEmbajador?: string;
}

export interface MetricasAdminMisionFrikaz {
  totalTrabajadores: number;
  totalCompletados100: number;
  totalEnProceso: number;
  tasaAprobacionGlobal: number;
  promedioIntentosPorPolitica: Record<string, number>;
  preguntasMasFalladas: {
    politicaId: string;
    preguntaId: string;
    enunciado: string;
    tasaFallo: number;
  }[];
  ultimosIntentos: IntentoEvaluacion[];
}
