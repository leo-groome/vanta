import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function test() {
  console.log('Iniciando prueba de envío SMTP...');
  console.log('Configuración:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? '********' : 'FALTANTE',
    dest: process.env.DEST_EMAIL
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Verificando conexión...');
    await transporter.verify();
    console.log('Conexión exitosa con el servidor SMTP.');

    console.log('Enviando correo de prueba...');
    const info = await transporter.sendMail({
      from: `"Prueba Vanta" <${process.env.SMTP_USER}>`,
      to: process.env.DEST_EMAIL,
      subject: 'Prueba de Conexión SMTP - Vanta Solutions',
      text: 'Si recibes esto, el sistema de correos está funcionando correctamente.',
    });

    console.log('Correo enviado con éxito:', info.messageId);
  } catch (error) {
    console.error('ERROR en la prueba:', error);
  }
}

test();
