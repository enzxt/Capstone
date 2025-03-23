/**
 * Cat Component
 *
 * This component retrieves user customization settings, fetches a cat image (either reusing the last generated one or generating a new one),
 * displays the cat along with its name and description, and provides actions for bookmarking, sharing, and downloading the cat card.
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLastGeneratedCat, fetchCat, generateNewCat, bookmarkCat } from "../service/catService";
import { getAuthenticatedUser, MyTokenPayload } from "../helper/authHelper";
import { getUserSettings } from "../service/firestoreService";
import { getAuthenticatedUserId } from "../helper/getAuthenticatedUserId";
import Heart from "../assets/icons/Heart";
import Bookmark from "../assets/icons/Bookmark";
import Share from "../assets/icons/Share";
import RainbowCatBorder from "../assets/CatBorders/RainbowCatBorder";
import DarkCatBorder from "../assets/CatBorders/DarkCatBorder";
import bow from "../assets/CatBackgrounds/bows.jpg";
import paws from "../assets/CatBackgrounds/paws.jpg";
import fancy from "../assets/CatBackgrounds/fancy.jpg";
import HomeIcon from "../assets/icons/HomeIcon";
import { shareCard } from "../helper/shareService";
import html2canvas from "html2canvas";
import Download from '../assets/icons/Download';

const Cat = () => {
  const [link, setLink] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [catId, setCatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [catMessage, setCatMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");
  const [shareLink, setShareLink] = useState<string | null>(null);

  const [catBg, setCatBg] = useState<string>(bow);
  const [catBgType, setCatBgType] = useState<string>("bows");
  const [userCatBorder, setUserCatBorder] = useState<string>("dark");

  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);

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

  const textColor = catBgType === "fancy" ? "text-white" : "text-black";

  useEffect(() => {
    const user: MyTokenPayload | null = getAuthenticatedUser();
    if (!user || !user.id) {
      console.warn("No authenticated user found. Redirecting to login.");
      navigate("/login");
      return;
    }
    console.log("Authenticated user found:", user);
    getCatImage(user);
  }, []);

  const getCatImage = async (user: MyTokenPayload) => {
    const userData = await getLastGeneratedCat(user.id!);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (
      userData &&
      userData.lastGeneratedTimestamp &&
      now - userData.lastGeneratedTimestamp < fiveMinutes
    ) {
      const remainingTime = fiveMinutes - (now - userData.lastGeneratedTimestamp);
      const secondsLeft = Math.ceil(remainingTime / 1000);
      setCatMessage(`Same cat as before! Please wait ${secondsLeft} seconds for a new cat.`);
      console.log("Reusing last generated cat:", userData.lastGeneratedCatId);
      const catData = await fetchCat(userData.lastGeneratedCatId);
      if (catData) {
        setCatId(userData.lastGeneratedCatId);
        setLink(catData.imageUrl);
        setName(catData.name);
        setDescription(catData.description);
        console.log("Reusing cat:", userData.lastGeneratedCatId, catData);
      } else {
        console.error("No cat data found for cat id:", userData.lastGeneratedCatId);
      }
    } else {
      console.log("Generating a new cat for user:", user.id);
      const newCatId = await generateNewCat(user.id!);
      if (newCatId) {
        const catData = await fetchCat(newCatId);
        if (catData) {
          setCatId(newCatId);
          setLink(catData.imageUrl);
          setName(catData.name);
          setDescription(catData.description);
          console.log("New cat generated:", newCatId, catData);
        } else {
          console.error("No cat data returned for new cat id:", newCatId);
        }
        setCatMessage("New cat generated!");
      } else {
        console.error("Failed to generate new cat ID");
      }
    }
    setLoading(false);
  };

  const handleBookmark = () => {
    setShowModal(true);
  };

  const handleSaveNote = async () => {
    const user = getAuthenticatedUser();
    if (user && user.id && catId) {
      await bookmarkCat(user.id, catId, note);
      console.log("Cat bookmarked with note:", note);
      setShowModal(false);
      setNote("");
    }
  };

  const handleCancelNote = () => {
    setShowModal(false);
    setNote("");
  };

  const handleShare = async () => {
    if (!cardRef.current) {
      console.error("Card reference not found.");
      return;
    }
    try {
      const downloadURL = await shareCard(cardRef.current);
      console.log("Share link generated:", downloadURL);
      setShareLink(downloadURL);
      alert("Share link: " + downloadURL);
    } catch (error) {
      console.error("Error sharing cat card:", error);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) {
      console.error("Card reference not found.");
      return;
    }
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "cat.png";
      link.click();
    } catch (error) {
      console.error("Error downloading cat image:", error);
    }
  };

  const borderComponent = userCatBorder === "rainbow" ? <RainbowCatBorder /> : <DarkCatBorder />;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${textColor}`}>
      <button className="text-white absolute top-6 left-6" onClick={() => navigate("/home")}>
        <HomeIcon />
      </button>
      
      <div ref={cardRef} className="relative rounded-md py-5 px-5 overflow-hidden max-w-xs">
        <div className="absolute inset-0">
          <img src={catBg} alt="Cat background" className="object-cover w-full h-full" />
        </div>
        <div className="relative bg-slate-700 rounded-md z-10 overflow-hidden">
          <div className="p-1">
            <div className="inset-0 z-0">
              {borderComponent}
            </div>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <img src={link ?? ""} alt="Cat" className="relative z-10" />
            )}
          </div>
        </div>
        <div className="relative z-10 h-10 rounded-md p-1.5 flex space-x-1 justify-end">
          <button onClick={handleBookmark}>
            <Bookmark />
          </button>
          <button onClick={handleShare}>
            <Share />
          </button>
          <button onClick={handleDownload} className="p-1 rounded">
            <Download />
          </button>
          <Heart />
        </div>
        <div className="relative z-10">
          <p>Name: {name}</p>
        </div>
        <div className="relative z-10">
          <p className="break-words">Description: {description}</p>
        </div>
      </div>
      <div className="text-white">
        {catMessage && <p className="text-center mt-4">{catMessage}</p>}
      </div>
      
      {/* Modal for entering a note */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add a Note</h2>
            <textarea
              className="w-full p-2 border rounded-md text-black"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your note here..."
            />
            <div className="flex justify-end mt-4 space-x-4">
              <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={handleCancelNote}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSaveNote}>
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cat;
