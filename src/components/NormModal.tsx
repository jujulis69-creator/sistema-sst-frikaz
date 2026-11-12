import React, { useState, useEffect } from 'react';
import { Norm, AreaNormativa, TipoDisposicion, Jurisdiccion, EstadoVigencia, EstadoRevision } from '../types';
import { X, Save, AlertCircle } from 'lucide-react';

interface NormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (norm: Norm) => void;
  editingNorm?: Norm | null;
}

const INITIAL_NORM_FORM: Omit<Norm, 'id'> = {
  codigoIdentificador: '',
  area: 'SST',
  tipoDisposicion: 'Resolución',
  numero: '',
  anio: new Date().getFullYear(),
  nombreOficial: '',
  entidadEmisora: '',
  articulosAplicables: '',
  descripcion: '',
  importanciaFrikaz: '',
  aplicabilidadConcreta: '',
  jurisdiccion: 'Nacional',
  alcance: '',
  estadoVigencia: 'Vigente verificada',
  modificacionesIdentificadas: '',
  fechaUltimaConsulta: new Date().toISOString().split('T')[0],
  fuenteOficial: 'SUIN-Juriscol',
  enlaceFuente: '',
  responsable: 'Responsable SST / Coordinador Ambiental',
  estadoRevision: 'Revisada',
  observaciones: '',
};

export const NormModal: React.FC<NormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingNorm,
}) => {
  const [formData, setFormData] = useState<Omit<Norm, 'id'>>(INITIAL_NORM_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingNorm) {
      const { id, ...rest } = editingNorm;
      setFormData(rest);
    } else {
      setFormData({
        ...INITIAL_NORM_FORM,
        codigoIdentificador: `NOR-${Math.floor(100 + Math.random() * 900)}`,
        anio: new Date().getFullYear(),
      });
    }
    setErrors({});
  }, [editingNorm, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.codigoIdentificador.trim()) errs.codigoIdentificador = 'El código identificador es obligatorio.';
    if (!formData.numero.trim()) errs.numero = 'El número de la norma es obligatorio.';
    if (!formData.nombreOficial.trim()) errs.nombreOficial = 'El nombre oficial de la norma es obligatorio.';
    if (!formData.entidadEmisora.trim()) errs.entidadEmisora = 'La entidad emisora es obligatoria.';
    if (!formData.descripcion.trim()) errs.descripcion = 'La descripción (qué regula) es obligatoria.';
    if (!formData.importanciaFrikaz.trim()) errs.importanciaFrikaz = 'Debe indicar por qué es importante para Frikaz S.A.S.';
    if (!formData.aplicabilidadConcreta.trim()) errs.aplicabilidadConcreta = 'Debe detallar qué debe hacer Frikaz S.A.S.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const normToSave: Norm = {
      id: editingNorm?.id || `norm-${Date.now()}`,
      ...formData,
    };
    onSave(normToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingNorm ? 'Editar Disposición Legal' : 'Registrar Nueva Norma en la Matriz'}
            </h3>
            <p className="text-xs text-slate-500">
              Gestión normativa aplicable a Frikaz S.A.S. (Bosa, Bogotá D.C.)
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* General Row: Code, Area, Type, Number, Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Código Único *
              </label>
              <input
                type="text"
                value={formData.codigoIdentificador}
                onChange={(e) => setFormData({ ...formData, codigoIdentificador: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="NOR-SST-008"
              />
              {errors.codigoIdentificador && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.codigoIdentificador}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Área Normativa *
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value as AreaNormativa })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="SST">SST (Seguridad y Salud)</option>
                <option value="Ambiental">Ambiental</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo Disposición *
              </label>
              <select
                value={formData.tipoDisposicion}
                onChange={(e) => setFormData({ ...formData, tipoDisposicion: e.target.value as TipoDisposicion })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="Ley">Ley</option>
                <option value="Decreto">Decreto</option>
                <option value="Decreto Único Reglamentario">Decreto Único Reglamentario</option>
                <option value="Resolución">Resolución</option>
                <option value="Circular">Circular</option>
                <option value="Norma Técnica Distrital">Norma Técnica Distrital</option>
                <option value="Acuerdo Distrital">Acuerdo Distrital</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de Norma *
              </label>
              <input
                type="text"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="Ej. 1072, 0312"
              />
              {errors.numero && <p className="text-[11px] text-red-600 mt-0.5">{errors.numero}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Año de Expedición *
              </label>
              <input
                type="number"
                value={formData.anio}
                onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value, 10) || 2026 })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Official Name & Emitting Authority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre Oficial de la Norma *
              </label>
              <input
                type="text"
                value={formData.nombreOficial}
                onChange={(e) => setFormData({ ...formData, nombreOficial: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="Por la cual se definen los Estándares Mínimos..."
              />
              {errors.nombreOficial && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.nombreOficial}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Entidad Emisora *
              </label>
              <input
                type="text"
                value={formData.entidadEmisora}
                onChange={(e) => setFormData({ ...formData, entidadEmisora: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="Ministerio del Trabajo / Secretaría Distrital de Ambiente (SDA)"
              />
              {errors.entidadEmisora && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.entidadEmisora}</p>
              )}
            </div>
          </div>

          {/* Articles & Description (what it regulates) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Artículos o Numerales Aplicables
              </label>
              <input
                type="text"
                value={formData.articulosAplicables}
                onChange={(e) => setFormData({ ...formData, articulosAplicables: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="Artículos 3 al 8, Capítulo I (7 Estándares Mínimos)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jurisdicción
              </label>
              <select
                value={formData.jurisdiccion}
                onChange={(e) => setFormData({ ...formData, jurisdiccion: e.target.value as Jurisdiccion })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="Nacional">Nacional (Colombia)</option>
                <option value="Distrital (Bogotá D.C.)">Distrital (Bogotá D.C.)</option>
                <option value="Departamental">Departamental</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción (¿Qué regula la disposición?) *
            </label>
            <textarea
              rows={2}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
              placeholder="Explique el objeto y marco regulatorio de la disposición legal..."
            />
            {errors.descripcion && (
              <p className="text-[11px] text-red-600 mt-0.5">{errors.descripcion}</p>
            )}
          </div>

          {/* Importance & Concrete Applicability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Importancia para Frikaz S.A.S. (¿Por qué es relevante para la planta?) *
              </label>
              <textarea
                rows={2}
                value={formData.importanciaFrikaz}
                onChange={(e) => setFormData({ ...formData, importanciaFrikaz: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="Relevancia específica por contar con 10 trabajadores y freidoras industriales..."
              />
              {errors.importanciaFrikaz && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.importanciaFrikaz}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aplicabilidad Concreta (¿Qué debe hacer específicamente Frikaz S.A.S.?) *
              </label>
              <textarea
                rows={2}
                value={formData.aplicabilidadConcreta}
                onChange={(e) => setFormData({ ...formData, aplicabilidadConcreta: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="Acciones obligatorias y verificables que la empresa debe implementar..."
              />
              {errors.aplicabilidadConcreta && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.aplicabilidadConcreta}</p>
              )}
            </div>
          </div>

          {/* Scope (Alcance) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alcance (¿A quiénes, actividades y procesos comprende?)
            </label>
            <input
              type="text"
              value={formData.alcance}
              onChange={(e) => setFormData({ ...formData, alcance: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
              placeholder="Aplica a los 10 operarios de fritura, corte, empaque y despacho en la sede Bosa."
            />
          </div>

          {/* Legal Validity & Verification Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estado de Vigencia *
              </label>
              <select
                value={formData.estadoVigencia}
                onChange={(e) => setFormData({ ...formData, estadoVigencia: e.target.value as EstadoVigencia })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden bg-white"
              >
                <option value="Vigente verificada">Vigente verificada</option>
                <option value="Pendiente de validación normativa">Pendiente de validación normativa</option>
                <option value="Modificada">Modificada</option>
                <option value="Derogada">Derogada</option>
                <option value="No aplicable con justificación">No aplicable con justificación</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estado de Revisión
              </label>
              <select
                value={formData.estadoRevision}
                onChange={(e) => setFormData({ ...formData, estadoRevision: e.target.value as EstadoRevision })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden bg-white"
              >
                <option value="Revisada">Revisada</option>
                <option value="En revisión">En revisión</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fecha Última Consulta
              </label>
              <input
                type="date"
                value={formData.fechaUltimaConsulta}
                onChange={(e) => setFormData({ ...formData, fechaUltimaConsulta: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Responsable de Revisión
              </label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden bg-white"
                placeholder="Líder SST / Asesor Jurídico"
              />
            </div>
          </div>

          {/* Sources and modifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fuente Oficial Consultada
              </label>
              <input
                type="text"
                value={formData.fuenteOficial}
                onChange={(e) => setFormData({ ...formData, fuenteOficial: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="SUIN-Juriscol / Función Pública / SDA"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enlace a la Fuente Oficial
              </label>
              <input
                type="url"
                value={formData.enlaceFuente}
                onChange={(e) => setFormData({ ...formData, enlaceFuente: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="https://www.suin-juriscol.gov.co/..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Modificaciones Identificadas
              </label>
              <input
                type="text"
                value={formData.modificacionesIdentificadas}
                onChange={(e) => setFormData({ ...formData, modificacionesIdentificadas: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                placeholder="Aclarada por Res. 0312 de 2019..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observaciones y Registro de Trazabilidad
            </label>
            <textarea
              rows={2}
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden"
              placeholder="Notas técnicas del equipo de auditoría o SST..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Disposición Legal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
