import { motion } from "framer-motion";
import { Clock, CheckCircle2, FileSearch, Send, AlertCircle, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Application = {
  id: string;
  university: string;
  country: string;
  program: string;
  status: "pending" | "reviewing" | "sent" | "accepted" | "rejected";
  date: string;
  lastUpdate: string;
};

const mockApplications: Application[] = [
  {
    id: "1",
    university: "Назарбаев Университет",
    country: "Казахстан",
    program: "Computer Science",
    status: "reviewing",
    date: "10 февр. 2026",
    lastUpdate: "14 февр. 2026",
  },
  {
    id: "2",
    university: "KAIST",
    country: "Южная Корея",
    program: "Electrical Engineering",
    status: "sent",
    date: "5 февр. 2026",
    lastUpdate: "12 февр. 2026",
  },
  {
    id: "3",
    university: "TU Munich",
    country: "Германия",
    program: "Informatics",
    status: "accepted",
    date: "20 янв. 2026",
    lastUpdate: "10 февр. 2026",
  },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: "Ожидает обработки", icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
  reviewing: { label: "На проверке", icon: FileSearch, color: "text-secondary", bg: "bg-secondary/10" },
  sent: { label: "Отправлено в вуз", icon: Send, color: "text-primary", bg: "bg-primary/10" },
  accepted: { label: "Одобрено! 🎉", icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10" },
  rejected: { label: "Отклонено", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const statusSteps = ["pending", "reviewing", "sent", "accepted"];

const Tracking = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              Мои заявки
            </h1>
            <p className="text-muted-foreground text-lg">
              Отслеживайте статус поступления в реальном времени
            </p>
          </motion.div>

          {mockApplications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-bold text-foreground mb-2">Пока нет заявок</h2>
              <p className="text-muted-foreground text-sm mb-6">Пройдите тест и выберите университет для начала</p>
              <Button onClick={() => navigate("/")}>Начать</Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {mockApplications.map((app, i) => {
                const config = statusConfig[app.status];
                const StatusIcon = config.icon;
                const currentStep = statusSteps.indexOf(app.status);

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-card shadow-card border border-border/50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-heading font-bold text-foreground">{app.university}</h3>
                        <p className="text-sm text-muted-foreground">{app.country} · {app.program}</p>
                        <p className="text-xs text-muted-foreground mt-1">Подано: {app.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${config.bg} ${config.color} gap-1.5`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress steps */}
                    <div className="flex items-center gap-0">
                      {statusSteps.map((step, si) => {
                        const stepConf = statusConfig[step];
                        const StepIcon = stepConf.icon;
                        const isCompleted = si <= currentStep;
                        const isCurrent = si === currentStep;

                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCompleted
                                    ? app.status === "rejected" && isCurrent
                                      ? "bg-destructive/10"
                                      : "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <StepIcon className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] mt-1 text-center leading-tight ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                                {stepConf.label.replace(" 🎉", "")}
                              </span>
                            </div>
                            {si < statusSteps.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-1 ${
                                  si < currentStep ? "bg-primary" : "bg-muted"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">
                      Последнее обновление: {app.lastUpdate}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tracking;
