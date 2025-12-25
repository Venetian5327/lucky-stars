
import React, { useState, useMemo } from 'react';
import { X, Calendar, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface StarHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimeRange = '7' | '30' | '90';

export const StarHistoryModal: React.FC<StarHistoryModalProps> = ({ isOpen, onClose }) => {
  const [range, setRange] = useState<TimeRange>('7');
  
  // Reload history when modal opens
  const history = useMemo(() => {
    if (!isOpen) return [];
    return StorageService.getStarHistory();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredHistory = history
    // We now show all types of transactions (earned and spent/penalties)
    .filter(item => {
      const days = parseInt(range);
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return item.timestamp > cutoff;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  // Calculate Net Change
  const netChangeInRange = filteredHistory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1B1B4B] border border-white/20 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#0B0B2A] border-b border-white/10 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={20} /> Star History
            </h3>
            <p className="text-xs text-blue-200 mt-1">Track your brave achievements!</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/70 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-4 flex gap-2 shrink-0">
          {(['7', '30', '90'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                range === r 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              Last {r} Days
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="px-6 py-2 shrink-0">
          <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-xl p-4 flex justify-between items-center border border-white/10">
            <span className="text-blue-200 text-sm font-medium">Net Change</span>
            <span className={`text-2xl font-bold ${netChangeInRange >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {netChangeInRange >= 0 ? '+' : ''}{netChangeInRange}
            </span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredHistory.length === 0 ? (
            <div className="text-center text-white/30 mt-10 flex flex-col items-center">
              <Calendar size={48} className="mb-4 opacity-50" />
              <p>No activity in this period.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 flex justify-between items-center border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.amount >= 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.amount >= 0 ? <Star size={18} fill="currentColor" /> : <TrendingDown size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate pr-2">{item.reason}</div>
                    <div className="text-xs text-blue-300">
                      {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                <div className={`font-bold text-lg shrink-0 ${item.amount >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {item.amount >= 0 ? '+' : ''}{item.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
