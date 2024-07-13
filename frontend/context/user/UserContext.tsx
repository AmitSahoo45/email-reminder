'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react'

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({ userid: null, name: null, isVerified: false });

    const clearUser = () => setUser({ userid: null, name: null, isVerified: false });

    return (
        <UserContext.Provider value={{ user, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);

    if (!context)
        throw new Error('useUser must be used within a UserProvider');

    return context;
};