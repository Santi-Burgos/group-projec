import { verifyToken } from '../utils/decodedUtil.js';
import { InternalServerError, UnauthorizedError } from './httpErrors.middleware.js';

export const authenticateSocket = (socket, next) => {
  try{
    let token = socket.handshake.auth?.token;

    if (!token && socket.handshake.headers['authorization']) {
        token = socket.handshake.headers['authorization'].split(' ')[1];
    }

    if (!token && socket.handshake.headers.cookie) {
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
        return next(new UnauthorizedError('No token provided'));
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
          return next(new UnauthorizedError('Invalid token payload'));
        }
        socket.user = decoded;
        next();
    } catch (error) {
        console.error(`Invalid token ${error.message}`);
        return next(new UnauthorizedError('Invalid or expired token'));
    }
  }catch(error){
    throw new InternalServerError(`Socket error ${error.message}`)
  }
};
