import nodemailer, { TransportOptions } from 'nodemailer';
import config from '../../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  } as TransportOptions);

  await transporter.sendMail({
    from: {
      name: 'CookNest',
      address: process.env.smtp_user as string,
    }, // sender address

    to, // list of receivers
    subject: 'Reset your password within ten minutes!', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
