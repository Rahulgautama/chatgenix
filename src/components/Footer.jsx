import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/chatApp') return null;

  return (
    <footer className="py-1 mt-auto border-top bg-white">
  <div className="container">
    <div className="row justify-content-center">
      
      {/* --- Centered Copyright Section --- */}
      <div className="col-12 text-center">
        <span className="text-black-50 small">
          &copy; {new Date().getFullYear()}{" "}
          <span className="fw-bold text-black">
            Chat<span style={{ color: '#0856f3' }}>Genix</span>
          </span>. 
          All rights reserved.
        </span>
      </div>

    </div>
  </div>
</footer>

  );
};

export default Footer;
