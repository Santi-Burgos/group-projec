import groupMembers from "../models/groupMemberModel.js";

export const getMembersGroupController = [
    async(req, res) => {
        try{
            const userID = req.user.id_user;
            const groupID = req.query.groupID;
            
            console.log('frontend:', req.query)
            
            const takeMembersGroup = await groupMembers.getMembersAll({userID, groupID});
            res.status(200).json(takeMembersGroup);
        }catch(error){
            console.error('Error en el controlador de grupos:', error);
            res.status(500).json({
                message: 'Internal server error',
                details: error.message || 'Ocurrió un error inesperado en el servidor',
            })
        }
    }
]

export const deleteMemberController = [
    async(req, res) =>{
        try{
            const userID = req.user.id_user; 
            const {memberDelete , groupID} = req.body; 
            console.log('group:', groupID, 'member:', memberDelete)
            const removeMember = await groupMembers.deleteMember({
                userID, 
                groupID,
                memberDelete});
            res.status(200).json(removeMember);
        }catch(error){
            console.error('Error en el controlador de grupos:', error);
            res.status(500).json({
                message: 'Internal server error',
                details: error.message || 'Ocurrió un error inesperado en el servidor',
            })
        }
    }
]

export const editMemberController = [
    async(req, res) =>{
        try{
            const userID = req.user.id_user;
            console.log(req.user.id_user)
            const {groupID, editMember, id_rol} = req.body
            const editRolMember = await groupMembers.editMember({
                userID,
                groupID,
                editMember,
                id_rol});
            res.status(200).json(editRolMember);
        }catch(error){
            console.error('Error en el controlador de groupos:', error);
            res.status(500).json({
                message: 'Internal server error',
                details: error.message || 'Ocurrio un error inesperado en el servidor'
            })
        }
    }
]