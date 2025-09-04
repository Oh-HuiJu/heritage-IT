console.log('main.js loaded');

function initHeaderSubmenus() {
  const header   = document.querySelector('header');
  const nav      = header.querySelector('nav');
  const subProd  = header.querySelector('.nav-sub-products');
  const subComp  = header.querySelector('.nav-sub-company');

  const submenuMap = {
    "/product-over":  subProd,
    "/company-aboutAs": subComp
  };

  const items = Array.from(nav.querySelectorAll('[data-route]'));

  let hideTimer = null;

  function hideAll() {
    [subProd, subComp].forEach(el => el && el.classList.remove('is-open'));
  }
  function openFor(route) {
    clearTimeout(hideTimer);
    hideAll();
    const sub = submenuMap[route];
    if (!sub) return; 
    sub.classList.add('is-open');
  }
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideAll, 120);  // 약간의 지연으로 깜빡임 방지
  }
  items.forEach(el => {// 메뉴 호버 → 해당 서브 열기 / 떠나면 닫기 예약
    el.addEventListener('mouseenter', () => openFor(el.dataset.route));
    el.addEventListener('mouseleave', scheduleHide);
  });
  [subProd, subComp].forEach(sub => { // 서브메뉴 위에 마우스 올리면 유지, 벗어나면 닫기
    if (!sub) return;
    sub.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    sub.addEventListener('mouseleave', scheduleHide);
  });
  nav.addEventListener('focusin', (e) => { // 키보드 접근성(탭으로 포커스 이동 시 열고/닫기)
    const el = e.target.closest('[data-route]');
    if (el) openFor(el.dataset.route);
  });
  nav.addEventListener('focusout', (e) => { // 포커스가 헤더/서브메뉴 바깥으로 나가면 닫기
    const to = e.relatedTarget;
    if (!header.contains(to)) hideAll();
  });
}
function initMedeiaMenu(){
  const menuList = document.querySelector('.menu-list');
  const menuOpenBtn = document.querySelector('.menu-btn');
  const menuCloseBtn = menuList.querySelector('.menu-btn');
  const list = menuList.querySelectorAll('[data-route]');

  menuOpenBtn.addEventListener('click', () => {
    menuList.style.display = "block";
    menuOpenBtn.style.display = "none";
  });
  menuCloseBtn.addEventListener('click', () => {
    menuList.style.display = "none";
    menuOpenBtn.style.display = "block";
  });
  list.forEach(item => {
    item.addEventListener('click', () => {
      menuList.style.display = "none";
      menuOpenBtn.style.display = "block";
    });
  });
}
function langugeSelector() {
  const langBtn = document.querySelector('.btn-lang-box');
  const langBox = document.querySelector('.box-lang');
  let selectLang = langBtn.querySelector('.select-lang');
  const langItems = langBox.querySelectorAll('p');

  langBtn.addEventListener('click', () => {
    langBox.classList.add('is-open');
  });
  langItems.forEach(item => {
    item.addEventListener('click', () => {
      langItems.forEach(i => i.classList.remove('select'));
      item.classList.add('select');
      updateLangText();
      langBox.classList.remove('is-open');
    });
  });
  function updateLangText() {
    const selected = langBox.querySelector('.select');
    selectLang.textContent = selected.textContent.slice(0, 2).toUpperCase();
  }
}

/* ---------- 공통 유틸 ---------- */
// 중복 초기화 방지
function alreadyInited(root) {
  if (!root) return true;
  if (root.dataset.inited === '1') return true;
  root.dataset.inited = '1';
  return false;
}
// CSS gap/패딩 값을 px로 가져오기
const pxGap = el => parseFloat(getComputedStyle(el).gap || '0');
const pxPadL = el => parseFloat(getComputedStyle(el).paddingLeft || '0');

/* ----------  메인 이미지 슬라이더 ---------- */
function initHeroSlider() {
  const sliderBox = document.querySelector(".img-slider-box");
  if (!sliderBox || alreadyInited(sliderBox)) return;

  const navItems   = sliderBox.querySelectorAll(".image-slider-nav p");
  const navTexts   = sliderBox.querySelectorAll(".image-slider-text p");
  const slideTrack = sliderBox.querySelector(".slide-img-track");
  if (!slideTrack || !navItems.length) return;
  if (!slideTrack || !navTexts.length) return;

  const slides = slideTrack.querySelectorAll("img");
  let currentIndex = 0;
  const intervalTime = 5000;

  function updateSlide(index) {
    navItems.forEach((item, i) => item.classList.toggle("active", i === index));
    navTexts.forEach((item, i) => item.classList.toggle("active", i === index));
    slideTrack.style.transform = `translateX(-${index * 100}vw)`;
  }
  function nextSlide() {
    currentIndex = (currentIndex + 1) % 3;
    updateSlide(currentIndex);
  }

  navItems.forEach((item, i) => {
    item.addEventListener("click", () => { currentIndex = i; updateSlide(currentIndex); });
  });

  // 자동재생
  let timer = setInterval(nextSlide, intervalTime);
  sliderBox.addEventListener('mouseenter', () => clearInterval(timer));
  sliderBox.addEventListener('mouseleave', () => timer = setInterval(nextSlide, intervalTime));

  updateSlide(currentIndex);
}

/* ---------- 기능(Feature) 슬라이더 + 타임바 ---------- */
function initFeatureSlider() {
  const section = document.getElementById('feature');
  if (!section || alreadyInited(section)) return;

  const DURATION = 5000;

  const navBox = section.querySelector('.nav-box');
  const navs   = navBox ? [...navBox.querySelectorAll('nav')] : [];
  const bars   = navs.map(n => n.querySelector('.time-var'));

  const viewport = section.querySelector('.con-box');
  const track    = section.querySelector('.main-slide-track');
  if (!viewport || !track || !navs.length) return;

  let originals = [...track.querySelectorAll('.main-slide-box')];
  if (!originals.length) return;

  // 무한루프용 클론
  const firstClone = originals[0].cloneNode(true);
  const lastClone  = originals[originals.length-1].cloneNode(true);
  track.insertBefore(lastClone, originals[0]);
  track.appendChild(firstClone);
  let slides = [...track.querySelectorAll('.main-slide-box')];

  let real = Math.max(0, navs.findIndex(n => n.classList.contains('active'))); // 0..COUNT-1
  let playing = false, rafId = 0, lastTs = 0, progress = 0;

  const physIndex = r => r + 1; // 클론 보정 인덱스

  function setActiveNav(r){
    navs.forEach((n,i) => {
      n.classList.toggle('active', i===r);
      n.setAttribute('aria-selected', i===r ? 'true':'false');
    });
    // 위로 차오르는 바(초기화)
    bars.forEach(b => b && (b.style.transform = 'scaleY(0)'));
  }
  function setActiveSlideByPhys(p){
    slides.forEach(s => s.classList.remove('active'));
    slides[p].classList.add('active');
  }
  function sumWidthUntil(p){
    let sum = 0, g = pxGap(track);
    for (let i = 0; i < p; i++) sum += slides[i].getBoundingClientRect().width + g;
    return sum;
  }
  function goPhys(pIndex, withTransition = true){
    setActiveSlideByPhys(pIndex);
    const g = pxGap(track);
    const peek = pxPadL(viewport); // 좌우 동일 가정
    const sRect = slides[pIndex].getBoundingClientRect();
    const cardW = sRect.width + g;
    const viewW = viewport.clientWidth - (peek * 2);
    const center = (viewW - (cardW - g)) / 2;
    const offset = sumWidthUntil(pIndex);
    if (!withTransition) track.style.transition = 'none';
    track.style.transform = `translateX(${-(offset) + center}px)`;
    if (!withTransition) { track.offsetHeight; track.style.transition = ''; }
  }
  function go(r, withTransition = true){
    const COUNT = originals.length;
    real = (r + COUNT) % COUNT;
    setActiveNav(real);
    progress = 0; lastTs = 0;
    goPhys(physIndex(real), withTransition);
  }

  // 자연스러운 5→1 전진 래핑
  let wrappingForward = false, wrappingBackward = false;
  track.addEventListener('transitionend', () => {
    const COUNT = originals.length;
    if (wrappingForward) { wrappingForward = false; real = 0; setActiveNav(real); goPhys(physIndex(real), false); }
    if (wrappingBackward){ wrappingBackward = false; real = COUNT-1; setActiveNav(real); goPhys(physIndex(real), false); }
  });

  function tick(ts){
    if(!playing) return;
    if(!lastTs) lastTs = ts;
    const dt = ts - lastTs; lastTs = ts;
    progress += dt / DURATION;
    if (bars[real]) bars[real].style.transform = `scaleY(${Math.min(progress,1)})`;
    if(progress >= 1){ next(true); lastTs = 0; }
    rafId = requestAnimationFrame(tick);
  }
  function play(){ if(playing) return; playing = true; lastTs = 0; rafId = requestAnimationFrame(tick); }
  function pause(){ playing = false; if(rafId) cancelAnimationFrame(rafId); rafId = 0; }
  function restart(){ pause(); play(); }

  function next(fromAuto=false){
    const COUNT = originals.length;
    if (real === COUNT - 1){ wrappingForward = true; setActiveNav(0); progress = 0; lastTs = 0; goPhys(physIndex(COUNT - 1) + 1, true); }
    else { go(real + 1, true); }
    if (!fromAuto) restart();
  }
  function prev(fromAuto=false){
    const COUNT = originals.length;
    if (real === 0){ wrappingBackward = true; setActiveNav(COUNT - 1); progress = 0; lastTs = 0; goPhys(0, true); }
    else { go(real - 1, true); }
    if (!fromAuto) restart();
  }

  // 초기화
  go(real, false);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => e.isIntersecting ? play() : pause());
  }, { threshold: 0.5 });
  io.observe(section);

  navs.forEach((n,i)=> n.addEventListener('click', () => { go(i, true); restart(); }));
  [navBox, viewport].forEach(el => {
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', play);
  });
  window.addEventListener('resize', () => go(real, false));
}

/* ---------- 라우터 연동 ---------- */
document.addEventListener("route:loaded", () => {
  langugeSelector()
  initHeaderSubmenus();
  initHeroSlider();
  initFeatureSlider();
  initMedeiaMenu();
});