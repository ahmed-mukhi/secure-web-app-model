import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOTPService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useCsrf } from '../context/CsrfContext';
import '../App.css';

const TwoFAPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyOTP } = useAuth();

    const navigate = useNavigate();
    const { csrfToken } = useCsrf();

    const handleTwoFA = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const response = await verifyOTPService(otp, csrfToken);

        setLoading(false);

        if (response.success) {
            verifyOTP();
            navigate('/'); // or any authenticated route
        } else {
            setError(response.message || 'Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleTwoFA}>
                <h2>Enter OTP</h2>

                {error && <div className="error-message">{error}</div>}

                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                {loading && <div className="loader">Verifying...</div>}
            </form>
        </div>
    );
};

export default TwoFAPage;
