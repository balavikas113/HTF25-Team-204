// Local, heuristic-based outfit suggestion engine.
// Keeps the app working offline for the hackathon prototype.

const STYLE_POOLS = {
  'gen-z': {
    tops: ['graphic tee', 'cropped hoodie', 'oversized sweater'],
    bottoms: ['wide-leg jeans', 'bike shorts', 'cargo pants'],
    shoes: ['chunky sneakers', 'platform boots'],
    accessories: ['bucket hat', 'chain necklace', 'mini backpack']
  },
  'gen-x': {
    tops: ['button-up shirt', 'cardigan', 'blazer'],
    bottoms: ['straight jeans', 'khakis', 'pencil skirt'],
    shoes: ['loafers', 'ankle boots'],
    accessories: ['watch', 'leather belt', 'scarf']
  },
  'classic': {
    tops: ['white shirt', 'cashmere sweater', 'blouse'],
    bottoms: ['tailored trousers', 'A-line skirt', 'chinos'],
    shoes: ['oxfords', 'ballet flats', 'derby shoes'],
    accessories: ['pearl necklace', 'leather bag', 'silk scarf']
  }
};

const EVENT_ADJUSTMENTS = {
  casual: { dressUp: 0 },
  business: { dressUp: 1 },
  formal: { dressUp: 2 },
  party: { dressUp: 1 }
};

const WEATHER_ADJUSTMENTS = {
  hot: { layer: false, shoes: 'sandals' },
  moderate: { layer: true },
  cold: { layer: true, extra: 'coat' },
  rainy: { layer: true, shoes: 'waterproof boots', extra: 'umbrella' }
};

function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export const getOutfitSuggestions = async (style = 'classic', event = 'casual', weather = 'moderate', wardrobe = []) => {
  // Use provided wardrobe items if available to bias the choices.
  const s = STYLE_POOLS[style] ? style : 'classic';
  const pool = STYLE_POOLS[s];

  // Helper to try to match wardrobe items first
  const preferFromWardrobe = (categoryKeywords) => {
    if (!wardrobe || wardrobe.length === 0) return null;
    const found = wardrobe.find(item =>
      categoryKeywords.some(k => item.toLowerCase().includes(k))
    );
    return found || null;
  };

  // Build suggestion
  const top = preferFromWardrobe(['shirt', 'top', 'tee', 'blouse', 'sweater']) || pickRandom(pool.tops);
  const bottom = preferFromWardrobe(['jeans', 'pants', 'skirt', 'shorts', 'chinos']) || pickRandom(pool.bottoms);
  const shoesFromWardrobe = preferFromWardrobe(['shoe', 'sneaker', 'boot', 'oxford', 'flat', 'sandals']);
  const shoes = shoesFromWardrobe || (WEATHER_ADJUSTMENTS[weather] && WEATHER_ADJUSTMENTS[weather].shoes) || pickRandom(pool.shoes);
  const accessories = [];
  const acc1 = preferFromWardrobe(['hat', 'cap', 'scarf', 'bag', 'necklace', 'watch', 'belt']);
  if (acc1) accessories.push(acc1);
  while (accessories.length < 2) {
    const a = pickRandom(pool.accessories);
    if (!accessories.includes(a)) accessories.push(a);
  }

  // Tips and layering
  const weatherAdj = WEATHER_ADJUSTMENTS[weather] || {};
  const eventAdj = EVENT_ADJUSTMENTS[event] || {};

  const tips = [];
  if (eventAdj.dressUp >= 1) tips.push('Consider a blazer or structured jacket to look polished.');
  if (eventAdj.dressUp >= 2) tips.push('Choose tailored pieces and minimal accessories for formal events.');
  if (weatherAdj.layer && !top.toLowerCase().includes('jacket')) tips.push('Layer with a light jacket or cardigan for comfort.');
  if (weatherAdj.extra) tips.push(`Bring ${weatherAdj.extra} — useful for ${weather} weather.`);
  tips.push(`Color tip: pick one accent color in accessories to tie the look together.`);

  // Provide a couple of alternative suggestions (simple variants)
  const alternatives = [
    { top: pickRandom(pool.tops), bottom: bottom, shoes: shoes, accessories: accessories },
    { top: top, bottom: pickRandom(pool.bottoms), shoes: shoes, accessories: accessories }
  ];

  return {
    top,
    bottom,
    shoes,
    accessories,
    tips,
    alternatives
  };
};