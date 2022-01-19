import { Request, Response } from "express";
import nodemailer from "nodemailer"
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";

export const mailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const code = String(Math.floor(Math.random()*1000000)).padStart(6,"0");
    console.log(req.body)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS      
      }
    });

    const mailOptions = {
      from: 'Full Party! 풀팟',    
      to: email,                     
      subject: '[풀팟] 이메일 인증을 진행해주세요.',   
      text: `회원가입을 위한 인증번호입니다. 인증번호를 입력해 인증을 완료해주세요. ${code}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
      }
    });
  
    // res.redirect("/");
    return SuccessfulResponse(res, { message: "Authentication Email Sent", code });
  }
  catch (error) {
    return InternalServerError(res, error);
  };
};