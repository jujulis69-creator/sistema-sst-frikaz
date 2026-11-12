// ============================================================================
// COMPONENTE: SELECTOR DE COLABORADOR / SESIÓN ACTIVA
// Permite alternar entre los trabajadores de Frikaz S.A.S. y modo Admin
// ============================================================================

import React from 'react';
import { TrabajadorFrikaz } from '../../types/misionFrikaz';
import {
  getStoredTrabajadores,
  getPasaporteDigital,
} from '../../services/misionFrikazService';
import { GameAvatar } from './GameAvatar';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  KeyRound,
  X,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface WorkerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trabajadorActual: TrabajadorFrikaz;
  onSeleccionarTrabajador: (trabajador: TrabajadorFrikaz) => void;
}

export const WorkerSelectorModal: React.FC<WorkerSelectorModalProps> = ({
  isOpen,
  onClose,
  trabajadorActual,
  onSeleccionarTrabajador,
}) => {
  if (!isOpen) return null;

  const trabajadores = getStoredTrabajadores();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 px-6 py-5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">FRIKAZ S.A.S.</span>
              <h3 className="text-lg font-bold text-white">Seleccionar Colaborador / Sesión</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de trabajadores */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-slate-400 mb-2">
            Selecciona un colaborador para evaluar su estado de acreditación en la <em>Misión Frikaz</em>:
          </p>

          {trabajadores.map((trab) => {
            const esActivo = trab.id === trabajadorActual.id;
            const pasaporte = getPasaporteDigital(trab.id);

            return (
              <button
                key={trab.id}
                type="button"
                onClick={() => {
                  onSeleccionarTrabajador(trab);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  esActivo
                    ? 'bg-amber-500/20 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/70 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <GameAvatar
                    cargoNombre={trab.cargoNombre}
                    avatarUrl={trab.avatarUrl}
                    nombre={trab.nombre}
                    size="md"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">{trab.nombre}</h4>
                      {trab.esAdmin && (
                        <span className="text-[10px] px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Admin SST
                        </span>
                      )}
                      {esActivo && (
                        <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-400 font-semibold truncate">{trab.cargoNombre}</p>
                    <p className="text-[10px] text-slate-500">ID: <span className="font-mono text-amber-300/80">{trab.id}</span> · C.C. {trab.cedula} · {trab.area}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`text-[11px] font-bold flex items-center justify-end gap-1 ${
                        pasaporte.esEmbajadorFrikaz ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {pasaporte.esEmbajadorFrikaz ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100%
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" /> {pasaporte.porcentajeAvance}%
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {pasaporte.totalSuperadas}/{pasaporte.totalObligatorias} superadas
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Pie */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
