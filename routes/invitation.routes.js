import { invitationController } from "../controllers/invitation.controller.js";
import { authToken } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const invitationRouter = Router();

invitationRouter.post('/createInvitation', authToken, invitationController.createInvitation)
invitationRouter.get('/getInvitations', authToken, invitationController.getNotification)
invitationRouter.post('/acceptInvitations', authToken, invitationController.acceptedInvitation)
invitationRouter.delete('/rejectInvitations', authToken, invitationController.rejectedInvitation)

export default invitationRouter;