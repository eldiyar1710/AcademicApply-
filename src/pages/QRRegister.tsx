import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  QrCode, Gift, CheckCircle2, ArrowRight, 
  GraduationCap, Crown, Star, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { registerUser, calculateQRDiscount } from "@/lib/auth";

const QRRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    userType: "school" as "school" | "graduate" | "student"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isQRDiscount, setIsQRDiscount] = useState(false);

  useEffect(() => {
    // Проверяем параметры URL для QR-кода
    const qrParam = searchParams.get("qr");
    const sourceParam = searchParams.get("source");
    
    if (qrParam === "discount30" && sourceParam === "qrcode") {
      setIsQRDiscount(true);
    }
  }, [searchParams]);

  const plans = [
    {
      name: "Базовый",
      originalPrice: 49,
      discountedPrice: calculateQRDiscount(49),
      period: "месяц",
      features: ["AI консультант", "База вузов", "Шаблоны документов"],
      savings: 15,
      popular: false
    },
    {
      name: "Эксперт",
      originalPrice: 490,
      discountedPrice: calculateQRDiscount(490),
      period: "год",
      features: ["Все из Базового", "Личный консультант", "Проверка документов", "Видеовстречи"],
      savings: 147,
      popular: true
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (!formData.contact.includes("@")) {
        throw new Error("Для регистрации через Firebase требуется email");
      }

      const user = await registerUser({
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        password: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        legalAcceptedAt: new Date().toISOString(),
        userType: formData.userType,
        attribution: {
          source: isQRDiscount ? "qrcode" : "direct"
        }
      });

      if (user) {
        toast({
          title: "Регистрация успешна!",
          description: isQRDiscount ? "Ваша 30% скидка активирована!" : "Добро пожаловать в AcademicApply!",
        });
        
        // Перенаправляем на страницу выбора плана
        navigate("/dashboard");
      }
    } catch (error) {
      const e = error as any;
      const details = e?.code ? `${e.code}: ${e.message || ""}` : (e?.message || "");
      toast({
        title: "Ошибка",
        description: `Не удалось зарегистрироваться. ${details}`.trim(),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const userTypeOptions = [
    { value: "school", label: "Школьник", description: "9-11 классы" },
    { value: "graduate", label: "Выпускник", description: "Закончил школу" },
    { value: "student", label: "Студент", description: "Учуся в вузе" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero секция */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              {isQRDiscount && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-lg px-4 py-2">
                  <Gift className="w-4 h-4 mr-2" />
                  30% СКИДКА
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
              {isQRDiscount ? "Получите 30% скидку!" : "Добро пожаловать в AcademicApply"}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {isQRDiscount 
                ? "Вы отсканировали QR-код со специальной скидкой! Зарегистрируйтесь и получите 30% скидку на все тарифы."
                : "AI-платформа для поступления в зарубежные вузы. Помощь с документами, консультации и выбор университета."
              }
            </p>
          </motion.div>

          {/* Форма регистрации */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Левая колонка - форма */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Создайте аккаунт
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Имя */}
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Введите ваше имя"
                    required
                  />
                </div>

                {/* Контакт */}
                <div>
                  <Label htmlFor="contact">Email или телефон *</Label>
                  <Input
                    id="contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="email@example.com или +7 701 234 5678"
                    required
                  />
                </div>

                {/* Тип пользователя */}
                <div>
                  <Label>Кто вы? *</Label>
                  <div className="grid gap-3 mt-2">
                    {userTypeOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.userType === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value={option.value}
                          checked={formData.userType === option.value}
                          onChange={(e) => setFormData({ ...formData, userType: e.target.value as any })}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                        {formData.userType === option.value && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Регистрация...
                    </>
                  ) : (
                    <>
                      Зарегистрироваться
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Правая колонка - тарифы */}
            <div className="space-y-6">
              {isQRDiscount && (
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-blue-600" />
                    Ваша эксклюзивная скидка
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Только для пользователей QR-кода - 30% скидка на все тарифы!
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-white border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">30%</p>
                      <p className="text-sm text-muted-foreground">Скидка</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-blue-200">
                      <p className="text-2xl font-bold text-green-600">$162</p>
                      <p className="text-sm text-muted-foreground">Макс. экономия</p>
                    </div>
                  </div>
                </Card>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Выберите тариф</h3>
                <div className="space-y-4">
                  {plans.map((plan, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <Card className={`p-4 relative ${
                        plan.popular ? "border-primary bg-primary/5" : "border-border"
                      }`}>
                        {plan.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-primary">
                            <Crown className="w-3 h-3 mr-1" />
                            Популярный
                          </Badge>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">{plan.period}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground line-through">
                                ${plan.originalPrice}
                              </span>
                              <span className="text-xl font-bold text-green-600">
                                ${plan.discountedPrice}
                              </span>
                            </div>
                            {isQRDiscount && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 mt-1">
                                Экономия ${plan.savings}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {plan.features.map((feature, featureIdx) => (
                            <div key={featureIdx} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Преимущества */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Почему выбирают нас?</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h5 className="font-medium text-foreground mb-1">100+ вузов</h5>
                    <p className="text-sm text-muted-foreground">База лучших университетов</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h5 className="font-medium text-foreground mb-1">500+ студентов</h5>
                    <p className="text-sm text-muted-foreground">Уже поступили с нашей помощью</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <h5 className="font-medium text-foreground mb-1">95% успех</h5>
                    <p className="text-sm text-muted-foreground">Поступают в выбранный вуз</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                      <Gift className="w-6 h-6 text-amber-600" />
                    </div>
                    <h5 className="font-medium text-foreground mb-1">Бонусы</h5>
                    <p className="text-sm text-muted-foreground">Реферальная программа</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QRRegister;
