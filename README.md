# The Last Slice

A playful, standalone browser game about the most evasive slice of pizza in town. Try to click, tap, or drag the slice while hands, cheese, the pizza box, and the slice itself conspire against you.

## How to play

- Click, tap, or drag the last slice.
- Keyboard players can focus the slice and press <kbd>Enter</kbd> or <kbd>Space</kbd>.
- At 10 attempts, the slice escapes the box and becomes a fugitive.
- At 15 attempts, it returns and is finally yours.

The game includes generated Web Audio sound effects, a sound toggle, a reset control, responsive layouts, an accessible live status, and reduced-motion support.

## Run locally

No dependencies or build step are required. Open `index.html` directly, or serve the directory with any static server:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Verify

Run the dependency-free production check:

```sh
node scripts/verify.mjs
```

It checks JavaScript syntax, required project files, local asset paths, accessible control wiring, milestone logic, animation coverage, and CSS structure.

## Project files

```text
TheLastSlice/
├── scripts/
│   └── verify.mjs # Dependency-free production checks
├── index.html   # Semantic game markup and inline SVG artwork
├── style.css    # Responsive visual design and scene animations
├── script.js    # Game state, pointer input, gags, and generated audio
├── AGENTS.md     # Local repository guidance
├── README.md
└── .gitignore
```

## GitHub Pages

The project uses only relative asset paths and static files. Keep the repository private while preparing a release. When it is approved for public launch:

1. Run `node scripts/verify.mjs` from a clean checkout.
2. Change the GitHub repository visibility to public.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the default branch and the `/ (root)` folder, then save.

The intended public URL is `https://sudarshanchaudhari.github.io/TheLastSlice/`.

## Accessibility

- The slice is a native button with visible keyboard focus.
- Game updates are announced through an ARIA live region.
- Controls have accessible names and state.
- Color is not the only way progress or state is communicated.
- `prefers-reduced-motion` shortens scene transitions and removes looping confetti.

## Privacy and security

The game has no analytics, accounts, cookies, storage, network requests, or third-party runtime dependencies. Audio is synthesized locally with the Web Audio API.

## License

Copyright © 2026 SudarshanTechLabs. All rights reserved.
