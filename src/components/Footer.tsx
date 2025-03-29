import React from 'react';

const Footer = () => {
  return (
    <>
    <footer className="text-black text-sm py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
