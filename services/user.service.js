import { EntityNotFound } from "../middlewares/httpErrors.middleware.js"
import { userModels } from "../models/user.models.js";

class UserService {
  validateExistingUser = async(emailAddress) =>{
    try{
      console.log(emailAddress)
      const findUserByEmail = await userModels.findUserByEmail(emailAddress);
      console.log(findUserByEmail)

      return findUserByEmail;
    }catch(e){
      throw new EntityNotFound('User not exists');
    }
  }
}


export const userService = new UserService();