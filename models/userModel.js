import connection from '../config/database.js'

class User{
    static async createUser({ address_mail, user, hashedPassword }) {
        const query = 'INSERT INTO users(address_mail, username, password) VALUES ($1, $2, $3)';
        const result = await connection.query(query, [address_mail, user, hashedPassword]);
        return result; // es un objeto, no un array
    }

    static async findByUSer({address_mail}){
        try{ 
            const query = 'SELECT * FROM users WHERE address_mail = $1';
            const findUser = await connection.query(query, address_mail)
            return findUser.rows[0]
        }catch(error){
            throw new Error('Error al buscar el usuario' + error.message)
        }
    }

    static async findById({userID}){
        try{
            const query = 'SELECT * FROM users WHERE id_users = $1';
            const findById = await connection.query(query, [userID])
            return findById.rows[0]
        }catch(error){
            throw new Error('Error al iniciar la sesion' + error)
        }
    }

    static async getUser(userID){
        try{
            const queryGetUser = 'SELECT `address_mail`, `user` FROM `users` WHERE id_users = $1';
            const results = await connection.query(queryGetUser, [userID]);
            return results 
        }catch(error){
            throw new Error('Error al obtener la informacion del usuario')
        }
    }

    static async editUser({address_mail, user, hashedPassword, userID}){
        try{
            const query = 'UPDATE users SET address_mail = $1, "user" = $2, password = $3 WHERE id_users = $4';
            const editUser = await connection.query(query,[address_mail, user, hashedPassword, userID])
            return editUser.rows[0];
        }catch(error){
            throw new Error('Error al editar al usuario')
        }
    }

    static async deleteUser(userID){
        try{
            const query = 'DELETE FROM users WHERE id_users = $1'
            const result = await connection.query(query, [userID])
            return result
        }catch(error){
            throw new Error('Error al eliminar el usuario')
        }
    }


}
export default User