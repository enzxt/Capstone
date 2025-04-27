/**
 * Authenticated User ID Helper
 *
 * Retrieves the authenticated user's ID from Firebase Auth or a decoded JWT.
 */
import { jwtDecode } from "jwt-decode";
import { auth } from "../database/firestore";

interface MyTokenPayload {
  id?: string | number;
}

/**
 * Returns the authenticated user's ID from Firebase Auth or JWT.
 * @returns User ID as a string, or null if not authenticated.
 */
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
