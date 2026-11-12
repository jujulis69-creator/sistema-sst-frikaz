// ============================================================================
// PESTAÑA 1: MATRIZ COMPLETA DE PARTES INTERESADAS - FRIKAZ S.A.S.
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  ParteInteresada,
  ClasificacionParteInteresada,
} from '../../../types/partesInteresadas';
import {
  saveStoredPartesInteresadas,
  exportarMatrizExcel,
} from '../../../services/partesInteresadasService';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Building2,
  Globe2,
  Filter,
  Check,
  X,
  AlertTriangle,
  Info,
  Shield,
  Layers,
} from 'lucide-react';

interface MatrizPartesInteresadasTabProps {
  partes: ParteInteresada[];
  onActualizarPartes: (nuevas: ParteInteresada[]) => void;
  onIrAChecklist?: () => void;
}

export const MatrizPartesInteresadasTab: React.FC<MatrizPartesInteresadasTabProps> = ({
  partes,
  onActualizarPartes,
  onIrAChecklist,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroClasificacion, setFiltroClasificacion] = useState<'todas' | ClasificacionParteInteresada>('todas');
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [parteEnEdicion, setParteEnEdicion] = useState<ParteInteresada | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Formulario temporal
  const [formNombre, setFormNombre] = useState('');
  const [formClasificacion, setFormClasificacion] = useState<ClasificacionParteInteresada>('interna');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formNecesidades, setFormNecesidades] = useState('');
  const [formPeligros, setFormPeligros] = useState('');
  const [formAfectaciones, setFormAfectaciones] = useState('');
  const [formMedidas, setFormMedidas] = useState('');
  const [formSeguimiento, setFormSeguimiento] = useState('');

  const partesFiltradas = useMemo(() => {
    return partes.filter((p) => {
      const matchClasif =
        filtroClasificacion === 'todas' || p.clasificacion === filtroClasificacion;
      const q = busqueda.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.necesidadesExpectativas.toLowerCase().includes(q) ||
        p.peligrosSituaciones.toLowerCase().includes(q) ||
        p.medidasPrevencionControl.toLowerCase().includes(q);
      return matchClasif && matchQuery;
    });
  }, [partes, filtroClasificacion, busqueda]);

  const abrirModalNuevo = () => {
    setParteEnEdicion(null);
    setFormNombre('');
    setFormClasificacion('interna');
    setFormDescripcion('');
    setFormNecesidades('');
    setFormPeligros('');
    setFormAfectaciones('');
    setFormMedidas('');
    setFormSeguimiento('');
    setModalEditarOpen(true);
  };

  const abrirModalEditar = (parte: ParteInteresada) => {
    setParteEnEdicion(parte);
    setFormNombre(parte.nombre);
    setFormClasificacion(parte.clasificacion);
    setFormDescripcion(parte.descripcion);
    setFormNecesidades(parte.necesidadesExpectativas);
    setFormPeligros(parte.peligrosSituaciones);
    setFormAfectaciones(parte.posiblesAfectaciones);
    setFormMedidas(parte.medidasPrevencionControl);
    setFormSeguimiento(parte.seguimiento);
    setModalEditarOpen(true);
  };

  const guardarParte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) return;

    let actualizadas: ParteInteresada[];
    const nowStr = new Date().toISOString().split('T')[0];

    if (parteEnEdicion) {
      actualizadas = partes.map((p) =>
        p.id === parteEnEdicion.id
          ? {
              ...p,
              nombre: formNombre.trim(),
              clasificacion: formClasificacion,
              descripcion: formDescripcion.trim(),
              necesidadesExpectativas: formNecesidades.trim(),
              peligrosSituaciones: formPeligros.trim(),
              posiblesAfectaciones: formAfectaciones.trim(),
              medidasPrevencionControl: formMedidas.trim(),
              seguimiento: formSeguimiento.trim(),
              fechaActualizacion: nowStr,
            }
          : p
      );
    } else {
      const nuevoId = `pi-${Date.now()}`;
      const nueva: ParteInteresada = {
        id: nuevoId,
        nombre: formNombre.trim(),
        clasificacion: formClasificacion,
        descripcion: formDescripcion.trim(),
        necesidadesExpectativas: formNecesidades.trim(),
        peligrosSituaciones: formPeligros.trim(),
        posiblesAfectaciones: formAfectaciones.trim(),
        medidasPrevencionControl: formMedidas.trim(),
        seguimiento: formSeguimiento.trim(),
        fechaActualizacion: nowStr,
      };
      actualizadas = [nueva, ...partes];
    }

    onActualizarPartes(actualizadas);
    saveStoredPartesInteresadas(actualizadas);
    setModalEditarOpen(false);
  };

  const eliminarParte = (id: string, nombre: string) => {
    if (confirm(`¿Está seguro de eliminar la parte interesada "${nombre}"?`)) {
      const actualizadas = partes.filter((p) => p.id !== id);
      onActualizarPartes(actualizadas);
      saveStoredPartesInteresadas(actualizadas);
    }
  };

  const handleExportarExcel = async () => {
    try {
      setIsExporting(true);
      await exportarMatrizExcel(partes);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Barra de control superior */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, peligro, necesidad o medida..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setFiltroClasificacion('todas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filtroClasificacion === 'todas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({partes.length})
            </button>
            <button
              onClick={() => setFiltroClasificacion('interna')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filtroClasificacion === 'interna'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              Internas ({partes.filter((p) => p.clasificacion === 'interna').length})
            </button>
            <button
              onClick={() => setFiltroClasificacion('externa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filtroClasificacion === 'externa'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              Externas ({partes.filter((p) => p.clasificacion === 'externa').length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportarExcel}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Descargar matriz en formato Excel"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{isExporting ? 'Generando...' : 'Descargar Excel'}</span>
          </button>

          <button
            onClick={abrirModalNuevo}
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Parte Interesada</span>
          </button>
        </div>
      </div>

      {/* Tabla interactiva con las 8 columnas oficiales */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-bold divide-x divide-slate-800">
                <th className="py-3.5 px-4 w-44">Parte Interesada</th>
                <th className="py-3.5 px-3 w-28 text-center">Clasificación</th>
                <th className="py-3.5 px-4 w-52">Descripción</th>
                <th className="py-3.5 px-4 w-56">Necesidades y Expectativas</th>
                <th className="py-3.5 px-4 w-56">Peligros / Situaciones</th>
                <th className="py-3.5 px-4 w-52">Posibles Afectaciones</th>
                <th className="py-3.5 px-4 w-60">Medidas de Prevención y Control</th>
                <th className="py-3.5 px-4 w-44">Seguimiento</th>
                <th className="py-3.5 px-3 w-20 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {partesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                    No se encontraron partes interesadas con el criterio de búsqueda seleccionado.
                  </td>
                </tr>
              ) : (
                partesFiltradas.map((parte) => (
                  <tr
                    key={parte.id}
                    className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-100 group"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 align-top">
                      <div className="flex items-start gap-1.5">
                        {parte.clasificacion === 'interna' ? (
                          <Building2 className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                        ) : (
                          <Globe2 className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
                        )}
                        <span>{parte.nombre}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                        Act: {parte.fechaActualizacion}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          parte.clasificacion === 'interna'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-sky-100 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {parte.clasificacion}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-relaxed align-top">
                      {parte.descripcion}
                    </td>
                    <td className="py-3 px-4 text-slate-700 leading-relaxed align-top font-medium">
                      {parte.necesidadesExpectativas}
                    </td>
                    <td className="py-3 px-4 text-amber-900 leading-relaxed align-top bg-amber-50/30">
                      <div className="flex items-start gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{parte.peligrosSituaciones}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-rose-900 leading-relaxed align-top bg-rose-50/20">
                      {parte.posiblesAfectaciones}
                    </td>
                    <td className="py-3 px-4 text-emerald-950 leading-relaxed align-top bg-emerald-50/20">
                      <div className="flex items-start gap-1">
                        <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{parte.medidasPrevencionControl}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-relaxed align-top">
                      {parte.seguimiento}
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => abrirModalEditar(parte)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => eliminarParte(parte.id, parte.nombre)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Barra de pie de tabla con resumen */}
        <div className="bg-slate-50 p-3 px-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-4">
            <span>
              Mostrando <strong className="text-slate-800">{partesFiltradas.length}</strong> de{' '}
              <strong className="text-slate-800">{partes.length}</strong> partes interesadas registradas
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="text-[11px] text-slate-400">
              Metodología alineada con Decreto 1072/2015 &amp; ISO 45001:2018
            </span>
          </div>

          {onIrAChecklist && (
            <button
              onClick={onIrAChecklist}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-xs cursor-pointer"
            >
              <span>Ir al Checklist de Necesidades Internas</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL PARA CREAR O EDITAR PARTE INTERESADA */}
      {modalEditarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-400" />
                <h3 className="font-bold text-sm">
                  {parteEnEdicion ? 'Actualizar Parte Interesada' : 'Registrar Nueva Parte Interesada'}
                </h3>
              </div>
              <button
                onClick={() => setModalEditarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={guardarParte} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Nombre de la Parte Interesada: *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Ej. Operarios, Proveedores, etc."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Clasificación: *</label>
                  <select
                    value={formClasificacion}
                    onChange={(e) => setFormClasificacion(e.target.value as ClasificacionParteInteresada)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="interna">Interna</option>
                    <option value="externa">Externa</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Descripción y Rol:</label>
                <textarea
                  rows={2}
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  placeholder="Descripción de la parte interesada y su relación con Frikaz S.A.S."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Necesidades y Expectativas:</label>
                <textarea
                  rows={2}
                  value={formNecesidades}
                  onChange={(e) => setFormNecesidades(e.target.value)}
                  placeholder="¿Qué espera o necesita esta parte interesada del SG-SST?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-amber-900 block">
                    Peligros o Situaciones que pueden afectarla:
                  </label>
                  <textarea
                    rows={2}
                    value={formPeligros}
                    onChange={(e) => setFormPeligros(e.target.value)}
                    placeholder="Riesgos específicos (aceite caliente, tránsito, etc.)"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/20 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-rose-900 block">Posibles Afectaciones:</label>
                  <textarea
                    rows={2}
                    value={formAfectaciones}
                    onChange={(e) => setFormAfectaciones(e.target.value)}
                    placeholder="Impacto legal, médico o patrimonial"
                    className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-rose-50/20 text-xs focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-emerald-900 block">
                  Medidas de Prevención y Control:
                </label>
                <textarea
                  rows={2}
                  value={formMedidas}
                  onChange={(e) => setFormMedidas(e.target.value)}
                  placeholder="Controles operacionales, EPP, inspecciones y mantenimientos"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/20 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Mecanismo de Seguimiento:</label>
                <input
                  type="text"
                  value={formSeguimiento}
                  onChange={(e) => setFormSeguimiento(e.target.value)}
                  placeholder="Frecuencia y mecanismo de evaluación (ej. auditorías, comités)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalEditarOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Guardar Información
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
