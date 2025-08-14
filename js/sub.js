console.log('sub.js loaded');

function bindToggle() {
  const wrap  = document.querySelector('.box-width.img-half');
  if (!wrap) return;

  const items = Array.from(wrap.querySelectorAll('.togle-list li'));
  const imgs  = Array.from(wrap.querySelectorAll('.img-box img'));

  if (!items.length || items.length !== imgs.length) return;

  const titles = items.map(li => li.querySelector(':scope > p'));

  function setActive(index) {
    titles.forEach((p, i) => p.classList.toggle('is-open', i === index));
    imgs.forEach((img, i) => img.classList.toggle('is-open', i === index));
  }

  items.forEach((li, i) => {
    li.addEventListener('click', () => setActive(i), { passive: true });
  });
}

function initHowSlide() {
  const list   = document.querySelector('.how-slide-list');
  if (!list) return;

  const boxes  = Array.from(list.querySelectorAll('.how-slide-box'));
  const bars   = boxes.map(b => b.querySelector('.bar'));

  if (!boxes.length) return;

  const DURATION = 5000;        // 각 단계 유지 시간(ms)
  let idx = Math.max(0, boxes.findIndex(b => b.classList.contains('is-open')));
  let playing = false, rafId = 0, last = 0, progress = 0;

  function setActive(i) {
    idx = (i + boxes.length) % boxes.length;
    boxes.forEach((b, k) => b.classList.toggle('is-open', k === idx));
    // 모든 바 리셋, 현재 것만 0부터 다시
    bars.forEach((bar, k) => { if (bar) bar.style.width = k === idx ? '0%' : '0%'; });
    progress = 0; last = 0;
  }

  function next() {
    setActive(idx + 1);
  }

  function tick(ts) {
    if (!playing) return;
    if (!last) last = ts;
    const dt = ts - last; last = ts;

    progress += dt / DURATION;                         // 0 → 1
    const w = Math.min(progress, 1) * 100;
    if (bars[idx]) bars[idx].style.width = w + '%';

    if (progress >= 1) {
      next();
      last = 0;
    }
    rafId = requestAnimationFrame(tick);
  }

  function play() {
    if (playing) return;
    playing = true; last = 0;
    rafId = requestAnimationFrame(tick);
  }
  function pause() {
    playing = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }
  function restart() { pause(); play(); }

  // 초기 활성화
  if (idx < 0) idx = 0;
  setActive(idx);
  play();

  // 클릭으로 이동
  boxes.forEach((box, i) => {
    box.addEventListener('click', () => {
      setActive(i);
      restart();
    }, { passive: true });
  });

  // 호버 시 일시정지/재생
  list.addEventListener('mouseenter', pause);
  list.addEventListener('mouseleave', play);

  // 반응형에서 레이아웃 변동 시 바 넓이 재계산은 JS가 계속 그려주므로 별도 처리 불필요
}

function companyNav(){
  const navBox = document.querySelector('.company-nav');
  if (!navBox) return;

  const items = navBox.querySelectorAll('.nav-item');
  if (!items.length) return;

  const aboutAs = document.querySelector('.about-as');
  const history = document.querySelector('.history');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.textContent.trim().toLowerCase();
      if (target === '회사 소개') {
        aboutAs.style.display = 'block';
        history.style.display = 'none';
      } else if (target === '회사 연혁') {
        aboutAs.style.display = 'none';
        history.style.display = 'block';
      }
    }, { passive: true });
  });

}

// 예: router.js에서 페이지 로드 완료 시 호출
document.addEventListener("route:loaded", bindToggle);
document.addEventListener('route:loaded', initHowSlide);

document.addEventListener("route:DOMContentLoaded", bindToggle);
document.addEventListener('DOMContentLoaded', initHowSlide);