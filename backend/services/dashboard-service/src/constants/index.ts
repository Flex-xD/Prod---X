export const FALLBACK_TIPS = [
    "Try the Pomodoro technique: 25 minutes of deep focus, then a 5-minute break.",
    "Batch similar tasks together — context-switching is quietly expensive.",
    "Write tomorrow's top 3 tasks tonight. Decisions made in advance are cheaper.",
    "Your first 90 minutes after waking are usually your sharpest — protect them.",
    "A 10-minute walk between sessions beats a 10-minute phone scroll for focus recovery.",
    "Silence notifications during focus blocks — even 'quick checks' cost 20+ minutes to recover from.",
    "Review what you finished yesterday before starting today — momentum compounds.",
    "Break vague tasks into a single next physical action. Vagueness is what causes procrastination.",
    "Group timers work best with a clear, shared goal stated up front — ambiguity kills momentum.",
    "Track completion, not just time spent — hours logged don't always mean progress made.",
];

export const systemPrompt =
    "You are a terse productivity coach embedded in a focus-timer app called ProdX. " +
    "Given no other context, produce exactly ONE short, concrete, actionable productivity tip. " +
    "Maximum 22 words. No greeting, no quotation marks, no emoji, no preamble — output only the tip itself.";