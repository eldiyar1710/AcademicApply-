import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Lock, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ensureOrganicAttribution, getAttribution } from "@/lib/attribution";
import { isAuthed } from "@/lib/auth";

const Paywall = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isUpgradeFlow = searchParams.get("upgrade") === "1";
  const authed = isAuthed();

  useEffect(() => {
    ensureOrganicAttribution();
  }, []);

  useEffect(() => {
    if (!authed) return;
    if (isUpgradeFlow) return;
    navigate(`/results?${searchParams.toString()}`);
  }, [authed, isUpgradeFlow, navigate, searchParams]);

  const attr = getAttribution();
  const fromEvent = attr?.source === "offline_qr";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Мы анализируем твой профиль</h1>
                <p className="text-sm text-muted-foreground">Секунду — собираем рекомендации</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 gap-3"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-primary/5 border border-primary/10"
              >
                <p className="text-sm text-foreground font-medium">Найдено: 12 программ</p>
                <p className="text-xs text-muted-foreground">С шансом поступления 85%+</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="p-4 rounded-xl bg-secondary/5 border border-secondary/10"
              >
                <p className="text-sm text-foreground font-medium">Топ-направление: Data Science</p>
                <p className="text-xs text-muted-foreground">Актуальные профессии на 10 лет</p>
              </motion.div>

              {fromEvent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl bg-accent/5 border border-accent/10"
                >
                  <p className="text-sm text-foreground font-medium">Бонус участника мероприятия</p>
                  <p className="text-xs text-muted-foreground">Скидка активируется после регистрации</p>
                </motion.div>
              )}
            </motion.div>

            <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">Открой полный список</p>
                <p className="text-xs text-muted-foreground">Создай аккаунт, чтобы увидеть результаты и сохранить их</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* $49 Basic Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-primary/5 border border-primary/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">$49</span>
                  <span className="text-sm text-muted-foreground">/месяц</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Roadmap</h3>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• 3 встречи/неделю</li>
                  <li>• План поступления</li>
                  <li>• Бесплатные курсы</li>
                </ul>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(`/checkout?plan=ai_roadmap&${searchParams.toString()}`)}
                >
                  Выбрать
                </Button>
              </motion.div>

              {/* $490 Expert Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-600">$490</span>
                    <span className="text-sm text-muted-foreground">/3 месяца</span>
                  </div>
                  <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">EXPERT</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Expert Mentorship</h3>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• 2 встречи/день</li>
                  <li>• Индивидуальный план</li>
                  <li>• AI агент 24/7</li>
                  <li>• Видеозвонки</li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  onClick={() => navigate(`/checkout?plan=expert_mentorship&${searchParams.toString()}`)}
                >
                  Выбрать Expert
                </Button>
              </motion.div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {!authed && (
                <Button className="gap-2" size="lg" onClick={() => navigate(`/register?${searchParams.toString()}`)}>
                  Создать аккаунт <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {authed ? (
                <Button size="lg" onClick={() => navigate("/dashboard")}>
                  Назад в кабинет
                </Button>
              ) : (
                <Button variant="outline" size="lg" onClick={() => navigate("/")}>На главную</Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Paywall;
