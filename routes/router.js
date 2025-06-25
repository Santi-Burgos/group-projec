import express from 'express';
import { getUser, registerUser, editUser, deleteUserController} from '../controllers/userController.js';
import { loginUser, logoutUser } from '../controllers/authController.js';
import { authToken } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadsMiddleware.js';
import { createGroup, getGroups, quitGroup } from '../controllers/groupController.js';
import { acceptedInvitation, createInvitation, getNotification, rejectedInvitation } from '../controllers/notificationController.js';
import { getMessage, sendMessage } from '../controllers/msgController.js';
import { deleteMemberController, editMemberController, getMembersGroupController } from '../controllers/groupMembersController.js';


const router = express.Router();


router.post('/create', registerUser);
router.post('/login', loginUser);
router.post('/logout', authToken, logoutUser)

router.get('/profile', authToken, getUser);
router.put('/profile', authToken, editUser)
router.delete('/profile', authToken, deleteUserController)

router.get('/group/members', authToken, getMembersGroupController );
router.put('/group/members', authToken, editMemberController);
router.delete('/group/members',authToken, deleteMemberController );

router.get('/main', authToken, getGroups);
router.post('/creategroup', authToken, upload.single("group_img"), createGroup)
router.delete('/main', authToken, quitGroup)
router.post('/main', authToken, createInvitation)

router.get('/msg-group', getMessage) 
router.post('/msg-group', authToken, sendMessage)

router.get('/notification', authToken, getNotification)
router.post('/notification', authToken, acceptedInvitation)
router.delete('/notification', authToken, rejectedInvitation)




export default router;  