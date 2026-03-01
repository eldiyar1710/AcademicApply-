import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Check, Clock, Calendar, User, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MeetingCalendar } from "@/components/MeetingCalendar";
import ConsultantChat from "@/components/ConsultantChat";

interface ConsultantInvitationProps {
  userType: "school" | "graduate" | "student";
  userName: string;
  dream?: string;
  recommendations?: string[];
  universities?: string[];
  hasFreeCall?: boolean;
  userPlan?: "free" | "basic" | "expert";
}

const ConsultantInvitation = ({ 
  userType, 
  userName, 
  dream, 
  recommendations = [], 
  universities = [],
  userPlan = "free",
}: ConsultantInvitationProps) => {
  console.log('=== ConsultantInvitation MOUNT ===');
  console.log('Props:', { userType, userName, userPlan, dream, recommendations, universities });
  
  const [showInvitation, setShowInvitation] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [meetingBooked, setMeetingBooked] = useState(false);
  const [meetingTime, setMeetingTime] = useState<string | null>(null);
  const { toast } = useToast();

  // Show enhanced features for Expert plan
  const isExpertPlan = userPlan === "expert";
  const planFeatures = {
    free: ["1 бесплатная консультация", "Общие рекомендации"],
    basic: ["3 встречи в неделю", "Календарь с советами", "План подготовки"],
    expert: ["24/7 AI агент", "Проверка документов", "Видеовстречи", "Персональный консультант"]
  };

  console.log('State:', { showInvitation, showScheduler, showChat, meetingBooked, isExpertPlan });

  // Debug: Log current state
  console.log('ConsultantInvitation Debug:', { 
    userPlan, 
    isExpertPlan, 
    showInvitation, 
    meetingBooked,
    userName 
  });

  // Listen for manual consultant trigger
  useEffect(() => {
    const handleManualTrigger = () => {
      console.log('Manual consultant trigger received');
      setShowInvitation(true);
    };
    
    window.addEventListener('openConsultant', handleManualTrigger);
    
    return () => {
      window.removeEventListener('openConsultant', handleManualTrigger);
    };
  }, []);

  // Flashing animation for invitation
  useEffect(() => {
    if (!showInvitation || meetingBooked) return;
    
    const interval = setInterval(() => {
      // Pulse effect continues until user responds
    }, 2000);
    
    return () => clearInterval(interval);
  }, [showInvitation, meetingBooked]);

  const handleAccept = () => {
    setShowInvitation(false);
    if (isExpertPlan) {
      // For Expert plan, directly open chat
      setShowChat(true);
      toast({
        title: "Добро пожаловать в Expert план!",
        description: "Ваш персональный консультант готов помочь",
      });
    } else {
      // For other plans, show scheduler
      setShowScheduler(true);
      toast({
        title: "Отлично!",
        description: "Выберите удобное время для встречи",
      });
    }
  };

  const handleDecline = () => {
    setShowInvitation(false);
    toast({
      title: "Понимаем",
      description: "Вы всегда можете связаться с консультантом позже через кабинет",
    });
  };

  const handleMeetingBooked = (time: string, language: string) => {
    setShowScheduler(false);
    setMeetingBooked(true);
    setMeetingTime(time);
    
    // Show waiting state for 2 minutes, then open chat
    setTimeout(() => {
      toast({
        title: "Встреча подтверждена!",
        description: `Ваша встреча с консультантом назначена на ${time}. Не забудьте!`,
      });
      setShowChat(true);
    }, 2000); // 2 seconds for demo (would be 2 minutes in production)
  };

  if (showChat) {
    return (
      <ConsultantChat 
        userName={userName}
        userType={userType}
        dream={dream}
        recommendations={recommendations}
        universities={universities}
        meetingTime={meetingTime}
        onClose={() => setShowChat(false)}
        onOpenCalendar={() => {
          setShowChat(false);
          setShowScheduler(true);
        }}
      />
    );
  }

  return (
    <>
      {/* Floating Consultant Button - Always show for testing */}
      <motion.button
        data-consultant-button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          console.log('=== CONSULTANT BUTTON CLICKED ===');
          console.log('Current state before click:', { showInvitation, isExpertPlan, userPlan, userName });
          setShowInvitation(true);
          console.log('State after setShowInvitation(true):', 'should be true now');
        }}
        className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all ${
          isExpertPlan 
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white" 
            : "bg-primary text-primary-foreground"
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">
          {isExpertPlan ? "Эксперт" : "Консультант"}
        </span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {/* Always show invitation for testing */}
        {showInvitation && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50 w-80 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Flashing Header */}
            <motion.div 
              animate={{ 
                backgroundColor: isExpertPlan 
                  ? ["rgba(251, 191, 36, 0.1)", "rgba(250, 204, 21, 0.2)", "rgba(251, 191, 36, 0.1)"]
                  : ["rgba(var(--primary), 0.1)", "rgba(var(--accent), 0.2)", "rgba(var(--primary), 0.1)"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`p-4 border-b ${
                isExpertPlan 
                  ? "border-amber-500/30" 
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <User className={`w-5 h-5 ${isExpertPlan ? "text-amber-600" : "text-primary"}`} />
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                    />
                  </div>
                  <span className="font-medium text-sm">
                    {isExpertPlan ? "Эксперт Анна" : "Консультант Анна"}
                  </span>
                  {isExpertPlan && (
                    <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      PRO
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleDecline}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Message Content */}
            <div className="p-4 space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <p className="text-sm text-foreground">
                  Привет, {userName}! 👋
                </p>
                <p className="text-sm text-muted-foreground">
                  {isExpertPlan 
                    ? "Я ваш персональный консультант в Expert плане. Готова помочь с документами, встречами и поступлением."
                    : "Я вижу, вы определили своё будущее. Хотите, я проверю ваши документы и помогу с поступлением?"
                  }
                </p>
                {isExpertPlan && (
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <Sparkles className="w-3 h-3" />
                    <span>Expert план: полный доступ ко всем услугам</span>
                  </div>
                )}
              </motion.div>

              {/* Plan Features */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-lg bg-muted/50 space-y-2"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  {isExpertPlan ? "Ваш Expert план включает:" : "Бесплатная консультация включает:"}
                </p>
                <div className="space-y-1">
                  {planFeatures[userPlan].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                {isExpertPlan && (
                  <p className="text-xs text-amber-600 font-medium mt-2">
                    2 встречи в неделю + проверка документов
                  </p>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-2"
              >
                <Button 
                  size="sm" 
                  className="flex-1 gap-1"
                  onClick={handleAccept}
                >
                  <Check className="w-4 h-4" />
                  {isExpertPlan ? "Открыть чат" : "Да, хочу"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleDecline}
                >
                  {isExpertPlan ? "Позже" : "Позже"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meeting Scheduler Modal */}
      {showScheduler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <MeetingCalendar
              plan={userPlan}
              userName={userName}
              userType={userType}
              onBookMeeting={(meeting) => {
                setShowScheduler(false);
                setMeetingBooked(true);
                setMeetingTime(`${meeting.date} ${meeting.time}`);
                setTimeout(() => {
                  setShowChat(true);
                }, 2000);
              }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ConsultantInvitation;
