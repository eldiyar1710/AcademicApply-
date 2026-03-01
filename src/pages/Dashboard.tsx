import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgePercent, Crown, LogOut, ArrowRight, Calendar, UserCheck, MessageCircle, Heart, Target, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultantInvitation from "@/components/ConsultantInvitation";
import AIChat from "@/components/AIChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { getDiscountInfo } from "@/lib/attribution";
import { getDaysRemaining, getPlanLabel, isPlanActive, hasAccess, getProfileProgress, getUser, logout, updateUserProfile } from "@/lib/auth";
import { clearLastResultsQuery, getLastResultsQuery } from "@/lib/results";
import { getWishlist, toggleWishlist } from "@/lib/wishlist";
import { useToast } from "@/hooks/use-toast";
import ReferralSystem from "@/components/ReferralSystem";
import QRCodeSystem from "@/components/QRCodeSystem";
import { getUserFromDB } from "@/lib/firebaseAuth";

const formatRemaining = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}ч ${m}м`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [user, setUser] = useState(() => getUser());
  const discount = useMemo(() => getDiscountInfo(), []);
  const progress = getProfileProgress(user);

  // Sync user data from Firebase on mount and when auth changes
  useEffect(() => {
    const syncUser = async () => {
      const currentUser = getUser();
      console.debug("Dashboard: syncUser - текущий пользователь из localStorage", currentUser);
      if (currentUser?.id) {
        try {
          const freshUser = await getUserFromDB(currentUser.id);
          console.debug("Dashboard: syncUser - пользователь из RTDB", freshUser);
          if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
            console.debug("Dashboard: обновляем данные пользователя из RTDB", { name: freshUser.name, timezone: freshUser.timezone });
            setUser(freshUser);
          } else {
            console.debug("Dashboard: данные не изменились, используем localStorage");
            setUser(currentUser);
          }
        } catch (err) {
          console.error("Dashboard: ошибка синхронизации пользователя", err);
          setUser(currentUser);
        }
      } else {
        console.debug("Dashboard: нет пользователя в localStorage");
        setUser(null);
      }
    };
    
    syncUser();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      const updatedUser = getUser();
      console.debug("Dashboard: auth change event", { name: updatedUser?.name, timezone: updatedUser?.timezone });
      setUser(updatedUser);
    };
    
    window.addEventListener("aa_auth_changed", handleAuthChange);
    return () => window.removeEventListener("aa_auth_changed", handleAuthChange);
  }, []);

  // Debug: Log user information
  console.log('Dashboard Debug:', { 
    user: user ? {
      name: user.name,
      plan: user.plan,
      userType: user.profile?.userType
    } : null,
    hasUser: !!user 
  });

  // Get userType from user profile or URL params (for initial load after registration)
  const urlUserType = searchParams.get("type") as "school" | "graduate" | "student" | null;
  const savedUserType = user?.profile.userType;
  const effectiveUserType = savedUserType || urlUserType || "school";

  const [userType, setUserType] = useState<"school" | "graduate" | "student">(effectiveUserType);
  const [gpa, setGpa] = useState(user?.profile.gpa || "");
  const [ielts, setIelts] = useState(user?.profile.ielts || "");
  const [dream, setDream] = useState(user?.profile.dream || "");
  const [wishlist, setWishlist] = useState(getWishlist());

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Нужно войти</h1>
            <p className="text-muted-foreground mb-6">Создайте аккаунт, чтобы открыть результаты и кабинет.</p>
            <Button onClick={() => navigate(`/register?${searchParams.toString()}`)}>Создайте аккаунт</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const saveProfile = () => {
    const prevType = user.profile.userType || "school";
    const nextType = userType;
    updateUserProfile({ userType: nextType, gpa: gpa.trim(), ielts: ielts.trim(), dream: dream.trim() });

    if (prevType !== nextType) {
      clearLastResultsQuery();
      const params = new URLSearchParams(searchParams);
      params.set("type", nextType);
      navigate(`/assessment?${params.toString()}`);
      return;
    }

    navigate(0);
  };

  const goToResults = () => {
    const current = searchParams.toString();
    const saved = getLastResultsQuery();
    const query = current.length > 0 ? current : saved;
    navigate(query ? `/results?${query}` : "/results");
  };

  const goToCheckout = (planId: "ai_roadmap" | "expert_mentorship") => {
    const params = new URLSearchParams(searchParams);
    params.set("plan", planId);
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Личный кабинет</h1>
              <p className="text-muted-foreground mt-1">Привет, {user.name}</p>
              <p className="text-xs text-muted-foreground mt-2">Timezone: {user.timezone || "—"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="w-4 h-4" /> Выйти
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border/50 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading font-semibold text-foreground">Прогресс профиля</h2>
                  <p className="text-xs text-muted-foreground">Введи GPA и IELTS, чтобы получить точнее прогноз</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-heading font-bold text-primary">{progress}%</div>
                  <div className="text-xs text-muted-foreground">готово</div>
                </div>
              </div>

              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="userType">Кто ты сейчас?</Label>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as "school" | "graduate" | "student")}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="school">Школьник</option>
                    <option value="graduate">Выпускник</option>
                    <option value="student">Студент</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Если поменяешь тип — мы попросим пройти тест заново для точных рекомендаций.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input id="gpa" value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="Например 3.8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ielts">IELTS</Label>
                  <Input id="ielts" value={ielts} onChange={(e) => setIelts(e.target.value)} placeholder="Например 6.5" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="dream">Мечта / цель</Label>
                  <Input
                    id="dream"
                    value={dream}
                    onChange={(e) => setDream(e.target.value)}
                    placeholder="Например: поступить на грант в Европу и стать аналитиком"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button onClick={saveProfile}>Сохранить</Button>
                <Button variant="outline" className="gap-2" onClick={goToResults}>
                  Открыть результаты <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
              <h2 className="font-heading font-semibold text-foreground">Мой тариф</h2>
              <p className="text-xs text-muted-foreground mt-1">Текущий план и доступы</p>

              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2">
                  <Crown className={`w-5 h-5 ${isPlanActive(user) ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{getPlanLabel(user?.plan || "free")}</p>
                    {user?.plan !== "free" && (
                      <p className="text-xs text-muted-foreground">
                        {isPlanActive(user) ? `Активен еще ${getDaysRemaining(user)} дней` : `Срок истек`}
                      </p>
                    )}
                  </div>
                </div>
                {user?.assignedExpertId && (
                  <div className="mt-3 pt-3 border-t border-primary/10 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">Привязан эксперт: #{user.assignedExpertId.slice(-6)}</p>
                  </div>
                )}
              </div>

              {user?.plan !== "expert" && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/paywall?upgrade=1")}
                  >
                    Улучшить тариф
                  </Button>
                </div>
              )}

              {user?.plan === "basic" && isPlanActive(user) && (
                <div className="mt-4 space-y-2">
                  <Button
                    className="w-full gap-2"
                    onClick={() => navigate("/plan")}
                  >
                    <Calendar className="w-4 h-4" />
                    Мой план
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => navigate("/tracking?calendar=1")}
                  >
                    <Calendar className="w-4 h-4" />
                    Встречи с экспертом
                  </Button>
                </div>
              )}

              {user?.plan === "expert" && isPlanActive(user) && (
                <div className="mt-4 space-y-2">
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                    onClick={() => navigate("/expert-plan")}
                  >
                    <Crown className="w-4 h-4" />
                    Мой план
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => navigate("/tracking?calendar=1")}
                  >
                    <Calendar className="w-4 h-4" />
                    Встречи с экспертом
                  </Button>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
              <h2 className="font-heading font-semibold text-foreground">Моя цель</h2>
              <p className="text-xs text-muted-foreground mt-1">Целевой университет из избранного</p>

              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                {wishlist.length > 0 ? (
                  <div className="space-y-3">
                    {wishlist.slice(0, 3).map((item) => (
                      <div key={item} className="flex items-center gap-3 p-2 rounded-lg bg-white/50">
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        <span className="text-sm font-medium truncate">{item.replace('uni-', '')}</span>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 mt-2"
                      onClick={() => navigate("/tracking")}
                    >
                      <Target className="w-4 h-4" />
                      Выбрать целевой
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Выберите целевой университет</p>
                        <p className="text-xs text-muted-foreground">Из избранного или результатов</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => navigate("/results")}
                      >
                        <Target className="w-4 h-4" />
                        Выбрать из избранного
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full gap-2 text-sm"
                        onClick={goToResults}
                      >
                        <GraduationCap className="w-4 h-4" />
                        Посмотреть рекомендации
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
              <h2 className="font-heading font-semibold text-foreground">Витрина</h2>
              <p className="text-xs text-muted-foreground mt-1">Тарифы и бонусы</p>

              {discount.eligible ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/10"
                >
                  <div className="flex items-center gap-2">
                    <BadgePercent className="w-4 h-4 text-accent" />
                    <p className="text-sm text-foreground font-medium">Скидка {discount.discountPercent}% участника форума</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Сгорит через {formatRemaining(discount.expiresAt - Date.now())}
                  </p>
                </motion.div>
              ) : (
                <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm text-foreground font-medium">Скидок нет</p>
                  <p className="text-xs text-muted-foreground mt-1">Заполни профиль для персональных предложений</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-xl border border-border/50">
                  <p className="text-sm font-medium text-foreground">$49 — AI Roadmap</p>
                  <p className="text-xs text-muted-foreground mt-1">Пошаговый план + список программ</p>
                  <div className="mt-3">
                    <Button variant="outline" className="w-full" onClick={() => goToCheckout("ai_roadmap")}>
                      Купить
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50">
                  <p className="text-sm font-medium text-foreground">$490 — Expert Mentorship</p>
                  <p className="text-xs text-muted-foreground mt-1">3 встречи + проверка документов</p>
                  <div className="mt-3">
                    <Button className="w-full" onClick={() => goToCheckout("expert_mentorship")}>
                      Купить
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={() => navigate("/tracking")}>Мои заявки</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat for Free tier, ConsultantInvitation for others */}
      {(!user?.plan || user?.plan === "free") ? (
        <AIChat 
          userName={user?.name || ""}
          userType={userType}
          onRequestHumanConsultant={() => {
            // Show consultant invitation
            toast({
              title: "Консультант",
              description: "Записываем вас на бесплатную консультацию...",
            });
          }}
          hasUsedFreeCall={false}
        />
      ) : (
        <ConsultantInvitation 
          userType={userType}
          userName={user?.name || ""}
          dream={dream}
          recommendations={[]}
          universities={[]}
          hasFreeCall={false}
          userPlan={user?.plan}
        />
      )}

      {/* Уведомление о скидке для пользователей, зарегистрированных через QR */}
      {user?.attributionSource === "qrcode" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">30% скидка активирована!</h3>
                <p className="text-green-700">Вы зарегистрировались через QR-код и получаете скидку 30% на все тарифы.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Реферальная система и QR-коды */}
      <div className="max-w-4xl mx-auto mt-8">
        <ReferralSystem />
        <QRCodeSystem />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
