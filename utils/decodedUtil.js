import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../middlewares/httpErrors.middleware';


export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    return decoded; 
  }catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
