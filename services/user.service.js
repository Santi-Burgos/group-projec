import { EntityNotFound, HttpError } from "../middlewares/httpErrors.middleware.js"
import { userModels } from "../models/user.models.js";
import { compareHashedPassword, hashPassword } from "../utils/hashPassword.utils.js";

class UserService {
  createUser = async (emailAddress, username, password) => {
    const existUser = await this.validateExistingUser(emailAddress);

    if (existUser) {
      throw new HttpError('Address mail is already used', 401);
    }

    const hashedPassword = await hashPassword(password);
    const userToCreate = await userModels.createUser(emailAddress, username, hashedPassword);
    return {
      success: true,
      data: userToCreate
    }
  }

  editUser = async (newAddressMail, newUsername, newPassword, currentPassword, userId) => {
    const currentUserData = await this.getFullUser(userId);
    await compareHashedPassword(currentPassword, currentUserData.password);

    let hashedPassword = currentUserData.password;
    if (newPassword) {
      hashedPassword = await hashPassword(newPassword);
    }

    const emailAddress = newAddressMail || currentUserData.address_mail;
    const username = newUsername || currentUserData.username;

    const updatedUser = await userModels.editUser(emailAddress, hashedPassword, username, userId)
    return {
      success: true,
      data: updatedUser
    }
  }

  deleteUser = async (userId) => {
    await userModels.deleteUser(userId);
    return {
      success: true
    }
  }

  getUserWitoutPassword = async (userId) => {
    const userGived = await this.getFullUser(userId);
    const userWitoutPassword = { ...userGived };
    delete userWitoutPassword.password;
    return {
      success: true,
      data: userWitoutPassword
    }
  }

  getFullUser = async (userId) => {
    try {
      const userGived = await userModels.findUserById(userId);
      if (!userGived) {
        throw new EntityNotFound('Error retrieving user data');
      }
      return userGived
    } catch (error) {
      throw new EntityNotFound(`Error retrieving user data: ${error.message}`)
    }
  }

  validateExistingUser = async (emailAddress) => {
    try {
      const findUserByEmail = await userModels.findUserByEmail(emailAddress);
      return findUserByEmail;
    } catch (error) {
      console.error('Error en validateExistingUser', error)
      throw new HttpError('Error al validar el uso del correo', 400);
    }
  }
}


export const userService = new UserService();