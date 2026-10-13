import React, { useState } from 'react';
import { Recipe, PantryItem } from '../types';
import { generateZeroWasteRecipes } from '../services/geminiService';
import { 
  Sparkles, ChefHat, Clock, Flame, Check, Plus, Heart, 
  ShoppingCart, ArrowRight, Zap, Filter, Award, ShieldAlert
} from 'lucide-react';

interface RecipeGeneratorSectionProps {
  pantryItems: PantryItem[];
  recipes: Recipe[];
  onSetRecipes: (recipes: Recipe[]) => void;
  onToggleFavorite: (recipeId: string) => void;
  onAddMissingToGrocery: (recipe: Recipe) => void;
  onStartCooking: (recipe: Recipe) => void;
}

const DIETARY_OPTIONS = [
  'High-Protein',
  'Keto / Low-Carb',
  'Vegetarian',
  'Vegan',
  'Quick (<20 min)',
  'Budget-Friendly',
  'Kid-Friendly'
];

export const RecipeGeneratorSection: React.FC<RecipeGeneratorSectionProps> = ({
  pantryItems,
  recipes,
  onSetRecipes,
  onToggleFavorite,
  onAddMissingToGrocery,
  onStartCooking
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['High-Protein']);
  const [prioritizeExpiring, setPrioritizeExpiring] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRecipeDetail, setActiveRecipeDetail] = useState<Recipe | null>(null);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleGenerate = async () => {
    if (pantryItems.length === 0) return;
    setIsLoading(true);
    const generated = await generateZeroWasteRecipes(pantryItems, selectedFilters, prioritizeExpiring);
    onSetRecipes(generated);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Configuration Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full mb-2">
              <ChefHat className="w-3.5 h-3.5" />
              KitchenIQ Gemini Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              Zero-Waste AI Recipe Matcher
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Generating meals strictly based on your {pantryItems.length} pantry ingredients.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || pantryItems.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-emerald-200" />
                Crafting Michelin Recipes...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Generate 3 Custom Recipes
              </>
            )}
          </button>
        </div>

        {/* Dietary and Preference Toggles */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Dietary Goals & Preferences
            </span>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
              <input
                type="checkbox"
                checked={prioritizeExpiring}
                onChange={(e) => setPrioritizeExpiring(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-stone-800 border-stone-700"
              />
              <span className="font-medium text-emerald-400">Prioritize soonest expiring items</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map(opt => {
              const active = selectedFilters.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleFilter(opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recipe Cards List */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6">
          <ChefHat className="w-14 h-14 text-stone-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-200">No Recipes Generated Yet</h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto mt-1 mb-5">
            Select your preferences above and click "Generate 3 Custom Recipes" to turn your ingredients into chef-quality zero-waste meals!
          </p>
          <button
            onClick={handleGenerate}
            disabled={isLoading || pantryItems.length === 0}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition"
          >
            Generate Recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                {/* Header Badge Row */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {recipe.matchRate}% Fridge Match
                    </span>

                    <button
                      onClick={() => onToggleFavorite(recipe.id)}
                      className={`p-2 rounded-xl transition ${
                        recipe.isFavorite
                          ? 'bg-red-500/20 text-red-400'
                          : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'
                      }`}
                      title={recipe.isFavorite ? 'Saved in favorites' : 'Save to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white font-serif group-hover:text-emerald-300 transition">
                    {recipe.title}
                  </h3>
                  <p className="text-stone-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                {/* Timing & Macros Pill Bar */}
                <div className="px-5 py-2 bg-stone-950/60 border-y border-stone-800/80 flex items-center justify-between text-xs text-stone-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{recipe.macros.calories} kcal</span>
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    {recipe.macros.proteinGrams}g Protein
                  </div>
                </div>

                {/* Ingredients Used & Missing Breakdown */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                      Pantry Items Used ({recipe.usedPantryIngredients.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.usedPantryIngredients.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[11px] border border-stone-700/60 flex items-center gap-1"
                        >
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {recipe.missingIngredients.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-amber-400 uppercase tracking-wider">
                          Missing Items ({recipe.missingIngredients.length})
                        </span>
                        <button
                          onClick={() => onAddMissingToGrocery(recipe)}
                          className="text-[10px] text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add to Grocery List
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.missingIngredients.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] border border-amber-500/20"
                          >
                            + {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {recipe.dietaryTags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-stone-800 text-stone-400 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onStartCooking(recipe)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <ChefHat className="w-4 h-4" />
                  Cook with KitchenIQ Guided Mode
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
