import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChevronDown, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const AdminHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-6">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="h-10 w-10 rounded-md bg-linear-to-br from-orange-400 to-orange-600 text-white grid place-items-center text-2xl ">
                        E
                    </div>
                    <div className="text-sm font-bold tracking-wide">EduMaster</div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 ml-auto">
                    <button className="relative w-10 h-10 rounded-full  cursor-pointer bg-white border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center group">
                        <FontAwesomeIcon
                            icon={faBell}
                            className="text-gray-500 group-hover:text-gray-700 transition-colors"
                        />
                        <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>

                    <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer hover:border-gray-100"
                        >
                            <div
                                alt="Admin"
                                className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-orange-600 shadow-sm flex items-center justify-center text-white font-bold"
                            >
                                {user?.fullName?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-gray-700 leading-none">
                                    {user?.fullName || 'Admin User'}
                                </p>
                                <p className="text-[11px] text-gray-400 font-medium mt-1">
                                    {user?.role === 'admin' ? 'Super Admin' : user?.role || 'Admin'}
                                </p>
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`text-gray-400 text-xs hidden md:block ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-900">{user?.fullName}</p>
                                    <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
