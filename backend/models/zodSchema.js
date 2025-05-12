import {z} from "zod" // for runtime check

export const signUpSchema = z.object({
    username : z.string().min(3),
    email : z.string().email(),
    password : z.string().min(8)
})

export const signInSchema = z.object({
    email : z.string().email(),
    password : z.string().min(8)
})