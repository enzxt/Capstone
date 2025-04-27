/**
 * AuthHelper
 *
 * Provides methods to retrieve authenticated user info.
 *
 * - getAuthenticatedUser: Returns the current user from Firebase Auth or a decoded JWT from localStorage.
 */

import { jwtDecode } from "jwt-decode";
import { auth } from "../database/firestore";

export interface MyTokenPayload {
  id?: string;
  email?: string;
  name?: string;
}

/**
 * Returns authenticated user details from Firebase Auth or a decoded JWT.
 * @returns MyTokenPayload object if authenticated, otherwise null.
 */
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
