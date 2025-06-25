import connection from "../config/database.js";
import rolMember from "./groupMemberUtil.js";


class groupMembers {

    static async getMembersAll({groupID}){
        try{
            const queryGetMembers = 'SELECT users.address_mail, users.user, group_members.* FROM group_members JOIN users ON group_members.id_users = users.id_users WHERE group_members.id_group = ?;'
            const [results] = await connection.query(queryGetMembers, [groupID]);
            return results 
        }catch(error){
            console.error('no se ha podido obtener la lista de miebros:', error)
            throw error
        }
    }

    static async deleteMember({memberDelete, groupID, userID}){
    
        const getRolMember = await rolMember(userID, groupID);
        const getTargetRol = await rolMember(memberDelete, groupID); 
        if(getRolMember < getTargetRol){
        try{
            const query = 'DELETE FROM group_members WHERE id_users = ? and id_group = ?'
            const result = await connection.query(query, [memberDelete, groupID])
            return result
        }catch(error){
            console.error('no se ha podido eliminar al usuario solicitado:', error);
            throw error;
        }}else{
            return{error: true, message: 'No tienes el permiso para eliminar este   '}
        }
    }

    static async editMember({editMember, groupID, userID, id_rol}){

        const getRolMember = await rolMember(userID, groupID);
        const getTargetRol = await rolMember(editMember, groupID);  

        
        if(getRolMember < getTargetRol){
            try{
                const queryEditMember = 'UPDATE group_members SET id_rol = ? WHERE  id_group = ? AND id_users = ?'
                const result = await connection.query(queryEditMember, [id_rol, groupID, editMember])
                return result
            }catch(error){
                console.error('error al editar el rol del miembro:', error)
                throw error
            }
        }else{
            return { error: true, message: 'No tienes permisos para editar este miembro' };
        }
    }
}

export default groupMembers