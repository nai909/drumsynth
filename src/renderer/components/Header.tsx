import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-text">IZ DRUM MACHINE</div>
        </div>
        <div className="header-info">
          <div className="pattern-info">Pattern 1</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
