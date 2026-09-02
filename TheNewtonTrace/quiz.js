// quiz.js — question data, geography data, and the intro → geo → quiz → calculating → result flow.
// Loaded before certificate.js, which reuses CATEGORIES, pentPoint(), and the result state below.

const CATEGORIES = [
  { key: 'focus', label: 'Focus' },
  { key: 'solitude', label: 'Solitude' },
  { key: 'temper', label: 'Temper' },
  { key: 'curiosity', label: 'Curiosity' },
  { key: 'secrecy', label: 'Secrecy' },
];

const QUESTIONS = [
  { cat: 'focus', q: "When you're deep in a problem, how long can you stay locked in without a break?", opts: [
    ["A few minutes, then I need a change of scenery", 0],
    ["Maybe half an hour before I drift", 1],
    ["A few hours, if it's really got its hooks in me", 2],
    ["I lose entire days and forget to eat", 3],
  ]},
  { cat: 'temper', q: "Someone criticizes your work. What happens next?", opts: [
    ["I take it in stride, no big deal", 0],
    ["I mull it over for a day", 1],
    ["I quietly hold a grudge", 2],
    ["I begin what could generously be called a feud", 3],
  ]},
  { cat: 'solitude', q: "Your ideal working environment?", opts: [
    ["A busy café — background noise helps", 0],
    ["A shared office, a few people around", 1],
    ["A quiet room, door closed", 2],
    ["Alone, curtains drawn, candle only", 3],
  ]},
  { cat: 'curiosity', q: "An apple drops near you out of nowhere. First thought?", opts: [
    ["\"Better clean that up\"", 0],
    ["\"Huh, gravity's kind of neat\"", 1],
    ["\"Wait — why straight down, and not sideways?\"", 2],
    ["You reach for a napkin and start doing the maths", 3],
  ]},
  { cat: 'focus', q: "How do you feel about keeping a detailed notebook of your daily thoughts or experiments?", opts: [
    ["Never done it", 0],
    ["I jot the occasional note", 1],
    ["I keep a fairly organized log", 2],
    ["I have thousands of pages, meticulously indexed", 3],
  ]},
  { cat: 'focus', q: "Your approach to sleep, when a problem is still unsolved?", opts: [
    ["Sleep is sacred — eight hours, regardless", 0],
    ["I might lose an hour or two", 1],
    ["Sleep becomes negotiable", 2],
    ["What is sleep", 3],
  ]},
  { cat: 'solitude', q: "How do you feel about small talk at a party?", opts: [
    ["Love it — I'm the one working the room", 0],
    ["Fine, in moderation", 1],
    ["I tolerate it, barely", 2],
    ["I'd rather be home with a book and a locked door", 3],
  ]},
  { cat: 'curiosity', q: "Your relationship with mathematics, growing up?", opts: [
    ["Never my strong suit", 0],
    ["Fine — nothing special", 1],
    ["I genuinely enjoyed it", 2],
    ["I got frustrated with the existing notation and made up my own", 3],
  ]},
  { cat: 'secrecy', q: "On a group project, you tend to...", opts: [
    ["Thrive on delegating tasks", 0],
    ["Contribute a fair, equal share", 1],
    ["End up doing most of it alone anyway", 2],
    ["Quietly redo everyone else's part at 3am, uncredited", 3],
  ]},
  { cat: 'secrecy', q: "Secret hobbies or side studies you mostly keep to yourself?", opts: [
    ["Not really — open book", 0],
    ["A couple of casual ones", 1],
    ["Yes, and they're a little unconventional", 2],
    ["A full private study nobody else knows I'm running", 3],
  ]},
  { cat: 'focus', q: "How do unfinished puzzles or unanswered questions sit with you?", opts: [
    ["I move on pretty easily", 0],
    ["They nag at me sometimes", 1],
    ["They genuinely bother me until solved", 2],
    ["I will not rest until it's resolved — full stop", 3],
  ]},
  { cat: 'solitude', q: "Your stance on marriage or a long-term partnership?", opts: [
    ["Very important to me", 0],
    ["I'd like that, someday", 1],
    ["Not really a priority", 2],
    ["The work is the only lifelong commitment I've made", 3],
  ]},
  { cat: 'secrecy', q: "You finally crack something you've been stuck on for ages. What now?", opts: [
    ["I mention it casually", 0],
    ["I tell a friend or two", 1],
    ["I write it all down properly", 2],
    ["I file it away and don't publish it for years", 3],
  ]},
  { cat: 'curiosity', q: "You notice something odd in nature — say, light bending through glass. Do you...", opts: [
    ["Not really my thing, I'd walk past", 0],
    ["Glance, then move on", 1],
    ["Look closer, maybe read up on it later", 2],
    ["Go build your own setup to test it yourself", 3],
  ]},
  { cat: 'temper', q: "Your patience for people who disagree with your ideas?", opts: [
    ["Happy to hear other views", 0],
    ["I listen, then decide", 1],
    ["Limited — I'm usually pretty sure I'm right", 2],
    ["I will out-argue you for the rest of both our lives", 3],
  ]},
  { cat: 'focus', q: "Faced with a long, tedious calculation, you...", opts: [
    ["Avoid it if at all possible", 0],
    ["Do it, reluctantly, if I must", 1],
    ["Actually find it kind of satisfying", 2],
    ["Invent a new branch of mathematics to make it easier", 3],
  ]},
];

const CONTINENTS = [
  { key: 'europe', label: 'Europe', base: 0.55, countries: [
    { name: 'United Kingdom', p: 1.0 }, { name: 'Ireland', p: 0.85 },
    { name: 'Netherlands', p: 0.75 }, { name: 'France', p: 0.7 },
    { name: 'Germany', p: 0.65 }, { name: 'Romania', p: 0.5 },
    { name: 'Italy', p: 0.5 }, { name: 'Poland', p: 0.5 }, { name: 'Other', p: 0.55 },
  ]},
  { key: 'namerica', label: 'North America', base: 0.35, countries: [
    { name: 'United States', p: 0.4 }, { name: 'Canada', p: 0.4 },
    { name: 'Mexico', p: 0.3 }, { name: 'Other', p: 0.35 },
  ]},
  { key: 'samerica', label: 'South America', base: 0.15, countries: [
    { name: 'Brazil', p: 0.15 }, { name: 'Argentina', p: 0.15 }, { name: 'Chile', p: 0.15 },
    { name: 'Colombia', p: 0.15 }, { name: 'Peru', p: 0.15 }, { name: 'Other', p: 0.15 },
  ]},
  { key: 'africa', label: 'Africa', base: 0.15, countries: [
    { name: 'Nigeria', p: 0.15 }, { name: 'Egypt', p: 0.15 }, { name: 'South Africa', p: 0.15 },
    { name: 'Kenya', p: 0.15 }, { name: 'Morocco', p: 0.15 }, { name: 'Ghana', p: 0.15 }, { name: 'Other', p: 0.15 },
  ]},
  { key: 'asia', label: 'Asia', base: 0.12, countries: [
    { name: 'India', p: 0.12 }, { name: 'China', p: 0.12 }, { name: 'Japan', p: 0.12 },
    { name: 'Indonesia', p: 0.12 }, { name: 'Philippines', p: 0.12 }, { name: 'South Korea', p: 0.12 },
    { name: 'Vietnam', p: 0.12 }, { name: 'Other', p: 0.12 },
  ]},
  { key: 'oceania', label: 'Oceania', base: 0.1, countries: [
    { name: 'Australia', p: 0.1 }, { name: 'New Zealand', p: 0.1 }, { name: 'Fiji', p: 0.1 },
    { name: 'Papua New Guinea', p: 0.1 }, { name: 'Other', p: 0.1 },
  ]},
];

const CALC_LINES = ["Weighing the evidence…", "Cross-referencing old habits…", "Tracing the pattern back…", "Consulting the notebooks…"];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- shared state (also read by certificate.js) ----------
let order = [];
let current = 0;
let score = 0;
let maxScore = 0;
let catScores = {};
let catMax = {};
let selectedContinent = null;
let selectedCountry = null;
let proximity = 0;
let history = [];
let finalPct = 0;

const screenIntro = document.getElementById('screen-intro');
const screenGeo = document.getElementById('screen-geo');
const screenQuiz = document.getElementById('screen-quiz');
const screenCalc = document.getElementById('screen-calc');
const screenResult = document.getElementById('screen-result');

const qCount = document.getElementById('q-count');
const qText = document.getElementById('q-text');
const qOptions = document.getElementById('q-options');

const arcFill = document.getElementById('arcFill');
const appleDot = document.getElementById('appleDot');
let arcLen = 0;

function initArc() {
  arcLen = arcFill.getTotalLength();
  arcFill.style.strokeDasharray = arcLen;
  arcFill.style.strokeDashoffset = arcLen;
}
function setProgress(fraction) {
  arcFill.style.strokeDashoffset = arcLen * (1 - fraction);
  const pt = arcFill.getPointAtLength(arcLen * fraction);
  appleDot.setAttribute('cx', pt.x);
  appleDot.setAttribute('cy', pt.y);
}

// ---------- storage / history ----------
async function loadHistory() {
  try {
    const res = await window.storage.get('newton-quiz-attempts', false);
    history = res && res.value ? JSON.parse(res.value) : [];
  } catch (e) {
    history = [];
  }
  const verifiedHistory = history.filter(h => h.verified !== false);
  if (verifiedHistory.length > 0) {
    const best = Math.max(...verifiedHistory.map(h => h.pct));
    const line = document.getElementById('best-trace-line');
    line.innerHTML = `Personal best so far: <strong>${best}%</strong> across ${history.length} attempt${history.length === 1 ? '' : 's'}.`;
    line.classList.remove('hidden');
  }
}

async function saveAttempt(pct, verdict, verified) {
  const verifiedHistory = history.filter(h => h.verified !== false);
  const prevBest = verifiedHistory.length ? Math.max(...verifiedHistory.map(h => h.pct)) : null;
  history.push({ date: Date.now(), pct, verdict, verified });
  if (history.length > 25) history = history.slice(history.length - 25);
  try {
    await window.storage.set('newton-quiz-attempts', JSON.stringify(history), false);
  } catch (e) { /* best effort only */ }
  return verified && prevBest !== null && pct > prevBest;
}

// ---------- geo screen ----------
function startGeo() {
  screenIntro.classList.add('hidden');
  screenGeo.classList.remove('hidden');
  renderContinentStep();
}

function renderContinentStep() {
  document.getElementById('geo-step-label').textContent = 'Step 1 of 2';
  document.getElementById('geo-text').textContent = 'Which continent are you from?';
  const wrap = document.getElementById('geo-options');
  wrap.innerHTML = '';
  CONTINENTS.forEach((c, idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.innerHTML = `<span class="mark">${String.fromCharCode(97 + idx)}.</span><span>${c.label}</span>`;
    btn.addEventListener('click', () => {
      Array.from(wrap.children).forEach(el => el.style.pointerEvents = 'none');
      btn.classList.add('chosen');
      selectedContinent = c;
      setTimeout(renderCountryStep, 280);
    });
    wrap.appendChild(btn);
  });
}

function renderCountryStep() {
  document.getElementById('geo-step-label').textContent = 'Step 2 of 2';
  document.getElementById('geo-text').textContent = `Which country, within ${selectedContinent.label}?`;
  const wrap = document.getElementById('geo-options');
  wrap.innerHTML = '';
  selectedContinent.countries.forEach((c, idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.innerHTML = `<span class="mark">${String.fromCharCode(97 + idx)}.</span><span>${c.name}</span>`;
    btn.addEventListener('click', () => {
      Array.from(wrap.children).forEach(el => el.style.pointerEvents = 'none');
      btn.classList.add('chosen');
      selectedCountry = c.name;
      proximity = c.p;
      setTimeout(startQuiz, 280);
    });
    wrap.appendChild(btn);
  });
}

// ---------- quiz ----------
function startQuiz() {
  order = shuffle(QUESTIONS).map(item => ({ cat: item.cat, q: item.q, opts: shuffle(item.opts) }));
  current = 0; score = 0; maxScore = order.length * 3;
  catScores = {}; catMax = {};
  CATEGORIES.forEach(c => { catScores[c.key] = 0; catMax[c.key] = 0; });
  order.forEach(item => { catMax[item.cat] += 3; });

  screenGeo.classList.add('hidden');
  screenQuiz.classList.remove('hidden');
  initArc();
  setProgress(0);
  AntiCheat.startQuiz();
  renderQuestion();
}

function renderQuestion() {
  const item = order[current];
  qCount.textContent = `Question ${current + 1} of ${order.length}`;
  qText.textContent = item.q;
  qOptions.innerHTML = '';
  item.opts.forEach(([label, pts], idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.innerHTML = `<span class="mark">${String.fromCharCode(97 + idx)}.</span><span>${label}</span>`;
    btn.addEventListener('click', () => selectOption(btn, pts, item.cat));
    qOptions.appendChild(btn);
  });
  AntiCheat.startQuestion();
}

function selectOption(btn, pts, cat) {
  Array.from(qOptions.children).forEach(el => el.style.pointerEvents = 'none');
  btn.classList.add('chosen');
  score += pts;
  catScores[cat] += pts;
  AntiCheat.recordAnswer();

  setTimeout(() => {
    current++;
    setProgress(current / order.length);
    if (current < order.length) renderQuestion();
    else runCalculation();
  }, 320);
}

function runCalculation() {
  screenQuiz.classList.add('hidden');
  screenCalc.classList.remove('hidden');
  const calcLine = document.getElementById('calc-line');
  let i = 0;
  calcLine.textContent = CALC_LINES[0];
  const interval = setInterval(() => { i = (i + 1) % CALC_LINES.length; calcLine.textContent = CALC_LINES[i]; }, 650);
  setTimeout(() => { clearInterval(interval); showResult(); }, 2400);
}

// ---------- radar (shared with certificate.js) ----------
function pentPoint(cx, cy, R, index, fraction) {
  const angle = (-90 + index * 72) * Math.PI / 180;
  return { x: cx + R * fraction * Math.cos(angle), y: cy + R * fraction * Math.sin(angle) };
}

function buildRadarSVG(fractions, cx, cy, R) {
  let svg = '';
  [0.5, 1.0].forEach(ring => {
    const pts = CATEGORIES.map((c, i) => pentPoint(cx, cy, R, i, ring)).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    svg += `<polygon class="radar-grid" points="${pts}"></polygon>`;
  });
  CATEGORIES.forEach((c, i) => {
    const p = pentPoint(cx, cy, R, i, 1.0);
    svg += `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"></line>`;
  });
  const scorePts = CATEGORIES.map((c, i) => pentPoint(cx, cy, R, i, fractions[c.key])).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  svg += `<polygon class="radar-fill" points="${scorePts}"></polygon>`;
  CATEGORIES.forEach((c, i) => {
    const p = pentPoint(cx, cy, R, i, 1.28);
    const anchor = Math.abs(p.x - cx) < 4 ? 'middle' : (p.x > cx ? 'start' : 'end');
    svg += `<text class="radar-label" x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle">${c.label}</text>`;
  });
  return svg;
}

function proximityWord(p) {
  if (p >= 0.9) return 'a near match';
  if (p >= 0.7) return 'very close';
  if (p >= 0.5) return 'a moderate distance';
  if (p >= 0.3) return 'a considerable distance';
  return 'far reaching';
}

// ---------- result ----------
async function showResult() {
  screenCalc.classList.add('hidden');
  screenResult.classList.remove('hidden');

  const traitPct = (score / maxScore) * 100;
  const multiplier = 0.65 + 0.5 * proximity;
  finalPct = Math.round(Math.min(99, Math.max(1, traitPct * multiplier)));
  const isYes = finalPct >= 50;

  const wordEl = document.getElementById('result-word');
  wordEl.textContent = isYes ? 'Yes' : 'No';
  wordEl.className = 'result-word ' + (isYes ? 'yes' : 'no');
  document.getElementById('result-pct').textContent = finalPct + '%';

  const fractions = {};
  CATEGORIES.forEach(c => { fractions[c.key] = catMax[c.key] ? catScores[c.key] / catMax[c.key] : 0; });
  document.getElementById('radarSvg').innerHTML = buildRadarSVG(fractions, 120, 95, 68);

  document.getElementById('cert-provenance').textContent =
    `Provenance: ${selectedCountry}, ${selectedContinent.label} — ${proximityWord(proximity)} to Woolsthorpe, England.`;
  document.getElementById('cert-date').textContent = 'Issued ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  let copy;
  if (finalPct >= 80) copy = "This is not a subtle resemblance. The obsessive focus, the solitude, the refusal to publish until you're good and ready — you may as well share the family crest.";
  else if (finalPct >= 50) copy = "There's a real family resemblance in the habits — the fixation, the odd hours, the stubbornness. Whether it's blood or just temperament is between you and the historians.";
  else if (finalPct >= 25) copy = "A few traits line up, but on the whole you'd get along fine at a party he'd have hated. Distant, if related at all.";
  else copy = "Not even distant cousins, by this measure. You clearly enjoy company, sleep, and being told you're wrong — none of which he tolerated well.";
  document.getElementById('result-copy').textContent = copy;

  const timingCheck = AntiCheat.evaluate();
  const isNewBest = await saveAttempt(finalPct, isYes ? 'Yes' : 'No', timingCheck.verified);

  const badge = document.getElementById('best-badge');
  if (isNewBest) badge.classList.remove('hidden'); else badge.classList.add('hidden');

  const unverifiedNote = document.getElementById('unverified-note');
  if (!timingCheck.verified) unverifiedNote.classList.remove('hidden');
  else unverifiedNote.classList.add('hidden');
}

document.getElementById('btn-start').addEventListener('click', startGeo);
document.getElementById('btn-again').addEventListener('click', () => {
  screenResult.classList.add('hidden');
  screenIntro.classList.remove('hidden');
  selectedContinent = null; selectedCountry = null; proximity = 0;
});

loadHistory();
