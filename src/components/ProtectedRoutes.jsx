import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, gracePeriod = 15000 }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
  const userRole = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("user_id"); // Check for user_id
  const userName = sessionStorage.getItem("user_name"); // Check for user_name
  const lastActiveTime = sessionStorage.getItem("lastActiveTime");

  const checkSessionExpiry = () => {
    const currentTime = new Date().getTime();

    // Expire session if lastActiveTime is set and the grace period has passed
    if (lastActiveTime && currentTime - lastActiveTime > gracePeriod) {
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("user_id"); // Remove user_id on session expiry
      sessionStorage.removeItem("user_name"); // Remove user_name on session expiry
      sessionStorage.removeItem("shipment_count"); // Remove shipment_count on session expiry
      sessionStorage.removeItem("lastActiveTime");
      setIsSessionExpired(true);
    } else {
      setIsSessionExpired(false);
      sessionStorage.setItem("lastActiveTime", currentTime);
    }
  }
    

  useEffect(() => {
    if (!isAuthenticated || !userId || !userName) return; // If not authenticated or user_id or user_name missing, skip session check

    // Check session expiry initially and add activity listeners
    checkSessionExpiry();

    // Update activity time on user interaction
    const handleActivity = () => {
      const currentTime = new Date().getTime();
      sessionStorage.setItem("lastActiveTime", currentTime);
    };

    window.addEventListener("mousemove", handleActivity);

    // Cleanup on unmount
    return () => window.removeEventListener("mousemove", handleActivity);
  }, [isAuthenticated, gracePeriod, userId, userName]);

  // Redirect to login if session expired or user is not authenticated
  if (!isAuthenticated || !userId || isSessionExpired) {
    return <Navigate to="/LoginSystem/Login" />;
  }

  // Check for required role and redirect unauthorized users
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/LoginSystem/Login" />;
  }

  return children; // Render the children if authenticated and authorized
};

export default ProtectedRoute;
