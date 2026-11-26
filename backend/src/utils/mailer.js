import nodemailer from 'nodemailer';

/**
 * Envio de correo por SMTP.
 *
 * Se usa SMTP y no la API de un proveedor puntual: cambiar de Gmail a
 * Brevo, Resend u otro servicio es cambiar las variables de entorno, sin
 * tocar el codigo.
 */

const config = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

  const faltantes = Object.entries({ SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS })
    .filter(([, valor]) => !valor)
    .map(([clave]) => clave);

  if (faltantes.length > 0) {
    throw new Error(
      `Falta configurar el correo saliente: ${faltantes.join(', ')}`
    );
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    // El puerto 465 usa TLS desde el inicio; el 587 arranca en claro
    // y lo negocia con STARTTLS.
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    remitente: MAIL_FROM || SMTP_USER,
  };
};

const escaparHtml = (texto) =>
  texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const enviar = async ({ para, asunto, texto, html, responderA }) => {
  const { remitente, ...transporte } = config();
  const transporter = nodemailer.createTransport(transporte);

  return transporter.sendMail({
    from: remitente,
    to: para || remitente,
    replyTo: responderA,
    subject: asunto,
    text: texto,
    html,
  });
};

/**
 * Correo de recuperacion de contrasena.
 *
 * El enlace apunta a la pantalla del frontend que toma el token del query
 * string (/recuperar-password?token=...).
 */
export const enviarMailRecuperacion = async ({ usuario, token }) => {
  const base = process.env.APP_URL || 'http://localhost:5173';
  const enlace = `${base}/recuperar-password?token=${token}`;

  const texto = [
    `Hola ${usuario.nombre},`,
    '',
    'Recibimos un pedido para restablecer la contrasena de tu cuenta.',
    'Entra en el siguiente enlace para elegir una nueva:',
    '',
    enlace,
    '',
    'El enlace vence en una hora y se puede usar una sola vez.',
    'Si no pediste el cambio, ignora este mensaje.',
    '',
    'Andes Vertical',
  ].join('\n');

  const html = `
    <div style="font-family: system-ui, sans-serif; color: #2a2a30; line-height: 1.6;">
      <h2 style="margin-bottom: 8px; color: #26368a;">Recuperar tu contrase&ntilde;a</h2>
      <p>Hola ${escaparHtml(usuario.nombre)},</p>
      <p>Recibimos un pedido para restablecer la contrase&ntilde;a de tu cuenta.</p>
      <p style="margin: 24px 0;">
        <a href="${enlace}"
           style="background:#26368a;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;">
          Elegir una contrase&ntilde;a nueva
        </a>
      </p>
      <p style="font-size: 14px; color: #5f606a;">
        El enlace vence en una hora y se puede usar una sola vez.<br>
        Si no pediste el cambio, ignor&aacute; este mensaje.
      </p>
      <p style="color: #26368a; font-weight: 600;">Andes Vertical</p>
    </div>
  `;

  return enviar({
    para: usuario.email,
    asunto: 'Recuperar tu contrasena - Andes Vertical',
    texto,
    html,
  });
};

/**
 * Respuesta a una consulta, escrita por el administrador en el panel.
 * Sale de la cuenta del comercio (MAIL_FROM) y cita la consulta original.
 */
export const enviarMailRespuesta = async ({ consulta, mensaje }) => {
  const fecha = consulta.createdAt.toLocaleDateString('es-AR');
  const original = consulta.mensaje
    .split('\n')
    .map((linea) => `> ${linea}`)
    .join('\n');

  const texto = [mensaje, '', 'Andes Vertical', '', `El ${fecha} escribiste:`, original].join('\n');

  const html = `
    <div style="font-family: system-ui, sans-serif; color: #2a2a30; line-height: 1.6;">
      <p style="white-space: pre-line;">${escaparHtml(mensaje)}</p>
      <p style="color: #26368a; font-weight: 600;">Andes Vertical</p>
      <div style="margin-top: 24px; padding-left: 12px; border-left: 3px solid #d0d2d8; color: #5f606a; font-size: 14px;">
        <p style="margin: 0 0 4px;">El ${fecha} escribiste:</p>
        <p style="margin: 0; white-space: pre-line;">${escaparHtml(consulta.mensaje)}</p>
      </div>
    </div>
  `;

  return enviar({
    para: consulta.email,
    asunto: `Re: ${consulta.asunto} - Andes Vertical`,
    texto,
    html,
  });
};

/**
 * Aviso al comercio de que entro una consulta nueva desde el sitio.
 * Llega a la casilla desde la que salen los mails (MAIL_FROM), con
 * Reply-To al visitante, y trae el enlace a la consulta en el panel.
 */
export const enviarAvisoConsulta = async ({ consulta, publicacion }) => {
  const base = process.env.APP_URL || 'http://localhost:5173';
  const enlace = `${base}/admin/consultas?ver=${consulta._id}`;

  const datos = [
    ['Nombre', consulta.nombre],
    ['Email', consulta.email],
    ['Teléfono', consulta.telefono],
    ['Publicación', publicacion?.nombre],
  ].filter(([, valor]) => valor);

  const texto = [
    `Entró una consulta nueva desde el sitio: "${consulta.asunto}".`,
    '',
    ...datos.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`),
    '',
    consulta.mensaje,
    '',
    `Verla y responderla en el panel: ${enlace}`,
  ].join('\n');

  const filas = datos
    .map(
      ([etiqueta, valor]) =>
        `<tr><td style="padding: 2px 16px 2px 0; color: #5f606a;">${etiqueta}</td><td>${escaparHtml(valor)}</td></tr>`
    )
    .join('');

  const html = `
    <div style="font-family: system-ui, sans-serif; color: #2a2a30; line-height: 1.6;">
      <h2 style="margin-bottom: 8px; color: #26368a;">Consulta nueva: ${escaparHtml(consulta.asunto)}</h2>
      <table style="font-size: 14px; border-collapse: collapse;">${filas}</table>
      <p style="margin-top: 16px; white-space: pre-line;">${escaparHtml(consulta.mensaje)}</p>
      <p style="margin: 24px 0;">
        <a href="${enlace}"
           style="background:#26368a;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;">
          Ver la consulta en el panel
        </a>
      </p>
      <p style="font-size: 14px; color: #5f606a;">Si respondés este mail, la respuesta le llega a ${escaparHtml(consulta.nombre)}.</p>
    </div>
  `;

  return enviar({
    asunto: `Consulta nueva: ${consulta.asunto} - Andes Vertical`,
    texto,
    html,
    responderA: consulta.email,
  });
};
