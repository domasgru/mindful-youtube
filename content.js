(function () {
  const BASE_STYLE_ID = "mindful-youtube-base-style";
  const CUSTOM_STYLE_ID = "mindful-youtube-custom-style";
  const DEFAULTS = { enabled: true, customCss: "" };

  let baseCssText = "";
  let state = null;

  // Hold direct references rather than looking up by id, so a page element
  // that happens to share the id can never be picked up and written into.
  const styleEls = {};

  function styleEl(id) {
    let el = styleEls[id];
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      styleEls[id] = el;
    }
    // At document_start <head> may not exist yet, so fall back to <html> and
    // move the node into <head> once it is available.
    const parent = document.head || document.documentElement;
    if (el.parentNode !== parent) parent.appendChild(el);
    return el;
  }

  function render() {
    if (!state) return;
    styleEl(BASE_STYLE_ID).textContent = state.enabled ? baseCssText : "";
    styleEl(CUSTOM_STYLE_ID).textContent = state.enabled
      ? state.customCss || ""
      : "";
  }

  function readState() {
    chrome.storage.sync.get(DEFAULTS, (next) => {
      state = next;
      render();
    });
  }

  fetch(chrome.runtime.getURL("remove-noise.css"))
    .then((res) => res.text())
    .then((text) => {
      baseCssText = text;
      render();
    })
    .catch((err) => {
      console.error("[Mindful YouTube] failed to load remove-noise.css", err);
    });

  readState();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync") readState();
  });

  // Re-mount into <head> once the parser has built it.
  document.addEventListener("DOMContentLoaded", render);
})();
