import {z} from 'zod'

const groupSchema  = z.object({
    groupName: z.string().min(5,{
        message:'Name group must be at least 5 characters long',
        required_error: 'Name group is required',
        invalid_type_error: 'Name group must be a string '
    }),
    groupDescription: z.string().max(255,{
        message: 'Description must be at most 255 characters long',
    }),
    imgName:z.string(),
    imgUrl: z.string(),
})

export const validateGroup = (data) =>{
    try{
        const groupValidate = groupSchema.parse(data);
        return groupValidate
    }catch(err){
        return {error:err.errors}
    }
}