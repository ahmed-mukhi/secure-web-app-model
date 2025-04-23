import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useCsrf } from '../context/CsrfContext';
import '../App.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState(null);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { csrfToken } = useCsrf();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await registerUser({ email, password, age, name }, csrfToken);
        if (response.success) {
            navigate('/login');
        } else {
            setError(response.message || 'An error occurred, please try again.');
        }
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleRegister}>
                <h2>Register</h2>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
                <p>
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;



