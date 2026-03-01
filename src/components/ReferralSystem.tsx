import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Share2, Copy, Gift, Users, TrendingUp, 
  CheckCircle2, Crown, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getUser, createReferralCode, getReferralLink, calculateReferralDiscount } from "@/lib/auth";

interface ReferralSystemProps {
  className?: string;
}

const ReferralSystem = ({ className }: ReferralSystemProps) => {
  const { toast } = useToast();
  const [user, setUser] = useState(getUser());
  const [referralLink, setReferralLink] = useState("");
  const [isCreatingCode, setIsCreatingCode] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    if (currentUser?.referralCode) {
      setReferralLink(getReferralLink(currentUser.referralCode));
    }
  }, []);

  const handleCreateReferralCode = async () => {
    if (!user) return;
    
    setIsCreatingCode(true);
    try {
      const updated = createReferralCode(user.id);
      if (updated) {
        setUser(updated);
        setReferralLink(getReferralLink(updated.referralCode!));
        toast({
          title: "Реферальный код создан!",
          description: "Теперь вы можете приглашать друзей и получать бонусы.",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать реферальный код. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCode(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Ссылка скопирована!",
        description: "Отправьте ее друзьям и получите бонусы.",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать ссылку.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AcademicApply - Поступление в зарубежные вузы",
          text: "Присоединяйся ко мне на платформе AcademicApply! Помощь с поступлением, документы, консультации. Используй мою ссылку и получи 10% скидку на все тарифы!",
          url: referralLink,
        });
      } else {
        handleCopyLink();
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const plans = [
    {
      name: "Базовый",
      originalPrice: 49,
      discountedPrice: calculateReferralDiscount(49),
      period: "месяц",
      features: ["AI консультант", "База вузов", "Шаблоны документов"]
    },
    {
      name: "Эксперт",
      originalPrice: 490,
      discountedPrice: calculateReferralDiscount(490),
      period: "год",
      features: ["Все из Базового", "Личный консультант", "Проверка документов", "Видеовстречи"]
    }
  ];

  if (!user) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Реферальная программа</h3>
          <p className="text-sm text-muted-foreground">Войдите чтобы получить реферальный код</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Основная информация */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Реферальная программа</h3>
              <p className="text-sm text-muted-foreground">Приглашайте друзей и получайте бонусы</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            10% скидка
          </Badge>
        </div>

        {!user.referralCode ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Создайте реферальный код</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Начните приглашать друзей и получать 10% от их покупок
            </p>
            <Button 
              onClick={handleCreateReferralCode}
              disabled={isCreatingCode}
              className="gap-2"
            >
              <Gift className="w-4 h-4" />
              {isCreatingCode ? "Создание..." : "Создать код"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Реферальный код и ссылка */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Ваш реферальный код</p>
                  <p className="text-2xl font-bold text-purple-600 font-mono">{user.referralCode}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Реферальная ссылка</p>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm font-mono truncate">
                      {referralLink}
                    </div>
                    <Button size="sm" variant="outline" onClick={handleCopyLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">
                  {user.referralStats?.referralsCount || 0}
                </p>
                <p className="text-xs text-muted-foreground">Приглашено</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50">
                <p className="text-2xl font-bold text-green-600">
                  ${user.referralStats?.totalEarned || 0}
                </p>
                <p className="text-xs text-muted-foreground">Заработано</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50">
                <p className="text-2xl font-bold text-amber-600">
                  ${user.referralStats?.pendingRewards || 0}
                </p>
                <p className="text-xs text-muted-foreground">В ожидании</p>
              </div>
            </div>

            {/* Преимущества для друзей */}
            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                Преимущества для ваших друзей
              </h4>
              <div className="grid gap-3">
                {plans.map((plan, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-foreground">{plan.name}</h5>
                        <p className="text-xs text-muted-foreground">{plan.period}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">
                            ${plan.originalPrice}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ${plan.discountedPrice}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          -10%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plan.features.map((feature, featureIdx) => (
                        <span key={featureIdx} className="text-xs text-muted-foreground">
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Как это работает */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Как это работает?
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">1</span>
                  <p>Поделитесь реферальной ссылкой с друзьями</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">2</span>
                  <p>Друг регистрируется по вашей ссылке и получает 10% скидку</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">3</span>
                  <p>Вы получаете 10% от суммы его покупки</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">4</span>
                  <p>Бонусы можно использовать на дополнительные услуги</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReferralSystem;
