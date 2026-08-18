const nodemailer = require("nodemailer");

// RF07 - notificación por correo ante cambios de estado de una reserva (HU09)
async function sendReservationEmail({ to, subject, text }) {
  // En entorno de pruebas/demo, si no hay credenciales configuradas,
  // simplemente se registra en consola en lugar de enviar el correo real.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[EMAIL SIMULADO] Para: ${to} | Asunto: ${subject} | ${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

module.exports = sendReservationEmail;
