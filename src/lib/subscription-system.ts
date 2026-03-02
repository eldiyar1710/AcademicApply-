// Автономная система управления подписками
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // в днях
  features: string[];
  limits: {
    maxApplications: number;
    maxConsultations: number;
    maxDocuments: number;
    aiAssistance: boolean;
    prioritySupport: boolean;
    universityAccess: 'basic' | 'premium' | 'all';
  };
  isActive: boolean;
  sortOrder: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentAt?: string;
  nextPaymentAt?: string;
  usage: {
    applicationsUsed: number;
    consultationsUsed: number;
    documentsUsed: number;
    lastReset: string;
  };
  metadata: {
    source: 'purchase' | 'referral' | 'promotion' | 'trial';
    referralCode?: string;
    originalPrice?: number;
    discountApplied?: number;
  };
}

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'paypal' | 'crypto' | 'referral';
  paymentDate?: string;
  failureReason?: string;
  refundDate?: string;
  metadata: {
    referralDiscount?: number;
    promotionCode?: string;
  };
}

class SubscriptionSystem {
  private storageKey = 'subscription_system';
  private plans: Map<string, SubscriptionPlan> = new Map();
  private subscriptions: Map<string, UserSubscription> = new Map();
  private payments: Map<string, SubscriptionPayment> = new Map();

  constructor() {
    this.initializeDefaultPlans();
    this.loadFromStorage();
  }

  // Инициализация планов по умолчанию
  private initializeDefaultPlans(): void {
    const defaultPlans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Бесплатный',
        description: 'Базовый функционал для начала',
        price: 0,
        currency: 'USD',
        duration: 365, // 1 год
        features: [
          '3 заявки в университет',
          'Базовый поиск университетов',
          'Стандартная поддержка',
        ],
        limits: {
          maxApplications: 3,
          maxConsultations: 0,
          maxDocuments: 5,
          aiAssistance: false,
          prioritySupport: false,
          universityAccess: 'basic',
        },
        isActive: true,
        sortOrder: 1,
      },
      {
        id: 'basic',
        name: 'Базовый',
        description: 'Расширенные возможности для абитуриентов',
        price: 29,
        currency: 'USD',
        duration: 30, // 1 месяц
        features: [
          'Неограниченные заявки',
          'AI-помощник в заполнении',
          'Приоритетная поддержка',
          'Доступ к статистике',
          'Проверка документов',
        ],
        limits: {
          maxApplications: -1, // безлимит
          maxConsultations: 2,
          maxDocuments: 20,
          aiAssistance: true,
          prioritySupport: true,
          universityAccess: 'premium',
        },
        isActive: true,
        sortOrder: 2,
      },
      {
        id: 'expert',
        name: 'Эксперт',
        description: 'Полный пакет с персональной поддержкой',
        price: 99,
        currency: 'USD',
        duration: 30, // 1 месяц
        features: [
          'Все функции Базового плана',
          'Персональный консультант',
          'Неограниченные консультации',
          'VIP поддержка',
          'Экспресс проверка',
          'Гарантия рассмотрения',
        ],
        limits: {
          maxApplications: -1,
          maxConsultations: -1,
          maxDocuments: -1,
          aiAssistance: true,
          prioritySupport: true,
          universityAccess: 'all',
        },
        isActive: true,
        sortOrder: 3,
      },
      {
        id: 'student',
        name: 'Студенческий',
        description: 'Специальная цена для студентов',
        price: 15,
        currency: 'USD',
        duration: 30,
        features: [
          '10 заявок в университет',
          'Базовый AI-помощник',
          'Стандартная поддержка',
          'Доступ к базе знаний',
        ],
        limits: {
          maxApplications: 10,
          maxConsultations: 1,
          maxDocuments: 15,
          aiAssistance: true,
          prioritySupport: false,
          universityAccess: 'premium',
        },
        isActive: true,
        sortOrder: 4,
      },
    ];

    defaultPlans.forEach(plan => {
      this.plans.set(plan.id, plan);
    });
  }

  // Загрузка данных из localStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.plans = new Map(parsed.plans || []);
        this.subscriptions = new Map(parsed.subscriptions || []);
        this.payments = new Map(parsed.payments || []);
      }
    } catch (error) {
      console.error('Failed to load subscription system:', error);
    }
  }

  // Сохранение данных в localStorage
  private saveToStorage(): void {
    try {
      const data = {
        plans: Array.from(this.plans.entries()),
        subscriptions: Array.from(this.subscriptions.entries()),
        payments: Array.from(this.payments.entries()),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save subscription system:', error);
    }
  }

  // Получение всех планов
  getPlans(): SubscriptionPlan[] {
    return Array.from(this.plans.values())
      .filter(plan => plan.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Получение плана по ID
  getPlan(planId: string): SubscriptionPlan | null {
    return this.plans.get(planId) || null;
  }

  // Создание подписки
  createSubscription(userId: string, planId: string, options: {
    autoRenew?: boolean;
    paymentMethod?: string;
    source?: UserSubscription['metadata']['source'];
    referralCode?: string;
    discountAmount?: number;
  } = {}): UserSubscription {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const endDate = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    const subscription: UserSubscription = {
      id: subscriptionId,
      userId,
      planId,
      status: 'pending',
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      autoRenew: options.autoRenew || false,
      paymentMethod: options.paymentMethod,
      usage: {
        applicationsUsed: 0,
        consultationsUsed: 0,
        documentsUsed: 0,
        lastReset: now.toISOString(),
      },
      metadata: {
        source: options.source || 'purchase',
        referralCode: options.referralCode,
        originalPrice: plan.price,
        discountApplied: options.discountAmount,
      },
    };

    this.subscriptions.set(subscriptionId, subscription);
    this.saveToStorage();

    // Создаем платеж
    this.createPayment(subscriptionId, userId, plan.price, options);

    return subscription;
  }

  // Создание платежа
  private createPayment(subscriptionId: string, userId: string, amount: number, options: any): SubscriptionPayment {
    const payment: SubscriptionPayment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subscriptionId,
      userId,
      amount,
      currency: 'USD',
      status: 'pending',
      method: options.paymentMethod || 'card',
      metadata: {
        referralDiscount: options.discountAmount,
        promotionCode: options.promotionCode,
      },
    };

    this.payments.set(payment.id, payment);
    this.saveToStorage();

    return payment;
  }

  // Активация подписки
  activateSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || subscription.status !== 'pending') {
      return false;
    }

    subscription.status = 'active';
    subscription.startDate = new Date().toISOString();
    
    const plan = this.plans.get(subscription.planId);
    if (plan) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);
      subscription.endDate = endDate.toISOString();
      
      // Устанавливаем следующую дату платежа
      if (subscription.autoRenew) {
        const nextPayment = new Date(endDate);
        nextPayment.setDate(nextPayment.getDate() - 3); // за 3 дня до окончания
        subscription.nextPaymentAt = nextPayment.toISOString();
      }
    }

    this.subscriptions.set(subscriptionId, subscription);
    this.saveToStorage();

    // Обновляем статус платежа
    const payment = Array.from(this.payments.values())
      .find(p => p.subscriptionId === subscriptionId && p.status === 'pending');
    if (payment) {
      payment.status = 'completed';
      payment.paymentDate = new Date().toISOString();
      this.payments.set(payment.id, payment);
    }

    this.saveToStorage();
    return true;
  }

  // Получение активной подписки пользователя
  getUserSubscription(userId: string): UserSubscription | null {
    const subscriptions = Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId && sub.status === 'active');
    
    // Возвращаем самую свежую подписку
    return subscriptions.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0] || null;
  }

  // Проверка лимитов пользователя
  checkUserLimits(userId: string, action: 'application' | 'consultation' | 'document'): {
    allowed: boolean;
    remaining: number;
    message: string;
  } {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) {
      // Если нет подписки, проверяем бесплатный план
      const freePlan = this.plans.get('free');
      if (!freePlan) {
        return { allowed: false, remaining: 0, message: 'Система недоступна' };
      }

      const usage = this.getUsage(userId);
      let used = 0;
      let limit = 0;

      switch (action) {
        case 'application':
          used = usage.applicationsUsed;
          limit = freePlan.limits.maxApplications;
          break;
        case 'consultation':
          used = usage.consultationsUsed;
          limit = freePlan.limits.maxConsultations;
          break;
        case 'document':
          used = usage.documentsUsed;
          limit = freePlan.limits.maxDocuments;
          break;
      }

      if (limit === -1) {
        return { allowed: true, remaining: -1, message: 'Безлимит' };
      }

      return {
        allowed: used < limit,
        remaining: Math.max(0, limit - used),
        message: used >= limit ? 'Лимит превышен' : `Осталось: ${limit - used}`,
      };
    }

    const plan = this.plans.get(subscription.planId);
    if (!plan) {
      return { allowed: false, remaining: 0, message: 'План не найден' };
    }

    let used = 0;
    let limit = 0;

    switch (action) {
      case 'application':
        used = subscription.usage.applicationsUsed;
        limit = plan.limits.maxApplications;
        break;
      case 'consultation':
        used = subscription.usage.consultationsUsed;
        limit = plan.limits.maxConsultations;
        break;
      case 'document':
        used = subscription.usage.documentsUsed;
        limit = plan.limits.maxDocuments;
        break;
    }

    if (limit === -1) {
      return { allowed: true, remaining: -1, message: 'Безлимит' };
    }

    return {
      allowed: used < limit,
      remaining: Math.max(0, limit - used),
      message: used >= limit ? 'Лимит превышен' : `Осталось: ${limit - used}`,
    };
  }

  // Использование лимита
  useLimit(userId: string, action: 'application' | 'consultation' | 'document'): boolean {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) {
      return false; // Бесплатные пользователи не могут использовать платные функции
    }

    const check = this.checkUserLimits(userId, action);
    if (!check.allowed) {
      return false;
    }

    switch (action) {
      case 'application':
        subscription.usage.applicationsUsed++;
        break;
      case 'consultation':
        subscription.usage.consultationsUsed++;
        break;
      case 'document':
        subscription.usage.documentsUsed++;
        break;
    }

    this.subscriptions.set(subscription.id, subscription);
    this.saveToStorage();
    return true;
  }

  // Получение статистики использования
  private getUsage(userId: string): { applicationsUsed: number; consultationsUsed: number; documentsUsed: number } {
    const subscription = this.getUserSubscription(userId);
    if (subscription) {
      return {
        applicationsUsed: subscription.usage.applicationsUsed,
        consultationsUsed: subscription.usage.consultationsUsed,
        documentsUsed: subscription.usage.documentsUsed,
      };
    }

    // Для бесплатных пользователей считаем из localStorage
    const freeUsageKey = `free_usage_${userId}`;
    try {
      const usage = localStorage.getItem(freeUsageKey);
      if (usage) {
        return JSON.parse(usage);
      }
    } catch (error) {
      console.error('Failed to load free usage:', error);
    }

    return {
      applicationsUsed: 0,
      consultationsUsed: 0,
      documentsUsed: 0,
    };
  }

  // Продление подписки
  renewSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    const plan = this.plans.get(subscription.planId);
    if (!plan) {
      return false;
    }

    // Создаем новый платеж
    this.createPayment(subscriptionId, subscription.userId, plan.price, {
      paymentMethod: subscription.paymentMethod,
    });

    // Продлеваем дату окончания
    const currentEndDate = new Date(subscription.endDate);
    currentEndDate.setDate(currentEndDate.getDate() + plan.duration);
    subscription.endDate = currentEndDate.toISOString();

    // Сбрасываем использование (опционально)
    if (plan.duration <= 30) { // Для месячных планов
      subscription.usage.applicationsUsed = 0;
      subscription.usage.consultationsUsed = 0;
      subscription.usage.documentsUsed = 0;
      subscription.usage.lastReset = new Date().toISOString();
    }

    this.subscriptions.set(subscriptionId, subscription);
    this.saveToStorage();
    return true;
  }

  // Отмена подписки
  cancelSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    this.subscriptions.set(subscriptionId, subscription);
    this.saveToStorage();
    return true;
  }

  // Получение платежей пользователя
  getUserPayments(userId: string): SubscriptionPayment[] {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => new Date(b.paymentDate || '').getTime() - new Date(a.paymentDate || '').getTime());
  }

  // Получение статистики системы
  getSystemStats(): {
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalRevenue: number;
    monthlyRevenue: number;
    planDistribution: Record<string, number>;
  } {
    const subscriptions = Array.from(this.subscriptions.values());
    const payments = Array.from(this.payments.values());
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    const completedPayments = payments.filter(p => p.status === 'completed');
    const monthlyPayments = completedPayments.filter(p => 
      p.paymentDate && new Date(p.paymentDate) > monthAgo
    );

    const planDistribution: Record<string, number> = {};
    activeSubscriptions.forEach(sub => {
      planDistribution[sub.planId] = (planDistribution[sub.planId] || 0) + 1;
    });

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      totalRevenue: completedPayments.reduce((sum, p) => sum + p.amount, 0),
      monthlyRevenue: monthlyPayments.reduce((sum, p) => sum + p.amount, 0),
      planDistribution,
    };
  }

  // Экспорт данных
  exportData(): {
    plans: SubscriptionPlan[];
    subscriptions: UserSubscription[];
    payments: SubscriptionPayment[];
  } {
    return {
      plans: Array.from(this.plans.values()),
      subscriptions: Array.from(this.subscriptions.values()),
      payments: Array.from(this.payments.values()),
    };
  }

  // Импорт данных
  importData(data: {
    plans?: SubscriptionPlan[];
    subscriptions?: UserSubscription[];
    payments?: SubscriptionPayment[];
  }): void {
    if (data.plans) {
      this.plans = new Map(data.plans.map(p => [p.id, p]));
    }
    if (data.subscriptions) {
      this.subscriptions = new Map(data.subscriptions.map(s => [s.id, s]));
    }
    if (data.payments) {
      this.payments = new Map(data.payments.map(p => [p.id, p]));
    }
    this.saveToStorage();
  }
}

// Экспорт экземпляра системы
export const subscriptionSystem = new SubscriptionSystem();
