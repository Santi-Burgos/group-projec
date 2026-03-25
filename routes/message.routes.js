import { Router } from "express";
import { authToken } from "../middlewares/auth.middleware.js";
import { messageController } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.get('/getMessage', authToken, messageController.getMessage);
messageRouter.post('/sendMessage', authToken, messageController.sendMessage);

export default messageRouter;
