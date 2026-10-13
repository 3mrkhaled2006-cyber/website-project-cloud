import React, { useState, useEffect } from 'react';
import { 
  PantryItem, Recipe, GroceryItem, UserStats, ActiveTab 
} from './types';
import { PantrySection } from './components/PantrySection';
import { RecipeGeneratorSection } from './components/RecipeGeneratorSection';
import { GroceryListSection } from './components/GroceryListSection';
import { DashboardSection } from './components/DashboardSection';
import { ArchitectureHubSection } from './components/ArchitectureHubSection';
import { CookingModeModal } from './components/CookingModeModal';
import { 
  ChefHat, Refrigerator, ShoppingCart, LayoutDashboard, 
  Code2, Sparkles, Flame, CheckCircle, Leaf
} from 'lucide-react';

const INITIAL_PANTRY: PantryItem[] = [
  { id: 'p-1', name: 'Baby Spinach', category: 'Produce', quantity: '1 fresh tub', expiryDate: '2025-03-02', daysLeft: 2, addedDate: '2025-02-25', isExpiringSoon: true },
  { id: 'p-2', name: 'Chicken Breasts', category: 'Proteins', quantity: '2 thick cutlets', expiryDate: '2025-03-03', daysLeft: 2, addedDate: '2025-02-26', isExpiringSoon: true },
  { id: 'p-3', name: 'Aged Cheddar / Parmesan', category: 'Dairy & Eggs', quantity: '1 wedge', expiryDate: '2025-03-12', daysLeft: 11, addedDate: '2025-02-20' },
  { id: 'p-4', name: 'Fresh Eggs', category: 'Dairy & Eggs', quantity: '6 large eggs', expiryDate: '2025-03-08', daysLeft: 7, addedDate: '2025-02-22' },
  { id: 'p-5', name: 'Garlic Cloves', category: 'Produce', quantity: '5 cloves', expiryDate: '2025-03-15', daysLeft: 14, addedDate: '2025-02-24' },
  { id: 'p-6', name: 'Extra Virgin Olive Oil', category: 'Spices & Sauces', quantity: 'Half bottle', expiryDate: '2025-06-01', daysLeft: 90, addedDate: '2025-01-10' },
  { id: 'p-7', name: 'Jasmine Rice', category: 'Pantry & Grains', quantity: '1.5 cups dry', expiryDate: '2025-08-01', daysLeft: 160, addedDate: '2025-01-15' },
  { id: 'p-8', name: 'Greek Yogurt', category: 'Dairy & Eggs', quantity: '350g tub', expiryDate: '2025-03-04', daysLeft: 3, addedDate: '2025-02-25', isExpiringSoon: true },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pantry');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('kitcheniq_pantry');
    return saved ? JSON.parse(saved) : INITIAL_PANTRY;
  });

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('kitcheniq_grocery');
    return saved ? JSON.parse(saved) : [
      { id: 'g-1', name: 'Fresh Chives or Scallions', category: 'Produce', quantity: '1 bunch', checked: false, addedAt: '2025-02-26' },
      { id: 'g-2', name: 'Unsalted Butter', category: 'Dairy & Eggs', quantity: '1 pack', checked: false, addedAt: '2025-02-26' }
    ];
  });

  const [stats, setStats] = useState<UserStats>({
    streakDays: 4,
    wasteReductionPounds: 14.6,
    moneySavedUsd: 118,
    mealsCookedCount: 12
  });

  const [activeCookingRecipe, setActiveCookingRecipe] = useState<Recipe | null>(null);
  const [completionNotification, setCompletionNotification] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('kitcheniq_pantry', JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem('kitcheniq_grocery', JSON.stringify(groceryItems));
  }, [groceryItems]);

  // Pantry handlers
  const handleAddPantryItem = (itemData: Omit<PantryItem, 'id'>) => {
    const newItem: PantryItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    setPantryItems(prev => [newItem, ...prev]);
  };

  const handleRemovePantryItem = (id: string) => {
    setPantryItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearPantry = () => {
    setPantryItems([]);
  };

  // Recipe Favorite toggle
  const handleToggleFavorite = (recipeId: string) => {
    setRecipes(prev =>
      prev.map(r => (r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  // Add missing ingredients from recipe to grocery
  const handleAddMissingToGrocery = (recipe: Recipe) => {
    const newItems: GroceryItem[] = recipe.missingIngredients.map((name, idx) => ({
      id: `g-from-rec-${Date.now()}-${idx}`,
      name,
      category: 'Pantry & Grains',
      quantity: '1 unit',
      recipeSource: recipe.title,
      checked: false,
      addedAt: new Date().toISOString().split('T')[0]
    }));

    setGroceryItems(prev => [...newItems, ...prev]);
    showToast(`Added ${newItems.length} missing ingredients for "${recipe.title}" to your grocery list!`);
  };

  // Grocery handlers
  const handleToggleGrocery = (id: string) => {
    setGroceryItems(prev =>
      prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleRemoveGrocery = (id: string) => {
    setGroceryItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddManualGrocery = (name: string, category: string, quantity: string) => {
    const newItem: GroceryItem = {
      id: `g-${Date.now()}`,
      name,
      category,
      quantity,
      checked: false,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setGroceryItems(prev => [newItem, ...prev]);
  };

  const handleMoveCheckedToPantry = (itemsToMove: GroceryItem[]) => {
    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + 7); // Default 7 days shelf-life

    itemsToMove.forEach(gItem => {
      handleAddPantryItem({
        name: gItem.name,
        category: (gItem.category as any) || 'Produce',
        quantity: gItem.quantity || '1 unit',
        expiryDate: expiry.toISOString().split('T')[0],
        daysLeft: 7,
        addedDate: today.toISOString().split('T')[0]
      });
    });

    // Remove them from grocery list
    setGroceryItems(prev => prev.filter(i => !i.checked));
    showToast(`Transferred ${itemsToMove.length} items directly to your active pantry!`);
  };

  const handleClearCheckedGrocery = () => {
    setGroceryItems(prev => prev.filter(i => !i.checked));
  };

  // Cooking Mode Handlers
  const handleStartCooking = (recipe: Recipe) => {
    setActiveCookingRecipe(recipe);
  };

  const handleCompleteMeal = () => {
    if (!activeCookingRecipe) return;

    // Deduct/reduce some pantry ingredients used in this recipe
    const usedNames = activeCookingRecipe.usedPantryIngredients.map(u => u.toLowerCase());
    setPantryItems(prev =>
      prev.filter(item => !usedNames.some(used => item.name.toLowerCase().includes(used)))
    );

    // Update stats
    setStats(prev => ({
      streakDays: prev.streakDays + 1,
      wasteReductionPounds: Number((prev.wasteReductionPounds + 1.2).toFixed(1)),
      moneySavedUsd: prev.moneySavedUsd + 16,
      mealsCookedCount: prev.mealsCookedCount + 1
    }));

    const finishedTitle = activeCookingRecipe.title;
    setActiveCookingRecipe(null);
    showToast(`Bon Appetit! Cooked "${finishedTitle}". Prevented ~1.2 lbs of food waste!`);
  };

  const showToast = (msg: string) => {
    setCompletionNotification(msg);
    setTimeout(() => setCompletionNotification(null), 4500);
  };

  const favoriteRecipes = recipes.filter(r => r.isFavorite);
  const expiringCount = pantryItems.filter(i => i.daysLeft <= 3).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Toast Notification */}
      {completionNotification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-100 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{completionNotification}</span>
        </div>
      )}

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Kitchen<span className="text-emerald-400">IQ</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  AI Zero-Waste
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Eat Healthier • Cook What You Have • Eliminate Food Waste
              </p>
            </div>
          </div>

          {/* Cooking streak badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs">
              <Flame className="w-4 h-4 text-amber-400 fill-current" />
              <span className="font-semibold text-stone-200">{stats.streakDays} Day Streak</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-emerald-300">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>{stats.wasteReductionPounds} lbs Saved</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tab Bar */}
      <nav className="bg-stone-900/60 border-b border-stone-800/60 px-4 sm:px-8 sticky top-[65px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-3 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('pantry')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'pantry'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Refrigerator className="w-4 h-4" />
            Fridge & Pantry
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'pantry' ? 'bg-emerald-800 text-white' : 'bg-stone-800 text-stone-300'}`}>
              {pantryItems.length}
            </span>
            {expiringCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Items expiring soon" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'recipes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Recipe Generator
            {recipes.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'recipes' ? 'bg-emerald-800 text-white' : 'bg-stone-800 text-stone-300'}`}>
                {recipes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('grocery')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'grocery'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Smart Grocery
            {groceryItems.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'grocery' ? 'bg-emerald-800 text-white' : 'bg-stone-800 text-stone-300'}`}>
                {groceryItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Impact & Favorites
            {favoriteRecipes.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'dashboard' ? 'bg-emerald-800 text-white' : 'bg-stone-800 text-stone-300'}`}>
                {favoriteRecipes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ml-auto ${
              activeTab === 'architecture'
                ? 'bg-stone-800 text-emerald-400 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Architecture & Docs
          </button>
        </div>
      </nav>

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {activeTab === 'pantry' && (
          <PantrySection
            pantryItems={pantryItems}
            onAddItem={handleAddPantryItem}
            onRemoveItem={handleRemovePantryItem}
            onClearAll={handleClearPantry}
            onQuickGenerate={() => setActiveTab('recipes')}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipeGeneratorSection
            pantryItems={pantryItems}
            recipes={recipes}
            onSetRecipes={setRecipes}
            onToggleFavorite={handleToggleFavorite}
            onAddMissingToGrocery={handleAddMissingToGrocery}
            onStartCooking={handleStartCooking}
          />
        )}

        {activeTab === 'grocery' && (
          <GroceryListSection
            groceryItems={groceryItems}
            onToggleItem={handleToggleGrocery}
            onRemoveItem={handleRemoveGrocery}
            onAddItem={handleAddManualGrocery}
            onMoveCheckedToPantry={handleMoveCheckedToPantry}
            onClearChecked={handleClearCheckedGrocery}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardSection
            stats={stats}
            favoriteRecipes={favoriteRecipes}
            onStartCooking={handleStartCooking}
            onRemoveFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureHubSection />
        )}
      </main>

      {/* Cooking Mode Companion Modal */}
      {activeCookingRecipe && (
        <CookingModeModal
          recipe={activeCookingRecipe}
          onClose={() => setActiveCookingRecipe(null)}
          onComplete={handleCompleteMeal}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 px-4 text-center text-xs text-stone-500">
        <p>
          KitchenIQ • Powered by Gemini 2.5 Flash Multimodal AI • Promoting Sustainable, Zero-Waste Living.
        </p>
      </footer>
    </div>
  );
};
