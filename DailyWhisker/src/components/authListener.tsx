/**
 * Auth Listener for Firestore User Creation
 *
 * Monitors Firebase Auth state and ensures each authenticated user
 * has a corresponding document in Firestore. Creates a default user
 * document if one does not exist.
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

        console.log("New Firestore user created");
    } else {
        console.log("User already exists in Firestore");
    }
};

onAuthStateChanged(auth, async (user) => {
    await checkOrCreateUser(user);
});
