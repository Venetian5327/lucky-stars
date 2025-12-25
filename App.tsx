import React, { useState, useRef, useEffect } from 'react';
// Fix: Use any casting for react-router-dom to bypass environment-specific type resolution issues
import * as RRD from 'react-router-dom';
const { HashRouter, Routes, Route, Navigate, useNavigate } = RRD as any;
import { VolumeX, Volume2 } from 'lucide-react';
import { LaunchScreen } from './pages/LaunchScreen';
import { Home } from './pages/Home';
import { TaskTimer } from './pages/TaskTimer';
import { Celebration } from './pages/Celebration';
import { RewardBook } from './pages/RewardBook';
import { ParentDashboard } from './pages/ParentDashboard';
import { LoginScreen } from './pages/LoginScreen';
// Fix: Use any casting for framer-motion to bypass environment-specific type resolution issues
import * as FM from 'framer-motion';
const motion = (FM as any).motion;
const AnimatePresence = (FM as any).AnimatePresence;

// 背景音乐 URL - 一段轻快活泼的游戏风格音乐
const BGM_URL = "https://assets.mixkit.co/music/preview/mixkit-games-world-608.mp3";

const AppContent: React.FC<{ isMuted: boolean; toggleMute: () => void }> = ({ isMuted, toggleMute }) => {
  const navigate = useNavigate();
  
  return (
    <>
      {/* 全局音量控制按钮 - 右上角悬浮 */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e: any) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="fixed top-6 right-6 z-[100] p-3 rounded-full bg-indigo-900/40 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all"
      >
        {isMuted ? (
          <VolumeX size={24} className="text-red-400" />
        ) : (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Volume2 size={24} className="text-green-400" />
          </motion.div>
        )}
      </motion.button>

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route 
          path="/home" 
          element={<Home onEnterParentMode={() => navigate('/parent')} />} 
        />
        <Route path="/timer/:taskId" element={<TaskTimer />} />
        <Route path="/celebration" element={<Celebration />} />
        <Route path="/rewards" element={<RewardBook />} />
        <Route path="/parent" element={<ParentDashboard />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  const [showLaunch, setShowLaunch] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频对象
  useEffect(() => {
    const audio = new Audio(BGM_URL);
    audio.loop = true;
    audio.volume = 0.35; // 保持在背景中，不要盖过人声
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startMusic = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay was blocked by browser, user needs to interact first.", err);
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      audioRef.current.muted = nextMuted;
    }
  };

  const handleLaunchComplete = () => {
    startMusic();
    setShowLaunch(false);
  };

  if (showLaunch) {
    return <LaunchScreen onComplete={handleLaunchComplete} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => {
      startMusic(); // 再次确保在用户点击登录后尝试播放
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <HashRouter>
      <AppContent isMuted={isMuted} toggleMute={toggleMute} />
    </HashRouter>
  );
};

export default App;
