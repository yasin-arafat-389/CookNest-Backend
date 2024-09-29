import express from 'express';
import { RecipeControllers } from './recipe.controller';
import auth from '../../middlewares/auth/auth';
import validateRequest from '../../middlewares/validate';
import { validateRecipeSchema } from './recipe.validation';

const router = express.Router();

router.post(
  '/create-recipe',
  auth('user'),
  validateRequest(validateRecipeSchema.createRecipeValidation),
  RecipeControllers.createRecipe,
);

router.post(
  '/upvote-recipe/:recipeId',
  auth('user'),
  RecipeControllers.upvoteRecipe,
);

router.post(
  '/downvote-recipe/:recipeId',
  auth('user'),
  RecipeControllers.downvoteRecipe,
);

router.post(
  '/rate-recipe/:recipeId',
  auth('user'),
  RecipeControllers.rateRecipe,
);

router.post(
  '/comment-recipe/:recipeId',
  auth('user'),
  RecipeControllers.commentRecipe,
);

export const RecipeRoutes = router;
