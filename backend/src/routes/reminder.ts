import express from "express";

import { AddReminder, DeleteReminder, ReadAllRemindersByUser, UpdateReminder } from '../controller/reminder';
import authenticator from '../middlewares/auth';

const router = express.Router();

router.post('/add', authenticator, AddReminder);
router.get('/read/:id', authenticator, ReadAllRemindersByUser);
router.patch('/update', UpdateReminder);
router.delete('/delete/:id', DeleteReminder);

export default router;