import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { aboutMe } from '../services/userService'; 
import type { GetMeDto } from '../utility/GetMeDto';

interface UserContextType {
    user: GetMeDto | null;
    isLoadingUser: boolean; 
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<GetMeDto | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

    useEffect(() => {
        fetchUserData();
    }, [])

    const fetchUserData = async () => {
        try {
            const userData = await aboutMe();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    };

    const clearUser = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, isLoadingUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};