import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome for icons

import Logo from '../assets/RCS-Logo-White.png'; // Assuming the path to your logo is correct

const Footer = () => {
  return (
    <footer className="bg-[#0B2849] py-5 font-poppins"> {/* Apply Poppins globally to the footer */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row text-white justify-between items-start">
          {/* Left Section: Logo and Social Icons */}
          <div className="flex flex-col mb-4 text-start">
            <img src={Logo} alt="RCS Logistics Philippines" className="w-36 mb-3" />
            <p className="max-w-xs break-words leading-6">
              RCS Logistics Philippines provides exceptional transport with reliability and innovation.
            </p>
            <div className="flex mt-4 space-x-3">
              <a href="../hello" className="text-white text-2xl hover:text-[#D6D33C] transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="../hello" className="text-white text-2xl hover:text-[#D6D33C] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="../hello" className="text-white text-2xl hover:text-[#D6D33C] transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="../hello" className="text-white text-2xl hover:text-[#D6D33C] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Middle Section: Office Info */}
          <div className="text-start w-full md:w-1/5">
            <h4 className="font-bold text-[#D6D33C] mb-2">Our Main Office</h4>
            <p className="text-white text-sm">
              Retail C, GF, BM ONE Building Amvel Business Park Ninoy Aquino Ave San Dionisio, Paranaque
            </p>
          </div>

          {/* Right Section: Contact Us */}
          <div className="text-start mb-4">
            <h4 className="font-bold text-[#D6D33C] mb-2">Contact Us</h4>
            <p className="text-white">sales@rcsphil.com</p>
            <p className="text-white mt-2">(02) 88250200 (HOTLINE)</p>
          </div>
        </div>

        {/* Bottom Section: Privacy Policy and Copyright */}
        <div className="text-center mt-4">
          <hr className="border-white opacity-20" />
          <p className="text-sm text-white mt-4">
            Copyright © 2024 RCS Logistics Philippines. All Rights Reserved |  
            <a href="/privacy" className="hover:text-[#D6D33C] ml-1">Privacy Policy</a> | {/* Updated hover color */}
            Designed By: <a href="https://divinesoftwaresystems.com" className="hover:text-yellow-400 ml-1">Divine Software Systems</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
