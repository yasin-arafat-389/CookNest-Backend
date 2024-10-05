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

  // Make sure the email and token are present
  if (!email || !token) {
    return res.status(400).send('Email or token is missing');
  }

  // Directly render HTML with inline CSS
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            text-align: center;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333333;
          }
          label {
            font-size: 14px;
            display: block;
            margin-bottom: 8px;
            color: #333333;
          }
          input[type="password"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #cccccc;
            border-radius: 4px;
            box-sizing: border-box;
          }
          button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reset Your Password</h1>
          <form action="/api/v1/auth/reset-password" method="POST">
            <!-- Hidden inputs for email and token -->
            <input type="hidden" name="email" value="${email}" />
            <input type="hidden" name="token" value="${token}" />

            <!-- Input for new password -->
            <label for="newPassword">Enter New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required />

            <!-- Submit button -->
            <button type="submit">Reset Password</button>
          </form>
        </div>
      </body>
    </html>
  `);
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
