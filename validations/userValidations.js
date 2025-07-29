import {z} from 'zod'

const userSchema = z.object({
    address_mail: z.string().email({
        required_error: 'Email is required',
        invalid_type_error: 'Email invalid, example@gmail.com'
    }),
    username: z.string().min(5, {
        message: 'Username must be at least 5 characters long',
        required_error: 'Username is required',
    }).max(20, {
        message: 'Username must be at most 20 characters long',
        invalid_type_error: 'Username must be a string',
    }),
    password: z.string().min(5, {
        message: 'Password must be at least 5 characters long',
    })

})

export const validateUser = (data) =>{
    try{
        const userValidate = userSchema.parse(data);
        return userValidate
    } catch(err){
        return {error: err.errors};
    }
}