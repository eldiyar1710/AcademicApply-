import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, DollarSign, Gift, TrendingUp, Calendar } from 'lucide-react';
import { useReferralSystem } from '@/hooks/use-referral';
import { getUser } from '@/lib/auth';

export const ReferralDashboard: React.FC = () => {
  const { 
    currentUser, 
    referrals, 
    rewards, 
    stats, 
    loadUserData, 
    getReferralLink, 
    requestWithdrawal, 
    getAvailableBalance 
  } = useReferralSystem();
  
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = getUser();
    if (user) {
      loadUserData(user.id);
    }
  }, [loadUserData]);

  const handleCopyReferralLink = async () => {
    const link = getReferralLink();
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount && amount >= 50) { // Минимальная сумма
      const result = requestWithdrawal(amount);
      setMessage(result.message);
      if (result.success) {
        setWithdrawalAmount('');
      }
    } else {
      setMessage('Минимальная сумма для вывода: $50');
    }
  };

  const availableBalance = getAvailableBalance();
  const referralLink = getReferralLink();

  if (!currentUser) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Пожалуйста, войдите в систему для доступа к реферальной программе</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Рефералов</p>
                <p className="text-2xl font-bold">{currentUser.referralStats.totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Заработано</p>
                <p className="text-2xl font-bold">${currentUser.referralStats.totalEarned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Доступно</p>
                <p className="text-2xl font-bold">${availableBalance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">В ожидании</p>
                <p className="text-2xl font-bold">${currentUser.referralStats.pendingRewards}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Реферальная ссылка */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Ваша реферальная ссылка</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="flex-1"
            />
            <Button 
              onClick={handleCopyReferralLink}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
            </Button>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Как это работает:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Поделитесь ссылкой с друзьями</li>
              <li>• Получите $10 за каждую регистрацию</li>
              <li>• Получите 10% от первой покупки</li>
              <li>• Минимальная сумма для вывода: $50</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Ваши рефералы */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Ваши рефералы ({referrals.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-gray-500 py-8">У вас пока нет рефералов</p>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-sm text-gray-500">{referral.email}</p>
                    <p className="text-xs text-gray-400">
                      Зарегистрирован: {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* История наград */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>История наград ({rewards.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <p className="text-center text-gray-500 py-8">У вас пока нет наград</p>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{reward.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(reward.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${reward.amount}</p>
                    <Badge 
                      variant={reward.status === 'approved' ? 'default' : 
                               reward.status === 'pending' ? 'secondary' : 'outline'}
                    >
                      {reward.status === 'approved' ? 'Подтверждено' :
                       reward.status === 'pending' ? 'В ожидании' : 'Оплачено'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Вывод средств */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Вывод средств</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Доступный баланс: ${availableBalance}
            </p>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Сумма для вывода"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                min="50"
                max={availableBalance}
              />
              <Button 
                onClick={handleWithdrawal}
                disabled={!withdrawalAmount || parseFloat(withdrawalAmount) < 50 || parseFloat(withdrawalAmount) > availableBalance}
              >
                Запросить вывод
              </Button>
            </div>
            {message && (
              <p className={`mt-2 text-sm ${message.includes('успешно') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
