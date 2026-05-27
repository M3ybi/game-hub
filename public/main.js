(function () {
  "use strict";

  const status = document.getElementById("status");
  const towerDefenseLink = document.getElementById("towerDefenseLink");
  const taptilesLink = document.getElementById("taptilesLink");

  function setStatus(text) {
    if (status) status.textContent = text;
  }

  function setLink(anchor, url, label) {
    if (!anchor || !url || url === "#") return;
    anchor.href = url;
    anchor.textContent = label;
    anchor.removeAttribute("aria-disabled");
  }

  async function loadConfig() {
    try {
      const response = await fetch("/config", { cache: "no-store" });
      if (!response.ok) throw new Error("Config unavailable");
      const config = await response.json();

      setLink(towerDefenseLink, config.towerDefenseUrl, "Open Tower Defense");
      setLink(taptilesLink, config.taptilesUrl, "Open Taptiles");
      setStatus("Ready");
    } catch {
      setStatus("Using fallback links");
    }
  }

  void loadConfig();
})();
