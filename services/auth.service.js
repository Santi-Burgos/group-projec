import { userService } from './user.service.js';
import { UnauthorizedError } from "../middlewares/httpErrors.middleware.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import { config as configDotenv } from 'dotenv';

configDotenv();

export class AuthService {
  auth = async(emailAddress, password)=> {
    const JWT_ACCESSTOKEN_TIME = '1h';
    const existingUser = await userService.validateExistingUser(emailAddress);
    if(!existingUser){
      throw new UnauthorizedError('Email or password are invalid');
    }

    await this.validatePassword(password, existingUser.password);

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

  validatePassword = async(password, existingPassword)=> {
    const isMatch = await bcrypt.compare(password, existingPassword);
    if (!isMatch) {
      throw new UnauthorizedError('Email or password are invalid');
    }
    return true
  }
}

export const authService = new AuthService();