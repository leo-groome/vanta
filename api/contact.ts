import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, whatsapp, email, industry, goal, message, website } = req.body;

  // Security: Honeypot check
  if (website && website.trim().length > 0) {
    return res.status(200).json({ ok: true, note: 'Spam detected' });
  }

  // Validation
  if (!name || !company || !whatsapp || !email || !industry || !goal) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

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
    // 1. Email to Vanta Solutions (Lead Notification)
    await transporter.sendMail({
      from: `"Vanta Solutions Bot" <${process.env.SMTP_USER}>`,
      to: process.env.DEST_EMAIL || 'VantaSolutions-Service@outlook.com',
      subject: `Nuevo Lead: ${name} - ${company}`,
      text: `
        Nuevo contacto recibido:
        -------------------------
        Nombre: ${name}
        Empresa: ${company}
        WhatsApp: ${whatsapp}
        Email: ${email}
        Industria: ${industry}
        Objetivo: ${goal}
        Mensaje: ${message || 'Sin mensaje adicional'}
        
        Enviado el: ${new Date().toLocaleString('es-MX')}
      `,
    });

    // 2. Auto-reply to Client with questions
    await transporter.sendMail({
      from: `"Vanta Solutions" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '¿Podemos agendar una cita? Cuestionario inicial',
      text: `
        Hola ${name},

        Gracias por tu interés en Vanta Solutions. Hemos recibido tu solicitud de diagnóstico estratégico.

        Para aprovechar al máximo nuestra futura reunión, por favor responde a este correo con la siguiente información:

        1. ¿Qué día y hora te convienen para una reunion? 
        2. ¿Prefieres que la reunión sea por Google Meet, o presencial?
        3. En una frase, ¿cuál es el obstáculo principal que quieres resolver ahora mismo?
        4. ¿Hay alguien más de tu equipo que deba estar presente?

        Quedamos atentos a tu respuesta para confirmar el espacio.

        Atentamente,
        El equipo de Vanta Solutions
        www.vantasolutions.tech
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('SMTP Error:', error);
    return res.status(500).json({ error: 'Error sending email', details: error.message });
  }
}
