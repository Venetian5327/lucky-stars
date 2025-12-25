
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { StorageService } from '../services/storageService';
import { ShieldCheck, ShieldAlert, Rocket, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginScreenProps {
  onAuthenticated: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthenticated }) => {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedPassword = StorageService.getAppPassword();
    if (!savedPassword) {
      setIsFirstTime(true);
    }
  }, []);

  const handleAction = () => {
    setError('');
    const savedPassword = StorageService.getAppPassword();

    if (isFirstTime) {
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      StorageService.setAppPassword(password);
      onAuthenticated();
    } else {
      if (password === savedPassword) {
        onAuthenticated();
      } else {
        setError('Incorrect Access Code');
        setPassword('');
      }
    }
  };

  return (
    <Layout className="flex items-center justify-center p-6" showStars={true}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)]">
            {isFirstTime ? <ShieldCheck size={40} /> : <Rocket size={40} />}
          </div>
        </div>

        <h1 className="text-3xl font-black mb-2">
          {isFirstTime ? 'Set Access Code' : 'Welcome Back'}
        </h1>
        <p className="text-blue-200 text-sm mb-8">
          {isFirstTime ? 'Create a password to keep your planet safe.' : 'Enter your secret code to board the ship.'}
        </p>

        <div className="space-y-4">
          <input
            type="password"
            placeholder={isFirstTime ? "Choose Password" : "Enter Password"}
            className="w-full bg-black/30 border border-white/10 p-4 rounded-2xl text-center text-2xl tracking-widest focus:outline-none focus:border-indigo-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
          />

          {isFirstTime && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-black/30 border border-white/10 p-4 rounded-2xl text-center text-2xl tracking-widest focus:outline-none focus:border-indigo-500 transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAction()}
            />
          )}

          {error && (
            <motion.p 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              className="text-red-400 text-xs font-bold flex items-center justify-center gap-1"
            >
              <ShieldAlert size={14} /> {error}
            </motion.p>
          )}

          <button
            onClick={handleAction}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:from-indigo-500 hover:to-blue-500 active:scale-95 transition-all mt-4"
          >
            {isFirstTime ? 'Initialize Planet' : 'Enter Ship'} <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-8 text-[10px] text-white/30 uppercase tracking-widest">
          Secured by Brave Planet Protocol
        </div>
      </motion.div>
    </Layout>
  );
};
