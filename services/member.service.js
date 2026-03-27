import { UnauthorizedError } from "../middlewares/httpErrors.middleware.js";
import { memberGroupModels } from "../models/members.models.js"
import { roleCanDo } from "../utils/valuesRoles.utils.js";

class MemberGroupService{
  getMembersGroup = async(groupId)=>{
    const getMembers = await memberGroupModels.getMembersAll(groupId);
    return{
      success: true,
      data: getMembers
    }
  }

  deleteMemberGroup = async(userId, memberId, groupId) =>{
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
  }

  editMemberGroup = async(userId, memberId, groupId, newIdRol) =>{
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
  }

  getMembersGroupOnlyId = async(groupId)=>{
    const getMembers = await memberGroupModels.getMembersId(groupId);
    return getMembers
  }
}

export const memberGroupService = new MemberGroupService();