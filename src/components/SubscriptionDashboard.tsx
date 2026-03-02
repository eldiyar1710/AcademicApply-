import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Star, 
  Check, 
  X, 
  TrendingUp, 
  Calendar, 
  Users, 
  FileText,
  MessageCircle,
  Zap,
  CreditCard
} from 'lucide-react';
import { useSubscriptionSystem } from '@/hooks/use-subscription';
import { getUser } from '@/lib/auth';

export const SubscriptionDashboard: React.FC = () => {
  const { 
    plans, 
    currentSubscription, 
    stats, 
    loadUserSubscription, 
    createSubscription, 
    activateSubscription,
    checkLimits,
    useLimit,
    renewSubscription,
    cancelSubscription,
    getUserPayments,
    getPlan
  } = useSubscriptionSystem();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const user = getUser();
    if (user) {
      loadUserSubscription(user.id);
      setPayments(getUserPayments(user.id));
    }
  }, [loadUserSubscription, getUserPayments]);

  const handleSubscribe = (planId: string) => {
    const user = getUser();
    if (!user) {
      setMessage('Пожалуйста, войдите в систему');
      return;
    }

    try {
      const subscription = createSubscription(user.id, planId, {
        autoRenew: true,
        source: 'purchase',
      });
      
      // Автоматически активируем для демонстрации
      setTimeout(() => {
        activateSubscription(subscription.id);
        setMessage('Подписка успешно активирована!');
      }, 1000);
      
      setSelectedPlan(planId);
    } catch (error) {
      setMessage('Ошибка при создании подписки');
    }
  };

  const handleRenew = () => {
    if (currentSubscription) {
      const success = renewSubscription(currentSubscription.id);
      setMessage(success ? 'Подписка продлена!' : 'Ошибка при продлении');
    }
  };

  const handleCancel = () => {
    if (currentSubscription) {
      const success = cancelSubscription(currentSubscription.id);
      setMessage(success ? 'Подписка отменена' : 'Ошибка при отмене');
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Users className="w-6 h-6" />;
      case 'basic': return <Star className="w-6 h-6" />;
      case 'expert': return <Crown className="w-6 h-6" />;
      case 'student': return <FileText className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'basic': return 'bg-blue-100 text-blue-700';
      case 'expert': return 'bg-purple-100 text-purple-700';
      case 'student': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const user = getUser();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Текущая подписка */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                {getPlanIcon(currentSubscription.planId)}
                <span>Текущая подписка</span>
              </span>
              <Badge className={getPlanColor(currentSubscription.planId)}>
                {getPlan(currentSubscription.planId)?.name || 'Unknown'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Статус</p>
                <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                  {currentSubscription.status === 'active' ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Действует до</p>
                <p className="font-medium">
                  {new Date(currentSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Автопродление</p>
                <Badge variant={currentSubscription.autoRenew ? 'default' : 'outline'}>
                  {currentSubscription.autoRenew ? 'Включено' : 'Выключено'}
                </Badge>
              </div>
            </div>

            {/* Использование лимитов */}
            <div className="space-y-3">
              <h4 className="font-medium">Использование лимитов:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Заявки</span>
                  <span className="text-sm">
                    {currentSubscription.usage.applicationsUsed} / 
                    {getPlan(currentSubscription.planId)?.limits.maxApplications === -1 ? '∞' : 
                     getPlan(currentSubscription.planId)?.limits.maxApplications}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Консультации</span>
                  <span className="text-sm">
                    {currentSubscription.usage.consultationsUsed} / 
                    {getPlan(currentSubscription.planId)?.limits.maxConsultations === -1 ? '∞' : 
                     getPlan(currentSubscription.planId)?.limits.maxConsultations}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Документы</span>
                  <span className="text-sm">
                    {currentSubscription.usage.documentsUsed} / 
                    {getPlan(currentSubscription.planId)?.limits.maxDocuments === -1 ? '∞' : 
                     getPlan(currentSubscription.planId)?.limits.maxDocuments}
                  </span>
                </div>
              </div>
            </div>

            {/* Действия */}
            <div className="flex space-x-2">
              <Button onClick={handleRenew} variant="outline">
                Продлить
              </Button>
              <Button onClick={handleCancel} variant="destructive">
                Отменить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Доступные планы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${currentSubscription?.planId === plan.id ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.id === 'expert' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500">Популярный</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <p className="text-sm text-gray-500">{plan.description}</p>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm text-gray-500">/{plan.duration === 365 ? 'год' : 'мес'}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              {user && (
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={currentSubscription?.planId === plan.id}
                  variant={currentSubscription?.planId === plan.id ? 'outline' : 'default'}
                >
                  {currentSubscription?.planId === plan.id ? 'Текущий план' : 'Выбрать план'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* История платежей */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>История платежей</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">${payment.amount}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.paymentDate || '').toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={payment.status === 'completed' ? 'default' : 
                             payment.status === 'pending' ? 'secondary' : 'destructive'}
                  >
                    {payment.status === 'completed' ? 'Оплачено' :
                     payment.status === 'pending' ? 'В ожидании' : 'Ошибка'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Сообщение */}
      {message && (
        <Card>
          <CardContent className="p-4">
            <p className={`text-center ${message.includes('успешно') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
