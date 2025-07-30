import connection from "../config/database.js";

export async function autoDeleteGroup(groupID){
    try{
        const queryGetRows = 'SELECT COUNT(*) AS count FROM group_members WHERE id_group = $1'
        const [rows] = await connection.query(queryGetRows, groupID);
        return rows[0].count;
    }catch(error){  
        console.error('No se ha podido obtener el numero de miembros');
        throw error;
    }
}

export async function deleteGroupNull(groupID){
    try{
        const queryDeleteGroup = 'DELETE FROM group_data WHERE id_group = $1';
        const result = await connection.query(queryDeleteGroup, groupID);
        return result
    }catch(error){
        console.error('No se ha podido eliminar el grupo', error);
        throw new error
    }
} 

export async function ascendOwnerMember(groupID){
    const client = await connection.connect();
    try{
        await client.query('BEGIN');

        const queryGetOlderMember = 'SELECT id_users FROM group_members WHERE id_group = $1 ORDER BY `group_members`.`joined_at` ASC LIMIT 1 ';
        const { rows } = await client.query(queryGetOlderMember, [groupID]);
        const olderMember = rows[0];

        const updateOwnerOlderMember = 'UPDATE group_members SET id_rol = 1 WHERE id_group = $1 AND id_users = $2'
        await client.query(updateOwnerOlderMember, [groupID, olderMember.id_users]);

        await client.query('COMMIT');
        console.log('Miembro ascendido correctamente');
    }catch (error) {
        await client.query('ROLLBACK');
        console.error('No se ha podido ascender al miembro:', error.message);
        throw error;
    }finally {
        client.release();
    }
}