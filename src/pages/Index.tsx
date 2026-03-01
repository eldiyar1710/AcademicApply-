import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Star, Heart } from "lucide-react";
import HeroBackground from "@/components/HeroBackground";
import UserTypeCards from "@/components/UserTypeCards";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  const scrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header transparent />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 text-center max-w-5xl mx-auto pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/15 backdrop-blur-lg border border-card/10 text-primary-foreground text-sm font-medium mb-8 shadow-lg"
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
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-6"
          >
            Наш AI-алгоритм поможет определить твои навыки, подобрать профессию
            и найти идеальный университет — бесплатно, по гранту или на платной основе
          </motion.p>

          {/* Dream Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-amber-500/30 text-amber-100">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Твоя мечта начинается здесь</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 max-w-2xl mx-auto"
            >
              <p className="text-2xl md:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 mb-3">
                Какая у тебя цель?
              </p>
              <p className="text-primary-foreground/70 text-base md:text-lg">
                Поступить на грант в топовый вуз? Получить престижную профессию? 
                <br className="hidden md:block" />
                Или стать частью глобального сообщества профессионалов?
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-3">
              <Target className="w-5 h-5 text-primary-foreground/60" />
              <p className="text-primary-foreground/60 text-sm font-medium tracking-wider uppercase">
                Выбери, кто ты сегодня
              </p>
              <Target className="w-5 h-5 text-primary-foreground/60" />
            </div>
          </motion.div>

          <UserTypeCards />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <a 
              href="#how-it-works" 
              onClick={scrollToHowItWorks}
              className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm cursor-pointer"
            >
              Как это работает <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <StatsSection />
      <HowItWorks />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
