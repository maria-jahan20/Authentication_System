import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Add Link

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('https://authentication-system-432p.onrender.com/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setMessage('Login successful!');
            setError('');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setMessage('');
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4">Login to Your Account</h3>

                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
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
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button className="btn btn-dark w-100" type="submit">
                                    Login
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <Link to="/forgot-password" className="text-decoration-none">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="text-center mt-2">
                                <span>Don't have an account? </span>
                                <Link to="/register" className="text-decoration-none">
                                    Create one
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
