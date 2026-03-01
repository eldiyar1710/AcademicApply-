import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, User, Mail, Phone, GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { universityData } from "@/data/universities";
import { useToast } from "@/hooks/use-toast";

const Apply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const uni = universityData.find((u) => u.id === id);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    education: "",
    gpa: "",
    ielts: "",
    motivation: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast({
        title: "Заполните обязательные поля",
        description: "Имя, фамилия, email и телефон обязательны",
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в течение 24 часов",
    });
  };

  if (!uni) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Университет не найден</h1>
          <Button onClick={() => navigate("/")}>На главную</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              Заявка отправлена!
            </h1>
            <p className="text-muted-foreground mb-2">
              Ваша заявка в <strong>{uni.name}</strong> успешно принята.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Наши консультанты проверят документы и свяжутся с вами в течение 24 часов.
              Отслеживайте статус заявки в разделе «Мои заявки».
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                На главную
              </Button>
              <Button onClick={() => navigate("/tracking")}>
                Мои заявки
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-8">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="font-heading font-bold text-foreground">{uni.name}</h2>
                  <p className="text-sm text-muted-foreground">{uni.city}, {uni.country} · {uni.ranking}</p>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Подать документы
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              Заполните форму, и наши консультанты подготовят и отправят все документы за вас
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal info */}
              <div className="p-5 rounded-xl bg-card shadow-card border border-border/50 space-y-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Личные данные
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Имя *</Label>
                    <Input id="firstName" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} placeholder="Ваше имя" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Фамилия *</Label>
                    <Input id="lastName" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Ваша фамилия" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+7 (XXX) XXX-XX-XX" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Страна проживания</Label>
                  <Input id="country" value={form.country} onChange={(e) => handleChange("country", e.target.value)} placeholder="Казахстан" />
                </div>
              </div>

              {/* Education */}
              <div className="p-5 rounded-xl bg-card shadow-card border border-border/50 space-y-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Образование
                </h3>
                <div>
                  <Label htmlFor="education">Текущее образование</Label>
                  <Input id="education" value={form.education} onChange={(e) => handleChange("education", e.target.value)} placeholder="Школа №1, 11 класс" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gpa">Средний балл (GPA)</Label>
                    <Input id="gpa" value={form.gpa} onChange={(e) => handleChange("gpa", e.target.value)} placeholder="4.5 / 5.0" />
                  </div>
                  <div>
                    <Label htmlFor="ielts">IELTS / TOEFL балл</Label>
                    <Input id="ielts" value={form.ielts} onChange={(e) => handleChange("ielts", e.target.value)} placeholder="IELTS 6.5" />
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="p-5 rounded-xl bg-card shadow-card border border-border/50 space-y-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Мотивация
                </h3>
                <div>
                  <Label htmlFor="motivation">Почему вы хотите учиться в этом университете?</Label>
                  <Textarea
                    id="motivation"
                    value={form.motivation}
                    onChange={(e) => handleChange("motivation", e.target.value)}
                    placeholder="Расскажите о своих целях и мотивации..."
                    rows={5}
                  />
                </div>
              </div>

              {/* Documents upload placeholder */}
              <div className="p-5 rounded-xl bg-card shadow-card border border-border/50 space-y-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" /> Документы
                </h3>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Перетащите файлы или нажмите для загрузки
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Паспорт, аттестат, сертификаты (PDF, JPG — до 10MB)
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" type="button">
                    Выбрать файлы
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Отмена
                </Button>
                <Button type="submit" size="lg" className="gap-2 px-8">
                  <GraduationCap className="w-4 h-4" /> Отправить заявку
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Apply;
