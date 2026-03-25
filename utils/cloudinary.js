import { v2 as cloudinary } from 'cloudinary';
import { config as configDotenv } from 'dotenv';
import { InternalServerError } from '../middlewares/httpErrors.middleware.js';

configDotenv();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async(files) =>{
  try{
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {folder: "groups"},
        (error, result) =>{
          if(error) return reject(error);
          resolve(result);
        }
      );
      stream.end(files.buffer);
    })
    return {
      imgName: result.public_id,
      urlImg: result.secure_url
    };
  }catch(error){
    throw new InternalServerError(`Error uploading images to cloudinary ${error.message}`);
  }
}


export default cloudinary;