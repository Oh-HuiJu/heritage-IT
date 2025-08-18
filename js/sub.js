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

window.bindToggleBox = bindToggleBox;
document.addEventListener("route:loaded", () => {
  bindToggle();
  companyNav();
});