// Waitlist signups are stored directly in Supabase via its REST API --
// no backend server needed, and no per-subscriber cost like a hosted
// email-list product would add. See README.md "Email signup + RSS" for
// the one-time Supabase project/table setup this expects.
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

document.querySelectorAll("form.waitlist-form").forEach((form) => {
  const button = form.querySelector("button");
  const input = form.querySelector('input[type="email"]');
  const defaultLabel = button.textContent;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    button.disabled = true;
    button.textContent = "Adding...";

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email: input.value.trim() }),
      });

      if (!response.ok && response.status !== 409) {
        throw new Error(`Unexpected response: ${response.status}`);
      }

      button.textContent = "You're on the list";
      input.value = "";
    } catch (err) {
      button.disabled = false;
      button.textContent = "Something went wrong -- try again";
    }
  });
});
