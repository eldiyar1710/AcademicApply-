import { getDatabase, ref, set, get, push, update, remove } from "firebase/database";
import { app } from "./firebase";
import { User } from "./auth";

const db = getDatabase(app);

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

// Сохранить пользователя в Realtime Database
export const saveUserToDB = async (user: User) => {
  try {
    await set(ref(db, `users/${user.id}`), {
      ...stripUndefined(user),
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving user to DB:", error);
    throw error;
  }
};

// Получить пользователя из Realtime Database
export const getUserFromDB = async (userId: string): Promise<User | null> => {
  try {
    console.debug("getUserFromDB: запрос пользователя", { userId });
    const snapshot = await get(ref(db, `users/${userId}`));
    if (snapshot.exists()) {
      const userData = snapshot.val() as User;
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
    await update(ref(db, `users/${userId}`), stripUndefined(updates));
    return true;
  } catch (error) {
    console.error("Error updating user in DB:", error);
    return false;
  }
};

// Получить всех пользователей (для админа)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const snapshot = await get(ref(db, 'users'));
    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.values(users) as User[];
    }
    return [];
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

// Сохранить прогресс пользователя
export const saveUserProgress = async (userId: string, progress: any) => {
  try {
    await set(ref(db, `progress/${userId}`), {
      ...progress,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
};

// Получить прогресс пользователя
export const getUserProgress = async (userId: string) => {
  try {
    const snapshot = await get(ref(db, `progress/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val();
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
    const newApplicationRef = push(ref(db, `applications/${userId}`));
    await set(newApplicationRef, {
      ...application,
      createdAt: new Date().toISOString()
    });
    return newApplicationRef.key;
  } catch (error) {
    console.error("Error saving application:", error);
    return null;
  }
};

// Получить заявки пользователя
export const getUserApplications = async (userId: string) => {
  try {
    const snapshot = await get(ref(db, `applications/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error("Error getting applications:", error);
    return {};
  }
};
