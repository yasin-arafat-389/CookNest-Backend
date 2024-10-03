import express from 'express';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validate';
import auth from '../../middlewares/auth/auth';

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

export const AuthRoutes = router;
