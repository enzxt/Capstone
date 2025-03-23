import { auth, firestore } from "../database/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * Survey status interface for Firestore
 */
export interface SurveyStatus {
  skipped: boolean;
  completed: boolean;
  answers: Record<string, any>;
  retaking?: boolean;
}

/**
 * Creates a default survey doc at /users/{uid}/survey/status if it does not exist.
 */
export const createSurveyDocIfNotExists = async (uid: string) => {
  const surveyRef = doc(firestore, "users", uid, "survey", "status");
  const surveySnap = await getDoc(surveyRef);

  if (!surveySnap.exists()) {
    console.log("Creating new survey status doc...");
    const defaultStatus: SurveyStatus = {
      skipped: false,
      completed: false,
      answers: {},
    };
    await setDoc(surveyRef, defaultStatus);
    console.log("Survey status created for user:", uid);
  } else {
    console.log("ℹ️ Survey status doc already exists for user:", uid);
  }
};

/**
 * Updates the user's survey status doc, merging new fields.
 */
export const updateSurveyStatus = async (
  uid: string,
  data: Partial<SurveyStatus>
) => {
  const surveyRef = doc(firestore, "users", uid, "survey", "status");
  await updateDoc(surveyRef, data);
  console.log("Survey status updated for user:", uid, data);
};

/**
 * Handles user sign-in with email and password.
 * Creates user doc (and survey doc) if it doesn't exist, using user.uid as doc ID.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Attempting login...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Login successful:", user.email);

    await createUserDocIfNotExists(user.uid, user.email ?? "");

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid email or password.");
  }
};

/**
 * Creates the user's Firestore document with the given ID and email if it doesn't exist.
 * Also creates a default survey doc.
 */
export const createUserDocIfNotExists = async (
  userId: string | number,
  email?: string
) => {
  try {
    const userIdStr = String(userId);

    const userRef = doc(firestore, "users", userIdStr);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log("Creating new Firestore user document for ID:", userIdStr);

      const docData: {
        email?: string | null;
        lastGeneratedCatId: null;
        lastGeneratedTimestamp: null;
      } = {
        lastGeneratedCatId: null,
        lastGeneratedTimestamp: null,
      };

      if (email) {
        docData.email = email;
      } else {
        docData.email = null;
      }

      await setDoc(userRef, docData);
      console.log("Firestore document created for user:", userIdStr);
    } else {
      console.log("ℹ️ User document already exists:", userIdStr);
    }

    await createSurveyDocIfNotExists(userIdStr);

  } catch (error: any) {
    console.error("Error creating user document:", error.message, error.code);
    throw new Error("Failed to create user document.");
  }
};


/**
 * Handles user registration with Firebase Auth.
 * Uses user.uid as doc ID.
 */
export const registerUser = async (
  email: string,
  password: string,
  navigate: (path: string) => void
) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User registered successfully:", user);

    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      lastGeneratedCatId: null,
      lastGeneratedTimestamp: 0,
    });

    await createSurveyDocIfNotExists(user.uid);

    navigate("/login");
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Logs out the current user.
 */
export const logoutUser = async (navigate: (path: string) => void) => {
  try {
    await signOut(auth);
    console.log("User logged out");
    navigate("/choice");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/**
 * Sends a password reset email.
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

/**
 * Fetches the authenticated user's Firestore document by ID.
 */
export const getUserData = async (userId: string) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("Fetched user data:", userSnap.data());
      return userSnap.data();
    } else {
      console.warn("No user document found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

/**
 * Saves the last generated cat ID and timestamp for the user at doc users/<userId>.
 */
export const updateLastGeneratedCat = async (userId: string, catId: string) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const timestamp = Timestamp.now().toMillis();

    await updateDoc(userRef, {
      lastGeneratedCatId: catId,
      lastGeneratedTimestamp: timestamp,
    });

    console.log("Updated last generated cat:", catId);
  } catch (error) {
    console.error("Error updating last generated cat:", error);
    throw error;
  }
};

/**
 * Saves a bookmarked cat in the user's bookmarks subcollection (users/<userId>/bookmarks).
 */
export const bookmarkCat = async (userId: string, catId: string) => {
  try {
    const userBookmarksCollection = collection(firestore, `users/${userId}/bookmarks`);
    const existingBookmarks = await getDocs(userBookmarksCollection);
    const isAlreadyBookmarked = existingBookmarks.docs.some(
      (doc) => doc.data().catId === catId
    );

    if (isAlreadyBookmarked) {
      console.log("Cat already bookmarked, skipping duplicate.");
      return;
    }

    await addDoc(userBookmarksCollection, {
      catId,
      timestamp: Timestamp.now().toMillis(),
    });

    console.log("Cat bookmarked successfully:", catId);
  } catch (error) {
    console.error("Error bookmarking cat:", error);
    throw error;
  }
};

/**
 * Fetches bookmarked cats from the user's Firestore subcollection (users/<userId>/bookmarks).
 */
export const getBookmarkedCats = async (uid: string) => {
  try {
    const userBookmarksCollection = collection(firestore, `users/${uid}/bookmarks`);
    const querySnapshot = await getDocs(userBookmarksCollection);

    const bookmarks = querySnapshot.docs.map((doc) => ({
      catId: doc.data().catId,
      timestamp: doc.data().timestamp,
      note: doc.data().note || "",
    }));

    console.log("Fetched bookmarked cats:", bookmarks);
    return bookmarks;
  } catch (error) {
    console.error("Error fetching bookmarked cats:", error);
    throw error;
  }
};


/**
 * Fetches cat details by ID from the "cats" collection.
 */
export const getCatDetails = async (catId: string) => {
  try {
    const catRef = doc(firestore, "cats", catId);
    const catSnap = await getDoc(catRef);

    if (catSnap.exists()) {
      console.log(`Fetched cat details for ID: ${catId}`, catSnap.data());
      return catSnap.data();
    } else {
      console.warn(`No cat found in Firestore for ID: ${catId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching cat details for ID: ${catId}`, error);
    throw error;
  }
};
/**
 * Updates or creates the user's settings document in Firestore.
 * The document is stored under "users/{userId}/settings/preferences" and is updated with merge.
 */
export async function updateUserSettings(userId: string, settings: any): Promise<any> {
  const settingsRef = doc(firestore, "users", userId, "settings", "preferences");
  await setDoc(settingsRef, settings, { merge: true });
  
  const updatedSettingsSnap = await getDoc(settingsRef);
  return updatedSettingsSnap.exists() ? updatedSettingsSnap.data() : null;
}

/**
 * Retrieves the user's settings document from Firestore.
 * The document is located at "users/{userId}/settings/preferences".
 */
export async function getUserSettings(userId: string): Promise<any | null> {
  const settingsRef = doc(firestore, "users", userId, "settings", "preferences");
  const docSnap = await getDoc(settingsRef);
  return docSnap.exists() ? docSnap.data() : null;
}
