import { Request, Response } from "express";
import nodemailer from "nodemailer"
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";

export const mailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const code = "265524"
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
      from: 'FullPartyPro',
      to: email,
      subject: '회원가입을 위한 인증번호를 입력해주세요.',
      text: `회원가입을 위한 인증번호입니다. 이 인증 번호를 입력하여 인증을 완료해주세요. ${code}`
    };

    transporter.sendMail(mailOptions, function(error: any, info: any){
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