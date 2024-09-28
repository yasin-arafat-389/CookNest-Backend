import { TUser } from './user.interface';
import UserModel from './user.model';

const createUser = async (payload: TUser) => {
  const isUserAlreadyExists = await UserModel.find({ email: payload.email });

  if (isUserAlreadyExists) {
    throw new Error('User already exists!');
  }

  const result = await UserModel.create(payload);
  return result;
};

export const UserServices = {
  createUser,
};
