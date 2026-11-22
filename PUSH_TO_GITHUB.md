# Push Studio Anime Portfolio to GitHub

**Target repository:** https://github.com/Ir786106/Ir786106  
**Branch:** `main`  
**GitHub Pages (after enabling it):** https://ir786106.github.io/Ir786106/

## Method 1 — Run from extracted ZIP

1. Extract the ZIP archive in Windows.
2. Open PowerShell and enter the extracted `Ir786106-main` folder.
3. Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Deploy-Anime-Portfolio.ps1
```

The script checks required images and files, clones the current `main` branch into a **fresh timestamped folder**, copies the portfolio, runs the Node.js validator if Node is installed, commits changes, pushes without force, and checks whether GitHub's `main` commit matches the local commit. Unrelated existing files are not deleted. Files with the same paths are updated.

## Method 2 — Run directly from Downloads (no manual extraction)

Place `Push_Ir786106_Anime_From_Downloads.ps1` in your Windows Downloads folder with this ZIP, then run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -File "$HOME\Downloads\Push_Ir786106_Anime_From_Downloads.ps1"
```

If the ZIP isn't found automatically, choose it in the file picker. Do not run a script while a previous deployment is in progress. GitHub may request browser login. Never paste passwords or GitHub tokens into chat.

## Pages settings

In repository **Settings → Pages**, select **Deploy from a branch**, **main**, **/docs**, then Save.

## Verify

Check the repository commit and README: https://github.com/Ir786106/Ir786106

The site will appear only once GitHub Pages has successfully deployed the `/docs` directory.

## Included artwork

- `assets/profile/irfan-anime-original.png` — original anime artwork
- `assets/profile/irfan-anime-banner.png` — GitHub README banner
- `docs/assets/irfan-anime-portrait.webp` — website hero portrait

This archive preserves the website, styles, scripts, SVG project art and workflows from your uploaded ZIP. The website's animations run on the GitHub Pages site; the GitHub README cannot run regular website JavaScript.
