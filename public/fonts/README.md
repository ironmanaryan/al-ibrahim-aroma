# TT Drugs (licensed webfont)

The site is already wired for **TT Drugs**. To activate it, add these two files to this folder:

- `TTDrugs-Regular.woff2` — weight 400
- `TTDrugs-Bold.woff2` — weight 700

They are referenced from `src/app/globals.css` via `@font-face`. If the files are missing, the browser
falls back to Bricolage Grotesque (self-hosted in `src/app/fonts/`), so nothing breaks.

TT Drugs is a commercial font from TypeType. Buy a webfont licence from the foundry before deploying it
to a public site; do not copy the files from another project.

Recommended subsets: Latin, WOFF2. Keep the filenames exactly as above, or update the two `src:` URLs in
`globals.css`.
