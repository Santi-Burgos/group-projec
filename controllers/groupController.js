import { groupService } from "../services/group.service.js"; 

class GroupController{
  getGroups = async(req, res, next) =>{
    const userId = req.user.id_user;
    try{
      const getGroups = await groupService.getGroupsForUser(userId);
      res.status(200).json(getGroups);
    }catch(e){
      next(e)
    }
  }  
  
  createGroup = async(req, res, next) =>{
    const userId = req.user.id_user;
    const { 
      group_name: groupName, 
      group_description: groupDescription, 
      address_mail: emailAddress } = req.body;
    const file = req.file;

    try{
      const createdGroup = await groupService.createGroup(groupName, groupDescription, emailAddress, userId, file);
      res.status(201).json(createdGroup);
    }catch(e){
      next(e)
    }
  }

  quitGroup = async(req, res, next) =>{
    const userId = req.user.id_user;
    const {groupId} =  req.body;
      
    try{
      const quitGroup = await groupService.quitGroup(userId, groupId);
      res.status(200).json(quitGroup);
    }catch(e){
      next(e)
    }
  }
}