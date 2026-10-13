import React, { useState, useRef } from 'react';
import { PantryItem, IngredientCategory } from '../types';
import { scanFridgeImage } from '../services/geminiService';
import { 
  Camera, Plus, Trash2, AlertTriangle, CheckCircle2, Clock, 
  Sparkles, Filter, Search, RefreshCw, UploadCloud, ChevronDown
} from 'lucide-react';

interface PantrySectionProps {
  pantryItems: PantryItem[];
  onAddItem: (item: Omit<PantryItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onQuickGenerate: () => void;
}

const CATEGORIES: IngredientCategory[] = [
  'Produce',
  'Dairy & Eggs',
  'Proteins',
  'Pantry & Grains',
  'Spices & Sauces',
  'Bakery'
];

export const PantrySection: React.FC<PantrySectionProps> = ({
  pantryItems,
  onAddItem,
  onRemoveItem,
  onClearAll,
  onQuickGenerate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<IngredientCategory>('Produce');
  const [newQuantity, setNewQuantity] = useState('1 unit');
  const [newDaysToExpiry, setNewDaysToExpiry] = useState(5);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(today.getDate() + Number(newDaysToExpiry));

    onAddItem({
      name: newName.trim(),
      category: newCategory,
      quantity: newQuantity || '1 pack',
      expiryDate: expiry.toISOString().split('T')[0],
      daysLeft: Number(newDaysToExpiry),
      addedDate: today.toISOString().split('T')[0],
      isExpiringSoon: Number(newDaysToExpiry) <= 3
    });

    setNewName('');
    setNewQuantity('1 unit');
    setNewDaysToExpiry(5);
    setShowAddForm(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanMessage('Analyzing fridge image with Gemini 2.5 Flash Vision...');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      const detected = await scanFridgeImage(base64Data, file.type || 'image/jpeg');

      const today = new Date();
      detected.forEach(item => {
        const expiry = new Date(today);
        expiry.setDate(today.getDate() + item.suggestedDaysToExpiry);

        onAddItem({
          name: item.name,
          category: item.category,
          quantity: item.estimatedQuantity,
          expiryDate: expiry.toISOString().split('T')[0],
          daysLeft: item.suggestedDaysToExpiry,
          addedDate: today.toISOString().split('T')[0],
          isExpiringSoon: item.suggestedDaysToExpiry <= 3
        });
      });

      setIsScanning(false);
      setScanMessage(`Success! Automatically logged ${detected.length} items to your pantry.`);
      setTimeout(() => setScanMessage(null), 4500);
    };

    reader.readAsDataURL(file);
  };

  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const expiringSoonCount = pantryItems.filter(i => i.daysLeft <= 3).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Call-to-action */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-stone-900 to-emerald-950/40 border border-emerald-800/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Fridge & Pantry Assistant
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            Smart Pantry & Freshness Tracker
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mb-6 leading-relaxed">
            Snap a picture of your fridge or pantry shelf to instantly log ingredients. KitchenIQ tracks expiry dates and prioritizes what needs to be cooked first!
          </p>

          <div className="flex flex-wrap gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition duration-150"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Scanning Fridge...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Snap / Upload Fridge Photo
                </>
              )}
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Manual Quick Add
            </button>

            {pantryItems.length > 0 && (
              <button
                onClick={onQuickGenerate}
                className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-sm font-semibold flex items-center gap-2 transition ml-auto"
              >
                <Sparkles className="w-4 h-4" />
                Find Recipes Now ({pantryItems.length} items)
              </button>
            )}
          </div>

          {scanMessage && (
            <div className="mt-4 p-3 bg-emerald-900/40 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {scanMessage}
            </div>
          )}
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Manual Add Form (Expandable) */}
      {showAddForm && (
        <form onSubmit={handleManualAdd} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Item to Inventory
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-200 text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-400 mb-1">Ingredient Name</label>
              <input
                type="text"
                placeholder="e.g. Greek Yogurt, Ribeye Steak, Spinach"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as IngredientCategory)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">Estimated Shelf-life</label>
              <select
                value={newDaysToExpiry}
                onChange={(e) => setNewDaysToExpiry(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={1}>1 day (Critical)</option>
                <option value={2}>2 days (Very Soon)</option>
                <option value={3}>3 days (Expiring soon)</option>
                <option value={5}>5 days</option>
                <option value={7}>1 week (Fresh)</option>
                <option value={14}>2 weeks (Stable)</option>
                <option value={30}>1 month (Pantry staple)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
            >
              Add Item
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search pantry items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === 'All'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
            }`}
          >
            All ({pantryItems.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = pantryItems.filter(i => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
                }`}
              >
                {cat} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expiry alerts summary */}
      {expiringSoonCount > 0 && (
        <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm text-amber-200">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <span className="font-semibold">{expiringSoonCount} item{expiringSoonCount > 1 ? 's' : ''} expiring within 3 days.</span>
              <p className="text-amber-300/80 text-xs">Generate a zero-waste recipe to use them before they spoil!</p>
            </div>
          </div>
          <button
            onClick={onQuickGenerate}
            className="px-3 py-1.5 bg-amber-500 text-stone-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition"
          >
            Cook These Now
          </button>
        </div>
      )}

      {/* Pantry Grid Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-stone-900/50 border border-stone-800/80 rounded-2xl p-6">
          <UploadCloud className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-300">No ingredients found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Upload a fridge snapshot or manually add grocery items to jumpstart your zero-waste meal suggestions.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
          >
            Add First Ingredient
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map(item => {
            const isCritical = item.daysLeft <= 2;
            const isWarning = item.daysLeft === 3;

            return (
              <div
                key={item.id}
                className="bg-stone-900/90 hover:bg-stone-850 border border-stone-800 rounded-xl p-4 transition duration-150 flex flex-col justify-between group shadow-sm hover:border-stone-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                      {item.category}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Quantity: <span className="text-stone-300 font-medium">{item.quantity}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-stone-500 hover:text-red-400 p-1.5 hover:bg-stone-800 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-stone-400">Expires in:</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {isCritical && <AlertTriangle className="w-3 h-3" />}
                    {item.daysLeft === 0 ? 'Today!' : `${item.daysLeft} day${item.daysLeft > 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear Pantry option */}
      {pantryItems.length > 0 && (
        <div className="flex justify-between items-center pt-2 text-xs text-stone-500">
          <span>{pantryItems.length} pantry items actively monitored</span>
          <button
            onClick={onClearAll}
            className="text-stone-500 hover:text-red-400 transition"
          >
            Reset Pantry
          </button>
        </div>
      )}
    </div>
  );
};
