import { motion } from "framer-motion";
import { Users, Star, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultantList from "@/components/ConsultantList";
import SeedDataButton from "@/components/SeedDataButton";
import SyncStatus from "@/components/SyncStatus";

const Consultants = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                Эксперты поступления
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Профессиональные консультанты из топ-университетов помогут вам поступить 
              в университет мечты и получить грант
            </p>

            {/* Преимущества */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Проверенные эксперты</h3>
                <p className="text-sm text-muted-foreground">
                  Только выпускники MIT, Stanford, Harvard и других топ-вузов
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Высокий рейтинг</h3>
                <p className="text-sm text-muted-foreground">
                  Средний рейтинг консультантов 4.8+ на основе реальных отзывов
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Гибкий график</h3>
                <p className="text-sm text-muted-foreground">
                  Онлайн-встречи в удобное время, поддержка 24/7
                </p>
              </div>
            </div>
          </motion.div>

          {/* Список консультантов */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ConsultantList />
          </motion.div>
        </div>
      </div>

      <Footer />
      <SeedDataButton />
      <SyncStatus />
    </div>
  );
};

export default Consultants;
