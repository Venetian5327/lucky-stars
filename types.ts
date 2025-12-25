
export interface Task {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  durationMinutes: number;
  rewardStars: number;
}

export interface Prize {
  id: string;
  name: string;
  cost: number;
  imageUrl?: string;
  icon?: string; // Emoji support
}

export interface RedemptionRequest {
  id: string;
  prizeId: string;
  prizeName: string;
  prizeCost: number;
  prizeIcon?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface UserProfile {
  name: string;
  gender: 'boy' | 'girl';
  avatar: string;
}

export interface StarTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: number;
  type: 'earned' | 'spent';
}

export enum AppMode {
  LAUNCH = 'LAUNCH',
  CHILD_HOME = 'CHILD_HOME',
  TASK_TIMER = 'TASK_TIMER',
  CELEBRATION = 'CELEBRATION',
  REWARD_BOOK = 'REWARD_BOOK',
  PARENT_DASHBOARD = 'PARENT_DASHBOARD'
}
