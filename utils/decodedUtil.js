import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../middlewares/httpErrors.middleware.js';


export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    return decoded; 
  }catch (error) {
    console.error('Error verify token', error.message);
    throw new UnauthorizedError('Invalid or expired token');
  }
};
