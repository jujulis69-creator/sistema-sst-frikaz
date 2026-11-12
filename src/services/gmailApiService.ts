// ============================================================================
// CLIENTE REST API DE GMAIL (GOOGLE WORKSPACE)
// Frikaz S.A.S. — Sistema de Gestión SG-SST
// ============================================================================

import { getAccessToken } from './gmailAuthService';

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailAttachmentInput {
  filename: string;
  content: string; // Base64
  contentType?: string;
}

export interface SendGmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: GmailAttachmentInput[];
  trackingCode?: string;
}

export interface SendGmailResult {
  success: boolean;
  messageId?: string;
  threadId?: string;
  labelIds?: string[];
  error?: string;
  details?: string;
}

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface ParsedGmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  hasAttachments: boolean;
  attachmentNames: string[];
}

/**
 * Convierte un string a Base64URL conforme al estándar RFC 4648 §5 que exige Gmail API
 */
function base64UrlEncode(str: string): string {
  // UTF-8 a Base64 estándar
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Consulta el perfil de la cuenta de Gmail autenticada
 */
export async function getGmailProfile(): Promise<GmailProfile | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Error al consultar perfil de Gmail:', res.status, errText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Fallo de red al consultar perfil de Gmail:', error);
    return null;
  }
}

/**
 * Construye el payload RFC 2822 para mensajes de correo con o sin archivos adjuntos
 */
function buildRfc2822Message(params: SendGmailParams, fromEmail?: string): string {
  const boundary = `====_Frikaz_Boundary_${Date.now()}_====`;
  const fromHeader = fromEmail ? `From: ${fromEmail}\r\n` : '';
  const toHeader = `To: ${params.to.trim()}\r\n`;
  const subjectHeader = `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(params.subject.trim())))}?=\r\n`;
  const mimeVersion = 'MIME-Version: 1.0\r\n';

  const hasAttachments = params.attachments && params.attachments.length > 0;

  if (!hasAttachments) {
    // Mensaje simple de texto / HTML
    const contentType = params.html
      ? 'Content-Type: text/html; charset=UTF-8\r\n'
      : 'Content-Type: text/plain; charset=UTF-8\r\n';
    const body = params.html || params.text || '';
    return `${fromHeader}${toHeader}${subjectHeader}${mimeVersion}${contentType}\r\n${body}`;
  }

  // Mensaje multipart/mixed con adjuntos
  let message = `${fromHeader}${toHeader}${subjectHeader}${mimeVersion}Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

  // Parte 1: Cuerpo del mensaje
  message += `--${boundary}\r\n`;
  if (params.html) {
    message += 'Content-Type: text/html; charset=UTF-8\r\n\r\n';
    message += `${params.html}\r\n\r\n`;
  } else {
    message += 'Content-Type: text/plain; charset=UTF-8\r\n\r\n';
    message += `${params.text || ''}\r\n\r\n`;
  }

  // Partes siguientes: Adjuntos codificados en base64
  for (const att of params.attachments!) {
    message += `--${boundary}\r\n`;
    const cType = att.contentType || 'application/octet-stream';
    message += `Content-Type: ${cType}; name="${att.filename}"\r\n`;
    message += 'Content-Transfer-Encoding: base64\r\n';
    message += `Content-Disposition: attachment; filename="${att.filename}"\r\n\r\n`;
    message += `${att.content}\r\n\r\n`;
  }

  message += `--${boundary}--\r\n`;
  return message;
}

/**
 * Envía un correo real utilizando la API oficial de Gmail
 */
export async function sendEmailViaGmailApi(params: SendGmailParams): Promise<SendGmailResult> {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      error: 'Sesión no iniciada con Google Workspace / Gmail.',
      details: 'Por favor inicie sesión con su cuenta de Google para despachar correos directamente desde Gmail API.',
    };
  }

  try {
    // Obtener correo del remitente autenticado si es posible
    const profile = await getGmailProfile();
    const fromAddress = profile?.emailAddress;

    const rawRfc2822 = buildRfc2822Message(params, fromAddress);
    const rawBase64Url = base64UrlEncode(rawRfc2822);

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawBase64Url }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.error?.message || `Error HTTP ${res.status}: ${res.statusText}`;
      return {
        success: false,
        error: errorMsg,
        details: JSON.stringify(data?.error?.errors || data),
      };
    }

    return {
      success: true,
      messageId: data.id,
      threadId: data.threadId,
      labelIds: data.labelIds,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Fallo de red conectando con Gmail API: ${error.message}`,
    };
  }
}

/**
 * Busca mensajes en la bandeja de Gmail del usuario (ej. respuestas con FRK-ENV)
 */
export async function searchGmailMessages(
  query: string = '',
  maxResults: number = 10
): Promise<ParsedGmailMessage[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
    if (query) url.searchParams.set('q', query);
    url.searchParams.set('maxResults', String(maxResults));

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const messages = data.messages || [];

    // Obtener detalles de cada mensaje en paralelo (hasta maxResults)
    const detailedPromises = messages.map(async (m: { id: string }) => {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=full`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!msgRes.ok) return null;
        const msgData = await msgRes.json();

        const headers: GmailMessageHeader[] = msgData.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        const attachmentNames: string[] = [];
        const checkParts = (parts?: any[]) => {
          if (!parts) return;
          for (const p of parts) {
            if (p.filename && p.filename.length > 0) {
              attachmentNames.push(p.filename);
            }
            if (p.parts) checkParts(p.parts);
          }
        };
        checkParts(msgData.payload?.parts);

        const parsed: ParsedGmailMessage = {
          id: msgData.id,
          threadId: msgData.threadId,
          snippet: msgData.snippet || '',
          subject: getHeader('Subject'),
          from: getHeader('From'),
          to: getHeader('To'),
          date: getHeader('Date'),
          hasAttachments: attachmentNames.length > 0,
          attachmentNames,
        };
        return parsed;
      } catch {
        return null;
      }
    });

    const results = await Promise.all(detailedPromises);
    return results.filter((r): r is ParsedGmailMessage => r !== null);
  } catch (error) {
    console.error('Error buscando mensajes en Gmail:', error);
    return [];
  }
}
