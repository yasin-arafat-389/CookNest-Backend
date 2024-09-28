import { ObjectId } from 'mongoose';

export type TRecipe = {
  title: string;
  image: string;
  metadata: ObjectId;
};
