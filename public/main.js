(function () {
  "use strict";

  const status = document.getElementById("status");
  const towerDefenseLink = document.getElementById("towerDefenseLink");
  const taptilesLink = document.getElementById("taptilesLink");
  const taptilesState = document.getElementById("taptilesState");

  function setStatus(text, state) {
    if (status) status.textContent = text;
    if (status) {
      status.classList.toggle("is-ready", state === "ready");
      status.classList.toggle("is-warning", state === "warning");
    }
  }

  function setLink(anchor, url, label) {
    if (!anchor || !url || url === "#") return;
    anchor.href = url;
    anchor.textContent = label;
    anchor.removeAttribute("aria-disabled");
    anchor.classList.add("is-ready");
  }

  async function loadConfig() {
    try {
      const response = await fetch("/config", { cache: "no-store" });
      if (!response.ok) throw new Error("Config unavailable");
      const config = await response.json();
      const hasTaptiles = !!(config.taptilesUrl && config.taptilesUrl !== "#");

      setLink(towerDefenseLink, config.towerDefenseUrl, "Open Tower Defense");
      setLink(taptilesLink, config.taptilesUrl, "Open Taptiles");
      if (taptilesState) {
        taptilesState.textContent = hasTaptiles ? "Live" : "Pending";
        taptilesState.classList.toggle("is-ready", hasTaptiles);
        taptilesState.classList.toggle("pill--muted", !hasTaptiles);
      }
      setStatus(hasTaptiles ? "Ready" : "Taptiles pending", hasTaptiles ? "ready" : "warning");
    } catch {
      setStatus("Using fallback links", "warning");
    }
  }

  void loadConfig();
})();
