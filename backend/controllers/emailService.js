import nodemailer from 'nodemailer'
import {config} from 'dotenv'

config(); // to load environment variables

const transporter = nodemailer.createTransport({
    service : 'Gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
})

export const sendEmail = async (to, subject, text)=>{
    try{
       const a =  await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to : to,
            subject : subject,
            text : text
        })
        console.log("Email sent Successfully!");
    }
    catch(e){
        console.log("error sending mail : ", e);
    }
}