import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginUser, resetPassword, isConsultant } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().includes("@") && password.trim().length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await loginUser({ contact: email.trim(), password: password.trim() });
      toast({
        title: "Успешный вход",
        description: "Данные синхронизированы с Firebase",
      });
      
      // Role-based navigation
      if (isConsultant(user)) {
        navigate("/consultant-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const eAny = err as any;

      const code = String(eAny?.code || "");
      const friendly = (() => {
        if (code === "auth/invalid-credential") {
          return "Неверный email или пароль. Проверьте раскладку клавиатуры и попробуйте ещё раз. Если забыли пароль — нажмите «Забыли пароль?» ниже.";
        }
        if (code === "auth/user-not-found") {
          return "Аккаунт с таким email не найден. Проверьте email или создайте аккаунт.";
        }
        if (code === "auth/wrong-password") {
          return "Неверный пароль. Попробуйте ещё раз или восстановите пароль.";
        }
        if (code === "auth/too-many-requests") {
          return "Слишком много попыток входа. Подождите несколько минут и попробуйте снова.";
        }
        if (code === "auth/network-request-failed") {
          return "Проблема с интернетом. Проверьте соединение и попробуйте снова.";
        }
        return "Не удалось войти. Проверьте данные и попробуйте ещё раз.";
      })();

      toast({
        title: "Ошибка входа",
        description: friendly,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email.trim());
      toast({
        title: "Письмо отправлено",
        description: "Проверьте почту, чтобы восстановить пароль",
      });
    } catch (err) {
      const eAny = err as any;
      const details = eAny?.code ? `${eAny.code}: ${eAny.message || ""}` : (eAny?.message || "");
      toast({
        title: "Ошибка",
        description: details || "Не удалось отправить письмо",
        variant: "destructive",
      });
    }
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
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Войти</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || loading}>
                {loading ? "Вход..." : "Войти"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleResetPassword}
                disabled={!email.trim().includes("@") || loading}
              >
                Забыли пароль?
              </Button>

              <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/register")}
              >
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

export default Login;
