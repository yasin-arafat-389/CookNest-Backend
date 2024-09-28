import mongoose, { Schema } from 'mongoose';
import { TRecipe } from './recipe.interface';

const RecipeSchema = new mongoose.Schema<TRecipe>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    metadata: { type: Schema.Types.ObjectId, required: true, ref: 'Metadata' },
  },
  {
    timestamps: true,
  },
);

const RecipeModel = mongoose.model<TRecipe>('Recipe', RecipeSchema);

export default RecipeModel;
