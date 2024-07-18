'use client';

import React from 'react'

import { useUser } from '@/context/user/UserContext';

import AuthBox from './auth/AuthBox';
import Reminder from './Reminder/Reminder';
import { testRoute } from '@/services/authService';

const Container = () => {
    const { user: { isVerified } } = useUser();

    const testing = async () => {
        const res = await testRoute();
        console.log(res);
    }

    return (
        <>
            {isVerified ?
                <Reminder /> :
                <AuthBox />
            }

            <button className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80" onClick={testing}>
                Test Route
            </button>
        </>
    )
}

export default Container;