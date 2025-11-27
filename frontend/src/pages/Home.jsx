import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <div className="p-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700">👋 Welcome to the User Management System</h1>
        <p className="mt-4 text-gray-600">Please use the navigation bar to access the application features.</p>
        
        <div className="mt-8 space-x-4">
            <Link 
                to="/login" 
                className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
                Login
            </Link>
            <Link 
                to="/admin/dashboard" 
                className="inline-block px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
                Admin Dashboard
            </Link>
        </div>
    </div>
);

export default Home;