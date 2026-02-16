import { motion } from "framer-motion";
import { BookOpen, Clock, ExternalLink, Star, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

type Course = {
  id: string;
  name: string;
  provider: string;
  duration: string;
  category: string;
  level: string;
  free: boolean;
  description: string;
  url: string;
};

const allCourses: Course[] = [
  {
    id: "1", name: "IELTS Academic Preparation", provider: "British Council", duration: "3 месяца",
    category: "Языки", level: "Средний", free: false,
    description: "Полный курс подготовки к IELTS Academic с практикой всех 4 модулей",
    url: "#",
  },
  {
    id: "2", name: "SAT Math & Reading", provider: "Khan Academy", duration: "2 месяца",
    category: "Тесты", level: "Средний", free: true,
    description: "Бесплатная подготовка к SAT с адаптивными задачами и видеоуроками",
    url: "#",
  },
  {
    id: "3", name: "CS50: Introduction to Computer Science", provider: "Harvard (edX)", duration: "12 недель",
    category: "IT", level: "Начинающий", free: true,
    description: "Легендарный курс от Гарварда. Основы программирования, алгоритмы, веб-разработка",
    url: "#",
  },
  {
    id: "4", name: "Academic Writing", provider: "Coursera", duration: "6 недель",
    category: "Языки", level: "Средний", free: true,
    description: "Научись писать эссе и мотивационные письма на академическом английском",
    url: "#",
  },
  {
    id: "5", name: "Python for Data Science", provider: "Codecademy", duration: "8 недель",
    category: "IT", level: "Начинающий", free: true,
    description: "Основы Python с фокусом на анализ данных: pandas, numpy, matplotlib",
    url: "#",
  },
  {
    id: "6", name: "Calculus 1", provider: "MIT OpenCourseWare", duration: "15 недель",
    category: "Математика", level: "Средний", free: true,
    description: "Полный университетский курс математического анализа от MIT",
    url: "#",
  },
  {
    id: "7", name: "Немецкий язык A1-B2", provider: "Goethe-Institut", duration: "6 месяцев",
    category: "Языки", level: "Начинающий", free: false,
    description: "Интенсивный курс немецкого языка с нуля до уровня B2 для поступления",
    url: "#",
  },
  {
    id: "8", name: "Linear Algebra", provider: "3Blue1Brown + MIT", duration: "14 недель",
    category: "Математика", level: "Средний", free: true,
    description: "Визуальный курс линейной алгебры с практическими заданиями",
    url: "#",
  },
  {
    id: "9", name: "Biology for Pre-Med", provider: "Khan Academy", duration: "10 недель",
    category: "Наука", level: "Средний", free: true,
    description: "Подготовка по биологии для поступления на медицинские программы",
    url: "#",
  },
  {
    id: "10", name: "TOEFL iBT Preparation", provider: "ETS / edX", duration: "6 недель",
    category: "Языки", level: "Средний", free: true,
    description: "Официальная подготовка к TOEFL от создателей теста",
    url: "#",
  },
  {
    id: "11", name: "Korean Language Basics", provider: "Talk To Me In Korean", duration: "8 недель",
    category: "Языки", level: "Начинающий", free: true,
    description: "Базовый корейский для студентов, планирующих учиться в Южной Корее",
    url: "#",
  },
  {
    id: "12", name: "Financial Literacy & Economics", provider: "Coursera", duration: "8 недель",
    category: "Экономика", level: "Начинающий", free: true,
    description: "Основы экономики, финансов и бизнеса для поступления на экономические программы",
    url: "#",
  },
];

const categories = ["Все", "Языки", "IT", "Математика", "Тесты", "Наука", "Экономика"];

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState("Все");
  const filtered = activeCategory === "Все" ? allCourses : allCourses.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              Подготовительные курсы
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Бесплатные и платные курсы для подготовки к поступлению. Закрой пробелы и увеличь шансы на грант.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-card-hover transition-shadow flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className={course.free ? "bg-accent/10 text-accent" : "bg-secondary/10 text-secondary"}>
                    {course.free ? "Бесплатно" : "Платный"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{course.level}</span>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{course.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{course.provider}</p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> {course.duration}
                  </span>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    Перейти <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
