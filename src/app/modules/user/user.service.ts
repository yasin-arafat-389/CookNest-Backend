import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import UserModel from './user.model';

const createUser = async (payload: TUser) => {
  const isUserAlreadyExists = await UserModel.findOne({ email: payload.email });

  if (isUserAlreadyExists) {
    throw new Error('User already exists!');
  }

  const result = await UserModel.create(payload);
  return result;
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

export const UserServices = {
  createUser,
  updateProfile,
  addToFollowing,
  removeFromFollowing,
};
