import { groupMemberController } from "../controllers/members.controller.js";
import { authToken } from "../middlewares/auth.middleware.js";
import { Router } from "express";


const membersRouter = Router();

membersRouter.get('getMembers', authToken, groupMemberController.getMembersGroup);
membersRouter.put('editRole', authToken, groupMemberController.editMemberGroup);
membersRouter.delete('deleteMember',authToken, groupMemberController.deleteMemberGroup);

export default membersRouter;