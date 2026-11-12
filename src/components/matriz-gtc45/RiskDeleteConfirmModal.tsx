import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { RiesgoGTC45Item } from '../../types/gtc45RiskMatrix';

interface RiskDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  riskItem: RiesgoGTC45Item | null;
}

export function RiskDeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  riskItem,
}: RiskDeleteConfirmModalProps) {
  if (!isOpen || !riskItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-slate-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">¿Eliminar registro de peligro GTC 45?</h3>
            <p className="text-xs text-slate-400">
              Esta acción eliminará de forma permanente la evaluación del peligro de la matriz.
            </p>
          </div>
        </div>

        {/* Item Preview */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>Código / ID:</span>
            <span className="font-mono font-bold text-white">{riskItem.codigo || riskItem.id}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Zona / Lugar:</span>
            <span className="text-slate-200 font-medium">{riskItem.zonaLugar}</span>
          </div>
          <div className="text-slate-400 pt-1">
            <span className="block text-[11px] font-semibold text-slate-300">Peligro:</span>
            <span className="text-slate-200 line-clamp-2">{riskItem.peligroDescripcion}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-400">Nivel de Riesgo (NR):</span>
            <span className="font-bold text-rose-400">
              {riskItem.nivelRiesgo} (Nivel {riskItem.interpretacionNR})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-950/50 cursor-pointer transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Eliminar Definitivamente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
