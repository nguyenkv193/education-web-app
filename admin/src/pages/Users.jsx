import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faSearch,
    faPlus,
    faEdit,
    faTrash,
    faEnvelope,
    faCalendar,
} from '@fortawesome/free-solid-svg-icons';

const Users = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            username: 'nguyenvana',
            displayName: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            joinDate: '21-11-2025',
            status: 'active',
            role: 'Student',
            courses: 5,
        },
        {
            id: 2,
            username: 'tranthib',
            displayName: 'Trần Thị B',
            email: 'tranthib@email.com',
            joinDate: '20-11-2025',
            status: 'active',
            role: 'Instructor',
            courses: 12,
        },
        {
            id: 3,
            username: 'lethic',
            displayName: 'Lê Thị C',
            email: 'lethic@email.com',
            joinDate: '15-11-2025',
            status: 'inactive',
            role: 'Student',
            courses: 2,
        },
        {
            id: 4,
            username: 'phamvand',
            displayName: 'Phạm Văn D',
            email: 'phamvand@email.com',
            joinDate: '10-11-2025',
            status: 'active',
            role: 'Student',
            courses: 8,
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const deleteUser = id => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Tổng người dùng', value: users.length, color: 'text-blue-600', bg: 'bg-blue-50' },
        {
            label: 'Đang hoạt động',
            value: users.filter(u => u.status === 'active').length,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Không hoạt động',
            value: users.filter(u => u.status === 'inactive').length,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
    ];

    return (
        <div className="lg:p-4 p-3">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý người dùng</h1>
                <p className="text-gray-500 text-sm">Quản lý tất cả người dùng trong hệ thống</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    {stat.label}
                                </p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div
                                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                            >
                                <FontAwesomeIcon icon={faUsers} className={stat.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, username..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all text-sm"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Liên hệ
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Khóa học
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Ngày tham gia
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                {user.displayName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {user.displayName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                className="text-gray-400 text-xs"
                                            />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {user.courses}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">khóa học</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FontAwesomeIcon
                                                icon={faCalendar}
                                                className="text-gray-400 text-xs"
                                            />
                                            {user.joinDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                user.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    user.status === 'active'
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                }`}
                                            />
                                            {user.status === 'active'
                                                ? 'Hoạt động'
                                                : 'Không hoạt động'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center">
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className="text-sm"
                                                />
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-sm"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="py-12 text-center">
                        <FontAwesomeIcon icon={faUsers} className="text-gray-300 text-5xl mb-4" />
                        <p className="text-gray-500 font-medium">Không tìm thấy người dùng nào</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Thử thay đổi bộ lọc hoặc tìm kiếm
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination (placeholder) */}
            {filteredUsers.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Hiển thị <span className="font-semibold">{filteredUsers.length}</span> trong
                        tổng số <span className="font-semibold">{users.length}</span> người dùng
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Trước
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
                            1
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            2
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
