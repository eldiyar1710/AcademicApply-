import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Video, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MeetingSlot {
  id: string;
  date: string;
  time: string;
  duration: string;
  booked: boolean;
}

const generateSlots = (): MeetingSlot[] => {
  const slots: MeetingSlot[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      const times = ["10:00", "14:00", "16:00", "18:00"];
      times.forEach((time, idx) => {
        slots.push({
          id: `${date.toISOString().split('T')[0]}-${time}`,
          date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' }),
          time,
          duration: "45 мин",
          booked: false,
        });
      });
    }
  }
  return slots;
};

const ExpertCalendar = () => {
  const [slots, setSlots] = useState<MeetingSlot[]>(generateSlots());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { toast } = useToast();

  const bookSlot = (slotId: string) => {
    setSlots(slots.map(s => s.id === slotId ? { ...s, booked: true } : s));
    setSelectedSlot(slotId);
    toast({
      title: "Встреча забронирована",
      description: "Мы отправили подтверждение на вашу почту",
    });
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, MeetingSlot[]>);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Ваш эксперт</p>
            <p className="text-xs text-muted-foreground">3 встречи включены в тариф Expert</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          Выберите время встречи
        </h3>

        {Object.entries(groupedSlots).slice(0, 7).map(([date, daySlots]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-border/50 bg-card"
          >
            <p className="text-sm font-medium text-foreground mb-3">{date}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {daySlots.map((slot) => (
                <button
                  key={slot.id}
                  disabled={slot.booked}
                  onClick={() => bookSlot(slot.id)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    slot.booked
                      ? "bg-accent/10 text-accent border border-accent/30"
                      : selectedSlot === slot.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {slot.booked ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> {slot.time}
                    </span>
                  ) : (
                    slot.time
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-start gap-3">
          <Video className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Формат встречи</p>
            <p className="text-xs text-muted-foreground mt-1">
              Встречи проходят онлайн через Zoom. Ссылка будет отправлена за 1 час до начала.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCalendar;
