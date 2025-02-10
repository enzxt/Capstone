import { firestore, auth } from "../database/firestore";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  Timestamp,
  addDoc,
} from "firebase/firestore";

/**
 * Service module for handling cat-related operations in Firestore.
 *
 * This module provides functions to:
 * - Retrieve the last generated cat for a user.
 * - Fetch a cat's details by its unique ID.
 * - Generate a new random cat and update Firestore.
 * - Bookmark a cat to the user's saved list.
 * 
 * Dependencies:
 * - Firebase Firestore SDK for database operations.
 * - `firestore` and `auth` instances from the database configuration.
 */


/**
 * Fetches the last generated cat for the user.
 */
export const getLastGeneratedCat = async (uid: string) => {
  try {
    const userRef = doc(firestore, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("User Firestore data:", userSnap.data());
      return userSnap.data();
    } else {
      console.warn("No user document found. Creating a new one...");
      await setDoc(userRef, {
        email: auth.currentUser?.email ?? "",
        lastGeneratedCatId: null,
        lastGeneratedTimestamp: null,
      });
      return null;
    }
  } catch (error) {
    console.error("Error fetching last generated cat:", error);
    throw error;
  }
};

/**
 * Fetches a cat by its ID from the "cats" collection.
 */
export const fetchCat = async (catId: string | null) => {
  if (!catId) return null;
  try {
    const catRef = doc(firestore, "cats", catId);
    const catSnap = await getDoc(catRef);

    if (catSnap.exists()) {
      console.log("Cat data retrieved:", catSnap.data());
      return catSnap.data();
    } else {
      console.warn("Cat document not found for ID:", catId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching cat document:", error);
    throw error;
  }
};

/**
 * Generates a new cat and updates Firestore.
 */
export const generateNewCat = async (uid: string) => {
  try {
    console.log("Checking available cats from Firestore...");
    const catsCollection = collection(firestore, "cats");
    const querySnapshot = await getDocs(catsCollection);

    if (querySnapshot.empty) {
      console.error("No cats found in Firestore");
      return null;
    }

    const catDocs = querySnapshot.docs.map((doc) => doc.id);
    const newCatId = catDocs[Math.floor(Math.random() * catDocs.length)];
    console.log("Selected new cat:", newCatId);

    const timestamp = Timestamp.now().toMillis();

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, {
      lastGeneratedCatId: newCatId,
      lastGeneratedTimestamp: timestamp,
    });

    console.log("Stored last generated cat in user root:", newCatId);
    return newCatId;
  } catch (error) {
    console.error("Error generating new cat:", error);
    throw error;
  }
};

/**
 * Saves a cat to the user's bookmark subcollection.
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
