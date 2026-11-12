import React, { useState, useMemo, useEffect } from 'react';
import {
  DocumentoFirmadoRecibido,
  RegistroEnvioPendiente,
  EstadoDocumentoFirmado,
  TipoDocumentoFirmado,
} from '../../../types/documentosFirmados';
import {
  getStoredDocumentosFirmados,
  saveStoredDocumentosFirmados,
  getStoredEnviosPendientes,
  saveStoredEnviosPendientes,
  simularRespuestaTrabajador,
  calcularMetricasDocumentos,
  CUENTA_INSTITUCIONAL,
  sincronizarConMensajesGmail,
} from '../../../services/documentosFirmadosService';
import {
  getEmailServiceStatus,
  verifySmtpConnection,
  getEmailHistory,
  sendEmailReal,
  retryEmailSend,
  EmailHistoryItem,
  EmailServiceStatus,
  EstadoEnvioCorreo,
} from '../../../services/emailService';
import {
  getGmailProfile,
  searchGmailMessages,
  sendEmailViaGmailApi,
  GmailProfile,
} from '../../../services/gmailApiService';
import {
  getCurrentGoogleUser,
  getAccessToken,
} from '../../../services/gmailAuthService';
import { GoogleWorkspaceAuthButton } from '../../GoogleWorkspaceAuthButton';
import { ModalVisorDocumentoFirmado } from './ModalVisorDocumentoFirmado';
import { ModalEnviarDocumento } from './ModalEnviarDocumento';
import {
  Mail,
  Inbox,
  RefreshCw,
  Search,
  Filter,
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  ExternalLink,
  Eye,
  Send,
  Plus,
  Calendar,
  User,
  Shield,
  FileText,
  Sparkles,
  Paperclip,
  Check,
  Server,
  AlertCircle,
  HelpCircle,
  Activity,
  Terminal,
} from 'lucide-react';

export const DocumentosFirmadosRecibidosView: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentoFirmadoRecibido[]>(() =>
    getStoredDocumentosFirmados()
  );
  const [enviosPendientes, setEnviosPendientes] = useState<RegistroEnvioPendiente[]>(() =>
    getStoredEnviosPendientes()
  );

  // Estados de modales
  const [docParaVer, setDocParaVer] = useState<DocumentoFirmadoRecibido | null>(null);
  const [isVisorOpen, setIsVisorOpen] = useState(false);
  const [isModalEnvioOpen, setIsModalEnvioOpen] = useState(false);

  // Filtros de búsqueda
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastNoticia, setToastNoticia] = useState<string | null>(null);

  // Pestaña activa: recibidos | pendientes | historial_real
  const [vistaActiva, setVistaActiva] = useState<'recibidos' | 'pendientes' | 'historial_real'>('recibidos');

  // Estados para servicio real de correo
  const [emailStatus, setEmailStatus] = useState<EmailServiceStatus | null>(null);
  const [verificandoSmtp, setVerificandoSmtp] = useState(false);
  const [smtpVerifyResult, setSmtpVerifyResult] = useState<{ success: boolean; message: string } | null>(null);
  const [emailHistoryList, setEmailHistoryList] = useState<EmailHistoryItem[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  // Formulario de prueba de correo directo
  const [testTo, setTestTo] = useState('');
  const [testSubject, setTestSubject] = useState('Prueba de entrega SG-SST – Frikaz S.A.S.');
  const [testMessage, setTestMessage] = useState(
    'Este es un mensaje de prueba emitido desde la plataforma SG-SST de Frikaz S.A.S. para verificar la recepción real en el servidor destinatario.'
  );
  const [enviandoPrueba, setEnviandoPrueba] = useState(false);
  const [resultadoPrueba, setResultadoPrueba] = useState<any>(null);

  const triggerToast = (msg: string) => {
    setToastNoticia(msg);
    setTimeout(() => setToastNoticia(null), 4000);
  };

  // Cargar estado del servicio y el historial de correos del backend
  const cargarDiagnosticoYHistorial = async () => {
    setCargandoHistorial(true);
    try {
      const [status, history] = await Promise.all([
        getEmailServiceStatus(),
        getEmailHistory(),
      ]);
      setEmailStatus(status);
      setEmailHistoryList(history);
    } catch (err) {
      console.error('Error cargando diagnóstico/historial:', err);
    } finally {
      setCargandoHistorial(false);
    }
  };

  useEffect(() => {
    cargarDiagnosticoYHistorial();
  }, []);

  const handleVerificarSmtp = async () => {
    setVerificandoSmtp(true);
    setSmtpVerifyResult(null);
    try {
      const res = await verifySmtpConnection();
      setSmtpVerifyResult(res);
      const status = await getEmailServiceStatus();
      setEmailStatus(status);
    } catch (err: any) {
      setSmtpVerifyResult({
        success: false,
        message: `Fallo inesperado: ${err.message || err}`,
      });
    } finally {
      setVerificandoSmtp(false);
    }
  };

  const [testProvider, setTestProvider] = useState<'gmail' | 'smtp'>('gmail');

  const handleEnviarPrueba = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTo.trim() || !testTo.includes('@')) {
      triggerToast('Ingrese un correo de destino válido para la prueba.');
      return;
    }

    setEnviandoPrueba(true);
    setResultadoPrueba(null);

    try {
      if (testProvider === 'gmail') {
        const token = await getAccessToken();
        if (!token) {
          throw new Error('Debe conectar su cuenta de Google Workspace primero (botón superior "Conectar Gmail").');
        }
        const resGmail = await sendEmailViaGmailApi({
          to: testTo.trim(),
          subject: testSubject.trim(),
          text: testMessage,
        });

        if (resGmail.success) {
          setResultadoPrueba({
            success: true,
            status: 'Entregado vía Gmail API',
            messageId: resGmail.messageId,
            trackingCode: `GMAIL-${resGmail.messageId?.substring(0, 8) || 'OK'}`,
            response: `Despacho exitoso procesado por los servidores de Google Workspace Gmail API. Thread: ${resGmail.threadId}`,
          });
          triggerToast(`¡Prueba enviada con éxito hacia ${testTo} mediante Gmail API!`);
        } else {
          setResultadoPrueba({
            success: false,
            status: 'Error en Gmail API',
            error: resGmail.error || resGmail.details,
          });
          triggerToast(`Fallo en el envío: ${resGmail.error}`);
        }
      } else {
        const res = await sendEmailReal({
          to: testTo.trim(),
          subject: testSubject.trim(),
          text: testMessage,
          tipoNotificacion: 'Prueba de Conectividad SMTP',
          workerName: 'Verificador Técnico Frikaz',
          cargo: 'Auditoría SG-SST',
        });
        setResultadoPrueba(res);
        await cargarDiagnosticoYHistorial();
        if (res.success) {
          triggerToast(`¡Prueba enviada con éxito hacia ${testTo}!`);
        } else {
          triggerToast(`Fallo en el envío: ${res.error || res.status}`);
        }
      }
    } catch (err: any) {
      setResultadoPrueba({
        success: false,
        status: 'Error en el envío',
        error: err.message,
      });
    } finally {
      setEnviandoPrueba(false);
    }
  };

  const handleReintentarCorreo = async (id: string) => {
    triggerToast('Reintentando envío de correo en el servidor...');
    const res = await retryEmailSend(id);
    await cargarDiagnosticoYHistorial();
    if (res.success) {
      triggerToast('¡Reintento completado y entregado al proveedor!');
    } else {
      triggerToast(`Reintento fallido: ${res.error || res.details || res.status}`);
    }
  };

  // Recalcular métricas
  const metricas = useMemo(() => calcularMetricasDocumentos(documentos), [documentos]);

  // Sincronizar con Gmail (API oficial + almacenamiento local)
  const handleSincronizarGmail = async () => {
    setIsSyncing(true);
    try {
      const token = await getAccessToken();
      let agregadosGmail = 0;
      if (token) {
        // Consultar mensajes con adjuntos o respuestas en Gmail API
        const mensajesGmail = await searchGmailMessages(
          'subject:FRK-ENV OR "Frikaz S.A.S." OR "Responsabilidades" OR "Firmado"',
          15
        );
        if (mensajesGmail && mensajesGmail.length > 0) {
          const resultado = sincronizarConMensajesGmail(mensajesGmail);
          agregadosGmail = resultado.totalAgregados;
        }
      }

      const rec = getStoredDocumentosFirmados();
      const env = getStoredEnviosPendientes();
      setDocumentos([...rec]);
      setEnviosPendientes([...env]);
      await cargarDiagnosticoYHistorial();

      if (agregadosGmail > 0) {
        triggerToast(
          `¡Sincronización Gmail exitosa! Se incorporaron ${agregadosGmail} nuevos documentos firmados devueltos por trabajadores.`
        );
      } else {
        triggerToast(
          `Bandeja sincronizada con ${CUENTA_INSTITUCIONAL}. Se verificaron ${rec.length} documentos recibidos.`
        );
      }
    } catch (err) {
      console.error('Error sincronizando con Gmail:', err);
      const rec = getStoredDocumentosFirmados();
      setDocumentos([...rec]);
      triggerToast(`Bandeja actualizada con ${rec.length} documentos recibidos.`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Simular respuesta del trabajador devolviendo documento firmado
  const handleSimularDevolucion = (envio: RegistroEnvioPendiente) => {
    const nuevoRecibido = simularRespuestaTrabajador(envio);
    const actualizadosRec = getStoredDocumentosFirmados();
    const actualizadosEnv = getStoredEnviosPendientes();
    setDocumentos(actualizadosRec);
    setEnviosPendientes(actualizadosEnv);
    setVistaActiva('recibidos');
    triggerToast(
      `¡Correo entrante recibido! ${envio.nombreTrabajador} devolvió ${nuevoRecibido.nombreArchivoRecibido}.`
    );
  };

  // Abrir visor de documento con 1 clic
  const handleAbrirDocumento = (doc: DocumentoFirmadoRecibido) => {
    setDocParaVer(doc);
    setIsVisorOpen(true);
  };

  // Actualización desde el visor
  const handleDocumentoActualizado = (docAct: DocumentoFirmadoRecibido) => {
    setDocumentos((prev) => prev.map((d) => (d.id === docAct.id ? docAct : d)));
  };

  // Filtrado de documentos recibidos
  const documentosFiltrados = useMemo(() => {
    return documentos.filter((d) => {
      const q = busquedaTexto.toLowerCase().trim();
      if (q) {
        const coincide =
          d.nombreTrabajador.toLowerCase().includes(q) ||
          d.correoTrabajador.toLowerCase().includes(q) ||
          d.cargo.toLowerCase().includes(q) ||
          d.asuntoCorreo.toLowerCase().includes(q) ||
          d.nombreArchivoRecibido.toLowerCase().includes(q) ||
          d.envioId.toLowerCase().includes(q);
        if (!coincide) return false;
      }

      if (filtroTipo !== 'todos' && d.tipoDocumento !== filtroTipo) {
        return false;
      }

      if (filtroEstado !== 'todos' && d.estado !== filtroEstado) {
        return false;
      }

      return true;
    });
  }, [documentos, busquedaTexto, filtroTipo, filtroEstado]);

  const renderBadgeEstado = (estado: EstadoDocumentoFirmado) => {
    switch (estado) {
      case 'Aprobado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Aprobado</span>
          </span>
        );
      case 'Pendiente de revisión':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            <Clock className="h-3 w-3 text-amber-400" />
            <span>Pendiente de revisión</span>
          </span>
        );
      case 'Requiere corrección':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
            <AlertTriangle className="h-3 w-3 text-rose-400" />
            <span>Requiere corrección</span>
          </span>
        );
      case 'Recibido':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 whitespace-nowrap">
            <Mail className="h-3 w-3 text-sky-400" />
            <span>Recibido</span>
          </span>
        );
    }
  };

  const renderBadgeEstadoEmail = (estado: EstadoEnvioCorreo) => {
    switch (estado) {
      case 'Enviado correctamente al proveedor':
      case 'Entregado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>{estado}</span>
          </span>
        );
      case 'Enviando':
      case 'Pendiente de envío':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            <Clock className="h-3 w-3 text-amber-400" />
            <span>{estado}</span>
          </span>
        );
      case 'Rechazado por el servidor destinatario':
      case 'Error en el envío':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
            <AlertCircle className="h-3 w-3 text-rose-400" />
            <span>{estado}</span>
          </span>
        );
    }
  };

  const formatearTipoDocumento = (tipo: TipoDocumentoFirmado) => {
    switch (tipo) {
      case 'responsabilidades':
        return 'Responsabilidades del cargo';
      case 'politicas':
        return 'Políticas institucionales';
      case 'otros':
      default:
        return 'Otros documentos recibidos';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast flotante */}
      {toastNoticia && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastNoticia}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. HEADER OFICIAL DEL SUBAPARTADO                           */}
      {/* ============================================================ */}
      <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0a192f] p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/20 px-3 py-1 text-xs font-black tracking-wider uppercase text-sky-300 border border-sky-500/30">
                <Inbox className="h-3.5 w-3.5 text-sky-400" />
                Bandeja de Recepción Documental
              </span>
              <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Mail className="h-3 w-3 text-emerald-400" />
                <span>{CUENTA_INSTITUCIONAL}</span>
              </span>
              <span className="rounded-md bg-purple-500/20 px-2.5 py-1 text-[11px] font-bold text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Server className="h-3 w-3 text-purple-400" />
                <span>Servidor SMTP / Backend Activo</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>Documentos devueltos por correo y gestión de envíos</span>
              <span className="text-sky-400 font-mono text-base">[Frikaz S.A.S.]</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Consulte, organice y audite todos los documentos que los trabajadores responden y devuelven firmados a través del correo electrónico institucional. Vincula automáticamente las responsabilidades de los cargos y las políticas del SG-SST enviadas con envíos reales verificados.
            </p>
          </div>

          {/* Botones de acción del header */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <GoogleWorkspaceAuthButton compact={false} />

            <button
              onClick={handleSincronizarGmail}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              title="Verificar y sincronizar nuevos correos entrantes"
            >
              <RefreshCw className={`h-4 w-4 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Bandeja'}</span>
            </button>

            <button
              onClick={() => setIsModalEnvioOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer"
              title="Emitir nuevo envío real de documento a un trabajador"
            >
              <Send className="h-4 w-4" />
              <span>Nuevo envío por correo real</span>
            </button>
          </div>
        </div>

        {/* Resumen de conexión activa */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 flex-wrap">
            <div className={`h-2 w-2 rounded-full ${emailStatus?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-semibold">Servicio de Envío:</span>
            <span className="font-mono text-emerald-300">{emailStatus?.provider || 'SMTP'}</span>
            <span className="text-slate-400">· Remitente:</span>
            <span className="font-mono text-white">{CUENTA_INSTITUCIONAL}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>Envíos por responder: <strong className="text-orange-400">{enviosPendientes.length}</strong></span>
            <span>Total Recibidos: <strong className="text-sky-400">{documentos.length}</strong></span>
            <span>Historial real servidor: <strong className="text-emerald-400">{emailHistoryList.length}</strong></span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TARJETAS DE INDICADORES (KPIS)                           */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Recibidos</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-white font-mono">{metricas.totalRecibidos}</span>
            <Inbox className="h-4 w-4 text-sky-400" />
          </div>
          <span className="text-[10px] text-slate-400 block">Documentos en buzón</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-sky-400 block">Recibidos</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-sky-300 font-mono">{metricas.recibidos}</span>
            <Mail className="h-4 w-4 text-sky-400" />
          </div>
          <span className="text-[10px] text-slate-400 block">Por clasificar</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">Pendientes Revisión</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-amber-300 font-mono">{metricas.pendientesRevision}</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-[10px] text-slate-400 block">En cola de auditoría</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Aprobados</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-300 font-mono">{metricas.aprobados}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-400 block">Conformes y firmados</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-rose-400 block">Requieren Corrección</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-rose-300 font-mono">{metricas.requierenCorreccion}</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <span className="text-[10px] text-slate-400 block">Firma borrosa o faltante</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-purple-400 block">% Aprobación</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-purple-300 font-mono">{metricas.porcentajeAprobados}%</span>
            <FileCheck2 className="h-4 w-4 text-purple-400" />
          </div>
          <span className="text-[10px] text-slate-400 block">Cumplimiento formal</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. SELECTOR DE VISTA: RECIBIDOS / PENDIENTES / HISTORIAL REAL */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setVistaActiva('recibidos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              vistaActiva === 'recibidos'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>1. Bandeja de Documentos Recibidos ({documentos.length})</span>
          </button>

          <button
            onClick={() => setVistaActiva('pendientes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              vistaActiva === 'pendientes'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>2. Envíos en espera de respuesta ({enviosPendientes.length})</span>
          </button>

          <button
            onClick={() => {
              setVistaActiva('historial_real');
              cargarDiagnosticoYHistorial();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              vistaActiva === 'historial_real'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="h-4 w-4 text-purple-400" />
            <span>3. Historial Real de Envíos y Diagnóstico SMTP ({emailHistoryList.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Cuenta: <strong className="text-white font-mono">{CUENTA_INSTITUCIONAL}</strong>
        </span>
      </div>

      {/* ============================================================ */}
      {/* VISTA 1: BANDEJA DE DOCUMENTOS RECIBIDOS (TABLA DE 9 COLS)   */}
      {/* ============================================================ */}
      {vistaActiva === 'recibidos' && (
        <div className="space-y-4">
          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={busquedaTexto}
                onChange={(e) => setBusquedaTexto(e.target.value)}
                placeholder="Buscar por trabajador, correo, cargo, archivo o código FRK-ENV..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-400 font-bold">Tipo:</span>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="todos" className="bg-slate-900 text-white">Todos los tipos</option>
                  <option value="responsabilidades" className="bg-slate-900 text-white">Responsabilidades del cargo</option>
                  <option value="politicas" className="bg-slate-900 text-white">Políticas institucionales</option>
                  <option value="otros" className="bg-slate-900 text-white">Otros documentos</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-400 font-bold">Estado:</span>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="todos" className="bg-slate-900 text-white">Todos los estados</option>
                  <option value="Recibido" className="bg-slate-900 text-white">Recibido</option>
                  <option value="Pendiente de revisión" className="bg-slate-900 text-white">Pendiente de revisión</option>
                  <option value="Aprobado" className="bg-slate-900 text-white">Aprobado</option>
                  <option value="Requiere corrección" className="bg-slate-900 text-white">Requiere corrección</option>
                </select>
              </div>

              {(busquedaTexto || filtroTipo !== 'todos' || filtroEstado !== 'todos') && (
                <button
                  onClick={() => {
                    setBusquedaTexto('');
                    setFiltroTipo('todos');
                    setFiltroEstado('todos');
                  }}
                  className="text-xs text-sky-400 hover:text-white px-2 py-1 font-semibold cursor-pointer"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* TABLA PRINCIPAL DE 9 COLUMNAS */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <th className="py-3 px-3.5">1. Nombre del trabajador</th>
                    <th className="py-3 px-3.5">2. Correo electrónico</th>
                    <th className="py-3 px-3.5">3. Cargo</th>
                    <th className="py-3 px-3.5">4. Tipo de documento</th>
                    <th className="py-3 px-3.5">5. Nombre del documento recibido</th>
                    <th className="py-3 px-3.5">6. Asunto del correo</th>
                    <th className="py-3 px-3.5">7. Fecha de recepción</th>
                    <th className="py-3 px-3.5">8. Estado</th>
                    <th className="py-3 px-3.5 text-center">9. Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200 font-sans">
                  {documentosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Inbox className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                        <span className="block font-bold">No se encontraron documentos firmados</span>
                        <span className="text-[11px] text-slate-500">
                          Ajuste los términos de búsqueda o verifique la pestaña de envíos pendientes.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    documentosFiltrados.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/50 transition-colors group"
                      >
                        {/* 1. Nombre del trabajador */}
                        <td className="py-3.5 px-3.5 font-bold text-white whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                              {item.nombreTrabajador.charAt(0)}
                            </div>
                            <div>
                              <span className="block">{item.nombreTrabajador}</span>
                              <span className="text-[10px] font-mono text-slate-400 block">
                                {item.envioId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Correo electrónico del trabajador */}
                        <td className="py-3.5 px-3.5 font-mono text-[11px] text-slate-300">
                          <span className="hover:text-sky-300 transition-colors">
                            {item.correoTrabajador}
                          </span>
                        </td>

                        {/* 3. Cargo */}
                        <td className="py-3.5 px-3.5 font-medium text-slate-300">
                          <span className="bg-slate-800/90 px-2 py-0.5 rounded text-[11px] text-slate-200">
                            {item.cargo}
                          </span>
                        </td>

                        {/* 4. Tipo de documento */}
                        <td className="py-3.5 px-3.5">
                          <span className="text-[11px] font-semibold text-slate-300">
                            {formatearTipoDocumento(item.tipoDocumento)}
                          </span>
                        </td>

                        {/* 5. Nombre del documento recibido */}
                        <td className="py-3.5 px-3.5 max-w-[200px]">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-orange-300 truncate" title={item.nombreArchivoRecibido}>
                            <Paperclip className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                            <span className="truncate">{item.nombreArchivoRecibido}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block pl-5">
                            {item.tamanoArchivo}
                          </span>
                        </td>

                        {/* 6. Asunto del correo */}
                        <td className="py-3.5 px-3.5 max-w-[220px]">
                          <span className="text-[11px] text-slate-300 truncate block" title={item.asuntoCorreo}>
                            {item.asuntoCorreo}
                          </span>
                        </td>

                        {/* 7. Fecha de recepción */}
                        <td className="py-3.5 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span>{item.fechaRecepcion}</span>
                          </div>
                        </td>

                        {/* 8. Estado del documento */}
                        <td className="py-3.5 px-3.5">
                          {renderBadgeEstado(item.estado)}
                        </td>

                        {/* 9. Acción para abrir el documento */}
                        <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleAbrirDocumento(item)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-950/40 flex items-center gap-1.5 cursor-pointer mx-auto group-hover:scale-105"
                            title="Abrir y visualizar el documento firmado con 1 clic"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Abrir documento</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer de la tabla */}
            <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Mostrando <strong className="text-white">{documentosFiltrados.length}</strong> de{' '}
                <strong className="text-white">{documentos.length}</strong> documentos firmados recibidos
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Aprobados: {metricas.aprobados}
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Pendientes: {metricas.pendientesRevision}
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Corrección: {metricas.requierenCorreccion}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 2: ENVÍOS EN ESPERA DE RESPUESTA DEL TRABAJADOR        */}
      {/* ============================================================ */}
      {vistaActiva === 'pendientes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Despachos Realizados a la Espera de Devolución Firmada
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Estos documentos fueron emitidos desde el Organigrama o Políticas. Puede simular la devolución firmada por el trabajador para probar el flujo de recepción instantánea.
              </p>
            </div>

            <button
              onClick={() => setIsModalEnvioOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo envío manual</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enviosPendientes.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <span className="block font-bold">No hay envíos pendientes de respuesta</span>
                <span className="text-[11px] text-slate-500">
                  Todos los despachos han recibido sus correspondientes documentos firmados.
                </span>
              </div>
            ) : (
              enviosPendientes.map((env) => (
                <div
                  key={env.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        {env.envioId}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1.5">
                        {env.nombreTrabajador}
                      </h4>
                      <p className="text-xs text-slate-400">{env.cargo}</p>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Clock className="h-3 w-3" />
                      <span>Esperando firma</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 text-xs space-y-1.5 font-mono text-[11px]">
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>Destino:</span>
                      <span className="text-slate-200">{env.correoTrabajador}</span>
                    </div>
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>Documento enviado:</span>
                      <span className="text-orange-300 truncate max-w-[200px]" title={env.nombreDocumentoEnviado}>
                        {env.nombreDocumentoEnviado}
                      </span>
                    </div>
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>Fecha emisión:</span>
                      <span className="text-slate-300">{env.fechaEnvio}</span>
                    </div>
                  </div>

                  {/* Botón de Simulación de Respuesta */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">
                      Prueba en vivo de devolución:
                    </span>
                    <button
                      onClick={() => handleSimularDevolucion(env)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer"
                      title="Simular que el trabajador respondió al correo con el archivo PDF firmado"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      <span>Simular respuesta con PDF firmado</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 3: HISTORIAL REAL DE ENVÍOS Y DIAGNÓSTICO DEL SERVIDOR */}
      {/* ============================================================ */}
      {vistaActiva === 'historial_real' && (
        <div className="space-y-6">
          {/* Tarjeta de Diagnóstico Google Workspace Gmail API */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Google Workspace API (1P)
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Conexión Google Workspace Activa</span>
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Integración Oficial de Gmail (OAuth 2.0 y REST API v1)
                </h3>
                <p className="text-xs text-slate-400">
                  Permite el despacho y la recepción directa de documentos firmados en el buzón institucional sin intermediarios SMTP.
                </p>
              </div>

              <div>
                <GoogleWorkspaceAuthButton compact={false} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Canal Oficial</span>
                <span className="font-bold text-white text-sm font-mono mt-0.5 block">
                  Gmail REST API v1
                </span>
                <span className="text-[10px] text-slate-400">gmail.googleapis.com</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Cuenta Destinada</span>
                <span className="font-bold text-emerald-400 text-sm font-mono mt-0.5 block truncate">
                  {CUENTA_INSTITUCIONAL}
                </span>
                <span className="text-[10px] text-slate-400">Frikaz S.A.S. Oficial</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Capacidad Activa</span>
                <span className="font-bold text-sky-400 text-sm font-mono mt-0.5 block">
                  Envío + Lectura + Búsqueda
                </span>
                <span className="text-[10px] text-slate-400">Tracking FRK-ENV en tiempo real</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Diagnóstico de Configuración SMTP */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Arquitectura de Envíos Reales
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 border ${
                      emailStatus?.configured
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                        : 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        emailStatus?.configured ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                      }`}
                    />
                    <span>{emailStatus?.configured ? 'Servicio Configurado' : 'Pendiente de Credenciales'}</span>
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Diagnóstico y Verificación del Servidor de Correo
                </h3>
                <p className="text-xs text-slate-400">
                  Valida la conexión SMTP en vivo hacia los servidores de correo y la persistencia de mensajes despachados.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={cargarDiagnosticoYHistorial}
                  disabled={cargandoHistorial}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${cargandoHistorial ? 'animate-spin' : ''}`} />
                  <span>Actualizar estado</span>
                </button>

                <button
                  onClick={handleVerificarSmtp}
                  disabled={verificandoSmtp}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Activity className={`h-4 w-4 ${verificandoSmtp ? 'animate-spin' : ''}`} />
                  <span>{verificandoSmtp ? 'Verificando con SMTP...' : 'Probar conexión SMTP'}</span>
                </button>
              </div>
            </div>

            {/* Resultado de verificación SMTP */}
            {smtpVerifyResult && (
              <div
                className={`p-4 rounded-xl border text-xs flex items-start gap-3 animate-fadeIn ${
                  smtpVerifyResult.success
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                }`}
              >
                {smtpVerifyResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {smtpVerifyResult.success
                      ? 'Conexión SMTP exitosa'
                      : 'Fallo al verificar conexión con el servidor'}
                  </h4>
                  <p className="mt-0.5 leading-relaxed">{smtpVerifyResult.message}</p>
                </div>
              </div>
            )}

            {/* Cuadrícula de Parámetros Activos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Proveedor</span>
                <span className="font-bold text-white text-sm font-mono mt-0.5 block">
                  {emailStatus?.provider || 'SMTP (Nodemailer)'}
                </span>
                <span className="text-[10px] text-slate-400">Transporte activo</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Host SMTP</span>
                <span className="font-bold text-white text-sm font-mono mt-0.5 block truncate">
                  {emailStatus?.smtpHost || 'smtp.gmail.com'}
                </span>
                <span className="text-[10px] text-slate-400">Puerto: {emailStatus?.smtpPort || 587}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Usuario SMTP</span>
                <span className="font-bold text-white text-sm font-mono mt-0.5 block truncate">
                  {emailStatus?.smtpUser || 'frikaz.fritosnacks@gmail.com'}
                </span>
                <span className="text-[10px] text-slate-400">Cuenta de despacho</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Envíos Registrados</span>
                <span className="font-bold text-sky-400 text-sm font-mono mt-0.5 block">
                  {emailStatus?.totalSentInHistory ?? emailHistoryList.length} correos
                </span>
                <span className="text-[10px] text-slate-400">En disco .email_history.json</span>
              </div>
            </div>

            {/* Aviso sobre variables y credenciales */}
            {(!emailStatus?.configured || (emailStatus?.missingVars && emailStatus.missingVars.length > 0)) && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-100">
                  <HelpCircle className="h-4 w-4 text-amber-400" />
                  <span>Configuración para envíos reales hacia destinatarios externos:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  {emailStatus?.instructions ||
                    'Para conectar un servidor SMTP real, defina en las variables de entorno de AI Studio o en .env: SMTP_HOST (ej. smtp.gmail.com), SMTP_PORT (587), SMTP_USER (frikaz.fritosnacks@gmail.com) y SMTP_PASS (contraseña de aplicación de 16 caracteres de Google).'}
                </p>
                {emailStatus?.missingVars && emailStatus.missingVars.length > 0 && (
                  <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded-lg border border-amber-600/30 text-amber-300">
                    Variables requeridas faltantes: {emailStatus.missingVars.join(' · ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Formulario de Prueba de Envío Inmediato */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Herramienta de Prueba de Envío en Vivo
                </h3>
                <p className="text-xs text-slate-400">
                  Envíe un correo de prueba inmediato a cualquier dirección para validar la entrega en buzón de entrada.
                </p>
              </div>
            </div>

            {/* Selector de canal de prueba */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-bold">Canal de prueba:</span>
              <button
                type="button"
                onClick={() => setTestProvider('gmail')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  testProvider === 'gmail'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Gmail API (Google Workspace)
              </button>
              <button
                type="button"
                onClick={() => setTestProvider('smtp')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  testProvider === 'smtp'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                SMTP Backend
              </button>
            </div>

            <form onSubmit={handleEnviarPrueba} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Correo destinatario de prueba: <span className="text-sky-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                  placeholder="su.correo@ejemplo.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Asunto del mensaje:
                </label>
                <input
                  type="text"
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={enviandoPrueba}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {enviandoPrueba ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Despachando prueba...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Enviar prueba real</span>
                    </>
                  )}
                </button>
              </div>

              <div className="col-span-1 md:col-span-3">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Cuerpo del mensaje de prueba:
                </label>
                <textarea
                  rows={2}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500 resize-none font-sans"
                />
              </div>
            </form>

            {resultadoPrueba && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                  resultadoPrueba.success
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                }`}
              >
                {resultadoPrueba.success ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold">
                    {resultadoPrueba.success
                      ? 'Mensaje entregado exitosamente al servidor de correo'
                      : 'Error en la entrega del correo:'}
                  </span>
                  <p className="mt-0.5">
                    {resultadoPrueba.error || resultadoPrueba.details || resultadoPrueba.response}
                  </p>
                  {resultadoPrueba.trackingCode && (
                    <span className="text-[10px] font-mono text-emerald-300 block mt-1">
                      Tracking Code: {resultadoPrueba.trackingCode}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tabla de Historial Real Persistente */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden space-y-0">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  Registro Persistente de Despachos Reales
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bitácora de auditoría inmutable respaldada en el servidor backend.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Total: <strong className="text-white">{emailHistoryList.length}</strong> envíos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <th className="py-3 px-3.5">Código Tracking</th>
                    <th className="py-3 px-3.5">Destinatario / Trabajador</th>
                    <th className="py-3 px-3.5">Tipo Notificación</th>
                    <th className="py-3 px-3.5">Asunto</th>
                    <th className="py-3 px-3.5">Fecha y Hora</th>
                    <th className="py-3 px-3.5">Estado Operacional</th>
                    <th className="py-3 px-3.5">Detalles / Error</th>
                    <th className="py-3 px-3.5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {emailHistoryList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-500">
                        <Mail className="h-7 w-7 text-slate-600 mx-auto mb-2" />
                        <span className="block font-bold">No hay registros de envío en el historial aún</span>
                        <span className="text-[11px] text-slate-500">
                          Utilice el botón "Nuevo envío por correo real" o la herramienta de prueba superior.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    emailHistoryList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-orange-300">
                          {item.trackingCode}
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="font-bold text-white block">{item.to}</span>
                          <span className="text-[10px] text-slate-400">{item.workerName} ({item.cargo})</span>
                        </td>

                        <td className="py-3 px-3.5 text-[11px] text-slate-300">
                          {item.tipoNotificacion}
                        </td>

                        <td className="py-3 px-3.5 max-w-[200px]">
                          <span className="truncate block font-medium" title={item.subject}>
                            {item.subject}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {item.contentSnippet}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                          {(() => {
                            try {
                              return item.timestamp ? new Date(item.timestamp).toLocaleString('es-CO') : 'Reciente';
                            } catch {
                              return 'Reciente';
                            }
                          })()}
                        </td>

                        <td className="py-3 px-3.5">
                          {renderBadgeEstadoEmail(item.status)}
                        </td>

                        <td className="py-3 px-3.5 max-w-[200px] text-[11px]">
                          {item.errorDetails ? (
                            <span className="text-rose-400 font-mono text-[10px] truncate block" title={item.errorDetails}>
                              {item.errorDetails}
                            </span>
                          ) : item.messageId ? (
                            <span className="text-emerald-400 font-mono text-[10px] truncate block" title={item.messageId}>
                              ID: {item.messageId}
                            </span>
                          ) : (
                            <span className="text-slate-500">Sin observaciones</span>
                          )}
                        </td>

                        <td className="py-3 px-3.5 text-center">
                          {item.status === 'Error en el envío' || item.status === 'Rechazado por el servidor destinatario' ? (
                            <button
                              onClick={() => handleReintentarCorreo(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Reintentar despacho inmediatamente"
                            >
                              Reintentar
                            </button>
                          ) : (
                            <span className="text-emerald-400 text-xs font-bold">✓ Despachado</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: VISOR DE DOCUMENTO FIRMADO                         */}
      {/* ============================================================ */}
      {isVisorOpen && docParaVer && (
        <ModalVisorDocumentoFirmado
          isOpen={isVisorOpen}
          onClose={() => setIsVisorOpen(false)}
          documento={docParaVer}
          onEstadoActualizado={handleDocumentoActualizado}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL 2: NUEVO ENVÍO MANUAL DE DOCUMENTO                     */}
      {/* ============================================================ */}
      {isModalEnvioOpen && (
        <ModalEnviarDocumento
          isOpen={isModalEnvioOpen}
          onClose={() => {
            setIsModalEnvioOpen(false);
            cargarDiagnosticoYHistorial();
          }}
          tipoDocumento="responsabilidades"
          tituloEntidad="Operario de Producción y Freído"
          nombreDocumentoAdjunto="Responsabilidades_SST_Operario_Freido_Frikaz.docx"
          onEnvioExitoso={(envioId, dest) => {
            setEnviosPendientes(getStoredEnviosPendientes());
            cargarDiagnosticoYHistorial();
            triggerToast(`Documento enviado exitosamente a ${dest} con código ${envioId}`);
            setVistaActiva('historial_real');
          }}
        />
      )}
    </div>
  );
};
