/**
 * Token ID Helper
 *
 * Retrieves the user's ID from a stored authentication token in localStorage.
 */
import { jwtDecode } from "jwt-decode";

export interface MyTokenPayload {
  id?: string;
  email?: string;
  name?: string;
}

/**
 * Returns the user ID from a decoded JWT token, or null if unavailable.
 */
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    return decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
