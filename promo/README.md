# Promo videos

Source for the four 9:16 Little Noor promo videos (1080×1920, 30 fps):

| # | File | Topic |
|---|---|---|
| 0 | `LittleNoor_1_Overview.mp4` | Overview |
| 1 | `LittleNoor_2_Adhkar-and-Stories.mp4` | Adhkar and stories |
| 2 | `LittleNoor_3_Games.mp4` | Games |
| 3 | `LittleNoor_4_Baby-Mode.mp4` | Baby mode |

Each video: logo intro → real app screens inside a phone with a caption and a
voice-over line → "جَرِّبْهُ مَجَّانًا الآن" with a QR code for https://mandm.mambz.com →
the "DEVELOPED BY MAMBZ" end card. No music (the audience is Muslim parents); the
only effect is a soft pop when the QR appears.

## Files

- `src/videos.cjs` — the script of every video: captions, voice-over lines (`vo`) and scene lengths. **Edit this to change a video.**
- `src/template.html` — the visual design and animation of every scene, including the MAMBZ end card.
- `src/render.cjs` — draws each frame with Playwright and builds the mp4 with ffmpeg; scenes stretch to fit their voice-over, and trailing breaths are trimmed from each line.
- `src/fetch-vo.cjs` — downloads each voice-over line once from the app's `/api/tts` (the ElevenLabs narrator voice) into `src/vo/`, named by a hash of the text.
- `src/capture.cjs`, `src/capture-baby.cjs` — take the app screenshots in `shots/` from a local preview.
- `src/sfx/pop.wav`, `src/qr.svg`, `src/logo-mark.svg`, `src/app-icon.png` — assets.

## Making or changing a video

Needs Node, ffmpeg and Playwright with Chromium (`npx playwright install chromium` if it isn't installed).

```bash
cd promo/src
npm install
# 1. Only if the app's screens changed: run the app (npm run build && npx vite preview --port 4173 in the repo root), then
npm run capture
# 2. After adding or changing any `vo` line (spends ElevenLabs credits, about one per character; existing lines are reused)
npm run vo
# 3. Render all videos, or one by index (0–3) into promo/out/
npm run render
node render.cjs 1
# Review single frames without rendering: node still.cjs <index> <seconds,...>  → promo/out/still-*.png
```

Write voice-over lines with full diacritics, especially imperatives (e.g. «جَرِّبْهُ», not «جرّبه»), or the narrator may read them wrong.

To change the link, edit `url` in `src/videos.cjs` and regenerate the QR:
`node -e 'require("qrcode").toString("https://NEW-LINK",{type:"svg",margin:1,color:{dark:"#1D4E4E",light:"#FFFFFF"}}).then(s=>require("fs").writeFileSync("qr.svg",s))'`
