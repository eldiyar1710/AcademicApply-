import { useState, useEffect } from 'react';
import { subscriptionSystem, SubscriptionPlan, UserSubscription } from '@/lib/subscription-system';

export const useSubscriptionSystem = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [stats, setStats] = useState(subscriptionSystem.getSystemStats());

  // Загрузка планов
  const loadPlans = () => {
    setPlans(subscriptionSystem.getPlans());
  };

  // Загрузка подписки пользователя
  const loadUserSubscription = (userId: string) => {
    const subscription = subscriptionSystem.getUserSubscription(userId);
    setCurrentSubscription(subscription);
    return subscription;
  };

  // Обновление статистики
  const refreshStats = () => {
    setStats(subscriptionSystem.getSystemStats());
    loadPlans();
  };

  // Создание подписки
  const createSubscription = (userId: string, planId: string, options?: {
    autoRenew?: boolean;
    paymentMethod?: string;
    source?: 'purchase' | 'referral' | 'promotion' | 'trial';
    referralCode?: string;
    discountAmount?: number;
  }) => {
    const subscription = subscriptionSystem.createSubscription(userId, planId, options);
    setCurrentSubscription(subscription);
    refreshStats();
    return subscription;
  };

  // Активация подписки
  const activateSubscription = (subscriptionId: string) => {
    const success = subscriptionSystem.activateSubscription(subscriptionId);
    if (success && currentSubscription?.id === subscriptionId) {
      loadUserSubscription(currentSubscription.userId);
    }
    refreshStats();
    return success;
  };

  // Проверка лимитов
  const checkLimits = (userId: string, action: 'application' | 'consultation' | 'document') => {
    return subscriptionSystem.checkUserLimits(userId, action);
  };

  // Использование лимита
  const useLimit = (userId: string, action: 'application' | 'consultation' | 'document') => {
    const success = subscriptionSystem.useLimit(userId, action);
    if (currentSubscription && currentSubscription.userId === userId) {
      loadUserSubscription(userId);
    }
    return success;
  };

  // Продление подписки
  const renewSubscription = (subscriptionId: string) => {
    const success = subscriptionSystem.renewSubscription(subscriptionId);
    if (success && currentSubscription?.id === subscriptionId) {
      loadUserSubscription(currentSubscription.userId);
    }
    refreshStats();
    return success;
  };

  // Отмена подписки
  const cancelSubscription = (subscriptionId: string) => {
    const success = subscriptionSystem.cancelSubscription(subscriptionId);
    if (success && currentSubscription?.id === subscriptionId) {
      loadUserSubscription(currentSubscription.userId);
    }
    refreshStats();
    return success;
  };

  // Получение платежей пользователя
  const getUserPayments = (userId: string) => {
    return subscriptionSystem.getUserPayments(userId);
  };

  // Получение плана по ID
  const getPlan = (planId: string) => {
    return subscriptionSystem.getPlan(planId);
  };

  // Инициализация
  useEffect(() => {
    loadPlans();
  }, []);

  return {
    plans,
    currentSubscription,
    stats,
    loadPlans,
    loadUserSubscription,
    refreshStats,
    createSubscription,
    activateSubscription,
    checkLimits,
    useLimit,
    renewSubscription,
    cancelSubscription,
    getUserPayments,
    getPlan,
    system: subscriptionSystem,
  };
};
