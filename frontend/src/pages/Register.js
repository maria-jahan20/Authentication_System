import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';  // Add Link import

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [agree, setAgree] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    useEffect(() => {
        const strongPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
        setPasswordValid(strongPassword.test(formData.password));
    }, [formData.password]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('https://authentication-system-432p.onrender.com/api/auth/register', formData);
            setMessage(res.data.message || 'Registration successful!');
            setFormData({ name: '', email: '', password: '' });
            setAgree(false);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error occurred');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4">Create Your Account</h3>
                            {message && <div className="alert alert-info">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={`form-control ${formData.password && !passwordValid ? 'is-invalid' : ''}`}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="form-text">
                                        Password must be at least 6 characters, contain one uppercase letter and one special character.
                                    </div>
                                    {!passwordValid && formData.password && (
                                        <div className="invalid-feedback">
                                            Your password is not strong enough.
                                        </div>
                                    )}
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={agree}
                                        onChange={() => setAgree(!agree)}
                                        id="terms"
                                    />
                                    <label className="form-check-label" htmlFor="terms">
                                        I agree to the terms and conditions
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100"
                                    disabled={!agree || !passwordValid}
                                >
                                    Register
                                </button>
                            </form>

                            {/* New link for existing users */}
                            <div className="text-center mt-3">
                                Already have an account?{' '}
                                <Link to="/login" className="text-decoration-none">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
