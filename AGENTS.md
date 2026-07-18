# The Last Slice — Repository Instructions

## Project shape

- This is a dependency-free static site for GitHub Pages.
- Production source lives in `index.html`, `style.css`, and `script.js`.
- Keep asset references relative so the site works below the `/TheLastSlice/` Pages path.
- Do not add a framework, package manager, build step, analytics, storage, or network dependency unless the product requirements genuinely need one.

## Verification

- Run `node scripts/verify.mjs` after code changes.
- Manually check pointer, touch, keyboard, responsive, sound-toggle, reset, and reduced-motion behavior before a public release.
- Preserve the attempt-10 escape and attempt-15 award milestones.
- Maintain semantic controls, visible focus, live status announcements, and modal focus isolation.

## Repository policy

- Use `SUDARSHANCHAUDHARI <sunny.sudarshan@gmail.com>` for Git commits.
- Keep the GitHub repository private until Sudarshan explicitly approves public release.
- Stage files by explicit path; never use blind `git add .`.
- Never commit secrets, environment files, local hosting state, signing material, or generated caches.
- Do not add or change GitHub Actions workflows without Sudarshan's explicit approval.
