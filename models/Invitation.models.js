import connection from "../config/database.js";
import { InternalServerError } from "../middlewares/httpErrors.middleware.js";

class InvitationModel {
  getAllNotification = async (userId) => {
    const queryGetNotifications = `
      SELECT 
        u.username,
        gd.group_name,
        gi.*
      FROM group_invitation gi
      JOIN users u
        ON u.id_users = gi.invited_by
      JOIN group_data gd
        ON gd.id_group = gi.id_group
      WHERE gi.id_users = $1`;
    try {
      const { rows } = await connection.query(queryGetNotifications, [userId]);
      return rows;
    } catch (error) {
      throw new InternalServerError('Error al obtener las notificaciones');
    }
  }

  acceptedInvitation = async(groupId, userId)=> {
    try {
      console.log(groupId, userId)

      const queryAcceptedInvitation = `
        INSERT INTO group_members(joined_at, id_rol, id_group, id_users)
        VALUES (NOW(), 3, $1, $2)`;
      await connection.query(queryAcceptedInvitation, [groupId, userId]);
      return { success: true };
    } catch (error) {
      throw new InternalServerError('Error al aceptar la invitación', error.message);
    }
  }

  deleteInvitation = async(groupId, userId)=> {
    try {
      const queryDeleteInvitation = `
        DELETE FROM group_invitation
        WHERE id_group = $1 
          AND id_users = $2`;
      await connection.query(queryDeleteInvitation, [groupId, userId]);
      return;
    } catch (error) {
      console.log('Error en deleteInvitation:', error.message);
      throw new Error('Error al rechazar la invitación');
    }
  }

  sendInvitation = async (groupId, userId, invitedBy, statusId ) => {
    try {
      const querySendInvitation = `
        INSERT INTO group_invitation(id_group, id_users, invited_by, id_status) 
        VALUES ($1, $2, $3, $4)`;
      const resultSendInvitation = await connection.query(querySendInvitation, [groupId, userId, invitedBy, statusId ]);
      return resultSendInvitation.rows[0]
    } catch (error) {
      console.log('Error en sendInvitation:', error.message);
      throw new Error('Error al crear invitación');
    }
  }

  validateInvitation = async (userId, groupId) => {
    try {
      const queryValidateInvitation = `
        SELECT * FROM group_invitation
        WHERE id_users = $1 AND id_group = $2`;
      const { rows } = await connection.query(queryValidateInvitation, [userId, groupId]);
      return rows[0];
    } catch (error) {
      console.log('Error en validateInvitation:', error.message);
      throw new Error('Error al validar invitaciones: ' + error.message);
    }
  }
}

export const invitationModel = new InvitationModel();
