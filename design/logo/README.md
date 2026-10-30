# Logo & icon — نور الصغار / Little Noor

Chosen from `design/icon-concepts/` (concept B, the lantern). Hand-authored SVG;
Recraft was not connected in the session that made it.

- `icon.svg` — app icon source (full-bleed teal, lantern inside the maskable safe zone).
  Copied to `public/icons/icon.svg`; the PNGs in `public/icons/` (512, 192, 180 apple-touch, 32 favicon) are rendered from it.
- `logo-mark.svg` — the lantern alone on a transparent background (used in the home screen header via `src/assets/logo-mark.svg`).
- `logo-light.png` / `logo-dark.png` — mark + wordmark (Lalezar for Arabic, Tajawal for English).
- `preview.png` — home screen, icon at home-screen sizes on light/dark, and both logos.

Palette: teal #2F7C7C → #1D4E4E, gold #F4C978 / #E8A33D, brick #B5573A, cream #FBF6EC.
To change the icon: edit `icon.svg`, then re-render the PNGs at the same sizes.
