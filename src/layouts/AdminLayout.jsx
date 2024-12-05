import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom'; // Import Outlet for child routes

const AdminLayout = () => {
    return (
        <div className="admin-layout flex bg-[#d5e1ed]">
            <Sidebar />
            <div className="flex-grow">
                <main className='bg-white h-full'>
                    <Outlet /> {/* This is where child routes like ShipmentManagement will render */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
