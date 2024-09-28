import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse/sendResponse';
import { RecipeServices } from './recipe.service';

const createRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.createRecipe(req.body);

    sendResponse(res, result, 'Recipe has been created succesfully');
  } catch (error) {
    next(error);
  }
};

export const RecipeControllers = {
  createRecipe,
};
