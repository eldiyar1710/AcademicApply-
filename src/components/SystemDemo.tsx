import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  Crown, 
  Star, 
  Check, 
  TrendingUp, 
  Gift, 
  CreditCard,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { referralSystem } from '@/lib/referral-system';
import { subscriptionSystem } from '@/lib/subscription-system';
import { getUser } from '@/lib/auth';

export const SystemDemo: React.FC = () => {
  const [stats, setStats] = useState({
    referral: referralSystem.getSystemStats(),
    subscription: subscriptionSystem.getSystemStats(),
  });
  
  const [testUser, setTestUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const user = getUser();
    setTestUser(user);
    
    const interval = setInterval(() => {
      setStats({
        referral: referralSystem.getSystemStats(),
        subscription: subscriptionSystem.getSystemStats(),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateTestUser = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
    const testUserData = {
      id: `test_${randomId}`,
      name: `Test User ${randomId}`,
      email: `test${randomId}@example.com`,
    };

    const user = referralSystem.registerUser(testUserData);
    setMessage(`Тестовый пользователь создан! Код: ${user.referralCode}`);
    setReferralCode(user.referralCode);
  };

  const handleCreateReferral = () => {
    if (!referralCode) {
      setMessage('Сначала создайте пользователя');
      return;
    }

    const randomId = Math.random().toString(36).substr(2, 9);
    const referralUserData = {
      id: `ref_${randomId}`,
      name: `Referral User ${randomId}`,
      email: `ref${randomId}@example.com`,
    };

    referralSystem.registerUser(referralUserData, referralCode);
    setMessage('Реферал создан! Бонус начислен.');
  };

  const handleCreateSubscription = (planId: string) => {
    if (!testUser) {
      setMessage('Нужен тестовый пользователь');
      return;
    }

    try {
      const subscription = subscriptionSystem.createSubscription(testUser.id, planId, {
        source: 'purchase',
      });
      
      setTimeout(() => {
        subscriptionSystem.activateSubscription(subscription.id);
        setMessage(`Подписка ${planId} создана и активирована!`);
      }, 1000);
    } catch (error) {
      setMessage('Ошибка создания подписки');
    }
  };

  const plans = subscriptionSystem.getPlans();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Автономная система управления</h1>
        <p className="text-gray-600">Реферальная программа + Система подписок</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="referral">Рефералы</TabsTrigger>
          <TabsTrigger value="subscription">Подписки</TabsTrigger>
          <TabsTrigger value="test">Тестирование</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Статистика системы */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Пользователей</p>
                    <p className="text-2xl font-bold">{stats.referral.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Рефералов</p>
                    <p className="text-2xl font-bold">{stats.referral.totalReferrals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Доход рефералов</p>
                    <p className="text-2xl font-bold">${stats.referral.totalRewards}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Активных подписок</p>
                    <p className="text-2xl font-bold">{stats.subscription.activeSubscriptions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Распределение планов */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение подписок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(stats.subscription.planDistribution).map(([planId, count]) => {
                  const plan = subscriptionSystem.getPlan(planId);
                  return (
                    <div key={planId} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-gray-500">{plan?.name || planId}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>Реферальная система</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Бонус за регистрацию</h4>
                  <p className="text-2xl font-bold">$10</p>
                  <p className="text-sm text-gray-600">За каждого нового пользователя</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Бонус за покупку</h4>
                  <p className="text-2xl font-bold">10%</p>
                  <p className="text-sm text-gray-600">От первой покупки реферала</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Минимальный вывод</h4>
                  <p className="text-2xl font-bold">$50</p>
                  <p className="text-sm text-gray-600">Минимальная сумма для вывода</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Особенности системы:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>✅ Полностью автономная работа</li>
                  <li>✅ Сохранение в localStorage</li>
                  <li>✅ Генерация уникальных реферальных кодов</li>
                  <li>✅ Отслеживание статистики</li>
                  <li>✅ Система выплат</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>Система подписок</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                  <Card key={plan.id} className="relative">
                    {plan.id === 'expert' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-500">Популярный</Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="text-2xl font-bold">
                        ${plan.price}
                        <span className="text-sm text-gray-500">/{plan.duration === 365 ? 'год' : 'мес'}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {plan.limits.maxApplications === -1 ? 'Безлимитные заявки' : `${plan.limits.maxApplications} заявок`}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Тестирование системы</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Реферальная система</h4>
                  <Button onClick={handleCreateTestUser} className="w-full">
                    Создать тестового пользователя
                  </Button>
                  <Button onClick={handleCreateReferral} variant="outline" className="w-full">
                    Создать реферала
                  </Button>
                  {referralCode && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium">Реферальный код:</p>
                      <p className="font-mono">{referralCode}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Система подписок</h4>
                  {plans.map((plan) => (
                    <Button 
                      key={plan.id}
                      onClick={() => handleCreateSubscription(plan.id)}
                      variant="outline"
                      className="w-full"
                      disabled={!testUser}
                    >
                      Подписка {plan.name} (${plan.price})
                    </Button>
                  ))}
                </div>
              </div>
              
              {message && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm">{message}</p>
                </div>
              )}
              
              {testUser && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Текущий пользователь:</h4>
                  <p className="text-sm">ID: {testUser.id}</p>
                  <p className="text-sm">Имя: {testUser.name}</p>
                  <p className="text-sm">Email: {testUser.contact}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
