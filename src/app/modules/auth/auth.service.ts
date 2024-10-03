import UserModel from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';

const login = async (payload: TLoginUser) => {
  const user = await UserModel.findOne({ email: payload.email }).select(
    '+password',
  );

  if (!user) {
    throw new Error('User not found !');
  }

  //checking if the password is correct

  const matchPassword = await bcrypt.compare(
    payload.password,
    user.password as string,
  );

  if (!matchPassword) {
    throw new Error('Wrong Password !');
  }

  //create token and send to the  client

  const jwtPayload: JwtPayload = {
    email: user.email,
    role: user.role,
    premiumMembership: user.premiumMembership,
    userId: user._id,
    profilePicture: user.profilePicture,
    name: user.name,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_acess_token_secret as string,
    config.access_token_expires_in as string,
  );

  const userData = await UserModel.findOne({ email: payload.email });

  return {
    accessToken,
    userData,
  };
};

const changePassword = async (payload: {
  email: string;
  password: string;
  newPassword: string;
}) => {
  const user = await UserModel.findOne({ email: payload.email });

  if (!user) {
    throw new Error('User not found.');
  }

  const matchPassword = await bcrypt.compare(payload.password, user.password);

  if (!matchPassword) {
    throw new Error('You have entered the wrong current password!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    {
      email: payload.email,
    },
    {
      password: newHashedPassword,
    },
  );
};

export const AuthServices = {
  login,
  changePassword,
};
