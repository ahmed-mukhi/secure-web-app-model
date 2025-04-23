const API_BASE_URL = 'https://localhost:4433';

/**
 * Send OTP after successful login
 * @param {string} csrfToken 
 */
const sendOTP = async (csrfToken, email) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/mfa/send-otp`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({ email })
        });

        return await res.json();
    } catch (error) {
        return { success: false, message: 'Failed to send OTP.' };
    }
};

/**
 * Login
 * Always sends OTP after login since 2FA is mandatory
 * @param {string} email 
 * @param {string} password 
 * @param {string} csrfToken - fetched from React state/context
 */
export const loginUser = async (email, password, csrfToken) => {
    try {
        const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok || !loginData.success) {
            return loginData; // login failed
        }

        // Now send OTP
        const otpData = await sendOTP(csrfToken, email);

        if (!otpData.success) {
            return { success: false, message: 'Login succeeded, but OTP failed to send.' };
        }
        localStorage.setItem('email', email);
        return { success: true, message: 'OTP sent successfully.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Register
 * @param {Object} userObj 
 * @param {string} csrfToken - fetched from React state/context
 */
export const registerUser = async (userObj, csrfToken) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(userObj),
        });

        return await res.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Verify OTP
 * @param {string} otp 
 * @param {string} csrfToken - fetched from React state/context
 */
export const verifyOTPService = async (otp, csrfToken) => {
    try {
        const email = localStorage.getItem('email');
        const res = await fetch(`${API_BASE_URL}/api/mfa/verify-otp`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({ otp, email }),
        });

        return await res.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};
