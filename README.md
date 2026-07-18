# The Last Slice

**The Last Slice** is a playful, standalone browser game about the most evasive slice of pizza in town. Click, tap, or drag the final slice while cartoon hands, stretchy cheese, a suspicious pizza box, and the slice itself conspire to keep dinner out of reach.

> **Project status:** The production source is complete and verified. The repository remains private, and GitHub Pages has not been enabled yet.

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

## Author

**Sudarshan Chaudhari**<br>
Solo indie developer and founder of **SudarshanTechLabs**<br>
Bangkok, Thailand

- GitHub: [SUDARSHANCHAUDHARI](https://github.com/SUDARSHANCHAUDHARI)
- Developer email: [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
- Business and studio email: [sudarshantechlabs@gmail.com](mailto:sudarshantechlabs@gmail.com)

## License

Copyright © 2026 SudarshanTechLabs. All rights reserved.
