// Ported outfit engine for the web UI
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

function preferFromWardrobe(wardrobe, categoryKeywords) {
  if (!wardrobe || wardrobe.length === 0) return null;
  const found = wardrobe.find(item =>
    categoryKeywords.some(k => item.toLowerCase().includes(k))
  );
  return found || null;
}

function getOutfitSuggestions(style = 'classic', event = 'casual', weather = 'moderate', wardrobe = [], options = {}) {
  const s = STYLE_POOLS[style] ? style : 'classic';
  const pool = STYLE_POOLS[s];

  // options: { color: 'neutral'|'bold'..., accessories: ['hat','belt'], alternatives: number }
  const colorPref = options.color || 'neutral';
  const accPrefs = options.accessories || [];
  const altCount = Math.max(0, Math.min(5, options.alternatives || 2));

  const top = preferFromWardrobe(wardrobe, ['shirt', 'top', 'tee', 'blouse', 'sweater']) || pickRandom(pool.tops);
  const bottom = preferFromWardrobe(wardrobe, ['jeans', 'pants', 'skirt', 'shorts', 'chinos']) || pickRandom(pool.bottoms);
  const shoesFromWardrobe = preferFromWardrobe(wardrobe, ['shoe', 'sneaker', 'boot', 'oxford', 'flat', 'sandals']);
  const shoes = shoesFromWardrobe || (WEATHER_ADJUSTMENTS[weather] && WEATHER_ADJUSTMENTS[weather].shoes) || pickRandom(pool.shoes);

  // Accessories: prefer wardrobe matches, then preferences, then pool
  const accessories = [];
  const acc1 = preferFromWardrobe(wardrobe, ['hat', 'cap', 'scarf', 'bag', 'necklace', 'watch', 'belt']);
  if (acc1) accessories.push(acc1);
  // prefer explicit accessory preferences
  for (const pref of accPrefs){
    if (!accessories.includes(pref)){
      // try to find in wardrobe
      const w = preferFromWardrobe(wardrobe, [pref]);
      if (w) accessories.push(w);
      else if (pool.accessories.includes(pref)) accessories.push(pref);
    }
  }
  while (accessories.length < 2) {
    const a = pickRandom(pool.accessories);
    if (!accessories.includes(a)) accessories.push(a);
  }

  const weatherAdj = WEATHER_ADJUSTMENTS[weather] || {};
  const eventAdj = EVENT_ADJUSTMENTS[event] || {};

  const tips = [];
  if (eventAdj.dressUp >= 1) tips.push('Consider a blazer or structured jacket to look polished.');
  if (eventAdj.dressUp >= 2) tips.push('Choose tailored pieces and minimal accessories for formal events.');
  if (weatherAdj.layer && !top.toLowerCase().includes('jacket')) tips.push('Layer with a light jacket or cardigan for comfort.');
  if (weatherAdj.extra) tips.push(`Bring ${weatherAdj.extra} — useful for ${weather} weather.`);
  // color guidance based on preference
  if (colorPref === 'bold') tips.push('Go bold: try a bright accent (red or cobalt) in accessories.');
  else if (colorPref === 'pastel') tips.push('Soft pastels work well together — consider a pastel accessory.');
  else if (colorPref === 'monochrome') tips.push('Monochrome: pick varying shades of the same color for a cohesive look.');
  else tips.push('Neutral: stick to beige, black, white or navy for a timeless look.');

  // Build alternatives
  const alternatives = [];
  for (let i=0;i<altCount;i++){
    alternatives.push({
      top: pickRandom(pool.tops),
      bottom: pickRandom(pool.bottoms),
      shoes: pickRandom(pool.shoes),
      accessories: accessories
    });
  }

  return {
    top,
    bottom,
    shoes,
    accessories,
    tips,
    alternatives
  };
}

// expose to global for non-module usage
window.getOutfitSuggestions = getOutfitSuggestions;
