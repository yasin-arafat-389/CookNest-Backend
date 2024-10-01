import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validate';
import { validateUserSchema } from './user.validation';
import auth from '../../middlewares/auth/auth';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(validateUserSchema.userRegistrationValidation),
  UserControllers.createUser,
);

router.put(
  '/update-user/:id',
  auth('user', 'admin'),
  validateRequest(validateUserSchema.profileUpdateValidation),
  UserControllers.updateUser,
);

router.post('/follow-user/:id', auth('user'), UserControllers.followUser);

router.post('/unfollow-user/:id', auth('user'), UserControllers.unfollowUser);

router.get(
  '/get-single-user/:id',
  auth('user', 'admin'),
  UserControllers.getSingleUser,
);

router.get('/get-user-info/:id', auth('user'), UserControllers.getUserInfo);

router.post(
  '/become-premium-member',
  auth('user'),
  UserControllers.becomePremiumMember,
);

router.post('/confirmation', UserControllers.paymentConfirmation);

export const UserRoutes = router;
