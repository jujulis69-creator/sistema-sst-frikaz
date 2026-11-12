import React, { useState, useMemo } from 'react';
import {
  Obligacion,
  Norm,
  EstadoCumplimientoObligacion,
  EstadoAplicabilidad,
} from '../types';
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Download,
  AlertTriangle,
  FolderLock,
  RefreshCw,
} from 'lucide-react';
import { getActivityStatus } from '../services/complianceEngine';
import { exportObligacionesCsv } from '../services/exportService';

interface ObligacionesViewProps {
  obligaciones: Obligacion[];
  norms: Norm[];
  onAddObligacion: () => void;
  onEditObligacion: (obligacion: Obligacion) => void;
  onDeleteObligacion: (id: string) => void;
  onNavigateToEvidence?: (obligacionId: string) => void;
  onNavigateToPhva?: (obligacionId: string) => void;
  onCreateCorrectiveAction?: (obligacionId: string) => void;
}

export const ObligacionesView: React.FC<ObligacionesViewProps> = ({
  obligaciones,
  norms,
  onAddObligacion,
  onEditObligacion,
  onDeleteObligacion,
  onNavigateToEvidence,
  onNavigateToPhva,
  onCreateCorrectiveAction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | EstadoCumplimientoObligacion>('TODOS');
  const [aplicabilidadFilter, setAplicabilidadFilter] = useState<'TODOS' | EstadoAplicabilidad>('TODOS');

  const normMap = useMemo(() => {
    const map = new Map<string, Norm>();
    norms.forEach((n) => map.set(n.id, n));
    return map;
  }, [norms]);

  const filtered = useMemo(() => {
    return obligaciones.filter((o) => {
      const norm = normMap.get(o.normaId);
      const matchSearch =
        o.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.descripcionObligacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.actividadNecesaria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (norm && norm.numero.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (norm && norm.nombreOficial.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'TODOS' || o.estadoCumplimiento === statusFilter;
      const matchAplic = aplicabilidadFilter === 'TODOS' || o.estadoAplicabilidad === aplicabilidadFilter;

      return matchSearch && matchStatus && matchAplic;
    });
  }, [obligaciones, searchTerm, statusFilter, aplicabilidadFilter, normMap]);

  const getStatusBadge = (estado: EstadoCumplimientoObligacion) => {
    switch (estado) {
      case 'Cumple y tiene evidencia verificada':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Cumple y verificado
          </span>
        );
      case 'Cumple parcialmente':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800 border border-blue-200">
            Parcial
          </span>
        );
      case 'No cumple':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800 border border-red-200">
            <AlertCircle className="h-3 w-3" />
            No cumple
          </span>
        );
      case 'Pendiente de ejecución':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3" />
            Por ejecutar
          </span>
        );
      case 'Pendiente de verificación':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-800 border border-purple-200">
            Por verificar
          </span>
        );
      case 'No aplica con justificación':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            No aplica
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {estado}
          </span>
        );
    }
  };

  const getDeadlineBadge = (fechaLimite?: string, completado: boolean = false) => {
    const status = getActivityStatus(fechaLimite, completado);
    if (status.estado === 'Cumplida') {
      return (
        <span className="text-emerald-700 font-medium text-xs">
          Completada
        </span>
      );
    }
    if (status.estado === 'Vencida') {
      return (
        <span className="text-red-700 font-semibold text-xs flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {status.etiqueta}
        </span>
      );
    }
    if (status.estado === 'Proxima') {
      return (
        <span className="text-amber-700 font-semibold text-xs flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {status.etiqueta}
        </span>
      );
    }
    return (
      <span className="text-slate-500 text-xs">
        {status.etiqueta}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar obligación, norma, responsable..."
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
              <option value="TODOS">Todos los Estados</option>
              <option value="Cumple y tiene evidencia verificada">Cumple y verificado</option>
              <option value="Cumple parcialmente">Cumple parcialmente</option>
              <option value="No cumple">No cumple</option>
              <option value="Pendiente de ejecución">Pendiente ejecución</option>
              <option value="Pendiente de verificación">Pendiente verificación</option>
              <option value="No aplica con justificación">No aplica</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={aplicabilidadFilter}
              onChange={(e) => setAplicabilidadFilter(e.target.value as any)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-hidden bg-white w-full sm:w-auto"
            >
              <option value="TODOS">Cualquier Aplicabilidad</option>
              <option value="Aplicable">Solo Aplicables</option>
              <option value="No aplica con justificación">No aplica con justificación</option>
              <option value="Pendiente de evaluación">Pendiente evaluación</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportObligacionesCsv(obligaciones, norms)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onAddObligacion}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Obligación</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Norma Relacionada</th>
                <th className="px-4 py-3">Artículo / Mandato</th>
                <th className="px-4 py-3">Actividad Exigida</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3">Fecha Límite</th>
                <th className="px-4 py-3">Estado Cumplimiento</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron obligaciones con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filtered.map((obl) => {
                  const norm = normMap.get(obl.normaId);
                  const isCompleted = obl.estadoCumplimiento === 'Cumple y tiene evidencia verificada';

                  return (
                    <tr key={obl.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {obl.codigo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {norm ? (
                          <div className="font-semibold text-slate-800">
                            {norm.tipoDisposicion} {norm.numero}
                            <span className="ml-1 text-[11px] text-slate-500">({norm.area})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Sin norma</span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-slate-900">{obl.articuloNumeral}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {obl.descripcionObligacion}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs text-slate-700 line-clamp-2">
                        {obl.actividadNecesaria}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {obl.responsable}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono">
                        <div>{obl.fechaLimite || 'Permanente'}</div>
                        <div>{getDeadlineBadge(obl.fechaLimite, isCompleted)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(obl.estadoCumplimiento)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {onNavigateToPhva && (
                            <button
                              onClick={() => onNavigateToPhva(obl.id)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-emerald-700"
                              title="Gestionar en Ciclo PHVA"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                          {onNavigateToEvidence && (
                            <button
                              onClick={() => onNavigateToEvidence(obl.id)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                              title="Ver / Adjuntar evidencias"
                            >
                              <FolderLock className="h-4 w-4" />
                            </button>
                          )}
                          {onCreateCorrectiveAction && obl.estadoCumplimiento === 'No cumple' && (
                            <button
                              onClick={() => onCreateCorrectiveAction(obl.id)}
                              className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                              title="Abrir Acción Correctiva"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditObligacion(obl)}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            title="Editar obligación"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar la obligación ${obl.codigo}?`)) {
                                onDeleteObligacion(obl.id);
                              }
                            }}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
