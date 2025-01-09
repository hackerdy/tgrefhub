import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faShare, faUserGroup, faUser } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className='footer'>
      <nav className='footer-nav'>
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FontAwesomeIcon icon={faHouse} className='icon' />
          <span className='text'>Airdrops</span>
        </NavLink>
        <NavLink to="/list" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FontAwesomeIcon icon={faShare} className='icon' />
          <span className='text'>List</span>
        </NavLink>
        <NavLink to="/friends" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FontAwesomeIcon icon={faUserGroup} className='icon' />
          <span className='text'>Friends</span>
        </NavLink>
        <NavLink to="/user" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FontAwesomeIcon icon={faUser} className='icon' />
          <span className='text'>User</span>
        </NavLink>
      </nav>
    </footer>
  );
};

export default Footer;
