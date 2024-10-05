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

  const mailData = {
    from: {
      name: 'CookNest',
      address: config.smtp_user as string,
    },

    to,
    subject: 'Reset your password within ten minutes!',
    text: '',
    html,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
