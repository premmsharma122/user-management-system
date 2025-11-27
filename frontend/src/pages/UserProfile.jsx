import React from 'react';
import { useAuth } from '../context/AuthContext'; 

const UserProfile = () => {
    const { user, loading, logout } = useAuth(); 

    if (loading) {
        return <div className="text-center p-8">Loading profile data...</div>;
    }
    
    if (!user) {
        
        return <div className="text-center p-8">User not authenticated.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
                👋 Welcome, {user.name}
            </h1>
            <div className="space-y-4">
                <p className="text-lg"><span className="font-semibold text-indigo-600">Role:</span> {user.role?.toUpperCase()}</p>
                <p className="text-lg"><span className="font-semibold text-indigo-600">Email:</span> {user.email}</p>
           
            </div>
            
            <button 
                onClick={logout} 
                className="mt-8 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
            >
                Logout
            </button>
        </div>
    );
};

export default UserProfile;