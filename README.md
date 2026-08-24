# Bet-ter — building-in-public site

A plain static site (no build step, no framework) that's the pre-launch home
for **bet-ter.me**. Right now it's the build-in-public journal for
RevenueCat Shipaton 2026 (`#Shipaton`). On launch day, `index.html` gets
replaced with the real product landing page — `journal.html` and
`story.html` stay as-is and just get linked from wherever makes sense in the
new design (a small "Our story" / "Building in public" link, per the
original plan).

## Structure

- `index.html` — current homepage: hero + latest 3 journal entries.
- `journal.html` — the full chronological journal.
- `story.html` — placeholder for the personal story behind the app. Edit
  the `<p class="lede">` (and surrounding markup) by hand when ready — this
  one is not touched by the automated journal entries.
- `entries.js` — the journal data. A plain `const JOURNAL_ENTRIES = [...]`
  array, newest entry first. See the schema comment at the top of the file.
- `styles.css` — shared design tokens (the same forest/gold/cream palette as
  the Bet-ter app itself) and component styles.
- `assets/favicon.svg` — the coin mark, matches the app's launcher icon.

## Local preview

Since it's plain static files with no bundler, just serve the folder with
anything static — for example:

```
npx serve .
```

or Python's built-in server:

```
python -m http.server 8000
```

(Opening `index.html` directly via `file://` also works fine — everything
is loaded via plain `<script src>` tags, not `fetch`, specifically so there's
no local-preview friction.)

## Hosting

Not connected yet. Any static host works with zero configuration since
there's no build step — Cloudflare Pages or Vercel are the easiest for a
custom domain (bet-ter.me) with auto-deploy on push to `main`:

1. Push this repo to GitHub.
2. Connect it in Cloudflare Pages / Vercel as a static site (no build
   command, output directory = repo root).
3. Point `bet-ter.me` at it (the host's dashboard gives you the DNS records
   to add).

Once connected, every commit to `main` (including the daily journal-entry
commits) deploys automatically.

## For the daily build-in-public agent

Append one new object to the **top** of the `JOURNAL_ENTRIES` array in
`entries.js`, matching the existing schema, then commit just that file.
Don't touch `index.html`, `journal.html`, `story.html`, or `styles.css` —
the pages already render whatever is in `entries.js` automatically.

Pace entries like realistic daily progress, not a raw commit log — the
actual engineering happens in bursts, but the journal should read like one
person's honest day-by-day account. Skip a day entirely (write nothing)
rather than inventing filler when there's nothing real to say.
