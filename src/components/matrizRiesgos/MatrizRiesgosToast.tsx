import React, { useEffect, useState } from 'react';
import { Cloud, CheckCircle2, X, ArrowRight, Eye, Sparkles } from 'lucide-react';

export interface MatrizRiesgosToastProps {
  show: boolean;
  message?: string;
  subMessage?: string;
  targetArea?: string;
  targetRiskId?: string;
  targetRiskName?: string;
  buttonLabel?: string;
  onActionClick?: (area?: string, riskId?: string) => void;
  onClose: () => void;
  durationMs?: number; // Exactly 5000ms by default
}

export function MatrizRiesgosToast({
  show,
  message = '¡Se han detectado nuevos cambios en la matriz!',
  subMessage = 'Sincronización en tiempo real completada desde los archivos de Google Drive.',
  targetArea = 'Área de producción',
  targetRiskId = 'RSK-PROD-01',
  targetRiskName,
  buttonLabel = 'Ver cambios',
  onActionClick,
  onClose,
  durationMs = 5000,
}: MatrizRiesgosToastProps) {
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    if (!show) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const intervalTime = 40; // Smooth progress bar updates

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        onClose();
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [show, durationMs, onClose]);

  if (!show) return null;

  const handleButtonClick = () => {
    if (onActionClick) {
      onActionClick(targetArea, targetRiskId);
    }
    onClose();
  };

  const secondsRemaining = Math.max(1, Math.ceil((progress / 100) * (durationMs / 1000)));

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 max-w-lg w-[calc(100vw-2.5rem)] animate-slideUp pointer-events-auto"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 border-2 border-emerald-500/90 p-4 sm:p-5 shadow-2xl shadow-emerald-950/80 backdrop-blur-2xl">
        {/* Glow blur background effect */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-3.5">
          {/* Animated Cloud Icon Badge */}
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shrink-0 mt-0.5">
            <Cloud className="h-5 w-5 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Sincronización Google Drive</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-normal">{secondsRemaining}s</span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-white leading-snug">
              {message}
            </h4>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {subMessage}
            </p>

            {/* Target Area and Hazard Preview Badge if available */}
            {targetArea && (
              <div className="mt-2.5 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                <span className="font-semibold text-white truncate max-w-[220px]">
                  {targetArea}
                </span>
                {targetRiskName && (
                  <span className="text-slate-400 truncate max-w-[150px] hidden sm:inline">
                    · {targetRiskName}
                  </span>
                )}
              </div>
            )}

            {/* INTERACTIVE ACTION BUTTON: "Ver cambios" / "Ir al cambio" */}
            <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleButtonClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/70 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{buttonLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer border border-slate-700"
              >
                Descartar
              </button>
            </div>
          </div>

          {/* Top-right close button */}
          <button
            onClick={onClose}
            aria-label="Cerrar notificación"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 5-Second Animated Progress Bar */}
        <div className="mt-3.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Cierre automático en exactamente 5 segundos
          </span>
          <span className="text-emerald-400 font-bold">{secondsRemaining}s</span>
        </div>

        {/* Progress track at the very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800/90">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-orange-400 transition-[width] duration-75 ease-linear"
          />
        </div>
      </div>
    </div>
  );
}
