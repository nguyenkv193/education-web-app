import jwt from 'jsonwebtoken';

export const generateToken = (userId, secret, expiresIn = '7d') => {
    return jwt.sign({ id: userId }, secret, {
        expiresIn,
    });
};

export const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};

