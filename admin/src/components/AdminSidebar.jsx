import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faBook,
  faChartColumn,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { to: "/admin", label: "Dashboard", icon: faChartLine },
    { to: "/admin/users", label: "Người dùng", icon: faUsers },
    { to: "/admin/courses", label: "Khóa học", icon: faBook },
    { to: "/admin/analytics", label: "Thống kê", icon: faChartColumn },
    { to: "/admin/payments", label: "Thanh toán", icon: faCreditCard },
  ];

  const handleNavClick = (path) => {
    console.log("Navigate to:", path);
    navigate(path);
  };

  return (
    <aside className="w-full lg:w-64 bg-white p-4 fixed bottom-0 left-0 self-start lg:sticky lg:top-20 lg:left-0 flex lg:flex-col flex-row gap-2 lg:gap-0 z-50 lg:z-0">
      <nav className="space-y-1 flex lg:flex-col flex-row justify-between w-full">
        {menu.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <button
              key={item.to}
              onClick={() => handleNavClick(item.to)}
              className={`flex lg:flex-row flex-col items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all cursor-pointer border-0 bg-transparent ${
                isActive
                  ? "bg-orange-50 text-orange-600 border border-orange-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-lg w-5 text-center"
              />
              <span className="whitespace-nowrap sm:block hidden">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
