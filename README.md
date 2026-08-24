# Bet-ter — building-in-public site

A plain static site (no build step, no framework) that's the pre-launch home
for **bet-ter.me**. Right now it's the build-in-public journal for
RevenueCat Shipaton 2026 (`#Shipaton`). On launch day, `index.html` gets
replaced with the real product landing page — `journal.html` and
`story.html` stay as-is and just get linked from wherever makes sense in the
new design (a small "Our story" / "Building in public" link, per the
original plan).

## Structure

- `index.html` — current homepage: hero + email signup + latest 3 journal
  entries.
- `journal.html` — the full chronological journal.
- `story.html` — placeholder for the personal story behind the app. Edit
  the `<p class="lede">` (and surrounding markup) by hand when ready — this
  one is not touched by the automated journal entries.
- `entries.js` — the journal data. A plain `const JOURNAL_ENTRIES = [...]`
  array, newest entry first. See the schema comment at the top of the file.
- `feed.xml` — RSS feed mirroring `entries.js`, one `<item>` per entry, kept
  in sync by hand alongside it.
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
custom domain (bet-ter.me) with auto-deploy on push to `master`:

1. Connect this repo in Cloudflare Pages / Vercel as a static site (no build
   command, output directory = repo root), **production branch = `master`**.
2. Point `bet-ter.me` at it (the host's dashboard gives you the DNS records
   to add).

Daily journal commits land on a **`drafts` branch**, not `master` — see
"Review workflow" below. Only what's on `master` ever goes live.

## Review workflow (important)

The daily agent never pushes straight to `master`. It commits new journal
entries to a `drafts` branch instead, so nothing publishes without a human
looking at it first — and it also can't collide with a personal `story.html`
edit sitting on `master` unmerged.

To publish a batch of entries: review the commits on `drafts` (GitHub's
compare view: `master...drafts`), then merge `drafts` into `master` when
you're happy. That merge is also the moment to tweak wording, fold in your
own voice, or hold an entry back a day.

## Email signup + RSS

The subscribe form on `index.html` and `journal.html` doubles as both a
"new journal entry" list and the app's launch waitlist — one list, two
purposes, explained in the form's own copy.

It's wired for [Buttondown](https://buttondown.com) (generous free tier,
popular in the build-in-public/indie-hacker world, can auto-email subscribers
from an RSS feed so no manual "send campaign" step is needed):

1. Create a free Buttondown account.
2. In their dashboard, point their RSS-to-email feature at this site's
   `feed.xml` (once hosted) so new entries email subscribers automatically.
3. Replace `YOUR_BUTTONDOWN_USERNAME` in the form `action` URL in both
   `index.html` and `journal.html` with your real Buttondown username.

`feed.xml` needs a new `<item>` each time `entries.js` gets a new entry —
whoever/whatever adds an entry should add the matching RSS item in the same
commit (see the daily-agent instructions below).

## For the daily build-in-public agent

1. Append one new object to the **top** of the `JOURNAL_ENTRIES` array in
   `entries.js`, matching the existing schema.
2. Add a matching `<item>` near the top of `feed.xml` (same title/date,
   `description` can be the entry's first paragraph).
3. Commit both files together on the **`drafts` branch** (never `master`)
   and push. Don't touch `index.html`, `journal.html`, `story.html`, or
   `styles.css` — the pages already render whatever is in `entries.js`
   automatically.

Pace entries like realistic daily progress, not a raw commit log — the
actual engineering happens in bursts, but the journal should read like one
person's honest day-by-day account. Skip a day entirely (write nothing)
rather than inventing filler when there's nothing real to say.
