import React, { useState, useMemo } from 'react';
import { AlertaItem } from '../types';
import {
  Bell,
  AlertTriangle,
  Clock,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  FolderLock,
  Filter,
  Shield,
  Leaf,
  Info,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface AlertasViewProps {
  alertas: AlertaItem[];
  onNavigateTab: (tab: ActiveTab) => void;
}

export const AlertasView: React.FC<AlertasViewProps> = ({ alertas, onNavigateTab }) => {
  const [severityFilter, setSeverityFilter] = useState<'TODAS' | 'urgente' | 'advertencia' | 'informativa'>('TODAS');
  const [areaFilter, setAreaFilter] = useState<'TODAS' | 'SST' | 'Ambiental'>('TODAS');

  const filtered = useMemo(() => {
    return alertas.filter((a) => {
      const matchSev = severityFilter === 'TODAS' || a.severidad === severityFilter;
      const matchArea = areaFilter === 'TODAS' || a.area === areaFilter;
      return matchSev && matchArea;
    });
  }, [alertas, severityFilter, areaFilter]);

  const urgentesCount = alertas.filter((a) => a.severidad === 'urgente').length;
  const advertenciasCount = alertas.filter((a) => a.severidad === 'advertencia').length;
  const informativasCount = alertas.filter((a) => a.severidad === 'informativa').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Centro de Notificaciones y Alertas Preventivas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Detección automática de vencimientos legales, evidencias faltantes y acciones correctivas atrasadas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800">
              {urgentesCount} Urgentes
            </span>
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
              {advertenciasCount} Advertencias
            </span>
            <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
              {informativasCount} Informativas
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold">Severidad:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-hidden bg-white"
            >
              <option value="TODAS">Todas las severidades</option>
              <option value="urgente">Solo Urgentes (Rojas)</option>
              <option value="advertencia">Solo Advertencias (Amarillas)</option>
              <option value="informativa">Solo Informativas (Azules)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Área:</span>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value as any)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-hidden bg-white"
            >
              <option value="TODAS">SST y Ambiental</option>
              <option value="SST">Solo SST</option>
              <option value="Ambiental">Solo Ambiental</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
            <p className="font-semibold text-slate-800">No hay alertas activas en esta categoría.</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Todas las obligaciones y actividades programadas se encuentran al día.
            </p>
          </div>
        ) : (
          filtered.map((alerta) => {
            const isUrgent = alerta.severidad === 'urgente';
            const isWarning = alerta.severidad === 'advertencia';

            return (
              <div
                key={alerta.id}
                className={`rounded-xl border p-4 shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs ${
                  isUrgent
                    ? 'border-red-200 bg-red-50/60'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/60'
                    : 'border-blue-200 bg-blue-50/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-lg p-2 shrink-0 ${
                      isUrgent
                        ? 'bg-red-100 text-red-700'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isUrgent ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : isWarning ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <Info className="h-5 w-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-xs px-2 py-0.5 font-bold uppercase text-[10px] ${
                          isUrgent
                            ? 'bg-red-700 text-white'
                            : isWarning
                            ? 'bg-amber-600 text-white'
                            : 'bg-blue-700 text-white'
                        }`}
                      >
                        {alerta.severidad}
                      </span>
                      <span className="font-semibold text-slate-700">{alerta.referencia}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-medium">Área: {alerta.area}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{alerta.titulo}</h4>

                    <p className="text-slate-700 leading-relaxed max-w-3xl">
                      {alerta.descripcion}
                    </p>

                    {alerta.fechaRelevante && (
                      <p className="text-[11px] font-mono text-slate-500 pt-1">
                        Fecha de referencia: {alerta.fechaRelevante}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:self-center shrink-0">
                  {alerta.tipo.includes('OBLIGACION') || alerta.tipo.includes('ACTIVIDAD') ? (
                    <button
                      onClick={() => onNavigateTab('obligaciones')}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs"
                    >
                      Gestionar Obligación
                    </button>
                  ) : alerta.tipo.includes('ACCION') ? (
                    <button
                      onClick={() => onNavigateTab('acciones')}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs"
                    >
                      Ver Acción Correctiva
                    </button>
                  ) : alerta.tipo.includes('EVIDENCIA') ? (
                    <button
                      onClick={() => onNavigateTab('evidencias')}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs"
                    >
                      Cargar Evidencia
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateTab('matriz')}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs"
                    >
                      Consultar Matriz
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clarification Box according to Section 12 & 16 */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-1.5">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-slate-500" />
          Protocolo de Notificaciones y Arquitectura de Costos
        </h4>
        <p>
          Las alertas mostradas en este panel se calculan y actualizan automáticamente en tiempo real
          comparando la fecha de cada obligación con el reloj del sistema sin generar costos de operación.
        </p>
        <p>
          Para habilitar notificaciones push por correo electrónico a los correos del Líder de SST y Gerencia,
          se requiere integrar una API de mensajería empresarial (como SendGrid, Resend o AWS SES) con su respectiva
          cuenta y clave API verificada. El sistema no simula envíos ficticios para preservar la integridad operativa.
        </p>
      </div>
    </div>
  );
};
