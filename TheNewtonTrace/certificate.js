// certificate.js — renders the result as a downloadable PNG, using canvas only (no external libraries).
// Depends on globals defined in quiz.js: CATEGORIES, pentPoint(), and the result state
// (finalPct, selectedCountry, selectedContinent, proximity, catScores, catMax, proximityWord()).

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = 0;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + ' ';
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line, x, y + lines * lineHeight);
      line = words[n] + ' ';
      lines++;
    } else line = test;
  }
  ctx.fillText(line, x, y + lines * lineHeight);
  return lines + 1;
}

async function downloadCertificate() {
  if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
  const W = 900, H = 1180;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#EFE7D3'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#AE8A4E'; ctx.lineWidth = 3; ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.strokeStyle = 'rgba(174,138,78,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(38, 38, W - 76, H - 76);

  ctx.fillStyle = '#AE8A4E';
  ctx.font = 'italic 30px Fraunces, serif';
  ctx.textAlign = 'left';
  ctx.fillText('Certificate of trace', 80, 130);

  ctx.fillStyle = '#5B5140';
  ctx.font = '20px "Source Serif 4", Georgia, serif';
  wrapCanvasText(ctx, 'This is to certify that, upon examination of the particulars below, a trace of Sir Isaac Newton has been found in the subject, in the amount of', 80, 168, W - 160, 28);

  const isYes = finalPct >= 50;
  ctx.fillStyle = isYes ? '#7C3230' : '#5B5140';
  ctx.font = '700 110px Fraunces, serif';
  ctx.fillText(isYes ? 'Yes' : 'No', 78, 340);

  ctx.fillStyle = '#29241C';
  ctx.font = '600 42px Fraunces, serif';
  ctx.fillText(finalPct + '%', 78, 400);
  ctx.font = '20px "Source Serif 4", serif';
  ctx.fillStyle = '#5B5140';
  ctx.fillText('trace strength', 78 + ctx.measureText(finalPct + '%').width + 40, 700);

  // radar on canvas
  const cx = W / 2, cy = 560, R = 190;
  ctx.strokeStyle = 'rgba(41,36,28,0.25)'; ctx.lineWidth = 1;
  [0.5, 1.0].forEach(ring => {
    ctx.beginPath();
    CATEGORIES.forEach((c, i) => {
      const p = pentPoint(cx, cy, R, i, ring);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath(); ctx.stroke();
  });
  CATEGORIES.forEach((c, i) => {
    const p = pentPoint(cx, cy, R, i, 1.0);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke();
  });
  const fractions = {};
  CATEGORIES.forEach(c => { fractions[c.key] = catMax[c.key] ? catScores[c.key] / catMax[c.key] : 0; });
  ctx.beginPath();
  CATEGORIES.forEach((c, i) => {
    const p = pentPoint(cx, cy, R, i, fractions[c.key]);
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(124,50,48,0.28)'; ctx.fill();
  ctx.strokeStyle = '#7C3230'; ctx.lineWidth = 2.5; ctx.stroke();

  ctx.font = '18px "Source Serif 4", serif'; ctx.fillStyle = '#5B5140'; ctx.textAlign = 'center';
  CATEGORIES.forEach((c, i) => {
    const p = pentPoint(cx, cy, R, i, 1.22);
    ctx.fillText(c.label, p.x, p.y);
  });

  ctx.textAlign = 'left';
  ctx.font = '19px "Source Serif 4", serif'; ctx.fillStyle = '#5B5140';
  ctx.fillText(`Provenance: ${selectedCountry}, ${selectedContinent.label} — ${proximityWord(proximity)} to Woolsthorpe, England.`, 78, 830);
  ctx.fillText('Issued ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), 78, 862);

  ctx.beginPath(); ctx.arc(W - 130, H - 130, 46, 0, Math.PI * 2);
  ctx.fillStyle = '#7C3230'; ctx.fill();
  ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#F4EFE2';
  ctx.fillText('🍎', W - 130, H - 118);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newton-trace-certificate.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

document.getElementById('btn-download').addEventListener('click', downloadCertificate);
