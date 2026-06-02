import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { IUser } from '@/types';
import { useGetCurrentUser } from '@/lib/queries';

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useGetCurrentUser();

  const isAuthenticated = useMemo(() => {
    const token = localStorage.getItem('token');
    return !!token && !!user;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line
export function useUserContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUserContext must be used within AuthProvider');
  }
  return context;
}