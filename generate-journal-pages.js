#!/usr/bin/env node
// Generates one standalone HTML page per journal entry, in journal/<date>.html.
//
// Why this exists: the site is a single index.html with all entries client-
// rendered from entries.js, so it only ever has one <title> and one set of
// Open Graph tags -- sharing any individual entry's link previews as the
// generic site card, not that entry's own title/excerpt. These per-entry
// pages exist purely to give each entry a real, stable, previewable URL.
//
// Run after editing entries.js: `node generate-journal-pages.js`
// No dependencies -- plain Node, no npm install needed.
const fs = require("fs");
const path = require("path");
const { JOURNAL_ENTRIES } = require("./entries.js");

const SITE_URL = "https://bet-ter.me";
const OUT_DIR = path.join(__dirname, "journal");

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, "");
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function excerpt(str, max = 155) {
  const plain = stripHtml(str).trim();
  return plain.length > max ? plain.slice(0, max - 1).trimEnd() + "…" : plain;
}

function entryPageHtml(entry) {
  const plainTitle = stripHtml(entry.title);
  const description = excerpt(entry.body[0]);
  const url = `${SITE_URL}/journal/${entry.slug || entry.date}.html`;
  const bodyHtml = entry.body.map((p) => `      <p>${p}</p>`).join("\n");
  const tagsHtml = entry.tags.map((t) => `<span class="tag">${t}</span>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${plainTitle} — B̶e̶t̶ter</title>
  <meta name="description" content="${escapeAttr(description)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="B̶e̶t̶ter — Building in public" />
  <meta property="og:title" content="${escapeAttr(plainTitle)}" />
  <meta property="og:description" content="${escapeAttr(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="article:published_time" content="${entry.date}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeAttr(plainTitle)}" />
  <meta name="twitter:description" content="${escapeAttr(description)}" />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <link rel="alternate" type="application/rss+xml" title="B̶e̶t̶ter — Building in public" href="../feed.xml" />
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <header class="site">
    <div class="wrap header-row">
      <a class="wordmark" href="../index.html">
        <img src="../assets/logo-better.png" alt="better" />
      </a>
      <nav class="site-nav">
        <a href="../index.html#journal">Journal</a>
        <a href="../experiences.html">Share your experience</a>
        <a href="../story.html">Our story</a>
      </nav>
    </div>
  </header>

  <main class="wrap">
    <p style="margin: 32px 0 0;">
      <a href="../index.html#journal" style="color: var(--blue-deep); text-decoration: none; font-size: 0.9rem;">&larr; All entries</a>
    </p>
    <article class="card entry" style="margin: 16px 0 40px;">
      <div class="entry-date">${entry.date}</div>
      <h3>${entry.title}</h3>
${bodyHtml}
      <div class="entry-tags">${tagsHtml}</div>
    </article>

    <section class="card" id="journal-comments-section" style="margin: 0 0 40px;">
      <h3 style="margin-top:0;">Comments</h3>
      <form id="journal-comment-form">
        <textarea name="body" required maxlength="2000" rows="3" placeholder="Add a comment..."
          style="width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); font-family:inherit; font-size:0.95rem; resize:vertical;"></textarea>
        <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"
          style="position:absolute; left:-9999px; top:-9999px;" />
        <div style="display:flex; align-items:center; gap:12px; margin-top:12px; flex-wrap:wrap;">
          <label style="display:flex; align-items:center; gap:6px; font-size:0.9rem;">
            <input type="checkbox" name="is_anonymous" checked />
            Post anonymously
          </label>
          <input type="text" name="display_name" placeholder="Your name" maxlength="60"
            style="display:none; padding:9px 14px; border-radius:999px; border:1px solid var(--border); font-family:inherit; font-size:0.9rem;" />
          <button type="submit" class="button primary" style="margin-left:auto; border:none; cursor:pointer; font-family:inherit;">Comment</button>
        </div>
      </form>
      <div id="journal-comments-list" data-entry-slug="${entry.slug || entry.date}" style="margin-top:20px;"></div>
    </section>
  </main>

  <footer class="site">
    <div class="wrap"><span class="bet">bet</span><span class="ter">ter</span> — a free financial accountability companion. Not a diagnosis, not medical advice.</div>
  </footer>

  <script src="../journal-comments.js"></script>
</body>
</html>
`;
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

for (const entry of JOURNAL_ENTRIES) {
  const slug = entry.slug || entry.date;
  const outPath = path.join(OUT_DIR, `${slug}.html`);
  fs.writeFileSync(outPath, entryPageHtml(entry), "utf8");
  console.log(`wrote journal/${slug}.html`);
}
