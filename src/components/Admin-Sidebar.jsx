import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/RCS-Logo-White.png';
import UserProfile from '../assets/user-profile.svg';
import { logoutUser } from '../store/auth-slice';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user);
    const userName = user.user_name
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const handleLogout = () => {
        // // Clear the session data
        // sessionStorage.removeItem("isAuthenticated");
        // sessionStorage.removeItem("role");

        // // Redirect to the login page
        // navigate("/LoginSystem/Login");

        dispatch(logoutUser()).then(data => {
            if(data?.payload?.success) {
              toast.success(
                data?.payload?.message,
                {position: 'top-right'}
              )
            } else {
              toast.error(
                data?.payload?.message,
                {position: 'top-right'}
              )
            }
      
        })
        navigate('/auth/login')
            
    };

    const isActive = (path) => location.pathname === path ? 'text-yellow' : '';

    return (
        <div className="w-16 lg:w-64 lg:min-w-64 min-w-[64px] shadow-custom h-[100vh]">
            <div className="flex">
                {isOpen && (
                    <div 
                        className="fixed inset-0 bg-black opacity-50 lg:hidden z-50" 
                        onClick={toggleSidebar}>
                    </div>
                )}

                <div 
                    className={`shadow-custom h-[100vh] min-h-[100vh] overflow-y-auto fixed z-50 top-0 left-0 h-full bg-blue text-white transition-all duration-300 
                    ${isOpen ? 'w-64' : 'w-16'} lg:w-64`}>
                    <div className="flex flex-col items-center justify-center p-4 bg-blue gap-4">
                        <img src={Logo} alt="Logo" className="w-[80%]" />
                        <button 
                            className="text-white lg:hidden" 
                            onClick={toggleSidebar}>
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </div>

                    <div className="user-profile-container flex flex-col justify-center gap-3 mt-8">
                        <span className={` ${isOpen ? 'block' : 'hidden'} lg:block`}>
                            <img src={UserProfile} alt="UserProfile" className="w-[25%] mx-auto" />
                        </span>
                        <span className={` ${isOpen ? 'block' : 'hidden'} lg:block text-center`}>{userName}</span>
                    </div>

                    <div className="sidebar-items flex flex-col gap-20 mb-8">
                        <div className="sidebar-links">
                            <ul className="flex flex-col gap-4 mt-8 mx-2">
                                <li>
                                    <Link 
                                        to="/superAdmin/super-dashboard" 
                                        className={`flex items-center gap-3 p-2 hover:bg-[#0a3d6e] rounded-md ${isActive('/superAdmin/super-dashboard')}`}>
                                        <i className={`${isOpen ? 'mx-unset' : 'mx-auto'} lg:block lg:mx-0 fa-solid fa-chart-line`}></i>
                                        <span className={` ${isOpen ? 'block' : 'hidden'} lg:block`}>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/superAdmin/create-user" 
                                        className={`flex items-center gap-3 p-2 hover:bg-[#0a3d6e] rounded-md ${isActive('/superAdmin/create-user')}`}>
                                        <i className={`${isOpen ? 'mx-unset' : 'mx-auto'} lg:block lg:mx-0 fa-regular fa-square-plus`}></i>
                                        <span className={` ${isOpen ? 'block' : 'hidden'} lg:block`}>User Management</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/superAdmin/shipment-management"
                                        className={`flex items-center gap-3 p-2 hover:bg-[#0a3d6e] rounded-md ${isActive(
                                        "/superAdmin/shipment-management"
                                        )}`}
                                    >
                                        <i
                                        className={`${
                                            isOpen ? "mx-unset" : "mx-auto"
                                        } lg:block lg:mx-0 fa-solid fa-dolly`}
                                        ></i>
                                        <span
                                        className={` ${isOpen ? "block" : "hidden"} lg:block`}
                                        >
                                        Shipment Management
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/superAdmin/employee-directory" 
                                        className={`flex items-center gap-3 p-2 hover:bg-[#0a3d6e] rounded-md ${isActive('/superAdmin/employee-directory')}`}>
                                        <i className={`${isOpen ? 'mx-unset' : 'mx-auto'} lg:block lg:mx-0 fa-solid fa-people-group`}></i>
                                        <span className={` ${isOpen ? 'block' : 'hidden'} lg:block`}>Employee Directory</span>
                                    </Link>
                                </li>
                                
                            </ul>
                        </div>

                        <div 
                            className="logout-container flex gap-4 items-center justify-center cursor-pointer"
                            onClick={handleLogout}>
                            <i className={`${isOpen ? 'mx-unset' : 'mx-auto'} lg:block lg:mx-0 fa-solid fa-right-from-bracket`}></i>
                            <span className={` ${isOpen ? 'block' : 'hidden'} lg:block`}>Logout</span>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-6">
                    {/* Content goes here */}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
