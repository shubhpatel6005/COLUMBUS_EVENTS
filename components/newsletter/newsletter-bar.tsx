"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { NewsletterSignup } from "./newsletter-signup";

const DISMISS_KEY = "columbus-events-newsletter-bar-dismissed";
const DISMISS_EVENT = "columbus-events-newsletter-bar-dismissed-change";
const HEIGHT_VAR = "--newsletter-bar-height";

function subscribe(callback: () => void) {
  window.addEventListener(DISMISS_EVENT, callback);
  return () => window.removeEventListener(DISMISS_EVENT, callback);
}

function getSnapshot() {
  return window.localStorage.getItem(DISMISS_KEY) === "1";
}

function getServerSnapshot() {
  return true;
}

export function NewsletterBar() {
  const dismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = barRef.current;
    if (dismissed || !node) {
      document.documentElement.style.setProperty(HEIGHT_VAR, "0px");
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        HEIGHT_VAR,
        `${entry.contentRect.height}px`,
      );
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty(HEIGHT_VAR, "0px");
    };
  }, [dismissed]);

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }

  if (dismissed) return null;

  return (
    <div
      ref={barRef}
      role="region"
      aria-label="Newsletter signup"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">
          Get notified about upcoming Columbus events.
        </p>
        <div className="flex items-start gap-2">
          <NewsletterSignup />
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
