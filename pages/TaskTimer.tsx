import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, X, Star } from 'lucide-react';
import { Layout } from '../components/Layout';
import { StorageService } from '../services/storageService';
import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskTimer: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const encouragements = [
    "You're doing great!",
    "Keep it up, brave explorer!",
    "Almost there!",
    "The stars are waiting!",
    "Focus power: 100%!"
  ];

  useEffect(() => {
    const allTasks = StorageService.getTasks();
    const foundTask = allTasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setTimeLeft(foundTask.durationMinutes * 60);
    } else {
      navigate('/home');
    }
  }, [taskId, navigate]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        
        // Random encouragement every ~30s (approx check)
        if (timeLeft % 30 === 0 && timeLeft !== 0 && Math.random() > 0.3) {
           triggerEncouragement();
        }

      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Completed!
      finishTask(true);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const triggerEncouragement = () => {
    setBubbleText(encouragements[Math.floor(Math.random() * encouragements.length)]);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 4000);
  };

  const finishTask = (completed: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (task) {
      navigate('/celebration', { 
        state: { 
          stars: completed ? task.rewardStars : Math.max(0, task.rewardStars - 1),
          planetName: task.name
        } 
      });
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!task) return null;

  // Calculate progress for circle dash
  const totalSeconds = task.durationMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Layout className="flex flex-col items-center justify-between py-8 px-4 bg-gradient-to-b from-indigo-900 to-purple-900">
      
      {/* Top Info */}
      <div className="text-center z-10">
        <div className="text-6xl mb-4 animate-bounce">{task.icon}</div>
        <h2 className="text-3xl font-bold text-white">{task.name}</h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-yellow-300">
          <Star fill="currentColor" />
          <span className="font-bold text-xl">Reward: {task.rewardStars}</span>
        </div>
      </div>

      {/* Timer Circle */}
      <div className="relative flex items-center justify-center my-8">
        {/* SVG Circle */}
        <svg width="300" height="300" className="transform -rotate-90">
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="#ffffff20"
            strokeWidth="20"
            fill="transparent"
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="#6366f1"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Time Text */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-6xl font-black text-white font-mono tracking-wider drop-shadow-lg">
            {formatTime(timeLeft)}
          </span>
          <span className="text-blue-200 mt-2 font-medium">remaining</span>
        </div>

        {/* Encouragement Bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: -180 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute bg-white text-indigo-900 px-6 py-4 rounded-2xl shadow-xl z-20 font-bold text-lg text-center max-w-[200px]"
            >
              {bubbleText}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-6 z-10 w-full max-w-sm justify-center">
        {!isActive && timeLeft === totalSeconds ? (
            <button 
              onClick={toggleTimer}
              className="flex-1 bg-green-500 hover:bg-green-400 text-white p-6 rounded-3xl font-bold text-xl shadow-[0_6px_0_#15803d] active:translate-y-1 active:shadow-none transition-all flex flex-col items-center gap-2"
            >
              <Play size={32} fill="currentColor" />
              START
            </button>
        ) : (
          <>
            <button 
              onClick={() => finishTask(false)}
              className="bg-red-500 hover:bg-red-400 text-white p-5 rounded-3xl font-bold shadow-[0_6px_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all"
            >
              <X size={32} />
            </button>
            
            <button 
              onClick={toggleTimer}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 p-5 rounded-3xl font-bold text-xl shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex justify-center items-center gap-3"
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              {isActive ? 'PAUSE' : 'RESUME'}
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};