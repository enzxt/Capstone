/**
 * Retrieves the authenticated user's ID.
 *
 * First checks Firebase Auth's currentUser for a UID. If unavailable,
 * it retrieves the auth token from localStorage, decodes it using jwtDecode,
 * and returns the user ID from the token payload if present.
 * Returns null if no valid user ID is found.
 */
import { jwtDecode } from "jwt-decode";
import { auth } from "../database/firestore";

interface MyTokenPayload {
  id?: string | number;
}

export function getAuthenticatedUserId(): string | null {
  const firebaseUser = auth.currentUser;
  if (firebaseUser?.uid) {
    return firebaseUser.uid;
  }

  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    if (decoded.id) {
      return String(decoded.id);
    }
  } catch (err) {
    console.error("Error decoding token:", err);
  }
  return null;
}
