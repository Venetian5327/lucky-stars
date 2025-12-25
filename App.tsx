
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LaunchScreen } from './pages/LaunchScreen';
import { Home } from './pages/Home';
import { TaskTimer } from './pages/TaskTimer';
import { Celebration } from './pages/Celebration';
import { RewardBook } from './pages/RewardBook';
import { ParentDashboard } from './pages/ParentDashboard';
import { LoginScreen } from './pages/LoginScreen';

// 内部路由组件，用于使用 useNavigate
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

const App: React.FC = () => {
  const [showLaunch, setShowLaunch] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (showLaunch) {
    return <LaunchScreen onComplete={() => setShowLaunch(false)} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
