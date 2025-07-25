import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const strongPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
        setIsValid(strongPassword.test(newPassword));
    }, [newPassword]);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `https://authentication-system-432p.onrender.com/api/auth/reset-password/${resetToken}`,
                { newPassword }
            );
            setMessage(res.data.message || 'Password reset successful!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Password reset failed.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4">Reset Your Password</h3>

                            {message && <div className="alert alert-info">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${newPassword && !isValid ? 'is-invalid' : ''}`}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <div className="form-text">
                                        Must contain at least 1 uppercase and 1 special character, min 6 characters.
                                    </div>
                                    {!isValid && newPassword && (
                                        <div className="invalid-feedback">
                                            Password is not strong enough.
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="btn btn-dark w-100"
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
