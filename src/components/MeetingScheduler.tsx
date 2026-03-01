import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Globe, X, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MeetingSchedulerProps {
  onBook: (time: string, language: string) => void;
  onClose: () => void;
}

const languages = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "kz", name: "Қазақша", flag: "🇰🇿" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour <= 17; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour !== 17) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

const MeetingScheduler = ({ onBook, onClose }: MeetingSchedulerProps) => {
  const [step, setStep] = useState<"time" | "language" | "waiting">("time");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ru");
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const { toast } = useToast();

  const timeSlots = generateTimeSlots();
  
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      day: date.toLocaleDateString("ru-RU", { day: "numeric" }),
      month: date.toLocaleDateString("ru-RU", { month: "short" }),
      weekday: date.toLocaleDateString("ru-RU", { weekday: "short" }),
      fullDate: date.toISOString().split("T")[0],
    };
  });

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (!selectedTime) {
      toast({
        title: "Выберите время",
        description: "Пожалуйста, выберите удобное время для встречи",
        variant: "destructive",
      });
      return;
    }
    setStep("language");
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleBook = () => {
    if (!selectedTime) return;
    
    const langName = languages.find(l => l.code === selectedLanguage)?.name || "Русский";
    const selectedDateObj = dates[selectedDate];
    const meetingTime = `${selectedDateObj.fullDate}T${selectedTime}`;
    
    toast({
      title: "Запрос отправлен!",
      description: `Ожидайте подтверждение встречи на ${selectedDateObj.day} ${selectedDateObj.month} в ${selectedTime}`,
    });

    // Show waiting state
    setStep("waiting");
    
    // After 2 seconds (simulating 2 minutes), confirm booking
    setTimeout(() => {
      onBook(meetingTime, selectedLanguage);
    }, 2000);
  };

  const selectedLang = languages.find(l => l.code === selectedLanguage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === "language" && (
              <button 
                onClick={() => setStep("time")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h3 className="font-heading font-semibold">
              {step === "time" && "Выберите время"}
              {step === "language" && "Язык консультации"}
              {step === "waiting" && "Ожидание..."}
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === "time" && (
            <div className="space-y-4">
              {/* Date Selection */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {dates.map((date, idx) => (
                  <button
                    key={date.fullDate}
                    onClick={() => setSelectedDate(idx)}
                    className={`flex-shrink-0 p-3 rounded-xl border transition-all ${
                      selectedDate === idx
                        ? "border-primary bg-primary/10"
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
              <div>
                <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Доступное время (10:00 - 17:00)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-accent/10 border border-accent/20"
                >
                  <p className="text-sm text-foreground">
                    Вы выбрали: <strong>{dates[selectedDate].day} {dates[selectedDate].month}, {selectedTime}</strong>
                  </p>
                </motion.div>
              )}

              <Button className="w-full" onClick={handleNext} disabled={!selectedTime}>
                Далее
              </Button>
            </div>
          )}

          {step === "language" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Выберите язык, на котором будет проходить консультация
              </p>

              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
                      selectedLanguage === lang.code
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{lang.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lang.code === "ru" && "Консультация на русском языке"}
                        {lang.code === "kz" && "Қазақ тілінде кеңес"}
                        {lang.code === "en" && "Consultation in English"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm font-medium text-foreground mb-1">Итоговая встреча:</p>
                <p className="text-sm text-muted-foreground">
                  {dates[selectedDate].day} {dates[selectedDate].month} в {selectedTime}
                </p>
                <p className="text-sm text-muted-foreground">
                  Язык: {selectedLang?.flag} {selectedLang?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Длительность: 30 минут
                </p>
              </div>

              <Button className="w-full" onClick={handleBook}>
                Подтвердить встречу
              </Button>
            </div>
          )}

          {step === "waiting" && (
            <div className="text-center py-8 space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto"
              />
              <p className="text-lg font-medium text-foreground">Подтверждаем встречу...</p>
              <p className="text-sm text-muted-foreground">
                Связываемся с консультантом и проверяем доступность
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <span>Ожидайте</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MeetingScheduler;
