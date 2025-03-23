/**
 * BookmarkedCat Component
 *
 * This component displays a bookmarked cat based on the cat ID obtained from the URL parameters.
 * It fetches the cat's details from Firestore and loads the user's customization settings for the cat background
 * and border from Firestore using the authenticated user's ID.
 */

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCatDetails, getUserSettings } from "../service/firestoreService";
import { getAuthenticatedUserId } from "../helper/getAuthenticatedUserId";
import { shareCard } from "../helper/shareService";
import HomeIcon from "../assets/icons/HomeIcon";
import Share from "../assets/icons/Share";
import RainbowCatBorder from "../assets/CatBorders/RainbowCatBorder";
import DarkCatBorder from "../assets/CatBorders/DarkCatBorder";
import bow from "../assets/CatBackgrounds/bows.jpg";
import paws from "../assets/CatBackgrounds/paws.jpg";
import fancy from "../assets/CatBackgrounds/fancy.jpg";

interface CatData {
  name?: string;
  description?: string;
  imageUrl?: string;
}

const BookmarkedCat: React.FC = () => {
  const { catId } = useParams();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [cat, setCat] = useState<CatData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [catBg, setCatBg] = useState<string>(bow);
  const [catBgType, setCatBgType] = useState<string>("bows");
  const [userCatBorder, setUserCatBorder] = useState<string>("dark");

  useEffect(() => {
    const loadCustomization = async () => {
      const userId = getAuthenticatedUserId();
      if (!userId) return;
      const settings = await getUserSettings(userId);
      console.log("Fetched cat settings:", settings);
      if (settings && settings.catBackground) {
        const bg = settings.catBackground.toLowerCase();
        setCatBgType(bg);
        if (bg === "bows") {
          setCatBg(bow);
        } else if (bg === "fancy") {
          setCatBg(fancy);
        } else if (bg === "paws") {
          setCatBg(paws);
        } else {
          setCatBg(bow);
        }
      }
      if (settings && settings.catBorder) {
        setUserCatBorder(settings.catBorder.toLowerCase());
      }
    };
    loadCustomization();
  }, []);

  useEffect(() => {
    if (catId) {
      fetchCat(catId);
    }
  }, [catId]);

  const fetchCat = async (id: string) => {
    try {
      const catData = await getCatDetails(id);
      if (catData) {
        setCat(catData);
      } else {
        console.error("No cat data found for ID:", id);
      }
    } catch (error) {
      console.error("Error fetching cat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) {
      console.error("Card reference not found.");
      return;
    }
    try {
      const downloadURL = await shareCard(cardRef.current);
      console.log("Share link generated:", downloadURL);
      alert("Share link: " + downloadURL);
    } catch (error) {
      console.error("Error sharing cat card:", error);
    }
  };

  const borderComponent =
    userCatBorder === "rainbow" ? <RainbowCatBorder /> : <DarkCatBorder />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <button
        className="absolute top-6 left-6 text-white"
        onClick={() => navigate("/home")}
      >
        <HomeIcon />
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : cat ? (
        <div ref={cardRef} className="relative rounded-md py-5 px-5 overflow-hidden max-w-xs">
          <div className="absolute inset-0">
            <img src={catBg} alt="Cat background" className="object-cover w-full h-full" />
          </div>
          <div className="relative bg-slate-700 rounded-md z-10 overflow-hidden">
            <div className="p-1">
              <div className="inset-0 z-0">
                {borderComponent}
              </div>
              <img src={cat.imageUrl ?? ""} alt="Cat" className="relative z-10" />
            </div>
          </div>
          <div className="relative z-10 h-10 rounded-md p-1.5 flex space-x-1 justify-end">
            <button onClick={handleShare}>
              <Share />
            </button>
          </div>
          <div className="relative z-10">
            <p>Name: {cat.name || "Unnamed Cat"}</p>
          </div>
          <div className="relative z-10">
            <p className="break-words">Description: {cat.description || "No description."}</p>
          </div>
        </div>
      ) : (
        <p>Cat not found.</p>
      )}

      <button
        className="mt-4 bg-gray-700 px-4 py-2 rounded"
        onClick={() => navigate("/bookmarks")}
      >
        Back to Bookmarks
      </button>
    </div>
  );
};

export default BookmarkedCat;
