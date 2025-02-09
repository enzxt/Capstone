import { useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/icons/HomeIcon';
import { logoutUser } from "../service/firestoreService";

const Settings = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-screen h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-purple-800 to-indigo-600 p-6">
            <button className="absolute top-6 left-6 text-white" onClick={() => navigate('/home')}>
                <HomeIcon/>
            </button>

            <h1 className="text-4xl font-bold mb-6">Settings</h1>

            <div className="flex flex-col gap-4 w-full max-w-md">
                <label className="flex flex-col">
                    <span className="mb-2">Cat Border</span>
                    <select className="p-2 rounded-md bg-gray-200 text-black">
                        <option>Default</option>
                        <option>Rounded</option>
                        <option>Fancy</option>
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="mb-2">Cat Background</span>
                    <select className="p-2 rounded-md bg-gray-200 text-black">
                        <option>Solid</option>
                        <option>Patterned</option>
                        <option>Animated</option>
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="mb-2">App Theme</span>
                    <select className="p-2 rounded-md bg-gray-200 text-black">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>Custom</option>
                    </select>
                </label>
            </div>

            <div className="mt-6 w-full max-w-md text-center">
                <h2 className="text-lg font-semibold mb-2">Import/Export</h2>
                <p className="text-sm text-gray-300 mb-4">Import or export your settings as JSON or XML.</p>
                <div className="flex justify-center gap-4 mb-2">
                    <label className="flex items-center gap-1">
                        <input type="radio" name="format" value="json" defaultChecked /> JSON
                    </label>
                    <label className="flex items-center gap-1">
                        <input type="radio" name="format" value="xml" /> XML
                    </label>
                </div>
                <div className="flex gap-4 justify-center">
                    <button className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-700">Import</button>
                    <button className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-700">Export</button>
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 w-full max-w-md">
                <button className="bg-yellow-500 px-6 py-2 rounded-md text-white hover:bg-yellow-700">Retake Survey</button>
                <button className="bg-purple-500 px-6 py-2 rounded-md text-white hover:bg-purple-700">Share</button>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-4">
                <button className="bg-red-500 px-6 py-2 rounded-md text-white hover:bg-red-700" onClick={() => logoutUser(navigate)}>Logout</button>
                <button className="bg-indigo-500 px-6 py-2 rounded-md text-white hover:bg-indigo-700">Save</button>
            </div>
        </div>
    );
};

export default Settings;