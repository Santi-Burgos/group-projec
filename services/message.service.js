import { messageModel } from "../models/message.models.js";

class MessageService {
  getMessages = async(groupId) =>{
    try{
      const getMessages = messageModel.getMessage(groupId);
      return getMessages;
    }catch(error){
      throw error
    }
  }

  sendMessage = async(userId, msgBody, groupId)=>{
    try{
      await messageModel.sendMessage(userId, groupId, msgBody);
      return{
        success: true
      }
    }catch(error){
      next(error);
    }
  }
}

export const messageService = new MessageService();