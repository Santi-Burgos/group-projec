import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import groupRouter from './group.routes.js';
import membersRouter from './members.routes.js';
import invitationRouter from './invitation.routes.js';
import messageRouter from './message.routes.js';

const router = Router();



router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/group', groupRouter);
router.use('/group/members', membersRouter);
router.use('/invitations', invitationRouter);
router.use('/messages', messageRouter);




export default router;  