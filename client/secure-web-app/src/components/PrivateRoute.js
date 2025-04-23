// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isOTPVerified, loading } = useAuth();
  console.log(isAuthenticated, isOTPVerified);

  if (loading) return <div>Loading session...</div>; // 👈 Prevent premature redirect

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isOTPVerified) return <Navigate to="/2fa" />;

  return children;
};

export default PrivateRoute;
