import express from 'express';
import { authToken } from '../middlewares/authMiddleware.js';
import { acceptedInvitation, createInvitation, getNotification, rejectedInvitation } from '../controllers/notificationController.js';
import { getMessage, sendMessage } from '../controllers/msgController.js';
import { deleteMemberController, editMemberController, getMembersGroupController } from '../controllers/members.controller.js';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import groupRouter from './group.routes.js';

const router = express.Router();



router.use('/auth/', authRouter);
router.use('/user/', userRouter);
router.use('/group/', groupRouter);


router.get('/group/members', authToken, getMembersGroupController );
router.put('/group/members', authToken, editMemberController);
router.delete('/group/members',authToken, deleteMemberController );

router.post('/main', authToken, createInvitation)

router.get('/msg-group', getMessage) 
router.post('/msg-group', authToken, sendMessage)

router.get('/notification', authToken, getNotification)
router.post('/notification', authToken, acceptedInvitation)
router.delete('/notification', authToken, rejectedInvitation)




export default router;  