import express from 'express';
import { RecipeControllers } from './recipe.controller';

const router = express.Router();

router.post('/create-recipe', RecipeControllers.createRecipe);

export const RecipeRoutes = router;
