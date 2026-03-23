import { userService } from '../services/user.service.js';

class UserController {
  registerUser = async(req, res, next) =>{
    const { address_mail, username, password } = req.body;
    try{
      const createUser = await userService.createUser(address_mail, username, password);
      res.status(201).json({createUser})
    }catch(e){
      next(e)
    }
  }

  getUser = async(req, res, next) =>{
    try{
      const userId = req.user.id_user;
      const getUser = await userService.getUserWitoutPassword(userId);
      res.status(200).json(getUser);
    }catch(e){
      next(e)
    }
  }

  editUser = async(req, res, next) =>{
    try{
      const userId = req.user.id_user;
      const {
        address_mail: emailAddress, 
        username, 
        password: newPassword, 
        currentPassword
      } = req.body;

      const updatedUser = await userService.editUser(emailAddress, username, newPassword, currentPassword, userId)
      res.status(200).json(updatedUser);
    }catch(e){
      next(e)
    }
  }

  deleteUser = async(req, res, next) =>{
    try{
      const userId = req.user.id_user;
      const userDelete = await userService.deleteUser(userId)
      res.status(200).json(userDelete)
    }catch(e){
      next(e)
    }
  }

}

export const userController = new UserController();