import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Star, Calendar, MessageSquare, Clock, 
  Filter, Search, Video, MapPin, Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Consultant, getConsultants, scheduleMeeting } from "@/lib/consultant";
import { getUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const specializations = [
  "MIT", "Stanford", "Harvard", "IELTS", "GRE", "Эссе", "Документы"
];

const ConsultantList = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filtered, setFiltered] = useState<Consultant[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>("Все");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const user = getUser();

  useEffect(() => {
    loadConsultants();
  }, []);

  useEffect(() => {
    filterConsultants();
  }, [consultants, selectedSpec, search]);

  const loadConsultants = async () => {
    setLoading(true);
    console.debug("ConsultantList: загрузка консультантов");
    try {
      const data = await getConsultants();
      console.debug("ConsultantList: получено консультантов", { count: data.length, data });
      setConsultants(data);
    } catch (error) {
      console.error("ConsultantList: ошибка загрузки консультантов", error);
    } finally {
      setLoading(false);
    }
  };

  const filterConsultants = () => {
    let filtered = consultants;
    
    if (selectedSpec !== "Все") {
      filtered = filtered.filter(c => c.specialization.includes(selectedSpec));
    }
    
    if (search) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.bio.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFiltered(filtered);
  };

  const handleScheduleMeeting = async (consultantId: string) => {
    if (!user) {
      toast({ title: "Ошибка", description: "Сначала войдите в систему" });
      return;
    }

    const meetingData = {
      consultantId,
      userId: user.id,
      userName: user.name,
      userEmail: user.contact,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Завтра
      duration: 60,
      status: "scheduled" as const
    };

    const meetingId = await scheduleMeeting(meetingData);
    if (meetingId) {
      toast({ 
        title: "Встреча запланирована", 
        description: "Консультант свяжется с вами в течение 24 часов" 
      });
    } else {
      toast({ 
        title: "Ошибка", 
        description: "Не удалось запланировать встречу" 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск консультантов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="Все">Все специализации</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Список консультантов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((consultant, idx) => (
          <motion.div
            key={consultant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{consultant.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {consultant.rating}
                  </div>
                </div>
              </div>
              <Badge variant={consultant.available ? "default" : "secondary"}>
                {consultant.available ? "Доступен" : "Занят"}
              </Badge>
            </div>

            {/* Специализации */}
            <div className="flex flex-wrap gap-1 mb-3">
              {consultant.specialization.slice(0, 3).map((spec, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {consultant.specialization.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{consultant.specialization.length - 3}
                </Badge>
              )}
            </div>

            {/* Описание */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {consultant.bio}
            </p>

            {/* Детали */}
            <div className="space-y-2 mb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {consultant.experience} лет опыта
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {consultant.universities.slice(0, 2).join(", ")}
              </div>
              <div className="flex items-center gap-2">
                <Languages className="w-3 h-3" />
                {consultant.languages.join(", ")}
              </div>
            </div>

            {/* Цена и действие */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-lg font-bold text-foreground">${consultant.price}</p>
                <p className="text-xs text-muted-foreground">за час</p>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleScheduleMeeting(consultant.id!)}
                disabled={!consultant.available}
                className="gap-2"
              >
                <Video className="w-4 h-4" />
                Записаться
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Консультанты не найдены</p>
        </div>
      )}
    </div>
  );
};

export default ConsultantList;
