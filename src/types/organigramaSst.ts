export type NivelJerarquicoSST = 'ALTA_DIRECCION' | 'RESPONSABLE_SST' | 'NIVEL_OPERATIVO';

export interface CargoSST {
  id: string;
  nombre: string;
  nivelJerarquico: NivelJerarquicoSST;
  nivelNombre: string;
  areaProceso: string;
  icono: string;
  colorTheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    accent: string;
    gradient: string;
    cardBg: string;
  };
  descripcionPuesto: string;
  responsabilidades: string[];
  compromisos: string[];
  ordenNivel: number;
}

export interface CompromisoPolitica {
  id: number;
  titulo: string;
  descripcion: string;
}

export interface RegistroHistorialPolitica {
  id: string;
  fecha: string;
  hora: string;
  version: string;
  autor: string;
  motivoCambio: string;
  estado: 'Pendiente de aprobación' | 'Vigente';
  detallesModificacion: string;
}

export interface PoliticaSSTData {
  id: string;
  empresa: string;
  nit: string;
  direccion: string;
  actividadPrincipal: string;
  titulo: string;
  declaracionIntroductoria: string;
  compromisos: CompromisoPolitica[];
  comunicacionRevision: string;
  nombreFirmante: string;
  cargoFirmante: string;
  estado: 'Pendiente de aprobación' | 'Vigente';
  fechaUltimaActualizacion: string;
  fechaAprobacion?: string;
  versionActual: string;
  historialCambios: RegistroHistorialPolitica[];
}
