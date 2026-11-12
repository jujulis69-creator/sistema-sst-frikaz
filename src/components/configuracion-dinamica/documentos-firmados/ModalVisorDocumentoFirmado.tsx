import React, { useState } from 'react';
import {
  DocumentoFirmadoRecibido,
  EstadoDocumentoFirmado,
} from '../../../types/documentosFirmados';
import {
  actualizarEstadoDocumento,
  CUENTA_INSTITUCIONAL,
} from '../../../services/documentosFirmadosService';
import {
  X,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  User,
  ShieldCheck,
  Building2,
  Calendar,
  Check,
  Save,
  MessageSquare,
  History,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';

interface ModalVisorDocumentoFirmadoProps {
  isOpen: boolean;
  onClose: () => void;
  documento: DocumentoFirmadoRecibido;
  onEstadoActualizado?: (docActualizado: DocumentoFirmadoRecibido) => void;
}

export const ModalVisorDocumentoFirmado: React.FC<ModalVisorDocumentoFirmadoProps> = ({
  isOpen,
  onClose,
  documento: docInicial,
  onEstadoActualizado,
}) => {
  const [doc, setDoc] = useState<DocumentoFirmadoRecibido>(docInicial);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoDocumentoFirmado>(docInicial.estado);
  const [observaciones, setObservaciones] = useState(docInicial.observacionesRevision || '');
  const [nombreRevisor, setNombreRevisor] = useState(
    docInicial.revisadoPor || 'Talento Humano / Responsable SG-SST Frikaz'
  );
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [pestanaActiva, setPestanaActiva] = useState<'documento' | 'correo' | 'trazabilidad'>('documento');

  if (!isOpen) return null;

  const renderBadgeEstado = (estado: EstadoDocumentoFirmado) => {
    switch (estado) {
      case 'Aprobado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Aprobado</span>
          </span>
        );
      case 'Pendiente de revisión':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="h-3.5 w-3.5" />
            <span>Pendiente de revisión</span>
          </span>
        );
      case 'Requiere corrección':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Requiere corrección</span>
          </span>
        );
      case 'Recibido':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Mail className="h-3.5 w-3.5" />
            <span>Recibido</span>
          </span>
        );
    }
  };

  const handleGuardarCambiosEstado = () => {
    setGuardando(true);
    setTimeout(() => {
      const res = actualizarEstadoDocumento(doc.id, nuevoEstado, observaciones, nombreRevisor);
      if (res) {
        setDoc(res);
        if (onEstadoActualizado) onEstadoActualizado(res);
        setMensajeExito(`Estado actualizado a "${nuevoEstado}" exitosamente.`);
        setTimeout(() => setMensajeExito(null), 3500);
      }
      setGuardando(false);
    }, 400);
  };

  const handleDescargarSimulado = () => {
    // Generar un archivo de texto con encabezado oficial simulando el PDF firmado
    const contenido = `================================================================================
FRIKAZ S.A.S. — SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)
NIT: 901.458.723-1 — PLANTA BOSA, BOGOTÁ D.C.
================================================================================
DOCUMENTO RECIBIDO FIRMADO POR CORREO ELECTRÓNICO
Código de Trazabilidad: ${doc.envioId}
Fecha de Envío Original: ${doc.fechaEnvioOriginal}
Fecha de Recepción en Gmail: ${doc.fechaRecepcion}
Cuenta Receptora: ${doc.cuentaReceptora}

DATOS DEL TRABAJADOR:
Nombre: ${doc.nombreTrabajador}
Correo Electrónico: ${doc.correoTrabajador}
Cargo: ${doc.cargo}
Documento de Identidad: ${doc.detallesFirma.numeroDocumento || 'C.C. Registrada'}
Tipo de Documento: ${doc.tipoDocumento.toUpperCase()}

DECLARACIÓN FORMAL DE CONOCIMIENTO Y ACEPTACIÓN:
"${doc.detallesFirma.declaracionAceptacion}"

ESTADO DOCUMENTAL ACTUAL: ${doc.estado.toUpperCase()}
Revisado por: ${doc.revisadoPor || 'Pendiente de asignación'}
Observaciones de Auditoría: ${doc.observacionesRevision}

FIRMA DIGITALIZADA: [REGISTRADA Y VALIDADA]
Fecha de Firma: ${doc.detallesFirma.fechaFirma}
================================================================================`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nombreArchivoRecibido.replace('.pdf', '_CopiaCertificada.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {doc.envioId}
                </span>
                {renderBadgeEstado(doc.estado)}
                <span className="text-xs text-slate-400">
                  {doc.tipoDocumento === 'responsabilidades'
                    ? 'Responsabilidades del cargo'
                    : doc.tipoDocumento === 'politicas'
                    ? 'Políticas institucionales'
                    : 'Otros documentos recibidos'}
                </span>
              </div>

              <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                <span>{doc.nombreTrabajador}</span>
                <span className="text-xs font-normal text-slate-400">({doc.cargo})</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Archivo: {doc.nombreArchivoRecibido} · {doc.tamanoArchivo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDescargarSimulado}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Descargar copia del documento firmado"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Cerrar visor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notificación de éxito */}
        {mensajeExito && (
          <div className="bg-emerald-950 border-b border-emerald-500/40 px-6 py-2.5 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Pestañas de Navegación del Visor */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2 gap-2 text-xs">
          <button
            onClick={() => setPestanaActiva('documento')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              pestanaActiva === 'documento'
                ? 'bg-slate-900 text-white border-orange-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileText className="h-4 w-4 text-orange-400" />
            <span>Documento Firmado</span>
          </button>

          <button
            onClick={() => setPestanaActiva('correo')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              pestanaActiva === 'correo'
                ? 'bg-slate-900 text-white border-sky-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Mail className="h-4 w-4 text-sky-400" />
            <span>Detalles del Correo y Respuesta</span>
          </button>

          <button
            onClick={() => setPestanaActiva('trazabilidad')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              pestanaActiva === 'trazabilidad'
                ? 'bg-slate-900 text-white border-purple-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <History className="h-4 w-4 text-purple-400" />
            <span>Historial y Trazabilidad ({doc.trazabilidad.length})</span>
          </button>
        </div>

        {/* Contenido según pestaña */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* ======================================================== */}
          {/* PESTAÑA 1: VISOR DEL DOCUMENTO FIRMADO                   */}
          {/* ======================================================== */}
          {pestanaActiva === 'documento' && (
            <div className="space-y-6">
              {/* Hoja de papel simulada con formato formal de Frikaz S.A.S. */}
              <div className="bg-slate-950 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner text-slate-300 font-sans">
                {/* Membrete Oficial Frikaz */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-700 pb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                      F
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white tracking-wide uppercase">
                        FRIKAZ S.A.S. — SNACKS FRITOS
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        NIT: 901.458.723-1 · Planta Bosa, Bogotá D.C.
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right text-[11px] font-mono space-y-0.5">
                    <span className="block text-emerald-400 font-bold">
                      CÓDIGO: {doc.envioId}
                    </span>
                    <span className="block text-slate-400">
                      Recepción: {doc.fechaRecepcion}
                    </span>
                  </div>
                </div>

                {/* Título del Documento */}
                <div className="text-center py-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block font-bold">
                    SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    {doc.tipoDocumento === 'responsabilidades'
                      ? `ACTA FORMAL DE ASIGNACIÓN Y FIRMA DE RESPONSABILIDADES: ${doc.cargo.toUpperCase()}`
                      : 'DIVULGACIÓN Y COMPROMISO FIRMADO DE LA POLÍTICA DE SEGURIDAD Y SALUD EN EL TRABAJO'}
                  </h3>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Conforme al Decreto 1072 de 2015 y Resolución 0312 de 2019
                  </span>
                </div>

                {/* Tabla de Datos del Trabajador */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Nombre Completo del Trabajador:
                    </span>
                    <span className="text-xs font-black text-white block mt-0.5">
                      {doc.nombreTrabajador}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Número de Documento (C.C.):
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200 block mt-0.5">
                      {doc.detallesFirma.numeroDocumento || 'C.C. Cotejada en Hoja de Vida'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Cargo Desempeñado:
                    </span>
                    <span className="text-xs font-bold text-orange-300 block mt-0.5">
                      {doc.cargo}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Correo Electrónico Registrado:
                    </span>
                    <span className="text-xs font-mono text-slate-300 block mt-0.5">
                      {doc.correoTrabajador}
                    </span>
                  </div>
                </div>

                {/* Declaración de Aceptación */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Declaración Juramentada de Conocimiento y Conformidad:</span>
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                    &quot;{doc.detallesFirma.declaracionAceptacion}&quot;
                  </p>
                </div>

                {/* Cuadro de Firma y Validación */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
                  {/* Firma Trabajador */}
                  <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>FIRMA DEL TRABAJADOR</span>
                      <span className="text-emerald-400 font-bold">✓ RECIBIDA</span>
                    </div>

                    <div className="text-center py-2">
                      <span className="font-serif italic text-lg text-slate-200 font-bold tracking-widest block">
                        {doc.nombreTrabajador}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Firma manuscrita digitalizada / Token {doc.envioId}
                      </span>
                    </div>

                    <div className="text-center border-t border-slate-800 pt-1 text-[10px] text-slate-400">
                      Fecha: {doc.detallesFirma.fechaFirma}
                    </div>
                  </div>

                  {/* Sello de Recepción Talento Humano */}
                  <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>CUSTODIA TALENTO HUMANO / SG-SST</span>
                      <span className="text-orange-400 font-bold">SEDE BOSA</span>
                    </div>

                    <div className="text-center py-2 space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>FRIKAZ S.A.S. — ARCHIVO CENTRAL</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {doc.cuentaReceptora}
                      </span>
                    </div>

                    <div className="text-center border-t border-slate-800 pt-1 text-[10px] text-slate-400 font-mono">
                      Recepción Oficial: {doc.fechaRecepcion}
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel de Gestión del Estado por Talento Humano */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-orange-400" />
                    <h4 className="font-extrabold text-sm text-white">
                      Control y Revisión Técnica por Talento Humano / SST
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Cambio manual de estado con registro de trazabilidad
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Estado actual del documento:
                    </label>
                    <select
                      value={nuevoEstado}
                      onChange={(e) => setNuevoEstado(e.target.value as EstadoDocumentoFirmado)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                    >
                      <option value="Recibido">Recibido (En bandeja sin clasificar)</option>
                      <option value="Pendiente de revisión">Pendiente de revisión (En verificación)</option>
                      <option value="Aprobado">Aprobado (Conforme y archivado)</option>
                      <option value="Requiere corrección">Requiere corrección (Devolver al trabajador)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Responsable de la revisión:
                    </label>
                    <input
                      type="text"
                      value={nombreRevisor}
                      onChange={(e) => setNombreRevisor(e.target.value)}
                      placeholder="Nombre del auditor o analista SST"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Observaciones técnicas de la revisión:
                  </label>
                  <textarea
                    rows={2}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Detalles del cotejo de firma, legibilidad o motivo de aprobación/corrección..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleGuardarCambiosEstado}
                    disabled={guardando}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {guardando ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Actualizar estado documental</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PESTAÑA 2: DETALLES DEL CORREO ELECTRÓNICO               */}
          {/* ======================================================== */}
          {pestanaActiva === 'correo' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-sky-400" />
                    <h4 className="font-extrabold text-sm text-white">
                      Hilo de Correo Institucional (Gmail)
                    </h4>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    ID: {doc.hiloCorreoId}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <span className="text-slate-400 font-bold">De (Trabajador):</span>
                    <span className="sm:col-span-3 font-mono text-white">
                      {doc.nombreTrabajador} &lt;{doc.correoTrabajador}&gt;
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <span className="text-slate-400 font-bold">Para (Institucional):</span>
                    <span className="sm:col-span-3 font-mono text-emerald-400 font-semibold">
                      Frikaz S.A.S. &lt;{doc.cuentaReceptora}&gt;
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <span className="text-slate-400 font-bold">Asunto:</span>
                    <span className="sm:col-span-3 font-bold text-white">
                      {doc.asuntoCorreo}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <span className="text-slate-400 font-bold">Fecha Recepción:</span>
                    <span className="sm:col-span-3 font-mono text-slate-300">
                      {doc.fechaRecepcion}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <span className="text-slate-400 font-bold">Archivo Adjunto:</span>
                    <span className="sm:col-span-3 text-orange-300 font-mono font-bold flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      <span>{doc.nombreArchivoRecibido} ({doc.tamanoArchivo})</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="block text-[11px] font-bold text-slate-400 mb-2">
                    Cuerpo del mensaje devuelto por el trabajador:
                  </span>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {doc.mensajeTrabajador}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PESTAÑA 3: HISTORIAL Y TRAZABILIDAD                      */}
          {/* ======================================================== */}
          {pestanaActiva === 'trazabilidad' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-purple-400" />
                    <h4 className="font-extrabold text-sm text-white">
                      Línea de Vida y Trazabilidad del Documento
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-purple-300">
                    {doc.envioId}
                  </span>
                </div>

                <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {doc.trazabilidad.map((item, idx) => (
                    <div key={item.id || idx} className="relative flex items-start gap-4 pl-9">
                      <div className="absolute left-2.5 top-1.5 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-purple-500 ring-4 ring-slate-950" />
                      <div className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-white text-xs">
                            {item.evento}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {item.fechaHora}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {item.detalles}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Responsable: <strong className="text-slate-300">{item.responsable}</strong></span>
                          <span>Estado: <strong className="text-purple-300">{item.estadoResultante}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Building2 className="h-4 w-4 text-orange-400" />
            <span>Frikaz S.A.S. — Repositorio Digital de Documentos Firmados</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            Cerrar visor
          </button>
        </div>
      </div>
    </div>
  );
};
