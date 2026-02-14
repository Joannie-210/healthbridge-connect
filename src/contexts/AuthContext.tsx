import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/healthcare';
import { mockUser } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (_email: string, _password: string, role: UserRole) => {
    const users: Record<UserRole, User> = {
      doctor: mockUser,
      admin: { id: 'admin1', name: 'System Admin', email: 'admin@shms.com', role: 'admin', department: 'Administration' },
      patient: { id: 'p1', name: 'James Wilson', email: 'james@email.com', role: 'patient' },
      nurse: { id: 'n1', name: 'Maria Garcia', email: 'maria@shms.com', role: 'nurse', department: 'General' },
    };
    setUser(users[role]);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
