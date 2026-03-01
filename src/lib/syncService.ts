import { getDatabase, ref, set, get, update, onValue, push } from "firebase/database";
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

// Полная синхронизация данных пользователя
export const syncUserToFirebase = async (user: User) => {
  try {
    // Сохраняем полный профиль пользователя
    await set(ref(db, `users/${user.id}`), {
      ...stripUndefined(user),
      lastSync: new Date().toISOString(),
      syncVersion: "1.0"
    });

    // Сохраняем статистику
    await set(ref(db, `stats/${user.id}`), {
      loginCount: 1,
      lastLogin: new Date().toISOString(),
      planHistory: [{
        plan: user.plan,
        activatedAt: user.planActivatedAt || new Date().toISOString(),
        expiresAt: user.planExpiresAt
      }]
    });

    // Сохраняем прогресс
    await set(ref(db, `progress/${user.id}`), {
      profile: user.profile,
      documents: {
        motivationLetter: user.profile.dream ? "in_progress" : "not_started",
        recommendations: "not_started",
        certificates: "not_started",
        portfolio: "not_started"
      },
      universities: [],
      applications: [],
      lastUpdated: new Date().toISOString()
    });

    console.log("User data synced to Firebase:", user.id);
    return true;
  } catch (error) {
    console.error("Error syncing user to Firebase:", error);
    return false;
  }
};

// Получить полные данные пользователя из Firebase
export const getFullUserFromFirebase = async (userId: string) => {
  try {
    const userSnapshot = await get(ref(db, `users/${userId}`));
    const statsSnapshot = await get(ref(db, `stats/${userId}`));
    const progressSnapshot = await get(ref(db, `progress/${userId}`));

    return {
      user: userSnapshot.exists() ? userSnapshot.val() : null,
      stats: statsSnapshot.exists() ? statsSnapshot.val() : null,
      progress: progressSnapshot.exists() ? progressSnapshot.val() : null
    };
  } catch (error) {
    console.error("Error getting user from Firebase:", error);
    return { user: null, stats: null, progress: null };
  }
};

// Обновить конкретное поле пользователя
export const updateUserField = async (userId: string, field: string, value: any) => {
  try {
    await update(ref(db, `users/${userId}`), {
      [field]: value,
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating user field:", error);
    return false;
  }
};

// Реальное время обновление данных
export type RealtimeSyncUpdate =
  | { type: "user"; data: any }
  | { type: "progress"; data: any }
  | { type: "stats"; data: any };

export const setupRealtimeSync = (userId: string, onUpdate: (data: RealtimeSyncUpdate) => void) => {
  const userRef = ref(db, `users/${userId}`);

  const unsubUser = onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate({ type: "user", data: snapshot.val() });
    }
  });

  // Слушаем изменения в прогрессе
  const progressRef = ref(db, `progress/${userId}`);
  const unsubProgress = onValue(progressRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate({ type: "progress", data: snapshot.val() });
    }
  });

  // Слушаем изменения в статистике
  const statsRef = ref(db, `stats/${userId}`);
  const unsubStats = onValue(statsRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate({ type: "stats", data: snapshot.val() });
    }
  });

  return () => {
    unsubUser();
    unsubProgress();
    unsubStats();
  };
};

// Сохранить действие пользователя
export const logUserAction = async (userId: string, action: string, details?: any) => {
  try {
    const actionRef = ref(db, `actions/${userId}`);
    const newActionRef = push(actionRef);
    
    await set(newActionRef, {
      action,
      details,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
    });
    
    return newActionRef.key;
  } catch (error) {
    console.error("Error logging user action:", error);
    return null;
  }
};

// Получить историю действий
export const getUserActions = async (userId: string, limit: number = 50) => {
  try {
    const snapshot = await get(ref(db, `actions/${userId}`));
    if (snapshot.exists()) {
      const actions = snapshot.val();
      const actionArray = Object.keys(actions).map(key => ({
        id: key,
        ...actions[key]
      }));
      
      // Сортируем по времени и ограничиваем
      return actionArray
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error("Error getting user actions:", error);
    return [];
  }
};
