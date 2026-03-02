// Автономная реферальная система
export interface ReferralUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referredBy?: string;
  referrals: string[]; // IDs of referred users
  referralStats: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarned: number;
    pendingRewards: number;
    lastRewardDate?: string;
  };
  createdAt: string;
  lastActiveAt: string;
}

export interface ReferralReward {
  id: string;
  userId: string;
  referralId: string;
  type: 'signup' | 'purchase' | 'upgrade';
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
  processedAt?: string;
  description: string;
}

export interface ReferralConfig {
  rewards: {
    signup: number; // Бонус за регистрацию
    purchase: number; // % от первой покупки
    upgrade: number; // Бонус за апгрейд плана
  };
  thresholds: {
    minWithdrawal: number; // Минимальная сумма для вывода
    maxRewardsPerMonth: number; // Максимум наград в месяц
  };
  restrictions: {
    allowedCountries: string[];
    forbiddenCountries: string[];
    maxReferralAge: number; // дней
  };
}

class ReferralSystem {
  private storageKey = 'referral_system';
  private users: Map<string, ReferralUser> = new Map();
  private rewards: Map<string, ReferralReward> = new Map();
  private config: ReferralConfig = {
    rewards: {
      signup: 10, // $10 за регистрацию
      purchase: 0.1, // 10% от первой покупки
      upgrade: 5, // $5 за апгрейд
    },
    thresholds: {
      minWithdrawal: 50, // $50 минимальный вывод
      maxRewardsPerMonth: 500, // $500 максимум в месяц
    },
    restrictions: {
      allowedCountries: [], // Все страны разрешены
      forbiddenCountries: ['XX'], // Исключенные страны
      maxReferralAge: 365, // 1 год
    }
  };

  constructor() {
    this.loadFromStorage();
  }

  // Загрузка данных из localStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.users = new Map(parsed.users || []);
        this.rewards = new Map(parsed.rewards || []);
        if (parsed.config) {
          this.config = { ...this.config, ...parsed.config };
        }
      }
    } catch (error) {
      console.error('Failed to load referral system:', error);
    }
  }

  // Сохранение данных в localStorage
  private saveToStorage(): void {
    try {
      const data = {
        users: Array.from(this.users.entries()),
        rewards: Array.from(this.rewards.entries()),
        config: this.config,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save referral system:', error);
    }
  }

  // Генерация реферального кода
  generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Регистрация нового пользователя
  registerUser(userData: Omit<ReferralUser, 'referralCode' | 'referrals' | 'referralStats' | 'createdAt' | 'lastActiveAt'>, referredBy?: string): ReferralUser {
    const referralCode = this.generateReferralCode();
    
    // Проверяем уникальность кода
    let uniqueCode = referralCode;
    let attempts = 0;
    while (Array.from(this.users.values()).some(u => u.referralCode === uniqueCode) && attempts < 10) {
      uniqueCode = this.generateReferralCode();
      attempts++;
    }

    const user: ReferralUser = {
      ...userData,
      referralCode: uniqueCode,
      referrals: [],
      referralStats: {
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarned: 0,
        pendingRewards: 0,
      },
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    // Если есть реферал, добавляем связь
    if (referredBy) {
      const referrer = this.users.get(referredBy);
      if (referrer) {
        user.referredBy = referredBy;
        referrer.referrals.push(user.id);
        referrer.referralStats.totalReferrals++;
        this.users.set(referredBy, referrer);
      }
    }

    this.users.set(user.id, user);
    this.saveToStorage();

    // Начисляем бонус за регистрацию
    if (referredBy) {
      this.addReward(referredBy, user.id, 'signup', this.config.rewards.signup, 'Бонус за регистрацию реферала');
    }

    return user;
  }

  // Добавление награды
  addReward(userId: string, referralId: string, type: ReferralReward['type'], amount: number, description: string): ReferralReward {
    const reward: ReferralReward = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      referralId,
      type,
      amount,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date().toISOString(),
      description,
    };

    this.rewards.set(reward.id, reward);

    // Обновляем статистику пользователя
    const user = this.users.get(userId);
    if (user) {
      user.referralStats.totalEarned += amount;
      user.referralStats.pendingRewards += amount;
      user.lastActiveAt = new Date().toISOString();
      this.users.set(userId, user);
    }

    this.saveToStorage();
    return reward;
  }

  // Получение пользователя
  getUser(userId: string): ReferralUser | null {
    return this.users.get(userId) || null;
  }

  // Получение пользователя по реферальному коду
  getUserByReferralCode(code: string): ReferralUser | null {
    return Array.from(this.users.values()).find(u => u.referralCode === code) || null;
  }

  // Получение рефералов пользователя
  getUserReferrals(userId: string): ReferralUser[] {
    const user = this.users.get(userId);
    if (!user) return [];
    
    return user.referrals.map(refId => this.users.get(refId)).filter(Boolean) as ReferralUser[];
  }

  // Получение наград пользователя
  getUserRewards(userId: string): ReferralReward[] {
    return Array.from(this.rewards.values()).filter(r => r.userId === userId);
  }

  // Получение доступного для вывода баланса
  getAvailableBalance(userId: string): number {
    const rewards = this.getUserRewards(userId);
    return rewards
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0);
  }

  // Запрос на вывод средств
  requestWithdrawal(userId: string, amount: number): { success: boolean; message: string } {
    const user = this.users.get(userId);
    if (!user) {
      return { success: false, message: 'Пользователь не найден' };
    }

    const availableBalance = this.getAvailableBalance(userId);
    if (amount < this.config.thresholds.minWithdrawal) {
      return { 
        success: false, 
        message: `Минимальная сумма для вывода: $${this.config.thresholds.minWithdrawal}` 
      };
    }

    if (amount > availableBalance) {
      return { success: false, message: 'Недостаточно средств' };
    }

    // Находим и обновляем награды
    let remainingAmount = amount;
    const rewardsToProcess = this.getUserRewards(userId)
      .filter(r => r.status === 'approved')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    for (const reward of rewardsToProcess) {
      if (remainingAmount <= 0) break;
      
      const processAmount = Math.min(reward.amount, remainingAmount);
      reward.amount -= processAmount;
      reward.processedAt = new Date().toISOString();
      
      if (reward.amount === 0) {
        reward.status = 'paid';
      }
      
      remainingAmount -= processAmount;
      this.rewards.set(reward.id, reward);
    }

    user.referralStats.totalEarned -= amount;
    user.lastActiveAt = new Date().toISOString();
    this.users.set(userId, user);

    this.saveToStorage();
    return { success: true, message: 'Запрос на вывод отправлен' };
  }

  // Подтверждение награды
  approveReward(rewardId: string): boolean {
    const reward = this.rewards.get(rewardId);
    if (!reward || reward.status !== 'pending') return false;

    reward.status = 'approved';
    this.rewards.set(rewardId, reward);

    // Обновляем статистику пользователя
    const user = this.users.get(reward.userId);
    if (user) {
      user.referralStats.pendingRewards -= reward.amount;
      user.referralStats.lastRewardDate = new Date().toISOString();
      this.users.set(reward.userId, user);
    }

    this.saveToStorage();
    return true;
  }

  // Получение реферальной ссылки
  getReferralLink(referralCode: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://academicapply.com';
    return `${baseUrl}?ref=${referralCode}`;
  }

  // Получение статистики
  getSystemStats(): {
    totalUsers: number;
    totalReferrals: number;
    totalRewards: number;
    pendingRewards: number;
  } {
    const users = Array.from(this.users.values());
    const rewards = Array.from(this.rewards.values());

    return {
      totalUsers: users.length,
      totalReferrals: users.filter(u => u.referredBy).length,
      totalRewards: rewards.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0),
      pendingRewards: rewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
    };
  }

  // Экспорт данных
  exportData(): { users: ReferralUser[]; rewards: ReferralReward[]; config: ReferralConfig } {
    return {
      users: Array.from(this.users.values()),
      rewards: Array.from(this.rewards.values()),
      config: this.config,
    };
  }

  // Импорт данных
  importData(data: { users: ReferralUser[]; rewards: ReferralReward[]; config?: Partial<ReferralConfig> }): void {
    this.users = new Map(data.users.map(u => [u.id, u]));
    this.rewards = new Map(data.rewards.map(r => [r.id, r]));
    
    if (data.config) {
      this.config = { ...this.config, ...data.config };
    }
    
    this.saveToStorage();
  }
}

// Экспорт экземпляра системы
export const referralSystem = new ReferralSystem();
