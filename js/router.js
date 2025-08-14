console.log('router.js loaded');

// ===== 라우트 테이블 =====
const routes = {
  "/":        "/html/company.html",  // ✅ 기본 홈
  "/product-over": "/html/product-overview.html",
  "/product-how": "/html/product-how.html",
  "/platform": "/html/platform.html",
  "/customers": "/html/customers.html",
  "/plan":      "/html/plan.html",
  "/company-aboutAs":   "/html/company.html",
  "/company-history":   "/html/company.html",
  "/404":       "/html/404.html"
};

const app = document.getElementById("main-con");

// 렌더
async function render(route) {
  const file = routes[route] || routes["/404"];
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(res.status);
    app.innerHTML = await res.text();
    setActiveLink(route);
    document.dispatchEvent(new CustomEvent("route:loaded", { detail: { route } }));
    window.scrollTo({ top: 0, behavior: "instant" });
  } catch (e) {
    app.innerHTML = "<h2 style='padding:24px'>페이지를 불러오지 못했습니다.</h2>";
    console.error(e);
  }
}

// 활성 표시
function setActiveLink(route) {
  document.querySelectorAll("header [data-route]").forEach(el => {
    el.classList.toggle("is-active", el.dataset.route === route);
  });
}

// 헤더 클릭(로고 포함)
function onHeaderClick(e) {
  const routeEl = e.target.closest("[data-route]");
  if (!routeEl) return;
  e.preventDefault();
  const to = routeEl.dataset.route;
  if (to === window.location.pathname) return;
  history.pushState({ route: to }, "", to);
  render(to);
}

// 뒤/앞으로 가기
window.addEventListener("popstate", (e) => {
  const route = (e.state && e.state.route) || window.location.pathname;
  render(route in routes ? route : "/");    // ✅ 없는 경로면 홈
});

// 부트스트랩: 첫 진입은 홈
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("header").addEventListener("click", onHeaderClick);
  const current = window.location.pathname;
  render(current in routes ? current : "/"); // ✅ 홈 로드
});