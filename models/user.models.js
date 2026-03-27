import connection from "../config/database.js"
import { InternalServerError } from "../middlewares/httpErrors.middleware.js";

class UserModels{
  createUser = async (emailAddress, username, hashedPassword) => {
    const queryCreateUser = `
      INSERT INTO users(address_mail, username, password)
      VALUES($1, $2, $3)
      RETURNING address_mail, username`
    try{
      const createUser = await connection.query(queryCreateUser, [emailAddress, username, hashedPassword]);
      return createUser?.rows[0];
    }catch(error){
      console.error(`Error create user ${error.message}`);
      throw new InternalServerError('Error creating User')
    }
  };

  editUser = async(emailAddress, username, newHashedPassword, userId)=>{
    const queryEditUser = `
      UPDATE users
      SET address_mail = $1,
        username = $2,
        password = $3
      WHERE id_users = $4
    `
    try{
      const userEdited = await connection.query(queryEditUser, [emailAddress, username, newHashedPassword, userId])
      return userEdited?.rows[0];
    }catch(error){
      console.error(`Error edited user ${error.message}`);
      throw new InternalServerError('Error edited User')
    }
  }

  deleteUser = async(userId) =>{
    const queryDeleteUser = `
    DELETE FROM users
    WHERE id_users = $1`
    try{
      await connection.query(queryDeleteUser, [userId]);
    }catch(error){
      console.error(`Error deleting user ${error.message}`);
      throw new InternalServerError('Error deleting User')
    }
  }

  findUserById = async(userId) =>{
    const queryFindUser = `
      SELECT id_users, address_mail, username, password
      FROM users
      WHERE id_users = $1`
    try{
      const userFounded = await connection.query(queryFindUser, [userId]);
      return userFounded?.rows[0] 
    }catch(error){
      console.error(`Error finding user ${error.message}`);
      throw new InternalServerError('Error finding User')
    }
  }

  findUserByEmail = async(emailAddress) =>{
    const queryFindUserByEmail = `
      SELECT id_users, password 
      FROM users
        WHERE address_mail = $1` 
    try{
      const responseFindUser = await connection.query(queryFindUserByEmail, [emailAddress]);
      return responseFindUser?.rows[0];
    }catch(error){
      console.error(`Error finding user ${error.message}`);
      throw new InternalServerError('Error finding User')
    }
  }
}

export const userModels = new UserModels();
