import nodemailer from 'nodemailer';
import config from '../../config/config';

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: Number(config.email.port),
    auth: {
        user: config.email.user,
        pass: config.email.password,
    },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
    const mailOptions = {
        from: 'Ravn store 👻" <ravn@store.com>',
        to: to,
        subject: subject,
        html: html,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw new Error("Email couldn't be sent");
    }
};
