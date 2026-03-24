import { groupController } from "../controllers/group.controller.js";
import { Router } from "express";
import { authToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadsMiddleware.js";

const groupRouter = Router();

groupRouter.get('/getGroups', authToken, groupController.getGroups);
groupRouter.post('/createGroup', authToken, upload.single("group_img"), groupController.createGroup);
groupRouter.delete('/exitGroup', authToken, groupController.quitGroup);

export default groupRouter