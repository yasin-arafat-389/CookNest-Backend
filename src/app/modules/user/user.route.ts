import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validate';
import { validateUserSchema } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(validateUserSchema.userRegistrationValidation),
  UserControllers.createUser,
);

export const UserRoutes = router;
