import React from 'react';

export type WatermarkIntensity = 'sutil' | 'corporativa' | 'fuerte' | 'desactivada';

interface CorporateWatermarkProps {
  intensity?: WatermarkIntensity;
  showControlBadge?: boolean;
  onIntensityChange?: (intensity: WatermarkIntensity) => void;
}

export const CorporateWatermark: React.FC<CorporateWatermarkProps> = ({
  intensity = 'corporativa',
  showControlBadge = false,
  onIntensityChange,
}) => {
  if (intensity === 'desactivada') return null;

  const opacityValue =
    intensity === 'sutil'
      ? 'opacity-[0.035]'
      : intensity === 'fuerte'
      ? 'opacity-[0.14]'
      : 'opacity-[0.07]';

  return (
    <>
      {/* BACKGROUND CORPORATE WATERMARK LAYER */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 select-none overflow-hidden ${opacityValue} transition-opacity duration-300`}
        aria-hidden="true"
      >
        {/* Repeating diagonal corporate pattern */}
        <div className="absolute -inset-[50%] w-[200%] h-[200%] rotate-[-22deg] flex flex-wrap content-center justify-center gap-28 sm:gap-40">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#0f172a] rounded-full w-80 h-80 shrink-0 text-center"
            >
              {/* Outer seal text */}
              <div className="text-[11px] font-black tracking-[0.25em] text-[#0f172a] uppercase mb-1">
                SISTEMA DE GESTIÓN SST
              </div>
              <div className="w-16 h-0.5 bg-[#f97316] mb-2" />

              {/* Shield Icon SVG */}
              <svg
                className="w-16 h-16 text-[#0f172a] my-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>

              <div className="text-sm font-black tracking-wider text-[#0f172a] uppercase mt-1">
                FRIKAZ S.A.S.
              </div>
              <div className="text-[9px] font-bold tracking-widest text-[#991b1b] uppercase mt-0.5">
                NIT 901.452.889-1 · BOGOTÁ
              </div>
              <div className="text-[8px] font-mono font-bold text-slate-700 uppercase mt-1">
                DEC. 1072/2015 · RES. 0312/2019
              </div>
              <div className="text-[8px] font-bold text-[#ea580c] tracking-widest uppercase mt-0.5">
                ★ COPIA CONTROLADA OFICIAL ★
              </div>
            </div>
          ))}
        </div>

        {/* Large watermark center seal stamp */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-[580px] h-[580px] sm:w-[760px] sm:h-[760px] rounded-full border-4 border-[#0f172a] flex flex-col items-center justify-center p-12 text-center">
            <div className="text-xl sm:text-2xl font-black tracking-[0.3em] uppercase text-[#0f172a]">
              MATRIZ LEGAL SG-SST
            </div>
            <div className="text-sm sm:text-base font-bold text-[#f97316] tracking-widest uppercase mt-2">
              EMPRESA: FRIKAZ S.A.S. (10 TRABAJADORES)
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-700 tracking-wider mt-1">
              PRODUCCIÓN DE ALIMENTOS Y SNACKS FRITOS · BOSA, BOGOTÁ D.C.
            </div>
            <div className="w-32 h-1 bg-[#0f172a] my-4" />
            <div className="text-xs sm:text-sm font-black tracking-widest text-[#991b1b] uppercase">
              DECRETO ÚNICO REGLAMENTARIO 1072 DE 2015
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase mt-1">
              RESOLUCIÓN 0312 DE 2019 · SUIN JURISCOL VIGENTE
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING OR HEADER WATERMARK CONTROL BADGE (IF ENABLED) */}
      {showControlBadge && onIntensityChange && (
        <div className="fixed bottom-4 right-4 z-40 bg-[#0f172a]/95 backdrop-blur-md text-white border border-orange-300/40 rounded-xl px-3.5 py-2 shadow-2xl flex items-center gap-2.5 text-xs print:hidden animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-[#fed7aa] hidden sm:inline">
              Marca de Agua Corporativa:
            </span>
            <span className="font-bold text-[#fed7aa] sm:hidden">Marca de Agua:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-700 text-[11px]">
            <button
              type="button"
              onClick={() => onIntensityChange('sutil')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                intensity === 'sutil'
                  ? 'bg-[#f97316] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Marca de agua sutil (3.5% opacidad)"
            >
              Sutil
            </button>
            <button
              type="button"
              onClick={() => onIntensityChange('corporativa')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                intensity === 'corporativa'
                  ? 'bg-[#f97316] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Marca de agua corporativa recomendada (7% opacidad)"
            >
              Corporativa
            </button>
            <button
              type="button"
              onClick={() => onIntensityChange('fuerte')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                intensity === 'fuerte'
                  ? 'bg-[#f97316] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Marca de agua visible destacada (14% opacidad)"
            >
              Visible
            </button>
          </div>
        </div>
      )}
    </>
  );
};
