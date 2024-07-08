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
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        if (!emailIsValid(email))
            return res.status(400).json({ message: 'Invalid email' });

        const hashedPassword = await hashPassword(password);
        const otp = generateOTP(),
            otpid = generateId(),
            userid = generateId();

        const user: UserModel = {
            name,
            email,
            password: hashedPassword,
            userid,
            created_at: new Date(),
            updated_at: new Date(),
            is_verified: false
        }


        await cassandraClient.execute(
            'INSERT INTO email_reminder.e_users (userid, name, email, password, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user.userid, user.name, user.email, user.password, user.is_verified, user.created_at, user.updated_at],
            { prepare: true }
        )

        await cassandraClient.execute(
            'INSERT INTO e_otp (otpid, e_userid, otp, created_at, is_verified) VALUES (?, ?, ?, ?, ?)',
            [otpid, user.userid, otp, new Date(), false],
            { prepare: true }
        )

        await sendEmail({
            to_email: user.email,
            subject: 'Welcome to Cron Email Reminder',
            html: otpTemplate(name, otp)
        })

        // const token = generateToken({ userid: user.userid });

        return res.status(200).json({ id: user.userid });
    } catch (error: unknown) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });

        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

// const SignUp = async (req: Request, res: Response): Promise<Response> => {}

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
            `SELECT * FROM e_otp WHERE e_userid = ? ORDER BY created_at DESC LIMIT 1`,
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
            'INSERT INTO e_otp (otpid, e_userid, otp, created_at, is_verified) VALUES (?, ?, ?, ?, ?)',
            [otpid, userId, newOtp, new Date(), false],
            { prepare: true }
        );

        await sendEmail({
            to_email: email,
            subject: 'Your new OTP',
            html: otpTemplate('Cron Email Reminder', newOtp)
        });

        return res.status(200).json({ sent: true });
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
            return res.status(400).json({ message: 'Empty otp value' });

        const otp_res = await cassandraClient.execute(
            `SELECT * FROM e_otp 
            WHERE e_userid = ? AND otp = ? AND is_verified = false
            Order By created_at DESC
            `,
            [id, otp],
            { prepare: true }
        );

        console.log(otp_res.rows);

        // return res.status(200).json({ verified: true });
        return res.status(200).json({ res: otp_res.rows });
    } catch (error: unknown) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });

        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}


export {
    TestRoute,
    SignIn,
    SendOTP,
    VerifyOTP
};