/* eslint-disable react-hooks/set-state-in-effect */
import { faTimes, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthForm = ({ typeAuth, onClose }) => {
    const [type, setType] = useState(typeAuth);
    const [saveInfo, setSaveInfo] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { register, login, loading, clearError } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => onClose(), 300);
    };

    useEffect(() => {
        if (type) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => (document.body.style.overflow = 'auto');
    }, [type]);

    // Reset form khi chuyển đổi giữa login và signup
    useEffect(() => {
        setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        setFormError('');
        setSuccess(false);
        clearError();
    }, [type]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error khi user bắt đầu nhập
        if (formError) setFormError('');
    };

    const validateForm = () => {
        if (type === 'signup') {
            if (!formData.fullName.trim()) {
                setFormError('Vui lòng nhập họ tên');
                return false;
            }
            if (formData.fullName.trim().length < 2) {
                setFormError('Tên phải có ít nhất 2 ký tự');
                return false;
            }
        }

        if (!formData.email.trim()) {
            setFormError('Vui lòng nhập email');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setFormError('Email không hợp lệ');
            return false;
        }

        if (!formData.password) {
            setFormError('Vui lòng nhập mật khẩu');
            return false;
        }

        if (formData.password.length < 6) {
            setFormError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        if (type === 'signup') {
            if (!formData.confirmPassword) {
                setFormError('Vui lòng xác nhận mật khẩu');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setFormError('Mật khẩu không khớp');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setFormError('');
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        try {
            let result;
            if (type === 'login') {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(
                    formData.fullName,
                    formData.email,
                    formData.password,
                    formData.confirmPassword
                );
            }

            if (result.success) {
                setSuccess(true);
                // Đóng modal sau 1 giây
                setTimeout(() => {
                    handleClose();
                }, 1000);
            } else {
                setFormError(result.error);
            }
        } catch (error) {
            setFormError(error.message || 'Đã có lỗi xảy ra');
        }
    };

    const content = (
        <div
            className={`fixed inset-0 z-50 flex justify-center items-center p-4 ${
                isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
            }`}
        >
            <div
                className={`absolute inset-0 bg-[#00000066] cursor-pointer ${
                    isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
                }`}
                onClick={handleClose}
            ></div>
            <div
                className={`max-w-xl max-h-[650px] z-1000 bg-gray-100 p-[30px] rounded-xl relative overflow-y-scroll ${
                    isClosing ? 'modal-exit' : 'modal-enter'
                }`}
            >
                <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer absolute top-4 right-4 hover:bg-gray-300 transition-colors"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
                <div className="mt-[50px] flex flex-col items-center gap-y-3">
                    <Link
                        to="/"
                        className="h-10 w-10 rounded-md bg-linear-to-br logo-font from-orange-400 to-orange-600 text-white grid place-items-center text-2xl "
                    >
                        E
                    </Link>
                    <h3 className="text-2xl font-bold text-center">
                        {type === 'login'
                            ? 'Đăng nhập vào EduMaster'
                            : 'Đăng ký tài khoản EduMaster'}
                    </h3>
                    <p className="w-[min(400px,90%)] text-center text-[#f33a58] text-sm">
                        Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng
                        chung sẽ bị khóa.
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="max-w-[360px] mx-auto mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <span className="text-sm">
                            {type === 'login' ? 'Đăng nhập thành công!' : 'Đăng ký thành công!'}
                        </span>
                    </div>
                )}

                {/* Error Message */}
                {formError && (
                    <div className="max-w-[360px] mx-auto mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                        <FontAwesomeIcon icon={faExclamationCircle} />
                        <span className="text-sm">{formError}</span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="max-w-[360px] mx-auto mt-8 flex flex-col gap-4"
                >
                    {type === 'signup' && (
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="fullName"
                                className="text-sm font-semibold text-[#292929]"
                            >
                                Tên của bạn?
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Họ và tên của bạn..."
                                spellCheck="false"
                                disabled={loading}
                                className="w-full h-11 text-[13px] bg-white border-2 border-gray-300 rounded-full py-3 pr-[42px] pl-5 outline-0 focus:ring-1 focus:ring-[#1dbfaf] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-[#292929]">
                            {type === 'login' ? 'Email' : 'Địa chỉ Email'}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Nhập email của bạn..."
                            spellCheck="false"
                            disabled={loading}
                            className="w-full h-11 text-[13px] bg-white border-2 border-gray-300 rounded-full py-3 pr-[42px] pl-5 outline-0 focus:ring-1 focus:ring-[#1dbfaf] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-semibold text-[#292929]">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Nhập mật khẩu của bạn..."
                            spellCheck="false"
                            disabled={loading}
                            className="w-full h-11 text-[13px] bg-white border-2 border-gray-300 rounded-full py-3 pr-[42px] pl-5 outline-0 focus:ring-1 focus:ring-[#1dbfaf] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    {type === 'signup' && (
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-semibold text-[#292929]"
                            >
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Nhập lại mật khẩu..."
                                spellCheck="false"
                                disabled={loading}
                                className="w-full h-11 text-[13px] bg-white border-2 border-gray-300 rounded-full py-3 pr-[42px] pl-5 outline-0 focus:ring-1 focus:ring-[#1dbfaf] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    )}
                    {type === 'login' && (
                        <div className="ml-2.5">
                            <label htmlFor="">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    id="savedInfo"
                                    checked={saveInfo}
                                    onChange={() => setSaveInfo(!saveInfo)}
                                />
                                <label htmlFor="savedInfo" onClick={() => setSaveInfo(!saveInfo)}>
                                    <span
                                        className={`text-sm font-medium pl-6 relative cursor-pointer text-gray-600 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:border-2 before:rounded-sm before:border-[#1dbfaf] ${
                                            saveInfo ? 'before:bg-[#1dbfaf]' : 'before:bg-white'
                                        } ${
                                            saveInfo
                                                ? "after:content-['✓'] after:absolute after:left-1 after:top-1/2 after:-translate-y-1/2 after:text-white after:text-[10px] after:font-bold"
                                                : "after:content-['']"
                                        }`}
                                    >
                                        Ghi nhớ đăng nhập
                                    </span>
                                </label>
                            </label>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[linear-gradient(70.06deg,#2cccff_-5%,#22dfbf_106%)] text-white font-semibold py-3 px-5 rounded-full cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {type === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                            </span>
                        ) : (
                            <span>{type === 'login' ? 'Đăng nhập' : 'Đăng ký'}</span>
                        )}
                    </button>
                </form>
                <div className="mt-[34px] text-sm flex flex-col items-center">
                    {type === 'login' ? (
                        <p className="font-medium">
                            Bạn chưa có tài khoản?{' '}
                            <span
                                className="text-[#f05123] underline underline-offset-2 cursor-pointer"
                                onClick={() => setType('signup')}
                            >
                                Đăng ký
                            </span>
                        </p>
                    ) : (
                        <p className="font-medium">
                            Bạn đã có tài khoản?{' '}
                            <span
                                className="text-[#f05123] underline underline-offset-2 cursor-pointer"
                                onClick={() => setType('login')}
                            >
                                Đăng nhập
                            </span>
                        </p>
                    )}
                    <p className="font-medium mt-2.5 text-[#f05123] underline underline-offset-2 cursor-pointer">
                        Quên mật khẩu?
                    </p>
                    <p className="py-4 text-[11px] w-[min(400px,100%)] text-center text-[#666]">
                        Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với{' '}
                        <a className="underline underline-offset-2 cursor-pointer">
                            điều khoản sử dụng
                        </a>{' '}
                        của chúng tôi.
                    </p>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.getElementById('modal-root'));
};

export default AuthForm;
