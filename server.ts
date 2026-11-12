import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Habilitar CORS y preflight OPTIONS para compatibilidad total en iframe / preview
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ============================================================================
// GESTIÓN DEL HISTORIAL PERSISTENTE DE CORREOS
// ============================================================================
const HISTORY_FILE = path.resolve(__dirname, '.email_history.json');

export interface RegistroHistorialServidor {
  id: string;
  trackingCode: string;
  to: string;
  from: string;
  subject: string;
  contentSnippet: string;
  tipoNotificacion: string;
  workerName?: string;
  cargo?: string;
  timestamp: string;
  status:
    | 'Pendiente de envío'
    | 'Enviando'
    | 'Enviado correctamente al proveedor'
    | 'Error en el envío'
    | 'Rechazado por el servidor destinatario'
    | 'Entregado';
  provider: string;
  messageId?: string;
  responseInfo?: string;
  errorDetails?: string;
  attempts: number;
  attachmentNames?: string[];
}

function loadHistory(): RegistroHistorialServidor[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error cargando historial de correos del disco:', err);
  }
  return [];
}

function saveHistory(history: RegistroHistorialServidor[]) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error guardando historial de correos en disco:', err);
  }
}

let emailHistory: RegistroHistorialServidor[] = loadHistory();

// ============================================================================
// CONFIGURACIÓN DEL SERVICIO REAL DE CORREO (SMTP / RESEND / API)
// ============================================================================
function getEmailConfig() {
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const smtpFrom = process.env.SMTP_FROM || `FRIKAZ S.A.S. <${smtpUser || 'frikaz.fritosnacks@gmail.com'}>`;
  const resendApiKey = process.env.RESEND_API_KEY || '';

  const hasSmtp = Boolean(smtpHost && smtpUser && smtpPass);
  const hasResend = Boolean(resendApiKey);
  const isConfigured = hasSmtp || hasResend;

  const missingVars: string[] = [];
  if (!hasResend) {
    if (!smtpHost) missingVars.push('SMTP_HOST (ej. smtp.gmail.com)');
    if (!smtpUser) missingVars.push('SMTP_USER (ej. frikaz.fritosnacks@gmail.com)');
    if (!smtpPass) missingVars.push('SMTP_PASS (Contraseña de aplicación de 16 caracteres de Google)');
  }

  return {
    isConfigured,
    provider: hasSmtp ? 'SMTP' : hasResend ? 'Resend' : 'none',
    smtpHost: smtpHost || null,
    smtpPort: smtpPort || null,
    smtpSecure,
    smtpUser: smtpUser || null,
    smtpFrom,
    resendApiKey: resendApiKey ? 'Configurada' : null,
    missingVars,
  };
}

function createTransporter() {
  const config = getEmailConfig();
  if (config.provider === 'SMTP') {
    return nodemailer.createTransport({
      host: config.smtpHost!,
      port: config.smtpPort!,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser!,
        pass: process.env.SMTP_PASS!,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
    });
  }
  return null;
}

// ============================================================================
// ROUTER AISLADO DE API (/api/email) - SIEMPRE DEVUELVE JSON
// ============================================================================
const emailRouter = express.Router();

// Garantizar cabeceras de respuesta JSON para toda la API
emailRouter.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 1. Estado y diagnóstico de la configuración del servicio
emailRouter.get('/status', (req, res) => {
  const config = getEmailConfig();
  res.json({
    configured: config.isConfigured,
    provider: config.provider,
    smtpHost: config.smtpHost,
    smtpPort: config.smtpPort,
    smtpUser: config.smtpUser,
    senderAddress: config.smtpFrom,
    missingVars: config.missingVars,
    totalSentInHistory: emailHistory.length,
    instructions: config.isConfigured
      ? `Servicio de correo configurado y activo mediante ${config.provider}.`
      : 'Para activar los envíos reales a destinatarios externos, defina en las variables de entorno de AI Studio (o en el archivo .env) las credenciales de correo: SMTP_HOST (ej. smtp.gmail.com), SMTP_PORT (587), SMTP_USER (su correo Gmail frikaz.fritosnacks@gmail.com) y SMTP_PASS (la contraseña de aplicación de 16 caracteres de Google), o RESEND_API_KEY.',
  });
});

// 2. Verificación de conectividad real con el servidor de correo
emailRouter.post('/verify', async (req, res) => {
  const config = getEmailConfig();
  if (!config.isConfigured) {
    return res.status(503).json({
      success: false,
      message: 'No hay credenciales de correo configuradas en el servidor.',
      missingVars: config.missingVars,
      instructions:
        'Configure en las variables de entorno: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=frikaz.fritosnacks@gmail.com y SMTP_PASS=(Contraseña de aplicación de 16 caracteres de Google).',
    });
  }

  try {
    const transporter = createTransporter();
    if (!transporter) {
      return res.status(400).json({
        success: false,
        message: 'No fue posible inicializar el transporte SMTP con la configuración actual.',
      });
    }

    await transporter.verify();
    return res.json({
      success: true,
      message: `Conexión verificada exitosamente con el servidor SMTP ${config.smtpHost}:${config.smtpPort}. El servicio está listo para envíos reales.`,
    });
  } catch (error: any) {
    console.error('Error verificando conexión SMTP:', error);
    return res.status(500).json({
      success: false,
      message: `Fallo al autenticar con el servidor SMTP (${config.smtpHost}): ${error.message || error}`,
      code: error.code || 'SMTP_AUTH_ERROR',
    });
  }
});

// 3. Envío real de correo electrónico con soporte de adjuntos
emailRouter.post('/send', async (req, res) => {
  const {
    to,
    subject,
    text,
    html,
    tipoNotificacion = 'Asignación de Responsabilidades / Documental',
    workerName,
    cargo,
    trackingCode,
    attachments,
  } = req.body;

  // Validación 1: Destinatario
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    return res.status(400).json({
      success: false,
      status: 'Error en el envío',
      error: 'La dirección de correo electrónico del destinatario es inválida o está vacía.',
    });
  }

  // Validación 2: Asunto y contenido
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    return res.status(400).json({
      success: false,
      status: 'Error en el envío',
      error: 'El asunto del correo electrónico no puede estar vacío.',
    });
  }

  if (!text && !html) {
    return res.status(400).json({
      success: false,
      status: 'Error en el envío',
      error: 'El cuerpo del correo electrónico debe contener texto o formato HTML.',
    });
  }

  const code = trackingCode || `FRK-ENV-2026-${Math.floor(100 + Math.random() * 900)}`;
  const config = getEmailConfig();

  // Procesar adjuntos si existen
  const processedAttachments: any[] = [];
  const attachmentNames: string[] = [];

  if (Array.isArray(attachments)) {
    for (const att of attachments) {
      if (att && att.filename && att.content) {
        attachmentNames.push(att.filename);
        if (att.encoding === 'base64' || (typeof att.content === 'string' && !att.content.includes(' ') && att.content.length > 50)) {
          processedAttachments.push({
            filename: att.filename,
            content: Buffer.from(att.content, 'base64'),
            contentType: att.contentType || 'application/octet-stream',
          });
        } else {
          processedAttachments.push({
            filename: att.filename,
            content: att.content,
            contentType: att.contentType || 'text/plain',
          });
        }
      }
    }
  }

  const nuevoRegistro: RegistroHistorialServidor = {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    trackingCode: code,
    to: to.trim().toLowerCase(),
    from: config.smtpFrom,
    subject: subject.trim(),
    contentSnippet: (text || html || '').slice(0, 160).replace(/\n/g, ' '),
    tipoNotificacion,
    workerName: workerName || 'Trabajador Frikaz',
    cargo: cargo || 'Cargo no especificado',
    timestamp: new Date().toISOString(),
    status: 'Enviando',
    provider: config.provider,
    attempts: 1,
    attachmentNames: attachmentNames.length > 0 ? attachmentNames : undefined,
  };

  // Verificación estricta: si faltan credenciales, informar con veracidad y exactitud (REGLAS 2, 3 y 5)
  if (!config.isConfigured) {
    nuevoRegistro.status = 'Error en el envío';
    nuevoRegistro.errorDetails = `Faltan credenciales del servicio de correo: ${config.missingVars.join(', ')}. No se pueden realizar envíos a destinatarios externos reales sin un servidor SMTP o API Key configurada.`;
    emailHistory.unshift(nuevoRegistro);
    saveHistory(emailHistory);

    return res.status(503).json({
      success: false,
      status: 'Error en el envío',
      trackingCode: code,
      error: 'Servicio de correo no configurado en el servidor.',
      details: nuevoRegistro.errorDetails,
      missingVars: config.missingVars,
      record: nuevoRegistro,
      instructions:
        'Para habilitar el envío real a cualquier correo externo, agregue en las variables de entorno de AI Studio (o en .env): SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=frikaz.fritosnacks@gmail.com y SMTP_PASS=(Contraseña de aplicación de Google de 16 dígitos).',
    });
  }

  // Ejecución real del envío a través de SMTP
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error('No se pudo inicializar el transporte SMTP.');
    }

    const mailOptions: any = {
      from: config.smtpFrom,
      to: to.trim(),
      subject: subject.trim(),
      text: text || undefined,
      html: html || undefined,
    };

    if (processedAttachments.length > 0) {
      mailOptions.attachments = processedAttachments;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Correo enviado exitosamente a ${to}. MessageId: ${info.messageId}`);

    if (info.rejected && info.rejected.length > 0) {
      nuevoRegistro.status = 'Rechazado por el servidor destinatario';
      nuevoRegistro.errorDetails = `El servidor destinatario rechazó la dirección: ${info.rejected.join(', ')}`;
    } else {
      nuevoRegistro.status = 'Enviado correctamente al proveedor';
      nuevoRegistro.messageId = info.messageId;
      nuevoRegistro.responseInfo = typeof info.response === 'string' ? info.response : 'Aceptado por el servidor de correo';
    }

    emailHistory.unshift(nuevoRegistro);
    saveHistory(emailHistory);

    return res.json({
      success: true,
      status: nuevoRegistro.status,
      trackingCode: code,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
      record: nuevoRegistro,
    });
  } catch (error: any) {
    console.error(`[SMTP ERROR] Falló el envío a ${to}:`, error);

    const isRejection =
      error.responseCode === 550 ||
      error.responseCode === 551 ||
      error.responseCode === 553 ||
      (error.message && error.message.toLowerCase().includes('recipient rejected'));

    nuevoRegistro.status = isRejection
      ? 'Rechazado por el servidor destinatario'
      : 'Error en el envío';
    nuevoRegistro.errorDetails = error.message || String(error);

    emailHistory.unshift(nuevoRegistro);
    saveHistory(emailHistory);

    return res.status(500).json({
      success: false,
      status: nuevoRegistro.status,
      trackingCode: code,
      error: `Error al enviar correo: ${error.message || error}`,
      code: error.code || 'EMAIL_SEND_FAILED',
      record: nuevoRegistro,
    });
  }
});

// 4. Obtener historial completo de correos
emailRouter.get('/history', (req, res) => {
  res.json({
    total: emailHistory.length,
    history: emailHistory,
  });
});

// 5. Reintentar envío de un correo fallido
emailRouter.post('/retry/:id', async (req, res) => {
  const { id } = req.params;
  const index = emailHistory.findIndex((h) => h.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Registro de correo no encontrado.' });
  }

  const record = emailHistory[index];
  const config = getEmailConfig();

  if (!config.isConfigured) {
    record.attempts += 1;
    record.status = 'Error en el envío';
    record.errorDetails = `Faltan credenciales SMTP: ${config.missingVars.join(', ')}`;
    saveHistory(emailHistory);
    return res.status(503).json({
      success: false,
      status: 'Error en el envío',
      error: 'Servicio de correo aún no está configurado.',
      details: record.errorDetails,
      missingVars: config.missingVars,
    });
  }

  try {
    const transporter = createTransporter();
    if (!transporter) throw new Error('No se pudo inicializar SMTP.');

    record.attempts += 1;
    record.status = 'Enviando';

    const info = await transporter.sendMail({
      from: config.smtpFrom,
      to: record.to,
      subject: record.subject,
      text: record.contentSnippet,
    });

    record.status = 'Enviado correctamente al proveedor';
    record.messageId = info.messageId;
    record.responseInfo = typeof info.response === 'string' ? info.response : 'Aceptado en reintento';
    record.errorDetails = undefined;
    record.timestamp = new Date().toISOString();

    saveHistory(emailHistory);
    return res.json({ success: true, status: record.status, record });
  } catch (error: any) {
    record.status = 'Error en el envío';
    record.errorDetails = error.message || String(error);
    saveHistory(emailHistory);
    return res.status(500).json({ success: false, status: record.status, error: error.message });
  }
});

// Fallback para cualquier ruta no encontrada dentro de /api/email
emailRouter.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    status: 'Error en el envío',
    error: `Ruta de API no encontrada: [${req.method}] ${req.originalUrl}`,
  });
});

// Montar router de email
app.use('/api/email', emailRouter);

// ============================================================================
// GESTIÓN DEL HISTORIAL PERSISTENTE DE «MISIÓN FRIKAZ» (EVALUACIONES Y PASAPORTE)
// ============================================================================
const MISION_HISTORY_FILE = path.resolve(__dirname, '.mision_frikaz_history.json');

interface RegistroIntentoServidor {
  id: string;
  trabajadorId: string;
  trabajadorNombre: string;
  trabajadorCargo: string;
  trabajadorCedula: string;
  politicaId: string;
  politicaCodigo: string;
  politicaTitulo: string;
  fechaInicio: string;
  fechaFin: string;
  duracionSegundos: number;
  puntaje: number;
  aprobado: boolean;
  numeroIntento: number;
  respuestas: {
    preguntaId: string;
    opcionSeleccionadaId: string;
    esCorrecta: boolean;
    puntosObtenidos: number;
  }[];
  sincronizadoGoogleSheets?: boolean;
  receivedAt: string;
}

function loadMisionHistory(): RegistroIntentoServidor[] {
  try {
    if (fs.existsSync(MISION_HISTORY_FILE)) {
      const data = fs.readFileSync(MISION_HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error cargando historial de Misión Frikaz de disco:', err);
  }
  return [];
}

function saveMisionHistory(history: RegistroIntentoServidor[]) {
  try {
    fs.writeFileSync(MISION_HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error guardando historial de Misión Frikaz en disco:', err);
  }
}

let misionHistory: RegistroIntentoServidor[] = loadMisionHistory();

const misionRouter = express.Router();
misionRouter.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 1. Registrar y validar intento de evaluación
misionRouter.post('/evaluar', async (req, res) => {
  const intento = req.body;
  if (!intento || !intento.trabajadorId || !intento.politicaId) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos de evaluación. Se requiere trabajadorId y politicaId.',
    });
  }

  const registro: RegistroIntentoServidor = {
    ...intento,
    id: intento.id || `intento-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    receivedAt: new Date().toISOString(),
    sincronizadoGoogleSheets: false,
  };

  // Re-validación del puntaje (mínimo 80% para aprobar según la política)
  registro.aprobado = (registro.puntaje || 0) >= 80;

  // Sincronización opcional con Google Sheets si existe URL configurada
  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';
  if (sheetsWebhookUrl) {
    try {
      const googleResponse = await fetch(sheetsWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'EVALUACION_MISIÓN_FRIKAZ',
          fecha: registro.fechaFin,
          trabajador: registro.trabajadorNombre,
          cedula: registro.trabajadorCedula,
          cargo: registro.trabajadorCargo,
          politica: registro.politicaTitulo,
          codigo: registro.politicaCodigo,
          puntaje: registro.puntaje,
          estado: registro.aprobado ? 'SUPERADA' : 'NO_SUPERADA',
          intento: registro.numeroIntento,
          duracionSegundos: registro.duracionSegundos,
        }),
      });
      if (googleResponse.ok) {
        registro.sincronizadoGoogleSheets = true;
      }
    } catch (sheetErr) {
      console.warn('[Misión Frikaz] No se pudo sincronizar automáticamente con Google Sheets:', sheetErr);
    }
  }

  misionHistory.unshift(registro);
  saveMisionHistory(misionHistory);

  return res.json({
    success: true,
    message: registro.aprobado
      ? `¡Felicitaciones! Has superado la misión de ${registro.politicaTitulo} con ${registro.puntaje}% de efectividad.`
      : `Misión no superada (${registro.puntaje}%). Se requiere mínimo 80% para desbloquear la insignia. Repasa el material y reinténtalo.`,
    aprobado: registro.aprobado,
    puntaje: registro.puntaje,
    sincronizadoGoogleSheets: registro.sincronizadoGoogleSheets,
    registroId: registro.id,
  });
});

// 2. Consultar historial completo de intentos
misionRouter.get('/historial', (req, res) => {
  const { trabajadorId, politicaId } = req.query;
  let filtrados = misionHistory;

  if (trabajadorId && typeof trabajadorId === 'string') {
    filtrados = filtrados.filter((i) => i.trabajadorId === trabajadorId);
  }
  if (politicaId && typeof politicaId === 'string') {
    filtrados = filtrados.filter((i) => i.politicaId === politicaId);
  }

  res.json({
    total: filtrados.length,
    historial: filtrados,
  });
});

// 3. Estado general y conectividad con Google Sheets
misionRouter.get('/status', (req, res) => {
  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';
  res.json({
    success: true,
    totalIntentosRegistrados: misionHistory.length,
    googleSheetsConectado: Boolean(sheetsWebhookUrl),
    googleSheetsUrlConfigurada: sheetsWebhookUrl ? `${sheetsWebhookUrl.slice(0, 35)}...` : null,
  });
});

// 4. Sincronizar manualmente o exportar a Google Sheets
misionRouter.post('/sync-sheets', async (req, res) => {
  const { webhookUrl } = req.body;
  const targetUrl = webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!targetUrl) {
    return res.status(400).json({
      success: false,
      error: 'No se ha configurado la URL del webhook de Google Sheets / Apps Script.',
    });
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'SYNC_COMPLETO_MISIÓN_FRIKAZ',
        timestamp: new Date().toISOString(),
        totalRegistros: misionHistory.length,
        registros: misionHistory.map((r) => ({
          fecha: r.fechaFin,
          trabajador: r.trabajadorNombre,
          cedula: r.trabajadorCedula,
          cargo: r.trabajadorCargo,
          politica: r.politicaTitulo,
          codigo: r.politicaCodigo,
          puntaje: r.puntaje,
          estado: r.aprobado ? 'SUPERADA' : 'NO_SUPERADA',
          intento: r.numeroIntento,
          duracionSegundos: r.duracionSegundos,
        })),
      }),
    });

    if (response.ok) {
      misionHistory.forEach((r) => {
        r.sincronizadoGoogleSheets = true;
      });
      saveMisionHistory(misionHistory);

      return res.json({
        success: true,
        message: `Sincronización exitosa de ${misionHistory.length} evaluaciones con Google Sheets.`,
      });
    } else {
      return res.status(response.status).json({
        success: false,
        error: `El webhook de Google Sheets respondió con código ${response.status}`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `Error al conectar con el webhook de Google Sheets: ${err.message || err}`,
    });
  }
});

// 5. Validar autorización de acceso al sistema (Backend Gatekeeper Authority)
// Cumple la condición de que el bloqueo de acceso esté validado también en el backend
misionRouter.all('/validar-acceso', (req, res) => {
  const trabajadorId = req.method === 'POST' ? req.body?.trabajadorId : req.query?.trabajadorId;
  const cargoId = req.method === 'POST' ? req.body?.cargoId : req.query?.cargoId;

  if (!trabajadorId || typeof trabajadorId !== 'string') {
    return res.status(400).json({
      success: false,
      accesoAutorizado: false,
      error: 'Se requiere el parámetro trabajadorId para validar el acceso al sistema.',
    });
  }

  // Políticas obligatorias que componen la Misión Frikaz
  const politicasObligatorias = ['FRK-SST-POL-01', 'FRK-SST-POL-02', 'FRK-SST-PR-01'];

  // Consultar en el historial de intentos aprobados para este trabajador
  const intentosAprobados = misionHistory.filter(
    (i) => i.trabajadorId === trabajadorId && i.aprobado && (i.puntaje || 0) >= 80
  );

  const politicasSuperadas = new Set(intentosAprobados.map((i) => i.politicaId));
  const misionesPendientes = politicasObligatorias.filter((id) => !politicasSuperadas.has(id));
  const accesoAutorizado = misionesPendientes.length === 0;

  return res.json({
    success: true,
    trabajadorId,
    cargoId: cargoId || null,
    accesoAutorizado,
    totalObligatorias: politicasObligatorias.length,
    totalSuperadas: politicasSuperadas.size,
    misionesPendientes,
    politicasSuperadas: Array.from(politicasSuperadas),
    mensaje: accesoAutorizado
      ? 'Acceso plenamente autorizado a la plataforma SG-SST Frikaz S.A.S.'
      : `Acceso restringido: El colaborador tiene ${misionesPendientes.length} misión(es) obligatoria(s) pendiente(s) por superar con mínimo 80%.`,
  });
});

// Montar router de Misión Frikaz
app.use('/api/mision-frikaz', misionRouter);

// Fallback general para CUALQUIER otra ruta que empiece con /api/ (NUNCA devolver HTML)
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    status: 'Error en el envío',
    error: `Ruta de API no implementada: [${req.method}] ${req.originalUrl}`,
  });
});

// Middleware de manejo de errores en API
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api/')) {
    console.error('[API ERROR]:', err);
    return res.status(err.status || 500).json({
      success: false,
      status: 'Error en el envío',
      error: `Error interno de servidor: ${err.message || err}`,
    });
  }
  next(err);
});

// ============================================================================
// INTEGRACIÓN VITE CON EXPRESS (SPA + DEV MIDDLEWARES)
// ============================================================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // CRÍTICO: vite.middlewares solo debe procesar rutas frontend, nunca /api/
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      vite.middlewares(req, res, next);
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Frikaz S.A.S.] Servidor backend y frontend activo en http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error al iniciar el servidor Express/Vite:', err);
  process.exit(1);
});
