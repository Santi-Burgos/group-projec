import bcrypt from 'bcrypt';
import { InternalServerError, UnauthorizedError } from '../middlewares/httpErrors.middleware.js';

export const hashPassword = async(password) =>{
  try{
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
  }catch(e){
    console.error("Bcrypt Error:", e);
    throw new InternalServerError('Cant create user, try in another moment')
  }
} 

export const compareHashedPassword = async(currentPassword, passwordOnTheDatabase)=>{
  const isMatchPassword = await bcrypt.compare(currentPassword, passwordOnTheDatabase)
  if(!isMatchPassword){
    throw new UnauthorizedError('Passwords must match')
  }
}