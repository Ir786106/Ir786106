# GitHub profile + animated portfolio — setup guide

This repository contains **two independent deliverables**:

1. **GitHub profile README**: `README.md` plus custom animated SVGs in `assets/profile/`.
2. **Animated standalone portfolio**: `docs/index.html`, `docs/styles.css`, `docs/script.js`, and `docs/assets/`.

The repository was supplied as a GitHub profile repository (`Ir786106/Ir786106`), **not** a full website. The new portfolio in `docs/` is a standalone addition and can be published with GitHub Pages. The current portfolio at `Ir786106.github.io/Muhammad_Irfan_Waseem_Portfolio/` is a separate project; this package does not overwrite it or deploy itself.

## 1. Review locally

- Extract the ZIP.
- Open `docs/index.html` in Chrome, Firefox, or Edge to preview the portfolio. No build step or package installation is necessary.
- The animation, mobile navigation, project-category filters, and contact mail link work with local files. A network connection is used only to fetch optional Google fonts and open external links.
- GitHub's README preview cannot reproduce every browser animation exactly, but the animated SVG files have meaningful static fallback content.

## 2. Update the GitHub profile

- Copy the **contents** of this project into the public repository at `https://github.com/Ir786106/Ir786106`. Keep paths intact. The repository must have the same name as the GitHub account for the README to appear on the profile.
- Commit the changes to the default branch (`main`). The profile README should display automatically at `https://github.com/Ir786106`.
- Under **Actions**, run **Refresh GitHub profile** manually to update the contribution cards and blog entries. The existing workflow also runs daily.
- If the workflow cannot push, open **Settings → Actions → General → Workflow permissions** and allow read/write access to the `GITHUB_TOKEN` where repository rules and your organization policy permit it. Alternatively approve updates through your required branch-protection process.

## 3. Publish the new animated website

In the **Ir786106/Ir786106** repository:

1. Open **Settings → Pages**.
2. Choose **Deploy from a branch** (if that option is available).
3. Select the `main` branch and `/docs` folder, then **Save**.
4. When GitHub finishes publishing, expect the root address **`https://ir786106.github.io/`**, assuming normal username Pages behavior. Check the URL shown in the Pages settings rather than assuming the site is already live.
5. Open the page on desktop and mobile and test the navigation, filters, all external links, and email link.

This is separate from the existing portfolio repository at `Muhammad_Irfan_Waseem_Portfolio`. You can choose to keep the old website, redirect it, or migrate content only after reviewing both. Do not replace its files blindly.

## 4. Customize safely

| Purpose | File |
| --- | --- |
| Website name, biography, links, project descriptions | `docs/index.html` |
| Website colors, spacing, typography, animations | `docs/styles.css` (start with the `:root` tokens) |
| Typing headline, project filtering, mobile navigation | `docs/script.js` |
| Website project cover graphics | `docs/assets/*.svg` |
| GitHub profile intro and project cards | `README.md` |
| GitHub banner artwork | `assets/profile/hero.svg` |
| Profile statistics generator | `scripts/update-activity.mjs` |
| Blog RSS reader | `scripts/update-blog.ps1` |
| GitHub profile refresh schedule | `.github/workflows/refresh-profile.yml` |

The original anime-style banner is retained as `assets/profile/hero-anime-original.svg`; it is not used by default.

## 5. What is and is not included

**Included:** responsive dark website, original animated SVG artwork, mobile menu, project filters, typing headline, scroll reveals, marquee, scroll progress, reduced-motion support, semantic sections, email CTA, custom project illustrations, GitHub README, local stats assets, and existing refresh automation.

**Not included:** a backend, working contact-form submission, a verified live demo for each project, newly released Android APKs, deployment or GitHub commits. Project cover graphics are **conceptual illustrations**, not actual product screenshots. If you obtain real screenshots, replace the SVG illustrations with real images and update their alt text. The Food Fight **releases** link is for checking available downloads; no APK is claimed to be available.

## 6. Validation

Run from the repository root:

```powershell
node --check docs/script.js
node scripts/validate-site.mjs
```

The static validator checks local website images, page anchors, duplicate HTML IDs, accessibility basics, GitHub project links and whether the expected SVG assets exist. It does not prove that remote links still work or simulate a deployed GitHub Pages build. Visual interactions were additionally exercised using Chromium at desktop and mobile sizes.

## Optional release checklist

- [ ] Verify biography and contact addresses reflect what you want public.
- [ ] Confirm ownership, descriptions, and publication permissions for all featured projects.
- [ ] Replace concept graphics with real screenshots when available.
- [ ] Check if any Food Fight APK release exists before linking a direct download.
- [ ] Update GitHub bio, portfolio link, location, and pinned repositories.
- [ ] Publish through GitHub Pages and test the real URL.
