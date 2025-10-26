AI Outfit Planner — Web UI

This folder contains a simple static web UI for the AI Outfit Planner. Files:
- index.html — the single-page UI
- styles.css — styles
- outfitEngine.js — the outfit suggestion engine (exposes window.getOutfitSuggestions)
- app.js — UI logic (uses localStorage for wardrobe and favorites)
- assets/placeholder.svg — small placeholder image
- deploy-gh-pages.ps1 — PowerShell script to attempt deploying web/ content to gh-pages branch (requires authentication)

How to run locally
1. Open index.html in your browser OR
2. Serve via a static server (recommended):
   cd web
   npx http-server -c-1

Export/Import
- Wardrobe and favorites export to JSON. Use Import to load wardrobe.json or favorites.json files.

Deploy to GitHub Pages
- Edit `deploy-gh-pages.ps1` if necessary, then run it from project root in PowerShell:
  .\web\deploy-gh-pages.ps1
- This script will try to push to gh-pages branch; you still need proper authentication (PAT or SSH).
