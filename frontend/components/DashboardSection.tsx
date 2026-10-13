import React from 'react';
import { UserStats, Recipe } from '../types';
import { 
  DollarSign, TrendingUp, Award, Flame, Heart, 
  Trash2, ChefHat, CheckCircle2, Leaf, Clock, ArrowRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

interface DashboardSectionProps {
  stats: UserStats;
  favoriteRecipes: Recipe[];
  onStartCooking: (recipe: Recipe) => void;
  onRemoveFavorite: (id: string) => void;
}

const WASTE_SAVINGS_HISTORY = [
  { month: 'Oct', lbsSaved: 6.4, dollarsSaved: 48 },
  { month: 'Nov', lbsSaved: 9.8, dollarsSaved: 74 },
  { month: 'Dec', lbsSaved: 14.2, dollarsSaved: 112 },
  { month: 'Jan', lbsSaved: 18.5, dollarsSaved: 145 },
  { month: 'Feb', lbsSaved: 22.1, dollarsSaved: 180 },
  { month: 'Current', lbsSaved: 26.8, dollarsSaved: 215 },
];

const MACRO_DISTRIBUTION = [
  { name: 'Protein', value: 35, color: '#10b981' },
  { name: 'Complex Carbs', value: 40, color: '#3b82f6' },
  { name: 'Healthy Fats', value: 25, color: '#f59e0b' },
];

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  stats,
  favoriteRecipes,
  onStartCooking,
  onRemoveFavorite
}) => {
  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-stone-400">Cooking Streak</span>
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Flame className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-white font-mono">{stats.streakDays} Days</div>
            <p className="text-xs text-stone-400 mt-1">Keep cooking zero-waste meals daily!</p>
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-stone-400">Food Waste Prevented</span>
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Leaf className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-emerald-400 font-mono">{stats.wasteReductionPounds} lbs</div>
            <p className="text-xs text-stone-400 mt-1">≈ 42 kg CO2 equivalent spared</p>
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-stone-400">Grocery Money Saved</span>
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-white font-mono">${stats.moneySavedUsd}</div>
            <p className="text-xs text-stone-400 mt-1">From using existing pantry staples</p>
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-stone-400">Meals Prepared</span>
            <span className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
              <ChefHat className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-white font-mono">{stats.mealsCookedCount}</div>
            <p className="text-xs text-stone-400 mt-1">Chef-grade healthy home meals</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waste Reduction Trend Chart */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Cumulative Waste & Cost Savings</h3>
              <p className="text-xs text-stone-400">Progress in pounds of food diverted and dollars retained</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg">
              +38% vs. avg household
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WASTE_SAVINGS_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPounds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716c" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#292524', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="dollarsSaved" stroke="#10b981" fillOpacity={1} fill="url(#colorPounds)" name="Dollars Saved ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nutritional Distribution Balance */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Target Macro Distribution</h3>
            <p className="text-xs text-stone-400">Optimized across your generated meal history</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MACRO_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MACRO_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#292524', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {MACRO_DISTRIBUTION.map(macro => (
              <div key={macro.name} className="flex items-center justify-between text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: macro.color }} />
                  <span>{macro.name}</span>
                </div>
                <span className="font-semibold text-white">{macro.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Favorite Recipes Shelf */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400 fill-current" />
            <h3 className="text-lg font-bold text-white">Saved Favorite Recipes ({favoriteRecipes.length})</h3>
          </div>
        </div>

        {favoriteRecipes.length === 0 ? (
          <div className="text-center py-10 text-stone-500 text-xs">
            Click the heart icon on any generated recipe card to bookmark it here for quick access!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                    <span className="text-emerald-400 font-semibold">{recipe.macros.calories} kcal</span>
                    <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{recipe.title}</h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">{recipe.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onRemoveFavorite(recipe.id)}
                    className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>

                  <button
                    onClick={() => onStartCooking(recipe)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    Cook
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
