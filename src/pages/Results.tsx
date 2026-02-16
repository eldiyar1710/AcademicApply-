import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Trophy, BookOpen, ExternalLink, Star, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type University = {
  name: string;
  country: string;
  ranking: string;
  match: number;
  type: "grant" | "paid" | "partial";
  requirements: string[];
  programs: string[];
};

type Career = {
  title: string;
  trend: string;
  salary: string;
  match: number;
};

const mockCareers: Career[] = [
  { title: "Data Scientist", trend: "🔥 Топ профессия 2025–2035", salary: "$80K–$150K", match: 95 },
  { title: "Software Engineer", trend: "📈 Стабильный рост", salary: "$70K–$130K", match: 90 },
  { title: "AI/ML Engineer", trend: "🚀 Высокий спрос", salary: "$90K–$160K", match: 85 },
  { title: "UX/UI Designer", trend: "🎨 Креативная сфера", salary: "$50K–$100K", match: 75 },
];

const mockUniversities: University[] = [
  {
    name: "Назарбаев Университет",
    country: "Казахстан",
    ranking: "Топ-1 в КЗ",
    match: 92,
    type: "grant",
    requirements: ["IELTS 6.5+", "SAT 1200+"],
    programs: ["Computer Science", "Data Science"],
  },
  {
    name: "KAIST",
    country: "Южная Корея",
    ranking: "Топ-40 мира",
    match: 87,
    type: "grant",
    requirements: ["IELTS 6.5+", "Мотивационное письмо"],
    programs: ["Electrical Engineering", "CS"],
  },
  {
    name: "TU Munich",
    country: "Германия",
    ranking: "Топ-50 мира",
    match: 83,
    type: "partial",
    requirements: ["TestDaF B2", "Аттестат"],
    programs: ["Informatics", "Mathematics"],
  },
  {
    name: "University of Warsaw",
    country: "Польша",
    ranking: "Топ-300 мира",
    match: 80,
    type: "paid",
    requirements: ["IELTS 5.5+", "Аттестат"],
    programs: ["Computer Science", "Economics"],
  },
];

const typeLabels: Record<string, { text: string; color: string }> = {
  grant: { text: "Грант", color: "bg-accent text-accent-foreground" },
  paid: { text: "Платное", color: "bg-secondary text-secondary-foreground" },
  partial: { text: "Частичный грант", color: "bg-primary text-primary-foreground" },
};

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-6 border-b border-border bg-card">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> На главную
          </button>
          <h1 className="font-heading font-bold text-foreground">Ваши рекомендации</h1>
          <div />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Careers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground">Рекомендованные профессии</h2>
              <p className="text-muted-foreground text-sm">На основе ваших навыков и интересов</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCareers.map((career, i) => (
              <motion.div
                key={career.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-card shadow-card border border-border/50 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{career.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{career.trend}</p>
                  <p className="text-xs text-muted-foreground mt-1">{career.salary}/год</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-heading font-bold text-primary">{career.match}%</div>
                  <div className="text-xs text-muted-foreground">совпадение</div>
                </div>
              </motion.div>
            ))}
          </div>
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
            {mockUniversities.map((uni, i) => (
              <motion.div
                key={uni.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-6 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-card-hover transition-shadow"
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
                        <MapPin className="w-3.5 h-3.5" /> {uni.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" /> {uni.ranking}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {uni.programs.map((p) => (
                        <span key={p} className="px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="w-3.5 h-3.5" />
                      Требования: {uni.requirements.join(", ")}
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
            Хочешь поступить в один из этих университетов?
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Зарегистрируйся и мы подготовим все документы за тебя
          </p>
          <Button size="lg" className="gap-2">
            <GraduationCap className="w-4 h-4" /> Начать поступление
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
