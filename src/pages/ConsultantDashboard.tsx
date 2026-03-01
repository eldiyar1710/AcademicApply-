import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Star, 
  Clock, 
  Award,
  BookOpen,
  Target,
  Phone,
  Mail,
  Video,
  FileText,
  LogOut
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getUser, logout, isConsultant } from "@/lib/auth";
import { getConsultants, type Consultant } from "@/lib/consultant";
import { getConsultantClients } from "@/lib/consultantClients";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  targetUniversity: string;
  targetProgram: string;
  progress: number;
  lastMeeting?: string;
  nextMeeting?: string;
  status: "active" | "completed" | "paused";
  profile: {
    gpa?: string;
    ielts?: string;
    dream?: string;
  };
}

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(getUser());
  const [clients, setClients] = useState<Client[]>([]);
  const [profile, setProfile] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isConsultant(user)) {
      navigate("/dashboard");
      return;
    }
    loadConsultantData();
  }, [user, navigate]);

  const loadConsultantData = async () => {
    try {
      console.debug("ConsultantDashboard: загрузка данных консультанта");
      
      // Load consultant profile
      const consultants = await getConsultants();
      const consultantProfile = consultants.find(c => c.email === user?.contact);
      if (consultantProfile) {
        console.debug("ConsultantDashboard: профиль консультанта найден", { name: consultantProfile.name });
        setProfile(consultantProfile);
      }

      // Load clients
      if (user?.id) {
        const clientData = await getConsultantClients(user.id);
        console.debug("ConsultantDashboard: загружено клиентов", { count: clientData.length });
        setClients(clientData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("ConsultantDashboard: ошибка загрузки данных", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleScheduleMeeting = (clientId: string) => {
    toast({
      title: "Запланировать встречу",
      description: "Функция планирования встреч будет доступна скоро"
    });
  };

  const handleSendMessage = (clientId: string) => {
    toast({
      title: "Отправить сообщение",
      description: "Функция чата будет доступна скоро"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Загрузка данных консультанта...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Платформа консультанта</h1>
              <p className="text-muted-foreground mt-1">Управляйте клиентами и отслеживайте их прогресс</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>

          {/* Consultant Profile */}
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {profile.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mx-auto mb-2">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold">{profile.totalClients || 0}</div>
                    <div className="text-sm text-muted-foreground">Клиентов</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">{profile.successRate || 95}%</div>
                    <div className="text-sm text-muted-foreground">Успешность</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 mx-auto mb-2">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold">{profile.rating}</div>
                    <div className="text-sm text-muted-foreground">Рейтинг</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mx-auto mb-2">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold">{profile.experience}</div>
                    <div className="text-sm text-muted-foreground">Лет опыта</div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Специализации</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Образование</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {profile.education?.map((edu, index) => (
                        <li key={index}>• {edu}</li>
                      )) || <li>• Не указано</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{clients.filter(c => c.status === "active").length}</div>
                    <div className="text-sm text-muted-foreground">Активные клиенты</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{clients.filter(c => c.nextMeeting).length}</div>
                    <div className="text-sm text-muted-foreground">Встречи сегодня</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Новые сообщения</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-muted-foreground">Средний прогресс</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clients List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Мои клиенты
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Пока нет клиентов</h3>
                  <p className="text-muted-foreground">Клиенты появятся после назначения их вам</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clients.map((client) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {client.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{client.name}</h4>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <span className="text-sm font-medium">Цель:</span>
                              <p className="text-sm text-muted-foreground">{client.targetUniversity}</p>
                              <p className="text-sm text-muted-foreground">{client.targetProgram}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Данные:</span>
                              <p className="text-sm text-muted-foreground">GPA: {client.profile.gpa || "—"}</p>
                              <p className="text-sm text-muted-foreground">IELTS: {client.profile.ielts || "—"}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Прогресс:</span>
                              <span className="text-sm text-muted-foreground">{client.progress}%</span>
                            </div>
                            <Progress value={client.progress} className="h-2" />
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            {client.lastMeeting && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Последняя встреча: {client.lastMeeting}
                              </div>
                            )}
                            {client.nextMeeting && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Следующая встреча: {client.nextMeeting}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Badge 
                            variant={client.status === "active" ? "default" : "secondary"}
                          >
                            {client.status === "active" ? "Активен" : 
                             client.status === "completed" ? "Завершен" : "На паузе"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleScheduleMeeting(client.id)}
                          className="flex-1"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Запланировать встречу
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSendMessage(client.id)}
                          className="flex-1"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Отправить сообщение
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/client/${client.id}`)}
                        >
                          <FileText className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultantDashboard;
