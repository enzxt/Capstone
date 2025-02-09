import React, { useState } from 'react';
import { resetPassword } from '../service/firestoreService';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async () => {
        try {
            await resetPassword(email);
            setMessage('Password reset email sent!');
        } catch (error) {
            if (error instanceof Error) {
                setMessage(`${error.message}`);
            } else {
                setMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="sm:w-full sm:max-w-sm">
                <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-white">
                    Forgot Password
                </h2>
    
                <div className="mt-10">
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
    
                    <div className="mt-6">
                        <button
                            onClick={handlePasswordReset}
                            className="flex w-full justify-center rounded-lg bg-indigo-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            Send
                        </button>
                    </div>
    
                    {message && <p className="mt-4 text-center text-sm text-green-500">{message}</p>}
                </div>
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="w-1/2 rounded-lg bg-indigo-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
    
    
};

export default ForgotPassword;