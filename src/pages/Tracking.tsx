import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ExternalLink, HeartOff, Crown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { universityData } from "@/data/universities";
import { getUser, getPlanLabel, isPlanActive } from "@/lib/auth";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";
import { MeetingCalendar } from "@/components/MeetingCalendar";

const Tracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("calendar") !== "1") return;
    const el = document.getElementById("calendar");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [searchParams]);

  const user = useMemo(() => getUser(), []);
  const userId = user?.id || null;
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => getWishlist(userId));

  const wishlistedUniversities = useMemo(() => {
    const set = new Set(wishlistIds);
    return universityData.filter((u) => set.has(u.id));
  }, [wishlistIds]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Button variant="ghost" className="gap-2" onClick={() => navigate("/dashboard")}>Назад</Button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              Мои заявки
            </h1>
            <p className="text-muted-foreground text-lg">
              Отслеживайте статус поступления в реальном времени
            </p>
          </motion.div>

          <div id="calendar" />

          {(user?.plan === "basic" || user?.plan === "expert") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-10 p-6 rounded-2xl border ${
                user?.plan === "expert"
                  ? "bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border-amber-500/30"
                  : "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={user?.plan === "expert" ? "w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center" : "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"}>
                  <Crown className={user?.plan === "expert" ? "w-6 h-6 text-amber-600" : "w-6 h-6 text-primary"} />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">
                    {user?.plan === "expert" ? "Премиум консультации" : "Встречи с экспертом"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isPlanActive(user) ? `Тариф ${getPlanLabel(user.plan)} активен` : `Тариф ${getPlanLabel(user.plan)} не активен`}
                  </p>
                </div>
              </div>

              {isPlanActive(user) ? (
                <MeetingCalendar
                  plan={user?.plan || "basic"}
                  userName={user?.name || ""}
                  userType={((user?.profile?.userType === "school" || user?.profile?.userType === "graduate" || user?.profile?.userType === "student")
                    ? user.profile.userType
                    : "school")}
                />
              ) : (
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <p className="text-sm font-medium text-foreground">Чтобы записаться на встречу, нужно продлить тариф</p>
                  <p className="text-xs text-muted-foreground mt-1">Открой тарифы и выбери подходящий план</p>
                  <div className="mt-4">
                    <Button className="w-full" onClick={() => navigate("/paywall?upgrade=1")}>Улучшить тариф</Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {(!user || user.plan === "free") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-6 rounded-2xl border bg-muted/30 border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">Встречи с экспертом</h2>
                  <p className="text-sm text-muted-foreground">Доступно в тарифах Basic и Expert</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate("/paywall?upgrade=1")}>Посмотреть тарифы</Button>
            </motion.div>
          )}

          {wishlistedUniversities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-bold text-foreground mb-2">Пока нет избранных вузов</h2>
              <p className="text-muted-foreground text-sm mb-6">Открой результаты и добавь университеты в избранное</p>
              <Button onClick={() => navigate("/results")}>Открыть результаты</Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {wishlistedUniversities.map((uni, i) => (
                <motion.div
                  key={uni.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl bg-card shadow-card border border-border/50"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-foreground">{uni.name}</h3>
                      <p className="text-sm text-muted-foreground">{uni.country} · {uni.city}</p>
                      <p className="text-xs text-muted-foreground mt-2">Программы: {uni.programs.slice(0, 3).map((p) => p.name).join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => navigate(`/university/${uni.id}`)}
                      >
                        <ExternalLink className="w-4 h-4" /> Подробнее
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          const next = removeFromWishlist(uni.id, userId);
                          setWishlistIds(next);
                        }}
                      >
                        <HeartOff className="w-4 h-4" /> Убрать
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tracking;
