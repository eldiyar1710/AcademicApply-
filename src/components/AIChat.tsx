import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, X, Sparkles, User, HelpCircle, 
  GraduationCap, FileText, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AIChatProps {
  userName: string;
  userType: "school" | "graduate" | "student";
  onRequestHumanConsultant: () => void;
  hasUsedFreeCall: boolean;
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

const AIChat = ({ userName, userType, onRequestHumanConsultant, hasUsedFreeCall }: AIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickQuestions = [
    "Какие документы нужны для поступления?",
    "Как подготовиться к IELTS?",
    "Какие университеты подходят мне?",
    "Что такое GPA и как его считать?",
    "Как получить грант?",
  ];

  const userTypeLabel = {
    school: "школьник",
    graduate: "выпускник",
    student: "студент"
  };

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: "1",
        sender: "ai",
        text: `Привет, ${userName}! 👋\n\nЯ AI-ассистент AcademicApply. Я помогу ответить на базовые вопросы о поступлении.\n\nКак ${userTypeLabel[userType]}, вас интересует конкретный вопрос?`,
        timestamp: new Date(),
        suggestions: quickQuestions.slice(0, 3),
      };
      setMessages([greeting]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAIResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes("документ") || lowerQ.includes("документы")) {
      return `**Основные документы для поступления:**

1. **Паспорт** (перевод + нотариус)
2. **Аттестат/диплом** с приложением
3. **IELTS/TOEFL** (если требуется)
4. **Мотивационное письмо**
5. **Рекомендательные письма** (2-3 шт)
6. **CV/резюме**

**Совет:** Начните готовить документы за 3-6 месяцев до дедлайна.

❓ Нужна помощь с конкретным документом? Могу подключить консультанта.`;
    }
    
    if (lowerQ.includes("ielts") || lowerQ.includes("английский")) {
      return `**Подготовка к IELTS:**

**Бесплатные ресурсы:**
• Khan Academy — грамматика
• IELTS Liz — speaking/writing
• British Council — тесты

**План подготовки:**
1. **Неделя 1-2:** Диагностика + грамматика
2. **Неделя 3-4:** Listening + Reading практика
3. **Неделя 5-6:** Writing (эссе)
4. **Неделя 7-8:** Speaking (разговорная практика)

Нужен индивидуальный план? Консультант поможет составить!`;
    }
    
    if (lowerQ.includes("университет") || lowerQ.includes("вуз")) {
      return `**Как выбрать университет:**

**Факторы для ${userTypeLabel[userType]}:**
• Рейтинг вуза (QS/THE)
• Стоимость обучения
• Стипендии и гранты
• Локация и стоимость жизни
• Требования к GPA/IELTS

**Рекомендация:** Найдите 5-10 вузов:
- 2 "мечты" (топовые)
- 3-4 "реалистичных"
- 2 "страховочных"

**Пройдите тест в AcademicApply** — мы подберем вузы под ваш профиль!`;
    }
    
    if (lowerQ.includes("gpa")) {
      return `**GPA (Grade Point Average)**

**Как считать:**
Оценки переводятся в баллы:
• 5 (отлично) = 4.0
• 4 (хорошо) = 3.0
• 3 (удовл) = 2.0

**Формула:** Сумма баллов ÷ Количество предметов

**Пример:** (4+5+4+3+5) ÷ 5 = 21 ÷ 5 = **4.2 GPA**

Для поступления в топ-вузы нужен GPA **3.5+**

Нужно пересчитать ваш GPA?`;
    }
    
    if (lowerQ.includes("грант") || lowerQ.includes("стипендия")) {
      return `**Гранты и стипендии:**

**Для ${userTypeLabel[userType]}:**
• **Erasmus+** — Европа, обмен
• **Fulbright** — США
• **Chevening** — Великобритания
• **DAAD** — Германия
• **Гранты правительства** — Катар, ОАЭ, Сингапур

**Требования обычно:**
• GPA 3.5+
• IELTS 6.5+
• Мотивационное письмо
• Рекомендации

**Хотите узнать шансы на грант?**
Консультант проанализирует ваш профиль!`;
    }

    return `**Интересный вопрос!**

Я могу ответить на базовые вопросы о:
• Документах для поступления
• Подготовке к IELTS
• Выборе университета
• GPA и оценках
• Грантах и стипендиях

Для **индивидуальной консультации** с разбором вашего случая рекомендую ${hasUsedFreeCall ? "обновить тариф" : "записаться на бесплатный звонок"} с консультантом.

Что именно вас интересует?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowQuickQuestions(false);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: generateAIResponse(input),
        timestamp: new Date(),
        suggestions: ["Задать ещё вопрос", "Поговорить с консультантом"],
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Bot className="w-5 h-5" />
        <span className="text-sm font-medium">AI Помощник</span>
        <Sparkles className="w-4 h-4" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 100 }}
              className="w-full max-w-md h-[80vh] sm:h-[600px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">AI Ассистент</p>
                    <p className="text-xs text-muted-foreground">Базовые вопросы — бесплатно</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                      
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (suggestion.includes("консультант")) {
                                  onRequestHumanConsultant();
                                  setIsOpen(false);
                                } else {
                                  handleQuickQuestion(suggestion);
                                }
                              }}
                              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                                suggestion.includes("консультант")
                                  ? "bg-accent text-accent-foreground hover:bg-accent/80"
                                  : "bg-background/50 hover:bg-background text-foreground"
                              }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted p-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-muted-foreground">Печатает...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {showQuickQuestions && messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-muted-foreground mb-2">Быстрые вопросы:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-foreground transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Human Consultant CTA */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {hasUsedFreeCall ? "Нужна личная консультация?" : "1 бесплатный звонок доступен"}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      onRequestHumanConsultant();
                      setIsOpen(false);
                    }}
                  >
                    {hasUsedFreeCall ? "Апгрейд" : "Бесплатный звонок"}
                  </Button>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Задайте вопрос..."
                    className="flex-1 px-4 py-2 bg-muted rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button size="icon" className="rounded-full" onClick={handleSend} disabled={!input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
