// ============================================================================
// COMPONENTE: PASAPORTE DIGITAL FRIKAZ
// Frikaz S.A.S. — Pasaporte de Acreditación y Competencias SG-SST
// ============================================================================

import React from 'react';
import { PasaporteDigital, PoliticaMisionFrikaz } from '../../types/misionFrikaz';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Printer,
  Sparkles,
  Building2,
  Calendar,
  Lock,
  ChevronRight,
} from 'lucide-react';

interface PasaporteDigitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  pasaporte: PasaporteDigital;
  politicas: PoliticaMisionFrikaz[];
  onSeleccionarMision?: (politicaId: string) => void;
}

export const PasaporteDigitalModal: React.FC<PasaporteDigitalModalProps> = ({
  isOpen,
  onClose,
  pasaporte,
  politicas,
  onSeleccionarMision,
}) => {
  if (!isOpen) return null;

  const { trabajador, progresos, insignias, porcentajeAvance, esEmbajadorFrikaz } = pasaporte;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden text-slate-100 my-auto">
        
        {/* Cabecera estilo pasaporte corporativo */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 px-6 py-5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">FRIKAZ S.A.S.</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  SG-SST ACREDITACIÓN
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                PASAPORTE DIGITAL DE SEGURIDAD
              </h2>
              <p className="text-xs text-slate-400">
                Registro oficial de competencias y acreditación de políticas institucionales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Imprimir / Exportar Pasaporte"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Pasaporte */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Ficha del Titular */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 rounded-xl p-5 border border-slate-800">
            <div className="flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-slate-800">
              <div className="relative mb-3">
                <img
                  src={trabajador.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={trabajador.nombre}
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-500/50 shadow-xl"
                />
                {esEmbajadorFrikaz && (
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-lg">
                    <Sparkles className="w-5 h-5 fill-current" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-base text-white">{trabajador.nombre}</h3>
              <p className="text-xs text-amber-400 font-medium">{trabajador.cargoNombre}</p>
              <p className="text-xs text-slate-400 mt-1">C.C. {trabajador.cedula}</p>
            </div>

            <div className="md:col-span-2 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-medium">Área / Proceso:</span>
                  <span className="text-white font-semibold">{trabajador.area}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-medium">Sede Operativa:</span>
                  <span className="text-white font-semibold">Planta Principal Bosa, Bogotá</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-medium">Correo Registrado:</span>
                  <span className="text-white font-semibold truncate block">{trabajador.correo}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-medium">Estado de Acreditación:</span>
                  <span
                    className={`font-bold inline-flex items-center gap-1.5 ${
                      esEmbajadorFrikaz ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {esEmbajadorFrikaz ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% COMPLETADO
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" /> EN PROCESO ({porcentajeAvance}%)
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
                  <span className="text-slate-300">Progreso de Políticas Obligatorias:</span>
                  <span className="text-amber-400">{porcentajeAvance}% de 100%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      esEmbajadorFrikaz
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                        : 'bg-gradient-to-r from-amber-600 to-amber-400'
                    }`}
                    style={{ width: `${porcentajeAvance}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insignia Suprema de Embajador */}
          <div
            className={`rounded-2xl p-6 border-2 transition-all ${
              esEmbajadorFrikaz
                ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-amber-400 shadow-xl shadow-amber-500/20'
                : 'bg-slate-950/40 border-slate-800 opacity-70'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                  esEmbajadorFrikaz
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 border-yellow-200 shadow-lg shadow-amber-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                <Award className="w-10 h-10" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    GRAN DISTINCIÓN CORPORATIVA
                  </span>
                  {esEmbajadorFrikaz && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ACREDITACIÓN OFICIAL ACTIVA
                    </span>
                  )}
                </div>
                <h4 className="text-xl font-black text-white">EMBAJADOR FRIKAZ DE LA SEGURIDAD</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {esEmbajadorFrikaz
                    ? '¡Felicitaciones! Has demostrado conocimiento riguroso, actitud preventiva y compromiso irrestricto con la protección de la vida y el SG-SST de Frikaz S.A.S.'
                    : 'Supera con puntaje igual o superior al 80% todas las políticas obligatorias de la empresa para desbloquear este sello supremo y el acceso ilimitado a la plataforma.'}
                </p>
              </div>
            </div>
          </div>

          {/* Listado de Políticas e Insignias del Pasaporte */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Políticas y Protocolos Acreditados
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {politicas.map((pol) => {
                const prog = progresos[pol.id];
                const estaSuperada = prog?.estado === 'SUPERADA';
                const insignia = insignias.find((i) => i.politicaId === pol.id);

                return (
                  <div
                    key={pol.id}
                    className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                      estaSuperada
                        ? 'bg-slate-900/90 border-emerald-500/40 shadow-md shadow-emerald-500/5'
                        : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div>
                      {/* Estado y Código */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {pol.codigoCalidad}
                        </span>
                        {estaSuperada ? (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> SUPERADA ({prog.puntajeMaximo}%)
                          </span>
                        ) : prog?.estado === 'NO_SUPERADA' ? (
                          <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                            <AlertCircle className="w-3.5 h-3.5" /> NO SUPERADA ({prog.puntajeMaximo}%)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" /> PENDIENTE
                          </span>
                        )}
                      </div>

                      {/* Título de la política */}
                      <div className="flex items-center gap-3 mb-2">
                        {pol.imagenZona && (
                          <img
                            src={pol.imagenZona}
                            alt={pol.titulo}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                        )}
                        <h5 className="font-bold text-xs sm:text-sm text-white line-clamp-2">{pol.titulo}</h5>
                      </div>

                      {/* Insignia asociada */}
                      <div className="flex items-center gap-3 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 mb-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            estaSuperada
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-600 border border-slate-700'
                          }`}
                        >
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{pol.insigniaNombre}</p>
                          <p className="text-[10px] text-slate-400 truncate">{pol.insigniaDescripcion}</p>
                        </div>
                      </div>

                      {/* Estadísticas de intentos */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 mb-3">
                        <span>Intentos: <strong className="text-slate-200">{prog?.intentosTotales || 0}</strong></span>
                        {prog?.fechaSuperacion && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(prog.fechaSuperacion).toLocaleDateString('es-CO')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botón de acción */}
                    {onSeleccionarMision && (
                      <button
                        onClick={() => {
                          onClose();
                          onSeleccionarMision(pol.id);
                        }}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          estaSuperada
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        }`}
                      >
                        {estaSuperada ? 'Repasar Zona' : 'Iniciar Misión'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pie de Pasaporte con Leyenda Oficial */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>Frikaz S.A.S. · NIT 901.842.110 · Sede Bosa, Bogotá D.C.</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Acreditación certificada bajo Decreto 1072/2015 y Res. 0312/2019
          </p>
        </div>

      </div>
    </div>
  );
};
