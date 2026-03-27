import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faBook,
  faUsers,
  faCalendar,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

const Payments = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025');

  const revenueData = {
    2025: [
      { month: 'Tháng 1', revenue: 12500000, courses: 45, students: 320 },
      { month: 'Tháng 2', revenue: 11800000, courses: 38, students: 290 },
      { month: 'Tháng 3', revenue: 15200000, courses: 52, students: 410 },
    ],
    2024: [
      { month: 'Tháng 1', revenue: 12500000, courses: 45, students: 320 },
      { month: 'Tháng 2', revenue: 11800000, courses: 38, students: 290 },
      { month: 'Tháng 3', revenue: 15200000, courses: 52, students: 410 },
    ],
    2023: [
      { month: 'Tháng 1', revenue: 9800000, courses: 32, students: 250 },
      { month: 'Tháng 2', revenue: 11200000, courses: 41, students: 330 },
      { month: 'Tháng 3', revenue: 10800000, courses: 39, students: 310 },
    ],
  };

  const transactions = [
    {
      id: 1,
      student: 'Nguyễn Văn A',
      course: 'ReactJS Cơ bản',
      amount: '499.000đ',
      date: '21-11-2025',
      status: 'completed',
    },
    {
      id: 2,
      student: 'Trần Thị B',
      course: 'NodeJS Nâng cao',
      amount: '799.000đ',
      date: '20-11-2025',
      status: 'completed',
    },
    {
      id: 3,
      student: 'Lê Thị C',
      course: 'Python Machine Learning',
      amount: '699.000đ',
      date: '15-11-2025',
      status: 'pending',
    },
  ];

  const currentData = revenueData[selectedPeriod] || [];
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCourses = currentData.reduce((sum, item) => sum + item.courses, 0);
  const totalStudents = currentData.reduce((sum, item) => sum + item.students, 0);

  return (
    <div className="lg:p-4 p-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thống kê doanh thu</h1>
        <select
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none bg-white"
        >
          <option value="2025">Năm 2025</option>
          <option value="2024">Năm 2024</option>
          <option value="2023">Năm 2023</option>
        </select>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faDollarSign} className="text-green-600 text-xl" />
            </div>
            <FontAwesomeIcon icon={faChartLine} className="text-green-500 text-sm" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
          <p className="text-3xl font-bold text-gray-900">
            {totalRevenue.toLocaleString()}đ
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} className="text-blue-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Khóa học bán được</p>
          <p className="text-3xl font-bold text-gray-900">{totalCourses}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-purple-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Học viên mới</p>
          <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Doanh thu theo tháng - {selectedPeriod}
        </h2>
        <div className="space-y-4">
          {currentData.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-700 w-24">
                {item.month}
              </span>
              <div className="flex-1">
                <div className="relative">
                  <div className="bg-gray-100 h-8 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-pink-500 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(item.revenue / 20000000) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {((item.revenue / 20000000) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 w-36 text-right">
                {item.revenue.toLocaleString()}đ
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Lịch sử giao dịch gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày giao dịch
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.student}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{transaction.course}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-green-600">
                      {transaction.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                      {transaction.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${transaction.status === 'completed'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${transaction.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                          }`}
                      ></span>
                      {transaction.status === 'completed'
                        ? 'Hoàn thành'
                        : 'Đang xử lý'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
