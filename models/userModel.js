import connection from '../config/database.js'

class User{
    static async createUser({address_mail, user, hashedPassword}){
        const query = 'INSERT INTO users(address_mail, username, password)VALUES ($1, $2, $3)'
        const [result] = await connection.query(query,[address_mail, user, hashedPassword]);
        return result 
    }
    static async findByUSer({address_mail}){
        const query = 'SELECT * FROM users WHERE address_mail = ?';
        const [rows] = await connection.query(query, address_mail)
        return rows[0] 
    }

    static async findById({userID}){
        try{
        const query = 'SELECT * FROM users WHERE id_users = ?';
        const [rows] = await connection.query(query, [userID])
        return rows[0]
        }catch(error){
            console.log('Error al iniciar sesion', error)
            throw new Error('Error al iniciar la sesion')
        }
    }

    static async getUser(userID){
        try{
            const queryGetUser = 'SELECT `address_mail`, `user` FROM `users` WHERE id_users = ?';
            const results = await connection.query(queryGetUser, [userID]);
            return results 
        }catch(error){
            console.log('Error al obtener la informacion de usuario', error)
            throw new Error('Error al obtener la informacion del usuario')
        }
    }

    static async editUser({address_mail, user, hashedPassword, userID}){
        try{
            const query = 'UPDATE users SET address_mail = ?, `user` = ?, password = ? WHERE id_users = ? ';
            const [result] = await connection.query(query,[address_mail, user, hashedPassword, userID])
            return result
        }catch(error){
            console.log('Error al editar el usuario', error)
            throw new Error('Error al editar al usuario')
        }
    }

    static async deleteUser(userID){
        try{
            const query = 'DELETE FROM users WHERE id_users = ?'
            const result = await connection.query(query, [userID])
            return result
        }catch(error){
            console.log('no se ha podido eliminar tu cuenta', error)
            throw new Error('Error al eliminar el usuario')
        }
    }


}
export default User