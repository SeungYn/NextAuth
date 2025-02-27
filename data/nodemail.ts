import nodemailer from 'nodemailer';
import { string } from 'zod';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.NODE_MAIL_AUTH,
    pass: process.env.NODE_MAIL_PASS,
  },
});

// export const sendPasswordResetEmail = async (email: string, token: string) => {
//   const confirmLink = 'http://localhost:3000/auth/new-password?token=' + token;
//   const data = {
//     from: process.env.NODE_MAIL_AUTH,
//     to: email,
//     subject: subject,
//     html: `<h1>${subject}</h1>
// 		<div>${message}</div>
// 		<p>클릭 <a href="${confirmLink}"> 이메일 인증하기</p>
// 		<br/>

// 		`,
//   };
//   return transporter.sendMail(data);
// };

export function sendTwoFactorTokenEmail({
  email,
  subject,
  message,
  token,
}: {
  email: string;
  subject: string;
  message: string;
  token?: string;
}) {
  const confirmLink = 'http://localhost:3000/auth/new-password?token=' + token;
  const data = {
    from: process.env.NODE_MAIL_AUTH,
    to: email,
    subject: subject,
    html: `<h1>${subject}</h1>
		<div>2FA code: ${message}</div>
		
		<br/>
		
		`,
  };
  return transporter.sendMail(data);
}

export function sendPasswordResetEmail({
  email,
  subject,
  message,
  token,
}: {
  email: string;
  subject: string;
  message: string;
  token?: string;
}) {
  const confirmLink = 'http://localhost:3000/auth/new-password?token=' + token;
  const data = {
    from: process.env.NODE_MAIL_AUTH,
    to: email,
    subject: subject,
    html: `<h1>${subject}</h1>
		<div>${message}</div>
		<p>클릭 <a href="${confirmLink}"> 이메일 인증하기</p>
		<br/>
		
		`,
  };
  return transporter.sendMail(data);
}

export function sendMail({
  email,
  subject,
  message,
  token,
}: {
  email: string;
  subject: string;
  message: string;
  token?: string;
}) {
  const confirmLink =
    'http://localhost:3000/auth/new-verification?token=' + token;
  const data = {
    from: process.env.NODE_MAIL_AUTH,
    to: email,
    subject: subject,
    html: `<h1>${subject}</h1>
		<div>${message}</div>
		<p>클릭 <a href="${confirmLink}"> 이메일 인증하기</p>
		<br/>
		
		`,
  };
  return transporter.sendMail(data);
}
