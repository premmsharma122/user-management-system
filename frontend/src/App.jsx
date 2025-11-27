import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; 

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile'; 
import AdminDashboard from './pages/AdminDashboard'; 
import UserEdit from './pages/UserEdit'; 

const Unauthorized = () => (
    <div className="p-10 text-center">
        <h1 className="text-4xl font-extrabold text-red-600">403 Forbidden - Access Denied</h1>
    </div>
);


function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <Routes>
                
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                
                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<UserProfile />} /> 
                        <Route path="/profile/edit" element={<UserEdit />} /> 
                    </Route>

                    
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users/:id/edit" element={<UserEdit />} /> 
                    </Route>
                    
                    
                    <Route path="*" element={<h1 className="text-center p-10 text-3xl">404 Not Found</h1>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;