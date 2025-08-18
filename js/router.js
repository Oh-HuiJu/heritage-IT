const routes = {
  "/":                 "/html/company.html",
  "/product-over":     "/html/product-overview.html",
  "/product-how":      "/html/product-how.html",
  "/platform":         "/html/platform.html",
  "/customers":        "/html/customers.html",
  "/plan":             "/html/plan.html",
  "/company-aboutAs":  "/html/company.html",
  "/company-history":  "/html/company.html"
};

const app = document.getElementById("main-con");

// 렌더
async function render(route) {
  const file = routes[route] || routes["/"];  // 없는 경로 → 홈
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(res.status);
    app.innerHTML = await res.text();

    // 실제 렌더된 기준으로 active 표시
    const normalized = (route in routes) ? route : "/";
    setActiveLink(normalized);

    document.dispatchEvent(new CustomEvent("route:loaded", { detail: { route: normalized } }));
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

// ✅ 전역 클릭 위임 (내부 라우트만 SPA로, 외부는 네이티브 이동)
document.addEventListener("click", (e) => {
  // 수정키/중클릭은 기본 동작 유지
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

  const routeEl = e.target.closest("[data-route]");
  if (!routeEl) return;

  const to = routeEl.dataset.route;
  if (!to) return;

  if (/^https?:\/\//.test(to)) {
    window.open(to, "_blank", "noopener");
    e.preventDefault();
    return;
  }

  if (to === window.location.pathname) {
    e.preventDefault();
    return;
  }
  e.preventDefault();
  history.pushState({ route: to }, "", to);
  render(to);
});

// 뒤/앞으로 가기
window.addEventListener("popstate", (e) => {
  const route = (e.state && e.state.route) || window.location.pathname;
  render(route in routes ? route : "/");
});

// ✅ 부트스트랩: 첫 진입 렌더만 하면 됨 (onHeaderClick 제거!)
document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname;
  render(current in routes ? current : "/");
});