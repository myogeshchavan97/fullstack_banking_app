import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Banking Application</h1>
      <div className="links">
        <Link to="/account" className="link">
          Account
        </Link>
        <Link to="/profile" className="link">
          Profile
        </Link>
        <Link to="/logout" className="link">
          Logout
        </Link>
      </div>
    </header>
  );
};

export default Header;
