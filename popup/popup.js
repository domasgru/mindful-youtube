const DEFAULTS = { enabled: true, customCss: "" };
const AUTOSAVE_DELAY = 400;

const enabledToggle = document.getElementById("enabled-toggle");
const customCssInput = document.getElementById("custom-css");
const status = document.getElementById("status");

let statusTimeout;
let autosaveTimeout;

function showStatus(text) {
  status.textContent = text;
  status.classList.add("visible");
  clearTimeout(statusTimeout);
  statusTimeout = setTimeout(() => status.classList.remove("visible"), 1200);
}

chrome.storage.sync.get(DEFAULTS, (state) => {
  enabledToggle.checked = state.enabled;
  customCssInput.value = state.customCss;
});

enabledToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledToggle.checked });
});

customCssInput.addEventListener("input", () => {
  clearTimeout(autosaveTimeout);
  autosaveTimeout = setTimeout(() => {
    chrome.storage.sync.set({ customCss: customCssInput.value }, () => {
      showStatus("Saved");
    });
  }, AUTOSAVE_DELAY);
});
