import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [loginId, setLoginId] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const success = await login(loginId, password);
        
        if (!success) {
            setError('Invalid login credentials or server error.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">🔐 Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-600 text-center font-medium">{error}</p>}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email or Phone</label>
                        <input 
                            type="text" 
                            value={loginId} 
                            onChange={(e) => setLoginId(e.target.value)} 
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign In
                    </button>
                    <p className="text-center text-sm mt-4 text-gray-600">
                        Don't have an account? <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register here</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;