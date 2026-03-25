import connection from "../config/database.js";
import { InternalServerError } from "../middlewares/httpErrors.middleware.js";

class MessageModel {
  getMessage = async(groupId) =>{
    const queryGetMessage = `
      SELECT 
        gd.*, 
        gi.url_img, 
        u.username, 
        mg.* 
      FROM group_data gd
      LEFT JOIN group_img gi
        ON gi.id_group = gd.id_group 
      LEFT JOIN msg_group mg
        ON mg.id_group = gd.id_group 
      LEFT JOIN users u
        ON u.id_users = mg.id_user 
      WHERE gd.id_group = $1`;
    try{
      const resGetMessage = await connection.query(queryGetMessage, [groupId]);
      return resGetMessage.rows;
    }catch(error){
      throw new InternalServerError('Error fetching groups');
    }
  }

  sendMessage = async(msgBody, userId, groupId)=> {
    const query = `
      INSERT INTO msg_group (msg_body, msg_date, id_user, id_group) 
      VALUES ($1, NOW(), $2, $3)
      RETURNING *
    `;
    try{
      const resSendMessage = await connection.query(query, [msgBody, userId, groupId]);
      return resSendMessage.rows[0];
    }catch(error){
      throw new InternalServerError(`error ${error.message}`);
    }
  }
}

export const messageModel = new MessageModel();
