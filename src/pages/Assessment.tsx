import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { saveLastResultsQuery } from "@/lib/results";

type Question = {
  id: string;
  question: string;
  type: "single" | "multi";
  options: string[];
  forTypes?: string[];
  dependsOn?: {
    id: string;
    anyOf: string[];
  };
};

const allQuestions: Question[] = [
  // Common first question
  {
    id: "determined",
    question: "Ты уже определился со своим будущим?",
    type: "single",
    options: [
      "Да, я знаю куда хочу поступить",
      "Примерно знаю направление",
      "Я ещё не определился с будущим",
    ],
  },
  // School-specific
  {
    id: "goal",
    question: "Какая у тебя главная цель?",
    type: "single",
    options: [
      "Поступить в университет в своей стране",
      "Поступить за рубежом",
      "Определить свою будущую профессию",
      "Я ещё не определился",
    ],
    forTypes: ["school", "graduate"],
  },
  // Graduate-specific: timeline & readiness
  {
    id: "graduate_timeline",
    question: "Когда ты планируешь подать документы?",
    type: "single",
    options: ["В ближайшие 1–2 месяца", "В этом учебном году", "В следующем году", "Пока не знаю"],
    forTypes: ["graduate"],
  },
  {
    id: "graduate_chosen",
    question: "Ты уже выбрал(а) страну/университет?",
    type: "single",
    options: ["Да, уже выбрал(а)", "Частично (есть страны/варианты)", "Нет, хочу подобрать"],
    forTypes: ["graduate"],
  },
  {
    id: "graduate_target_country",
    question: "Какие страны ты рассматриваешь в первую очередь?",
    type: "multi",
    options: ["США", "Канада", "Великобритания", "Германия", "Италия", "Польша", "Южная Корея", "Турция", "Другая"],
    forTypes: ["graduate"],
    dependsOn: { id: "graduate_chosen", anyOf: ["Да, уже выбрал(а)", "Частично (есть страны/варианты)"] },
  },
  {
    id: "graduate_deadline",
    question: "Ты знаешь дедлайн подачи документов?",
    type: "single",
    options: ["Да, знаю", "Примерно знаю", "Нет"],
    forTypes: ["graduate"],
    dependsOn: { id: "graduate_chosen", anyOf: ["Да, уже выбрал(а)", "Частично (есть страны/варианты)"] },
  },
  {
    id: "graduate_deadline_window",
    question: "Когда дедлайн? (примерно)",
    type: "single",
    options: ["1–4 недели", "1–2 месяца", "3–6 месяцев", "6+ месяцев", "Не уверен(а)"],
    forTypes: ["graduate"],
    dependsOn: { id: "graduate_deadline", anyOf: ["Да, знаю", "Примерно знаю"] },
  },
  {
    id: "graduate_level",
    question: "На какой уровень ты хочешь поступать?",
    type: "single",
    options: ["Бакалавриат", "Foundation / Pathway", "Колледж", "Пока не знаю"],
    forTypes: ["graduate"],
  },
  {
    id: "graduate_docs",
    question: "Какие документы/экзамены у тебя уже есть?",
    type: "multi",
    options: ["Паспорт", "Аттестат/диплом", "IELTS/TOEFL", "SAT/ACT", "Мотивационное письмо", "Рекомендации", "Портфолио"],
    forTypes: ["graduate"],
  },
  // Student-specific
  {
    id: "student_goal",
    question: "Что ты хочешь сделать?",
    type: "single",
    options: [
      "Поменять специальность",
      "Перевестись в другой университет",
      "Учиться по обмену за рубежом",
      "Перейти в магистратуру в другом вузе",
    ],
    forTypes: ["student"],
  },
  {
    id: "student_target",
    question: "Куда ты хочешь двигаться дальше?",
    type: "single",
    options: ["В другой университет", "На обмен", "В другую страну", "В магистратуру"],
    forTypes: ["student"],
  },
  // Student — current situation
  {
    id: "current_edu",
    question: "Где ты сейчас учишься?",
    type: "single",
    options: [
      "1 курс бакалавриата",
      "2 курс бакалавриата",
      "3-4 курс бакалавриата",
      "Магистратура",
    ],
    forTypes: ["student"],
  },
  // Common interests
  {
    id: "interests",
    question: "Какие предметы тебе нравятся больше всего?",
    type: "multi",
    options: [
      "Математика",
      "Физика",
      "Биология / Химия",
      "Информатика / Программирование",
      "Языки (английский, и др.)",
      "История / Обществознание",
      "Экономика / Бизнес",
      "Искусство / Дизайн",
      "Медицина",
    ],
  },
  // Skills — what you already know
  {
    id: "skills",
    question: "Какие навыки у тебя уже есть? (отметь что знаешь)",
    type: "multi",
    options: [
      "IELTS / TOEFL (английский)",
      "Программирование",
      "Работа с данными / Excel",
      "Олимпиады / конкурсы",
      "Волонтёрство / социальные проекты",
      "Спорт (достижения)",
      "Музыка / творчество",
      "Лидерство / свои проекты",
      "Второй иностранный язык",
    ],
  },
  // Country preference
  {
    id: "country",
    question: "В какой стране ты хотел бы учиться?",
    type: "multi",
    options: [
      "Казахстан",
      "Россия",
      "Узбекистан",
      "США",
      "Великобритания",
      "Германия",
      "Южная Корея / Япония",
      "Турция",
      "Не имеет значения",
    ],
  },
  // Budget
  {
    id: "budget",
    question: "Какой формат обучения тебе подходит?",
    type: "single",
    options: [
      "Только бесплатно (грант / стипендия)",
      "Готов платить частично",
      "Платное обучение — не проблема",
      "Хочу найти грант, но рассмотрю и платное",
    ],
  },
  {
    id: "preferred_career",
    question: "Какую профессию ты хочешь в итоге?",
    type: "single",
    options: [
      "Data Scientist",
      "Software Engineer",
      "AI/ML Engineer",
      "Business Analyst",
      "Financial Analyst",
      "Biomedical Engineer",
      "Public Health Specialist",
      "UX/UI Designer",
      "Пока не знаю",
    ],
  },
];

const Assessment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userType = searchParams.get("type") || "school";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  // Filter questions by user type
  const questions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (!q.forTypes) return true;
      return q.forTypes.includes(userType);
    });
  }, [userType]);

  const visibleQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (!q.dependsOn) return true;
      const current = answers[q.dependsOn.id] || [];
      return current.some((v) => q.dependsOn!.anyOf.includes(v));
    });
  }, [answers, questions]);

  const currentQ = visibleQuestions[step];
  const progress = ((step + 1) / visibleQuestions.length) * 100;
  const selected = answers[currentQ?.id] || [];

  const toggleOption = (option: string) => {
    if (currentQ.type === "single") {
      setAnswers({ ...answers, [currentQ.id]: [option] });
    } else {
      const updated = selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option];
      setAnswers({ ...answers, [currentQ.id]: updated });
    }
  };

  const canNext = selected.length > 0;

  const handleNext = () => {
    if (step < visibleQuestions.length - 1) {
      setStep(step + 1);
    } else {
      const params = new URLSearchParams();
      params.set("type", userType);

      searchParams.forEach((value, key) => {
        if (!params.has(key)) params.set(key, value);
      });

      Object.entries(answers).forEach(([key, vals]) => {
        params.set(key, vals.join(","));
      });
      saveLastResultsQuery(params.toString());
      navigate(`/paywall?${params.toString()}`);
    }
  };

  const userTypeTitle = userType === "school" ? "Школьник" : userType === "graduate" ? "Выпускник" : "Студент";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : navigate("/"))}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
          <div className="text-center">
            <span className="text-xs text-primary font-medium">{userTypeTitle}</span>
            <p className="text-sm text-muted-foreground font-medium">
              {step + 1} из {visibleQuestions.length}
            </p>
          </div>
          <div className="w-16" />
        </div>
        <div className="max-w-3xl mx-auto mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                {currentQ.question}
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                {currentQ.type === "multi"
                  ? "Выбери один или несколько вариантов"
                  : "Выбери один вариант"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((option) => {
                  const isSelected = selected.includes(option);
                  return (
                    <motion.button
                      key={option}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleOption(option)}
                      className={`relative p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/30"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                        >
                        visibleQ <Check className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* "Not determined" hint for school users */}
              {currentQ.id === "determined" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 p-4 rounded-xl bg-secondary/5 border border-secondary/10 flex items-start gap-3"
                >
                  <HelpCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Не переживай!</p>
                    <p className="text-xs text-muted-foreground">
                      Если ты ещё не определился — наш AI поможет найти профессии будущего,
                      которые подойдут именно тебе. Мы покажем актуальные направления на ближайшие 10 лет.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex justify-end"
          >
            <Button
              onClick={handleNext}
              disabled={!canNext}
              size="lg"
              className="gap-2 px-8"
            >
              {step === visibleQuestions.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" /> Получить рекомендации
                </>
              ) : (
                <>
                  Далее <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
