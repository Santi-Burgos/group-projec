import pool from "../config/database.js";

class Message {
  static async getMessage(groupID) {
    const query = `
      SELECT 
        group_data.*, 
        group_img.url_img, 
        users.user, 
        msg_group.* 
      FROM group_data 
      LEFT JOIN group_img ON group_img.id_group = group_data.id_group 
      LEFT JOIN msg_group ON msg_group.id_group = group_data.id_group 
      LEFT JOIN users ON users.id_users = msg_group.id_user 
      WHERE group_data.id_group = $1
    `;
    const res = await pool.query(query, [groupID]);
    return res.rows;
  }

  static async sendMessage({ msg_body, userID, groupID }) {
    const query = `
      INSERT INTO msg_group (msg_body, msg_date, id_user, id_group) 
      VALUES ($1, NOW(), $2, $3)
      RETURNING *
    `;
    const res = await pool.query(query, [msg_body, userID, groupID]);
    return res.rows[0];
  }
}

export default Message;
