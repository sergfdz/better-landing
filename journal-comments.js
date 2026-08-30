// Comments on individual journal entry pages (journal/<slug>.html) -- reads/
// writes public.journal_comments and journal_comment_reports directly via
// Supabase's REST API. Same no-backend, no-queue pattern as experiences.js:
// comments go live immediately, anyone can report one, and a report just
// flips `hidden` on the row by hand in the Supabase dashboard.
const SUPABASE_URL = "https://fvgpnrymprmalvcoaagd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Z3BucnltcHJtYWx2Y29hYWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTQ5ODksImV4cCI6MjEwMzI5MDk4OX0.8po5LxHKNnrTVIhZWsqle9n0bBMJ4I2jkp_yArOAXJ0";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function timeAgo(isoDate) {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value === 1 ? "" : "s"} ago`;
  }
  return "just now";
}

async function supaFetch(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function reportedKey(commentId) {
  return `bt_reported_journal_comment_${commentId}`;
}

function authorLine(row) {
  return row.is_anonymous || !row.display_name ? "Anonymous" : escapeHtml(row.display_name);
}

function reportButtonHtml(commentId) {
  const already = localStorage.getItem(reportedKey(commentId));
  return `<button type="button" class="report-btn" data-id="${commentId}"
      ${already ? "disabled" : ""}
      style="border:none; background:none; color:var(--ink-soft); font-size:0.78rem; cursor:${already ? "default" : "pointer"}; font-family:inherit; text-decoration:underline;">
      ${already ? "Reported" : "Report"}
    </button>`;
}

function commentHtml(comment) {
  return `
    <div class="comment" style="padding:12px 0; border-bottom:1px solid var(--border);">
      <div class="entry-date" style="margin-bottom:4px;">${timeAgo(comment.created_at)} · ${authorLine(comment)}</div>
      <p style="margin:0 0 4px; white-space:pre-wrap;">${escapeHtml(comment.body)}</p>
      ${reportButtonHtml(comment.id)}
    </div>`;
}

function wireIdentityToggle(form) {
  const checkbox = form.querySelector('input[name="is_anonymous"]');
  const nameInput = form.querySelector('input[name="display_name"]');
  if (!checkbox || !nameInput) return;
  checkbox.addEventListener("change", () => {
    nameInput.style.display = checkbox.checked ? "none" : "inline-block";
  });
}

async function loadComments(slug, list) {
  list.innerHTML = '<p class="empty-state">Loading comments...</p>';
  const comments = await supaFetch(
    `journal_comments?select=*&entry_slug=eq.${encodeURIComponent(slug)}&hidden=eq.false&order=created_at.asc`,
  );
  list.innerHTML = comments.length
    ? comments.map(commentHtml).join("")
    : '<p class="empty-state">No comments yet -- be the first.</p>';
}

async function handleReport(button) {
  const id = button.dataset.id;
  button.disabled = true;
  button.textContent = "Reporting...";
  try {
    await supaFetch("journal_comment_reports", {
      method: "POST",
      body: JSON.stringify({ comment_id: Number(id) }),
    });
    localStorage.setItem(reportedKey(id), "1");
    button.textContent = "Reported";
  } catch (err) {
    button.disabled = false;
    button.textContent = "Report";
  }
}

async function handleCommentSubmit(form, slug, list) {
  const formData = new FormData(form);
  const isAnonymous = formData.get("is_anonymous") === "on";
  const body = formData.get("body").trim();
  if (!body) return;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await supaFetch("journal_comments", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        entry_slug: slug,
        body,
        is_anonymous: isAnonymous,
        display_name: isAnonymous ? null : (formData.get("display_name") || "").trim() || null,
      }),
    });
    form.reset();
    form.querySelector('input[name="is_anonymous"]').checked = true;
    form.querySelector('input[name="display_name"]').style.display = "none";
    await loadComments(slug, list);
  } finally {
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("journal-comments-list");
  const form = document.getElementById("journal-comment-form");
  if (!list || !form) return;
  const slug = list.dataset.entrySlug;

  wireIdentityToggle(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleCommentSubmit(form, slug, list);
  });

  list.addEventListener("click", (e) => {
    const reportBtn = e.target.closest(".report-btn");
    if (reportBtn && !reportBtn.disabled) handleReport(reportBtn);
  });

  loadComments(slug, list);
});
