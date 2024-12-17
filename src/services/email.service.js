import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPassword
    }
});

export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Guitar Store" <noreply@guitarstore.com>',
            to,
            subject,
            html
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export const sendWelcomeEmail = async (user) => {
    const subject = 'Bienvenido a Guitar Store';
    const html = `
    <h1>Bienvenido a Guitar Store, ${user.name}!</h1>
    <p>Gracias por registrarte en nuestra tienda. Esperamos que disfrutes de nuestros productos.</p>
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
  `;
    return sendEmail(user.email, subject, html);
};

export const sendOrderConfirmationEmail = async (user, order) => {
    const subject = 'Confirmación de Orden - Guitar Store';
    const html = `
    <h1>Gracias por tu compra, ${user.name}!</h1>
    <p>Tu orden #${order.code} ha sido confirmada.</p>
    <p>Total: $${order.total.toFixed(2)}</p>
    <p>Recibirás otro correo cuando tu orden sea enviada.</p>
  `;
    return sendEmail(user.email, subject, html);
};