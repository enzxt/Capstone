/**
 * Layout Component
 *
 * Wraps the application content with a conditional background.
 * It receives the user's preferred background style and the current location,
 * and then renders the appropriate background component before displaying the children.
 */
import React from "react";
import { useLocation } from "react-router-dom";
import PinkBackground from "../assets/AppBackgrounds/PinkBackground.tsx";
import GreenBackground from "../assets/AppBackgrounds/GreenBackground.tsx";
import DarkBackground from "../assets/AppBackgrounds/DarkBackground.tsx";
interface LayoutProps {
  children: React.ReactNode;
  appBackground: string;
  location: ReturnType<typeof useLocation>;
}

export default function Layout({ children, appBackground, location }: LayoutProps) {
  return (
    <>
      <ConditionalBackground appBackground={appBackground} location={location} />
      <div className="relative z-10">{children}</div>
    </>
  );
}

function ConditionalBackground({
    appBackground,
    location
  }: {
    appBackground: string;
    location: ReturnType<typeof useLocation>;
  }) {
    console.log("ConditionalBackground: appBackground =", appBackground);
    
    if (location.pathname === "/pawssword-login") {
      return <GreenBackground />;
    }
  
    switch (appBackground) {
      case "Dark":
        return <DarkBackground />;
      case "Green/Purple":
        return <GreenBackground />;
      case "Pink":
      default:
        return <PinkBackground />;
    }
  }