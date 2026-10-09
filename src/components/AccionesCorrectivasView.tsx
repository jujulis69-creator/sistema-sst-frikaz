import React, { useState, useMemo } from 'react';
import {
  AccionCorrectiva,
  Obligacion,
  Norm,
  EstadoAccionCorrectiva,
} from '../types';
import {
  Search,
  Plus,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { getActivityStatus } from '../services/complianceEngine';
import { exportAccionesCorrectivasCsv } from '../services/exportService';

interface AccionesCorrectivasViewProps {
  acciones: AccionCorrectiva[];
  obligaciones: Obligacion[];
  norms: Norm[];
  onAddAccion: () => void;
  onEditAccion: (accion: AccionCorrectiva) => void;
  onDeleteAccion: (id: string) => void;
}

export const AccionesCorrectivasView: React.FC<AccionesCorrectivasViewProps> = ({
  acciones,
  obligaciones,
  norms,
  onAddAccion,
  onEditAccion,
  onDeleteAccion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODAS' | EstadoAccionCorrectiva>('TODAS');

  const obligMap = useMemo(() => {
    const map = new Map<string, Obligacion>();
    obligaciones.forEach((o) => map.set(o.id, o));
    return map;
  }, [obligaciones]);

  const filtered = useMemo(() => {
    return acciones.filter((a) => {
      const oblig = obligMap.get(a.obligacionId);
      const matchSearch =
        a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.hallazgo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.causaIdentificada.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.accionPropuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (oblig && oblig.codigo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'TODAS' || a.estado === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [acciones, searchTerm, statusFilter, obligMap]);

  const getStatusBadge = (estado: EstadoAccionCorrectiva, fechaLimite: string) => {
    const isClosed = estado === 'Verificada y cerrada';
    const status = getActivityStatus(fechaLimite, isClosed);

    if (isClosed) {
      return (
        <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3" />
          Verificada y cerrada
        </span>
      );
    }

    if (status.estado === 'Vencida' || estado === 'Vencida') {
      return (
        <span className="inline-flex items-center gap-1 rounded-sm bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800 border border-red-200">
          <AlertTriangle className="h-3 w-3" />
          Vencida ({status.etiqueta})
        </span>
      );
    }

    if (estado === 'En ejecución') {
      return (
        <span className="inline-flex items-center gap-1 rounded-sm bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800 border border-blue-200">
          <Clock className="h-3 w-3" />
          En ejecución
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
        Abierta
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar acción, hallazgo, causa raíz..."
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-hidden bg-white w-full sm:w-auto"
            >
              <option value="TODAS">Todos los Estados</option>
              <option value="Abierta">Abierta</option>
              <option value="En ejecución">En ejecución</option>
              <option value="Verificada y cerrada">Verificada y cerrada</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportAccionesCorrectivasCsv(acciones, obligaciones)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onAddAccion}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Acción Correctiva</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No se encontraron acciones correctivas con los filtros seleccionados.
          </div>
        ) : (
          filtered.map((ac) => {
            const oblig = obligMap.get(ac.obligacionId);

            return (
              <div
                key={ac.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{ac.codigo}</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-semibold text-slate-700">
                      Obligación: {oblig?.codigo || 'N/A'}
                    </span>
                  </div>
                  <div>{getStatusBadge(ac.estado, ac.fechaLimite)}</div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 block">
                      Hallazgo / Incumplimiento:
                    </span>
                    <p className="mt-1 text-slate-800 font-medium leading-relaxed">{ac.hallazgo}</p>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mt-2.5">
                      Causa Raíz Identificada:
                    </span>
                    <p className="mt-1 text-slate-600 leading-relaxed">{ac.causaIdentificada}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Acción Correctiva Propuesta:
                    </span>
                    <p className="mt-1 text-slate-800 font-medium leading-relaxed">
                      {ac.accionPropuesta}
                    </p>

                    {ac.evidenciaEjecucion && (
                      <div className="mt-2 text-slate-600">
                        <span className="font-semibold text-slate-700">Evidencia de Ejecución: </span>
                        <span>{ac.evidenciaEjecucion}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-slate-500">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                    <span>
                      <strong>Responsable:</strong> {ac.responsable}
                    </span>
                    <span>·</span>
                    <span>
                      <strong>Apertura:</strong> {ac.fechaApertura}
                    </span>
                    <span>·</span>
                    <span>
                      <strong>Límite:</strong> {ac.fechaLimite}
                    </span>
                    {ac.fechaCierre && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-800 font-semibold">
                          <strong>Cierre:</strong> {ac.fechaCierre} ({ac.resultadoVerificacionEficacia})
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditAccion(ac)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Editar acción correctiva"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la acción correctiva ${ac.codigo}?`)) {
                          onDeleteAccion(ac.id);
                        }
                      }}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
