import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col min-h-screen bg-base-200">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-6">
                <div key={location.pathname} className="animate-fade-in">
                    <Outlet />
                </div>
            </main>
            <Footer />
            <Toaster position="bottom-right" />
        </div>
    );
};

export default MainLayout;
