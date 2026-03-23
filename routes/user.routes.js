import { userController } from "../controllers/userController.js";
import { Router } from "express";
import { authToken } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.post('/create', userController.registerUser);
userRouter.get('/get', authToken, userController.getUser);
userRouter.put('/update', authToken, userController.editUser);
userRouter.delete('/delete', authToken, userController.deleteUser);

export default userRouter;