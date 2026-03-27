import { invitationService } from "../services/invitation.service.js";

class InvitationController{
  getNotification = async (req, res, next) =>{
    const userId = req.user.userId
    try{
      const getNotifications = await invitationService.getAllInvitations(userId);
      res.status(200).json(getNotifications);
    }catch(error){
      next(error)
    }
  }

  createInvitation = async(req, res, next)=>{
    const invitedByUserId = req.user.userId;
    const {groupID: groupId, address_mail: emailAddress} = req.body;
    try{
      const createInvitation = await invitationService.createInvitation(invitedByUserId, groupId, emailAddress);
      res.status(200).json(createInvitation);
    }catch(error){
      next(error);
    }
  }

  acceptedInvitation = async(req, res, next) =>{
    const userId = req.user.userId;
    const {groupID: groupId} = req.body;
    try{
      const acceptInvitation = await invitationService.acceptedInvitation(groupId, userId);
      res.status(200).json(acceptInvitation);
    }catch(error){
      next(error);
    }
  }

  rejectedInvitation = async(req, res, next) =>{
    const userId = req.user.userId;
    const groupId = req.body;
    try{
      const rejectInvitation = await invitationService.rejectedInvitation(groupId, userId);
      res.status(200).json(rejectInvitation);
    }catch(error){
      next(error);
    }
  }

}
export const invitationController = new InvitationController();