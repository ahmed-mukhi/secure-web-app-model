// src/context/CsrfContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CsrfContext = createContext();

export const useCsrf = () => useContext(CsrfContext);

export const CsrfProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const res = await fetch('https://localhost:4433/api/csrf-token', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            setCsrfToken(data.csrfToken); // ✅ Save token in state
        };

        fetchToken();
    }, []);

    return (
        <CsrfContext.Provider value={{ csrfToken }}>
            {children}
        </CsrfContext.Provider>
    );
};
