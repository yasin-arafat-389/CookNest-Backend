import { RequestHandler } from 'express';
import { AuthServices } from './auth.service';
import sendResponse from '../../utils/sendResponse/sendResponse';

const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.login(req.body);
    const { accessToken, userData } = result;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User logged in successfully',
      token: accessToken,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.changePassword(req.body);

    sendResponse(res, result, 'Password Changed Successfully');
  } catch (error) {
    next(error);
  }
};

const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email;
    const result = await AuthServices.forgotPassword(email);

    sendResponse(res, result, 'Reset link is generated succesfully!');
  } catch (error) {
    next(error);
  }
};

export const AuthControllers = {
  login,
  changePassword,
  forgotPassword,
};
