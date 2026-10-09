import React, { useState, useEffect } from 'react';
import {
  NormaPhvaItem,
  EstadoCumplimiento,
  FasePhva,
} from '../types/phvaEvidence';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit3,
  Save,
  RotateCcw,
  Trash2,
  Check,
} from 'lucide-react';

interface NormaCirculosModalProps {
  item: NormaPhvaItem | null;
  isOpen: boolean;
  initialEditMode?: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: EstadoCumplimiento) => void;
  onSaveNorma?: (updatedItem: NormaPhvaItem) => void;
  onDeleteNorma?: (id: string) => void;
}

export const NormaCirculosModal: React.FC<NormaCirculosModalProps> = ({
  item,
  isOpen,
  initialEditMode = false,
  onClose,
  onUpdateStatus,
  onSaveNorma,
  onDeleteNorma,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<NormaPhvaItem | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setIsEditing(Boolean(initialEditMode));
      setSaveSuccess(false);
    }
  }, [item, isOpen, initialEditMode]);

  if (!isOpen || !item || !formData) return null;

  const handleChange = (
    field: keyof NormaPhvaItem,
    value: string | boolean | EstadoCumplimiento | FasePhva
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (onSaveNorma) {
      onSaveNorma(formData);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 900);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Está seguro de eliminar la norma "${formData.tituloSituacion}" de la matriz?`
      )
    ) {
      if (onDeleteNorma) {
        onDeleteNorma(formData.id);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header - Azul Oscuro con Acentos Naranja y Logo Frikaz */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f172a] text-white border-b-4 border-[#f97316]">
          <div className="flex items-center gap-3.5">
            <img
              src="/frikaz_logo.jpg"
              alt="Logo Frikaz"
              className="h-12 w-auto max-w-[90px] object-contain rounded-lg border border-orange-200/40 bg-white p-0.5 shadow-xs shrink-0"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#fed7aa] px-2 py-0.5 text-[10px] font-black uppercase text-[#0f172a]">
                  Fase {formData.fase}
                </span>
                <span className="text-xs text-orange-200 font-bold">
                  {formData.subtema}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300">
                  {formData.area === 'SST'
                    ? 'Seguridad y Salud'
                    : formData.area === 'AMBIENTAL'
                    ? 'Ambiental'
                    : 'Integral'}
                </span>
                {isEditing && (
                  <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-slate-900 animate-pulse">
                    MODO EDICIÓN ACTIVO
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight">
                {formData.tituloSituacion}
              </h3>
              <p className="text-xs text-slate-300">
                <strong className="text-white">{formData.normaOficial}</strong> —{' '}
                {formData.entidadEmisora} ({formData.articulos})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f97316] text-white text-xs font-bold hover:bg-[#ea580c] transition-colors shadow-xs"
                title="Habilitar edición de los 6 círculos y campos de la norma"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Editar Norma</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...item });
                  setIsEditing(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                title="Cancelar cambios y volver a vista lectura"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Cancelar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Cerrar ventana"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-800">
          {saveSuccess && (
            <div className="rounded-xl bg-emerald-50 border-2 border-emerald-500 p-3.5 flex items-center justify-between text-emerald-900 animate-fade-in shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>¡Cambios guardados con éxito en la base de datos de Frikaz S.A.S.!</span>
              </div>
            </div>
          )}

          {/* Subtitle from the Teacher's Presentation (Slide 5) */}
          <div className="text-center pb-2 border-b border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#991b1b]">
              EVIDENCIA 1 — EVALUACIÓN NORMATIVA AUTOMATIZADA
            </span>
            <h4 className="text-sm font-semibold text-slate-600 mt-0.5">
              Identificar la Normativa para cada Fase (Requisitos Oficiales de la Presentación)
            </h4>
          </div>

          {/* FORM / VIEW MODE TOGGLE */}
          {isEditing ? (
            /* ========================================================================= */
            /* MODO EDICIÓN COMPLETO                                                      */
            /* ========================================================================= */
            <form onSubmit={handleSave} className="space-y-5">
              <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 uppercase">
                    Datos Generales de la Disposición Legal:
                  </span>
                  <span className="text-[11px] text-amber-800">
                    Edite cualquier campo y haga clic en <strong>Guardar Cambios</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">
                      Título o Situación Regulada:
                    </label>
                    <input
                      type="text"
                      value={formData.tituloSituacion}
                      onChange={(e) => handleChange('tituloSituacion', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Área Normativa:
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => handleChange('area', e.target.value as any)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                    >
                      <option value="SST">Seguridad y Salud en el Trabajo (SST)</option>
                      <option value="AMBIENTAL">Gestión Ambiental</option>
                      <option value="INTEGRAL">Integral (SST + Ambiental)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Norma Oficial:
                    </label>
                    <input
                      type="text"
                      value={formData.normaOficial}
                      onChange={(e) => handleChange('normaOficial', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Ej. Decreto 1072 de 2015"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Entidad Emisora:
                    </label>
                    <input
                      type="text"
                      value={formData.entidadEmisora}
                      onChange={(e) => handleChange('entidadEmisora', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Ej. Ministerio del Trabajo / SDA"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Artículos Aplicables:
                    </label>
                    <input
                      type="text"
                      value={formData.articulos}
                      onChange={(e) => handleChange('articulos', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Ej. Art. 2.2.4.6.8"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Fase PHVA:
                    </label>
                    <select
                      value={formData.fase}
                      onChange={(e) => handleChange('fase', e.target.value as any)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                    >
                      <option value="PLANEAR">Fase 1: PLANEAR</option>
                      <option value="HACER">Fase 2: HACER</option>
                      <option value="VERIFICAR">Fase 3: VERIFICAR</option>
                      <option value="ACTUAR">Fase 4: ACTUAR</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Subtema o Módulo:
                    </label>
                    <input
                      type="text"
                      value={formData.subtema}
                      onChange={(e) => handleChange('subtema', e.target.value as any)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Estado de Cumplimiento:
                    </label>
                    <select
                      value={formData.estado}
                      onChange={(e) => handleChange('estado', e.target.value as any)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white font-bold"
                    >
                      <option value="CUMPLE">✓ CUMPLE (100%)</option>
                      <option value="PARCIAL">~ PARCIAL (50%)</option>
                      <option value="NO_CUMPLE">✕ NO CUMPLE (0%)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* EDICIÓN DE LOS 6 CÍRCULOS OBLIGATORIOS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="font-extrabold text-sm text-[#0f172a] uppercase tracking-wide">
                    Edición de los 6 Círculos Obligatorios de la Presentación:
                  </h4>
                  <span className="text-xs text-[#991b1b] font-bold">
                    Requisitos solicitados por la profesora
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CÍRCULO 1 */}
                  <div className="rounded-xl border border-slate-300 p-3.5 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <label className="font-bold text-xs uppercase tracking-wider text-[#0f172a]">
                        Descripción (¿Qué regula la disposición?)
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.descripcion}
                      onChange={(e) => handleChange('descripcion', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Explique qué regula la norma..."
                      required
                    />
                  </div>

                  {/* CÍRCULO 2 */}
                  <div className="rounded-xl border border-orange-300 p-3.5 bg-orange-50/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <label className="font-bold text-xs uppercase tracking-wider text-orange-950">
                        Importancia (¿Por qué es crucial para Frikaz S.A.S.?)
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.importancia}
                      onChange={(e) => handleChange('importancia', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Importancia para la planta de fritos y sus 10 trabajadores..."
                      required
                    />
                  </div>

                  {/* CÍRCULO 3 */}
                  <div className="rounded-xl border border-blue-300 p-3.5 bg-blue-50/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <label className="font-bold text-xs uppercase tracking-wider text-[#1e3a8a]">
                        Aplicabilidad (¿Qué debe hacer concretamente la empresa?)
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.aplicabilidad}
                      onChange={(e) => handleChange('aplicabilidad', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Medidas concretas a implementar..."
                      required
                    />
                  </div>

                  {/* CÍRCULO 4 */}
                  <div className="rounded-xl border-2 border-[#991b1b] p-3.5 bg-red-50/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#991b1b] text-white flex items-center justify-center font-bold text-xs">
                        4
                      </div>
                      <label className="font-bold text-xs uppercase tracking-wider text-[#991b1b]">
                        Vigencia Oficial (Confirmación en SUIN / MinTrabajo / SDA)
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.textoVigencia}
                      onChange={(e) => handleChange('textoVigencia', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Estado de vigencia oficial..."
                      required
                    />
                  </div>

                  {/* CÍRCULO 5 */}
                  <div className="rounded-xl border border-slate-300 p-3.5 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                        5
                      </div>
                      <label className="font-bold text-xs uppercase tracking-wider text-[#0f172a]">
                        Jurisdicción y Alcance (Nacional / Distrital Bogotá)
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.jurisdiccionAlcance}
                      onChange={(e) => handleChange('jurisdiccionAlcance', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Cobertura y alcance territorial..."
                      required
                    />
                  </div>

                  {/* CÍRCULO 6 */}
                  <div className="rounded-xl border border-emerald-300 p-3.5 bg-emerald-50/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                        6
                      </div>
                      <label className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                        Evidencia para Cumplimiento (Documento auditable)
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.evidenciaCumplimiento}
                      onChange={(e) => handleChange('evidenciaCumplimiento', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                      placeholder="Soporte documental exigido por la autoridad..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* TRAZABILIDAD Y RESPONSABLES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Responsable Asignado:
                  </label>
                  <input
                    type="text"
                    value={formData.responsable}
                    onChange={(e) => handleChange('responsable', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                    placeholder="Ej. Líder SST / Gerente General"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Fecha de Última Verificación:
                  </label>
                  <input
                    type="date"
                    value={formData.fechaVerificacion}
                    onChange={(e) => handleChange('fechaVerificacion', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Observaciones Técnicas:
                  </label>
                  <input
                    type="text"
                    value={formData.observaciones}
                    onChange={(e) => handleChange('observaciones', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
                    placeholder="Notas internas..."
                  />
                </div>
              </div>

              {/* BOTONES DE ACCIÓN DEL FORMULARIO */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-[#991b1b] border border-red-300 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar Esta Norma</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...item });
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors"
                  >
                    Descartar Cambios
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0f172a] text-white text-xs font-black hover:bg-slate-800 transition-colors shadow-md"
                  >
                    <Save className="h-4 w-4 text-[#fed7aa]" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ========================================================================= */
            /* MODO LECTURA Y SEGUIMIENTO AUTOMATIZADO                                   */
            /* ========================================================================= */
            <>
              {/* Interactive Status Bar (Automation) */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-600 block">
                    Estado Automatizado de Cumplimiento:
                  </span>
                  <p className="text-xs text-slate-500">
                    Al seleccionar un estado, los indicadores del panel se recalculan al instante.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(formData.id, 'CUMPLE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      formData.estado === 'CUMPLE'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cumple (100%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(formData.id, 'PARCIAL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      formData.estado === 'PARCIAL'
                        ? 'bg-[#f97316] text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Parcial (50%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(formData.id, 'NO_CUMPLE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      formData.estado === 'NO_CUMPLE'
                        ? 'bg-[#991b1b] text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>No Cumple (0%)</span>
                  </button>
                </div>
              </div>

              {/* LOS 6 CÍRCULOS DEL SLIDE 5 REPRESENTADOS CLARAMENTE */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* CÍRCULO 1: DESCRIPCIÓN */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs relative flex flex-col justify-between hover:border-slate-400 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#0f172a]">
                        Descripción
                      </h5>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {formData.descripcion}
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] text-slate-400 font-medium">
                    ¿Qué regula la norma?
                  </span>
                </div>

                {/* CÍRCULO 2: IMPORTANCIA */}
                <div className="rounded-xl border border-orange-200 bg-[#fff7ed] p-4 shadow-xs relative flex flex-col justify-between hover:border-orange-400 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-orange-950">
                        Importancia
                      </h5>
                    </div>
                    <p className="text-xs text-orange-950 leading-relaxed font-medium">
                      {formData.importancia}
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] text-orange-700 font-semibold">
                    Para Frikaz S.A.S. (10 trab., snacks fritos)
                  </span>
                </div>

                {/* CÍRCULO 3: APLICABILIDAD */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs relative flex flex-col justify-between hover:border-blue-400 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#1e3a8a]">
                        Aplicabilidad
                      </h5>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-normal">
                      {formData.aplicabilidad}
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] text-blue-700 font-semibold">
                    ¿Qué debe hacer la pyme concretamente?
                  </span>
                </div>

                {/* CÍRCULO 4: VIGENTE (DESTACADO EN ROJO OSCURO COMO EN LA DIAPOSITIVA) */}
                <div className="rounded-xl border-2 border-[#991b1b] bg-red-50/60 p-4 shadow-xs relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-[#991b1b] text-white flex items-center justify-center font-bold text-xs">
                        4
                      </div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#991b1b]">
                        Vigente (Oficial)
                      </h5>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#991b1b] text-white text-xs font-bold mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>VIGENTE EN COLOMBIA</span>
                    </div>
                    <p className="text-xs text-red-950 leading-relaxed">
                      {formData.textoVigencia}
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] text-red-800 font-bold">
                    Verificado en SUIN-Juriscol / MinTrabajo / SDA
                  </span>
                </div>

                {/* CÍRCULO 5: JURISDICCIÓN Y ALCANCE */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs relative flex flex-col justify-between hover:border-slate-400 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                        5
                      </div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#0f172a]">
                        Jurisdicción y Alcance
                      </h5>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {formData.jurisdiccionAlcance}
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] text-slate-500 font-medium">
                    Ámbito territorial y cobertura laboral
                  </span>
                </div>

                {/* CÍRCULO 6: EVIDENCIA PARA CUMPLIMIENTO */}
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 shadow-xs relative flex flex-col justify-between hover:border-emerald-500 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                        6
                      </div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                        Evidencia de Cumplimiento
                      </h5>
                    </div>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                      {formData.evidenciaCumplimiento}
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] text-emerald-800 font-bold">
                    Documento o soporte auditable por la autoridad
                  </span>
                </div>
              </div>

              {/* Traceability Footnote */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <div>
                  <span>
                    <strong>Responsable Asignado:</strong> {formData.responsable}
                  </span>
                  <span className="mx-2">·</span>
                  <span>
                    <strong>Última Verificación:</strong> {formData.fechaVerificacion}
                  </span>
                </div>
                {formData.observaciones && (
                  <span className="italic text-slate-600">{formData.observaciones}</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f97316] text-white text-xs font-bold hover:bg-[#ea580c] transition-colors shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Editar los 6 Círculos de esta Norma</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500 font-medium">
              Todos los cambios se guardan localmente para su sustentación.
            </span>
          )}

          <button
            onClick={onClose}
            className="rounded-lg bg-[#0f172a] px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
