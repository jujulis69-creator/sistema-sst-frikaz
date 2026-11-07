// ============================================================================
// PESTAÑA 4: CHECKLIST DE NECESIDADES INTERNAS - FRIKAZ S.A.S.
// Gerente (7) · Operarios (9) · Conductor (8)
// ============================================================================

import React, { useState } from 'react';
import {
  ItemChecklistNecesidad,
  CargoChecklistInterno,
  EstadoCumplimientoChecklist,
  RegistroHistorialChecklist,
} from '../../../types/partesInteresadas';
import {
  saveStoredChecklistItems,
  saveStoredHistorialChecklist,
  exportarChecklistExcel,
} from '../../../services/partesInteresadasService';
import { ModalImpresionPdfChecklist } from './ModalImpresionPdfChecklist';
import {
  Crown,
  Users,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  History,
  Edit3,
  Save,
  X,
  FileText,
  UserCheck,
  Calendar,
  ShieldCheck,
  Paperclip,
  Check,
} from 'lucide-react';

interface ChecklistNecesidadesTabProps {
  items: ItemChecklistNecesidad[];
  onActualizarItems: (nuevos: ItemChecklistNecesidad[]) => void;
  historial: RegistroHistorialChecklist[];
  onActualizarHistorial: (nuevoHistorial: RegistroHistorialChecklist[]) => void;
  cargoActivo: CargoChecklistInterno;
  onCambiarCargoActivo: (cargo: CargoChecklistInterno) => void;
}

export const ChecklistNecesidadesTab: React.FC<ChecklistNecesidadesTabProps> = ({
  items,
  onActualizarItems,
  historial,
  onActualizarHistorial,
  cargoActivo,
  onCambiarCargoActivo,
}) => {
  const [modalPdfOpen, setModalPdfOpen] = useState(false);
  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);
  const [modalNuevaRevisionOpen, setModalNuevaRevisionOpen] = useState(false);
  const [itemEnEdicion, setItemEnEdicion] = useState<ItemChecklistNecesidad | null>(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Formulario de edición rápida de un ítem
  const [editEstado, setEditEstado] = useState<EstadoCumplimientoChecklist>('Cumplido');
  const [editObservaciones, setEditObservaciones] = useState('');
  const [editEvidencias, setEditEvidencias] = useState('');
  const [editResponsable, setEditResponsable] = useState('');
  const [editFecha, setEditFecha] = useState('');

  // Formulario para guardar nueva evaluación formal en historial
  const [nuevoEvaluador, setNuevoEvaluador] = useState('Ing. Carlos Mendoza (Coordinador SST)');
  const [nuevasNotasGenerales, setNuevasNotasGenerales] = useState('');

  const itemsDelCargo = items.filter((it) => it.cargo === cargoActivo);
  const cumplidas = itemsDelCargo.filter((it) => it.estado === 'Cumplido').length;
  const enProceso = itemsDelCargo.filter((it) => it.estado === 'En proceso').length;
  const pendientes = itemsDelCargo.filter((it) => it.estado === 'Pendiente').length;
  const total = itemsDelCargo.length;
  const porcentaje = total > 0 ? Math.round((cumplidas / total) * 100) : 0;

  const nombresCargos: Record<CargoChecklistInterno, { titulo: string; desc: string; icon: React.ReactNode }> = {
    gerente: {
      titulo: 'Gerente (Alta Dirección)',
      desc: '7 Necesidades prioritarias de dirección, recursos, cumplimiento legal y bienestar',
      icon: <Crown className="h-4 w-4" />,
    },
    operarios: {
      titulo: 'Operarios (Producción y Planta)',
      desc: '9 Necesidades de maquinaria, EPP térmicos, BPM, pausas y procedimientos seguros de aceite',
      icon: <Users className="h-4 w-4" />,
    },
    conductor: {
      titulo: 'Conductor (Logística y Distribución)',
      desc: '8 Necesidades de vehículo, seguridad vial, carga ergonómica, descanso y rutas',
      icon: <Truck className="h-4 w-4" />,
    },
  };

  // Cambio rápido de estado directamente desde la fila
  const handleCambiarEstadoRapido = (id: string, nuevoEstado: EstadoCumplimientoChecklist) => {
    const actualizados = items.map((it) =>
      it.id === id
        ? {
            ...it,
            estado: nuevoEstado,
            fechaVerificacion: new Date().toISOString().split('T')[0],
          }
        : it
    );
    onActualizarItems(actualizados);
    saveStoredChecklistItems(actualizados);
  };

  // Abrir modal de edición detallada de ítem
  const abrirEdicionItem = (item: ItemChecklistNecesidad) => {
    setItemEnEdicion(item);
    setEditEstado(item.estado);
    setEditObservaciones(item.observaciones);
    setEditEvidencias(item.evidencias);
    setEditResponsable(item.responsable);
    setEditFecha(item.fechaVerificacion || new Date().toISOString().split('T')[0]);
  };

  // Guardar ítem editado
  const guardarEdicionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemEnEdicion) return;

    const actualizados = items.map((it) =>
      it.id === itemEnEdicion.id
        ? {
            ...it,
            estado: editEstado,
            observaciones: editObservaciones.trim(),
            evidencias: editEvidencias.trim(),
            responsable: editResponsable.trim(),
            fechaVerificacion: editFecha,
          }
        : it
    );

    onActualizarItems(actualizados);
    saveStoredChecklistItems(actualizados);
    setItemEnEdicion(null);
  };

  // Guardar registro en historial de revisiones
  const handleGuardarRevisionHistorial = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoRegistro: RegistroHistorialChecklist = {
      id: `rev-${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      cargo: cargoActivo,
      responsableEvaluador: nuevoEvaluador.trim() || 'Coordinador SST',
      porcentajeCumplimiento: porcentaje,
      cumplidas,
      enProceso,
      pendientes,
      observacionesGenerales:
        nuevasNotasGenerales.trim() ||
        `Evaluación periódica de necesidades en SST para ${nombresCargos[cargoActivo].titulo}.`,
    };

    const nuevoHistorial = [nuevoRegistro, ...historial];
    onActualizarHistorial(nuevoHistorial);
    saveStoredHistorialChecklist(nuevoHistorial);
    setModalNuevaRevisionOpen(false);
    setNuevasNotasGenerales('');
  };

  const handleDescargarExcel = async () => {
    try {
      setIsExportingExcel(true);
      await exportarChecklistExcel(cargoActivo, items);
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de cargo en pestaña superior */}
      <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row gap-2">
          {(['gerente', 'operarios', 'conductor'] as CargoChecklistInterno[]).map((c) => {
            const activo = cargoActivo === c;
            const itemsC = items.filter((it) => it.cargo === c);
            const cumpC = itemsC.filter((it) => it.estado === 'Cumplido').length;
            const pctC = itemsC.length > 0 ? Math.round((cumpC / itemsC.length) * 100) : 0;

            return (
              <button
                key={c}
                type="button"
                onClick={() => onCambiarCargoActivo(c)}
                className={`flex-1 p-3.5 rounded-xl transition-all text-left flex items-center justify-between cursor-pointer border ${
                  activo
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-400 shadow-lg shadow-orange-950/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg shrink-0 ${activo ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {nombresCargos[c].icon}
                  </div>
                  <div>
                    <span className="block font-black text-xs sm:text-sm text-white">
                      {nombresCargos[c].titulo}
                    </span>
                    <span className={`block text-[10px] ${activo ? 'text-orange-100' : 'text-slate-400'}`}>
                      {itemsC.length} Necesidades evaluadas
                    </span>
                  </div>
                </div>

                <div className="text-right pl-2">
                  <span className={`text-xs font-mono font-black block ${activo ? 'text-white' : 'text-slate-300'}`}>
                    {pctC}%
                  </span>
                  <span className={`text-[9px] ${activo ? 'text-orange-200' : 'text-slate-500'}`}>
                    {cumpC}/{itemsC.length} OK
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner de progreso y acciones rápidas para el cargo seleccionado */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wide text-orange-600">
              Evaluación Activa
            </span>
            <span className="text-slate-300">·</span>
            <h3 className="font-black text-base text-slate-900">
              {nombresCargos[cargoActivo].titulo}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {nombresCargos[cargoActivo].desc}
          </p>

          {/* Barra de progreso */}
          <div className="pt-2 max-w-xl">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-700">Porcentaje de Cumplimiento:</span>
              <span className="font-mono text-orange-600 font-black">{porcentaje}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="bg-emerald-500 transition-all duration-300"
                style={{ width: `${(cumplidas / total) * 100}%` }}
                title={`Cumplidas: ${cumplidas}`}
              />
              <div
                className="bg-amber-400 transition-all duration-300"
                style={{ width: `${(enProceso / total) * 100}%` }}
                title={`En proceso: ${enProceso}`}
              />
              <div
                className="bg-rose-400 transition-all duration-300"
                style={{ width: `${(pendientes / total) * 100}%` }}
                title={`Pendientes: ${pendientes}`}
              />
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1.5">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                <span>Cumplidas: <strong>{cumplidas}</strong></span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                <span>En proceso: <strong>{enProceso}</strong></span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-400 inline-block" />
                <span>Pendientes: <strong>{pendientes}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Grupo de botones de acción */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setModalNuevaRevisionOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Registrar corte formal de evaluación en el historial"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Registrar Evaluación</span>
          </button>

          <button
            type="button"
            onClick={() => setModalHistorialOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Ver historial de seguimiento y revisiones previas"
          >
            <History className="h-4 w-4 text-slate-500" />
            <span>Historial ({historial.filter((h) => h.cargo === cargoActivo).length})</span>
          </button>

          <button
            type="button"
            onClick={handleDescargarExcel}
            disabled={isExportingExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Descargar este checklist en formato Excel (.xlsx)"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{isExportingExcel ? 'Generando...' : 'Descargar Excel'}</span>
          </button>

          <button
            type="button"
            onClick={() => setModalPdfOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Vista previa e impresión formal en PDF con firmas"
          >
            <Printer className="h-4 w-4" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Lista interactiva de necesidades */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Requerimientos Específicos de SST ({total} ítems)
          </span>
          <span className="text-[11px] text-slate-500">
            Haz clic en los selectores de estado para actualizar o en el icono de lápiz para editar evidencias y responsable
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {itemsDelCargo.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                item.estado === 'Cumplido'
                  ? 'hover:bg-emerald-50/20'
                  : item.estado === 'En proceso'
                  ? 'bg-amber-50/20 hover:bg-amber-50/40'
                  : 'bg-rose-50/20 hover:bg-rose-50/40'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="h-7 w-7 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                  {item.numero}
                </span>

                <div className="space-y-1.5 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {item.necesidad}
                  </h4>

                  {/* Observaciones y evidencias */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-0.5">
                    <div className="text-slate-600">
                      <strong className="text-slate-700">Observación: </strong>
                      <span>{item.observaciones || 'Sin registrar'}</span>
                    </div>
                    <div className="text-slate-600 flex items-center gap-1 truncate">
                      <Paperclip className="h-3 w-3 text-slate-400 shrink-0" />
                      <strong className="text-slate-700">Evidencia: </strong>
                      <span className="truncate italic">{item.evidencias || 'Sin soporte'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 font-mono">
                    <span>
                      <strong>Responsable:</strong> {item.responsable || 'Por asignar'}
                    </span>
                    <span>·</span>
                    <span>
                      <strong>Verificación:</strong> {item.fechaVerificacion || 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector interactivo de estado (3 opciones) y botón de edición */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleCambiarEstadoRapido(item.id, 'Cumplido')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      item.estado === 'Cumplido'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Cumplido</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCambiarEstadoRapido(item.id, 'En proceso')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      item.estado === 'En proceso'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-amber-700'
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    <span>En proceso</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCambiarEstadoRapido(item.id, 'Pendiente')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      item.estado === 'Pendiente'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-rose-700'
                    }`}
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>Pendiente</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => abrirEdicionItem(item)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-600 transition-colors cursor-pointer"
                  title="Editar observaciones, evidencias y responsable"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE EDICIÓN DETALLADA DE UN ÍTEM */}
      {itemEnEdicion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-orange-400" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  Editar Detalle de la Necesidad #{itemEnEdicion.numero}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setItemEnEdicion(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={guardarEdicionItem} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-bold">
                {itemEnEdicion.necesidad}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Estado de Cumplimiento:</label>
                <select
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value as EstadoCumplimientoChecklist)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                >
                  <option value="Cumplido">Cumplido</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Observaciones y Diagnóstico:</label>
                <textarea
                  rows={2}
                  value={editObservaciones}
                  onChange={(e) => setEditObservaciones(e.target.value)}
                  placeholder="Detalla el estado real del requisito en planta..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Evidencias o Documentos de Soporte:</label>
                <input
                  type="text"
                  value={editEvidencias}
                  onChange={(e) => setEditEvidencias(e.target.value)}
                  placeholder="Ej. Planilla de EPP firmada, certificado de curso, POE..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Responsable Asignado:</label>
                  <input
                    type="text"
                    value={editResponsable}
                    onChange={(e) => setEditResponsable(e.target.value)}
                    placeholder="Ej. Coordinador SST, Gerencia"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Fecha de Verificación:</label>
                  <input
                    type="date"
                    value={editFecha}
                    onChange={(e) => setEditFecha(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setItemEnEdicion(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR NUEVA EVALUACIÓN EN EL HISTORIAL */}
      {modalNuevaRevisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  Registrar Evaluación en Historial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalNuevaRevisionOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleGuardarRevisionHistorial} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-slate-800 space-y-1">
                <div className="font-bold text-orange-900">
                  Cargo Evaluado: {nombresCargos[cargoActivo].titulo}
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  Cumplimiento Actual: <strong>{porcentaje}%</strong> ({cumplidas} de {total} cumplidas)
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Responsable Evaluador: *</label>
                <input
                  type="text"
                  required
                  value={nuevoEvaluador}
                  onChange={(e) => setNuevoEvaluador(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Observaciones y Conclusiones:</label>
                <textarea
                  rows={3}
                  value={nuevasNotasGenerales}
                  onChange={(e) => setNuevasNotasGenerales(e.target.value)}
                  placeholder="Resumen del estado, avances logrados y compromisos para el próximo período..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNuevaRevisionOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Guardar en Historial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL DE SEGUIMIENTO */}
      {modalHistorialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-orange-400" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  Historial de Seguimiento — {nombresCargos[cargoActivo].titulo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalHistorialOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs">
              {historial.filter((h) => h.cargo === cargoActivo).length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  No hay revisiones previas registradas para este cargo.
                </div>
              ) : (
                historial
                  .filter((h) => h.cargo === cargoActivo)
                  .map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-slate-900 font-mono">
                            {reg.fecha}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-600 font-semibold">
                            {reg.responsableEvaluador}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-mono font-bold text-[11px]">
                          {reg.porcentajeCumplimiento}% Cumplimiento
                        </span>
                      </div>

                      <p className="text-slate-700 text-xs leading-relaxed">
                        {reg.observacionesGenerales}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1 font-mono">
                        <span>Cumplidas: <strong className="text-emerald-700">{reg.cumplidas}</strong></span>
                        <span>En proceso: <strong className="text-amber-700">{reg.enProceso}</strong></span>
                        <span>Pendientes: <strong className="text-rose-700">{reg.pendientes}</strong></span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setModalHistorialOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IMPRESIÓN PDF */}
      <ModalImpresionPdfChecklist
        cargo={cargoActivo}
        items={items}
        isOpen={modalPdfOpen}
        onClose={() => setModalPdfOpen(false)}
      />
    </div>
  );
};
