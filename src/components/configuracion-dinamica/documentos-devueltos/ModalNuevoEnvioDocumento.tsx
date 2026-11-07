// ============================================================================
// MODAL: REGISTRAR NUEVO ENVÍO Y VINCULACIÓN DOCUMENTAL
// Conexión entre Organigrama, Políticas y Bandeja de Devolución
// ============================================================================

import React, { useState } from 'react';
import {
  DocumentoDevuelto,
  TipoDocumentoCorreo,
} from '../../../types/documentosDevueltos';
import {
  registrarNuevoEnvioDocumento,
  simularRecepcionDocumentoTrabajador,
  CUENTA_GMAIL_OFICIAL,
} from '../../../services/documentosDevueltosService';
import {
  Send,
  X,
  Mail,
  User,
  Crown,
  Users,
  Truck,
  FileText,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ModalNuevoEnvioDocumentoProps {
  isOpen: boolean;
  onClose: () => void;
  documentos: DocumentoDevuelto[];
  onActualizarDocumentos: (docs: DocumentoDevuelto[]) => void;
  onAbrirDocumento?: (doc: DocumentoDevuelto) => void;
}

const CARGOS_SUGERIDOS = [
  { cargo: 'Operario de Frito', email: 'juan.ramirez.frikaz@gmail.com', nombre: 'Juan Carlos Ramírez' },
  { cargo: 'Conductor', email: 'carlos.gomez.conductor@gmail.com', nombre: 'Carlos Eduardo Gómez' },
  { cargo: 'Operario de Empaque', email: 'maria.lopez.empaque@gmail.com', nombre: 'María Fernanda López' },
  { cargo: 'Operario de Pelado', email: 'pedro.castro.pelado@gmail.com', nombre: 'Pedro Nel Castro' },
  { cargo: 'Operario de Selección', email: 'diana.torres.seleccion@gmail.com', nombre: 'Diana Marcela Torres' },
  { cargo: 'Gerente General', email: 'gerencia.frikaz@gmail.com', nombre: 'Andrés Felipe Morales' },
  { cargo: 'Coordinador / Vigía SST', email: 'sst.frikaz@gmail.com', nombre: 'Ing. Carlos Mendoza' },
];

export const ModalNuevoEnvioDocumento: React.FC<ModalNuevoEnvioDocumentoProps> = ({
  isOpen,
  onClose,
  documentos,
  onActualizarDocumentos,
  onAbrirDocumento,
}) => {
  if (!isOpen) return null;

  const [cargoSeleccionado, setCargoSeleccionado] = useState(CARGOS_SUGERIDOS[0].cargo);
  const [nombreTrabajador, setNombreTrabajador] = useState(CARGOS_SUGERIDOS[0].nombre);
  const [correoTrabajador, setCorreoTrabajador] = useState(CARGOS_SUGERIDOS[0].email);
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumentoCorreo>('responsabilidades');
  const [asunto, setAsunto] = useState('');
  const [simularRespuestaInmediata, setSimularRespuestaInmediata] = useState(true);

  const handleCambioCargo = (cargo: string) => {
    setCargoSeleccionado(cargo);
    const sugerido = CARGOS_SUGERIDOS.find((c) => c.cargo === cargo);
    if (sugerido) {
      setNombreTrabajador(sugerido.nombre);
      setCorreoTrabajador(sugerido.email);
    }
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreTrabajador.trim() || !correoTrabajador.trim()) return;

    // 1. Registrar el envío
    const { documentosActualizados, nuevoDocId } = registrarNuevoEnvioDocumento(
      documentos,
      {
        nombreTrabajador: nombreTrabajador.trim(),
        correoElectronico: correoTrabajador.trim(),
        cargo: cargoSeleccionado,
        tipoDocumento,
        asuntoPersonalizado: asunto.trim() || undefined,
      }
    );

    let docsFinales = documentosActualizados;

    // 2. Si se marcó simular respuesta inmediata, simular la devolución por correo
    if (simularRespuestaInmediata) {
      docsFinales = simularRecepcionDocumentoTrabajador(documentosActualizados, nuevoDocId);
    }

    onActualizarDocumentos(docsFinales);

    // Si se desea abrirlo inmediatamente
    if (onAbrirDocumento) {
      const docCreado = docsFinales.find((d) => d.id === nuevoDocId);
      if (docCreado) onAbrirDocumento(docCreado);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-orange-400" />
            <div>
              <h3 className="font-bold text-sm">Registrar Envío de Documento a Trabajador</h3>
              <p className="text-[11px] text-slate-400">
                Conexión con Organigrama / Políticas · Notificación vía {CUENTA_GMAIL_OFICIAL}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleEnviar} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              1. Seleccionar Cargo del Colaborador (Organigrama): *
            </label>
            <select
              value={cargoSeleccionado}
              onChange={(e) => handleCambioCargo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
            >
              {CARGOS_SUGERIDOS.map((c) => (
                <option key={c.cargo} value={c.cargo}>
                  {c.cargo} — {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Nombre del Trabajador: *
              </label>
              <input
                type="text"
                required
                value={nombreTrabajador}
                onChange={(e) => setNombreTrabajador(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Correo Electrónico: *
              </label>
              <input
                type="email"
                required
                value={correoTrabajador}
                onChange={(e) => setCorreoTrabajador(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              2. Tipo de Documento a Remitir: *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTipoDocumento('responsabilidades')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  tipoDocumento === 'responsabilidades'
                    ? 'bg-purple-50 border-purple-400 text-purple-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block text-[11px]">Responsabilidades</span>
                <span className="text-[9px] text-slate-400">Del Cargo</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoDocumento('politicas')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  tipoDocumento === 'politicas'
                    ? 'bg-orange-50 border-orange-400 text-orange-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block text-[11px]">Políticas</span>
                <span className="text-[9px] text-slate-400">Institucionales</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoDocumento('otros')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  tipoDocumento === 'otros'
                    ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block text-[11px]">Otros</span>
                <span className="text-[9px] text-slate-400">Documentos</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Asunto del Correo (Opcional):
            </label>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Asunto personalizado o se generará con el código FRK-ENV-2026-XXX"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          {/* Opción de simular devolución inmediata para prueba de flujo */}
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="chk-simular"
              checked={simularRespuestaInmediata}
              onChange={(e) => setSimularRespuestaInmediata(e.target.checked)}
              className="mt-0.5 text-orange-600 rounded"
            />
            <label htmlFor="chk-simular" className="text-xs text-orange-950 cursor-pointer">
              <strong>Simular respuesta del trabajador inmediatamente:</strong>
              <span className="block text-[11px] text-orange-800">
                Genera la recepción automática con archivo firmado adjunto en estado «Recibido» para probar la apertura y revisión en 1 clic.
              </span>
            </label>
          </div>

          {/* Pie de modal */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span>Registrar y Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
