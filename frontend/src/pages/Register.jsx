import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { API, login } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', 
        address: '', state: '', city: '', country: '', pincode: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);


        const dataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            dataToSend.append(key, formData[key]);
        });

        if (profileImage) {
            dataToSend.append('profile_image', profileImage);
        }

        try {

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            
            await API.post('/auth/register', dataToSend, config);

            navigate('/login?registered=true');

        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                             err.response?.data?.errors?.map(e => e.msg).join(', ') || 
                             'Registration failed. Please check your inputs.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="flex justify-center py-10">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">👤 Create New Account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="p-3 bg-red-100 text-red-700 rounded border border-red-300">{error}</p>}

                    {/* Basic Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="text" name="name" label="Full Name" value={formData.name} onChange={handleChange} required />
                        <Input type="email" name="email" label="Email" value={formData.email} onChange={handleChange} required />
                        <Input type="tel" name="phone" label="Phone (10-15 digits)" value={formData.phone} onChange={handleChange} required />
                        <Input type="password" name="password" label="Password (Min 6 chars, 1 number)" value={formData.password} onChange={handleChange} required />
                    </div>

    
                    <div className="grid grid-cols-3 gap-4">
                        <Input type="text" name="country" label="Country" value={formData.country} onChange={handleChange} required />
                        <Input type="text" name="state" label="State" value={formData.state} onChange={handleChange} required />
                        <Input type="text" name="city" label="City" value={formData.city} onChange={handleChange} required />
                        <Input type="text" name="pincode" label="Pincode (4-10 digits)" value={formData.pincode} onChange={handleChange} required />
                    </div>
                    
                    <Input type="text" name="address" label="Address (Optional)" value={formData.address} onChange={handleChange} />

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image (PNG/JPG, max 2MB)</label>
                        <input 
                            type="file" 
                            name="profile_image"
                            onChange={handleFileChange} 
                            accept=".jpg,.jpeg,.png"
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                    >
                        {loading ? 'Processing...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input 
            {...props} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
    </div>
);

export default Register;