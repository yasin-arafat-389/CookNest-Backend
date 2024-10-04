import express from 'express';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validate';
import auth from '../../middlewares/auth/auth';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../user/user.model';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

router.post(
  '/change-password',
  auth('user', 'admin'),
  AuthControllers.changePassword,
);

router.post('/forgot-password', AuthControllers.forgotPassword);

router.get('/reset-password', (req, res) => {
  const { email, token } = req.query;

  // Render the reset password form
  res.render('reset-password', { email, token });
});

// Handle form submission for password reset
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      config.jwt_acess_token_secret as string,
    ) as JwtPayload;

    // Make sure the token belongs to the correct user
    if (decoded.userEmail !== email) {
      return res.status(400).send('Invalid token or email');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
    );

    // Update the user's password in the database
    await UserModel.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
    );

    // Inform the user that the password has been updated
    res.send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Password Reset Successful</title>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-color: #f4f4f4;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              background-color: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
            p {
              color: #555;
              margin-bottom: 20px;
            }
            .btn {
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 4px;
              text-decoration: none;
              font-size: 16px;
              cursor: pointer;
            }
            .btn:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset Successful!</h1>
            <p>Your password has been updated successfully.</p>
            <a href="https://cook-nest-client.vercel.app/login" class="btn">Login Now</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(400).send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Token Expired</title>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-color: #f4f4f4;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              background-color: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #ff4c4c;
              margin-bottom: 20px;
            }
            p {
              color: #555;
              margin-bottom: 20px;
            }
            .btn {
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 4px;
              text-decoration: none;
              font-size: 16px;
              cursor: pointer;
            }
            .btn:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Token Expired</h1>
            <p>The reset link has expired or is invalid. Please try again.</p>
            <a href="https://cook-nest-client.vercel.app/login" class="btn">Go Back</a>
          </div>
        </body>
      </html>
    `);
  }
});

export const AuthRoutes = router;
