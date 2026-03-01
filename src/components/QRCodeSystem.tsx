import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  QrCode, Download, Share2, Smartphone, 
  Gift, Crown, CheckCircle2, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import { calculateQRDiscount } from "@/lib/auth";

interface QRCodeSystemProps {
  className?: string;
}

const QRCodeSystem = ({ className }: QRCodeSystemProps) => {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrLink, setQrLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Создаем специальную ссылку для QR-кода с 30% скидкой
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://academicapply.com";
      const qrSpecificUrl = `${baseUrl}?qr=discount30&source=qrcode`;
      setQrLink(qrSpecificUrl);
      
      // Генерируем QR-код
      const qrDataUrl = await QRCode.toDataURL(qrSpecificUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#1f2937",
          light: "#ffffff"
        }
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error("QR Code generation error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать QR-код",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = 'academicapply-qr-discount.png';
    link.href = qrCodeUrl;
    link.click();
    
    toast({
      title: "QR-код скачан!",
      description: "Теперь вы можете поделиться им или распечатать.",
    });
  };

  const handleShareQR = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AcademicApply - 30% скидка!",
          text: "Сканируй QR-код и получи 30% скидку на все тарифы AcademicApply! Помощь с поступлением в зарубежные вузы.",
          url: qrLink,
        });
      } else {
        await navigator.clipboard.writeText(qrLink);
        toast({
          title: "Ссылка скопирована!",
          description: "Отправьте ее друзьям.",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const plans = [
    {
      name: "Базовый",
      originalPrice: 49,
      discountedPrice: calculateQRDiscount(49),
      period: "месяц",
      features: ["AI консультант", "База вузов", "Шаблоны документов"],
      savings: 15
    },
    {
      name: "Эксперт",
      originalPrice: 490,
      discountedPrice: calculateQRDiscount(490),
      period: "год",
      features: ["Все из Базового", "Личный консультант", "Проверка документов", "Видеовстречи"],
      savings: 147
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Основная информация */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">QR-код со скидкой</h3>
              <p className="text-sm text-muted-foreground">30% скидка на все тарифы</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            -30%
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR-код */}
          <div className="text-center">
            {isGenerating ? (
              <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Генерация QR-кода...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-64 h-64 bg-white rounded-lg p-4 mx-auto border border-border">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button size="sm" variant="outline" onClick={handleDownloadQR}>
                    <Download className="w-4 h-4 mr-1" />
                    Скачать
                  </Button>
                  <Button size="sm" onClick={handleShareQR}>
                    <Share2 className="w-4 h-4 mr-1" />
                    Поделиться
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Информация о скидках */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-blue-600" />
                Эксклюзивная скидка 30%
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Отсканируйте QR-код и получите мгновенную скидку 30% на любой тариф
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-muted-foreground">Работает на всех устройствах</span>
              </div>
            </div>

            {/* Сравнение цен */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Ваша выгода:</h4>
              <div className="space-y-3">
                {plans.map((plan, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-foreground">{plan.name}</h5>
                        <p className="text-xs text-muted-foreground">{plan.period}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">
                            ${plan.originalPrice}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ${plan.discountedPrice}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Экономия ${plan.savings}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plan.features.map((feature, featureIdx) => (
                        <span key={featureIdx} className="text-xs text-muted-foreground">
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Как использовать */}
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-600" />
                Как использовать?
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-medium">1</span>
                  <p>Откройте камеру на смартфоне</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-medium">2</span>
                  <p>Наведите на QR-код</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-medium">3</span>
                  <p>Перейдите по ссылке и зарегистрируйтесь</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-medium">4</span>
                  <p>Получите 30% скидку автоматически</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Дополнительная информация */}
      <Card className="p-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-600" />
          Преимущества QR-кода
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <h5 className="font-medium text-foreground mb-2">Мгновенная скидка</h5>
            <p className="text-sm text-muted-foreground">30% скидка применяется автоматически</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <h5 className="font-medium text-foreground mb-2">Удобно</h5>
            <p className="text-sm text-muted-foreground">Работает на любом смартфоне</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h5 className="font-medium text-foreground mb-2">Без ограничений</h5>
            <p className="text-sm text-muted-foreground">Скидка действует на все тарифы</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QRCodeSystem;
