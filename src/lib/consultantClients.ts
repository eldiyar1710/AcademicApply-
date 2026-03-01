import { ref, get, query, orderByChild, equalTo, update, getDatabase } from "firebase/database";
import { app } from "./firebase";
import { User } from "./auth";

const db = getDatabase(app);

export interface Client {
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
    userType?: "school" | "graduate" | "student";
  };
  assignedExpertId: string;
  createdAt: string;
  updatedAt: string;
}

// Получить клиентов консультанта
export const getConsultantClients = async (consultantId: string): Promise<Client[]> => {
  try {
    console.debug("getConsultantClients: запрос клиентов консультанта", { consultantId });
    
    // Ищем пользователей с assignedExpertId равным ID консультанта
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      console.debug("getConsultantClients: пользователи не найдены");
      return [];
    }
    
    const users = snapshot.val();
    const clients: Client[] = [];
    
    for (const [userId, userData] of Object.entries(users)) {
      const user = userData as any;
      
      // Проверяем, что пользователь назначен этому консультанту
      if (user.assignedExpertId === consultantId) {
        const client: Client = {
          id: userId,
          name: user.name || "Без имени",
          email: user.contact || "",
          targetUniversity: user.profile?.dream || "Не указано",
          targetProgram: "Не указана", // Можно добавить в профиль
          progress: calculateProgress(user),
          lastMeeting: user.lastMeeting,
          nextMeeting: user.nextMeeting,
          status: determineStatus(user),
          profile: {
            gpa: user.profile?.gpa,
            ielts: user.profile?.ielts,
            dream: user.profile?.dream,
            userType: user.profile?.userType
          },
          assignedExpertId: user.assignedExpertId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt || user.createdAt
        };
        
        clients.push(client);
      }
    }
    
    console.debug("getConsultantClients: найдено клиентов", { count: clients.length });
    return clients;
    
  } catch (error) {
    console.error("getConsultantClients: ошибка получения клиентов", error);
    return [];
  }
};

// Рассчитать прогресс клиента на основе заполненности профиля
const calculateProgress = (user: any): number => {
  let progress = 0;
  const totalFields = 8;
  
  // Базовая информация
  if (user.name) progress += 1;
  if (user.contact) progress += 1;
  if (user.timezone) progress += 1;
  
  // Профиль
  if (user.profile?.userType) progress += 1;
  if (user.profile?.gpa) progress += 1;
  if (user.profile?.ielts) progress += 1;
  if (user.profile?.dream) progress += 1;
  
  // План
  if (user.plan && user.plan !== "free") progress += 1;
  
  return Math.round((progress / totalFields) * 100);
};

// Определить статус клиента
const determineStatus = (user: any): "active" | "completed" | "paused" => {
  // Если план истек, клиент на паузе
  if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
    return "paused";
  }
  
  // Если есть дата завершения, клиент завершен
  if (user.completedAt) {
    return "completed";
  }
  
  // По умолчанию активен
  return "active";
};

// Обновить информацию о встрече с клиентом
export const updateClientMeeting = async (clientId: string, meetingData: {
  lastMeeting?: string;
  nextMeeting?: string;
  meetingNotes?: string;
}) => {
  try {
    const updates: any = {
      updatedAt: new Date().toISOString(),
      ...meetingData
    };
    
    await update(ref(db, `users/${clientId}`), updates);
    console.debug("updateClientMeeting: встреча обновлена", { clientId, meetingData });
    return true;
  } catch (error) {
    console.error("updateClientMeeting: ошибка обновления встречи", error);
    return false;
  }
};

// Получить детальную информацию о клиенте
export const getClientDetails = async (clientId: string): Promise<Client | null> => {
  try {
    console.debug("getClientDetails: запрос детальной информации клиента", { clientId });
    
    const snapshot = await get(ref(db, `users/${clientId}`));
    
    if (!snapshot.exists()) {
      console.debug("getClientDetails: клиент не найден");
      return null;
    }
    
    const user = snapshot.val() as any;
    
    const client: Client = {
      id: clientId,
      name: user.name || "Без имени",
      email: user.contact || "",
      targetUniversity: user.profile?.dream || "Не указано",
      targetProgram: "Не указана",
      progress: calculateProgress(user),
      lastMeeting: user.lastMeeting,
      nextMeeting: user.nextMeeting,
      status: determineStatus(user),
      profile: {
        gpa: user.profile?.gpa,
        ielts: user.profile?.ielts,
        dream: user.profile?.dream,
        userType: user.profile?.userType
      },
      assignedExpertId: user.assignedExpertId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || user.createdAt
    };
    
    console.debug("getClientDetails: информация о клиенте получена", { name: client.name });
    return client;
    
  } catch (error) {
    console.error("getClientDetails: ошибка получения информации о клиенте", error);
    return null;
  }
};
