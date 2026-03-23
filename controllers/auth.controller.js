import { authService } from "../services/auth.service.js";

class AuthController{

  loginUser = async(req, res, next) =>{
    const { address_mail: emailAddress, password} = req.body
    try{
      const loginService = await authService.auth(emailAddress, password);

      const httpPayload = {
        success: loginService.status, 
        address_mail: emailAddress,
        access_token: loginService.access_token
      }
      res.status(200).json(httpPayload)
    }catch(e){
      next(e)
    }
  }

  logoutUser = async(req, res)=>{
    res.clearCookie('access_token').json({message: 'Logout successful'});
  }
}

export const authController = new AuthController();