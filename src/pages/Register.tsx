import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, User as UserIcon, Mail, Phone, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getAttribution, getTimezone } from "@/lib/attribution";
import { registerUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const attr = useMemo(() => getAttribution(), []);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  const contactIcon = contact.includes("@") ? <Mail className="w-4 h-4 text-muted-foreground" /> : <Phone className="w-4 h-4 text-muted-foreground" />;

  const canSubmit = name.trim().length > 1 && contact.trim().length > 3 && password.trim().length >= 6 && accepted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accepted) {
      toast({
        title: "Нужно согласие",
        description: "Без согласия с офертой и обработкой данных регистрация невозможна",
        variant: "destructive",
      });
      return;
    }

    registerUser({
      name: name.trim(),
      contact: contact.trim(),
      timezone: getTimezone(),
      legalAcceptedAt: new Date().toISOString(),
      attribution: attr
        ? {
            leadSessionId: attr.leadSessionId,
            source: attr.source,
            eventSlug: attr.eventSlug,
            expertRef: attr.expertRef,
          }
        : undefined,
    });

    toast({
      title: "Аккаунт создан",
      description: "Мы сохранили твои результаты в кабинете",
    });

    navigate(`/dashboard?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Создать аккаунт</h1>
                <p className="text-sm text-muted-foreground">Откроем рекомендации и сохраним прогресс</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Айгерим" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Email или телефон</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">{contactIcon}</div>
                  <Input
                    id="contact"
                    className="pl-10"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="name@email.com или +7..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Минимум 6 символов" />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox checked={accepted} onCheckedChange={(v) => setAccepted(Boolean(v))} id="legal" />
                <Label htmlFor="legal" className="text-sm leading-5">
                  Согласен с Офертой и обработкой персональных данных
                </Label>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">Часовой пояс</p>
                  <p className="text-xs text-muted-foreground">Мы автоматически определим timezone и будем показывать дедлайны в твоем времени</p>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
                Создать аккаунт
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
