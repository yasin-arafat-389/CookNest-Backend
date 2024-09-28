import { JwtPayload } from 'jsonwebtoken';
import { TRecipe } from './recipe.interface';
import RecipeModel from './recipe.model';

const createRecipe = async (payload: TRecipe, user: JwtPayload) => {
  payload.user = user.userId;

  const result = await RecipeModel.create(payload);
  return result;
};

export const RecipeServices = {
  createRecipe,
};
