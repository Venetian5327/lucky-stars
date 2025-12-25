import React, { useEffect } from 'react';
import { Rocket } from 'lucide-react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';

interface LaunchScreenProps {
  onComplete: () => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onComplete }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Layout className="flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ y: 200, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="mb-8"
      >
        <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-30 rounded-full"></div>
            <Rocket size={120} className="text-yellow-400 relative z-10 transform -rotate-45 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-4 drop-shadow-sm"
      >
        Brave Planet
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-lg text-blue-200 mb-12 max-w-xs"
      >
        Board the ship and conquer every star!
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        onClick={onComplete}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 rounded-full text-xl font-bold shadow-lg border border-blue-400/30"
      >
        Enter Spaceship 🚀
      </motion.button>
    </Layout>
  );
};