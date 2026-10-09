import React, { useState, useMemo } from 'react';
import { Norm, Obligacion, AreaNormativa, EstadoVigencia } from '../types';
import {
  Search,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  FileText,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Eye,
  X,
  Layers,
  Shield,
  Leaf,
} from 'lucide-react';
import { exportMatrizNormativaCsv } from '../services/exportService';

interface NormativaMatrixViewProps {
  norms: Norm[];
  obligaciones: Obligacion[];
  onAddNorm: () => void;
  onEditNorm: (norm: Norm) => void;
  onDeleteNorm: (id: string) => void;
  onAddObligacionForNorm: (normId: string) => void;
}

export const NormativaMatrixView: React.FC<NormativaMatrixViewProps> = ({
  norms,
  obligaciones,
  onAddNorm,
  onEditNorm,
  onDeleteNorm,
  onAddObligacionForNorm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState<'TODAS' | AreaNormativa>('TODAS');
  const [vigenciaFilter, setVigenciaFilter] = useState<'TODAS' | EstadoVigencia>('TODAS');
  const [selectedNorm, setSelectedNorm] = useState<Norm | null>(null);

  const filteredNorms = useMemo(() => {
    return norms.filter((norm) => {
      const matchSearch =
        norm.codigoIdentificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        norm.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        norm.nombreOficial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        norm.entidadEmisora.toLowerCase().includes(searchTerm.toLowerCase()) ||
        norm.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        norm.articulosAplicables.toLowerCase().includes(searchTerm.toLowerCase());

      const matchArea = areaFilter === 'TODAS' || norm.area === areaFilter;
      const matchVigencia = vigenciaFilter === 'TODAS' || norm.estadoVigencia === vigenciaFilter;

      return matchSearch && matchArea && matchVigencia;
    });
  }, [norms, searchTerm, areaFilter, vigenciaFilter]);

  const getVigenciaBadge = (estado: EstadoVigencia) => {
    switch (estado) {
      case 'Vigente verificada':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Vigente
          </span>
        );
      case 'Pendiente de validación normativa':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3" />
            Por validar
          </span>
        );
      case 'Modificada':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800 border border-blue-200">
            Modificada
          </span>
        );
      case 'Derogada':
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800 border border-red-200">
            Derogada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            {estado}
          </span>
        );
    }
  };

  const getAreaBadge = (area: AreaNormativa) => {
    if (area === 'SST') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800">
          <Shield className="h-3.5 w-3.5 text-emerald-700" />
          SST
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <Leaf className="h-3.5 w-3.5 text-emerald-600" />
        Ambiental
      </span>
    );
  };

  const normObligaciones = useMemo(() => {
    if (!selectedNorm) return [];
    return obligaciones.filter((o) => o.normaId === selectedNorm.id);
  }, [obligaciones, selectedNorm]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          {/* Live Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar norma, número, entidad, artículo..."
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Area Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value as any)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-hidden bg-white w-full sm:w-auto"
            >
              <option value="TODAS">Todas las Áreas</option>
              <option value="SST">Solo SST</option>
              <option value="Ambiental">Solo Ambiental</option>
            </select>
          </div>

          {/* Vigencia Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={vigenciaFilter}
              onChange={(e) => setVigenciaFilter(e.target.value as any)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-600 focus:outline-hidden bg-white w-full sm:w-auto"
            >
              <option value="TODAS">Cualquier Vigencia</option>
              <option value="Vigente verificada">Vigente verificada</option>
              <option value="Pendiente de validación normativa">Pendiente de validación</option>
              <option value="Modificada">Modificada</option>
              <option value="Derogada">Derogada</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportMatrizNormativaCsv(norms, areaFilter === 'TODAS' ? undefined : areaFilter)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onAddNorm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar Norma</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Área</th>
                <th className="px-4 py-3">Disposición Legal</th>
                <th className="px-4 py-3">Entidad Emisora</th>
                <th className="px-4 py-3">Artículos Aplicables</th>
                <th className="px-4 py-3">Vigencia</th>
                <th className="px-4 py-3">Obligaciones</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNorms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron normas con los filtros especificados.
                  </td>
                </tr>
              ) : (
                filteredNorms.map((norm) => {
                  const obligCount = obligaciones.filter((o) => o.normaId === norm.id).length;
                  return (
                    <tr
                      key={norm.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedNorm(norm)}
                    >
                      <td className="px-4 py-3.5 font-mono font-semibold text-slate-900">
                        {norm.codigoIdentificador}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getAreaBadge(norm.area)}
                      </td>
                      <td className="px-4 py-3.5 max-w-sm">
                        <div className="font-semibold text-slate-900">
                          {norm.tipoDisposicion} {norm.numero} de {norm.anio}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {norm.nombreOficial}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                        {norm.entidadEmisora}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                        {norm.articulosAplicables || 'General'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getVigenciaBadge(norm.estadoVigencia)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono tabular-nums font-semibold text-slate-800">
                          {obligCount}
                        </span>
                        <span className="text-slate-500 ml-1">obl.</span>
                      </td>
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedNorm(norm)}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            title="Ver detalles completos"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onEditNorm(norm)}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                            title="Editar norma"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `¿Eliminar la norma ${norm.codigoIdentificador} y sus obligaciones asociadas?`
                                )
                              ) {
                                onDeleteNorm(norm.id);
                              }
                            }}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                            title="Eliminar norma"
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

      {/* Slide-over / Modal Details Drawer */}
      {selectedNorm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white shadow-2xl overflow-y-auto flex flex-col h-full border-l border-slate-200">
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-emerald-800">
                  {selectedNorm.codigoIdentificador}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-semibold text-slate-600">
                  {selectedNorm.area}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditNorm(selectedNorm)}
                  className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => setSelectedNorm(null)}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1 text-xs text-slate-700">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Denominación Oficial
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedNorm.tipoDisposicion} {selectedNorm.numero} de {selectedNorm.anio}
                </h3>
                <p className="mt-1 text-slate-600 leading-relaxed font-medium">
                  {selectedNorm.nombreOficial}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3.5 border border-slate-200">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">Entidad Emisora:</span>
                  <p className="font-bold text-slate-900">{selectedNorm.entidadEmisora}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">Jurisdicción:</span>
                  <p className="font-bold text-slate-900">{selectedNorm.jurisdiccion}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">Estado de Vigencia:</span>
                  <p className="mt-0.5">{getVigenciaBadge(selectedNorm.estadoVigencia)}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">Última Consulta Oficial:</span>
                  <p className="font-mono text-slate-800">{selectedNorm.fechaUltimaConsulta}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                  1. ¿Qué regula la disposición? (Descripción)
                </h4>
                <p className="mt-1.5 leading-relaxed text-slate-600">
                  {selectedNorm.descripcion}
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50/60 border border-emerald-200 p-3.5">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-700" />
                  2. Importancia Específica para Frikaz S.A.S.
                </h4>
                <p className="mt-1.5 leading-relaxed text-emerald-900">
                  {selectedNorm.importanciaFrikaz}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50/60 border border-blue-200 p-3.5">
                <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-700" />
                  3. Aplicabilidad Concreta (¿Qué debe hacer la empresa?)
                </h4>
                <p className="mt-1.5 leading-relaxed text-blue-900">
                  {selectedNorm.aplicabilidadConcreta}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Artículos Aplicables
                  </span>
                  <p className="mt-1 text-slate-700">{selectedNorm.articulosAplicables || 'Todos'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Alcance
                  </span>
                  <p className="mt-1 text-slate-700">{selectedNorm.alcance}</p>
                </div>
              </div>

              {selectedNorm.enlaceFuente && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Fuente Oficial
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-slate-800">{selectedNorm.fuenteOficial}</span>
                    <a
                      href={selectedNorm.enlaceFuente}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Consultar texto oficial
                    </a>
                  </div>
                </div>
              )}

              {/* Obligations derived from this norm */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900">
                    Obligaciones Derivadas ({normObligaciones.length})
                  </h4>
                  <button
                    onClick={() => {
                      onAddObligacionForNorm(selectedNorm.id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    + Crear Obligación
                  </button>
                </div>

                {normObligaciones.length === 0 ? (
                  <p className="text-slate-500 italic">
                    Aún no se han registrado obligaciones específicas para esta norma.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {normObligaciones.map((o) => (
                      <div
                        key={o.id}
                        className="rounded-lg border border-slate-200 p-3 bg-white hover:border-slate-300"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">{o.codigo}</span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {o.estadoCumplimiento}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-700 line-clamp-2">
                          {o.descripcionObligacion}
                        </p>
                        <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                          <span>Responsable: {o.responsable}</span>
                          <span>Límite: {o.fechaLimite || 'Permanente'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
