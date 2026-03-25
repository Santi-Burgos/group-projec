import { invitationModel } from "../models/Invitation.models.js";
import { userService } from "../services/user.service.js"
import { memberGroupService } from "../services/member.service.js"
import { EntityNotFound, HttpError, InternalServerError } from "../middlewares/httpErrors.middleware.js";

class InvitationService {
  getAllInvitations = async(userId) =>{
    try{
      const getNotifications = await invitationModel.getAllNotification(userId);
      return{
        success: true,
        data: getNotifications?.rows === 0 ? getNotifications : []
      }
    }catch(error){
      throw error;
    }
  }

  createInvitation = async(invitedByUserId, groupId, emailAddress) =>{
    try{
      const invitedUserId = await userService.validateExistingUser(emailAddress);

      const getMembersIds = await memberGroupService.getMembersIds(groupId);
      const membersIds = getMembersIds.map(m => m.id_users);

      if(membersIds.includes(invitedUserId)){
        throw new InternalServerError('User already belongs to the group');
      }

      const validateNotification = await invitationModel.validateInvitation(invitedUserId, groupId);
      if(validateNotification){
        throw new InternalServerError();
      }

      const sendInvitation = await invitationModel.sendInvitation(groupId, invitedUserId, invitedByUserId, 1);

      return{
        success: true,
        data: sendInvitation
      }
    }catch(error){
      throw error
    }
  } 

  acceptedInvitation = async(userId, groupId) =>{
    try{
      const successInvitation = await invitationModel.acceptedInvitation(groupId, userId);
      if(!successInvitation || successInvitation.length === 0){
        throw new EntityNotFound('Invitation doesnt exists')
      }

      return{
        success: true
      }
    }catch(error){
      throw error
    }
  }

  rejectedInvitation = async(userId, groupId) =>{
    try{
      const successInvitation = await invitationModel.deleteInvitation(groupId, userId);
      if(!successInvitation || successInvitation.length === 0){
        throw new EntityNotFound('Invitation doesnt exists')
      }

      return{
        success: true
      }
    }catch(error){
      throw error
    }
  }
}


export const invitationService = new InvitationService();