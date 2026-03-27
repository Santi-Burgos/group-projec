import { memberGroupService } from "../services/member.service.js";

class GroupMembersController{
  getMembersGroup = async(req, res, next)=>{
    const groupId = req.query.groupID;
    try{       
      const takeMembersGroup = await memberGroupService.getMembersGroup(groupId);
      res.status(200).json(takeMembersGroup);
    }catch(error){
      next(error)
    }
  }

  deleteMemberGroup = async(req, res, next)=> {
    const userId = req.user.id_user; 
    const {memberDelete , groupId} = req.body; 
    try{
      const removeMember = await memberGroupService.deleteMemberGroup(userId, groupId, memberDelete);
      res.status(200).json(removeMember);
    }catch(error){
      next(error)
    }
  }

  editMemberGroup = async(req, res, next) =>{
    const userId = req.user.id_user;
    const {groupID: groupId, editMember, id_rol: idRol} = req.body;
    try{
      const editRolMember = await memberGroupService.editMemberGroup(userId, groupId, editMember, idRol);
      res.status(200).json(editRolMember);
    }catch(error){
      next(error);
    }
  }
}

export const groupMemberController = new GroupMembersController();