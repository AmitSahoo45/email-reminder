'use client';

import React from 'react';

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onDelete }) => {
    const handleDelete = () => onDelete(reminder.remid)

    return (
        <div className="bg-white shadow-md rounded-lg py-1 px-2 mb-4">
            <h3 className="text-lg font-bold text-black">{reminder.title}</h3>
            <p className="text-gray-700">{reminder.message}</p>
            <p className="text-gray-500">{new Date(reminder.datetime).toLocaleString()}</p>
            <button
                onClick={handleDelete}
                className="mt-2 inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
            >
                Delete
            </button>
        </div>
    );
};

export default ReminderCard;
