import mongoose from 'mongoose';
import { TRecipe } from './recipe.interface';

const RecipeSchema = new mongoose.Schema<TRecipe>(
  {
    user: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    upvote: {
      type: [String],
      required: true,
      default: [],
    },
    downvote: {
      type: [String],
      required: true,
      default: [],
    },
    comments: {
      type: [{ id: String, name: String, comment: String }],
      required: true,
      default: [],
    },
    rating: Number,
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPremium: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const RecipeModel = mongoose.model<TRecipe>('Recipe', RecipeSchema);

export default RecipeModel;
