// JioHotstar Auto Skip Intro
(function() {
  console.log("[Hotstar Skipper] Loaded");

  const SKIP_TEXTS = ["skip intro", "skip credits", "skip recap", "skip title"];

  function isSkipButton(el) {
    if (!el) return false;
    const text = (el.innerText || el.textContent || "").toLowerCase().trim();
    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
    const combined = text + " " + aria;
    return SKIP_TEXTS.some(t => combined.includes(t));
  }

  function findSkipButton() {
    // Most common - look for all buttons and clickable divs
    const candidates = document.querySelectorAll('button, div[role="button"], [data-testid*="skip"], div[class*="skip"]');
    for (const el of candidates) {
      if (isSkipButton(el) && el.offsetParent !== null) { // visible check
        return el;
      }
    }
    // Fallback: scan whole DOM for text
    const all = document.querySelectorAll('*');
    for (const el of all) {
        if (el.children.length === 0 && isSkipButton(el)) {
            // find clickable parent
            let parent = el.closest('button, div[role="button"]');
            if (parent) return parent;
            return el;
        }
    }
    return null;
  }

  let lastClick = 0;
  function tryClick() {
    const btn = findSkipButton();
    if (btn) {
      const now = Date.now();
      if (now - lastClick > 2000) { // prevent double clicks
        lastClick = now;
        console.log("[Hotstar Skipper] Clicking:", btn.innerText);
        btn.click();
      }
    }
  }

  // 1. Observer for when button appears
  const observer = new MutationObserver(() => {
    tryClick();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // 2. Interval fallback (because Hotstar is SPA)
  setInterval(tryClick, 1000);

  // 3. Also on fullscreen / seek events
  document.addEventListener('play', tryClick, true);
})();
