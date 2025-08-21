import { verifyToken } from '../utils/decodedUtil.js';

export const authenticateSocket = (socket, next) => {
    let token = null;

    console.log(socket.handshake.headers)
    if (socket.handshake.headers['authorization']) {
        token = socket.handshake.headers['authorization'].split(' ')[1];
    } else if (socket.handshake.headers.cookie) {
        const cookies = socket.handshake.headers.cookie
            .split('; ')
            .reduce((acc, cookie) => {
                const [key, value] = cookie.split('=');
                acc[key] = value;
                return acc;
            }, {});
        token = cookies.access_token;   
    }

    if (!token) {
        return next(new Error('No token provided'));
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded || !decoded.id_user) {
            return next(new Error('Invalid token payload'));
        }

        socket.user = decoded;
        next();
    } catch (err) {
        return next(new Error('Invalid or expired token'));
    }
};
