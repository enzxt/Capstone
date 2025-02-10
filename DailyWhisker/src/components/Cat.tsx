import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../database/firestore';
import { getLastGeneratedCat, fetchCat, generateNewCat, bookmarkCat } from '../service/catService';
import Heart from '../assets/icons/Heart';
import Bookmark from '../assets/icons/Bookmark';
import Share from '../assets/icons/Share';
import CatBorder from '../assets/CatBorder';
import bow from '../assets/images/bows.jpg';
// import { doc, updateDoc } from 'firebase/firestore';

/**
 * Cat component responsible for displaying the user's daily cat.
 *
 * This component handles:
 * - Fetching the last generated cat for the user from Firestore.
 * - Checking whether 24 hours have passed to determine if a new cat should be generated.
 * - Displaying the cat's image, name, and description.
 * - Allowing the user to bookmark the cat.
 *
 * Dependencies:
 * - Uses Firestore to retrieve and update user-generated cat data.
 * - Uses authentication to fetch the current logged-in user.
 * - Provides UI elements for user interaction (bookmarking, sharing, and liking).
 */

const Cat = () => {
    const [link, setLink] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [catId, setCatId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [catMessage, setCatMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            console.log("Authenticated user:", user.uid);
            getCatImage();
        } else {
            console.warn("No authenticated user found.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const getCatImage = async () => {
        if (!user) return;
        
        const userData = await getLastGeneratedCat(user.uid);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (userData && userData.lastGeneratedTimestamp && now - userData.lastGeneratedTimestamp < twentyFourHours) {
            console.log("Reusing last generated cat:", userData.lastGeneratedCatId);
            setCatMessage("Same cat as yesterday!");
            const catData = await fetchCat(userData.lastGeneratedCatId);
            if (catData) {
                setCatId(userData.lastGeneratedCatId);
                setLink(catData.link);
                setName(catData.name);
                setDescription(catData.description);
            }
        } else {
            console.log("24 hours passed or first generation. Generating new cat...");
            const newCatId = await generateNewCat(user.uid);
            if (newCatId) {
                const catData = await fetchCat(newCatId);
                if (catData) {
                    setCatId(newCatId);
                    setLink(catData.link);
                    setName(catData.name);
                    setDescription(catData.description);
                }
                setCatMessage("New cat generated!");
            }
        }

        setLoading(false);
    };

    // const getCatImage = async () => {
    //     if (!user) return;
    
    //     const userRef = doc(firestore, "users", user.uid);
    //     const now = Date.now();
    //     const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000); // Set timestamp to 48 hours ago
    //     const twentyFourHours = 24 * 60 * 60 * 1000;

    //     try {
    //         // Force update the timestamp in Firestore to always be outdated by 48 hours
    //         await updateDoc(userRef, {
    //             lastGeneratedTimestamp: fortyEightHoursAgo
    //         });
    //         console.log("Forced timestamp update to 48 hours ago.");
    
    //         // Fetch updated user data
    //         const userData = await getLastGeneratedCat(user.uid);
    
    //         if (userData && userData.lastGeneratedTimestamp && now - userData.lastGeneratedTimestamp < twentyFourHours) {
    //             console.log("Reusing last generated cat:", userData.lastGeneratedCatId);
    //             setCatMessage("Same cat as yesterday!");
    //             const catData = await fetchCat(userData.lastGeneratedCatId);
    //             if (catData) {
    //                 setCatId(userData.lastGeneratedCatId);
    //                 setLink(catData.link);
    //                 setName(catData.name);
    //                 setDescription(catData.description);
    //             }
    //         } else {
    //             console.log("24 hours passed or first generation. Generating new cat...");
    //             const newCatId = await generateNewCat(user.uid);
    //             if (newCatId) {
    //                 const catData = await fetchCat(newCatId);
    //                 if (catData) {
    //                     setCatId(newCatId);
    //                     setLink(catData.link);
    //                     setName(catData.name);
    //                     setDescription(catData.description);
    //                 }
    //                 setCatMessage("New cat generated!");
    //             }
    //         }
    
    //     } catch (error) {
    //         console.error("Error updating timestamp:", error);
    //     }
    
    //     setLoading(false);
    // };
    
    const handleBookmark = async () => {
        if (user && catId) {
            await bookmarkCat(user.uid, catId);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <div className="bg-red-100 text-black justify-center rounded-md py-5 px-5 relative overflow-hidden max-w-xs">
                <div className="absolute inset-0">
                    <img src={bow} alt="bow" className="object-cover w-full h-full" />
                </div>
                <div className="relative bg-slate-700 rounded-md z-10 overflow-hidden">
                    <div className="p-1">
                        <div className="inset-0 z-0">
                            <CatBorder />
                        </div>
                        {loading ? (
                            <p className="text-white text-center">Loading...</p>
                        ) : (
                            <img src={link ?? ""} alt="Cat" className="relative z-10" />
                        )}
                    </div>
                </div>
                <div className="relative z-10 h-10 rounded-md p-1.5 flex space-x-1 justify-end">
                    <button onClick={handleBookmark}>
                        <Bookmark />
                    </button>
                    <Heart />
                    <Share />
                </div>
                <div className="relative z-10">
                    <p>Name: {name}</p>
                </div>
                <div className="relative z-10">
                    <p className="break-words">Description: {description} </p>
                </div>
            </div>

            {catMessage && <p className="text-white text-center mt-4">{catMessage}</p>}

            <button
                onClick={() => navigate("/home")}
                className="mt-6 rounded-lg bg-indigo-300 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
                Back to Home
            </button>
        </div>
    );
};

export default Cat;
