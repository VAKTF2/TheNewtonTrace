# The Newton Trace

A short personality trace that guesses whether you're related to Isaac Newton - for fun, not genealogy.

## What it is

You answer 16 questions about focus, solitude, temper, curiosity, and secrecy (traits Newton was famously known for), then pick where you're from. It combines the two into a percentage, a Yes/No verdict, and a downloadable certificate.

No backend, no build step, no dependencies beyond Google Fonts.

## Files

- `index.html` - page structure and screen markup
- `styles.css` - all styling
- `anticheat.js` - a first, simple timing check (see below); loads before `quiz.js`, which calls into it
- `quiz.js` - question/geography data, state, and the intro → geo → quiz → calculating → result flow
- `certificate.js` - renders the result as a downloadable PNG via canvas; loads after `quiz.js` and reuses its globals (question categories, current score, radar math)

## Anti-cheat (v0.3, simple)

`anticheat.js` times how long the quiz takes: the total time to finish all 16 questions, and how many individual answers came in under 300ms (too fast to have actually been read). Either one flags the run as **unverified** - it still produces a result, but it's excluded from the personal-best calculation and the UI says so.

This is client-side timing friction, not a real guarantee - anyone editing the JS console can bypass it, since there's no backend acting as a source of truth. It's meant to catch casual tampering, not a determined one. Later versions can go further (e.g. tamper-evident checksums on saved history).

## Running it

Open `index.html` in a browser. That's it.

## How the scoring works

- **Trait score** - each question belongs to one of five categories (Focus, Solitude, Temper, Curiosity, Secrecy). Answers are worth 0–3 points; your score per category is shown as a radar chart, and the average across all 16 questions gives a base trait percentage.
- **Geography nudge** - your continent/country choice maps to a proximity value relative to Woolsthorpe, England (Newton's birthplace). This multiplies the trait score by a factor between roughly 0.7 (far away) and 1.15 (UK), so location can shift the result but never zero it out or dominate it.
- **Final percentage** - trait score × geography multiplier, clamped between 1% and 99%. 50%+ is a "Yes" verdict.
- **History** - past attempts are saved locally in the browser (not shared anywhere) so the intro screen can show your personal best.

## Notes
- Questions and answer order are shuffled on every run.
- The "Download certificate" button renders the result as a PNG using canvas - no external image library involved.
- This is a joke wrapped in a scoring system. Take the result exactly as seriously as you like
