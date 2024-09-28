import { TRecipe } from './recipe.interface';
import RecipeModel from './recipe.model';

const createRecipe = async (payload: TRecipe) => {
  const result = await RecipeModel.create(payload);
  return result;
};

export const RecipeServices = {
  createRecipe,
};
