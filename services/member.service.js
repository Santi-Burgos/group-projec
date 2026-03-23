import { UnauthorizedError } from "../middlewares/httpErrors.middleware";
import { memberGroupModels } from "../models/groupMember.models"
import rolMember from "../models/groupMemberUtil";
import { roleCanDo } from "../utils/valuesRoles.utils";

class MemberGroupService{
  getMembersGroup = async(groupId)=>{
    try{
      const getMembers = await memberGroupModels.getMembersAll(groupId);
      return{
        success: true,
        data: getMembers
      }
    }catch(error){
      throw error
    }
  }

  deleteMemberGroup = async(userId, memberId, groupId) =>{
    try{
      const actuatorRoles = await memberGroupModels.getRolMember(userId, groupId);
      const passiveRoles = await memberGroupModels.getRolMember(memberId, groupId);

      const canDeleteUser = await roleCanDo(actuatorRoles, passiveRoles)
      if(!canDeleteUser){
        throw new UnauthorizedError('Cannot delete the user');
      }

      await memberGroupModels.deleteMember(memberId, groupId);
      return{
        success: true
      }
    }catch(error){
      throw error
    }
  }

  editMemberGroup = async(userId, memberId, groupId, newIdRol) =>{
    try{
      const actuatorRoles = await memberGroupModels.getRolMember(userId, groupId);
      const passiveRoles = await memberGroupModels.getRolMember(memberId, groupId);

      const canEditUser = await roleCanDo(actuatorRoles, passiveRoles)
      if(!canEditUser){
        throw new UnauthorizedError('Cannot delete the user');
      }

      await memberGroupModels.editMember(memberId, groupId, newIdRol);
      return{
        success: true
      }
    }catch(error){
      throw error
    }
  }
}

export const memberGroupService = new MemberGroupService();