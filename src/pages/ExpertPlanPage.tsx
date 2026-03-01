import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Crown, Clock, Video, Target, Brain, 
  Zap, CheckCircle2, Circle, AlertCircle, Sparkles, ChevronRight,
  GraduationCap, TrendingUp, Bell, BookOpen, FileText,
  MessageSquare, ExternalLink, Calendar, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultantInvitation from "@/components/ConsultantInvitation";
import ConsultantChat from "@/components/ConsultantChat";
import ConsultantChatScreen from "@/components/ConsultantChatScreen";
import { getUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface HourlyTask {
  hour: string;
  task: string;
  completed: boolean;
  type: "study" | "ielts" | "document" | "break" | "meeting";
}

interface AIRecommendation {
  id: string;
  message: string;
  priority: "high" | "medium" | "low";
  action?: string;
}

interface WeekTask {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "study" | "document" | "call" | "ielts";
  deadline: string;
}

interface WeekDayPlan {
  day: string;
  date: string;
  focus: string;
  tasks: WeekTask[];
}

const EXPERT_COURSES = [
  { name: "IELTS Advanced", provider: "British Council", free: true },
  { name: "Academic Writing Master", provider: "Coursera", free: true },
  { name: "GRE Prep", provider: "Khan Academy", free: true },
  { name: "Research Methods", provider: "edX", free: true },
  { name: "Public Speaking", provider: "Coursera", free: true },
];

const AI_AGENT_MESSAGES = [
  { id: "1", message: "Вы не выполнили задачу 'IELTS Reading' вчера. Хотите перенести на сегодня?", priority: "high" as const, action: "Перенести" },
  { id: "2", message: "Отличный прогресс! GPA вырос на 0.2 за неделю.", priority: "medium" as const },
  { id: "3", message: "Дедлайн MIT через 45 дней. У вас 73% готовности.", priority: "high" as const, action: "Ускорить" },
  { id: "4", message: "Рекомендую записаться на доп. собеседование с консультантом.", priority: "medium" as const, action: "Записаться" },
];

const TARGET_UNIVERSITIES = [
  { name: "MIT", deadline: "15 Декабря", progress: 73, chance: "Высокие", grant: "$50,000/год" },
  { name: "Stanford", deadline: "1 Декабря", progress: 68, chance: "Средние", grant: "$45,000/год" },
  { name: "ETH Zurich", deadline: "15 Января", progress: 81, chance: "Высокие", grant: "Бесплатно" },
];

const WEEKLY_PLAN: WeekDayPlan[] = [
  {
    day: "Понедельник",
    date: "Сегодня",
    focus: "Стратегия и дедлайны",
    tasks: [
      { id: "w1", title: "Проверка дедлайнов и требований топ-3 вузов", duration: "45м", completed: false, type: "study", deadline: "12:00" },
      { id: "w2", title: "Встреча с экспертом (20 мин)", duration: "20м", completed: false, type: "call", deadline: "14:00" },
      { id: "w3", title: "Документы: ревью мотивационного письма", duration: "1ч", completed: false, type: "document", deadline: "18:00" },
    ],
  },
  {
    day: "Вторник",
    date: "Завтра",
    focus: "IELTS и эссе",
    tasks: [
      { id: "w4", title: "IELTS Writing (Task 2) — разбор ошибок", duration: "1ч", completed: false, type: "ielts", deadline: "13:00" },
      { id: "w5", title: "Эссе: структурировать 2 истории", duration: "45м", completed: false, type: "document", deadline: "18:30" },
    ],
  },
  {
    day: "Среда",
    date: "Послезавтра",
    focus: "Список программ",
    tasks: [
      { id: "w6", title: "Подбор 5 программ и сравнение требований", duration: "1ч", completed: false, type: "study", deadline: "17:00" },
      { id: "w7", title: "Встреча с экспертом (20 мин)", duration: "20м", completed: false, type: "call", deadline: "19:00" },
    ],
  },
];

const ExpertPlanPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useMemo(() => getUser(), []);
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "plan" | "week" | "ai" | "courses" | "goals" | "report" | "consultant">("dashboard");
  const [showChatScreen, setShowChatScreen] = useState(false);
  const [hourlyPlan, setHourlyPlan] = useState<HourlyTask[]>([
    { hour: "08:00", task: "Пробуждение, завтрак, планирование", completed: true, type: "break" },
    { hour: "09:00", task: "IELTS Reading - 2 текста", completed: false, type: "ielts" },
    { hour: "10:30", task: "Перерыв", completed: false, type: "break" },
    { hour: "11:00", task: "Работа над мотивационным письмом", completed: false, type: "document" },
    { hour: "12:30", task: "Обед", completed: false, type: "break" },
    { hour: "13:30", task: "Встреча с консультантом (20 мин)", completed: false, type: "meeting" },
    { hour: "14:00", task: "Анализ требований MIT", completed: false, type: "study" },
    { hour: "15:30", task: "IELTS Listening practice", completed: false, type: "ielts" },
    { hour: "17:00", task: "Перерыв", completed: false, type: "break" },
    { hour: "17:30", task: "Проверка документов", completed: false, type: "document" },
    { hour: "19:00", task: "Ужин", completed: false, type: "break" },
    { hour: "20:00", task: "Ревью дня + план завтра", completed: false, type: "study" },
  ]);

  const toggleTask = (index: number) => {
    setHourlyPlan(prev => prev.map((t, i) => 
      i === index ? { ...t, completed: !t.completed } : t
    ));
    toast({ title: "Задача обновлена", description: "AI агент отслеживает ваш прогресс" });
  };

  const completedTasks = hourlyPlan.filter(t => t.completed).length;
  const progress = Math.round((completedTasks / hourlyPlan.length) * 100);

  const [weeklyPlan, setWeeklyPlan] = useState<WeekDayPlan[]>(WEEKLY_PLAN);
  const [selectedWeekDay, setSelectedWeekDay] = useState(0);
  const [showConsultantChat, setShowConsultantChat] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<typeof TARGET_UNIVERSITIES[0] | null>(null);
  const [showUniversityModal, setShowUniversityModal] = useState(false);

  const toggleWeekTask = (dayIndex: number, taskId: string) => {
    setWeeklyPlan((prev) =>
      prev.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          tasks: day.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      }),
    );
    toast({ title: "Задача обновлена", description: "Эксперт видит ваш прогресс в реальном времени" });
  };

  const weekCompleted = weeklyPlan.flatMap((d) => d.tasks).filter((t) => t.completed).length;
  const weekTotal = weeklyPlan.flatMap((d) => d.tasks).length;
  const weekProgress = weekTotal === 0 ? 0 : Math.round((weekCompleted / weekTotal) * 100);

  const currentWeekDay = weeklyPlan[selectedWeekDay];

  const calculateDaysRemaining = (deadline: string) => {
    const months: { [key: string]: number } = {
      'Января': 0, 'Февраля': 1, 'Марта': 2, 'Апреля': 3, 'Мая': 4, 'Июня': 5,
      'Июля': 6, 'Августа': 7, 'Сентября': 8, 'Октября': 9, 'Ноября': 10, 'Декабря': 11
    };
    
    const [day, month] = deadline.split(' ');
    const currentYear = new Date().getFullYear();
    const deadlineDate = new Date(currentYear, months[month] || 0, parseInt(day));
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Дедлайн прошел";
    if (diffDays === 0) return "Сегодня последний день";
    if (diffDays === 1) return "Остался 1 день";
    if (diffDays <= 4) return `Осталось ${diffDays} дня`;
    return `Осталось ${diffDays} дней`;
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "ielts": return <BookOpen className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "meeting": return <Video className="w-4 h-4" />;
      case "break": return <Clock className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {showChatScreen ? (
        <ConsultantChatScreen onBack={() => setShowChatScreen(false)} />
      ) : (
        <>
          <Header />
          
          <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                      Премиум план
                    </h1>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 text-xs rounded-full font-medium">
                      EXPERT
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {user?.name} • AI-агент активен
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">{progress}%</p>
                  <p className="text-xs text-muted-foreground">день выполнен</p>
                </div>
                <div className="w-20 h-20 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                    <circle 
                      cx="40" cy="40" r="36" fill="none" stroke="#f59e0b" strokeWidth="5"
                      strokeDasharray={`${progress * 2.26} 226`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {completedTasks}/12
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8">
            {(
              [
                { id: "dashboard", label: "Дашборд", icon: TrendingUp },
                { id: "plan", label: "План на день", icon: Clock },
                { id: "week", label: "План недели", icon: Calendar },
                { id: "ai", label: "AI Агент", icon: Brain },
                { id: "courses", label: "Курсы", icon: GraduationCap },
                { id: "goals", label: "Цели", icon: Target },
                { id: "report", label: "Отчёт", icon: FileText },
                { id: "consultant", label: "Консультант", icon: MessageSquare },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.id === "consultant" ? setShowChatScreen(true) : setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Stats */}
              <div className="lg:col-span-2 space-y-6">
                {/* Universities Progress */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
                  <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-600" />
                    Целевые университеты
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {TARGET_UNIVERSITIES.map((uni, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm cursor-pointer hover:border-amber-400 hover:shadow-md transition-all"
                        onClick={() => {
                          setSelectedUniversity(uni);
                          setShowUniversityModal(true);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-foreground">{uni.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            uni.chance === "Высокие" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {uni.chance}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Готовность</span>
                            <span className="font-medium">{uni.progress}%</span>
                          </div>
                          <Progress value={uni.progress} className="h-2" />
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <p className="text-amber-700 font-medium">{uni.grant}</p>
                          <p className="text-muted-foreground">Дедлайн: {uni.deadline}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI Insights */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Аналитика
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-primary/5 text-center">
                      <p className="text-2xl font-bold text-primary">4.2</p>
                      <p className="text-xs text-muted-foreground">Ваш GPA</p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/5 text-center">
                      <p className="text-2xl font-bold text-accent">7.0</p>
                      <p className="text-xs text-muted-foreground">IELTS цель</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/5 text-center">
                      <p className="text-2xl font-bold text-green-600">87%</p>
                      <p className="text-xs text-muted-foreground">Успеваемость</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/5 text-center">
                      <p className="text-2xl font-bold text-amber-600">12</p>
                      <p className="text-xs text-muted-foreground">Дней подряд</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Notifications */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold">Уведомления</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white border border-amber-100">
                      <p className="text-sm text-foreground">Встреча с консультантом через 2 часа</p>
                      <p className="text-xs text-muted-foreground mt-1">14:00 - 14:20</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-amber-100">
                      <p className="text-sm text-foreground">Дедлайн MIT: осталось 45 дней</p>
                      <p className="text-xs text-muted-foreground mt-1">73% готовности</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold mb-4">Быстрые действия</h3>
                  <div className="space-y-2">
                    <Button 
                      className="w-full gap-2" 
                      variant="outline"
                      onClick={() => setShowConsultantChat(true)}
                    >
                      <Video className="w-4 h-4" />
                      Начать видеозвонок
                    </Button>
                    <Button 
                      className="w-full gap-2" 
                      variant="outline"
                      onClick={() => navigate("/tracking?calendar=1")}
                    >
                      <Calendar className="w-4 h-4" />
                      Записаться
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "week" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">План на неделю</h3>
                    <p className="text-sm text-muted-foreground">Экспертный план: дедлайны, документы, встречи</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-600">{weekProgress}%</p>
                    <p className="text-xs text-muted-foreground">выполнено</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={weekProgress} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-2">
                  {weeklyPlan.map((day, idx) => {
                    const dayProgress = day.tasks.length === 0 ? 0 : Math.round((day.tasks.filter((t) => t.completed).length / day.tasks.length) * 100);
                    return (
                      <button
                        key={`${day.day}-${idx}`}
                        onClick={() => setSelectedWeekDay(idx)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          selectedWeekDay === idx
                            ? "border-amber-400 bg-amber-500/10"
                            : "border-border hover:border-amber-400/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{day.day}</span>
                          <span className="text-xs text-muted-foreground">{dayProgress}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{day.focus}</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${dayProgress}%` }} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-2">
                  <div className="p-6 rounded-2xl bg-card border border-border/50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-heading font-semibold text-lg">{currentWeekDay.day}</h3>
                        <p className="text-sm text-muted-foreground">{currentWeekDay.focus}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{currentWeekDay.date}</p>
                    </div>

                    <div className="space-y-3">
                      {currentWeekDay.tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-xl border transition-all ${
                            task.completed ? "bg-muted/50 border-muted" : "bg-card border-border hover:border-amber-400/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button onClick={() => toggleWeekTask(selectedWeekDay, task.id)} className="mt-0.5">
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground hover:text-amber-600" />
                              )}
                            </button>
                            <div className="flex-1">
                              <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {task.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> До {task.deadline}
                                </span>
                                {task.type === "call" && (
                                  <span className="flex items-center gap-1 text-amber-700">
                                    <Video className="w-3 h-3" /> Встреча
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
                <h3 className="font-heading font-semibold text-lg mb-2">Цели и университеты</h3>
                <p className="text-sm text-muted-foreground">Шансы, дедлайны, гранты — всё в одном месте</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TARGET_UNIVERSITIES.map((uni, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground">{uni.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          uni.chance === "Высокие" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {uni.chance}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Готовность</span>
                            <span className="text-foreground">{uni.progress}%</span>
                          </div>
                          <Progress value={uni.progress} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground">Дедлайн: {uni.deadline}</p>
                        <p className="text-xs font-medium text-amber-700">Грант: {uni.grant}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "report" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="font-heading font-semibold text-lg mb-6">Отчёт</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-amber-500/5 text-center">
                    <p className="text-3xl font-bold text-amber-600">{weekCompleted}</p>
                    <p className="text-xs text-muted-foreground">Задач за неделю</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 text-center">
                    <p className="text-3xl font-bold text-primary">{progress}%</p>
                    <p className="text-xs text-muted-foreground">День выполнен</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/5 text-center">
                    <p className="text-3xl font-bold text-green-600">2</p>
                    <p className="text-xs text-muted-foreground">Встречи сегодня</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <p className="text-3xl font-bold text-foreground">{weekTotal - weekCompleted}</p>
                    <p className="text-xs text-muted-foreground">Осталось</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-medium text-foreground mb-2">Рекомендации эксперта:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-600 mt-0.5" />
                      Ускорить эссе: сегодня сделать финальный черновик на 70%
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-600 mt-0.5" />
                      Подготовить 5 вопросов на встречу с экспертом
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-600 mt-0.5" />
                      IELTS Writing: 1 пробный тест в среду
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "consultant" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
                <h3 className="font-heading font-semibold text-lg">Консультант и эксперт</h3>
                <p className="text-sm text-muted-foreground mt-1">Премиум сопровождение: проверка документов + встречи</p>

                <div className="mt-6 space-y-3">
                  <div className="p-4 rounded-xl bg-white border border-amber-200">
                    <p className="text-sm font-medium text-foreground">Статус</p>
                    <p className="text-xs text-muted-foreground mt-1">Документы в проверке. Следующий фидбек — в течение 24 часов.</p>
                  </div>
                  <Button className="w-full gap-2" onClick={() => navigate("/tracking?calendar=1")}>
                    <Calendar className="w-4 h-4" />
                    Записаться на встречу
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="font-heading font-semibold text-lg">Чат</h3>
                <p className="text-sm text-muted-foreground mt-1">Нажми кнопку «Консультант» — откроется календарь и чат</p>

                <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm text-foreground">В этом тарифе доступно:</p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 24/7 AI агент</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Проверка документов</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Видеовстречи</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Plan Tab */}
          {activeTab === "plan" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 mb-6">
                <h3 className="font-heading font-semibold text-lg mb-2">⏰ Индивидуальный план на 12 часов</h3>
                <p className="text-sm text-muted-foreground">
                  AI-агент адаптировал план под ваши цели: MIT + грант
                </p>
              </div>

              <div className="space-y-3">
                {hourlyPlan.map((task, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl border transition-all ${
                      task.completed 
                        ? "bg-muted/50 border-muted" 
                        : task.type === "meeting"
                        ? "bg-amber-100 border-amber-300"
                        : "bg-card border-border hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 text-center ${
                        task.completed ? "text-muted-foreground" : "text-foreground font-medium"
                      }`}>
                        {task.hour}
                      </div>
                      
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.type === "meeting" ? "bg-amber-500 text-white" : "bg-muted"
                      }`}>
                        {getTaskIcon(task.type)}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.task}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => toggleTask(idx)}
                        className={task.completed ? "text-green-500" : "text-muted-foreground hover:text-amber-600"}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI Tab */}
          {activeTab === "ai" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Brain className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">AI Агент поступления</h3>
                    <p className="text-sm text-muted-foreground">
                      Анализирует ваши действия и даёт рекомендации каждый час
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {AI_AGENT_MESSAGES.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-5 rounded-xl border ${
                      msg.priority === "high" 
                        ? "bg-red-50 border-red-200" 
                        : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        msg.priority === "high" ? "bg-red-100" : "bg-primary/10"
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          msg.priority === "high" ? "text-red-600" : "text-primary"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground mb-2">{msg.message}</p>
                        {msg.action && (
                          <Button size="sm" variant="outline" className="gap-1">
                            {msg.action} <ChevronRight className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {EXPERT_COURSES.map((course, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Бесплатно
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.provider}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                    <Sparkles className="w-4 h-4" />
                    <span>Рекомендовано AI</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />

      {user && (
        <ConsultantInvitation
          userType={(user.profile.userType || "school") as "school" | "graduate" | "student"}
          userName={user.name}
          dream={user.profile.dream}
          recommendations={[]}
          universities={[]}
          hasFreeCall={false}
          userPlan="expert"
        />
      )}

      {showConsultantChat && user && (
        <ConsultantChat 
          userName={user.name}
          userType={(user.profile.userType || "school") as "school" | "graduate" | "student"}
          dream={user.profile.dream}
          recommendations={[]}
          universities={[]}
          meetingTime={null}
          onClose={() => setShowConsultantChat(false)}
        />
      )}
        
        {/* University Detail Modal */}
        {showUniversityModal && selectedUniversity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">{selectedUniversity.name}</h3>
                  <button
                    onClick={() => setShowUniversityModal(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{selectedUniversity.progress}%</p>
                    <p className="text-xs text-muted-foreground">готовность</p>
                  </div>
                  <div className="flex-1">
                    <Progress value={selectedUniversity.progress} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Шансы поступления</p>
                    <p className={`text-sm ${
                      selectedUniversity.chance === "Высокие" ? "text-green-600" : "text-yellow-600"
                    }`}>
                      {selectedUniversity.chance}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-foreground">Грант/стипендия</p>
                    <p className="text-sm text-amber-600 font-medium">{selectedUniversity.grant}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-foreground">Дедлайн</p>
                    <p className="text-sm text-muted-foreground">{selectedUniversity.deadline}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {calculateDaysRemaining(selectedUniversity.deadline)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 p-6 pt-0">
                <Button className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Перейти на сайт университета
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setShowUniversityModal(false);
                  navigate("/tracking?calendar=1");
                }}>
                  <Calendar className="w-4 h-4" />
                  Записаться на консультацию
                </Button>
              </div>
            </motion.div>
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default ExpertPlanPage;
