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

function bindTextToggle(root = document) {
    root.querySelectorAll(".text-toggle.img-half").forEach((wrap) => {
      // 아코디언 헤더와 이미지 패널 매칭(순서 기반)
      const headers = [...wrap.querySelectorAll(".togle-list ul > li > p")];
      const panels  = [...wrap.querySelectorAll(".img-box > div")];
      if (!headers.length || !panels.length) return;

      const setActive = (idx) => {
        headers.forEach((p, i) => p.classList.toggle("is-open", i === idx));
        panels.forEach((box, i) => box.classList.toggle("is-open", i === idx));
      };

      // 초기 상태: 이미 열린 p가 있으면 그 인덱스, 없으면 0
      let initIdx = headers.findIndex(p => p.classList.contains("is-open"));
      if (initIdx < 0) initIdx = 0;
      setActive(initIdx);

      // 클릭 이벤트
      headers.forEach((p, i) => {
        p.addEventListener("click", () => {
          setActive(i);
        });
      });
    });
  }


window.bindToggleBox = bindToggleBox;
document.addEventListener("route:loaded", () => {
  bindToggle();
  initCerts();
  bindTextToggle();
});