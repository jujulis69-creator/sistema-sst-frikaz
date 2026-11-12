// ============================================================================
// COMPONENTE: VIDEOJUEGO «MISIÓN FRIKAZ – PROTEGE NUESTRA EMPRESA»
// Lobby de Entrada + Mapa de Misiones Interactivo por Sectores de Planta
// ============================================================================

import React, { useState } from 'react';
import {
  TrabajadorFrikaz,
  PoliticaMisionFrikaz,
  PasaporteDigital,
} from '../../types/misionFrikaz';
import { SoundFX } from '../../services/soundEffects';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Award,
  Play,
  Users,
  KeyRound,
  Flame,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  ChevronRight,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface MisionFrikazGatekeeperProps {
  trabajador: TrabajadorFrikaz;
  pasaporte: PasaporteDigital;
  politicas: PoliticaMisionFrikaz[];
  onIniciarMision: (politicaId: string) => void;
  onAbrirPasaporte: () => void;
  onCambiarTrabajador: () => void;
  onEntrarComoAdmin: () => void;
}

export const MisionFrikazGatekeeper: React.FC<MisionFrikazGatekeeperProps> = ({
  trabajador,
  pasaporte,
  politicas,
  onIniciarMision,
  onAbrirPasaporte,
  onCambiarTrabajador,
  onEntrarComoAdmin,
}) => {
  // Estado de vista del lobby: 'PORTADA_HERO' | 'MAPA_MISIONES'
  const [vistaLobby, setVistaLobby] = useState<'PORTADA_HERO' | 'MAPA_MISIONES'>('PORTADA_HERO');
  const [sonidoActivo, setSonidoActivo] = useState(SoundFX.isEnabled());
  const [zonaHover, setZonaHover] = useState<string | null>(null);

  const { progresos, porcentajeAvance, totalObligatorias, totalSuperadas } = pasaporte;

  const toggleSonido = () => {
    const nuevo = SoundFX.toggle();
    setSonidoActivo(nuevo);
    if (nuevo) SoundFX.playClick();
  };

  const handleComenzarAventura = () => {
    SoundFX.playSuccess();
    setVistaLobby('MAPA_MISIONES');
  };

  const handleSeleccionarZona = (politicaId: string) => {
    SoundFX.playScan();
    onIniciarMision(politicaId);
  };

  // Buscar la primera misión recomendada
  const primeraPendiente = politicas.find((p) => {
    const prog = progresos[p.id];
    return !prog || prog.estado !== 'SUPERADA';
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* HUD SUPERIOR DE VIDEOJUEGO */}
      <header className="relative z-30 bg-slate-950/80 backdrop-blur-md border-b border-amber-500/30 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo y Nivel del Jugador */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  FRIKAZ GAME ENGINE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  SECTOR: BOSA HQ
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                MISIÓN FRIKAZ
              </h1>
            </div>
          </div>

          {/* Tarjeta HUD del Jugador */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
              <img
                src={trabajador.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={trabajador.nombre}
                className="w-8 h-8 rounded-full object-cover border border-amber-400"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none truncate max-w-[130px]">
                  {trabajador.nombre}
                </p>
                <p className="text-[10px] text-amber-400 font-medium leading-none mt-1 truncate max-w-[130px]">
                  {trabajador.cargoNombre}
                </p>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">ENERGÍA / PROGRESO</span>
                <span className="text-xs font-black text-emerald-400">{porcentajeAvance}%</span>
              </div>
            </div>

            {/* Botón de Sonido */}
            <button
              onClick={toggleSonido}
              className={`p-2.5 rounded-xl border transition-all ${
                sonidoActivo
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={sonidoActivo ? 'Desactivar audio de efectos' : 'Activar audio'}
            >
              {sonidoActivo ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Ver Pasaporte */}
            <button
              onClick={() => {
                SoundFX.playClick();
                onAbrirPasaporte();
              }}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Pasaporte</span>
            </button>

            {/* Cambiar Personaje */}
            <button
              onClick={() => {
                SoundFX.playClick();
                onCambiarTrabajador();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Seleccionar otro colaborador"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Cambiar</span>
            </button>

            {/* Acceso Administrador (Solo para cargos con rol directivo o con clave de supervisión) */}
            {trabajador.esAdmin ? (
              <button
                onClick={() => {
                  SoundFX.playClick();
                  onEntrarComoAdmin();
                }}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Modo Supervisor SG-SST (Solo Alta Dirección y Vigía)"
              >
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span className="hidden lg:inline">Supervisor</span>
              </button>
            ) : null}
          </div>

        </div>
      </header>

      {/* ==================================================================== */}
      {/* VISTA 1: PANTALLA DE INICIO (PORTADA CINEMÁTICA DE VIDEOJUEGO)     */}
      {/* ==================================================================== */}
      {vistaLobby === 'PORTADA_HERO' && (
        <div className="relative flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
          
          {/* Fondo de Fábrica con Efecto de Profundidad */}
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/frikaz_game_factory_hero_1794397642002.jpg"
              alt="Fábrica Frikaz S.A.S."
              className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Contenido Central Flotante */}
          <div className="relative z-10 max-w-4xl w-full mx-auto text-center flex flex-col items-center">
            
            {/* Personaje Guía con Globo de Diálogo de Videojuego */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fadeIn">
              <div className="relative">
                <img
                  src="/src/assets/images/frikaz_guide_character_1794397643333.jpg"
                  alt="Guía SG-SST"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-2xl shadow-amber-500/40"
                />
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500 text-slate-950 font-bold shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Globo de Diálogo de Videojuego */}
              <div className="bg-slate-900/90 border-2 border-amber-400/60 rounded-2xl p-4 sm:p-5 shadow-2xl text-left relative max-w-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    GUÍA SG-SST · SEGURIDAD INDUSTRIAL
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">CONEXIÓN VITAL</span>
                </div>
                <p className="text-base sm:text-lg font-black text-white leading-snug">
                  «La misión comienza contigo. ¿Estás preparado?»
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Explora las zonas de la planta, detecta las conductas de riesgo y desbloquea tu pasaporte de seguridad.
                </p>
              </div>
            </div>

            {/* Radar Visual de Misiones Pendientes */}
            <div className="inline-flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-full px-5 py-2 mb-8 shadow-xl">
              <Target className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-xs font-bold text-slate-300">
                Radar de Planta: <strong className="text-amber-400">{totalObligatorias - totalSuperadas} zonas</strong> pendientes por asegurar
              </span>
              <span className="h-4 w-px bg-slate-800" />
              <span className="text-xs font-bold text-emerald-400">
                {totalSuperadas} / {totalObligatorias} Zonas Libres
              </span>
            </div>

            {/* Botón Gigante de Comienzo */}
            <button
              onClick={handleComenzarAventura}
              className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg sm:text-xl uppercase tracking-wider shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transform hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
            >
              <Play className="w-7 h-7 fill-current" />
              <span>COMENZAR AVENTURA</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <p className="text-xs text-slate-400 mt-4 tracking-wide font-medium">
              Frikaz S.A.S. · Planta de Snacks Bosa · Desafío de Cumplimiento SG-SST
            </p>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VISTA 2: MAPA DE MISIONES INTERACTIVO                               */}
      {/* ==================================================================== */}
      {vistaLobby === 'MAPA_MISIONES' && (
        <div className="relative flex-1 flex flex-col justify-start max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 z-10 animate-fadeIn">
          
          {/* Cabecera del Mapa */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  MAPA GENERAL DE LA PLANTA DE SNACKS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Selecciona tu Zona de Operación
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cada sector representa un área crítica de la empresa. Ingresa, analiza los peligros y desbloquea el sello de seguridad.
              </p>
            </div>

            <button
              onClick={() => setVistaLobby('PORTADA_HERO')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              Volver a la Entrada
            </button>
          </div>

          {/* Rejilla Visual de Escenarios / Zonas de Juego */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {politicas.map((pol, idx) => {
              const prog = progresos[pol.id];
              const estaSuperada = prog?.estado === 'SUPERADA';
              const estaEnProceso = prog?.estado === 'NO_SUPERADA' || (prog?.intentosTotales || 0) > 0;
              const estaBloqueada = idx > 0 && !progresos[politicas[idx - 1].id]?.estado && pol.esObligatoria;

              return (
                <div
                  key={pol.id}
                  onMouseEnter={() => {
                    setZonaHover(pol.id);
                    SoundFX.playScan();
                  }}
                  onMouseLeave={() => setZonaHover(null)}
                  className={`group relative rounded-3xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-between ${
                    estaSuperada
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20'
                  }`}
                >
                  {/* Imagen de la Zona / Escenario con Scrim */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={pol.imagenZona || '/src/assets/images/frikaz_zone_frying_line_1794397643230.jpg'}
                      alt={pol.titulo}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                    {/* Insignia / Estado en Esquina */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                        {pol.codigoCalidad}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {estaSuperada ? (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETADA
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/90 border border-amber-400 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" /> ACTIVA
                        </span>
                      )}
                    </div>

                    {/* Recompensa XP */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-700 px-2.5 py-0.5 rounded-lg text-[10px] font-black text-amber-400">
                      +{pol.puntosXp} XP
                    </div>
                  </div>

                  {/* Cuerpo de la Tarjeta del Escenario */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                        {pol.sectorPlantaNombre}
                      </span>
                      <h3 className="font-black text-base text-white leading-snug line-clamp-2">
                        {pol.titulo}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {pol.subtitulo}
                      </p>
                    </div>

                    {/* Barra de Progreso de la Zona */}
                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1.5 font-medium">
                        <span className="text-slate-400">Dificultad: <strong className="text-slate-200">{pol.dificultad}</strong></span>
                        <span className={estaSuperada ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {estaSuperada ? '100% Superada' : `${prog?.puntajeMaximo || 0}%`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            estaSuperada ? 'bg-emerald-400' : 'bg-amber-500'
                          }`}
                          style={{ width: `${estaSuperada ? 100 : prog?.puntajeMaximo || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Botón de Entrada a la Misión */}
                    <button
                      onClick={() => handleSeleccionarZona(pol.id)}
                      className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                        estaSuperada
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
                      }`}
                    >
                      {estaSuperada ? (
                        <>
                          <Award className="w-4 h-4 text-emerald-400" />
                          <span>Repasar Zona</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>ENTRAR A LA MISIÓN</span>
                        </>
                      )}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* PIE DEL JUEGO */}
      <footer className="relative z-30 bg-slate-950/80 border-t border-slate-900 py-3 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>FRIKAZ S.A.S. · Videojuego de Cumplimiento y Seguridad Industrial</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Decreto 1072 de 2015 · Resolución 0312 de 2019 · Todos los derechos reservados
        </p>
      </footer>

    </div>
  );
};
