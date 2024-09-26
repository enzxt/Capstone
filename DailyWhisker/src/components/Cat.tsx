import { useState, useEffect } from 'react';
import { firestore } from '../database/firestore';
import { doc, getDoc } from "@firebase/firestore";
import CatBackground from '../assets/CatBackground';
import Heart from '../assets/Heart';
import Bookmark from '../assets/Bookmark';
import Share from '../assets/Share';
import CatBorder from '../assets/CatBorder';

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
            <div className="bg-red-100 text-black justify-center rounded-md py-5 px-5 relative overflow-hidden max-w-xs">
                {/* <div className="absolute inset-0 w-full">
                    <CatBackground />
                </div> */}
                <div className="relative bg-slate-700 rounded-md z-10 overflow-hidden">
                    <div className="p-1">
                        <div className=" inset-0 z-0">
                            <CatBorder />
                        </div>
                        <img src={link ?? ''} alt="Cat" className="relative z-10"/>
                    </div>
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
                    <p className="break-words">Description: {description} </p>
                </div>
            </div>
        );
    }
}      