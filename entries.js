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
    date: "2026-08-24",
    title: "Why we're building Bet-ter, and why we're building it in public",
    tags: ["product", "story"],
    body: [
      "Bet-ter started from a simple, stubborn idea: most tools built for people who gamble are built to shame them, diagnose them, or lock them out. We wanted something different — a free companion that helps you notice your own patterns and see what you're keeping, not just what you've lost. “You don't have to do this alone” is the whole pitch, really.",
      "We're entering this build for RevenueCat's Shipaton 2026, and part of that means building in public — sharing the real process, not a highlight reel, from here until launch. This page is where that will live: day by day, warts and all, until the app ships. At that point this becomes the real Bet-ter site, and this journal moves one click away for anyone who wants to see how it got made.",
      "The last few weeks have been the deep end: a shared Kotlin Multiplatform core (behavioral engine, risk scoring, intervention logic) running identically on Android and iOS, a mock bank with a realistic seeded transaction history, a gambling classifier that's honest about what it doesn't know instead of guessing, and real integrations with Supabase, OneSignal, and RevenueCat — not mocked, wired for real from day one. There's a demo mode now that can walk through five different scenarios end to end, computed live, not scripted.",
      "What's left is the less glamorous but equally important part: final testing, an iOS build (we don't have a Mac in the loop yet — that's an active, real constraint, not a footnote), and getting real credentials into the services that are currently running safely on placeholders. More on all of that as it happens.",
    ],
  },
];
