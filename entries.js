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
      "Gambling addiction doesn't leave marks. No needle marks, no smell on someone's breath, nothing a blood test picks up. That's why they call it the hidden addiction — someone can be quietly falling apart, financially and emotionally, while looking completely fine to everyone around them. It's also near the top of the list for suicide risk among addictions, worse than alcohol or drugs in more than one study I read while we were scoping this out. I keep coming back to both of those facts, not as stats to quote in a pitch, but as the actual reason any of this is worth building.",
      "The first real decision we made wasn't some clever detection algorithm. It was to connect <span class=\"bet\">bet</span><span class=\"ter\">ter</span> straight to the person's actual bank, read every transaction as it comes in, and build up a real picture of how they spend, not compare them to some generic average. That's what lets us catch a pattern before it turns into a bad week: a Friday night that always spikes, money going out right after payday, a slow creep upward over a month. The Risk Score comes out of that, and every point on it has to trace back to a plain-language reason, no black box. It sits next to a simple comparison — what you spent on gambling this month vs. the same point last month, not softened, not spun as a win either way. And if a transaction is genuinely ambiguous, the classifier just says unknown instead of guessing. I'd rather it admit it doesn't know than confidently get it wrong.",
      "That's really the shift we're going for: from telling you what already happened to catching it while it's still happening. Self-exclusion is one piece of that — point people to whatever real, official registry exists in their country, and be honest with a \"coming soon\" everywhere it doesn't exist yet, instead of faking something ourselves. Trusted-contact alerts are another — pick one person, and if new gambling activity shows up, they get an email. Not a surveillance report, just a heads up. Notifications lean supportive when a risk pattern shows up, not preachy. And bank monitoring is just always on the moment you connect an account, nothing to toggle, nothing to configure. You just know it's there.",
      "Most apps in this space only show up after the damage is obvious — a maxed-out card, a bounced payment, somebody else noticing first. We're trying to get ahead of that instead, even if \"ahead of it\" just means a nudge a day earlier than it would've otherwise come. None of this is medical advice, and it's not a diagnosis. It's just an attempt to do the opposite of what makes this addiction so dangerous in the first place: keep it visible, instead of letting it hide.",
    ],
  },
  {
    date: "2026-09-02",
    title: "One shared core, two phones: the first decision, and why it wasn't purely technical",
    tags: ["engineering", "product"],
    body: [
      "Right now, before any of this has a shared module or even a name that's stuck, it's still a simple idea: watch someone's real bank activity for gambling, and tell them the truth about it instead of leaving that to memory or denial. Not a blocker, not a lecture. Just something that reads what your bank already knows and finally says it out loud. Everything today is in service of that one idea — this is the day it actually starts getting built.",
      "The first real decision today has nothing to do with gambling detection. It's picking Kotlin Multiplatform before writing a single screen. One shared module is going to hold the behavioral engine, the risk scoring, the classifier — all of it — compiled natively for Android and iOS instead of written twice. Compose Multiplatform handles the UI on both, Koin wires up dependency injection. I'm one person building this in a few weeks, so writing the real logic once and never touching it again per platform isn't a nice-to-have, it's the only way the timeline works at all.",
      "<svg class='arch-diagram' viewBox='0 0 600 340' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Architecture diagram: bank transaction data flows into a shared Kotlin Multiplatform core (classifier, risk scoring, behavioral engine, wired with Koin), which is consumed separately by the Android app built with Jetpack Compose and the iOS app built with Compose Multiplatform.'>" +
      "<defs><marker id='archArrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' class='arch-arrowhead'></path></marker></defs>" +
      "<line x1='300' y1='72' x2='300' y2='106' class='arch-arrow' marker-end='url(#archArrow)'></line>" +
      "<line x1='300' y1='220' x2='300' y2='240' class='arch-arrow'></line>" +
      "<line x1='300' y1='240' x2='172' y2='266' class='arch-arrow' marker-end='url(#archArrow)'></line>" +
      "<line x1='300' y1='240' x2='428' y2='266' class='arch-arrow' marker-end='url(#archArrow)'></line>" +
      "<rect x='200' y='16' width='200' height='56' rx='10' class='arch-box'></rect>" +
      "<text x='300' y='40' text-anchor='middle' class='arch-label'>Your bank</text>" +
      "<text x='300' y='58' text-anchor='middle' class='arch-sublabel'>transactions, via Plaid</text>" +
      "<rect x='60' y='110' width='480' height='110' rx='10' class='arch-box'></rect>" +
      "<text x='300' y='132' text-anchor='middle' class='arch-label'>Shared module — commonMain</text>" +
      "<rect x='75' y='148' width='140' height='44' rx='8' class='arch-box-accent'></rect>" +
      "<text x='145' y='175' text-anchor='middle' class='arch-sublabel'>Classifier</text>" +
      "<rect x='230' y='148' width='140' height='44' rx='8' class='arch-box-accent'></rect>" +
      "<text x='300' y='175' text-anchor='middle' class='arch-sublabel'>Risk scoring</text>" +
      "<rect x='385' y='148' width='140' height='44' rx='8' class='arch-box-accent'></rect>" +
      "<text x='455' y='175' text-anchor='middle' class='arch-sublabel'>Behavioral engine</text>" +
      "<text x='300' y='207' text-anchor='middle' class='arch-sublabel'>wired together with Koin</text>" +
      "<rect x='70' y='270' width='200' height='56' rx='10' class='arch-box'></rect>" +
      "<text x='170' y='294' text-anchor='middle' class='arch-label'>Android</text>" +
      "<text x='170' y='312' text-anchor='middle' class='arch-sublabel'>Jetpack Compose UI</text>" +
      "<rect x='330' y='270' width='200' height='56' rx='10' class='arch-box'></rect>" +
      "<text x='430' y='294' text-anchor='middle' class='arch-label'>iOS</text>" +
      "<text x='430' y='312' text-anchor='middle' class='arch-sublabel'>Compose Multiplatform UI</text>" +
      "</svg>",
      "This isn't a decision I'm making in a vacuum either. Shipaton has a Ship Kotlin Everywhere category this year, judged specifically on a polished app built for both iOS and Android with KMP, and seeing that confirms a call I was already leaning toward for purely practical reasons. I'd rather say that plainly than pretend the categories have nothing to do with it. Some of what I build here is shaped by wanting this to also hold up as a real submission for Ship Kotlin Everywhere and the Peace Prize, not just a personal project that happens to exist during Shipaton.",
      "By the end of today: one shared module compiling clean on both targets, and all ~17 MVP screens up as a real, empty, navigable shell. No behavioral logic yet, nothing to screenshot. But everything I build after this lands somewhere that already makes sense, on both phones, from the same code.",
    ],
  },
];

// Node-only export for generate-journal-pages.js -- `module` doesn't exist
// in the browser, where this file is loaded as a plain <script>.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { JOURNAL_ENTRIES };
}
