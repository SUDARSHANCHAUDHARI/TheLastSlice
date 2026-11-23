# The Last Slice

**The Last Slice** is a playful, standalone browser game about the most evasive slice of pizza in town. Click, tap, or drag the final slice while cartoon hands, stretchy cheese, a suspicious pizza box, and the slice itself conspire to keep dinner out of reach.

> **Project status:** The production source is complete and verified. The repository remains private, and GitHub Pages has not been enabled yet.

## Table of Contents

- [Game overview](#game-overview)
- [Features](#features)
- [How to play](#how-to-play)
- [Technology](#technology)
- [Architecture notes](#architecture-notes)
- [Project structure](#project-structure)
- [Run locally](#run-locally)
- [Verification](#verification)
- [Privacy and security](#privacy-and-security)
- [GitHub Pages release](#github-pages-release)
- [Repository policy](#repository-policy)
- [License](#license)
- [About](#about)

## Game overview

The game takes place on a late-night pizzeria table with an open pizza box and one final slice. Every attempt triggers a randomly selected slapstick reaction, while two deterministic milestones move the story forward:

- **Attempt 10:** the slice escapes the box and becomes a visible fugitive.
- **Attempt 15:** the slice returns, becomes yours, and displays **“You earned the last slice.”**

The attempt counter, progress indicator, status messages, sound controls, and reset behavior remain synchronized throughout the game.

## Features

### Interactive game

- Click, tap, drag, or use the keyboard to reach for the slice.
- Tracks attempts and communicates progress toward the two milestones.
- Prevents repeated input while a scene animation is active.
- Cancels stale delayed actions safely when the game is reset.
- Returns keyboard focus to a useful control after modal or reset transitions.

### Ten randomized pizza escapes

1. Another hand grabs the slice.
2. The slice dodges away.
3. The pizza box slams closed.
4. Two hands fight over it.
5. Cheese stretches and pulls it back.
6. The slice hides under the box.
7. The slice disguises itself as a vegetable.
8. A tiny character carries it away.
9. The slice grows legs and runs.
10. Fake slices appear as decoys.

The same random gag is not selected twice in a row.

### Visual and audio design

- Original inline SVG pizza, hands, food props, and cheese artwork.
- Responsive pizzeria-table layout for desktop and mobile screens.
- Twenty-four CSS animation definitions for scene choreography and feedback.
- Generated sound effects built with the Web Audio API.
- Sound toggle with no downloaded audio files or third-party assets.
- Confetti celebration and replay flow after the final attempt.

### Accessibility

- The pizza slice is a native button with visible keyboard focus.
- <kbd>Enter</kbd> and <kbd>Space</kbd> work through native button behavior.
- Game updates are announced through an ARIA live region.
- Progress is available through an accessible progressbar.
- Controls expose accessible names, state, and descriptions.
- The celebration uses modal semantics and isolates background focus with `inert`.
- Color is not the only way progress or state is communicated.
- `prefers-reduced-motion` shortens transitions and removes looping confetti.

## How to play

1. Reach for the pizza slice by clicking, tapping, or dragging it.
2. Keyboard players can focus the slice and press <kbd>Enter</kbd> or <kbd>Space</kbd>.
3. Watch the attempt counter and status message after each escape.
4. Catch the fugitive slice after attempt 10.
5. Complete attempt 15 to earn the last slice.

Use **Sound on/off** to control generated effects and **Reset** to start a fresh game at any time. Pressing <kbd>Escape</kbd> closes the final celebration and resets the game.

## Technology

| Area | Implementation |
| --- | --- |
| Structure | Semantic HTML5 |
| Artwork | Inline SVG and CSS shapes |
| Styling | Modern CSS, cascade layers, custom properties, media queries, and keyframes |
| Game logic | Vanilla JavaScript with a small explicit state model |
| Input | Native click and keyboard behavior plus Pointer Events for dragging |
| Audio | Web Audio API oscillators generated at runtime |
| Verification | Dependency-free Node.js script using built-in modules |
| Hosting target | GitHub Pages |

There is no framework, package manager, build step, analytics SDK, runtime dependency, or external network request.

## Architecture notes

- `script.js` owns the authoritative game state: attempt count, busy state, earned state, fugitive state, sound preference, pointer state, and active timers.
- Each gag is described by an ID, message, duration, and sound. JavaScript selects the gag; CSS owns its visual choreography through a matching `scene-*` class.
- Attempt 10 and attempt 15 bypass random selection so the story milestones are guaranteed.
- A monotonically increasing sequence value invalidates delayed callbacks after reset, preventing stale scenes from changing the new game.
- All artwork is embedded in `index.html`, which avoids asset-path failures when served from the `/TheLastSlice/` GitHub Pages subdirectory.

## Project structure

```text
TheLastSlice/
├── scripts/
│   └── verify.mjs  # Dependency-free production checks
├── .gitignore      # Local, generated, secret, and signing exclusions
├── AGENTS.md       # Repository-specific development rules
├── README.md       # Project documentation
├── index.html      # Semantic game markup and inline SVG artwork
├── script.js       # Game state, interaction, scene selection, and generated audio
└── style.css       # Responsive design and scene animations
```

## Run locally

### Prerequisites

- A current version of Chrome, Firefox, Safari, or Edge.
- Node.js 18 or later is recommended for the production verification command.
- Python 3 is optional if you want to run the documented static server.

### Clone the private repository

Authenticate with GitHub, then run:

```sh
git clone https://github.com/SUDARSHANCHAUDHARI/TheLastSlice.git
cd TheLastSlice
```

### Start the game

The game has no installation or build step. Open `index.html` directly, or start a local static server:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Verification

Run the dependency-free production check from the repository root:

```sh
node scripts/verify.mjs
```

The verifier checks:

- Required production files.
- JavaScript syntax.
- Relative, GitHub Pages-safe runtime assets.
- HTML IDs and accessibility references.
- Explicit button types.
- All ten JavaScript/CSS gag pairings.
- Attempt 10 and attempt 15 milestone wiring.
- CSS block integrity and animation references.
- Reduced-motion support.

Before a public release, also manually test pointer, touch, keyboard, sound toggle, reset, responsive layout, and reduced-motion behavior in supported browsers.

## Privacy and security

The Last Slice:

- Collects no personal data.
- Uses no analytics, accounts, cookies, local storage, or session storage.
- Sends no network requests at runtime.
- Loads no third-party scripts, fonts, images, or audio.
- Synthesizes sound locally in the browser.
- Keeps environment files, local hosting state, keys, and signing material excluded through `.gitignore`.

## GitHub Pages release

The source uses relative asset paths and is ready to run below the repository Pages path. The intended public URL is:

`https://sudarshanchaudhari.github.io/TheLastSlice/`

The repository must remain private until public release is explicitly approved. At release time:

1. Confirm the working tree is clean.
2. Run `node scripts/verify.mjs` from a clean checkout.
3. Complete the manual browser interaction checklist.
4. Change the GitHub repository visibility to public.
5. Open **Settings → Pages**.
6. Choose **Deploy from a branch**.
7. Select `main` and `/ (root)`, then save.
8. Verify the published URL and canonical metadata.

To roll back a release, redeploy a previously verified commit from `main`; the project has no database, migration, backend, or user data requiring restoration.

## Repository policy

- Keep the repository private until Sudarshan explicitly approves public release.
- Preserve the attempt-10 escape and attempt-15 award behavior.
- Keep production asset references relative.
- Stage files by explicit path.
- Do not commit secrets, environment files, local configuration, or generated caches.
- Do not add or change GitHub Actions workflows without explicit approval.

## License

Copyright © 2026 SudarshanTechLabs.

Released under the MIT License — see [LICENSE](LICENSE) for the full text.

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
