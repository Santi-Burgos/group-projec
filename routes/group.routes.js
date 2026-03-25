import { Router } from "express";
import { groupController } from "../controllers/group.controller.js";
import { authToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

const groupRouter = Router();

groupRouter.get('/getGroups', authToken, groupController.getGroups);
groupRouter.post('/createGroup', authToken, upload.single("group_img"), groupController.createGroup);
groupRouter.delete('/exitGroup', authToken, groupController.quitGroup);

export default groupRouter