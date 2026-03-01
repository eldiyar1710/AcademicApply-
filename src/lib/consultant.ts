import { getDatabase, ref, set, get, push, update, remove } from "firebase/database";
import { app } from "./firebase";

const db = getDatabase(app);

export interface Consultant {
  id?: string;
  name: string;
  email: string;
  specialization: string[];
  experience: number;
  rating: number;
  price: number;
  available: boolean;
  languages: string[];
  universities: string[];
  bio: string;
  avatar?: string;
  createdAt: string;
  // Additional fields for dashboard
  totalClients?: number;
  successRate?: number;
  education?: string[];
  achievements?: string[];
  availability?: string[];
}

export interface Meeting {
  id?: string;
  consultantId: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  duration: number; // minutes
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  meetingLink?: string;
  createdAt: string;
}

// Добавить консультанта
export const addConsultant = async (consultant: Omit<Consultant, 'id' | 'createdAt'>) => {
  try {
    const newConsultantRef = push(ref(db, "consultants"));
    await set(newConsultantRef, {
      ...consultant,
      createdAt: new Date().toISOString()
    });
    return newConsultantRef.key;
  } catch (error) {
    console.error("Error adding consultant:", error);
    return null;
  }
};

// Получить всех консультантов
export const getConsultants = async (): Promise<Consultant[]> => {
  try {
    console.debug("getConsultants: запрос всех консультантов из Firebase");
    const snapshot = await get(ref(db, "consultants"));
    if (snapshot.exists()) {
      const consultants = snapshot.val();
      console.debug("getConsultants: данные получены", { raw: consultants });
      const result = Object.keys(consultants).map(key => ({
        id: key,
        ...consultants[key]
      })) as Consultant[];
      console.debug("getConsultants: обработано консультантов", { count: result.length });
      return result;
    }
    console.debug("getConsultants: консультанты не найдены в Firebase");
    return [];
  } catch (error) {
    console.error("getConsultants: ошибка получения консультантов", error);
    return [];
  }
};

// Получить консультантов по специализации
export const getConsultantsBySpecialization = async (specialization: string): Promise<Consultant[]> => {
  try {
    const snapshot = await get(ref(db, "consultants"));
    if (snapshot.exists()) {
      const consultants = snapshot.val();
      return Object.keys(consultants)
        .filter(key => consultants[key].specialization.includes(specialization))
        .map(key => ({
          id: key,
          ...consultants[key]
        })) as Consultant[];
    }
    return [];
  } catch (error) {
    console.error("Error getting consultants by specialization:", error);
    return [];
  }
};

// Запланировать встречу
export const scheduleMeeting = async (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
  try {
    const newMeetingRef = push(ref(db, "meetings"));
    await set(newMeetingRef, {
      ...meeting,
      createdAt: new Date().toISOString()
    });
    return newMeetingRef.key;
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return null;
  }
};

// Получить встречи пользователя
export const getUserMeetings = async (userId: string): Promise<Meeting[]> => {
  try {
    const snapshot = await get(ref(db, "meetings"));
    if (snapshot.exists()) {
      const meetings = snapshot.val();
      return Object.keys(meetings)
        .filter(key => meetings[key].userId === userId)
        .map(key => ({
          id: key,
          ...meetings[key]
        })) as Meeting[];
    }
    return [];
  } catch (error) {
    console.error("Error getting user meetings:", error);
    return [];
  }
};

// Обновить статус встречи
export const updateMeetingStatus = async (meetingId: string, status: Meeting['status'], notes?: string) => {
  try {
    const meetingRef = ref(db, `meetings/${meetingId}`);
    await update(meetingRef, { 
      status,
      ...(notes && { notes })
    });
    return true;
  } catch (error) {
    console.error("Error updating meeting status:", error);
    return false;
  }
};
