import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export interface UserProgress {
  userId: string;
  completedTasks: string[];
  currentPlan: string;
  gpa: number;
  ieltsScore: number;
  targetUniversities: string[];
  lastUpdated: Date;
}

export const saveUserProgress = async (userId: string, progress: Partial<UserProgress>) => {
  try {
    const userRef = doc(db, "userProgress", userId);
    await setDoc(userRef, {
      ...progress,
      lastUpdated: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving user progress:", error);
    return false;
  }
};

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const userRef = doc(db, "userProgress", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProgress;
    }
    return null;
  } catch (error) {
    console.error("Error getting user progress:", error);
    return null;
  }
};
