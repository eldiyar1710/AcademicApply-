import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, Clock, Video, Crown, 
  BookOpen, CheckCircle2, AlertCircle, Sparkles,
  ChevronLeft, ChevronRight, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export type UserPlan = "free" | "basic" | "expert";

interface Meeting {
  id: string;
  date: string;
  time: string;
  duration: number;
  type: "consultation" | "study" | "planning";
  topic?: string;
  status: "available" | "booked" | "completed";
}

interface StudyAdvice {
  day: string;
  advice: string;
  subject: string;
  duration: string;
}

interface MeetingCalendarProps {
  plan: UserPlan;
  userName: string;
  userType: "school" | "graduate" | "student";
  onBookMeeting?: (meeting: Meeting) => void;
}

const PLAN_CONFIG = {
  free: {
    name: "Бесплатный",
    maxMeetings: 1,
    meetingDuration: 30,
    period: "一次性",
    features: ["1 бесплатная консультация", "Общие рекомендации"],
  },
  basic: {
    name: "$49 Basic",
    maxMeetings: 3,
    meetingDuration: 30,
    period: "в неделю",
    features: ["3 встречи в неделю", "Календарь с советами", "План подготовки"],
  },
  expert: {
    name: "$490 Expert",
    maxMeetings: 2,
    meetingDuration: 20,
    period: "в день",
    features: ["2 встречи в день по 20 мин", "8-часовой план", "Индивидуальный трекер"],
  },
};

const STUDY_ADVICES: StudyAdvice[] = [
  { day: "Пн", advice: "Изучите требования вузов", subject: "Research", duration: "2ч" },
  { day: "Вт", advice: "Подготовьте документы", subject: "Documents", duration: "3ч" },
  { day: "Ср", advice: "Практикуйте IELTS", subject: "English", duration: "2ч" },
  { day: "Чт", advice: "Работа над мотивационным письмом", subject: "Essay", duration: "2ч" },
  { day: "Пт", advice: "Проверьте GPA", subject: "Academic", duration: "1ч" },
  { day: "Сб", advice: "Ревью недели", subject: "Review", duration: "2ч" },
  { day: "Вс", advice: "Отдых и планирование", subject: "Rest", duration: "—" },
];

const generateTimeSlots = (plan: UserPlan) => {
  const slots: Meeting[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    if (date.getDay() !== 0) { // Skip Sunday for Basic
      const times = plan === "expert" 
        ? ["10:00", "14:00", "16:00", "18:00"]
        : ["10:00", "11:30", "14:00", "15:30", "17:00"];
      
      times.forEach((time) => {
        slots.push({
          id: `${date.toISOString().split('T')[0]}-${time}`,
          date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short' }),
          time,
          duration: PLAN_CONFIG[plan].meetingDuration,
          type: plan === "free" ? "consultation" : plan === "basic" ? "study" : "planning",
          status: "available",
        });
      });
    }
  }
  return slots;
};

export const MeetingCalendar = ({ plan, userName, userType, onBookMeeting }: MeetingCalendarProps) => {
  const [meetings, setMeetings] = useState<Meeting[]>(() => generateTimeSlots(plan));
  const [bookedThisPeriod, setBookedThisPeriod] = useState(0);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"meetings" | "advice" | "plan">("meetings");
  const { toast } = useToast();

  const config = PLAN_CONFIG[plan];
  const remainingMeetings = config.maxMeetings - bookedThisPeriod;

  const dates = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return {
        day: date.toLocaleDateString('ru-RU', { day: 'numeric' }),
        month: date.toLocaleDateString('ru-RU', { month: 'short' }),
        weekday: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        fullDate: date.toISOString().split('T')[0],
      };
    });
  }, []);

  const bookMeeting = (meeting: Meeting) => {
    if (remainingMeetings <= 0) {
      toast({
        title: "Лимит исчерпан",
        description: `Ваш тариф ${config.name} позволяет ${config.maxMeetings} встреч ${config.period}`,
        variant: "destructive",
      });
      return;
    }

    setMeetings(prev => prev.map(m => 
      m.id === meeting.id ? { ...m, status: "booked" } : m
    ));
    setBookedThisPeriod(prev => prev + 1);
    
    toast({
      title: "Встреча забронирована!",
      description: `${meeting.date} в ${meeting.time} (${meeting.duration} мин)`,
    });

    onBookMeeting?.(meeting);
  };

  const currentDate = dates[selectedDate];
  const dayMeetings = meetings.filter(m => m.id.startsWith(currentDate.fullDate));
  const todayAdvice = STUDY_ADVICES[selectedDate % 7];

  // Expert: Generate 8-hour daily plan
  const generateDailyPlan = () => {
    const activities = [
      { time: "09:00", activity: "Анализ программ вузов", duration: "2ч" },
      { time: "11:00", activity: "Подготовка документов", duration: "2ч" },
      { time: "14:00", activity: "Изучение требований визы", duration: "1.5ч" },
      { time: "15:30", activity: "Практика IELTS", duration: "1.5ч" },
      { time: "17:00", activity: "Работа над эссе", duration: "1ч" },
    ];
    return activities;
  };

  if (plan === "free" && bookedThisPeriod >= 1) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
          <h3 className="font-heading font-semibold text-lg">Бесплатная консультация использована</h3>
          <p className="text-sm text-muted-foreground">
            Вы использовали свою бесплатную консультацию. Обновите тариф для продолжения.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline">$49 Basic</Button>
            <Button>$490 Expert</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Plan Info */}
      <div className={`p-4 rounded-xl border ${
        plan === "expert" 
          ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30" 
          : plan === "basic"
          ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
          : "bg-muted/50 border-border"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              plan === "expert" ? "bg-amber-500/20" : "bg-primary/20"
            }`}>
              {plan === "expert" ? (
                <Crown className="w-5 h-5 text-amber-600" />
              ) : plan === "basic" ? (
                <BookOpen className="w-5 h-5 text-primary" />
              ) : (
                <Video className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{config.name}</p>
              <p className="text-xs text-muted-foreground">
                {remainingMeetings} из {config.maxMeetings} встреч {config.period}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{userType}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(bookedThisPeriod / config.maxMeetings) * 100}%` }}
              className={`h-full rounded-full ${
                plan === "expert" ? "bg-amber-500" : "bg-primary"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Tabs for Basic/Expert */}
      {plan !== "free" && (
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab("meetings")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "meetings" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Встречи
          </button>
          {plan === "basic" && (
            <button
              onClick={() => setActiveTab("advice")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === "advice" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Советы
            </button>
          )}
          {plan === "expert" && (
            <button
              onClick={() => setActiveTab("plan")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === "plan" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              План на день
            </button>
          )}
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === "meetings" && (
        <div className="space-y-4">
          {/* Date Selection */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {dates.map((date, idx) => (
              <button
                key={date.fullDate}
                onClick={() => setSelectedDate(idx)}
                className={`flex-shrink-0 p-3 rounded-xl border transition-all ${
                  selectedDate === idx
                    ? plan === "expert" 
                      ? "border-amber-500 bg-amber-500/10" 
                      : "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <p className="text-xs text-muted-foreground uppercase">{date.weekday}</p>
                <p className="text-lg font-bold text-foreground">{date.day}</p>
                <p className="text-xs text-muted-foreground">{date.month}</p>
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Доступное время
              {plan === "expert" && <span className="text-xs text-amber-600">(20 минут)</span>}
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              {dayMeetings.map((meeting) => (
                <button
                  key={meeting.id}
                  disabled={meeting.status !== "available" || remainingMeetings <= 0}
                  onClick={() => bookMeeting(meeting)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    meeting.status === "booked"
                      ? "bg-accent/10 text-accent border border-accent/30"
                      : meeting.status === "completed"
                      ? "bg-muted text-muted-foreground"
                      : remainingMeetings <= 0
                      ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                      : plan === "expert"
                      ? "bg-amber-500/10 hover:bg-amber-500/20 text-foreground border border-amber-500/20"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {meeting.status === "booked" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {meeting.time}
                    </span>
                  ) : remainingMeetings <= 0 ? (
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {meeting.time}
                    </span>
                  ) : (
                    <span className="flex items-center justify-between">
                      {meeting.time}
                      <span className="text-xs opacity-60">{meeting.duration}мин</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Study Advice Tab for Basic */}
      {activeTab === "advice" && plan === "basic" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h4 className="font-medium text-foreground">Совет на {todayAdvice.day}</h4>
          </div>
          <p className="text-sm text-foreground mb-2">{todayAdvice.advice}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-background rounded">{todayAdvice.subject}</span>
            <span>{todayAdvice.duration}</span>
          </div>
          <div className="mt-3 p-3 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Рекомендация: уделите {todayAdvice.duration} изучению {todayAdvice.subject.toLowerCase()}. 
              Это поможет подготовиться к поступлению.
            </p>
          </div>
        </motion.div>
      )}

      {/* Daily 8-Hour Plan for Expert */}
      {activeTab === "plan" && plan === "expert" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600" />
              Индивидуальный план на 8 часов
            </h4>
            <span className="text-xs text-amber-600 font-medium">Premium</span>
          </div>
          
          <div className="space-y-2">
            {generateDailyPlan().map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-amber-500/10"
              >
                <div className="w-14 text-xs font-medium text-amber-600">{item.time}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.activity}</p>
                  <p className="text-xs text-muted-foreground">{item.duration}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 px-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">Уведомления включены</p>
                <p className="text-xs text-muted-foreground">
                  Мы напомним о каждом этапе плана за 15 минут до начала
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MeetingCalendar;
