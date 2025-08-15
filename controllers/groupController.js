import Group from "../models/groupModel.js"; 
import {ascendOwnerMember, deleteGroupNull, autoDeleteGroup} from "../models/autoDeleteGroupUtil.js";
import cloudinary from "../utils/cloudinary.js";

export const getGroups = [
    async (req, res) => {
        try {
            const userID = req.user.id_user;

            const getGroup = await Group.getAllGroup({ userID });

            if (!getGroup || getGroup.length === 0) {
                return res.status(200).json([]);
            }
            res.status(200).json(getGroup);
        } catch (error) {
            console.error('Error en el controlador getGroups:', error.message);
            res.status(500).json({
                message: 'Internal server error',
                details: error.message || 'Ocurrió un error inesperado en el servidor',
            });
        }
    },
];
export const createGroup = [
  async (req, res) => {
    try {
      const userID = req.user.id_user;
      const { group_name, group_description, address_mail } = req.body;

      let imgName = null;
      let urlImg = null;

      if (req.file) {
        try {
            const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "groups" },
                (error, result) => {
                if (error) return reject(error);
                resolve(result);
                }
            );
            stream.end(req.file.buffer);
            });
            imgName = result.public_id;
            urlImg = result.secure_url;
        } catch (error) {
            
            throw new Error("Error al subir imagen a Cloudinary: " + error.message);
        }
    }

      const groupCreate = await Group.createGroup({
        group_name,
        group_description,
        address_mail,
        userID,
        imgName,
        urlImg,
      });

      res.status(201).json(groupCreate);
    } catch (err) {
      console.error("Error al crear grupo:", err);
      res.status(400).json({ message: err.message });
    }
  }
];

export const quitGroup = [
    async(req, res) =>{
        try{
            const userID = req.user.id_user;
            const {groupID} =  req.body;

            const userQuitGroup = await Group.quitGroup({groupID, userID})

            const getRowsGroups = await autoDeleteGroup(groupID)

            if(getRowsGroups == 0){
                await deleteGroupNull(groupID)
            }else{
                await ascendOwnerMember(groupID);
            }

            res.status(200).json(userQuitGroup);
        }catch(error){
            console.error('Error en el controlador de quitGroup:', error.message);
            res.status(500).json({
                message: 'Internal server error',
                details: error.message || 'Ocurrió un error inesperado en el servidor',
            })
        }
    }
];

