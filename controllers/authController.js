import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { config as configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
import { cookies } from "../utils/cookies.js";
import { access } from "fs";


configDotenv();
const JWT_SECRET = process.env.JWT_SECRET;

export const loginUser = async (req, res) =>{

    try {
        const { address_mail, password } = req.body;
        const loggearUser = await User.findByUSer({ address_mail });

        if (!loggearUser) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ error: 'Usuario no encontrado' }); 
        }

        const isMatch = await bcrypt.compare(password, loggearUser.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' }); 
        }

        const id_user = loggearUser.id_users;

        const token = jwt.sign(
            {
                id_user,
                address_mail,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('access_token', token, cookies);
        return res.send({
            success: true,
            address_mail: loggearUser.address_mail,
            access_token: token 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error en el servidor' }); 
    }

}

export const logoutUser = async(req, res)=>{
    res.clearCookie('access_token').json({message: 'Logout successful'})
}