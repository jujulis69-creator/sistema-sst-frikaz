import React from 'react';
import { DictamenAuditoria, descargarPlantillaOficial } from '../services/automationTools';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  Download,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  X,
  Zap,
} from 'lucide-react';

interface AutoAuditoriaPanelProps {
  dictamen: DictamenAuditoria;
  isOpen: boolean;
  onClose: () => void;
}

export const AutoAuditoriaPanel: React.FC<AutoAuditoriaPanelProps> = ({
  dictamen,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border-2 border-[#1e3a8a] overflow-hidden text-xs text-slate-800">
        {/* Header con colores Frikaz (Azul Oscuro, Naranja Claro, Rojo Oscuro, Blanco) */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#0f172a] text-white border-b-4 border-[#f97316]">
          <div className="flex items-center gap-3">
            <img
              src="/frikaz_logo.jpg"
              alt="Logo Frikaz"
              className="h-11 w-auto max-w-[110px] object-contain rounded-lg border border-orange-200/50 bg-white p-0.5 shadow-sm"
            />
            <div>
              <span className="rounded-md bg-[#fed7aa] px-2 py-0.5 text-[10px] font-black uppercase text-[#0f172a]">
                AUTOMATIZACIÓN INTELIGENTE EN VIVO
              </span>
              <h3 className="text-lg font-black text-white">
                Dictamen Automático de Auditoría e Inspección Legal — Frikaz S.A.S.
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Main Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl p-4 bg-linear-to-br from-[#1e3a8a] to-[#0f172a] text-white border border-blue-900 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                Puntaje Global Automático
              </span>
              <div className="my-2">
                <span className="text-3xl font-black font-mono text-[#fbbf24]">
                  {dictamen.puntaje}%
                </span>
                <span className="text-xs text-slate-300 ml-1">/ 100%</span>
              </div>
              <span className="text-[11px] font-bold text-white">
                Calificación: {dictamen.nivelCumplimiento.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="rounded-xl p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Sanciones Evitadas Estimadas
              </span>
              <div className="my-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-900 font-mono">
                  {dictamen.multasAhorradasCOP}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800">
                Ahorro equivalente a {dictamen.multasAhorradasSMMLV} SMMLV en multas
              </span>
            </div>

            <div className="rounded-xl p-4 bg-orange-50 border-2 border-[#f59e0b] text-orange-950 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800">
                Acciones de Cierre Prioritario
              </span>
              <div className="my-2">
                <span className="text-3xl font-black font-mono text-[#dc2626]">
                  {dictamen.recomendacionesAutomaticas.length}
                </span>
                <span className="text-xs text-slate-600 ml-1">brechas</span>
              </div>
              <span className="text-[11px] font-semibold text-orange-900">
                Plazos sugeridos: 15 y 30 días
              </span>
            </div>
          </div>

          {/* Dictamen Autoridades */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#1e3a8a]" />
              Dictamen Oficial ante Autoridades Competentes
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border border-blue-200 bg-blue-50/60 space-y-1">
                <span className="font-bold text-xs text-[#1e3a8a] block">
                  Ministerio del Trabajo (Resolución 0312 de 2019)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {dictamen.resultadoLegalMinTrabajo}
                </p>
              </div>

              <div className="rounded-xl p-4 border border-emerald-200 bg-emerald-50/60 space-y-1">
                <span className="font-bold text-xs text-emerald-900 block">
                  Secretaría Distrital de Ambiente (SDA Bogotá)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {dictamen.resultadoLegalSDABogota}
                </p>
              </div>
            </div>
          </div>

          {/* Generador de Plantillas Oficiales Descargables en 1 Clic */}
          <div className="rounded-xl border-2 border-[#fed7aa] bg-[#fff7ed] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#f59e0b]" />
                <h4 className="font-black text-sm text-orange-950">
                  Generador Automático de Evidencias Oficiales (Descarga en 1 Clic)
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#dc2626] bg-white px-2 py-0.5 rounded-md border border-[#dc2626]">
                Con Membrete Oficial Frikaz
              </span>
            </div>
            <p className="text-xs text-orange-900">
              Haga clic para generar y descargar inmediatamente las actas y soportes prediligenciados con los
              datos de <strong>Frikaz S.A.S. (NIT 901.654.892-3, Bosa Piamonte, 10 trabajadores)</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => descargarPlantillaOficial('RESPONSABLE_SST')}
                className="p-2.5 rounded-lg bg-white border border-orange-300 text-left hover:border-[#dc2626] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <span className="font-bold text-xs text-slate-900">Acta Responsable 50h</span>
                <span className="text-[10px] text-slate-500 mt-1">Res. 0312 Estándar 1</span>
                <span className="text-[10px] font-bold text-[#1e3a8a] mt-2 flex items-center gap-1">
                  <Download className="h-3 w-3" /> Descargar
                </span>
              </button>

              <button
                type="button"
                onClick={() => descargarPlantillaOficial('ACU_MANIFIESTO')}
                className="p-2.5 rounded-lg bg-white border border-orange-300 text-left hover:border-[#dc2626] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <span className="font-bold text-xs text-slate-900">Manifiesto ACU (SDA)</span>
                <span className="text-[10px] text-slate-500 mt-1">Res. 316/2018 Aceites</span>
                <span className="text-[10px] font-bold text-[#1e3a8a] mt-2 flex items-center gap-1">
                  <Download className="h-3 w-3" /> Descargar
                </span>
              </button>

              <button
                type="button"
                onClick={() => descargarPlantillaOficial('VIGIA_SST')}
                className="p-2.5 rounded-lg bg-white border border-orange-300 text-left hover:border-[#dc2626] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <span className="font-bold text-xs text-slate-900">Acta Vigía de SST</span>
                <span className="text-[10px] text-slate-500 mt-1">Res. 2013/1986 Votación</span>
                <span className="text-[10px] font-bold text-[#1e3a8a] mt-2 flex items-center gap-1">
                  <Download className="h-3 w-3" /> Descargar
                </span>
              </button>

              <button
                type="button"
                onClick={() => descargarPlantillaOficial('EPP_TERMICO')}
                className="p-2.5 rounded-lg bg-white border border-orange-300 text-left hover:border-[#dc2626] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <span className="font-bold text-xs text-slate-900">Entrega EPP Térmico</span>
                <span className="text-[10px] text-slate-500 mt-1">Res. 2400 Freidoras</span>
                <span className="text-[10px] font-bold text-[#1e3a8a] mt-2 flex items-center gap-1">
                  <Download className="h-3 w-3" /> Descargar
                </span>
              </button>
            </div>
          </div>

          {/* Recomendaciones Automáticas */}
          {dictamen.recomendacionesAutomaticas.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#dc2626]" />
                Cronograma Automático de Cierre de Brechas
              </h4>

              <div className="space-y-2">
                {dictamen.recomendacionesAutomaticas.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold ${
                            rec.prioridad === 'ALTA'
                              ? 'bg-red-100 text-[#991b1b]'
                              : 'bg-orange-100 text-[#ea580c]'
                          }`}
                        >
                          Prioridad {rec.prioridad}
                        </span>
                        <strong className="text-slate-900">{rec.norma}</strong>
                      </div>
                      <p className="text-slate-600 text-xs">{rec.accion}</p>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <span className="text-[10px] text-slate-400 block">Límite sugerido:</span>
                      <strong className="text-slate-800 text-xs">{rec.fechaSugerida}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#0f172a] px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Cerrar Informe
          </button>
        </div>
      </div>
    </div>
  );
};
