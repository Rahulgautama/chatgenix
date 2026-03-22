import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ mobile: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Mobile Validation (10 Digits)
        if (!/^\d{10}$/.test(formData.mobile)) {
            setError("Mobile number must be exactly 10 digits.");
            return;
        }

        // 2. Password Validation (Min 8 + Special Char)
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must be 8+ chars with a special character.");
            return;
        }

        setLoading(true);
        try {
            const res = await loginUser(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userMobile', formData.mobile);
            navigate('/chatApp');
        } catch (err) {
            setError(err.response?.data || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-100 justify-content-center">
                {/* Mobile pe 'col-11' ya 'col-10' use karein taki sides me thodi jagah rahe */}
                <div className="col-8 col-sm-8 col-md-5 col-lg-4">
                    <div className="card p-4 shadow border-0 rounded-4">
                        <div className="text-center mb-3">
                            <h2 className="fw-bold text-primary">Login</h2>
                            <p className="text-muted small">Welcome back to ChatGenix</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger p-2 small border-0 shadow-sm mb-3">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Mobile Input */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-secondary">Mobile</label>
                                <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-phone text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control bg-white border-start-0 ps-0 shadow-none"
                                        placeholder="9044XXXXXX"
                                        required
                                        maxLength="10"
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold small text-secondary">Password</label>
                                <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-lock text-muted"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control bg-white border-start-0 ps-0 shadow-none"
                                        placeholder="••••••••"
                                        required
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-100 fw-bold py-2 rounded-pill shadow-sm transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : "Sign In"}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="small text-muted mb-0">
                                Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none ms-1">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;
