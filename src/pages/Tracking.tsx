import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ExternalLink, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { universityData } from "@/data/universities";
import { getUser } from "@/lib/auth";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";

const Tracking = () => {
  const navigate = useNavigate();

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
