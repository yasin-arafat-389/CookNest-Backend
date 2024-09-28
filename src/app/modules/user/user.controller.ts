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

export const UserControllers = {
  createUser,
};
