import express from 'express';
import { RecipeControllers } from './recipe.controller';
import auth from '../../middlewares/auth/auth';

const router = express.Router();

router.post('/create-recipe', auth('user'), RecipeControllers.createRecipe);

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

router.delete(
  '/delete-recipe/:recipeId',
  auth('user', 'admin'),
  RecipeControllers.deleteRecipe,
);

router.get('/get-all-recipe', RecipeControllers.getAllRecipe);

router.get(
  '/get-single-recipe/:recipeId',
  auth('user', 'admin'),
  RecipeControllers.getSingleRecipe,
);

export const RecipeRoutes = router;
