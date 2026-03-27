import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faNewspaper, faRoad } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="fixed bottom-0 left-0 right-0 md:sticky md:top-16 md:self-start md:w-24 px-2 py-2 md:pt-3 md:pb-4 bg-white z-40">
            <ul className="flex h-full md:flex-col md:items-stretch items-center justify-evenly gap-4">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-px rounded-xl p-2 md:px-2 md:py-3 text-xs font-medium transition-colors ${
                                isActive
                                    ? 'md:bg-gray-200 text-orange-600 md:text-[#1a1a1a]'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`
                        }
                    >
                        <span className="rounded-lg text-lg">
                            <FontAwesomeIcon icon={faHouse} />
                        </span>
                        <span>Trang chủ</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/learning-paths"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-px rounded-xl p-2 md:px-2 md:py-3 text-xs font-medium transition-colors ${
                                isActive
                                    ? 'md:bg-gray-200 text-orange-600 md:text-[#1a1a1a]'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`
                        }
                    >
                        <span className="rounded-lg text-lg">
                            <FontAwesomeIcon icon={faRoad} />
                        </span>
                        <span>Lộ trình</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/blog"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-px rounded-xl p-2 md:px-2 md:py-3 text-xs font-medium transition-colors ${
                                isActive
                                    ? 'md:bg-gray-200 text-orange-600 md:text-[#1a1a1a]'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`
                        }
                    >
                        <span className="rounded-lg text-lg">
                            <FontAwesomeIcon icon={faNewspaper} />
                        </span>
                        <span>Bài viết</span>
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
