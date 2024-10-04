/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import UserModel from './user.model';
import RecipeModel from '../recipe/recipe.model';

import {
  initiatePayment,
  verifyPayment,
} from '../../utils/PaymentGateway/PaymentGateway';

const createUser = async (payload: TUser) => {
  const isUserAlreadyExists = await UserModel.findOne({ email: payload.email });

  if (isUserAlreadyExists) {
    throw new Error('User already exists!');
  }

  const result = await UserModel.create(payload);
  return result;
};

const getSingleUser = async (id: string) => {
  const userData = await UserModel.findById(id);
  const userPostedRecipeData = await RecipeModel.find({ user: id });

  return { userData, userPostedRecipeData };
};

const getUserInfo = async (id: string) => {
  const userData = await UserModel.findById(id);

  return userData;
};

const updateProfile = async (userId: string, updateData: Partial<TUser>) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found!');
  }

  // If email is being updated, ensure it's unique
  if (updateData.email) {
    const existingUser = await UserModel.findOne({ email: updateData.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error('Email already in use!');
    }
  }

  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  return updatedUser;
};

const addToFollowing = async (id: string, user: JwtPayload) => {
  const currentUser = await UserModel.findById(user.userId);

  if (!currentUser) {
    throw new Error('Current user not found!');
  }

  // Check if the user is already following the target user
  if (currentUser.following.includes(id)) {
    throw new Error('You are already following this user.');
  }

  // Push the new user to the 'following' array using $addToSet to prevent duplicates
  const updatedUser = await UserModel.findByIdAndUpdate(
    user.userId,
    {
      $addToSet: { following: id },
    },
    { new: true }, // Return the updated document
  );

  if (!updatedUser) {
    throw new Error('Failed to update following list.');
  }

  // Also add the current user to the 'followers' field of the target user
  await UserModel.findByIdAndUpdate(id, {
    $addToSet: { followers: user.userId },
  });

  return updatedUser;
};

const removeFromFollowing = async (id: string, user: JwtPayload) => {
  const currentUser = await UserModel.findById(user.userId);

  if (!currentUser) {
    throw new Error('Current user not found!');
  }

  // Check if the user is following the target user
  if (!currentUser.following.includes(id)) {
    throw new Error('You are not following this user.');
  }

  // Remove the target user from the 'following' array of the current user
  const updatedUser = await UserModel.findByIdAndUpdate(
    user.userId,
    {
      $pull: { following: id },
    },
    { new: true }, // Return the updated document
  );

  if (!updatedUser) {
    throw new Error('Failed to update following list.');
  }

  // Also remove the current user from the 'followers' field of the target user
  await UserModel.findByIdAndUpdate(id, {
    $pull: { followers: user.userId },
  });

  return updatedUser;
};

const becomePremiumMember = async (payload: any) => {
  const user = await UserModel.findById(payload.id);

  if (user) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      payload.id,
      { transactionId: payload.transactionId },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('Error updating user');
    }

    const initializePayment = await initiatePayment(payload);

    return initializePayment;
  } else {
    throw new Error('User not found');
  }
};

const paymentConfirmation = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  let result;
  let message = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await UserModel.findOneAndUpdate(
      { transactionId },
      {
        premiumMembership: true,
      },
    );
    message = 'Successfully Paid!';
  } else {
    message = 'Payment Failed!';
  }

  console.log(result);

  let templateForSuccessfulPayment = `
   <html>
  <head>
    <link
      href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      text-align: center;
      padding: 40px 0;
      background: #ebf0f5;
    }
    h1 {
      color: #88b04b;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-weight: 900;
      font-size: 40px;
      margin-bottom: 10px;
    }
    p {
      color: #404f5e;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-size: 20px;
      margin: 0;
    }
    i {
      color: #9abc66;
      font-size: 100px;
      line-height: 200px;
      margin-left: -15px;
    }
    .card {
      background: white;
      padding: 60px;
      border-radius: 4px;
      box-shadow: 0 2px 3px #c8d0d8;
      display: inline-block;
      margin: 0 auto;
    }

    button {
      background-color: #fb8c00;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      color: white;
      font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        system-ui,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        'Noto Sans',
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji';
      font-size: 20px;
      margin-top: 30px;
      font-weight: 600;
      line-height: 1.25rem;
      padding: 0.75rem 1rem;
      text-align: center;
      -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
    }
  </style>
  <body>
    <div class="card">
      <div
        style="
          border-radius: 200px;
          height: 200px;
          width: 200px;
          background: #f8faf5;
          margin: 0 auto;
        "
      >
        <i class="checkmark">✓</i>
      </div>
      <h1>Payment Successful!</h1>

      <button onclick="window.location.href='https://cook-nest-client.vercel.app/dashboard';">
        Go To Your Dashboard
      </button>
    </div>
  </body>
</html>

  `;

  const templateForFailedPayment = `
   <html>
  <head>
    <link
      href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      text-align: center;
      padding: 40px 0;
      background: #ebf0f5;
    }
    h1 {
      color: red;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-weight: 900;
      font-size: 40px;
      margin-bottom: 10px;
    }
    p {
      color: #404f5e;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-size: 20px;
      margin: 0;
    }
    i {
      color: red;
      font-size: 100px;
      line-height: 200px;
      margin-left: -15px;
    }
    .card {
      background: white;
      padding: 60px;
      border-radius: 4px;
      box-shadow: 0 2px 3px #c8d0d8;
      display: inline-block;
      margin: 0 auto;
    }

    button {
      background-color: #fb8c00;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      color: white;
      font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        system-ui,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        'Noto Sans',
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji';
      font-size: 20px;
      margin-top: 30px;
      font-weight: 600;
      line-height: 1.25rem;
      padding: 0.75rem 1rem;
      text-align: center;
      -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
    }
  </style>
  <body>
    <div class="card">
      <div
        style="
          border-radius: 200px;
          height: 200px;
          width: 200px;
          background: #f8faf5;
          margin: 0 auto;
        "
      >
        <i class="checkmark">❌</i>
      </div>
      <h1>Payment Failed!</h1>

      <button onclick="window.location.href='https://cook-nest-client.vercel.app';">
        Go To Homepage
      </button>
    </div>
  </body>
</html>

  `;

  if (message === 'Successfully Paid!') {
    return (templateForSuccessfulPayment = templateForSuccessfulPayment.replace(
      '{{message}}',
      message,
    ));
  }

  if (message === 'Payment Failed!') {
    return templateForFailedPayment.replace('{{message}}', message);
  }
};

const getAllUser = async () => {
  const userData = await UserModel.find({ role: 'user' });
  return userData;
};

const blockUser = async (id: string) => {
  const user = await UserModel.findOneAndUpdate(
    { _id: id },
    { isBlocked: true },
    { new: true },
  );

  return user;
};

const unblockUser = async (id: string) => {
  const user = await UserModel.findOneAndUpdate(
    { _id: id },
    { isBlocked: false },
    { new: true },
  );

  return user;
};

const deleteUser = async (id: string) => {
  await RecipeModel.deleteMany({ user: id });

  const user = await UserModel.findByIdAndDelete(id);

  return user;
};

const createAdmin = async (payload: TUser) => {
  const isUserAlreadyExists = await UserModel.findOne({ email: payload.email });

  if (isUserAlreadyExists) {
    throw new Error('Admin already exists!');
  }

  payload.role = 'admin';

  const result = await UserModel.create(payload);

  return result;
};

const getAllAdmin = async () => {
  const result = await UserModel.find({ role: 'admin' });

  return result;
};

const updateAdminProfile = async (
  userId: string,
  updateData: Partial<TUser>,
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found!');
  }

  // If email is being updated, ensure it's unique
  if (updateData.email) {
    const existingUser = await UserModel.findOne({ email: updateData.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error('Email already in use!');
    }
  }

  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  return updatedUser;
};

const deleteAdmin = async (id: string) => {
  const user = await UserModel.findByIdAndDelete(id);

  return user;
};

export const UserServices = {
  createUser,
  updateProfile,
  addToFollowing,
  removeFromFollowing,
  getSingleUser,
  getUserInfo,
  becomePremiumMember,
  paymentConfirmation,
  getAllUser,
  blockUser,
  unblockUser,
  deleteUser,
  createAdmin,
  getAllAdmin,
  updateAdminProfile,
  deleteAdmin,
};
