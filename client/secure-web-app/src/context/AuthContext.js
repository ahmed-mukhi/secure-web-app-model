// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const [isOTPVerified, setIsOTPVerified] = useState(() => {
        return localStorage.getItem('isOTPVerified') === 'true';
    });

    const login = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const verifyOTP = () => {
        localStorage.setItem('isOTPVerified', 'true');
        setIsOTPVerified(true);
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isOTPVerified');
        setIsAuthenticated(false);
        setIsOTPVerified(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isOTPVerified, login, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
