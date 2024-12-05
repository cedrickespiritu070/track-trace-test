import React from 'react';
import Sidebar from '../components/Admin-Sidebar';
import { Outlet } from 'react-router-dom'; // Import Outlet for child routes

const SuperAdminLayout = () => {
    return (
        <div className="super-admin-layout flex bg-[#d5e1ed]">
            <Sidebar />
            <div className="flex-grow">
                <main className='bg-white h-full'>
                    <Outlet /> {/* This is where child routes like ShipmentManagement will render */}
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
