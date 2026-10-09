import React, { useState, useEffect } from 'react';
import {
  Evidencia,
  Norm,
  Obligacion,
  TipoArchivo,
  EstadoRevisionEvidencia,
} from '../types';
import { X, Save, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface EvidenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidencia: Evidencia) => void;
  norms: Norm[];
  obligaciones: Obligacion[];
  editingEvidencia?: Evidencia | null;
  defaultObligacionId?: string;
}

const INITIAL_FORM: Omit<Evidencia, 'id'> = {
  codigo: '',
  nombre: '',
  normaId: '',
  obligacionId: '',
  tipoArchivo: 'PDF',
  descripcion: '',
  fechaEmision: new Date().toISOString().split('T')[0],
  fechaVencimiento: '',
  responsable: '',
  ubicacionOEnlace: '',
  archivoNombre: '',
  archivoDataUrl: '',
  estadoRevision: 'Pendiente de revisión',
  observaciones: '',
};

export const EvidenciaModal: React.FC<EvidenciaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  norms,
  obligaciones,
  editingEvidencia,
  defaultObligacionId,
}) => {
  const [formData, setFormData] = useState<Omit<Evidencia, 'id'>>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileSelectedName, setFileSelectedName] = useState<string>('');

  useEffect(() => {
    if (editingEvidencia) {
      const { id, ...rest } = editingEvidencia;
      setFormData(rest);
      setFileSelectedName(rest.archivoNombre || '');
    } else {
      const defaultOblig = defaultObligacionId
        ? obligaciones.find((o) => o.id === defaultObligacionId)
        : obligaciones[0];

      setFormData({
        ...INITIAL_FORM,
        codigo: `EVI-${Math.floor(100 + Math.random() * 900)}`,
        obligacionId: defaultOblig?.id || '',
        normaId: defaultOblig?.normaId || (norms[0]?.id || ''),
        responsable: defaultOblig?.responsable || 'Responsable SST / Coordinador Ambiental',
      });
      setFileSelectedName('');
    }
    setErrors({});
  }, [editingEvidencia, isOpen, defaultObligacionId, obligaciones, norms]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileSelectedName(file.name);

    // Read as DataURL for persistent storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        archivoNombre: file.name,
        archivoDataUrl: result,
        ubicacionOEnlace: `/almacenamiento/frikaz/${file.name}`,
        tipoArchivo: file.type.includes('pdf')
          ? 'PDF'
          : file.type.includes('sheet') || file.type.includes('excel') || file.name.endsWith('.xlsx')
          ? 'Excel'
          : file.type.includes('image')
          ? 'Imagen'
          : file.type.includes('word') || file.name.endsWith('.docx')
          ? 'Word'
          : 'Registro Físico / Digital',
      }));
    };
    reader.readAsDataURL(file);
  };

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
    if (!formData.nombre.trim()) errs.nombre = 'El nombre de la evidencia es obligatorio.';
    if (!formData.obligacionId) errs.obligacionId = 'Debe vincular una obligación.';
    if (!formData.responsable.trim()) errs.responsable = 'El responsable es obligatorio.';
    if (!formData.descripcion.trim()) errs.descripcion = 'La descripción es requerida.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: editingEvidencia?.id || `evi-${Date.now()}`,
      ...formData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingEvidencia ? 'Editar Evidencia Documental' : 'Cargar Nueva Evidencia Documental'}
            </h3>
            <p className="text-xs text-slate-500">
              Soporte probatorio para demostrar cumplimiento normativo en Frikaz S.A.S.
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
          {/* File attachment drag/select box */}
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center hover:border-emerald-600 transition-colors bg-slate-50/50">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-1" />
              <span className="font-semibold text-emerald-800 block text-xs">
                {fileSelectedName ? `Archivo cargado: ${fileSelectedName}` : 'Haga clic para adjuntar archivo (PDF, Excel, Word, Imagen)'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Se guardará con persistencia en el almacenamiento local seguro de la app
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Código Evidencia *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
              {errors.codigo && <p className="text-[11px] text-red-600 mt-0.5">{errors.codigo}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo de Archivo *
              </label>
              <select
                value={formData.tipoArchivo}
                onChange={(e) => setFormData({ ...formData, tipoArchivo: e.target.value as TipoArchivo })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="PDF">Documento PDF</option>
                <option value="Excel">Hoja de Cálculo Excel</option>
                <option value="Word">Documento Word</option>
                <option value="Imagen">Imagen / Registro Fotográfico</option>
                <option value="Registro Físico / Digital">Registro Físico / Digital</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nombre de la Evidencia *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Ej. Manifiesto de Recolección de ACU No. 881 (220 Litros)"
            />
            {errors.nombre && <p className="text-[11px] text-red-600 mt-0.5">{errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Obligación Relacionada *
              </label>
              <select
                value={formData.obligacionId}
                onChange={(e) => handleObligacionChange(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="">Seleccione obligación...</option>
                {obligaciones.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.codigo} - {o.descripcionObligacion.slice(0, 45)}...
                  </option>
                ))}
              </select>
              {errors.obligacionId && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.obligacionId}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Norma Asociada
              </label>
              <select
                value={formData.normaId}
                onChange={(e) => setFormData({ ...formData, normaId: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              >
                {norms.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.codigoIdentificador} - {n.tipoDisposicion} {n.numero}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descripción y Contenido Probatorio *
            </label>
            <textarea
              rows={2}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Qué certifica este documento y por qué demuestra cumplimiento legal..."
            />
            {errors.descripcion && (
              <p className="text-[11px] text-red-600 mt-0.5">{errors.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha de Emisión
              </label>
              <input
                type="date"
                value={formData.fechaEmision}
                onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha Vencimiento (Si aplica)
              </label>
              <input
                type="date"
                value={formData.fechaVencimiento || ''}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Responsable Custodio *
              </label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estado de Revisión Jurídica *
              </label>
              <select
                value={formData.estadoRevision}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estadoRevision: e.target.value as EstadoRevisionEvidencia,
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden bg-white"
              >
                <option value="Verificada y suficiente">Verificada y suficiente (Válida)</option>
                <option value="Pendiente de revisión">Pendiente de revisión</option>
                <option value="Rechazada / Insuficiente">Rechazada / Insuficiente</option>
                <option value="Vencida">Vencida</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ubicación Física o Enlace Digital
              </label>
              <input
                type="text"
                value={formData.ubicacionOEnlace}
                onChange={(e) => setFormData({ ...formData, ubicacionOEnlace: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden bg-white"
                placeholder="Carpeta de archivo / URL institucional"
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
              className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
              placeholder="Notas de auditoría sobre el soporte..."
            />
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
              <span>Guardar Evidencia</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
