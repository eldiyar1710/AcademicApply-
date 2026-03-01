import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BadgePercent, CreditCard, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getAttribution, getDiscountInfo } from "@/lib/attribution";
import { getUser } from "@/lib/auth";
import { createOrder, getPlan, validatePromoCode } from "@/lib/billing";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const user = useMemo(() => getUser(), []);
  const planId = searchParams.get("plan");
  const plan = useMemo(() => getPlan(planId), [planId]);

  const discountInfo = useMemo(() => getDiscountInfo(), []);
  const attr = useMemo(() => getAttribution(), []);

  const [promoInput, setPromoInput] = useState("");
  const promo = useMemo(() => validatePromoCode(promoInput), [promoInput]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Нужна регистрация</h1>
            <p className="text-muted-foreground mb-6">Чтобы оплатить тариф, создай аккаунт.</p>
            <Button onClick={() => navigate(`/register?${searchParams.toString()}`)}>Создать аккаунт</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!plan || plan.id === "enterprise") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Тариф не найден</h1>
            <p className="text-muted-foreground mb-6">Выбери тариф в личном кабинете.</p>
            <Button onClick={() => navigate(`/dashboard?${searchParams.toString()}`)}>В кабинет</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercent = discountInfo.eligible ? discountInfo.discountPercent : 0;
  const promoPercent = promo.ok ? promo.percent : 0;
  const final = Math.round(plan.priceUsd * (100 - Math.min(80, discountPercent + promoPercent)) / 100);

  const pay = () => {
    const order = createOrder({
      plan,
      discountPercent,
      promoCode: promo.ok ? promo.code : undefined,
      promoPercent,
      attribution: attr
        ? {
            source: attr.source,
            eventSlug: attr.eventSlug,
            expertRef: attr.expertRef,
            leadSessionId: attr.leadSessionId,
          }
        : undefined,
    });

    toast({
      title: "Оплата прошла (MVP)",
      description: "Мы сформировали чек и активировали тариф",
    });

    navigate(`/receipt/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
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
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Оплата тарифа</h1>
                <p className="text-sm text-muted-foreground">{plan.title}</p>
              </div>
            </div>

            {discountInfo.eligible && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/10"
              >
                <div className="flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-accent" />
                  <p className="text-sm text-foreground font-medium">Скидка {discountInfo.discountPercent}% участника форума</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Активна ограниченное время</p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <div className="p-5 rounded-xl border border-border/50">
                  <p className="text-sm font-medium text-foreground">Что входит</p>
                  <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <div className="mt-5 p-5 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Промокод</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promo">Введите код</Label>
                    <Input id="promo" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="BLOG10" />
                    {promoInput.trim().length > 0 && (
                      <p className={`text-xs ${promo.ok ? "text-accent" : "text-muted-foreground"}`}>
                        {promo.ok ? `Промокод применён: -${promo.percent}%` : "Промокод не найден"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="p-5 rounded-xl bg-muted/40 border border-border">
                  <p className="text-sm font-medium text-foreground">Итого</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Цена</span>
                      <span className="text-foreground font-medium">${plan.priceUsd}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Скидка (offline)</span>
                        <span className="text-foreground font-medium">-{discountPercent}%</span>
                      </div>
                    )}

                    {promoPercent > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Промокод</span>
                        <span className="text-foreground font-medium">-{promoPercent}%</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">К оплате</span>
                      <span className="text-2xl font-heading font-bold text-primary">${final}</span>
                    </div>

                    <Button className="w-full" size="lg" onClick={pay}>
                      Оплатить (MVP)
                    </Button>

                    <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard?${searchParams.toString()}`)}>
                      Вернуться в кабинет
                    </Button>

                    <p className="text-[11px] text-muted-foreground leading-4">
                      Это MVP: деньги не списываются. Мы только симулируем транзакцию и выдаём чек.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
