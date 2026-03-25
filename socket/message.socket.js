import { messageService } from "../services/message.service.js";

export const setupSocket = (io) =>{
  io.on('connection', (socket) =>{
    socket.on('joinRoom', (groupId) =>{
      socket.join(groupId);
    })
    
    socket.on('sendMessage', async({groupId, msgBody})=>{
      try{
        const userId = socket.user?.id_user;
        if(userId) return;

        await messageService.sendMessage(userId, groupId, msgBody);
        const updatedMessages = await messageService.getMessages(groupId);

        io.to(groupId).emit("receiveMessage", updatedMessages);
      }catch(err){
        console.error('Error en el socket', err);
      }
    })

    socket.on("leaveRoom", (groupID) => {
      socket.leave(groupID);
      console.log(`Usuario ${socket.user?.id_user} salió del grupo: ${groupID}`);
    });
  });
}