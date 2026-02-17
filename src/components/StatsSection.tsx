import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Университетов" },
  { value: "50+", label: "Стран" },
  { value: "10K+", label: "Студентов" },
  { value: "95%", label: "Успешных поступлений" },
];

const StatsSection = () => {
  return (
    <section className="py-20 px-4 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30 opacity-90" />
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
