/**
 * User Firestore Document Checker and Creator
 *
 * Listens for authentication state changes via Firebase Auth and verifies that
 * a corresponding user document exists in Firestore. If not, it creates a new
 * user document with default fields.
 */
import { auth, firestore } from "../database/firestore";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const checkOrCreateUser = async (user: User | null) => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            email: user.email,
            lastGeneratedCatId: null,
            lastGeneratedTimestamp: 0,
            bookmarks: [],
        });

        console.log("New Firestore user created:", user.uid);
    } else {
        console.log("User already exists in Firestore:", user.uid);
    }
};

onAuthStateChanged(auth, async (user) => {
    await checkOrCreateUser(user);
});
