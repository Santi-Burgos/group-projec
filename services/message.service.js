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

  sendMessage = async(msgBody, userId, groupId)=>{
    try{
      await messageModel.sendMessage(msgBody, userId, groupId);
      return{
        success: true
      }
    }catch(error){
      throw error;
    }
  }
}

export const messageService = new MessageService();