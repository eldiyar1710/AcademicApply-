import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import university1 from "@/assets/university-1.jpg";
import university2 from "@/assets/university-2.jpg";
import university3 from "@/assets/university-3.jpg";

const images = [university1, university2, university3];

const HeroBackground = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={current}
          src={images[current]}
          alt="University campus"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-foreground/30" />
    </div>
  );
};

export default HeroBackground;
