import { JwtPayload } from 'jsonwebtoken';
import { TRecipe } from './recipe.interface';
import RecipeModel from './recipe.model';

const createRecipe = async (payload: TRecipe, user: JwtPayload) => {
  payload.user = user.userId;

  const result = await RecipeModel.create(payload);
  return result;
};

const upvoteRecipe = async (recipeId: string, user: JwtPayload) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Check if the user has already upvoted the recipe
  if (recipe.upvote.includes(user.userId)) {
    throw new Error('You have already upvoted this recipe');
  }

  // If the user has downvoted the recipe before, remove them from the downvote array
  if (recipe.downvote.includes(user.userId)) {
    await RecipeModel.findByIdAndUpdate(
      recipeId,
      {
        $pull: { downvote: user.userId },
      },
      { new: true },
    );
  }

  // Add the userId to the upvote array
  const updatedRecipe = await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $addToSet: { upvote: user.userId }, // $addToSet prevents duplicates
    },
    { new: true },
  );

  return updatedRecipe;
};

const downvoteRecipe = async (recipeId: string, user: JwtPayload) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Check if the user has already downvoted the recipe
  if (recipe.downvote.includes(user.userId)) {
    throw new Error('You have already downvoted this recipe');
  }

  // If the user has upvoted the recipe before, remove them from the upvote array
  if (recipe.upvote.includes(user.userId)) {
    await RecipeModel.findByIdAndUpdate(
      recipeId,
      {
        $pull: { upvote: user.userId },
      },
      { new: true },
    );
  }

  // Add the userId to the downvote array
  const updatedRecipe = await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $addToSet: { downvote: user.userId }, // $addToSet prevents duplicates
    },
    { new: true },
  );

  return updatedRecipe;
};

const rateRecipe = async (
  recipeId: string,
  user: JwtPayload,
  newRating: number,
) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Check if the user has already rated this recipe
  const existingRatingIndex = recipe.rating.findIndex(
    (r) => r.id === user.userId,
  );

  if (existingRatingIndex !== -1) {
    // User has already rated the recipe, so update their rating
    recipe.rating[existingRatingIndex].rating = newRating;
  } else {
    // User has not rated the recipe yet, so insert a new rating
    recipe.rating.push({ id: user.userId, rating: newRating });
  }

  // Save the updated recipe
  const updatedRecipe = await recipe.save();

  return updatedRecipe;
};

const commentRecipe = async (
  recipeId: string,
  user: JwtPayload,
  comment: string,
) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Add the new comment to the comments array
  recipe.comments.push({
    id: user.userId,
    name: user.name,
    profilePicture: user.profilePicture,
    comment: comment,
  });

  // Save the updated recipe with the new comment
  const updatedRecipe = await recipe.save();

  return updatedRecipe;
};

export const RecipeServices = {
  createRecipe,
  upvoteRecipe,
  downvoteRecipe,
  rateRecipe,
  commentRecipe,
};
