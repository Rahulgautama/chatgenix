import React, { useState } from 'react'; // 1. useState Import करें
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 2. State बनाएँ
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userMobile = localStorage.getItem('userMobile');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setIsExpanded(false); // Logout पर Menu बंद करें
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-0" >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={() => setIsExpanded(false)}>
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px' }}>
            <i className="bi bi-chat-dots-fill text-white fs-5"></i>
          </div>
          <span className="fw-bold fs-4 tracking-tight text-dark">Chat<span className="text-primary">Genix</span></span>
        </Link>

        {/* --- 3. Toggle Button Fix --- */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          onClick={() => setIsExpanded(!isExpanded)} // Toggle State
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* --- 4. Collapse Logic Fix --- */}
        <div className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`} id="navContent">
          <ul className="navbar-nav ms-auto align-items-center gap-2 mt-3 mt-lg-0">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/login" onClick={() => setIsExpanded(false)}>Login</Link>
                </li>
                <li className="nav-item w-100">
                  <Link className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm w-100" to="/register" onClick={() => setIsExpanded(false)}>
                    Get Started
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex flex-column flex-lg-row align-items-center gap-3 w-100 w-lg-auto">
                  {/* Profile Badge */}
                  <div
                    className="d-flex align-items-center bg-light px-3 py-2 rounded-pill border shadow-sm w-100 w-lg-auto"
                    onClick={() => { navigate('/chatApp'); setIsExpanded(false); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px' }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <span className="small fw-bold text-secondary flex-grow-1">{userMobile}</span>
                    <i className="bi bi-chat-text ms-2 text-primary small"></i>
                  </div>
                
                {/* Logout Button */}
                <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold w-100 w-lg-auto" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
