# Profile setup

## Install or copy

- Copy [README.md](README.md) and the [profile assets](assets/profile/) into the root of the public profile repository named exactly like the account.
- Copy [`.github/workflows/refresh-profile.yml`](.github/workflows/refresh-profile.yml), [`scripts/update-activity.mjs`](scripts/update-activity.mjs), and [`scripts/update-blog.ps1`](scripts/update-blog.ps1) to the same paths.
- In the repository, open **Actions → Refresh GitHub profile → Run workflow**. It uses GitHub's built-in workflow token and refreshes the public activity cards and the latest three VeilGuard posts daily. The token needs permission to write repository contents. If a branch rule prevents bot commits, allow the workflow to update the default branch through the repository's approved process.
- Check that the README appears on the [GitHub profile](https://github.com/Ir786106). Pin Food Fight, Mandi Pro ERP, TeamSync, and HireReady PK. Keep the profile photo, bio, location, and portfolio link current in GitHub profile settings.

## Customize

| Change | File or value |
| --- | --- |
| Name, location, education, work availability | Intro and **About me** in `README.md`; visible name and accessible title in `assets/profile/hero.svg`. |
| Portrait | The embedded anime illustration and its image placement in `assets/profile/hero.svg`. The illustration is based on the supplied portrait, and the header uses SVG animations for motion. |
| Focus areas | **What I build** in `README.md` and the labels in `assets/profile/focus.svg`. |
| Role text and typing timing | Three text elements, opacity timelines, and clip width in `assets/profile/typing.svg`. |
| Portfolio, journal, X, email, LinkedIn | Contact links in `README.md` and labels in `assets/profile/badge-*.svg`. |
| Project names, stacks, and repo links | Four cards in **Featured projects** in `README.md`. |
| Icon groups | `skillicons.dev/icons?i=…` and matching text labels in **Tech stack**. |
| Username | Profile and counter links in `README.md`; local fallback `PROFILE_USER` in `scripts/update-activity.mjs`. GitHub Actions uses the repository owner. |
| Activity and language colors | Theme objects in `scripts/update-activity.mjs`, plus the banner and footer SVG colors. |
| RSS source | Feed URL and allowed host in `scripts/update-blog.ps1`. Keep the `BLOG:START` and `BLOG:END` markers in the README. |
| Refresh time | UTC cron in `.github/workflows/refresh-profile.yml`. |

## Reference review

| Archive | Idea used | Reuse decision |
| --- | --- | --- |
| thenolle | Full-width SVG introduction and compact contact row. | Original artwork and links. No license file found in the archive. |
| Aysirr | Theme-aware artwork using `picture` and local generated statistics. | Reimplemented with GitHub data. No license file found in the archive. |
| HiradEmami | Grouped technologies and prominent projects. | Original labels and project selection. No license file found in the archive. |
| Sharann-del | Separate activity panel and consistent spacing. | Original activity graphic. No license file found in the archive. |
| Best GitHub Profile README | Scannable project layout and concise labels. | Archive has an MIT license. No files copied. |

No executable code or workflows from the reference archives were run. The selected ideas were checked through the new implementation.

## Image dependencies

The animated header, typing strip, footer, statistics, and contribution graph are served from this repository. The statistics show the public contribution calendar and primary languages across owned, non-archived public repositories. Streaks are measured within the displayed year.

Contact badges are stored in the repository. Skill Icons supplies the tool icons, and Komarev supplies the view counter. These public services can throttle or be temporarily unavailable. The links and text labels remain available. The counter tracks requests to its image and can be affected by caching. Shared stats-card services are outside the rendering path. GitHub can delay scheduled jobs, so the checked-in cards and links remain visible between refreshes.
