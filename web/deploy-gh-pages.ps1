# Deploy the contents of the web/ folder to the gh-pages branch
# Usage: run this script from the project root in PowerShell.
# NOTE: You must have push access to the repository and authentication configured.

$repo = 'https://github.com/balavikas113/HTF25-Team-204.git'
$webdir = Join-Path $PSScriptRoot 'web'

if(-not (Test-Path $webdir)){
  Write-Error "web folder not found: $webdir"
  exit 1
}

Push-Location $webdir
if(-not (git rev-parse --is-inside-work-tree 2>$null)){
  git init
}

git checkout --orphan gh-pages
git --work-tree="$webdir" add --all
git --work-tree="$webdir" commit -m "Deploy web UI to gh-pages"
# Replace with token-based URL if needed
git push -f $repo gh-pages

# return to original branch
git checkout -
Pop-Location

Write-Output "Deployment attempt finished. If push failed, configure authentication (PAT or SSH) and run this script again."
