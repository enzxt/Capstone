/**
 * Cat Component
 *
 * Displays the daily cat with user customization, allows bookmarking, sharing, and downloading.
 * Handles special cats and prompts users to bookmark them if enabled.
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

  const [isSpecialCat, setIsSpecialCat] = useState(false);
  const [autoBookmarkSpecials, setAutoBookmarkSpecials] = useState(false);
  const [showSpecialBookmarkPrompt, setShowSpecialBookmarkPrompt] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  /**
   * Loads user settings such as background, border style, and auto-bookmark preference.
   */
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
      if (settings && settings.autoBookmarkSpecials) {
        setAutoBookmarkSpecials(settings.autoBookmarkSpecials);
      }
    };
    loadCustomization();
    setSettingsLoaded(true);
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
    // getCatImage(user);
    getCatImage();

  }, [settingsLoaded]);

  //test to force special cats
  const getCatImage = async () => {
    const forcedCatId = "wdgHhoUF2ljB5eLskpnj";

    console.log("FORCING cat ID:", forcedCatId);
    const catData = await fetchCat(forcedCatId);

    if (catData) {
      setCatId(forcedCatId);
      setLink(catData.imageUrl);
      setName(catData.name);
      setDescription(catData.description);
      console.log("Forced special cat data:", catData);

      setIsSpecialCat(catData.isSpecial === true);

      if (catData.isSpecial === true) {
        setShowSpecialBookmarkPrompt(true);
      }
    } else {
      console.error("No cat data found for forced cat id:", forcedCatId);
    }

    setLoading(false);
  };

  /**
   * Fetches the cat to display (forces a specific cat ID here).
   */
//   const getCatImage = async (user: MyTokenPayload) => {
//   const userData = await getLastGeneratedCat(user.id!);
//   const now = Date.now();
//   const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

//   if (
//     userData &&
//     userData.lastGeneratedTimestamp &&
//     now - userData.lastGeneratedTimestamp < twentyFourHours
//   ) {
//     const remainingTime = twentyFourHours - (now - userData.lastGeneratedTimestamp);
//     const hoursLeft = Math.floor(remainingTime / (60 * 60 * 1000));
//     const minutesLeft = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
//     setCatMessage(`Same cat as before! Please wait ${hoursLeft}h ${minutesLeft}m for a new cat.`);
//     console.log("Reusing last generated cat:", userData.lastGeneratedCatId);
//     const catData = await fetchCat(userData.lastGeneratedCatId);
//     if (catData) {
//       setCatId(userData.lastGeneratedCatId);
//       setLink(catData.imageUrl);
//       setName(catData.name);
//       setDescription(catData.description);
//       console.log("Reusing cat:", userData.lastGeneratedCatId, catData);

//       setIsSpecialCat(catData.isSpecial === true);

//       if (catData.isSpecial === true && autoBookmarkSpecials) {
//         setShowSpecialBookmarkPrompt(true);
//       }

//     } else {
//       console.error("No cat data found for cat id:", userData.lastGeneratedCatId);
//     }
//   } else {
//     console.log("Generating a new cat for user:", user.id);
//     const newCatId = await generateNewCat(user.id!);
//     if (newCatId) {
//       const catData = await fetchCat(newCatId);
//       if (catData) {
//         setCatId(newCatId);
//         setLink(catData.imageUrl);
//         setName(catData.name);
//         setDescription(catData.description);
//         console.log("New cat generated:", newCatId, catData);

//         setIsSpecialCat(catData.isSpecial === true);

//         if (catData.isSpecial === true && autoBookmarkSpecials) {
//           setShowSpecialBookmarkPrompt(true);
//         }

//       } else {
//         console.error("No cat data returned for new cat id:", newCatId);
//       }
//       setCatMessage("New cat generated!");
//     } else {
//       console.error("Failed to generate new cat ID");
//     }
//   }
//   setLoading(false);
// };

  /**
   * Handles user confirming to bookmark a special cat.
   */
  const handleConfirmBookmarkSpecial = () => {
    setShowSpecialBookmarkPrompt(false);
    setShowModal(true); // open the note modal instead
  };

  /**
   * Handles user declining to bookmark a special cat.
   */
  const handleDeclineBookmarkSpecial = () => {
    console.log("User declined to bookmark special cat.");
    setShowSpecialBookmarkPrompt(false);
  };

  /**
   * Opens the note input modal to bookmark a cat.
   */
  const handleBookmark = () => {
    setShowModal(true);
  };

  /**
   * Saves a bookmark with an optional user note.
   */
  const handleSaveNote = async () => {
    const user = getAuthenticatedUser();
    if (user && user.id && catId) {
      await bookmarkCat(user.id, catId, note);
      console.log("Cat bookmarked with note:", note);
      setShowModal(false);
      setNote("");
    }
  };

  /**
   * Cancels the note input modal.
   */
  const handleCancelNote = () => {
    setShowModal(false);
    setNote("");
  };

  /**
   * Captures the cat card and uploads it to Firebase Storage for sharing.
   */
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

  /**
   * Downloads the cat card image directly as a PNG file.
   */
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
              <img
                src={link ?? ""}
                alt="Cat"
                className={`relative z-10 ${isSpecialCat ? "border-4 border-yellow-400 shadow-lg" : ""}`}
              />
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
      {isSpecialCat && (
        <div className="relative z-10 mt-2 text-yellow-400 text-lg font-bold text-center">
          🎉 Special Cat! 🎉
        </div>
      )}
      {showSpecialBookmarkPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">🎉 Special Cat! 🎉</h2>
            <p className="mb-4">Would you like to bookmark this special cat?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={handleDeclineBookmarkSpecial}
              >
                No
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleConfirmBookmarkSpecial}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}


      {shareLink && (
        <div className="mt-4 text-sm text-white">
          <p>Shareable Link:</p>
          <a href={shareLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-300">
            {shareLink}
          </a>
        </div>
      )}

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
