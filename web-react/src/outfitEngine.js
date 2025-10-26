export const getOutfitSuggestions = (style = 'classic', event = 'casual', weather = 'moderate', wardrobe = []) => {
  const STYLE_POOLS = {
    'gen-z': { tops:['graphic tee','cropped hoodie','oversized sweater'], bottoms:['wide-leg jeans','bike shorts','cargo pants'], shoes:['chunky sneakers','platform boots'], accessories:['bucket hat','chain necklace','mini backpack'] },
    'gen-x': { tops:['button-up shirt','cardigan','blazer'], bottoms:['straight jeans','khakis','pencil skirt'], shoes:['loafers','ankle boots'], accessories:['watch','leather belt','scarf'] },
    'classic': { tops:['white shirt','cashmere sweater','blouse'], bottoms:['tailored trousers','A-line skirt','chinos'], shoes:['oxfords','ballet flats','derby shoes'], accessories:['pearl necklace','leather bag','silk scarf'] }
  };
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  const pool = STYLE_POOLS[style]||STYLE_POOLS['classic'];
  return { top: pick(pool.tops), bottom: pick(pool.bottoms), shoes: pick(pool.shoes), accessories: [pick(pool.accessories), pick(pool.accessories)], tips:['Color tip: pick one accent color.'] };
}
