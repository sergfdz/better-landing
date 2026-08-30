// Building-in-public journal entries for Bet-ter.
//
// Schema for each entry (append new ones to the TOP of this array so the
// newest reads first without needing extra sort logic to get it right):
//   {
//     date: "YYYY-MM-DD",       // the day this entry is "about", not necessarily the commit date
//     slug: "some-slug",        // optional -- overrides `date` as the journal/*.html filename,
//                                // only needed when two entries share the same date (e.g. a
//                                // one-time intro post published the same day as diary day 1)
//     title: "Short, human title — not a changelog line",
//     tags: ["product" | "engineering" | "design" | "story"],
//     body: [
//       "One paragraph per array item. Write like a person narrating a day",
//       "of real work — what got built, why, what was hard, what's next.",
//     ],
//   }
//
// Pacing note: the actual engineering happened in bursts, not one neat
// commit per calendar day. Entries should still read as realistic, roughly
// daily progress — don't dump raw commit logs, and don't force an entry for
// a day where there's nothing honest to say.

const JOURNAL_ENTRIES = [
  {
    date: "2026-08-29",
    slug: "intro",
    title: "Gambling is the hidden addiction — here's what we built against it",
    tags: ["product", "story"],
    body: [
      "Gambling addiction doesn't leave marks. No needle marks, no smell on someone's breath, nothing a blood test picks up. They call it the hidden addiction for exactly that reason — someone can be falling apart financially and emotionally while looking completely fine from the outside. Research also puts it near the top of any addiction for suicide risk, well above drugs or alcohol in several studies. Both of those facts sat behind every decision in this app, not as an abstract stat, but as the reason it exists at all.",
      "So the core of <span class=\"bet\">Bet</span><span class=\"ter\">ter</span> isn't a rule that flags one transaction after the fact — it's a live connection to your own bank that reads every transaction as it lands, classifies it, and folds it into a running picture of how you actually behave, not a generic average. That pattern is what lets it get ahead of the moments that matter — a Friday-night spike, a payday cluster, a slow drift upward — instead of only reporting on one after it's already happened. The Risk Score behind that traces every point back to a plain-language reason, not a black box, weighed against your own month-over-month spend — not floored, not spun as a win, just what you actually spent on gambling this month against the same point last month. And when a transaction is ambiguous, the classifier says exactly that — unknown — instead of guessing wrong in either direction. A confident false negative is worse than an honest maybe.",
      "That shift — from reporting what already happened to acting on what's about to — is the whole point, and it shapes every protection <span class=\"bet\">Bet</span><span class=\"ter\">ter</span> will ship with. Self-exclusion is built to point you to whatever official self-exclusion registry or resource actually exists in your own country, growing country by country, rather than running its own database instead of the real thing — and it says \"coming soon\" honestly wherever that's not built yet, instead of pretending. Trusted-contact alerts loop in one person you choose, over email, the moment new gambling activity shows up — gently, not as a surveillance report. Notifications carry supportive nudges tuned to what's actually happening in your own account when a risk pattern shows up, never a generic shaming one. And bank monitoring, gambling detection, and risk alerts are always on the moment a bank is connected — reading every transaction against your own history, not some fixed threshold — nothing to configure, just something to disclose.",
      "Most tools in this space only step in once the damage is already visible — a maxed card, a missed payment, a crisis someone else notices first. Treating gambling proactively means watching the pattern before it turns into any of that, and being able to reach out — to you, or to someone you trust — while there's still a moment left to act on, instead of only after. Nothing here is medical advice or a diagnosis. It's an attempt at the opposite of what makes this addiction dangerous: something that stays visible, on your side, and never lets the pattern hide.",
    ],
  },
];

// Node-only export for generate-journal-pages.js -- `module` doesn't exist
// in the browser, where this file is loaded as a plain <script>.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { JOURNAL_ENTRIES };
}
