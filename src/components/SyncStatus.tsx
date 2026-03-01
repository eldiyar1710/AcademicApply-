import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/auth";
import { getFullUserFromFirebase, logUserAction } from "@/lib/syncService";
import { useToast } from "@/hooks/use-toast";

const SyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error" | "offline">("offline");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSyncStatus = async () => {
      const user = getUser();
      if (!user) {
        setSyncStatus("offline");
        return;
      }

      try {
        setSyncStatus("syncing");
        const data = await getFullUserFromFirebase(user.id);
        
        if (data.user) {
          setFirebaseData(data);
          setLastSync(new Date(data.user.lastSync || Date.now()));
          setSyncStatus("synced");
          
          // Логируем действие синхронизации
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

    // Проверяем статус каждые 30 секунд
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
        <div className="space-y-1 text-xs">
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

      <Button 
        size="sm" 
        onClick={handleManualSync}
        disabled={syncStatus === "syncing"}
        className="w-full mt-2"
      >
        <RefreshCw className={`w-3 h-3 mr-1 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
        Синхронизировать
      </Button>
    </div>
  );
};

export default SyncStatus;
