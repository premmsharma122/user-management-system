
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-indigo-600">User Manager</Link>
                    
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Dashboard</Link>
                                )}
                                <Link to="/profile" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Profile ({user.name})</Link>
                                <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Login</Link>
                                <Link to="/register" className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;