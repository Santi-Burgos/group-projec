import connection from "../config/database.js";
import invitationUtil from "./invitationUtil.js";

class Invitation{
    static async getAllNotification({userID}){
        try{
            const query = 'SELECT users.user,group_data.group_name, group_invitation.* FROM group_invitation JOIN users ON users.id_users = group_invitation.invited_by JOIN group_data ON group_data.id_group = group_invitation.id_group WHERE group_invitation.id_users = ?'
            const [results] = await connection.query(query, [userID])
            return results 
        } catch(error){
            console.log('Error en getAllNotification', error.message)
            throw new Error ('Error al Obtener las notificaciones')
        }
    }
    static async acceptedInvitation({groupID, userID}){
        try{
            const query = 'INSERT INTO `group_members`(`joined_at`, `id_rol`, `id_group`, `id_users`) VALUES (NOW(),3,?,?)'
            const results = await connection.query(query, [groupID, userID]) 
            return results
        } catch(error){
            console.log('Error en acceptedInvitation', error.message)
            throw new Error ('Error al Obtener las notificaciones')
        }
    }

    static async rejectedInvitation({groupID, userID}){
        try{
            const query = 'DELETE FROM `group_invitation` WHERE id_group= ? AND  id_users = ?';
            const [results] = await connection.query(query, [groupID, userID]);
            return results
        }catch(error){
            console.log('ha ocurrido un error en rejectedInvitation', error.message)
            throw new Error('Error al eliminar las invitaciones')
        }
    };


    static async sendInvitation({groupID, address_mail, userID}){
        try{
            const result = await invitationUtil(groupID, address_mail, userID);
            return result
        }catch(error){
            console.log('ha ocurrido un error en sendInvitation:', error.message);
            throw new Error('Error al crear invitacion')
        }
    }

}

export default Invitation