import { messageModel } from "../models/message.models.js";

class MessageService {
  getMessages = async(groupId) =>{
    const getMessages = messageModel.getMessage(groupId);
    return getMessages;
  }

  sendMessage = async(msgBody, userId, groupId)=>{
    await messageModel.sendMessage(msgBody, userId, groupId);
    return{
      success: true
    }
  }
}

export const messageService = new MessageService();