"use client";
import { useEffect } from "react";

/**
 * FocusLogger (client)
 * - listens for focusin and scroll events in the browser
 * - posts concise event info to /api/client-log so the server logs it in your terminal
 * - debounced to avoid spamming the server
 */

function postLog(payload) {
  // best-effort: fire-and-forget
  try {
    navigator.sendBeacon
      ? navigator.sendBeacon("/api/client-log", JSON.stringify(payload))
      : fetch("/api/client-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  } catch (e) {
    // ignore network errors
  }
}

export default function FocusLogger() {
  useEffect(() => {
    let lastScroll = -1;
    let lastFocus = null;
    let scrollTimer = null;
    let focusTimer = null;

    const onScroll = () => {
      if (window.scrollY === lastScroll) return;
      lastScroll = window.scrollY;
      // throttle to one post per 200ms
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        postLog({
          kind: "scroll",
          scrollY: window.scrollY,
          time: Date.now(),
          activeTag: document.activeElement?.tagName || null,
          activeId: document.activeElement?.id || null,
        });
      }, 150);
    };

    const onFocusIn = (e) => {
      // throttle similar to scroll
      if (focusTimer) clearTimeout(focusTimer);
      focusTimer = setTimeout(() => {
        postLog({
          kind: "focusin",
          tag: e.target?.tagName || null,
          id: e.target?.id || null,
          classes: e.target?.className || null,
          innerText: (e.target && e.target.innerText && e.target.innerText.slice(0,60)) || null,
          time: Date.now(),
        });
      }, 50);
    };

    // monkey-patch scrollIntoView to catch calls
    const origScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (...args) {
      postLog({
        kind: "scrollIntoView",
        elTag: this.tagName,
        elId: this.id || null,
        args,
        time: Date.now(),
      });
      return origScrollIntoView.apply(this, args);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("focusin", onFocusIn, true);

    // initial report
    postLog({
      kind: "init",
      scrollY: window.scrollY,
      activeElement: {
        tag: document.activeElement?.tagName || null,
        id: document.activeElement?.id || null,
        classes: document.activeElement?.className || null,
      },
      time: Date.now(),
    });

    return () => {
      window.removeEventListener("scroll", onScroll, { passive: true });
      window.removeEventListener("focusin", onFocusIn, true);
      Element.prototype.scrollIntoView = origScrollIntoView;
      if (scrollTimer) clearTimeout(scrollTimer);
      if (focusTimer) clearTimeout(focusTimer);
    };
  }, []);

  return null; // invisible helper
}
