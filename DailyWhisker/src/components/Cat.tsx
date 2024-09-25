import { useState, useEffect } from 'react';
import { firestore } from '../database/firestore';
import { doc, getDoc } from "@firebase/firestore";
import CatBackground from '../assets/CatBackground';
import Heart from '../assets/Heart';
import Bookmark from '../assets/Bookmark';
import Share from '../assets/Share';

export default function Cat() {
    const [link, setLink] = useState(null);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);

    const getCatImage = async () => {
        try {
            const docRef = doc(firestore, "cats", "n9bN4rS41lrVGl6ycu9p");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.link) {
                    setLink(data.link);
                } 
                if (data.name) {
                    setName(data.name);
                }
                if (data.description) {
                    setDescription(data.description);
                }
                console.log('Document data:', data);
            } else {
                console.log("Document does not exist");
            }
        } catch (err) {
            console.error("Error fetching document:", err);
        }
    };

    useEffect(() => {
        getCatImage();
    }, []);

    //conditional rendering (add time logic here)
    if (1) {
        return (
          <div className="bg-gray-900 text-white justify-center rounded-md py-5 px-5 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <CatBackground />
            </div>
            <div className="relative bg-slate-700 p-1 rounded-md z-10">
              {link ? (
                <img src={link} alt="Cat" style={{ maxWidth: '250px' }} />
              ) : (
                <p>Loading image...</p>
              )}
            </div>
            <div className="relative z-10 h-10 rounded-md p-1.5 flex space-x-1 justify-end">
                <Bookmark />
                <Heart />
                <Share />
            </div>
            <div className="relative z-10">
              <p>Name: {name}</p>
            </div>
            <div className="relative z-10">
              <p>Description: {description} </p>
            </div>
          </div>
        );
      }
    }      