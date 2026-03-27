import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function MainLayout() {
    return (
        <>
            <Header />
            <div className="flex md:flex-row flex-col-reverse">
                <Sidebar />
                <main className="flex-1 md:pl-2.5 md:pr-8 px-3">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </>
    );
}
