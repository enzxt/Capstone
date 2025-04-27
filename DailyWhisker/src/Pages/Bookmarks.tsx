/**
 * Bookmarks Component
 *
 * Displays the authenticated user's bookmarked cats.
 * Fetches bookmark data from Firestore and allows filtering by day, week, or month.
 * Allows users to click a bookmark to view the full cat card.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../database/firestore';
import { getBookmarkedCats, getCatDetails } from '../service/firestoreService';
import HomeIcon from '../assets/icons/HomeIcon';
import { getUserIdFromToken } from "../helper/getUserIdFromToken";

interface Bookmark {
  catId: string;
  timestamp: number;
  note?: string;
  imageUrl: string;
}

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
  const navigate = useNavigate();

  const userId = auth.currentUser ? auth.currentUser.uid : getUserIdFromToken();

  useEffect(() => {
    if (userId) {
      fetchBookmarks();
    } else {
      console.warn('No authenticated user.');
    }
  }, [userId]);

  /**
   * Fetches the user's bookmarked cats from Firestore and loads cat images.
   */
  const fetchBookmarks = async () => {
    if (!userId) return;
    try {
      const bookmarkData = await getBookmarkedCats(userId);

      const bookmarkWithImages = await Promise.all(
        bookmarkData.map(async (bookmark) => {
          const catData = await getCatDetails(bookmark.catId);
          return {
            ...bookmark,
            imageUrl: catData?.imageUrl || "",
          };
        })
      );

      setBookmarks(bookmarkWithImages);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  /**
   * Filters bookmarks based on the selected time frame.
   */
  const filterBookmarks = () => {
    const now = new Date();
    return bookmarks.filter((bookmark) => {
      const catDate = new Date(bookmark.timestamp);
      if (filter === 'day') {
        return catDate.toDateString() === now.toDateString();
      } else if (filter === 'week') {
        return (now.getTime() - catDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;
      } else if (filter === 'month') {
        return now.getMonth() === catDate.getMonth();
      }
      return true;
    });
  };

   /**
   * Navigates the user to a full view of the bookmarked cat.
   * @param catId - ID of the cat to view
   */
  const handleBookmarkClick = (catId: string) => {
    navigate(`/bookmarked-cat/${catId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
      <div className="absolute top-6 left-6 cursor-pointer" onClick={() => navigate('/home')}>
        <HomeIcon />
      </div>

      <h1 className="text-4xl font-bold mb-4">Bookmarks</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {['day', 'week', 'month'].map((option) => (
          <label key={option} className="cursor-pointer flex items-center">
            <input
              type="radio"
              name="filter"
              value={option}
              checked={filter === option}
              onChange={() => setFilter(option as 'day' | 'week' | 'month')}
              className="hidden"
            />
            <span
              className={`px-4 py-2 rounded-lg border ${
                filter === option ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </span>
          </label>
        ))}
      </div>

      <div className="w-full max-w-lg space-y-4">
        {filterBookmarks().map((bookmark, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center bg-gray-800 rounded-lg p-4 shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleBookmarkClick(bookmark.catId)}
          >
            <img
              src={bookmark.imageUrl}
              alt="Cat"
              className="w-16 h-16 rounded-md mr-0 sm:mr-4 mb-2 sm:mb-0"
            />
            <div>
              <p className="text-lg font-semibold">
                {new Date(bookmark.timestamp).toDateString()}
              </p>
              <p className="text-sm text-gray-400">
                {bookmark.note && bookmark.note.trim() !== "" ? bookmark.note : "No note provided."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
