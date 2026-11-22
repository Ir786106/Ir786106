# Studio Portfolio V3 — Anime Portrait Update

This edition includes your supplied anime developer-studio portrait in both the **GitHub profile README banner** and the **portfolio website hero section**.

## Preview locally
Open `docs/index.html` in a browser. The portrait is stored locally at `docs/assets/irfan-anime-portrait.webp`.

## Publish using PowerShell on Windows
1. Extract the entire ZIP (do not run the script from inside ZIP preview).
2. Open PowerShell inside `Ir786106-main`.
3. Run: `powershell -NoProfile -ExecutionPolicy Bypass -File .\Deploy-V3.ps1`
4. The script clones `Ir786106/Ir786106`, copies the portfolio, commits and pushes to `main` (without force push).
5. Ensure GitHub repository **Settings → Pages → Deploy from a branch → main /docs** is selected.

## Files changed
- `assets/profile/irfan-anime-banner.png` — personalized raster GitHub profile banner
- `docs/assets/irfan-anime-portrait.webp` — compressed source portrait for the website
- `assets/profile/irfan-anime-original.png` — original supplied anime image
- `README.md` — displays new GitHub banner
- `docs/index.html` and `docs/styles.css` — responsive personal anime hero with subtle motion
- `Deploy-V3.ps1` — validates the new assets before deployment

GitHub README banners are static raster images; animations continue in the portfolio website. Existing projects, links and GitHub workflows are preserved.
