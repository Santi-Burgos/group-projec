import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import { validateUser } from '../validations/userValidations.js';
import {hashPassword} from '../services/authService.js'

export const registerUser = async (req, res) => {
    try {

        const validationResult = validateUser(req.body);
        console.log(validationResult)

        if (validationResult.error) {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: validationResult.error });
        }


        const { address_mail, username, password } = req.body;
        
        const hashedPassword = await hashPassword(password);
        const userCreate = await User.createUser({address_mail, username, hashedPassword});
        res.status(201).json(userCreate);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

export const getUser = async(req, res) =>{
    try{
        const userID = req.user.id_user;
        const getUser = await User.getUser(userID);
        res.status(201).json(getUser)
    }catch(error){
        res.status(400).json({messag: err.message})
    }
}


export const editUser = async (req, res)=>{
    try{
        const userID = req.user.id_user;
        const addressMailCurrent = req.user.address_mail
        const {address_mail, user, password, currentPassword} = req.body
        
        console.log(req.user)
        console.log(req.body)
        
        const userPasswordOld = await User.findByUSer({address_mail: addressMailCurrent})
        
        console.log( 'Old password:', userPasswordOld.password)

        const isMatch = await bcrypt.compare(currentPassword, userPasswordOld.password);
                if(!isMatch){
                   return  res.status(400).json('Contraseña incorrecta');
                }
        const hashedPassword = await hashPassword(password)
        const updateUser = await User.editUser({
            address_mail, 
            user, 
            hashedPassword, 
            userID}
        );
        res.status(200).json(updateUser);
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

export const deleteUserController = async(req, res) =>{
    try{
        const userID = req.user.id_user;
        const addressMailCurrent = req.user.address_mail
        const {currentPassword} = req.body;

        const userPassword = await User.findByUSer({address_mail: addressMailCurrent})
        
        const isMatch = await bcrypt.compare(currentPassword, userPassword.password);
        if(!isMatch){
            return res.status(400).json('Contrasenha incorrecta');
        }
        const userDelete = await User.deleteUser(userID)

        res.status(200).json(userDelete);

    }catch(error){
        res.status(400).json({message: error.message})
    }
}