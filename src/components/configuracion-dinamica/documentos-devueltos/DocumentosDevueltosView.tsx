// ============================================================================
// COMPONENTE: BANDEJA DE DOCUMENTOS DEVUELTOS POR CORREO - FRIKAZ S.A.S.
// Sede: Bosa, Bogotá D.C. — Cuenta Oficial: frikaz.fritosnacks@gmail.com
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  DocumentoDevuelto,
  TipoDocumentoCorreo,
  EstadoDocumentoCorreo,
  FiltrosDocumentosDevueltos,
} from '../../../types/documentosDevueltos';
import {
  getStoredDocumentosDevueltos,
  saveStoredDocumentosDevueltos,
  actualizarEstadoDocumento,
  simularRecepcionDocumentoTrabajador,
  calcularMetricasDocumentos,
  CUENTA_GMAIL_OFICIAL,
} from '../../../services/documentosDevueltosService';
import { ModalVisorDocumento } from './ModalVisorDocumento';
import { ModalNuevoEnvioDocumento } from './ModalNuevoEnvioDocumento';
import {
  Mail,
  Inbox,
  RefreshCw,
  Search,
  Filter,
  FileText,
  FileCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Plus,
  Send,
  Building2,
  Check,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  User,
} from 'lucide-react';

export const DocumentosDevueltosView: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentoDevuelto[]>(() =>
    getStoredDocumentosDevueltos()
  );

  // Estados de modales
  const [documentoSeleccionadoVisor, setDocumentoSeleccionadoVisor] = useState<DocumentoDevuelto | null>(null);
  const [modalNuevoEnvioOpen, setModalNuevoEnvioOpen] = useState(false);

  // Estado de sincronización de Gmail
  const [sincronizando, setSincronizando] = useState(false);
  const [mensajeSync, setMensajeSync] = useState<string | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | TipoDocumentoCorreo>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | EstadoDocumentoCorreo>('todos');

  // Métricas automáticas
  const metricas = useMemo(() => calcularMetricasDocumentos(documentos), [documentos]);

  // Lista filtrada
  const documentosFiltrados = useMemo(() => {
    return documentos.filter((doc) => {
      // Filtro tipo
      if (filtroTipo !== 'todos' && doc.tipoDocumento !== filtroTipo) {
        return false;
      }
      // Filtro estado
      if (filtroEstado !== 'todos' && doc.estado !== filtroEstado) {
        return false;
      }
      // Búsqueda libre
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const matchNombre = doc.nombreTrabajador.toLowerCase().includes(q);
        const matchCorreo = doc.correoElectronico.toLowerCase().includes(q);
        const matchCargo = doc.cargo.toLowerCase().includes(q);
        const matchAsunto = doc.asuntoCorreo.toLowerCase().includes(q);
        const matchArchivo = doc.nombreArchivo.toLowerCase().includes(q);
        const matchFecha = (doc.fechaRecepcion || doc.fechaEnvio).includes(q);
        if (
          !matchNombre &&
          !matchCorreo &&
          !matchCargo &&
          !matchAsunto &&
          !matchArchivo &&
          !matchFecha
        ) {
          return false;
        }
      }
      return true;
    });
  }, [documentos, filtroTipo, filtroEstado, busqueda]);

  // Sincronizar / Comprobar Gmail
  const handleSincronizarGmail = () => {
    setSincronizando(true);
    setMensajeSync('Conectando con la bandeja de frikaz.fritosnacks@gmail.com...');

    setTimeout(() => {
      // Comprueba si hay documentos pendientes de devolución y simula la recepción de uno
      const pendientes = documentos.filter((d) => d.estado === 'Pendiente de devolución');
      let actualizados = documentos;

      if (pendientes.length > 0) {
        const docARecibir = pendientes[0];
        actualizados = simularRecepcionDocumentoTrabajador(documentos, docARecibir.id);
        setDocumentos(actualizados);
        setMensajeSync(`¡Nuevo documento recibido de ${docARecibir.nombreTrabajador} (${docARecibir.cargo})!`);
      } else {
        setMensajeSync('Bandeja de Gmail sincronizada: No hay nuevas devoluciones pendientes por descargar.');
      }

      setSincronizando(false);
      setTimeout(() => setMensajeSync(null), 4000);
    }, 1200);
  };

  // Abrir documento con un solo clic
  const handleAbrirDocumento = (doc: DocumentoDevuelto) => {
    setDocumentoSeleccionadoVisor(doc);
  };

  // Descarga directa del archivo
  const handleDescargarArchivo = (e: React.MouseEvent, doc: DocumentoDevuelto) => {
    e.stopPropagation();
    const texto = `FRIKAZ S.A.S. — DOCUMENTO DEVUELTO POR CORREO
Colaborador: ${doc.nombreTrabajador} (${doc.cargo})
Correo: ${doc.correoElectronico}
Asunto: ${doc.asuntoCorreo}
Archivo: ${doc.nombreArchivo}
Fecha Recepción: ${doc.fechaRecepcion || 'Pendiente'}
Estado: ${doc.estado}
Cuenta Receptora: ${doc.cuentaReceptora}
Declaración: ${doc.detallesDocumento.declaracionAceptacion}`;

    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Actualizar estado del documento
  const handleCambiarEstado = (
    id: string,
    nuevoEstado: EstadoDocumentoCorreo,
    observaciones: string,
    revisor: string
  ) => {
    const actualizados = actualizarEstadoDocumento(
      documentos,
      id,
      nuevoEstado,
      observaciones,
      revisor
    );
    setDocumentos(actualizados);
    if (documentoSeleccionadoVisor && documentoSeleccionadoVisor.id === id) {
      const docActualizado = actualizados.find((d) => d.id === id);
      if (docActualizado) setDocumentoSeleccionadoVisor(docActualizado);
    }
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

  const getBadgeTipo = (tipo: TipoDocumentoCorreo) => {
    switch (tipo) {
      case 'responsabilidades':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'politicas':
        return 'bg-orange-50 text-orange-900 border-orange-200';
      case 'otros':
        return 'bg-sky-50 text-sky-900 border-sky-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal de la Bandeja */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0a192f] p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-orange-300 border border-orange-500/30">
                <Inbox className="h-3.5 w-3.5 text-orange-400" />
                Bandeja de Recepción Documental
              </span>
              <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30 font-mono">
                {CUENTA_GMAIL_OFICIAL}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Documentos Devueltos por Correo</span>
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Recepción, almacenamiento permanente y consulta de los documentos diligenciados y firmados por los trabajadores de <strong>Frikaz S.A.S.</strong> (responsabilidades de cargos, políticas institucionales y certificaciones). Permite la apertura de archivos en un clic, auditoría y control de aprobación por Talento Humano.
            </p>
          </div>

          {/* Acciones principales de sincronización y nuevo envío */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSincronizarGmail}
              disabled={sincronizando}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              title="Comprobar nuevos correos con documentos devueltos"
            >
              <RefreshCw className={`h-4 w-4 ${sincronizando ? 'animate-spin' : ''}`} />
              <span>{sincronizando ? 'Comprobando Gmail...' : 'Sincronizar Bandeja'}</span>
            </button>

            <button
              type="button"
              onClick={() => setModalNuevoEnvioOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              title="Registrar nuevo envío de documento a un trabajador"
            >
              <Plus className="h-4 w-4 text-orange-400" />
              <span>Nuevo Envío</span>
            </button>
          </div>
        </div>

        {/* Mensaje dinámico de sincronización */}
        {mensajeSync && (
          <div className="mt-4 p-2.5 px-4 rounded-xl bg-white/10 border border-white/20 text-xs text-orange-200 flex items-center gap-2">
            <Mail className="h-4 w-4 text-orange-400 shrink-0" />
            <span>{mensajeSync}</span>
          </div>
        )}
      </div>

      {/* Panel de Indicadores y Métricas Documentales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Total Registros
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {metricas.totalDocumentos}
          </div>
          <span className="text-[10px] text-slate-400 block">En seguimiento</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wide block">
            Recibidos
          </span>
          <div className="text-2xl font-black text-purple-800 font-mono">
            {metricas.recibidos}
          </div>
          <span className="text-[10px] text-purple-700 block">Listos para revisar</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide block">
            En Revisión
          </span>
          <div className="text-2xl font-black text-blue-800 font-mono">
            {metricas.enRevision}
          </div>
          <span className="text-[10px] text-blue-700 block">En verificación</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">
            Aprobados
          </span>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            {metricas.aprobados}
          </div>
          <span className="text-[10px] text-emerald-700 block">{metricas.porcentajeAprobacion}% de eficacia</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide block">
            Corrección
          </span>
          <div className="text-2xl font-black text-rose-800 font-mono">
            {metricas.requierenCorreccion}
          </div>
          <span className="text-[10px] text-rose-700 block">Ajustes pedidos</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block">
            Pendientes
          </span>
          <div className="text-2xl font-black text-amber-800 font-mono">
            {metricas.pendientesDevolucion}
          </div>
          <span className="text-[10px] text-amber-700 block">Sin responder</span>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por trabajador, correo, cargo, asunto, nombre de archivo o fecha..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro por tipo de documento */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-bold text-[11px]">Tipo:</span>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 font-semibold cursor-pointer"
            >
              <option value="todos">Todos los tipos ({documentos.length})</option>
              <option value="responsabilidades">Responsabilidades del cargo</option>
              <option value="politicas">Políticas institucionales</option>
              <option value="otros">Otros documentos</option>
            </select>
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-bold text-[11px]">Estado:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 font-semibold cursor-pointer"
            >
              <option value="todos">Todos los estados</option>
              <option value="Recibido">Recibido</option>
              <option value="En revisión">En revisión</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Requiere corrección">Requiere corrección</option>
              <option value="Pendiente de devolución">Pendiente de devolución</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Oficial de Documentos Devueltos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-bold divide-x divide-slate-800">
                <th className="py-3.5 px-4 w-48">Trabajador / Remitente</th>
                <th className="py-3.5 px-3 w-44">Correo Electrónico</th>
                <th className="py-3.5 px-3 w-36">Cargo</th>
                <th className="py-3.5 px-3 w-36 text-center">Tipo Documento</th>
                <th className="py-3.5 px-4 w-52">Archivo Recibido</th>
                <th className="py-3.5 px-4 w-56">Asunto del Correo</th>
                <th className="py-3.5 px-3 w-28 text-center">Fecha Recepción</th>
                <th className="py-3.5 px-3 w-32 text-center">Estado</th>
                <th className="py-3.5 px-3 w-36 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {documentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                    No se encontraron documentos en la bandeja con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                documentosFiltrados.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => handleAbrirDocumento(doc)}
                    className="hover:bg-slate-50 transition-colors divide-x divide-slate-100 cursor-pointer group"
                  >
                    {/* 1. Nombre trabajador */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400 group-hover:text-orange-500 shrink-0" />
                        <span>{doc.nombreTrabajador}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block pl-5">
                        ID: {doc.envioId}
                      </span>
                    </td>

                    {/* 2. Correo electrónico */}
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px] truncate max-w-[170px]">
                      {doc.correoElectronico}
                    </td>

                    {/* 3. Cargo */}
                    <td className="py-3 px-3 text-slate-800 font-medium">
                      {doc.cargo}
                    </td>

                    {/* 4. Tipo de documento */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeTipo(
                          doc.tipoDocumento
                        )}`}
                      >
                        {doc.tipoDocumento === 'responsabilidades'
                          ? 'Responsabilidades'
                          : doc.tipoDocumento === 'politicas'
                          ? 'Políticas'
                          : 'Otros Documentos'}
                      </span>
                    </td>

                    {/* 5. Nombre archivo recibido */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                        <FileText className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        <span className="truncate max-w-[200px]" title={doc.nombreArchivo}>
                          {doc.nombreArchivo}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block pl-5">
                        {doc.tamanoArchivo}
                      </span>
                    </td>

                    {/* 6. Asunto del correo */}
                    <td className="py-3 px-4 text-slate-600">
                      <p className="truncate max-w-[220px]" title={doc.asuntoCorreo}>
                        {doc.asuntoCorreo}
                      </p>
                    </td>

                    {/* 7. Fecha de recepción */}
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-600">
                      {doc.fechaRecepcion ? (
                        <span>{doc.fechaRecepcion}</span>
                      ) : (
                        <span className="text-amber-600 italic">Pendiente</span>
                      )}
                    </td>

                    {/* 8. Estado del documento */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black border uppercase tracking-wider ${getBadgeEstado(
                          doc.estado
                        )}`}
                      >
                        {doc.estado}
                      </span>
                    </td>

                    {/* 9. Acciones (Abrir documento con 1 clic + Descargar) */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAbrirDocumento(doc)}
                          className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Abrir y previsualizar documento en 1 clic"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Abrir</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDescargarArchivo(e, doc)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title="Descargar archivo al dispositivo"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla con resumen */}
        <div className="bg-slate-50 p-3 px-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span>
              Mostrando <strong className="text-slate-800">{documentosFiltrados.length}</strong> de{' '}
              <strong className="text-slate-800">{documentos.length}</strong> documentos registrados
            </span>
            <span>·</span>
            <span>Cuenta oficial: <strong className="text-slate-700">{CUENTA_GMAIL_OFICIAL}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Custodia documental conforme al Dec. 1072 de 2015
            </span>
          </div>
        </div>
      </div>

      {/* MODAL VISOR EN 1 CLIC */}
      <ModalVisorDocumento
        documento={documentoSeleccionadoVisor}
        isOpen={!!documentoSeleccionadoVisor}
        onClose={() => setDocumentoSeleccionadoVisor(null)}
        onCambiarEstado={handleCambiarEstado}
      />

      {/* MODAL REGISTRAR NUEVO ENVÍO */}
      <ModalNuevoEnvioDocumento
        isOpen={modalNuevoEnvioOpen}
        onClose={() => setModalNuevoEnvioOpen(false)}
        documentos={documentos}
        onActualizarDocumentos={setDocumentos}
        onAbrirDocumento={handleAbrirDocumento}
      />
    </div>
  );
};
