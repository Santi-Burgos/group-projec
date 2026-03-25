import connection from "../config/database.js";
import { InternalServerError } from "../middlewares/httpErrors.middleware.js";


class MemberGroupModels {
  getMembersAll = async(groupId)=>{
    const queryGetMembers = `
      SELECT u.address_mail, u.username, gm.* 
      FROM group_members gm
      JOIN users  u
        ON gm.id_users = u.id_users 
      WHERE gm.id_group = $1`
    try{
      const responseGetMembers = await connection.query(queryGetMembers, [groupId]);
      
      console.log('log', responseGetMembers.rows)
      return responseGetMembers?.rows; 
    }catch(error){
      throw new InternalServerError('Cannot get member list');
    }
  }

  getMembersId = async(groupId) =>{
    const queryGetMembers = `
      SELECT u.id_users
      FROM group_members gm
      JOIN users u
        ON gm.id_users = u.id_users
      WHERE gm.id_group = $1`
    
    try{
      const responseGetMembers = await connection.query(queryGetMembers, [groupId]);
      return responseGetMembers?.rows; 
    }catch(error){
      throw new InternalServerError('Cannot get member list');
    }
  }

  deleteMember = async(memberDelete, groupId, userId)=>{
    const queryDeleteMember = 'DELETE FROM group_members WHERE id_users = $1 and id_group = $2'
    try{
      await connection.query(query, [memberDelete, userId, groupId])
    
    }catch(error){
      console.error('no se ha podido eliminar al usuario solicitado:', error);
      throw new InternalServerError('Cannot delete user');
    }
  }

  editMember = async(editMember, groupID, userID, id_rol)=>{
    const queryEditMember = `
      UPDATE group_members 
      SET id_rol = $1 
      WHERE  id_group = $2 
        AND id_users = $3`
    try{
      const responseEditMember = await connection.query(queryEditMember, [id_rol, groupID, editMember])
      return responseEditMember
    }catch(error){
      console.error('error al editar el rol del miembro:', error)
      throw new InternalServerError('Cannot edit user');
    }
  }
  
  getRolMember = async(userID, groupID)=>{
    const queryRolMember = `
      SELECT gr.rol_name 
      FROM group_rol gr
      JOIN  group_members gm
        ON gm.id_rol = gr.id_rol
      WHERE gm.id_users = $1 
        AND gm.id_group = $2`
    try{
      const responseGetRole  = await connection.query(queryRolMember, [userID, groupID]);
      return responseGetRole?.rows[0].rol_name;
    } catch(error){
      console.error('no se ha podido obtener el rol del miembro,', error)
      throw error;
    }   
  }

  checkHasAnotherOwner = async(groupId) =>{
    const queryGetOwnersInGroup = `
      SELECT id_users
      FROM group_members 
      WHERE id_rol = 1`
  
    try{
      const ownerInGroup = await connection.query(queryGetOwnersInGroup, [groupId]);
      return ownerInGroup?.rows
    }catch(error){
      throw new InternalServerError();
    }
  }
  
  
  ascendOwnerMember = async(groupId)=> {
    const conn = await connection.connect();
    const queryGetOlderMember = `
      SELECT id_users
      FROM group_members gm
      WHERE id_group = $1
      ORDER BY gm.joined_at ASC 
      LIMIT 1`
      
    const updateOwnerOlderMember = `
      UPDATE group_members
      SET id_rol = $1
      WHERE id_group = $2
      AND id_users = $3`

    try{
      await conn.query('BEGIN');
      const getOlderMember = await conn.query(queryGetOlderMember, [groupId]);
      const olderMemberId = getOlderMember?.rows[0].id_users
  
      await conn.query(updateOwnerOlderMember, [olderMemberId]);
      await conn.query('COMMIT');
      return olderMemberId;
    }catch(error){
      await conn.query('COMMIT')
      throw new InternalServerError('Error ascendOwner');
    }finally{
      conn.release();
    }
  }
}

export const memberGroupModels = new MemberGroupModels()