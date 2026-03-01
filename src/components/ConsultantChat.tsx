import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, FileText, Video, X, Clock, User, Check, 
  Download, Calendar, Mail, ChevronDown, ChevronUp, Bot 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getUser, type User as AppUser } from "@/lib/auth";
import { getFullUserFromFirebase, setupRealtimeSync } from "@/lib/syncService";

interface Message {
  id: string;
  sender: "user" | "consultant" | "system" | "ai";
  text: string;
  timestamp: Date;
  attachments?: { name: string; type: string; url?: string }[];
  suggestions?: string[];
}

interface ConsultantChatProps {
  userName: string;
  userType: "school" | "graduate" | "student";
  dream?: string;
  recommendations?: string[];
  universities?: string[];
  meetingTime: string | null;
  onClose?: () => void;
  onOpenCalendar?: () => void;
}

const ConsultantChat = ({ 
  userName, 
  userType, 
  dream, 
  recommendations = [], 
  universities = [],
  meetingTime,
  onClose,
  onOpenCalendar,
}: ConsultantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(true);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [callMissed, setCallMissed] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const authedUser: AppUser | null = getUser();
  const userId = authedUser?.id;
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [firebaseStats, setFirebaseStats] = useState<any>(null);
  const [firebaseProgress, setFirebaseProgress] = useState<any>(null);

  const storageKey = `aa_consultant_chat_v1:${userName}:${userType}`;

  const quickQuestions = [
    "Какие документы нужны для поступления?",
    "Как подготовиться к IELTS?",
    "Как посчитать GPA?",
    "Как получить грант?",
    "Как успеть к дедлайнам?",
  ];

  const userTypeLabel: Record<ConsultantChatProps["userType"], string> = {
    school: "школьник",
    graduate: "выпускник",
    student: "студент",
  };

  const safeParseStoredMessages = (raw: string | null): Message[] | null => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Array<Omit<Message, "timestamp"> & { timestamp: string }>;
      if (!Array.isArray(parsed)) return null;
      return parsed
        .filter((m) => m && typeof m.id === "string" && typeof m.sender === "string" && typeof m.text === "string")
        .map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
    } catch {
      return null;
    }
  };

  // Generate PDF data summary
  const generatePDFData = () => {
    const mergedProfile = {
      ...(firebaseUser?.profile || {}),
      ...(authedUser?.profile || {}),
    };

    const mergedPlan = firebaseUser?.plan || authedUser?.plan;
    const mergedContact = firebaseUser?.contact || authedUser?.contact;
    const mergedReferralCode = firebaseUser?.referralCode || authedUser?.referralCode;
    const mergedPlanExpiresAt = firebaseUser?.planExpiresAt || authedUser?.planExpiresAt;

    const data = {
      userName,
      userType: userType === "school" ? "Школьник" : userType === "graduate" ? "Выпускник" : "Студент",
      dream: dream || "Не указана",
      contact: mergedContact || "Не указано",
      plan: mergedPlan || "free",
      planExpiresAt: mergedPlanExpiresAt || "",
      referralCode: mergedReferralCode || "",
      gpa: mergedProfile?.gpa || "",
      ielts: mergedProfile?.ielts || "",
      recommendations: recommendations.length > 0 ? recommendations : ["AI-анализ предоставит рекомендации"],
      universities: universities.length > 0 ? universities : ["Университеты ещё не выбраны"],
      meetingTime: meetingTime ? new Date(meetingTime).toLocaleString("ru-RU") : "Не назначено",
      progress: firebaseProgress,
      stats: firebaseStats,
    };
    return data;
  };

  useEffect(() => {
    if (!userId) return;

    let unsub: null | (() => void) = null;

    (async () => {
      const full = await getFullUserFromFirebase(userId);
      setFirebaseUser(full.user);
      setFirebaseStats(full.stats);
      setFirebaseProgress(full.progress);

      unsub = setupRealtimeSync(userId, (update) => {
        if (update.type === "user") setFirebaseUser(update.data);
        if (update.type === "stats") setFirebaseStats(update.data);
        if (update.type === "progress") setFirebaseProgress(update.data);
      });
    })();

    return () => {
      if (unsub) unsub();
    };
  }, [userId]);

  // Initial messages
  useEffect(() => {
    const stored = safeParseStoredMessages(localStorage.getItem(storageKey));
    if (stored && stored.length > 0) {
      setMessages(stored);
      setShowQuickQuestions(false);
      return;
    }

    const pdfData = generatePDFData();
    
    const initialMessages: Message[] = [
      {
        id: "1",
        sender: "system",
        text: "Данные отправлены консультанту",
        timestamp: new Date(),
      },
      {
        id: "2",
        sender: "ai",
        text: `Я AI-агент AcademicApply. Я отвечаю на базовые вопросы по поступлению. Вы можете задать вопрос или выбрать быстрый вариант ниже.`,
        timestamp: new Date(Date.now() + 500),
        suggestions: quickQuestions.slice(0, 3),
      },
      {
        id: "3",
        sender: "consultant",
        text: `Здравствуйте, ${userName}! Я Анна, ваш консультант. Я уже изучила ваш профиль и готова помочь.`,
        timestamp: new Date(Date.now() + 1000),
      },
      {
        id: "4",
        sender: "consultant",
        text: `Я вижу, что вы ${pdfData.userType.toLowerCase()}. ${dream ? `Ваша цель: "${dream}". Отличный выбор!` : "Давайте вместе определим ваш путь."}`,
        timestamp: new Date(Date.now() + 2000),
      },
    ];

    if (universities.length > 0) {
      initialMessages.push({
        id: "5",
        sender: "consultant",
        text: `Я вижу, что вы уже выбрали ${universities.length} университет(ов). Это хороший старт! Давайте обсудим шансы поступления.`,
        timestamp: new Date(Date.now() + 3000),
      });
    }

    if (meetingTime) {
      const meetingDate = new Date(meetingTime);
      initialMessages.push({
        id: "6",
        sender: "system",
        text: `Встреча назначена на ${meetingDate.toLocaleDateString("ru-RU")} в ${meetingDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`,
        timestamp: new Date(Date.now() + 4000),
      });
    }

    setMessages(initialMessages);

    // Simulate video call invitation after 5 seconds
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: "7",
        sender: "consultant",
        text: "📹 Готовы начать видеозвонок? Нажмите кнопку ниже, чтобы подключиться. Или напишите, если хотите перенести встречу.",
        timestamp: new Date(),
      }]);
    }, 5000);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const serializable = messages.map((m) => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    }));
    localStorage.setItem(storageKey, JSON.stringify(serializable));
  }, [messages, storageKey]);

  const formatMeetingLabel = (value: string) => {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    }
    return value;
  };

  const getSmartResponse = (text: string) => {
    const q = text.toLowerCase();

    if (q.includes("ielts") || q.includes("айелт") || q.includes("англ") || q.includes("english")) {
      return "По IELTS я рекомендую: 1) выбрать целевой балл, 2) сделать диагностический тест, 3) фокус на Writing/Speaking. Напишите ваш текущий уровень и дедлайн — составлю план на неделю.";
    }
    if (q.includes("gpa") || q.includes("оцен") || q.includes("средн")) {
      return "По GPA важно: перевести оценки в нужную шкалу, проверить требования программ и подготовить объяснение (если есть просадки). Напишите ваш GPA и страну/вуз — скажу, где вы проходите.";
    }
    if (q.includes("документ") || q.includes("мотивац") || q.includes("эссе") || q.includes("cv") || q.includes("резюме")) {
      return "По документам: начнем с чек-листа (паспорт/перевод, транскрипт, CV, мотивационное письмо, рекомендации). Если пришлёте структуру мотивационного — я скажу что улучшить.";
    }
    if (q.includes("дедлайн") || q.includes("срок") || q.includes("когда") || q.includes("успеть")) {
      return "Чтобы успеть к дедлайнам, нужно разложить задачи по неделям: документы → эссе → тесты → заявки. Напишите 1-2 университета и даты дедлайнов — построю таймлайн.";
    }
    if (q.includes("виза") || q.includes("visa")) {
      return "По визе обычно важно: финансовые документы, письмо о зачислении, страховка и сроки подачи. Напишите страну — дам список требований и порядок шагов.";
    }
    if (q.includes("встреч") || q.includes("календар") || q.includes("запис") || q.includes("слот")) {
      return "Да, встречу можно записать через календарь. Если не видите календарь — зайдите в «Мои заявки» и выберите вкладку «Встречи».";
    }

    return "Поняла. Уточните, пожалуйста: 1) страна/университет, 2) дедлайн, 3) что уже готово (документы/IELTS/эссе). Тогда дам точный следующий шаг.";
  };

  const generateAIResponse = (question: string): { text: string; suggestions?: string[] } => {
    const lowerQ = question.toLowerCase();

    const goalLine = dream ? `Твоя цель: «${dream}».` : "";
    const uniLine = universities.length > 0 ? `У тебя в избранном ${universities.length} университет(ов).` : "";
    const contextLine = [goalLine, uniLine].filter(Boolean).join(" ");

    if (lowerQ.includes("документ")) {
      return {
        text: `Основные документы: паспорт (перевод), аттестат/диплом + транскрипт, IELTS/TOEFL (если нужно), мотивационное письмо, рекомендации, CV.\n\n${contextLine}\n\nНапишите страну + 1-2 университета — составлю точный чек-лист и порядок действий.`,
        suggestions: ["Список документов для США", "Список документов для Европы", "Как написать мотивационное"],
      };
    }

    if (lowerQ.includes("ielts") || lowerQ.includes("айелт") || lowerQ.includes("англий")) {
      return {
        text: `IELTS: начните с диагностики, затем 3-4 раза в неделю: Listening/Reading + 2 раза Writing + 2 раза Speaking.\n\n${contextLine}\n\nНапишите ваш текущий уровень и дедлайн — составлю план на неделю (под ${userTypeLabel[userType]}).`,
        suggestions: ["План на 2 недели", "Как поднять Writing", "Как тренировать Speaking"],
      };
    }

    if (lowerQ.includes("gpa") || lowerQ.includes("оцен") || lowerQ.includes("средн")) {
      return {
        text: `GPA — средний балл. Важно: конвертация зависит от страны/вузов.\n\nНапишите ваши оценки и страну поступления — посчитаю и скажу требования.`,
        suggestions: ["Посчитать мой GPA", "Какие GPA проходят?"],
      };
    }

    if (lowerQ.includes("грант") || lowerQ.includes("стипенд")) {
      return {
        text: `Грант обычно зависит от GPA, английского, эссе и активностей.\n\n${contextLine}\n\nКак ${userTypeLabel[userType]}, вам важно показать достижения и цель. Напишите страну и уровень IELTS/GPA — оценю шансы и что усилить.`,
        suggestions: ["Гранты США", "Гранты Европа", "Как усилить мотивационное"],
      };
    }

    if (lowerQ.includes("дедлайн") || lowerQ.includes("успеть") || lowerQ.includes("срок")) {
      return {
        text: `Чтобы успеть к дедлайнам: документы → эссе → тесты → подача.\n\n${contextLine}\n\nДай 1-2 университета и даты дедлайнов — разложу по неделям и скажу, что сделать сегодня.`,
        suggestions: ["Составить таймлайн", "Что делать в первую очередь"],
      };
    }

    if (lowerQ.includes("встреч") || lowerQ.includes("календар") || lowerQ.includes("запис")) {
      return {
        text: `Встречу можно создать через календарь: выбираешь дату/время и бронируешь слот.\n\nЕсли хочешь — нажми кнопку ниже, я открою календарь прямо сейчас.`,
        suggestions: ["Открыть календарь", "Сколько встреч доступно?"],
      };
    }

    return {
      text: `Я отвечаю на базовые вопросы (документы, IELTS, GPA, гранты, дедлайны).\n\nНапишите: страна/университет + дедлайн — и я дам конкретные шаги.`,
      suggestions: quickQuestions.slice(0, 3),
    };
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setShowQuickQuestions(false);

    setTimeout(() => {
      const ai = generateAIResponse(userMessage.text);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: ai.text,
        timestamp: new Date(),
        suggestions: ai.suggestions,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 800);

    // Simulate consultant response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 2).toString(),
        sender: "consultant",
        text: getSmartResponse(userMessage.text),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
    }, 1600);
  };

  const handleSuggestion = (s: string) => {
    if (s === "Открыть календарь") {
      if (onOpenCalendar) {
        onOpenCalendar();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "system",
            text: "Откройте календарь встреч в разделе «Мои заявки» → «Встречи».",
            timestamp: new Date(),
          },
        ]);
      }
      return;
    }
    setInput(s);
    setTimeout(() => handleSend(), 50);
  };

  const startVideoCall = () => {
    setVideoCallActive(true);
    toast({
      title: "Видеозвонок начинается",
      description: "Подключение к консультанту...",
    });
  };

  const endVideoCall = () => {
    setVideoCallActive(false);
    toast({
      title: "Видеозвонок завершён",
      description: "Спасибо за консультацию!",
    });
  };

  const handleMissedCall = () => {
    setCallMissed(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: "system",
      text: "📧 Уведомление отправлено на почту. Консультант свяжется с вами для переноса встречи.",
      timestamp: new Date(),
    }]);
    
    toast({
      title: "Встреча пропущена",
      description: "Мы отправили email с предложением нового времени",
    });
  };

  const downloadPDF = () => {
    const data = generatePDFData();
    const content = `
КОНСУЛЬТАЦИЯ - ДАННЫЕ КЛИЕНТА
================================

Клиент: ${data.userName}
Тип: ${data.userType}

Контакт: ${data.contact}
Тариф: ${data.plan}${data.planExpiresAt ? ` (до ${new Date(data.planExpiresAt).toLocaleDateString("ru-RU")})` : ""}
${data.referralCode ? `Реферальный код: ${data.referralCode}` : ""}
${data.gpa ? `GPA: ${data.gpa}` : ""}
${data.ielts ? `IELTS: ${data.ielts}` : ""}

ЦЕЛЬ:
${data.dream}

РЕКОМЕНДАЦИИ AI:
${data.recommendations.map(r => `- ${r}`).join('\n')}

ИЗБРАННЫЕ УНИВЕРСИТЕТЫ:
${data.universities.map(u => `- ${u}`).join('\n')}

ВСТРЕЧА:
${data.meetingTime}

СТАТИСТИКА:
${data.stats ? JSON.stringify(data.stats, null, 2) : "Нет данных"}

ПРОГРЕСС:
${data.progress ? JSON.stringify(data.progress, null, 2) : "Нет данных"}

================================
Сгенерировано: ${new Date().toLocaleString('ru-RU')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `консультация_${userName}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "PDF скачан",
      description: "Данные сохранены на устройство",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 w-96 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Анна (Консультант)</p>
              <p className="text-xs text-muted-foreground">Онлайн</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {meetingTime && (
              <div className="flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {formatMeetingLabel(meetingTime)}
              </div>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="ml-2 text-muted-foreground hover:text-foreground"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Call Overlay */}
      {videoCallActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-background/95 z-10 flex flex-col items-center justify-center p-4"
        >
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Video className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Видеозвонок активен</p>
          <p className="text-sm text-muted-foreground mb-6">Разговор с консультантом...</p>
          <Button variant="destructive" onClick={endVideoCall}>
            Завершить звонок
          </Button>
        </motion.div>
      )}

      {/* Profile Summary */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border overflow-hidden"
          >
            <div className="p-4 bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase">Данные клиента</p>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Имя:</span> {userName}</p>
                <p><span className="text-muted-foreground">Тип:</span> {userType === "school" ? "Школьник" : userType === "graduate" ? "Выпускник" : "Студент"}</p>
                {(firebaseUser?.contact || authedUser?.contact) && (
                  <p><span className="text-muted-foreground">Контакт:</span> {firebaseUser?.contact || authedUser?.contact}</p>
                )}
                {(firebaseUser?.plan || authedUser?.plan) && (
                  <p><span className="text-muted-foreground">Тариф:</span> {firebaseUser?.plan || authedUser?.plan}</p>
                )}
                {(firebaseUser?.profile?.gpa || authedUser?.profile?.gpa) && (
                  <p><span className="text-muted-foreground">GPA:</span> {firebaseUser?.profile?.gpa || authedUser?.profile?.gpa}</p>
                )}
                {(firebaseUser?.profile?.ielts || authedUser?.profile?.ielts) && (
                  <p><span className="text-muted-foreground">IELTS:</span> {firebaseUser?.profile?.ielts || authedUser?.profile?.ielts}</p>
                )}
                {dream && <p><span className="text-muted-foreground">Цель:</span> {dream}</p>}
                {universities.length > 0 && (
                  <p><span className="text-muted-foreground">ВУЗы:</span> {universities.length} шт.</p>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2"
                onClick={downloadPDF}
              >
                <Download className="w-4 h-4" />
                Скачать PDF
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showProfile && (
        <button 
          onClick={() => setShowProfile(true)}
          className="w-full p-2 bg-muted/30 border-b border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-xs ml-2">Показать данные</span>
        </button>
      )}

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : msg.sender === "ai"
                  ? "bg-gradient-to-r from-primary/10 to-accent/10 text-foreground border border-primary/15 rounded-bl-md"
                  : msg.sender === "system"
                  ? "bg-accent/10 text-accent border border-accent/20 rounded-md text-center"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              {msg.text}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.suggestions.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSuggestion(s)}
                      className="px-2 py-1 rounded-full text-xs bg-background/70 border border-border hover:bg-background"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {msg.attachments && (
                <div className="mt-2 space-y-1">
                  {msg.attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                      <FileText className="w-4 h-4" />
                      <span>{att.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showQuickQuestions && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.slice(0, 4).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSuggestion(q)}
                className="px-3 py-1.5 rounded-full text-xs bg-muted hover:bg-muted/70 text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video Call Button */}
      {!videoCallActive && !callMissed && (
        <div className="px-4 pb-2">
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={startVideoCall}
          >
            <Video className="w-4 h-4" />
            Начать видеозвонок
          </Button>
        </div>
      )}

      {/* Missed Call Button */}
      {!videoCallActive && !callMissed && meetingTime && new Date(meetingTime) < new Date() && (
        <div className="px-4 pb-2">
          <Button 
            variant="ghost" 
            className="w-full gap-2 text-muted-foreground"
            onClick={handleMissedCall}
          >
            <Mail className="w-4 h-4" />
            Не удалось подключиться — запросить перенос
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Напишите сообщение..."
            className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsultantChat;
