import  connection  from "../config/database.js";


class Group{
    static async getAllGroup({ userID }) {
        try { 
            const query = `SELECT group_data.*, group_img.* FROM group_data  
                JOIN group_members ON group_members.id_group = group_data.id_group 
                LEFT JOIN group_img ON group_img.id_group = group_data.id_group  
                WHERE group_members.id_users = $1`;
            const {rows} = await connection.query(query, [ userID]); 

            return rows;
        } catch (error) {
            console.error('Error en getAllGroup:', error.message); 
            throw new Error('Error al obtener los grupos'); 
        }
    }
    
static async createGroup({ group_name, group_description, address_mail, imgName, urlImg, userID }) {
    const conn = await connection.connect();
    try {
        await conn.query('BEGIN');

        const insertGroupQuery = `
            INSERT INTO group_data(group_name, group_description)
            VALUES ($1, $2)
            RETURNING id_group
        `;
        const { rows: groupRows } = await conn.query(insertGroupQuery, [group_name, group_description]);
        const groupID = groupRows[0].id_group;

        const rolID = 1;

        await conn.query(
            `INSERT INTO group_members(joined_at, id_rol, id_group, id_users) 
                VALUES (NOW(), $1, $2, $3)`,
            [rolID, groupID, userID]
        );

        await conn.query(
            `INSERT INTO group_img(img_name, url_img, id_group) 
                VALUES ($1, $2, $3)`,
            [imgName, urlImg, groupID]
        );

        await conn.query('COMMIT');

        if (address_mail) {
            console.log("Invitación enviada a:", address_mail); 
            await invitationUtil(groupID, address_mail, userID);
        }

        return {
            success: true,
            message: 'Grupo creado con éxito'
        };

    } catch (error) {
        await conn.query('ROLLBACK');
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
            const query = 'DELETE FROM group_members WHERE id_users = $1 AND id_group = $2';
            const results = await connection.query(query, [userID, groupID] )
            return results.rows[0]; 
        }catch(error){
            console.error('Error al salir del grupo:', error.message)
            throw new Error('Error al abandonar el grupo')
        }     
    }

    static async getUserForGroup(groupID){
        try{
            const getParticipants = `
            SELECT id_users FROM group_members 
                WHERE id_group = $1
            `
            const resultPartipants = await connection.query(getParticipants, [groupID]);
            return resultPartipants.rows
        }catch(error){
            throw new Error('Error al obtener los grupos de ese usuario')
        }
    }
};
export default Group    