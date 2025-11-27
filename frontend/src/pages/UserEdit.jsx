import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input 
            {...props} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
    </div>
);

const UserEdit = () => {
    const { API, user: currentUser } = useAuth(); 
    const { id: userIdFromParam } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    
    const isProfileEdit = !userIdFromParam;
    const userId = isProfileEdit ? currentUser?._id : userIdFromParam;

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', 
        address: '', state: '', city: '', country: '', pincode: '', role: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const is_admin = currentUser?.role === 'admin';
    const is_editing_self = userId === currentUser?._id;
    const can_edit_role = is_admin && !is_editing_self; 

    useEffect(() => {
        if (!userId) {
            setError("User ID not found.");
            setLoading(false);
            return;
        }

        const fetchUserDetails = async () => {
            try {
            
                const { data } = await API.get(`/users/${userId}`);
                setFormData({
                    name: data.name || '', email: data.email || '', phone: data.phone || '', 
                    address: data.address || '', state: data.state || '', city: data.city || '', 
                    country: data.country || '', pincode: data.pincode || '', role: data.role || 'user'
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch user details. Check authorization or user ID.');
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId, API]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            
            const updatePayload = {
                name: formData.name, email: formData.email, phone: formData.phone,
                address: formData.address, state: formData.state, city: formData.city, 
                country: formData.country, pincode: formData.pincode
            };
            
            // Only include role update if Admin and allowed to edit role
            if (is_admin && !is_editing_self) {
                 updatePayload.role = formData.role;
            }

            await API.put(`/users/${userId}`, updatePayload);
            setSuccess('User updated successfully!');
            
            
            if (isProfileEdit) {
            
                navigate('/profile', { replace: true });
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                             err.response?.data?.errors?.map(e => e.msg).join(', ') || 
                             'Update failed. Check inputs or permissions.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    
    const title = isProfileEdit 
        ? "📝 Edit Your Profile" 
        : `✏️ Edit User: ${formData.name}`;

    if (loading) return <div className="text-center p-10">Loading user data...</div>;
    if (error && !success) return <div className="text-center p-10 text-red-600">{error}</div>;

    return (
        <div className="flex justify-center py-10">
            <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">{title}</h2>
                
                {error && <p className="p-3 bg-red-100 text-red-700 rounded border border-red-300">{error}</p>}
                {success && <p className="p-3 bg-green-100 text-green-700 rounded border border-green-300">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="text" name="name" label="Full Name" value={formData.name} onChange={handleChange} required />
                        <Input type="email" name="email" label="Email" value={formData.email} onChange={handleChange} required />
                        <Input type="tel" name="phone" label="Phone" value={formData.phone} onChange={handleChange} required />
                    </div>

                
                    <Input type="text" name="address" label="Address" value={formData.address} onChange={handleChange} />

                    <div className="grid grid-cols-3 gap-4">
                        <Input type="text" name="country" label="Country" value={formData.country} onChange={handleChange} required />
                        <Input type="text" name="state" label="State" value={formData.state} onChange={handleChange} required />
                        <Input type="text" name="city" label="City" value={formData.city} onChange={handleChange} required />
                        <Input type="text" name="pincode" label="Pincode" value={formData.pincode} onChange={handleChange} required />
                    </div>
                    
                
                    {can_edit_role && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select 
                                name="role" 
                                value={formData.role} 
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                
                    <button 
                        type="button" 
                        onClick={() => navigate(isProfileEdit ? '/profile' : '/admin/dashboard')}
                        className="w-full py-3 px-4 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Cancel / Back
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserEdit;