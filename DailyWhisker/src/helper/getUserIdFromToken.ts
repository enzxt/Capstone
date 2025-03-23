/**
 * getUserIdFromToken
 *
 * The getUserIdFromToken function retrieves the "authToken" from localStorage,
 * decodes it using jwtDecode, and returns the user's id as a string if present.
 * It returns null if the token is missing or if decoding fails.
 */
import { jwtDecode } from "jwt-decode";

export interface MyTokenPayload {
  id?: string;
  email?: string;
  name?: string;
}

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
