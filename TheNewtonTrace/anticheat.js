// anticheat.js — a first, simple pass at detecting non-human-speed runs.
// This is client-side timing friction, not a real guarantee: anyone editing
// the JS console can bypass it. It exists to catch casual tampering and
// mark suspect results as unverified rather than silently trusting them.
// A later version can go further (e.g. tamper-evident checksums on saved history).

const AntiCheat = (function () {
  const MIN_QUESTION_MS = 300;   // fastest plausible time to read + decide on one question
  const MIN_TOTAL_MS = 8000;     // fastest plausible time to finish the whole quiz
  const FAST_ANSWER_LIMIT = 3;   // this many suspiciously-fast answers flags the run

  let quizStartTime = null;
  let questionShownTime = null;
  let fastAnswerCount = 0;

  function startQuiz() {
    quizStartTime = performance.now();
    fastAnswerCount = 0;
  }

  function startQuestion() {
    questionShownTime = performance.now();
  }

  function recordAnswer() {
    if (questionShownTime === null) return;
    const elapsed = performance.now() - questionShownTime;
    if (elapsed < MIN_QUESTION_MS) fastAnswerCount++;
  }

  function evaluate() {
    const totalElapsed = quizStartTime === null ? Infinity : performance.now() - quizStartTime;
    const suspicious = totalElapsed < MIN_TOTAL_MS || fastAnswerCount >= FAST_ANSWER_LIMIT;
    return { verified: !suspicious, totalMs: Math.round(totalElapsed), fastAnswerCount };
  }

  return { startQuiz, startQuestion, recordAnswer, evaluate };
})();
