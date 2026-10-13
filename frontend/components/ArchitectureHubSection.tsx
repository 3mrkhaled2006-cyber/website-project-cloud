import React, { useState } from 'react';
import { 
  Database, Server, Layers, Code2, Globe, ShieldCheck, 
  HelpCircle, Sparkles, Copy, Check 
} from 'lucide-react';

export const ArchitectureHubSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'starter-code' | 'market-pitch'>('architecture');
  const [copiedCode, setCopiedCode] = useState(false);

  const starterCodeSnippet = `// Production-ready KitchenIQ Recipe Engine Controller (Node.js/Express + Gemini 2.5 Flash)
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export async function matchRecipesForUser(req, res) {
  try {
    const { availablePantryItems, dietaryPreferences, maxMissingIngredients = 2 } = req.body;

    const ingredientSummary = availablePantryItems
      .map(item => \`\${item.name} (\${item.quantity}, \${item.daysLeft} days until expiry)\`)
      .join(', ');

    const prompt = \`As KitchenIQ, craft 3 high-nutritional zero-waste recipes strictly using:
Available Ingredients: \${ingredientSummary}
Dietary Filter: \${dietaryPreferences.join(', ')}
Allow at most \${maxMissingIngredients} missing pantry seasonings.
Return JSON with macro counts, cooking steps, and pantry match percentage.\`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Advanced'] },
              matchRate: { type: Type.INTEGER },
              prepTimeMinutes: { type: Type.INTEGER },
              cookTimeMinutes: { type: Type.INTEGER },
              macros: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.INTEGER },
                  proteinGrams: { type: Type.INTEGER },
                  carbsGrams: { type: Type.INTEGER },
                  fatGrams: { type: Type.INTEGER }
                },
                required: ['calories', 'proteinGrams', 'carbsGrams', 'fatGrams']
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    instruction: { type: Type.STRING },
                    timerMinutes: { type: Type.INTEGER }
                  },
                  required: ['stepNumber', 'title', 'instruction']
                }
              }
            },
            required: ['title', 'matchRate', 'macros', 'steps']
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.status(200).json({ success: true, count: parsed.length, recipes: parsed });
  } catch (error) {
    console.error('Recipe engine match failure:', error);
    return res.status(500).json({ success: false, error: 'Recipe engine service error' });
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(starterCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Navigation sub-tabs */}
      <div className="flex border-b border-stone-800 gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'architecture'
              ? 'bg-emerald-600 text-white'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Server className="w-4 h-4" />
          System Architecture
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'schema'
              ? 'bg-emerald-600 text-white'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Database className="w-4 h-4" />
          Database Schema & Relations
        </button>

        <button
          onClick={() => setActiveTab('starter-code')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'starter-code'
              ? 'bg-emerald-600 text-white'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Production Starter Engine
        </button>

        <button
          onClick={() => setActiveTab('market-pitch')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'market-pitch'
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          لماذا هذه الفكرة ممتازة؟ (Why Excellent?)
        </button>
      </div>

      {/* Tab: System Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">High-Level System Architecture</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-6">
              KitchenIQ leverages a modular decoupled architecture: Mobile/Web clients communicate with an API Gateway / Node.js backend which coordinates PostgreSQL, Redis caching, and Vertex AI Gemini 2.5 Flash for multimodal fridge vision and zero-waste recipe reasoning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold">Client Tier</span>
                <h4 className="font-bold text-stone-200">Mobile & Web Clients</h4>
                <ul className="text-stone-400 space-y-1">
                  <li>• React 19 + Tailwind CSS for responsive Web</li>
                  <li>• React Native / Expo for iOS & Android</li>
                  <li>• Native Camera API for real-time fridge scanning</li>
                  <li>• Offline IndexedDB / SQLite cache for pantry items</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">Backend & AI Gateway</span>
                <h4 className="font-bold text-stone-200">Node.js Express / Python FastAPI</h4>
                <ul className="text-stone-400 space-y-1">
                  <li>• Google GenAI SDK (Gemini 2.5 Flash)</li>
                  <li>• Fridge Vision Parsing & Expiration Heuristics</li>
                  <li>• Redis for caching common recipe generation permutations</li>
                  <li>• Webhook sync for shared household grocery lists</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] font-bold">Persistence Layer</span>
                <h4 className="font-bold text-stone-200">PostgreSQL + Vector Search</h4>
                <ul className="text-stone-400 space-y-1">
                  <li>• Relational tables for Users, Pantries, Grocery, and Recipes</li>
                  <li>• pgvector for recipe similarity matching</li>
                  <li>• Row-level security for multi-tenant household sharing</li>
                  <li>• Automated daily expiry push notifications</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recommended Folder Structure */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-3">Recommended Monorepo Folder Structure</h3>
            <pre className="p-4 bg-stone-950 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800">
{`kitcheniq-monorepo/
├── apps/
│   ├── web/                    # React 19 + Tailwind Web Application
│   │   ├── src/components/     # PantryCard, RecipeCard, CookingTimer
│   │   ├── src/services/       # geminiService.ts, api.ts
│   │   └── src/hooks/          # usePantry.ts, useGrocery.ts
│   └── mobile/                 # React Native / Expo Mobile App
│       ├── app/(tabs)/         # Expo router screens: pantry, cook, grocery
│       └── components/camera/  # FridgeCaptureScanner.tsx
├── packages/
│   ├── shared-types/           # Common TypeScript interfaces (PantryItem, Recipe)
│   └── ai-engine/              # Reusable Gemini prompt templates & schemas
├── backend/
│   ├── src/controllers/        # recipeEngine.controller.ts, pantry.controller.ts
│   ├── src/db/schema.sql       # PostgreSQL migrations
│   └── src/services/ai.ts      # GoogleGenAI client singleton
└── docker-compose.yml          # Postgres + Redis + Node`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab: Schema */}
      {activeTab === 'schema' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">PostgreSQL Production Schema & Relations</h3>
          <p className="text-stone-400 text-xs">Normalized relational design supporting households, multi-user pantry sharing, recipe logs, and smart grocery syncing.</p>

          <pre className="p-4 bg-stone-950 rounded-xl text-teal-300 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800">
{`-- 1. USERS & HOUSEHOLDS
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  dietary_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SMART PANTRY INVENTORY
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'Produce', 'Dairy & Eggs', 'Proteins', etc.
  quantity VARCHAR(50),
  expiry_date DATE NOT NULL,
  source_type VARCHAR(20) DEFAULT 'manual', -- 'camera_scan', 'manual', 'grocery_transferred'
  is_consumed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_pantry_expiry ON pantry_items (household_id, expiry_date);

-- 3. RECIPES & GENERATION LOG
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  match_percentage INTEGER NOT NULL,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  calories INTEGER,
  protein_grams INTEGER,
  carbs_grams INTEGER,
  fat_grams INTEGER,
  steps JSONB NOT NULL,
  created_by_user UUID REFERENCES users(id)
);

-- 4. SAVED FAVORITES & COOKING HISTORY
CREATE TABLE user_favorite_recipes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE cooking_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  recipe_id UUID REFERENCES recipes(id),
  cooked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  waste_saved_lbs NUMERIC(5,2) DEFAULT 0.85
);

-- 5. SHARED GROCERY LIST
CREATE TABLE grocery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50),
  quantity VARCHAR(50) DEFAULT '1 unit',
  is_bought BOOLEAN DEFAULT FALSE,
  origin_recipe_id UUID REFERENCES recipes(id)
);`}
          </pre>
        </div>
      )}

      {/* Tab: Starter Code */}
      {activeTab === 'starter-code' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Production Recipe Matching Controller</h3>
              <p className="text-stone-400 text-xs">Node.js / Express + Gemini 2.5 Flash with responseSchema validation.</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied' : 'Copy Code'}
            </button>
          </div>

          <pre className="p-4 bg-stone-950 rounded-xl text-stone-300 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800 max-h-[500px]">
            {starterCodeSnippet}
          </pre>
        </div>
      )}

      {/* Tab: Why this idea is excellent (لماذا هذه الفكرة ممتازة؟) */}
      {activeTab === 'market-pitch' && (
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/30 border border-amber-800/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold inline-block mb-2">
              Market Economics & AI Product Strategy
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              لماذا فكرة تطبيق "KitchenIQ" ممتازة وتستحق التنفيذ؟
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              Why KitchenIQ solves massive real-world pain points that traditional recipe apps fail to address.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                1. القضاء على هدر الطعام وتوفير مئات الدولارات شهرياً
              </h4>
              <p className="text-stone-400 leading-relaxed">
                وفقاً لمنظمة الأغذية العالمية، تهدر الأسرة العادية ما يقارب <strong>1500 إلى 2000 دولار سنوياً</strong> على أطعمة تنتهي صلاحيتها في الثلاجة دون استخدامها. KitchenIQ يحول هذه المكونات المنسية إلى وجبات راقية قبل أن تفسد!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                2. حل مشكلة "ماذا نطبخ اليوم؟" المستعصية
              </h4>
              <p className="text-stone-400 leading-relaxed">
                معظم تطبيقات الطبخ التقليدية تعرض وصفات تتطلب شراء 10 مكونات جديدة. ميزة KitchenIQ الفريدة هي <strong>العكس تماماً</strong>: «اطبخ بما تملكه بالفعل الآن بنسبة تطابق تصل إلى 100%».
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                3. تجربة مستخدم فورية عبر تصوير الثلاجة (Multimodal AI)
              </h4>
              <p className="text-stone-400 leading-relaxed">
                بفضل Gemini 2.5 Flash Vision، لا يحتاج المستخدم إلى كتابة أسماء 20 صنفاً يدوياً؛ صورة واحدة كافية لقراءة الخضار، الأجبان، واللحوم مع تقدير الصلاحية آلياً.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                4. نموذج ربحي واستثماري قوي ومستدام (Monetization)
              </h4>
              <p className="text-stone-400 leading-relaxed">
                فرص قوية للاشتراكات الشهرية (KitchenIQ Pro: خطط وجبات كيتو/بروتين، تكامل مع محلات السوبرماركت المحلية مثل Instacart/Amazon Fresh لتوصيل النواقص بضغطة زر واحدة).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
