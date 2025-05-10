import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.header 
      className="app-header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="header-content">
        {/* Logo/Branding */}
        <motion.div 
          className="logo-container"
          whileHover={{ scale: 1.05 }}
        >
          <div className="logo-icon">🗳️</div>
          <h1 className="logo-text">VoteSecure</h1>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav">

         {/*  <Link to="/result">
          <motion.span 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Results
          </motion.span>
          </Link> */}

          <motion.span
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.removeItem("auth");
              sessionStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Logout
          </motion.span>
         
        </nav>

        {/* User Profile */}
        <motion.div 
          className="user-profile"
          whileHover={{ scale: 1.03 }}
        >
          <span className="user-name">
            {user?.name || "Guest"}
          </span>
        </motion.div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-button ${mobileMenuOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav 
            className="mobile-nav-links"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <a href="#" onClick={toggleMobileMenu}>Elections</a>
            <a href="#" onClick={toggleMobileMenu}>Candidates</a>
            <a href="#" onClick={toggleMobileMenu}>Results</a>
            <div className="mobile-user-profile">
              <img 
                src={user?.photo || "https://randomuser.me/api/portraits/men/1.jpg"} 
                alt={user?.name || "Guest"} 
                className="mobile-user-avatar"
              />
              <span>{user?.name || "Guest"}</span>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;