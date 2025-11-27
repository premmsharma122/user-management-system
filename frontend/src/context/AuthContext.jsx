import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();


const API = axios.create({ 
    baseURL: 'http://localhost:5000/api',
    
    
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);
    
    
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };
    
    
    const refreshAuthToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            logout();
            return null;
        }

        try {
    
            const response = await axios.post('http://localhost:5000/api/auth/refresh-token', { refreshToken });
            
            const { accessToken, refreshToken: newRefreshToken, ...userData } = response.data;

    
            localStorage.setItem('accessToken', accessToken);
    
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }
            localStorage.setItem('user', JSON.stringify({ ...userData }));
            setUser({ ...userData });
            
            return accessToken; // Return the new token
        } catch (error) {
            console.error('Refresh token failed. Logging out.', error);
            logout();
            return null;
        }
    };


    
    API.interceptors.request.use((config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
    
    
    API.interceptors.response.use(
        (response) => response, // Pass through successful responses
        async (error) => {
            const originalRequest = error.config;
            
            
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                
                
                const newAccessToken = await refreshAuthToken();
                
                if (newAccessToken) {
                   
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    
                    // 3. Resend the original request
                    return API(originalRequest);
                }
            }
            return Promise.reject(error);
        }
    );


    const login = async (loginId, password) => {
        try {
            const { data } = await API.post('/auth/login', { loginId, password });
            
            // Store tokens and user details
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data));
            
            setUser(data);
            navigate(data.role === 'admin' ? '/admin/dashboard' : '/profile');
            return true;
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, API }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);