import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { seedConsultants } from "@/lib/seedData";

const SeedDataButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await seedConsultants();
      toast({
        title: "Данные добавлены",
        description: "Консультанты успешно добавлены в Firebase",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить данные консультантов",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSeedData} 
      disabled={loading}
      variant="outline"
      className="fixed bottom-4 right-4 z-50"
    >
      {loading ? "Загрузка..." : "Добавить консультантов"}
    </Button>
  );
};

export default SeedDataButton;
