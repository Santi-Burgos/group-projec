import { userService } from './user.service.js';
import { UnauthorizedError } from "../middlewares/httpErrors.middleware.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import { config as configDotenv } from 'dotenv';

configDotenv();

export class AuthService {
  auth = async(emailAddress, encryptedPassword)=> {
    const JWT_ACCESSTOKEN_TIME = '1h';
    const existingUser = await userService.validateExistingUser(emailAddress);
    await this.validatePassword(encryptedPassword, existingUser.password);

    const userId = existingUser.id_users;

    const tokenPayload = {
      userId: userId,
      userEmailAddress: emailAddress,
    }

    const AccessToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: JWT_ACCESSTOKEN_TIME  }
    )

    return {
      status: true,
      access_token: AccessToken
    }
  }

  validatePassword = async(encryptedPassword, existingPassword)=> {
    const isMatch = await bcrypt.compare(encryptedPassword, existingPassword);
    if (!isMatch) {
      throw new UnauthorizedError('Email or password are invalid');
    }
    return true
  }
}

export const authService = new AuthService();