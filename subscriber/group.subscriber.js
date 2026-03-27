import { groupModels } from "../models/group.models";
import { memberGroupModels } from "../models/groupMember.models.js";
import groupEvents from "../utils/groupEvents.utils.js";

groupEvents.on('userLeft', async(groupId)=>{
  try{
    const members = await groupModels.getUserForGroup(groupId);
    if(!members || members.length === 0){
      return await groupModels.deleteEmptyGroup(groupId); 
    }

    const hasAdminInGroup = await memberGroupModels.checkHasAnotherOwner(groupId);
    if(!hasAdminInGroup || hasAdminInGroup.length === 0){
      await memberGroupModels.ascendOwnerMember(groupId);
      //enviar notificacion de aviso
    }
    return;
  }catch(error){
    console.error("Error en evento userLeft:", error.message);
  }
})