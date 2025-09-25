import { StringUtils } from '@/libs/utils/StringUtils';
import { createContext, ReactNode, useContext, useState } from 'react';

interface CredentialsContextProps {
    userId: string;
    role: string;
    setCredentials: (userId: string, role: string) => void;
    clearCredentials: () => void;
}

const CredentialsContext = createContext<CredentialsContextProps | undefined>(undefined);

export function CredentialsProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<string>(StringUtils.EMPTY);
    const [role, setRole] = useState<string>(StringUtils.EMPTY);

    function setCredentials(userId: string, role: string) {
        setUserId(userId);
        setRole(role);
    }

    function clearCredentials() {
        setUserId(StringUtils.EMPTY);
        setRole(StringUtils.EMPTY);
    }

    return (
        <CredentialsContext.Provider value={{ userId, role, setCredentials, clearCredentials }}>
            {children}
        </CredentialsContext.Provider>
    );
}

export function useCredentials() {
    const context = useContext(CredentialsContext);
    if (!context) {
        throw new Error('useCredentials deve ser usado dentro de um CredentialsProvider');
    }
    return context;
}
