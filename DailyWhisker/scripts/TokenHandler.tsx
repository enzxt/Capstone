/**
 * TokenHandler Component
 *
 * This component extracts an authentication token from the URL query parameters,
 * decodes it to retrieve user information, stores the token in localStorage, ensures
 * that the corresponding user document exists in Firestore, invokes the onAuthSuccess
 * callback, and finally navigates the user to the Home page.
 */
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { createUserDocIfNotExists } from "../src/service/firestoreService";

interface TokenHandlerProps {
  onAuthSuccess: () => void;
}

interface MyTokenPayload {
  email?: string;
  name?: string;
  id?: string;
}

const TokenHandler: React.FC<TokenHandlerProps> = ({ onAuthSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      console.log("TokenHandler: token found =>", token);
      localStorage.setItem("authToken", token);

      try {
        const decoded = jwtDecode<MyTokenPayload>(token);
        console.log("Decoded token:", decoded);

        if (decoded.id) {
          console.log("Creating/Checking Firestore doc by user ID:", decoded.id);
          console.log("Type of createUserDocIfNotExists:", typeof createUserDocIfNotExists);
          createUserDocIfNotExists(decoded.id, decoded.email ?? "")
            .then(() => {
              console.log("Firestore doc ensured for ID:", decoded.id);
            })
            .catch((err) => {
              console.error("Error ensuring user doc:", err);
            });
        } else {
          console.warn("No 'id' found in token payload. Cannot create user doc by ID.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }

      onAuthSuccess();
    } else {
      console.warn("TokenHandler: No token found in query params.");
    }

    navigate("/home", { replace: true });
  }, [location, navigate, onAuthSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing authentication...</p>
    </div>
  );
};

export default TokenHandler;
