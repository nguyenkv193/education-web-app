export const validateAuthForm = (formData, type) => {
    const errors = {};

    if (type === 'signup') {
        if (!formData.fullName?.trim()) {
            errors.fullName = 'Vui lòng nhập họ và tên';
        } else if (formData.fullName.trim().length < 3) {
            errors.fullName = 'Họ và tên phải có ít nhất 3 ký tự';
        }
    }

    if (!formData.username?.trim()) {
        errors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.trim().length < 3) {
        errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!formData.password) {
        errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (type === 'signup') {
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu không khớp';
        }
    }

    return errors;
};
