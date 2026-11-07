// ============================================================================
// MODAL: VISOR DE DOCUMENTO EN 1 CLIC CON TRAZABILIDAD Y ACCIONES
// Frikaz S.A.S. — Sede Bosa, Bogotá D.C.
// ============================================================================

import React, { useState } from 'react';
import {
  DocumentoDevuelto,
  EstadoDocumentoCorreo,
} from '../../../types/documentosDevueltos';
import {
  X,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Mail,
  User,
  Shield,
  Building2,
  History,
  Check,
  Edit3,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface ModalVisorDocumentoProps {
  documento: DocumentoDevuelto | null;
  isOpen: boolean;
  onClose: () => void;
  onCambiarEstado: (
    id: string,
    nuevoEstado: EstadoDocumentoCorreo,
    observaciones: string,
    revisor: string
  ) => void;
}

export const ModalVisorDocumento: React.FC<ModalVisorDocumentoProps> = ({
  documento,
  isOpen,
  onClose,
  onCambiarEstado,
}) => {
  if (!isOpen || !documento) return null;

  const [nuevoEstado, setNuevoEstado] = useState<EstadoDocumentoCorreo>(documento.estado);
  const [observaciones, setObservaciones] = useState(documento.observacionesRevision);
  const [nombreRevisor, setNombreRevisor] = useState(
    documento.revisadoPor || 'Lic. Martha Helena Roa (Talento Humano)'
  );
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState<'documento' | 'correo' | 'trazabilidad'>('documento');

  const handleGuardarCambios = (e: React.FormEvent) => {
    e.preventDefault();
    onCambiarEstado(documento.id, nuevoEstado, observaciones, nombreRevisor);
    setGuardadoExitoso(true);
    setTimeout(() => setGuardadoExitoso(false), 2500);
  };

  const handleDescargarDocumento = () => {
    // Genera descarga directa del archivo con contenido representativo formal
    const contenidoTexto = `FRIKAZ S.A.S. — REGISTRO DOCUMENTAL SG-SST
NIT: 901.458.723-1 — SEDE: BOSA, BOGOTÁ D.C.
============================================================
DOCUMENTO OFICIAL DEVUELTO POR CORREO ELECTRÓNICO

ID de Seguimiento: ${documento.envioId}
Hilo de Correo: ${documento.hiloCorreoId}
Cuenta Receptora: ${documento.cuentaReceptora}

DATOS DEL COLABORADOR:
Nombre: ${documento.nombreTrabajador}
Correo Electrónico: ${documento.correoElectronico}
Cargo: ${documento.cargo}
Documento de Identidad: ${documento.detallesDocumento.numeroDocumento || 'Registrado'}

DETALLES DEL ARCHIVO:
Tipo de Documento: ${documento.tipoDocumento.toUpperCase()}
Nombre del Archivo: ${documento.nombreArchivo}
Tamaño: ${documento.tamanoArchivo}
Fecha de Envío Inicial: ${documento.fechaEnvio}
Fecha de Recepción en Gmail: ${documento.fechaRecepcion || 'Pendiente'}
Estado Actual: ${documento.estado}

DECLARACIÓN FORMAL:
${documento.detallesDocumento.declaracionAceptacion}

FIRMA REGISTRADA: ${documento.detallesDocumento.firmaRegistrada ? 'SÍ (FIRMADO DIGITAL/FÍSICAMENTE)' : 'NO REGISTRADA'}
Fecha de Firma: ${documento.detallesDocumento.fechaFirma || 'No registrada'}

OBSERVACIONES DE TALENTO HUMANO / SST:
${documento.observacionesRevision}
Revisado por: ${documento.revisadoPor || 'En proceso'}
Fecha de Revisión: ${documento.fechaRevision || 'Pendiente'}
============================================================
Documento custodiado bajo el Decreto 1072 de 2015 y Resolución 0312 de 2019.`;

    const blob = new Blob([contenidoTexto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = documento.nombreArchivo.replace('.pdf', '') + '_Frikaz_SAS.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getBadgeEstado = (estado: EstadoDocumentoCorreo) => {
    switch (estado) {
      case 'Aprobado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'En revisión':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Recibido':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Requiere corrección':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Pendiente de devolución':
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera del visor */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white">
                  {documento.nombreArchivo}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getBadgeEstado(documento.estado)}`}>
                  {documento.estado}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Remitente: <strong>{documento.nombreTrabajador}</strong> ({documento.cargo}) · Recibido en {documento.cuentaReceptora}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDescargarDocumento}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Descargar archivo a tu dispositivo"
            >
              <Download className="h-4 w-4 text-orange-400" />
              <span className="hidden sm:inline">Descargar Archivo</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Barra de pestañas del visor */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPestanaActiva('documento')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                pestanaActiva === 'documento'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista del Documento
            </button>
            <button
              type="button"
              onClick={() => setPestanaActiva('correo')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                pestanaActiva === 'correo'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensaje y Respuestas de Correo
            </button>
            <button
              type="button"
              onClick={() => setPestanaActiva('trazabilidad')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                pestanaActiva === 'trazabilidad'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Historial de Trazabilidad ({documento.trazabilidad.length})
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            ID: {documento.envioId}
          </span>
        </div>

        {/* Cuerpo del Visor con scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-800 bg-slate-50/50">
          {/* PESTAÑA 1: VISTA OFICIAL DEL DOCUMENTO */}
          {pestanaActiva === 'documento' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
              {/* Membrete formal de Frikaz S.A.S. */}
              <div className="border border-slate-300 rounded-xl overflow-hidden bg-white">
                <div className="grid grid-cols-4 divide-x divide-slate-300 border-b border-slate-300">
                  <div className="p-3 bg-slate-50 text-center flex flex-col justify-center">
                    <span className="font-black text-sm text-orange-600">FRIKAZ S.A.S.</span>
                    <span className="text-[10px] text-slate-500 font-mono">NIT: 901.458.723-1</span>
                    <span className="text-[9px] text-slate-400">Bosa, Bogotá D.C.</span>
                  </div>
                  <div className="col-span-2 p-3 text-center flex flex-col justify-center">
                    <h3 className="font-black text-xs text-slate-900 uppercase">
                      SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO
                    </h3>
                    <h4 className="font-bold text-[11px] text-orange-600 uppercase mt-0.5">
                      {documento.tipoDocumento === 'responsabilidades'
                        ? `ASIGNACIÓN Y ACEPTACIÓN DE RESPONSABILIDADES — ${documento.cargo.toUpperCase()}`
                        : documento.tipoDocumento === 'politicas'
                        ? 'CONSTANCIA DE FORMALIZACIÓN Y DIVULGACIÓN DE LA POLÍTICA SST'
                        : `DOCUMENTO OFICIAL DEL SG-SST — ${documento.cargo.toUpperCase()}`}
                    </h4>
                  </div>
                  <div className="p-3 bg-slate-50 flex flex-col justify-center text-[10px] font-mono text-slate-600 space-y-0.5">
                    <div><strong>Código:</strong> {documento.envioId}</div>
                    <div><strong>Fecha Rec:</strong> {documento.fechaRecepcion || 'Pendiente'}</div>
                    <div><strong>Estado:</strong> {documento.estado}</div>
                  </div>
                </div>

                {/* Datos del colaborador en tabla formal */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 text-[11px] bg-slate-50/70 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Colaborador(a):</span>
                    <strong className="text-slate-900">{documento.nombreTrabajador}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Identificación:</span>
                    <strong className="text-slate-900">{documento.detallesDocumento.numeroDocumento || 'Verificada'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Cargo / Proceso:</span>
                    <strong className="text-slate-900">{documento.cargo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sede de Operación:</span>
                    <span className="text-slate-800">Bosa, Bogotá D.C.</span>
                  </div>
                </div>
              </div>

              {/* Contenido representativo según tipo */}
              <div className="space-y-4 text-slate-700 leading-relaxed text-xs">
                {documento.tipoDocumento === 'responsabilidades' ? (
                  <>
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                      1. Responsabilidades y Obligaciones Específicas en SST
                    </h4>
                    <p>
                      En el marco del Decreto Único Reglamentario 1072 de 2015 (Artículo 2.2.4.6.10) y la Resolución 0312 de 2019, el cargo de <strong>{documento.cargo}</strong> en <strong>Frikaz S.A.S.</strong> tiene asignadas las siguientes responsabilidades obligatorias:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      <li>Procurar el cuidado integral de su salud en el lugar de trabajo.</li>
                      <li>Suministrar información clara, veraz y completa sobre su estado de salud.</li>
                      <li>Cumplir las normas, reglamentos e instrucciones del SG-SST de Frikaz S.A.S.</li>
                      <li>Participar en las actividades de capacitación en SST y prevención de riesgos.</li>
                      <li>Utilizar de forma permanente y adecuada los elementos de protección personal suministrados.</li>
                      <li>Reportar de manera inmediata cualquier condición o acto inseguro en planta o ruta.</li>
                    </ul>
                  </>
                ) : documento.tipoDocumento === 'politicas' ? (
                  <>
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                      1. Compromisos de la Política de Seguridad y Salud en el Trabajo
                    </h4>
                    <p>
                      <strong>Frikaz S.A.S.</strong>, empresa dedicada a la elaboración y comercialización de snacks artesanales e industriales de papa, plátano y chicharrón, asume formalmente el compromiso de proteger la integridad física y mental de todos los colaboradores mediante la identificación oportuna de peligros, cumplimiento normativo y mejora continua.
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                      1. Información del Documento Recibido
                    </h4>
                    <p>
                      Documento técnico o probatorio remitido por el colaborador o proveedor para su custodia en el archivo maestro del SG-SST de Frikaz S.A.S.
                    </p>
                  </>
                )}

                {/* Declaración de Aceptación y Firma */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h5 className="font-black text-xs text-slate-900 uppercase">
                    Declaración Formal de Aceptación y Recibo
                  </h5>
                  <p className="italic text-slate-700 text-xs">
                    &quot;{documento.detallesDocumento.declaracionAceptacion}&quot;
                  </p>

                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-white flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-400 font-mono">Firma del Trabajador</span>
                        {documento.detallesDocumento.firmaRegistrada ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            <Check className="h-3 w-3" /> Firmado
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                            Sin firma
                          </span>
                        )}
                      </div>
                      <div className="py-2 text-center">
                        <span className="font-serif italic text-base text-slate-800 tracking-wider">
                          {documento.nombreTrabajador}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-1 text-[10px] text-slate-500 text-center">
                        Fecha de firma: {documento.detallesDocumento.fechaFirma || 'Pendiente'}
                      </div>
                    </div>

                    <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-white flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-400 font-mono">Validación Talento Humano / SST</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getBadgeEstado(documento.estado)}`}>
                          {documento.estado}
                        </span>
                      </div>
                      <div className="py-2 text-center text-xs font-bold text-slate-800">
                        {documento.revisadoPor || 'Pendiente de asignación'}
                      </div>
                      <div className="border-t border-slate-200 pt-1 text-[10px] text-slate-500 text-center">
                        {documento.fechaRevision || 'Fecha de revisión no registrada'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: MENSAJE Y HILO DE CORREO GMAIL */}
          {pestanaActiva === 'correo' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-500" />
                    <span className="font-bold text-xs text-slate-900">
                      Detalle del Correo Electrónico (Gmail)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Hilo: {documento.hiloCorreoId}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">De: <strong>{documento.nombreTrabajador}</strong> &lt;{documento.correoElectronico}&gt;</span>
                    <span className="text-slate-500">Para: <strong>Frikaz S.A.S.</strong> &lt;{documento.cuentaReceptora}&gt;</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block">Asunto:</span>
                    <strong className="text-slate-900">{documento.asuntoCorreo}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block">Archivo Adjunto Detectado:</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-orange-600">{documento.nombreArchivo}</span>
                      <span className="text-[11px] font-mono text-slate-500">{documento.tamanoArchivo}</span>
                    </div>
                  </div>
                </div>

                {/* Mensaje original vs Respuesta */}
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      1. Mensaje Original Enviado por la Aplicación ({documento.fechaEnvio}):
                    </span>
                    <p className="text-slate-700 whitespace-pre-line text-xs font-mono">
                      {documento.cuerpoMensajeOriginal}
                    </p>
                  </div>

                  {documento.fechaRecepcion ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                        2. Respuesta Recibida del Trabajador ({documento.fechaRecepcion}):
                      </span>
                      <p className="text-emerald-950 whitespace-pre-line text-xs font-mono">
                        {documento.cuerpoRespuestaTrabajador || 'Adjunto documento firmado.'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs">
                      El trabajador aún no ha respondido a este mensaje en Gmail.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: TRAZABILIDAD DOCUMENTAL */}
          {pestanaActiva === 'trazabilidad' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-orange-500" />
                    <span className="font-bold text-xs text-slate-900">
                      Registro de Auditoría y Trazabilidad del Documento
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {documento.envioId}
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {documento.trazabilidad.map((ev) => (
                    <div key={ev.id} className="relative space-y-1 text-xs">
                      <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-orange-500 border-2 border-white shadow-xs" />
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 text-xs">{ev.evento}</strong>
                        <span className="font-mono text-[10px] text-slate-400">{ev.fechaHora}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{ev.detalles}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>Autor: {ev.autor}</span>
                        <span>·</span>
                        <span>Estado: <strong>{ev.estadoResultante}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PANEL DE GESTIÓN Y CAMBIO DE ESTADO POR TALENTO HUMANO */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Edit3 className="h-4 w-4 text-orange-500" />
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                Gestión de Estado por Talento Humano / SST
              </h4>
            </div>

            <form onSubmit={handleGuardarCambios} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Actualizar Estado del Documento: *
                  </label>
                  <select
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value as EstadoDocumentoCorreo)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Recibido">Recibido (Devuelto por trabajador)</option>
                    <option value="En revisión">En revisión (En verificación de firmas)</option>
                    <option value="Aprobado">Aprobado (Aceptado y conforme)</option>
                    <option value="Requiere corrección">Requiere corrección (Ajustes necesarios)</option>
                    <option value="Pendiente de devolución">Pendiente de devolución</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Responsable de la Revisión:
                  </label>
                  <input
                    type="text"
                    value={nombreRevisor}
                    onChange={(e) => setNombreRevisor(e.target.value)}
                    placeholder="Nombre del revisor de Talento Humano"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Observaciones de la Verificación:
                </label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalla si la firma es legible, si faltan datos o si se aprueba formalmente..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  {guardadoExitoso && (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-lg">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Estado y trazabilidad actualizados exitosamente
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Cerrar Visor
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Guardar Estado</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
