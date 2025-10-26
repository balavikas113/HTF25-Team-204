import React, { useState } from 'react'
import { getOutfitSuggestions } from './outfitEngine'

export default function App(){
  const [style,setStyle] = useState('classic')
  const [eventType,setEventType] = useState('casual')
  const [weather,setWeather] = useState('moderate')
  const [wardrobe, setWardrobe] = useState([])
  const [suggestion, setSuggestion] = useState(null)

  const run = ()=> setSuggestion(getOutfitSuggestions(style,eventType,weather,wardrobe))

  return (
    <div style={{padding:20}}>
      <h1>AI Outfit Planner (React)</h1>
      <div>
        <label>Style:</label>
        <select value={style} onChange={e=>setStyle(e.target.value)}>
          <option value="classic">Classic</option>
          <option value="gen-z">Gen Z</option>
          <option value="gen-x">Gen X</option>
        </select>
      </div>
      <div>
        <label>Event:</label>
        <select value={eventType} onChange={e=>setEventType(e.target.value)}>
          <option value="casual">Casual</option>
          <option value="business">Business</option>
          <option value="formal">Formal</option>
          <option value="party">Party</option>
        </select>
      </div>
      <div>
        <label>Weather:</label>
        <select value={weather} onChange={e=>setWeather(e.target.value)}>
          <option value="moderate">Moderate</option>
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
          <option value="rainy">Rainy</option>
        </select>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={run}>Get Suggestions</button>
      </div>

      {suggestion && (
        <div style={{marginTop:12}}>
          <h3>Top: {suggestion.top}</h3>
          <h3>Bottom: {suggestion.bottom}</h3>
          <h3>Shoes: {suggestion.shoes}</h3>
        </div>
      )}
    </div>
  )
}
