// ============================================================================
// COMPONENTE: VISUALIZADOR DE POLÍTICA OFICIAL COMPLETA (MODAL DE REFERENCIA)
// Permite consultar el documento formal sin sobrecargar la pantalla del juego
// ============================================================================

import React from 'react';
import { PoliticaMisionFrikaz } from '../../types/misionFrikaz';
import {
  FileText,
  X,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  Award,
  ChevronRight,
} from 'lucide-react';

interface PoliticaOficialModalProps {
  isOpen: boolean;
  onClose: () => void;
  politica: PoliticaMisionFrikaz;
}

export const PoliticaOficialModal: React.FC<PoliticaOficialModalProps> = ({
  isOpen,
  onClose,
  politica,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto flex flex-col max-h-[85vh]">
        
        {/* Cabecera con Caja de Calidad */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 block">
                DOCUMENTO CONTROLADO SG-SST · {politica.codigoCalidad}
              </span>
              <h3 className="text-base font-bold text-white truncate max-w-lg">
                {politica.titulo}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Completo del Documento */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Caja de Calidad */}
          <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-950">
            <div className="grid grid-cols-4 divide-x divide-slate-700 text-center text-xs py-2 bg-slate-900">
              <div>
                <span className="text-[10px] text-slate-400 block">EMPRESA:</span>
                <strong className="text-amber-400">FRIKAZ S.A.S.</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CÓDIGO:</span>
                <strong className="text-white font-mono">{politica.codigoCalidad}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">VERSIÓN:</span>
                <strong className="text-white">{politica.version}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">EMISIÓN:</span>
                <strong className="text-white">{politica.fechaEmision}</strong>
              </div>
            </div>
          </div>

          {/* Declaración */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Declaración Institucional de la Alta Dirección:
            </h4>
            <p className="text-slate-200 leading-relaxed italic">
              "{politica.resumenEjecutivo}"
            </p>
          </div>

          {/* Compromisos Oficiales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Compromisos Oficiales de la Política:
            </h4>
            <div className="space-y-3">
              {politica.compromisosClave.map((comp) => (
                <div key={comp.numero} className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center">
                      {comp.numero}
                    </span>
                    <h5 className="font-bold text-white text-xs">{comp.titulo}</h5>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{comp.descripcion}</p>
                  <p className="text-[11px] text-amber-400/90 mt-2">
                    <strong>Aplicación práctica en planta:</strong> {comp.aplicacionEnPlanta}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Responsabilidades por Cargo */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Matriz de Responsabilidades por Nivel:
            </h4>
            <div className="space-y-2">
              {politica.responsabilidadesPorNivel.map((resp, idx) => (
                <div key={idx} className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">{resp.nivel}:</strong>{' '}
                    <span className="text-slate-300">{resp.responsabilidad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Pie */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Sistema de Gestión de Seguridad y Salud en el Trabajo · Frikaz S.A.S.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
          >
            Volver al Videojuego
          </button>
        </div>

      </div>
    </div>
  );
};
