import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroBackground from "@/components/HeroBackground";
import UserTypeCards from "@/components/UserTypeCards";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-md border border-card/10 text-primary-foreground text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            AI-платформа для вашего будущего
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground mb-6 leading-tight"
          >
            Определи своё{" "}
            <span className="text-gradient-gold">будущее</span>
            <br />
            уже сегодня
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12"
          >
            Наш AI-алгоритм поможет определить твои навыки, подобрать профессию
            и найти идеальный университет — бесплатно, по гранту или на платной основе
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mb-8"
          >
            <p className="text-primary-foreground/60 text-sm font-medium mb-6 tracking-wider uppercase">
              Кто ты?
            </p>
          </motion.div>

          <UserTypeCards />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <a href="#features" className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
              Узнать больше <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <StatsSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
