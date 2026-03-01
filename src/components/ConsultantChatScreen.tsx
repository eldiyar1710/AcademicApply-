import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Send, Bot, User, Clock, Calendar, 
  FileText, GraduationCap, Globe, CheckCircle2,
  MessageCircle, Video, Phone, Target, TrendingUp,
  Award, BookOpen, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getUser } from "@/lib/auth";

interface Message {
  id: string;
  text: string;
  sender: "user" | "consultant" | "bot";
  timestamp: Date;
  language: "ru" | "kz" | "en";
}

interface UserProfile {
  name: string;
  type: "school" | "graduate" | "student";
  dream?: string;
  gpa?: string;
  ielts?: string;
  plan: "free" | "basic" | "expert";
  targetUniversities?: Array<{
    name: string;
    progress: number;
    deadline: string;
    chance: string;
  }>;
  stats?: {
    gpa?: string;
    ielts?: string;
    readiness: number;
    streak: number;
  };
  documents?: Array<{
    name: string;
    status: "ready" | "in_progress" | "missing";
  }>;
  meetings?: Array<{
    date: string;
    time: string;
    type: string;
  }>;
}

interface AutoResponse {
  keywords: string[];
  response: { ru: string; kz: string; en: string };
  isBasic: boolean;
}

const AUTO_RESPONSES: AutoResponse[] = [
  {
    keywords: ["привет", "здравствуйте", "салам", "hello", "hi"],
    response: {
      ru: "Здравствуйте! Я ваш персональный консультант по поступлению. Чем могу помочь?",
      kz: "Сәлем! Сіздің жоғары оқу орнына түсу жөніндегі жеке кеңесшіңізмін. Қалай көмектесе аламын?",
      en: "Hello! I'm your personal admissions consultant. How can I help you?"
    },
    isBasic: true
  },
  {
    keywords: ["университет", "поступление", "оқу орны", "university", "admission"],
    response: {
      ru: "Я помогу подобрать идеальный университет! Расскажите о ваших целях: какая страна, специальность, бюджет?",
      kz: "Керемет университет таңдауға көмектесемін! Мақсаттарыңыз туралы айтыңыз: қай ел, мамандық, бюджет?",
      en: "I'll help you find the perfect university! Tell me about your goals: which country, major, budget?"
    },
    isBasic: true
  },
  {
    keywords: ["эссе", "мотивационное письмо", "essay", "motivation letter"],
    response: {
      ru: "Помогу с написанием эссе! Сначала определим структуру и ключевые моменты. Какой университет?",
      kz: "Эссе жазуға көмектесемін! Алдымен құрылымын және негізгі сәттерін анықтаймыз. Қай университет?",
      en: "I'll help with essay writing! First, let's determine the structure and key points. Which university?"
    },
    isBasic: true
  },
  {
    keywords: ["дедлайн", "сроки", "мерзім", "deadline", "timeline"],
    response: {
      ru: "Дедлайны очень важны! Давайте составим план подачи документов. Какие университеты рассматриваете?",
      kz: "Мерзімдер өте маңызды! Құжаттар тапсыру жоспарын құрайық. Қай университеттерді қарастырып жатырсыз?",
      en: "Deadlines are crucial! Let's create an application timeline. Which universities are you considering?"
    },
    isBasic: true
  },
  {
    keywords: ["грант", "стипендия", "грант", "scholarship", "grant"],
    response: {
      ru: "Гранты - отличная возможность! Помогу найти подходящие варианты. Ваша академическая успеваемость?",
      kz: "Гранттар - тамаша мүмкіндік! Сәйкес нұсқаларды табуға көмектесемін. Сіздің академиялық жетістіктеріңіз қандай?",
      en: "Grants are a great opportunity! I'll help find suitable options. What's your academic performance?"
    },
    isBasic: true
  },
  {
    keywords: ["ielts", "toefl", "английский", "english"],
    response: {
      ru: "IELTS/TOEFL обязательны для зарубежных вузов. Целевой балл зависит от университета. Какой уровень сейчас?",
      kz: "IELTS/TOEFL шетел жоғары оқу орындары үшін міндетті. Мақсаттық балл университетке байланысты. Қазіргі деңгейіңіз қандай?",
      en: "IELTS/TOEFL are required for foreign universities. Target score depends on the university. What's your current level?"
    },
    isBasic: true
  }
];

const ConsultantChatScreen = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Здравствуйте! Я ваш персональный консультант по поступлению в зарубежные вузы. Готов помочь с выбором университета, подготовкой документов и написанием эссе. С чего начнём?",
      sender: "consultant",
      timestamp: new Date(),
      language: "ru"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"ru" | "kz" | "en">("ru");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Получаем реальные данные пользователя
  const user = getUser();
  
  // Формируем профиль пользователя на основе реальных данных
  const userProfile: UserProfile = {
    name: user?.name || "Пользователь",
    type: user?.profile?.userType || "school",
    dream: user?.profile?.dream || "Поступить в лучший университет",
    gpa: user?.profile?.gpa,
    ielts: user?.profile?.ielts,
    plan: user?.plan || "free",
    targetUniversities: [
      { name: "MIT", progress: 73, deadline: "15 Декабря", chance: "Высокие" },
      { name: "Stanford", progress: 68, deadline: "1 Декабря", chance: "Средние" },
      { name: "ETH Zurich", progress: 81, deadline: "15 Января", chance: "Высокие" }
    ],
    stats: {
      gpa: user?.profile?.gpa || "0",
      ielts: user?.profile?.ielts || "0",
      readiness: 87,
      streak: 12
    },
    documents: [
      { name: "Мотивационное письмо", status: "in_progress" },
      { name: "Рекомендательные письма", status: "ready" },
      { name: "Аттестат с переводом", status: "ready" },
      { name: "IELTS сертификат", status: user?.profile?.ielts ? "ready" : "missing" },
      { name: "Портфолио", status: "missing" }
    ],
    meetings: [
      { date: "Сегодня", time: "14:00", type: "Проверка документов" },
      { date: "Завтра", time: "16:00", type: "Подготовка к собеседованию" },
      { date: "25 Ноября", time: "15:00", type: "Пробное собеседование" }
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Отладка: выводим сообщения в консоль
  useEffect(() => {
    console.log("Messages in chat:", messages);
    console.log("User profile:", userProfile);
  }, [messages, userProfile]);

  const checkAutoResponse = (text: string): AutoResponse | null => {
    const lowerText = text.toLowerCase();
    
    for (const response of AUTO_RESPONSES) {
      if (response.keywords.some(keyword => lowerText.includes(keyword))) {
        return response;
      }
    }
    return null;
  };

  const generateConsultantResponse = (userMessage: string, language: "ru" | "kz" | "en"): string => {
    const responses = {
      ru: [
        "Отличный вопрос! Давайте разберем это подробно. Сначала нужно определить ваши приоритеты.",
        "Понимаю вашу ситуацию. Многие студенты сталкиваются с этим. Вот что я рекомендую...",
        "Это важный аспект поступления. Помогу вам разработать стратегию.",
        "Хорошо, что вы об этом задумались. Давайте составим пошаговый план."
      ],
      kz: [
        "Тамаша сұрақ! Бұны толықтай талқылайық. Алдымен сіздің приоритеттеріңізді анықтау керек.",
        "Жағдайыңызды түсінемін. Көптеген студенттер осымен кездеседі. Мен не ұсынамын...",
        "Бұл жоғары оқу орнына түсудің маңызды аспектісі. Стратегия әзірлеуге көмектесемін.",
        "Осы туралы ойланғаныңыз жақсы. Қадамдық жоспар құрайық."
      ],
      en: [
        "Great question! Let's analyze this in detail. First, we need to determine your priorities.",
        "I understand your situation. Many students face this. Here's what I recommend...",
        "This is an important aspect of admission. I'll help you develop a strategy.",
        "It's good that you're thinking about this. Let's create a step-by-step plan."
      ]
    };

    return responses[language][Math.floor(Math.random() * responses[language].length)];
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Check for auto-response
    setTimeout(() => {
      const autoResponse = checkAutoResponse(inputText);
      
      let responseText: string;
      let sender: "bot" | "consultant";
      
      if (autoResponse && autoResponse.isBasic) {
        responseText = autoResponse.response[selectedLanguage];
        sender = "bot";
      } else {
        responseText = generateConsultantResponse(inputText, selectedLanguage);
        sender = "consultant";
      }

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderIcon = (sender: "user" | "consultant" | "bot") => {
    switch (sender) {
      case "user":
        return <User className="w-4 h-4" />;
      case "consultant":
        return <MessageCircle className="w-4 h-4" />;
      case "bot":
        return <Bot className="w-4 h-4" />;
    }
  };

  const getSenderName = (sender: "user" | "consultant" | "bot") => {
    switch (sender) {
      case "user":
        return "Вы";
      case "consultant":
        return "Консультант";
      case "bot":
        return "AI Ассистент";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Боковая панель с информацией о пользователе */}
      <div className="w-80 border-r border-border bg-card overflow-y-auto">
        {/* Header с информацией о пользователе */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{userProfile.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {userProfile.type === "school" ? "Школьник" : userProfile.type === "graduate" ? "Выпускник" : "Студент"}
              </Badge>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-white border border-amber-200">
            <p className="text-xs text-muted-foreground mb-1">Цель:</p>
            <p className="text-sm font-medium text-foreground">{userProfile.dream}</p>
          </div>
        </div>

        {/* Статистика */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Статистика
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-primary/5 text-center">
              <p className="text-lg font-bold text-primary">{userProfile.stats?.gpa || "-"}</p>
              <p className="text-xs text-muted-foreground">GPA</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/5 text-center">
              <p className="text-lg font-bold text-accent">{userProfile.stats?.ielts || "-"}</p>
              <p className="text-xs text-muted-foreground">IELTS</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/5 text-center">
              <p className="text-lg font-bold text-green-600">{userProfile.stats.readiness}%</p>
              <p className="text-xs text-muted-foreground">Готовность</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/5 text-center">
              <p className="text-lg font-bold text-amber-600">{userProfile.stats.streak}</p>
              <p className="text-xs text-muted-foreground">Дней подряд</p>
            </div>
          </div>
        </div>

        {/* Целевые университеты */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Целевые вузы
          </h4>
          <div className="space-y-2">
            {userProfile.targetUniversities.map((uni, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{uni.name}</span>
                  <Badge variant={uni.chance === "Высокие" ? "default" : "secondary"} className="text-xs">
                    {uni.chance}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="font-medium">{uni.progress}%</span>
                  </div>
                  <Progress value={uni.progress} className="h-1" />
                  <p className="text-xs text-muted-foreground">Дедлайн: {uni.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Документы */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Документы
          </h4>
          <div className="space-y-2">
            {userProfile.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                <span className="text-sm">{doc.name}</span>
                <Badge 
                  variant={
                    doc.status === "ready" ? "default" : 
                    doc.status === "in_progress" ? "secondary" : "destructive"
                  }
                  className="text-xs"
                >
                  {doc.status === "ready" ? "Готов" : 
                   doc.status === "in_progress" ? "В процессе" : "Отсутствует"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Встречи */}
        <div className="p-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Встречи
          </h4>
          <div className="space-y-2">
            {userProfile.meetings.map((meeting, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{meeting.type}</span>
                  <Badge variant="outline" className="text-xs">
                    {meeting.date}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {meeting.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Основная часть чата */}
      <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Чат с консультантом</h2>
                <p className="text-xs text-muted-foreground">Персональная поддержка поступления</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => toast({ title: "Видеозвонок", description: "Запрос отправлен консультанту" })}
            >
              <Video className="w-4 h-4" />
              Видеозвонок
            </Button>
            
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as "ru" | "kz" | "en")}
              className="px-3 py-1 text-sm border border-border rounded-lg bg-card"
            >
              <option value="ru">🇷🇺 RU</option>
              <option value="kz">🇰🇿 KZ</option>
              <option value="en">🇬🇧 EN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : message.sender === "consultant"
                      ? "bg-gradient-to-br from-amber-400 to-yellow-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {getSenderIcon(message.sender)}
                  </div>
                  
                  <div className={`space-y-1 ${message.sender === "user" ? "text-right" : ""}`}>
                    <div className={`text-xs text-muted-foreground px-1`}>
                      {getSenderName(message.sender)} • {formatTime(message.timestamp)}
                    </div>
                    
                    <Card className={`p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.sender === "bot"
                        ? "bg-muted/50 border-muted"
                        : "bg-card"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </Card>
                    
                    {message.sender === "bot" && (
                      <Badge variant="secondary" className="text-xs">
                        <Bot className="w-3 h-3 mr-1" />
                        Автоответ
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <Card className="p-3 bg-muted/50 border-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="max-w-4xl mx-auto mb-3">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputText("Помогите выбрать университет");
                toast({ title: "Вопрос добавлен", description: "Нажмите Отправить" });
              }}
            >
              <GraduationCap className="w-3 h-3 mr-1" />
              Выбор вуза
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputText("Помощь с написанием эссе");
                toast({ title: "Вопрос добавлен", description: "Нажмите Отправить" });
              }}
            >
              <FileText className="w-3 h-3 mr-1" />
              Эссе
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputText("Информация о грантах");
                toast({ title: "Вопрос добавлен", description: "Нажмите Отправить" });
              }}
            >
              Гранты
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputText("Запланировать встречу");
                toast({ title: "Вопрос добавлен", description: "Нажмите Отправить" });
              }}
            >
              <Calendar className="w-3 h-3 mr-1" />
              Встреча
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите ваше сообщение..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!inputText.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ConsultantChatScreen;
