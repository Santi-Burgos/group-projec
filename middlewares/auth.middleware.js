import { userModels } from '../models/user.models.js';
import { verifyToken } from '../utils/decodedUtil.js';
import { EntityNotFound, UnauthorizedError } from './httpErrors.middleware.js';

export const authToken = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = req.cookies.access_token || authHeader && authHeader.split(' ')[1];

  if (!token) { 
    throw new UnauthorizedError('Not token provided')
  } 

    let decoded;
    try {
      decoded = verifyToken(token);
    }catch(error){ 
      throw new UnauthorizedError('invalid token')
    } 

    if (!decoded || !decoded.userId){ 
      throw new UnauthorizedError('invalid token payload') 
    } 
    req.user = decoded; 
    
    const userId = decoded.userId
    const user = await userModels.findUserById(userId); 

    if (!user) { 
      throw new EntityNotFound('User doesnt exists') 
    } 
    next(); 
  };
