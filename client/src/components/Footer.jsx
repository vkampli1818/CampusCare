import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="cc-footer">
      <div className="cc-footer-inner">
        <span className="cc-footer-brand">CampusCare</span>
        <span className="cc-footer-text">School Management System &copy; {year}</span>
      </div>
    </footer>
  );
};

export default Footer;
