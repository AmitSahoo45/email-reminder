import { Response } from 'express';
import cron from 'node-cron';

import { CustomRequest } from '../middlewares/auth';
import { generateId } from '../utils/auth';
import { cassandraClient } from '../db/connection'
import createReport from '../utils/report';
import { convertISTToUTC } from '../utils/timezone';
import { sendEmail } from '../utils/emailService';

const AddReminder = async (req: CustomRequest, res: Response) => {
    const { body: { title, message, datetime}, user: { userid } } = req;

    if (!title || !message || !datetime)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        const utcDatetime = convertISTToUTC(datetime).toISOString();
        console.log(utcDatetime)

        await cassandraClient.execute(
            'INSERT INTO e_reminders (remid, e_userid, title, message, datetime) VALUES (?, ?, ?, ?, ?)',
            [generateId(), userid, title, message, utcDatetime],
            { prepare: true }
        );

        res.status(200).json({ message: 'Reminder created successfully' });
    } catch (error: unknown) {
        res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unexpected error occurred.' });
    }
}

const ReadAllRemindersByUser = async (req: CustomRequest, res: Response) => {
    const { user: { userid } } = req;
    const query = 'SELECT * FROM e_reminders WHERE e_userid = ?';

    try {
        const result = await cassandraClient.execute(query, [userid], { prepare: true });
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unexpected error occurred.' });
    }
}

const UpdateReminder = async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { title, message, datetime } = req.body;
    const query = 'UPDATE e_reminders SET title = ?, message = ?, datetime = ? WHERE remid = ?';
    const params = [title, message, datetime, id];

    try {
        await cassandraClient.execute(query, params, { prepare: true });
        res.status(200).json({ message: 'Reminder updated successfully' });
    } catch (error: unknown) {
        res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unexpected error occurred.' });
    }
}

const DeleteReminder = async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    const query = 'DELETE FROM e_reminders WHERE remid = ?';
    const params = [id];

    try {
        await cassandraClient.execute(query, params, { prepare: true });
        res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error: unknown) {
        res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unexpected error occurred.' });
    }
}

const emailReminderCronJob = () => {
    cron.schedule('* * * * *', async () => { // This cron job runs every minute
        try {
            const remindersResult = await cassandraClient.execute(
                `SELECT remid, e_userid, title, message, datetime FROM e_reminders 
                WHERE datetime <= toTimestamp(now()) ALLOW FILTERING`
            );

            console.log('Reminders:', remindersResult);

            for (const reminder of remindersResult.rows) {
                const userResult = await cassandraClient.execute(
                    'SELECT email FROM e_users WHERE userid = ?', [reminder.e_userid], { prepare: true }
                );

                if (userResult.rowLength > 0) {
                    const user = userResult.first();
                    await sendEmail({
                        to_email: user.email,
                        subject: reminder.title,
                        text: reminder.message,
                        html: `<p>${reminder.message}</p>`
                    });

                    await cassandraClient.execute(
                        'DELETE FROM e_reminders WHERE remid = ?', [reminder.remid], { prepare: true }
                    );
                }
            }

            console.log('Cron job executed');
        } catch (err) {
            console.error('Error executing cron job', err);
        }
    });
};

export { AddReminder, ReadAllRemindersByUser, UpdateReminder, DeleteReminder, emailReminderCronJob }