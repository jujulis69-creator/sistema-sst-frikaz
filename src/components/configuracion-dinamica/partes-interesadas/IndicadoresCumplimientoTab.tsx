// ============================================================================
// PESTAÑA 5: INDICADORES DE CUMPLIMIENTO - FRIKAZ S.A.S.
// Panel analítico automatizado de necesidades en SST
// ============================================================================

import React from 'react';
import {
  ItemChecklistNecesidad,
  CargoChecklistInterno,
} from '../../../types/partesInteresadas';
import { calcularIndicadoresPartesInteresadas } from '../../../services/partesInteresadasService';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Crown,
  Users,
  Truck,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface IndicadoresCumplimientoTabProps {
  items: ItemChecklistNecesidad[];
  onSeleccionarCargoChecklist?: (cargo: CargoChecklistInterno) => void;
}

export const IndicadoresCumplimientoTab: React.FC<IndicadoresCumplimientoTabProps> = ({
  items,
  onSeleccionarCargoChecklist,
}) => {
  const stats = calcularIndicadoresPartesInteresadas(items);

  const cargos: CargoChecklistInterno[] = ['gerente', 'operarios', 'conductor'];

  const getIconoCargo = (cargo: CargoChecklistInterno) => {
    switch (cargo) {
      case 'gerente':
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'operarios':
        return <Users className="h-4 w-4 text-indigo-600" />;
      case 'conductor':
        return <Truck className="h-4 w-4 text-sky-600" />;
    }
  };

  const necesidadesPendientes = items.filter((it) => it.estado === 'Pendiente');
  const necesidadesEnProceso = items.filter((it) => it.estado === 'En proceso');

  return (
    <div className="space-y-6">
      {/* Banner de resumen global */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md border border-slate-700/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-orange-400 font-extrabold text-xs uppercase tracking-wider block">
              Dashboard Analítico del SG-SST
            </span>
            <h2 className="text-2xl font-black text-white">
              Indicadores de Cumplimiento de Necesidades
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Métricas dinámicas de atención a las necesidades de las partes interesadas internas de Frikaz S.A.S. en Bosa. Se recalculan en tiempo real con cada cambio en el checklist.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-slate-900/60 border-4 border-orange-500">
              <span className="text-lg font-black font-mono text-white">
                {stats.porcentajeCumplimiento}%
              </span>
            </div>
            <div>
              <span className="block text-xs font-bold text-white uppercase tracking-wider">
                Cumplimiento Global
              </span>
              <span className="block text-[11px] text-slate-300 font-mono">
                {stats.cumplidas} de {stats.totalNecesidades} Necesidades Cerradas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Tarjetas KPI Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Identificadas
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
            {stats.totalNecesidades}
          </div>
          <span className="text-[11px] text-slate-400 block">
            Distribuidas en Gerente, Operarios y Conductor
          </span>
        </div>

        {/* KPI 2: Cumplidas */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              Necesidades Cumplidas
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono tabular-nums">
            {stats.cumplidas}
          </div>
          <span className="text-[11px] text-emerald-700 block font-medium">
            {stats.totalNecesidades > 0
              ? Math.round((stats.cumplidas / stats.totalNecesidades) * 100)
              : 0}
            % de efectividad verificada
          </span>
        </div>

        {/* KPI 3: En Proceso */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              En Proceso
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-700 font-mono tabular-nums">
            {stats.enProceso}
          </div>
          <span className="text-[11px] text-amber-700 block font-medium">
            Con acciones en ejecución o trámites
          </span>
        </div>

        {/* KPI 4: Pendientes */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">
              Pendientes
            </span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-700 font-mono tabular-nums">
            {stats.pendientes}
          </div>
          <span className="text-[11px] text-rose-700 block font-medium">
            Requieren atención o asignación urgente
          </span>
        </div>
      </div>

      {/* Desglose comparativo por cargo */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">
              Desglose de Cumplimiento por Puesto de Trabajo
            </h3>
            <p className="text-xs text-slate-500">
              Comportamiento individual de necesidades cerradas vs pendientes en Frikaz S.A.S.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            3 Cargos Clave
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cargos.map((cargoKey) => {
            const data = stats.porCargo[cargoKey];
            return (
              <div
                key={cargoKey}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                        {getIconoCargo(cargoKey)}
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">
                        {data.nombreCargo}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {data.porcentaje}%
                    </span>
                  </div>

                  {/* Barra de progreso por cargo */}
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${(data.cumplidas / data.total) * 100}%` }}
                      />
                      <div
                        className="bg-amber-400"
                        style={{ width: `${(data.enProceso / data.total) * 100}%` }}
                      />
                      <div
                        className="bg-rose-400"
                        style={{ width: `${(data.pendientes / data.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1">
                    <div className="p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-400 block">OK</span>
                      <strong className="text-emerald-700 text-xs">{data.cumplidas}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-400 block">PROCESO</span>
                      <strong className="text-amber-700 text-xs">{data.enProceso}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-400 block">PENDIENTE</span>
                      <strong className="text-rose-700 text-xs">{data.pendientes}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSeleccionarCargoChecklist && onSeleccionarCargoChecklist(cargoKey)}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-900 hover:text-white border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ver Checklist de este Cargo</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerta de necesidades pendientes y en proceso prioritarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Necesidades Pendientes */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <h4 className="font-extrabold text-xs text-rose-950 uppercase tracking-wide">
                Necesidades Pendientes ({necesidadesPendientes.length})
              </h4>
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
              Prioridad Alta
            </span>
          </div>

          <div className="space-y-2 text-xs max-h-64 overflow-y-auto pr-1">
            {necesidadesPendientes.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                ¡Excelente! No hay necesidades en estado pendiente.
              </div>
            ) : (
              necesidadesPendientes.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-rose-950 uppercase">
                      {item.cargo.toUpperCase()} · Ítem #{item.numero}
                    </span>
                    <span className="font-mono text-slate-500 text-[10px]">
                      {item.fechaVerificacion || 'Sin fecha'}
                    </span>
                  </div>
                  <p className="text-slate-800 font-semibold text-xs">{item.necesidad}</p>
                  <p className="text-slate-600 text-[11px] italic">
                    {item.observaciones || 'Requiere definir plan de acción inmediato.'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Necesidades En Proceso */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-wide">
                Necesidades en Proceso ({necesidadesEnProceso.length})
              </h4>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              En Seguimiento
            </span>
          </div>

          <div className="space-y-2 text-xs max-h-64 overflow-y-auto pr-1">
            {necesidadesEnProceso.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No hay necesidades en proceso actualmente.
              </div>
            ) : (
              necesidadesEnProceso.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-amber-950 uppercase">
                      {item.cargo.toUpperCase()} · Ítem #{item.numero}
                    </span>
                    <span className="font-mono text-slate-500 text-[10px]">
                      Resp: {item.responsable || 'Asignado'}
                    </span>
                  </div>
                  <p className="text-slate-800 font-semibold text-xs">{item.necesidad}</p>
                  <p className="text-slate-600 text-[11px]">
                    {item.observaciones || 'En trámite de soporte y cumplimiento.'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
