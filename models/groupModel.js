import  connection  from "../config/database.js";
import invitationUtil from "./invitationUtil.js";


class Group{

    static async getAllGroup({ userID }) {
        try { 
            const query = 'SELECT `group_data`.*, `group_img`.* FROM `group_data`  JOIN `group_members` ON `group_members`.id_group = `group_data`.id_group LEFT JOIN `group_img` ON `group_img`.id_group = `group_data`.id_group  WHERE `group_members`.id_users = ?';
            const [results] = await connection.query(query, [ userID]); 
            return results;
        } catch (error) {
            console.error('Error en getAllGroup:', error.message); 
            throw new Error('Error al obtener los grupos'); 
        }
    }
    
    static async createGroup({ group_name, group_description, address_mail, imgName, urlImg, userID }) {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction(); 
    
            const [result] = await conn.query(
                'INSERT INTO group_data(group_name, group_description) VALUES (?,?)',
                [group_name, group_description]
            );
            const groupID = result.insertId; 
    33
            const rolID = 1;
    

            await conn.query(
                'INSERT INTO group_members(joined_at, id_rol, id_group, id_users) VALUES (NOW(), ?, ?, ?)',
                [rolID, groupID, userID]
            );

            await conn.query(
                'INSERT INTO group_img(img_name, url_img, id_group) VALUES (?, ?, ?)',
                [imgName, urlImg, groupID]
            );

            await conn.commit();
            if (address_mail) {
                console.log("Invitación enviada a:", address_mail); 
                await invitationUtil(groupID, address_mail, userID);
                
            }
            return {
                success: true,
                message: 'Grupo creado con éxito'
            };
        } catch (error) {
            await conn.rollback();
            console.error('Error al crear grupo:', error);
            return {
                success: false,
                message: 'Error al crear el grupo'
            };
        } finally {
            conn.release();
        }
    }

    static async quitGroup({groupID, userID}){
        try{
            const query = 'DELETE FROM `group_members` WHERE id_users = ? AND id_group = ?';
            const [results] = await connection.query(query, [userID, groupID] )
            return results; 
        }catch(error){
            console.error('Error al salir del grupo:', error.message)
            throw new Error('Error al abandonar el grupo')
        }     
    }
};
export default Group    