
import React, { useState, useMemo } from 'react';
import { X, Gift, CheckCircle, Clock, Lock, Sparkles } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { RedemptionRequest } from '../types';
import { PinPad } from './PinPad';
import { motion, AnimatePresence } from 'framer-motion';

interface MyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyRewardsModal: React.FC<MyRewardsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'redeemed'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<RedemptionRequest | null>(null);
  const [showPinPad, setShowPinPad] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Reload requests when modal opens or celebration happens
  const requests = useMemo(() => {
    if (!isOpen) return [];
    return StorageService.getRequests();
  }, [isOpen, showCelebration]);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const redeemedRequests = requests.filter(r => r.status === 'approved');

  if (!isOpen) return null;

  const handlePendingClick = (req: RedemptionRequest) => {
    setSelectedRequest(req);
    setShowPinPad(true);
  };

  const handlePinSuccess = () => {
    if (selectedRequest) {
      StorageService.processRequest(selectedRequest.id, true);
      setShowPinPad(false);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setSelectedRequest(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-[#1B1B4B] border border-white/20 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
          
          {/* Celebration Overlay */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-indigo-900/95 flex flex-col items-center justify-center text-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1.2, rotate: 10 }} 
                  transition={{ type: "spring" }}
                >
                  <div className="text-8xl mb-4">🎁</div>
                </motion.div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">Approved!</h2>
                <p className="text-blue-100 text-lg">You earned it!</p>
                <div className="mt-8 text-6xl">✨</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="p-6 bg-[#0B0B2A] border-b border-white/10 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift className="text-pink-400" size={20} /> My Rewards
              </h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/70 transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/5 p-1 mx-6 mt-4 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pending' 
                  ? 'bg-yellow-500 text-indigo-950 shadow-lg' 
                  : 'text-white/50 hover:bg-white/5'
              }`}
            >
              <Clock size={16} /> To Redeem ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('redeemed')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'redeemed' 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'text-white/50 hover:bg-white/5'
              }`}
            >
              <CheckCircle size={16} /> Redeemed ({redeemedRequests.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
            {activeTab === 'pending' ? (
              pendingRequests.length === 0 ? (
                <div className="text-center text-white/30 mt-10">
                  <p>No pending requests.</p>
                  <p className="text-sm mt-2">Go to Reward Book to spend stars!</p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => handlePendingClick(req)}
                    className="w-full bg-white/5 hover:bg-white/10 transition-all rounded-xl p-4 flex justify-between items-center border border-white/10 group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl shrink-0">
                        {req.prizeIcon || '🎁'}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-white group-hover:text-yellow-300 transition-colors">{req.prizeName}</div>
                        <div className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                          Waiting for Parent <Lock size={10} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-500 text-indigo-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      Approve
                    </div>
                  </button>
                ))
              )
            ) : (
              redeemedRequests.length === 0 ? (
                <div className="text-center text-white/30 mt-10">
                  <p>You haven't redeemed any rewards yet.</p>
                </div>
              ) : (
                redeemedRequests.slice().reverse().map((req) => (
                  <div key={req.id} className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-green-500/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl shrink-0">
                        {req.prizeIcon || '🎁'}
                      </div>
                      <div>
                        <div className="font-bold text-white">{req.prizeName}</div>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle size={10} /> Redeemed on {new Date(req.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
          
          {activeTab === 'pending' && pendingRequests.length > 0 && (
             <div className="p-4 bg-indigo-900/50 text-center text-xs text-blue-300 border-t border-white/5">
                Tap an item to Quick Approve with Parent PIN
             </div>
          )}

        </div>
      </div>

      <PinPad 
        isOpen={showPinPad}
        onClose={() => setShowPinPad(false)}
        onSuccess={handlePinSuccess}
      />
    </>
  );
};
