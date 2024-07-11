import { Request, Response } from 'express';

import { cassandraClient } from '../db/connection'

import { UserModel } from '../types/userInterfaces';
import {
    hashPassword, comparePassword, generateToken, verifyToken,
    generateId, generateOTP, emailIsValid
}
    from '../utils/auth'
import { otpTemplate } from '../template'
import { sendEmail } from '../utils/emailService';

const TestRoute = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).json({ message: 'Success' })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

const SignIn = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    if (!emailIsValid(email))
        return res.status(400).json({ message: 'Invalid email' });

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();
    const otpid = generateId();
    const userid = generateId();

    try {
        await Promise.all([
            cassandraClient.execute(
                'INSERT INTO email_reminder.e_users (userid, name, email, password, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userid, name, email, hashedPassword, false, new Date(), new Date()],
                { prepare: true }
            ),

            cassandraClient.execute(
                'INSERT INTO e_otp (otpid, e_userid, otp, created_at, is_verified) VALUES (?, ?, ?, ?, ?)',
                [otpid, userid, otp, new Date(), false],
                { prepare: true }
            ),

            sendEmail({
                to_email: email,
                subject: `Welcome to e-Reminder | ${name}`,
                html: otpTemplate(name, otp)
            })
        ]);

        const token = generateToken({ userid });

        return res.status(200).json({ id: userid, token });
    } catch (error: unknown) {
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

const Login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    console.log(email, password)

    if (!email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    if (!emailIsValid(email))
        return res.status(400).json({ message: 'Invalid email' });

    try {
        const { rows: [user] } = await cassandraClient.execute(
            `SELECT * FROM e_users WHERE email = ? LIMIT 1 ALLOW FILTERING;`,
            [email],
            { prepare: true }
        );

        return res.status(200).json({ statusOs: true });
    } catch (error: unknown) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });

        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}

const SendOTP = async (req: Request, res: Response): Promise<Response> => {
    const { id: userId } = req.body;

    try {
        const { rows } = await cassandraClient.execute(
            `SELECT email, userid FROM e_users WHERE userid = ?`,
            [userId],
            { prepare: true }
        );

        const email = rows[0]?.email;

        if (!email)
            return res.status(400).json({ message: 'Email not found' });

        const otp_res = await cassandraClient.execute(
            `SELECT * FROM e_otp WHERE e_userid = ? ORDER BY created_at DESC LIMIT 1;`,
            [userId],
            { prepare: true }
        );

        const lastOtp = otp_res.rows[0];

        if (lastOtp && new Date().getTime() - new Date(lastOtp.created_at).getTime() < 10 * 60 * 1000) {
            const timeLeft = Math.floor((10 * 60 * 1000 - (new Date().getTime() - new Date(lastOtp.created_at).getTime())) / 1000);
            return res.status(200).json({ sent: false, timeLeft });
        }

        const newOtp = generateOTP(),
            otpid = generateId();

        await cassandraClient.execute(
            'INSERT INTO e_otp (otpid, e_userid, otp, created_at, is_verified) VALUES (?, ?, ?, ?, ?);',
            [otpid, userId, newOtp, new Date(), false],
            { prepare: true }
        );

        await sendEmail({
            to_email: email,
            subject: 'Your new OTP',
            html: otpTemplate('Cron Email Reminder', newOtp)
        });

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error: unknown) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });

        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}


const VerifyOTP = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, otp } = req.body;

        if (!otp || !id)
            return res.status(400).json({ message: 'Empty parameters' });

        const query = `
            SELECT * FROM e_otp 
            WHERE e_userid = ? AND otp = ? AND is_verified = false
            LIMIT 1
        `;

        const [result] = await cassandraClient.execute(query, [id, otp], { prepare: true });

        if (!result || result.rows.length === 0)
            return res.status(400).json({ message: 'Invalid OTP or already verified' });

        const { created_at, otpid } = result.rows[0];

        if (new Date().getTime() - new Date(created_at).getTime() > 10 * 60 * 1000)
            return res.status(400).json({ message: 'OTP expired' });

        const queries = [
            {
                query: 'UPDATE e_otp SET is_verified = true WHERE e_userid = ? AND created_at = ? AND otpid = ?;',
                params: [id, created_at, otpid]
            },
            {
                query: 'UPDATE e_users SET is_verified = true WHERE userid = ?;',
                params: [id]
            }
        ];

        await cassandraClient.batch(queries, { prepare: true });

        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}



export {
    TestRoute,
    SignIn,
    Login,
    SendOTP,
    VerifyOTP
};