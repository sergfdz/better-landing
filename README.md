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
- `experiences.html` / `experiences.js` — the community experiences board
  (see "Experiences board" below). Unlike the journal, this content is
  live user data in Supabase, not a file in this repo.
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

It's wired directly to a Supabase table via `waitlist.js` (no backend
server, no per-subscriber fee) instead of a hosted email-list product:

1. Create a free Supabase project. This can be the same project the app
   itself eventually uses for remote sync (`SupabaseConfig.kt` in the app
   repo) -- one project, two tables.
2. In the SQL editor, create the table and lock it down to insert-only for
   anonymous visitors:
   ```sql
   create table waitlist_signups (
     id bigint generated always as identity primary key,
     email text not null unique,
     created_at timestamptz not null default now()
   );

   alter table waitlist_signups enable row level security;

   create policy "anon can insert" on waitlist_signups
     for insert to anon
     with check (true);
   ```
   No select/update/delete policy is created, so the anon key can add rows
   but never read, edit, or export them back out through the API.
3. In `waitlist.js`, replace `SUPABASE_URL` and `SUPABASE_ANON_KEY` with the
   project's real values (Project Settings -> API).

This intentionally does not auto-email anyone the way Buttondown's
RSS-to-email feature would -- it only collects addresses. Until that's
worth building, export the table and send updates by hand (or BCC) when
there's something worth telling people. RSS (`feed.xml`) remains the
zero-setup way for anyone who wants to follow along without handing over
an email at all.

`feed.xml` needs a new `<item>` each time `entries.js` gets a new entry —
whoever/whatever adds an entry should add the matching RSS item in the same
commit (see the daily-agent instructions below).

## Experiences board

`experiences.html` is a small public board where visitors post their own
gambling-recovery experiences (named or anonymous), react with one of four
emoji, and reply in comments. It reads/writes directly against the same
Supabase project as the waitlist, via four tables added in the
`add_experiences_board` migration: `experience_posts`,
`experience_comments`, `experience_reactions`, `experience_reports`. No
separate setup beyond what the waitlist table already needs — same
`SUPABASE_URL` / `SUPABASE_ANON_KEY` pair, hardcoded in `experiences.js`.

**Moderation model: publish-then-report, not pre-approval.** Posts and
comments go live the instant they're submitted — there's no review queue.
Anyone can click "Report" on a post or comment (writes to
`experience_reports`, insert-only for anonymous visitors — reports can't be
read back through the public API, only from the Supabase dashboard). To act
on a report: find the row in the Supabase table editor and flip its
`hidden` column to `true` — the public `select` policies on
`experience_posts`/`experience_comments` filter out `hidden = true` rows,
so it disappears from the site immediately without deleting the record.
Check `experience_reports` periodically by hand; there's no dashboard or
notification for new reports yet.

Reactions (🙌 ❤️ 💪 🙏) can't be written to directly — anon has no
insert/update grant on `experience_reactions`. The only way to move a
count is the `react_to_experience(post_id, emoji)` Postgres function
(`security definer`, callable via `/rest/v1/rpc/react_to_experience`),
which validates the emoji and that the post isn't hidden before
incrementing. This is also why the Supabase security advisor flags that
function as "public can execute a security-definer function" — that's the
intended design, not a gap.

Client-side, `localStorage` remembers which post/emoji pairs and which
reports a given browser has already sent, purely to grey out buttons after
use — it's a soft nicety, not a security control (there's no auth, so a
determined visitor could still spam via a fresh browser/incognito window;
not worth solving before there's real traffic to justify it).

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
