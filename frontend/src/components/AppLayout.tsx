import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
};

export default AppLayout; 