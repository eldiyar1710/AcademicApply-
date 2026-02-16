import { motion } from "framer-motion";
import { GraduationCap, BookOpen, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const userTypes = [
  {
    id: "school",
    icon: BookOpen,
    title: "Я школьник",
    description: "Определи своё будущее и узнай, куда поступить",
    gradient: "from-primary to-primary/80",
  },
  {
    id: "graduate",
    icon: GraduationCap,
    title: "Я выпускник",
    description: "Найди лучший университет и подай документы",
    gradient: "from-secondary to-secondary/80",
  },
  {
    id: "student",
    icon: RefreshCw,
    title: "Я студент",
    description: "Поменяй профессию или перейди в другой вуз",
    gradient: "from-accent to-accent/80",
  },
];

const UserTypeCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
      {userTypes.map((type, i) => (
        <motion.button
          key={type.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/assessment?type=${type.id}`)}
          className="group relative overflow-hidden rounded-2xl p-6 text-left glass border border-card/20 shadow-card hover:shadow-card-hover transition-shadow duration-300"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <type.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-2">{type.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default UserTypeCards;
