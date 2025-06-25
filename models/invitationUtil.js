import connection from "../config/database.js"; 

async function invitationUtil(groupID, address_mail, userID) {
    const conn = await connection.getConnection();
    const invited_by = userID;
    const id_group = groupID;
    const userAddressMail = address_mail;
  
    try {
        await conn.beginTransaction();
        console.log(userAddressMail)
        const queryIdUser = 'SELECT id_users FROM users WHERE address_mail = ?';
        const [rows] = await conn.query(queryIdUser, [address_mail]);
        if (!rows.length) {
        throw new Error("No se encontró el usuario con ese correo.");
        }
        const id_users = rows[0].id_users;
        const id_status = 1;
  
        const queryInsertInvited = 'INSERT INTO group_invitation(id_group, id_users, invited_by, id_status) VALUES (?, ?, ?, ?)';
        await conn.query(queryInsertInvited, [id_group, id_users, invited_by, id_status]);
  
         await conn.commit(); 
         console.log("Invitación enviada correctamente.");
    } catch (error) {
      await conn.rollback(); 
      console.error("No se ha podido enviar la invitación:", error);
      throw error; 
    } finally {
      conn.release();
    }
  }
  

export default invitationUtil;
