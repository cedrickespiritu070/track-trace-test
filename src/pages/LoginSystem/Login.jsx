import React, { useState } from 'react';
// import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import bgImage from '../../assets/loginBG.jpg';
import rcsLogo from '../../assets/RCS-Logo-Blue.png';
// import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { loginUser } from '../../store/auth-slice';

const Login = () => {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: ''
  });

  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   dispatch(loginUser(credentials)).then(data => {
  //     console.log("Login Response Payload:", data);
  //     if(data?.payload?.success) {
  //       toast.success(
  //         data?.payload?.message,
  //         {position: 'top-right'}
  //       )
  //     } else {
  //       toast.error(
  //         data?.payload?.message,
  //         {position: 'top-right'}
  //       )
  //     }

  //   })
  // }

  const handleLogin = (e) => {
    e.preventDefault();

    // Start loading
    setLoading(true);

    dispatch(loginUser(credentials))

      .then((data) => {
        // Login success
        console.log("Login Response Payload:", data);

        if (data.payload?.success) {
          toast.success(data.payload.message, { position: 'top-right' });
        } else {
          toast.error(data.payload?.message || 'Login failed', { position: 'top-right' });
        }
      })
      .catch((error) => {
        // Login error
        console.error("Login Error:", error);
        toast.error(error.message || 'An unexpected error occurred', { position: 'top-right' });
      })
      .finally(() => {
        // Stop loading
        setLoading(false);
      });
  };

  // const goToSignUp = () => navigate('/SignupSystem/Signup');

  return (
    <>
      <section id="hero" className="relative flex items-center justify-center h-[100vh] bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 opacity-50 bg-[#11487C]"></div>
        <div className="flex justify-center container mx-auto text-center z-10">
          <div className="flex flex-row w-full max-w-4xl shadow-xl bg-[#ffffff] rounded-[20px]">
            <div className="flex flex-col md:flex-row justify-between items-center w-full">
              <div className="w-full md:w-1/2 flex flex-col items-center gap-3 px-[35px] py-[35px] bg-white rounded-[20px] shadow-lg">
                <img src={rcsLogo} alt="RCS Logo" className="w-[282px] h-[88px]" />
                <h1 className="text-[40px] font-poppins font-semibold mb-4 text-center text-[#11487C]">Login</h1>
                <h3 className="text-[20px] font-poppins font-normal mb-4 text-center text-blue">Enter your account login information</h3>

                <div className="w-full flex items-center bg-[#E1E6F0] px-4 py-2 rounded-md mb-2">
                  <i className="fas fa-user text-blue mr-2"></i>
                  <input
                    type="text"
                    name="userName"
                    value={credentials.userName}
                    onChange={handleInputChange}
                    placeholder="Username"
                    autoComplete="off" // Disable autofill here
                    className="w-full bg-transparent outline-none text-[16px] text-blue"
                  />
                </div>

                <div className="w-full flex items-center bg-[#E1E6F0] px-4 py-2 rounded-md mb-2 relative">
                  <i className="fas fa-lock text-blue mr-2"></i>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    autoComplete="off" // Disable autofill here as well
                    className="w-full bg-transparent outline-none text-[16px] text-blue pr-10"
                  />
                  <i
                    className={`fas ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} text-blue cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2`}
                    onClick={togglePasswordVisibility}
                  ></i>
                </div>
                <div className="w-full flex justify-between items-center gap-4 mb-4">
                  <button
                    onClick={handleLogin}
                    disabled={loading} // Disable button if loading
                    className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#11487C]'} text-yellow text-[16px] font-semibold py-2 rounded-md hover:bg-yellow hover:text-blue`}
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i> // Display spinner when loading
                    ) : (
                      'LOGIN'
                    )}
                  </button>

                </div>

              </div>
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

export default Login;
