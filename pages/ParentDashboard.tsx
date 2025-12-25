
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { StorageService } from '../services/storageService';
import { Task, Prize, RedemptionRequest } from '../types';
import { Trash2, Plus, LogOut, Gift, Star, ThumbsDown, Database, Download, Upload, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'prizes' | 'requests' | 'settings'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [newPin, setNewPin] = useState('');

  // Form States
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(15);
  const [newTaskStars, setNewTaskStars] = useState(5);

  const [isAddingPrize, setIsAddingPrize] = useState(false);
  const [newPrizeName, setNewPrizeName] = useState('');
  const [newPrizeCost, setNewPrizeCost] = useState(10);

  const [bonusAmount, setBonusAmount] = useState(10);
  const [bonusReason, setBonusReason] = useState('');
  const [deductAmount, setDeductAmount] = useState(5);
  const [deductReason, setDeductReason] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setTasks(StorageService.getTasks());
    setPrizes(StorageService.getPrizes());
    setRequests(StorageService.getRequests());
  };

  const handleExport = () => StorageService.exportAllData();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await StorageService.importAllData(file);
      if (success) {
        alert('Data Restored Successfully! App will reload.');
        window.location.reload();
      } else {
        alert('Failed to restore data. Please check the file.');
      }
    }
  };

  const handleGiveBonus = () => {
    if (bonusAmount <= 0 || !bonusReason.trim()) return alert('Enter amount and reason');
    StorageService.addStarTransaction(bonusAmount, `Parent Reward: ${bonusReason}`);
    alert(`Added ${bonusAmount} stars!`);
    setBonusReason('');
  };

  const handleDeductStars = () => {
    if (deductAmount <= 0 || !deductReason.trim()) return alert('Enter amount and reason');
    StorageService.addStarTransaction(-deductAmount, `Parent Penalty: ${deductReason}`);
    alert(`Deducted ${deductAmount} stars.`);
    setDeductReason('');
  };

  const handleAddTask = () => {
    if (!newTaskName) return;
    const updated = [...tasks, { id: Date.now().toString(), name: newTaskName, durationMinutes: newTaskDuration, rewardStars: newTaskStars, icon: '✨' }];
    StorageService.saveTasks(updated);
    setTasks(updated);
    setIsAddingTask(false);
    setNewTaskName('');
  };

  const handleAddPrize = () => {
    if (!newPrizeName) return;
    const updated = [...prizes, { id: Date.now().toString(), name: newPrizeName, cost: newPrizeCost, icon: '🎁' }];
    StorageService.savePrizes(updated);
    setPrizes(updated);
    setIsAddingPrize(false);
    setNewPrizeName('');
  };

  const handleRequestDecision = (req: RedemptionRequest, approved: boolean) => {
    StorageService.processRequest(req.id, approved);
    setRequests(StorageService.getRequests());
  };

  return (
    <Layout className="bg-[#0f172a]" showStars={false}>
      <header className="bg-slate-800 p-4 shadow-md flex justify-between items-center sticky top-0 z-10 border-b border-white/5">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">HQ</div>
            Parent Command
        </h1>
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-slate-300 hover:text-white bg-white/5 px-4 py-2 rounded-xl transition-colors">
          <LogOut size={16} /> Exit
        </button>
      </header>

      <div className="flex bg-slate-800/50 p-2 overflow-x-auto gap-1">
        {['tasks', 'prizes', 'requests', 'settings'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2.5 px-4 rounded-xl capitalize font-bold text-sm transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="p-4 pb-24 overflow-y-auto h-[calc(100vh-130px)] space-y-4">
        
        {activeTab === 'tasks' && (
            <div className="space-y-4">
                {tasks.map(task => (
                    <div key={task.id} className="bg-slate-800/80 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">{task.icon}</div>
                            <div>
                                <div className="font-bold text-white">{task.name}</div>
                                <div className="text-slate-400 text-xs">{task.durationMinutes}m • <span className="text-yellow-500">{task.rewardStars} Stars</span></div>
                            </div>
                        </div>
                        <button onClick={() => {
                          const updated = tasks.filter(t => t.id !== task.id);
                          StorageService.saveTasks(updated);
                          setTasks(updated);
                        }} className="text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button onClick={() => setIsAddingTask(true)} className="w-full py-6 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 flex items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-400 transition-all">
                    <Plus size={20} /> New Mission
                </button>
                {isAddingTask && (
                  <div className="bg-slate-800 p-5 rounded-2xl border border-indigo-500/50 space-y-3">
                    <input placeholder="Task Name (e.g. Eat Vegetables)" className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none" onChange={e => setNewTaskName(e.target.value)} />
                    <div className="flex gap-2">
                      <div className="flex-1">
                          <label className="text-[10px] text-slate-500 uppercase ml-2 mb-1 block">Minutes</label>
                          <input type="number" placeholder="Duration" className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700" onChange={e => setNewTaskDuration(parseInt(e.target.value))} />
                      </div>
                      <div className="flex-1">
                          <label className="text-[10px] text-slate-500 uppercase ml-2 mb-1 block">Reward</label>
                          <input type="number" placeholder="Stars" className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700" onChange={e => setNewTaskStars(parseInt(e.target.value))} />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddTask} className="flex-1 bg-indigo-600 py-3 rounded-xl font-bold shadow-lg">Save Task</button>
                      <button onClick={() => setIsAddingTask(false)} className="flex-1 bg-slate-700 py-3 rounded-xl">Cancel</button>
                    </div>
                  </div>
                )}
            </div>
        )}

        {activeTab === 'prizes' && (
             <div className="space-y-4">
                {prizes.map(prize => (
                    <div key={prize.id} className="bg-slate-800/80 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">{prize.icon}</div>
                            <div>
                                <div className="font-bold text-white">{prize.name}</div>
                                <div className="text-yellow-500 text-xs font-bold">{prize.cost} Stars</div>
                            </div>
                        </div>
                        <button onClick={() => {
                           const updated = prizes.filter(p => p.id !== prize.id);
                           StorageService.savePrizes(updated);
                           setPrizes(updated);
                        }} className="text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button onClick={() => setIsAddingPrize(true)} className="w-full py-6 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 flex items-center justify-center gap-2 hover:border-pink-500 hover:text-pink-400 transition-all">
                    <Plus size={20} /> New Reward
                </button>
                {isAddingPrize && (
                   <div className="bg-slate-800 p-5 rounded-2xl border border-pink-500/50 space-y-3">
                      <input placeholder="Prize Name (e.g. Disney Visit)" className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700" onChange={e => setNewPrizeName(e.target.value)} />
                      <input type="number" placeholder="Star Cost" className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700" onChange={e => setNewPrizeCost(parseInt(e.target.value))} />
                      <div className="flex gap-3 mt-4">
                        <button onClick={handleAddPrize} className="flex-1 bg-pink-600 py-3 rounded-xl font-bold shadow-lg">Save Prize</button>
                        <button onClick={() => setIsAddingPrize(false)} className="flex-1 bg-slate-700 py-3 rounded-xl">Cancel</button>
                      </div>
                   </div>
                )}
             </div>
        )}

        {activeTab === 'requests' && (
            <div className="space-y-4">
                {requests.length === 0 && <div className="text-center py-20 text-slate-500 italic">No redemption history yet.</div>}
                {requests.slice().reverse().map(req => (
                    <div key={req.id} className="bg-slate-800 p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{req.prizeIcon}</div>
                                <div>
                                    <h3 className="font-bold text-white">{req.prizeName}</h3>
                                    <p className="text-[10px] text-slate-500 uppercase">{new Date(req.timestamp).toLocaleDateString()} {new Date(req.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : req.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{req.status}</span>
                        </div>
                        {req.status === 'pending' && (
                            <div className="flex gap-2">
                                <button onClick={() => handleRequestDecision(req, false)} className="flex-1 bg-red-900/30 hover:bg-red-900/50 py-2.5 rounded-xl text-xs font-bold text-red-400 transition-colors">Reject</button>
                                <button onClick={() => handleRequestDecision(req, true)} className="flex-1 bg-green-700 hover:bg-green-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-colors">Approve</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="space-y-6">
                <div className="bg-slate-800/80 p-5 rounded-3xl border border-yellow-500/20">
                    <h3 className="font-bold text-yellow-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Star size={16} fill="currentColor" /> Reward Stars</h3>
                    <div className="flex gap-2 mb-3">
                        <input type="number" value={bonusAmount} onChange={e => setBonusAmount(parseInt(e.target.value))} className="w-24 bg-slate-900 p-3 rounded-xl border border-slate-700 text-center font-bold text-yellow-400" />
                        <input placeholder="Reason (e.g. Clean room)" value={bonusReason} onChange={e => setBonusReason(e.target.value)} className="flex-1 bg-slate-900 p-3 rounded-xl border border-slate-700" />
                    </div>
                    <button onClick={handleGiveBonus} className="w-full bg-yellow-500 text-slate-900 py-3.5 rounded-xl font-black text-sm uppercase shadow-lg shadow-yellow-500/20 active:scale-95 transition-all">Add Stars</button>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-3xl border border-red-500/20">
                    <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><ThumbsDown size={16} /> Penalize Stars</h3>
                    <div className="flex gap-2 mb-3">
                        <input type="number" value={deductAmount} onChange={e => setDeductAmount(parseInt(e.target.value))} className="w-24 bg-slate-900 p-3 rounded-xl border border-slate-700 text-center font-bold text-red-400" />
                        <input placeholder="Reason (e.g. Bad behavior)" value={deductReason} onChange={e => setDeductReason(e.target.value)} className="flex-1 bg-slate-900 p-3 rounded-xl border border-slate-700" />
                    </div>
                    <button onClick={handleDeductStars} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black text-sm uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all">Deduct Stars</button>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-3xl border border-blue-500/20">
                    <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Database size={16} /> Data Backup</h3>
                    <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">Download a backup file to move your data to another phone or computer.</p>
                    <div className="flex gap-3">
                        <button onClick={handleExport} className="flex-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                            <Download size={14} /> Export Backup
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-600 transition-all">
                            <Upload size={14} /> Restore Data
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                    </div>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-3xl border border-white/5">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><ShieldAlert size={16} /> Security</h3>
                    <input placeholder="New 4-digit Parent PIN" maxLength={4} className="w-full bg-slate-900 p-3 rounded-xl mb-4 border border-slate-700 text-center text-xl tracking-widest font-mono" onChange={e => setNewPin(e.target.value)} />
                    <button onClick={() => { StorageService.setParentPin(newPin); alert('PIN Updated'); }} className="w-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 py-3 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all">Save New PIN</button>
                </div>
            </div>
        )}
      </div>
    </Layout>
  );
};
