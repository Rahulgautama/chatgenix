import React, { useState } from 'react';
import { registerUser } from '../api'; // Ensure this matches your api service file
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ mobile: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // 1. Mobile Validation (Exactly 10 Digits)
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
            await registerUser(formData);
            setSuccess(true);
            // Redirect to login after 2 seconds so user can see success message
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || "Registration failed. Mobile may already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-10 col-md-5 col-lg-4">
                    <div className="card p-4 shadow border-0 rounded-4">
                        <div className="text-center mb-1">
                            <h2 className="fw-bold text-primary">Register</h2>
                            <p className="text-muted small">Create your ChatGenix account</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger p-2 small border-0 shadow-sm mb-3">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="alert alert-success p-2 small border-0 shadow-sm mb-3">
                                <i className="bi bi-check-circle me-2"></i>
                                Registration Successful! Redirecting...
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Mobile Input */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Mobile</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <i className="bi bi-phone text-muted"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-start-0 ps-0 shadow-none" 
                                        placeholder="9044XXXXXX"
                                        required
                                        maxLength="10"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})} 
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold small">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <i className="bi bi-lock text-muted"></i>
                                    </span>
                                    <input 
                                        type="password" 
                                        className="form-control bg-light border-start-0 ps-0 shadow-none" 
                                        placeholder="*****"
                                        required
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <button 
                                className="btn btn-primary w-100 fw-bold py-2 rounded-pill shadow-sm"
                                disabled={loading || success}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : "Register Now"}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="small text-muted">
                                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
