import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Calendar, Clock, BookOpen, Video, Target, 
  CheckCircle2, Circle, ExternalLink, GraduationCap, 
  FileText, AlertCircle, Sparkles, ChevronRight, MessageCircle, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultantInvitation from "@/components/ConsultantInvitation";
import { getUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "study" | "document" | "call" | "ielts";
  courseLink?: string;
  deadline: string;
}

interface DayPlan {
  day: string;
  date: string;
  focus: string;
  tasks: Task[];
}

const WEEKLY_PLAN: DayPlan[] = [
  {
    day: "Понедельник",
    date: "Сегодня",
    focus: "Анализ требований",
    tasks: [
      { id: "1", title: "Изучить требования вузов", duration: "2ч", completed: false, type: "study", deadline: "18:00" },
      { id: "2", title: "Проверить свой GPA", duration: "30мин", completed: false, type: "document", deadline: "19:00" },
      { id: "3", title: "Встреча с консультантом", duration: "30мин", completed: false, type: "call", deadline: "20:00" },
    ]
  },
  {
    day: "Вторник",
    date: "Завтра",
    focus: "Подготовка документов",
    tasks: [
      { id: "4", title: "Подготовить паспорт (перевод)", duration: "1ч", completed: false, type: "document", deadline: "17:00" },
      { id: "5", title: "Заказать справку из школы", duration: "30мин", completed: false, type: "document", deadline: "18:00" },
      { id: "6", title: "IELTS Listening practice", duration: "1ч", completed: false, type: "ielts", courseLink: "https://www.khanacademy.org", deadline: "20:00" },
    ]
  },
  {
    day: "Среда",
    date: "Послезавтра",
    focus: "IELTS подготовка",
    tasks: [
      { id: "7", title: "IELTS Reading practice", duration: "1.5ч", completed: false, type: "ielts", courseLink: "https://www.khanacademy.org", deadline: "16:00" },
      { id: "8", title: "Грамматика: Present Perfect", duration: "1ч", completed: false, type: "ielts", courseLink: "https://www.khanacademy.org/grammar", deadline: "18:00" },
      { id: "9", title: "Встреча с консультантом", duration: "30мин", completed: false, type: "call", deadline: "19:00" },
    ]
  },
  {
    day: "Четверг",
    date: "Через 3 дня",
    focus: "Мотивационное письмо",
    tasks: [
      { id: "10", title: "Написать draft эссе", duration: "2ч", completed: false, type: "document", deadline: "17:00" },
      { id: "11", title: "Проверить структуру", duration: "1ч", completed: false, type: "study", deadline: "19:00" },
      { id: "12", title: "IELTS Writing practice", duration: "1ч", completed: false, type: "ielts", courseLink: "https://ieltsliz.com", deadline: "21:00" },
    ]
  },
  {
    day: "Пятница",
    date: "Через 4 дня",
    focus: "Практика собеседования",
    tasks: [
      { id: "13", title: "IELTS Speaking practice", duration: "1ч", completed: false, type: "ielts", courseLink: "https://www.youtube.com/ielts", deadline: "16:00" },
      { id: "14", title: "Подготовить вопросы к консультанту", duration: "30мин", completed: false, type: "study", deadline: "18:00" },
      { id: "15", title: "Встреча с консультантом", duration: "30мин", completed: false, type: "call", deadline: "19:00" },
    ]
  },
  {
    day: "Суббота",
    date: "Через 5 дней",
    focus: "Ревью недели",
    tasks: [
      { id: "16", title: "Проверить что сделано", duration: "1ч", completed: false, type: "study", deadline: "12:00" },
      { id: "17", title: "Заполнить пробелы", duration: "2ч", completed: false, type: "study", deadline: "15:00" },
      { id: "18", title: "План на следующую неделю", duration: "1ч", completed: false, type: "study", deadline: "17:00" },
    ]
  },
  {
    day: "Воскресенье",
    date: "Через 6 дней",
    focus: "Отдых и мотивация",
    tasks: [
      { id: "19", title: "Посмотреть видео о студентах", duration: "1ч", completed: false, type: "study", deadline: "Любое время" },
      { id: "20", title: "Прочитать про университет", duration: "30мин", completed: false, type: "study", deadline: "Любое время" },
    ]
  },
];

const FREE_COURSES = [
  { name: "Khan Academy", subject: "Математика", url: "https://www.khanacademy.org/math", icon: "📐" },
  { name: "Khan Academy", subject: "Грамматика", url: "https://www.khanacademy.org/humanities/grammar" },
  { name: "IELTS Liz", subject: "IELTS Tips", url: "https://ieltsliz.com" },
  { name: "British Council", subject: "IELTS Practice", url: "https://www.britishcouncil.org/exam/ielts", icon: "🇬🇧" },
  { name: "Coursera", subject: "Academic Writing", url: "https://www.coursera.org", icon: "✍️" },
  { name: "Duolingo", subject: "Английский", url: "https://www.duolingo.com", icon: "🦉" },
];

const TARGET_UNIVERSITIES = [
  { name: "MIT", deadline: "15 Декабря", progress: 30, country: "США" },
  { name: "ETH Zurich", deadline: "15 Января", progress: 45, country: "Швейцария" },
  { name: "TU Munich", deadline: "31 Мая", progress: 20, country: "Германия" },
];

const BasicPlanPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useMemo(() => getUser(), []);
  
  const [weeklyPlan, setWeeklyPlan] = useState(WEEKLY_PLAN);
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeTab, setActiveTab] = useState<"plan" | "courses" | "universities" | "report" | "consultant">("plan");
  const [selectedUniversity, setSelectedUniversity] = useState<typeof TARGET_UNIVERSITIES[0] | null>(null);
  const [showUniversityModal, setShowUniversityModal] = useState(false);

  const toggleTask = (dayIndex: number, taskId: string) => {
    setWeeklyPlan(prev => prev.map((day, idx) => {
      if (idx !== dayIndex) return day;
      return {
        ...day,
        tasks: day.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      };
    }));

    toast({
      title: "Задача обновлена",
      description: "Продолжайте в том же духе!",
    });
  };

  const completedTasks = weeklyPlan.flatMap(d => d.tasks).filter(t => t.completed).length;
  const totalTasks = weeklyPlan.flatMap(d => d.tasks).length;
  const weekProgress = Math.round((completedTasks / totalTasks) * 100);

  const currentDay = weeklyPlan[selectedDay];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Назад в кабинет
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                      Мой план поступления
                    </h1>
                    <p className="text-muted-foreground">
                      {user?.name}, {user?.profile?.userType === "school" ? "школьник" : user?.profile?.userType === "graduate" ? "выпускник" : "студент"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{weekProgress}%</p>
                  <p className="text-xs text-muted-foreground">неделя выполнена</p>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                    <circle 
                      cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--primary))" strokeWidth="4"
                      strokeDasharray={`${weekProgress * 1.76} 176`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6">
            {(
              [
                { id: "plan", label: "План на неделю", icon: Calendar },
                { id: "courses", label: "Курсы", icon: BookOpen },
                { id: "universities", label: "Цели", icon: GraduationCap },
                { id: "report", label: "Отчёт", icon: FileText },
                { id: "consultant", label: "Консультант", icon: MessageCircle },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Plan Tab */}
          {activeTab === "plan" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Day Selection */}
              <div className="lg:col-span-1 space-y-2">
                <p className="text-sm font-medium text-muted-foreground mb-3">Выберите день:</p>
                {weeklyPlan.map((day, idx) => {
                  const dayProgress = Math.round((day.tasks.filter(t => t.completed).length / day.tasks.length) * 100);
                  const isToday = idx === 0;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDay(idx)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        selectedDay === idx
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{day.day}</span>
                        {isToday && (
                          <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                            Сегодня
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{day.focus}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${dayProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{dayProgress}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tasks for Selected Day */}
              <div className="lg:col-span-2">
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{currentDay.day}</h3>
                      <p className="text-sm text-muted-foreground">{currentDay.focus}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{currentDay.date}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentDay.tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border transition-all ${
                          task.completed 
                            ? "bg-muted/50 border-muted" 
                            : "bg-card border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(selectedDay, task.id)}
                            className="mt-0.5"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
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
                                <span className="flex items-center gap-1 text-accent">
                                  <Video className="w-3 h-3" /> Видеозвонок
                                </span>
                              )}
                            </div>

                            {task.courseLink && !task.completed && (
                              <a
                                href={task.courseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Бесплатный курс
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Video Call Banner */}
                  {currentDay.tasks.some(t => t.type === "call" && !t.completed) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Video className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Встреча с консультантом сегодня</p>
                          <p className="text-sm text-muted-foreground">30 минут — разбор вашего плана</p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => navigate("/tracking?calendar=1")}
                        >
                          Записаться на встречу
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {FREE_COURSES.map((course, idx) => (
                <a
                  key={idx}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{course.icon}</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{course.subject}</h3>
                  <p className="text-sm text-muted-foreground">{course.name}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full font-medium">
                      Бесплатно
                    </span>
                  </div>
                </a>
              ))}
            </motion.div>
          )}

          {/* Universities Tab */}
          {activeTab === "universities" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                <h3 className="font-heading font-semibold text-lg mb-2">Ваши целевые университеты</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Мы рассчитали ваши шансы на поступление. Каждый день делайте один шаг к цели!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TARGET_UNIVERSITIES.map((uni, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/50 transition-all"
                      onClick={() => {
                        setSelectedUniversity(uni);
                        setShowUniversityModal(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">{uni.name}</h4>
                        <span className="text-xs text-muted-foreground">{uni.country}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Готовность</span>
                            <span className="text-foreground">{uni.progress}%</span>
                          </div>
                          <Progress value={uni.progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <AlertCircle className="w-3 h-3 text-accent" />
                          <span className="text-muted-foreground">Дедлайн: {uni.deadline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Ежедневная цель</p>
                    <p className="text-sm text-muted-foreground">
                      Сделайте сегодня минимум 2 задачи из плана — и вы на шаг ближе к {TARGET_UNIVERSITIES[0].name}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Report Tab */}
          {activeTab === "report" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="font-heading font-semibold text-lg mb-6">Итоги недели</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-primary/5 text-center">
                    <p className="text-3xl font-bold text-primary">{completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Задач выполнено</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/5 text-center">
                    <p className="text-3xl font-bold text-accent">{totalTasks - completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Осталось</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/5 text-center">
                    <p className="text-3xl font-bold text-green-600">{Math.round(completedTasks * 1.5)}ч</p>
                    <p className="text-xs text-muted-foreground">Потрачено</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/5 text-center">
                    <p className="text-3xl font-bold text-amber-600">3</p>
                    <p className="text-xs text-muted-foreground">Встреч с экспертом</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-medium text-foreground mb-2">Рекомендации на следующую неделю:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5" />
                      Уделите больше времени IELTS Writing — это слабое место
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5" />
                      Закончите мотивационное письмо до пятницы
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5" />
                      Запишитесь на пробный IELTS тест
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "consultant" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="font-heading font-semibold text-lg">Советы консультанта</h3>
                <p className="text-sm text-muted-foreground mt-1">Обновления по документам и следующий шаг</p>

                <div className="mt-4 space-y-3">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="text-sm font-medium text-foreground">Статус документов</p>
                    <p className="text-xs text-muted-foreground mt-1">Вы уже отправили документы — эксперт проверяет и даст фидбек.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium text-foreground">Что сделать сегодня</p>
                    <p className="text-xs text-muted-foreground mt-1">Сделайте 2 задачи из плана и подготовьте вопросы к встрече.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="font-heading font-semibold text-lg">Чат с консультантом</h3>
                <p className="text-sm text-muted-foreground mt-1">AI-агент + эксперт (внутри Dashboard)</p>

                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Открыть консультанта</p>
                      <p className="text-xs text-muted-foreground">Нажмите кнопку «Консультант» на экране или откройте из Dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

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
                  <div className="text-3xl font-bold text-primary">{selectedUniversity.progress}%</div>
                  <div className="text-xs text-muted-foreground">Готовность</div>
                </div>
                <div className="flex-1">
                  <Progress value={selectedUniversity.progress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedUniversity.progress >= 80 ? "Отличная готовность!" : 
                     selectedUniversity.progress >= 60 ? "Хорошая готовность" : 
                     "Нужно больше подготовиться"}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              {/* Deadline */}
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Дедлайн подачи документов</p>
                    <p className="text-lg font-bold text-red-600">{selectedUniversity.deadline}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {calculateDaysRemaining(selectedUniversity.deadline)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Требования и готовность
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Академическая готовность</span>
                    <span className="text-sm font-medium">{selectedUniversity.progress}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Страна</span>
                    <span className="text-sm font-medium">{selectedUniversity.country}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Статус готовности</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      selectedUniversity.progress >= 80 
                        ? "bg-green-100 text-green-700" 
                        : selectedUniversity.progress >= 60
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedUniversity.progress >= 80 ? "Высокая" : 
                       selectedUniversity.progress >= 60 ? "Средняя" : "Низкая"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
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
            </div>
          </motion.div>
        </div>
      )}

      <Footer />

      {user && (
        <ConsultantInvitation
          userType={(user.profile.userType || "school") as "school" | "graduate" | "student"}
          userName={user.name}
          dream={user.profile.dream}
          recommendations={[]}
          universities={[]}
          hasFreeCall={false}
          userPlan={user.plan}
        />
      )}
    </div>
  );
};

export default BasicPlanPage;
