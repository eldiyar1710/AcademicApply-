import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Trophy, BookOpen, ExternalLink, Star, GraduationCap, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { universityData } from "@/data/universities";

type Career = {
  title: string;
  trend: string;
  salary: string;
  match: number;
  description: string;
  futureYears: string;
};

const mockCareers: Career[] = [
  { title: "Data Scientist", trend: "🔥 Топ профессия 2025–2035", salary: "$80K–$150K", match: 95, description: "Анализ данных, машинное обучение, статистика", futureYears: "10+ лет высокого спроса" },
  { title: "Software Engineer", trend: "📈 Стабильный рост", salary: "$70K–$130K", match: 90, description: "Разработка приложений, веб-систем и сервисов", futureYears: "Актуально всегда" },
  { title: "AI/ML Engineer", trend: "🚀 Высокий спрос", salary: "$90K–$160K", match: 85, description: "Создание и обучение искусственного интеллекта", futureYears: "15+ лет роста" },
  { title: "UX/UI Designer", trend: "🎨 Креативная сфера", salary: "$50K–$100K", match: 75, description: "Дизайн интерфейсов и пользовательского опыта", futureYears: "Стабильный спрос" },
];

const typeLabels: Record<string, { text: string; color: string }> = {
  grant: { text: "Грант", color: "bg-accent text-accent-foreground" },
  paid: { text: "Платное", color: "bg-secondary text-secondary-foreground" },
  partial: { text: "Частичный грант", color: "bg-primary text-primary-foreground" },
};

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userType = searchParams.get("type") || "school";

  const userTypeLabel = userType === "school" ? "школьника" : userType === "graduate" ? "выпускника" : "студента";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* User type banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-primary/5 border border-primary/10 mb-10 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-foreground">
                Персональные рекомендации для {userTypeLabel}
              </h2>
              <p className="text-sm text-muted-foreground">
                На основе ваших навыков, интересов и целей. Актуальные профессии на ближайшие 10 лет.
              </p>
            </div>
          </motion.div>

          {/* Careers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground">Рекомендованные профессии</h2>
                <p className="text-muted-foreground text-sm">Актуальные на ближайшие десятилетия</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCareers.map((career, i) => (
                <motion.div
                  key={career.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="p-5 rounded-xl bg-card shadow-card border border-border/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{career.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{career.trend}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-heading font-bold text-primary">{career.match}%</div>
                      <div className="text-xs text-muted-foreground">совпадение</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{career.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{career.salary}/год</span>
                    <Badge className="bg-accent/10 text-accent text-xs">{career.futureYears}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Skills gap notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 rounded-xl bg-secondary/5 border border-secondary/10 flex items-center gap-4"
            >
              <BookOpen className="w-5 h-5 text-secondary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">Есть пробелы в знаниях?</p>
                <p className="text-xs text-muted-foreground">Мы подобрали курсы для подготовки к поступлению</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/courses")} className="gap-1.5 flex-shrink-0">
                Курсы <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Universities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground">Подходящие университеты</h2>
                <p className="text-muted-foreground text-sm">Ранжированы по совпадению с вашим профилем</p>
              </div>
            </div>

            <div className="space-y-4">
              {universityData.map((uni, i) => (
                <motion.div
                  key={uni.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-6 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-card-hover transition-shadow cursor-pointer"
                  onClick={() => navigate(`/university/${uni.id}`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-heading font-bold text-foreground">{uni.name}</h3>
                        <Badge className={typeLabels[uni.type].color}>
                          {typeLabels[uni.type].text}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {uni.city}, {uni.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" /> {uni.ranking}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {uni.programs.slice(0, 3).map((p) => (
                          <span key={p.name} className="px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium">
                            {p.name}
                          </span>
                        ))}
                        {uni.programs.length > 3 && (
                          <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                            +{uni.programs.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        {uni.requirements.slice(0, 2).map((r) => r.title).join(", ")}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <div className="text-3xl font-heading font-bold text-primary">{uni.match}%</div>
                        <div className="text-xs text-muted-foreground">совпадение</div>
                      </div>
                      <Button size="sm" className="gap-1.5">
                        Подробнее <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center p-8 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              {userType === "student"
                ? "Хочешь перевестись или учиться по обмену?"
                : "Хочешь поступить в один из этих университетов?"}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Выбери университет выше и мы подготовим все документы за тебя
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={() => navigate("/courses")} className="gap-2">
                <BookOpen className="w-4 h-4" /> Подготовительные курсы
              </Button>
              <Button size="lg" className="gap-2" onClick={() => navigate("/tracking")}>
                <GraduationCap className="w-4 h-4" /> Мои заявки
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Results;
