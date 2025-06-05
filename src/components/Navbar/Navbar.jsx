import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    // Optional: clear token/session
    console.log('Logout clicked');
    navigate('/');
  };

  const handleCreateAccount = () => {
    navigate('/create-account'); // 👈 navigate to create account page
  };

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt='Logo' />

      <div className='profile-container'>
        <FaUserCircle className='profile-icon' onClick={toggleDropdown} />
        {showDropdown && (
          <ul className='dropdown'>
            <li onClick={handleLogin}>Login</li>
            <li onClick={handleLogout}>Logout</li>
            <li onClick={handleCreateAccount}>Create Account</li> {/* 👈 New item */}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
