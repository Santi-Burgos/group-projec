import Invitation from "../models/InvitationModel.js";

export const getNotification = [
    
    async (req, res)=> {
    try{
        const userID = req.user.id_user
        const takeNotification = await Invitation.getAllNotification({userID});

        if(!takeNotification || takeNotification.legth === 0){
            return res.status(404).json({
                message: 'No notification found',
                details: `No se encontraron notifiaciones asociados al usuario ${userID}`
            })
        }
        res.status(200).json(takeNotification);
    }catch(error){
        console.error('Error en el controlador Notificaciones:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            details: error.message || 'Ocurrió un error inesperado en el servidor',
        });
    }
}]

export const createInvitation = [
     async(req, res)=>{
        try{
            const userID = req.user.id_user;
            const {groupID, address_mail} = req.body;
            const sendInvitation = await Invitation.sendInvitation({
                userID,
                groupID,
                address_mail
            })
            res.status(201).json(sendInvitation)
        }catch{
            console.error('Error en el controlador Notificaciones:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            details: error.message || 'Ocurrió un error inesperado en el servidor',
        })
     }
}]


export const acceptedInvitation = [
    async(req, res) =>{
        try{
            const userID = req.user.id_user;
            const {groupID} = req.body

            const successInvitation = await Invitation.acceptedInvitation({groupID, userID});
            if(!successInvitation || successInvitation.length === 0){
                return res.status(404).json({
                    message: 'No notification found',
                    details: `No se encontraron notifiaciones asociados al usuario ${userID}`
                })
            }
            res.status(200).json(successInvitation)
        }catch(error){
            console.error('Error en el controlador Notificaciones:', error.message);
            res.status(500).json({
            message: 'Internal server error',
            details: error.message || 'Ocurrió un error inesperado en el servidor',
        });
        }
    }
]

export const rejectedInvitation = [
    async(req, res) =>{
        try{
            const userID = req.user.id_user;
            const {groupID} = req.body;
            
            const declineInvitation = await Invitation.rejectedInvitation({groupID, userID})
            if(!declineInvitation || declineInvitation.length === 0){
                return res.status(404).json({
                    message:'No notification found',
                    details: `no se encontraron notificaciones asociadas al usuario ${userID}`
                })
            }
            res.status(200).json(declineInvitation)
        }catch(error){
            console.error('Error en el controlador Notificaciones:', error.message);
            res.status(500).json({
            message: 'Internal server error',
            details: error.message || 'Ocurrió un error inesperado en el servidor',
        });
        }
    }
]