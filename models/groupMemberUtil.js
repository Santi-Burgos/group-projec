import connection from "../config/database.js";

async function rolMember(userID, groupID){

    try{
        const queryRolMember = 'SELECT id_rol FROM group_members WHERE id_users = ? and id_group = ?'
        const [rows] = await connection.query(queryRolMember, [userID, groupID]);
        return rows[0]?.id_rol;
    } catch(error){
        console.error('no se ha podido obtener el rol del miembro,', error)
        throw error;
    }   
}

export default rolMember