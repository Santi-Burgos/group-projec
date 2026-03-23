import { groupModels } from "../models/group.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import groupEvents from "../utils/groupEvents.utils.js";

class GroupServices{
  createGroup = async(groupName, groupDescription, invitationEmail, userId, files) =>{
    let uploadFiles;
    try{
      if(files){
        uploadFiles = await uploadToCloudinary(files);
      }
      const createdGroup = await groupModels.createGroup(
        groupName,
        groupDescription,
        userId,
        uploadFiles.imgName,
        uploadFiles.urlImg
      );

      //usar funcion de enviar notificacion;

      return {
        success: true,
        data: createdGroup
      }
    }catch(error){
      throw error
    }
  }

  getGroupsForUser = async(userId) =>{
    try{
      const groups = await groupModels.getUserForGroup(userId);
      return{
        success: true,
        data: groups ?? []
      }
    }catch(error){
      throw error
    }
  }

  quitGroup = async(userId, groupId) =>{
    try{
      await groupModels.quitGroup(groupId, userId);

      groupEvents.emit('userLeft', {groupId});
      return{
        success: true
      }
    }catch(error){
      throw error
    }
  }
}

export const groupService = new GroupServices();