// ============================================================================
// PESTAÑA 2: PARTES INTERESADAS INTERNAS - FRIKAZ S.A.S.
// Gerente · Operarios · Conductor
// ============================================================================

import React from 'react';
import { ParteInteresada, CargoChecklistInterno } from '../../../types/partesInteresadas';
import {
  Crown,
  Users,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Clock,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';

interface PartesInternasTabProps {
  partes: ParteInteresada[];
  onSeleccionarCargoChecklist?: (cargo: CargoChecklistInterno) => void;
}

export const PartesInternasTab: React.FC<PartesInternasTabProps> = ({
  partes,
  onSeleccionarCargoChecklist,
}) => {
  const partesInternas = partes.filter((p) => p.clasificacion === 'interna');

  const getCargoKey = (nombre: string): CargoChecklistInterno => {
    const n = nombre.toLowerCase();
    if (n.includes('gerente')) return 'gerente';
    if (n.includes('operario')) return 'operarios';
    return 'conductor';
  };

  const getIconoCargo = (cargo: CargoChecklistInterno) => {
    switch (cargo) {
      case 'gerente':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'operarios':
        return <Users className="h-5 w-5 text-indigo-600" />;
      case 'conductor':
        return <Truck className="h-5 w-5 text-sky-600" />;
    }
  };

  const getBadgeColor = (cargo: CargoChecklistInterno) => {
    switch (cargo) {
      case 'gerente':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'operarios':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'conductor':
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Kicker explicativo */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-md border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-purple-300 font-bold text-xs uppercase tracking-wider block">
              Sección A · Estructura Organizacional Frikaz S.A.S.
            </span>
            <h2 className="text-xl font-black text-white">
              Partes Interesadas Internas del SG-SST
            </h2>
            <p className="text-xs text-purple-200/80 max-w-2xl leading-relaxed">
              Identificación y caracterización de las necesidades, expectativas y riesgos laborales prioritarios para los roles clave de la empresa: Alta Dirección, Operarios de Planta de Fritura y Conductor de Distribución.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl border border-white/10 shrink-0">
            <ClipboardList className="h-5 w-5 text-purple-300" />
            <div className="text-left text-xs">
              <span className="block font-bold text-white">3 Roles Internos</span>
              <span className="text-[10px] text-purple-200">Con Checklists de SST Vinculados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid con las 3 tarjetas ejecutivas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {partesInternas.map((parte) => {
          const cargoKey = getCargoKey(parte.nombre);
          return (
            <div
              key={parte.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-4">
                {/* Header de tarjeta */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                      {getIconoCargo(cargoKey)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {parte.nombre}
                      </h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBadgeColor(cargoKey)}`}>
                        Parte Interesada Interna
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {parte.descripcion}
                </p>

                {/* Necesidades y expectativas */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-[11px] text-slate-900 block">
                    Necesidades y Expectativas en SST:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {parte.necesidadesExpectativas}
                  </p>
                </div>

                {/* Peligros y Afectaciones */}
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>Peligros y Situaciones Críticas:</span>
                    </div>
                    <p className="text-[11px] text-amber-950 leading-relaxed">
                      {parte.peligrosSituaciones}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/70 space-y-1">
                    <span className="font-bold text-[11px] text-rose-900 block">
                      Posibles Afectaciones:
                    </span>
                    <p className="text-[11px] text-rose-950 leading-relaxed">
                      {parte.posiblesAfectaciones}
                    </p>
                  </div>
                </div>

                {/* Medidas de control y seguimiento */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[11px]">
                    <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Medidas de Prevención y Control:</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    {parte.medidasPrevencionControl}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span><strong>Seguimiento:</strong> {parte.seguimiento}</span>
                </div>
              </div>

              {/* Botón de acción al checklist de este cargo */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSeleccionarCargoChecklist && onSeleccionarCargoChecklist(cargoKey)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>Evaluar Checklist de este Cargo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
