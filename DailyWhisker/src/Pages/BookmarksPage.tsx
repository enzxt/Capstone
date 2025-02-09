import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../database/firestore';
import { getBookmarkedCats, getCatDetails } from '../service/firestoreService';
import HomeIcon from '../assets/icons/HomeIcon';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState<{ catId: string, timestamp: number, imageUrl: string }[]>([]);
    const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        } else {
            console.warn('No authenticated user.');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchBookmarks = async () => {
        if (!user) return;
        try {
            const bookmarkData = await getBookmarkedCats(user.uid);

            // Fetch cat images from Firestore
            const bookmarkWithImages = await Promise.all(bookmarkData.map(async (bookmark) => {
                const catData = await getCatDetails(bookmark.catId);
                return {
                    ...bookmark,
                    imageUrl: catData?.link || "", // Use link if available, otherwise empty string
                };
            }));

            setBookmarks(bookmarkWithImages);
        } catch (err) {
            console.error('Error fetching bookmarks:', err);
        }
    };

    const filterBookmarks = () => {
        const now = new Date();
        return bookmarks.filter(bookmark => {
            const catDate = new Date(bookmark.timestamp);
            if (filter === 'day') return catDate.toDateString() === now.toDateString();
            if (filter === 'week') return (now.getTime() - catDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;
            if (filter === 'month') return now.getMonth() === catDate.getMonth();
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <div className="absolute top-6 left-6 cursor-pointer" onClick={() => navigate('/home')}>
                <HomeIcon />
            </div>

            <h1 className="text-4xl font-bold mb-4">Bookmarks</h1>

            <div className="flex gap-6 mb-6">
                {['day', 'week', 'month'].map(option => (
                    <label key={option} className="cursor-pointer">
                        <input 
                            type="radio" 
                            name="filter" 
                            value={option} 
                            checked={filter === option}
                            onChange={() => setFilter(option as 'day' | 'week' | 'month')}
                            className="hidden"
                        />
                        <span className={`px-4 py-2 rounded-lg border ${filter === option ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </span>
                    </label>
                ))}
            </div>

            <div className="w-full max-w-lg space-y-4">
                {filterBookmarks().map((bookmark, index) => (
                    <div key={index} className="flex items-center bg-gray-800 rounded-lg p-4 shadow-md">
                        <img src={bookmark.imageUrl} alt="Cat" className="w-16 h-16 rounded-md mr-4" />
                        <div>
                            <p className="text-lg font-semibold">{new Date(bookmark.timestamp).toDateString()}</p>
                            <p className="text-sm text-gray-400">Room for note</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookmarks;
