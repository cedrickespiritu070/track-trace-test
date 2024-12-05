import React from 'react';
import Login from '../pages/LoginSystem/Login';
import { Outlet } from 'react-router';

const LoginLayout = () => {
    return (
        <div className="login-layout">
            {/* <Login /> */}
            <Outlet />
        </div>
    );
};

export default LoginLayout;
