import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { config as configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
import { cookies } from "../utils/cookies.js";


configDotenv();
const JWT_SECRET = process.env.JWT_SECRET;

export const loginUser = async (req, res) =>{

    try{
        const {address_mail, password} = req.body;
        const loggearUser = await User.findByUSer({address_mail});


        if(!loggearUser){
            res.status(400).json('usuario no encontrado');
        }
        const isMatch = await bcrypt.compare(password, loggearUser.password);

        if(!isMatch){
            res.status(400).json('Contraseña incorrecta');
        }
        
        const id_user = loggearUser.id_users

        const token = jwt.sign({
            id_user,
            address_mail
        }, 
            JWT_SECRET,
            {expiresIn: '1h'}
        );
        res
        .cookie(
            'access_token', 
            token, 
            cookies)
        res.send({
            success: true,
            address_mail: loggearUser.address_mail,
            token: token,
        });
    }catch(error){
        console.log(error)
        res.status(400).json('Usuario no encontrado');
    }
}

export const logoutUser = async(req, res)=>{
    res.clearCookie('access_token').json({message: 'Logout successful'})
}