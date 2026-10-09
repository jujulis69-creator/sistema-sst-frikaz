import React, { useState, useEffect } from 'react';
import {
  AccionCorrectiva,
  Obligacion,
  Norm,
  EstadoAccionCorrectiva,
  ResultadoEficacia,
} from '../types';
import { X, Save, AlertTriangle } from 'lucide-react';

interface AccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accion: AccionCorrectiva) => void;
  obligaciones: Obligacion[];
  norms: Norm[];
  editingAccion?: AccionCorrectiva | null;
  defaultObligacionId?: string;
}

const INITIAL_FORM: Omit<AccionCorrectiva, 'id'> = {
  codigo: '',
  obligacionId: '',
  normaId: '',
  hallazgo: '',
  causaIdentificada: '',
  accionPropuesta: '',
  responsable: '',
  fechaApertura: new Date().toISOString().split('T')[0],
  fechaLimite: '',
  estado: 'Abierta',
  evidenciaEjecucion: '',
  fechaVerificacion: '',
  resultadoVerificacionEficacia: 'Pendiente de verificación',
  fechaCierre: '',
};

export const AccionModal: React.FC<AccionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  obligaciones,
  norms,
  editingAccion,
  defaultObligacionId,
}) => {
  const [formData, setFormData] = useState<Omit<AccionCorrectiva, 'id'>>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAccion) {
      const { id, ...rest } = editingAccion;
      setFormData(rest);
    } else {
      const defaultOblig = defaultObligacionId
        ? obligaciones.find((o) => o.id === defaultObligacionId)
        : obligaciones.find((o) => o.estadoCumplimiento === 'No cumple') || obligaciones[0];

      setFormData({
        ...INITIAL_FORM,
        codigo: `AC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        obligacionId: defaultOblig?.id || '',
        normaId: defaultOblig?.normaId || (norms[0]?.id || ''),
        responsable: defaultOblig?.responsable || 'Líder SST / Jefe de Planta',
      });
    }
    setErrors({});
  }, [editingAccion, isOpen, defaultObligacionId, obligaciones, norms]);

  if (!isOpen) return null;

  const handleObligacionChange = (obligId: string) => {
    const oblig = obligaciones.find((o) => o.id === obligId);
    setFormData((prev) => ({
      ...prev,
      obligacionId: obligId,
      normaId: oblig?.normaId || prev.normaId,
      responsable: oblig?.responsable || prev.responsable,
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.codigo.trim()) errs.codigo = 'El código es obligatorio.';
    if (!formData.obligacionId) errs.obligacionId = 'Debe vincular una obligación.';
    if (!formData.hallazgo.trim()) errs.hallazgo = 'El hallazgo o incumplimiento es obligatorio.';
    if (!formData.causaIdentificada.trim()) errs.causaIdentificada = 'La causa raíz identificada es obligatoria.';
    if (!formData.accionPropuesta.trim()) errs.accionPropuesta = 'La acción propuesta es obligatoria.';
    if (!formData.responsable.trim()) errs.responsable = 'El responsable es obligatorio.';
    if (!formData.fechaLimite) errs.fechaLimite = 'La fecha límite es obligatoria.';

    // Strict validation rule from Section 11: Cannot close without satisfactory verification of efficacy!
    if (formData.estado === 'Verificada y cerrada') {
      if (formData.resultadoVerificacionEficacia !== 'Eficaz (Cierre aprobado)') {
        errs.estado =
          'No se puede marcar como "Cerrada" sin una verificación satisfactoria de eficacia ("Eficaz").';
      }
      if (!formData.fechaCierre) {
        errs.fechaCierre = 'Debe indicar la fecha de cierre formal.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: editingAccion?.id || `ac-${Date.now()}`,
      ...formData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingAccion ? 'Editar Acción Correctiva' : 'Abrir Nueva Acción Correctiva'}
            </h3>
            <p className="text-xs text-slate-500">
              Tratamiento de no conformidades legales e investigación de causa raíz en Frikaz S.A.S.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Código Acción *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
              {errors.codigo && <p className="text-[11px] text-red-600 mt-0.5">{errors.codigo}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Obligación Incumplida Relacionada *
              </label>
              <select
                value={formData.obligacionId}
                onChange={(e) => handleObligacionChange(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="">Seleccione obligación...</option>
                {obligaciones.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.codigo} - {o.descripcionObligacion.slice(0, 45)}... ({o.estadoCumplimiento})
                  </option>
                ))}
              </select>
              {errors.obligacionId && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.obligacionId}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Hallazgo / No Conformidad Detectada *
            </label>
            <textarea
              rows={2}
              value={formData.hallazgo}
              onChange={(e) => setFormData({ ...formData, hallazgo: e.target.value })}
              className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Describa el hecho que evidencia el incumplimiento legal..."
            />
            {errors.hallazgo && <p className="text-[11px] text-red-600 mt-0.5">{errors.hallazgo}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Análisis de Causa Raíz (5 Porqués / Causa Inmediata y Básica) *
            </label>
            <textarea
              rows={2}
              value={formData.causaIdentificada}
              onChange={(e) => setFormData({ ...formData, causaIdentificada: e.target.value })}
              className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Por qué ocurrió el incumplimiento en la operación..."
            />
            {errors.causaIdentificada && (
              <p className="text-[11px] text-red-600 mt-0.5">{errors.causaIdentificada}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Acción Correctiva Propuesta (Plan de Trabajo) *
            </label>
            <textarea
              rows={2}
              value={formData.accionPropuesta}
              onChange={(e) => setFormData({ ...formData, accionPropuesta: e.target.value })}
              className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Medida concreta que eliminará la causa raíz para evitar recurrencia..."
            />
            {errors.accionPropuesta && (
              <p className="text-[11px] text-red-600 mt-0.5">{errors.accionPropuesta}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Responsable de la Acción *
              </label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
              {errors.responsable && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.responsable}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha Apertura
              </label>
              <input
                type="date"
                value={formData.fechaApertura}
                onChange={(e) => setFormData({ ...formData, fechaApertura: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha Límite de Ejecución *
              </label>
              <input
                type="date"
                value={formData.fechaLimite}
                onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
              {errors.fechaLimite && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.fechaLimite}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Evidencia de Ejecución Aportada
            </label>
            <input
              type="text"
              value={formData.evidenciaEjecucion}
              onChange={(e) => setFormData({ ...formData, evidenciaEjecucion: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Actas, órdenes de servicio, registros fotográficos, conceptos médicos..."
            />
          </div>

          {/* Section 11 Verification of Efficacy & Closure */}
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>Verificación de Eficacia y Protocolo de Cierre</span>
              <span className="text-[10px] text-slate-500 font-normal">
                Regla obligatoria: Requiere verificación satisfactoria para cerrar
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Estado de la Acción *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value as EstadoAccionCorrectiva })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden bg-white"
                >
                  <option value="Abierta">Abierta</option>
                  <option value="En ejecución">En ejecución</option>
                  <option value="Verificada y cerrada">Verificada y cerrada</option>
                  <option value="Vencida">Vencida</option>
                </select>
                {errors.estado && <p className="text-[11px] text-red-600 mt-0.5">{errors.estado}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Resultado de Eficacia *
                </label>
                <select
                  value={formData.resultadoVerificacionEficacia}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resultadoVerificacionEficacia: e.target.value as ResultadoEficacia,
                    })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden bg-white"
                >
                  <option value="Pendiente de verificación">Pendiente de verificación</option>
                  <option value="Eficaz (Cierre aprobado)">Eficaz (Cierre aprobado)</option>
                  <option value="No eficaz (Requiere nueva acción)">No eficaz (Requiere nueva acción)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fecha de Cierre
                </label>
                <input
                  type="date"
                  value={formData.fechaCierre || ''}
                  onChange={(e) => setFormData({ ...formData, fechaCierre: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden bg-white"
                />
                {errors.fechaCierre && (
                  <p className="text-[11px] text-red-600 mt-0.5">{errors.fechaCierre}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100 border border-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white shadow-xs hover:bg-emerald-900"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Acción Correctiva</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
