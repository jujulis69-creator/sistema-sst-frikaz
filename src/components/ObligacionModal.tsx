import React, { useState, useEffect } from 'react';
import {
  Obligacion,
  Norm,
  EstadoCumplimientoObligacion,
  EstadoAplicabilidad,
  FrecuenciaObligacion,
} from '../types';
import { X, Save } from 'lucide-react';

interface ObligacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (obligacion: Obligacion) => void;
  norms: Norm[];
  editingObligacion?: Obligacion | null;
  defaultNormId?: string;
}

const INITIAL_FORM: Omit<Obligacion, 'id'> = {
  codigo: '',
  normaId: '',
  articuloNumeral: '',
  descripcionObligacion: '',
  justificacionAplicabilidad: '',
  actividadNecesaria: '',
  responsable: '',
  fechaLimite: '',
  frecuencia: 'Anual',
  recursosNecesarios: '',
  indicadorCumplimiento: '',
  evidenciaRequerida: '',
  estadoCumplimiento: 'Pendiente de ejecución',
  estadoAplicabilidad: 'Aplicable',
  fechaUltimaVerificacion: new Date().toISOString().split('T')[0],
  observaciones: '',
};

export const ObligacionModal: React.FC<ObligacionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  norms,
  editingObligacion,
  defaultNormId,
}) => {
  const [formData, setFormData] = useState<Omit<Obligacion, 'id'>>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingObligacion) {
      const { id, ...rest } = editingObligacion;
      setFormData(rest);
    } else {
      setFormData({
        ...INITIAL_FORM,
        codigo: `OBL-${Math.floor(100 + Math.random() * 900)}`,
        normaId: defaultNormId || (norms.length > 0 ? norms[0].id : ''),
      });
    }
    setErrors({});
  }, [editingObligacion, isOpen, defaultNormId, norms]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.codigo.trim()) errs.codigo = 'El código de la obligación es obligatorio.';
    if (!formData.normaId) errs.normaId = 'Debe seleccionar una norma relacionada.';
    if (!formData.articuloNumeral.trim()) errs.articuloNumeral = 'El artículo o numeral es obligatorio.';
    if (!formData.descripcionObligacion.trim()) errs.descripcionObligacion = 'La descripción es obligatoria.';
    if (!formData.actividadNecesaria.trim()) errs.actividadNecesaria = 'La actividad para cumplir es obligatoria.';
    if (!formData.responsable.trim()) errs.responsable = 'El responsable es obligatorio.';
    if (!formData.evidenciaRequerida.trim()) errs.evidenciaRequerida = 'La evidencia requerida es obligatoria.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: editingObligacion?.id || `obl-${Date.now()}`,
      ...formData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingObligacion ? 'Editar Obligación Legal' : 'Crear Nueva Obligación Legal'}
            </h3>
            <p className="text-xs text-slate-500">
              Articulación con norma y trazabilidad de cumplimiento en Frikaz S.A.S.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1 text-xs">
          {/* Row 1: Code & Related Norm */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Código Obligación *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                placeholder="OBL-SST-008"
              />
              {errors.codigo && <p className="text-[11px] text-red-600 mt-0.5">{errors.codigo}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Norma Relacionada *
              </label>
              <select
                value={formData.normaId}
                onChange={(e) => setFormData({ ...formData, normaId: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="">Seleccione una norma...</option>
                {norms.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.codigoIdentificador} - {n.tipoDisposicion} {n.numero} de {n.anio} ({n.area})
                  </option>
                ))}
              </select>
              {errors.normaId && <p className="text-[11px] text-red-600 mt-0.5">{errors.normaId}</p>}
            </div>
          </div>

          {/* Row 2: Article & Applicability State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Artículo / Numeral Aplicable *
              </label>
              <input
                type="text"
                value={formData.articuloNumeral}
                onChange={(e) => setFormData({ ...formData, articuloNumeral: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                placeholder="Artículo 3, Numeral 5"
              />
              {errors.articuloNumeral && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.articuloNumeral}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Condición de Aplicabilidad *
              </label>
              <select
                value={formData.estadoAplicabilidad}
                onChange={(e) =>
                  setFormData({ ...formData, estadoAplicabilidad: e.target.value as EstadoAplicabilidad })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="Aplicable">Aplicable a Frikaz S.A.S.</option>
                <option value="No aplica con justificación">No aplica con justificación (Excluir de %)</option>
                <option value="Pendiente de evaluación">Pendiente de evaluación</option>
              </select>
            </div>
          </div>

          {/* Description of obligation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descripción de la Obligación Legal *
            </label>
            <textarea
              rows={2}
              value={formData.descripcionObligacion}
              onChange={(e) => setFormData({ ...formData, descripcionObligacion: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Describa el mandato legal exacto que debe cumplirse..."
            />
            {errors.descripcionObligacion && (
              <p className="text-[11px] text-red-600 mt-0.5">{errors.descripcionObligacion}</p>
            )}
          </div>

          {/* Justification of applicability */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Justificación de Aplicabilidad / Inaplicabilidad
            </label>
            <input
              type="text"
              value={formData.justificacionAplicabilidad}
              onChange={(e) => setFormData({ ...formData, justificacionAplicabilidad: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Motivo por el cual aplica a los 10 trabajadores o a la planta de snacks fritos..."
            />
          </div>

          {/* Action to comply */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Actividad Necesaria para Cumplir *
            </label>
            <textarea
              rows={2}
              value={formData.actividadNecesaria}
              onChange={(e) => setFormData({ ...formData, actividadNecesaria: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Actividad operativa, documental o técnica requerida..."
            />
            {errors.actividadNecesaria && (
              <p className="text-[11px] text-red-600 mt-0.5">{errors.actividadNecesaria}</p>
            )}
          </div>

          {/* Responsible, Deadline, Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Responsable *
              </label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                placeholder="Líder SST / Jefe de Planta"
              />
              {errors.responsable && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.responsable}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha Límite
              </label>
              <input
                type="date"
                value={formData.fechaLimite}
                onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Frecuencia
              </label>
              <select
                value={formData.frecuencia}
                onChange={(e) =>
                  setFormData({ ...formData, frecuencia: e.target.value as FrecuenciaObligacion })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="Única vez">Única vez</option>
                <option value="Mensual">Mensual</option>
                <option value="Bimestral">Bimestral</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
                <option value="Permanente">Permanente</option>
              </select>
            </div>
          </div>

          {/* Resources, Indicator, Required Evidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Recursos Necesarios
              </label>
              <input
                type="text"
                value={formData.recursosNecesarios}
                onChange={(e) => setFormData({ ...formData, recursosNecesarios: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                placeholder="Presupuesto, EPP, software, horas operativas..."
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Indicador de Cumplimiento
              </label>
              <input
                type="text"
                value={formData.indicadorCumplimiento}
                onChange={(e) => setFormData({ ...formData, indicadorCumplimiento: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                placeholder="100% trabajadores con concepto de aptitud médica"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Evidencia Requerida por Ley *
            </label>
            <input
              type="text"
              value={formData.evidenciaRequerida}
              onChange={(e) => setFormData({ ...formData, evidenciaRequerida: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Certificado de recolección de ACU, actas de entrega de EPP, planilla PILA..."
            />
            {errors.evidenciaRequerida && (
              <p className="text-[11px] text-red-600 mt-0.5">{errors.evidenciaRequerida}</p>
            )}
          </div>

          {/* Compliance Status & Verification Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estado de Cumplimiento Legal *
              </label>
              <select
                value={formData.estadoCumplimiento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estadoCumplimiento: e.target.value as EstadoCumplimientoObligacion,
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden bg-white"
              >
                <option value="Cumple y tiene evidencia verificada">
                  Cumple y tiene evidencia verificada
                </option>
                <option value="Cumple parcialmente">Cumple parcialmente</option>
                <option value="No cumple">No cumple (Alerta roja)</option>
                <option value="Pendiente de ejecución">Pendiente de ejecución</option>
                <option value="Pendiente de verificación">Pendiente de verificación</option>
                <option value="No aplica con justificación">No aplica con justificación</option>
                <option value="Pendiente de evaluación">Pendiente de evaluación</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha de Última Verificación
              </label>
              <input
                type="date"
                value={formData.fechaUltimaVerificacion}
                onChange={(e) => setFormData({ ...formData, fechaUltimaVerificacion: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Observaciones
            </label>
            <textarea
              rows={2}
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Notas adicionales sobre la verificación o auditoría..."
            />
          </div>

          {/* Footer */}
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
              <span>Guardar Obligación</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
