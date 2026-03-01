import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getEventTemplate } from "@/data/events";
import { setOfflineAttributionIfEmpty } from "@/lib/attribution";

const EventLanding = () => {
  const navigate = useNavigate();
  const { eventSlug } = useParams();
  const [searchParams] = useSearchParams();
  const expertRef = searchParams.get("r") || undefined;

  const template = useMemo(() => (eventSlug ? getEventTemplate(eventSlug) : null), [eventSlug]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!eventSlug) return;
    setOfflineAttributionIfEmpty({ eventSlug, expertRef: expertRef || template?.expertRef });
  }, [eventSlug, expertRef, template?.expertRef]);

  const questions = template?.questions || [];
  const currentQ = questions[step];
  const selected = answers[currentQ?.id] || [];
  const progress = questions.length ? ((step + 1) / questions.length) * 100 : 0;

  const toggleOption = (option: string) => {
    if (!currentQ) return;
    if (currentQ.type === "single") {
      setAnswers({ ...answers, [currentQ.id]: [option] });
      return;
    }
    const updated = selected.includes(option) ? selected.filter((s) => s !== option) : [...selected, option];
    setAnswers({ ...answers, [currentQ.id]: updated });
  };

  const canNext = Boolean(currentQ) && selected.length > 0;

  const handleNext = () => {
    if (!template) return;
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    const params = new URLSearchParams();
    params.set("flow", "event");
    params.set("event", template.slug);
    params.set("type", "school");
    Object.entries(answers).forEach(([key, vals]) => params.set(key, vals.join(",")));

    navigate(`/assessment?${params.toString()}`);
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Мероприятие не найдено</h1>
            <p className="text-muted-foreground mb-6">Проверь QR-код или попроси ссылку у организатора.</p>
            <Button onClick={() => navigate("/")}>На главную</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{template.title}</h1>
              <p className="text-muted-foreground mt-1">{template.subtitle}</p>
              <p className="text-xs text-muted-foreground mt-3">Эксперт: {template.expertName}</p>
            </div>

            {questions.length > 0 && (
              <div className="mb-6">
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {currentQ ? (
                  <>
                    <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">{currentQ.question}</h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      {currentQ.type === "multi" ? "Выбери один или несколько вариантов" : "Выбери один вариант"}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQ.options.map((option) => {
                        const isSelected = selected.includes(option);
                        return (
                          <motion.button
                            key={option}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleOption(option)}
                            className={`relative p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? "border-primary bg-primary/5 text-foreground"
                                : "border-border bg-card text-foreground hover:border-primary/30"
                            }`}
                          >
                            <span>{option}</span>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                              >
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button onClick={handleNext} disabled={!canNext} size="lg" className="gap-2 px-8">
                        Далее <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground">Анкета пока не настроена.</p>
                    <div className="mt-6">
                      <Button onClick={() => navigate("/")}>На главную</Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventLanding;
