// Injects nav.html into #site-header and highlights the active page
(function () {
  const containerId = "site-header";
  function normalize(path) {
    if (!path) return "index.html";
    try {
      const url = new URL(path, location.href);
      let last = url.pathname.split("/").filter(Boolean).pop() || "index.html";
      // Treat index variants as index.html
      if (last === "" || last.startsWith("index")) last = "index.html";
      return last.toLowerCase();
    } catch (e) {
      return path.toLowerCase();
    }
  }

  async function loadHeader() {
    const hostEl = document.getElementById(containerId);
    if (!hostEl) return;

    try {
      const res = await fetch("nav.html", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load nav.html");
      hostEl.innerHTML = await res.text();

      // Highlight active link
      const current = normalize(location.pathname);
      const links = hostEl.querySelectorAll(".nav-tabs a");
      links.forEach(a => {
        const target = normalize(a.getAttribute("href"));
        if (target === current) {
          a.classList.add("active");
          a.setAttribute("aria-current", "page");
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Run as soon as possible
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHeader);
  } else {
    loadHeader();
  }
})();