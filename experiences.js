// Community experiences board -- reads/writes public.experience_posts,
// experience_comments, experience_reactions and experience_reports directly
// via Supabase's REST API (same no-backend pattern as waitlist.js).
//
// Moderation model: posts and comments go live immediately (no queue).
// Anyone can flag a post or comment with the report button; reports are
// insert-only for anon (can't be read back through the API) and are
// reviewed by hand in the Supabase dashboard, alongside the `hidden`
// column that hides a row from the public feed once reviewed.
const SUPABASE_URL = "https://fvgpnrymprmalvcoaagd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Z3BucnltcHJtYWx2Y29hYWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTQ5ODksImV4cCI6MjEwMzI5MDk4OX0.8po5LxHKNnrTVIhZWsqle9n0bBMJ4I2jkp_yArOAXJ0";

const REACTIONS = [
  { emoji: "🙌", label: "I relate" },
  { emoji: "❤️", label: "Sending love" },
  { emoji: "💪", label: "Stay strong" },
  { emoji: "🙏", label: "Respect" },
];

const PAGE_SIZE = 20;
let offset = 0;

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
  return response.status === 204 ? null : response.json();
}

function reactedKey(postId, emoji) {
  return `bt_reacted_${postId}_${emoji}`;
}

function reportedKey(kind, id) {
  return `bt_reported_${kind}_${id}`;
}

function authorLine(row) {
  return row.is_anonymous || !row.display_name ? "Anonymous" : escapeHtml(row.display_name);
}

function reactionButtonsHtml(postId, counts) {
  return REACTIONS.map(({ emoji, label }) => {
    const count = counts[emoji] || 0;
    const already = localStorage.getItem(reactedKey(postId, emoji));
    return `<button type="button" class="reaction-btn" data-post-id="${postId}" data-emoji="${emoji}"
        title="${label}" ${already ? "disabled" : ""}
        style="display:inline-flex; align-items:center; gap:5px; border:1px solid var(--border); background:${already ? "var(--blue-soft)" : "transparent"}; border-radius:999px; padding:5px 12px; font-size:0.85rem; cursor:${already ? "default" : "pointer"}; font-family:inherit; margin-right:6px;">
        <span>${emoji}</span><span>${count}</span>
      </button>`;
  }).join("");
}

function reportButtonHtml(kind, id) {
  const already = localStorage.getItem(reportedKey(kind, id));
  return `<button type="button" class="report-btn" data-kind="${kind}" data-id="${id}"
      ${already ? "disabled" : ""}
      style="border:none; background:none; color:var(--ink-soft); font-size:0.78rem; cursor:${already ? "default" : "pointer"}; font-family:inherit; text-decoration:underline;">
      ${already ? "Reported" : "Report"}
    </button>`;
}

function identityFieldsHtml(formClass) {
  return `
    <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-top:10px;">
      <label style="display:flex; align-items:center; gap:6px; font-size:0.85rem;">
        <input type="checkbox" name="is_anonymous" class="${formClass}-anon" checked />
        Post anonymously
      </label>
      <input type="text" name="display_name" class="${formClass}-name" placeholder="Your name" maxlength="60"
        style="display:none; padding:8px 12px; border-radius:999px; border:1px solid var(--border); font-family:inherit; font-size:0.85rem;" />
    </div>`;
}

function wireIdentityToggle(scope) {
  const checkbox = scope.querySelector('input[name="is_anonymous"]');
  const nameInput = scope.querySelector('input[name="display_name"]');
  if (!checkbox || !nameInput) return;
  checkbox.addEventListener("change", () => {
    nameInput.style.display = checkbox.checked ? "none" : "inline-block";
  });
}

function postCardHtml(post) {
  const counts = {};
  (post.experience_reactions || []).forEach((r) => (counts[r.emoji] = r.count));
  return `
    <article class="card experience-post" data-post-id="${post.id}">
      <div class="entry-date">${timeAgo(post.created_at)} · ${authorLine(post)}</div>
      <p style="white-space:pre-wrap;">${escapeHtml(post.body)}</p>
      <div style="display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-top:14px;">
        ${reactionButtonsHtml(post.id, counts)}
        <button type="button" class="toggle-comments-btn" data-post-id="${post.id}"
          style="border:none; background:none; color:var(--blue-deep); font-weight:600; font-size:0.85rem; cursor:pointer; font-family:inherit; margin-left:6px;">
          Comments
        </button>
        <span style="margin-left:auto;">${reportButtonHtml("post", post.id)}</span>
      </div>
      <div class="comments-section" data-post-id="${post.id}" style="display:none; margin-top:16px; border-top:1px solid var(--border); padding-top:14px;"></div>
    </article>`;
}

function commentHtml(comment) {
  return `
    <div class="comment" style="padding:10px 0; border-bottom:1px solid var(--border);">
      <div class="entry-date" style="margin-bottom:4px;">${timeAgo(comment.created_at)} · ${authorLine(comment)}</div>
      <p style="margin:0 0 4px; white-space:pre-wrap;">${escapeHtml(comment.body)}</p>
      ${reportButtonHtml("comment", comment.id)}
    </div>`;
}

function commentFormHtml(postId) {
  return `
    <form class="comment-form" data-post-id="${postId}" style="margin-top:10px;">
      <textarea name="body" required maxlength="2000" rows="2" placeholder="Reply..."
        style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--border); font-family:inherit; font-size:0.9rem; resize:vertical;"></textarea>
      ${identityFieldsHtml("comment")}
      <button type="submit" class="button primary" style="margin-top:8px; border:none; cursor:pointer; font-family:inherit; padding:8px 18px; font-size:0.85rem;">Reply</button>
    </form>`;
}

async function loadPosts(append) {
  const posts = await supaFetch(
    `experience_posts?select=*,experience_reactions(emoji,count)&hidden=eq.false&order=created_at.desc&limit=${PAGE_SIZE}&offset=${offset}`,
  );
  const list = document.getElementById("experiences-list");
  if (!append) list.innerHTML = "";
  if (posts.length === 0 && offset === 0) {
    list.innerHTML = '<p class="empty-state">No experiences shared yet -- be the first.</p>';
  } else {
    list.insertAdjacentHTML("beforeend", posts.map(postCardHtml).join(""));
  }
  offset += posts.length;
  document.getElementById("load-more-wrap").style.display = posts.length === PAGE_SIZE ? "block" : "none";
}

async function toggleComments(postId, section) {
  if (section.dataset.loaded === "true") {
    section.style.display = section.style.display === "none" ? "block" : "none";
    return;
  }
  section.innerHTML = '<p class="empty-state">Loading comments...</p>';
  section.style.display = "block";
  const comments = await supaFetch(
    `experience_comments?select=*&post_id=eq.${postId}&hidden=eq.false&order=created_at.asc`,
  );
  section.innerHTML = comments.map(commentHtml).join("") + commentFormHtml(postId);
  wireIdentityToggle(section.querySelector(".comment-form"));
  section.dataset.loaded = "true";
}

async function handleReact(button) {
  const postId = button.dataset.postId;
  const emoji = button.dataset.emoji;
  button.disabled = true;
  try {
    const newCount = await supaFetch("rpc/react_to_experience", {
      method: "POST",
      body: JSON.stringify({ p_post_id: Number(postId), p_emoji: emoji }),
    });
    localStorage.setItem(reactedKey(postId, emoji), "1");
    button.style.background = "var(--blue-soft)";
    button.querySelector("span:last-child").textContent = newCount;
  } catch (err) {
    button.disabled = false;
  }
}

async function handleReport(button) {
  const kind = button.dataset.kind;
  const id = button.dataset.id;
  button.disabled = true;
  button.textContent = "Reporting...";
  try {
    await supaFetch("experience_reports", {
      method: "POST",
      body: JSON.stringify({ target_type: kind, target_id: Number(id) }),
    });
    localStorage.setItem(reportedKey(kind, id), "1");
    button.textContent = "Reported";
  } catch (err) {
    button.disabled = false;
    button.textContent = "Report";
  }
}

async function handlePostSubmit(form) {
  const formData = new FormData(form);
  const isAnonymous = formData.get("is_anonymous") === "on";
  const body = formData.get("body").trim();
  if (!body) return;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await supaFetch("experience_posts", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        body,
        is_anonymous: isAnonymous,
        display_name: isAnonymous ? null : (formData.get("display_name") || "").trim() || null,
      }),
    });
    form.reset();
    form.querySelector('input[name="is_anonymous"]').checked = true;
    form.querySelector('input[name="display_name"]').style.display = "none";
    offset = 0;
    await loadPosts(false);
  } finally {
    button.disabled = false;
  }
}

async function handleCommentSubmit(form) {
  const postId = form.dataset.postId;
  const formData = new FormData(form);
  const isAnonymous = formData.get("is_anonymous") === "on";
  const body = formData.get("body").trim();
  if (!body) return;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await supaFetch("experience_comments", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        post_id: Number(postId),
        body,
        is_anonymous: isAnonymous,
        display_name: isAnonymous ? null : (formData.get("display_name") || "").trim() || null,
      }),
    });
    const section = document.querySelector(`.comments-section[data-post-id="${postId}"]`);
    section.dataset.loaded = "false";
    await toggleComments(postId, section);
  } finally {
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  wireIdentityToggle(document.getElementById("post-form"));

  document.getElementById("post-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handlePostSubmit(e.target);
  });

  document.getElementById("load-more").addEventListener("click", () => loadPosts(true));

  document.getElementById("experiences-list").addEventListener("click", (e) => {
    const reactBtn = e.target.closest(".reaction-btn");
    if (reactBtn && !reactBtn.disabled) return handleReact(reactBtn);

    const reportBtn = e.target.closest(".report-btn");
    if (reportBtn && !reportBtn.disabled) return handleReport(reportBtn);

    const toggleBtn = e.target.closest(".toggle-comments-btn");
    if (toggleBtn) {
      const section = document.querySelector(`.comments-section[data-post-id="${toggleBtn.dataset.postId}"]`);
      return toggleComments(toggleBtn.dataset.postId, section);
    }
  });

  document.getElementById("experiences-list").addEventListener("submit", (e) => {
    if (e.target.classList.contains("comment-form")) {
      e.preventDefault();
      handleCommentSubmit(e.target);
    }
  });

  loadPosts(false);
});
