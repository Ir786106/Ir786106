# Ir786106 Creative Portfolio — Setup & Deployment

This package contains **two related deliverables** in one repository:

1. **GitHub profile README** — GitHub renders `README.md` when it lives in the `Ir786106/Ir786106` repository. Its illustrated header lives at `assets/profile/hero.svg`.
2. **Full interactive portfolio website** — GitHub Pages serves `docs/index.html` with `docs/styles.css`, `docs/script.js` and `docs/assets/*.svg`.

## Quick local preview (Windows)

Extract the ZIP and open `Ir786106-main/docs/index.html` in Chrome. The site is static HTML/CSS/JavaScript; **no npm install** or backend is necessary. Google Fonts are optional; the site has system-font fallbacks.

## Safe update of your GitHub repository (PowerShell)

The following assumes you already extracted the ZIP to `D:\Irfan_Project\Ir786106-main`. Adjust the first variable if your extracted folder has another location. These commands preserve the existing Git history and never force push.

```powershell
$source = "D:\Irfan_Project\Ir786106-main"
$destination = "D:\Irfan_Project\Ir786106-live"

if (!(Test-Path (Join-Path $source 'docs\index.html'))) {
    throw "Source website files not found. Verify your extracted folder."
}

# Clone GitHub profile repository (fresh folder)
if (Test-Path $destination) {
    throw "Destination exists; choose another folder rather than overwriting it."
}
git clone https://github.com/Ir786106/Ir786106.git $destination
if ($LASTEXITCODE -ne 0) { throw "Git clone failed." }

# Copy the updated contents but preserve .git history
robocopy $source $destination /E /R:2 /W:1 /XD .git
if ($LASTEXITCODE -gt 7) { throw "File copy failed." }

Set-Location $destination
git status
git add -A
git diff --cached --stat
# Review the file summary before continuing.
git commit -m "Redesign creative animated portfolio"
if ($LASTEXITCODE -ne 0) { throw "Commit failed or no changes exist." }
git push origin main
if ($LASTEXITCODE -ne 0) { throw "Push failed." }
```

**Note:** Files with identical paths, especially `README.md`, `docs/index.html`, `docs/styles.css`, and project illustrations, are deliberately updated. Unrelated files in the repository are left intact. If Git asks you to authenticate, sign in through your own browser; never share your personal access token in chat.

## Publish the website with GitHub Pages

1. Open <https://github.com/Ir786106/Ir786106/settings/pages>.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/docs**.
4. Click **Save**.
5. Once GitHub Pages builds, the expected site address is <https://ir786106.github.io/Ir786106/>.

GitHub profile URL: <https://github.com/Ir786106>.

## What's included

- Creative editorial layout, animated hero, grain texture, scroll reveals, subtle pointer movement and marquee.
- Four custom project artwork illustrations, all locally included as SVG files.
- Mobile navigation, category filtering, copy-email interaction, scroll progress, skip-to-content, and reduced-motion support.
- GitHub profile README with matching artwork, project highlights, public activity graphics, and the existing blog refresh markers.
- GitHub Actions profile refresh workflow and local site-validation script.

## Validation

From the extracted project directory, run:

```powershell
node .\scripts\validate-site.mjs
```

The project works without installing external npm packages. Graphics are **conceptual designs** — not screenshots of deployed applications. Repository links are clickable, but this archive does **not** deploy your app or generate Android APK builds.

## Customize it

- Site text and project names: `docs/index.html`
- Site typography, colors, responsive layout, animations: `docs/styles.css`
- Mobile menu, filters, copy email, movement: `docs/script.js`
- Graphic assets: `docs/assets/*.svg` and `assets/profile/*.svg`
- GitHub profile content: `README.md`

Do not change the repository's `.github/workflows/refresh-profile.yml` or blog marker comments unless you intend to update those automations too.
