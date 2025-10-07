import dotenv from 'dotenv';
import path from 'path';
import { promises as fs } from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://onyinye2029_db_user:UbKph1IAwH2whrAw@cluster0.l0gmejw.mongodb.net/shop-savy';
const UPLOAD_DIR   = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

// --- MODEL (reuse your schema if you already export it) ---
const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,      // keep string to match your controller
  category: String,
  image: String       // we store the FULL filename (with timestamp prefix)
}, { timestamps: true });

const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);

// --- Metadata keyed by the "core" filename (food_X.png / jpg / webp) ---
const META = {
'food_24.png': { name: 'Chickpea Veggie Sandwich', description: 'A hearty sandwich layered with mashed chickpeas, crisp cucumbers, lettuce, and diced vegetables between slices of multigrain bread.', price: '8.99', category: 'Sandwich' },
  'food_25.png': { name: 'Creamy Tuscan Chicken Pasta', description: 'Tender chicken pieces tossed with linguine in a creamy sauce with sun-dried tomatoes and spinach.', price: '13.99', category: 'Pasta' },
  'food_26.png': { name: 'Classic Spaghetti Marinara', description: 'Traditional spaghetti coated in rich tomato sauce for a simple, comforting Italian meal.', price: '10.49', category: 'Pasta' },
  'food_27.png': { name: 'Ricotta & Prosciutto Spaghetti', description: 'Light pasta with prosciutto, ricotta, and fresh greens.', price: '14.99', category: 'Pasta' },
  'food_28.png': { name: 'Seafood Spaghetti', description: 'Seafood pasta with shrimp, calamari, cherry tomatoes, and herbs in a garlic tomato sauce.', price: '16.99', category: 'Pasta' },
  'food_29.png': { name: 'Vietnamese Pho', description: 'Fragrant rice-noodle soup with herbs, chili, aromatic broth, and tender meat.', price: '12.99', category: 'Noodles' },
  'food_30.png': { name: 'Veg Fried Rice w/ Soft Egg', description: 'Stir-fried rice with zucchini and cabbage, served with soft-boiled eggs.', price: '9.99', category: 'Rice' },
  'food_31.png': { name: 'Ham & Cheese Baked Ziti', description: 'Cheesy baked ziti with diced ham and a creamy sauce.', price: '11.99', category: 'Pasta' },
  'food_32.png': { name: 'Tomato Basil Fusilli', description: 'Fusilli in tangy tomato basil sauce with cherry tomatoes.', price: '10.99', category: 'Pasta' },
  'food_13.png': { name: 'Strawberry Cheesecake Slice', description: 'Creamy cheesecake topped with strawberry glaze and mint on a buttery crust.', price: '6.99', category: 'Dessert' },
  'food_14.png': { name: 'Vanilla Berry Cake', description: 'Vanilla sponge with cream frosting, topped with blueberries and blackberries.', price: '24.99', category: 'Cake' },
  'food_15.png': { name: 'Mango Cheesecake Slice', description: 'Smooth mango cheesecake on a biscuit base with edible flowers.', price: '6.49', category: 'Dessert' },
  'food_16.png': { name: 'Stuffed Eggplant w/ Tomato Salad', description: 'Roasted eggplant stuffed with grains, yogurt drizzle, and fresh tomato salad.', price: '11.99', category: 'Salad' },
  'food_17.png': { name: 'Chickpea & Roasted Cauliflower Salad', description: 'Chickpeas, roasted cauliflower, parsley, and pomegranate with light dressing.', price: '9.49', category: 'Salad' },
  'food_18.png': { name: 'Club Sandwich w/ Potatoes', description: 'Layered sandwich with lettuce, bacon, tomato, cheese, and crispy potatoes.', price: '10.99', category: 'Sandwich' },
  'food_19.png': { name: 'BLT Sandwich', description: 'Bacon, lettuce, and tomato on toasted bread with mayo.', price: '9.99', category: 'Sandwich' },
  'food_20.png': { name: 'Chickpea Veggie Sandwich', description: 'Multigrain sandwich with mashed chickpeas, cucumbers, lettuce, and diced veggies.', price: '8.99', category: 'Sandwich' },
  'food_21.png': { name: 'Vietnamese Bánh Mì', description: 'Crispy baguette with deli meats, pickled veg, cilantro, and herbs.', price: '10.49', category: 'Sandwich' },
  'food_22.png': { name: 'Cherry Frosted Cupcake', description: 'Vanilla cupcake with pink frosting, sprinkles, and a cherry on top.', price: '3.99', category: 'Dessert' }
};

// Defaults if a core name isn’t found above
const DEFAULTS = {
  nameFrom: (core) => core.replace(/\.(png|jpg|jpeg|webp)$/i, '')
                          .replace(/[_-]+/g, ' ')
                          .replace(/\b\w/g, c => c.toUpperCase()),
  description: 'Delicious menu item.',
  price: '9.99',
  category: 'Misc'
};

// Extract the “core” (food_#.ext) from any filename that contains it
const extractCore = (filename) => {
  const m = filename.match(/(food_\d+\.(png|jpg|jpeg|webp))/i);
  return m ? m[1].toLowerCase() : null;
};

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[seed] Connected to Mongo');

    const files = (await fs.readdir(UPLOAD_DIR))
      .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

    if (!files.length) {
      console.log(`[seed] No image files found in ${UPLOAD_DIR}`);
      process.exit(0);
    }

    let created = 0, skipped = 0, unmatched = 0;

    for (const file of files) {
      const fullName = file;      // e.g. 17315575375322food_1.png
      const core = extractCore(fullName); // e.g. food_1.png

      // Skip if already inserted using this exact stored filename
      const exists = await Food.exists({ image: fullName });
      if (exists) { skipped++; continue; }

      const meta = core ? META[core] : null;
      if (!meta) unmatched++;  // still insert with defaults

      const doc = {
        name:       meta?.name ?? DEFAULTS.nameFrom(core || fullName),
        description:meta?.description ?? DEFAULTS.description,
        price:      meta?.price ?? DEFAULTS.price,
        category:   meta?.category ?? DEFAULTS.category,
        image:      fullName // keep the exact filename you serve from /uploads
      };

      await Food.create(doc);
      created++;
    }

    console.log(`[seed] Done. Created: ${created}, Skipped(existing): ${skipped}, Without explicit metadata: ${unmatched}`);
    process.exit(0);
  } catch (err) {
    console.error('[seed] Error:', err);
    process.exit(1);
  }
})();
