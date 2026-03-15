# KiteSQL Website

A small Vite site for KiteSQL that works as both:

- a lightweight landing page for the project
- an in-browser playground powered by the published WebAssembly build

The site lives next to the main repository so it can be deployed independently to GitHub Pages, Cloudflare Pages, Netlify, or any other static host.

## What it includes

- Product-style landing page for KiteSQL
- Rust-native API / ORM / migration positioning
- Interactive SQL playground backed by `WasmDatabase`
- Zero-backend demo that runs fully in the browser

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

Preview the production bundle:

```bash
npm run preview
```

## WebAssembly source

The site currently uses the published npm package for KiteSQL wasm assets through `@kipdata/kite_sql`.
That keeps the website simple to deploy because no local Rust build is required.

After publishing a newer npm package, bump the dependency version here if you want the website to track the latest release.
