import pool from "../config/database.js";

async function invitationUtil(groupID, address_mail, userID) {
  const client = await pool.connect();
  const invited_by = userID;
  const id_group = groupID;

  try {
    await client.query('BEGIN');

    const queryIdUser = 'SELECT id_users FROM users WHERE address_mail = $1';
    const res = await client.query(queryIdUser, [address_mail]);

    if (res.rowCount === 0) {
      throw new Error("No se encontró el usuario con ese correo.");
    }

    const id_users = res.rows[0].id_users;
    const id_status = 1;

    const queryInsertInvited = 'INSERT INTO group_invitation(id_group, id_users, invited_by, id_status) VALUES ($1, $2, $3, $4)';
    await client.query(queryInsertInvited, [id_group, id_users, invited_by, id_status]);

    await client.query('COMMIT');
    console.log("Invitación enviada correctamente.");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("No se ha podido enviar la invitación:", error);
    throw error;
  } finally {
    client.release();
  }
}

export default invitationUtil;
