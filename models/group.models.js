import connection from "../config/database.js";
import { HttpError, InternalServerError } from "../middlewares/httpErrors.middleware.js";

class GroupModels{
  getAllGroupForUser = async(userId) =>{
    const queryGetGroups = `
      SELECT 
        gd.*, 
        gi.* 
      FROM group_data gd
      JOIN group_members gm 
        ON gm.id_group = gd.id_group 
      LEFT JOIN group_img gi
        ON gi.id_group = gd.id_group  
      WHERE gm.id_users = $1`;
    try{
      const responseGroup = await connection.query(queryGetGroups, [userId]);
      return responseGroup?.rows
    }catch(error){
      throw new InternalServerError('Error retrieving user groups')
    }
  }

  createGroup = async(groupName, groupDescription, userId, imgName, urlImg) =>{
    const ROLID = 1;
    const conn = await connection.connect();

    const queryCreateGroup = `
      INSERT INTO group_data(group_name, group_description)
      VALUES ($1, $2)
      RETURNING id_group, group_name, group_description`
    
    const queryInsertMember = `
      INSERT INTO group_members(joined_at, id_rol, id_group, id_users) 
      VALUES (NOW(), $1, $2, $3)`

    const queryInsertGroupImage = `
      INSERT INTO group_img(img_name, url_img, id_group) 
      VALUES ($1, $2, $3)`
    
    try{
      await conn.query('BEGIN');
      const createGroup = await conn.query(queryCreateGroup, [groupName, groupDescription]);
      const createGroupResponse = createGroup.rows[0]
      const groupId = createGroupResponse.id_group;

      await conn.query(queryInsertMember, [ROLID, groupId, userId]);
      await conn.query(queryInsertGroupImage, [imgName, urlImg, groupId]);
      await conn.query('COMMIT');

      return createGroupResponse
    }catch(error){
      await conn.query('ROLLBACK');
      throw new InternalServerError("Cannot create group, try in another moment");
    }finally{
      conn.release();
    }
  }

  quitGroup = async(groupId, userId)=> {
    const queryQuitGroup = `
      DELETE FROM group_members
      WHERE id_users = $1
        AND id_group = $2`
    
    try{
      await connection.query(queryQuitGroup, [groupId, userId]);
    }catch(error){
      throw new InternalServerError("")
    }
    
  }

  getUserForGroup = async(groupId)=> {
    const getUsersForGroup = `
      SELECT id_users 
      FROM group_members
        WHERE id_group =$1`
    try{
      const responseUsersForGroup = await connection.query(getUsersForGroup, [groupId]);
      return responseUsersForGroup?.rows 
    }catch(error){
      throw new InternalServerError('Cannot get usersIds')
    }
  }

  deleteEmptyGroup = async(groupId) => {
    try{
      const queryDeleteGroup = `
        DELETE FROM group_data 
        WHERE id_group = $1`;
      await connection.query(queryDeleteGroup, [groupId]);
    }catch(error){
      throw new InternalServerError('Error deleting empty group');
    }
  }

  autoDeleteGroup = async(groupID)=> {
    try{
      const queryGetRows = `
        SELECT COUNT(*) AS count 
        FROM group_members 
        WHERE id_group = $1`
      const responseCountMemberGroup = await connection.query(queryGetRows, [groupID]);
      return responseCountMemberGroup?.rows[0].count;
    }catch(error){  
      console.error('No se ha podido obtener el numero de miembros');
      throw new InternalServerError();
    }
  }
}

export const groupModels = new GroupModels();