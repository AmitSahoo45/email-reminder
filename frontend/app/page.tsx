'use client';

import { useEffect } from 'react';
import Container from "@/components/Container";
import { useUser } from '@/context/user/UserContext';
import axiosInstance from '@/libs/axios/axiosInstance';

export default function Home() {
  const { setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: { userid, name } } } = await axiosInstance.get('/auth/profile');
        setUser({ userid, name, isVerified: true });
      } catch (error: unknown) {
        setUser({ userid: null, name: null, isVerified: false });
      }
    };

    fetchUser();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-14">
      <header>
        <h1 className="text-2xl text-center mb-4">Email Reminder App</h1>
      </header>
      <Container />
    </main>
  );
}
