import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { API, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    
    const fetchUsers = async (keyword = '') => {
        setLoading(true);
        try {
            // GET /api/users?keyword=...
            const { data } = await API.get(`/users?keyword=${keyword}`);
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch users. Admin access required or token expired.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                // DELETE /api/users/:id
                await API.delete(`/users/${userId}`);
                // Remove the user from the state list
                setUsers(users.filter(u => u._id !== userId));
            } catch (err) {
                setError('Failed to delete user. Check if you are trying to delete yourself or another admin.');
            }
        }
    };

    // Debounced search (optional improvement)
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // For simple implementation, call fetchUsers directly
        fetchUsers(e.target.value);
    };

    if (loading) return <div className="text-center p-10">Loading users...</div>;
    if (error) return <div className="text-center p-10 text-red-600">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-indigo-700 mb-6">⚙️ Admin User Dashboard</h1>
            
            {/* Search/Filter Bar */}
            <div className="mb-6">
                <input 
                    type="text"
                    placeholder="Search by name, email, city, or state..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* User List Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u._id.substring(0, 5)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {/* Link to Edit Page */}
                                    <Link to={`/admin/users/${u._id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                    
                                    {/* Delete Button */}
                                    <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-900 disabled:text-gray-400" disabled={u._id === user._id}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <p className="text-center py-8 text-gray-500">No users found.</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;