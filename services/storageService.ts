
import { Task, Prize, RedemptionRequest, UserProfile, StarTransaction } from '../types';

const KEYS = {
  TASKS: 'bp_tasks',
  PRIZES: 'bp_prizes',
  STARS: 'bp_stars',
  REQUESTS: 'bp_requests',
  PROFILE: 'bp_profile',
  PIN: 'bp_parent_pin',
  APP_PASSWORD: 'bp_app_access_password',
  HISTORY: 'bp_star_history',
};

const DEFAULT_TASKS: Task[] = [
  { id: '1', name: 'Brush Teeth', icon: '🪥', durationMinutes: 2, rewardStars: 2 },
  { id: '2', name: 'Read Book', icon: '📖', durationMinutes: 15, rewardStars: 5 },
  { id: '3', name: 'Clean Room', icon: '🧹', durationMinutes: 10, rewardStars: 4 },
];

const DEFAULT_PRIZES: Prize[] = [
  { id: '1', name: 'Ice Cream', cost: 10, icon: '🍦' },
  { id: '2', name: 'New Toy Car', cost: 50, icon: '🏎️' },
  { id: '3', name: 'Watch TV (1hr)', cost: 15, icon: '📺' },
];

export const StorageService = {
  // --- 数据迁移工具 ---
  exportAllData: () => {
    const data: Record<string, string | null> = {};
    Object.values(KEYS).forEach(key => {
      data[key] = localStorage.getItem(key);
    });
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brave_planet_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  },

  importAllData: async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      Object.entries(data).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  },

  // --- 访问密码逻辑 ---
  getAppPassword: (): string | null => localStorage.getItem(KEYS.APP_PASSWORD),
  setAppPassword: (password: string) => localStorage.setItem(KEYS.APP_PASSWORD, password),

  // --- 星星逻辑 ---
  getStars: (): number => parseInt(localStorage.getItem(KEYS.STARS) || '0', 10),
  setStars: (count: number) => localStorage.setItem(KEYS.STARS, count.toString()),
  getStarHistory: (): StarTransaction[] => {
    const stored = localStorage.getItem(KEYS.HISTORY);
    return stored ? JSON.parse(stored) : [];
  },

  addStarTransaction: (amount: number, reason: string) => {
    const history = StorageService.getStarHistory();
    const newTransaction: StarTransaction = {
      id: Date.now().toString() + Math.random().toString().slice(2, 6),
      amount,
      reason,
      timestamp: Date.now(),
      type: amount > 0 ? 'earned' : 'spent'
    };
    history.push(newTransaction);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    const current = StorageService.getStars();
    StorageService.setStars(current + amount);
  },

  // --- 配置逻辑 ---
  getTasks: (): Task[] => {
    const stored = localStorage.getItem(KEYS.TASKS);
    if (!stored) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    return JSON.parse(stored);
  },
  saveTasks: (tasks: Task[]) => localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks)),

  getPrizes: (): Prize[] => {
    const stored = localStorage.getItem(KEYS.PRIZES);
    if (!stored) {
      localStorage.setItem(KEYS.PRIZES, JSON.stringify(DEFAULT_PRIZES));
      return DEFAULT_PRIZES;
    }
    return JSON.parse(stored);
  },
  savePrizes: (prizes: Prize[]) => localStorage.setItem(KEYS.PRIZES, JSON.stringify(prizes)),

  getRequests: (): RedemptionRequest[] => {
    const stored = localStorage.getItem(KEYS.REQUESTS);
    return stored ? JSON.parse(stored) : [];
  },
  saveRequests: (requests: RedemptionRequest[]) => localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests)),

  processRequest: (requestId: string, approved: boolean) => {
    const requests = StorageService.getRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return;
    const req = requests[reqIndex];
    if (req.status !== 'pending') return;
    req.status = approved ? 'approved' : 'rejected';
    requests[reqIndex] = req;
    StorageService.saveRequests(requests);
    if (!approved) StorageService.addStarTransaction(req.prizeCost, `Refund: ${req.prizeName}`);
  },

  getProfile: (): UserProfile => {
    const stored = localStorage.getItem(KEYS.PROFILE);
    return stored ? JSON.parse(stored) : { name: 'Captain', gender: 'boy', avatar: '🧑‍🚀' };
  },
  saveProfile: (profile: UserProfile) => localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile)),
  getParentPin: (): string => localStorage.getItem(KEYS.PIN) || '8888',
  setParentPin: (pin: string) => localStorage.setItem(KEYS.PIN, pin)
};
