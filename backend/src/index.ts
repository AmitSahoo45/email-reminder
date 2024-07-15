import express, { Express, Request, Response, Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import cors from 'cors'

import { authRouter, reminderRouter } from './routes'
import { emailReminderCronJob } from './controller/reminder';

dotenv.config()

const app: Application = express()
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
    res.send(`Email Reminder Cron Job : Backend`)
})

app.use('/auth', authRouter);
app.use('/reminder', reminderRouter);

emailReminderCronJob();

const port = (process.env.PORT || 5000) as Number

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
})
    .on('error', (err: Error) => {
        console.log('This is an error');
        console.log(err);
        process.exit(1);
    })

