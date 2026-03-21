import connection from "../config/database.js"
import { EntityNotFound } from "../middlewares/httpErrors.middleware.js";

class UserModels{
  findUserByEmail = async(emailAddress) =>{
    const queryFindUserByEmail = `
      SELECT id_users, password 
      FROM users
        WHERE address_mail = $1` 
    try{
      const responseFindUser = await connection.query(queryFindUserByEmail, [emailAddress]);
      return responseFindUser?.rows[0];
    }catch(e){
      throw new EntityNotFound(e.message)
    }
  }
}

export const userModels = new UserModels()
