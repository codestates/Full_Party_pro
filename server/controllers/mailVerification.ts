import dotenv from "dotenv"
dotenv.config();

import { Request, Response } from "express";
import nodemailer from "nodemailer"
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";

export const mailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("11111111111111111111", req.body)
    const code = String(Math.floor(Math.random()*1000000)).padStart(6,"0");
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
      from: 'Full Party! 풀팟 <fullparty.gm@gmail.com>',    
      to: email,                     
      subject: '[풀팟] 이메일 인증을 진행해주세요.',   
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>FullParty Verification Email</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center"style="padding: 40px 0 10px 0;">
                <img src="https://teo-img.s3.ap-northeast-2.amazonaws.com/defaultThumbnail.png" alt="fullParty Thumbnial" width="500" height="200" style="display: block;" />
             </td>
            </tr>
            <tr>
              <td align="center">
                풀팟 회원가입을 위한 인증코드입니다.
                <br />아래의 인증 코드를 입력하여 이메일 인증을 완료해주세요.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0 20px 0;">
                <font size="5pt" color="#50C9C3"><b>${code}</b></font>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
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