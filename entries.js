// Building-in-public journal entries for Bet-ter.
//
// Schema for each entry (append new ones to the TOP of this array so the
// newest reads first without needing extra sort logic to get it right):
//   {
//     date: "YYYY-MM-DD",       // the day this entry is "about", not necessarily the commit date
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
    date: "2026-08-30",
    title: "Gambling is the hidden addiction — here's what we built against it",
    tags: ["product", "story"],
    body: [
      "Gambling addiction doesn't leave marks. No needle marks, no smell on someone's breath, nothing a blood test picks up. Clinicians call it the hidden addiction for exactly that reason — someone can be falling apart financially and emotionally while looking completely fine from the outside. Research also puts it near the top of any addiction for suicide risk, well above drugs or alcohol in several studies. Both of those facts sat behind every decision in this app, not as an abstract stat, but as the reason it exists at all.",
      "So the first thing <span class=\"bet\">Bet</span><span class=\"ter\">ter</span> had to solve wasn't detection in some clever technical sense — it was visibility. The 0-100 Risk Score traces every point back to a plain-language reason, not a black box: this many transactions to known gambling operators, clustered on these evenings, against this pattern. If the app can't explain a number, it doesn't show it. And when a transaction is ambiguous, the classifier says exactly that — unknown — instead of guessing wrong in either direction. A confident false negative is worse than an honest maybe.",
      "Visibility only matters if it leads somewhere. The behavioral engine looks for the kind of pattern a person living it is often the last to notice — a recurring Friday-night window, a streak, a spending trend — and the intervention engine decides when a supportive nudge is warranted, never a shaming one. The central number on the home screen isn't money lost, it's money kept: a real number, calculated against your own baseline, floored so it's never negative. And when it matters, there's a one-tap way to loop in someone you trust, using your phone's own share sheet instead of some new inbox nobody checks.",
      "For the moments that need more than a nudge, there's Protect Me — a real link to self-exclusion, not a gesture at one. In Spain that means the actual official registry (RGIAJ), and the app is honest that it never verifies anything itself; there's no fake \"verified\" badge, just a plain record that you said you did it. Everywhere the app doesn't have a real integration yet, it says so instead of pretending — including a full US state list that points to the real National Council on Problem Gambling helpline rather than pretending to cover all fifty states. Nothing here is medical advice or a diagnosis. It's an attempt at the opposite of what makes this addiction dangerous: something that stays visible, on your side, and never lets the pattern hide.",
    ],
  },
];
