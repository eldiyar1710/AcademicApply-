import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle, Bot, MessageCircle, GraduationCap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { getFullUserFromFirebase, logUserAction } from "@/lib/syncService";
import { useToast } from "@/hooks/use-toast";

const AI_ASSISTANT_RESPONSES = {
  school: {
    greeting: "Привет! Я вижу, ты школьник и интересуешься будущим. Давай я помогу тебе с выбором пути!",
    interests: {
      it: "IT — отличное направление! Начни с Python, изучай основы алгоритмов, участвуй в олимпиадах. Топ-вузы: MIT, Stanford, МФТИ.",
      medicine: "Медицина — благородное дело! Нужны химия и биология на высшем уровне. Топ-вузы: Harvard Medical, Johns Hopkins, Сеченовский.",
      business: "Бизнес и экономика — перспективно! Изучай математику, экономику, иностранные языки. Топ-вузы: Wharton, LBS, ВШЭ.",
      engineering: "Инженерия — строит будущее! Физика, математика, программирование. Топ-вузы: MIT Caltech, МГТУ им. Баумана.",
      creative: "Творческие профессии — раскрой потенциал! Портфолио важнее оценок. Топ-вузы: Parsons, RCA, Британская высшая школа дизайна."
    },
    nextSteps: "Создай профиль в AcademicApply, пройди тестирование интересов, начни подготовку к экзаменам (IELTS/TOEFL, SAT)."
  },
  student: {
    greeting: "Привет! Как студент, ты уже на пути к цели. Давай определимся со следующими шагами!",
    interests: {
      it: "Для IT-студента: максимальная практика, стажировки, GitHub-портфолио, участие в хакатонах.",
      medicine: "Медицинскому студенту: фокус на практике, научные публикации, волонтерство, подготовка к лицензированию.",
      business: "Бизнес-студенту: стажировки в компаниях, кейсы, нетворкинг, изучение реальных рынков.",
      engineering: "Инженеру-студенту: лабораторные работы, проекты, патенты, промышленные стажировки.",
      creative: "Творческому студенту: выставки, конкурсы, коллаборации, сильное портфолио."
    },
    nextSteps: "Уточни специализацию, найди ментора, создавай профессиональное портфолио, готовься к международным программам."
  },
  graduate: {
    greeting: "Привет! Как выпускник, ты стоишь на пороге новой главы. Помогу с выбором дальнейшего пути!",
    interests: {
      it: "IT-выпускнику: выбирай между стартапами и Big Tech, рассматривай PhD для R&D, развивай soft skills.",
      medicine: "Медицинскому выпускнику: резидентура, специализация, научная карьера или частная практика.",
      business: "Бизнес-выпускнику: MBA или практический опыт? Рассмотри международные рынки и предпринимательство.",
      engineering: "Инженеру-выпускнику: R&D в корпорациях, консалтинг или собственные проекты.",
      creative: "Творческому выпускнику: freelance, агентства, преподавание или собственный бренд."
    },
    nextSteps: "Определись с карьерными целями, обнови резюме, расширяй нетворк, рассматривай международные возможности."
  }
};

const SyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error" | "offline">("offline");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [showAI, setShowAI] = useState(false);
  const [userType, setUserType] = useState<"school" | "student" | "graduate">("school");
  const [selectedInterest, setSelectedInterest] = useState<string>("it");
  const { toast } = useToast();

  useEffect(() => {
    const checkSyncStatus = async () => {
      const user = getUser();
      if (!user) {
        setSyncStatus("offline");
        return;
      }

      setUserType(user.profile?.userType || "school");

      try {
        setSyncStatus("syncing");
        const data = await getFullUserFromFirebase(user.id);
        
        if (data.user) {
          setFirebaseData(data);
          setLastSync(new Date(data.user.lastSync || Date.now()));
          setSyncStatus("synced");
          
          await logUserAction(user.id, "sync_completed", {
            timestamp: new Date().toISOString(),
            dataType: "full_profile"
          });
        } else {
          setSyncStatus("error");
        }
      } catch (error) {
        console.error("Sync error:", error);
        setSyncStatus("error");
      }
    };

    checkSyncStatus();
    const interval = setInterval(checkSyncStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    const user = getUser();
    if (!user) return;

    setSyncStatus("syncing");
    
    try {
      const data = await getFullUserFromFirebase(user.id);
      if (data.user) {
        setFirebaseData(data);
        setLastSync(new Date());
        setSyncStatus("synced");
        
        toast({
          title: "Синхронизация завершена",
          description: "Все данные успешно синхронизированы с Firebase"
        });
        
        await logUserAction(user.id, "manual_sync", {
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      setSyncStatus("error");
      toast({
        title: "Ошибка синхронизации",
        description: "Не удалось синхронизировать данные"
      });
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "synced":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "syncing":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case "error":
        return <WifiOff className="w-4 h-4 text-red-600" />;
      default:
        return <WifiOff className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case "synced":
        return "Синхронизировано";
      case "syncing":
        return "Синхронизация...";
      case "error":
        return "Ошибка";
      default:
        return "Нет соединения";
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case "synced":
        return "bg-green-100 text-green-800 border-green-200";
      case "syncing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const currentAI = AI_ASSISTANT_RESPONSES[userType];
  const interests = ["it", "medicine", "business", "engineering", "creative"];
  const interestLabels = {
    it: "IT и технологии",
    medicine: "Медицина",
    business: "Бизнес и экономика",
    engineering: "Инженерия",
    creative: "Творческие профессии"
  };

  if (showAI) {
    return (
      <div className="fixed top-20 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
        <Card className="shadow-lg border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                AI Ассистент AcademicApply
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setShowAI(false)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                {currentAI.greeting}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Выбери интересующее направление:</label>
              <div className="grid grid-cols-2 gap-2">
                {interests.map((interest) => (
                  <Button
                    key={interest}
                    size="sm"
                    variant={selectedInterest === interest ? "default" : "outline"}
                    onClick={() => setSelectedInterest(interest)}
                    className="text-xs h-8"
                  >
                    {interestLabels[interest as keyof typeof interestLabels]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-sm">Рекомендации по направлению</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentAI.interests[selectedInterest as keyof typeof currentAI.interests]}
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">Следующие шаги</span>
              </div>
              <p className="text-sm text-gray-700">
                {currentAI.nextSteps}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => setShowAI(false)}>
                Понятно, спасибо!
              </Button>
              <Button size="sm" variant="outline" onClick={handleManualSync}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Обновить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50 p-3 bg-card border border-border rounded-lg shadow-lg max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>
      
      {lastSync && (
        <p className="text-xs text-muted-foreground mb-2">
          Последняя синхронизация: {lastSync.toLocaleString('ru-RU')}
        </p>
      )}

      {firebaseData && (
        <div className="space-y-1 text-xs mb-2">
          <div className="flex justify-between">
            <span>Профиль:</span>
            <Badge variant={firebaseData.user ? "default" : "secondary"} className="text-xs">
              {firebaseData.user ? "Загружен" : "Нет"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Статистика:</span>
            <Badge variant={firebaseData.stats ? "default" : "secondary"} className="text-xs">
              {firebaseData.stats ? "Есть" : "Нет"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Прогресс:</span>
            <Badge variant={firebaseData.progress ? "default" : "secondary"} className="text-xs">
              {firebaseData.progress ? "Загружен" : "Нет"}
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Button 
          size="sm" 
          onClick={() => setShowAI(true)}
          className="w-full gap-2"
        >
          <MessageCircle className="w-3 h-3" />
          AI Ассистент
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleManualSync}
          disabled={syncStatus === "syncing"}
          className="w-full"
        >
          <RefreshCw className={`w-3 h-3 mr-1 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
          Синхронизировать
        </Button>
      </div>
    </div>
  );
};

export default SyncStatus;
