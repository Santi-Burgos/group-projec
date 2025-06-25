import connection from "../config/database.js";

export async function autoDeleteGroup(groupID){
    try{
        const queryGetRows = 'SELECT COUNT(*) AS count FROM group_members WHERE id_group = ?'
        const [rows] = await connection.query(queryGetRows, groupID);
        return rows[0].count;
    }catch(error){  
        console.error('No se ha podido obtener el numero de miembros');
        throw error;
    }
}

export async function deleteGroupNull(groupID){
    try{
        const queryDeleteGroup = 'DELETE FROM group_data WHERE id_group = ?';
        const result = await connection.query(queryDeleteGroup, groupID);
        return result
    }catch(error){
        console.error('No se ha podido eliminar el grupo', error);
        throw new error
    }
} 

export async function ascendOwnerMember(groupID){
    const conn = await connection.getConnection();
    try{
        await conn.beginTransaction();

        const queryGetOlderMember = 'SELECT id_users FROM group_members WHERE id_group = ? ORDER BY `group_members`.`joined_at` ASC LIMIT 1 ';
        const [rows] = await conn.query(queryGetOlderMember, [groupID]);
        const olderMember = rows[0];

        const updateOwnerOlderMember = 'UPDATE group_members SET id_rol = 1 WHERE id_group = ? AND id_users = ?'
        await conn.query(updateOwnerOlderMember, [groupID,  olderMember.id_users])
        
        await conn.commit();
        console.log('Miembro ascendido correctamente');
    }catch(error){
        await conn.rollback();
        console.log('no se ha podido ascender al miembro');
        throw error;
    } finally{
        conn.release();
    }
}