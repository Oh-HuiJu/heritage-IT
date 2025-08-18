console.log('sub.js loaded');

function bindToggle() {
  const wrap  = document.querySelector('.box-width.bind-toggle');
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

function bindToggleBox(el) {
  // 모든 박스 닫기
  document.querySelectorAll(".how-slide-box").forEach(box => {
    if (box !== el) box.classList.remove("is-open");
  });

  // 클릭한 박스 토글
  el.classList.toggle("is-open");
}

function companyNav(initialRoute){

  const navBox = document.querySelector('.company-nav');
  if (!navBox) return;

  const items   = navBox.querySelectorAll('nav');
  const aboutAs = document.querySelector('.about-us');
  const history = document.querySelector('.history');

  function show(target){
    // 버튼 select 스타일
    items.forEach(i => i.classList.remove('select'));
    const active = navBox.querySelector(`nav[data-target="${target}"]`);
    if (active) active.classList.add('select');

    // 컨텐츠 표시
    if (target === 'about') {
      if (aboutAs) aboutAs.style.display = 'block';
      if (history) history.style.display = 'none';
    } else if (target === 'history') {
      if (aboutAs) aboutAs.style.display = 'none';
      if (history) history.style.display = 'block';
    }
  }

  // ✅ 초기 탭 결정 (라우트 기준)
  let target = 'about';
  if (initialRoute === '/company-history') target = 'history';
  if (initialRoute === '/company-aboutAs') target = 'about';

  show(target);

  // 클릭 시 전환
  items.forEach(item => {
    item.addEventListener('click', () => {
      show(item.dataset.target);
    });
  });
}

function initCerts() {
  const list = document.getElementById('certs');
  if (!list) return;

  const preOpen = list.querySelector('.cert-box.is-open');
  if (preOpen && list.children[1] !== preOpen) {
    flipMoveToIndex(preOpen, 1);
  }

  list.addEventListener('click', (e) => {
    const card = e.target.closest('.cert-box');
    if (!card) return;
    if (list.children[0] === card) return setOpen(card);
    flipMoveToIndex(card, 0);
    setOpen(card);
  });

  function setOpen(target) {
    [...list.children].forEach(c => c.classList.toggle('is-open', c === target));
  }

  function flipMoveToIndex(target, index) {
    const items = [...list.children];
    const firstRect = new Map(items.map(el => [el, el.getBoundingClientRect()]));
    const clamped = Math.max(0, Math.min(index, list.children.length - 1));
    list.insertBefore(target, list.children[clamped]);

    const afterItems = [...list.children];
    afterItems.forEach(el => {
      const first = firstRect.get(el);
      const last  = el.getBoundingClientRect();
      if (!first) return;
      const dx = first.left - last.left;
      el.style.transition = 'none';
      el.style.transform  = `translateX(${dx}px)`;
    });
    requestAnimationFrame(() => {
      afterItems.forEach(el => {
        el.style.transition = 'transform .35s ease, flex-basis .35s ease';
        el.style.transform  = '';
      });
    });
  }
}
document.addEventListener("route:loaded", (e) => {

  console.log("📌 route:loaded fired");
  console.log("넘어온 라우트:", e.detail?.route);
  const route = e.detail?.route || location.pathname;
  companyNav(route);
});
window.bindToggleBox = bindToggleBox;
document.addEventListener("route:loaded", () => {
  bindToggle();
  companyNav();
  initCerts();
});