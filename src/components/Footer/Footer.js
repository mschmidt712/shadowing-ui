import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <h1 className="app-title">Find Shadowing</h1>
        <div className="menu">
          <Link to="/">Home</Link>
          <Link to="/about-us">About Us</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
      <div className="footer-content copywrite">
        <span className="app-subtitle">Copyright 2019 Find Shadowing. All Rights Reserved.</span>
        <div className="menu">
          <button className="icon small">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="icon small">
            <i className="fab fa-twitter"></i>
          </button>
          <button className="icon small">
            <i className="fab fa-instagram"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
