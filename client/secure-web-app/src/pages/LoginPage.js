import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useCsrf } from '../context/CsrfContext';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const navigate = useNavigate();
    const { csrfToken } = useCsrf();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const response = await loginUser(email, password, csrfToken);

        setLoading(false);

        if (response.success) {
            login();
            navigate('/2fa');
        } else {
            setError(response.message || 'An error occurred, please try again.');
        }
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleLogin}>
                <h2>Login</h2>

                {error && <div className="error-message">{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {loading && <div className="loader">Sending OTP...</div>}

                <p>
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
