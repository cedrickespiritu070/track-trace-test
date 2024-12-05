import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import LoginLayout from './layouts/LoginLayout';
import SignupLayout from './layouts/SignupLayout';
import AdminLayout from './layouts/AdminLayout';
import TrackAndTrace from './pages/client/TrackAndTrace';
import ShipmentManagement from './pages/admin/ShipmentManagement';
import TransactionHistory from './pages/admin/TransactionHistory';
import Dashboard from './pages/admin/Dashboard';
import CreateShipment from './pages/admin/CreateShipment';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperDashboard from './pages/superAdmin/SuperDashboard';
import CreateUser from './pages/superAdmin/CreateUser';
import NotFound from './pages/NotFound';
import ClientFAQ from './pages/client/ClientFAQ';
import Tracking from './pages/client/Tracking/Tracking';
import Login from './pages/LoginSystem/Login';
import Signup from './pages/SignupSystem/Signup';
import ProtectedRoute from './components/ProtectedRoutes'
import '../src/assets/css/css-loaders.css';
import { useDispatch, useSelector } from 'react-redux';
import CheckAuth from './components/CheckAuth';
import UnauthPage from './pages/UnauthPage';
import { checkAuth } from './store/auth-slice';
import EmployeeDirectory from './pages/superAdmin/EmployeeDirectory';
import SuperShipmentManagement from './pages/superAdmin/SuperShipmentManagement';

function App() {

  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);


  if (isLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center bg-blue">
        {/* <div className="loader bg-[#d6d348]"></div> */}
        <i class="fa-solid fa-truck-fast text-4xl animate-smooth-drive text-[#d6d348]"></i>
      </div>
    );
  }



  return (
    <Router>
      <Routes>

        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <LoginLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
        </Route>

        {/* Client-side routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<TrackAndTrace />} /> {/* Default route */}
          <Route path="/client/ClientFAQ" element={<ClientFAQ />} />
          <Route path="tracking/:trackingNumber" element={<Tracking />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
        </Route>

        {/* Admin-side routes */}
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path="shipment-management" element={<ShipmentManagement />} />
          <Route path="transaction-history" element={<TransactionHistory />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-shipment" element={<CreateShipment />} />
        </Route>

        {/* Super-Admin-side routes */}
        <Route path="/superAdmin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <SuperAdminLayout />
          </CheckAuth>
        }>
          <Route path="super-dashboard" element={<SuperDashboard />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="shipment-management" element={<SuperShipmentManagement />} />
          <Route path="employee-directory" element={<EmployeeDirectory />} />
        </Route>

        {/* Login-side routes */}
        {/* <Route path="/LoginSystem" element={<LoginLayout />}>
          <Route path="/LoginSystem/Login" element={<Login />} />
        </Route> */}



        {/* Signup-side routes */}
        {/* <Route path="/SignupSystem" element={<SignupLayout />}>
          <Route path="/SignupSystem/Signup" element={<Signup />} />
        </Route> */}

        {/* Separate Login route if needed */}
        <Route path="/login" element={<LoginLayout />}>
          <Route index element={<Login />} /> {/* Default login route */}
        </Route>

        <Route path='/unauth-page' element={<UnauthPage />} />
      </Routes>

    </Router>
  );
}

export default App;
