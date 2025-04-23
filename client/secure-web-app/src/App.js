// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TwoFAPage from './pages/TwoFAPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // useEffect(() => {
  //   const fetchCSRFToken = async () => {
  //     try {
  //       await fetch('https://localhost:4433/api/csrf-token', {
  //         credentials: 'include',
  //       });
  //     } catch (err) {
  //       console.error('Failed to fetch CSRF token:', err);
  //     }
  //   };

  //   fetchCSRFToken();
  // }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/2fa" element={<TwoFAPage />} />
          <Route path="/" element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
