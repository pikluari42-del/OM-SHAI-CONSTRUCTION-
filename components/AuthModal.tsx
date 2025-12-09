import React, { useState } from 'react';
import { X, User, Lock, Mail, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (role: UserRole) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('worker'); // Default role selection for signup
  const { login, signup } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Automatic role detection for Login ONLY for prototype simplicity
    // If signing up, we use the selected role.
    let finalRole = role;
    if (isLogin) {
        if (email.toLowerCase().includes('admin')) finalRole = 'admin';
        // In a real app, backend determines role on login. 
        // Here we just let them in, role update happens via context mock if email matches admin
        // For employer/worker differentiation in mock login, we default to whatever state is set if not admin
    }

    if (isLogin) {
      // For demo login, we just pass what the user "intends" or what we detect
      const derivedRole = email.includes('admin') ? 'admin' : (email.includes('comp') ? 'employer' : 'worker');
      const displayName = name || (derivedRole === 'admin' ? "Administrator" : (derivedRole === 'employer' ? "Company HR" : "Worker User"));
      login(displayName, email, derivedRole);
      if (onLoginSuccess) onLoginSuccess(derivedRole);
    } else {
      signup(name, email, role);
      if (onLoginSuccess) onLoginSuccess(role);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X size={24} />
          </button>

          <div className="bg-brand-blue px-4 py-8 text-center">
             <h2 className="text-2xl font-bold text-white mb-2">
               {isLogin ? t.login : "Join as..."}
             </h2>
             <p className="text-brand-light opacity-80">
               {isLogin ? "Welcome back!" : "Choose your account type"}
             </p>
          </div>

          <div className="px-6 py-6">
            
            {/* Role Selection for Signup */}
            {!isLogin && (
                <div className="flex gap-4 mb-6">
                    <button 
                        type="button"
                        onClick={() => setRole('worker')}
                        className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center transition ${role === 'worker' ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                        <UserCheck size={24} className="mb-2" />
                        <span className="font-bold text-sm">Job Seeker</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('employer')}
                        className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center transition ${role === 'employer' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                        <Briefcase size={24} className="mb-2" />
                        <span className="font-bold text-sm">Employer</span>
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {role === 'employer' ? "Company / Contact Name" : "Full Name"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                      placeholder={role === 'employer' ? "ABC Construction Ltd" : "John Doe"}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-orange focus:border-brand-orange"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition transform hover:scale-[1.02]"
              >
                {isLogin ? 'Login' : `Register as ${role === 'employer' ? 'Employer' : 'Worker'}`}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "New user?" : "Already have an account?"}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold text-brand-orange hover:underline"
                >
                  {isLogin ? "Register Now" : t.login}
                </button>
              </p>
            </div>
            
            <div className="mt-4 bg-gray-50 p-3 rounded text-xs text-gray-500">
                <strong>Demo Accounts:</strong><br/>
                Admin: admin@test.com<br/>
                Employer: comp@test.com<br/>
                Worker: worker@test.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;