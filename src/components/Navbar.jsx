import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Logo from '../assets/RCS-Logo-White.png';

const Navbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  const goToLoginLayout = () => {
    navigate('/auth/login'); // Update path for Shipment Management under admin
  };

  return (
    <nav className="bg-[#0B2849] py-7 font-poppins uppercase">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Aesthetic Date and Time */}
        
        <div className="flex flex-row justify-center items-center text-center">
          <img src={Logo} alt="Your Logo" className="h-10 w-[150px]" />
        </div>
        <div className="flex justify-center">
          <button
            onClick={goToLoginLayout}
            className="bg-[#D6D33C] text-blue px-5 py-2 rounded-md hover:bg-blue hover:text-yellow"
          >
            Login Portal
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
