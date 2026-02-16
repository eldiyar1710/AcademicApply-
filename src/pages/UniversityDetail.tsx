import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Trophy, BookOpen, Globe, Users, Calendar,
  CheckCircle2, Clock, DollarSign, GraduationCap, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { universityData } from "@/data/universities";

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const uni = universityData.find((u) => u.id === id);

  if (!uni) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Университет не найден</h1>
          <Button onClick={() => navigate("/")}>На главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <div className="pt-16 bg-primary">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Назад к результатам
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge className="bg-primary-foreground/20 text-primary-foreground mb-3">
                {uni.ranking}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-2">
                {uni.name}
              </h1>
              <div className="flex items-center gap-4 text-primary-foreground/80 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {uni.city}, {uni.country}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Осн. {uni.founded}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {uni.students} студентов</span>
              </div>
            </div>
            <div className="text-center bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-heading font-bold text-primary-foreground">{uni.match}%</div>
              <div className="text-xs text-primary-foreground/70">совпадение</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-card shadow-card border border-border/50"
            >
              <h2 className="text-xl font-heading font-bold text-foreground mb-3">О университете</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{uni.description}</p>
            </motion.div>

            {/* Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-card shadow-card border border-border/50"
            >
              <h2 className="text-xl font-heading font-bold text-foreground mb-4">Доступные программы</h2>
              <div className="space-y-3">
                {uni.programs.map((prog) => (
                  <div key={prog.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{prog.name}</h3>
                      <p className="text-xs text-muted-foreground">{prog.degree} · {prog.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {prog.grant && (
                        <Badge className="bg-accent text-accent-foreground text-xs">Грант</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{prog.tuition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-card shadow-card border border-border/50"
            >
              <h2 className="text-xl font-heading font-bold text-foreground mb-4">Требования для поступления</h2>
              <div className="space-y-3">
                {uni.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{req.title}</h3>
                      <p className="text-xs text-muted-foreground">{req.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommended courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-card shadow-card border border-border/50"
            >
              <h2 className="text-xl font-heading font-bold text-foreground mb-2">Что нужно подготовить</h2>
              <p className="text-muted-foreground text-sm mb-4">Курсы и навыки, которые помогут тебе поступить</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {uni.preparationCourses.map((course) => (
                  <div key={course.name} className="p-3 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm text-foreground">{course.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{course.provider} · {course.duration}</p>
                    {course.free && <Badge className="mt-2 bg-accent/10 text-accent text-xs">Бесплатно</Badge>}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-xl bg-card shadow-card border border-border/50 sticky top-24"
            >
              <h3 className="font-heading font-bold text-foreground mb-4">Подать документы</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" /> Дедлайн: {uni.deadline}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" /> Стоимость заявки: {uni.applicationFee}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" /> Язык: {uni.language}
                </div>
              </div>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => navigate(`/apply/${uni.id}`)}
              >
                <GraduationCap className="w-4 h-4" /> Хочу поступить
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Мы подготовим и отправим документы за вас
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UniversityDetail;
