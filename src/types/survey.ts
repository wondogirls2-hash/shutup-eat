import { AllergenTag, FoodCategory } from './food';

export interface UserPreferences {
  allergies: AllergenTag[];
  dislikedCategories: FoodCategory[];
  preferredCategories: FoodCategory[];
  completedOnboarding: boolean;
}

export const emptyPreferences: UserPreferences = {
  allergies: [],
  dislikedCategories: [],
  preferredCategories: [],
  completedOnboarding: false,
};
