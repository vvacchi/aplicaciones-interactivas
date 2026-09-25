import nodemailer from 'nodemailer';

/**
 * Envio de correo por SMTP.
 *
 * Se habla SMTP generico y no la API de un proveedor puntual: cambiar de
 * Gmail a Brevo, Resend o cualquier otro es cambiar las variables de
 * entorno, sin tocar el codigo.
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

const enviar = async ({ para, asunto, texto, html }) => {
  const { remitente, ...transporte } = config();
  const transporter = nodemailer.createTransport(transporte);

  return transporter.sendMail({ from: remitente, to: para, subject: asunto, text: texto, html });
};

/**
 * Correo de recuperacion de contrasena.
 *
 * El enlace apunta a la pantalla del frontend que toma el token del query
 * string. El token tambien va en el texto para poder probar el circuito
 * mientras esa pantalla no exista.
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
    <div style="font-family: system-ui, sans-serif; color: #1a1a1a; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Recuperar tu contrase&ntilde;a</h2>
      <p>Hola ${usuario.nombre},</p>
      <p>Recibimos un pedido para restablecer la contrase&ntilde;a de tu cuenta.</p>
      <p style="margin: 24px 0;">
        <a href="${enlace}"
           style="background:#1a1a1a;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
          Elegir una contrase&ntilde;a nueva
        </a>
      </p>
      <p style="font-size: 14px; color: #555;">
        El enlace vence en una hora y se puede usar una sola vez.<br>
        Si no pediste el cambio, ignor&aacute; este mensaje.
      </p>
      <p style="font-size: 14px; color: #555;">Andes Vertical</p>
    </div>
  `;

  return enviar({
    para: usuario.email,
    asunto: 'Recuperar tu contrasena - Andes Vertical',
    texto,
    html,
  });
};