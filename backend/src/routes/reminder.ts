import express from "express";

import { AddReminder, DeleteReminder, ReadAllRemindersByUser } from '../controller/reminder';
import authenticator from '../middlewares/auth';

const router = express.Router();

router.post('/add', authenticator, AddReminder);
router.get('/read', authenticator, ReadAllRemindersByUser);
router.delete('/delete/:id', authenticator, DeleteReminder);

export default router;