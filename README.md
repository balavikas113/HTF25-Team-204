# AI Outfit Planner — Prototype

This repository contains a React Native prototype for the Hacktober/HTF25 "AI Outfit Planner for All Styles" hackathon project. I added a simple, local outfit suggestion engine and a Node test harness so you can run the suggestion logic without building the mobile app.

What I added for you now
- `src/services/outfitService.js`: a heuristic-based outfit suggestion engine used by the app (runs in the React Native app).
- `tools/testOutfitEngine.js`: a standalone Node script that duplicates the engine logic so you can test suggestions quickly.
- `package.json` script: `npm run test-engine` to run the Node harness.

Quick start (run the engine without building the app)

1. Open PowerShell and go to the project folder:

```powershell
cd 'C:\Users\balavikas\OneDrive\Desktop\hacktober\AIOutfitPlanner'
```

2. Install dependencies (only needed for the RN app; the Node harness doesn't require them):

```powershell
npm install
```

3. Run the test harness which prints a few example suggestions:

```powershell
npm run test-engine
```

This runs `node ./tools/testOutfitEngine.js` and prints sample outfit suggestions for a few styles/events.

How to run the mobile app (short)
- This is a React Native project (not Expo). To run the app on a device or emulator you'll need Node, the React Native CLI, and Android SDK or Xcode (for iOS). The usual commands are:

```powershell
# start Metro
npx react-native start
# in another terminal, run on Android (needs emulator or connected device)
npx react-native run-android
```

If you'd like an easier setup I can migrate this project to Expo so you can preview it using the Expo Go app without installing native SDKs.

Next improvements I can implement for you
- Add a wardrobe input UI so the app persists a user's clothing items and biases suggestions.
- Add a "Get alternative" button in `OutfitScreen` to rotate alternatives returned by the engine.
- Add a README section that walks through the code file-by-file for total beginners.
- Integrate an LLM-backed endpoint (OpenAI) for richer suggestions (requires adding a server or serverless function to keep API keys secret).

Code walkthrough (quick)
- `App.js` — React Navigation setup (Stack navigator). Screens registered: `Home`, `Outfit`, `Favorites`, `Wardrobe`.
- `src/screens/HomeScreen.js` — Home UI lets users pick style, event, weather and navigate to Outfit. Added a "Manage Wardrobe" button.
- `src/screens/OutfitScreen.js` — Calls `getOutfitSuggestions(style, event, weather, wardrobe)` and shows the suggestion. Added the ability to cycle alternatives and view tips. Save to favorites saves the currently displayed suggestion.
- `src/screens/FavoritesScreen.js` — Reads saved favorites from AsyncStorage via `src/services/favoritesService.js` and lists them.
- `src/screens/WardrobeScreen.js` — Add/view/delete wardrobe items. Uses `src/services/wardrobeService.js` to persist items in AsyncStorage.
- `src/services/outfitService.js` — Heuristic outfit suggestion engine (style pools, weather/event adjustments, wardrobe bias). This is where you'd later swap in an LLM call.
- `src/services/favoritesService.js` — Simple favorites persistence.
- `src/services/wardrobeService.js` — Wardrobe persistence (add/get/remove/clear).

If you want a deeper, line-by-line walkthrough of any file I changed, tell me which file and I'll expand it with comments and explanations for beginners.

Tell me which next step you want and I'll implement it. If you want, I'll also walk you through installing Android emulators and running the mobile app step-by-step on your Windows machine.

---
Generated: October 25, 2025
