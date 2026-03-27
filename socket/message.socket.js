import { messageService } from "../services/message.service.js";

export const setupSocket = (io) =>{
  io.on('connection', (socket) =>{
    socket.on('joinRoom', (groupId) =>{
      socket.join(groupId);
    })
    
    socket.on('sendMessage', async({groupID: groupId, msg_body: msgBody })=>{
      try{
        const userId = socket.user?.userId;

        if(!userId){
          console.error("No se encontró el ID del usuario en el socket");
          return;
        } 

        await messageService.sendMessage(msgBody, userId, groupId);
        const updatedMessages = await messageService.getMessages(groupId);

        io.to(groupId).emit("receiveMessage", updatedMessages);
      }catch(err){
        console.error('Error en el socket', err);
      }
    })

    socket.on("leaveRoom", (groupID) => {
      socket.leave(groupID);
      console.log(`Usuario ${socket.user?.userId} salió del grupo: ${groupID}`);
    });
  });
}