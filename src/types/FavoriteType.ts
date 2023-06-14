import { RecipeType } from "../types/RecipeType";

export type FavoriteType = {
  id: number;
  user_id: number;
  recipe_id: number;
  recipe: RecipeType;
  created_at: string;
  updated_at: string;
};
