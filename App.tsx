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

// 备用背景音乐地址 - 确保有一个能响
const BGM_URL = "https://assets.mixkit.co/music/preview/mixkit-games-world-608.mp3"; 

const AppContent: React.FC<{ isMuted: boolean; toggleMute: () => void }> = ({ isMuted, toggleMute }) => {
  const navigate = useNavigate();
  
  return (
    <>
      {/* 全局音量控制按钮 - 移动到左下角，避开右上角的设置键和右下角的奖励键 */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e: any) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="fixed bottom-6 left-6 z-[100] p-4 rounded-2xl bg-indigo-950/60 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all"
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
    audio.volume = 0.35; 
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(err => {
        console.warn("Autoplay blocked. User needs to click something first.", err);
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      audioRef.current.muted = nextMuted;
      
      // 如果从静音切回有声且音乐没在跑，尝试启动
      if (!nextMuted && audioRef.current.paused) {
        startMusic();
      }
    }
  };

  const handleLaunchComplete = () => {
    startMusic(); // 用户点击 "Enter Spaceship" 时播放
    setShowLaunch(false);
  };

  if (showLaunch) {
    return <LaunchScreen onComplete={handleLaunchComplete} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => {
      startMusic(); // 用户登录点击时再次尝试播放
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
