import React, { useState } from 'react';
import { GroceryItem, PantryItem, IngredientCategory } from '../types';
import { ShoppingCart, Plus, Check, Trash2, ArrowUpRight, CheckCheck, PackagePlus } from 'lucide-react';

interface GroceryListSectionProps {
  groceryItems: GroceryItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (name: string, category: string, quantity: string) => void;
  onMoveCheckedToPantry: (items: GroceryItem[]) => void;
  onClearChecked: () => void;
}

export const GroceryListSection: React.FC<GroceryListSectionProps> = ({
  groceryItems,
  onToggleItem,
  onRemoveItem,
  onAddItem,
  onMoveCheckedToPantry,
  onClearChecked
}) => {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<IngredientCategory>('Produce');
  const [itemQty, setItemQty] = useState('1');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    onAddItem(itemName.trim(), itemCategory, itemQty || '1 pack');
    setItemName('');
    setItemQty('1');
  };

  const checkedItems = groceryItems.filter(i => i.checked);
  const pendingItems = groceryItems.filter(i => !i.checked);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full mb-2">
              <ShoppingCart className="w-3.5 h-3.5" />
              Smart Restock Hub
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              Smart Grocery & Missing Essentials
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Add missing ingredients with one click. When you buy them, automatically transfer them right into your pantry inventory!
            </p>
          </div>

          {checkedItems.length > 0 && (
            <button
              onClick={() => onMoveCheckedToPantry(checkedItems)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <PackagePlus className="w-4 h-4" />
              Transfer Bought ({checkedItems.length}) to Pantry
            </button>
          )}
        </div>

        {/* Quick Add Bar */}
        <form onSubmit={handleAdd} className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="Add item (e.g., Coconut Milk, Olive Oil, Lemons)..."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value as IngredientCategory)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Produce">Produce</option>
              <option value="Dairy & Eggs">Dairy & Eggs</option>
              <option value="Proteins">Proteins</option>
              <option value="Pantry & Grains">Pantry & Grains</option>
              <option value="Spices & Sauces">Spices & Sauces</option>
              <option value="Bakery">Bakery</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Qty (1 bottle)"
              value={itemQty}
              onChange={(e) => setItemQty(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Grocery Items List */}
      <div className="space-y-4">
        {groceryItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/40 border border-stone-800 rounded-2xl p-6">
            <ShoppingCart className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-300">Your grocery list is empty</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Any missing ingredients generated in the recipe finder will appear here for easy shopping!
            </p>
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-800">
            {/* Pending Items */}
            {pendingItems.map(item => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between gap-3 hover:bg-stone-850 transition group"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleItem(item.id)}
                    className="w-5 h-5 rounded-md border border-stone-600 hover:border-emerald-400 flex items-center justify-center transition"
                  >
                    {item.checked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                    <p className="text-xs text-stone-400">
                      {item.category} • {item.quantity}
                      {item.recipeSource && (
                        <span className="text-emerald-400 ml-1 font-medium">
                          (for {item.recipeSource})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-stone-500 hover:text-red-400 p-1.5 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Checked Items Section */}
            {checkedItems.length > 0 && (
              <div className="p-4 bg-stone-950/40">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-3 font-semibold">
                  <span>Purchased ({checkedItems.length})</span>
                  <button
                    onClick={onClearChecked}
                    className="text-stone-500 hover:text-stone-300 text-[11px]"
                  >
                    Clear Checked
                  </button>
                </div>
                <div className="space-y-2">
                  {checkedItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-1.5 opacity-60 hover:opacity-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleItem(item.id)}
                          className="w-5 h-5 rounded-md bg-emerald-600 border border-emerald-500 flex items-center justify-center"
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </button>
                        <span className="text-sm text-stone-300 line-through">{item.name}</span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-600 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
