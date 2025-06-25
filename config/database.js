import mysql from 'mysql2/promise';
import {config as configDotenv} from 'dotenv';

configDotenv();


const connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,           
    password: process.env.DB_PASS,           
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT
});
connection.getConnection((err, con) =>{
    if(err){
        console.log(`'no se puede conectar a a base de datos, ${error}'`)
    }else{
        console.log('conexion realizada con exito')
    }
})
export default connection
