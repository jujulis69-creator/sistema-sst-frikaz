import React, { useState, useMemo } from 'react';
import {
  Evidencia,
  Norm,
  Obligacion,
  EstadoRevisionEvidencia,
  TipoArchivo,
} from '../types';
import {
  Search,
  Plus,
  Filter,
  FileText,
  Download,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  FileSpreadsheet,
  Image,
  ExternalLink,
} from 'lucide-react';
import { getDaysDifference } from '../services/complianceEngine';
import { exportEvidenciasFaltantesCsv } from '../services/exportService';

interface EvidenciasViewProps {
  evidencias: Evidencia[];
  norms: Norm[];
  obligaciones: Obligacion[];
  onAddEvidencia: () => void;
  onEditEvidencia: (evidencia: Evidencia) => void;
  onDeleteEvidencia: (id: string) => void;
}

export const EvidenciasView: React.FC<EvidenciasViewProps> = ({
  evidencias,
  norms,
  obligaciones,
  onAddEvidencia,
  onEditEvidencia,
  onDeleteEvidencia,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | EstadoRevisionEvidencia>('TODOS');
  const [tipoFilter, setTipoFilter] = useState<'TODOS' | TipoArchivo>('TODOS');

  const normMap = useMemo(() => {
    const map = new Map<string, Norm>();
    norms.forEach((n) => map.set(n.id, n));
    return map;
  }, [norms]);

  const obligMap = useMemo(() => {
    const map = new Map<string, Obligacion>();
    obligaciones.forEach((o) => map.set(o.id, o));
    return map;
  }, [obligaciones]);

  const filtered = useMemo(() => {
    return evidencias.filter((e) => {
      const oblig = obligMap.get(e.obligacionId);
      const matchSearch =
        e.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (oblig && oblig.codigo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'TODOS' || e.estadoRevision === statusFilter;
      const matchTipo = tipoFilter === 'TODOS' || e.tipoArchivo === tipoFilter;

      return matchSearch && matchStatus && matchTipo;
    });
  }, [evidencias, searchTerm, statusFilter, tipoFilter, obligMap]);

  const handleDownloadFile = (evi: Evidencia) => {
    if (evi.archivoDataUrl) {
      const link = document.createElement('a');
      link.href = evi.archivoDataUrl;
      link.download = evi.archivoNombre || `${evi.codigo}.pdf`;
      link.click();
    } else {
      // Simulate/trigger download with a generated text summary if no binary uploaded
      const summaryText = `EVIDENCIA DOCUMENTAL - FRIKAZ S.A.S.\nCódigo: ${evi.codigo}\nNombre: ${evi.nombre}\nDescripción: ${evi.descripcion}\nEmisión: ${evi.fechaEmision}\nVencimiento: ${evi.fechaVencimiento || 'No aplica'}\nResponsable: ${evi.responsable}\nUbicación: ${evi.ubicacionOEnlace}`;
      const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${evi.codigo}_Ficha_Evidencia.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusBadge = (estado: EstadoRevisionEvidencia, fechaVenc?: string) => {
    if (fechaVenc) {
      const diff = getDaysDifference(fechaVenc);
      if (diff !== null && diff < 0) {
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800 border border-red-200">
            <AlertTriangle className="h-3 w-3" />
            Vencida
          </span>
        );
      }
    }

    switch (estado) {
      case 'Verificada y suficiente':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Verificada y suficiente
          </span>
        );
      case 'Pendiente de revisión':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3" />
            Por revisar
          </span>
        );
      case 'Rechazada / Insuficiente':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800 border border-red-200">
            Insuficiente
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

  const getFileIcon = (tipo: TipoArchivo) => {
    switch (tipo) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'Excel':
        return <FileSpreadsheet className="h-5 w-5 text-emerald-700" />;
      case 'Imagen':
        return <Image className="h-5 w-5 text-blue-600" />;
      default:
        return <FolderLock className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar evidencia, código, responsable..."
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
              <option value="Verificada y suficiente">Verificada y suficiente</option>
              <option value="Pendiente de revisión">Pendiente de revisión</option>
              <option value="Rechazada / Insuficiente">Rechazada / Insuficiente</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value as any)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-hidden bg-white w-full sm:w-auto"
            >
              <option value="TODOS">Cualquier Formato</option>
              <option value="PDF">PDF</option>
              <option value="Excel">Excel</option>
              <option value="Word">Word</option>
              <option value="Imagen">Imagen</option>
              <option value="Registro Físico / Digital">Registro Físico</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportEvidenciasFaltantesCsv(obligaciones, evidencias, norms)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
            title="Descargar reporte de obligaciones que aún carecen de soporte documental verificado"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
            <span>Evidencias Faltantes CSV</span>
          </button>
          <button
            onClick={onAddEvidencia}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Cargar Evidencia</span>
          </button>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No se encontraron documentos de evidencia con los filtros seleccionados.
          </div>
        ) : (
          filtered.map((evi) => {
            const oblig = obligMap.get(evi.obligacionId);
            const norm = normMap.get(evi.normaId);

            return (
              <div
                key={evi.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-slate-100 p-2">{getFileIcon(evi.tipoArchivo)}</div>
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900 block">
                          {evi.codigo}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">
                          {evi.tipoArchivo}
                        </span>
                      </div>
                    </div>
                    <div>{getStatusBadge(evi.estadoRevision, evi.fechaVencimiento)}</div>
                  </div>

                  <h4 className="mt-3 font-bold text-slate-900 text-xs line-clamp-2 leading-snug">
                    {evi.nombre}
                  </h4>

                  <p className="mt-1.5 text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {evi.descripcion}
                  </p>

                  <div className="mt-3 space-y-1 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-600 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="font-medium">Obligación:</span>
                      <span className="font-mono text-slate-800 font-semibold truncate max-w-[150px]">
                        {oblig?.codigo || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Norma:</span>
                      <span className="text-slate-800 truncate max-w-[150px]">
                        {norm ? `${norm.tipoDisposicion} ${norm.numero}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Fecha Emisión:</span>
                      <span className="font-mono text-slate-800">{evi.fechaEmision}</span>
                    </div>
                    {evi.fechaVencimiento && (
                      <div className="flex justify-between text-amber-900 font-medium">
                        <span>Vencimiento:</span>
                        <span className="font-mono">{evi.fechaVencimiento}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Responsable:</span>
                      <span className="text-slate-800 truncate max-w-[140px]">{evi.responsable}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleDownloadFile(evi)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Descargar Archivo</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditEvidencia(evi)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la evidencia ${evi.codigo}?`)) {
                          onDeleteEvidencia(evi.id);
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
