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
      "So the first thing <span class=\"bet\">Bet</span><span class=\"ter\">ter</span> had to solve wasn't detection in some clever technical sense — it was visibility. The Risk Score traces every point back to a plain-language reason, not a black box, and sits on its own \"Your activity\" screen next to a plain month-over-month spend comparison — not floored, not spun as a win, just what you actually spent on gambling this month against the same point last month. And when a transaction is ambiguous, the classifier says exactly that — unknown — instead of guessing wrong in either direction. A confident false negative is worse than an honest maybe.",
      "Visibility only matters if it leads somewhere you act on daily, not just read about. Home now opens on your protection status — one glance at what's actually switched on: self-exclusion, trusted-contact alerts, notifications, bank monitoring — and a daily check-in you do yourself, mood and note optional, that builds a \"days in control\" streak. Skip a day and the streak resets even if nothing risky happened, on purpose: the ask is a small active confirmation, not just staying out of trouble. And when it matters, there's still a one-tap way to loop in someone you trust, over email, using your phone's own share sheet instead of some inbox nobody checks.",
      "Underneath that status panel is everything it's actually reporting on. Self-exclusion — Protect Me — links out to the real, official registry where one exists (Spain's RGIAJ right now), never runs its own; everywhere else it says \"coming soon\" honestly instead of pretending, and shows the real National Council on Problem Gambling helpline for the US in the meantime. Trusted-contact alerts email one person you choose if new gambling activity shows up, gently, not as a surveillance report. Notifications carry the intervention engine's supportive nudges when a risk pattern shows up, never a shaming one. And bank monitoring, gambling detection, and risk alerts are always on the moment a bank is connected — nothing to configure, just something to disclose. Nothing here is medical advice or a diagnosis. It's an attempt at the opposite of what makes this addiction dangerous: something that stays visible, on your side, and never lets the pattern hide.",
    ],
  },
];

// Node-only export for generate-journal-pages.js -- `module` doesn't exist
// in the browser, where this file is loaded as a plain <script>.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { JOURNAL_ENTRIES };
}
