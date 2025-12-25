
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { StorageService } from '../services/storageService';
import { Prize, RedemptionRequest } from '../types';
import { Star, ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RewardBook: React.FC = () => {
  const navigate = useNavigate();
  const [stars, setStars] = useState(0);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStars(StorageService.getStars());
    setPrizes(StorageService.getPrizes());
    setRequests(StorageService.getRequests());
  };

  const getPendingCount = (prizeId: string) => {
    return requests.filter(r => r.prizeId === prizeId && r.status === 'pending').length;
  };

  const handleRedeem = (prize: Prize) => {
    setSelectedPrize(prize);
  };

  const confirmRedeem = () => {
    if (!selectedPrize) return;

    // Double check balance
    const currentStars = StorageService.getStars();
    if (currentStars < selectedPrize.cost) {
      alert("Not enough stars!");
      setSelectedPrize(null);
      return;
    }

    // 1. Deduct stars immediately
    StorageService.addStarTransaction(-selectedPrize.cost, `Redeemed: ${selectedPrize.name}`);

    // 2. Create a request
    const newRequest: RedemptionRequest = {
      id: Date.now().toString() + Math.random().toString().slice(2,5),
      prizeId: selectedPrize.id,
      prizeName: selectedPrize.name,
      prizeCost: selectedPrize.cost,
      prizeIcon: selectedPrize.icon || '🎁',
      status: 'pending',
      timestamp: Date.now()
    };

    const updatedRequests = [...requests, newRequest];
    StorageService.saveRequests(updatedRequests);
    
    // 3. Update local state
    refreshData();
    setSelectedPrize(null);
  };

  return (
    <Layout className="bg-indigo-950 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-indigo-950/80 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between">
        <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft />
        </button>
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-yellow-500/30">
            <Star className="text-yellow-400" fill="currentColor" size={20} />
            <span className="font-bold text-xl">{stars}</span>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Reward Book 📒</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {prizes.map((prize) => {
            const pendingCount = getPendingCount(prize.id);
            const canAfford = stars >= prize.cost;

            return (
              <div 
                key={prize.id} 
                className={`relative bg-white/10 rounded-2xl overflow-hidden border ${canAfford ? 'border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'border-white/10'} flex flex-col`}
              >
                <div className="h-32 bg-gray-800 relative flex items-center justify-center text-6xl">
                   {prize.imageUrl ? (
                     <img src={prize.imageUrl} alt={prize.name} className="w-full h-full object-cover opacity-80" />
                   ) : (
                     prize.icon || '🎁'
                   )}

                   {!canAfford && (
                       <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col text-gray-400 backdrop-blur-sm">
                           <Lock size={32} />
                           <span className="text-xs font-bold mt-1">Need {prize.cost - stars} more</span>
                       </div>
                   )}
                   
                   {/* Pending Badge */}
                   {pendingCount > 0 && (
                       <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg border border-white/20">
                           <ShoppingBag size={10} />
                           {pendingCount} waiting
                       </div>
                   )}
                </div>
                
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm mb-1 leading-tight">{prize.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-300 mb-3">
                      <Star size={12} fill="currentColor" />
                      <span className="font-bold">{prize.cost}</span>
                  </div>
                  
                  <button
                    disabled={!canAfford}
                    onClick={() => handleRedeem(prize)}
                    className={`mt-auto w-full py-2 rounded-lg text-sm font-bold transition-all ${
                         canAfford 
                            ? 'bg-yellow-400 hover:bg-yellow-300 text-indigo-900 shadow-lg active:scale-95' 
                            : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem' : 'Locked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-indigo-900 border border-white/20 rounded-3xl p-6 w-full max-w-xs text-center">
                <h3 className="text-xl font-bold mb-2">Redeem Prize?</h3>
                <div className="w-24 h-24 rounded-xl mx-auto mb-4 border-2 border-yellow-400 flex items-center justify-center text-5xl bg-white/10">
                    {selectedPrize.imageUrl ? (
                        <img src={selectedPrize.imageUrl} className="w-full h-full object-cover rounded-xl" alt="" />
                    ) : selectedPrize.icon || '🎁'}
                </div>
                <p className="text-blue-200 mb-6">
                    Use <span className="text-yellow-400 font-bold">{selectedPrize.cost} Stars</span> for<br/>
                    <span className="text-white font-bold">{selectedPrize.name}</span>?
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setSelectedPrize(null)}
                        className="flex-1 bg-white/10 py-3 rounded-xl font-bold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmRedeem}
                        className="flex-1 bg-yellow-400 text-indigo-900 py-3 rounded-xl font-bold"
                    >
                        Yes!
                    </button>
                </div>
                <p className="text-xs text-white/40 mt-4">Stars will be deducted immediately.</p>
            </div>
        </div>
      )}
    </Layout>
  );
};
