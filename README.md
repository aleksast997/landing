# Landing

A single-page pricing landing page built with vanilla JavaScript and plain CSS on Vite.
No UI framework, no CSS preprocessor. The production build is one self-contained
`index.html` file with all CSS, JS and images inlined.

## Stack

| | |
|---|---|
| Build | [Vite 8](https://vite.dev) |
| Bundling | `vite-plugin-singlefile` — inlines everything into one HTML file |
| Styles | Plain CSS with native nesting and custom properties |
| Scripts | ES modules, no dependencies |
| Fonts | Google Fonts (Roboto, Open Sans, Bebas Neue) |
| Linting | Stylelint (`stylelint-config-standard`), ESLint, Prettier |

There are **no runtime dependencies** — `package.json` lists devDependencies only.

## Getting started

```bash
npm install
npm run dev        # dev server with HMR
npm run build      # production build -> dist/index.html
npm run preview    # serve the built output
```

Linting is not wired to an npm script yet; run it directly:

```bash
npx stylelint "src/**/*.css"
```

## Project structure

```
index.html              markup + the pricing-card <template>
vite.config.js          single-file build config
src/
  main.js               entry: fetches plan data, renders cards
  js/
    download-hint.js    browser detection + pointer show/hide
  css/
    main.css            @imports + page layout (main, .layout, .pricing-grid)
    base.css            design tokens (:root) + minimal reset
    layout.css          shared header/footer bar, then each bar's specifics
    components.css      pricing card, download button, download hint
  assets/               inlined SVGs
public/
  favicon.svg
```

CSS is imported through `src/css/main.css` in a fixed order — `base` → `layout` →
`components` — and several rules rely on that order rather than on specificity.
Keep it when adding files.

## How it works

**Pricing cards.** `main.js` fetches plan data on `DOMContentLoaded` from

```
https://veryfast.io/t/front_test_api.php
```

and clones `#pricing-card-template` once per element in `result.elements`. Two
fields drive conditional presentation: `is_best` shows the "Best Value" tag, and
`price_key === '50%'` shows the discount badge. A fetch failure replaces the grid
with an inline error message.

**Download hint.** After a download starts, a pointer image appears in the top-right
corner nudging the user toward the browser's download button.

The browser's download UI lives in browser chrome, outside the document — no web
API reports its position, so the pointer cannot track it. Instead `download-hint.js`
detects the browser (preferring `navigator.userAgentData`, falling back to UA
parsing) and sets `data-browser` on `<html>`; CSS then anchors the pointer to the
viewport's top-right with a per-browser offset:

```css
:root[data-browser='edge'] .pointer { --hint-right: 168px; }
```

Anchoring to `right` rather than a percentage keeps the distance from the window
edge constant as the window resizes. The pointer hides on the next user
interaction (`pointerdown`, `keydown`, `wheel`, `touchstart`, `scroll`) and its
bobbing animation respects `prefers-reduced-motion`.

## Layout notes

- `<main>` is a `100dvh` flex column; `.layout` takes `flex: 1` so the page fits the
  viewport without hardcoding the header (49px) and footer (70px) heights.
- The pricing grid is 3-up above 1100px, 2-up below, 1-up below 780px.
- Header and footer share their styling via `:is(.site-header, .site-footer)` in
  `layout.css`; only height and the header's sticky positioning differ.
