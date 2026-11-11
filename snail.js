// Footer snail: crawls along the bottom of the page at roughly real snail speed
// (about a millimetre a second) and keeps count of how far it has come since the page opened.
// It only counts while the page is on screen, and it stands still for anyone with reduced motion on.
(() => {
  const foot = document.querySelector('.snail-foot');
  if (!foot) return;
  const track = foot.querySelector('.snail-track');
  const snail = foot.querySelector('.snail');
  const slime = foot.querySelector('.snail-slime');
  const read = foot.querySelector('.snail-read');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const PX_PER_MM = 96 / 25.4; // CSS pixels in a millimetre, roughly, on a typical screen
  let ms = 0, last = performance.now(), lastText = -1;

  const fmtTime = s => {
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m ? `${m} min ${String(r).padStart(2, '0')} s` : `${r} s`;
  };
  const fmtDist = mm => mm < 100 ? `${Math.round(mm)} mm` : mm < 1000 ? `${(mm / 10).toFixed(1)} cm` : `${(mm / 1000).toFixed(2)} m`;

  function tick(now) {
    if (document.visibilityState === 'visible') ms += Math.min(now - last, 1000);
    last = now;
    const secs = ms / 1000, mm = secs; // about 1 mm a second
    const room = Math.max(40, track.clientWidth - 56);
    const x = still.matches ? 0 : (mm * PX_PER_MM) % room;
    snail.style.transform = `translateX(${x.toFixed(2)}px)`;
    slime.style.width = `${(x + 8).toFixed(1)}px`;
    const whole = Math.floor(secs);
    if (whole !== lastText) {
      lastText = whole;
      read.textContent = secs < 3
        ? 'A garden snail crawls about a millimetre a second.'
        : `This page has been open ${fmtTime(secs)}. A garden snail would have crawled about ${fmtDist(mm)} by now.`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
