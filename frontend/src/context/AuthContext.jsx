import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set the baseURL to the server root
axios.defaults.baseURL = 'http://127.0.0.1:8000'; 

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
        }
    }, []);

    const loginAction = async (data) => {
        // ✅ Ensure this is the full path
        const response = await axios.post('/api/accounts/login/', data);
        if (response.data) {
            const { token, User } = response.data;
            setToken(token);
            setUser(User);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(User));
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            return response;
        }
    };
    
    const signUpAction = async (data) => {
        // ✅ Ensure this is the full path
        const response = await axios.post('/api/accounts/signup/', data);
        if (response.data) {
            const { token, user: userData } = response.data;
            setToken(token);
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            return response;
        }
    };

    const logOut = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ token, user, loginAction, logOut, signUpAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;