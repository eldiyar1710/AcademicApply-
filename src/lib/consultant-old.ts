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
  createdAt: Timestamp;
}

export interface Meeting {
  id?: string;
  consultantId: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: Timestamp;
  duration: number; // minutes
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  meetingLink?: string;
  createdAt: Timestamp;
}

// Добавить консультанта
export const addConsultant = async (consultant: Omit<Consultant, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "consultants"), {
      ...consultant,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding consultant:", error);
    return null;
  }
};

// Получить всех консультантов
export const getConsultants = async (): Promise<Consultant[]> => {
  try {
    const q = query(collection(db, "consultants"), orderBy("rating", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Consultant));
  } catch (error) {
    console.error("Error getting consultants:", error);
    return [];
  }
};

// Получить консультантов по специализации
export const getConsultantsBySpecialization = async (specialization: string): Promise<Consultant[]> => {
  try {
    const q = query(
      collection(db, "consultants"), 
      where("specialization", "array-contains", specialization),
      orderBy("rating", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Consultant));
  } catch (error) {
    console.error("Error getting consultants by specialization:", error);
    return [];
  }
};

// Запланировать встречу
export const scheduleMeeting = async (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "meetings"), {
      ...meeting,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return null;
  }
};

// Получить встречи пользователя
export const getUserMeetings = async (userId: string): Promise<Meeting[]> => {
  try {
    const q = query(
      collection(db, "meetings"), 
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Meeting));
  } catch (error) {
    console.error("Error getting user meetings:", error);
    return [];
  }
};

// Обновить статус встречи
export const updateMeetingStatus = async (meetingId: string, status: Meeting['status'], notes?: string) => {
  try {
    const meetingRef = doc(db, "meetings", meetingId);
    await updateDoc(meetingRef, { 
      status,
      ...(notes && { notes })
    });
    return true;
  } catch (error) {
    console.error("Error updating meeting status:", error);
    return false;
  }
};
