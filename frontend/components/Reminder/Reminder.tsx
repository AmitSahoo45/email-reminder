import React from 'react'
import toast from 'react-hot-toast';

import { useUser } from '@/context/user/UserContext';
import { logoutUser } from '@/services/authService';

const Reminder = () => {
    const { user: { name }, setUser } = useUser();

    const handleLogout = async () => {
        try {
            await logoutUser();
            setUser({ userid: null, name: null });
            toast.success('Logged out successfully');
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Welcome, {name}</h1>
            {name && (
                <div>
                    <button
                        className="inline-flex w-full items-center justify-center rounded-md bg-red-500 px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-red-700"
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default Reminder