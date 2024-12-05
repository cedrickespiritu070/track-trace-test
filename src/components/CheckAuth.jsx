import React from 'react'
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children, isLoading }) => {
    const location = useLocation();

    if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        return <Navigate to="/auth/login" />;
    }

    if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        if (user?.role === 'Employee') {
            return <Navigate to="/admin/dashboard" />;
        } else if (user?.role === 'Superadmin') {
            return <Navigate to="/superAdmin/super-dashboard" />;
        }
    }

    if (isAuthenticated) {
        if (user?.role !== 'Superadmin' && location.pathname.includes('/superAdmin')) {
            return <Navigate to="/unauth-page" />;
        }
        if (user?.role !== 'Employee' && location.pathname.includes('/admin')) {
            return <Navigate to="/unauth-page" />;
        }
    }

    return <>{children}</>;
}


export default CheckAuth
