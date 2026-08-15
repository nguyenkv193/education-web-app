/* eslint-disable react-hooks/static-components */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// --- 1. SVG ICONS COMPONENTS (Để code gọn hơn) ---
const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
    </svg>
);
const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
    </svg>
);
const BellIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
    </svg>
);
const ChevronRightIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);
const CameraIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
);
const GlobeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
    </svg>
);
const GithubIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const Settings = () => {
    const { user, updateProfile, changePassword } = useAuth();

    const [activeTab, setActiveTab] = useState('personal');
    const [editModal, setEditModal] = useState(null);

    const [displayData, setDisplayData] = useState({
        fullName: '',
        email: '',
        bio: '',
        website: '',
        github: '',
        avatar: '',
    });
    const [editData, setEditData] = useState({ ...displayData });

    // STATE: Mật khẩu (Mock logic)
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    // STATE: Thông báo (Mock logic)
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false,
    });

    // Cập nhật dữ liệu khi user thay đổi
    useEffect(() => {
        if (user) {
            const newData = {
                fullName: user?.fullName || '',
                email: user?.email || '',
                bio: user?.bio || '',
                website: user?.website || '',
                github: user?.github || '',
                avatar: user?.avatar || '',
            };
            // The authenticated user is an external source for this local form state.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplayData(newData);
            setEditData(newData);
        }
    }, [user]);

    // --- HANDLERS ---
    const handleOpenModal = field => {
        setEditModal(field);
        setEditData({ ...displayData });
    };
    const handleCloseModal = () => {
        setEditModal(null);
    };

    // Xử lý lưu thông tin cá nhân
    const handleSaveField = async field => {
        if (!user) {
            alert('Vui lòng đăng nhập.');
            return;
        }
        setDisplayData({ ...displayData, [field]: editData[field] }); // Optimistic UI
        setEditModal(null);
        try {
            if (field === 'avatar' && !editData.avatar) return;
            const payload =
                field === 'avatar' ? { avatar: editData.avatar } : { [field]: editData[field] };
            await updateProfile(payload);
        } catch (err) {
            console.error('Lỗi:', err);
            // Revert nếu lỗi (cần logic phức tạp hơn chút để revert chuẩn, ở đây làm đơn giản)
            alert('Cập nhật thất bại, vui lòng tải lại trang.');
        }
    };

    // Xử lý đổi mật khẩu (Mock)
    const handlePasswordChange = e => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        // Gọi API change password
        (async () => {
            try {
                await changePassword(passwordData.current, passwordData.new);
                alert('Đổi mật khẩu thành công');
                setPasswordData({ current: '', new: '', confirm: '' });
            } catch (err) {
                alert(`Đổi mật khẩu thất bại: ${err?.message || 'Lỗi'}`);
            }
        })();
    };

    // --- SUB-COMPONENTS (RENDER HELPERS) ---

    // 1. Tab Sidebar Item
    const SidebarItem = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
        ${
            activeTab === id
                ? 'bg-orange-50 text-[#f05123] shadow-sm ring-1 ring-orange-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    // 2. Info Row (Cho phần Personal)
    const InfoRow = ({ label, value, onClick, isAvatar }) => (
        <div
            onClick={onClick}
            className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-4 flex-1">
                {isAvatar && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-100 shrink-0">
                        {value ? (
                            <img src={value} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full grid place-items-center text-gray-400">
                                <UserIcon />
                            </div>
                        )}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-0.5">{label}</span>
                    <span className={`text-sm text-gray-900 ${!value && 'text-gray-400 italic'}`}>
                        {isAvatar
                            ? value
                                ? 'Nhấn để thay đổi'
                                : 'Chưa cập nhật'
                            : value || 'Chưa cập nhật'}
                    </span>
                </div>
            </div>
            <div className="text-gray-300 group-hover:text-[#f05123] transition-colors">
                {isAvatar ? <CameraIcon /> : <ChevronRightIcon />}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] md:px-8 px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 lg:hidden">Cài đặt tài khoản</h1>

            <div className="grid grid-cols-12 gap-8">
                {/* --- SIDEBAR --- */}
                <aside className="col-span-12 lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                        <div className="p-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Cài đặt</h3>
                            <p className="text-xs text-gray-500 mt-1">Quản lý tài khoản của bạn</p>
                        </div>
                        <nav className="p-2 space-y-1">
                            <SidebarItem
                                id="personal"
                                label="Thông tin cá nhân"
                                icon={<UserIcon />}
                            />
                            <SidebarItem
                                id="security"
                                label="Mật khẩu & Bảo mật"
                                icon={<LockIcon />}
                            />
                            <SidebarItem
                                id="notifications"
                                label="Tùy chọn thông báo"
                                icon={<BellIcon />}
                            />
                        </nav>
                    </div>
                </aside>

                {/* --- MAIN CONTENT AREA --- */}
                <main className="col-span-12 lg:col-span-9 space-y-6">
                    {/* CONTENT 1: THÔNG TIN CÁ NHÂN */}
                    {activeTab === 'personal' && (
                        <>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                                        Hồ sơ cá nhân
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <InfoRow
                                        label="Ảnh đại diện"
                                        value={displayData.avatar}
                                        isAvatar={true}
                                        onClick={() => handleOpenModal('avatar')}
                                    />
                                    <InfoRow
                                        label="Họ và tên"
                                        value={displayData.fullName}
                                        onClick={() => handleOpenModal('fullName')}
                                    />
                                    <InfoRow
                                        label="Email"
                                        value={displayData.email}
                                        onClick={() => handleOpenModal('email')}
                                    />
                                    <InfoRow
                                        label="Giới thiệu"
                                        value={displayData.bio}
                                        onClick={() => handleOpenModal('bio')}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                                        Mạng xã hội
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <div
                                        onClick={() => handleOpenModal('website')}
                                        className="group flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 grid place-items-center">
                                                <GlobeIcon />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">
                                                    Website
                                                </div>
                                                <div className="text-sm text-gray-900">
                                                    {displayData.website || 'Chưa cập nhật'}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRightIcon />
                                    </div>
                                    <div
                                        onClick={() => handleOpenModal('github')}
                                        className="group flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 grid place-items-center">
                                                <GithubIcon />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">
                                                    GitHub
                                                </div>
                                                <div className="text-sm text-gray-900">
                                                    {displayData.github || 'Chưa cập nhật'}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRightIcon />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* CONTENT 2: BẢO MẬT */}
                    {activeTab === 'security' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                                    Đổi mật khẩu
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Nên sử dụng mật khẩu mạnh để bảo vệ tài khoản
                                </p>
                            </div>
                            <div className="p-6">
                                <form
                                    onSubmit={handlePasswordChange}
                                    className="max-w-md space-y-5"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mật khẩu hiện tại
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f05123]/20 focus:border-[#f05123] outline-none transition-all"
                                            placeholder="••••••••"
                                            value={passwordData.current}
                                            onChange={e =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    current: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f05123]/20 focus:border-[#f05123] outline-none transition-all"
                                            placeholder="••••••••"
                                            value={passwordData.new}
                                            onChange={e =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    new: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f05123]/20 focus:border-[#f05123] outline-none transition-all"
                                            placeholder="••••••••"
                                            value={passwordData.confirm}
                                            onChange={e =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    confirm: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-[#f05123] text-white font-medium rounded-lg hover:bg-[#d0441b] shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                                        >
                                            Cập nhật mật khẩu
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* CONTENT 3: THÔNG BÁO */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                                    Cài đặt thông báo
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Chọn loại thông báo bạn muốn nhận
                                </p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    {
                                        id: 'email',
                                        title: 'Thông báo qua Email',
                                        desc: 'Nhận email về hoạt động tài khoản và cập nhật bảo mật.',
                                    },
                                    {
                                        id: 'push',
                                        title: 'Thông báo đẩy (Push)',
                                        desc: 'Nhận thông báo ngay lập tức trên trình duyệt.',
                                    },
                                    {
                                        id: 'marketing',
                                        title: 'Tin tức & Khuyến mãi',
                                        desc: 'Nhận thông tin về sản phẩm mới và các ưu đãi.',
                                    },
                                ].map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="pr-8">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.title}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {item.desc}
                                            </div>
                                        </div>
                                        {/* Toggle Switch UI */}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications[item.id]}
                                                onChange={() =>
                                                    setNotifications({
                                                        ...notifications,
                                                        [item.id]: !notifications[item.id],
                                                    })
                                                }
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f05123]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* --- EDIT MODAL (Giữ nguyên logic cũ nhưng UI clean hơn) --- */}
            {editModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editModal === 'fullName'
                                    ? 'Sửa Họ tên'
                                    : editModal === 'email'
                                    ? 'Sửa Email'
                                    : editModal === 'bio'
                                    ? 'Sửa Giới thiệu'
                                    : editModal === 'avatar'
                                    ? 'Đổi Ảnh đại diện'
                                    : editModal === 'website'
                                    ? 'Sửa Website'
                                    : 'Sửa GitHub'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            {editModal === 'avatar' ? (
                                <div className="text-center space-y-4">
                                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-100">
                                        {editData.avatar ? (
                                            <img
                                                src={editData.avatar}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="grid place-items-center h-full bg-gray-100 text-gray-400">
                                                <UserIcon />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#f05123] hover:file:bg-orange-100 cursor-pointer"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = ev => {
                                                // Nén ảnh đơn giản
                                                const img = new Image();
                                                img.onload = () => {
                                                    const canvas = document.createElement('canvas');
                                                    const scale = Math.min(
                                                        1,
                                                        800 / Math.max(img.width, img.height)
                                                    );
                                                    canvas.width = img.width * scale;
                                                    canvas.height = img.height * scale;
                                                    canvas
                                                        .getContext('2d')
                                                        .drawImage(
                                                            img,
                                                            0,
                                                            0,
                                                            canvas.width,
                                                            canvas.height
                                                        );
                                                    setEditData({
                                                        ...editData,
                                                        avatar: canvas.toDataURL('image/jpeg', 0.8),
                                                    });
                                                };
                                                img.src = ev.target.result;
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                </div>
                            ) : editModal === 'bio' ? (
                                <textarea
                                    value={editData[editModal]}
                                    onChange={e =>
                                        setEditData({ ...editData, [editModal]: e.target.value })
                                    }
                                    className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f05123] focus:ring-2 focus:ring-[#f05123]/20 outline-none"
                                />
                            ) : (
                                <input
                                    type={editModal === 'email' ? 'email' : 'text'}
                                    value={editData[editModal]}
                                    onChange={e =>
                                        setEditData({ ...editData, [editModal]: e.target.value })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f05123] focus:ring-2 focus:ring-[#f05123]/20 outline-none"
                                />
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleSaveField(editModal)}
                                className="px-4 py-2 bg-[#f05123] text-white rounded-lg text-sm font-medium hover:bg-[#d0441b]"
                            >
                                Lưu lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
