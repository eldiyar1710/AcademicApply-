import { motion } from "framer-motion";
import { Brain, Globe, FileCheck, TrendingUp, Users, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-анализ навыков",
    description: "Наш алгоритм определит ваши сильные стороны и подберёт подходящие профессии будущего",
  },
  {
    icon: Globe,
    title: "Университеты по всему миру",
    description: "Подбор вузов в Казахстане, России, Узбекистане и за рубежом с учётом ваших возможностей",
  },
  {
    icon: FileCheck,
    title: "Помощь с документами",
    description: "Мы подготовим и отправим ваши документы в выбранный университет за вас",
  },
  {
    icon: TrendingUp,
    title: "Актуальные профессии",
    description: "Рекомендации на основе трендов рынка труда на ближайшие 10 лет",
  },
  {
    icon: Users,
    title: "Персональный консультант",
    description: "Индивидуальное сопровождение на каждом этапе поступления",
  },
  {
    icon: Shield,
    title: "Гранты и стипендии",
    description: "Поиск бесплатных программ обучения и грантов под ваш профиль",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Как мы <span className="text-gradient-primary">помогаем</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Комплексная платформа для выбора профессии и поступления в университет
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-card shadow-card hover:shadow-card-hover transition-all duration-500 border border-border/30"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
