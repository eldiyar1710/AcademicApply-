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

  useEffect(() => {
    ensureOrganicAttribution();
  }, []);

  useEffect(() => {
    if (!isAuthed()) return;
    navigate(`/results?${searchParams.toString()}`);
  }, [navigate, searchParams]);

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

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button className="gap-2" size="lg" onClick={() => navigate(`/register?${searchParams.toString()}`)}>
                Создать аккаунт <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/")}>На главную</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Paywall;
