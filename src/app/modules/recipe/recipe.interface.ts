export type TRecipe = {
  user: string;
  title: string;
  image: string;
  upvote: string[];
  downvote: string[];
  comments: [{ id: string; name: string; comment: string }];
  rating: number;
  isDeleted: boolean;
  isPremium: boolean;
};
