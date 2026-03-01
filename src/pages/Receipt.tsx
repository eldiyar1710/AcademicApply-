import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Copy } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getOrderById } from "@/lib/billing";

const Receipt = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { toast } = useToast();

  const order = useMemo(() => (orderId ? getOrderById(orderId) : null), [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Чек не найден</h1>
            <p className="text-muted-foreground mb-6">Возможно, он был удалён из браузера.</p>
            <Button onClick={() => navigate("/dashboard")}>В кабинет</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      toast({ title: "Скопировано", description: "ID заказа скопирован" });
    } catch {
      toast({ title: "Не удалось", description: "Скопируй вручную", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Чек (MVP)</h1>
                <p className="text-sm text-muted-foreground">Тариф активирован</p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border/50">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">ID заказа</p>
                <Button variant="outline" size="sm" className="gap-2" onClick={copyId}>
                  <Copy className="w-4 h-4" /> Скопировать
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 break-all">{order.id}</p>
            </div>

            <div className="mt-5 p-5 rounded-xl border border-border/50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Тариф</span>
                <span className="text-foreground font-medium">{order.planTitle}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Цена</span>
                <span className="text-foreground font-medium">${order.basePriceUsd}</span>
              </div>
              {order.discountPercent > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Скидка (offline)</span>
                  <span className="text-foreground font-medium">-{order.discountPercent}%</span>
                </div>
              )}
              {order.promoPercent > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Промокод</span>
                  <span className="text-foreground font-medium">{order.promoCode} (-{order.promoPercent}%)</span>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">К оплате</span>
                <span className="text-2xl font-heading font-bold text-primary">${order.finalPriceUsd}</span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-4">
                Это MVP-чек. Реальной транзакции не было.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate("/dashboard")} className="flex-1">В кабинет</Button>
              <Button variant="outline" onClick={() => navigate("/results")} className="flex-1">Открыть результаты</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Receipt;
