// import { getDatabase, ref, set, get, push, update, remove } from "firebase/database";
// import { app } from "./firebase";
import { User } from "./auth";

// const db = getDatabase(app);

const stripUndefined = (value: any): any => {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined) continue;
      out[k] = stripUndefined(v);
    }
    return out;
  }
  return value;
};

// Сохранить пользователя в localStorage
export const saveUserToDB = async (user: User) => {
  try {
    localStorage.setItem(`user_${user.id}`, JSON.stringify({
      ...stripUndefined(user),
      createdAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
    throw error;
  }
};

// Получить пользователя из localStorage
export const getUserFromDB = async (userId: string): Promise<User | null> => {
  try {
    console.debug("getUserFromDB: запрос пользователя", { userId });
    const data = localStorage.getItem(`user_${userId}`);
    if (data) {
      const userData = JSON.parse(data) as User;
      console.debug("getUserFromDB: пользователь найден", { name: userData.name, timezone: userData.timezone, contact: userData.contact });
      return userData;
    }
    console.debug("getUserFromDB: пользователь не найден");
    return null;
  } catch (error) {
    console.error("getUserFromDB: ошибка получения пользователя", error);
    return null;
  }
};

// Обновить профиль пользователя
export const updateUserInDB = async (userId: string, updates: Partial<User>) => {
  try {
    const existing = await getUserFromDB(userId);
    if (existing) {
      const updated = { ...existing, ...updates };
      await saveUserToDB(updated);
    }
    return true;
  } catch (error) {
    console.error("Error updating user in localStorage:", error);
    return false;
  }
};

// Получить всех пользователей (для админа)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_')) {
        const data = localStorage.getItem(key);
        if (data) {
          users.push(JSON.parse(data));
        }
      }
    }
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

// Сохранить прогресс пользователя
export const saveUserProgress = async (userId: string, progress: any) => {
  try {
    localStorage.setItem(`progress_${userId}`, JSON.stringify({
      ...progress,
      updatedAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
};

// Получить прогресс пользователя
export const getUserProgress = async (userId: string) => {
  try {
    const data = localStorage.getItem(`progress_${userId}`);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error getting progress:", error);
    return null;
  }
};

// Сохранить заявку пользователя
export const saveApplication = async (userId: string, application: any) => {
  try {
    const key = `application_${userId}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify({
      ...application,
      createdAt: new Date().toISOString()
    }));
    return key;
  } catch (error) {
    console.error("Error saving application:", error);
    return null;
  }
};

// Получить заявки пользователя
export const getUserApplications = async (userId: string) => {
  try {
    const applications: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`application_${userId}_`)) {
        const data = localStorage.getItem(key);
        if (data) {
          applications[key] = JSON.parse(data);
        }
      }
    }
    return applications;
  } catch (error) {
    console.error("Error getting applications:", error);
    return {};
  }
};
