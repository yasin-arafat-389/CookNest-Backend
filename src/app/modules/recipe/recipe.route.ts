import express from 'express';
import { RecipeControllers } from './recipe.controller';
import auth from '../../middlewares/auth/auth';

const router = express.Router();

router.post('/create-recipe', auth('user'), RecipeControllers.createRecipe);

export const RecipeRoutes = router;
