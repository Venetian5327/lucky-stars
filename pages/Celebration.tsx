import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { Star, Home, ArrowRight } from 'lucide-react';
import { StorageService } from '../services/storageService';

export const Celebration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { stars: number; planetName: string } || { stars: 0, planetName: 'Unknown' };
  
  const [stage, setStage] = useState(0); // 0: Planet, 1: Explosion/Coins, 2: Collected

  useEffect(() => {
    // 1. Update storage immediately with transaction history
    // We check if we already rewarded for this specific navigation state to avoid duplicates if re-rendering, 
    // but React Router state usually persists. Simple check is fine for this demo.
    StorageService.addStarTransaction(state.stars, `Conquered ${state.planetName}`);

    // 2. Start animation sequence
    const t1 = setTimeout(() => setStage(1), 1000); // Planet explode
    const t2 = setTimeout(() => setStage(2), 3500); // Show UI

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <Layout className="flex flex-col items-center justify-center bg-black">
      {/* 1. Planet Animation */}
      {stage === 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ duration: 1 }}
          className="w-64 h-64 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 shadow-[0_0_50px_rgba(74,222,128,0.5)] flex items-center justify-center"
        >
           <span className="text-9xl">🌍</span>
        </motion.div>
      )}

      {/* 2. Star Explosion */}
      {stage === 1 && (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Main Coin */}
            <motion.div
                initial={{ scale: 0, opacity: 0, rotateY: 0 }}
                animate={{ 
                    scale: [0, 1.5, 1], 
                    rotateY: 1080,
                    x: '40vw',
                    y: '-40vh',
                    opacity: [1, 1, 0]
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute z-20 text-yellow-400"
            >
                <Star size={120} fill="currentColor" />
            </motion.div>

            {/* Fireworks / Particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{ 
                        x: (Math.random() - 0.5) * 400, 
                        y: (Math.random() - 0.5) * 400,
                        opacity: 0,
                        scale: Math.random() * 2
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-4 h-4 rounded-full bg-yellow-300"
                />
            ))}
            
            <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="absolute top-20 right-10"
            >
                {/* Target Jar */}
                <div className="w-20 h-24 border-4 border-white/30 rounded-xl flex items-end justify-center pb-2 bg-white/5 animate-pulse">
                    <div className="w-full h-1/2 bg-yellow-400/50 blur-md"></div>
                </div>
            </motion.div>
        </div>
      )}

      {/* 3. Final Result UI */}
      {stage === 2 && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md px-6 text-center"
        >
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-2">
                Mission Complete!
            </h1>
            <p className="text-xl text-blue-200 mb-8">{state.planetName} Conquered!</p>

            <div className="bg-white/10 p-8 rounded-3xl mb-8 border border-white/20 backdrop-blur-sm">
                <div className="text-lg text-blue-100 mb-2">You earned</div>
                <div className="flex items-center justify-center gap-3 text-5xl font-black text-yellow-400 drop-shadow-md">
                    <Star size={48} fill="currentColor" />
                    +{state.stars}
                </div>
            </div>

            <div className="space-y-4">
                <button 
                    onClick={() => navigate('/home')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                    <Home size={20} /> Back to Ship
                </button>
                <button 
                    onClick={() => navigate('/home')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                    Next Planet <ArrowRight size={20} />
                </button>
            </div>
        </motion.div>
      )}
    </Layout>
  );
};