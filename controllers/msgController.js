import Message from "../models/msgModel.js"

export const getMessage = [
    async(req, res) =>{

        try{
            const {groupID} = req.query;
            console.log(groupID)
            const takeMessage = await Message.getMessage(groupID)
            res.status(200).json(takeMessage)
        }catch(err){
            console.error("Error al conseguir los mensaje:", err);
            res.status(400).json({ message: err.message });
        } 
    }
]
export const sendMessage = [
    async (req, res) =>{
        try{
            const userID = req.user.id_user
            const {msg_body, groupID} = req.body
            const postMessage = await Message.sendMessage({
                    userID, 
                    groupID,
                    msg_body    
                });
                res.status(201).json(postMessage)
        }catch(err){
            console.error("Error al enviar mensaje:", err);
            res.status(400).json({ message: err.message });
          }
    }
]
