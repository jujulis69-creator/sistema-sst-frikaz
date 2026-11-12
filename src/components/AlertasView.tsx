import React, { useState, useMemo } from 'react';
import { AlertaItem } from '../types';
import {
  Bell,
  AlertTriangle,
  Clock,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  FolderLock,
  Filter,
  Shield,
  Leaf,
  Info,
  Mail,
  Send,
  X,
  Server,
  RefreshCw,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { sendEmailReal, EstadoEnvioCorreo, EmailSendResponse } from '../services/emailService';
import { sendEmailViaGmailApi } from '../services/gmailApiService';
import { getAccessToken } from '../services/gmailAuthService';

interface AlertasViewProps {
  alertas: AlertaItem[];
  onNavigateTab: (tab: ActiveTab) => void;
}

export const AlertasView: React.FC<AlertasViewProps> = ({ alertas, onNavigateTab }) => {
  const [severityFilter, setSeverityFilter] = useState<'TODAS' | 'urgente' | 'advertencia' | 'informativa'>('TODAS');
  const [areaFilter, setAreaFilter] = useState<'TODAS' | 'SST' | 'Ambiental'>('TODAS');

  // Modal para envío real de alerta por correo
  const [alertaParaEnviar, setAlertaParaEnviar] = useState<AlertaItem | null>(null);
  const [destinatarioAlerta, setDestinatarioAlerta] = useState('frikaz.fritosnacks@gmail.com');
  const [observacionesAdicionales, setObservacionesAdicionales] = useState('');
  const [enviandoAlerta, setEnviandoAlerta] = useState(false);
  const [estadoEnvioAlerta, setEstadoEnvioAlerta] = useState<EstadoEnvioCorreo>('Pendiente de envío');
  const [resultadoEnvioAlerta, setResultadoEnvioAlerta] = useState<EmailSendResponse | null>(null);

  const filtered = useMemo(() => {
    return alertas.filter((a) => {
      const matchSev = severityFilter === 'TODAS' || a.severidad === severityFilter;
      const matchArea = areaFilter === 'TODAS' || a.area === areaFilter;
      return matchSev && matchArea;
    });
  }, [alertas, severityFilter, areaFilter]);

  const urgentesCount = alertas.filter((a) => a.severidad === 'urgente').length;
  const advertenciasCount = alertas.filter((a) => a.severidad === 'advertencia').length;
  const informativasCount = alertas.filter((a) => a.severidad === 'informativa').length;

  const handleAbrirModalEnvio = (alerta: AlertaItem) => {
    setAlertaParaEnviar(alerta);
    setObservacionesAdicionales('');
    setEstadoEnvioAlerta('Pendiente de envío');
    setResultadoEnvioAlerta(null);
  };

  const handleCerrarModal = () => {
    setAlertaParaEnviar(null);
    setResultadoEnvioAlerta(null);
    setEstadoEnvioAlerta('Pendiente de envío');
  };

  const handleEjecutarEnvioAlerta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertaParaEnviar) return;

    const email = destinatarioAlerta.trim();
    if (!email || !email.includes('@')) {
      alert('Por favor ingrese un correo válido.');
      return;
    }

    setEnviandoAlerta(true);
    setEstadoEnvioAlerta('Enviando');
    setResultadoEnvioAlerta(null);

    const asunto = `[ALERTA SST FRIKAZ] ${alertaParaEnviar.severidad.toUpperCase()}: ${alertaParaEnviar.titulo}`;
    const cuerpo = `NOTIFICACIÓN OFICIAL DE ALERTA PREVENTIVA - FRIKAZ S.A.S.

Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST)
Fecha de emisión: ${new Date().toLocaleString('es-CO')}
Referencia: ${alertaParaEnviar.referencia}
Área: ${alertaParaEnviar.area}
Severidad: ${alertaParaEnviar.severidad.toUpperCase()}

DESCRIPCIÓN DE LA ALERTA:
${alertaParaEnviar.descripcion}

Fecha límite / de referencia: ${alertaParaEnviar.fechaRelevante || 'No especificada'}

OBSERVACIONES DEL REMITENTE:
${observacionesAdicionales.trim() || 'Se requiere atención inmediata según los procedimientos del SG-SST.'}

Este mensaje fue generado automáticamente desde la plataforma de gestión SG-SST de Frikaz S.A.S. Sede Bosa, Bogotá D.C.`;

    try {
      const token = await getAccessToken();
      if (token) {
        const resGmail = await sendEmailViaGmailApi({
          to: email,
          subject: asunto,
          text: cuerpo,
        });

        if (resGmail.success) {
          const resp: EmailSendResponse = {
            success: true,
            status: 'Enviado correctamente al proveedor',
            messageId: resGmail.messageId,
            details: `Despachado exitosamente vía Google Workspace Gmail API. Thread: ${resGmail.threadId}`,
          };
          setResultadoEnvioAlerta(resp);
          setEstadoEnvioAlerta('Enviado correctamente al proveedor');
        } else {
          setEstadoEnvioAlerta('Error en el envío');
          setResultadoEnvioAlerta({
            success: false,
            status: 'Error en el envío',
            error: resGmail.error || resGmail.details || 'Error en Gmail API',
          });
        }
      } else {
        const resp = await sendEmailReal({
          to: email,
          subject: asunto,
          text: cuerpo,
          tipoNotificacion: `Alerta SST (${alertaParaEnviar.severidad})`,
          workerName: 'Líder SST / Dirección',
          cargo: 'Gerencia y SST',
        });

        setResultadoEnvioAlerta(resp);
        setEstadoEnvioAlerta(resp.status);
      }
    } catch (err: any) {
      setEstadoEnvioAlerta('Error en el envío');
      setResultadoEnvioAlerta({
        success: false,
        status: 'Error en el envío',
        error: `Fallo de red: ${err.message || err}`,
      });
    } finally {
      setEnviandoAlerta(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Centro de Notificaciones y Alertas Preventivas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Detección automática de vencimientos legales, evidencias faltantes y acciones correctivas atrasadas
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800">
              {urgentesCount} Urgentes
            </span>
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
              {advertenciasCount} Advertencias
            </span>
            <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
              {informativasCount} Informativas
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold">Severidad:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-hidden bg-white"
              >
                <option value="TODAS">Todas las severidades</option>
                <option value="urgente">Solo Urgentes (Rojas)</option>
                <option value="advertencia">Solo Advertencias (Amarillas)</option>
                <option value="informativa">Solo Informativas (Azules)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold">Área:</span>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value as any)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-hidden bg-white"
              >
                <option value="TODAS">SST y Ambiental</option>
                <option value="SST">Solo SST</option>
                <option value="Ambiental">Solo Ambiental</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>Envíos reales conectados con el servidor SMTP</span>
          </div>
        </div>
      </div>

      {/* Alerts Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
            <p className="font-semibold text-slate-800">No hay alertas activas en esta categoría.</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Todas las obligaciones y actividades programadas se encuentran al día.
            </p>
          </div>
        ) : (
          filtered.map((alerta) => {
            const isUrgent = alerta.severidad === 'urgente';
            const isWarning = alerta.severidad === 'advertencia';

            return (
              <div
                key={alerta.id}
                className={`rounded-xl border p-4 shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs ${
                  isUrgent
                    ? 'border-red-200 bg-red-50/60'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/60'
                    : 'border-blue-200 bg-blue-50/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-lg p-2 shrink-0 ${
                      isUrgent
                        ? 'bg-red-100 text-red-700'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isUrgent ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : isWarning ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <Info className="h-5 w-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`rounded-xs px-2 py-0.5 font-bold uppercase text-[10px] ${
                          isUrgent
                            ? 'bg-red-700 text-white'
                            : isWarning
                            ? 'bg-amber-600 text-white'
                            : 'bg-blue-700 text-white'
                        }`}
                      >
                        {alerta.severidad}
                      </span>
                      <span className="font-semibold text-slate-700">{alerta.referencia}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-medium">Área: {alerta.area}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{alerta.titulo}</h4>

                    <p className="text-slate-700 leading-relaxed max-w-3xl">
                      {alerta.descripcion}
                    </p>

                    {alerta.fechaRelevante && (
                      <p className="text-[11px] font-mono text-slate-500 pt-1">
                        Fecha de referencia: {alerta.fechaRelevante}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:self-center shrink-0 flex items-center gap-2 flex-wrap">
                  {/* Botón para envío real de alerta por correo */}
                  <button
                    onClick={() => handleAbrirModalEnvio(alerta)}
                    className="rounded-lg bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 px-3 py-1.5 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Enviar esta alerta por correo electrónico real"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Notificar por correo</span>
                  </button>

                  {alerta.tipo.includes('OBLIGACION') || alerta.tipo.includes('ACTIVIDAD') ? (
                    <button
                      onClick={() => onNavigateTab('obligaciones')}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs cursor-pointer"
                    >
                      Gestionar Obligación
                    </button>
                  ) : alerta.tipo.includes('ACCION') ? (
                    <button
                      onClick={() => onNavigateTab('acciones')}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs cursor-pointer"
                    >
                      Ver Acción Correctiva
                    </button>
                  ) : alerta.tipo.includes('EVIDENCIA') ? (
                    <button
                      onClick={() => onNavigateTab('evidencias')}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs cursor-pointer"
                    >
                      Cargar Evidencia
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateTab('matriz')}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs cursor-pointer"
                    >
                      Consultar Matriz
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE ENVÍO REAL DE ALERTA POR CORREO */}
      {alertaParaEnviar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-200">
            {/* Header Modal */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-orange-950/40 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-orange-500 text-white shadow-lg">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Notificación Real por Correo
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Enviar Alerta Preventiva por Correo
                  </h3>
                </div>
              </div>
              <button
                onClick={handleCerrarModal}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Estado Operacional */}
            <div className="px-5 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Estado de entrega:</span>
              <span className="font-bold text-orange-400">{estadoEnvioAlerta}</span>
            </div>

            {/* Contenido del Formulario */}
            <form onSubmit={handleEjecutarEnvioAlerta} className="p-5 space-y-4 text-xs">
              {resultadoEnvioAlerta && (
                <div
                  className={`p-3.5 rounded-xl border ${
                    resultadoEnvioAlerta.success
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <span className="font-bold block">
                    {resultadoEnvioAlerta.success
                      ? '✓ Correo despachado con éxito al servidor'
                      : 'Error al enviar alerta por correo:'}
                  </span>
                  <p className="mt-0.5 text-[11px]">
                    {resultadoEnvioAlerta.error ||
                      resultadoEnvioAlerta.details ||
                      `Message-ID: ${resultadoEnvioAlerta.messageId}`}
                  </p>
                </div>
              )}

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Alerta a notificar:</span>
                <span className="font-bold text-white block text-sm">{alertaParaEnviar.titulo}</span>
                <span className="text-slate-400 text-[11px] block">{alertaParaEnviar.descripcion}</span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Correo destinatario (Gerencia / Líder SST):
                </label>
                <input
                  type="email"
                  required
                  value={destinatarioAlerta}
                  onChange={(e) => setDestinatarioAlerta(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Observaciones o instrucciones adicionales:
                </label>
                <textarea
                  rows={3}
                  value={observacionesAdicionales}
                  onChange={(e) => setObservacionesAdicionales(e.target.value)}
                  placeholder="Ej. Se requiere reunión de seguimiento antes del viernes..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCerrarModal}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cerrar
                </button>

                <button
                  type="submit"
                  disabled={enviandoAlerta}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {enviandoAlerta ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Despachando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Enviar correo ahora</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clarification Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-1.5">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-slate-500" />
          Protocolo de Notificaciones Reales por Correo – Frikaz S.A.S.
        </h4>
        <p>
          Las alertas mostradas en este panel se calculan y actualizan automáticamente en tiempo real
          comparando la fecha de cada obligación con el reloj del sistema.
        </p>
        <p>
          Cada alerta cuenta con un botón de despacho real por correo electrónico conectado directamente con el servicio SMTP
          de la empresa (<span className="font-mono font-semibold">frikaz.fritosnacks@gmail.com</span>), garantizando trazabilidad y registro inmutable en el historial del servidor.
        </p>
      </div>
    </div>
  );
};
