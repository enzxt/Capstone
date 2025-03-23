/**
 * AuthHelper
 * 
 * Returns the authenticated user information.
 * First checks Firebase Auth's currentUser.
 * If that is null, checks localStorage for a custom JWT,
 * decodes it, and returns the user info.
 * If neither is available, returns null.
 */
import { jwtDecode } from "jwt-decode";
import { auth } from "../database/firestore";

export interface MyTokenPayload {
  id?: string;
  email?: string;
  name?: string;
}

export const getAuthenticatedUser = (): MyTokenPayload | null => {
  if (auth.currentUser) {
    return {
      id: auth.currentUser.uid,
      email: auth.currentUser.email || undefined,
      name: auth.currentUser.displayName || undefined,
    };
  }
  
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
