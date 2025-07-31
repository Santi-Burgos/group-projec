import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { verifyToken } from '../utils/decodedUtil.js';

export const authToken = async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({
            message: 'No token provided',
            details: 'El token de acceso no está presente en las cookies',
        });
    }

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token',
            details: error.message || 'El token es inválido o ha expirado',
        });
    }

    if (!decoded || !decoded.id_user) {
        return res.status(401).json({
            message: 'Invalid token payload',
            details: 'El token no contiene un id_user válido',
        });
    }

    req.user = decoded;

    const user = await User.findById({userID: decoded.id_user});


    if (!user) {
      return res.status(401).json({ message: 'El usuario ya no existe' });
    }

    next(); 
};
