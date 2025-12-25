
import React, { useState, useEffect } from 'react';
import { Settings, Gift, Clock, Star } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Task, UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { PinPad } from '../components/PinPad';
import { StarHistoryModal } from '../components/StarHistoryModal';
import { MyRewardsModal } from '../components/MyRewardsModal';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  onEnterParentMode: () => void;
}

export const Home: React.FC<HomeProps> = ({ onEnterParentMode }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stars, setStars] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showPinPad, setShowPinPad] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showMyRewards, setShowMyRewards] = useState(false);

  useEffect(() => {
    // Load initial data
    setProfile(StorageService.getProfile());
    setStars(StorageService.getStars());
    setTasks(StorageService.getTasks());
  }, [showHistory, showMyRewards]); // Reload stars when history or rewards modal closes/changes

  const calculateLevel = (stars: number) => Math.floor(stars / 20) + 1;

  if (!profile) return null;

  return (
    <Layout className="pb-24">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-start bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500 border-4 border-white/20 flex items-center justify-center text-4xl shadow-lg relative">
            {profile.avatar}
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-xs font-bold px-2 py-0.5 rounded-full border border-white">
              Lv.{calculateLevel(stars)}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Captain {profile.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-1.5 text-yellow-400 bg-black/30 px-3 py-1 rounded-full hover:bg-black/50 transition-colors active:scale-95 border border-white/5"
              >
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-lg">{stars}</span>
              </button>
              
              <button
                onClick={() => setShowMyRewards(true)}
                className="flex items-center gap-1 text-pink-300 bg-black/30 px-3 py-1.5 rounded-full hover:bg-black/50 transition-colors active:scale-95 border border-white/5"
              >
                <Gift size={14} />
                <span className="text-xs font-bold">My Rewards</span>
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowPinPad(true)} 
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <Settings size={24} className="text-blue-200" />
        </button>
      </header>

      {/* Task List */}
      <div className="px-6 mt-4">
        <h3 className="text-lg font-bold text-blue-100 mb-4 opacity-80">Today's Missions</h3>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/15 transition-all shadow-lg"
            >
              <div className="w-14 h-14 bg-indigo-600/50 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                {task.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{task.name}</h4>
                <div className="flex items-center gap-3 text-sm text-blue-200 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {task.durationMinutes}m
                  </span>
                  <span className="flex items-center gap-1 text-yellow-300 font-bold">
                    +{task.rewardStars} Stars
                  </span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/timer/${task.id}`)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-2 px-4 rounded-xl text-sm shadow-lg whitespace-nowrap transform active:scale-95 transition-all"
              >
                Go!
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/rewards')}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)] border-4 border-yellow-200 transform hover:scale-105 active:scale-95 transition-all z-40 group"
      >
        <Gift size={32} className="text-white group-hover:rotate-12 transition-transform" />
      </button>

      <PinPad 
        isOpen={showPinPad} 
        onClose={() => setShowPinPad(false)} 
        onSuccess={() => {
          setShowPinPad(false);
          onEnterParentMode();
        }} 
      />

      <StarHistoryModal 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
      />

      <MyRewardsModal
        isOpen={showMyRewards}
        onClose={() => setShowMyRewards(false)}
      />
    </Layout>
  );
};
