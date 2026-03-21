import { AuthService } from "../services/auth.service.js";
import { AuthController } from "../controllers/authController.js";


export const authService =  new AuthService();
export const authController = new AuthController(authService);