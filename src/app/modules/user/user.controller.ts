import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse/sendResponse';
import { UserServices } from './user.service';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.createUser(req.body);

    sendResponse(res, result, 'User has been created succesfully');
  } catch (error) {
    next(error);
  }
};

const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.updateProfile(req.params.id, req.body);

    sendResponse(res, result, 'Profile updated succesfully');
  } catch (error) {
    next(error);
  }
};

const followUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.addToFollowing(req.params.id, req.user);

    sendResponse(res, result, 'Successfully followed');
  } catch (error) {
    next(error);
  }
};

const unfollowUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.removeFromFollowing(
      req.params.id,
      req.user,
    );

    sendResponse(res, result, 'Successfully Unfollowed');
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createUser,
  updateUser,
  followUser,
  unfollowUser,
};
