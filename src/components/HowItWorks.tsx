import { motion } from "framer-motion";
import { ClipboardList, Brain, GraduationCap, FileCheck, Bell } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Заполни профиль",
    description: "Укажи свои навыки, интересы и предметы, которые тебе нравятся",
  },
  {
    icon: Brain,
    title: "AI-анализ",
    description: "Наш алгоритм проанализирует твой профиль и определит подходящие профессии",
  },
  {
    icon: GraduationCap,
    title: "Подбор университетов",
    description: "Получи список университетов с рейтингом совпадения и требованиями",
  },
  {
    icon: FileCheck,
    title: "Подача документов",
    description: "Заполни форму — мы подготовим и отправим документы за тебя",
  },
  {
    icon: Bell,
    title: "Результат",
    description: "Отслеживай статус заявки и получи уведомление о зачислении",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Как это <span className="text-gradient-gold">работает</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            От первого теста до зачисления — 5 простых шагов
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg flex-shrink-0">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
