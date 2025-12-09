
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, WorkerProfile, EmployerProfile } from '../types';

interface AuthContextType {
  user: User | null;
  allUsers: User[]; // New field
  workerProfile: WorkerProfile | null;
  employerProfile: EmployerProfile | null;
  login: (name: string, email: string, role: UserRole) => void;
  signup: (name: string, email: string, role: UserRole) => void;
  updateWorkerProfile: (profile: WorkerProfile) => void;
  updateEmployerProfile: (profile: EmployerProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Initial Users for Admin View
const MOCK_USERS: User[] = [
    { id: 'admin1', name: 'Administrator', email: 'admin@test.com', role: 'admin', profileCompleted: true },
    { id: 'emp1', name: 'ABC Construction', email: 'comp@test.com', role: 'employer', profileCompleted: true },
    { id: 'wkr1', name: 'Worker User', email: 'worker@test.com', role: 'worker', profileCompleted: true },
    { id: 'wkr2', name: 'Rahul Kumar', email: 'rahul@example.com', role: 'worker', profileCompleted: false },
    { id: 'wkr3', name: 'Amit Singh', email: 'amit@example.com', role: 'worker', profileCompleted: false },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);

  useEffect(() => {
    // Check localStorage for persisted user
    const savedUser = localStorage.getItem('laborLinkUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Mock loading profile
      const savedWorkerProfile = localStorage.getItem(`workerProfile_${parsedUser.id}`);
      if (savedWorkerProfile) setWorkerProfile(JSON.parse(savedWorkerProfile));

      const savedEmployerProfile = localStorage.getItem(`employerProfile_${parsedUser.id}`);
      if (savedEmployerProfile) setEmployerProfile(JSON.parse(savedEmployerProfile));
    }

    // Load All Users
    const savedAllUsers = localStorage.getItem('laborLinkAllUsers');
    if (savedAllUsers) {
      setAllUsers(JSON.parse(savedAllUsers));
    } else {
      localStorage.setItem('laborLinkAllUsers', JSON.stringify(MOCK_USERS));
    }
  }, []);

  const login = (name: string, email: string, role: UserRole) => {
    // In a real app, this would validate with a backend
    // For prototype, we simulate a user ID based on email
    const id = email.replace(/[^a-zA-Z0-9]/g, '');
    const newUser: User = { id, name, email, role, profileCompleted: false };
    
    // Check if profile exists in local storage
    const savedWorker = localStorage.getItem(`workerProfile_${id}`);
    const savedEmployer = localStorage.getItem(`employerProfile_${id}`);
    
    if (savedWorker || savedEmployer) {
      newUser.profileCompleted = true;
    }

    setUser(newUser);
    if (savedWorker) setWorkerProfile(JSON.parse(savedWorker));
    if (savedEmployer) setEmployerProfile(JSON.parse(savedEmployer));

    localStorage.setItem('laborLinkUser', JSON.stringify(newUser));

    // Update All Users List if not exists
    setAllUsers(prev => {
      if (!prev.find(u => u.email === email)) {
        const updated = [...prev, newUser];
        localStorage.setItem('laborLinkAllUsers', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const signup = (name: string, email: string, role: UserRole) => {
    const id = email.replace(/[^a-zA-Z0-9]/g, '');
    const newUser: User = { id, name, email, role, profileCompleted: false };
    setUser(newUser);
    localStorage.setItem('laborLinkUser', JSON.stringify(newUser));

    // Add to All Users List
    setAllUsers(prev => {
        const updated = [...prev, newUser];
        localStorage.setItem('laborLinkAllUsers', JSON.stringify(updated));
        return updated;
    });
  };

  const updateWorkerProfile = (profile: WorkerProfile) => {
    setWorkerProfile(profile);
    if (user) {
      const updatedUser = { ...user, profileCompleted: true };
      setUser(updatedUser);
      localStorage.setItem('laborLinkUser', JSON.stringify(updatedUser));
      localStorage.setItem(`workerProfile_${user.id}`, JSON.stringify(profile));
      
      // Update in allUsers list too
      setAllUsers(prev => {
        const updated = prev.map(u => u.id === user.id ? updatedUser : u);
        localStorage.setItem('laborLinkAllUsers', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const updateEmployerProfile = (profile: EmployerProfile) => {
    setEmployerProfile(profile);
    if (user) {
      const updatedUser = { ...user, profileCompleted: true };
      setUser(updatedUser);
      localStorage.setItem('laborLinkUser', JSON.stringify(updatedUser));
      localStorage.setItem(`employerProfile_${user.id}`, JSON.stringify(profile));
      
      // Update in allUsers list too
      setAllUsers(prev => {
        const updated = prev.map(u => u.id === user.id ? updatedUser : u);
        localStorage.setItem('laborLinkAllUsers', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const logout = () => {
    setUser(null);
    setWorkerProfile(null);
    setEmployerProfile(null);
    localStorage.removeItem('laborLinkUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      allUsers,
      workerProfile, 
      employerProfile, 
      login, 
      signup, 
      updateWorkerProfile, 
      updateEmployerProfile, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};