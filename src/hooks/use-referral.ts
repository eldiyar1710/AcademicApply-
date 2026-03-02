import { useState, useEffect } from 'react';
import { referralSystem, ReferralUser, ReferralReward } from '@/lib/referral-system';

export const useReferralSystem = () => {
  const [currentUser, setCurrentUser] = useState<ReferralUser | null>(null);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [stats, setStats] = useState(referralSystem.getSystemStats());

  // Загрузка данных пользователя
  const loadUserData = (userId: string) => {
    const user = referralSystem.getUser(userId);
    if (user) {
      setCurrentUser(user);
      setReferrals(referralSystem.getUserReferrals(userId));
      setRewards(referralSystem.getUserRewards(userId));
    }
  };

  // Обновление статистики
  const refreshStats = () => {
    setStats(referralSystem.getSystemStats());
    if (currentUser) {
      loadUserData(currentUser.id);
    }
  };

  // Регистрация пользователя с рефералом
  const registerWithReferral = (userData: Omit<ReferralUser, 'referralCode' | 'referrals' | 'referralStats' | 'createdAt' | 'lastActiveAt'>, referralCode?: string) => {
    const referrer = referralCode ? referralSystem.getUserByReferralCode(referralCode) : undefined;
    const user = referralSystem.registerUser(userData, referrer?.id);
    setCurrentUser(user);
    refreshStats();
    return user;
  };

  // Получение реферальной ссылки
  const getReferralLink = () => {
    if (!currentUser) return '';
    return referralSystem.getReferralLink(currentUser.referralCode);
  };

  // Запрос на вывод средств
  const requestWithdrawal = (amount: number) => {
    if (!currentUser) return { success: false, message: 'Пользователь не найден' };
    
    const result = referralSystem.requestWithdrawal(currentUser.id, amount);
    if (result.success) {
      refreshStats();
    }
    return result;
  };

  // Получение доступного баланса
  const getAvailableBalance = () => {
    if (!currentUser) return 0;
    return referralSystem.getAvailableBalance(currentUser.id);
  };

  return {
    currentUser,
    referrals,
    rewards,
    stats,
    loadUserData,
    refreshStats,
    registerWithReferral,
    getReferralLink,
    requestWithdrawal,
    getAvailableBalance,
    system: referralSystem,
  };
};
