export type IngredientCategory = 'Produce' | 'Dairy & Eggs' | 'Proteins' | 'Pantry & Grains' | 'Spices & Sauces' | 'Bakery';

export interface PantryItem {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: string;
  expiryDate: string; // YYYY-MM-DD
  daysLeft: number;
  addedDate: string;
  isExpiringSoon?: boolean;
}

export interface MacroEstimate {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  timerMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  macros: MacroEstimate;
  usedPantryIngredients: string[];
  missingIngredients: string[];
  matchRate: number; // 0 to 100 percentage
  dietaryTags: string[];
  steps: RecipeStep[];
  wastePreventedScore: number; // e.g., 95%
  isFavorite?: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  recipeSource?: string;
  checked: boolean;
  addedAt: string;
}

export interface UserStats {
  streakDays: number;
  wasteReductionPounds: number;
  moneySavedUsd: number;
  mealsCookedCount: number;
}

export type ActiveTab = 'pantry' | 'recipes' | 'grocery' | 'dashboard' | 'architecture';
