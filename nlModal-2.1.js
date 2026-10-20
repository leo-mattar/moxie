// --- NEWSLETTER MODAL + MAILCHIMP SIGNUP (v2.1)
(function () {
  // ---------- CONFIG ----------
  const CONFIG = {
    modal: ".c-modal-newsletter",
    close: ".c-modal-close",
    openClass: "is-open",
    delayMs: 10000, // show after 10s
    reshowDays: 7, // re-show after 7 days if dismissed
    subscribedDays: 365, // hide for a year after successful signup
    form: ".c-form.newsletter",
    success: ".c-form-success",
    error: ".c-form-error", // optional element for error text
    btnText: ".c-btn .t-body-4",
  };

  const KEY_SHOWN = "newsletterLastShown";
  const KEY_SUBSCRIBED = "newsletterSubscribed";
  const DAY = 24 * 60 * 60 * 1000;

  // Safe storage (private mode / blocked storage won't break the page)
  const store = {
    get(k) {
      try { return localStorage.getItem(k); } catch (e) { return null; }
    },
    set(k, v) {
      try { localStorage.setItem(k, v); } catch (e) {}
    },
  };

  const lenisStop = () => window.lenis && window.lenis.stop();
  const lenisStart = () => window.lenis && window.lenis.start();

  // ---------- MODAL ----------
  function initModal() {
    const modal = document.querySelector(CONFIG.modal);
    if (!modal) return;

    const closeBtn = modal.querySelector(CONFIG.close);
    let isOpen = false;
    let lastFocus = null;

    function withinDays(key, days) {
      const t = parseInt(store.get(key), 10);
      return !isNaN(t) && Date.now() - t < days * DAY;
    }

    function shouldShow() {
      if (withinDays(KEY_SUBSCRIBED, CONFIG.subscribedDays)) return false;
      if (withinDays(KEY_SHOWN, CONFIG.reshowDays)) return false;
      return true;
    }

    function open() {
      if (isOpen) return;
      isOpen = true;
      lastFocus = document.activeElement;
      modal.classList.add(CONFIG.openClass);
      modal.setAttribute("aria-hidden", "false");
      store.set(KEY_SHOWN, Date.now());
      lenisStop();
      const firstInput = modal.querySelector("input:not([type=hidden])");
      if (firstInput) setTimeout(() => firstInput.focus({ preventScroll: true }), 50);
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      modal.classList.remove(CONFIG.openClass);
      modal.setAttribute("aria-hidden", "true");
      store.set(KEY_SHOWN, Date.now()); // dismissal restarts the timer
      lenisStart();
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");

    if (closeBtn) closeBtn.addEventListener("click", close);

    // Click on the backdrop (the modal wrapper itself, not its content)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // Optional manual triggers anywhere on the page: <a nl-modal-open>
    document.querySelectorAll("[nl-modal-open]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        open();
      })
    );

    if (shouldShow()) setTimeout(open, CONFIG.delayMs);

    window.nlModal = { open, close };
  }

  // ---------- MAILCHIMP (JSONP) ----------
  function toJsonpUrl(action) {
    // Mailchimp needs /post-json for cross-origin requests
    return action.replace("/post?", "/post-json?").replace(/&c=\?$/, "");
  }

  function initForm() {
    const form = document.querySelector(CONFIG.form);
    if (!form || !window.jQuery) return;

    const btnText = form.querySelector(CONFIG.btnText);
    const submitBtn = form.querySelector('[type="submit"]');
    const successEl = document.querySelector(CONFIG.success);
    const errorEl = document.querySelector(CONFIG.error);
    const defaultText = btnText ? btnText.textContent : "";
    let busy = false;

    function setBtn(text, disabled) {
      if (btnText) btnText.textContent = text;
      if (submitBtn) submitBtn.disabled = disabled;
    }

    function showError(msg) {
      setBtn(defaultText, false);
      if (errorEl) {
        // Mailchimp messages sometimes start with "0 - "
        errorEl.innerHTML = (msg || "Something went wrong. Please try again.").replace(/^\d+\s-\s/, "");
        errorEl.style.display = "block";
      }
    }

    // Listen on submit so Enter key works too
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // stop Webflow's own form handler
      if (busy) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      busy = true;
      if (errorEl) errorEl.style.display = "none";
      setBtn("Submitting...", true);

      window.jQuery.ajax({
        url: toJsonpUrl(form.getAttribute("action")),
        data: window.jQuery(form).serialize(),
        dataType: "jsonp",
        jsonp: "c",
        cache: false,
        timeout: 15000,
      })
        .done((res) => {
          if (res && res.result === "success") {
            form.style.display = "none";
            if (successEl) successEl.style.display = "flex";
            store.set(KEY_SUBSCRIBED, Date.now());
          } else {
            showError(res && res.msg);
          }
        })
        .fail(() => showError())
        .always(() => {
          busy = false;
        });
    }, true);
  }

  // ---------- INIT ----------
  function init() {
    initModal();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
