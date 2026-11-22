# Ir786106 — Studio Edition Portfolio V3

This ZIP includes **two projects in one GitHub profile repository**:

- **README.md**: GitHub profile at <https://github.com/Ir786106> with an animated purple/dark SVG banner, project cards and retained activity/blog integrations.
- **docs/index.html**: Full responsive interactive portfolio at <https://ir786106.github.io/Ir786106/> when GitHub Pages is enabled.

## What's new in V3

- Completely rebuilt cinematic hero: desktop browser, mobile app and animated connected interface artwork.
- Four custom CSS/HTML showcase graphics (no stock images or unverified client screenshots): Food Fight, Mandi Pro ERP, TeamSync and AI Interview Pro.
- Midnight / lavender / subtle mint palette, editorial oversized typography, high-contrast light About section, dark Skills section and high-visibility contact panel.
- Animation: reveal on scroll, floating interfaces, ambient cursor treatment on fine pointers, moving ribbon, hover and button responses.
- Accessibility: keyboard skip link, working mobile menu, functional Ctrl+K / Cmd+K navigation palette, reduced-motion preferences, meaningful link descriptions.
- No build step, no npm packages and no paid hosting necessary.

## Local preview

Extract ZIP. Open `Ir786106-main/docs/index.html` using Chrome or Edge. JavaScript and CSS are local. Google Fonts are optional; offline fallback fonts work.

## Recommended: publish with the included script

1. Extract the ZIP to any local folder.
2. Open PowerShell in the **Ir786106-main** folder.
3. Run `& .\Deploy-V3.ps1` or inspect/copy its commands manually.
4. The script clones the existing `main` branch into a new timestamped folder; it does not force-push or replace Git history. It copies updated project files and creates a commit only when differences exist.
5. Sign in through the official GitHub authentication browser window, if Git asks.

**No direct GitHub push was performed when this ZIP was created.** The repo changes only when you run the script and its final push succeeds. Do not share GitHub tokens in chat.

## GitHub Pages settings

Go to <https://github.com/Ir786106/Ir786106/settings/pages> → **Build and deployment** → **Deploy from a branch** → branch **main**, folder **/docs** → Save.

The expected public site URL after GitHub completes its build is <https://ir786106.github.io/Ir786106/>.

## Verify locally

Node.js 18+ recommended. From the extracted project root, run:

```powershell
node --check .\docs\script.js
node .\scripts\validate-site.mjs
```

You can edit:

| File | Purpose |
| --- | --- |
| `docs/index.html` | Website content, project descriptions, references and links |
| `docs/styles.css` | Visual design, animations, layout and breakpoints |
| `docs/script.js` | Menu, keyboard palette, copy email, scroll animation |
| `README.md` | GitHub profile presentation |
| `assets/profile/hero.svg` | Animated GitHub README banner |
| `assets/profile/*-cover.svg` | README featured project artwork |
| `Deploy-V3.ps1` | Local Windows GitHub push helper |

Artwork is *illustrative portfolio art* and should not be represented as an application screenshot. Verify individual GitHub repositories before claiming an app is released, tested or in production. Retained workflows may update activity/blog sections separately.
