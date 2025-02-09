import { auth, firestore } from "../database/firestore";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const checkOrCreateUser = async (user: User | null) => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // If the user document doesn't exist, create it
        await setDoc(userRef, {
            email: user.email,
            lastGeneratedCatId: null,
            lastGeneratedTimestamp: 0,
            bookmarks: [], // Empty array for future bookmarks
        });

        console.log("New Firestore user created:", user.uid);
    } else {
        console.log("User already exists in Firestore:", user.uid);
    }
};

// Runs this function whenever a user logs in
onAuthStateChanged(auth, async (user) => {
    await checkOrCreateUser(user);
});
