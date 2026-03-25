import { messageService } from "../services/message.service.js";

class MessageController{
  getMessage = async(req, res, next) =>{
    const { groupId } = req.query;
    try{
      const getMessages = await messageService.getMessages(groupId);
      res.status(200).json(getMessages);
    }catch(error){
      next(error)
    }
  }

  sendMessage = async(req, res, next)=>{
    const userId = req.user.id_user;
    const {msgBody, groupId} = req.body;
    try{
      const sendMessage = await messageService.sendMessage(msgBody, userId, groupId);
      res.status(200).json(sendMessage);
    }catch(error){
      next(error);
    }
  }

}

export const messageController = new MessageController();
