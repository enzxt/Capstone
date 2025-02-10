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
 * Service module for handling user authentication and Firestore operations.
 *
 * This module provides functions for:
 * - User authentication (login, logout, registration, password reset).
 * - User Firestore document management.
 * - Managing bookmarked cats and last generated cat tracking.
 * 
 * Dependencies:
 * - Firebase Authentication for user management.
 * - Firebase Firestore for database operations.
 * - `auth` and `firestore` instances from the project database configuration.
 */


/**
 * Handles user sign-in with email and password.
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
 * Creates the users Firestore document
 */
export const createUserDocIfNotExists = async (uid: string, email: string) => {
  try {
    const userRef = doc(firestore, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log("Creating new Firestore user document...");
      await setDoc(userRef, {
        email: email,
        lastGeneratedCatId: null,
        lastGeneratedTimestamp: null,
        bookmarks: [],
      });

      console.log("Firestore document created for user:", uid);
    } else {
      console.log("ℹ️ User document already exists:", uid);
    }
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Failed to create user document.");
  }
};

/**
 * Handles user registration.
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
  
      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        lastGeneratedCatId: null,
        lastGeneratedTimestamp: 0,
      });
  
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
      navigate("/login");
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
 * Fetches the authenticated user's Firestore document.
 */
export const getUserData = async (uid: string) => {
  try {
    const userRef = doc(firestore, "users", uid);
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
 * Saves the last generated cat ID and timestamp for the user.
 */
export const updateLastGeneratedCat = async (uid: string, catId: string) => {
  try {
    const userRef = doc(firestore, "users", uid);
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
 * Saves a bookmarked cat in the user's bookmarks subcollection.
 */
export const bookmarkCat = async (uid: string, catId: string) => {
  try {
    const userBookmarksCollection = collection(
      firestore,
      `users/${uid}/bookmarks`
    );
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
 * Fetches bookmarked cats from the user's Firestore subcollection.
 */
export const getBookmarkedCats = async (uid: string) => {
  try {
    const userBookmarksCollection = collection(
      firestore,
      `users/${uid}/bookmarks`
    );
    const querySnapshot = await getDocs(userBookmarksCollection);

    const bookmarks = querySnapshot.docs.map((doc) => ({
      catId: doc.data().catId,
      timestamp: doc.data().timestamp,
    }));

    console.log("Fetched bookmarked cats:", bookmarks);
    return bookmarks;
  } catch (error) {
    console.error("Error fetching bookmarked cats:", error);
    throw error;
  }
};

/**
 * Fetches cat id and timestamp  
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