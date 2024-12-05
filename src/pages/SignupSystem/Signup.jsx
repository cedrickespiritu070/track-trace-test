import React, {useState} from 'react';
import bgImage from '../../assets/loginBG.jpg'; // Adjust the path as needed
import rcsLogo from '../../assets/RCS-Logo-Blue.png'; // Adjust the path as needed
import { Link, useNavigate } from 'react-router-dom';



const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();


    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
    const goToLoginLayout = () => {
        navigate('/LoginSystem/Login'); // Update path for Shipment Management under admin
      };
  
  return (
    <>
      <section id="hero" className="relative flex items-center justify-center h-[100vh] bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 opacity-50 bg-[#11487C]"></div>
        <div className="flex justify-center container mx-auto text-center z-10 ">
            <div className="flex flex-row w-full max-w-4xl shadow-xl bg-[#ffffff] rounded rounded-[20px] ">
                <div className="flex flex-col md:flex-row justify-between items-center w-full ">
                    {/* <!-- First Section: Image and Title --> */}
                    <div className="w-full md:w-1/2 flex flex-col items-center gap-3 px-[35px] py-[35px] bg-white rounded-[20px] shadow-lg">
                            <img src={rcsLogo} alt="RCS Logo" className="w-[282px] h-[88px]" />
                            
                            <h1 className="text-[40px] font-poppins font-semibold mb-4 text-center text-[#11487C]">Signup</h1>
                            <h3 className="text-[20px] font-poppins font-normal mb-4 text-center text-blue">
                                Enter your account information
                            </h3>

                            {/* <!-- Name Input --> */}
                            <div className="w-full flex items-center bg-[#E1E6F0] px-4 py-2 rounded-md mb-2">
                                <i className="fas fa-user text-blue mr-2"></i>
                                <input 
                                    type="text" 
                                    placeholder="Name" 
                                    className="w-full bg-transparent outline-none text-[16px] text-blue"
                                />
                            </div>

                            {/* <!-- Email Input --> */}
                            <div className="w-full flex items-center bg-[#E1E6F0] px-4 py-2 rounded-md mb-2">
                                <i className="fas fa-user text-blue mr-2"></i>
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    className="w-full bg-transparent outline-none text-[16px] text-blue"
                                />
                            </div>

                            {/* Password Input */}
                                <div className="w-full flex items-center bg-[#E1E6F0] px-4 py-2 rounded-md mb-2 relative">
                                    <i className="fas fa-lock text-blue mr-2"></i>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                        placeholder="Password"
                                        className="w-full bg-transparent outline-none text-[16px] text-blue pr-10" // Added right padding
                                    />
                                    {/* Eye Icon */}
                                    <i
                                        className={`fas ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} text-blue cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2`} // Position the icon
                                        onClick={togglePasswordVisibility} // Toggle visibility on click
                                    ></i>
                                </div>

                            {/* <!-- Buttons for Login and Register --> */}
                            <div className="w-full flex justify-between items-center gap-4 mb-4">
                                <button onClick={goToLoginLayout} className="w-full border border-[#11487C] text-[#11487C] text-[16px] font-semibold py-2 rounded-md">
                                    REGISTER
                                </button>
                            </div>

                            {/* <!-- Forgot Password Link --> */}
                            <a href="#" className="text-[14px] text-[#11487C]">
                                Already have an account
                            </a>
                        </div>


                    {/* <!-- Second Section: Contact Info --> */}
                    <div className="w-full md:w-1/2 flex flex-col h-full items-center justify-center p-8 bg-[#11487C] rounded-tr-[20px] rounded-br-[20px] hidden md:flex">
                        <i className="fas fa-headset text-[40px] text-white mr-2"></i>
                        <h2 className="text-lg font-bold mb-4 text-center text-white">Do you have more questions?</h2>
                        <p className="text-center text-white mb-4">
                            Feel free to reach out—We're here to help! Whether you need assistance or just have a quick question, don't hesitate to contact us.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </section>
    </>
  );
};

export default Signup;
