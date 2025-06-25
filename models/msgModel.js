import connection from "../config/database.js";

class Message{
    static async getMessage(groupID){
        const query = 'SELECT group_data.*, group_img.url_img, users.user, msg_group.* FROM group_data LEFT JOIN group_img ON group_img.id_group = group_data.id_group LEFT JOIN msg_group ON msg_group.id_group = group_data.id_group LEFT JOIN users ON users.id_users = msg_group.id_user WHERE group_data.id_group = ?'
        const [results] = await connection.query(query, [groupID])

        return results
    
    }
    static async sendMessage({msg_body, userID, groupID}){
        const query = 'INSERT INTO msg_group(msg_body, msg_date, id_user, id_group) VALUES (?,NOW(),?,?)' 
        const [result] = await connection.query(query, [msg_body, userID, groupID])
        return result
    }
}
export default Message