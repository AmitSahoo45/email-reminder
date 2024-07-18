import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';

import { createReminder, deleteReminder, getAllReminder } from '@/services/reminderService';
import { useUser } from '@/context/user/UserContext';
import { logoutUser } from '@/services/authService';
import ReminderCard from './ReminderCard';

const Reminder = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const { user: { name }, setUser } = useUser();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Reminder>();

    const handleLogout = async () => {
        try {
            await logoutUser();
            setUser({ userid: null, name: null, isVerified: false });
            toast.success('Logged out successfully');
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const onSubmit: SubmitHandler<Reminder> = async (data) => {
        try {
            const { title, message, datetime } = data;

            if (!title || !message || !datetime)
                return toast.error('All fields are required');

            if (new Date(datetime) < new Date())
                return toast.error('Invalid datetime');

            const remid: string = await createReminder(data);
            toast.success('Reminder created successfully');

            setReminders([...reminders, { title, message, datetime, remid }]);
            // reset();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const getAllReminders = async () => {
        try {
            const data: Reminder[] = await getAllReminder();
            console.log(data);
            setReminders(data);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleDeleteReminder = async (id: string) => {
        try {
            await deleteReminder(id);
            toast.success('Reminder deleted successfully');
            setReminders(reminders.filter((reminder) => reminder.remid !== id));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getAllReminders();
    }, []);

    return (
        <section className='w-full px-4'>
            <div className='w-full flex items-center justify-between'>
                <h1 className="text-2xl">Welcome, {name}</h1>
                {name && (
                    <div>
                        <button
                            className="inline-flex w-full items-center justify-center rounded-md bg-red-500 px-1.5 py-1 font-semibold leading-7 text-white hover:bg-red-700"
                            type="button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

            <div className='mt-8 mb-5'>
                <h2 className="text-xl mb-4">Create a Reminder</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-auto sm:w-2/3 w-full">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium">Title</label>
                        <input
                            id="title"
                            {...register('title', { required: 'Title is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black py-2 px-3"
                        />
                        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium">Message</label>
                        <textarea
                            id="message"
                            {...register('message', { required: 'Message is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black py-2 px-3"
                        />
                        {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="datetime" className="block text-sm font-medium">Date & Time</label>
                        <input
                            id="datetime"
                            type="datetime-local"
                            {...register('datetime', { required: 'Date and time are required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black py-2 px-3"
                        />
                        {errors.datetime && <p className="mt-2 text-sm text-red-600">{errors.datetime.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Create Reminder
                        </button>
                    </div>
                </form>

                <section>
                    <h2 className="text-xl mt-8 mb-4">Reminders</h2>
                    {reminders.map((reminder) => (
                        <ReminderCard
                            reminder={reminder}
                            onDelete={handleDeleteReminder}
                            key={reminder.remid}
                        />
                    ))}

                    {reminders && reminders.length === 0 && <p className="text-center">No reminders found!!</p>}
                </section>
            </div>
        </section>
    )
}

export default Reminder