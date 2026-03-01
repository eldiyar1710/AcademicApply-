import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { getDiscountInfo } from "@/lib/attribution";
import { getProfileProgress, getUser, logout, updateUserProfile } from "@/lib/auth";
import { clearLastResultsQuery, getLastResultsQuery } from "@/lib/results";

const formatRemaining = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}ч ${m}м`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = useMemo(() => getUser(), []);
  const discount = useMemo(() => getDiscountInfo(), []);
  const progress = getProfileProgress(user);

  const [userType, setUserType] = useState<"school" | "graduate" | "student">(user?.profile.userType || "school");
  const [gpa, setGpa] = useState(user?.profile.gpa || "");
  const [ielts, setIelts] = useState(user?.profile.ielts || "");
  const [dream, setDream] = useState(user?.profile.dream || "");

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Нужно войти</h1>
            <p className="text-muted-foreground mb-6">Создай аккаунт, чтобы открыть результаты и кабинет.</p>
            <Button onClick={() => navigate(`/register?${searchParams.toString()}`)}>Создать аккаунт</Button>
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
      <Footer />
    </div>
  );
};

export default Dashboard;
