import nodemailer from 'nodemailer';
import { emailOptions } from '../types/userInterfaces';

/**
 * Sends an email using nodemailer.
 *
 * @param email - The recipient's email address.
 * @param subject - The subject of the email.
 * @param text - The plain text body of the email.
 * @returns A promise that resolves when the email is sent.
 * @throws An error if the email fails to send.
*/

export const sendEmail = async ({ to_email, subject, text, html }: emailOptions): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: 'demoemailtestingservice@gmail.com',
            pass: 'yxbsdmlrjcsvqkwg',
        },
    });

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: to_email,
        subject,
        text,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Error sending email:', err);
        throw err; 
    }
};
