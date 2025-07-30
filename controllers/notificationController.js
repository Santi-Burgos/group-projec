import Invitation from "../models/InvitationModel.js";
import User from "../models/userModel.js"
import Group from "../models/groupModel.js";

export const getNotification = [
    async (req, res)=> {
    try{
        const userID = req.user.id_user
        const takeNotification = await Invitation.getAllNotification({userID});

        if(!takeNotification || takeNotification.legth === 0){
            return res.status(500).json({
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
            const invitedBy = req.user.id_user;
            const {groupID, address_mail} = req.body;


            const getUserID = await User.findByUSer({address_mail});
            if(getUserID.rowCount == 0){
                throw new Error("No se encontró el usuario con ese correo.")
            } 

            const userID = getUserID.id_users;
            const statusID = 1;
            

            const getIdMembers = await Group.getUserForGroup(groupID);
            const memberIDs = getIdMembers.map(m => m.id_users);

            if (memberIDs.includes(userID)) {
                throw new Error('El usuario que intentas invitar ya pertenece al grupo');
            }

            // valido que no haya otra invitacion
            const validateNotification = await Invitation.validateInvitation(userID, groupID);
            if(validateNotification){
                throw new Error('Ya le has enviado una invitacion a este usuario')
            }

            const sendInvitation = await Invitation.sendInvitation({
                groupID, userID, invitedBy, statusID
            })
            
            res.status(201).json(sendInvitation)
        }catch(error){
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
            await Invitation.deleteInvitation({groupID, userID});


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
            
            const declineInvitation = await Invitation.deleteInvitation({groupID, userID})
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