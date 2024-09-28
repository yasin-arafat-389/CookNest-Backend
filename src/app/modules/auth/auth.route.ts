import express from 'express';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validate';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

export const AuthRoutes = router;
