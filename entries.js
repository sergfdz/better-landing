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
    date: "2026-09-01",
    title: "Seventeen empty screens, and a color palette that isn't red or blue",
    tags: ["engineering", "design"],
    body: [
      "Today was foundation work — the unglamorous kind that doesn't produce anything a screenshot can sell, but that everything else sits on top of. A Kotlin Multiplatform project from scratch: one shared module targeting Android and iOS, Compose Multiplatform for the UI, Koin wired in for dependency injection instead of reaching for something heavier.",
      "Before writing a single line of the actual behavioral logic, we got all ~17 MVP screens up as a real, navigable shell on Android — empty states, but a real nav graph you can click through end to end. It's a small discipline thing: build the skeleton the whole app has to hang off of first, so every feature after this lands in a place that already makes sense.",
      "The other decision today was the palette. Most apps in this space default to one of two moods: alarm-red (because \"gambling = danger\"), or generic corporate banking blue. We didn't want either — this app is supposed to feel calm, not clinical, so we picked a forest green with a warm gold accent and a cream background instead. Deliberately not a casino color, deliberately not a bank color. Small choice, but it sets the tone for everything that gets designed on top of it.",
    ],
  },
  {
    date: "2026-08-31",
    title: "Why we're building <span class=\"bet\">Bet</span><span class=\"ter\">ter</span>, and why we're building it in public",
    tags: ["product", "story"],
    body: [
      "<span class=\"bet\">Bet</span><span class=\"ter\">ter</span> started from a simple, stubborn idea: most tools built for people who gamble are built to shame them, diagnose them, or lock them out. We wanted something different — a free companion that helps you notice your own patterns and see what you're keeping, not just what you've lost. “You don't have to do this alone” is the whole pitch, really.",
      "We're entering this build for RevenueCat's Shipaton 2026, and part of that means building in public — sharing the real process, not a highlight reel, from here until launch. This page is where that will live: day by day, warts and all, until the app ships. At that point this becomes the real <span class=\"bet\">Bet</span><span class=\"ter\">ter</span> site, and this journal moves one click away for anyone who wants to see how it got made.",
      "The last few weeks have been the deep end: a shared Kotlin Multiplatform core (behavioral engine, risk scoring, intervention logic) running identically on Android and iOS, a mock bank with a realistic seeded transaction history, a gambling classifier that's honest about what it doesn't know instead of guessing, and real integrations with Supabase, OneSignal, and RevenueCat — not mocked, wired for real from day one. There's a demo mode now that can walk through five different scenarios end to end, computed live, not scripted.",
      "What's left is the less glamorous but equally important part: final testing, an iOS build (we don't have a Mac in the loop yet — that's an active, real constraint, not a footnote), and getting real credentials into the services that are currently running safely on placeholders. More on all of that as it happens.",
    ],
  },
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
