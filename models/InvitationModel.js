import connection from "../config/database.js";

class Invitation {
    static async getAllNotification({ userID }) {
        try {
            const query = `
                SELECT 
                    users.username,
                    group_data.group_name,
                    group_invitation.*
                FROM group_invitation
                JOIN users ON users.id_users = group_invitation.invited_by
                JOIN group_data ON group_data.id_group = group_invitation.id_group
                WHERE group_invitation.id_users = $1
            `;
            const { rows } = await connection.query(query, [userID]);
            return rows;
        } catch (error) {
            console.log('Error en getAllNotification:', error.message);
            throw new Error('Error al obtener las notificaciones');
        }
    }

    static async acceptedInvitation({ groupID, userID }) {
        try {
            const query = `
                INSERT INTO group_members(joined_at, id_rol, id_group, id_users)
                VALUES (NOW(), 3, $1, $2)
            `;
            await connection.query(query, [groupID, userID]);
            return { 
                success: true 
            };
        } catch (error) {
            console.log('Error en acceptedInvitation:', error.message);
            throw new Error('Error al aceptar la invitación');
        }
    }

    static async deleteInvitation({ groupID, userID }) {
        try {
            const query = `
                DELETE FROM group_invitation
                WHERE id_group = $1 AND id_users = $2
            `;
            await connection.query(query, [groupID, userID]);
            return { success: true };
        } catch (error) {
            console.log('Error en rejectedInvitation:', error.message);
            throw new Error('Error al rechazar la invitación');
        }
    }

    static async sendInvitation({ groupID, userID, invitedBy, statusID }) {
        try {
            const queryInsertInvited = 'INSERT INTO group_invitation(id_group, id_users, invited_by, id_status) VALUES ($1, $2, $3, $4)';
            const resultSendInvitation = await connection.query(queryInsertInvited, [groupID, userID, invitedBy, statusID]);

            return {
                data: resultSendInvitation
            }

        } catch (error) {
            console.log('Error en sendInvitation:', error.message);
            throw new Error('Error al crear invitación');
        }
    }

    static async validateInvitation(id_users, groupID){
        try{
            const getInvitation = `SELECT * FROM group_invitation
                WHERE id_users = $1 AND id_group = $2`   
            const resultValidation  = await connection.query(getInvitation, [id_users, groupID])

            return resultValidation.rows[0]
        }catch(error){
            throw new Error('Error al validar invitaciones' + error.message)
        }
    }
}

export default Invitation;
