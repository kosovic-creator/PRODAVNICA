"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Previously dismissed
    if (localStorage.getItem("pwa-install-dismissed") === "1") return;

    // iOS detection (Safari on iPhone/iPad)
    const ua = navigator.userAgent;
    const ios =
      /iphone|ipad|ipod/i.test(ua) &&
      !("MSStream" in window);
    if (ios) {
      setIsIOS(true);
      setShow(true);
      return;
    }

    // Chrome / Edge / Android: beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
    if (outcome === "accepted") {
      localStorage.setItem("pwa-install-dismissed", "1");
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-install-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm shadow-xl rounded-xl bg-gray-900 text-white px-4 py-3 flex items-center gap-3 border border-gray-700">
      {/* Icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon-192x192.png"
        alt="App icon"
        className="w-10 h-10 rounded-lg shrink-0"
      />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">Prodavnica</p>
        {isIOS ? (
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">
            Tap <span className="font-medium text-white">Share</span> →{" "}
            <span className="font-medium text-white">Add to Home Screen</span>
          </p>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">
            Instaliraj aplikaciju na uređaj
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-gray-900 px-3 py-1.5 rounded-lg transition-colors"
          >
            Instaliraj
          </button>
        )}
        <button
          onClick={handleDismiss}
          aria-label="Zatvori"
          className="text-gray-500 hover:text-white transition-colors p-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
