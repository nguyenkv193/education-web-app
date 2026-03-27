import React from 'react';
import { NavLink } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen">
            <AdminHeader />

            <div className="flex">
                <AdminSidebar />

                <main className="flex-1 bg-white p-6 min-h-svh w-full">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
