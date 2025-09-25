import { User } from '@/libs/domain/users/member/User';
import { findUserById } from '@/service/UserService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';

type PermissionContextType = {
    permission: number | null;
    setPermission: (value: number | null) => void;
    user: User | null;
};

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
    const [permission, setPermission] = useState<number | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            if (user?.uid) {
                try {
                    const data = await findUserById(user.uid);
                    setUser(data);
                } catch (error) {
                    console.error('Erro ao buscar dados do admin:', error);
                }
            } else {
                setPermission(null);
                setUser(null);
            }
        });

        return () => unsubscribe();;
    }, []);

    return (
        <PermissionContext.Provider value={{ permission, setPermission, user }}>
            {children}
        </PermissionContext.Provider>
    );
}
