// Web UI logic
// Assumes outfitEngine.js exposes `window.getOutfitSuggestions`.

// Helpers for localStorage
const LS_WARDROBE = 'ao_wardrobe';
const LS_FAVORITES = 'ao_favorites';

function loadWardrobe(){
  try { return JSON.parse(localStorage.getItem(LS_WARDROBE) || '[]'); } catch(e){ return []; }
}
function saveWardrobe(arr){ localStorage.setItem(LS_WARDROBE, JSON.stringify(arr)); }
function loadFavorites(){try { return JSON.parse(localStorage.getItem(LS_FAVORITES) || '[]'); } catch(e){ return []; }}
function saveFavorites(arr){ localStorage.setItem(LS_FAVORITES, JSON.stringify(arr)); }

// UI state
let currentStyle = 'classic';
let currentEvent = 'casual';
let currentWeather = 'moderate';
let currentSuggestion = null;
let altIndex = -1;
let currentColor = 'neutral';
let numAlternatives = 2;

// Setup UI bindings
window.showScreen = function(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id+'-screen').classList.add('active');
  if(id === 'wardrobe') renderWardrobe();
  if(id === 'favorites') renderFavorites();
}

window.setStyle = function(style){
  currentStyle = style;
  document.querySelectorAll('.style-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase().includes(style.replace('-',' '))));
}

window.getOutfitSuggestion = function(){
  currentEvent = document.getElementById('event-type').value;
  currentWeather = document.getElementById('weather').value;
  // read UI options
  currentColor = document.getElementById('color-pref')?.value || 'neutral';
  numAlternatives = parseInt(document.getElementById('num-alt')?.value || '2', 10);
  const accNodes = Array.from(document.querySelectorAll('.acc-pref:checked')).map(n=>n.value);
  const wardrobe = loadWardrobe();
  currentSuggestion = window.getOutfitSuggestions(currentStyle, currentEvent, currentWeather, wardrobe, { color: currentColor, accessories: accNodes, alternatives: numAlternatives });
  altIndex = -1;
  renderSuggestion();
  showScreen('outfit');
}

function renderSuggestion(){
  if(!currentSuggestion) return;
  const displayed = altIndex === -1 ? currentSuggestion : { ...currentSuggestion, ...currentSuggestion.alternatives[altIndex] };
  document.querySelector('.style-info').textContent = `Style: ${currentStyle} • Event: ${currentEvent} • Weather: ${currentWeather}`;
  if(currentColor) document.querySelector('.style-info').textContent += ` • Color: ${currentColor}`;
  document.querySelector('.top').textContent = displayed.top;
  document.querySelector('.bottom').textContent = displayed.bottom;
  document.querySelector('.shoes').textContent = displayed.shoes;
  const accList = document.querySelector('.accessories'); accList.innerHTML = '';
  (displayed.accessories||[]).forEach(a => { const li = document.createElement('li'); li.textContent = a; accList.appendChild(li); });
  const tips = document.querySelector('.tips'); tips.innerHTML = '';
  (currentSuggestion.tips||[]).forEach(t => { const li = document.createElement('li'); li.textContent = t; tips.appendChild(li); });
}

window.showAlternative = function(){
  if(!currentSuggestion) return;
  altIndex = altIndex + 1;
  if(altIndex >= currentSuggestion.alternatives.length) altIndex = -1;
  renderSuggestion();
}

window.saveToFavorites = function(){
  if(!currentSuggestion) return alert('No suggestion to save');
  const displayed = altIndex === -1 ? currentSuggestion : { ...currentSuggestion, ...currentSuggestion.alternatives[altIndex] };
  const favs = loadFavorites();
  favs.push({ style: currentStyle, event: currentEvent, weather: currentWeather, color: currentColor, ...displayed, date: new Date().toISOString() });
  saveFavorites(favs);
  alert('Saved to favorites');
}

// Wardrobe UI
window.addWardrobeItem = function(){
  const input = document.getElementById('wardrobe-item');
  const v = (input.value||'').trim();
  if(!v) return;
  const arr = loadWardrobe(); arr.push(v); saveWardrobe(arr); input.value = ''; renderWardrobe();
}

function renderWardrobe(){
  const list = document.getElementById('wardrobe-list'); list.innerHTML = '';
  const arr = loadWardrobe();
  if(arr.length === 0){ list.innerHTML = '<p class="hint">No wardrobe items yet. Add some to bias suggestions.</p>'; return; }
  arr.forEach((item, idx) =>{
    const row = document.createElement('div'); row.className='wardrobe-row';
    const span = document.createElement('div'); span.textContent = item;
    const actions = document.createElement('div');
    const edit = document.createElement('button'); edit.textContent='Edit'; edit.className='secondary-btn'; edit.style.marginRight='8px'; edit.onclick = ()=>{ const v = prompt('Edit item', item); if(v && v.trim()){ arr[idx]=v.trim(); saveWardrobe(arr); renderWardrobe(); } };
    const del = document.createElement('button'); del.textContent='Delete'; del.className='secondary-btn'; del.onclick = ()=>{ arr.splice(idx,1); saveWardrobe(arr); renderWardrobe(); };
    actions.appendChild(edit); actions.appendChild(del);
    row.appendChild(span); row.appendChild(actions); list.appendChild(row);
  })
}

// Favorites
function renderFavorites(){
  const holder = document.getElementById('favorites-list'); holder.innerHTML = '';
  const favs = loadFavorites();
  if(favs.length===0){ holder.innerHTML = '<p class="hint">No favorites yet.</p>'; return; }
  favs.slice().reverse().forEach(f=>{
    const card = document.createElement('div'); card.className='favorite-card';
    const delBtn = `<button class="secondary-btn" onclick="_ao.deleteFavorite('${f.date}')" style="float:right">Delete</button>`;
    const colorLine = f.color ? ` • ${f.color}` : '';
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:start"><div><strong>${f.style.toUpperCase()}</strong> • ${f.event.toUpperCase()} • ${f.weather.toUpperCase()}${colorLine}</div>${delBtn}</div><div style="margin-top:6px">Top: ${f.top}</div><div>Bottom: ${f.bottom}</div><div>Shoes: ${f.shoes}</div><div>Accessories: ${(f.accessories||[]).join(', ')}</div><div style="margin-top:6px;font-size:12px;color:#6b7280">Saved: ${new Date(f.date).toLocaleString()}</div>`;
    holder.appendChild(card);
  })
}

// Initialize default UI
document.addEventListener('DOMContentLoaded', ()=>{
  // default style highlight
  setStyle(currentStyle);
  showScreen('home');
});

// Expose for debugging
window._ao = { loadWardrobe, saveWardrobe, loadFavorites, saveFavorites };

// helper to delete a favorite by date key
window._ao.deleteFavorite = function(dateKey){
  const favs = loadFavorites().filter(f => f.date !== dateKey);
  saveFavorites(favs);
  renderFavorites();
}

// Export / Import helpers
window.exportWardrobe = function(){
  const data = loadWardrobe();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'wardrobe.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

window.exportFavorites = function(){
  const data = loadFavorites();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'favorites.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

window.importJson = function(ev){
  const f = ev.target.files && ev.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = function(){
    try{
      const obj = JSON.parse(reader.result);
      if(Array.isArray(obj)){
        // heuristics: if objects with top/bottom assume favorites, else wardrobe
        if(obj.length>0 && typeof obj[0] === 'object' && obj[0].top) { saveFavorites(obj); alert('Imported favorites'); }
        else { saveWardrobe(obj); alert('Imported wardrobe'); renderWardrobe(); }
      } else { alert('Imported JSON is not an array'); }
    } catch(e){ alert('Invalid JSON file'); }
  };
  reader.readAsText(f);
  ev.target.value = '';
}

window.clearFavorites = function(){ if(confirm('Clear all saved favorites?')){ saveFavorites([]); renderFavorites(); } }
