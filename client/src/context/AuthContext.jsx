import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async () => {
        if(!token) {
            return;
        }

        try {
            const response = await axios.get(`${BACKEND_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.success) {
                setUser(response.data.data);
            }
            
        } catch (error) {
            console.log(`Error fetching user profile: ${error}`);
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        const initAuth = async () => {
            if(token) {
                await fetchUserProfile();
            }
            setLoading(false);
        };
        initAuth();
    }, [fetchUserProfile, token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/login`, { email, password });
            if(response.data.success) {
                const token = response.data.data.token;
                setToken(token);
                localStorage.setItem('token', token);
            }
            return response.data;
        } catch (error) {
            console.log(`Login error: ${error}`);
            throw error;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/signup`, { name, email, password });
            if(response.data.success) {
                const token = response.data.data.token;
                setToken(token);
                localStorage.setItem('token', token);
            }
            return response.data;
        } catch (error) {
            console.log(`Signup error: ${error}`);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        user, 
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
