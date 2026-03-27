import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faBookOpen,
    faDollarSign,
    faNewspaper,
    faArrowUp,
    faArrowDown,
    faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const stats = [
        {
            title: 'Tổng người dùng',
            value: '1,234',
            change: '+12.5%',
            isPositive: true,
            icon: faUsers,
            color: 'bg-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
        },
        {
            title: 'Khóa học',
            value: '56',
            change: '+3.2%',
            isPositive: true,
            icon: faBookOpen,
            color: 'bg-green-500',
            bg: 'bg-green-50',
            text: 'text-green-600',
        },
        {
            title: 'Doanh thu',
            value: '$12,345',
            change: '-2.4%',
            isPositive: false,
            icon: faDollarSign,
            color: 'bg-orange-500',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
        },
        {
            title: 'Bài viết',
            value: '89',
            change: '+5.7%',
            isPositive: true,
            icon: faNewspaper,
            color: 'bg-purple-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
        },
    ];

    const recentOrders = [
        {
            id: '#ORD-001',
            user: 'Nguyễn Văn A',
            course: 'ReactJS Pro',
            amount: '$99',
            status: 'Completed',
            date: '2 mins ago',
        },
        {
            id: '#ORD-002',
            user: 'Trần Thị B',
            course: 'NodeJS Master',
            amount: '$89',
            status: 'Pending',
            date: '15 mins ago',
        },
        {
            id: '#ORD-003',
            user: 'Lê Văn C',
            course: 'HTML CSS Pro',
            amount: '$49',
            status: 'Completed',
            date: '1 hour ago',
        },
        {
            id: '#ORD-004',
            user: 'Phạm Thị D',
            course: 'JavaScript Advanced',
            amount: '$129',
            status: 'Failed',
            date: '3 hours ago',
        },
    ];

    return (
        <div className="lg:p-4 p-3">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Xin chào, Admin! 👋</h1>
                <p className="text-gray-500 mt-1">
                    Đây là tổng quan về tình hình hoạt động của hệ thống hôm nay.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            </div>
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.text}`}
                            >
                                <FontAwesomeIcon icon={stat.icon} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span
                                className={`flex items-center gap-1 font-medium ${
                                    stat.isPositive ? 'text-green-500' : 'text-red-500'
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={stat.isPositive ? faArrowUp : faArrowDown}
                                    className="text-xs"
                                />
                                {stat.change}
                            </span>
                            <span className="text-gray-400 ml-2">so với tháng trước</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Giao dịch gần đây</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <FontAwesomeIcon icon={faEllipsisH} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Khóa học
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Giá trị
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {order.user.charAt(0)}
                                                </div>
                                                {order.user}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.course}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${
                                                    order.status === 'Completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                            {order.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Courses / Mini Stats */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
                        <h3 className="font-bold text-lg mb-1">Phiên bản Pro</h3>
                        <p className="text-indigo-100 text-sm mb-6">
                            Nâng cấp để mở khóa toàn bộ tính năng quản trị nâng cao.
                        </p>
                        <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                            Nâng cấp ngay
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Khóa học phổ biến</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                        <img
                                            src={`https://picsum.photos/seed/${i}/100`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800 truncate">
                                            Lập trình Web Fullstack
                                        </h4>
                                        <p className="text-xs text-gray-500">1.2k học viên</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">$99</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
