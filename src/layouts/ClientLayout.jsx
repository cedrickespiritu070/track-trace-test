import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"


const ClientLayout = () => {
  return (
    <div>
      <header>
      </header>
      <Navbar/>
      <main>
        <Outlet /> 
      </main>

      <footer>
      <Footer/>

      </footer>
    </div>
  );
};

export default ClientLayout;
